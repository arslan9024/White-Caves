import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Readable } from 'node:stream';

vi.mock('../../database.js', () => ({ prisma: {} }));
import { decodeDocument, decodeSource, maxSourceBytes, prepareDocument, prepareSource } from './documentVault.js';
import { EncryptionService } from '../../security/encryption.service.js';

const input = {
  docType: 'title_deed',
  reviewConfirmed: true,
  extractedJson: { certificateNumber: '900001/2030', ownerNameEn: 'TEST OWNER', plotNumber: '42' },
};
const owner = '123456789012345678901234';

function source(buffer: Buffer, mimetype = 'application/pdf'): Express.Multer.File {
  return { buffer, mimetype, size: buffer.length, fieldname: 'source', originalname: 'synthetic',
    encoding: '7bit', stream: Readable.from(buffer), destination: '', filename: '', path: '' };
}

describe('Henry document vault preparation', () => {
  beforeEach(() => {
    vi.stubEnv('ENCRYPTION_KEY', 'a'.repeat(64));
    vi.stubEnv('DATABASE_URL', 'mongodb://localhost/test');
    vi.stubEnv('HENRY_RETENTION_DAYS', '365');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('requires a date-specific acknowledgment for expired IDs but accepts the entire expiry day', () => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2030, 0, 2, 12));
    const metadata = { docType: 'emirates_id', reviewConfirmed: true,
      extractedJson: { idNumber: '784-2000-1234567-1', fullNameEn: 'TEST OWNER', expiryDate: '01/01/2030' } };
    try {
      expect(() => prepareDocument(metadata, owner)).toThrow('Explicit acknowledgment');
      expect(() => prepareDocument({ ...metadata, extractedJson: {
        ...metadata.extractedJson, expiryAcknowledgedFor: '31/12/2029',
      } }, owner)).toThrow('Explicit acknowledgment');
      expect(() => prepareDocument({ ...metadata, extractedJson: {
        ...metadata.extractedJson, expiryAcknowledgedFor: '01/01/2030',
      } }, owner)).not.toThrow();
      const current = prepareDocument({ ...metadata, extractedJson: {
        ...metadata.extractedJson, expiryDate: '02/01/2030',
      } }, owner);
      expect(decodeDocument({ ...current, id: owner, createdAt: new Date(), updatedAt: new Date() }).expiryStatus)
        .toBe('soon_expiring');
    } finally { vi.restoreAllMocks(); }
  });
  it.each([{}, [], true, 42])('rejects non-text required deed fields: %j', value => {
    expect(() => prepareDocument({ ...input, extractedJson: { ...input.extractedJson, ownerNameEn: value } }, owner))
      .toThrow('Owner and unit or plot required');
    expect(() => prepareDocument({ ...input, extractedJson: { ...input.extractedJson, plotNumber: value } }, owner))
      .toThrow('Owner and unit or plot required');
  });
  it.each([
    { docType: 'emirates_id', expected: '2027-12-31T00:00:00.000Z',
      extractedJson: { idNumber: '784-2000-1234567-1', fullNameEn: 'TEST OWNER', expiryDate: '31/12/2027' } },
    { docType: 'passport', expected: '2027-12-31T00:00:00.000Z',
      extractedJson: { passportNumber: 'T12345678', fullName: 'TEST OWNER', issuingCountryCode: 'UTO',
        dateOfBirth: '01/01/1990', dateOfExpiry: '31/12/2027', demoOnly: false, reviewConfirmed: true } },
    { docType: 'tenancy_contract', expected: '2027-12-31T00:00:00.000Z',
      extractedJson: { contractReference: 'SOURCE-42', landlord: { name: 'TEST LESSOR' }, tenant: { name: 'TEST TENANT' },
        property: { buildingName: 'TEST BUILDING', propertyNumber: '42' },
        financials: { periodFrom: '01/01/2027', periodTo: '31/12/2027', annualRentAed: 60000 },
        demoOnly: false, reviewConfirmed: true } },
    { ...input, expected: null },
  ])('preserves legacy $docType expiry without guessing one from nested generic values', ({ expected, ...metadata }) => {
    const clock = vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2026, 9, 18, 12));
    try {
      const prepared = prepareDocument({ ...metadata, reviewConfirmed: true,
        extractedJson: { ...metadata.extractedJson, values: { expiryDate: '01/01/2020' } } }, owner);
      expect(prepared.expiryAt?.toISOString() ?? null).toBe(expected);
      expect(decodeDocument({ ...prepared, id: owner, createdAt: new Date(), updatedAt: new Date() }).expiryStatus)
        .toBe(expected ? 'current' : 'unknown');
    } finally { clock.mockRestore(); }
  });
  it('normalizes malformed encryption JSON to a safe unavailable error', () => {
    const row = { id: owner, docType: 'title_deed', encryptedPayload: '{PRIVATE MALFORMED DATA',
      createdAt: new Date(), updatedAt: new Date() };
    expect(() => decodeDocument(row)).toThrow('Document vault unavailable');
    expect(() => decodeSource('{PRIVATE MALFORMED DATA', 0)).toThrow('Document vault unavailable');
  });
  it.each([null, [], { extractedJson: [] }, { extractedJson: 'invalid' }])(
    'rejects authenticated but malformed payload shapes: %j', payload => {
      const encryptedPayload = JSON.stringify(new EncryptionService().encryptMessage(JSON.stringify(payload), 'a'.repeat(64)));
      expect(() => decodeDocument({ id: owner, docType: 'title_deed', encryptedPayload,
        createdAt: new Date(), updatedAt: new Date() })).toThrow('Document vault unavailable');
    }
  );
  it.each([{}, [null], [{ mime: 'text/html', base64: 'QQ==' }], [{ mime: 'application/pdf', base64: 'not base64!' }]])(
    'rejects authenticated but malformed original shapes: %j', payload => {
      const encrypted = JSON.stringify(new EncryptionService().encryptMessage(JSON.stringify(payload), 'a'.repeat(64)));
      expect(() => decodeSource(encrypted, 0)).toThrow('Document vault unavailable');
    }
  );

  it.each(['ownerName', 'ownerSharePercent', 'expiryDate'])('rejects reviewed unresolved %s conflicts', field => {
    expect(() => prepareDocument({ ...input, extractedJson: { ...input.extractedJson,
      diagnostics: { fields: { [field]: { state: 'conflict', values: ['ALPHA', 'BETA'] } } },
    } }, owner)).toThrow('Resolve conflicting fields');
  });
  it.each([
    { ...input, reviewConfirmed: false },
    { ...input, extractedJson: { ...input.extractedJson, demoOnly: true } },
    { ...input, extractedJson: { ...input.extractedJson, reviewConfirmed: false } },
  ])('rejects unreviewed and demo payloads', metadata => {
    expect(() => prepareDocument(metadata, owner)).toThrow('Explicit review required');
  });
  it('rejects missing extraction fields and preserves resolved evidence on encrypted roundtrip', () => {
    expect(() => prepareDocument({ ...input, extractedJson: { ...input.extractedJson, missingFields: ['ownerNameEn'] } }, owner)).toThrow('Correct missing fields');
    expect(() => prepareDocument({ ...input, extractedJson: { certificateNumber: '900001/2030' } }, owner)).toThrow('Owner and unit or plot required');
    const extractedJson = { ...input.extractedJson, isBlockchainVerified: true,
      diagnostics: { fields: { ownerName: { state: 'extracted', source: 'review', values: ['TEST OWNER'] } } } };
    const prepared = prepareDocument({ ...input, extractedJson }, owner);
    expect(prepared.encryptedPayload).not.toContain('TEST OWNER');
    const decoded = decodeDocument({ ...prepared, id: owner, createdAt: new Date(), updatedAt: new Date() });
    expect(decoded.extractedJson).toEqual({ ...extractedJson, reviewConfirmed: true, isBlockchainVerified: false });
    expect(decoded.authenticity).toBe('not_verified');
    expect(decoded.expiryStatus).toBe('unknown');
  });
  it.each([
    [Buffer.from('%PDF-1.7\nSYNTHETIC'), 'application/pdf'],
    [Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]), 'image/png'],
    [Buffer.from([255, 216, 255, 0]), 'image/jpeg'],
  ])('roundtrips encrypted %s source bytes and MIME', (bytes, mime) => {
    const prepared = prepareSource([source(bytes, mime)]);
    expect(prepared.encryptedSource).toBeTypeOf('string');
    expect(decodeSource(prepared.encryptedSource!, 0)).toEqual({ mime, bytes });
    expect(() => decodeSource(prepared.encryptedSource!, 1)).toThrow('Original side not found');
  });
  it('roundtrips front/back sources without mixing sides', () => {
    const front = Buffer.from('%PDF-1.7\nFRONT');
    const back = Buffer.from('%PDF-1.7\nBACK');
    const prepared = prepareSource([source(front), source(back)]);
    expect(decodeSource(prepared.encryptedSource!, 0).bytes).toEqual(front);
    expect(decodeSource(prepared.encryptedSource!, 1).bytes).toEqual(back);
  });
  it('rejects mismatched MIME, unsupported signatures, oversized totals and extra sides', () => {
    expect(prepareSource([])).toEqual({});
    expect(() => prepareSource([source(Buffer.from('%PDF-1.7'), 'image/png')])).toThrow('signature');
    expect(() => prepareSource([source(Buffer.from('not a document'))])).toThrow('signature');
    const oversized = Buffer.alloc(maxSourceBytes + 1);
    expect(() => prepareSource([source(oversized)])).toThrow('at most 4 MB');
    const half = source(Buffer.alloc(maxSourceBytes / 2 + 1));
    expect(() => prepareSource([half, half])).toThrow('at most 4 MB');
    const small = source(Buffer.from('%PDF-1.7'));
    expect(() => prepareSource([small, small, small])).toThrow('at most 4 MB');
  });
});
