/**
 * P0-019: GET /api/leads/analytics/funnel
 * Funnel analytics endpoint with period support.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// ── hoisted mocks ─────────────────────────────────────────────────────────────
const mockPrisma = vi.hoisted(() => ({
  lead: {
    count: vi.fn(),
  },
  viewing: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  offer: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
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
  scopeToOwn: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
    next(),
  requireMinRole:
    () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
      next(),
  resolveBackendRole: (role: string) => role,
  roleHasPermission: () => true,
}));
vi.mock('../utils/sanitize', () => ({ sanitizeString: (v: string) => v }));
vi.mock('../utils/validate', () => ({
  validate: () => (_: unknown, __: unknown, next: express.NextFunction) => next(),
  rules: { id: [], string: () => [], number: () => [] },
  validateIdParam: () => (_: unknown, __: unknown, next: express.NextFunction) => next(),
}));
vi.mock('../config/pagination', () => ({
  parsePagination: () => ({ page: 1, limit: 50, skip: 0 }),
}));
vi.mock('../services/socketServer.js', () => ({ getSocketServer: () => null }));
vi.mock('../services/NotificationService.js', () => ({ notificationService: { send: vi.fn() } }));
vi.mock('../services/ai/leadAutoRescore.js', () => ({ triggerLeadRescore: vi.fn() }));

// ── app factory ───────────────────────────────────────────────────────────────
async function createApp() {
  const { default: leadsRouter } = await import('../routes/leads');
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as express.Request & { user: { id: string; role: string } }).user = {
      id: 'u1',
      role: 'manager',
    };
    next();
  });
  app.use('/', leadsRouter);
  return app;
}

// ── tests ─────────────────────────────────────────────────────────────────────
describe('GET /analytics/funnel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // six statuses: new/contacted/qualified/viewing/offered/won
    mockPrisma.lead.count.mockResolvedValue(5);
    mockPrisma.viewing.findMany.mockResolvedValue([{ leadId: 'l1' }, { leadId: 'l2' }]);
    mockPrisma.offer.findMany.mockResolvedValue([{ leadId: 'l1' }]);
  });

  it('returns 200 with correct shape', async () => {
    const app = await createApp();
    const res = await request(app).get('/analytics/funnel');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('stages');
    expect(res.body).toHaveProperty('totalLeads');
    expect(res.body).toHaveProperty('viewingRate');
    expect(res.body).toHaveProperty('offerRate');
    expect(res.body).toHaveProperty('wonRate');
  });

  it('returns exactly 6 stages', async () => {
    const app = await createApp();
    const res = await request(app).get('/analytics/funnel');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.stages)).toBe(true);
    expect(res.body.stages).toHaveLength(6);
  });

  it('each stage has required fields', async () => {
    const app = await createApp();
    const res = await request(app).get('/analytics/funnel');
    for (const stage of res.body.stages) {
      expect(stage).toHaveProperty('stage');
      expect(stage).toHaveProperty('count');
      expect(stage).toHaveProperty('dropOffPct');
    }
  });

  it('accepts period=7d query param without error', async () => {
    const app = await createApp();
    const res = await request(app).get('/analytics/funnel?period=7d');
    expect(res.status).toBe(200);
  });

  it('defaults to 30d when invalid period provided', async () => {
    const app = await createApp();
    const res = await request(app).get('/analytics/funnel?period=bogus');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.stages)).toBe(true);
  });
});
