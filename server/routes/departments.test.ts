/**
 * Departments API Integration Tests — Phase 30
 * ──────────────────────────────────────────────
 * Tests real-time KPI data aggregation for SALES, FINANCE, and HR departments,
 * trends, summaries, and access control.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

vi.mock('../database.js', () => ({
  prisma: {
    lead: {
      count: vi.fn().mockResolvedValue(120),
      groupBy: vi.fn().mockResolvedValue([
        { source: 'whatsapp', _count: { _all: 50 } },
        { source: 'website', _count: { _all: 40 } },
        { source: 'direct', _count: { _all: 30 } },
      ]),
    },
    commission: {
      aggregate: vi.fn().mockResolvedValue({ _sum: { amount: 250000 } }),
      groupBy: vi.fn().mockImplementation(({ by }: { by: string[] }) => {
        if (by.includes('status')) {
          return Promise.resolve([
            { status: 'paid', _sum: { amount: 150000 }, _count: { _all: 10 } },
            { status: 'pending', _sum: { amount: 50000 }, _count: { _all: 5 } },
          ]);
        }
        if (by.includes('type')) {
          return Promise.resolve([
            { type: 'sale', _sum: { amount: 120000 } },
            { type: 'lease', _sum: { amount: 80000 } },
          ]);
        }
        return Promise.resolve([]);
      }),
    },
    property: {
      aggregate: vi.fn().mockResolvedValue({ _sum: { price: 15000000 } }),
    },
    user: {
      count: vi.fn().mockResolvedValue(30),
      groupBy: vi.fn().mockResolvedValue([
        { role: 'agent', _count: { _all: 20 } },
        { role: 'admin', _count: { _all: 5 } },
        { role: 'owner', _count: { _all: 5 } },
      ]),
    },
    activity: {
      count: vi.fn().mockResolvedValue(50),
    },
    jobApplication: {
      count: vi.fn().mockResolvedValue(5),
    },
    department: {
      findUnique: vi.fn().mockResolvedValue({ code: 'SALES', name: 'Sales & Leasing' }),
      findMany: vi.fn().mockResolvedValue([
        { code: 'SALES', name: 'Sales & Leasing' },
        { code: 'FINANCE', name: 'Finance' },
        { code: 'HR', name: 'Human Resources' },
      ]),
    },
  },
}));

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock('../middleware/departmentAuth.js', () => ({
  requireDepartmentAccess: (_req: any, _res: any, next: any) => next(),
  requireDepartmentPermission: () => (_req: any, _res: any, next: any) => next(),
}));

import departmentsRouter from './departments.js';

describe('Departments API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/departments', departmentsRouter);
    app.use(errorHandler);
  });

  describe('GET /api/departments', () => {
    it('returns list of supported departments', async () => {
      const res = await request(app).get('/api/departments');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.departments)).toBe(true);
      expect(res.body.departments.some((d: any) => d.code === 'SALES')).toBe(true);
      expect(res.body.departments.some((d: any) => d.code === 'FINANCE')).toBe(true);
      expect(res.body.departments.some((d: any) => d.code === 'HR')).toBe(true);
    });
  });

  describe('GET /api/departments/:code/data', () => {
    it('returns aggregated KPI data for SALES department', async () => {
      const res = await request(app).get('/api/departments/SALES/data');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('SALES');
      expect(res.body.data.totalLeads).toBeDefined();
    });

    it('returns aggregated KPI data for FINANCE department', async () => {
      const res = await request(app).get('/api/departments/FINANCE/data');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('FINANCE');
      expect(res.body.data.totalBudget).toBe(15000000);
    });

    it('returns aggregated KPI data for HR department', async () => {
      const res = await request(app).get('/api/departments/HR/data');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('HR');
      expect(res.body.data.totalEmployees).toBe(30);
    });

    it('returns 404 for unsupported department code', async () => {
      const res = await request(app).get('/api/departments/INVALID_CODE/data');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/departments/:code/kpis', () => {
    it('returns KPI array for SALES department', async () => {
      const res = await request(app).get('/api/departments/SALES/kpis');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.kpis)).toBe(true);
    });
  });

  describe('GET /api/departments/:code/trends', () => {
    it('returns monthly trends data for SALES department', async () => {
      const res = await request(app).get('/api/departments/SALES/trends');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.trends)).toBe(true);
    });
  });
});
