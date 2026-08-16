import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lease: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    maintenance: {
      findMany: vi.fn(),
      create: vi.fn(),
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
vi.mock('../middleware/auth', () => ({ default: null }));

import tenantPortalRoutes from './tenantPortal.js';

function createApp(userId = 'tenant-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; email: string; role: string } }).user = {
      id: userId,
      email: 'tenant@whitecaves.ae',
      role: 'tenant',
    };
    next();
  });
  app.use('/api/tenant-portal', tenantPortalRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Tenant Portal Routes — /api/tenant-portal (Wave 36)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/tenant-portal/overview', () => {
    it('returns tenant active lease, payments and maintenance history', async () => {
      mockPrisma.lease.findFirst.mockResolvedValueOnce({
        id: 'lease-101',
        ejariStatus: 'registered',
        ejariNumber: 'EJ-998877',
        property: { title: 'Downtown Apartment' },
        rentPayments: [],
      });
      mockPrisma.maintenance.findMany.mockResolvedValueOnce([
        { id: 'maint-1', title: 'AC Repair', status: 'in_progress' },
      ]);

      const res = await request(createApp()).get('/api/tenant-portal/overview');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ejariNumber).toBe('EJ-998877');
    });
  });

  describe('GET /api/tenant-portal/documents', () => {
    it('returns list of downloadable lease & addendum documents', async () => {
      mockPrisma.lease.findMany.mockResolvedValueOnce([
        {
          id: 'lease-101',
          leaseNumber: 'L-101',
          ejariNumber: 'EJ-998877',
          documents: ['/docs/lease-101.pdf'],
          addendumDocuments: ['/docs/addendum-1.pdf'],
        },
      ]);

      const res = await request(createApp()).get('/api/tenant-portal/documents');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/tenant-portal/maintenance', () => {
    it('submits a new tenant maintenance request', async () => {
      mockPrisma.maintenance.create.mockResolvedValueOnce({
        id: 'maint-901',
        title: 'Water Pipe Leak',
        priority: 'high',
        status: 'open',
      });

      const res = await request(createApp())
        .post('/api/tenant-portal/maintenance')
        .send({
          propertyId: '507f1f77bcf86cd799439011',
          title: 'Water Pipe Leak',
          category: 'plumbing',
          priority: 'high',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('maint-901');
    });
  });
});
