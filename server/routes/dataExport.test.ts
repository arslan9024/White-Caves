import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: { findFirst: vi.fn() },
    whatsAppConsent: { findFirst: vi.fn() },
    kycRecord: { findFirst: vi.fn() },
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

import dataExportRoutes from './dataExport.js';

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
  app.use('/api/data-export', dataExportRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('PDPL Data Export Routes — /api/data-export (Wave 42)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/data-export/:identifier', () => {
    it('exports personal data records for client identifier', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce({
        id: 'lead-1',
        name: 'Zainab Al Hosani',
        email: 'zainab@example.com',
      });
      mockPrisma.whatsAppConsent.findFirst.mockResolvedValueOnce(null);
      mockPrisma.kycRecord.findFirst.mockResolvedValueOnce(null);

      const res = await request(createApp()).get('/api/data-export/zainab@example.com');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.personalData.leadRecord.name).toBe('Zainab Al Hosani');
    });
  });
});
