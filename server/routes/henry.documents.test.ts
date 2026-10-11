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
import { prepareDocument, decodeDocument, documentOwner } from '../services/henry/documentVault';

const owner = '123456789012345678901234';
const other = '223456789012345678901234';
const id = '323456789012345678901234';
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
      data: expect.objectContaining({ ownerUserId: owner }),
    });
    expect(decodeDocument(row).referenceNumber).toBe('123/2026');
    expect(mocks.audit.create).toHaveBeenCalledWith({
      data: { ownerUserId: owner, documentId: id, action: 'save' },
    });
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
  it('scopes list filters and searches decrypted owner-only values', async () => {
    mocks.documents.findMany.mockResolvedValue([
      { ...prepareDocument(input), id, createdAt: new Date(), updatedAt: new Date() },
    ]);
    const response = await request(app()).get('/henry/documents?q=123&ownerUserId=' + other);
    expect(response.body.count).toBe(1);
    expect(mocks.documents.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ownerUserId: owner } })
    );
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
