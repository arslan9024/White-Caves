/**
 * complianceOverviewController.ts
 * Handlers for compliance health status, requirements checklist, audit logs, reports, VAT summary, and queue aggregations.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import {
  calculateVATSummary,
  getComplianceOverview as fetchComplianceOverview,
} from '../../services/compliance/complianceService.js';
import {
  ensureComplianceManagerRole,
  normalizeMetadata,
} from './complianceCommon.js';

const db = prisma as any;

export async function getComplianceStatus(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — compliance data requires manager role', 403);
  }

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
        dataRetention: 100,
        privacyPolicy: 100,
      },
      lastAudit: new Date().toISOString(),
    },
  });
}

export async function getRequirements(req: Request, res: Response): Promise<void> {
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
}

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
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
      user: (l as any).user
        ? { id: (l as any).user.id, name: (l as any).user.name, role: (l as any).user.role }
        : null,
      timestamp: (l as any).createdAt?.toISOString
        ? (l as any).createdAt.toISOString()
        : new Date().toISOString(),
      metadata: l.metadata,
    })),
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function generateComplianceReport(req: Request, res: Response): Promise<void> {
  ensureComplianceManagerRole(
    req.user?.role,
    'Access denied — compliance report submission requires manager role or above'
  );

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
}

export async function getVatSummary(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — VAT data requires manager role', 403);
  }

  const fromDate = req.query.from ? new Date(req.query.from as string) : undefined;
  const toDate = req.query.to ? new Date(req.query.to as string) : undefined;

  const summary = await calculateVATSummary(fromDate, toDate);

  res.json({ success: true, data: summary });
}

export async function getQueuesOverview(req: Request, res: Response): Promise<void> {
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

  const pendingKyc = kycDocs.filter((d: { metadata: unknown }) => {
    const metadata = normalizeMetadata(d.metadata);
    return (metadata.reviewStatus || 'pending') === 'pending';
  });

  const openAml = amlAlerts.filter((a: { metadata: unknown }) => {
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
}

export async function getComplianceOverview(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — compliance overview requires manager role', 403);
  }

  const overview = await fetchComplianceOverview();

  res.json({ success: true, data: overview });
}
