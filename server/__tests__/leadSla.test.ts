/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tests: Task 3 — Lead SLA Timer
 * Covers: GET /api/leads/sla-breaches
 *         POST /api/leads/:id/sla-nudge
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockPrisma, mockNotificationService } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    activity: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
  mockNotificationService: {
    pushToUser: vi.fn(),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/NotificationService.js', () => ({
  notificationService: mockNotificationService,
}));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(msg: string, code: number) {
      super(msg);
      this.statusCode = code;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireMinRole: () => (_req: any, _res: any, next: any) => next(),
  requireRole: () => (_req: any, _res: any, next: any) => next(),
  scopeToOwn: () => (req: any, _res: any, next: any) => {
    req.ownershipFilter = {};
    next();
  },
}));
vi.mock('../utils/sanitize', () => ({ sanitizeString: (s: string) => s }));
vi.mock('../utils/validate', () => ({
  validate: vi.fn(),
  rules: { oneOf: vi.fn(() => () => undefined) },
  validateIdParam: vi.fn(),
}));
vi.mock('../config/pagination', () => ({
  parsePagination: () => ({ page: 1, limit: 20, skip: 0 }),
}));
vi.mock('../services/CacheService.js', () => ({
  cacheService: { get: vi.fn(), set: vi.fn(), invalidate: vi.fn() },
}));
vi.mock('../services/socketServer.js', () => ({ getSocketServer: vi.fn() }));
vi.mock('../services/ai/leadScoringEngine.js', () => ({
  scoreLead: vi.fn(),
  overrideScore: vi.fn(),
  batchRescoreLeads: vi.fn(),
  getScoreHistory: vi.fn(),
  getScoreTrending: vi.fn(),
  applyWhatsAppSignal: vi.fn(),
}));
vi.mock('../services/ai/leadAutoRouter.js', () => ({
  getRoutingRules: vi.fn(),
  getAgentPerformance: vi.fn(),
  autoRouteHotLead: vi.fn(),
}));
vi.mock('../services/ai/leadAutoRescore.js', () => ({ triggerLeadRescore: vi.fn() }));

import leadsRoutes from '../routes/leads';

const createApp = (role = 'manager') => {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res: any, next: any) => {
    req.user = { id: 'user-mgr-1', role };
    next();
  });
  app.use('/api/leads', leadsRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);

const makeBreachedLead = (id: string) => ({
  id,
  name: `Lead ${id}`,
  email: null,
  phone: null,
  status: 'new',
  source: 'direct',
  score: 20,
  createdAt: hoursAgo(6), // 6 hours ago → breaches 4h SLA
  assignedToId: 'agent-1',
  assignedTo: { id: 'agent-1', name: 'Agent One', email: 'a@b.com' },
});

// ── GET /sla-breaches ────────────────────────────────────────────────────────
describe('GET /api/leads/sla-breaches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.lead.findMany.mockResolvedValue([makeBreachedLead('breach-1')]);
    mockPrisma.lead.count.mockResolvedValue(1);
  });

  it('returns 200 with breached leads and pagination', async () => {
    const res = await request(createApp()).get('/api/leads/sla-breaches');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('queries for new and contacted status leads older than SLA threshold', async () => {
    await request(createApp()).get('/api/leads/sla-breaches');
    expect(mockPrisma.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { in: ['new', 'contacted'] },
          createdAt: expect.objectContaining({ lt: expect.any(Date) }),
        }),
      })
    );
  });

  it('enriches each lead with slaBreachHours', async () => {
    const res = await request(createApp()).get('/api/leads/sla-breaches');
    const lead = res.body.data[0];
    expect(lead).toHaveProperty('slaBreachHours');
    expect(typeof lead.slaBreachHours).toBe('number');
    expect(lead.slaBreachHours).toBeGreaterThan(4); // created 6h ago
  });

  it('includes meta.slaHours in the response', async () => {
    const res = await request(createApp()).get('/api/leads/sla-breaches');
    expect(res.body.meta).toMatchObject({ slaHours: 4 });
  });

  it('includes pagination metadata', async () => {
    mockPrisma.lead.findMany.mockResolvedValue([]);
    mockPrisma.lead.count.mockResolvedValue(42);
    const res = await request(createApp()).get('/api/leads/sla-breaches?page=2&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.body.pagination).toMatchObject({ total: 42 });
  });

  it('orders results by createdAt asc (oldest breach first)', async () => {
    await request(createApp()).get('/api/leads/sla-breaches');
    expect(mockPrisma.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: 'asc' } })
    );
  });
});

// ── POST /:id/sla-nudge ──────────────────────────────────────────────────────
describe('POST /api/leads/:id/sla-nudge', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 404 when lead does not exist', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue(null);
    const res = await request(createApp()).post('/api/leads/nonexistent/sla-nudge');
    expect(res.status).toBe(404);
  });

  it('returns 409 when lead is still within SLA window (created < 4h ago)', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: 'lead-fresh',
      name: 'Fresh Lead',
      status: 'new',
      createdAt: hoursAgo(1), // only 1h old
      assignedToId: 'agent-1',
      assignedTo: { id: 'agent-1', name: 'Agent', email: 'a@b.com' },
    });
    const res = await request(createApp()).post('/api/leads/lead-fresh/sla-nudge');
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/within SLA window/i);
  });

  it('returns 200 and sends notification for a breached lead', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: 'lead-breach',
      name: 'Breached Lead',
      status: 'new',
      createdAt: hoursAgo(6), // 6h old → breached
      assignedToId: 'agent-1',
      assignedTo: { id: 'agent-1', name: 'Agent', email: 'a@b.com' },
    });
    mockNotificationService.pushToUser.mockResolvedValue(undefined);
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });

    const res = await request(createApp()).post('/api/leads/lead-breach/sla-nudge');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.leadId).toBe('lead-breach');
    expect(res.body.data.breachHours).toBeGreaterThan(4);
  });

  it('calls notificationService.pushToUser for the assigned agent', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: 'lead-breach-2',
      name: 'Another Breach',
      status: 'new',
      createdAt: hoursAgo(8),
      assignedToId: 'agent-xyz',
      assignedTo: { id: 'agent-xyz', name: 'Agent XYZ', email: 'x@y.com' },
    });
    mockNotificationService.pushToUser.mockResolvedValue(undefined);
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-2' });

    await request(createApp()).post('/api/leads/lead-breach-2/sla-nudge');
    expect(mockNotificationService.pushToUser).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'agent-xyz',
        type: 'lead',
        title: expect.stringMatching(/SLA Breach/i),
      })
    );
  });

  it('creates an activity record for audit trail', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: 'lead-audit',
      name: 'Audit Lead',
      status: 'new',
      createdAt: hoursAgo(5),
      assignedToId: 'agent-a',
      assignedTo: { id: 'agent-a', name: 'A', email: 'a@a.com' },
    });
    mockNotificationService.pushToUser.mockResolvedValue(undefined);
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-audit' });

    await request(createApp()).post('/api/leads/lead-audit/sla-nudge');
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'sla_nudge_sent',
          leadId: 'lead-audit',
        }),
      })
    );
  });

  it('nudges the requesting manager when lead has no assigned agent', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: 'lead-unassigned',
      name: 'Unassigned',
      status: 'new',
      createdAt: hoursAgo(10),
      assignedToId: null,
      assignedTo: null,
    });
    mockNotificationService.pushToUser.mockResolvedValue(undefined);
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-3' });

    await request(createApp()).post('/api/leads/lead-unassigned/sla-nudge');
    // Falls back to req.user.id = 'user-mgr-1'
    expect(mockNotificationService.pushToUser).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-mgr-1' })
    );
  });
});
