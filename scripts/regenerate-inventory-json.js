import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const EXCEL_PATH = 'attached_assets/Akoya-Oxygen-2023-Arslan-only_1767877172288.xlsx';
const OUTPUT_DIR = 'src/data/damacHills2';

const COLUMN_MAPPING = {
  'P-NUMBER': 'pNumber',
  'AREA': 'area',
  'PROJECT': 'project',
  'PLOT NUMBER': 'plotNumber',
  'NAME ': 'ownerName',
  'NAME': 'ownerName',
  'PHONE': 'phone',
  'EMAIL': 'email',
  'MOBILE': 'mobile',
  'SECONDARY MOBILE': 'secondaryMobile',
  'View': 'view',
  'Building': 'building',
  'Unit Number': 'unitNumber',
  'Layout': 'layout',
  'Status': 'status',
  'Asking Price': 'askingPrice',
  'SD': 'sd',
  'Plot No': 'plotNo',
  'Registration': 'registration',
  'Floor': 'floor',
  'Rooms': 'rooms',
  'Actual Area': 'actualArea',
  'Municipality no ': 'municipalityNo',
  'Municipality no': 'municipalityNo',
  'OTP ( Dubai REST )': 'otp',
  'Date of Birth': 'dateOfBirth',
  'DEWA Premise Number': 'dewaPremiseNumber',
  'Mastre project ': 'masterProject',
  'Master project': 'masterProject'
};

function normalizePhone(phone) {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[^0-9+]/g, '');
  return cleaned.length >= 7 ? cleaned : null;
}

function normalizeEmail(email) {
  if (!email) return null;
  const trimmed = String(email).trim().toLowerCase();
  return trimmed.includes('@') ? trimmed : null;
}

function generateOwnerId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function extractCluster(project, area) {
  const text = (project || area || '').toUpperCase();
  const clusters = ['ASTER', 'JUNIPER', 'COURSETIA', 'CLARET', 'ODORA', 'BASSWOOD', 'AMARGO', 'MIMOSA', 
    'AVENCIA', 'VICTORIA', 'JANUSIA', 'ALBIZIA', 'SYM', 'ZINNIA', 'ACUNA', 'PRIMROSE', 'SYCAMORE',
    'TRIXIS', 'AMAZONIA', 'CENTAURY', 'PACIFICA', 'SANCTNARY', 'VIRIDIS', 'MULBERRY', 'HAWTHORN',
    'NAVITAS', 'VARDON', 'AQUILEGIA'];
  for (const cluster of clusters) {
    if (text.includes(cluster)) return cluster;
  }
  return text.split(/[\s-]/)[0] || '.';
}

function parseRow(row, headers) {
  const data = {};
  headers.forEach((header, index) => {
    const headerStr = String(header || '').trim();
    const mappedKey = COLUMN_MAPPING[headerStr] || COLUMN_MAPPING[header];
    if (mappedKey && row[index] !== undefined && row[index] !== '') {
      data[mappedKey] = row[index];
    }
  });
  return data;
}

async function regenerateJSON() {
  console.log('Reading Excel file...');
  const workbook = XLSX.readFile(EXCEL_PATH);
  
  const propertiesById = {};
  const ownersById = {};
  const propertyToOwners = {};
  const ownerToProperties = {};
  const uniqueValues = {
    layouts: new Set(),
    statuses: new Set(),
    views: new Set(),
    clusters: new Set(),
    floors: new Set(),
    rooms: new Set(),
    areas: new Set(),
    masterProjects: new Set()
  };
  
  const sheets = [];
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    if (rawData.length < 2) continue;
    
    const headers = rawData[0];
    const rows = rawData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
    
    const cluster = extractCluster(sheetName, '');
    sheets.push({
      id: sheetName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: sheetName,
      cluster: cluster !== '.' ? cluster : null,
      propertyCount: rows.length,
      isFiltered: cluster !== '.'
    });
    
    for (const row of rows) {
      const data = parseRow(row, headers);
      if (!data.pNumber && !data.plotNumber) continue;
      
      const pNumber = String(data.pNumber || `${data.area}-${data.plotNumber}`);
      const projectCluster = extractCluster(data.project, data.area);
      
      if (!propertiesById[pNumber]) {
        propertiesById[pNumber] = {
          pNumber,
          area: data.area || '',
          project: data.project || '',
          cluster: projectCluster,
          plotNumber: data.plotNumber || '',
          view: data.view || '',
          building: data.building || '',
          unitNumber: String(data.unitNumber || ''),
          layout: data.layout || '',
          status: data.status || '',
          askingPrice: data.askingPrice ? parseFloat(data.askingPrice) : 0,
          sd: data.sd || '',
          plotNo: data.plotNo || '',
          registration: data.registration || '',
          floor: data.floor || '',
          rooms: data.rooms || '',
          actualArea: data.actualArea || '',
          municipalityNo: data.municipalityNo || '',
          otp: data.otp || '',
          dewaPremiseNumber: data.dewaPremiseNumber || '',
          masterProject: data.masterProject || '',
          owners: []
        };
        propertyToOwners[pNumber] = [];
      }
      
      if (data.layout) uniqueValues.layouts.add(data.layout);
      if (data.status) uniqueValues.statuses.add(data.status);
      if (data.view) uniqueValues.views.add(data.view);
      if (projectCluster) uniqueValues.clusters.add(projectCluster);
      if (data.floor) uniqueValues.floors.add(String(data.floor));
      if (data.rooms) uniqueValues.rooms.add(String(data.rooms));
      if (data.area) uniqueValues.areas.add(data.area);
      if (data.masterProject) uniqueValues.masterProjects.add(data.masterProject);
      
      if (data.ownerName) {
        const ownerId = generateOwnerId(data.ownerName);
        
        if (!ownersById[ownerId]) {
          ownersById[ownerId] = {
            id: ownerId,
            name: data.ownerName,
            dateOfBirth: data.dateOfBirth || '',
            contacts: [],
            properties: []
          };
          ownerToProperties[ownerId] = [];
        }
        
        const owner = ownersById[ownerId];
        
        if (data.mobile) {
          const phone = normalizePhone(data.mobile);
          if (phone && !owner.contacts.some(c => c.value === phone)) {
            owner.contacts.push({ type: 'mobile', value: phone, isPrimary: owner.contacts.length === 0 });
          }
        }
        if (data.phone) {
          const phone = normalizePhone(data.phone);
          if (phone && !owner.contacts.some(c => c.value === phone)) {
            owner.contacts.push({ type: 'phone', value: phone, isPrimary: owner.contacts.length === 0 });
          }
        }
        if (data.secondaryMobile) {
          const phone = normalizePhone(data.secondaryMobile);
          if (phone && !owner.contacts.some(c => c.value === phone)) {
            owner.contacts.push({ type: 'secondaryMobile', value: phone, isPrimary: false });
          }
        }
        if (data.email) {
          const email = normalizeEmail(data.email);
          if (email && !owner.contacts.some(c => c.value === email)) {
            owner.contacts.push({ type: 'email', value: email });
          }
        }
        
        if (!propertiesById[pNumber].owners.includes(ownerId)) {
          propertiesById[pNumber].owners.push(ownerId);
          propertyToOwners[pNumber].push(ownerId);
        }
        if (!ownerToProperties[ownerId].includes(pNumber)) {
          ownerToProperties[ownerId].push(pNumber);
          owner.properties.push(pNumber);
        }
      }
    }
  }
  
  const propertiesArray = Object.values(propertiesById);
  const ownersArray = Object.values(ownersById);
  
  const multiOwnerCount = propertiesArray.filter(p => p.owners.length > 1).length;
  const multiPropertyOwners = ownersArray.filter(o => o.properties.length > 1).length;
  const multiPhoneOwners = ownersArray.filter(o => {
    const phones = o.contacts.filter(c => ['mobile', 'phone', 'secondaryMobile'].includes(c.type));
    return phones.length > 1;
  }).length;
  
  const manifest = {
    sheets,
    clusters: Array.from(uniqueValues.clusters).sort(),
    filterOptions: {
      layouts: Array.from(uniqueValues.layouts).sort(),
      statuses: Array.from(uniqueValues.statuses).sort(),
      views: Array.from(uniqueValues.views).sort(),
      floors: Array.from(uniqueValues.floors).sort((a, b) => parseInt(a) - parseInt(b)),
      rooms: Array.from(uniqueValues.rooms).sort(),
      areas: Array.from(uniqueValues.areas).sort(),
      masterProjects: Array.from(uniqueValues.masterProjects).sort()
    },
    stats: {
      totalProperties: propertiesArray.length,
      totalOwners: ownersArray.length,
      multiOwnerProperties: multiOwnerCount,
      ownersWithMultipleProperties: multiPropertyOwners,
      ownersWithMultiplePhones: multiPhoneOwners
    },
    columns: [
      { key: 'pNumber', label: 'P-Number', type: 'text', filterable: true },
      { key: 'area', label: 'Area', type: 'text', filterable: true },
      { key: 'project', label: 'Project', type: 'text', filterable: true },
      { key: 'cluster', label: 'Cluster', type: 'dropdown', filterable: true },
      { key: 'plotNumber', label: 'Plot Number', type: 'text', filterable: true },
      { key: 'view', label: 'View', type: 'dropdown', filterable: true },
      { key: 'building', label: 'Building', type: 'text', filterable: true },
      { key: 'unitNumber', label: 'Unit Number', type: 'text', filterable: true },
      { key: 'layout', label: 'Layout', type: 'dropdown', filterable: true },
      { key: 'status', label: 'Status', type: 'dropdown', filterable: true },
      { key: 'askingPrice', label: 'Asking Price', type: 'currency', filterable: true },
      { key: 'sd', label: 'SD', type: 'text', filterable: false },
      { key: 'plotNo', label: 'Plot No', type: 'text', filterable: false },
      { key: 'registration', label: 'Registration', type: 'text', filterable: false },
      { key: 'floor', label: 'Floor', type: 'dropdown', filterable: true },
      { key: 'rooms', label: 'Rooms', type: 'dropdown', filterable: true },
      { key: 'actualArea', label: 'Actual Area', type: 'text', filterable: true },
      { key: 'municipalityNo', label: 'Municipality No', type: 'text', filterable: false },
      { key: 'otp', label: 'OTP (Dubai REST)', type: 'text', filterable: false },
      { key: 'dewaPremiseNumber', label: 'DEWA Premise', type: 'text', filterable: false },
      { key: 'masterProject', label: 'Master Project', type: 'dropdown', filterable: true }
    ],
    generatedAt: new Date().toISOString()
  };
  
  console.log('Writing JSON files...');
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'properties.json'),
    JSON.stringify(propertiesArray, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'owners.json'),
    JSON.stringify(ownersArray, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'ownerships.json'),
    JSON.stringify({ propertyToOwners, ownerToProperties }, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`\nGenerated:
  - ${propertiesArray.length} properties
  - ${ownersArray.length} owners
  - ${manifest.filterOptions.layouts.length} unique layouts
  - ${manifest.filterOptions.statuses.length} unique statuses  
  - ${manifest.filterOptions.views.length} unique views
  - ${manifest.clusters.length} clusters`);
}

regenerateJSON().catch(console.error);
