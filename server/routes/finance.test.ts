/**
 * Finance Routes — Unit Tests
 * Tests /api/finance endpoints: summary, commissions CRUD, payments
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Prisma mock (vi.hoisted ensures availability before vi.mock factory) ─
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      commission: {
        aggregate: fn().mockResolvedValue({
          _sum: { amount: 50000 }, _avg: { amount: 5000 }, _count: { _all: 10 },
        }),
        groupBy: fn().mockResolvedValue([]),
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'comm-1', agentId: 'agent-1', amount: 5000, percentage: 2,
          type: 'sale', status: 'pending', notes: null,
          agent: { id: 'agent-1', name: 'John', email: 'john@test.com' },
        }),
        update: fn(),
        updateMany: fn().mockResolvedValue({ count: 0 }),
      },
      property: {
        aggregate: fn().mockResolvedValue({ _sum: { price: 1000000 } }),
        findUnique: fn().mockResolvedValue(null),
      },
      user: {
        findUnique: fn().mockResolvedValue(null),
      },
      lead: {
        findUnique: fn().mockResolvedValue(null),
      },
      invoice: {
        aggregate: fn().mockResolvedValue({ _sum: { vatAmount: 500 } }),
        create: fn().mockResolvedValue({ id: 'inv-1', pdfUrl: '/uploads/inv-1.pdf' }),
        findUnique: fn().mockResolvedValue({ id: 'inv-1', pdfUrl: '/uploads/inv-1.pdf' }),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
      },
    },
  };
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
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));
vi.mock('../services/invoiceService.js', () => ({
  generateTaxInvoice: vi.fn().mockResolvedValue({ id: 'inv-1', pdfUrl: '/uploads/inv-1.pdf' })
}));

import financeRoutes from './finance.js';

// ── Test helpers ─────────────────────────────────────────────────────
function createApp(role: string = 'owner') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/finance', financeRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_MONGO_ID = '507f1f77bcf86cd799439011';

describe('Finance Routes — /api/finance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.commission.aggregate.mockResolvedValue({
      _sum: { amount: 50000 }, _avg: { amount: 5000 }, _count: { _all: 10 },
    });
    mockPrisma.commission.groupBy.mockResolvedValue([]);
    mockPrisma.property.aggregate.mockResolvedValue({ _sum: { price: 1000000 } });
    mockPrisma.commission.findMany.mockResolvedValue([]);
    mockPrisma.commission.count.mockResolvedValue(0);
    mockPrisma.commission.findUnique.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue(null);
  });

  // ─── Summary ────────────────────────────────────────────────────
  describe('GET /api/finance/summary', () => {
    it('returns 200 with financial summary for owner', async () => {
      const res = await request(createApp('owner')).get('/api/finance/summary');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('totalRevenue');
      expect(res.body.data).toHaveProperty('totalExpenses');
      expect(res.body.data).toHaveProperty('netProfit');
      expect(res.body.data).toHaveProperty('commissions');
      expect(res.body.data).toHaveProperty('byType');
    });

    it('netProfit equals totalRevenue minus totalExpenses', async () => {
      const res = await request(createApp('owner')).get('/api/finance/summary');
      const { totalRevenue, totalExpenses, netProfit } = res.body.data;
      expect(netProfit).toBe(totalRevenue - totalExpenses);
    });

    it('returns 403 for unauthorized role (seller)', async () => {
      const res = await request(createApp('seller')).get('/api/finance/summary');
      expect(res.status).toBe(403);
    });

    it('allows finance role', async () => {
      const res = await request(createApp('finance')).get('/api/finance/summary');
      expect(res.status).toBe(200);
    });
  });

  // ─── List Commissions ──────────────────────────────────────────
  describe('GET /api/finance/commissions', () => {
    it('returns 200 with list for owner', async () => {
      const res = await request(createApp('owner')).get('/api/finance/commissions');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toBeDefined();
    });

    it('pagination defaults to page 1, pageSize 20', async () => {
      const res = await request(createApp('owner')).get('/api/finance/commissions');
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.pageSize).toBe(20);
    });

    it('caps pageSize at 100', async () => {
      const res = await request(createApp('owner')).get('/api/finance/commissions?pageSize=500');
      expect(res.body.pagination.pageSize).toBeLessThanOrEqual(100);
    });

    it('applies status filter', async () => {
      await request(createApp('owner')).get('/api/finance/commissions?status=paid');
      const call = mockPrisma.commission.findMany.mock.calls[0]?.[0];
      expect(call?.where?.status).toBe('paid');
    });

    it('returns 403 for unauthorized role (seller)', async () => {
      const res = await request(createApp('seller')).get('/api/finance/commissions');
      expect(res.status).toBe(403);
    });
  });

  // ─── Get Commission by ID ─────────────────────────────────────
  describe('GET /api/finance/commissions/:id', () => {
    it('returns 404 for non-existent commission', async () => {
      const res = await request(createApp('owner')).get(`/api/finance/commissions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns commission when found', async () => {
      mockPrisma.commission.findUnique.mockResolvedValue({
        id: VALID_MONGO_ID, amount: 5000, status: 'pending',
        agent: { id: 'a1', name: 'Agent', email: 'a@test.com', phone: '123' },
        lead: null, property: null,
      });
      const res = await request(createApp('owner')).get(`/api/finance/commissions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(VALID_MONGO_ID);
    });

    it('returns 403 for unauthorized role (seller)', async () => {
      const res = await request(createApp('seller')).get(`/api/finance/commissions/${VALID_MONGO_ID}`);
      expect(res.status).toBe(403);
    });
  });

  // ─── VAT & Invoices ──────────────────────────────────────────────────
  describe('GET /api/finance/vat-return', () => {
    it('returns VAT return metrics', async () => {
      const res = await request(createApp('owner')).get('/api/finance/vat-return');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('outputVAT', 500);
      expect(res.body.data).toHaveProperty('inputVAT', 0);
      expect(res.body.data).toHaveProperty('netVAT', 500);
    });
  });

  describe('POST /api/finance/invoices/tax', () => {
    it('validates missing fields', async () => {
      const res = await request(createApp('owner')).post('/api/finance/invoices/tax').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/client id/i);
    });

    it('generates a tax invoice', async () => {
      const payload = {
        clientId: 'client-1',
        lineItems: [{ description: 'Commission', quantity: 1, unitPrice: 1000 }]
      };
      const res = await request(createApp('owner')).post('/api/finance/invoices/tax').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', 'inv-1');
    });
  });

  describe('GET /api/finance/invoices/:id/pdf', () => {
    it('redirects to the PDF URL', async () => {
      const res = await request(createApp('owner')).get(`/api/finance/invoices/${VALID_MONGO_ID}/pdf`);
      // Express res.redirect returns 302 Found
      expect(res.status).toBe(302);
      expect(res.header.location).toBe('/uploads/inv-1.pdf');
    });

    it('returns 404 if invoice not found', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner')).get(`/api/finance/invoices/${VALID_MONGO_ID}/pdf`);
      expect(res.status).toBe(404);
    });
  });

  // ─── Create Commission ────────────────────────────────────────
  describe('POST /api/finance/commissions', () => {
    it('returns 400 if agentId missing', async () => {
      const res = await request(createApp('owner'))
        .post('/api/finance/commissions')
        .send({ amount: 5000, type: 'sale' });
      expect(res.status).toBe(400);
    });

    it('returns 404 if agent not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const res = await request(createApp('owner'))
        .post('/api/finance/commissions')
        .send({ agentId: VALID_MONGO_ID, amount: 5000, type: 'sale' });
      expect(res.status).toBe(404);
    });

    it('creates commission when agent exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: VALID_MONGO_ID, name: 'Agent', email: 'agent@test.com' });
      const res = await request(createApp('owner'))
        .post('/api/finance/commissions')
        .send({ agentId: VALID_MONGO_ID, amount: 5000, type: 'sale' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('validates amount is positive', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: VALID_MONGO_ID, name: 'Agent', email: 'a@t.com' });
      const res = await request(createApp('owner'))
        .post('/api/finance/commissions')
        .send({ agentId: VALID_MONGO_ID, amount: -100, type: 'sale' });
      expect(res.status).toBe(400);
    });

    it('validates commission type', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: VALID_MONGO_ID, name: 'Agent', email: 'a@t.com' });
      const res = await request(createApp('owner'))
        .post('/api/finance/commissions')
        .send({ agentId: VALID_MONGO_ID, amount: 5000, type: 'invalid' });
      expect(res.status).toBe(400);
    });

    it('validates percentage range 0-100', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: VALID_MONGO_ID, name: 'Agent', email: 'a@t.com' });
      const res = await request(createApp('owner'))
        .post('/api/finance/commissions')
        .send({ agentId: VALID_MONGO_ID, amount: 5000, percentage: 150 });
      expect(res.status).toBe(400);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .post('/api/finance/commissions')
        .send({ agentId: VALID_MONGO_ID, amount: 5000 });
      expect(res.status).toBe(403);
    });
  });

  // ─── Patch Commission ─────────────────────────────────────────
  describe('PATCH /api/finance/commissions/:id', () => {
    it('returns 404 for non-existent commission', async () => {
      const res = await request(createApp('owner'))
        .patch(`/api/finance/commissions/${VALID_MONGO_ID}`)
        .send({ status: 'approved' });
      expect(res.status).toBe(404);
    });

    it('validates invalid status', async () => {
      mockPrisma.commission.findUnique.mockResolvedValue({
        id: VALID_MONGO_ID, agentId: 'agent-1', status: 'pending',
        agent: { id: 'agent-1', name: 'Agent', email: 'a@t.com' },
      });
      const res = await request(createApp('owner'))
        .patch(`/api/finance/commissions/${VALID_MONGO_ID}`)
        .send({ status: 'bogus' });
      expect(res.status).toBe(400);
    });
  });

  // ─── Bulk Payment ─────────────────────────────────────────────
  describe('POST /api/finance/payments', () => {
    it('returns 400 if commissionIds is empty', async () => {
      const res = await request(createApp('owner'))
        .post('/api/finance/payments')
        .send({ commissionIds: [] });
      expect(res.status).toBe(400);
    });

    it('returns 400 if commissionIds is not an array', async () => {
      const res = await request(createApp('owner'))
        .post('/api/finance/payments')
        .send({ commissionIds: 'not-array' });
      expect(res.status).toBe(400);
    });

    it('validates MongoDB ID format', async () => {
      const res = await request(createApp('owner'))
        .post('/api/finance/payments')
        .send({ commissionIds: ['bad-id'] });
      expect(res.status).toBe(400);
    });

    it('processes payment for valid commission IDs', async () => {
      mockPrisma.commission.updateMany.mockResolvedValue({ count: 2 });
      const res = await request(createApp('owner'))
        .post('/api/finance/payments')
        .send({ commissionIds: [VALID_MONGO_ID, '607f1f77bcf86cd799439012'] });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('paidCount');
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .post('/api/finance/payments')
        .send({ commissionIds: [VALID_MONGO_ID] });
      expect(res.status).toBe(403);
    });
  });
});
