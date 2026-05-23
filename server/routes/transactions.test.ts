/**
 * Transactions Routes — Unit Tests
 * Tests /api/transactions endpoints: list, stats, get-by-id, create, update, delete
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

interface PrismaTxMock {
  transaction: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    groupBy: ReturnType<typeof vi.fn>;
    aggregate: ReturnType<typeof vi.fn>;
  };
  lead: {
    findUnique: ReturnType<typeof vi.fn>;
  };
  activity: {
    create: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
}

// ── Prisma mock (vi.hoisted ensures availability before vi.mock factory) ─
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const mp: PrismaTxMock = {
    transaction: {
      findMany: fn().mockResolvedValue([]),
      findUnique: fn().mockResolvedValue(null),
      count: fn().mockResolvedValue(0),
      create: fn().mockResolvedValue({
        id: 'tx-1',
        type: 'sale',
        status: 'draft',
        amount: 100000,
        propertyId: null,
        leadId: null,
        agentId: null,
        closingDate: null,
        notes: null,
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: fn(),
      delete: fn(),
      groupBy: fn().mockResolvedValue([]),
      aggregate: fn().mockResolvedValue({
        _sum: { amount: 0 },
        _avg: { amount: 0 },
        _count: { _all: 0 },
      }),
    },
    lead: {
      findUnique: fn().mockResolvedValue({
        id: '507f1f77bcf86cd799439011',
        tags: ['kyc_verified'],
      }),
    },
    activity: {
      create: fn().mockResolvedValue({ id: 'act-1' }),
    },
    $transaction: fn(async (cb: (tx: PrismaTxMock) => unknown) => cb(mp)),
  };
  return { mockPrisma: mp };
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
  asyncHandler: (fn: unknown) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(
      (fn as (req: Request, res: Response, next: NextFunction) => unknown)(req, res, next)
    ).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));

import transactionsRoutes from './transactions';

// ── Test helpers ─────────────────────────────────────────────────────
function createApp(role: string = 'owner') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; email: string; role: string } }).user = {
      id: 'user-1',
      email: 'test@whitecaves.ae',
      role,
    };
    next();
  });
  app.use('/api/transactions', transactionsRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  );
  return app;
}

const VALID_MONGO_ID = '507f1f77bcf86cd799439011';

describe('Transactions Routes — /api/transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.transaction.findMany.mockResolvedValue([]);
    mockPrisma.transaction.count.mockResolvedValue(0);
    mockPrisma.transaction.findUnique.mockResolvedValue(null);
    mockPrisma.transaction.create.mockResolvedValue({
      id: 'tx-1',
      type: 'sale',
      status: 'draft',
      amount: 100000,
      propertyId: null,
      leadId: null,
      agentId: null,
      closingDate: null,
      notes: null,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockPrisma.lead.findUnique.mockResolvedValue({ id: VALID_MONGO_ID, tags: ['kyc_verified'] });
  });

  // ─── GET / (list) ──────────────────────────────────────────────
  describe('GET /api/transactions', () => {
    it('returns 200 with empty array for owner', async () => {
      const res = await request(createApp('owner')).get('/api/transactions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns pagination metadata', async () => {
      const res = await request(createApp('owner')).get('/api/transactions?page=2&pageSize=10');
      expect(res.body.pagination).toHaveProperty('page');
      expect(res.body.pagination).toHaveProperty('pageSize');
      expect(res.body.pagination).toHaveProperty('total');
      expect(res.body.pagination).toHaveProperty('totalPages');
    });

    it('allows agent role', async () => {
      const res = await request(createApp('agent')).get('/api/transactions');
      expect(res.status).toBe(200);
    });

    it('returns 403 for tenant role', async () => {
      const res = await request(createApp('tenant')).get('/api/transactions');
      expect(res.status).toBe(403);
    });

    it('applies status filter', async () => {
      await request(createApp('owner')).get('/api/transactions?status=active');
      const call = mockPrisma.transaction.findMany.mock.calls[0]?.[0];
      expect(call?.where?.status).toBe('active');
    });

    it('applies type filter', async () => {
      await request(createApp('owner')).get('/api/transactions?type=sale');
      const call = mockPrisma.transaction.findMany.mock.calls[0]?.[0];
      expect(call?.where?.type).toBe('sale');
    });

    it('defaults to sorting by createdAt desc', async () => {
      await request(createApp('owner')).get('/api/transactions');
      const call = mockPrisma.transaction.findMany.mock.calls[0]?.[0];
      expect(call?.orderBy).toHaveProperty('createdAt', 'desc');
    });

    it('falls back to createdAt for invalid sort field', async () => {
      await request(createApp('owner')).get('/api/transactions?sortBy=invalid');
      const call = mockPrisma.transaction.findMany.mock.calls[0]?.[0];
      expect(call?.orderBy).toHaveProperty('createdAt');
    });
  });

  // ─── GET /stats ────────────────────────────────────────────────
  describe('GET /api/transactions/stats', () => {
    it('returns 200 with stats for owner', async () => {
      const res = await request(createApp('owner')).get('/api/transactions/stats');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('byStatus');
      expect(res.body.data).toHaveProperty('byType');
      expect(res.body.data).toHaveProperty('totalValue');
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/transactions/stats');
      expect(res.status).toBe(403);
    });
  });

  // ─── GET /:id ──────────────────────────────────────────────────
  describe('GET /api/transactions/:id', () => {
    it('returns 404 when transaction not found', async () => {
      const res = await request(createApp('owner')).get(`/api/transactions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 200 with transaction data when found', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: VALID_MONGO_ID,
        type: 'sale',
        amount: 100000,
        status: 'active',
      });
      const res = await request(createApp('owner')).get(`/api/transactions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(VALID_MONGO_ID);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get(`/api/transactions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid ID format', async () => {
      const res = await request(createApp('owner')).get('/api/transactions/bad-id');
      expect(res.status).toBe(400);
    });
  });

  // ─── POST / (create) ──────────────────────────────────────────
  describe('POST /api/transactions', () => {
    const validBody = {
      type: 'lease',
      amount: 250000,
    };

    it('creates transaction for owner', async () => {
      const res = await request(createApp('owner')).post('/api/transactions').send(validBody);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for agent role (no process_payments permission)', async () => {
      const res = await request(createApp('agent')).post('/api/transactions').send(validBody);
      expect(res.status).toBe(403);
    });

    it('returns 403 for tenant role', async () => {
      const res = await request(createApp('tenant')).post('/api/transactions').send(validBody);
      expect(res.status).toBe(403);
    });

    it('logs activity after creation', async () => {
      await request(createApp('owner')).post('/api/transactions').send(validBody);
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });

    it('blocks risky transaction when leadId is missing', async () => {
      const res = await request(createApp('owner'))
        .post('/api/transactions')
        .send({ type: 'sale', amount: 900000 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/KYC verification required/i);
    });

    it('blocks risky transaction when linked lead is not kyc_verified', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: VALID_MONGO_ID, tags: ['prospect'] });

      const res = await request(createApp('owner'))
        .post('/api/transactions')
        .send({ type: 'sale', amount: 900000, leadId: VALID_MONGO_ID });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/KYC verification required/i);
    });

    it('allows risky transaction when linked lead is kyc_verified', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_MONGO_ID,
        tags: ['kyc_verified'],
      });

      const res = await request(createApp('owner'))
        .post('/api/transactions')
        .send({ type: 'sale', amount: 900000, leadId: VALID_MONGO_ID });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  // ─── PATCH /:id (update) ──────────────────────────────────────
  describe('PATCH /api/transactions/:id', () => {
    it('returns 404 when transaction not found', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
        fn({
          transaction: { findUnique: vi.fn().mockResolvedValue(null), update: vi.fn() },
          activity: { create: vi.fn() },
        })
      );
      const res = await request(createApp('owner'))
        .patch(`/api/transactions/${VALID_MONGO_ID}`)
        .send({ status: 'active' });
      expect(res.status).toBe(404);
    });

    it('returns 403 for agent trying to update', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
        fn({
          transaction: {
            findUnique: vi
              .fn()
              .mockResolvedValue({ id: VALID_MONGO_ID, status: 'draft', amount: 100000 }),
            update: vi.fn(),
          },
          activity: { create: vi.fn() },
        })
      );
      const res = await request(createApp('agent'))
        .patch(`/api/transactions/${VALID_MONGO_ID}`)
        .send({ status: 'active' });
      expect(res.status).toBe(403);
    });
  });

  // ─── DELETE /:id ───────────────────────────────────────────────
  describe('DELETE /api/transactions/:id', () => {
    it('returns 404 for non-existent transaction', async () => {
      const res = await request(createApp('owner')).delete(`/api/transactions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(404);
    });

    it('deletes transaction for owner', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: VALID_MONGO_ID,
        amount: 100000,
        status: 'draft',
      });
      mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
        fn({
          transaction: {
            delete: vi.fn(),
          },
          activity: { create: vi.fn() },
        })
      );
      const res = await request(createApp('owner')).delete(`/api/transactions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for agent trying to delete', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: VALID_MONGO_ID,
        amount: 100000,
        status: 'draft',
      });
      const res = await request(createApp('agent')).delete(`/api/transactions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid ID', async () => {
      const res = await request(createApp('owner')).delete('/api/transactions/nope');
      expect(res.status).toBe(400);
    });
  });
});
