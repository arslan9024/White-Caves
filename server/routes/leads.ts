/**
 * Leads API Routes — Full CRUD Implementation
 * Endpoints: /api/leads
 * Supports: search, filter, pagination, bulk operations, analytics
 */

import { Router, Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/leads ─────────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1',
      pageSize = '20',
      status,
      source,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minScore,
      maxScore,
      assignedTo,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string)));
    const skip = (pageNum - 1) * limit;

    // Build where clause
    const where: Prisma.LeadWhereInput = {};

    if (status && status !== 'all') {
      where.status = status as string;
    }
    if (source && source !== 'all') {
      where.source = source as string;
    }
    if (assignedTo) {
      where.assignedToId = assignedTo as string;
    }
    if (minScore || maxScore) {
      where.score = {};
      if (minScore) (where.score as any).gte = parseInt(minScore as string);
      if (maxScore) (where.score as any).lte = parseInt(maxScore as string);
    }
    if (search) {
      const s = search as string;
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
    const orderBy: any = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

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
  asyncHandler(async (req: Request, res: Response) => {
    const [total, byStatus, bySource, avgScore] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
      prisma.lead.aggregate({ _avg: { score: true, budget: true } }),
    ]);

    const statusCounts: Record<string, number> = {};
    byStatus.forEach(s => { statusCounts[s.status] = s._count._all; });

    const sourceCounts: Record<string, number> = {};
    bySource.forEach(s => { sourceCounts[s.source] = s._count._all; });

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
  asyncHandler(async (req: Request, res: Response) => {
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
  asyncHandler(async (req: Request, res: Response) => {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true, phone: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        property: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { user: { select: { id: true, name: true } } },
        },
        commissions: true,
      },
    });

    if (!lead) throw new AppError('Lead not found', 404);

    res.status(200).json({ success: true, data: lead });
  })
);

// ─── POST /api/leads ────────────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, company, status, source, budget, score, notes, tags,
      assignedToId, propertyId } = req.body;

    if (!name || !name.trim()) throw new AppError('Lead name is required', 400);

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        status: status || 'new',
        source: source || 'direct',
        budget: budget ? parseFloat(budget) : null,
        score: score ? parseInt(score) : 0,
        notes: notes || null,
        tags: tags || [],
        assignedToId: assignedToId || null,
        createdById: (req as any).user?.id || null,
        propertyId: propertyId || null,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    await prisma.activity.create({
      data: {
        type: 'lead', action: 'created',
        description: `New lead created: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
        userId: (req as any).user?.id || null,
        leadId: lead.id,
      },
    });

    res.status(201).json({ success: true, data: lead });
  })
);

// ─── PATCH /api/leads/:id ───────────────────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, company, status, source, budget, score, notes, tags,
      assignedToId, propertyId } = req.body;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lead not found', 404);

    const data: any = {};
    if (name !== undefined) data.name = name.trim();
    if (email !== undefined) data.email = email?.trim() || null;
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (company !== undefined) data.company = company?.trim() || null;
    if (status !== undefined) data.status = status;
    if (source !== undefined) data.source = source;
    if (budget !== undefined) data.budget = budget ? parseFloat(budget) : null;
    if (score !== undefined) data.score = parseInt(score);
    if (notes !== undefined) data.notes = notes;
    if (tags !== undefined) data.tags = tags;
    if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
    if (propertyId !== undefined) data.propertyId = propertyId || null;

    const statusChanged = status && status !== existing.status;

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
        userId: (req as any).user?.id || null,
        leadId: lead.id,
        metadata: statusChanged ? { oldStatus: existing.status, newStatus: status } : undefined,
      },
    });

    res.status(200).json({ success: true, data: lead });
  })
);

// ─── DELETE /api/leads/:id ──────────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lead not found', 404);

    await prisma.activity.deleteMany({ where: { leadId: id } });
    await prisma.lead.delete({ where: { id } });

    await prisma.activity.create({
      data: {
        type: 'lead', action: 'deleted',
        description: `Lead deleted: ${existing.name}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(200).json({ success: true, message: `Lead "${existing.name}" deleted` });
  })
);

// ─── POST /api/leads/:id/activities ─────────────────────────────────────
router.post(
  '/:id/activities',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { type, action, description } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new AppError('Lead not found', 404);

    const activity = await prisma.activity.create({
      data: {
        type: type || 'lead',
        action: action || 'note_added',
        description: description || 'Activity logged',
        userId: (req as any).user?.id || null,
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
  asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', pageSize = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(50, Math.max(1, parseInt(pageSize as string)));

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
      success: true, data: activities,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── POST /api/leads/bulk-import ────────────────────────────────────────
router.post(
  '/bulk-import',
  asyncHandler(async (req: Request, res: Response) => {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) throw new AppError('Provide an array of leads', 400);
    if (leads.length > 500) throw new AppError('Maximum 500 leads per batch', 400);

    const results = await prisma.lead.createMany({
      data: leads.map((l: any) => ({
        name: l.name?.trim() || 'Unknown',
        email: l.email?.trim() || null,
        phone: l.phone?.trim() || null,
        company: l.company?.trim() || null,
        status: l.status || 'new',
        source: l.source || 'direct',
        budget: l.budget ? parseFloat(l.budget) : null,
        score: l.score ? parseInt(l.score) : 0,
        notes: l.notes || null,
        tags: l.tags || [],
      })),
    });

    res.status(201).json({ success: true, data: { imported: results.count, total: leads.length } });
  })
);

export default router;
