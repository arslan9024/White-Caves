import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      count: vi.fn(),
    },
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-101' }),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));

import agentTargetsRoutes from './agentTargets.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; role: string } }).user = {
      id: 'manager-101',
      role: 'owner',
    };
    next();
  });
  app.use('/api/agent-targets', agentTargetsRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Agent Targets Routes — /api/agent-targets (Wave 40)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/agent-targets', () => {
    it('returns monthly target and progress for agent', async () => {
      mockPrisma.lead.count.mockResolvedValueOnce(3);

      const res = await request(createApp()).get('/api/agent-targets');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.progressPercent).toBe(60);
    });
  });

  describe('POST /api/agent-targets', () => {
    it('sets monthly target for an agent', async () => {
      const res = await request(createApp())
        .post('/api/agent-targets')
        .send({
          agentId: 'ag-101',
          month: '2026-08',
          targetRevenueAED: 600000,
          targetDeals: 6,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.targetRevenueAED).toBe(600000);
    });
  });
});
