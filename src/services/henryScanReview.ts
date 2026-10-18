import { authFetch } from '../utils/authFetch';
import logger from '../utils/logger';
import type { ExtractionDiagnostics } from './henryDocumentParsing';

export interface ScanReview {
  demoOnly?: boolean;
  reviewConfirmed?: boolean;
  missingFields?: string[];
  diagnostics?: ExtractionDiagnostics;
  expiryAcknowledgedFor?: string;
  vaultSource?: { documentId: string; docType: 'emirates_id' | 'title_deed'; loadedAt: string };
}

export interface VaultSaveOptions {
  sources?: File[];
  leadId?: string;
  propertyId?: string;
  replacesId?: string;
}

export function canUseScan(data: ScanReview | null | undefined): boolean {
  return assessScanReadiness(data).status === 'ready_to_use';
}

export type ScanReadiness =
  | { status: 'needs_rescan'; reasons: string[] }
  | { status: 'needs_review'; reasons: string[] }
  | { status: 'ready_to_use'; reasons: [] };

/** Readiness is a review gate, not an authenticity or accuracy estimate. */
export function assessScanReadiness(data: ScanReview | null | undefined): ScanReadiness {
  if (!data) return { status: 'needs_rescan', reasons: ['Upload a readable document.'] };
  const fields = data as ScanReview & Record<string, unknown>;
  const present = (key: string) =>
    typeof fields[key] === 'string' &&
    !!(fields[key] as string).trim() &&
    !/^(?:n\/?a|unknown|unreadable|undefined|null|not available|[-?]+)$/i.test(
      (fields[key] as string).trim()
    );
  const missing = new Set(data.missingFields || []);
  if ('passportNumber' in fields) {
    for (const key of ['passportNumber', 'fullName']) if (!present(key)) missing.add(key);
    if (!present('issuingCountryCode') && !present('issuingCountry')) missing.add('issuingCountry');
    for (const key of ['dateOfBirth', 'dateOfExpiry'])
      if (typeof fields[key] !== 'string' || !validScanDate(fields[key] as string)) missing.add(key);
    if (!/^[A-Z0-9]{5,12}$/i.test(String(fields.passportNumber))) missing.add('passportNumber');
    if (validScanDate(String(fields.dateOfBirth)) &&
      Date.parse(String(fields.dateOfBirth).split('/').reverse().join('-')) > Date.now())
      missing.add('dateOfBirth');
    const time = (value: unknown) => typeof value === 'string' && validScanDate(value)
      ? Date.parse(value.split('/').reverse().join('-')) : NaN;
    if (time(fields.dateOfBirth) >= time(fields.dateOfExpiry)) missing.add('dateOfBirth');
    if (fields.dateOfIssue && (!Number.isFinite(time(fields.dateOfIssue)) ||
      time(fields.dateOfIssue) < time(fields.dateOfBirth) ||
      time(fields.dateOfIssue) > time(fields.dateOfExpiry))) missing.add('dateOfIssue');
  }
  if ('financials' in fields) {
    const record = (value: unknown): Record<string, unknown> =>
      value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
    const landlord = record(fields.landlord), tenant = record(fields.tenant);
    const property = record(fields.property), financials = record(fields.financials);
    if (property.usage !== undefined && !['', 'residential', 'commercial', 'industrial'].includes(String(property.usage)))
      missing.add('property.usage');
    for (const key of ['areaSqM', 'areaSqFt'])
      if (property[key] !== undefined && (typeof property[key] !== 'number' ||
        !Number.isFinite(property[key]) || Number(property[key]) < 0)) missing.add(`property.${key}`);
    for (const [key, value] of Object.entries({
      'landlord.name': landlord.name, 'tenant.name': tenant.name,
      'property.buildingName': property.buildingName, 'property.propertyNumber': property.propertyNumber,
    })) if (typeof value !== 'string' || !value.trim() || /^(unknown|n\/a)$/i.test(value)) missing.add(key);
    for (const key of ['periodFrom', 'periodTo'])
      if (typeof financials[key] !== 'string' || !validScanDate(String(financials[key])))
        missing.add(`financials.${key}`);
    if (typeof financials.annualRentAed !== 'number' || !Number.isFinite(financials.annualRentAed) || financials.annualRentAed <= 0)
      missing.add('financials.annualRentAed');
    for (const key of ['contractValueAed', 'securityDepositAed'])
      if (financials[key] !== undefined && (typeof financials[key] !== 'number' ||
        !Number.isFinite(financials[key]) || Number(financials[key]) < 0)) missing.add(`financials.${key}`);
    if (validScanDate(String(financials.periodFrom)) && validScanDate(String(financials.periodTo)) &&
      Date.parse(String(financials.periodFrom).split('/').reverse().join('-')) >=
      Date.parse(String(financials.periodTo).split('/').reverse().join('-')))
      missing.add('financials.periodTo');
  }
  if ('idNumber' in fields) {
    if (typeof fields.idNumber !== 'string' || !/^784-\d{4}-\d{7}-\d$/.test(fields.idNumber))
      missing.add('idNumber');
    if (!present('fullNameEn') || !/[a-z]{2}/i.test(String(fields.fullNameEn)))
      missing.add('fullNameEn');
    if (typeof fields.expiryDate !== 'string' || !validScanDate(fields.expiryDate))
      missing.add('expiryDate');
  }
  if ('certificateNumber' in fields) {
    if (
      typeof fields.certificateNumber !== 'string' ||
      !/^\d{1,12}\/\d{4}$/.test(fields.certificateNumber)
    )
      missing.add('certificateNumber');
    if (!present('ownerNameEn') || !/[a-z]{2}/i.test(String(fields.ownerNameEn)))
      missing.add('ownerNameEn');
    if (!present('propertyNumber') && !present('plotNumber')) missing.add('propertyNumber');
  }
  for (const key of ['dateOfBirth', 'issueDate', 'registrationDate']) {
    if (
      fields[key] !== undefined &&
      fields[key] !== '' &&
      (typeof fields[key] !== 'string' || !validScanDate(fields[key] as string))
    )
      missing.add(key);
  }
  if ('idNumber' in fields) {
    const time = (value: unknown) =>
      typeof value === 'string' && validScanDate(value)
        ? Date.parse(value.split('/').reverse().join('-'))
        : NaN;
    if (time(fields.dateOfBirth) > Date.now()) missing.add('dateOfBirth');
    if (time(fields.issueDate) > time(fields.expiryDate)) missing.add('issueDate');
    if (time(fields.dateOfBirth) > time(fields.issueDate)) missing.add('dateOfBirth');
  }
  if (missing.size)
    return {
      status: 'needs_rescan',
      reasons: [...missing].map(
        key => `Missing or invalid ${key}; correct from the source or rescan.`
      ),
    };
  const reasons: string[] = [];
  if (data.demoOnly) reasons.push('Demo documents cannot be reused.');
  if (('passportNumber' in fields || 'financials' in fields) && data.demoOnly !== false)
    reasons.push('A real uploaded source is required.');
  if (Object.values(data.diagnostics?.fields || {}).some(field => field.state === 'conflict'))
    reasons.push('Resolve source conflicts before reuse.');
  if (
    'idNumber' in fields &&
    typeof fields.expiryDate === 'string' &&
    scanExpiry(fields.expiryDate).isExpired &&
    data.expiryAcknowledgedFor !== fields.expiryDate
  )
    reasons.push(
      'Expired ID: explicitly acknowledge this expiry; it is not current identification.'
    );
  const passportExpiry = fields.dateOfExpiry;
  if ('passportNumber' in fields && typeof passportExpiry === 'string' &&
    scanExpiry(passportExpiry).isExpired && data.expiryAcknowledgedFor !== passportExpiry)
    reasons.push('Expired passport: explicitly acknowledge this expiry; it is not current identification.');
  if (data.reviewConfirmed !== true) reasons.push('Confirm a fresh source review.');
  return reasons.length
    ? { status: 'needs_review', reasons }
    : { status: 'ready_to_use', reasons: [] };
}

/** Validate the archived schema against the existing scanner shape before entering its UI. */
export function hydrateVaultScan<T extends ScanReview>(
  record: unknown,
  docType: 'emirates_id' | 'title_deed',
  shape: T
): T {
  const object = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === 'object' && !Array.isArray(value);
  const strings = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string');
  if (
    !object(record) ||
    record.docType !== docType ||
    typeof record.id !== 'string' ||
    !/^[a-f0-9]{24}$/i.test(record.id) ||
    record.replacedById ||
    !object(record.extractedJson)
  )
    throw new Error('Archive record type or identity is invalid.');
  const fields = record.extractedJson;
  if (fields.demoOnly !== false || fields.reviewConfirmed !== true)
    throw new Error('Only reviewed real records can be loaded.');
  const candidate: Record<string, unknown> = {};
  for (const [key, expected] of Object.entries(shape)) {
    if (
      [
        'demoOnly',
        'reviewConfirmed',
        'missingFields',
        'diagnostics',
        'mrz',
        'daysUntilExpiry',
      ].includes(key)
    )
      continue;
    if (typeof expected !== 'object') {
      const value = fields[key];
      if (
        typeof value !== typeof expected ||
        (typeof value === 'number' && (!Number.isFinite(value) || value < 0))
      )
        throw new Error(`Invalid archived ${key}.`);
      candidate[key] = value;
    }
  }
  for (const key of [
    'chipNumber',
    'rawOcrText',
    'ocrEngine',
    'documentFormat',
    'scannedSide',
    'mortgageState',
  ]) {
    if (fields[key] !== undefined) {
      if (typeof fields[key] !== 'string') throw new Error(`Invalid archived ${key}.`);
      candidate[key] = fields[key];
    }
  }
  if (fields.gender !== undefined && !['', 'M', 'F'].includes(String(fields.gender)))
    throw new Error('Invalid archived gender.');
  if (
    fields.mortgageState !== undefined &&
    !['unknown', 'mortgaged', 'not_mortgaged'].includes(String(fields.mortgageState))
  )
    throw new Error('Invalid mortgage state.');
  if (
    fields.scannedSide !== undefined &&
    !['front', 'back', 'both'].includes(String(fields.scannedSide))
  )
    throw new Error('Invalid archived document side.');
  if (
    (typeof fields.confidenceScore === 'number' && fields.confidenceScore > 1) ||
    (typeof fields.ownerSharePercent === 'number' && fields.ownerSharePercent > 100)
  )
    throw new Error('Invalid archived numeric range.');
  if (fields.missingFields !== undefined && !strings(fields.missingFields))
    throw new Error('Invalid missing-field evidence.');
  if (fields.diagnostics !== undefined) {
    const evidence = fields.diagnostics;
    if (
      !object(evidence) ||
      !object(evidence.fields) ||
      !strings(evidence.warnings) ||
      typeof evidence.coverage !== 'number' ||
      !Number.isFinite(evidence.coverage) ||
      evidence.coverage < 0 ||
      evidence.coverage > 1 ||
      (evidence.ocrConfidence !== undefined &&
        (typeof evidence.ocrConfidence !== 'number' ||
          !Number.isFinite(evidence.ocrConfidence) ||
          evidence.ocrConfidence < 0 ||
          evidence.ocrConfidence > 100))
    )
      throw new Error('Invalid archive evidence.');
    for (const field of Object.values(evidence.fields)) {
      if (
        !object(field) ||
        !['extracted', 'missing', 'derived', 'conflict'].includes(String(field.state)) ||
        !['text', 'mrz', 'conversion', 'review'].includes(String(field.source)) ||
        !strings(field.values) ||
        (field.conflicts !== undefined &&
          (!object(field.conflicts) || !Object.values(field.conflicts).every(strings)))
      )
        throw new Error('Invalid field evidence.');
    }
    candidate.diagnostics = structuredClone(evidence);
  }
  if (fields.owners !== undefined) {
    if (
      !Array.isArray(fields.owners) ||
      fields.owners.length > 100 ||
      !fields.owners.every(
        owner =>
          object(owner) &&
          ['dldNumber', 'nameEn', 'nameAr'].every(key => typeof owner[key] === 'string') &&
          ['sharePercent', 'ownedAreaSqM'].every(
            key =>
              owner[key] === undefined ||
              (typeof owner[key] === 'number' &&
                Number.isFinite(owner[key]) &&
                (owner[key] as number) >= 0)
          ) &&
          (owner.sharePercent === undefined || (owner.sharePercent as number) <= 100)
      )
    )
      throw new Error('Invalid archived owners.');
    candidate.owners = structuredClone(fields.owners);
  }
  if (fields.mrz !== undefined) {
    if (
      !object(fields.mrz) ||
      !['line1', 'line2', 'line3'].every(
        key =>
          typeof fields.mrz === 'object' &&
          typeof (fields.mrz as Record<string, unknown>)[key] === 'string'
      )
    )
      throw new Error('Invalid archived MRZ.');
    candidate.mrz = structuredClone(fields.mrz);
  }
  candidate.missingFields = fields.missingFields || [];
  candidate.demoOnly = false;
  candidate.reviewConfirmed = false;
  candidate.vaultSource = { documentId: record.id, docType, loadedAt: new Date().toISOString() };
  if (docType === 'emirates_id') {
    if (
      candidate.rawIdNumber &&
      candidate.rawIdNumber !== String(candidate.idNumber).replace(/\D/g, '')
    )
      throw new Error('Archived ID references disagree.');
    for (const key of ['cardNumber', 'chipNumber']) {
      if (candidate[key] && !/^\d{8,16}$/.test(String(candidate[key])))
        throw new Error('Invalid archived card identifier.');
    }
    Object.assign(candidate, scanExpiry(String(candidate.expiryDate)));
  }
  if (docType === 'title_deed') candidate.isBlockchainVerified = false;
  const hydrated = candidate as T;
  if (assessScanReadiness(hydrated).status === 'needs_rescan')
    throw new Error('Archive fields are incomplete or invalid; rescan the source.');
  return structuredClone(hydrated);
}

export function validScanDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const date = new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
  return (
    date.getUTCFullYear() === Number(match[3]) &&
    date.getUTCMonth() + 1 === Number(match[2]) &&
    date.getUTCDate() === Number(match[1])
  );
}

export function scanExpiry(value: string): { isExpired: boolean; daysUntilExpiry: number } {
  if (!validScanDate(value)) return { isExpired: false, daysUntilExpiry: NaN };
  const parts = value.split('/');
  const iso = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const time = Date.parse(iso);
  const today = Math.floor(Date.now() / 86400000) * 86400000;
  const days = (time - today) / 86400000;
  return { isExpired: Number.isFinite(time) && days < 0, daysUntilExpiry: days };
}

export async function saveReviewedScan(
  docType: string,
  data: ScanReview & object,
  referenceNumber: string,
  clientName: string,
  options: VaultSaveOptions = {}
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!canUseScan(data))
    return { success: false, error: 'Review required. Demo or incomplete scans cannot be saved.' };
  try {
    const metadata = {
      docType,
      extractedJson: data,
      referenceNumber,
      clientName,
      reviewConfirmed: true,
      leadId: options.leadId,
      propertyId: options.propertyId,
      replacesId: options.replacesId,
    };
    let body: string | FormData = JSON.stringify(metadata);
    if (options.sources?.length) {
      if (options.sources.reduce((total, file) => total + file.size, 0) > 4 * 1024 * 1024)
        return {
          success: false,
          error: 'Encrypted originals must total at most 4 MB. Compress or rescan first.',
        };
      const form = new FormData();
      form.append('metadata', JSON.stringify(metadata));
      options.sources.forEach(file => form.append('source', file));
      body = form;
    }
    const response = await authFetch('/api/henry/documents/save', {
      method: 'POST',
      ...(typeof body === 'string' ? { headers: { 'Content-Type': 'application/json' } } : {}),
      body,
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.id) {
      return { success: false, error: result.error || 'Document was not saved.' };
    }
    return { success: true, id: result.data.id };
  } catch (error) {
    logger.error('Henry document save failed', {
      docType,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return { success: false, error: 'Vault unavailable. Nothing was saved.' };
  }
}
