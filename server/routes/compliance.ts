/**
 * Compliance API Routes — Phase 3D Enhanced
 * ──────────────────────────────────────────
 * UAE regulatory compliance, audit logs, requirement tracking,
 * RERA BRN expiry monitoring, Ejari CSV export, VAT summary.
 *
 * GET    /api/compliance/status         — Overall compliance score
 * GET    /api/compliance/requirements   — RERA/DLD checklist
 * GET    /api/compliance/audit-logs     — Paginated audit trail
 * POST   /api/compliance/reports        — Submit compliance report
 * GET    /api/compliance/brn-expiry     — BRN expiry report for all agents
 * GET    /api/compliance/ejari-export   — Ejari CSV download
 * GET    /api/compliance/vat-summary    — VAT breakdown by property type
 * GET    /api/compliance/permit-alerts  — permit alert feed (property permits + BRN expiry)
 * GET    /api/compliance/overview       — Full compliance dashboard data
 * PATCH  /api/compliance/ejari/:leaseId — Update Ejari status for a lease
 * POST   /api/compliance/brn-check      — Trigger manual BRN expiry check
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { requirePermission, requireMinRole } from '../middleware/rbac';
import {
  getBRNExpiryReport,
  checkBRNExpirations,
} from '../services/compliance/reraExpiryScheduler.js';
import {
  generateEjariExport,
  calculateVATSummary,
  getComplianceOverview,
  updateEjariStatus,
} from '../services/compliance/complianceService.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── GET /api/compliance/status ─────────────────────────────────────────
// Overall compliance health check
router.get(
  '/status',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers/finance can view compliance status
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — compliance data requires manager role', 403);
    }

    // Check key compliance metrics
    const [totalProperties, propertiesWithDocs, totalAgents, activeAgents] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { images: { isEmpty: false } } }),
      prisma.user.count({ where: { role: { in: ['agent', 'owner'] } } }),
      prisma.user.count({ where: { role: { in: ['agent', 'owner'] }, status: 'active' } }),
    ]);

    const docCompliance =
      totalProperties > 0 ? Math.round((propertiesWithDocs / totalProperties) * 100) : 100;
    const agentCompliance = totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 100;
    const overallScore = Math.round((docCompliance + agentCompliance) / 2);

    res.status(200).json({
      success: true,
      data: {
        compliant: overallScore >= 80,
        overallScore,
        metrics: {
          documentationCompliance: docCompliance,
          agentCompliance,
          dataRetention: 100, // Always compliant (MongoDB auto)
          privacyPolicy: 100, // Assumed compliant
        },
        lastAudit: new Date().toISOString(),
      },
    });
  })
);

// ─── GET /api/compliance/requirements ───────────────────────────────────
// UAE RERA compliance requirement checklist
router.get(
  '/requirements',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers/finance can view compliance requirements
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — compliance data requires manager role', 403);
    }

    const requirements = [
      {
        id: 'rera-license',
        name: 'RERA Broker License',
        category: 'licensing',
        status: 'compliant',
        dueDate: '2027-01-01',
      },
      {
        id: 'dld-registration',
        name: 'DLD Registration',
        category: 'licensing',
        status: 'compliant',
        dueDate: '2027-01-01',
      },
      {
        id: 'agent-cards',
        name: 'Agent Broker Cards',
        category: 'agents',
        status: 'pending_review',
        dueDate: '2026-06-30',
      },
      {
        id: 'aml-kyc',
        name: 'AML/KYC Procedures',
        category: 'compliance',
        status: 'compliant',
        dueDate: null,
      },
      {
        id: 'data-protection',
        name: 'Data Protection (PDPL)',
        category: 'privacy',
        status: 'compliant',
        dueDate: null,
      },
      {
        id: 'escrow-accounts',
        name: 'Escrow Account Management',
        category: 'finance',
        status: 'compliant',
        dueDate: null,
      },
      {
        id: 'property-ads',
        name: 'Property Advertisement Compliance',
        category: 'marketing',
        status: 'compliant',
        dueDate: null,
      },
      {
        id: 'contract-templates',
        name: 'Contract Templates (SPA/MOU)',
        category: 'legal',
        status: 'pending_review',
        dueDate: '2026-04-30',
      },
    ];

    res.status(200).json({ success: true, data: requirements });
  })
);

// ─── GET /api/compliance/audit-logs ─────────────────────────────────────
// Audit trail from activity log — RESTRICTED to owner/manager roles
router.get(
  '/audit-logs',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: audit logs contain sensitive info — owner/manager only
    const userRole = req.user?.role || '';
    if (!['owner', 'manager'].includes(userRole)) {
      throw new AppError('Access denied — audit logs require owner or manager role', 403);
    }

    const { page = '1', pageSize = '50', type, action } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

    const where: Record<string, unknown> = {};
    if (type && type !== 'all') where.type = type as string;
    if (action && action !== 'all') where.action = action as string;

    const [logs, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, role: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: logs.map(l => ({
        id: l.id,
        type: l.type,
        action: l.action,
        description: l.description,
        user: l.user ? { id: l.user.id, name: l.user.name, role: l.user.role } : null,
        timestamp: l.createdAt.toISOString(),
        metadata: l.metadata,
      })),
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── POST /api/compliance/reports ───────────────────────────────────────
// Submit a compliance report — RESTRICTED to owner/manager roles
router.post(
  '/reports',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: compliance report submission requires elevated privileges
    const userRole = req.user?.role || '';
    if (!['owner', 'manager'].includes(userRole)) {
      throw new AppError('Access denied — only owners/managers can submit compliance reports', 403);
    }

    const { title, findings, recommendations } = req.body;

    if (!title) throw new AppError('Report title is required', 400);
    if (typeof title !== 'string' || title.trim().length > 500) {
      throw new AppError('Report title must be 500 characters or less', 400);
    }

    const sanitizedTitle = sanitizeString(title.trim());
    const sanitizedFindings = findings ? sanitizeString(String(findings).substring(0, 10000)) : '';
    const sanitizedRecommendations = recommendations
      ? sanitizeString(String(recommendations).substring(0, 10000))
      : '';

    const activity = await prisma.activity.create({
      data: {
        type: 'system',
        action: 'created',
        description: `Compliance report submitted: ${sanitizedTitle}`,
        userId: req.user?.id || null,
        metadata: {
          reportTitle: sanitizedTitle,
          findings: sanitizedFindings,
          recommendations: sanitizedRecommendations,
          submittedAt: new Date().toISOString(),
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: activity.id,
        title,
        submittedAt: activity.createdAt.toISOString(),
        status: 'submitted',
      },
    });
  })
);

// ─── GET /api/compliance/brn-expiry — BRN expiry report ─────────────────
router.get(
  '/brn-expiry',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — compliance data requires manager role', 403);
    }

    const report = await getBRNExpiryReport();

    const summary = {
      total: report.length,
      valid: report.filter(a => a.status === 'valid').length,
      expiringSoon: report.filter(a => a.status === 'expiring_soon').length,
      expired: report.filter(a => a.status === 'expired').length,
      notSet: report.filter(a => a.status === 'not_set').length,
    };

    res.json({ success: true, data: { agents: report, summary } });
  })
);

// ─── POST /api/compliance/brn-check — Manual BRN expiry check ───────────
router.post(
  '/brn-check',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    const userRole = req.user?.role || '';
    if (!['owner', 'manager'].includes(userRole)) {
      throw new AppError('Access denied — only owners/managers can trigger BRN checks', 403);
    }

    logger.info('Manual BRN expiry check triggered', { userId: req.user?.id });
    const result = await checkBRNExpirations();

    res.json({
      success: true,
      data: {
        notified: result.notified,
        errors: result.errors,
        agents: result.agents,
      },
    });
  })
);

// ─── GET /api/compliance/ejari-export — Ejari CSV export ─────────────────
router.get(
  '/ejari-export',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — compliance data requires manager role', 403);
    }

    const status = req.query.status as string | undefined;
    const fromDate = req.query.from ? new Date(req.query.from as string) : undefined;
    const toDate = req.query.to ? new Date(req.query.to as string) : undefined;
    const format = (req.query.format as string) || 'csv';

    const result = await generateEjariExport({ status, fromDate, toDate });

    if (format === 'json') {
      res.json({ success: true, data: { rows: result.rows, count: result.count } });
      return;
    }

    // CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ejari-export-${new Date().toISOString().split('T')[0]}.csv"`
    );
    res.send(result.csv);
  })
);

// ─── PATCH /api/compliance/ejari/:leaseId — Update Ejari status ──────────
router.patch(
  '/ejari/:leaseId',
  requireMinRole('agent'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userRole = req.user?.role || '';
    if (!['owner', 'manager', 'admin'].includes(userRole)) {
      throw new AppError('Access denied — Ejari updates require manager role', 403);
    }

    const { leaseId } = req.params;
    const { ejariNumber, ejariStatus, ejariRegistrationDate, ejariExpiryDate } = req.body;

    if (ejariStatus && !['pending', 'registered', 'expired', 'cancelled'].includes(ejariStatus)) {
      throw new AppError(
        'Invalid ejariStatus. Must be: pending, registered, expired, cancelled',
        400
      );
    }

    const updated = await updateEjariStatus(leaseId, {
      ejariNumber,
      ejariStatus,
      ejariRegistrationDate: ejariRegistrationDate ? new Date(ejariRegistrationDate) : undefined,
      ejariExpiryDate: ejariExpiryDate ? new Date(ejariExpiryDate) : undefined,
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'compliance',
        action: 'ejari_updated',
        description: `Ejari status updated for lease ${leaseId}: ${ejariStatus || 'updated'}`,
        userId: req.user?.id || null,
        metadata: JSON.stringify({ leaseId, ejariNumber, ejariStatus }),
      },
    });

    res.json({ success: true, data: updated });
  })
);

// ─── GET /api/compliance/vat-summary — VAT breakdown ─────────────────────
router.get(
  '/vat-summary',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — VAT data requires manager role', 403);
    }

    const fromDate = req.query.from ? new Date(req.query.from as string) : undefined;
    const toDate = req.query.to ? new Date(req.query.to as string) : undefined;

    const summary = await calculateVATSummary(fromDate, toDate);

    res.json({ success: true, data: summary });
  })
);

// ─── GET /api/compliance/permit-alerts — permit monitoring alerts ─────────
router.get(
  '/permit-alerts',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — permit alerts require manager role', 403);
    }

    const parsedDaysAhead = parseInt(String(req.query.daysAhead || '30'), 10);
    if (!Number.isFinite(parsedDaysAhead) || parsedDaysAhead < 1 || parsedDaysAhead > 365) {
      throw new AppError('daysAhead must be a number between 1 and 365', 400);
    }

    const now = new Date();
    const cutoff = new Date(now.getTime() + parsedDaysAhead * 24 * 60 * 60 * 1000);

    // Active listings that fail permit baseline requirements.
    const missingPermitListings = await prisma.property.findMany({
      where: {
        status: 'available',
        OR: [
          { municipalityNumber: null },
          { municipalityNumber: '' },
          { buildingPermitNumber: null },
          { buildingPermitNumber: '' },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        municipalityNumber: true,
        buildingPermitNumber: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    // BRN is treated as permit/license expiry signal for compliance alerts.
    const brnExpiringOrExpired = await prisma.user.findMany({
      where: {
        role: { in: ['agent', 'owner'] },
        status: 'active',
        brnNumber: { not: null },
        brnExpiry: { not: null, lte: cutoff },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        brnNumber: true,
        brnExpiry: true,
      },
      orderBy: { brnExpiry: 'asc' },
      take: 200,
    });

    const brnAlerts = brnExpiringOrExpired.map(agent => {
      const expiry = agent.brnExpiry as Date;
      const daysToExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      return {
        ...agent,
        status: daysToExpiry < 0 ? 'expired' : 'expiring_soon',
        daysToExpiry,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          daysAhead: parsedDaysAhead,
          listingPermitIssues: missingPermitListings.length,
          brnExpired: brnAlerts.filter(a => a.status === 'expired').length,
          brnExpiringSoon: brnAlerts.filter(a => a.status === 'expiring_soon').length,
        },
        listingPermitIssues: missingPermitListings,
        brnPermitAlerts: brnAlerts,
      },
    });
  })
);

// ─── GET /api/compliance/overview — Full dashboard data ──────────────────
router.get(
  '/overview',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — compliance overview requires manager role', 403);
    }

    const overview = await getComplianceOverview();

    res.json({ success: true, data: overview });
  })
);

export default router;
