import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const mockGenerateLeadsExcel = vi.fn();
const mockGeneratePropertiesExcel = vi.fn();

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler:
    (fn: (req: unknown, res: unknown, next: unknown) => Promise<unknown>) =>
    async (req: unknown, res: unknown, next: unknown) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        (next as (value: unknown) => void)(err);
      }
    },
}));

vi.mock('../database.js', () => ({
  prisma: {
    lead: {},
    property: {},
    user: {},
    commission: {},
    activity: {},
    transaction: {},
    lease: {},
    offer: {},
    pDCSchedule: {},
    maintenance: {},
  },
}));

vi.mock('../services/DocumentService.js', () => ({
  documentService: {
    generateLeadsExcel: (...args: unknown[]) => mockGenerateLeadsExcel(...args),
    generatePropertiesExcel: (...args: unknown[]) => mockGeneratePropertiesExcel(...args),
  },
}));

import reportingRoutes from './reporting';

function createApp() {
  const app = express();
  app.use((req, _res, next) => {
    (req as express.Request & { user?: { role: string } }).user = { role: 'owner' };
    next();
  });
  app.use('/api/dashboard', reportingRoutes);
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Reporting Wave 12 excel endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/dashboard/leads/excel streams xlsx', async () => {
    mockGenerateLeadsExcel.mockResolvedValue({
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: 'leads.xlsx',
      buffer: Buffer.from('leads'),
    });

    const res = await request(createApp()).get('/api/dashboard/leads/excel');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(res.headers['content-disposition']).toContain('leads.xlsx');
  });

  it('GET /api/dashboard/properties/excel streams xlsx', async () => {
    mockGeneratePropertiesExcel.mockResolvedValue({
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: 'properties.xlsx',
      buffer: Buffer.from('properties'),
    });

    const res = await request(createApp()).get('/api/dashboard/properties/excel');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(res.headers['content-disposition']).toContain('properties.xlsx');
  });
});

