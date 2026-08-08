/**
 * Compliance Routes — Unit Tests
 * Tests /api/compliance endpoints: status, requirements, audit-logs, reports
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma, mockLogger } = vi.hoisted(() => {
  const fn = vi.fn;
  const mockLogger = {
    createLogger: vi.fn(() => ({
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    })),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
  return {
    mockPrisma: {
      property: {
        count: fn().mockResolvedValue(20),
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        update: fn().mockResolvedValue({
          id: 'prop-1',
          title: 'Updated Permit Property',
          status: 'available',
          municipalityNumber: 'MUN-1',
          plotNumber: 'PLOT-1',
          buildingPermitNumber: 'BPN-1',
          updatedAt: new Date('2026-05-19T10:00:00.000Z'),
        }),
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
      corporateDocument: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        create: fn().mockResolvedValue({ id: 'corp-1', title: 'RERA Certificate' }),
        update: fn().mockResolvedValue({ id: 'corp-1', title: 'RERA Certificate (Updated)' }),
      },
      corporateDocumentAlert: {
        findMany: fn().mockResolvedValue([]),
        findFirst: fn().mockResolvedValue(null),
        findUnique: fn().mockResolvedValue(null),
        create: fn().mockResolvedValue({ id: 'alert-1', status: 'open' }),
        update: fn().mockResolvedValue({ id: 'alert-1', status: 'acknowledged' }),
      },
      corporateDocumentAuditLog: {
        create: fn().mockResolvedValue({ id: 'audit-1' }),
      },
    },
    mockLogger,
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: mockLogger,
  createLogger: mockLogger.createLogger,
  logger: mockLogger,
}));
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
vi.mock('../middleware/rbac', () => ({
  requirePermission: (_permission: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(403).json({ success: false, error: 'Unauthorized' });
    next();
  },
  requireMinRole: (_minRole: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(403).json({ success: false, error: 'Unauthorized' });
    next();
  },
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
vi.mock('../services/compliance/reraExpiryScheduler.js', () => ({
  getBRNExpiryReport: vi.fn(async () => []),
  checkBRNExpirations: vi.fn(async () => ({ notified: 0, errors: 0, agents: [] })),
}));
vi.mock('../services/compliance/propertyPermitEnforcementScheduler.js', () => ({
  enforcePropertyPermitCompliance: vi.fn(async () => ({
    scanned: 2,
    autoUnpublished: 1,
    errors: 0,
    dryRun: false,
    affectedPropertyIds: ['prop-1'],
  })),
}));
vi.mock('../services/compliance/complianceService.js', () => ({
  generateEjariExport: vi.fn(async () => 'csv_data'),
  calculateVATSummary: vi.fn(async () => ({ totalVAT: 50000, breakdown: {} })),
  getComplianceOverview: vi.fn(async () => ({ overallScore: 85, compliant: true })),
  updateEjariStatus: vi.fn(async () => ({ id: 'lease-1', ejariStatus: 'registered' })),
}));
vi.mock('../services/compliance/permitAlertScheduler.js', () => ({
  getPermitAlerts: vi.fn(async () => ({
    summary: {
      listingPermitIssues: 1,
      brnExpiringSoon: 1,
      brnExpired: 1,
    },
    listingPermitIssues: [{ id: 'prop-1', title: 'Marina Tower 1204' }],
    brnPermitAlerts: [
      { id: 'u-1', name: 'Agent One', type: 'expiring_soon' },
      { id: 'u-2', name: 'Agent Two', type: 'expired' },
    ],
  })),
}));
vi.mock('../services/compliance/corporateDocumentService.js', () => ({
  listCorporateDocuments: vi.fn(async () => []),
  getCorporateDocumentById: vi.fn(async () => null),
  createCorporateDocument: vi.fn(async () => ({ id: 'corp-1', title: 'DET License' })),
  updateCorporateDocument: vi.fn(async () => ({ id: 'corp-1', title: 'DET License Updated' })),
  archiveCorporateDocument: vi.fn(async () => ({ id: 'corp-1', title: 'DET License Updated', status: 'archived' })),
  listCorporateDocumentAlerts: vi.fn(async () => []),
  acknowledgeCorporateDocumentAlert: vi.fn(async () => ({ id: 'alert-1', status: 'acknowledged' })),
  importCorporateDocumentsFromRegistry: vi.fn(async () => ({
    filePath: 'docs/company_documents/normalized/company_documents_registry.json',
    total: 4,
    created: 2,
    updated: 2,
  })),
}));

import complianceRoutes from './compliance.js';
import { enforcePropertyPermitCompliance } from '../services/compliance/propertyPermitEnforcementScheduler.js';
import { checkBRNExpirations } from '../services/compliance/reraExpiryScheduler.js';
import {
  acknowledgeCorporateDocumentAlert,
  archiveCorporateDocument,
  createCorporateDocument,
  getCorporateDocumentById,
  importCorporateDocumentsFromRegistry,
  listCorporateDocumentAlerts,
  listCorporateDocuments,
  updateCorporateDocument,
} from '../services/compliance/corporateDocumentService.js';

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
    mockPrisma.property.findUnique.mockResolvedValue(null);
    mockPrisma.lead.findUnique.mockResolvedValue({ id: 'lead-1', tags: [] });
    mockPrisma.lead.update.mockResolvedValue({ id: 'lead-1', tags: ['kyc_verified'] });
    mockPrisma.user.count.mockResolvedValue(5);
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.activity.findUnique.mockResolvedValue(null);
    mockPrisma.activity.update.mockResolvedValue({ id: 'doc-1' });

    (listCorporateDocuments as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (getCorporateDocumentById as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (createCorporateDocument as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'corp-1',
      title: 'DET License',
    });
    (updateCorporateDocument as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'corp-1',
      title: 'DET License Updated',
    });
    (archiveCorporateDocument as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'corp-1',
      title: 'DET License Updated',
      status: 'archived',
    });
    (listCorporateDocumentAlerts as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (acknowledgeCorporateDocumentAlert as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'alert-1',
      status: 'acknowledged',
    });
    (importCorporateDocumentsFromRegistry as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      filePath: 'docs/company_documents/normalized/company_documents_registry.json',
      total: 4,
      created: 2,
      updated: 2,
    });
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

    it('returns 201 for admin role', async () => {
      const res = await request(createApp('admin'))
        .post('/api/compliance/reports')
        .send({ title: 'Test Report' });
      expect(res.status).toBe(201);
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

    it('returns 201 for finance role', async () => {
      const res = await request(createApp('finance'))
        .post('/api/compliance/reports')
        .send({ title: 'Finance Report' });
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

  // ── POST /brn-check + GET /brn-check/history ───────────────────
  describe('BRN check operability endpoints', () => {
    it('runs manual BRN check for owner and logs activity', async () => {
      const brnCheckMock = checkBRNExpirations as unknown as ReturnType<typeof vi.fn>;
      brnCheckMock.mockResolvedValueOnce({
        notified: 2,
        errors: 1,
        agents: [
          { id: 'a-1', name: 'Agent 1', brnNumber: 'BRN-1', daysUntilExpiry: 7, channel: 'email' },
          {
            id: 'a-2',
            name: 'Agent 2',
            brnNumber: 'BRN-2',
            daysUntilExpiry: 3,
            channel: 'whatsapp',
          },
        ],
      });

      const res = await request(createApp('owner')).post('/api/compliance/brn-check').send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notified).toBe(2);
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'brn_manual_check' }),
        })
      );
    });

    it('returns 403 for agent on manual BRN check', async () => {
      const res = await request(createApp('agent')).post('/api/compliance/brn-check').send({});
      expect(res.status).toBe(403);
    });

    it('allows finance to trigger manual BRN check', async () => {
      const brnCheckMock = checkBRNExpirations as unknown as ReturnType<typeof vi.fn>;
      brnCheckMock.mockResolvedValueOnce({
        notified: 0,
        errors: 0,
        agents: [],
      });

      const res = await request(createApp('finance')).post('/api/compliance/brn-check').send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns BRN check history for finance role', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'act-brn-1',
          type: 'compliance',
          action: 'brn_manual_check',
          description: 'Manual BRN expiry check executed (notified=1, errors=0)',
          createdAt: new Date('2026-05-20T08:00:00.000Z'),
          metadata: {
            notified: 1,
            errors: 0,
            agentCount: 1,
            agentIds: ['a-1'],
          },
          user: {
            id: 'u-1',
            name: 'Manager One',
            role: 'manager',
            email: 'manager@whitecaves.ae',
          },
        },
      ]);

      const res = await request(createApp('finance')).get(
        '/api/compliance/brn-check/history?limit=10'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].summary.notified).toBe(1);
      expect(res.body.summary.totalNotified).toBe(1);
    });

    it('returns 403 for agent on BRN check history', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/brn-check/history');
      expect(res.status).toBe(403);
    });
  });

  // ── GET/PATCH /permits ──────────────────────────────────────────
  describe('Permit register endpoints', () => {
    it('returns permit register list for owner', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([
        {
          id: 'prop-1',
          title: 'Marina Apt',
          status: 'available',
          location: 'Dubai Marina',
          area: 'Marina',
          municipalityNumber: null,
          plotNumber: 'P-100',
          buildingPermitNumber: 'BP-100',
          updatedAt: new Date('2026-05-19T10:00:00.000Z'),
        },
      ]);
      mockPrisma.property.count.mockResolvedValueOnce(20).mockResolvedValueOnce(3);

      const res = await request(createApp('owner')).get('/api/compliance/permits?status=all');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].permitStatus).toBe('missing');
      expect(res.body.summary.totalProperties).toBe(20);
      expect(res.body.summary.missingPermits).toBe(3);
    });

    it('returns 403 for agent on permit register list', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/permits');
      expect(res.status).toBe(403);
    });

    it('updates permit fields for manager role', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: 'prop-1',
        title: 'Marina Apt',
        status: 'off_market',
        municipalityNumber: null,
        plotNumber: null,
        buildingPermitNumber: null,
      });

      const res = await request(createApp('manager')).patch('/api/compliance/permits/prop-1').send({
        municipalityNumber: 'MUN-900',
        plotNumber: 'PLOT-900',
        buildingPermitNumber: 'BPN-900',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.property.update).toHaveBeenCalled();
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'permit_register_updated' }),
        })
      );
    });

    it('blocks removing permit fields for available listings', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: 'prop-2',
        title: 'JVC Apt',
        status: 'available',
        municipalityNumber: 'MUN-100',
        plotNumber: 'PLOT-100',
        buildingPermitNumber: 'BPN-100',
      });

      const res = await request(createApp('manager'))
        .patch('/api/compliance/permits/prop-2')
        .send({ municipalityNumber: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/available listings require municipalityNumber/i);
    });

    it('runs permit enforcement in dry-run mode for manager', async () => {
      const enforceMock = enforcePropertyPermitCompliance as unknown as ReturnType<typeof vi.fn>;
      enforceMock.mockResolvedValueOnce({
        scanned: 3,
        autoUnpublished: 0,
        errors: 0,
        dryRun: true,
        affectedPropertyIds: ['prop-a', 'prop-b', 'prop-c'],
      });

      const res = await request(createApp('manager'))
        .post('/api/compliance/permits/enforcement-run')
        .send({ dryRun: true, limit: 100 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dryRun).toBe(true);
      expect(enforceMock).toHaveBeenCalledWith({ dryRun: true, limit: 100 });
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'permit_enforcement_dry_run' }),
        })
      );
    });

    it('runs permit enforcement live for owner', async () => {
      const enforceMock = enforcePropertyPermitCompliance as unknown as ReturnType<typeof vi.fn>;
      enforceMock.mockResolvedValueOnce({
        scanned: 4,
        autoUnpublished: 2,
        errors: 0,
        dryRun: false,
        affectedPropertyIds: ['prop-1', 'prop-2'],
      });

      const res = await request(createApp('owner'))
        .post('/api/compliance/permits/enforcement-run')
        .send({ dryRun: false });

      expect(res.status).toBe(200);
      expect(res.body.data.autoUnpublished).toBe(2);
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'permit_enforcement_triggered' }),
        })
      );
    });

    it('returns 403 for agent on permit enforcement run', async () => {
      const res = await request(createApp('agent'))
        .post('/api/compliance/permits/enforcement-run')
        .send({ dryRun: true });

      expect(res.status).toBe(403);
    });

    it('returns permit enforcement history for finance role', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'act-enf-1',
          type: 'compliance',
          action: 'permit_enforcement_dry_run',
          description: 'Permit enforcement dry-run executed: scanned=3',
          createdAt: new Date('2026-05-19T11:00:00.000Z'),
          metadata: {
            scanned: 3,
            autoUnpublished: 0,
            errors: 0,
            dryRun: true,
            affectedPropertyIds: ['prop-a'],
          },
          user: {
            id: 'u-1',
            name: 'Manager One',
            role: 'manager',
            email: 'manager@whitecaves.ae',
          },
        },
      ]);

      const res = await request(createApp('finance')).get(
        '/api/compliance/permits/enforcement-history?limit=10'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].summary.scanned).toBe(3);
      expect(res.body.summary.dryRuns).toBe(1);
      expect(mockPrisma.activity.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'compliance' }),
          take: 10,
        })
      );
    });

    it('returns 403 for agent on permit enforcement history', async () => {
      const res = await request(createApp('agent')).get(
        '/api/compliance/permits/enforcement-history'
      );
      expect(res.status).toBe(403);
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

    it('allows finance to review KYC documents', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce({
        id: 'doc-2',
        type: 'compliance',
        action: 'kyc_document_uploaded',
        leadId: 'lead-2',
        metadata: { reviewStatus: 'pending' },
      });
      mockPrisma.activity.update.mockResolvedValueOnce({ id: 'doc-2' });
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'lead-2', tags: [] });

      const res = await request(createApp('finance'))
        .patch('/api/compliance/kyc/documents/doc-2/review')
        .send({ decision: 'approved' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
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
    it('creates consent record for manager role', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'lead-1' });
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'consent-1',
        createdAt: new Date('2026-05-16T11:00:00.000Z'),
        metadata: { status: 'active', purpose: 'marketing_sms' },
      });

      const res = await request(createApp('manager')).post('/api/compliance/consent').send({
        entityType: 'lead',
        entityId: 'lead-1',
        purpose: 'marketing_sms',
        channel: 'whatsapp_widget',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('active');
    });

    it('returns 403 for agent when creating consent record', async () => {
      const res = await request(createApp('agent')).post('/api/compliance/consent').send({
        entityType: 'lead',
        entityId: 'lead-1',
        purpose: 'marketing_sms',
      });

      expect(res.status).toBe(403);
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
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'pdpl_consent_revoked',
          }),
        })
      );
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

      const deleteRes = await request(createApp('finance')).delete(
        '/api/compliance/consent/consent-1'
      );
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.status).toBe('deleted');
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'pdpl_consent_deleted',
          }),
        })
      );
    });

    it('returns 403 for agent on consent delete', async () => {
      const res = await request(createApp('agent')).delete('/api/compliance/consent/consent-1');
      expect(res.status).toBe(403);
    });
  });

  // ── W4-007 Compliance queues feed ───────────────────────────────
  describe('Compliance queue feed', () => {
    it('returns unified queue summary for owner', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([
        {
          id: 'prop-1',
          title: 'JVC Tower 1103',
          municipalityNumber: null,
          buildingPermitNumber: 'B-1103',
          createdAt: new Date('2026-05-16T12:00:00.000Z'),
        },
      ]);

      mockPrisma.activity.findMany
        .mockResolvedValueOnce([
          {
            id: 'kyc-doc-1',
            leadId: 'lead-1',
            createdAt: new Date('2026-05-16T12:05:00.000Z'),
            metadata: { reviewStatus: 'pending', documentType: 'passport' },
            lead: {
              id: 'lead-1',
              name: 'Lead One',
              email: 'lead1@example.com',
              phone: '+971500000001',
              status: 'new',
            },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: 'aml-1',
            leadId: 'lead-2',
            createdAt: new Date('2026-05-16T12:10:00.000Z'),
            metadata: { status: 'open', severity: 'high', flags: ['high_value_transaction'] },
            lead: {
              id: 'lead-2',
              name: 'Lead Two',
              email: 'lead2@example.com',
              phone: '+971500000002',
              status: 'contacted',
            },
          },
        ]);

      const res = await request(createApp('owner')).get('/api/compliance/queues');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary.permitIssues).toBe(1);
      expect(res.body.data.summary.kycPendingReview).toBe(1);
      expect(res.body.data.summary.amlOpenAlerts).toBe(1);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/queues');
      expect(res.status).toBe(403);
    });
  });

  // ── W31 Corporate document compliance endpoints ──────────────────────
  describe('Corporate document compliance endpoints', () => {
    it('lists corporate documents for manager', async () => {
      (listCorporateDocuments as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
        { id: 'corp-1', title: 'DET License', status: 'active' },
      ]);

      const res = await request(createApp('manager')).get('/api/compliance/corporate-documents');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.summary.total).toBe(1);
    });

    it('returns 403 when agent tries to list corporate documents', async () => {
      const res = await request(createApp('agent')).get('/api/compliance/corporate-documents');
      expect(res.status).toBe(403);
    });

    it('returns corporate document by id', async () => {
      (getCorporateDocumentById as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: 'corp-1',
        title: 'RERA Office Registration',
        alerts: [],
      });

      const res = await request(createApp('owner')).get('/api/compliance/corporate-documents/corp-1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('corp-1');
    });

    it('returns 404 when corporate document id does not exist', async () => {
      (getCorporateDocumentById as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

      const res = await request(createApp('owner')).get('/api/compliance/corporate-documents/missing');
      expect(res.status).toBe(404);
    });

    it('creates corporate document for manager role', async () => {
      (createCorporateDocument as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: 'corp-2',
        title: 'GDRFA Establishment Card',
      });

      const res = await request(createApp('manager')).post('/api/compliance/corporate-documents').send({
        title: 'GDRFA Establishment Card',
        authority: 'GDRFA Dubai',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('corp-2');
    });

    it('requires title and authority for create', async () => {
      const res = await request(createApp('manager')).post('/api/compliance/corporate-documents').send({
        title: 'Missing authority',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/title and authority are required/i);
    });

    it('updates corporate document for owner role', async () => {
      (updateCorporateDocument as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: 'corp-1',
        title: 'DET Commercial License Package',
      });

      const res = await request(createApp('owner'))
        .patch('/api/compliance/corporate-documents/corp-1')
        .send({ title: 'DET Commercial License Package' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toContain('DET');
    });

    it('archives corporate document for manager role', async () => {
      (archiveCorporateDocument as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: 'corp-1',
        title: 'DET Commercial License Package',
        status: 'archived',
      });

      const res = await request(createApp('manager')).patch(
        '/api/compliance/corporate-documents/corp-1/archive'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('archived');
      expect(archiveCorporateDocument).toHaveBeenCalledWith('corp-1', 'user-1');
    });

    it('returns 403 when agent tries to archive corporate document', async () => {
      const res = await request(createApp('agent')).patch(
        '/api/compliance/corporate-documents/corp-1/archive'
      );

      expect(res.status).toBe(403);
    });

    it('lists corporate document alerts for finance role', async () => {
      (listCorporateDocumentAlerts as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
        { id: 'alert-1', status: 'open', alertType: 'expiry_warning' },
        { id: 'alert-2', status: 'acknowledged', alertType: 'expiry_expired' },
      ]);

      const res = await request(createApp('finance')).get('/api/compliance/corporate-documents/alerts/list');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.summary.total).toBe(2);
      expect(res.body.summary.open).toBe(1);
      expect(res.body.summary.acknowledged).toBe(1);
    });

    it('acknowledges corporate document alert', async () => {
      (acknowledgeCorporateDocumentAlert as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: 'alert-1',
        status: 'acknowledged',
      });

      const res = await request(createApp('manager')).patch(
        '/api/compliance/corporate-documents/alerts/alert-1/acknowledge'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('acknowledged');
    });

    it('imports corporate document registry for admin role', async () => {
      (importCorporateDocumentsFromRegistry as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        filePath: 'docs/company_documents/normalized/company_documents_registry.json',
        total: 4,
        created: 2,
        updated: 2,
      });

      const res = await request(createApp('admin'))
        .post('/api/compliance/corporate-documents/import-registry')
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(4);
      expect(res.body.data.created).toBe(2);
      expect(res.body.data.updated).toBe(2);
    });
  });
});
