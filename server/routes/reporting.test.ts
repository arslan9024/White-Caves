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
        findMany: fn().mockResolvedValue([]),
        aggregate: fn().mockResolvedValue({
          _sum: { budget: 5000000 },
          _avg: { score: 65, budget: 500000 },
        }),
      },
      property: {
        count: fn().mockResolvedValue(15),
        groupBy: fn().mockResolvedValue([]),
        findMany: fn().mockResolvedValue([]),
        aggregate: fn().mockResolvedValue({ _sum: { price: 10000000 } }),
      },
      user: {
        count: fn().mockResolvedValue(5),
      },
      commission: {
        aggregate: fn().mockResolvedValue({
          _sum: { amount: 50000 },
          _count: { _all: 10 },
          _avg: { amount: 5000 },
        }),
        groupBy: fn().mockResolvedValue([]),
        findMany: fn().mockResolvedValue([]),
      },
      transaction: {
        count: fn().mockResolvedValue(3),
        findMany: fn().mockResolvedValue([]),
      },
      activity: {
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
      },
      userDashboardPreference: {
        findUnique: fn().mockResolvedValue(null),
        upsert: fn().mockResolvedValue({
          userId: 'user-1',
          role: 'owner',
          widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
          layout: 'default',
          updatedAt: new Date('2026-01-15T00:00:00.000Z'),
        }),
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

function createAppWithoutUser() {
  const app = express();
  app.use(express.json());
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
    mockPrisma.lead.findMany.mockResolvedValue([]);
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.transaction.findMany.mockResolvedValue([]);
    mockPrisma.commission.findMany.mockResolvedValue([]);
    mockPrisma.commission.aggregate.mockResolvedValue({
      _sum: { amount: 50000 },
      _count: { _all: 10 },
      _avg: { amount: 5000 },
    });
    mockPrisma.activity.findMany.mockResolvedValue([]);
    mockPrisma.lead.aggregate.mockResolvedValue({ _sum: { budget: 5000000 } });
    mockPrisma.userDashboardPreference.findUnique.mockResolvedValue(null);
    mockPrisma.userDashboardPreference.upsert.mockResolvedValue({
      userId: 'user-1',
      role: 'owner',
      widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
      layout: 'default',
      updatedAt: new Date('2026-01-15T00:00:00.000Z'),
    });
  });

  // ── GET /config ──────────────────────────────────────────────────
  describe('GET /api/dashboard/config', () => {
    it('returns role-based widget config', async () => {
      const res = await request(createApp('manager')).get('/api/dashboard/config');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('role', 'manager');
      expect(Array.isArray(res.body.data.widgets)).toBe(true);
      expect(res.body.data.widgets.length).toBeGreaterThan(0);
      expect(res.body.data).not.toHaveProperty('updatedAt');
      expect(res.body.data.widgets).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'team-kpis', title: 'Team KPIs', enabled: true }),
        ])
      );
    });

    it('returns 403 for unknown role due to permission guard', async () => {
      const res = await request(createApp('unknown-role')).get('/api/dashboard/config');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/access denied|forbidden/i);
    });
  });

  // ── GET /preferences ─────────────────────────────────────────────
  describe('GET /api/dashboard/preferences', () => {
    it('returns fallback role config when preference does not exist', async () => {
      mockPrisma.userDashboardPreference.findUnique.mockResolvedValueOnce(null);

      const res = await request(createApp('owner')).get('/api/dashboard/preferences');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.role).toBe('owner');
      expect(res.body.data.layout).toBe('default');
      expect(Array.isArray(res.body.data.widgets)).toBe(true);
      expect(res.body.data).not.toHaveProperty('updatedAt');
      expect(res.body.data.widgets[0]).toEqual(
        expect.objectContaining({ id: expect.any(String), title: expect.any(String) })
      );
      expect(mockPrisma.userDashboardPreference.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });

    it('returns stored user preference when present', async () => {
      mockPrisma.userDashboardPreference.findUnique.mockResolvedValueOnce({
        userId: 'user-1',
        role: 'manager',
        widgets: [{ id: 'team-kpis', title: 'Team KPIs', enabled: true }],
        layout: 'compact',
        updatedAt: new Date('2026-02-01T00:00:00.000Z'),
      });

      const res = await request(createApp('manager')).get('/api/dashboard/preferences');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('manager');
      expect(res.body.data.layout).toBe('compact');
      expect(res.body.data).toHaveProperty('updatedAt');
      expect(res.body.data.widgets).toEqual([
        { id: 'team-kpis', title: 'Team KPIs', enabled: true },
      ]);
      expect(typeof res.body.data.updatedAt).toBe('string');
      expect(Number.isNaN(Date.parse(res.body.data.updatedAt))).toBe(false);
    });

    it('returns 401 when user context is missing', async () => {
      const res = await request(createAppWithoutUser()).get('/api/dashboard/preferences');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/authentication required/i);
    });
  });

  // ── PUT /preferences ─────────────────────────────────────────────
  describe('PUT /api/dashboard/preferences', () => {
    it('returns 400 when widgets payload is not an array', async () => {
      const res = await request(createApp('owner'))
        .put('/api/dashboard/preferences')
        .send({ widgets: { bad: true }, layout: 'default' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/widgets must be an array/i);
    });

    it('returns 400 when widgets payload is omitted', async () => {
      const res = await request(createApp('owner'))
        .put('/api/dashboard/preferences')
        .send({ layout: 'default' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/widgets must be an array/i);
    });

    it('upserts and returns normalized preference payload', async () => {
      mockPrisma.userDashboardPreference.upsert.mockResolvedValueOnce({
        userId: 'user-1',
        role: 'owner',
        widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: false }],
        layout: 'default',
        updatedAt: new Date('2026-03-01T00:00:00.000Z'),
      });

      const payload = {
        widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: false }],
        layout: 'default',
      };

      const res = await request(createApp('owner')).put('/api/dashboard/preferences').send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('owner');
      expect(res.body.data.layout).toBe('default');
      expect(res.body.data.widgets).toEqual(payload.widgets);
      expect(typeof res.body.data.updatedAt).toBe('string');
      expect(Number.isNaN(Date.parse(res.body.data.updatedAt))).toBe(false);
      expect(mockPrisma.userDashboardPreference.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        update: {
          role: 'owner',
          widgets: payload.widgets,
          layout: 'default',
        },
        create: {
          userId: 'user-1',
          role: 'owner',
          widgets: payload.widgets,
          layout: 'default',
        },
      });
    });

    it('defaults layout to "default" when omitted', async () => {
      const payload = {
        widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
      };

      const res = await request(createApp('owner')).put('/api/dashboard/preferences').send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.layout).toBe('default');
      expect(mockPrisma.userDashboardPreference.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        update: {
          role: 'owner',
          widgets: payload.widgets,
          layout: 'default',
        },
        create: {
          userId: 'user-1',
          role: 'owner',
          widgets: payload.widgets,
          layout: 'default',
        },
      });
    });

    it('defaults layout to "default" when empty string is provided', async () => {
      const payload = {
        widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
        layout: '',
      };

      const res = await request(createApp('owner')).put('/api/dashboard/preferences').send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.layout).toBe('default');
      expect(mockPrisma.userDashboardPreference.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        update: {
          role: 'owner',
          widgets: payload.widgets,
          layout: 'default',
        },
        create: {
          userId: 'user-1',
          role: 'owner',
          widgets: payload.widgets,
          layout: 'default',
        },
      });
    });

    it('uses authenticated role even when client sends a different role', async () => {
      const payload = {
        widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
        layout: 'compact',
        role: 'admin',
      };

      const res = await request(createApp('owner')).put('/api/dashboard/preferences').send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('owner');
      expect(mockPrisma.userDashboardPreference.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        update: {
          role: 'owner',
          widgets: payload.widgets,
          layout: 'compact',
        },
        create: {
          userId: 'user-1',
          role: 'owner',
          widgets: payload.widgets,
          layout: 'compact',
        },
      });
    });

    it('returns 401 when user context is missing', async () => {
      const res = await request(createAppWithoutUser())
        .put('/api/dashboard/preferences')
        .send({
          widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
          layout: 'default',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/authentication required/i);
    });
  });

  // ── GET /summary ─────────────────────────────────────────────────
  describe('GET /api/dashboard/summary', () => {
    it('returns 200 with metrics for owner', async () => {
      const res = await request(createApp('owner')).get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics).toBeDefined();
      expect(res.body.data.metrics.totalLeads).toBeDefined();
      expect(res.body.data.metrics.totalProperties).toBeDefined();
      expect(res.body.data.recentActivities).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/dashboard/summary');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 200 for manager role', async () => {
      const res = await request(createApp('manager')).get('/api/dashboard/summary');
      expect(res.status).toBe(200);
    });

    it('returns 200 for finance role', async () => {
      const res = await request(createApp('finance')).get('/api/dashboard/summary');
      expect(res.status).toBe(200);
    });

    it('calculates conversion rate correctly', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(100) // totalLeads
        .mockResolvedValueOnce(15) // hotLeads
        .mockResolvedValueOnce(20); // wonLeads
      const res = await request(createApp('owner')).get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.metrics.conversionRate).toBe(20);
    });

    it('handles zero leads gracefully', async () => {
      mockPrisma.lead.count.mockResolvedValue(0);
      const res = await request(createApp('owner')).get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.metrics.conversionRate).toBe(0);
    });

    it('formats recent activities correctly', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'act-1',
          type: 'lead',
          action: 'created',
          description: 'New lead',
          createdAt: new Date('2026-01-15'),
          user: { id: 'user-1', name: 'Agent John' },
          metadata: null,
        },
      ]);
      const res = await request(createApp('owner')).get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.recentActivities).toHaveLength(1);
      expect(res.body.data.recentActivities[0].user).toBe('Agent John');
    });
  });

  // ── GET /overview (alias for /summary) ───────────────────────────
  describe('GET /api/dashboard/overview', () => {
    it('returns 200 like /summary', async () => {
      const res = await request(createApp('owner')).get('/api/dashboard/overview');
      expect(res.status).toBe(200);
      expect(res.body.data.metrics).toBeDefined();
    });
  });

  // ── GET /activities ──────────────────────────────────────────────
  describe('GET /api/dashboard/activities', () => {
    it('returns 200 with activity feed for owner', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'act-1',
          type: 'lead',
          action: 'created',
          description: 'Activity 1',
          createdAt: new Date(),
          metadata: null,
          user: { id: 'user-1', name: 'Test' },
          lead: null,
        },
      ]);
      mockPrisma.activity.count.mockResolvedValueOnce(1);
      const res = await request(createApp('owner')).get('/api/dashboard/activities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/dashboard/activities');
      expect(res.status).toBe(403);
    });

    it('supports pagination params', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(100);
      const res = await request(createApp('owner')).get(
        '/api/dashboard/activities?page=2&pageSize=10'
      );
      expect(res.status).toBe(200);
    });

    it('supports type filter', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/dashboard/activities?type=lead');
      expect(res.status).toBe(200);
    });
  });

  // ── GET /executive ───────────────────────────────────────────────
  describe('GET /api/dashboard/executive', () => {
    it('returns 200 with executive analytics for owner', async () => {
      mockPrisma.lead.groupBy.mockResolvedValue([{ status: 'new', _count: { _all: 20 } }]);
      mockPrisma.property.groupBy.mockResolvedValue([
        { status: 'available', _count: { _all: 10 } },
      ]);
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'paid', _count: { _all: 5 }, _sum: { amount: 25000 } },
      ]);
      const res = await request(createApp('owner')).get('/api/dashboard/executive');
      expect(res.status).toBe(200);
      expect(res.body.data.leads).toBeDefined();
      expect(res.body.data.properties).toBeDefined();
      expect(res.body.data.commissions).toBeDefined();
      expect(res.body.data.portfolioValue).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/dashboard/executive');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /kpis ────────────────────────────────────────────────────
  describe('GET /api/dashboard/kpis', () => {
    it('returns 200 with KPI data for manager', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(30) // newLeads30d
        .mockResolvedValueOnce(8); // wonDeals30d
      mockPrisma.property.count.mockResolvedValueOnce(5); // newProperties30d
      mockPrisma.commission.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 100000 } }) // totalRevenue
        .mockResolvedValueOnce({ _avg: { amount: 10000 } }); // avgDealSize
      const res = await request(createApp('manager')).get('/api/dashboard/kpis');
      expect(res.status).toBe(200);
      expect(res.body.data.period).toBe('30d');
      expect(res.body.data.kpis).toBeDefined();
      expect(res.body.data.kpis.newLeads).toBeDefined();
      expect(res.body.data.kpis.wonDeals).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/dashboard/kpis');
      expect(res.status).toBe(403);
    });

    it('returns 200 for finance role', async () => {
      mockPrisma.lead.count.mockResolvedValue(0);
      mockPrisma.property.count.mockResolvedValue(0);
      mockPrisma.commission.aggregate.mockResolvedValue({
        _sum: { amount: 0 },
        _avg: { amount: 0 },
      });
      const res = await request(createApp('finance')).get('/api/dashboard/kpis');
      expect(res.status).toBe(200);
    });
  });

  // ── GET /lead-funnel ─────────────────────────────────────────────
  describe('GET /api/dashboard/lead-funnel', () => {
    it('returns funnel and tier distribution payload', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(9)
        .mockResolvedValueOnce(8)
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);

      const res = await request(createApp('owner')).get('/api/dashboard/lead-funnel');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(49);
      expect(res.body.data.funnel).toHaveLength(7);
      expect(res.body.data.funnel[0]).toEqual(
        expect.objectContaining({
          stage: 'new',
          count: expect.any(Number),
          percentage: expect.any(Number),
        })
      );
      expect(res.body.data.tierDistribution).toHaveLength(4);
    });
  });

  // ── GET /trends ──────────────────────────────────────────────────
  describe('GET /api/dashboard/trends', () => {
    it('returns daily series for requested period', async () => {
      const now = new Date('2026-03-20T10:00:00.000Z');
      mockPrisma.lead.findMany.mockResolvedValueOnce([
        { createdAt: new Date('2026-03-16T09:00:00.000Z') },
        { createdAt: new Date('2026-03-16T12:00:00.000Z') },
      ]);
      mockPrisma.transaction.findMany.mockResolvedValueOnce([
        { createdAt: new Date('2026-03-18T09:00:00.000Z'), amount: 100000 },
      ]);
      mockPrisma.commission.findMany.mockResolvedValueOnce([
        { createdAt: new Date('2026-03-19T09:00:00.000Z'), amount: 5000 },
      ]);

      vi.useFakeTimers();
      vi.setSystemTime(now);

      const res = await request(createApp('owner')).get('/api/dashboard/trends?days=5');

      vi.useRealTimers();

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.period).toBe('5d');
      expect(res.body.data.series).toHaveLength(5);
      expect(res.body.data.series[0]).toEqual(
        expect.objectContaining({
          date: expect.any(String),
          leads: expect.any(Number),
          transactions: expect.any(Number),
          transactionValue: expect.any(Number),
          commissions: expect.any(Number),
          commissionValue: expect.any(Number),
        })
      );
    });
  });

  // ── GET /property-aging ──────────────────────────────────────────
  describe('GET /api/dashboard/property-aging', () => {
    it('returns bucketed property aging summary', async () => {
      const now = new Date('2026-03-20T10:00:00.000Z');
      mockPrisma.property.findMany.mockResolvedValueOnce([
        {
          id: 'p-1',
          title: 'Palm Jumeirah Villa',
          createdAt: new Date('2026-03-18T10:00:00.000Z'),
          price: 4200000,
          location: 'Palm Jumeirah',
        },
        {
          id: 'p-2',
          title: 'Downtown Apartment',
          createdAt: new Date('2025-11-15T10:00:00.000Z'),
          price: 1800000,
          location: 'Downtown Dubai',
        },
      ]);

      vi.useFakeTimers();
      vi.setSystemTime(now);

      const res = await request(createApp('owner')).get('/api/dashboard/property-aging');

      vi.useRealTimers();

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalAvailable).toBe(2);
      expect(Array.isArray(res.body.data.buckets)).toBe(true);
      expect(res.body.data.buckets).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: '0-7 days', count: expect.any(Number) }),
          expect.objectContaining({ label: '90+ days', count: expect.any(Number) }),
        ])
      );
      expect(Array.isArray(res.body.data.staleProperties)).toBe(true);
    });
  });

  // ── GET /agent-performance (W18.1-P1-003) ───────────────────────
  describe('GET /api/dashboard/agent-performance', () => {
    beforeEach(() => {
      (mockPrisma.user as any).findMany = vi
        .fn()
        .mockResolvedValue([
          { id: 'agent-1', name: 'Sara Khan', email: 'sara@wc.ae', department: 'Sales' },
        ]);
      mockPrisma.user.count.mockResolvedValue(1);
      mockPrisma.lead.count.mockResolvedValue(20);
      mockPrisma.commission.aggregate.mockResolvedValue({
        _sum: { amount: 25000 },
        _count: 4,
      });
      mockPrisma.transaction.count.mockResolvedValue(3);
    });

    it('returns 200 with agent performance data for owner', async () => {
      const res = await request(createApp('owner')).get('/api/dashboard/agent-performance');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.agents).toBeDefined();
      expect(res.body.data.pagination).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/dashboard/agent-performance');
      expect(res.status).toBe(403);
    });

    it('accepts agentId filter param', async () => {
      const res = await request(createApp('owner')).get(
        '/api/dashboard/agent-performance?agentId=agent-1'
      );
      expect(res.status).toBe(200);
    });

    it('accepts date range filter params', async () => {
      const res = await request(createApp('owner')).get(
        '/api/dashboard/agent-performance?from=2026-01-01&to=2026-06-30'
      );
      expect(res.status).toBe(200);
    });

    it('accepts stage filter param', async () => {
      const res = await request(createApp('owner')).get(
        '/api/dashboard/agent-performance?stage=won'
      );
      expect(res.status).toBe(200);
    });

    it('accepts pagination params', async () => {
      const res = await request(createApp('owner')).get(
        '/api/dashboard/agent-performance?page=2&limit=10'
      );
      expect(res.status).toBe(200);
      expect(res.body.data.pagination.page).toBe(2);
    });

    it('returns performance rows with expected shape', async () => {
      const res = await request(createApp('owner')).get('/api/dashboard/agent-performance');
      expect(res.status).toBe(200);
      const agent = res.body.data.agents[0];
      expect(agent).toHaveProperty('id');
      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('totalLeads');
      expect(agent).toHaveProperty('wonLeads');
      expect(agent).toHaveProperty('conversionRate');
      expect(agent).toHaveProperty('totalCommission');
      expect(agent).toHaveProperty('dealsClosed');
    });
  });

  // ── POST /agent-performance/export (W18.1-P1-003) ───────────────
  describe('POST /api/dashboard/agent-performance/export', () => {
    it('returns 202 with jobId for owner', async () => {
      const res = await request(createApp('owner'))
        .post('/api/dashboard/agent-performance/export')
        .send({ format: 'xlsx' });
      expect(res.status).toBe(202);
      expect(res.body.success).toBe(true);
      expect(res.body.data.jobId).toMatch(/^exp_/);
      expect(res.body.data.status).toBe('queued');
      expect(res.body.data.format).toBe('xlsx');
    });

    it('returns 202 for pdf format', async () => {
      const res = await request(createApp('owner'))
        .post('/api/dashboard/agent-performance/export')
        .send({ format: 'pdf' });
      expect(res.status).toBe(202);
      expect(res.body.data.format).toBe('pdf');
    });

    it('returns 400 for invalid format', async () => {
      const res = await request(createApp('owner'))
        .post('/api/dashboard/agent-performance/export')
        .send({ format: 'docx' });
      expect(res.status).toBe(400);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .post('/api/dashboard/agent-performance/export')
        .send({ format: 'xlsx' });
      expect(res.status).toBe(403);
    });

    it('accepts agentId and date filter in body', async () => {
      const res = await request(createApp('manager'))
        .post('/api/dashboard/agent-performance/export')
        .send({ format: 'xlsx', agentId: 'agent-1', from: '2026-01-01', to: '2026-06-30' });
      expect(res.status).toBe(202);
    });
  });

  // ── GET /agent-performance/export/:jobId (W18.1-P1-003) ─────────
  describe('GET /api/dashboard/agent-performance/export/:jobId', () => {
    it('returns 200 with download URL for valid job', async () => {
      const res = await request(createApp('owner')).get(
        '/api/dashboard/agent-performance/export/exp_123_abc'
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('complete');
      expect(res.body.data.downloadUrl).toBeDefined();
    });

    it('returns 400 for invalid job ID format', async () => {
      const res = await request(createApp('owner')).get(
        '/api/dashboard/agent-performance/export/invalid_id'
      );
      expect(res.status).toBe(400);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get(
        '/api/dashboard/agent-performance/export/exp_123_abc'
      );
      expect(res.status).toBe(403);
    });
  });
});
