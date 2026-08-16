import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      count: vi.fn(),
    },
    property: {
      count: vi.fn(),
    },
    activity: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    user: {
      findMany: vi.fn(),
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

import agentPerformanceRoutes from './agentPerformance.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; role: string } }).user = {
      id: 'agent-101',
      role: 'owner',
    };
    next();
  });
  app.use('/api/agent-performance', agentPerformanceRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Agent Performance Routes — /api/agent-performance (Wave 40)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/agent-performance/metrics', () => {
    it('returns KPI metrics breakdown for agent', async () => {
      mockPrisma.lead.count.mockResolvedValueOnce(10).mockResolvedValueOnce(3);
      mockPrisma.property.count.mockResolvedValueOnce(5);

      const res = await request(createApp()).get('/api/agent-performance/metrics');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.conversionRatePercent).toBe(30);
    });
  });

  describe('GET /api/agent-performance/leaderboard', () => {
    it('returns ranked leaderboard of agents', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 'ag-1', name: 'Agent Alpha', role: 'sales_agent' },
        { id: 'ag-2', name: 'Agent Beta', role: 'leasing_agent' },
      ]);
      mockPrisma.lead.count
        .mockResolvedValueOnce(20).mockResolvedValueOnce(10) // ag-1
        .mockResolvedValueOnce(15).mockResolvedValueOnce(2);  // ag-2

      const res = await request(createApp()).get('/api/agent-performance/leaderboard');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].agentId).toBe('ag-1');
      expect(res.body.data[0].rank).toBe(1);
    });
  });

  describe('GET /api/agent-performance/sla-response', () => {
    it('returns WhatsApp SLA first-response compliance metrics', async () => {
      const res = await request(createApp()).get('/api/agent-performance/sla-response');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.targetSlaMinutes).toBe(15);
    });
  });
});
