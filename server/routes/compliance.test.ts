/**
 * Compliance Routes — Unit Tests
 * Tests /api/compliance endpoints: status, requirements, audit-logs, reports
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      property: {
        count: fn().mockResolvedValue(20),
      },
      user: {
        count: fn().mockResolvedValue(5),
      },
      activity: {
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'act-1', createdAt: new Date('2026-01-15'),
        }),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));
vi.mock('../utils/sanitize', () => ({
  sanitizeString: (s: string) => s,
}));

import complianceRoutes from './compliance';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', email: 'admin@whitecaves.ae', role };
    next();
  });
  app.use('/api/compliance', complianceRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ═════════════════════════════════════════════════════════════════════

describe('Compliance Routes — /api/compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.property.count.mockResolvedValue(20);
    mockPrisma.user.count.mockResolvedValue(5);
  });

  // ── GET /status ──────────────────────────────────────────────────
  describe('GET /api/compliance/status', () => {
    it('returns 200 with compliance status for owner', async () => {
      mockPrisma.property.count
        .mockResolvedValueOnce(20)   // totalProperties
        .mockResolvedValueOnce(18);  // propertiesWithDocs
      mockPrisma.user.count
        .mockResolvedValueOnce(10)   // totalAgents
        .mockResolvedValueOnce(9);   // activeAgents
      const res = await request(createApp('owner'))
        .get('/api/compliance/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overallScore).toBeDefined();
      expect(res.body.data.compliant).toBeDefined();
      expect(res.body.data.metrics).toBeDefined();
      expect(res.body.data.lastAudit).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/compliance/status');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 200 for finance role', async () => {
      mockPrisma.property.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(10);
      mockPrisma.user.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(5);
      const res = await request(createApp('finance'))
        .get('/api/compliance/status');
      expect(res.status).toBe(200);
    });

    it('calculates compliance scores correctly', async () => {
      mockPrisma.property.count
        .mockResolvedValueOnce(10)   // totalProperties
        .mockResolvedValueOnce(8);   // propertiesWithDocs (80%)
      mockPrisma.user.count
        .mockResolvedValueOnce(10)   // totalAgents
        .mockResolvedValueOnce(10);  // activeAgents (100%)
      const res = await request(createApp('owner'))
        .get('/api/compliance/status');
      expect(res.body.data.metrics.documentationCompliance).toBe(80);
      expect(res.body.data.metrics.agentCompliance).toBe(100);
      expect(res.body.data.overallScore).toBe(90);
      expect(res.body.data.compliant).toBe(true);
    });

    it('marks as non-compliant when score below 80', async () => {
      mockPrisma.property.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3);   // 30% doc compliance
      mockPrisma.user.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5);   // 50% agent compliance
      const res = await request(createApp('owner'))
        .get('/api/compliance/status');
      expect(res.body.data.overallScore).toBe(40);
      expect(res.body.data.compliant).toBe(false);
    });

    it('handles zero properties/agents gracefully', async () => {
      mockPrisma.property.count.mockResolvedValue(0);
      mockPrisma.user.count.mockResolvedValue(0);
      const res = await request(createApp('owner'))
        .get('/api/compliance/status');
      expect(res.status).toBe(200);
      expect(res.body.data.overallScore).toBe(100);
      expect(res.body.data.compliant).toBe(true);
    });
  });

  // ── GET /requirements ────────────────────────────────────────────
  describe('GET /api/compliance/requirements', () => {
    it('returns RERA compliance requirements for owner', async () => {
      const res = await request(createApp('owner'))
        .get('/api/compliance/requirements');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('includes key requirement categories', async () => {
      const res = await request(createApp('owner'))
        .get('/api/compliance/requirements');
      const categories = res.body.data.map((r: any) => r.category);
      expect(categories).toContain('licensing');
      expect(categories).toContain('compliance');
      expect(categories).toContain('privacy');
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/compliance/requirements');
      expect(res.status).toBe(403);
    });

    it('each requirement has id, name, category, status', async () => {
      const res = await request(createApp('manager'))
        .get('/api/compliance/requirements');
      const first = res.body.data[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('name');
      expect(first).toHaveProperty('category');
      expect(first).toHaveProperty('status');
    });
  });

  // ── GET /audit-logs ──────────────────────────────────────────────
  describe('GET /api/compliance/audit-logs', () => {
    it('returns 200 with audit logs for owner', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'log-1', type: 'system', action: 'login',
          description: 'User logged in', createdAt: new Date(), metadata: null,
          user: { id: 'user-1', name: 'Admin', role: 'owner' },
        },
      ]);
      mockPrisma.activity.count.mockResolvedValueOnce(1);
      const res = await request(createApp('owner'))
        .get('/api/compliance/audit-logs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for admin role (not owner/manager)', async () => {
      const res = await request(createApp('admin'))
        .get('/api/compliance/audit-logs');
      expect(res.status).toBe(403);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/compliance/audit-logs');
      expect(res.status).toBe(403);
    });

    it('returns 200 for manager role', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);
      const res = await request(createApp('manager'))
        .get('/api/compliance/audit-logs');
      expect(res.status).toBe(200);
    });

    it('supports pagination params', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(200);
      const res = await request(createApp('owner'))
        .get('/api/compliance/audit-logs?page=3&pageSize=25');
      expect(res.status).toBe(200);
    });

    it('supports type and action filters', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner'))
        .get('/api/compliance/audit-logs?type=system&action=login');
      expect(res.status).toBe(200);
    });
  });

  // ── POST /reports ────────────────────────────────────────────────
  describe('POST /api/compliance/reports', () => {
    it('returns 201 on successful report submission', async () => {
      const res = await request(createApp('owner'))
        .post('/api/compliance/reports')
        .send({
          title: 'Q1 2026 Compliance Report',
          findings: 'All properties compliant',
          recommendations: 'Continue regular audits',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Q1 2026 Compliance Report');
      expect(res.body.data.status).toBe('submitted');
    });

    it('returns 400 if title is missing', async () => {
      const res = await request(createApp('owner'))
        .post('/api/compliance/reports')
        .send({ findings: 'Some findings' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/title.*required/i);
    });

    it('returns 400 if title exceeds 500 characters', async () => {
      const res = await request(createApp('owner'))
        .post('/api/compliance/reports')
        .send({ title: 'A'.repeat(501) });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/500 characters/i);
    });

    it('returns 403 for admin role (not owner/manager)', async () => {
      const res = await request(createApp('admin'))
        .post('/api/compliance/reports')
        .send({ title: 'Test Report' });
      expect(res.status).toBe(403);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .post('/api/compliance/reports')
        .send({ title: 'Test Report' });
      expect(res.status).toBe(403);
    });

    it('returns 200 for manager role', async () => {
      const res = await request(createApp('manager'))
        .post('/api/compliance/reports')
        .send({ title: 'Manager Report' });
      expect(res.status).toBe(201);
    });

    it('saves report as activity with metadata', async () => {
      await request(createApp('owner'))
        .post('/api/compliance/reports')
        .send({
          title: 'Audit Report',
          findings: 'Finding details',
          recommendations: 'Next steps',
        });
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'system',
            action: 'created',
            metadata: expect.objectContaining({
              reportTitle: 'Audit Report',
            }),
          }),
        })
      );
    });
  });
});
