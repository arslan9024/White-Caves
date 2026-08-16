import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    whatsAppConsent: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
    activity: { create: vi.fn().mockResolvedValue({ id: 'act-del-1' }) },
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

import dataDeleteRoutes from './dataDelete.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/data-delete', dataDeleteRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('PDPL Data Delete Routes — /api/data-delete (Wave 42)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/data-delete', () => {
    it('schedules data erasure request under PDPL', async () => {
      const res = await request(createApp())
        .post('/api/data-delete')
        .send({ identifier: '+971509998877', reason: 'Account closed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('erasure_scheduled');
    });
  });
});
