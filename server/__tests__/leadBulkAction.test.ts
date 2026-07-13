
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tests: Task 2 — Bulk Lead Actions
 * Covers: POST /api/leads/bulk-action
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      findMany:  vi.fn(),
      count:     vi.fn(),
      findUnique: vi.fn(),
      create:    vi.fn(),
      update:    vi.fn(),
    },
    activity: {
      create:   vi.fn(),
      findMany: vi.fn(),
      count:    vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(msg: string, code: number) { super(msg); this.statusCode = code; }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireMinRole:    () => (_req: any, _res: any, next: any) => next(),
  requireRole:       () => (_req: any, _res: any, next: any) => next(),
  scopeToOwn:        () => (req: any, _res: any, next: any) => { req.ownershipFilter = {}; next(); },
}));
vi.mock('../utils/sanitize', () => ({ sanitizeString: (s: string) => s }));
vi.mock('../utils/validate', () => ({
  validate:        vi.fn(),
  rules:           { oneOf: vi.fn(() => () => undefined) },
  validateIdParam: vi.fn(),
}));
vi.mock('../config/pagination', () => ({
  parsePagination: () => ({ page: 1, limit: 20, skip: 0 }),
}));
vi.mock('../services/CacheService.js', () => ({
  cacheService: { get: vi.fn(), set: vi.fn(), invalidate: vi.fn() },
}));
vi.mock('../services/NotificationService.js', () => ({
  notificationService: { pushToUser: vi.fn() },
}));
vi.mock('../services/socketServer.js',        () => ({ getSocketServer: vi.fn() }));
vi.mock('../services/ai/leadScoringEngine.js',() => ({
  scoreLead: vi.fn(), overrideScore: vi.fn(), batchRescoreLeads: vi.fn(),
  getScoreHistory: vi.fn(), getScoreTrending: vi.fn(), applyWhatsAppSignal: vi.fn(),
}));
vi.mock('../services/ai/leadAutoRouter.js', () => ({
  getRoutingRules: vi.fn(), getAgentPerformance: vi.fn(), autoRouteHotLead: vi.fn(),
}));
vi.mock('../services/ai/leadAutoRescore.js', () => ({ triggerLeadRescore: vi.fn() }));

import leadsRoutes from '../routes/leads.js';

/** Factory: build a minimal Express app with a configurable user role */
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

const VALID_IDS = ['lead-1', 'lead-2', 'lead-3'];

describe('POST /api/leads/bulk-action — input validation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when ids is missing', async () => {
    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ action: 'archive' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/ids/i);
  });

  it('returns 400 when ids is an empty array', async () => {
    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: [], action: 'archive' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/non-empty/i);
  });

  it('returns 400 when ids exceeds 100', async () => {
    const tooMany = Array.from({ length: 101 }, (_, i) => `lead-${i}`);
    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: tooMany, action: 'archive' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/100/);
  });

  it('returns 400 for an unrecognised action', async () => {
    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'delete' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid action/i);
  });

  it('returns 400 for change-status when payload.status is missing', async () => {
    mockPrisma.$transaction.mockImplementation(async (cb: any) =>
      cb({ lead: { updateMany: vi.fn() }, activity: { create: vi.fn() } }),
    );
    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'change-status', payload: {} });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/payload\.status/i);
  });

  it('returns 400 for assign when payload.assigneeId is missing', async () => {
    const res = await request(createApp('manager'))
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'assign', payload: {} });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/payload\.assigneeId/i);
  });

  it('returns 400 for set-reminder when payload.reminderAt is missing', async () => {
    const res = await request(createApp('manager'))
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'set-reminder', payload: {} });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/payload\.reminderAt/i);
  });
});

describe('POST /api/leads/bulk-action — RBAC', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 403 when an agent tries to bulk-assign', async () => {
    const res = await request(createApp('agent'))
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'assign', payload: { assigneeId: 'user-x' } });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/manager/i);
  });

  it('allows a manager to bulk-assign', async () => {
    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const mockTx = {
        lead:     { updateMany: vi.fn().mockResolvedValue({ count: 3 }) },
        activity: { create: vi.fn().mockResolvedValue({ id: 'act-1' }) },
      };
      return cb(mockTx);
    });
    const res = await request(createApp('manager'))
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'assign', payload: { assigneeId: 'user-target' } });
    expect(res.status).toBe(200);
  });
});

describe('POST /api/leads/bulk-action — success paths', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const mockTx = {
        lead:     { updateMany: vi.fn().mockResolvedValue({ count: VALID_IDS.length }) },
        activity: { create: vi.fn().mockResolvedValue({ id: 'act-mock' }) },
      };
      return cb(mockTx);
    });
  });

  it('returns 200 and affected count for archive action', async () => {
    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'archive' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.affected).toBe(VALID_IDS.length);
  });

  it('sets status=archived for archive action', async () => {
    let capturedTx: any;
    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      capturedTx = {
        lead:     { updateMany: vi.fn().mockResolvedValue({ count: 3 }) },
        activity: { create: vi.fn().mockResolvedValue({ id: 'act-1' }) },
      };
      return cb(capturedTx);
    });
    await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'archive' });
    expect(capturedTx.lead.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'archived' }) }),
    );
  });

  it('returns 200 and the action name in the message', async () => {
    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'change-status', payload: { status: 'qualified' } });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/change-status/);
  });

  it('creates one activity record per lead inside transaction', async () => {
    let createCallCount = 0;
    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const mockTx = {
        lead:     { updateMany: vi.fn().mockResolvedValue({ count: 3 }) },
        activity: { create: vi.fn().mockImplementation(() => { createCallCount++; return { id: 'act' }; }) },
      };
      return cb(mockTx);
    });
    await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'archive' });
    expect(createCallCount).toBe(VALID_IDS.length);
  });

  it('creates reminder activities without updateMany when scheduling reminders', async () => {
    let capturedTx: any;
    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      capturedTx = {
        lead: { updateMany: vi.fn().mockResolvedValue({ count: 3 }) },
        activity: { create: vi.fn().mockResolvedValue({ id: 'act-reminder' }) },
      };
      return cb(capturedTx);
    });

    const res = await request(createApp())
      .post('/api/leads/bulk-action')
      .send({ ids: VALID_IDS, action: 'set-reminder', payload: { reminderAt: '2026-06-15T10:00:00.000Z' } });

    expect(res.status).toBe(200);
    expect(capturedTx.lead.updateMany).not.toHaveBeenCalled();
    expect(capturedTx.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'reminder_set',
        }),
      }),
    );
  });
});

