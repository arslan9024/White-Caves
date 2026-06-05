import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const mockPrisma = vi.hoisted(() => ({
  cadenceRule: {
    findMany: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));
vi.mock('../services/automation/followUpEngine.js', () => ({
  startSequence: vi.fn(),
  pauseSequence: vi.fn(),
  resumeSequence: vi.fn(),
  cancelSequence: vi.fn(),
  getSequenceSummary: vi.fn(),
  getLeadSequences: vi.fn().mockResolvedValue([]),
  getFollowUpStats: vi.fn().mockResolvedValue({}),
}));
vi.mock('../services/automation/cadenceTemplates.js', () => ({
  CADENCE_MAP: {},
}));
vi.mock('../utils/logger.js', () => ({
  createLogger: vi.fn(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })),
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

async function createApp() {
  const { default: followUpsRouter } = await import('../routes/follow-ups');
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as express.Request & { user: { id: string; role: string } }).user = {
      id: 'u1',
      role: 'manager',
    };
    next();
  });
  app.use('/', followUpsRouter);
  app.use((err: { statusCode?: number; message: string }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.statusCode ?? 500).json({ success: false, message: err.message });
  });
  return app;
}

describe('follow-ups cadence rule validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when name is missing', async () => {
    const app = await createApp();
    const res = await request(app).post('/rules').send({ channelSequence: ['email'] });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('name is required');
  });

  it('returns 400 when channelSequence is missing', async () => {
    const app = await createApp();
    const res = await request(app).post('/rules').send({ name: 'VIP follow-up' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('channelSequence is required and must be a non-empty array');
  });
});
