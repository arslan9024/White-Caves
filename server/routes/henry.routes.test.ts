/**
 * Henry Document Hub — Route Tests
 *
 * Covers all 15 Henry endpoints following the Nadia/Linda test pattern.
 * All external deps (Prisma, env, RBAC, compliance engine, AI services) are mocked.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

// ─── Hoisted mocks ─────────────────────────────────────────────────────────

const mockRecords: Array<Record<string, unknown>> = [];

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const records: Array<Record<string, unknown>> = [];

  const henryRecord = {
    findMany: fn(async ({ skip = 0, take = 50 }: { skip?: number; take?: number } = {}) =>
      records.slice(skip, skip + take)
    ),
    count: fn(async () => records.length),
    create: fn(async ({ data }: { data: Record<string, unknown> }) => {
      const created = { id: 'hr-1', createdAt: new Date(), updatedAt: new Date(), ...data };
      records.push(created);
      return created;
    }),
    findUnique: fn(
      async ({ where }: { where: { id: string } }) =>
        records.find(r => r['id'] === where.id) ?? null
    ),
    update: fn(
      async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        const idx = records.findIndex(r => r['id'] === where.id);
        if (idx < 0) return null;
        const updated = { ...records[idx], ...data, updatedAt: new Date() };
        records[idx] = updated;
        return updated;
      }
    ),
    delete: fn(async ({ where }: { where: { id: string } }) => {
      const idx = records.findIndex(r => r['id'] === where.id);
      if (idx < 0) return null;
      const [deleted] = records.splice(idx, 1);
      return deleted;
    }),
  };

  return { mockPrisma: { henryRecord }, _testRecords: records };
});

const { mockEvaluateCompliance, mockGetComplianceSummary } = vi.hoisted(() => ({
  mockEvaluateCompliance: vi.fn(() => ({
    templateKey: 'tenancy_contract',
    passedCount: 8,
    warningCount: 1,
    errorCount: 0,
    totalRules: 9,
    isCompliant: true,
    results: [],
    evaluatedAt: new Date(),
  })),
  mockGetComplianceSummary: vi.fn(() => ({
    tenancy_contract: { total: 9 },
    booking_form: { total: 5 },
  })),
}));

const { mockGenerateDocumentDraft } = vi.hoisted(() => ({
  mockGenerateDocumentDraft: vi.fn(async () => ({
    content: 'TENANCY CONTRACT DRAFT...',
    templateKey: 'tenancy_contract',
    generatedAt: new Date().toISOString(),
  })),
}));

const { mockSubmitToEjari } = vi.hoisted(() => ({
  mockSubmitToEjari: vi.fn(async () => ({
    success: true,
    ejariNumber: 'EJARI-2026-001',
    submittedAt: new Date().toISOString(),
  })),
}));

const { mockGenerateMultiLangContract } = vi.hoisted(() => ({
  mockGenerateMultiLangContract: vi.fn(async () => ({
    english: 'This agreement...',
    arabic: 'هذه الاتفاقية...',
    generatedAt: new Date().toISOString(),
  })),
}));

const { mockEmitEvent } = vi.hoisted(() => ({
  mockEmitEvent: vi.fn(),
}));

// ─── Module mocks ──────────────────────────────────────────────────────────

vi.mock('../database.js', () => ({ prisma: mockPrisma }));

vi.mock('../config/env.js', () => ({
  HENRY_UPLOADS_PATH: '/tmp/henry-test-uploads',
  OLLAMA_HOST: 'http://localhost:11434',
  GROQ_API_KEY: '',
}));

vi.mock('../middleware/rbac.js', () => ({
  requireMinRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../middleware/errorHandler.js', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: unknown) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(
      (fn as (req: Request, res: Response, next: NextFunction) => unknown)(req, res, next)
    ).catch(next),
}));

vi.mock('../services/henry/complianceEngine.js', () => ({
  evaluateCompliance: mockEvaluateCompliance,
  getComplianceSummary: mockGetComplianceSummary,
}));

vi.mock('../services/henry/aiDocumentDrafter.js', () => ({
  generateDocumentDraft: mockGenerateDocumentDraft,
}));

vi.mock('../services/henry/ejariService.js', () => ({
  submitToEjari: mockSubmitToEjari,
}));

vi.mock('../services/henry/multiLangContract.js', () => ({
  generateMultiLangContract: mockGenerateMultiLangContract,
}));

vi.mock('../services/orchestrator/AssistantOrchestrator.js', () => ({
  assistantOrchestrator: { emitEvent: mockEmitEvent },
}));

// multer: skip actual disk storage, just attach file info pointing to a real temp file
vi.mock('multer', () => {
  const diskStorage = vi.fn(() => ({}));
  const multerFn = vi.fn(() => ({
    single: vi.fn(
      () =>
        (
          req: Request & { file?: object; body?: Record<string, unknown> },
          _res: Response,
          next: NextFunction
        ) => {
          // For testing, simulate the multer middleware
          // In a real test, we'd need busboy, but for simplicity, we'll intercept form fields
          // stored by the test infrastructure
          const testFields = (global as any).__testFormFields || {};
          req.body = { ...(req.body || {}), ...testFields };
          req.file = {
            fieldname: 'pdf',
            originalname: 'test.pdf',
            mimetype: 'application/pdf',
            // Real source file — created in beforeEach for the file-upload describe block
            path: '/tmp/henry-test-uploads/source.pdf',
            size: 12,
            filename: 'source.pdf',
          };
          next();
        }
    ),
  }));
  (multerFn as unknown as Record<string, unknown>).diskStorage = diskStorage;
  return { default: multerFn };
});

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    existsSync: vi.fn(() => true),
    createReadStream: vi.fn(() => ({ pipe: vi.fn() })),
  };
});

// ─── App factory ───────────────────────────────────────────────────────────

async function createApp() {
  const { default: henryRoutes } = await import('./henry.js');
  const app = express();
  app.use(express.json());

  // Middleware to capture multipart form fields for testing
  app.use(
    (
      req: Request & {
        user?: { id: string; role: string; email: string };
        _testFields?: Record<string, any>;
      },
      _res,
      next
    ) => {
      req.user = { id: 'u-test', role: 'owner', email: 'owner@whitecaves.ae' };
      // Store fields captured by multer mock
      if ((req as any).__testFields) {
        req.body = { ...(req.body || {}), ...(req as any).__testFields };
      }
      next();
    }
  );

  app.use('/api/henry', henryRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode ?? 500).json({ success: false, error: err.message });
    }
  );
  return app;
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('Henry routes — health', () => {
  it('GET /health returns 200 with service info', async () => {
    const app = await createApp();
    const res = await request(app).get('/api/henry/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, service: 'henry' });
  });
});

describe('Henry routes — records CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRecords.length = 0;

    mockPrisma.henryRecord.findMany.mockResolvedValue([]);
    mockPrisma.henryRecord.count.mockResolvedValue(0);
    mockPrisma.henryRecord.create.mockResolvedValue({
      id: 'hr-1',
      title: 'Tenancy Agreement - Villa 12',
      fileType: 'tenancy_agreement',
      status: 'active',
      tags: ['2026'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockPrisma.henryRecord.findUnique.mockResolvedValue({
      id: 'hr-1',
      title: 'Tenancy Agreement - Villa 12',
      status: 'active',
    });
    mockPrisma.henryRecord.update.mockResolvedValue({
      id: 'hr-1',
      isDraft: false,
      status: 'signed',
      signedAt: new Date(),
      updatedAt: new Date(),
    });
    mockPrisma.henryRecord.delete.mockResolvedValue({ id: 'hr-1' });
  });

  it('GET /records returns 200 with paginated records', async () => {
    const app = await createApp();
    mockPrisma.henryRecord.findMany.mockResolvedValue([
      { id: 'hr-1', title: 'Test Doc', fileType: 'tenancy_agreement', status: 'active', tags: [] },
    ]);
    mockPrisma.henryRecord.count.mockResolvedValue(1);

    const res = await request(app).get('/api/henry/records');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('GET /records supports search query param', async () => {
    const app = await createApp();
    mockPrisma.henryRecord.findMany.mockResolvedValue([]);
    mockPrisma.henryRecord.count.mockResolvedValue(0);

    const res = await request(app).get('/api/henry/records?search=villa&type=tenancy_agreement');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /records supports department and owner filters', async () => {
    const app = await createApp();
    mockPrisma.henryRecord.findMany.mockResolvedValue([]);
    mockPrisma.henryRecord.count.mockResolvedValue(0);

    const res = await request(app).get(
      '/api/henry/records?departmentTag=legal&ownerUserEmail=owner%40whitecaves.ae&status=signed'
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /records creates a new record and returns 201', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/henry/records').send({
      templateKey: 'tenancy_contract',
      fileName: 'agreement.pdf',
      templateLabel: 'Tenancy Contract',
      tenantName: 'John Smith',
      departmentTag: 'legal',
      ownerUserEmail: 'owner@whitecaves.ae',
      status: 'pending_signature',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('hr-1');
  });

  it('POST /records returns 400 for invalid departmentTag', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/henry/records').send({
      templateKey: 'tenancy_contract',
      fileName: 'agreement.pdf',
      departmentTag: 'invalid',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /records returns 400 when templateKey or fileName is missing', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/henry/records').send({ templateLabel: 'Tenancy' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('DELETE /records/:id deletes a record and returns 200', async () => {
    const app = await createApp();
    const res = await request(app).delete('/api/henry/records/hr-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /records/:id returns 404 when record not found', async () => {
    const app = await createApp();
    mockPrisma.henryRecord.findUnique.mockResolvedValue(null);

    const res = await request(app).delete('/api/henry/records/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /records/:id/sign marks a record signed with timestamp', async () => {
    const app = await createApp();
    mockPrisma.henryRecord.findUnique.mockResolvedValue({
      id: 'hr-1',
      status: 'pending_signature',
    });
    mockPrisma.henryRecord.update.mockResolvedValue({
      id: 'hr-1',
      status: 'signed',
      isDraft: false,
      signedAt: new Date('2026-05-25T00:00:00.000Z'),
    });

    const res = await request(app)
      .post('/api/henry/records/hr-1/sign')
      .send({ signedAt: '2026-05-25T00:00:00.000Z' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('signed');
  });

  it('POST /records/:id/sign returns 400 for invalid signedAt', async () => {
    const app = await createApp();
    mockPrisma.henryRecord.findUnique.mockResolvedValue({
      id: 'hr-1',
      status: 'pending_signature',
    });

    const res = await request(app)
      .post('/api/henry/records/hr-1/sign')
      .send({ signedAt: 'not-a-date' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Henry routes — file upload and download', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.henryRecord.create.mockResolvedValue({
      id: 'hr-file-1',
      title: 'test.pdf',
      filePath: '/tmp/henry-test-uploads/test.pdf',
      fileType: 'other',
      status: 'active',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Create a real source file so fs.renameSync inside the route can succeed
    import('fs').then(({ default: fs }) => {
      fs.mkdirSync('/tmp/henry-test-uploads', { recursive: true });
      fs.writeFileSync('/tmp/henry-test-uploads/source.pdf', '%PDF-1.4 test');
    });
  });

  it('POST /records/file returns 201 after archiving a PDF', async () => {
    const app = await createApp();
    // Store form fields in global for multer mock to access
    (global as any).__testFormFields = {
      departmentTag: 'legal',
      ownerUserId: 'u-test',
    };
    try {
      const res = await request(app)
        .post('/api/henry/records/file')
        .field('departmentTag', 'legal')
        .field('ownerUserId', 'u-test')
        .attach('pdf', Buffer.from('%PDF-1.4 test'), 'test.pdf');
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fileName).toBe('test.pdf');
      // Normalize path for cross-platform comparison (Windows uses backslashes)
      const normalizedPath = res.body.data.relativePath.replace(/\\/g, '/');
      expect(normalizedPath).toContain('legal/u-test');
    } finally {
      delete (global as any).__testFormFields;
    }
  });

  it('GET /records/file returns 400 when path param is missing', async () => {
    const app = await createApp();
    const res = await request(app).get('/api/henry/records/file');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /records/file returns 403 on absolute path traversal attempt', async () => {
    const app = await createApp();
    // An absolute path resolves outside HENRY_UPLOADS_PATH and must be blocked
    const res = await request(app).get('/api/henry/records/file').query({ path: '/etc/passwd' });
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

describe('Henry routes — compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEvaluateCompliance.mockReturnValue({
      templateKey: 'tenancy_contract',
      passedCount: 8,
      warningCount: 1,
      errorCount: 0,
      totalRules: 9,
      isCompliant: true,
      results: [],
      evaluatedAt: new Date(),
    });
    mockGetComplianceSummary.mockReturnValue({
      tenancy_contract: { total: 9 },
    });
  });

  it('POST /compliance/check returns 200 with compliance report', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/compliance/check')
      .send({
        templateKey: 'tenancy_contract',
        documentData: {
          landlordName: 'Ahmed Al-Rashid',
          tenantName: 'John Smith',
          annualRent: 90000,
        },
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ isCompliant: true });
    expect(mockEvaluateCompliance).toHaveBeenCalledWith('tenancy_contract', expect.any(Object));
  });

  it('POST /compliance/check returns 400 when templateKey is missing', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/compliance/check')
      .send({ documentData: { landlordName: 'Ahmed' } });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /compliance/check returns 400 when documentData is missing', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/compliance/check')
      .send({ templateKey: 'tenancy_contract' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /compliance/check returns 400 for an invalid templateKey', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/compliance/check')
      .send({ templateKey: 'invalid_template', documentData: {} });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /compliance/summary returns 200 with rule counts', async () => {
    const app = await createApp();
    const res = await request(app).get('/api/henry/compliance/summary');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(mockGetComplianceSummary).toHaveBeenCalledOnce();
  });
});

describe('Henry routes — OCR and AI extract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /ocr/emirates-id returns 400 when no image provided', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/henry/ocr/emirates-id').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /ocr/emirates-id returns 200 (graceful fallback when Ollama unavailable)', async () => {
    // fetch will fail (Ollama not running in test), OCR should gracefully degrade
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/ocr/emirates-id')
      .send({ imageBase64: 'base64encodedimage==' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ ocrProvider: 'ollama' });
  });

  it('POST /ai/extract returns 400 when text is missing', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/ai/extract')
      .send({ templateKey: 'tenancy_contract' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /ai/extract returns 5xx when GROQ and Ollama both unavailable', async () => {
    // GROQ_API_KEY is '' (mocked), Ollama fetch throws a network error in test env
    // The route returns 503 when Ollama responds non-OK, or 500 if fetch itself throws
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/ai/extract')
      .send({ text: 'TENANCY CONTRACT\nParties: Ahmed and John', templateKey: 'tenancy_contract' });
    expect([500, 503]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  it('POST /ai/extract returns structured fields for passport, title deed, and tenancy contract', async () => {
    const app = await createApp();
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        response: JSON.stringify({
          passportNumber: 'A12345678',
          certificateNumber: 'TD-90871',
          tenantName: 'Aisha Noor',
          confidence: 0.92,
        }),
      }),
    } as Response);

    const passportRes = await request(app)
      .post('/api/henry/ai/extract')
      .send({ text: 'Passport No: A12345678', templateKey: 'passport' });
    const titleDeedRes = await request(app)
      .post('/api/henry/ai/extract')
      .send({ text: 'Title Deed Certificate: TD-90871', templateKey: 'title_deed' });
    const contractRes = await request(app)
      .post('/api/henry/ai/extract')
      .send({
        text: 'Tenancy Contract between landlord and Aisha Noor',
        templateKey: 'tenancy_contract',
      });

    for (const res of [passportRes, titleDeedRes, contractRes]) {
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.provider).toBe('ollama');
      expect(res.body.data.confidence).toBe(0.6);
    }
    expect(passportRes.body.data.fields.passportNumber).toBe('A12345678');
    expect(titleDeedRes.body.data.fields.certificateNumber).toBe('TD-90871');
    expect(contractRes.body.data.fields.tenantName).toBe('Aisha Noor');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

describe('Henry routes — orchestrator trigger and event log', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmitEvent.mockReturnValue(undefined);
    mockEvaluateCompliance.mockReturnValue({
      templateKey: 'tenancy_contract',
      passedCount: 8,
      warningCount: 0,
      errorCount: 0,
      totalRules: 8,
      isCompliant: true,
      results: [],
      evaluatedAt: new Date(),
    });
  });

  it('POST /orchestrator-trigger returns 400 when triggerSource is invalid', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/orchestrator-trigger')
      .send({ triggerSource: 'unknown', event: 'doc_created', payload: {} });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /orchestrator-trigger returns 400 when event is missing', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/orchestrator-trigger')
      .send({ triggerSource: 'nadia', payload: {} });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /orchestrator-trigger returns 400 when payload is not an object', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/orchestrator-trigger')
      .send({ triggerSource: 'linda', event: 'doc_created', payload: 'not-an-object' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /orchestrator-trigger returns 200 and emits orchestrator event', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/orchestrator-trigger')
      .send({
        triggerSource: 'nadia',
        event: 'cross:viewing_booked',
        payload: {
          propertyId: 'prop-1',
          contactPhone: '+971500000001',
          scheduledAt: '2026-06-01T10:00:00Z',
        },
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.processed).toBe(true);
    expect(mockEmitEvent).toHaveBeenCalledWith(
      'cross:viewing_booked',
      expect.objectContaining({ propertyId: 'prop-1' })
    );
  });

  it('POST /orchestrator-trigger runs compliance when templateKey present', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/orchestrator-trigger')
      .send({
        triggerSource: 'mary',
        event: 'doc_generated',
        payload: {
          templateKey: 'tenancy_contract',
          landlordName: 'Ahmed',
          tenantName: 'John',
        },
      });
    expect(res.status).toBe(200);
    expect(res.body.data.complianceResult).toBeDefined();
    expect(mockEvaluateCompliance).toHaveBeenCalled();
  });

  it('GET /event-log returns 200 with events array', async () => {
    const app = await createApp();
    // Seed an event first
    await request(app)
      .post('/api/henry/orchestrator-trigger')
      .send({ triggerSource: 'linda', event: 'msg_sent', payload: { info: 'test' } });

    const res = await request(app).get('/api/henry/event-log');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.events)).toBe(true);
    expect(typeof res.body.data.count).toBe('number');
  });
});

describe('Henry routes — AI draft, Ejari submit, translate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateDocumentDraft.mockResolvedValue({
      content: 'TENANCY CONTRACT DRAFT...',
      templateKey: 'tenancy_contract',
      generatedAt: new Date().toISOString(),
    });
    mockSubmitToEjari.mockResolvedValue({
      success: true,
      ejariNumber: 'EJARI-2026-001',
      submittedAt: new Date().toISOString(),
    });
    mockGenerateMultiLangContract.mockResolvedValue({
      english: 'This agreement...',
      arabic: 'هذه الاتفاقية...',
      generatedAt: new Date().toISOString(),
    });
  });

  it('POST /ai-draft returns 200 with generated draft', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/henry/ai-draft').send({
      templateKey: 'tenancy_contract',
      landlordName: 'Ahmed Al-Rashid',
      tenantName: 'John Smith',
      propertyAddress: 'Villa 12, DAMAC Hills 2',
      annualRent: 120000,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBeDefined();
    expect(mockGenerateDocumentDraft).toHaveBeenCalledOnce();
  });

  it('POST /ejari-submit returns 200 on successful Ejari submission', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/henry/ejari-submit').send({
      contractRef: 'TC-2026-001',
      tenantEmiratesId: '784-1990-1234567-1',
      landlordEmiratesId: '784-1985-7654321-2',
      propertyAddress: 'Villa 12, DAMAC Hills 2',
      annualRent: 120000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ejariNumber).toBe('EJARI-2026-001');
    expect(mockSubmitToEjari).toHaveBeenCalledOnce();
  });

  it('POST /ejari-submit returns 422 when Ejari submission fails', async () => {
    const app = await createApp();
    mockSubmitToEjari.mockResolvedValue({
      success: false,
      error: 'DLD validation failed',
    });
    const res = await request(app).post('/api/henry/ejari-submit').send({ contractRef: 'TC-bad' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /translate returns 200 with bilingual contract', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/henry/translate').send({
      content: 'This is a tenancy agreement between Ahmed and John.',
      targetLanguage: 'ar',
      templateKey: 'tenancy_contract',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.arabic).toBeDefined();
    expect(mockGenerateMultiLangContract).toHaveBeenCalledOnce();
  });

  it('POST /documents/save saves document extracted payload and returns 200', async () => {
    const app = await createApp();
    const res = await request(app)
      .post('/api/henry/documents/save')
      .send({
        docType: 'emirates_id',
        title: 'Emirates ID - Khalif Mohamednur',
        clientName: 'Khalif Mohamednur Ibrahim',
        referenceNumber: '784-1984-5852080-0',
        extractedJson: {
          idNumber: '784-1984-5852080-0',
          cardNumber: '146532347',
          nationalityEn: 'Kenya',
        },
        confidenceScore: 1.0,
        scannedSide: 'both',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.clientName).toBe('Khalif Mohamednur Ibrahim');
    expect(res.body.data.referenceNumber).toBe('784-1984-5852080-0');

    // Test GET /documents
    const getRes = await request(app).get('/api/henry/documents?docType=emirates_id');
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(getRes.body.count).toBeGreaterThanOrEqual(1);

    // Test GET /documents/latest/emirates_id
    const latestRes = await request(app).get('/api/henry/documents/latest/emirates_id');
    expect(latestRes.status).toBe(200);
    expect(latestRes.body.success).toBe(true);
    expect(latestRes.body.data.clientName).toBe('Khalif Mohamednur Ibrahim');

    // Test GET /documents/:id
    const singleRes = await request(app).get(`/api/henry/documents/${res.body.data.id}`);
    expect(singleRes.status).toBe(200);
    expect(singleRes.body.success).toBe(true);
    expect(singleRes.body.data.referenceNumber).toBe('784-1984-5852080-0');
  });

  it('POST /documents/save supports passport, title deed, and tenancy contract extraction records', async () => {
    const app = await createApp();

    const passportSave = await request(app)
      .post('/api/henry/documents/save')
      .send({
        docType: 'passport',
        title: 'Passport - Aisha Noor',
        clientName: 'Aisha Noor',
        extractedJson: { passportNumber: 'P-7788991' },
        confidenceScore: 0.95,
      });
    expect(passportSave.status).toBe(200);
    expect(passportSave.body.success).toBe(true);
    expect(passportSave.body.data.referenceNumber).toBe('P-7788991');

    const titleDeedSave = await request(app)
      .post('/api/henry/documents/save')
      .send({
        docType: 'title_deed',
        title: 'Title Deed - Marina View',
        clientName: 'Omar Khaled',
        extractedJson: { certificateNumber: 'TD-50011' },
        confidenceScore: 0.91,
      });
    expect(titleDeedSave.status).toBe(200);
    expect(titleDeedSave.body.success).toBe(true);
    expect(titleDeedSave.body.data.referenceNumber).toBe('TD-50011');

    const contractSave = await request(app)
      .post('/api/henry/documents/save')
      .send({
        docType: 'tenancy_contract',
        title: 'Tenancy Contract - Unit 1802',
        clientName: 'Sara Ahmed',
        referenceNumber: 'TC-2026-113',
        extractedJson: { tenantName: 'Sara Ahmed' },
        confidenceScore: 0.89,
      });
    expect(contractSave.status).toBe(200);
    expect(contractSave.body.success).toBe(true);
    expect(contractSave.body.data.referenceNumber).toBe('TC-2026-113');

    const passportLatest = await request(app).get('/api/henry/documents/latest/passport');
    expect(passportLatest.status).toBe(200);
    expect(passportLatest.body.success).toBe(true);
    expect(passportLatest.body.data.clientName).toBe('Aisha Noor');

    const titleDeedLatest = await request(app).get('/api/henry/documents/latest/title_deed');
    expect(titleDeedLatest.status).toBe(200);
    expect(titleDeedLatest.body.success).toBe(true);
    expect(titleDeedLatest.body.data.clientName).toBe('Omar Khaled');

    const contractLatest = await request(app).get('/api/henry/documents/latest/tenancy_contract');
    expect(contractLatest.status).toBe(200);
    expect(contractLatest.body.success).toBe(true);
    expect(contractLatest.body.data.clientName).toBe('Sara Ahmed');
  });
});
