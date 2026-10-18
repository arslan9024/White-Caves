import { createHmac } from 'node:crypto';
import { prisma } from '../../database.js';
import { EncryptionService, EncryptedMessage } from '../../security/encryption.service.js';
import { AppError } from '../../middleware/errorHandler.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('HenryVault');
const encryption = new EncryptionService();
// AES hex encoding + base64 must fit MongoDB's 16 MB document limit.
export const maxSourceBytes = 4 * 1024 * 1024;
export const documentTypes = ['emirates_id', 'title_deed', 'passport', 'tenancy_contract'] as const;
export const activeDocumentFilter = {
  OR: [{ replacedById: null }, { replacedById: { isSet: false } }],
};

export function referenceHash(owner: string, docType: string, reference: string): string {
  return createHmac('sha256', vaultKey())
    .update(`${owner}:${docType}:${reference.replace(/[\s-]/g, '').toLowerCase()}`)
    .digest('hex');
}

export function prepareSource(files: Express.Multer.File[]) {
  if (!files.length) return {};
  if (files.length > 2 || files.reduce((total, file) => total + file.size, 0) > maxSourceBytes)
    throw new AppError('Original files must total at most 4 MB', 413);
  const sources = files.map(file => {
    const bytes = file.buffer;
    const mime = bytes.subarray(0, 5).toString() === '%PDF-' ? 'application/pdf'
      : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? 'image/png'
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg' : null;
    if (!mime || mime !== file.mimetype) throw new AppError('Original file signature does not match PDF, PNG or JPEG', 400);
    return { mime, base64: bytes.toString('base64') };
  });
  return { encryptedSource: JSON.stringify(encryption.encryptMessage(JSON.stringify(sources), vaultKey())) };
}

export function decodeSource(encryptedSource: string, index: number): { mime: string; bytes: Buffer } {
  const sources = decryptVaultJson(encryptedSource);
  if (!Array.isArray(sources) || sources.length > 2 || sources.some(source =>
    !source || typeof source !== 'object' ||
    !['application/pdf', 'image/png', 'image/jpeg'].includes(source.mime) ||
    typeof source.base64 !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(source.base64)
  )) throw new AppError('Document vault unavailable', 503);
  const source = sources[index];
  if (!source) throw new AppError('Original side not found', 404);
  return { mime: source.mime, bytes: Buffer.from(source.base64, 'base64') };
}

function decryptVaultJson(value: string): unknown {
  const key = vaultKey();
  try {
    return JSON.parse(encryption.decryptMessage(JSON.parse(value) as EncryptedMessage, key));
  } catch {
    log.error('Document decryption failed');
    throw new AppError('Document vault unavailable', 503);
  }
}

export function vaultKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!process.env.DATABASE_URL || !key || !/^[a-f0-9]{64}$/i.test(key)) {
    throw new AppError('Encrypted document vault is not configured', 503);
  }
  return key;
}

export function documentOwner(id?: string): string {
  if (!id || !/^[a-f0-9]{24}$/i.test(id))
    throw new AppError('Authenticated document owner required', 401);
  return id;
}

export function documentId(id: unknown): string {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id))
    throw new AppError('Invalid document ID', 400);
  return id;
}

function expiryTime(value: unknown): number {
  if (typeof value !== 'string') return NaN;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return NaN;
  const time = Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  const date = new Date(time);
  return date.getUTCFullYear() === Number(match[3]) && date.getUTCDate() === Number(match[1]) && date.getUTCMonth() + 1 === Number(match[2])
    ? time
    : NaN;
}

export function prepareDocument(input: Record<string, unknown>, owner = '') {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new AppError('Document metadata required', 400);
  const extracted = input.extractedJson;
  if (!extracted || typeof extracted !== 'object' || Array.isArray(extracted))
    throw new AppError('Extracted fields required', 400);
  const fields = extracted as Record<string, unknown>;
  if (!documentTypes.includes(input.docType as (typeof documentTypes)[number]))
    throw new AppError('Unsupported document type', 400);
  if (
    input.reviewConfirmed !== true ||
    fields.demoOnly === true ||
    fields.reviewConfirmed === false
  )
    throw new AppError('Explicit review required; demos cannot be saved', 400);
  const reference =
    input.referenceNumber || fields.idNumber || fields.certificateNumber || fields.passportNumber || fields.contractReference;
  if (typeof reference !== 'string' || !reference.trim() || reference.length > 100)
    throw new AppError('Document reference required', 400);
  const real = input.docType === 'passport' || input.docType === 'tenancy_contract';
  if (real && (fields.demoOnly !== false || fields.reviewConfirmed !== true))
    throw new AppError('Explicit review of a real source required', 400);
  const nonempty = (value: unknown): value is string =>
    typeof value === 'string' && !!value.trim() && !/^(?:unknown|n\/?a|undefined|null|[-?]+)$/i.test(value.trim());
  if (input.docType === 'passport') {
    if (!nonempty(fields.fullName) || typeof fields.passportNumber !== 'string' ||
      !/^[A-Z0-9]{5,12}$/i.test(fields.passportNumber) || reference !== fields.passportNumber ||
      ![fields.issuingCountry, fields.issuingCountryCode].some(nonempty) ||
      !Number.isFinite(expiryTime(fields.dateOfBirth)) || !Number.isFinite(expiryTime(fields.dateOfExpiry)) ||
      expiryTime(fields.dateOfBirth) > Date.now() || expiryTime(fields.dateOfBirth) >= expiryTime(fields.dateOfExpiry) ||
      !['', 'M', 'F'].includes(String(fields.gender ?? '')) ||
      (fields.dateOfIssue && (!Number.isFinite(expiryTime(fields.dateOfIssue)) ||
        expiryTime(fields.dateOfIssue) > expiryTime(fields.dateOfExpiry) ||
        expiryTime(fields.dateOfIssue) < expiryTime(fields.dateOfBirth))))
      throw new AppError('Valid passport identity, country and full-year dates required', 400);
    if (expiryTime(fields.dateOfExpiry) < Math.floor(Date.now() / 86400000) * 86400000 &&
      fields.expiryAcknowledgedFor !== fields.dateOfExpiry)
      throw new AppError('Explicit acknowledgment of this expired passport required', 400);
  }
  if (input.docType === 'tenancy_contract') {
    const object = (value: unknown): Record<string, unknown> =>
      value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
    const landlord = object(fields.landlord), tenant = object(fields.tenant);
    const property = object(fields.property), financials = object(fields.financials);
    if (property.usage !== undefined && !['', 'residential', 'commercial', 'industrial'].includes(String(property.usage)))
      throw new AppError('Invalid contract property usage', 400);
    for (const key of ['areaSqM', 'areaSqFt'])
      if (property[key] !== undefined &&
        (typeof property[key] !== 'number' || !Number.isFinite(property[key]) || Number(property[key]) < 0))
        throw new AppError('Invalid contract property area', 400);
    if (![landlord.name, tenant.name, property.buildingName, property.propertyNumber].every(nonempty) ||
      !Number.isFinite(expiryTime(financials.periodFrom)) || !Number.isFinite(expiryTime(financials.periodTo)) ||
      expiryTime(financials.periodFrom) >= expiryTime(financials.periodTo) ||
      typeof financials.annualRentAed !== 'number' || !Number.isFinite(financials.annualRentAed) || financials.annualRentAed <= 0 ||
      !nonempty(fields.contractReference) || reference !== fields.contractReference)
      throw new AppError('Contract source reference, parties, property, dates and positive rent required', 400);
    for (const key of ['contractValueAed', 'securityDepositAed'])
      if (financials[key] !== undefined &&
        (typeof financials[key] !== 'number' || !Number.isFinite(financials[key]) || Number(financials[key]) < 0))
        throw new AppError('Invalid contract amount', 400);
  }
  if (
    input.docType === 'emirates_id' &&
    (!/^784-?\d{4}-?\d{7}-?\d$/.test(reference) || !fields.fullNameEn || !fields.expiryDate)
  )
    throw new AppError('ID number, name and expiry required', 400);
  if (
    input.docType === 'emirates_id' &&
    (typeof fields.fullNameEn !== 'string' ||
      !fields.fullNameEn.trim() ||
      !Number.isFinite(expiryTime(fields.expiryDate)))
  )
    throw new AppError('Valid name and expiry date required', 400);
  if (
    input.docType === 'emirates_id' &&
    expiryTime(fields.expiryDate) < Math.floor(Date.now() / 86400000) * 86400000 &&
    fields.expiryAcknowledgedFor !== fields.expiryDate
  )
    throw new AppError('Explicit acknowledgment of this expired ID required', 400);
  if (
    input.docType === 'title_deed' &&
    (typeof fields.ownerNameEn !== 'string' || !fields.ownerNameEn.trim() ||
      ![fields.propertyNumber, fields.plotNumber].some(value => typeof value === 'string' && value.trim()))
  )
    throw new AppError('Owner and unit or plot required', 400);
  if (Array.isArray(fields.missingFields) && fields.missingFields.length)
    throw new AppError('Correct missing fields before saving', 400);
  if (fields.diagnostics !== undefined) {
    const diagnostics = fields.diagnostics;
    if (!diagnostics || typeof diagnostics !== 'object' || Array.isArray(diagnostics))
      throw new AppError('Invalid extraction diagnostics', 400);
    const evidence = (diagnostics as Record<string, unknown>).fields;
    if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence))
      throw new AppError('Invalid extraction diagnostics', 400);
    for (const field of Object.values(evidence)) {
      if (!field || typeof field !== 'object' || Array.isArray(field) ||
        !['extracted', 'missing', 'derived', 'conflict'].includes(String((field as Record<string, unknown>).state)))
        throw new AppError('Invalid extraction diagnostics', 400);
      if ((field as Record<string, unknown>).state === 'conflict')
        throw new AppError('Resolve conflicting fields before saving', 400);
    }
  }
  const payload = {
    title: typeof input.title === 'string' ? input.title.slice(0, 200) : 'Reviewed document',
    clientName: typeof input.clientName === 'string' ? input.clientName.slice(0, 200) : '',
    referenceNumber: reference.trim(),
    extractedJson: { ...fields, isBlockchainVerified: false, reviewConfirmed: true },
    confidenceScore:
      typeof fields.confidenceScore === 'number' && Number.isFinite(fields.confidenceScore)
        ? Math.max(0, Math.min(1, fields.confidenceScore))
        : 0,
    scannedSide: fields.scannedSide,
    documentFormat: fields.documentFormat,
    authenticity: 'not_verified',
  };
  const serialized = JSON.stringify(payload);
  if (serialized.length > 250000) throw new AppError('Extracted payload too large', 413);
  const key = vaultKey();
  const expiry = expiryTime(fields.expiryDate || fields.dateOfExpiry || (fields.financials as Record<string, unknown> | undefined)?.periodTo || (fields.contract as Record<string, unknown> | undefined)?.endDate);
  const configuredDays = Number(process.env.HENRY_RETENTION_DAYS || 365);
  if (!Number.isInteger(configuredDays) || configuredDays < 1 || configuredDays > 3650)
    throw new AppError('Invalid Henry retention review interval', 503);
  return {
    docType: input.docType as string,
    referenceHash: referenceHash(owner, String(input.docType), reference),
    encryptedPayload: JSON.stringify(encryption.encryptMessage(serialized, key)),
    expiryAt: Number.isFinite(expiry) ? new Date(expiry) : null,
    retentionUntil: new Date(Date.now() + configuredDays * 86400000),
  };
}

export function decodeDocument(row: {
  id: string;
  docType: string;
  encryptedPayload: string;
  createdAt: Date;
  updatedAt: Date;
  replacedById?: string | null;
  leadId?: string | null;
  propertyId?: string | null;
  tenancyId?: string | null;
  transactionId?: string | null;
  lifecycleStatus?: string | null;
  signedAttestedAt?: Date | null;
  encryptedSource?: string | null;
  retentionUntil?: Date | null;
  reminderDismissedAt?: Date | null;
}): Record<string, unknown> {
  const decrypted = decryptVaultJson(row.encryptedPayload);
  if (!decrypted || typeof decrypted !== 'object' || Array.isArray(decrypted) ||
    !('extractedJson' in decrypted) || !decrypted.extractedJson ||
    typeof decrypted.extractedJson !== 'object' || Array.isArray(decrypted.extractedJson))
    throw new AppError('Document vault unavailable', 503);
  const payload = decrypted as Record<string, unknown>;
  const fields = (payload.extractedJson || {}) as Record<string, unknown>;
  const expiry = expiryTime(fields.expiryDate || fields.dateOfExpiry || (fields.financials as Record<string, unknown> | undefined)?.periodTo || (fields.contract as Record<string, unknown> | undefined)?.endDate);
  return {
    ...payload,
    id: row.id,
    docType: row.docType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    replacedById: row.replacedById,
    leadId: row.leadId,
    propertyId: row.propertyId,
    tenancyId: row.tenancyId,
    transactionId: row.transactionId,
    lifecycleStatus: row.lifecycleStatus === 'signed' ? 'signed' : 'draft',
    signedAttestedAt: row.signedAttestedAt,
    hasOriginal: !!row.encryptedSource,
    retentionUntil: row.retentionUntil,
    reminderDismissedAt: row.reminderDismissedAt,
    expiryStatus: Number.isFinite(expiry)
      ? expiry < Math.floor(Date.now() / 86400000) * 86400000
        ? 'expired'
        : expiry < Date.now() + 30 * 86400000 ? 'soon_expiring' : 'current'
      : 'unknown',
  };
}

export async function validateDocumentLinks(ownerUserId: string, input: Record<string, unknown>) {
  const link = (value: unknown) => value === undefined || value === null ? null : documentId(value);
  const leadId = link(input.leadId);
  const propertyId = link(input.propertyId);
  const tenancyId = link(input.tenancyId);
  const transactionId = link(input.transactionId);
  if (
    leadId &&
    !(await prisma.lead.findFirst({
      where: { id: leadId, assignedToId: ownerUserId },
      select: { id: true },
    }))
  )
    throw new AppError('Lead not accessible', 404);
  if (
    propertyId &&
    !(await prisma.property.findFirst({
      where: { id: propertyId, userId: ownerUserId },
      select: { id: true },
    }))
  )
    throw new AppError('Property not accessible', 404);
  if (tenancyId && !(await prisma.lease.findFirst({
    where: { id: tenancyId, property: { userId: ownerUserId } }, select: { id: true },
  }))) throw new AppError('Tenancy not accessible', 404);
  if (transactionId && !(await prisma.transaction.findFirst({
    where: { id: transactionId, agentId: ownerUserId }, select: { id: true },
  }))) throw new AppError('Transaction not accessible', 404);
  return { leadId, propertyId, tenancyId, transactionId };
}

export async function vaultOperation<T>(action: string, work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof AppError) throw error;
    log.error('Document operation failed', { action });
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002')
      throw new AppError('Duplicate document reference', 409);
    throw new AppError('Document vault unavailable', 503);
  }
}
