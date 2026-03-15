import XLSX from 'xlsx';
import crypto from 'crypto';
import Owner from '../models/Owner.js';
import InventoryProperty from '../models/InventoryProperty.js';
import ImportSession from '../models/ImportSession.js';

// Column mapping types
interface ColumnMappingType {
  [key: string]: string;
}

interface ParsedRowData {
  rowNumber: number;
  sheetName?: string;
  pNumber?: string;
  area?: string;
  project?: string;
  plotNumber?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  mobile?: string;
  secondaryMobile?: string;
  viewType?: string;
  building?: string;
  unitNumber?: string;
  layout?: string;
  status?: string;
  askingPrice?: string | number;
  sdNumber?: string;
  plotNo?: string;
  registration?: string;
  floor?: string | number;
  rooms?: string | number;
  actualArea?: string | number;
  municipalityNo?: string;
  otpDubaiRest?: string;
  dateOfBirth?: string;
  dewaPremiseNumber?: string;
  masterProject?: string;
}

interface Contact {
  type: 'mobile' | 'phone' | 'email';
  value: string;
  isPrimary: boolean;
  label?: string;
}

interface ParseExcelOptions {
  sheetName?: string;
  limit?: number;
}

interface ParseExcelResult {
  headers: unknown[];
  rows: ParsedRowData[];
  sheetNames: string[];
  totalRows: number;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: unknown[];
  isValid: boolean;
}

interface ImportError {
  row?: number;
  message: string;
  data?: unknown;
}

interface ImportStats {
  propertiesCreated: number;
  propertiesUpdated: number;
  ownersCreated: number;
  ownersUpdated: number;
  duplicatesFound: number;
  errors: ImportError[];
}

interface ImportOptions {
  dryRun?: boolean;
  batchSize?: number;
}

interface ImportResult extends ImportStats {
  preview?: unknown[];
}

export const COLUMN_MAPPING: ColumnMappingType = {
  'P-NUMBER': 'pNumber',
  AREA: 'area',
  PROJECT: 'project',
  'PLOT NUMBER': 'plotNumber',
  'NAME ': 'ownerName',
  NAME: 'ownerName',
  PHONE: 'phone',
  EMAIL: 'email',
  MOBILE: 'mobile',
  'SECONDARY MOBILE': 'secondaryMobile',
  View: 'viewType',
  Building: 'building',
  'Unit Number': 'unitNumber',
  Layout: 'layout',
  Status: 'status',
  'Asking Price': 'askingPrice',
  SD: 'sdNumber',
  'Plot No': 'plotNo',
  Registration: 'registration',
  Floor: 'floor',
  Rooms: 'rooms',
  'Actual Area': 'actualArea',
  'Municipality no ': 'municipalityNo',
  'Municipality no': 'municipalityNo',
  'OTP ( Dubai REST )': 'otpDubaiRest',
  'Date of Birth': 'dateOfBirth',
  'DEWA Premise Number': 'dewaPremiseNumber',
  'Mastre project ': 'masterProject',
  'Master project': 'masterProject'
};

export const STATUS_MAPPING: Record<string, string> = {
  Rented: 'rented',
  RENTED: 'rented',
  Available: 'available',
  AVAILABLE: 'available',
  Sold: 'sold',
  SOLD: 'sold',
  Reserved: 'reserved',
  RESERVED: 'reserved',
  Vacant: 'available',
  VACANT: 'available',
  Occupied: 'rented',
  OCCUPIED: 'rented'
};

function normalizePhone(phone: unknown): string | null {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[^0-9+]/g, '');
  if (cleaned.length < 7) return null;
  return cleaned;
}

function normalizeEmail(email: unknown): string | null {
  if (!email) return null;
  const trimmed = String(email).trim().toLowerCase();
  if (!trimmed.includes('@')) return null;
  return trimmed;
}

function parseRow(row: unknown[], headers: unknown[]): ParsedRowData {
  const data: ParsedRowData = { rowNumber: 0 };
  (headers as string[]).forEach((header: string, index: number) => {
    const mappedKey = COLUMN_MAPPING[header] || COLUMN_MAPPING[header?.trim()];
    if (mappedKey && row[index] !== undefined && row[index] !== '') {
      (data as Record<string, unknown>)[mappedKey] = row[index];
    }
  });
  return data;
}

function buildContacts(data: ParsedRowData): Contact[] {
  const contacts: Contact[] = [];

  if (data.mobile) {
    const normalized = normalizePhone(data.mobile);
    if (normalized) {
      contacts.push({ type: 'mobile', value: normalized, isPrimary: true });
    }
  }

  if (data.phone) {
    const normalized = normalizePhone(data.phone);
    if (normalized && !contacts.some((c) => c.value === normalized)) {
      contacts.push({ type: 'phone', value: normalized, isPrimary: contacts.length === 0 });
    }
  }

  if (data.secondaryMobile) {
    const normalized = normalizePhone(data.secondaryMobile);
    if (normalized && !contacts.some((c) => c.value === normalized)) {
      contacts.push({
        type: 'mobile',
        value: normalized,
        isPrimary: false,
        label: 'Secondary'
      });
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

export async function parseExcelFile(
  filePath: string,
  options: ParseExcelOptions = {}
): Promise<ParseExcelResult> {
  const { sheetName, limit } = options;
  const workbook = XLSX.readFile(filePath);

  const targetSheet = sheetName || workbook.SheetNames[0];
  if (!workbook.Sheets[targetSheet]) {
    throw new Error(`Sheet "${targetSheet}" not found`);
  }

  const sheet = workbook.Sheets[targetSheet];
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (rawData.length < 2) {
    return { headers: [], rows: [], sheetNames: workbook.SheetNames, totalRows: 0 };
  }

  const headers = rawData[0];
  let rows = rawData.slice(1);

  if (limit) {
    rows = rows.slice(0, limit);
  }

  const parsedRows = (rows as unknown[][])
    .filter((row) => row.some((cell) => cell !== undefined && cell !== ''))
    .map((row, index) => ({
      rowNumber: index + 2,
      ...parseRow(row, headers as unknown[])
    }));

  return {
    headers,
    rows: parsedRows,
    sheetNames: workbook.SheetNames,
    totalRows: rawData.length - 1
  };
}

export async function validateData(rows: ParsedRowData[]): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: unknown[] = [];

  rows.forEach((row) => {
    if (!row.ownerName) {
      errors.push({ row: row.rowNumber, field: 'ownerName', message: 'Owner name is required' });
    }
    if (!row.area && !row.project) {
      errors.push({ row: row.rowNumber, field: 'area', message: 'Area or project is required' });
    }
  });

  return { errors, warnings, isValid: errors.length === 0 };
}

export async function importData(
  rows: ParsedRowData[],
  sessionId: string,
  options: ImportOptions = {}
): Promise<ImportStats> {
  const { dryRun = false, batchSize = 100 } = options;
  const session = await ImportSession.findById(sessionId);

  if (!session) {
    throw new Error('Import session not found');
  }

  (session as Record<string, unknown>).status = 'processing';
  (session as Record<string, unknown>).startedAt = new Date();
  await session.save();

  const stats: ImportStats = {
    propertiesCreated: 0,
    propertiesUpdated: 0,
    ownersCreated: 0,
    ownersUpdated: 0,
    duplicatesFound: 0,
    errors: []
  };

  const propertyMap = new Map<
    string,
    ParsedRowData & { owners: string[]; contacts: Contact[] }
  >();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      const pNumberKey = row.pNumber
        ? String(row.pNumber)
        : `${row.area}-${row.plotNumber}-${row.unitNumber}`;

      if (propertyMap.has(pNumberKey)) {
        const existingProperty = propertyMap.get(pNumberKey);
        if (existingProperty && row.ownerName && !existingProperty.owners.includes(row.ownerName)) {
          existingProperty.owners.push(row.ownerName);
          existingProperty.contacts.push(...buildContacts(row));
        }
        stats.duplicatesFound++;
        continue;
      }

      propertyMap.set(pNumberKey, {
        ...row,
        owners: [row.ownerName || ''],
        contacts: buildContacts(row)
      });
    } catch (err: unknown) {
      const error = err as { message: string };
      stats.errors.push({ row: row.rowNumber, message: error.message });
    }

    if ((i + 1) % batchSize === 0) {
      (session as Record<string, unknown>).processedRows = i + 1;
      await session.save();
    }
  }

  if (dryRun) {
    (session as Record<string, unknown>).status = 'completed';
    (session as Record<string, unknown>).processedRows = rows.length;
    (session as Record<string, unknown>).propertiesCreated = propertyMap.size;
    (session as Record<string, unknown>).duplicatesFound = stats.duplicatesFound;
    (session as Record<string, unknown>).completedAt = new Date();
    await session.save();

    return {
      ...stats,
      propertiesCreated: propertyMap.size,
      errors: stats.errors
    };
  }

  for (const [key, propData] of propertyMap) {
    try {
      const ownerIds: unknown[] = [];

      for (let i = 0; i < propData.owners.length; i++) {
        const ownerName = propData.owners[i];
        if (!ownerName) continue;

        const ownerContacts = propData.contacts.filter(
          (_, idx) => Math.floor(idx / 4) === i || propData.owners.length === 1
        );

        const { owner, isNew } = await (Owner as any).findOrCreateByNameAndContact(
          ownerName,
          ownerContacts.length > 0 ? ownerContacts : [],
          sessionId
        );

        ownerIds.push((owner as any)._id);
        if (isNew) stats.ownersCreated++;
        else stats.ownersUpdated++;
      }

      let property = await (InventoryProperty as any).findOne({
        $or: [
          { pNumber: String(propData.pNumber) },
          {
            area: propData.area,
            plotNumber: propData.plotNumber,
            unitNumber: propData.unitNumber
          }
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
        floor: propData.floor ? parseInt(String(propData.floor), 10) : null,
        layout: propData.layout || '',
        viewType: propData.viewType || '',
        rooms: propData.rooms ? parseInt(String(propData.rooms), 10) : null,
        actualArea: propData.actualArea ? parseFloat(String(propData.actualArea)) : null,
        status: STATUS_MAPPING[String(propData.status)] || 'available',
        askingPrice: propData.askingPrice ? parseFloat(String(propData.askingPrice)) : null,
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
        const existingOwnerIds = (property as any).owners.map((id: any) => id.toString());
        ownerIds.forEach((id) => {
          if (!existingOwnerIds.includes((id as any).toString())) {
            (property as any).owners.push(id);
          }
        });
        await property.save();
        stats.propertiesUpdated++;
      } else {
        property = new (InventoryProperty as any)(propertyData);
        await property.save();
        stats.propertiesCreated++;
      }

      for (const ownerId of ownerIds) {
        await (Owner as any).findByIdAndUpdate(ownerId, {
          $addToSet: { properties: (property as any)._id }
        });
      }
    } catch (err: unknown) {
      const error = err as { message: string };
      stats.errors.push({ row: propData.rowNumber, message: error.message, data: propData });
    }
  }

  (session as Record<string, unknown>).status = 'completed';
  (session as Record<string, unknown>).processedRows = rows.length;
  (session as Record<string, unknown>).propertiesCreated = stats.propertiesCreated;
  (session as Record<string, unknown>).propertiesUpdated = stats.propertiesUpdated;
  (session as Record<string, unknown>).ownersCreated = stats.ownersCreated;
  (session as Record<string, unknown>).ownersUpdated = stats.ownersUpdated;
  (session as Record<string, unknown>).duplicatesFound = stats.duplicatesFound;
  (session as Record<string, unknown>).errorsCount = stats.errors.length;
  (session as Record<string, unknown>).importErrors = stats.errors.slice(0, 100);
  (session as Record<string, unknown>).completedAt = new Date();
  await session.save();

  return stats;
}

export async function getAllSheetData(filePath: string): Promise<ParsedRowData[]> {
  const workbook = XLSX.readFile(filePath);
  const allRows: ParsedRowData[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rawData.length < 2) continue;

    const headers = rawData[0];
    const rows = (rawData.slice(1) as unknown[][])
      .filter((row) => row.some((cell) => cell !== undefined && cell !== ''))
      .map((row, index) => ({
        rowNumber: index + 2,
        sheetName,
        ...parseRow(row, headers as unknown[])
      }));

    allRows.push(...rows);
  }

  return allRows;
}
