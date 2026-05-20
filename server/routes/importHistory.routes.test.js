import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const createQueryChain = data => {
  const chain = {
    sort: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    skip: vi.fn(() => chain),
    lean: vi.fn().mockResolvedValue(data),
  };
  return chain;
};

const { mockImportSession, mockPropertyInventory, mockOwnerPropertyMapping, mockAuth } = vi.hoisted(
  () => {
    const fn = vi.fn;
    return {
      mockImportSession: {
        find: fn(() => createQueryChain([])),
        countDocuments: fn().mockResolvedValue(0),
      },
      mockPropertyInventory: {
        countDocuments: fn().mockResolvedValue(0),
      },
      mockOwnerPropertyMapping: {
        countDocuments: fn().mockResolvedValue(0),
        distinct: fn().mockResolvedValue([]),
      },
      mockAuth: (req, _res, next) => {
        req.user = { id: 'user-1', role: 'admin' };
        next();
      },
    };
  }
);

vi.mock('../models/ImportSession.js', () => ({ default: mockImportSession }));
vi.mock('../models/PropertyInventory.js', () => ({ default: mockPropertyInventory }));
vi.mock('../models/OwnerPropertyMapping.js', () => ({ default: mockOwnerPropertyMapping }));
vi.mock('../middleware/auth.ts', () => ({ default: mockAuth }));

import importHistoryRoutes from './importHistory.routes.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', importHistoryRoutes);
  app.use((err, _req, res, _next) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Import history admin dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImportSession.find.mockImplementation(() => createQueryChain([]));
    mockImportSession.countDocuments.mockResolvedValue(0);
    mockPropertyInventory.countDocuments.mockResolvedValue(12);
    mockOwnerPropertyMapping.countDocuments.mockResolvedValue(19);
    mockOwnerPropertyMapping.distinct.mockResolvedValue([
      'owner-1',
      'owner-2',
      'owner-3',
      'owner-4',
      'owner-5',
      'owner-6',
      'owner-7',
    ]);
  });

  it('returns import history for /api/inventory/import/history', async () => {
    const imports = [
      {
        _id: '507f1f77bcf86cd799439011',
        fileName: 'owners.xlsx',
        status: 'completed',
      },
    ];

    mockImportSession.find.mockImplementation(() => createQueryChain(imports));
    mockImportSession.countDocuments.mockResolvedValue(1);

    const res = await request(createApp()).get(
      '/api/inventory/import/history?status=completed&limit=10&offset=0'
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.imports).toEqual([
      expect.objectContaining({
        _id: '507f1f77bcf86cd799439011',
        sessionId: '507f1f77bcf86cd799439011',
        fileName: 'owners.xlsx',
      }),
    ]);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.hasMore).toBe(false);
    expect(mockImportSession.find).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        $or: expect.arrayContaining([{ userId: 'user-1' }, { importedBy: 'user-1' }]),
      })
    );
  });

  it('rejects invalid limit query for import history', async () => {
    const res = await request(createApp()).get('/api/inventory/import/history?limit=0&offset=0');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid limit query param');
    expect(mockImportSession.find).not.toHaveBeenCalled();
  });

  it('rejects invalid offset query for import history', async () => {
    const res = await request(createApp()).get('/api/inventory/import/history?limit=10&offset=-1');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid offset query param');
    expect(mockImportSession.find).not.toHaveBeenCalled();
  });

  it('resolves session errors endpoint by Mongo _id path param', async () => {
    const session = {
      _id: '507f1f77bcf86cd799439011',
      importErrors: [{ row: 1, message: 'Bad row' }],
      totalErrors: 1,
    };

    mockImportSession.findOne = vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue(session),
    });

    const res = await request(createApp()).get(
      '/api/inventory/import/session/507f1f77bcf86cd799439011/errors'
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockImportSession.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        $and: expect.arrayContaining([
          {
            $or: expect.arrayContaining([
              { sessionId: '507f1f77bcf86cd799439011' },
              { _id: '507f1f77bcf86cd799439011' },
            ]),
          },
        ]),
        $or: expect.arrayContaining([{ userId: 'user-1' }, { importedBy: 'user-1' }]),
      })
    );
  });

  it('returns collection stats for the admin dashboard', async () => {
    const res = await request(createApp()).get('/api/admin/dashboard');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.collections).toEqual([
      { name: 'import_sessions', count: 0 },
      { name: 'property_inventory', count: 12 },
      { name: 'owner_property_mappings', count: 19 },
    ]);
    expect(res.body.data.totalProperties).toBe(12);
    expect(res.body.data.totalOwners).toBe(7);
    expect(res.body.data.totalRelationships).toBe(19);
  });

  it('returns importErrors from session errors endpoint', async () => {
    const session = {
      sessionId: 'session-err-1',
      userId: 'user-1',
      importErrors: [{ row: 2, message: 'Missing owner name' }],
      totalErrors: 1,
    };

    mockImportSession.findOne = vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue(session),
    });

    const res = await request(createApp()).get(
      '/api/inventory/import/session/session-err-1/errors'
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.errors).toEqual(session.importErrors);
    expect(res.body.data.totalErrors).toBe(1);
  });

  it('returns importErrors in JSON report payload', async () => {
    const session = {
      sessionId: 'session-report-1',
      userId: 'user-1',
      fileName: 'owners.xlsx',
      status: 'completed',
      importedBy: 'admin',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      totalRows: 10,
      propertiesCreated: 3,
      propertiesUpdated: 1,
      ownersCreated: 2,
      ownersUpdated: 1,
      duplicatesFound: 0,
      successRate: 90,
      totalErrors: 1,
      totalWarnings: 0,
      importErrors: [{ row: 4, message: 'Invalid unit number' }],
    };

    mockImportSession.findOne = vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue(session),
    });

    const res = await request(createApp()).get(
      '/api/inventory/import/session/session-report-1/report?format=json'
    );

    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBe(session.sessionId);
    expect(res.body.errors).toEqual(session.importErrors);
  });
});
