import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';

const mocks = vi.hoisted(() => {
  const documents = {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    updateMany: vi.fn(),
    findFirstOrThrow: vi.fn(),
    deleteMany: vi.fn(),
  };
  const audit = { create: vi.fn() };
  const db = {
    henryScannedDocument: documents,
    henryDocumentAudit: audit,
    lead: { findFirst: vi.fn() },
    property: { findFirst: vi.fn() },
    $transaction: vi.fn(),
  };
  return { db, documents, audit };
});
vi.mock('../database.js', () => ({ prisma: mocks.db }));
vi.mock('../middleware/rbac.js', () => ({
  requireMinRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));
import router from './henry';
import { prepareDocument, decodeDocument, decodeSource, documentOwner } from '../services/henry/documentVault';

const owner = '123456789012345678901234';
const other = '223456789012345678901234';
const id = '323456789012345678901234';
const activeFilter = { OR: [{ replacedById: null }, { replacedById: { isSet: false } }] };
const input = {
  docType: 'title_deed',
  reviewConfirmed: true,
  extractedJson: {
    certificateNumber: '123/2026',
    ownerNameEn: 'TEST OWNER',
    plotNumber: '42',
    confidenceScore: 0,
  },
};

const passportFields = {
  passportNumber: 'T12345678', fullName: 'SYNTHETIC TRAVELER', issuingCountryCode: 'UTO',
  dateOfBirth: '02/03/1990', dateOfExpiry: '04/05/2035', gender: '',
  demoOnly: false, reviewConfirmed: true,
};
const tenancyFields = {
  contractReference: 'SOURCE-42', landlord: { name: 'SYNTHETIC LESSOR' }, tenant: { name: 'SYNTHETIC OCCUPANT' },
  property: { buildingName: 'TEST BUILDING', propertyNumber: '42' },
  financials: { periodFrom: '01/01/2027', periodTo: '31/12/2027', annualRentAed: 60000, securityDepositAed: 3000 },
  demoOnly: false, reviewConfirmed: true,
};

describe('passport and tenancy type-specific vault validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('ENCRYPTION_KEY', 'a'.repeat(64));
    vi.stubEnv('DATABASE_URL', 'mongodb://localhost/test');
    mocks.db.$transaction.mockImplementation(async callback => callback(mocks.db));
    mocks.audit.create.mockResolvedValue({});
  });
  it('accepts reviewed source-shaped passport and safe contract-reference fallback', () => {
    const passport = prepareDocument({ docType: 'passport', reviewConfirmed: true, extractedJson: passportFields }, owner);
    expect(passport.docType).toBe('passport');
    const tenancy = prepareDocument({ docType: 'tenancy_contract', reviewConfirmed: true, extractedJson: tenancyFields }, owner);
    expect(tenancy.docType).toBe('tenancy_contract');
    expect(tenancy.expiryAt?.toISOString()).toBe('2027-12-31T00:00:00.000Z');
  });

  it('rejects demo/missing review, malformed identity and conflicting passport references', () => {
    for (const patch of [
      { demoOnly: true }, { demoOnly: undefined }, { reviewConfirmed: false }, { fullName: '' },
      { passportNumber: '123' }, { dateOfBirth: '31/02/1990' }, { dateOfExpiry: '35/01/2035' },
      { gender: 'unknown' }, { dateOfIssue: '01/01/2080' },
    ]) expect(() => prepareDocument({ docType: 'passport', reviewConfirmed: true, extractedJson: { ...passportFields, ...patch } }, owner)).toThrow();
    expect(() => prepareDocument({ docType: 'passport', reviewConfirmed: true, referenceNumber: 'OTHER', extractedJson: passportFields }, owner)).toThrow();
  });

  it('rejects expired passports without exact expiry acknowledgment', () => {
    const fields = { ...passportFields, dateOfExpiry: '01/01/2020' };
    expect(() => prepareDocument({ docType: 'passport', reviewConfirmed: true, extractedJson: fields }, owner)).toThrow('acknowledgment');
    expect(prepareDocument({ docType: 'passport', reviewConfirmed: true, extractedJson: { ...fields, expiryAcknowledgedFor: fields.dateOfExpiry } }, owner).docType).toBe('passport');
  });

  it('rejects absent parties, property, source reference, invalid periods and amounts', () => {
    for (const patch of [
      { landlord: {} }, { tenant: {} }, { property: {} }, { contractReference: '' },
      { property: { ...tenancyFields.property, areaSqM: -1 } },
      { property: { ...tenancyFields.property, usage: 'invalid' } },
      { financials: { ...tenancyFields.financials, periodTo: '01/01/2026' } },
      { financials: { ...tenancyFields.financials, annualRentAed: 0 } },
      { financials: { ...tenancyFields.financials, securityDepositAed: -1 } },
      { demoOnly: true }, { reviewConfirmed: false },
    ]) expect(() => prepareDocument({ docType: 'tenancy_contract', reviewConfirmed: true,
      extractedJson: { ...tenancyFields, ...patch } }, owner)).toThrow();
  });

  it('requires originals for new passport and tenancy saves', async () => {
    for (const [docType, extractedJson] of [['passport', passportFields], ['tenancy_contract', tenancyFields]]) {
      const response = await request(app()).post('/henry/documents/save').send({ docType, reviewConfirmed: true, extractedJson });
      expect(response.status).toBe(400);
      expect(mocks.documents.create).not.toHaveBeenCalled();
    }
  });

  it.each(['passport', 'tenancy_contract'])('persists reviewed %s metadata and original encrypted in an owner-scoped transaction', async docType => {
    mocks.documents.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) =>
      ({ ...data, id, createdAt: new Date(), updatedAt: new Date() }));
    const extractedJson = docType === 'passport' ? passportFields : tenancyFields;
    const original = Buffer.from('%PDF-1.7 synthetic original');
    const response = await request(app()).post('/henry/documents/save')
      .field('metadata', JSON.stringify({ docType, reviewConfirmed: true, extractedJson }))
      .attach('source', original, { filename: 'source.pdf', contentType: 'application/pdf' });
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ docType, hasOriginal: true, extractedJson });
    const saved = mocks.documents.create.mock.calls[0]![0].data;
    expect(saved.ownerUserId).toBe(owner);
    expect(saved.encryptedPayload).not.toContain('SYNTHETIC');
    expect(saved.encryptedSource).not.toContain(original.toString('base64'));
    expect(decodeSource(saved.encryptedSource, 0).bytes).toEqual(original);
    expect(mocks.audit.create).toHaveBeenCalledWith({ data: { ownerUserId: owner, documentId: id, action: 'save' } });
  });
});

function app(userId = owner) {
  const instance = express();
  instance.use(express.json());
  instance.use((req, _res, next) => {
    Object.assign(req, { user: { id: userId } });
    next();
  });
  instance.use('/henry', router);
  instance.use(
    (error: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) =>
      res.status(error.statusCode || 500).json({ success: false, error: error.message })
  );
  return instance;
}

describe('Henry persistent owner-scoped vault', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('ENCRYPTION_KEY', 'a'.repeat(64));
    vi.stubEnv('DATABASE_URL', 'mongodb://localhost/test');
    mocks.db.$transaction.mockImplementation(async callback => callback(mocks.db));
    mocks.documents.findMany.mockResolvedValue([]);
    mocks.documents.findFirst.mockResolvedValue(null);
    mocks.audit.create.mockResolvedValue({});
  });
  it('encrypts PII and retrieves it only by authenticated owner', async () => {
    const prepared = prepareDocument(input);
    expect(prepared.encryptedPayload).not.toContain('TEST OWNER');
    const row = { ...prepared, id, createdAt: new Date(), updatedAt: new Date() };
    mocks.documents.create.mockResolvedValue(row);
    const response = await request(app()).post('/henry/documents/save').send(input);
    expect(response.status).toBe(200);
    expect(mocks.documents.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ ownerUserId: owner, replacedById: null, expiryAt: null }),
    });
    expect(decodeDocument(row).referenceNumber).toBe('123/2026');
    expect(mocks.audit.create).toHaveBeenCalledWith({
      data: { ownerUserId: owner, documentId: id, action: 'save' },
    });
  });
  it.each(['ownerName', 'fullName', 'expiryDate', 'nationality'])('rejects unresolved %s conflicts despite explicit review', async field => {
      const response = await request(app()).post('/henry/documents/save').send({
        ...input, extractedJson: { ...input.extractedJson, missingFields: [], reviewConfirmed: true,
          diagnostics: { fields: { [field]: { state: 'conflict', source: 'text', values: ['TEST ALPHA', 'TEST BETA'] } } } },
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Resolve conflicting fields');
      expect(mocks.documents.create).not.toHaveBeenCalled();
      expect(mocks.documents.updateMany).not.toHaveBeenCalled();
    });
    it.each([null, [], 'invalid', { fields: null }, { fields: [] }, { fields: { ownerName: null } }, { fields: { ownerName: { state: 'resolved' } } }])('rejects malformed diagnostics before persistence: %j', async diagnostics => {
        const response = await request(app()).post('/henry/documents/save').send({
          ...input, extractedJson: { ...input.extractedJson, diagnostics },
        });
        expect(response.status).toBe(400);
        expect(mocks.documents.create).not.toHaveBeenCalled();
      });
    it('accepts valid reviewed evidence after conflicts are resolved', () => {
      expect(() => prepareDocument({ ...input, extractedJson: { ...input.extractedJson,
        diagnostics: { fields: { ownerName: { state: 'extracted', source: 'review', values: ['TEST OWNER'] } } },
      } })).not.toThrow();
    });
  it('fails closed for missing key/DB or invalid authenticated owner', async () => {
    vi.stubEnv('ENCRYPTION_KEY', '');
    expect((await request(app()).get('/henry/documents')).status).toBe(503);
    vi.stubEnv('ENCRYPTION_KEY', 'a'.repeat(64));
    vi.stubEnv('DATABASE_URL', '');
    expect(() => prepareDocument(input)).toThrow('not configured');
    expect(() => documentOwner()).toThrow('owner required');
    expect(mocks.documents.findMany).not.toHaveBeenCalled();
  });
  it.each([
    '/henry/documents/' + id,
    '/henry/documents/' + id + '/download',
    '/henry/documents/latest/title_deed',
  ])('does not disclose another owner document through %s', async route => {
    expect((await request(app(other)).get(route)).status).toBe(404);
    expect(mocks.documents.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ ownerUserId: other }) })
    );
  });
  it('masks list payloads and uses bounded owner-specific exact reference search', async () => {
    mocks.documents.findMany.mockResolvedValue([
      { ...prepareDocument(input), id, createdAt: new Date(), updatedAt: new Date() },
    ]);
    const response = await request(app()).post('/henry/documents/search').send({ referenceNumber: '123/2026', docType: 'title_deed', ownerUserId: other });
    expect(response.body.count).toBe(1);
    expect(response.body.data[0].referenceNumber).toBe('••••2026');
    expect(response.body.data[0].extractedJson).toBeUndefined();
    expect(response.body.data[0].clientName).toBeUndefined();
    expect(mocks.documents.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ ownerUserId: owner, referenceHash: expect.any(String), ...activeFilter }), take: 51, skip: 0 })
    );
    expect((await request(app()).get('/henry/documents?q=123')).status).toBe(400);
  });
  it('rejects identity references in GET URLs with a POST instruction', async () => {
    const response = await request(app()).get('/henry/documents?referenceNumber=123%2F2026&docType=title_deed');
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('POST /documents/search');
    expect(mocks.documents.findMany).not.toHaveBeenCalled();
  });
  it('includes legacy missing replacement and expiry fields without combining their OR clauses', async () => {
    const response = await request(app()).get('/henry/documents?expiryStatus=unknown');
    expect(response.status).toBe(200);
    expect(mocks.documents.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { ownerUserId: owner, ...activeFilter, AND: [{ OR: [{ expiryAt: null }, { expiryAt: { isSet: false } }] }] },
    }));
  });
  it('uses legacy-compatible active predicates for latest and both update steps', async () => {
    const row = { ...prepareDocument(input, owner), id, createdAt: new Date(), updatedAt: new Date() };
    mocks.documents.findFirst.mockResolvedValue(row);
    mocks.documents.updateMany.mockResolvedValue({ count: 1 });
    mocks.documents.findFirstOrThrow.mockResolvedValue(row);
    expect((await request(app()).get('/henry/documents/latest/title_deed')).status).toBe(200);
    expect(mocks.documents.findFirst).toHaveBeenCalledWith({
      where: { ownerUserId: owner, docType: 'title_deed', ...activeFilter }, orderBy: { createdAt: 'desc' },
    });
    expect((await request(app()).patch(`/henry/documents/${id}`).send(input)).status).toBe(200);
    expect(mocks.documents.findFirst).toHaveBeenCalledWith({
      where: { id, ownerUserId: owner, docType: 'title_deed', ...activeFilter },
    });
    expect(mocks.documents.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id, ownerUserId: owner, updatedAt: row.updatedAt, ...activeFilter },
    }));
  });
  it('preserves omitted CRM links and originals while reopening reminders after corrected expiry', async () => {
    const original = { ...prepareDocument(input, owner), id, leadId: other, propertyId: owner,
      encryptedSource: 'opaque-original', expiryAt: new Date('2030-01-01T00:00:00Z'),
      reminderDismissedAt: new Date(), createdAt: new Date(), updatedAt: new Date() };
    mocks.documents.findFirst.mockResolvedValue(original);
    mocks.documents.updateMany.mockResolvedValue({ count: 1 });
    mocks.documents.findFirstOrThrow.mockResolvedValue(original);
    expect((await request(app()).patch(`/henry/documents/${id}`).send(input)).status).toBe(200);
    const args = mocks.documents.updateMany.mock.calls[0][0];
    expect(args.where.updatedAt).toEqual(original.updatedAt);
    expect(args.data).not.toHaveProperty('leadId');
    expect(args.data).not.toHaveProperty('propertyId');
    expect(args.data).not.toHaveProperty('encryptedSource');
    expect(args.data.reminderDismissedAt).toBeNull();
  });
  it('allows explicitly clearing links without reopening unchanged expiry reminders', async () => {
    const row = { ...prepareDocument(input, owner), id, createdAt: new Date(), updatedAt: new Date() };
    mocks.documents.findFirst.mockResolvedValue(row);
    mocks.documents.updateMany.mockResolvedValue({ count: 1 });
    mocks.documents.findFirstOrThrow.mockResolvedValue(row);
    expect((await request(app()).patch(`/henry/documents/${id}`).send({ ...input, leadId: null })).status).toBe(200);
    const data = mocks.documents.updateMany.mock.calls[0][0].data;
    expect(data.leadId).toBeNull();
    expect(data).not.toHaveProperty('propertyId');
    expect(data).not.toHaveProperty('reminderDismissedAt');
  });
  it('rejects a concurrent correction without writing an audit', async () => {
    mocks.documents.findFirst.mockResolvedValue({
      ...prepareDocument(input, owner), id, createdAt: new Date(), updatedAt: new Date(),
    });
    mocks.documents.updateMany.mockResolvedValue({ count: 0 });
    expect((await request(app()).patch(`/henry/documents/${id}`).send(input)).status).toBe(409);
    expect(mocks.audit.create).not.toHaveBeenCalled();
  });
  it.each([`/henry/documents/${id}`, '/henry/documents/latest/title_deed', '/henry/documents'])(
    'returns no parser details when encrypted metadata is malformed through %s', async route => {
      const row = { id, docType: 'title_deed', encryptedPayload: '{PRIVATE MALFORMED DATA',
        createdAt: new Date(), updatedAt: new Date() };
      mocks.documents.findFirst.mockResolvedValue(row);
      mocks.documents.findMany.mockResolvedValue([row]);
      const response = await request(app()).get(route);
      expect(response.status).toBe(503);
      expect(response.body.error).toBe('Document vault unavailable');
    }
  );
  it('keeps missing and invalid expiry dates unknown rather than rolling invalid dates forward', () => {
    for (const expiryDate of [undefined, '31/02/2027', 'not a date']) {
      const prepared = prepareDocument({ ...input, extractedJson: { ...input.extractedJson, expiryDate } });
      expect(prepared.expiryAt).toBeNull();
      expect(decodeDocument({ ...prepared, id, createdAt: new Date(), updatedAt: new Date() }).expiryStatus).toBe('unknown');
    }
  });
  it('encrypts original bytes and serves authenticated binary attachments only', async () => {
    mocks.documents.create.mockImplementation(async ({ data }) => ({ ...data, id, createdAt: new Date(), updatedAt: new Date() }));
    const bytes = Buffer.from('%PDF-1.7\nTEST ORIGINAL');
    const response = await request(app()).post('/henry/documents/save')
      .field('metadata', JSON.stringify(input)).attach('source', bytes, { filename: 'source.pdf', contentType: 'application/pdf' });
    expect(response.status).toBe(200);
    const saved = mocks.documents.create.mock.calls[0][0].data;
    expect(saved.encryptedSource).not.toContain('TEST ORIGINAL');
    expect(response.body.data.hasOriginal).toBe(true);
    mocks.documents.findFirst.mockResolvedValue({ ...saved, id });
    const download = await request(app()).get(`/henry/documents/${id}/download`);
    expect(download.status).toBe(200);
    expect(download.headers['content-type']).toContain('application/pdf');
    expect(download.body).toEqual(bytes);
    expect(download.headers['cache-control']).toBe('no-store');
    expect(mocks.documents.findFirst).toHaveBeenCalledWith({ where: { id, ownerUserId: owner } });
  });
  it('rejects mismatched original signatures before persistence', async () => {
    const response = await request(app()).post('/henry/documents/save')
      .field('metadata', JSON.stringify(input)).attach('source', Buffer.from('not a PDF'), { filename: 'source.pdf', contentType: 'application/pdf' });
    expect(response.status).toBe(400);
    expect(mocks.documents.create).not.toHaveBeenCalled();
  });
  it('releases only the selected active reference transactionally before same-reference replacement', async () => {
    const previous = { ...prepareDocument(input, owner), id, createdAt: new Date(), updatedAt: new Date() };
    mocks.documents.findFirst.mockResolvedValue(previous);
    mocks.documents.updateMany.mockResolvedValue({ count: 1 });
    mocks.documents.create.mockResolvedValue({ ...previous, id: other });
    const response = await request(app()).post('/henry/documents/save').send({ ...input, replacesId: id });
    expect(response.status).toBe(200);
    expect(mocks.documents.updateMany).toHaveBeenNthCalledWith(1, {
      where: { id, ownerUserId: owner, ...activeFilter, referenceHash: previous.referenceHash },
      data: { referenceHash: `archived:${id}` },
    });
    expect(mocks.documents.create).toHaveBeenCalledWith({ data: expect.objectContaining({ referenceHash: previous.referenceHash }) });
    expect(mocks.documents.findFirst).toHaveBeenCalledWith({
      where: { id, ownerUserId: owner, docType: 'title_deed', ...activeFilter },
    });
    expect(mocks.documents.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id, ownerUserId: owner, ...activeFilter }, data: { replacedById: other },
    });
    expect(mocks.db.$transaction).toHaveBeenCalledOnce();
  });
  it('reports missing originals and scopes reminder updates', async () => {
    mocks.documents.findFirst.mockResolvedValue({ ...prepareDocument(input, owner), id, createdAt: new Date(), updatedAt: new Date() });
    expect((await request(app()).get(`/henry/documents/${id}/download`)).status).toBe(404);
    mocks.documents.updateMany.mockResolvedValue({ count: 0 });
    expect((await request(app()).patch(`/henry/documents/${id}/reminder`).send({ dismissed: true })).status).toBe(404);
    expect(mocks.documents.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id, ownerUserId: owner, ...activeFilter } }));
  });
  it('requires explicit deletion and deletes only one owner-scoped ID with audit', async () => {
    expect((await request(app()).delete(`/henry/documents/${id}`).send({})).status).toBe(400);
    expect(mocks.documents.deleteMany).not.toHaveBeenCalled();
    mocks.documents.deleteMany.mockResolvedValue({ count: 1 });
    expect((await request(app()).delete(`/henry/documents/${id}`).send({ confirmDocumentId: id })).status).toBe(200);
    expect(mocks.documents.deleteMany).toHaveBeenCalledWith({ where: { id, ownerUserId: owner } });
    expect(mocks.audit.create).toHaveBeenCalledWith({ data: { ownerUserId: owner, documentId: id, action: 'user_requested_delete' } });
  });
  it('rejects unreviewed/demo saves and database duplicate conflicts', async () => {
    expect(
      (
        await request(app())
          .post('/henry/documents/save')
          .send({ ...input, reviewConfirmed: false })
      ).status
    ).toBe(400);
    expect(
      (
        await request(app())
          .post('/henry/documents/save')
          .send({ ...input, extractedJson: { ...input.extractedJson, demoOnly: true } })
      ).status
    ).toBe(400);
    mocks.documents.create.mockRejectedValue({ code: 'P2002' });
    expect((await request(app()).post('/henry/documents/save').send(input)).status).toBe(409);
  });
  it('rejects CRM links and updates/replacements outside owner scope', async () => {
    mocks.db.lead.findFirst.mockResolvedValue(null);
    expect(
      (
        await request(app())
          .post('/henry/documents/save')
          .send({ ...input, leadId: id })
      ).status
    ).toBe(404);
    expect(
      (
        await request(app())
          .patch('/henry/documents/' + id)
          .send(input)
      ).status
    ).toBe(404);
    expect(
      (
        await request(app())
          .post('/henry/documents/save')
          .send({ ...input, replacesId: id })
      ).status
    ).toBe(404);
    expect(mocks.documents.updateMany).not.toHaveBeenCalled();
  });
  it('reports expiry and replacements without claiming authenticity', () => {
    const prepared = prepareDocument({
      docType: 'emirates_id',
      reviewConfirmed: true,
      extractedJson: {
        idNumber: '784-1990-1234567-1',
        fullNameEn: 'TEST PERSON',
        expiryDate: '01/01/2020',
        expiryAcknowledgedFor: '01/01/2020',
      },
    });
    const decoded = decodeDocument({
      ...prepared,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      replacedById: other,
    });
    expect(decoded.expiryStatus).toBe('expired');
    expect(decoded.replacedById).toBe(other);
    expect(decoded.authenticity).toBe('not_verified');
  });
});
