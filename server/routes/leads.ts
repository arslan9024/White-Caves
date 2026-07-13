/**
 * Leads API Routes — Full CRUD Implementation
 * Endpoints: /api/leads
 * Supports: search, filter, pagination, bulk operations, analytics
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router, Request, Response } from 'express';
type RouteRequest = Request<Record<string, string>>;
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { getSocketServer } from '../services/socketServer.js';
import { notificationService } from '../services/NotificationService.js';

// Unified lead status enum — single source of truth for all lead endpoints
const VALID_LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'viewing',
  'offered',
  'negotiating',
  'won',
  'lost',
] as const;
const VALID_LEAD_SOURCES = [
  'direct',
  'website',
  'referral',
  'social',
  'portal',
  'cold_call',
  'event',
  'other',
  // TASK-002 / Phase 27: anonymous homepage search leads (no auth required)
  'homepage_search',
] as const;
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { parsePagination } from '../config/pagination.js';
import { requirePermission, requireRole, scopeToOwn, requireMinRole } from '../middleware/rbac.js';
import {
  scoreLead,
  overrideScore,
  batchRescoreLeads,
  getScoreHistory,
  getScoreTrending,
  applyWhatsAppSignal,
} from '../services/ai/leadScoringEngine.js';
import {
  getRoutingRules,
  getAgentPerformance,
  autoRouteHotLead,
} from '../services/ai/leadAutoRouter.js';
import { triggerLeadRescore } from '../services/ai/leadAutoRescore.js';
import {
  LEAD_SLA_HOURS,
  buildLeadTaskCockpit,
  buildLeadTimeline,
} from '../services/leadWorkflowService.js';
import multer from 'multer';
import * as XLSX from 'xlsx';

const router = Router();

// ── Multer: memory storage for CSV/XLSX import ───────────────────────
const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.csv') ||
      file.originalname.endsWith('.xlsx');
    cb(null, ok);
  },
});

interface BulkImportLeadInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: string | null;
  source?: string | null;
  budget?: number | string | null;
  score?: number | null;
  notes?: string | null;
  tags?: string[] | null;
}

interface BulkImportRowError {
  row: number;
  code:
    | 'missing_name'
    | 'invalid_email'
    | 'invalid_phone'
    | 'duplicate_in_batch'
    | 'duplicate_existing';
  message: string;
}

interface PreparedBulkLead {
  row: number;
  data: {
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
    source: string;
    budget: number | null;
    score: number;
    notes: string | null;
    tags: string[];
  };
}

const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

const normalizeJsonRecord = (
  value: Prisma.JsonValue | null | undefined
): Record<string, unknown> | null => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
};

// ─── GET /api/leads ─────────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_leads'),
  scopeToOwn('assignedToId'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const {
      status,
      source,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minScore,
      maxScore,
      assignedTo,
    } = req.query as Record<string, string | undefined>;

    const {
      page: pageNum,
      limit,
      skip,
    } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    // Build where clause
    const where: Prisma.LeadWhereInput = {};

    if (
      status &&
      status !== 'all' &&
      !VALID_LEAD_STATUSES.includes(status as (typeof VALID_LEAD_STATUSES)[number])
    ) {
      throw new AppError(`Invalid status filter: ${String(status)}`, 422);
    }
    if (
      source &&
      source !== 'all' &&
      !VALID_LEAD_SOURCES.includes(source as (typeof VALID_LEAD_SOURCES)[number])
    ) {
      throw new AppError(`Invalid source filter: ${String(source)}`, 422);
    }

    if (status && status !== 'all') {
      where.status = status as string;
    }
    if (source && source !== 'all') {
      where.source = source as string;
    }
    if (assignedTo) {
      where.assignedToId = assignedTo as string;
    }
    // Row-level security: agents only see their own assigned leads.
    // scopeToOwn('assignedToId') sets req.ownershipFilter to { assignedToId: userId }
    // for non-supervisor roles; supervisors get {} (no restriction).
    // For agents, Object.assign overwrites any caller-supplied ?assignedTo param
    // so they cannot query other agents' leads.
    const ownerFilter = req.ownershipFilter ?? {};
    if (Object.keys(ownerFilter).length > 0) {
      Object.assign(where, ownerFilter);
    }
    if (minScore || maxScore) {
      where.score = {};
      if (minScore) {
        const parsed = parseInt(minScore as string, 10);
        if (!isNaN(parsed)) where.score.gte = parsed;
      }
      if (maxScore) {
        const parsed = parseInt(maxScore as string, 10);
        if (!isNaN(parsed)) where.score.lte = parsed;
      }
    }
    if (search) {
      const s = sanitizeString(String(search)).trim().slice(0, 120);
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { company: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const validSortFields = ['createdAt', 'updatedAt', 'name', 'status', 'score', 'budget'];
    const field = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: Prisma.LeadOrderByWithRelationInput = {
      [field]: sortOrder === 'asc' ? 'asc' : 'desc',
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
          property: { select: { id: true, title: true, location: true } },
          _count: { select: { activities: true } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

// ─── GET /api/leads/stats ───────────────────────────────────────────────
router.get(
  '/stats',
  requirePermission('view_leads'),
  requireMinRole('manager'),
  asyncHandler(async (_req: RouteRequest, res: Response) => {
    const [total, byStatus, bySource, avgScore] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
      prisma.lead.aggregate({ _avg: { score: true, budget: true } }),
    ]);

    const statusCounts: Record<string, number> = {};
    byStatus.forEach(s => {
      statusCounts[s.status] = s._count._all;
    });

    const sourceCounts: Record<string, number> = {};
    bySource.forEach(s => {
      sourceCounts[s.source] = s._count._all;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusCounts,
        bySource: sourceCounts,
        averageScore: Math.round(avgScore._avg.score || 0),
        averageBudget: Math.round(avgScore._avg.budget || 0),
      },
    });
  })
);

// ─── GET /api/leads/analytics/conversion ────────────────────────────────
router.get(
  '/analytics/conversion',
  requirePermission('view_leads'),
  requireMinRole('manager'),
  asyncHandler(async (_req: RouteRequest, res: Response) => {
    const [total, won, lost] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'won' } }),
      prisma.lead.count({ where: { status: 'lost' } }),
    ]);

    const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
    const lossRate = total > 0 ? Math.round((lost / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: { total, won, lost, active: total - won - lost, conversionRate, lossRate },
    });
  })
);

// ─── GET /api/leads/sla-breaches ─────────────────────────────────────────
// Task 3: Returns all leads that have breached the 4-hour first-response SLA.
// Schema has no slaDeadline field; we derive breach from createdAt + 4h proxy.
// MUST be registered before /:id to avoid route shadowing.
const SLA_HOURS = LEAD_SLA_HOURS;
const SLA_MS = SLA_HOURS * 60 * 60 * 1000;

router.get(
  '/sla-breaches',
  requirePermission('view_leads'),
  requireMinRole('manager'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { page = '1', pageSize = '50' } = req.query as Record<string, string | undefined>;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 50));
    const skip = (pageNum - 1) * limit;

    // A lead has breached SLA if it is still in an uncontacted state and was created > 4h ago
    const slaThreshold = new Date(Date.now() - SLA_MS);

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: {
          status: { in: ['new', 'contacted'] },
          createdAt: { lt: slaThreshold },
        },
        orderBy: { createdAt: 'asc' }, // oldest breach first
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          source: true,
          score: true,
          createdAt: true,
          assignedToId: true,
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.lead.count({
        where: {
          status: { in: ['new', 'contacted'] },
          createdAt: { lt: slaThreshold },
        },
      }),
    ]);

    // Compute how long each lead has been in breach
    const now = Date.now();
    const enriched = leads.map(lead => ({
      ...lead,
      slaBreachHours: Math.round(((now - lead.createdAt.getTime()) / (1000 * 60 * 60)) * 10) / 10,
    }));

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: {
        page: pageNum,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      meta: { slaHours: SLA_HOURS },
    });
  })
);

// ─── GET /api/leads/task-cockpit ──────────────────────────────────────────
router.get(
  '/task-cockpit',
  requirePermission('view_leads'),
  scopeToOwn('assignedToId'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const ownerFilter = req.ownershipFilter ?? {};
    const leads = await prisma.lead.findMany({
      where: {
        status: { in: ['new', 'contacted', 'qualified', 'viewing'] },
        ...(ownerFilter as Prisma.LeadWhereInput),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        status: true,
        source: true,
        score: true,
        createdAt: true,
        lastContact: true,
        assignedToId: true,
        createdById: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true } },
      },
      take: 100,
      orderBy: [{ createdAt: 'desc' }],
    });

    res.status(200).json({
      success: true,
      data: buildLeadTaskCockpit(leads),
    });
  })
);

// ─── GET /api/leads/:id ─────────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = routeParamToString(req.params.id);
    if (!leadId) {
      throw new AppError('Lead ID is required', 400);
    }

    validateIdParam(leadId, 'Lead ID');
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true, phone: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        property: {
          select: { id: true, title: true, type: true, status: true, price: true, location: true },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { user: { select: { id: true, name: true } } },
        },
        commissions: {
          select: { id: true, amount: true, status: true, percentage: true, createdAt: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) throw new AppError('Lead not found', 404);

    res.status(200).json({ success: true, data: lead });
  })
);

// ─── GET /api/leads/:id/timeline ──────────────────────────────────────────
router.get(
  '/:id/timeline',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Lead ID');

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        source: true,
        score: true,
        createdAt: true,
        lastContact: true,
        assignedToId: true,
        createdById: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true } },
      },
    });

    if (!lead) throw new AppError('Lead not found', 404);

    const [activities, viewings] = await Promise.all([
      prisma.activity.findMany({
        where: { leadId: id },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true } } },
        take: 100,
      }),
      prisma.viewing.findMany({
        where: { leadId: id },
        orderBy: { scheduledAt: 'desc' },
        include: {
          property: { select: { title: true, location: true } },
          agent: { select: { id: true, name: true } },
        },
        take: 50,
      }),
    ]);

    const normalizedActivities = activities.map(activity => ({
      ...activity,
      metadata: normalizeJsonRecord(activity.metadata),
    }));

    res.status(200).json({
      success: true,
      data: buildLeadTimeline({ lead, activities: normalizedActivities, viewings }),
    });
  })
);

// ─── POST /api/leads ────────────────────────────────────────────────────
router.post(
  '/',
  requirePermission('manage_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const {
      name,
      email,
      phone,
      company,
      status,
      source,
      budget,
      score,
      notes,
      tags,
      assignedToId,
      propertyId,
    } = req.body;

    validate(req.body, {
      name: rules.requiredStringWithMax('Lead name', 255),
      email: rules.optionalEmail('Email'),
      phone: rules.optionalStringWithMax('Phone', 50),
      company: rules.optionalStringWithMax('Company', 255),
      status: rules.oneOf('Status', [...VALID_LEAD_STATUSES]),
      source: rules.oneOf('Source', [...VALID_LEAD_SOURCES]),
      budget: rules.optionalPositiveNumber('Budget'),
      assignedToId: rules.optionalMongoId('Assigned agent ID'),
      propertyId: rules.optionalMongoId('Property ID'),
      tags: rules.optionalArray('Tags'),
      notes: rules.optionalStringWithMax('Notes', 5000),
    });

    const lead = await prisma.lead.create({
      data: {
        name: sanitizeString(name.trim()),
        email: email?.trim()?.toLowerCase() || null,
        phone: phone?.trim() || null,
        company: company ? sanitizeString(company.trim()) : null,
        status: status || 'new',
        source: source || 'direct',
        budget: budget ? parseFloat(budget) : null,
        score: score ? Math.max(0, Math.min(100, parseInt(String(score), 10) || 0)) : 0,
        notes: notes ? sanitizeString(notes) : null,
        tags: (tags || []).map((t: unknown) =>
          typeof t === 'string' ? sanitizeString(t) : String(t)
        ),
        assignedToId: assignedToId || null,
        createdById: req.user?.id || null,
        propertyId: propertyId || null,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    await prisma.activity.create({
      data: {
        type: 'lead',
        action: 'created',
        description: `New lead created: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
        userId: req.user?.id || null,
        leadId: lead.id,
      },
    });

    // Notify assigned agent via email (fire-and-forget, never blocks API success)
    const assignedAgent = lead.assignedTo as { name?: string; email?: string } | null;
    if (assignedAgent?.email) {
      try {
        const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../services/emailService.js');
        const template = EMAIL_TEMPLATES.leadAssigned(
          assignedAgent.name || 'Agent',
          lead.name,
          lead.email || '',
          lead.source || 'direct'
        );
        sendEmailTracked({
          to: assignedAgent.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          tags: [{ name: 'type', value: 'lead_assigned' }],
        }).catch(err => console.error('[email] leadAssigned send failed:', err));
      } catch (err) {
        console.error('[email] leadAssigned import failed:', err);
      }
    }

    if (lead.assignedToId) {
      await notificationService.pushToUser({
        userId: lead.assignedToId,
        type: 'lead',
        title: 'New lead assigned',
        message: `${lead.name} was assigned to you`,
        metadata: { leadId: lead.id, source: lead.source },
      });
    }

    // W14-001: Auto-rescore on lead creation
    triggerLeadRescore(lead.id, 'lead_created');

    // Task 3: Attempt to stamp an SLA deadline on the lead.
    // The schema has no slaDeadline field; this is a graceful best-effort update
    // that will silently no-op if the field is absent (e.g. during schema migration).
    try {
      const slaDeadlineMs = Date.now() + SLA_MS;
      await (prisma.lead as any).update({
        where: { id: lead.id },
        data: { slaDeadline: new Date(slaDeadlineMs) },
      });
    } catch {
      // Field not yet in schema — non-fatal, gracefully degrade
    }

    res.status(201).json({ success: true, data: lead });
  })
);

// ─── PATCH /api/leads/:id ───────────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Lead ID');
    const {
      name,
      email,
      phone,
      company,
      status,
      source,
      budget,
      score,
      notes,
      tags,
      assignedToId,
      propertyId,
    } = req.body;

    validate(req.body, {
      name: rules.optionalStringWithMax('Lead name', 255),
      email: rules.optionalEmail('Email'),
      phone: rules.optionalStringWithMax('Phone', 50),
      company: rules.optionalStringWithMax('Company', 255),
      notes: rules.optionalStringWithMax('Notes', 5000),
      status: rules.oneOf('Status', [...VALID_LEAD_STATUSES]),
      source: rules.oneOf('Source', [...VALID_LEAD_SOURCES]),
      budget: rules.optionalPositiveNumber('Budget'),
      assignedToId: rules.optionalMongoId('Assigned agent ID'),
      propertyId: rules.optionalMongoId('Property ID'),
      tags: rules.optionalArray('Tags'),
    });

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lead not found', 404);

    // AUTHORIZATION: Only admins, managers, or lead creator can update
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    const isLeadCreator = existing.createdById === req.user?.id;
    if (!isAdmin && !isLeadCreator) {
      throw new AppError('You do not have permission to update this lead', 403);
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = sanitizeString(String(name).trim());
    if (email !== undefined) data.email = email ? String(email).trim().toLowerCase() : null;
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
    if (company !== undefined)
      data.company = company ? sanitizeString(String(company).trim()) : null;
    if (status !== undefined) data.status = status;
    if (source !== undefined) data.source = source;
    if (budget !== undefined) data.budget = budget ? parseFloat(budget) : null;
    if (score !== undefined) {
      const parsed = parseInt(score as string, 10);
      data.score = !isNaN(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
    }
    if (notes !== undefined) data.notes = notes ? sanitizeString(notes) : null;
    if (tags !== undefined)
      data.tags = Array.isArray(tags)
        ? tags.map((t: unknown) => (typeof t === 'string' ? sanitizeString(t) : String(t)))
        : [];
    if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
    if (propertyId !== undefined) data.propertyId = propertyId || null;

    const statusChanged = status !== undefined && status !== null && status !== existing.status;

    const lead = await prisma.lead.update({
      where: { id },
      data,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    await prisma.activity.create({
      data: {
        type: 'lead',
        action: statusChanged ? 'status_changed' : 'updated',
        description: statusChanged
          ? `Lead "${lead.name}" status: ${existing.status} → ${status}`
          : `Lead "${lead.name}" updated`,
        userId: req.user?.id || null,
        leadId: lead.id,
        metadata: statusChanged ? { oldStatus: existing.status, newStatus: status } : undefined,
      },
    });

    // Emit real-time lead:updated event to all CRM users (non-blocking)
    try {
      (getSocketServer() as any)?.emitLeadUpdated({
        leadId: lead.id,
        status: lead.status,
        assignedTo: lead.assignedTo?.id,
        score: lead.score ?? undefined,
        updatedBy: req.user?.id,
      });
    } catch (err) {
      console.error('Socket emit lead:updated failed:', err);
    }

    // W14-001: Auto-rescore on lead updates and status lifecycle changes
    triggerLeadRescore(lead.id, statusChanged ? 'lead_status_changed' : 'lead_updated');

    if (lead.assignedToId && statusChanged) {
      await notificationService.pushToUser({
        userId: lead.assignedToId,
        type: 'lead',
        title: 'Lead status updated',
        message: `${lead.name} moved to ${lead.status}`,
        metadata: { leadId: lead.id, oldStatus: existing.status, newStatus: lead.status },
      });
    }

    res.status(200).json({ success: true, data: lead });
  })
);

// ─── DELETE /api/leads/:id ──────────────────────────────────────────────
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Lead ID');

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lead not found', 404);

    // AUTHORIZATION: Only admins, managers, or lead creator can delete
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    const isLeadCreator = existing.createdById === req.user?.id;
    if (!isAdmin && !isLeadCreator) {
      throw new AppError('You do not have permission to delete this lead', 403);
    }

    await prisma.$transaction(async tx => {
      // Clean up references to avoid orphaned records
      await tx.commission.updateMany({ where: { leadId: id }, data: { leadId: null } });
      await tx.activity.deleteMany({ where: { leadId: id } });
      await tx.lead.delete({ where: { id } });

      await tx.activity.create({
        data: {
          type: 'lead',
          action: 'deleted',
          description: `Lead deleted: ${existing.name} (by ${req.user?.email})`,
          userId: req.user?.id || null,
        },
      });
    });

    res.status(200).json({ success: true, message: `Lead "${existing.name}" deleted` });
  })
);

// ─── POST /api/leads/:id/activities ─────────────────────────────────────
router.post(
  '/:id/activities',
  requirePermission('manage_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Lead ID');
    const { type, action, description } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new AppError('Lead not found', 404);

    // AUTHORIZATION: Only the assigned agent, creator, or managers can add activities
    const userRole = req.user?.role || '';
    const userId = req.user?.id || '';
    const isManagerOrAbove = ['owner', 'manager', 'admin'].includes(userRole);
    if (!isManagerOrAbove && lead.assignedToId !== userId && lead.createdById !== userId) {
      throw new AppError('Access denied — you can only add activities to your own leads', 403);
    }

    // Validate type and action against known enums
    const VALID_TYPES = ['lead', 'property', 'deal', 'commission', 'agent', 'client', 'system'];
    const VALID_ACTIONS = [
      'created',
      'updated',
      'deleted',
      'status_changed',
      'note_added',
      'call',
      'email',
      'visit',
    ];
    const resolvedType = VALID_TYPES.includes(type) ? type : 'lead';
    const resolvedAction = VALID_ACTIONS.includes(action) ? action : 'note_added';
    const sanitizedDesc = sanitizeString((description || 'Activity logged').substring(0, 2000));

    const activity = await prisma.activity.create({
      data: {
        type: resolvedType,
        action: resolvedAction,
        description: sanitizedDesc,
        userId: req.user?.id || null,
        leadId: id,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    await prisma.lead.update({ where: { id }, data: { lastContact: new Date() } });
    triggerLeadRescore(id, 'lead_activity_logged');

    res.status(201).json({ success: true, data: activity });
  })
);

// ─── GET /api/leads/:id/activities ──────────────────────────────────────
router.get(
  '/:id/activities',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = routeParamToString(req.params.id);
    if (!leadId) {
      throw new AppError('Lead ID is required', 400);
    }

    validateIdParam(leadId, 'Lead ID');
    const { page = '1', pageSize = '20' } = req.query as Record<string, string | undefined>;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(pageSize as string) || 20));

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: { leadId },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.activity.count({ where: { leadId } }),
    ]);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── POST /api/leads/import/file ────────────────────────────────────────────
// Accepts multipart CSV or XLSX upload.  Parses, validates, deduplicates by
// email or phone against existing leads, and bulk-inserts new rows.
// Returns: { imported, duplicates, errors: [{ row, field, message }] }
router.post(
  '/import/file',
  requirePermission('manage_leads'),
  importUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError('No file uploaded', 400);

    // ── Parse file into rows ────────────────────────────────────────
    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(ws, {
      defval: null,
    });

    if (rawRows.length === 0) throw new AppError('File contains no data rows', 400);
    if (rawRows.length > 500) throw new AppError('Maximum 500 rows per import', 400);

    // ── Field-map each row (support flexible column names) ──────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

    const perRowErrors: { row: number; field: string; message: string }[] = [];
    const candidates: {
      name: string;
      email: string | null;
      phone: string | null;
      company: string | null;
      status: string;
      source: string;
      budget: number | null;
      score: number;
      notes: string | null;
      tags: string[];
    }[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      const r = rawRows[i];
      const rowNum = i + 2; // 1-based + header row

      // Accept both "Name" and "name" variants
      const get = (...keys: string[]): string | null => {
        for (const k of keys) {
          const v = r[k] ?? r[k.toLowerCase()] ?? r[k.toUpperCase()];
          if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
        }
        return null;
      };

      const name = get('name', 'Name', 'Full Name', 'full_name');
      if (!name) {
        perRowErrors.push({ row: rowNum, field: 'name', message: 'Name is required' });
        continue;
      }

      const emailRaw = get('email', 'Email', 'email_address');
      const email =
        emailRaw && emailRegex.test(emailRaw) ? emailRaw.toLowerCase().slice(0, 254) : null;
      if (emailRaw && !email) {
        perRowErrors.push({ row: rowNum, field: 'email', message: `Invalid email: ${emailRaw}` });
      }

      const phoneRaw = get('phone', 'Phone', 'mobile', 'Mobile', 'phone_number');
      const phone = phoneRaw && phoneRegex.test(phoneRaw) ? phoneRaw.slice(0, 20) : null;
      if (phoneRaw && !phone) {
        perRowErrors.push({ row: rowNum, field: 'phone', message: `Invalid phone: ${phoneRaw}` });
      }

      const statusRaw = get('status', 'Status') ?? 'new';
      const status = VALID_LEAD_STATUSES.includes(statusRaw as (typeof VALID_LEAD_STATUSES)[number])
        ? statusRaw
        : 'new';

      const budgetRaw = get('budget', 'Budget');
      const budget = budgetRaw ? parseFloat(budgetRaw) || null : null;

      const scoreRaw = get('score', 'Score');
      const score = scoreRaw
        ? Math.min(100, Math.max(0, Math.round(parseFloat(scoreRaw) || 0)))
        : 0;

      candidates.push({
        name: sanitizeString(name.slice(0, 200)),
        email,
        phone,
        company: sanitizeString((get('company', 'Company') ?? '').slice(0, 200)) || null,
        status,
        source: sanitizeString((get('source', 'Source') ?? 'import').slice(0, 100)),
        budget,
        score,
        notes: sanitizeString((get('notes', 'Notes') ?? '').slice(0, 5000)) || null,
        tags: [],
      });
    }

    // ── Deduplication ───────────────────────────────────────────────
    const candidateEmails = candidates.map(c => c.email).filter(Boolean) as string[];
    const candidatePhones = candidates.map(c => c.phone).filter(Boolean) as string[];

    const existing = await prisma.lead.findMany({
      where: {
        OR: [
          ...(candidateEmails.length ? [{ email: { in: candidateEmails } }] : []),
          ...(candidatePhones.length ? [{ phone: { in: candidatePhones } }] : []),
        ],
      },
      select: { email: true, phone: true },
    });

    const existingEmails = new Set(existing.map(e => e.email).filter(Boolean));
    const existingPhones = new Set(existing.map(e => e.phone).filter(Boolean));

    const toInsert = candidates.filter(
      c => !(c.email && existingEmails.has(c.email)) && !(c.phone && existingPhones.has(c.phone))
    );
    const duplicates = candidates.length - toInsert.length;

    // ── Insert ──────────────────────────────────────────────────────
    const result = toInsert.length
      ? await prisma.lead.createMany({ data: toInsert })
      : { count: 0 };

    res.status(201).json({
      success: true,
      data: {
        imported: result.count,
        duplicates,
        errors: perRowErrors,
        total: rawRows.length,
      },
    });
  })
);

// ─── POST /api/leads/bulk-import ────────────────────────────────────────
router.post(
  '/bulk-import',
  requirePermission('manage_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0)
      throw new AppError('Provide an array of leads', 400);
    if (leads.length > 500) throw new AppError('Maximum 500 leads per batch', 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

    const rowErrors: BulkImportRowError[] = [];
    const preparedRows: PreparedBulkLead[] = [];
    const batchEmailIndex = new Set<string>();
    const batchPhoneIndex = new Set<string>();

    for (let idx = 0; idx < leads.length; idx += 1) {
      const raw = leads[idx] as BulkImportLeadInput;
      const row = idx + 1;

      const cleanNameRaw = typeof raw.name === 'string' ? raw.name.trim() : '';
      const cleanName = sanitizeString(cleanNameRaw).slice(0, 200);

      if (!cleanName) {
        rowErrors.push({
          row,
          code: 'missing_name',
          message: 'Missing required field: name',
        });
        continue;
      }

      const normalizedEmail =
        typeof raw.email === 'string' && raw.email.trim().length > 0
          ? raw.email.trim().toLowerCase().slice(0, 254)
          : null;
      const normalizedPhone =
        typeof raw.phone === 'string' && raw.phone.trim().length > 0
          ? raw.phone.trim().slice(0, 20)
          : null;

      if (normalizedEmail && !emailRegex.test(normalizedEmail)) {
        rowErrors.push({
          row,
          code: 'invalid_email',
          message: `Invalid email format: ${normalizedEmail}`,
        });
        continue;
      }

      if (normalizedPhone && !phoneRegex.test(normalizedPhone)) {
        rowErrors.push({
          row,
          code: 'invalid_phone',
          message: `Invalid phone format: ${normalizedPhone}`,
        });
        continue;
      }

      const duplicateKey = normalizedEmail ?? normalizedPhone;
      if (duplicateKey) {
        const duplicateInBatch =
          (normalizedEmail && batchEmailIndex.has(normalizedEmail)) ||
          (normalizedPhone && batchPhoneIndex.has(normalizedPhone));
        if (duplicateInBatch) {
          rowErrors.push({
            row,
            code: 'duplicate_in_batch',
            message: 'Duplicate lead in this import batch (same email/phone)',
          });
          continue;
        }
      }

      if (normalizedEmail) batchEmailIndex.add(normalizedEmail);
      if (normalizedPhone) batchPhoneIndex.add(normalizedPhone);

      const sanitizedSource =
        typeof raw.source === 'string' ? sanitizeString(raw.source.trim().slice(0, 100)) : 'direct';

      preparedRows.push({
        row,
        data: {
          name: cleanName,
          email: normalizedEmail,
          phone: normalizedPhone,
          company:
            sanitizeString(
              (typeof raw.company === 'string' ? raw.company.trim() : '').slice(0, 200)
            ) || null,
          status:
            typeof raw.status === 'string' &&
            VALID_LEAD_STATUSES.includes(raw.status as (typeof VALID_LEAD_STATUSES)[number])
              ? raw.status
              : 'new',
          source: sanitizedSource.length > 0 ? sanitizedSource : 'direct',
          budget:
            typeof raw.budget === 'number'
              ? raw.budget
              : typeof raw.budget === 'string'
                ? parseFloat(raw.budget) || null
                : null,
          score:
            typeof raw.score === 'number' ? Math.min(Math.max(Math.round(raw.score), 0), 100) : 0,
          notes:
            sanitizeString((typeof raw.notes === 'string' ? raw.notes : '').slice(0, 5000)) || null,
          tags: Array.isArray(raw.tags)
            ? raw.tags
                .slice(0, 20)
                .map(t => String(t).slice(0, 50))
                .filter(Boolean)
            : [],
        },
      });
    }

    const incomingEmails = preparedRows
      .map(row => row.data.email)
      .filter((value): value is string => Boolean(value));
    const incomingPhones = preparedRows
      .map(row => row.data.phone)
      .filter((value): value is string => Boolean(value));

    const existing =
      incomingEmails.length > 0 || incomingPhones.length > 0
        ? await prisma.lead.findMany({
            where: {
              OR: [
                ...(incomingEmails.length > 0 ? [{ email: { in: incomingEmails } }] : []),
                ...(incomingPhones.length > 0 ? [{ phone: { in: incomingPhones } }] : []),
              ],
            },
            select: { email: true, phone: true },
          })
        : [];

    const existingEmails = new Set(
      existing
        .map(item => item.email)
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .map(value => value.toLowerCase())
    );
    const existingPhones = new Set(
      existing
        .map(item => item.phone)
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
    );

    const importableRows: PreparedBulkLead[] = [];
    for (const row of preparedRows) {
      const isDuplicateExisting =
        (row.data.email ? existingEmails.has(row.data.email.toLowerCase()) : false) ||
        (row.data.phone ? existingPhones.has(row.data.phone) : false);

      if (isDuplicateExisting) {
        rowErrors.push({
          row: row.row,
          code: 'duplicate_existing',
          message: 'Lead already exists (matching email/phone)',
        });
        continue;
      }

      importableRows.push(row);
    }

    const results =
      importableRows.length > 0
        ? await prisma.lead.createMany({
            data: importableRows.map(row => row.data),
          })
        : { count: 0 };

    res.status(201).json({
      success: true,
      data: {
        imported: results.count,
        total: leads.length,
        skipped: leads.length - results.count,
        errors: rowErrors.sort((a, b) => a.row - b.row),
      },
    });
  })
);

// ─── GET /api/leads/scored ──────────────────────────────────────────────
// Get all leads with scores, sorted by score descending (for LeadScoringModule)
router.get(
  '/scored',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const {
      tier,
      minScore,
      maxScore,
      page = '1',
      pageSize = '50',
    } = req.query as Record<string, string | undefined>;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

    const where: Record<string, unknown> = {
      score: { gt: 0 },
    };

    if (tier && typeof tier === 'string') {
      where.scoreTier = tier;
    }
    if (minScore || maxScore) {
      const scoreFilter: Record<string, number> = { gt: 0 };
      if (minScore) {
        const parsed = parseInt(minScore as string, 10);
        if (!isNaN(parsed)) scoreFilter.gte = parsed;
      }
      if (maxScore) {
        const parsed = parseInt(maxScore as string, 10);
        if (!isNaN(parsed)) scoreFilter.lte = parsed;
      }
      where.score = scoreFilter;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { score: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          score: true,
          scoreTier: true,
          scoreBreakdown: true,
          lastScoredAt: true,
          budget: true,
          budgetCurrency: true,
          source: true,
          status: true,
          email: true,
          phone: true,
          company: true,
          tags: true,
          lastContact: true,
          createdAt: true,
          assignedTo: { select: { id: true, name: true } },
          property: { select: { id: true, title: true, type: true } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    // Add tier distribution
    const [hotCount, warmCount, coldCount, inactiveCount] = await Promise.all([
      prisma.lead.count({ where: { scoreTier: 'hot', score: { gt: 0 } } }),
      prisma.lead.count({ where: { scoreTier: 'warm', score: { gt: 0 } } }),
      prisma.lead.count({ where: { scoreTier: 'cold', score: { gt: 0 } } }),
      prisma.lead.count({ where: { scoreTier: 'inactive', score: { gt: 0 } } }),
    ]);

    res.status(200).json({
      success: true,
      leads: leads.map(l => ({
        id: l.id,
        name: l.name,
        score: l.score,
        tier: l.scoreTier,
        budget: l.budget ? `${l.budgetCurrency} ${l.budget.toLocaleString()}` : 'N/A',
        interest: l.property?.title || 'General',
        source: l.source,
        assignedAgent: l.assignedTo?.name || 'Unassigned',
        email: l.email,
        phone: l.phone,
        company: l.company,
        tags: l.tags,
        lastContact: l.lastContact,
        lastScoredAt: l.lastScoredAt,
        breakdown: l.scoreBreakdown,
      })),
      distribution: { hot: hotCount, warm: warmCount, cold: coldCount, inactive: inactiveCount },
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/leads/routing-rules ───────────────────────────────────────
// Get AI-generated routing rules based on agent performance
router.get(
  '/routing-rules',
  requirePermission('view_leads'),
  asyncHandler(async (_req: RouteRequest, res: Response) => {
    const rules = await getRoutingRules();
    const agents = await getAgentPerformance();

    res.status(200).json({
      success: true,
      rules,
      agents: agents.map(a => ({
        id: a.agentId,
        name: a.agentName,
        conversionRate: a.conversionRate,
        currentLoad: a.currentLoad,
        totalLeads: a.totalLeads,
        specializations: a.specializations,
      })),
    });
  })
);

// ─── GET /api/leads/trending ────────────────────────────────────────────
// Get warming/cooling lead trends
router.get(
  '/trending',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { days = '7', minChange = '10' } = req.query as Record<string, string | undefined>;

    const trends = await getScoreTrending({
      days: parseInt(days as string) || 7,
      minChange: parseInt(minChange as string) || 10,
    });

    const warming = trends.filter(t => t.direction === 'warming');
    const cooling = trends.filter(t => t.direction === 'cooling');

    res.status(200).json({
      success: true,
      data: {
        trends,
        summary: {
          warming: warming.length,
          cooling: cooling.length,
          total: trends.length,
        },
      },
    });
  })
);

// ─── POST /api/leads/:id/auto-route ────────────────────────────────────
// Manually trigger auto-routing for a lead
router.post(
  '/:id/auto-route',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = routeParamToString(req.params.id);
    if (!leadId) {
      throw new AppError('Lead ID is required', 400);
    }

    validateIdParam(leadId, 'Lead ID');
    const decision = await autoRouteHotLead(leadId);

    if (!decision) {
      res.status(200).json({
        success: true,
        data: null,
        message: 'Lead already assigned or no agents available',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: decision,
    });
  })
);

// ─── GET /api/leads/:id/score ───────────────────────────────────────────
// Score/re-score a single lead and return full breakdown
router.get(
  '/:id/score',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = routeParamToString(req.params.id);
    if (!leadId) {
      throw new AppError('Lead ID is required', 400);
    }

    validateIdParam(leadId, 'Lead ID');
    const result = await scoreLead(leadId);

    res.status(200).json({
      success: true,
      data: {
        leadId: result.leadId,
        score: result.newScore,
        previousScore: result.previousScore,
        tier: result.breakdown.tier,
        previousTier: result.previousTier,
        changed: result.changed,
        breakdown: {
          engagement: result.breakdown.engagement,
          demographic: result.breakdown.demographic,
          behavioral: result.breakdown.behavioral,
          source: result.breakdown.source,
        },
        factors: result.breakdown.factors,
        lastScoredAt: result.breakdown.lastScoredAt,
      },
    });
  })
);

// ─── POST /api/leads/:id/score/override ─────────────────────────────────
// Manual score override with justification
router.post(
  '/:id/score/override',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = routeParamToString(req.params.id);
    if (!leadId) {
      throw new AppError('Lead ID is required', 400);
    }

    validateIdParam(leadId, 'Lead ID');
    const { score, reason } = req.body;

    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new AppError('Score must be a number between 0 and 100', 400);
    }
    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      throw new AppError('Please provide a reason for the score override (min 3 characters)', 400);
    }

    const result = await overrideScore(
      leadId,
      score,
      sanitizeString(reason.trim().slice(0, 500)),
      req.user?.id
    );

    res.status(200).json({
      success: true,
      data: {
        leadId: result.leadId,
        score: result.newScore,
        previousScore: result.previousScore,
        tier: result.breakdown.tier,
        changed: result.changed,
      },
    });
  })
);

// ─── POST /api/leads/batch-rescore ──────────────────────────────────────
// Trigger batch re-scoring of all active leads (managers+)
router.post(
  '/batch-rescore',
  requirePermission('manage_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Only managers can trigger batch re-scoring', 403);
    }

    const result = await batchRescoreLeads();

    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// ─── GET /api/leads/:id/score/history ───────────────────────────────────
// Get score history for trending/charts
router.get(
  '/:id/score/history',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = routeParamToString(req.params.id);
    if (!leadId) {
      throw new AppError('Lead ID is required', 400);
    }

    validateIdParam(leadId, 'Lead ID');
    const { limit = '50', days = '90' } = req.query as Record<string, string | undefined>;
    const history = await getScoreHistory(leadId, {
      limit: Math.min(200, parseInt(limit as string) || 50),
      days: Math.min(365, parseInt(days as string) || 90),
    });

    res.status(200).json({
      success: true,
      data: {
        leadId,
        history,
        count: history.length,
      },
    });
  })
);

// ─── POST /api/leads/:id/score/whatsapp ─────────────────────────────────
// Apply WhatsApp conversation signals to lead score
router.post(
  '/:id/score/whatsapp',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = routeParamToString(req.params.id);
    if (!leadId) {
      throw new AppError('Lead ID is required', 400);
    }

    validateIdParam(leadId, 'Lead ID');
    const { intentScore, sentimentScore, engagementScore, responseTimeScore, conversationScore } =
      req.body;
    const result = await applyWhatsAppSignal(leadId, {
      intentScore: typeof intentScore === 'number' ? intentScore : undefined,
      sentimentScore: typeof sentimentScore === 'number' ? sentimentScore : undefined,
      engagementScore: typeof engagementScore === 'number' ? engagementScore : undefined,
      responseTimeScore: typeof responseTimeScore === 'number' ? responseTimeScore : undefined,
      conversationScore: typeof conversationScore === 'number' ? conversationScore : undefined,
    });

    res.status(200).json({
      success: true,
      data: {
        leadId: result.leadId,
        score: result.newScore,
        previousScore: result.previousScore,
        tier: result.newTier,
        changed: result.changed,
      },
    });
  })
);

// ─── GET /api/leads/agent-performance ───────────────────────────────────
// Get agent performance metrics for routing dashboard
router.get(
  '/agent-performance',
  requirePermission('view_analytics'),
  asyncHandler(async (_req: RouteRequest, res: Response) => {
    const agents = await getAgentPerformance();
    res.status(200).json({ success: true, data: agents });
  })
);

// ─── POST /api/leads/from-search ──────────────────────────────────────────────
// TASK-006 / Phase 27: Create a lead from an anonymous homepage property search.
// PUBLIC endpoint (no auth required). Anonymous visitors trigger this on every
// "Find Now" click so CRM can track intent and follow up.
//
// Security: No auth middleware — rate-limiting applied globally in server/index.ts
// TASK-007: Rate-limit is applied globally via express-rate-limit in server/index.ts
// TASK-008: All string inputs sanitized with sanitizeString()
router.post(
  '/from-search',
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { mode, location, propertyType, beds, minPrice, maxPrice, sessionId, searchedAt } =
      req.body as {
        mode?: string;
        location?: string;
        propertyType?: string;
        beds?: number;
        minPrice?: number;
        maxPrice?: number;
        sessionId?: string;
        searchedAt?: string;
      };

    // Validation
    if (!mode || !['buy', 'rent'].includes(mode)) {
      throw new AppError('Field "mode" must be "buy" or "rent"', 400);
    }

    // Sanitise string inputs
    const cleanLocation = location ? sanitizeString(location).slice(0, 200) : null;
    const cleanPropertyType = propertyType ? sanitizeString(propertyType).slice(0, 100) : null;
    const cleanSessionId = sessionId ? sanitizeString(sessionId).slice(0, 100) : null;

    // Build descriptive lead name
    const parts: string[] = [`${mode.toUpperCase()} search`];
    if (cleanLocation) parts.push(cleanLocation);
    if (cleanPropertyType) parts.push(cleanPropertyType);
    const bedsNum = typeof beds === 'number' && beds > 0 ? Math.ceil(beds) : 0;
    if (bedsNum > 0) parts.push(`${bedsNum}BR`);
    const leadName = `[Homepage] ${parts.join(' - ')}`;

    // Tags for quick CRM filtering
    const tags: string[] = ['homepage_search', mode];
    if (cleanLocation) tags.push(cleanLocation.toLowerCase().replace(/\s+/g, '_'));
    if (cleanPropertyType) tags.push(cleanPropertyType.toLowerCase().replace(/\s+/g, '_'));

    // Search params stored in notes for full traceability
    const searchSummary = JSON.stringify({
      mode,
      location: cleanLocation,
      propertyType: cleanPropertyType,
      beds: bedsNum || null,
      minPrice: typeof minPrice === 'number' ? minPrice : null,
      maxPrice: typeof maxPrice === 'number' ? maxPrice : null,
      sessionId: cleanSessionId,
      searchedAt: searchedAt ?? new Date().toISOString(),
    });

    // Persist lead
    const lead = await prisma.lead.create({
      data: {
        name: leadName,
        email: null,
        phone: null,
        source: 'homepage_search',
        status: 'new',
        stage: 'awareness',
        score: 10,
        tags,
        notes: `Auto-captured from homepage search:\n${searchSummary}`,
        budget: typeof maxPrice === 'number' && maxPrice > 0 ? maxPrice : null,
      } as any,
      select: {
        id: true,
        name: true,
        source: true,
        status: true,
        score: true,
        tags: true,
        createdAt: true,
      },
    });
    triggerLeadRescore(lead.id, 'homepage_search_lead_created');

    // Emit realtime update so CRM refreshes without polling
    try {
      const io = getSocketServer();
      if (io) {
        (io as any).to('crm').emit('lead:created', { source: 'homepage_search', leadId: lead.id });
      }
    } catch {
      // Socket server unavailable - non-fatal
    }

    res.status(201).json({ success: true, data: lead });
  })
);

// ─── POST /api/leads/bulk-action ──────────────────────────────────────────
// Task 2: Applies a status/assignment change to up to 100 leads atomically.
router.post(
  '/bulk-action',
  requirePermission('manage_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { ids, action, payload } = req.body as {
      ids: unknown;
      action: unknown;
      payload: unknown;
    };

    // ── Input validation ──────────────────────────────────────────────────
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError('ids must be a non-empty array', 400);
    }
    if (ids.length > 100) {
      throw new AppError('Bulk action is limited to 100 leads per request', 400);
    }

    const VALID_BULK_ACTIONS = ['assign', 'change-status', 'archive', 'set-reminder'] as const;
    type BulkAction = (typeof VALID_BULK_ACTIONS)[number];

    if (!VALID_BULK_ACTIONS.includes(action as BulkAction)) {
      throw new AppError(`Invalid action. Must be one of: ${VALID_BULK_ACTIONS.join(', ')}`, 400);
    }
    const typedAction = action as BulkAction;

    // ── RBAC: only manager+ can re-assign leads ────────────────────────────
    const userRole = req.user?.role ?? 'agent';
    const ROLE_WEIGHTS: Record<string, number> = { owner: 100, manager: 90, agent: 50, viewer: 10 };
    const roleWeight = ROLE_WEIGHTS[userRole] ?? 0;

    if (typedAction === 'assign' && roleWeight < ROLE_WEIGHTS['manager']) {
      throw new AppError('Only managers and above can bulk-assign leads', 403);
    }

    // ── Build update data ─────────────────────────────────────────────────
    const payloadObj =
      payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
    const payloadMetadata = JSON.parse(JSON.stringify(payloadObj)) as Prisma.InputJsonValue;
    const updateData: Record<string, unknown> = {};
    let activityDescription = '';

    if (typedAction === 'change-status') {
      const newStatus = payloadObj['status'];
      if (!newStatus || typeof newStatus !== 'string') {
        throw new AppError('payload.status is required for change-status action', 400);
      }
      updateData['status'] = newStatus;
      activityDescription = `Bulk status change → ${newStatus}`;
    } else if (typedAction === 'assign') {
      const assigneeId = payloadObj['assigneeId'];
      if (!assigneeId || typeof assigneeId !== 'string') {
        throw new AppError('payload.assigneeId is required for assign action', 400);
      }
      updateData['assignedToId'] = assigneeId;
      activityDescription = `Bulk assigned to agent ${assigneeId}`;
    } else if (typedAction === 'set-reminder') {
      const reminderAt = payloadObj['reminderAt'];
      if (
        !reminderAt ||
        typeof reminderAt !== 'string' ||
        Number.isNaN(new Date(reminderAt).getTime())
      ) {
        throw new AppError('payload.reminderAt is required for set-reminder action', 400);
      }
      activityDescription = `Bulk reminder scheduled for ${new Date(reminderAt).toISOString()}`;
    } else if (typedAction === 'archive') {
      updateData['status'] = 'archived';
      activityDescription = 'Bulk archived';
    }

    // ── Execute in transaction ─────────────────────────────────────────────
    const validIds = (ids as string[]).filter(id => typeof id === 'string' && id.length > 0);
    const activityMetadata: Prisma.InputJsonObject = {
      bulkAction: typedAction,
      payload: payloadObj as Prisma.InputJsonObject,
    };

    await prisma.$transaction(async tx => {
      if (Object.keys(updateData).length > 0) {
        await (tx.lead as any).updateMany({
          where: { id: { in: validIds } },
          data: updateData as any,
        });
      }

      for (const leadId of validIds) {
        await tx.activity.create({
          data: {
            type: 'lead',
            action: typedAction === 'set-reminder' ? 'reminder_set' : 'bulk_action',
            description: activityDescription,
            userId: req.user?.id ?? null,
            leadId,
            metadata: {
              bulkAction: typedAction,
              payload: payloadMetadata,
            } as Prisma.InputJsonValue,
          },
        });
      }
    });

    if (typedAction === 'assign' && typeof payloadObj['assigneeId'] === 'string') {
      await notificationService.pushToUser({
        userId: payloadObj['assigneeId'],
        type: 'lead',
        title: 'Bulk lead assignment',
        message: `${validIds.length} lead(s) were assigned to you.`,
        metadata: { leadIds: validIds, bulkAction: typedAction },
      });
    }

    res.status(200).json({
      success: true,
      message: `Bulk action '${typedAction}' applied to ${validIds.length} lead(s)`,
      affected: validIds.length,
    });
  })
);

// ─── POST /api/leads/:id/sla-nudge ────────────────────────────────────────
// Task 3: Sends a notification nudge to the assigned agent for a breached lead.
router.post(
  '/:id/sla-nudge',
  requirePermission('manage_leads'),
  requireMinRole('manager'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Lead ID');

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        assignedToId: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!lead) throw new AppError('Lead not found', 404);

    const breachMs = Date.now() - lead.createdAt.getTime();
    const breachHrs = Math.round((breachMs / (1000 * 60 * 60)) * 10) / 10;
    const isBreached = breachMs > SLA_MS;

    if (!isBreached) {
      throw new AppError(
        `Lead is within SLA window (${breachHrs}h elapsed, limit is ${SLA_HOURS}h)`,
        409
      );
    }

    const notifyUserId = lead.assignedToId ?? req.user?.id ?? null;
    if (notifyUserId) {
      await notificationService.pushToUser({
        userId: notifyUserId,
        type: 'lead',
        title: 'SLA Breach — Action Required',
        message: `Lead "${lead.name}" has been unresponded for ${breachHrs}h (SLA: ${SLA_HOURS}h). Please take action immediately.`,
        metadata: { leadId: id, breachHours: breachHrs, slaHours: SLA_HOURS },
      });
    }

    await prisma.activity.create({
      data: {
        type: 'lead',
        action: 'sla_nudge_sent',
        description: `SLA nudge sent for lead "${lead.name}" (${breachHrs}h in breach)`,
        userId: req.user?.id ?? null,
        leadId: id,
        metadata: { breachHours: breachHrs, notifiedUserId: notifyUserId },
      },
    });

    res.status(200).json({
      success: true,
      message: `SLA nudge sent for lead "${lead.name}"`,
      data: {
        leadId: id,
        breachHours: breachHrs,
        slaHours: SLA_HOURS,
        notifiedUserId: notifyUserId,
      },
    });
  })
);

// ─── GET /api/leads/analytics/funnel ────────────────────────────────────────
// P0-019: Period-aware funnel analytics for FunnelEconomicsDashboard
router.get(
  '/analytics/funnel',
  requirePermission('view_analytics'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const periodParam = String(req.query.period ?? '30d');
    const VALID_PERIODS = ['7d', '30d', '90d'] as const;
    type Period = (typeof VALID_PERIODS)[number];
    const period: Period = (VALID_PERIODS as readonly string[]).includes(periodParam)
      ? (periodParam as Period)
      : '30d';
    const daysMap: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[period];
    const since = new Date(Date.now() - days * 86400000);

    const STATUSES = ['new', 'contacted', 'qualified', 'viewing', 'offered', 'won'] as const;

    const counts = await Promise.all(
      STATUSES.map(s => prisma.lead.count({ where: { status: s, createdAt: { gte: since } } }))
    );
    const total = await prisma.lead.count({ where: { createdAt: { gte: since } } });

    const viewingLeadIds = await prisma.viewing.findMany({
      where: { createdAt: { gte: since } },
      select: { leadId: true },
      distinct: ['leadId'],
    });
    const viewingCount = viewingLeadIds.filter(v => v.leadId).length;

    const offerLeadIds = await prisma.offer.findMany({
      where: { createdAt: { gte: since } },
      select: { leadId: true },
      distinct: ['leadId'],
    });
    const offerCount = offerLeadIds.filter(o => o.leadId).length;

    const wonCount = counts[STATUSES.indexOf('won')];

    const viewingRate = total > 0 ? Math.round((viewingCount / total) * 1000) / 10 : 0;
    const offerRate = total > 0 ? Math.round((offerCount / total) * 1000) / 10 : 0;
    const wonRate = total > 0 ? Math.round((wonCount / total) * 1000) / 10 : 0;

    const stageLabels = ['New', 'Contacted', 'Qualified', 'Viewing Scheduled', 'Offer Made', 'Won'];
    const stages = stageLabels.map((label, i) => {
      const count = counts[i] ?? 0;
      const prev = i > 0 ? (counts[i - 1] ?? 0) : count;
      const dropOffPct = prev > 0 ? Math.round(((prev - count) / prev) * 100) : 0;
      return { stage: label, count, dropOffPct, avgDays: Math.round(i * 1.5 * 10) / 10 };
    });

    res.status(200).json({ totalLeads: total, viewingRate, offerRate, wonRate, stages });
  })
);

export default router;
