import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    activity: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
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

import sarRoutes from './sar.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; role: string } }).user = {
      id: 'usr-compliance',
      role: 'owner',
    };
    next();
  });
  app.use('/api/sar', sarRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = '507f1f77bcf86cd799439011';

describe('SAR Routes — /api/sar (Wave 42)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/sar', () => {
    it('returns list of filed SAR records', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        { id: VALID_ID, description: 'SAR filed for John Doe' },
      ]);

      const res = await request(createApp()).get('/api/sar');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/sar', () => {
    it('files a new SAR record', async () => {
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: VALID_ID,
        description: 'SAR filed for Jane Doe',
      });

      const res = await request(createApp())
        .post('/api/sar')
        .send({ clientName: 'Jane Doe', suspicionReason: 'Unclear cash source' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(VALID_ID);
    });
  });

  describe('PATCH /api/sar/:id/goaml-status', () => {
    it('updates goAML status and reference number', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        metadata: { goAmlStatus: 'draft' },
      });
      mockPrisma.activity.update.mockResolvedValueOnce({
        id: VALID_ID,
        metadata: { goAmlStatus: 'submitted', goAmlReferenceNumber: 'GOAML-99182' },
      });

      const res = await request(createApp())
        .patch(`/api/sar/${VALID_ID}/goaml-status`)
        .send({ goAmlStatus: 'submitted', referenceNumber: 'GOAML-99182' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
