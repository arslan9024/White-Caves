/**
 * Leads API Routes — Full CRUD Implementation
 * Endpoints: /api/leads
 * Supports: search, filter, pagination, bulk operations, analytics
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { getSocketServer } from '../services/socketServer.js';

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
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import { requirePermission, requireRole, scopeToOwn, requireMinRole } from '../middleware/rbac';
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
import { calculateLeadScore } from '../services/leadScoringService.js';

const router = Router();

// ─── GET /api/leads ─────────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_leads'),
  scopeToOwn('assignedToId'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      status,
      source,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minScore,
      maxScore,
      assignedTo,
    } = req.query;

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
  asyncHandler(async (_req: Request, res: Response) => {
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
  asyncHandler(async (_req: Request, res: Response) => {
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

// ─── GET /api/leads/:id ─────────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Lead ID');
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
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

// ─── POST /api/leads ────────────────────────────────────────────────────
router.post(
  '/',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
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

    // Calculate score automatically in the background
    calculateLeadScore(lead.id).catch(err => console.error('Background scoring failed:', err));

    res.status(201).json({ success: true, data: lead });
  })
);

// ─── PATCH /api/leads/:id ───────────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
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

    // Emit real-time lead:updated event to all CRM users
    getSocketServer()?.emitLeadUpdated({
      leadId: lead.id,
      status: lead.status,
      assignedTo: lead.assignedTo?.id,
      score: lead.score ?? undefined,
      updatedBy: req.user?.id,
    });

    // Calculate score automatically in the background
    calculateLeadScore(lead.id).catch(err => console.error('Background scoring failed:', err));

    res.status(200).json({ success: true, data: lead });
  })
);

// ─── DELETE /api/leads/:id ──────────────────────────────────────────────
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
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
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
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

    res.status(201).json({ success: true, data: activity });
  })
);

// ─── GET /api/leads/:id/activities ──────────────────────────────────────
router.get(
  '/:id/activities',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Lead ID');
    const { page = '1', pageSize = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(pageSize as string) || 20));

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: { leadId: req.params.id },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.activity.count({ where: { leadId: req.params.id } }),
    ]);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── POST /api/leads/bulk-import ────────────────────────────────────────
router.post(
  '/bulk-import',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0)
      throw new AppError('Provide an array of leads', 400);
    if (leads.length > 500) throw new AppError('Maximum 500 leads per batch', 400);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate phone format (international E.164-ish)
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

    const results = await prisma.lead.createMany({
      data: leads.map((l: Record<string, string | number | string[] | null>) => ({
        name: sanitizeString(
          (typeof l.name === 'string' ? l.name.trim() : 'Unknown').slice(0, 200)
        ),
        email:
          typeof l.email === 'string' && emailRegex.test(l.email.trim())
            ? l.email.trim().toLowerCase().slice(0, 254)
            : null,
        phone:
          typeof l.phone === 'string' && phoneRegex.test(l.phone.trim())
            ? l.phone.trim().slice(0, 20)
            : null,
        company:
          sanitizeString((typeof l.company === 'string' ? l.company.trim() : '').slice(0, 200)) ||
          null,
        status:
          typeof l.status === 'string' &&
          VALID_LEAD_STATUSES.includes(l.status as (typeof VALID_LEAD_STATUSES)[number])
            ? l.status
            : 'new',
        source:
          typeof l.source === 'string' ? sanitizeString(l.source.trim().slice(0, 100)) : 'direct',
        budget:
          typeof l.budget === 'number'
            ? l.budget
            : typeof l.budget === 'string'
              ? parseFloat(l.budget) || null
              : null,
        score: typeof l.score === 'number' ? Math.min(Math.max(Math.round(l.score), 0), 100) : 0,
        notes: sanitizeString((typeof l.notes === 'string' ? l.notes : '').slice(0, 5000)) || null,
        tags: Array.isArray(l.tags) ? l.tags.slice(0, 20).map(t => String(t).slice(0, 50)) : [],
      })),
    });

    res.status(201).json({ success: true, data: { imported: results.count, total: leads.length } });
  })
);

// ─── GET /api/leads/scored ──────────────────────────────────────────────
// Get all leads with scores, sorted by score descending (for LeadScoringModule)
router.get(
  '/scored',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { tier, minScore, maxScore, page = '1', pageSize = '50' } = req.query;
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
  asyncHandler(async (_req: Request, res: Response) => {
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
  asyncHandler(async (req: Request, res: Response) => {
    const { days = '7', minChange = '10' } = req.query;

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
    validateIdParam(req.params.id, 'Lead ID');

    const decision = await autoRouteHotLead(req.params.id);

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
    validateIdParam(req.params.id, 'Lead ID');

    const result = await scoreLead(req.params.id);

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
    validateIdParam(req.params.id, 'Lead ID');
    const { score, reason } = req.body;

    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new AppError('Score must be a number between 0 and 100', 400);
    }
    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      throw new AppError('Please provide a reason for the score override (min 3 characters)', 400);
    }

    const result = await overrideScore(
      req.params.id,
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
  asyncHandler(async (req: Request, res: Response) => {
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
    validateIdParam(req.params.id, 'Lead ID');
    const { limit = '50', days = '90' } = req.query;

    const history = await getScoreHistory(req.params.id, {
      limit: Math.min(200, parseInt(limit as string) || 50),
      days: Math.min(365, parseInt(days as string) || 90),
    });

    res.status(200).json({
      success: true,
      data: {
        leadId: req.params.id,
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
    validateIdParam(req.params.id, 'Lead ID');
    const { intentScore, sentimentScore, engagementScore, responseTimeScore, conversationScore } =
      req.body;

    const result = await applyWhatsAppSignal(req.params.id, {
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
  asyncHandler(async (_req: Request, res: Response) => {
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
  asyncHandler(async (req: Request, res: Response) => {
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
      },
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

    // Emit realtime update so CRM refreshes without polling
    try {
      const io = getSocketServer();
      if (io) {
        io.emit('lead:created', { source: 'homepage_search', leadId: lead.id });
      }
    } catch {
      // Socket server unavailable - non-fatal
    }

    res.status(201).json({ success: true, data: lead });
  })
);
export default router;
