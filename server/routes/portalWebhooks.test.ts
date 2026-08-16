import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
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

import portalWebhooksRoutes from './portalWebhooks.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/webhooks/portals', portalWebhooksRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Portal Webhooks Routes — /api/webhooks/portals (Wave 39)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/webhooks/portals/propertyfinder', () => {
    it('creates a new lead from PropertyFinder webhook payload', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null);
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: 'lead-pf-1',
        name: 'Rashid Khan',
        phone: '+971501234567',
        source: 'PropertyFinder',
      });

      const res = await request(createApp())
        .post('/api/webhooks/portals/propertyfinder')
        .send({
          name: 'Rashid Khan',
          phone: '+971501234567',
          email: 'rashid@example.com',
          message: 'Interested in Downtown Villa',
          propertyRef: 'prop-101',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.leadId).toBe('lead-pf-1');
      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Rashid Khan',
          source: 'PropertyFinder',
          score: 30,
        }),
      });
    });

    it('returns 400 if phone and email are missing', async () => {
      const res = await request(createApp())
        .post('/api/webhooks/portals/propertyfinder')
        .send({ name: 'Anonymous' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/webhooks/portals/bayut', () => {
    it('creates a new lead from Bayut webhook payload', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null);
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: 'lead-bayut-1',
        name: 'Sarah Connor',
        phone: '+971509876543',
        source: 'Bayut',
      });

      const res = await request(createApp())
        .post('/api/webhooks/portals/bayut')
        .send({
          name: 'Sarah Connor',
          phone: '+971509876543',
          email: 'sarah@example.com',
          comments: 'Looking for 2BR in Marina',
          referenceNumber: 'prop-202',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.leadId).toBe('lead-bayut-1');
      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Sarah Connor',
          source: 'Bayut',
          score: 30,
        }),
      });
    });
  });
});
