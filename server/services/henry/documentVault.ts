import { createHmac } from 'node:crypto';
import { prisma } from '../../database.js';
import { EncryptionService, EncryptedMessage } from '../../security/encryption.service.js';
import { AppError } from '../../middleware/errorHandler.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('HenryVault');
const encryption = new EncryptionService();
export const documentTypes = ['emirates_id', 'title_deed', 'passport', 'tenancy_contract'] as const;

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
  return date.getUTCDate() === Number(match[1]) && date.getUTCMonth() + 1 === Number(match[2])
    ? time
    : NaN;
}

export function prepareDocument(input: Record<string, unknown>) {
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
    input.referenceNumber || fields.idNumber || fields.certificateNumber || fields.passportNumber;
  if (typeof reference !== 'string' || !reference.trim() || reference.length > 100)
    throw new AppError('Document reference required', 400);
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
    input.docType === 'title_deed' &&
    (!fields.ownerNameEn || (!fields.propertyNumber && !fields.plotNumber))
  )
    throw new AppError('Owner and unit or plot required', 400);
  if (Array.isArray(fields.missingFields) && fields.missingFields.length)
    throw new AppError('Correct missing fields before saving', 400);
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
  return {
    docType: input.docType as string,
    referenceHash: createHmac('sha256', key)
      .update(`${input.docType}:${reference.replace(/[\s-]/g, '').toLowerCase()}`)
      .digest('hex'),
    encryptedPayload: JSON.stringify(encryption.encryptMessage(serialized, key)),
  };
}

export function decodeDocument(row: {
  id: string;
  docType: string;
  encryptedPayload: string;
  createdAt: Date;
  updatedAt: Date;
  replacedById?: string | null;
}): Record<string, unknown> {
  const payload = JSON.parse(
    encryption.decryptMessage(JSON.parse(row.encryptedPayload) as EncryptedMessage, vaultKey())
  ) as Record<string, unknown>;
  const fields = payload.extractedJson as Record<string, unknown>;
  const expiry = expiryTime(fields.expiryDate);
  return {
    ...payload,
    id: row.id,
    docType: row.docType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    replacedById: row.replacedById,
    expiryStatus: Number.isFinite(expiry)
      ? expiry < Date.now()
        ? 'expired'
        : 'current'
      : 'unknown',
  };
}

export async function validateDocumentLinks(ownerUserId: string, input: Record<string, unknown>) {
  const leadId = input.leadId ? documentId(input.leadId) : null;
  const propertyId = input.propertyId ? documentId(input.propertyId) : null;
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
  return { leadId, propertyId };
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
