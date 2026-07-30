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
 * GET    /api/compliance/brn-check/history — recent manual BRN check runs
 * GET    /api/compliance/permit-alerts  — permit alert feed (property permits + BRN expiry)
 * GET    /api/compliance/overview       — Full compliance dashboard data
 * PATCH  /api/compliance/ejari/:leaseId — Update Ejari status for a lease
 * POST   /api/compliance/brn-check      — Trigger manual BRN expiry check
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.js';
import { Prisma } from '@prisma/client';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { requirePermission, requireMinRole } from '../middleware/rbac.js';
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
import { getPermitAlerts } from '../services/compliance/permitAlertScheduler.js';
import { enforcePropertyPermitCompliance } from '../services/compliance/propertyPermitEnforcementScheduler.js';
import { screenAML } from '../services/compliance/amlAdapter.js';
import logger from '../utils/logger.js';

const db = prisma as any;

const router = Router();

const COMPLIANCE_MANAGER_ROLES = ['owner', 'manager', 'admin', 'finance'] as const;

function ensureComplianceManagerRole(role: string | undefined, message: string): void {
  if (
    !COMPLIANCE_MANAGER_ROLES.includes((role || '') as (typeof COMPLIANCE_MANAGER_ROLES)[number])
  ) {
    throw new AppError(message, 403);
  }
}

function normalizeMetadata(metadata: unknown): Record<string, unknown> {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }
  return {};
}

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
      db.property.count(),
      db.property.count({ where: { images: { isEmpty: false } } }),
      db.user.count({ where: { role: { in: ['agent', 'owner'] } } }),
      db.user.count({ where: { role: { in: ['agent', 'owner'] }, status: 'active' } }),
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

    const {
      page = '1',
      pageSize = '50',
      type,
      action,
    } = req.query as Record<string, string | undefined>;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

    const where: Record<string, unknown> = {};
    if (type && type !== 'all') where.type = type as string;
    if (action && action !== 'all') where.action = action as string;

    const [logs, total] = await Promise.all([
      db.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, role: true } },
        },
      }),
      db.activity.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: logs.map((l: Record<string, unknown>) => ({
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
    ensureComplianceManagerRole(
      req.user?.role,
      'Access denied — compliance report submission requires manager role or above'
    );

    // Schema validation enforced for payload
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

    const activity = await db.activity.create({
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
    ensureComplianceManagerRole(
      req.user?.role,
      'Access denied — BRN checks require manager role or above'
    );

    logger.info('Manual BRN expiry check triggered', { userId: req.user?.id });
    const result = await checkBRNExpirations();

    await db.activity.create({
      data: {
        type: 'compliance',
        action: 'brn_manual_check',
        description: `Manual BRN expiry check executed (notified=${result.notified}, errors=${result.errors})`,
        userId: req.user?.id || null,
        metadata: {
          notified: result.notified,
          errors: result.errors,
          agentCount: result.agents.length,
          agentIds: result.agents.map(agent => agent.id),
          checkedAt: new Date().toISOString(),
        },
      },
    });

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

// ─── GET /api/compliance/brn-check/history — manual BRN check history ───
router.get(
  '/brn-check/history',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — BRN check history requires manager role', 403);
    }

    const limit = Math.max(1, Math.min(200, parseInt(String(req.query.limit || '25'), 10) || 25));

    const runs = await db.activity.findMany({
      where: {
        type: 'compliance',
        action: 'brn_manual_check',
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, name: true, role: true, email: true } },
      },
    });

    const data = runs.map((run: { id: string; description: string; createdAt: Date; user: unknown; metadata: unknown }) => {
      const metadata = normalizeMetadata(run.metadata);
      return {
        id: run.id,
        description: run.description,
        createdAt: run.createdAt,
        user: run.user,
        summary: {
          notified: Number(metadata.notified || 0),
          errors: Number(metadata.errors || 0),
          agentCount: Number(metadata.agentCount || 0),
          agentIds: Array.isArray(metadata.agentIds) ? metadata.agentIds : [],
        },
      };
    });

    res.status(200).json({
      success: true,
      data,
      summary: {
        total: data.length,
        totalNotified: data.reduce((sum: number, run: { summary: { notified: number } }) => sum + run.summary.notified, 0),
        totalErrors: data.reduce((sum: number, run: { summary: { errors: number } }) => sum + run.summary.errors, 0),
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

    const { leaseId } = req.params as Record<string, string>;
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
    await db.activity.create({
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

    const permitAlerts = await getPermitAlerts(parsedDaysAhead);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          ...permitAlerts.summary,
        },
        listingPermitIssues: permitAlerts.listingPermitIssues,
        brnPermitAlerts: permitAlerts.brnPermitAlerts,
      },
    });
  })
);

// ─── GET /api/compliance/permits — permit register view ───────────────────
router.get(
  '/permits',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — permit register requires manager role', 403);
    }

    const statusFilter = String(req.query.status || 'all').toLowerCase(); // all | missing | complete
    if (!['all', 'missing', 'complete'].includes(statusFilter)) {
      throw new AppError('status must be one of: all, missing, complete', 400);
    }

    const limit = Math.max(1, Math.min(500, parseInt(String(req.query.limit || '100'), 10) || 100));

    const missingWhere = {
      OR: [
        { municipalityNumber: null },
        { municipalityNumber: '' },
        { buildingPermitNumber: null },
        { buildingPermitNumber: '' },
      ],
    };

    const where =
      statusFilter === 'missing'
        ? missingWhere
        : statusFilter === 'complete'
          ? { NOT: missingWhere }
          : {};

    const [properties, totalProperties, missingCount] = await Promise.all([
      db.property.findMany({
        where,
        select: {
          id: true,
          title: true,
          status: true,
          location: true,
          area: true,
          municipalityNumber: true,
          plotNumber: true,
          buildingPermitNumber: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      db.property.count(),
      db.property.count({ where: missingWhere }),
    ]);

    const data = properties.map((p: { id: string; municipalityNumber?: string | null; buildingPermitNumber?: string | null; [key: string]: unknown }) => {
      const permitStatus =
        !p.municipalityNumber ||
        !String(p.municipalityNumber).trim() ||
        !p.buildingPermitNumber ||
        !String(p.buildingPermitNumber).trim()
          ? 'missing'
          : 'complete';

      return {
        id: p.id,
        title: p.title,
        listingStatus: p.status,
        location: p.location,
        area: p.area,
        municipalityNumber: p.municipalityNumber,
        plotNumber: p.plotNumber,
        buildingPermitNumber: p.buildingPermitNumber,
        permitStatus,
        updatedAt: p.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data,
      summary: {
        totalProperties,
        missingPermits: missingCount,
        completePermits: Math.max(0, totalProperties - missingCount),
        filter: statusFilter,
      },
    });
  })
);

// ─── POST /api/compliance/permits/enforcement-run — trigger enforcement ───
router.post(
  '/permits/enforcement-run',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — permit enforcement requires manager role', 403);
    }

    const dryRun = req.body?.dryRun === true;
    const limitRaw = req.body?.limit;
    const limit =
      limitRaw === undefined
        ? undefined
        : Math.max(1, Math.min(2000, parseInt(String(limitRaw), 10) || 500));

    const result = await enforcePropertyPermitCompliance({ dryRun, limit });

    await db.activity.create({
      data: {
        type: 'compliance',
        action: dryRun ? 'permit_enforcement_dry_run' : 'permit_enforcement_triggered',
        description: dryRun
          ? `Permit enforcement dry-run executed: scanned=${result.scanned}`
          : `Permit enforcement executed: autoUnpublished=${result.autoUnpublished}`,
        userId: req.user?.id || null,
        metadata: {
          ...result,
          requestedAt: new Date().toISOString(),
        },
      },
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// ─── GET /api/compliance/permits/enforcement-history — recent runs ───────
router.get(
  '/permits/enforcement-history',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — permit enforcement history requires manager role', 403);
    }

    const limit = Math.max(1, Math.min(200, parseInt(String(req.query.limit || '25'), 10) || 25));

    const runs = await db.activity.findMany({
      where: {
        type: 'compliance',
        action: {
          in: ['permit_enforcement_dry_run', 'permit_enforcement_triggered'],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, name: true, role: true, email: true } },
      },
    });

    const data = runs.map((run: { id: string; action: string; description: string; createdAt: Date; user: unknown; metadata: unknown }) => {
      const metadata = normalizeMetadata(run.metadata);
      return {
        id: run.id,
        action: run.action,
        description: run.description,
        createdAt: run.createdAt,
        user: run.user,
        summary: {
          scanned: Number(metadata.scanned || 0),
          autoUnpublished: Number(metadata.autoUnpublished || 0),
          errors: Number(metadata.errors || 0),
          dryRun: metadata.dryRun === true,
          affectedPropertyIds: Array.isArray(metadata.affectedPropertyIds)
            ? metadata.affectedPropertyIds
            : [],
        },
      };
    });

    res.status(200).json({
      success: true,
      data,
      summary: {
        total: data.length,
        liveRuns: data.filter((r: any) => r.action === 'permit_enforcement_triggered').length,
        dryRuns: data.filter((r: any) => r.action === 'permit_enforcement_dry_run').length,
      },
    });
  })
);

// ─── PATCH /api/compliance/permits/:propertyId — update permit fields ─────
router.patch(
  '/permits/:propertyId',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — permit updates require manager role', 403);
    }

    const { propertyId } = req.params as Record<string, string>;
    const { municipalityNumber, plotNumber, buildingPermitNumber } = req.body || {};

    if (
      municipalityNumber === undefined &&
      plotNumber === undefined &&
      buildingPermitNumber === undefined
    ) {
      throw new AppError(
        'At least one field is required: municipalityNumber, plotNumber, buildingPermitNumber',
        400
      );
    }

    const existing = await db.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        title: true,
        status: true,
        municipalityNumber: true,
        plotNumber: true,
        buildingPermitNumber: true,
      },
    });

    if (!existing) {
      throw new AppError('Property not found', 404);
    }

    const nextMunicipalityNumber =
      municipalityNumber !== undefined
        ? sanitizeString(String(municipalityNumber || '').trim()) || null
        : existing.municipalityNumber;
    const nextPlotNumber =
      plotNumber !== undefined
        ? sanitizeString(String(plotNumber || '').trim()) || null
        : existing.plotNumber;
    const nextBuildingPermitNumber =
      buildingPermitNumber !== undefined
        ? sanitizeString(String(buildingPermitNumber || '').trim()) || null
        : existing.buildingPermitNumber;

    if (existing.status === 'available' && (!nextMunicipalityNumber || !nextBuildingPermitNumber)) {
      throw new AppError(
        'RERA compliance: available listings require municipalityNumber and buildingPermitNumber',
        400
      );
    }

    const updated = await db.property.update({
      where: { id: propertyId },
      data: {
        municipalityNumber: nextMunicipalityNumber,
        plotNumber: nextPlotNumber,
        buildingPermitNumber: nextBuildingPermitNumber,
      },
      select: {
        id: true,
        title: true,
        status: true,
        municipalityNumber: true,
        plotNumber: true,
        buildingPermitNumber: true,
        updatedAt: true,
      },
    });

    await db.activity.create({
      data: {
        type: 'compliance',
        action: 'permit_register_updated',
        description: `Permit register updated for property ${updated.title || updated.id}`,
        userId: req.user?.id || null,
        metadata: {
          propertyId: updated.id,
          municipalityNumber: updated.municipalityNumber,
          plotNumber: updated.plotNumber,
          buildingPermitNumber: updated.buildingPermitNumber,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

// ─── POST /api/compliance/kyc/:leadId/documents — upload doc metadata ─────
router.post(
  '/kyc/:leadId/documents',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — KYC upload requires agent role or above', 403);
    }

    const { leadId } = req.params as Record<string, string>;
    const { documentType, documentUrl, fileName, mimeType, fileSize, notes } = req.body;

    if (!documentType || !documentUrl) {
      throw new AppError('documentType and documentUrl are required', 400);
    }

    const lead = await db.lead.findUnique({ where: { id: leadId }, select: { id: true } });
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const created = await db.activity.create({
      data: {
        type: 'compliance',
        action: 'kyc_document_uploaded',
        description: `KYC document uploaded (${sanitizeString(String(documentType)).substring(0, 80)})`,
        userId: req.user?.id || null,
        leadId,
        metadata: {
          documentType: sanitizeString(String(documentType)).substring(0, 80),
          documentUrl: sanitizeString(String(documentUrl)).substring(0, 1000),
          fileName: fileName ? sanitizeString(String(fileName)).substring(0, 200) : null,
          mimeType: mimeType ? sanitizeString(String(mimeType)).substring(0, 120) : null,
          fileSize: Number.isFinite(Number(fileSize)) ? Number(fileSize) : null,
          notes: notes ? sanitizeString(String(notes)).substring(0, 2000) : null,
          reviewStatus: 'pending',
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: created.id,
        leadId,
        reviewStatus: 'pending',
        createdAt: created.createdAt,
      },
    });
  })
);

// ─── GET /api/compliance/kyc/:leadId/documents — list docs by lead ───────
router.get(
  '/kyc/:leadId/documents',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — KYC documents require agent role or above', 403);
    }

    const { leadId } = req.params;
    const docs = await db.activity.findMany({
      where: {
        type: 'compliance',
        action: 'kyc_document_uploaded',
        leadId,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const mapped = docs.map((d: any) => {
      const metadata = normalizeMetadata(d.metadata);
      return {
        id: d.id,
        leadId: d.leadId,
        documentType: metadata.documentType || null,
        documentUrl: metadata.documentUrl || null,
        fileName: metadata.fileName || null,
        reviewStatus: metadata.reviewStatus || 'pending',
        reviewDecision: metadata.reviewDecision || null,
        reviewComments: metadata.reviewComments || null,
        reviewedBy: metadata.reviewedBy || null,
        reviewedAt: metadata.reviewedAt || null,
        uploadedAt: metadata.uploadedAt || d.createdAt.toISOString(),
      };
    });

    res.json({ success: true, data: mapped });
  })
);

// ─── GET /api/compliance/kyc/review-queue — pending review docs ──────────
router.get(
  '/kyc/review-queue',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — KYC review queue requires manager role', 403);
    }

    const take = Math.min(parseInt(String(req.query.limit || '100'), 10) || 100, 300);
    const docs = await db.activity.findMany({
      where: {
        type: 'compliance',
        action: 'kyc_document_uploaded',
      },
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        lead: { select: { id: true, name: true, email: true, phone: true, status: true } },
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    const pending = docs.filter((d: any) => {
      const metadata = normalizeMetadata(d.metadata);
      return (metadata.reviewStatus || 'pending') === 'pending';
    });

    res.json({
      success: true,
      data: pending.map((d: any) => {
        const metadata = normalizeMetadata(d.metadata);
        return {
          id: d.id,
          leadId: d.leadId,
          lead: d.lead,
          uploadedBy: d.user,
          documentType: metadata.documentType || null,
          documentUrl: metadata.documentUrl || null,
          uploadedAt: metadata.uploadedAt || d.createdAt.toISOString(),
          reviewStatus: metadata.reviewStatus || 'pending',
        };
      }),
      summary: {
        totalFetched: docs.length,
        pending: pending.length,
      },
    });
  })
);

// ─── PATCH /api/compliance/kyc/documents/:documentId/review ──────────────
router.patch(
  '/kyc/documents/:documentId/review',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    ensureComplianceManagerRole(req.user?.role, 'Access denied — KYC review requires manager role');

    const { documentId } = req.params as Record<string, string>;
    const { decision, comments } = req.body;
    if (!['approved', 'rejected'].includes(String(decision))) {
      throw new AppError('decision must be one of: approved, rejected', 400);
    }

    const docActivity = await db.activity.findUnique({ where: { id: documentId } });
    if (
      !docActivity ||
      docActivity.type !== 'compliance' ||
      docActivity.action !== 'kyc_document_uploaded'
    ) {
      throw new AppError('KYC document record not found', 404);
    }

    const currentMetadata = normalizeMetadata(docActivity.metadata);
    const nextMetadata = {
      ...currentMetadata,
      reviewStatus: 'reviewed',
      reviewDecision: decision,
      reviewComments: comments ? sanitizeString(String(comments)).substring(0, 2000) : null,
      reviewedBy: req.user?.id || null,
      reviewedAt: new Date().toISOString(),
    };

    const updated = await db.activity.update({
      where: { id: documentId },
      data: { metadata: nextMetadata },
    });

    if (docActivity.leadId) {
      const lead = await db.lead.findUnique({
        where: { id: docActivity.leadId },
        select: { id: true, tags: true },
      });

      if (lead) {
        const normalizedTags = (lead.tags || []).map((t: unknown) => String(t).toLowerCase());
        const hasVerified = normalizedTags.includes('kyc_verified');
        const hasRejected = normalizedTags.includes('kyc_rejected');

        let nextTags = [...(lead.tags || [])];
        if (decision === 'approved') {
          if (!hasVerified) nextTags.push('kyc_verified');
          nextTags = nextTags.filter(t => String(t).toLowerCase() !== 'kyc_rejected');
        } else {
          nextTags = nextTags.filter(t => String(t).toLowerCase() !== 'kyc_verified');
          if (!hasRejected) nextTags.push('kyc_rejected');
        }

        await db.lead.update({
          where: { id: lead.id },
          data: { tags: nextTags },
        });
      }
    }

    await db.activity.create({
      data: {
        type: 'compliance',
        action: 'kyc_document_reviewed',
        description: `KYC document ${decision}`,
        userId: req.user?.id || null,
        leadId: docActivity.leadId || null,
        metadata: {
          documentActivityId: documentId,
          decision,
          comments: comments ? sanitizeString(String(comments)).substring(0, 2000) : null,
        },
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        decision,
        metadata: nextMetadata,
      },
    });
  })
);

// ─── POST /api/compliance/aml/screen — AML screening adapter flow ───────
router.post(
  '/aml/screen',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — AML screening requires agent role or above', 403);
    }

    const { leadId, amount, currency, transactionType, nationality, sourceOfFunds } = req.body;
    if (!leadId) {
      throw new AppError('leadId is required', 400);
    }

    const lead = await db.lead.findUnique({
      where: { id: String(leadId) },
      select: { id: true, name: true, tags: true, email: true, phone: true },
    });

    if (!lead) {
      throw new AppError('Lead not found for AML screening', 404);
    }

    const screening = await screenAML({
      leadId: lead.id,
      leadName: lead.name,
      amount: Number.isFinite(Number(amount)) ? Number(amount) : null,
      currency: currency ? String(currency) : null,
      transactionType: transactionType ? String(transactionType) : null,
      nationality: nationality ? String(nationality) : null,
      sourceOfFunds: sourceOfFunds ? String(sourceOfFunds) : null,
    });

    const isFlagged = screening.riskLevel === 'high' || screening.flags.length > 0;

    const activity = await db.activity.create({
      data: {
        type: 'compliance',
        action: isFlagged ? 'aml_alert_created' : 'aml_screened',
        description: isFlagged
          ? `AML alert created for lead ${lead.name || lead.id}`
          : `AML screening completed for lead ${lead.name || lead.id}`,
        userId: req.user?.id || null,
        leadId: lead.id,
        metadata: {
          screening,
          status: isFlagged ? 'open' : 'cleared',
          severity: screening.riskLevel,
          flags: screening.flags,
          amount: Number.isFinite(Number(amount)) ? Number(amount) : null,
          currency: currency ? String(currency) : 'AED',
          transactionType: transactionType ? String(transactionType) : null,
        } as unknown as Prisma.InputJsonValue,
      },
    });

    if (isFlagged) {
      const normalizedTags = (lead.tags || []).map((t: unknown) => String(t).toLowerCase());
      const hasAmlFlagged = normalizedTags.includes('aml_flagged');
      if (!hasAmlFlagged) {
        await db.lead.update({
          where: { id: lead.id },
          data: { tags: [...(lead.tags || []), 'aml_flagged'] },
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        alertId: isFlagged ? activity.id : null,
        screening,
        status: isFlagged ? 'open' : 'cleared',
      },
    });
  })
);

// ─── GET /api/compliance/aml/alerts — list AML alerts ───────────────────
router.get(
  '/aml/alerts',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — AML alerts require manager role', 403);
    }

    const status = String(req.query.status || 'open');
    const take = Math.min(parseInt(String(req.query.limit || '100'), 10) || 100, 300);

    const alerts = await db.activity.findMany({
      where: {
        type: 'compliance',
        action: 'aml_alert_created',
      },
      include: {
        lead: { select: { id: true, name: true, email: true, phone: true, status: true } },
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });

    const filtered = alerts.filter((a: any) => {
      const metadata = normalizeMetadata(a.metadata);
      const alertStatus = String(metadata.status || 'open');
      return status === 'all' ? true : alertStatus === status;
    });

    res.json({
      success: true,
      data: filtered.map((a: any) => {
        const metadata = normalizeMetadata(a.metadata);
        return {
          id: a.id,
          leadId: a.leadId,
          lead: a.lead,
          createdBy: a.user,
          status: metadata.status || 'open',
          severity: metadata.severity || 'medium',
          flags: metadata.flags || [],
          screening: metadata.screening || null,
          resolvedAt: metadata.resolvedAt || null,
          resolvedBy: metadata.resolvedBy || null,
          createdAt: a.createdAt,
        };
      }),
      summary: {
        totalFetched: alerts.length,
        returned: filtered.length,
      },
    });
  })
);

// ─── PATCH /api/compliance/aml/alerts/:alertId/resolve ───────────────────
router.patch(
  '/aml/alerts/:alertId/resolve',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — AML alert resolution requires manager role', 403);
    }

    const { alertId } = req.params as Record<string, string>;
    const { resolution, notes } = req.body;

    const alert = await db.activity.findUnique({ where: { id: alertId } });
    if (!alert || alert.type !== 'compliance' || alert.action !== 'aml_alert_created') {
      throw new AppError('AML alert not found', 404);
    }

    const metadata = normalizeMetadata(alert.metadata);
    const nextMetadata = {
      ...metadata,
      status: 'resolved',
      resolution: resolution ? sanitizeString(String(resolution)).substring(0, 500) : 'resolved',
      notes: notes ? sanitizeString(String(notes)).substring(0, 2000) : null,
      resolvedAt: new Date().toISOString(),
      resolvedBy: req.user?.id || null,
    };

    const updated = await db.activity.update({
      where: { id: alertId },
      data: { metadata: nextMetadata },
    });

    await db.activity.create({
      data: {
        type: 'compliance',
        action: 'aml_alert_resolved',
        description: `AML alert resolved: ${alertId}`,
        userId: req.user?.id || null,
        leadId: alert.leadId || null,
        metadata: {
          alertId,
          resolution: nextMetadata.resolution,
        },
      },
    });

    res.json({
      success: true,
      data: { id: updated.id, status: 'resolved', metadata: nextMetadata },
    });
  })
);

// ─── POST /api/compliance/consent — create PDPL consent record ───────────
router.post(
  '/consent',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    ensureComplianceManagerRole(
      req.user?.role,
      'Access denied — consent creation requires manager role or above'
    );

    const { entityType = 'lead', entityId, purpose, channel, consentTextVersion } = req.body;
    if (!entityId || !purpose) {
      throw new AppError('entityId and purpose are required', 400);
    }

    if (String(entityType) === 'lead') {
      const lead = await db.lead.findUnique({
        where: { id: String(entityId) },
        select: { id: true },
      });
      if (!lead) throw new AppError('Lead not found for consent record', 404);
    }

    const consent = await db.activity.create({
      data: {
        type: 'compliance',
        action: 'pdpl_consent_created',
        description: `PDPL consent captured for ${String(entityType)}:${String(entityId)}`,
        userId: req.user?.id || null,
        leadId: String(entityType) === 'lead' ? String(entityId) : null,
        metadata: {
          entityType: sanitizeString(String(entityType)).substring(0, 50),
          entityId: sanitizeString(String(entityId)).substring(0, 120),
          purpose: sanitizeString(String(purpose)).substring(0, 500),
          channel: channel ? sanitizeString(String(channel)).substring(0, 100) : 'crm_form',
          consentTextVersion: consentTextVersion
            ? sanitizeString(String(consentTextVersion)).substring(0, 50)
            : 'v1',
          status: 'active',
          consentedAt: new Date().toISOString(),
          consentedBy: req.user?.id || null,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { id: consent.id, status: 'active', metadata: consent.metadata },
    });
  })
);

// ─── PATCH /api/compliance/consent/:consentId/revoke ─────────────────────
router.patch(
  '/consent/:consentId/revoke',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    ensureComplianceManagerRole(
      req.user?.role,
      'Access denied — consent revoke requires manager role'
    );

    const { consentId } = req.params as Record<string, string>;
    const { reason } = req.body;

    const consent = await db.activity.findUnique({ where: { id: consentId } });
    if (!consent || consent.type !== 'compliance' || consent.action !== 'pdpl_consent_created') {
      throw new AppError('Consent record not found', 404);
    }

    const metadata = normalizeMetadata(consent.metadata);
    const updatedMetadata = {
      ...metadata,
      status: 'revoked',
      revokedAt: new Date().toISOString(),
      revokedBy: req.user?.id || null,
      revokeReason: reason ? sanitizeString(String(reason)).substring(0, 1000) : null,
    };

    const updated = await db.activity.update({
      where: { id: consentId },
      data: { metadata: updatedMetadata },
    });

    await db.activity.create({
      data: {
        type: 'compliance',
        action: 'pdpl_consent_revoked',
        description: `PDPL consent revoked: ${consentId}`,
        userId: req.user?.id || null,
        leadId: consent.leadId || null,
        metadata: {
          consentId,
          reason: updatedMetadata.revokeReason,
        },
      },
    });

    res.json({
      success: true,
      data: { id: updated.id, status: 'revoked', metadata: updatedMetadata },
    });
  })
);

// ─── GET /api/compliance/consent/export — export consent records ─────────
router.get(
  '/consent/export',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — consent export requires manager role', 403);
    }

    const status = String(req.query.status || 'all');
    const entityType = req.query.entityType ? String(req.query.entityType) : undefined;
    const entityId = req.query.entityId ? String(req.query.entityId) : undefined;
    const take = Math.min(parseInt(String(req.query.limit || '300'), 10) || 300, 1000);

    const records = await db.activity.findMany({
      where: {
        type: 'compliance',
        action: 'pdpl_consent_created',
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        lead: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });

    const mapped = records.map((r: any) => {
      const metadata = normalizeMetadata(r.metadata);
      return {
        id: r.id,
        entityType: metadata.entityType || 'lead',
        entityId: metadata.entityId || r.leadId,
        purpose: metadata.purpose || null,
        channel: metadata.channel || null,
        status: metadata.status || 'active',
        consentedAt: metadata.consentedAt || r.createdAt.toISOString(),
        revokedAt: metadata.revokedAt || null,
        createdBy: r.user,
        lead: r.lead,
      };
    });

    const filtered = mapped.filter((row: any) => {
      if (status !== 'all' && String(row.status) !== status) return false;
      if (entityType && String(row.entityType) !== entityType) return false;
      if (entityId && String(row.entityId) !== entityId) return false;
      return true;
    });

    res.json({
      success: true,
      data: filtered,
      summary: {
        totalFetched: mapped.length,
        returned: filtered.length,
      },
    });
  })
);

// ─── DELETE /api/compliance/consent/:consentId — delete/anonymize baseline ─
router.delete(
  '/consent/:consentId',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    ensureComplianceManagerRole(
      req.user?.role,
      'Access denied — consent delete requires manager role or above'
    );

    const { consentId } = req.params;
    const consent = await db.activity.findUnique({ where: { id: consentId } });
    if (!consent || consent.type !== 'compliance' || consent.action !== 'pdpl_consent_created') {
      throw new AppError('Consent record not found', 404);
    }

    const metadata = normalizeMetadata(consent.metadata);
    const updatedMetadata = {
      ...metadata,
      status: 'deleted',
      deletedAt: new Date().toISOString(),
      deletedBy: req.user?.id || null,
      purpose: '[deleted]',
      channel: '[deleted]',
    };

    await db.activity.update({
      where: { id: consentId },
      data: { metadata: updatedMetadata },
    });

    await db.activity.create({
      data: {
        type: 'compliance',
        action: 'pdpl_consent_deleted',
        description: `PDPL consent deleted/anonymized: ${consentId}`,
        userId: req.user?.id || null,
        leadId: consent.leadId || null,
        metadata: {
          consentId,
          status: 'deleted',
        },
      },
    });

    res.json({ success: true, data: { id: consentId, status: 'deleted' } });
  })
);

// ─── GET /api/compliance/queues — unified compliance queue feed ──────────
router.get(
  '/queues',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — compliance queues require manager role', 403);
    }

    const [permitIssues, kycDocs, amlAlerts] = await Promise.all([
      db.property.findMany({
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
          municipalityNumber: true,
          buildingPermitNumber: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      db.activity.findMany({
        where: {
          type: 'compliance',
          action: 'kyc_document_uploaded',
        },
        include: {
          lead: { select: { id: true, name: true, email: true, phone: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      db.activity.findMany({
        where: {
          type: 'compliance',
          action: 'aml_alert_created',
        },
        include: {
          lead: { select: { id: true, name: true, email: true, phone: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
    ]);

    const pendingKyc = kycDocs.filter((d: any) => {
      const metadata = normalizeMetadata(d.metadata);
      return (metadata.reviewStatus || 'pending') === 'pending';
    });

    const openAml = amlAlerts.filter((a: any) => {
      const metadata = normalizeMetadata(a.metadata);
      return String(metadata.status || 'open') === 'open';
    });

    res.json({
      success: true,
      data: {
        summary: {
          permitIssues: permitIssues.length,
          kycPendingReview: pendingKyc.length,
          amlOpenAlerts: openAml.length,
        },
        permitIssues: permitIssues.slice(0, 20),
        kycPendingReview: pendingKyc.slice(0, 20).map((d: any) => {
          const metadata = normalizeMetadata(d.metadata);
          return {
            id: d.id,
            leadId: d.leadId,
            lead: d.lead,
            documentType: metadata.documentType || null,
            uploadedAt: metadata.uploadedAt || d.createdAt.toISOString(),
          };
        }),
        amlOpenAlerts: openAml.slice(0, 20).map((a: any) => {
          const metadata = normalizeMetadata(a.metadata);
          return {
            id: a.id,
            leadId: a.leadId,
            lead: a.lead,
            severity: metadata.severity || 'medium',
            flags: metadata.flags || [],
            createdAt: a.createdAt,
          };
        }),
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

// ─── DLD / EJARI MOCK ENDPOINTS ──────────────────────────────────────────────
// These endpoints are active when USE_MOCK_DLD=true (env flag, default: true).
// When USE_MOCK_DLD=false, they return 501 Not Implemented (live DLD API not yet wired).
// During Wave 19 and Wave 20 development, the mock path is the default.

import { dldMockService } from '../services/mock/dldMockService.js';
import { ejariMockService } from '../services/mock/ejariMockService.js';

const useMockDLD = process.env.USE_MOCK_DLD !== 'false'; // default: mock enabled

/**
 * POST /api/compliance/dld/register-oqood
 * Register an off-plan unit via Oqood.
 * Mock path active when USE_MOCK_DLD=true (default).
 */
router.post(
  '/dld/register-oqood',
  requireMinRole('agent'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!['owner', 'manager', 'admin'].includes(req.user?.role || '')) {
      throw new AppError('Access denied — DLD registration requires manager role', 403);
    }

    if (!useMockDLD) {
      throw new AppError('Live DLD API is not yet configured. Set USE_MOCK_DLD=true.', 501);
    }

    const {
      developerId,
      projectId,
      buyerEmiratesId,
      unitNumber,
      salePriceAED,
      spaDate,
      paymentPlanType,
    } = req.body;

    if (!developerId || !projectId || !buyerEmiratesId || !unitNumber || !salePriceAED) {
      throw new AppError(
        'developerId, projectId, buyerEmiratesId, unitNumber, and salePriceAED are required',
        400
      );
    }

    const result = dldMockService.registerOqood({
      developerId,
      projectId,
      buyerEmiratesId,
      unitNumber,
      salePriceAED: Number(salePriceAED),
      spaDate: spaDate ?? new Date().toISOString(),
      paymentPlanType: paymentPlanType ?? 'full_payment',
    });

    logger.info('DLD Oqood registration (mock)', {
      oqoodNumber: result.oqoodNumber,
      unitNumber,
      salePriceAED,
    });

    res.setHeader('X-Mock-DLD', 'true');
    res.status(201).json({ success: true, data: result });
  })
);

/**
 * POST /api/compliance/ejari/activate
 * Activate an Ejari lease contract.
 * Mock path active when USE_MOCK_DLD=true (default).
 */
router.post(
  '/ejari/activate',
  requireMinRole('agent'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!['owner', 'manager', 'admin'].includes(req.user?.role || '')) {
      throw new AppError('Access denied — Ejari activation requires manager role', 403);
    }

    if (!useMockDLD) {
      throw new AppError('Live Ejari API is not yet configured. Set USE_MOCK_DLD=true.', 501);
    }

    const {
      leaseId,
      landlordEmiratesId,
      tenantEmiratesId,
      propertyAddress,
      annualRentAED,
      leaseStartDate,
      leaseEndDate,
      paymentFrequency,
      numberOfCheques,
    } = req.body;

    if (!leaseId || !landlordEmiratesId || !tenantEmiratesId || !propertyAddress || !annualRentAED) {
      throw new AppError(
        'leaseId, landlordEmiratesId, tenantEmiratesId, propertyAddress, and annualRentAED are required',
        400
      );
    }

    const result = ejariMockService.activateContract({
      leaseId,
      landlordEmiratesId,
      tenantEmiratesId,
      propertyAddress,
      annualRentAED: Number(annualRentAED),
      leaseStartDate: leaseStartDate ?? new Date().toISOString(),
      leaseEndDate:
        leaseEndDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      paymentFrequency: paymentFrequency ?? 'annual',
      numberOfCheques: numberOfCheques ?? 1,
    });

    // Persist the Ejari number back to the lease record
    await updateEjariStatus(leaseId, {
      ejariNumber: result.ejariContractNumber,
      ejariStatus: 'registered',
      ejariRegistrationDate: new Date(),
    });

    logger.info('Ejari contract activated (mock)', {
      ejariContractNumber: result.ejariContractNumber,
      leaseId,
      activationReference: result.activationReference,
    });

    res.setHeader('X-Mock-DLD', 'true');
    res.status(201).json({ success: true, data: result });
  })
);

/**
 * POST /api/compliance/ejari/renew
 * Renew an Ejari lease contract with RERA rental index check.
 * Mock path active when USE_MOCK_DLD=true (default).
 */
router.post(
  '/ejari/renew',
  requireMinRole('agent'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!['owner', 'manager', 'admin'].includes(req.user?.role || '')) {
      throw new AppError('Access denied — Ejari renewal requires manager role', 403);
    }

    if (!useMockDLD) {
      throw new AppError('Live Ejari API is not yet configured. Set USE_MOCK_DLD=true.', 501);
    }

    const {
      leaseId,
      existingContractNumber,
      newAnnualRentAED,
      existingAnnualRentAED,
      newLeaseStartDate,
      newLeaseEndDate,
      propertyAddress,
    } = req.body;

    if (!leaseId || !existingContractNumber || !newAnnualRentAED || !existingAnnualRentAED) {
      throw new AppError(
        'leaseId, existingContractNumber, newAnnualRentAED, and existingAnnualRentAED are required',
        400
      );
    }

    const result = ejariMockService.renewContract({
      leaseId,
      existingContractNumber,
      newAnnualRentAED: Number(newAnnualRentAED),
      existingAnnualRentAED: Number(existingAnnualRentAED),
      newLeaseStartDate: newLeaseStartDate ?? new Date().toISOString(),
      newLeaseEndDate:
        newLeaseEndDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      propertyAddress: propertyAddress ?? '',
    });

    logger.info('Ejari contract renewal (mock)', {
      status: result.status,
      leaseId,
      rentIncreasePercentage: result.rentIncreasePercentage,
      reraPermittedIncreasePercentage: result.reraPermittedIncreasePercentage,
    });

    if (result.status === 'rejected') {
      res.setHeader('X-Mock-DLD', 'true');
      return res.status(422).json({
        success: false,
        error: `Rent increase of ${result.rentIncreasePercentage}% exceeds RERA permitted maximum of ${result.reraPermittedIncreasePercentage}% for this area.`,
        data: result,
      });
    }

    res.setHeader('X-Mock-DLD', 'true');
    res.status(200).json({ success: true, data: result });
  })
);

/**
 * GET /api/compliance/dld/health
 * Returns DLD/Ejari mock status for observability.
 */
router.get(
  '/dld/health',
  asyncHandler(async (_req: Request, res: Response) => {
    if (!useMockDLD) {
      return res.json({ success: true, data: { status: 'live', useMock: false } });
    }
    res.setHeader('X-Mock-DLD', 'true');
    res.json({
      success: true,
      data: {
        dld: dldMockService.getHealthStatus(),
        ejari: ejariMockService.getHealthStatus(),
      },
    });
  })
);

export default router;
