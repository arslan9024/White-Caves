// @ts-nocheck
/**
 * Activities API Routes — Standalone CRUD
 * Endpoints: /api/activities
 * Complements: /api/dashboard/activities (read-only feed) and /api/leads/:id/activities (lead-scoped)
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { prisma } from '../database.js';
import { validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import { sanitizeString } from '../utils/sanitize';
import { requirePermission } from '../middleware/rbac';

const router = Router();

// ─── GET /api/activities ────────────────────────────────────────────────
// Filterable by type, action, userId, leadId
router.get(
  '/',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, action, userId, leadId, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const { page: pageNum, limit, skip } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where: Prisma.ActivityWhereInput = {};
    if (type && type !== 'all') where.type = type as string;
    if (action && action !== 'all') where.action = action as string;
    if (userId) where.userId = userId as string;
    if (leadId) where.leadId = leadId as string;

    const validSorts = ['createdAt', 'type', 'action'];
    const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: Prisma.ActivityOrderByWithRelationInput = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          lead: { select: { id: true, name: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: activities.map((a) => ({
        id: a.id,
        type: a.type,
        action: a.action,
        description: a.description,
        metadata: a.metadata,
        createdAt: a.createdAt.toISOString(),
        userId: a.userId,
        user: a.user ? { id: a.user.id, name: a.user.name, email: a.user.email } : null,
        leadId: a.leadId,
        lead: a.lead ? { id: a.lead.id, name: a.lead.name } : null,
      })),
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/activities/:id ────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Activity ID');

    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        lead: { select: { id: true, name: true } },
      },
    });

    if (!activity) throw new AppError('Activity not found', 404);

    res.status(200).json({
      success: true,
      data: {
        id: activity.id,
        type: activity.type,
        action: activity.action,
        description: activity.description,
        metadata: activity.metadata,
        createdAt: activity.createdAt.toISOString(),
        userId: activity.userId,
        user: activity.user ? { id: activity.user.id, name: activity.user.name, email: activity.user.email } : null,
        leadId: activity.leadId,
        lead: activity.lead ? { id: activity.lead.id, name: activity.lead.name } : null,
      },
    });
  })
);

// ─── POST /api/activities ───────────────────────────────────────────────
// Create a standalone activity (not tied to a lead)
router.post(
  '/',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, action, description, metadata, leadId } = req.body;

    if (!type || typeof type !== 'string') {
      throw new AppError('Activity type is required (lead, property, deal, commission, agent, client, system)', 400);
    }
    if (!action || typeof action !== 'string') {
      throw new AppError('Activity action is required (created, updated, deleted, status_changed, note_added, call, email, visit)', 400);
    }
    if (!description || typeof description !== 'string') {
      throw new AppError('Activity description is required', 400);
    }

    const activity = await prisma.activity.create({
      data: {
        type: sanitizeString(type),
        action: sanitizeString(action),
        description: sanitizeString(description),
        metadata: metadata || null,
        userId: req.user?.id || null,
        leadId: leadId || null,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: activity.id,
        type: activity.type,
        action: activity.action,
        description: activity.description,
        metadata: activity.metadata,
        createdAt: activity.createdAt.toISOString(),
        userId: activity.userId,
        leadId: activity.leadId,
      },
    });
  })
);

// ─── PATCH /api/activities/:id ──────────────────────────────────────────
// Update activity metadata/description
router.patch(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Activity ID');

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new AppError('Activity not found', 404);

    const { description, metadata } = req.body;
    const data: Record<string, unknown> = {};
    if (description !== undefined) data.description = sanitizeString(String(description));
    if (metadata !== undefined) data.metadata = metadata;

    const updated = await prisma.activity.update({ where: { id }, data });

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        type: updated.type,
        action: updated.action,
        description: updated.description,
        metadata: updated.metadata,
        createdAt: updated.createdAt.toISOString(),
        userId: updated.userId,
        leadId: updated.leadId,
      },
    });
  })
);

// ─── DELETE /api/activities/:id ─────────────────────────────────────────
router.delete(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Activity ID');

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new AppError('Activity not found', 404);

    // Only managers+ can delete activities
    const isAdmin = ['owner', 'manager', 'admin'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only managers can delete activity records', 403);
    }

    await prisma.activity.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Activity deleted' });
  })
);

export default router;
