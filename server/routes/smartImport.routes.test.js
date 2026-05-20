import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockImportSession } = vi.hoisted(() => {
  const fn = vi.fn;

  return {
    mockImportSession: {
      findOne: fn(),
      findOneAndUpdate: fn(),
    },
  };
});

vi.mock('../models/ImportSession.js', () => ({ default: mockImportSession }));
vi.mock('../services/excelImportService.js', () => ({ parseExcelFile: vi.fn() }));
vi.mock('../services/importValidationEngine.js', () => ({
  validateAllRows: vi.fn(),
  detectOrphanedRecords: vi.fn(),
  dryRun: vi.fn(),
}));
vi.mock('../services/importExecutionEngine.js', () => ({ executeImport: vi.fn() }));
vi.mock('../services/deduplicationService.js', () => ({}));

import smartImportRoutes from './smartImport.routes.js';
import * as excelImportService from '../services/excelImportService.js';
import * as importExecutionEngine from '../services/importExecutionEngine.js';

function createApp(user = { id: 'user-1', role: 'admin' }) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    if (user) req.user = user;
    next();
  });
  app.use('/api/inventory/import', smartImportRoutes);
  app.use((err, _req, res, _next) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Smart import ownership guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is missing for session details endpoint', async () => {
    const res = await request(createApp(null)).get(
      '/api/inventory/import/507f1f77bcf86cd799439011'
    );

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(mockImportSession.findOne).not.toHaveBeenCalled();
  });

  it('filters session details by ownership query', async () => {
    mockImportSession.findOne.mockResolvedValue(null);

    const sessionId = '507f1f77bcf86cd799439011';
    const res = await request(createApp()).get(`/api/inventory/import/${sessionId}`);

    expect(res.status).toBe(404);
    expect(mockImportSession.findOne).toHaveBeenCalledWith({
      _id: sessionId,
      $or: [{ userId: 'user-1' }, { importedBy: 'user-1' }],
    });
  });

  it('returns 404 for invalid session id without hitting database', async () => {
    const res = await request(createApp()).get('/api/inventory/import/not-a-valid-objectid');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(mockImportSession.findOne).not.toHaveBeenCalled();
  });

  it('applies ownership filter on mapping update', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOneAndUpdate.mockResolvedValue({
      _id: sessionId,
      columnMapping: { A: 'ownerName' },
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: { A: 'ownerName' } });

    expect(res.status).toBe(200);
    expect(mockImportSession.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: sessionId,
        $or: [{ userId: 'user-1' }, { importedBy: 'user-1' }],
      },
      { columnMapping: { A: 'ownerName' } },
      { new: true }
    );
  });

  it('rejects invalid deduplication strategy on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { A: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ deduplicationStrategy: 'invalid-mode' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid deduplicationStrategy');
    expect(importExecutionEngine.executeImport).not.toHaveBeenCalled();
  });

  it('passes valid deduplication strategy to execution engine', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { A: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValueOnce(session).mockResolvedValueOnce(session);
    excelImportService.parseExcelFile.mockResolvedValue({ data: [], sheetName: 'Sheet1' });
    importExecutionEngine.executeImport.mockResolvedValue({ processedRows: 0, errorsCount: 0 });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ deduplicationStrategy: 'version' });

    expect(res.status).toBe(200);
    expect(importExecutionEngine.executeImport).toHaveBeenCalledWith(
      session._id,
      [],
      expect.objectContaining({ deduplicationStrategy: 'version' })
    );
  });
});
