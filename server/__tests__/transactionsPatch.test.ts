/**
 * P0-013: PATCH /api/transactions/:id — KYC gate integration tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const VALID_ID = '507f1f77bcf86cd799439011';

const mockPrisma = vi.hoisted(() => {
  const prisma = {
    transaction: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    lead: {
      findUnique: vi.fn(),
    },
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-1' }),
    },
    $transaction: vi.fn(),
  };

  prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) =>
    callback(prisma)
  );

  return prisma;
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler:
    (fn: unknown) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
      Promise.resolve(
        (
          fn as (req: express.Request, res: express.Response, next: express.NextFunction) => unknown
        )(req, res, next)
      ).catch(next),
}));
vi.mock('../middleware/rbac', () => ({
  requirePermission:
    () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
      next(),
  requireRole: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
    next(),
  requireMinRole:
    () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
      next(),
  scopeToOwn: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
    next(),
  resolveBackendRole: (r: string) => r,
  roleHasPermission: () => true,
}));
vi.mock('../utils/sanitize', () => ({ sanitizeString: (v: string) => v }));
vi.mock('../utils/validate', () => ({
  validate: () => undefined,
  rules: {
    oneOf: () => [],
    optionalPositiveNumber: () => [],
    optionalArray: () => [],
  },
  validateIdParam: () => undefined,
}));
vi.mock('../config/pagination', () => ({
  parsePagination: () => ({ page: 1, limit: 50, skip: 0 }),
}));
vi.mock('../middleware/auth', () => ({ default: null }));
vi.mock('../services/DocumentService.js', () => ({ documentService: {} }));

async function createApp(role = 'manager') {
  const { default: transactionsRouter } = await import('../routes/transactions');
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as express.Request & { user: { id: string; role: string } }).user = { id: 'u1', role };
    next();
  });
  app.use('/', transactionsRouter);
  // Error handler
  app.use(
    (
      err: { statusCode?: number; message: string },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      res.status(err.statusCode ?? 500).json({ success: false, message: err.message });
    }
  );
  return app;
}

describe('PATCH /api/transactions/:id — KYC gate (P0-013)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });
  });

  it('returns 404 when transaction not found', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);
    const app = await createApp();
    const res = await request(app).patch(`/${VALID_ID}`).send({ status: 'in_progress' });
    expect(res.status).toBe(404);
  });

  it('returns 403 for insufficient role', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: VALID_ID,
      type: 'sale',
      amount: 100,
      status: 'draft',
      leadId: VALID_ID,
    });
    const app = await createApp('tenant');
    const res = await request(app).patch(`/${VALID_ID}`).send({ status: 'draft' });
    expect(res.status).toBe(403);
  });

  it('returns 200 for non-risky status transition (lease type)', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: VALID_ID,
      type: 'lease',
      amount: 50_000,
      status: 'draft',
      leadId: VALID_ID,
    });
    mockPrisma.transaction.update.mockResolvedValue({
      id: VALID_ID,
      type: 'lease',
      amount: 50_000,
      status: 'in_progress',
    });
    const app = await createApp('manager');
    const res = await request(app).patch(`/${VALID_ID}`).send({ status: 'in_progress' });
    expect(res.status).toBe(200);
    // KYC not checked for non-risky
    expect(mockPrisma.lead.findUnique).not.toHaveBeenCalled();
  });

  it('returns 200 for sale→in_progress with kyc_verified lead', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: VALID_ID,
      type: 'sale',
      amount: 800_000,
      status: 'draft',
      leadId: VALID_ID,
    });
    mockPrisma.lead.findUnique.mockResolvedValue({ id: VALID_ID, tags: ['kyc_verified'] });
    mockPrisma.transaction.update.mockResolvedValue({
      id: VALID_ID,
      type: 'sale',
      amount: 800_000,
      status: 'in_progress',
    });
    const app = await createApp('manager');
    const res = await request(app).patch(`/${VALID_ID}`).send({ status: 'in_progress' });
    expect(res.status).toBe(200);
  });

  it('allows admin role to update transactions', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: VALID_ID,
      type: 'lease',
      amount: 50_000,
      status: 'draft',
      leadId: VALID_ID,
    });
    mockPrisma.transaction.update.mockResolvedValue({
      id: VALID_ID,
      type: 'lease',
      amount: 50_000,
      status: 'in_progress',
    });
    const app = await createApp('admin');
    const res = await request(app).patch(`/${VALID_ID}`).send({ status: 'in_progress' });
    expect(res.status).toBe(200);
  });

  it('returns 403 for sale→in_progress when lead lacks kyc_verified', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: VALID_ID,
      type: 'sale',
      amount: 800_000,
      status: 'draft',
      leadId: VALID_ID,
    });
    mockPrisma.lead.findUnique.mockResolvedValue({ id: VALID_ID, tags: ['active'] });
    const app = await createApp('manager');
    const res = await request(app).patch(`/${VALID_ID}`).send({ status: 'in_progress' });
    expect(res.status).toBe(403);
  });

  it('returns 403 for amount≥500k non-sale→completed without KYC', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: VALID_ID,
      type: 'deposit',
      amount: 600_000,
      status: 'draft',
      leadId: VALID_ID,
    });
    mockPrisma.lead.findUnique.mockResolvedValue({ id: VALID_ID, tags: [] });
    const app = await createApp('manager');
    const res = await request(app).patch(`/${VALID_ID}`).send({ status: 'completed' });
    expect(res.status).toBe(403);
  });
});
