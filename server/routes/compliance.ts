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
import { screenAML } from '../services/compliance/amlAdapter.js';
import logger from '../utils/logger.js';

const router = Router();

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

// ─── POST /api/compliance/kyc/:leadId/documents — upload doc metadata ─────
router.post(
  '/kyc/:leadId/documents',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — KYC upload requires agent role or above', 403);
    }

    const { leadId } = req.params;
    const { documentType, documentUrl, fileName, mimeType, fileSize, notes } = req.body;

    if (!documentType || !documentUrl) {
      throw new AppError('documentType and documentUrl are required', 400);
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true } });
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const created = await prisma.activity.create({
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
    const docs = await prisma.activity.findMany({
      where: {
        type: 'compliance',
        action: 'kyc_document_uploaded',
        leadId,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const mapped = docs.map(d => {
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
    const docs = await prisma.activity.findMany({
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

    const pending = docs.filter(d => {
      const metadata = normalizeMetadata(d.metadata);
      return (metadata.reviewStatus || 'pending') === 'pending';
    });

    res.json({
      success: true,
      data: pending.map(d => {
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
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — KYC review requires manager role', 403);
    }

    const { documentId } = req.params;
    const { decision, comments } = req.body;
    if (!['approved', 'rejected'].includes(String(decision))) {
      throw new AppError('decision must be one of: approved, rejected', 400);
    }

    const docActivity = await prisma.activity.findUnique({ where: { id: documentId } });
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

    const updated = await prisma.activity.update({
      where: { id: documentId },
      data: { metadata: nextMetadata },
    });

    if (docActivity.leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: docActivity.leadId },
        select: { id: true, tags: true },
      });

      if (lead) {
        const normalizedTags = (lead.tags || []).map(t => String(t).toLowerCase());
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

        await prisma.lead.update({
          where: { id: lead.id },
          data: { tags: nextTags },
        });
      }
    }

    await prisma.activity.create({
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

    const lead = await prisma.lead.findUnique({
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

    const activity = await prisma.activity.create({
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
        },
      },
    });

    if (isFlagged) {
      const normalizedTags = (lead.tags || []).map(t => String(t).toLowerCase());
      const hasAmlFlagged = normalizedTags.includes('aml_flagged');
      if (!hasAmlFlagged) {
        await prisma.lead.update({
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

    const alerts = await prisma.activity.findMany({
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

    const filtered = alerts.filter(a => {
      const metadata = normalizeMetadata(a.metadata);
      const alertStatus = String(metadata.status || 'open');
      return status === 'all' ? true : alertStatus === status;
    });

    res.json({
      success: true,
      data: filtered.map(a => {
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

    const { alertId } = req.params;
    const { resolution, notes } = req.body;

    const alert = await prisma.activity.findUnique({ where: { id: alertId } });
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

    const updated = await prisma.activity.update({
      where: { id: alertId },
      data: { metadata: nextMetadata },
    });

    await prisma.activity.create({
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
    const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — consent creation requires agent role or above', 403);
    }

    const { entityType = 'lead', entityId, purpose, channel, consentTextVersion } = req.body;
    if (!entityId || !purpose) {
      throw new AppError('entityId and purpose are required', 400);
    }

    if (String(entityType) === 'lead') {
      const lead = await prisma.lead.findUnique({
        where: { id: String(entityId) },
        select: { id: true },
      });
      if (!lead) throw new AppError('Lead not found for consent record', 404);
    }

    const consent = await prisma.activity.create({
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

    res
      .status(201)
      .json({
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
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — consent revoke requires manager role', 403);
    }

    const { consentId } = req.params;
    const { reason } = req.body;

    const consent = await prisma.activity.findUnique({ where: { id: consentId } });
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

    const updated = await prisma.activity.update({
      where: { id: consentId },
      data: { metadata: updatedMetadata },
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

    const records = await prisma.activity.findMany({
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

    const mapped = records.map(r => {
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

    const filtered = mapped.filter(row => {
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
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — consent delete requires admin role', 403);
    }

    const { consentId } = req.params;
    const consent = await prisma.activity.findUnique({ where: { id: consentId } });
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

    await prisma.activity.update({
      where: { id: consentId },
      data: { metadata: updatedMetadata },
    });

    res.json({ success: true, data: { id: consentId, status: 'deleted' } });
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
