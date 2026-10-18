// @vitest-environment node
import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const holder = vi.hoisted(() => ({ client: null as PrismaClient | null }));
vi.mock('../database.js', () => ({ get prisma() { return holder.client; } }));
// Auth identities are injected; these tests exercise real DB isolation, not authentication.
vi.mock('../middleware/rbac.js', () => ({
  requireMinRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

const url = process.env.HENRY_TEST_DATABASE_URL;
const owner = randomBytes(12).toString('hex');
const other = randomBytes(12).toString('hex');
const createdIds: string[] = [];
let api: express.Express;
let stranger: express.Express;
let firstId: string;
let replacementId: string;
const reference = `synthetic-${randomBytes(12).toString('hex')}`;
const input = {
  docType: 'title_deed', reviewConfirmed: true,
  extractedJson: { certificateNumber: reference, ownerNameEn: 'SYNTHETIC OWNER', plotNumber: '42' },
};

describe.skipIf(!url)('Henry opt-in isolated MongoDB integration (real Prisma; synthetic documents)', () => {
  beforeAll(async () => {
    // No generic DATABASE_URL fallback; reject non-local or ambiguously named databases.
    let parsed: URL;
    try { parsed = new URL(url!); }
    catch { throw new Error('Invalid Henry test database URL; value withheld.'); }
    if (parsed.protocol !== 'mongodb:' || !['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname) ||
      !/^\/henry_test_[a-z0-9_]+$/.test(parsed.pathname) || process.env.NODE_ENV === 'production')
      throw new Error('Henry integration requires a local mongodb:// URL and isolated henry_test_* database, never production.');
    vi.stubEnv('DATABASE_URL', url!);
    vi.stubEnv('ENCRYPTION_KEY', randomBytes(32).toString('hex'));
    holder.client = new PrismaClient({ datasources: { db: { url: url! } } });
    await holder.client.$connect();
    const { default: router } = await import('./henry');
    const app = (identity: string) => {
      const instance = express();
      instance.use(express.json());
      instance.use((req, _res, next) => { Object.assign(req, { user: { id: identity } }); next(); });
      instance.use('/henry', router);
      instance.use((error: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
        res.status(error.statusCode || 500).json({ error: error.message });
      });
      return instance;
    };
    api = app(owner);
    stranger = app(other);
  });
  afterAll(async () => {
    try {
      // Preserve by default. Cleanup needs explicit opt-in and targets only this run's IDs/owner.
      if (holder.client && process.env.HENRY_TEST_CLEANUP === '1' && createdIds.length) {
        await holder.client.henryDocumentAudit.deleteMany({ where: { ownerUserId: owner, documentId: { in: createdIds } } });
        await holder.client.henryScannedDocument.deleteMany({ where: { ownerUserId: owner, id: { in: createdIds } } });
      }
    } finally {
      await holder.client?.$disconnect();
      vi.unstubAllEnvs();
    }
  });
  it('saves encrypted original and fields, isolates owners, replaces transactionally, rolls back and reloads', async () => {
    const bytes = Buffer.from('%PDF-1.7\nSYNTHETIC ORIGINAL');
    const save = await request(api).post('/henry/documents/save')
      .field('metadata', JSON.stringify(input)).attach('source', bytes, { filename: 'synthetic.pdf', contentType: 'application/pdf' });
    expect(save.status).toBe(200);
    firstId = save.body.data.id as string;
    createdIds.push(firstId);
    const row = await holder.client!.henryScannedDocument.findUniqueOrThrow({ where: { id: firstId } });
    expect(JSON.stringify(row)).not.toContain('SYNTHETIC');
    expect(row.encryptedSource).toBeTruthy();
    expect((await request(stranger).get(`/henry/documents/${firstId}`)).status).toBe(404);
    expect((await request(stranger).get(`/henry/documents/${firstId}/download`)).status).toBe(404);
    expect((await request(api).get(`/henry/documents/${firstId}`)).body.data.extractedJson.ownerNameEn).toBe('SYNTHETIC OWNER');
    const replace = await request(api).post('/henry/documents/save').send({ ...input, replacesId: firstId });
    expect(replace.status).toBe(200);
    replacementId = replace.body.data.id as string;
    createdIds.push(replacementId);
    expect((await holder.client!.henryScannedDocument.findUniqueOrThrow({ where: { id: firstId } })).replacedById).toBe(replacementId);
    const rollbackId = randomBytes(12).toString('hex');
    await expect(holder.client!.$transaction(async tx => {
      await tx.henryScannedDocument.update({ where: { id: replacementId }, data: { referenceHash: `rollback:${rollbackId}` } });
      await tx.henryDocumentAudit.create({ data: { ownerUserId: owner, documentId: replacementId, action: `rollback:${rollbackId}` } });
      throw new Error('Intentional synthetic rollback');
    })).rejects.toThrow('Intentional synthetic rollback');
    expect((await holder.client!.henryScannedDocument.findUniqueOrThrow({ where: { id: replacementId } })).referenceHash).toBe(row.referenceHash);
    expect(await holder.client!.henryDocumentAudit.count({ where: { ownerUserId: owner, action: `rollback:${rollbackId}` } })).toBe(0);
    await holder.client!.$disconnect();
    holder.client = new PrismaClient({ datasources: { db: { url: url! } } });
    await holder.client.$connect();
    expect((await request(api).get(`/henry/documents/${replacementId}`)).status).toBe(200);
    expect((await request(api).get(`/henry/documents/${firstId}/download`)).body).toEqual(bytes);
  }, 30000);
});
