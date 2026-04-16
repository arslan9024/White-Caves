/**
 * Reporting / Dashboard Routes — Unit Tests
 * Tests /api/dashboard endpoints: summary, activities, executive, kpis
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      lead: {
        count: fn().mockResolvedValue(42),
        groupBy: fn().mockResolvedValue([]),
        aggregate: fn().mockResolvedValue({ _sum: { budget: 5000000 }, _avg: { score: 65, budget: 500000 } }),
      },
      property: {
        count: fn().mockResolvedValue(15),
        groupBy: fn().mockResolvedValue([]),
        aggregate: fn().mockResolvedValue({ _sum: { price: 10000000 } }),
      },
      user: {
        count: fn().mockResolvedValue(5),
      },
      commission: {
        aggregate: fn().mockResolvedValue({
          _sum: { amount: 50000 }, _count: { _all: 10 }, _avg: { amount: 5000 },
        }),
        groupBy: fn().mockResolvedValue([]),
      },
      activity: {
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));
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

import reportingRoutes from './reporting';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/dashboard', reportingRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ═════════════════════════════════════════════════════════════════════

describe('Reporting / Dashboard Routes — /api/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default values
    mockPrisma.lead.count.mockResolvedValue(42);
    mockPrisma.property.count.mockResolvedValue(15);
    mockPrisma.user.count.mockResolvedValue(5);
    mockPrisma.commission.aggregate.mockResolvedValue({
      _sum: { amount: 50000 }, _count: { _all: 10 }, _avg: { amount: 5000 },
    });
    mockPrisma.activity.findMany.mockResolvedValue([]);
    mockPrisma.lead.aggregate.mockResolvedValue({ _sum: { budget: 5000000 } });
  });

  // ── GET /summary ─────────────────────────────────────────────────
  describe('GET /api/dashboard/summary', () => {
    it('returns 200 with metrics for owner', async () => {
      const res = await request(createApp('owner'))
        .get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics).toBeDefined();
      expect(res.body.data.metrics.totalLeads).toBeDefined();
      expect(res.body.data.metrics.totalProperties).toBeDefined();
      expect(res.body.data.recentActivities).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/dashboard/summary');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 200 for manager role', async () => {
      const res = await request(createApp('manager'))
        .get('/api/dashboard/summary');
      expect(res.status).toBe(200);
    });

    it('returns 200 for finance role', async () => {
      const res = await request(createApp('finance'))
        .get('/api/dashboard/summary');
      expect(res.status).toBe(200);
    });

    it('calculates conversion rate correctly', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(100)   // totalLeads
        .mockResolvedValueOnce(15)    // hotLeads
        .mockResolvedValueOnce(20);   // wonLeads
      const res = await request(createApp('owner'))
        .get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.metrics.conversionRate).toBe(20);
    });

    it('handles zero leads gracefully', async () => {
      mockPrisma.lead.count.mockResolvedValue(0);
      const res = await request(createApp('owner'))
        .get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.metrics.conversionRate).toBe(0);
    });

    it('formats recent activities correctly', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'act-1', type: 'lead', action: 'created',
          description: 'New lead', createdAt: new Date('2026-01-15'),
          user: { id: 'user-1', name: 'Agent John' },
          metadata: null,
        },
      ]);
      const res = await request(createApp('owner'))
        .get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.recentActivities).toHaveLength(1);
      expect(res.body.data.recentActivities[0].user).toBe('Agent John');
    });
  });

  // ── GET /overview (alias for /summary) ───────────────────────────
  describe('GET /api/dashboard/overview', () => {
    it('returns 200 like /summary', async () => {
      const res = await request(createApp('owner'))
        .get('/api/dashboard/overview');
      expect(res.status).toBe(200);
      expect(res.body.data.metrics).toBeDefined();
    });
  });

  // ── GET /activities ──────────────────────────────────────────────
  describe('GET /api/dashboard/activities', () => {
    it('returns 200 with activity feed for owner', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'act-1', type: 'lead', action: 'created',
          description: 'Activity 1', createdAt: new Date(), metadata: null,
          user: { id: 'user-1', name: 'Test' },
          lead: null,
        },
      ]);
      mockPrisma.activity.count.mockResolvedValueOnce(1);
      const res = await request(createApp('owner'))
        .get('/api/dashboard/activities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/dashboard/activities');
      expect(res.status).toBe(403);
    });

    it('supports pagination params', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(100);
      const res = await request(createApp('owner'))
        .get('/api/dashboard/activities?page=2&pageSize=10');
      expect(res.status).toBe(200);
    });

    it('supports type filter', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner'))
        .get('/api/dashboard/activities?type=lead');
      expect(res.status).toBe(200);
    });
  });

  // ── GET /executive ───────────────────────────────────────────────
  describe('GET /api/dashboard/executive', () => {
    it('returns 200 with executive analytics for owner', async () => {
      mockPrisma.lead.groupBy.mockResolvedValue([
        { status: 'new', _count: { _all: 20 } },
      ]);
      mockPrisma.property.groupBy.mockResolvedValue([
        { status: 'available', _count: { _all: 10 } },
      ]);
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'paid', _count: { _all: 5 }, _sum: { amount: 25000 } },
      ]);
      const res = await request(createApp('owner'))
        .get('/api/dashboard/executive');
      expect(res.status).toBe(200);
      expect(res.body.data.leads).toBeDefined();
      expect(res.body.data.properties).toBeDefined();
      expect(res.body.data.commissions).toBeDefined();
      expect(res.body.data.portfolioValue).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/dashboard/executive');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /kpis ────────────────────────────────────────────────────
  describe('GET /api/dashboard/kpis', () => {
    it('returns 200 with KPI data for manager', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(30)    // newLeads30d
        .mockResolvedValueOnce(8);    // wonDeals30d
      mockPrisma.property.count.mockResolvedValueOnce(5); // newProperties30d
      mockPrisma.commission.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 100000 } })   // totalRevenue
        .mockResolvedValueOnce({ _avg: { amount: 10000 } });   // avgDealSize
      const res = await request(createApp('manager'))
        .get('/api/dashboard/kpis');
      expect(res.status).toBe(200);
      expect(res.body.data.period).toBe('30d');
      expect(res.body.data.kpis).toBeDefined();
      expect(res.body.data.kpis.newLeads).toBeDefined();
      expect(res.body.data.kpis.wonDeals).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/dashboard/kpis');
      expect(res.status).toBe(403);
    });

    it('returns 200 for finance role', async () => {
      mockPrisma.lead.count.mockResolvedValue(0);
      mockPrisma.property.count.mockResolvedValue(0);
      mockPrisma.commission.aggregate.mockResolvedValue({ _sum: { amount: 0 }, _avg: { amount: 0 } });
      const res = await request(createApp('finance'))
        .get('/api/dashboard/kpis');
      expect(res.status).toBe(200);
    });
  });
});
