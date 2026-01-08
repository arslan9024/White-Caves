import XLSX from 'xlsx';
import crypto from 'crypto';
import Owner from '../models/Owner.js';
import InventoryProperty from '../models/InventoryProperty.js';
import ImportSession from '../models/ImportSession.js';

export const COLUMN_MAPPING = {
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
  'View': 'viewType',
  'Building': 'building',
  'Unit Number': 'unitNumber',
  'Layout': 'layout',
  'Status': 'status',
  'Asking Price': 'askingPrice',
  'SD': 'sdNumber',
  'Plot No': 'plotNo',
  'Registration': 'registration',
  'Floor': 'floor',
  'Rooms': 'rooms',
  'Actual Area': 'actualArea',
  'Municipality no ': 'municipalityNo',
  'Municipality no': 'municipalityNo',
  'OTP ( Dubai REST )': 'otpDubaiRest',
  'Date of Birth': 'dateOfBirth',
  'DEWA Premise Number': 'dewaPremiseNumber',
  'Mastre project ': 'masterProject',
  'Master project': 'masterProject'
};

export const STATUS_MAPPING = {
  'Rented': 'rented',
  'RENTED': 'rented',
  'Available': 'available',
  'AVAILABLE': 'available',
  'Sold': 'sold',
  'SOLD': 'sold',
  'Reserved': 'reserved',
  'RESERVED': 'reserved',
  'Vacant': 'available',
  'VACANT': 'available',
  'Occupied': 'rented',
  'OCCUPIED': 'rented'
};

function normalizePhone(phone) {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[^0-9+]/g, '');
  if (cleaned.length < 7) return null;
  return cleaned;
}

function normalizeEmail(email) {
  if (!email) return null;
  const trimmed = String(email).trim().toLowerCase();
  if (!trimmed.includes('@')) return null;
  return trimmed;
}

function parseRow(row, headers) {
  const data = {};
  headers.forEach((header, index) => {
    const mappedKey = COLUMN_MAPPING[header] || COLUMN_MAPPING[header?.trim()];
    if (mappedKey && row[index] !== undefined && row[index] !== '') {
      data[mappedKey] = row[index];
    }
  });
  return data;
}

function buildContacts(data) {
  const contacts = [];
  
  if (data.mobile) {
    const normalized = normalizePhone(data.mobile);
    if (normalized) {
      contacts.push({ type: 'mobile', value: normalized, isPrimary: true });
    }
  }
  
  if (data.phone) {
    const normalized = normalizePhone(data.phone);
    if (normalized && !contacts.some(c => c.value === normalized)) {
      contacts.push({ type: 'phone', value: normalized, isPrimary: contacts.length === 0 });
    }
  }
  
  if (data.secondaryMobile) {
    const normalized = normalizePhone(data.secondaryMobile);
    if (normalized && !contacts.some(c => c.value === normalized)) {
      contacts.push({ type: 'mobile', value: normalized, isPrimary: false, label: 'Secondary' });
    }
  }
  
  if (data.email) {
    const normalized = normalizeEmail(data.email);
    if (normalized) {
      contacts.push({ type: 'email', value: normalized, isPrimary: true });
    }
  }
  
  return contacts;
}

export async function parseExcelFile(filePath, options = {}) {
  const { sheetName, limit } = options;
  const workbook = XLSX.readFile(filePath);
  
  const targetSheet = sheetName || workbook.SheetNames[0];
  if (!workbook.Sheets[targetSheet]) {
    throw new Error(`Sheet "${targetSheet}" not found`);
  }
  
  const sheet = workbook.Sheets[targetSheet];
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  if (rawData.length < 2) {
    return { headers: [], rows: [], sheetNames: workbook.SheetNames };
  }
  
  const headers = rawData[0];
  let rows = rawData.slice(1);
  
  if (limit) {
    rows = rows.slice(0, limit);
  }
  
  const parsedRows = rows
    .filter(row => row.some(cell => cell !== undefined && cell !== ''))
    .map((row, index) => ({
      rowNumber: index + 2,
      ...parseRow(row, headers)
    }));
  
  return {
    headers,
    rows: parsedRows,
    sheetNames: workbook.SheetNames,
    totalRows: rawData.length - 1
  };
}

export async function validateData(rows) {
  const errors = [];
  const warnings = [];
  
  rows.forEach((row, index) => {
    if (!row.ownerName) {
      errors.push({ row: row.rowNumber, field: 'ownerName', message: 'Owner name is required' });
    }
    if (!row.area && !row.project) {
      errors.push({ row: row.rowNumber, field: 'area', message: 'Area or project is required' });
    }
  });
  
  return { errors, warnings, isValid: errors.length === 0 };
}

export async function importData(rows, sessionId, options = {}) {
  const { dryRun = false, batchSize = 100 } = options;
  const session = await ImportSession.findById(sessionId);
  
  if (!session) {
    throw new Error('Import session not found');
  }
  
  session.status = 'processing';
  session.startedAt = new Date();
  await session.save();
  
  const stats = {
    propertiesCreated: 0,
    propertiesUpdated: 0,
    ownersCreated: 0,
    ownersUpdated: 0,
    duplicatesFound: 0,
    errors: []
  };
  
  const propertyMap = new Map();
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    try {
      const pNumberKey = row.pNumber ? String(row.pNumber) : `${row.area}-${row.plotNumber}-${row.unitNumber}`;
      
      if (propertyMap.has(pNumberKey)) {
        const existingOwners = propertyMap.get(pNumberKey).owners;
        if (row.ownerName && !existingOwners.includes(row.ownerName)) {
          existingOwners.push(row.ownerName);
          propertyMap.get(pNumberKey).contacts.push(...buildContacts(row));
        }
        stats.duplicatesFound++;
        continue;
      }
      
      propertyMap.set(pNumberKey, {
        ...row,
        owners: [row.ownerName],
        contacts: buildContacts(row)
      });
      
    } catch (err) {
      stats.errors.push({ row: row.rowNumber, message: err.message });
    }
    
    if ((i + 1) % batchSize === 0) {
      session.processedRows = i + 1;
      await session.save();
    }
  }
  
  if (dryRun) {
    session.status = 'completed';
    session.processedRows = rows.length;
    session.propertiesCreated = propertyMap.size;
    session.duplicatesFound = stats.duplicatesFound;
    session.completedAt = new Date();
    await session.save();
    
    return {
      ...stats,
      propertiesCreated: propertyMap.size,
      preview: Array.from(propertyMap.values()).slice(0, 20)
    };
  }
  
  for (const [key, propData] of propertyMap) {
    try {
      const ownerIds = [];
      
      for (let i = 0; i < propData.owners.length; i++) {
        const ownerName = propData.owners[i];
        if (!ownerName) continue;
        
        const ownerContacts = propData.contacts.filter((_, idx) => 
          Math.floor(idx / 4) === i || propData.owners.length === 1
        );
        
        const { owner, isNew } = await Owner.findOrCreateByNameAndContact(
          ownerName,
          ownerContacts.length > 0 ? ownerContacts : [],
          sessionId
        );
        
        ownerIds.push(owner._id);
        if (isNew) stats.ownersCreated++;
        else stats.ownersUpdated++;
      }
      
      let property = await InventoryProperty.findOne({
        $or: [
          { pNumber: String(propData.pNumber) },
          { area: propData.area, plotNumber: propData.plotNumber, unitNumber: propData.unitNumber }
        ]
      });
      
      const propertyData = {
        pNumber: String(propData.pNumber || ''),
        area: propData.area || 'DAMAC Hills 2',
        project: propData.project || '',
        masterProject: propData.masterProject || '',
        plotNumber: propData.plotNumber || '',
        building: propData.building || '',
        unitNumber: String(propData.unitNumber || ''),
        floor: propData.floor ? parseInt(propData.floor) : null,
        layout: propData.layout || '',
        viewType: propData.viewType || '',
        rooms: propData.rooms ? parseInt(propData.rooms) : null,
        actualArea: propData.actualArea ? parseFloat(propData.actualArea) : null,
        status: STATUS_MAPPING[propData.status] || 'available',
        askingPrice: propData.askingPrice ? parseFloat(propData.askingPrice) : null,
        registration: propData.registration || '',
        municipalityNo: propData.municipalityNo ? String(propData.municipalityNo) : '',
        dewaPremiseNumber: propData.dewaPremiseNumber || '',
        otpDubaiRest: propData.otpDubaiRest || '',
        sdNumber: propData.sdNumber || '',
        owners: ownerIds,
        primaryOwner: ownerIds[0],
        source: 'excel_import',
        sourceFileId: sessionId,
        importBatch: sessionId
      };
      
      if (property) {
        Object.assign(property, propertyData);
        const existingOwnerIds = property.owners.map(id => id.toString());
        ownerIds.forEach(id => {
          if (!existingOwnerIds.includes(id.toString())) {
            property.owners.push(id);
          }
        });
        await property.save();
        stats.propertiesUpdated++;
      } else {
        property = new InventoryProperty(propertyData);
        await property.save();
        stats.propertiesCreated++;
      }
      
      for (const ownerId of ownerIds) {
        await Owner.findByIdAndUpdate(ownerId, {
          $addToSet: { properties: property._id }
        });
      }
      
    } catch (err) {
      stats.errors.push({ row: propData.rowNumber, message: err.message, data: propData });
    }
  }
  
  session.status = 'completed';
  session.processedRows = rows.length;
  session.propertiesCreated = stats.propertiesCreated;
  session.propertiesUpdated = stats.propertiesUpdated;
  session.ownersCreated = stats.ownersCreated;
  session.ownersUpdated = stats.ownersUpdated;
  session.duplicatesFound = stats.duplicatesFound;
  session.errorsCount = stats.errors.length;
  session.importErrors = stats.errors.slice(0, 100);
  session.completedAt = new Date();
  await session.save();
  
  return stats;
}

export async function getAllSheetData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const allRows = [];
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    if (rawData.length < 2) continue;
    
    const headers = rawData[0];
    const rows = rawData.slice(1)
      .filter(row => row.some(cell => cell !== undefined && cell !== ''))
      .map((row, index) => ({
        rowNumber: index + 2,
        sheetName,
        ...parseRow(row, headers)
      }));
    
    allRows.push(...rows);
  }
  
  return allRows;
}
