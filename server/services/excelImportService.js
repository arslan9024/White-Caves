import fs from 'fs';
import * as XLSX from '../../modules/linda/node_modules/xlsx/xlsx.mjs';

export const COLUMN_MAPPING = {
  'P-NUMBER': 'pNumber',
  PNUMBER: 'pNumber',
  'P NUMBER': 'pNumber',
  AREA: 'area',
  PROJECT: 'project',
  'PLOT NUMBER': 'plotNumber',
  PLOTNUMBER: 'plotNumber',
  Building: 'building',
  BUILDING: 'building',
  'Unit Number': 'unitNumber',
  'UNIT NUMBER': 'unitNumber',
  UNITNUMBER: 'unitNumber',
  Floor: 'floor',
  FLOOR: 'floor',
  Layout: 'layout',
  LAYOUT: 'layout',
  Rooms: 'rooms',
  ROOMS: 'rooms',
  'ACTUAL AREA': 'actualArea',
  ACTUALAREA: 'actualArea',
  'VIEW TYPE': 'viewType',
  VIEWTYPE: 'viewType',
  'Asking Price': 'askingPrice',
  'ASKING PRICE': 'askingPrice',
  ASKINGPRICE: 'askingPrice',
  REGISTRATION: 'registration',
  'MUNICIPALITY NO': 'municipalityNo',
  MUNICIPALITYNO: 'municipalityNo',
  'DEWA PREMISE NUMBER': 'dewaPremiseNumber',
  DEWAPREMISENUMBER: 'dewaPremiseNumber',
  'OTP DUBAI REST': 'otpDubaiRest',
  OTPDUBAIREST: 'otpDubaiRest',
  STATUS: 'status',
  NAME: 'ownerName',
  'OWNER NAME': 'ownerName',
  OWNERNAME: 'ownerName',
  NATIONALITY: 'nationality',
  'EMIRATES ID': 'emiratesId',
  EMIRATESID: 'emiratesId',
  'PASSPORT NUMBER': 'passportNumber',
  PASSPORTNUMBER: 'passportNumber',
  'DATE OF BIRTH': 'dateOfBirth',
  DATEOFBIRTH: 'dateOfBirth',
  Mobile: 'mobile',
  MOBILE: 'mobile',
  Phone: 'phone',
  PHONE: 'phone',
  'SECONDARY MOBILE': 'secondaryMobile',
  SECONDARYMOBILE: 'secondaryMobile',
  Email: 'email',
  EMAIL: 'email',
};

export const STATUS_MAPPING = {
  RENTED: 'rented',
  Rented: 'rented',
  rented: 'rented',
  OCCUPIED: 'rented',
  Occupied: 'rented',
  AVAILABLE: 'available',
  Available: 'available',
  available: 'available',
  Vacant: 'available',
  VACANT: 'available',
  SOLD: 'sold',
  Sold: 'sold',
  RESERVED: 'reserved',
  Reserved: 'reserved',
};

function normalizeHeader(header) {
  return String(header || '')
    .trim()
    .replace(/[\s_-]+/g, ' ')
    .toUpperCase();
}

function resolveMappedField(header) {
  const normalized = normalizeHeader(header);
  return (
    COLUMN_MAPPING[header] ||
    COLUMN_MAPPING[normalized] ||
    COLUMN_MAPPING[normalized.replace(/\s+/g, '')] ||
    null
  );
}

function normalizeRow(rawRow) {
  const normalizedRow = {};

  for (const [header, value] of Object.entries(rawRow || {})) {
    const mappedField = resolveMappedField(header);
    if (!mappedField) continue;
    normalizedRow[mappedField] = value;
  }

  if (normalizedRow.status && STATUS_MAPPING[normalizedRow.status]) {
    normalizedRow.status = STATUS_MAPPING[normalizedRow.status];
  }

  return normalizedRow;
}

function buildIdentityColumnMapping(rows) {
  const mapping = {};

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!mapping[key]) {
        mapping[key] = key;
      }
    }
  }

  return mapping;
}

export async function parseExcelFile(filePath, options = {}) {
  const { sheetName, previewLimit = 20 } = options;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Import file not found: ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
  const sheets = workbook.SheetNames || [];

  if (sheets.length === 0) {
    throw new Error('Import file does not contain any worksheets');
  }

  const selectedSheet = sheetName && sheets.includes(sheetName) ? sheetName : sheets[0];
  const worksheet = workbook.Sheets[selectedSheet];

  if (!worksheet) {
    throw new Error(`Worksheet not found: ${selectedSheet}`);
  }

  const rawHeaders = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })[0] || [];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: false,
    blankrows: false,
  });

  const data = rawRows.map(normalizeRow);
  const preview = data.slice(0, previewLimit);
  const columnMapping = buildIdentityColumnMapping(data);

  return {
    sheets,
    sheetName: selectedSheet,
    headers: rawHeaders,
    data,
    preview,
    totalRows: data.length,
    columnMapping,
  };
}

export async function getAllSheetData(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });

  return workbook.SheetNames.map(name => ({
    sheetName: name,
    rows: XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '', raw: false }),
  }));
}

export async function validateData(rows = []) {
  return {
    totalRows: rows.length,
    validRows: rows.filter(Boolean).length,
    invalidRows: 0,
  };
}

export async function importData(rows = []) {
  return {
    imported: rows.length,
    skipped: 0,
  };
}

export default {
  COLUMN_MAPPING,
  STATUS_MAPPING,
  parseExcelFile,
  getAllSheetData,
  validateData,
  importData,
};
