/**
 * CRM Routes — Unit Tests
 * Tests /api/crm endpoints: dashboard, analytics, search, export
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
      lead: {
        count: fn().mockResolvedValue(42),
        groupBy: fn().mockResolvedValue([]),
        findMany: fn().mockResolvedValue([]),
      },
      property: {
        count: fn().mockResolvedValue(15),
        groupBy: fn().mockResolvedValue([]),
        findMany: fn().mockResolvedValue([]),
      },
      user: {
        count: fn().mockResolvedValue(5),
        findMany: fn().mockResolvedValue([]),
      },
      activity: {
        count: fn().mockResolvedValue(100),
        findMany: fn().mockResolvedValue([]),
      },
      commission: {
        aggregate: fn().mockResolvedValue({ _sum: { amount: 50000 }, _avg: { amount: 5000 }, _count: { _all: 10 } }),
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
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

import crmRoutes from './crm';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/crm', crmRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// =====================================================================

describe('CRM Routes — /api/crm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset defaults
    mockPrisma.lead.count.mockResolvedValue(42);
    mockPrisma.property.count.mockResolvedValue(15);
    mockPrisma.user.count.mockResolvedValue(5);
    mockPrisma.activity.count.mockResolvedValue(100);
    mockPrisma.activity.findMany.mockResolvedValue([]);
    mockPrisma.lead.groupBy.mockResolvedValue([]);
    mockPrisma.property.groupBy.mockResolvedValue([]);
    mockPrisma.commission.aggregate.mockResolvedValue({
      _sum: { amount: 50000 }, _avg: { amount: 5000 }, _count: { _all: 10 },
    });
    mockPrisma.lead.findMany.mockResolvedValue([]);
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.user.findMany.mockResolvedValue([]);
  });

  // ─── Dashboard ──────────────────────────────────────────────────
  describe('GET /api/crm/dashboard', () => {
    it('returns 200 with dashboard stats for owner', async () => {
      const res = await request(createApp('owner')).get('/api/crm/dashboard');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('stats');
      expect(res.body.data).toHaveProperty('recentActivity');
    });

    it('stats includes leads, properties, agents, activities', async () => {
      const res = await request(createApp('owner')).get('/api/crm/dashboard');
      const { stats } = res.body.data;
      expect(stats).toHaveProperty('leads');
      expect(stats).toHaveProperty('properties');
      expect(stats).toHaveProperty('agents');
      expect(stats).toHaveProperty('activities');
      expect(stats).toHaveProperty('hotLeads');
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/crm/dashboard');
      expect(res.status).toBe(403);
    });

    it('returns 403 for tenant role', async () => {
      const res = await request(createApp('tenant')).get('/api/crm/dashboard');
      expect(res.status).toBe(403);
    });

    it('allows manager role', async () => {
      const res = await request(createApp('manager')).get('/api/crm/dashboard');
      expect(res.status).toBe(200);
    });

    it('allows finance role', async () => {
      const res = await request(createApp('finance')).get('/api/crm/dashboard');
      expect(res.status).toBe(200);
    });
  });

  // ─── Analytics ──────────────────────────────────────────────────
  describe('GET /api/crm/analytics', () => {
    it('returns 200 with analytics data for admin', async () => {
      const res = await request(createApp('admin')).get('/api/crm/analytics');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('leads');
      expect(res.body.data).toHaveProperty('properties');
      expect(res.body.data).toHaveProperty('commissions');
    });

    it('commission analytics include total, totalValue, averageValue', async () => {
      const res = await request(createApp('owner')).get('/api/crm/analytics');
      const { commissions } = res.body.data;
      expect(commissions).toHaveProperty('total');
      expect(commissions).toHaveProperty('totalValue');
      expect(commissions).toHaveProperty('averageValue');
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/crm/analytics');
      expect(res.status).toBe(403);
    });
  });

  // ─── Search ─────────────────────────────────────────────────────
  describe('GET /api/crm/search', () => {
    it('returns empty results for short query', async () => {
      const res = await request(createApp('owner')).get('/api/crm/search?q=a');
      expect(res.status).toBe(200);
      expect(res.body.data.leads).toEqual([]);
      expect(res.body.data.properties).toEqual([]);
      expect(res.body.data.agents).toEqual([]);
    });

    it('returns empty results for missing q param', async () => {
      const res = await request(createApp('owner')).get('/api/crm/search');
      expect(res.status).toBe(200);
      expect(res.body.data.leads).toEqual([]);
    });

    it('performs search for valid query term', async () => {
      const res = await request(createApp('owner')).get('/api/crm/search?q=Dubai');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
    });

    it('returns 403 for tenant role (not in allowed roles)', async () => {
      const res = await request(createApp('tenant')).get('/api/crm/search?q=test');
      expect(res.status).toBe(403);
    });

    it('returns 403 for finance role (not in search allowed roles)', async () => {
      const res = await request(createApp('finance')).get('/api/crm/search?q=test');
      expect(res.status).toBe(403);
    });
  });

  // ─── Export ─────────────────────────────────────────────────────
  describe('GET /api/crm/export', () => {
    it('returns JSON export for leads (default)', async () => {
      const res = await request(createApp('owner')).get('/api/crm/export');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meta.entity).toBe('leads');
    });

    it('exports properties entity', async () => {
      const res = await request(createApp('owner')).get('/api/crm/export?entity=properties');
      expect(res.status).toBe(200);
      expect(res.body.meta.entity).toBe('properties');
    });

    it('exports agents entity', async () => {
      const res = await request(createApp('admin')).get('/api/crm/export?entity=agents');
      expect(res.status).toBe(200);
      expect(res.body.meta.entity).toBe('agents');
    });

    it('exports commissions entity', async () => {
      const res = await request(createApp('owner')).get('/api/crm/export?entity=commissions');
      expect(res.status).toBe(200);
      expect(res.body.meta.entity).toBe('commissions');
    });

    it('returns 400 for invalid entity', async () => {
      const res = await request(createApp('owner')).get('/api/crm/export?entity=invalid');
      expect(res.status).toBe(400);
    });

    it('returns CSV when format=csv (with data)', async () => {
      mockPrisma.lead.findMany.mockResolvedValue([
        { id: '1', name: 'Test Lead', email: 'test@test.com' },
      ]);
      mockPrisma.lead.count.mockResolvedValue(1);
      const res = await request(createApp('owner')).get('/api/crm/export?format=csv');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/crm/export');
      expect(res.status).toBe(403);
    });

    it('pagination caps at 1000 records', async () => {
      await request(createApp('owner')).get('/api/crm/export?pageSize=5000');
      // The route should cap pageSize to 1000, so findMany take should be <= 1000
      const findManyCall = mockPrisma.lead.findMany.mock.calls[0]?.[0];
      expect(findManyCall?.take).toBeLessThanOrEqual(1000);
    });

    it('includes pagination meta in JSON response', async () => {
      const res = await request(createApp('owner')).get('/api/crm/export?page=2&pageSize=10');
      expect(res.status).toBe(200);
      expect(res.body.pagination).toHaveProperty('page');
      expect(res.body.pagination).toHaveProperty('total');
    });
  });
});
