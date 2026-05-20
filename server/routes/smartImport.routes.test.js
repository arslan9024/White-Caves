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
import * as importValidationEngine from '../services/importValidationEngine.js';

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

  it('returns 401 when user is missing for upload endpoint', async () => {
    const res = await request(createApp(null)).post('/api/inventory/import/upload');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Authentication required');
    expect(excelImportService.parseExcelFile).not.toHaveBeenCalled();
  });

  it('returns 400 when upload file is missing', async () => {
    const res = await request(createApp()).post('/api/inventory/import/upload');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('No file provided');
    expect(excelImportService.parseExcelFile).not.toHaveBeenCalled();
  });

  it('returns 400 when upload file extension is not supported', async () => {
    const res = await request(createApp())
      .post('/api/inventory/import/upload')
      .attach('file', Buffer.from('not-an-excel-file'), 'invalid.txt');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Only .xlsx, .xls, and .csv files are supported');
    expect(excelImportService.parseExcelFile).not.toHaveBeenCalled();
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

  it('rejects invalid sheetName payload on preview', async () => {
    const sessionId = '507f1f77bcf86cd799439011';

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/preview`)
      .send({ sheetName: { invalid: true } });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid sheetName payload');
    expect(mockImportSession.findOne).not.toHaveBeenCalled();
    expect(excelImportService.parseExcelFile).not.toHaveBeenCalled();
  });

  it('rejects invalid sheetName payload on validate', async () => {
    const sessionId = '507f1f77bcf86cd799439011';

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/validate`)
      .send({ sheetName: 123 });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid sheetName payload');
    expect(mockImportSession.findOne).not.toHaveBeenCalled();
    expect(excelImportService.parseExcelFile).not.toHaveBeenCalled();
  });

  it('rejects invalid sheetName payload on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ sheetName: ['Sheet1'] });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid sheetName payload');
    expect(mockImportSession.findOne).not.toHaveBeenCalled();
    expect(excelImportService.parseExcelFile).not.toHaveBeenCalled();
  });

  it('rejects invalid dryRun payload on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ dryRun: 'true' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid dryRun payload');
    expect(mockImportSession.findOne).not.toHaveBeenCalled();
    expect(excelImportService.parseExcelFile).not.toHaveBeenCalled();
  });

  it('applies ownership filter on mapping update', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOneAndUpdate.mockResolvedValue({
      _id: sessionId,
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: { P: 'pNumber', A: 'area', N: 'ownerName' } });

    expect(res.status).toBe(200);
    expect(mockImportSession.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: sessionId,
        $or: [{ userId: 'user-1' }, { importedBy: 'user-1' }],
      },
      { columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' } },
      { new: true }
    );
  });

  it('rejects invalid mapping payload on mapping update', async () => {
    const sessionId = '507f1f77bcf86cd799439011';

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: ['ownerName', 'area'] });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid mapping payload');
    expect(mockImportSession.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 for invalid session id on mapping update without hitting database', async () => {
    const res = await request(createApp())
      .post('/api/inventory/import/not-a-valid-objectid/mapping')
      .send({ mapping: { A: 'ownerName' } });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(mockImportSession.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects mapping payload with non-string mapping values', async () => {
    const sessionId = '507f1f77bcf86cd799439011';

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: { A: 123, B: 'area' } });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid mapping payload');
    expect(mockImportSession.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('accepts object mapping payload on mapping update', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOneAndUpdate.mockResolvedValue({
      _id: sessionId,
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: { P: 'pNumber', A: 'area', N: 'ownerName' } });

    expect(res.status).toBe(200);
    expect(mockImportSession.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: sessionId,
        $or: [{ userId: 'user-1' }, { importedBy: 'user-1' }],
      },
      { columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' } },
      { new: true }
    );
  });

  it('normalizes mapping payload keys and values before saving', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const mappingPayload = { ' pNumber ': ' P-NUMBER ', ' area ': ' AREA ', ownerName: ' NAME ' };

    mockImportSession.findOneAndUpdate.mockResolvedValue({
      _id: sessionId,
      columnMapping: { pNumber: 'P-NUMBER', area: 'AREA', ownerName: 'NAME' },
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: mappingPayload });

    expect(res.status).toBe(200);
    expect(mockImportSession.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: sessionId,
        $or: [{ userId: 'user-1' }, { importedBy: 'user-1' }],
      },
      { columnMapping: { pNumber: 'P-NUMBER', area: 'AREA', ownerName: 'NAME' } },
      { new: true }
    );
  });

  it('accepts key-based required mapping payload on mapping update', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const mappingPayload = { ownerName: 'NAME', area: 'AREA', pNumber: 'P-NUMBER' };

    mockImportSession.findOneAndUpdate.mockResolvedValue({
      _id: sessionId,
      columnMapping: mappingPayload,
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: mappingPayload });

    expect(res.status).toBe(200);
    expect(mockImportSession.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: sessionId,
        $or: [{ userId: 'user-1' }, { importedBy: 'user-1' }],
      },
      { columnMapping: mappingPayload },
      { new: true }
    );
  });

  it('accepts required mapping tokens with underscores and hyphens', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const mappingPayload = {
      owner_name: 'NAME',
      'p-number': 'P-NUMBER',
      listing_area: 'AREA',
      area: 'AREA',
    };

    mockImportSession.findOneAndUpdate.mockResolvedValue({
      _id: sessionId,
      columnMapping: mappingPayload,
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: mappingPayload });

    expect(res.status).toBe(200);
    expect(mockImportSession.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: sessionId,
        $or: [{ userId: 'user-1' }, { importedBy: 'user-1' }],
      },
      { columnMapping: mappingPayload },
      { new: true }
    );
  });

  it('rejects mapping payload missing required import fields', async () => {
    const sessionId = '507f1f77bcf86cd799439011';

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/mapping`)
      .send({ mapping: { A: 'ownerName', B: 'area' } });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Mapping is missing required fields');
    expect(mockImportSession.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects invalid deduplication strategy on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
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
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
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

  it('rejects invalid clusterAssignments payload on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ clusterAssignments: ['A', 'B'] });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid clusterAssignments payload');
    expect(importExecutionEngine.executeImport).not.toHaveBeenCalled();
  });

  it('rejects clusterAssignments payload with non-string values on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ clusterAssignments: { P100: 123 } });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid clusterAssignments payload');
    expect(importExecutionEngine.executeImport).not.toHaveBeenCalled();
  });

  it('passes valid clusterAssignments object to execution engine', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValueOnce(session).mockResolvedValueOnce(session);
    excelImportService.parseExcelFile.mockResolvedValue({ data: [], sheetName: 'Sheet1' });
    importExecutionEngine.executeImport.mockResolvedValue({ processedRows: 0, errorsCount: 0 });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ clusterAssignments: { P100: 'Cluster-A' } });

    expect(res.status).toBe(200);
    expect(importExecutionEngine.executeImport).toHaveBeenCalledWith(
      session._id,
      [],
      expect.objectContaining({ clusterAssignments: { P100: 'Cluster-A' } })
    );
  });

  it('rejects invalid validation strategy on validate', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/validate`)
      .send({ strategy: 'super-strict' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid validation strategy');
  });

  it('rejects preview when parser returns non-array preview payload', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
    });
    excelImportService.parseExcelFile.mockResolvedValue({ preview: null, totalRows: 0 });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/preview`)
      .send({});

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('preview must be an array');
  });

  it('returns 400 on preview when requested worksheet is missing', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
    });
    excelImportService.parseExcelFile.mockRejectedValue(new Error('Worksheet not found: Missing'));

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/preview`)
      .send({ sheetName: 'Missing' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Worksheet not found');
  });

  it('rejects validate when parser returns non-array data payload', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
    });
    excelImportService.parseExcelFile.mockResolvedValue({ data: null });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/validate`)
      .send({ strategy: 'balanced' });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('data must be an array');
  });

  it('returns 400 on validate when requested worksheet is missing', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
    });
    excelImportService.parseExcelFile.mockRejectedValue(new Error('Worksheet not found: Missing'));

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/validate`)
      .send({ strategy: 'balanced', sheetName: 'Missing' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Worksheet not found');
  });

  it('rejects invalid validation strategy on dry-run execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ dryRun: true, strategy: 'super-balanced' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid execution strategy');
  });

  it('passes valid validation strategy to dry-run validation engine', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValueOnce(session).mockResolvedValueOnce(session);
    excelImportService.parseExcelFile.mockResolvedValue({
      data: [{ ownerName: 'Nora', area: 'JVC' }],
    });
    importValidationEngine.dryRun.mockResolvedValue({ validation: { isValid: true } });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ dryRun: true, strategy: 'strict' });

    expect(res.status).toBe(200);
    expect(importValidationEngine.dryRun).toHaveBeenCalledWith(
      [{ ownerName: 'Nora', area: 'JVC' }],
      session._id,
      expect.objectContaining({
        strategy: 'strict',
        requiredFields: ['ownerName', 'area', 'pNumber'],
      })
    );
    expect(session.save).not.toHaveBeenCalled();
  });

  it('passes pNumber in requiredFields during validate preflight', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    mockImportSession.findOne.mockResolvedValue({
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
    });
    excelImportService.parseExcelFile.mockResolvedValue({
      data: [{ ownerName: 'Nora', area: 'JVC' }],
    });
    importValidationEngine.validateAllRows.mockResolvedValue({ isValid: true });
    importValidationEngine.detectOrphanedRecords.mockReturnValue([]);

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/validate`)
      .send({ strategy: 'balanced' });

    expect(res.status).toBe(200);
    expect(importValidationEngine.validateAllRows).toHaveBeenCalledWith(
      [{ ownerName: 'Nora', area: 'JVC' }],
      'balanced',
      expect.objectContaining({ requiredFields: ['ownerName', 'area', 'pNumber'] })
    );
  });

  it('rejects invalid execution strategy on non-dry execute', async () => {
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
      .send({ strategy: 'aggressive' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid execution strategy');
    expect(importExecutionEngine.executeImport).not.toHaveBeenCalled();
  });

  it('passes valid execution strategy to execution engine on non-dry execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValueOnce(session).mockResolvedValueOnce(session);
    excelImportService.parseExcelFile.mockResolvedValue({ data: [], sheetName: 'Sheet1' });
    importExecutionEngine.executeImport.mockResolvedValue({ processedRows: 0, errorsCount: 0 });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ strategy: 'lenient' });

    expect(res.status).toBe(200);
    expect(importExecutionEngine.executeImport).toHaveBeenCalledWith(
      session._id,
      [],
      expect.objectContaining({ importStrategy: 'lenient' })
    );
  });

  it('falls back to parser columnMapping when session mapping is incomplete', async () => {
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
    excelImportService.parseExcelFile.mockResolvedValue({
      data: [],
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
    });
    importExecutionEngine.executeImport.mockResolvedValue({ processedRows: 0, errorsCount: 0 });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ strategy: 'balanced' });

    expect(res.status).toBe(200);
    expect(importExecutionEngine.executeImport).toHaveBeenCalledWith(
      session._id,
      [],
      expect.objectContaining({
        columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      })
    );
  });

  it('rejects execute when parser returns non-array data payload', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValue(session);
    excelImportService.parseExcelFile.mockResolvedValue({ data: null });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ strategy: 'balanced' });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('data must be an array');
    expect(importExecutionEngine.executeImport).not.toHaveBeenCalled();
  });

  it('returns 400 on execute when requested worksheet is missing', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValue(session);
    excelImportService.parseExcelFile.mockRejectedValue(new Error('Worksheet not found: Missing'));

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ strategy: 'balanced', sheetName: 'Missing' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Worksheet not found');
    expect(importExecutionEngine.executeImport).not.toHaveBeenCalled();
  });

  it('rejects execute when required mappings are missing in both session and parser outputs', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { A: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValue(session);
    excelImportService.parseExcelFile.mockResolvedValue({
      data: [],
      sheetName: 'Sheet1',
      columnMapping: { AA: 'ownerName', BB: 'listingArea' },
    });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ strategy: 'balanced' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required column mappings missing');
    expect(importExecutionEngine.executeImport).not.toHaveBeenCalled();
  });

  it('prefers valid session columnMapping over parser mapping on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValueOnce(session).mockResolvedValueOnce(session);
    excelImportService.parseExcelFile.mockResolvedValue({
      data: [],
      sheetName: 'Sheet1',
      columnMapping: { pNumber: 'pNumber', area: 'area', ownerName: 'ownerName' },
    });
    importExecutionEngine.executeImport.mockResolvedValue({ processedRows: 0, errorsCount: 0 });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ strategy: 'balanced' });

    expect(res.status).toBe(200);
    expect(importExecutionEngine.executeImport).toHaveBeenCalledWith(
      session._id,
      [],
      expect.objectContaining({
        columnMapping: { P: 'pNumber', A: 'area', N: 'ownerName' },
      })
    );
  });

  it('treats normalized session mapping tokens as complete on execute', async () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const session = {
      _id: sessionId,
      filePath: '/tmp/fake.csv',
      sheetName: 'Sheet1',
      columnMapping: {
        owner_name: 'OWNER NAME',
        'p-number': 'P-NUMBER',
        area: 'LISTING AREA',
      },
      status: 'pending',
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockImportSession.findOne.mockResolvedValueOnce(session).mockResolvedValueOnce(session);
    excelImportService.parseExcelFile.mockResolvedValue({
      data: [],
      sheetName: 'Sheet1',
      columnMapping: { AA: 'ownerName' },
    });
    importExecutionEngine.executeImport.mockResolvedValue({ processedRows: 0, errorsCount: 0 });

    const res = await request(createApp())
      .post(`/api/inventory/import/${sessionId}/execute`)
      .send({ strategy: 'balanced' });

    expect(res.status).toBe(200);
    expect(importExecutionEngine.executeImport).toHaveBeenCalledWith(
      session._id,
      [],
      expect.objectContaining({
        columnMapping: {
          owner_name: 'OWNER NAME',
          'p-number': 'P-NUMBER',
          area: 'LISTING AREA',
        },
      })
    );
  });
});
