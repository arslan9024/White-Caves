import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    whatsAppConsent: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
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

import consentRoutes from './consent.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/consent', consentRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('PDPL Consent Routes — /api/consent (Wave 42)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/consent', () => {
    it('records user PDPL consent', async () => {
      mockPrisma.whatsAppConsent.upsert.mockResolvedValueOnce({
        phone: '+971501112233',
        consent: true,
      });

      const res = await request(createApp())
        .post('/api/consent')
        .send({ phone: '+971501112233', version: 'pdpl-v1.0' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.consent).toBe(true);
    });
  });

  describe('GET /api/consent/:phone', () => {
    it('returns consent status for phone number', async () => {
      mockPrisma.whatsAppConsent.findUnique.mockResolvedValueOnce({
        phone: '+971501112233',
        consent: true,
      });

      const res = await request(createApp()).get('/api/consent/+971501112233');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hasConsent).toBe(true);
    });
  });

  describe('POST /api/consent/opt-out', () => {
    it('opts out user from marketing communications', async () => {
      mockPrisma.whatsAppConsent.upsert.mockResolvedValueOnce({
        phone: '+971501112233',
        consent: false,
        optedOutAt: new Date(),
      });

      const res = await request(createApp())
        .post('/api/consent/opt-out')
        .send({ phone: '+971501112233', reason: 'Unsubscribed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('opted_out');
    });
  });
});
