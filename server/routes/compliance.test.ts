/**
 * Compliance Routes — Unit Tests
 * Tests /api/compliance endpoints: status, requirements, audit-logs, reports
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      property: {
        count: fn().mockResolvedValue(20),
        findMany: fn().mockResolvedValue([]),
      },
      lead: {
        findUnique: fn().mockResolvedValue({ id: 'lead-1', tags: [] }),
        update: fn().mockResolvedValue({ id: 'lead-1', tags: ['kyc_verified'] }),
      },
      user: {
        count: fn().mockResolvedValue(5),
        findMany: fn().mockResolvedValue([]),
      },
      activity: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        update: fn().mockResolvedValue({ id: 'doc-1' }),
        create: fn().mockResolvedValue({
          id: 'act-1',
          createdAt: new Date('2026-01-15'),
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
  asyncHandler: (fn: unknown) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(
      (fn as (req: Request, res: Response, next: NextFunction) => unknown)(req, res, next)
    ).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));
vi.mock('../utils/sanitize', () => ({
  sanitizeString: (s: string) => s,
}));
vi.mock('../services/compliance/amlAdapter.js', () => ({
  screenAML: vi.fn(async () => ({
    provider: 'internal_aml_baseline',
    providerReference: 'AML-TEST-001',
    riskScore: 78,
    riskLevel: 'high',
    flags: ['high_value_transaction'],
    screenedAt: new Date('2026-05-16T10:00:00.000Z').toISOString(),
  })),
}));

import complianceRoutes from './compliance';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; email: string; role: string } }).user = {
      id: 'user-1',
      email: 'admin@whitecaves.ae',
      role,
    };
    next();
  });
  app.use('/api/compliance', complianceRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  );
  return app;
}

// ═════════════════════════════════════════════════════════════════════

describe('Compliance Routes — /api/compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.property.count.mockResolvedValue(20);
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.lead.findUnique.mockResolvedValue({ id: 'lead-1', tags: [] });
    mockPrisma.lead.update.mockResolvedValue({ id: 'lead-1', tags: ['kyc_verified'] });
    mockPrisma.user.count.mockResolvedValue(5);
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.activity.findUnique.mockResolvedValue(null);
    mockPrisma.activity.update.mockResolvedValue({ id: 'doc-1' });
  });

  // ── GET /status ──────────────────────────────────────────────────
  describe('GET /api/compliance/status', () => {
    it('returns 200 with compliance status for owner', async () => {
      mockPrisma.property.count
        .mockResolvedValueOnce(20) // totalProperties
        .mockResolvedValueOnce(18); // propertiesWithDocs
      mockPrisma.user.count
        .mockResolvedValueOnce(10) // totalAgents
        .mockResolvedValueOnce(9); // activeAgents
      const res = await request(createApp('owner')).get('/api/compliance/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overallScore).toBeDefined();
      expect(res.body.data.compliant).toBeDefined();
      expect(res.body.data.metrics).toBeDefined();
      expect(res.body.data.lastAudit).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/status');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 200 for finance role', async () => {
      mockPrisma.property.count.mockResolvedValueOnce(10).mockResolvedValueOnce(10);
      mockPrisma.user.count.mockResolvedValueOnce(5).mockResolvedValueOnce(5);
      const res = await request(createApp('finance')).get('/api/compliance/status');
      expect(res.status).toBe(200);
    });

    it('calculates compliance scores correctly', async () => {
      mockPrisma.property.count
        .mockResolvedValueOnce(10) // totalProperties
        .mockResolvedValueOnce(8); // propertiesWithDocs (80%)
      mockPrisma.user.count
        .mockResolvedValueOnce(10) // totalAgents
        .mockResolvedValueOnce(10); // activeAgents (100%)
      const res = await request(createApp('owner')).get('/api/compliance/status');
      expect(res.body.data.metrics.documentationCompliance).toBe(80);
      expect(res.body.data.metrics.agentCompliance).toBe(100);
      expect(res.body.data.overallScore).toBe(90);
      expect(res.body.data.compliant).toBe(true);
    });

    it('marks as non-compliant when score below 80', async () => {
      mockPrisma.property.count.mockResolvedValueOnce(10).mockResolvedValueOnce(3); // 30% doc compliance
      mockPrisma.user.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5); // 50% agent compliance
      const res = await request(createApp('owner')).get('/api/compliance/status');
      expect(res.body.data.overallScore).toBe(40);
      expect(res.body.data.compliant).toBe(false);
    });

    it('handles zero properties/agents gracefully', async () => {
      mockPrisma.property.count.mockResolvedValue(0);
      mockPrisma.user.count.mockResolvedValue(0);
      const res = await request(createApp('owner')).get('/api/compliance/status');
      expect(res.status).toBe(200);
      expect(res.body.data.overallScore).toBe(100);
      expect(res.body.data.compliant).toBe(true);
    });
  });

  // ── GET /requirements ────────────────────────────────────────────
  describe('GET /api/compliance/requirements', () => {
    it('returns RERA compliance requirements for owner', async () => {
      const res = await request(createApp('owner')).get('/api/compliance/requirements');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('includes key requirement categories', async () => {
      const res = await request(createApp('owner')).get('/api/compliance/requirements');
      const categories = res.body.data.map((r: { category: string }) => r.category);
      expect(categories).toContain('licensing');
      expect(categories).toContain('compliance');
      expect(categories).toContain('privacy');
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/requirements');
      expect(res.status).toBe(403);
    });

    it('each requirement has id, name, category, status', async () => {
      const res = await request(createApp('manager')).get('/api/compliance/requirements');
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
          id: 'log-1',
          type: 'system',
          action: 'login',
          description: 'User logged in',
          createdAt: new Date(),
          metadata: null,
          user: { id: 'user-1', name: 'Admin', role: 'owner' },
        },
      ]);
      mockPrisma.activity.count.mockResolvedValueOnce(1);
      const res = await request(createApp('owner')).get('/api/compliance/audit-logs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for admin role (not owner/manager)', async () => {
      const res = await request(createApp('admin')).get('/api/compliance/audit-logs');
      expect(res.status).toBe(403);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/audit-logs');
      expect(res.status).toBe(403);
    });

    it('returns 200 for manager role', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);
      const res = await request(createApp('manager')).get('/api/compliance/audit-logs');
      expect(res.status).toBe(200);
    });

    it('supports pagination params', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(200);
      const res = await request(createApp('owner')).get(
        '/api/compliance/audit-logs?page=3&pageSize=25'
      );
      expect(res.status).toBe(200);
    });

    it('supports type and action filters', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get(
        '/api/compliance/audit-logs?type=system&action=login'
      );
      expect(res.status).toBe(200);
    });
  });

  // ── POST /reports ────────────────────────────────────────────────
  describe('POST /api/compliance/reports', () => {
    it('returns 201 on successful report submission', async () => {
      const res = await request(createApp('owner')).post('/api/compliance/reports').send({
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
      await request(createApp('owner')).post('/api/compliance/reports').send({
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

  // ── GET /permit-alerts ───────────────────────────────────────────
  describe('GET /api/compliance/permit-alerts', () => {
    it('returns permit alerts for owner', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([
        {
          id: 'prop-1',
          title: 'Marina Tower 1204',
          status: 'available',
          municipalityNumber: null,
          buildingPermitNumber: 'BPN-1',
          createdAt: new Date('2026-05-10T00:00:00.000Z'),
        },
      ]);

      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: 'u-1',
          name: 'Agent One',
          email: 'a1@whitecaves.ae',
          role: 'agent',
          brnNumber: 'BRN-001',
          brnExpiry: tomorrow,
        },
        {
          id: 'u-2',
          name: 'Agent Two',
          email: 'a2@whitecaves.ae',
          role: 'agent',
          brnNumber: 'BRN-002',
          brnExpiry: yesterday,
        },
      ]);

      const res = await request(createApp('owner')).get(
        '/api/compliance/permit-alerts?daysAhead=30'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary.listingPermitIssues).toBe(1);
      expect(res.body.data.summary.brnExpiringSoon).toBe(1);
      expect(res.body.data.summary.brnExpired).toBe(1);
      expect(res.body.data.listingPermitIssues).toHaveLength(1);
      expect(res.body.data.brnPermitAlerts).toHaveLength(2);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/permit-alerts');
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid daysAhead', async () => {
      const res = await request(createApp('owner')).get(
        '/api/compliance/permit-alerts?daysAhead=0'
      );
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/daysAhead/i);
    });
  });

  // ── W4-003 KYC workflow ─────────────────────────────────────────
  describe('KYC upload/list/review workflow', () => {
    it('uploads KYC document metadata for a lead', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'lead-1' });
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'doc-1',
        createdAt: new Date('2026-05-16T08:00:00.000Z'),
      });

      const res = await request(createApp('agent'))
        .post('/api/compliance/kyc/lead-1/documents')
        .send({
          documentType: 'passport',
          documentUrl: 'https://cdn.whitecaves.ae/docs/passport.pdf',
          fileName: 'passport.pdf',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.reviewStatus).toBe('pending');
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });

    it('lists KYC documents for a lead', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'doc-1',
          leadId: 'lead-1',
          createdAt: new Date('2026-05-16T08:00:00.000Z'),
          metadata: {
            documentType: 'passport',
            documentUrl: 'https://cdn.whitecaves.ae/docs/passport.pdf',
            reviewStatus: 'pending',
          },
        },
      ]);

      const res = await request(createApp('manager')).get('/api/compliance/kyc/lead-1/documents');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].documentType).toBe('passport');
    });

    it('reviews KYC document and updates lead tags on approval', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce({
        id: 'doc-1',
        type: 'compliance',
        action: 'kyc_document_uploaded',
        leadId: 'lead-1',
        metadata: { reviewStatus: 'pending' },
      });
      mockPrisma.activity.update.mockResolvedValueOnce({ id: 'doc-1' });
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'lead-1', tags: [] });

      const res = await request(createApp('owner'))
        .patch('/api/compliance/kyc/documents/doc-1/review')
        .send({ decision: 'approved', comments: 'Verified against Emirates ID' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.decision).toBe('approved');
      expect(mockPrisma.lead.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'lead-1' },
          data: expect.objectContaining({
            tags: expect.arrayContaining(['kyc_verified']),
          }),
        })
      );
    });
  });

  // ── W4-005 AML workflow ─────────────────────────────────────────
  describe('AML adapter and flagging workflow', () => {
    it('screens lead and creates AML alert when high risk', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: 'lead-1',
        name: 'Lead AML',
        tags: [],
        email: 'lead@example.com',
        phone: '+971500000001',
      });
      mockPrisma.activity.create
        .mockResolvedValueOnce({
          id: 'aml-alert-1',
          createdAt: new Date('2026-05-16T10:00:00.000Z'),
        })
        .mockResolvedValueOnce({
          id: 'audit-aml-1',
          createdAt: new Date('2026-05-16T10:00:01.000Z'),
        });

      const res = await request(createApp('agent')).post('/api/compliance/aml/screen').send({
        leadId: 'lead-1',
        amount: 750000,
        currency: 'AED',
        transactionType: 'sale',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('open');
      expect(res.body.data.alertId).toBe('aml-alert-1');
      expect(mockPrisma.lead.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'lead-1' },
          data: expect.objectContaining({
            tags: expect.arrayContaining(['aml_flagged']),
          }),
        })
      );
    });

    it('lists open AML alerts', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'aml-alert-1',
          type: 'compliance',
          action: 'aml_alert_created',
          leadId: 'lead-1',
          createdAt: new Date('2026-05-16T10:00:00.000Z'),
          metadata: {
            status: 'open',
            severity: 'high',
            flags: ['high_value_transaction'],
            screening: { riskScore: 78 },
          },
          lead: {
            id: 'lead-1',
            name: 'Lead AML',
            email: 'lead@example.com',
            phone: '+971500000001',
            status: 'new',
          },
          user: { id: 'user-1', name: 'Owner', email: 'owner@whitecaves.ae', role: 'owner' },
        },
      ]);

      const res = await request(createApp('owner')).get('/api/compliance/aml/alerts?status=open');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('open');
    });

    it('resolves AML alert', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce({
        id: 'aml-alert-1',
        type: 'compliance',
        action: 'aml_alert_created',
        leadId: 'lead-1',
        metadata: { status: 'open', severity: 'high' },
      });
      mockPrisma.activity.update.mockResolvedValueOnce({ id: 'aml-alert-1' });
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'aml-resolve-audit-1',
        createdAt: new Date(),
      });

      const res = await request(createApp('manager'))
        .patch('/api/compliance/aml/alerts/aml-alert-1/resolve')
        .send({ resolution: 'false_positive', notes: 'Documents verified manually' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('resolved');
    });
  });

  // ── W4-006 PDPL consent controls ────────────────────────────────
  describe('PDPL consent controls', () => {
    it('creates consent record', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'lead-1' });
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'consent-1',
        createdAt: new Date('2026-05-16T11:00:00.000Z'),
        metadata: { status: 'active', purpose: 'marketing_sms' },
      });

      const res = await request(createApp('agent')).post('/api/compliance/consent').send({
        entityType: 'lead',
        entityId: 'lead-1',
        purpose: 'marketing_sms',
        channel: 'whatsapp_widget',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('active');
    });

    it('revokes consent record', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce({
        id: 'consent-1',
        type: 'compliance',
        action: 'pdpl_consent_created',
        metadata: { status: 'active' },
      });
      mockPrisma.activity.update.mockResolvedValueOnce({ id: 'consent-1' });

      const res = await request(createApp('manager'))
        .patch('/api/compliance/consent/consent-1/revoke')
        .send({ reason: 'user_requested_opt_out' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('revoked');
    });

    it('exports consent records and allows deletion baseline', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'consent-1',
          type: 'compliance',
          action: 'pdpl_consent_created',
          leadId: 'lead-1',
          createdAt: new Date('2026-05-16T11:00:00.000Z'),
          metadata: {
            entityType: 'lead',
            entityId: 'lead-1',
            purpose: 'marketing_sms',
            status: 'active',
            consentedAt: '2026-05-16T11:00:00.000Z',
          },
          user: { id: 'user-1', name: 'Owner', email: 'owner@whitecaves.ae', role: 'owner' },
          lead: {
            id: 'lead-1',
            name: 'Lead One',
            email: 'lead@example.com',
            phone: '+971500000001',
          },
        },
      ]);

      const exportRes = await request(createApp('owner')).get('/api/compliance/consent/export');
      expect(exportRes.status).toBe(200);
      expect(exportRes.body.success).toBe(true);
      expect(exportRes.body.data).toHaveLength(1);

      mockPrisma.activity.findUnique.mockResolvedValueOnce({
        id: 'consent-1',
        type: 'compliance',
        action: 'pdpl_consent_created',
        metadata: { status: 'active', purpose: 'marketing_sms', channel: 'crm_form' },
      });
      mockPrisma.activity.update.mockResolvedValueOnce({ id: 'consent-1' });

      const deleteRes = await request(createApp('admin')).delete(
        '/api/compliance/consent/consent-1'
      );
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.status).toBe('deleted');
    });
  });
});
