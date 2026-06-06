/**
 * P0-020: GET /api/dashboard/analytics/kpi-baseline
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const mockPrisma = vi.hoisted(() => ({
  lead: { findMany: vi.fn(), count: vi.fn() },
  activity: { findFirst: vi.fn() },
  viewing: { findMany: vi.fn(), count: vi.fn() },
  offer: { count: vi.fn(), findMany: vi.fn() },
  property: { findMany: vi.fn() },
  user: { count: vi.fn() },
  commission: { aggregate: vi.fn() },
}));

const mockDocumentService = vi.hoisted(() => ({
  generateMonthlyPLReport: vi.fn(),
  generatePropertiesReport: vi.fn(),
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/errorHandler', async () => {
  const actual = await vi.importActual('../middleware/errorHandler');
  return actual;
});
vi.mock('../middleware/rbac', () => ({
  requirePermission:
    () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
      next(),
  requireRole: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
    next(),
  resolveBackendRole: (role: string) => role,
  roleHasPermission: () => true,
}));
vi.mock('../services/DocumentService.js', () => ({ documentService: mockDocumentService }));

async function createApp(role = 'manager') {
  const { default: reportingRouter } = await import('../routes/reporting');
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as express.Request & { user: { id: string; role: string } }).user = { id: 'u1', role };
    next();
  });
  app.use('/', reportingRouter);
  return app;
}

describe('GET /analytics/kpi-baseline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.lead.findMany.mockResolvedValue([]);
    mockPrisma.lead.count.mockResolvedValue(10);
    mockPrisma.activity.findFirst.mockResolvedValue(null);
    mockPrisma.viewing.findMany.mockResolvedValue([]);
    mockPrisma.viewing.count.mockResolvedValue(4);
    mockPrisma.offer.findMany.mockResolvedValue([]);
    mockPrisma.offer.count.mockResolvedValue(2);
    mockPrisma.property.findMany.mockResolvedValue([
      {
        title: 'T',
        description: 'D',
        price: 1000,
        type: 'apartment',
        status: 'available',
        location: 'Dubai',
        area: 'Marina',
        bedrooms: 2,
        bathrooms: 1,
        sqft: 900,
        images: ['x'],
        buildingPermitNumber: 'BPN-1',
      },
    ]);
    mockPrisma.user.count.mockResolvedValue(5);
  });

  it('returns 200 with success:true and 8 KPIs for manager', async () => {
    const app = await createApp('manager');
    const res = await request(app).get('/analytics/kpi-baseline');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.kpis)).toBe(true);
    expect(res.body.data.kpis).toHaveLength(8);
  });

  it('each KPI has name, current, target, unit, trend, higherIsBetter', async () => {
    const app = await createApp('manager');
    const res = await request(app).get('/analytics/kpi-baseline');
    for (const kpi of res.body.data.kpis) {
      expect(kpi).toHaveProperty('name');
      expect(kpi).toHaveProperty('current');
      expect(kpi).toHaveProperty('target');
      expect(kpi).toHaveProperty('unit');
      expect(kpi).toHaveProperty('trend');
      expect(kpi).toHaveProperty('higherIsBetter');
    }
  });

  it('returns 403 for agent role', async () => {
    const app = await createApp('agent');
    const res = await request(app).get('/analytics/kpi-baseline');
    expect(res.status).toBe(403);
  });

  it('keeps lead/activity pairing when some leads have no response activity', async () => {
    const now = new Date('2026-05-27T12:00:00.000Z');
    vi.useFakeTimers();
    mockPrisma.lead.findMany.mockResolvedValue([
      { id: 'lead-1', createdAt: new Date('2026-05-27T08:00:00.000Z') },
      { id: 'lead-2', createdAt: new Date('2026-05-27T09:00:00.000Z') },
    ]);
    mockPrisma.activity.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ createdAt: new Date('2026-05-27T11:00:00.000Z'), leadId: 'lead-2' });
    vi.setSystemTime(now);

    const app = await createApp('manager');
    const res = await request(app).get('/analytics/kpi-baseline');
    const firstResponseKpi = res.body.data.kpis.find(
      (kpi: { name: string }) => kpi.name === 'First Response Time'
    );

    expect(firstResponseKpi.current).toBe(2);
    vi.useRealTimers();
  });

  it('limits listing completeness sampling to a bounded property set', async () => {
    const app = await createApp('manager');
    await request(app).get('/analytics/kpi-baseline');

    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 200,
        orderBy: { createdAt: 'desc' },
      })
    );
  });
});
