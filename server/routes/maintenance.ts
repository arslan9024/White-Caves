/**
 * Maintenance API Routes
 * ──────────────────────
 * CRUD endpoints for property maintenance requests.
 *
 * GET    /api/maintenance           — List maintenance requests
 * GET    /api/maintenance/:id       — Get request detail
 * POST   /api/maintenance           — Submit a new request
 * PATCH  /api/maintenance/:id       — Update request (status, assign, cost, schedule)
 * DELETE /api/maintenance/:id       — Delete a request
 * GET    /api/maintenance/stats     — Maintenance statistics
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { sanitizeString } from '../utils/sanitize.js';

const router = Router();

// ─── GET /api/maintenance — List maintenance requests ────────────────────────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) throw new AppError('Authentication required', 401);

    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const category = req.query.category as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));

    const where: Record<string, unknown> = {};

    // Owners see all; others see only their own requests
    if (userRole !== 'owner') {
      where.requesterId = userId;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;

    const [requests, total] = await Promise.all([
      prisma.maintenance.findMany({
        where,
        include: {
          property: {
            select: { id: true, title: true, location: true, type: true },
          },
          requester: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
        orderBy: [
          { priority: 'asc' }, // emergency first (alphabetical: emergency < high < low < medium)
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.maintenance.count({ where }),
    ]);

    res.json({
      success: true,
      data: requests,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  }),
);

// ─── GET /api/maintenance/stats — Maintenance statistics ─────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) throw new AppError('Authentication required', 401);

    const baseWhere: Record<string, unknown> = {};
    if (userRole !== 'owner') baseWhere.requesterId = userId;

    const [total, open, inProgress, completed, emergency] = await Promise.all([
      prisma.maintenance.count({ where: baseWhere }),
      prisma.maintenance.count({ where: { ...baseWhere, status: 'open' } }),
      prisma.maintenance.count({ where: { ...baseWhere, status: 'in_progress' } }),
      prisma.maintenance.count({ where: { ...baseWhere, status: 'completed' } }),
      prisma.maintenance.count({ where: { ...baseWhere, priority: 'emergency' } }),
    ]);

    res.json({
      success: true,
      data: { total, open, inProgress, completed, emergency },
    });
  }),
);

// ─── GET /api/maintenance/:id — Get request detail ──────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const request = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        property: true,
        requester: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });
    if (!request) throw new AppError('Maintenance request not found', 404);

    if (request.requesterId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    res.json({ success: true, data: request });
  }),
);

// ─── POST /api/maintenance — Submit a new maintenance request ────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId, title, description, category, priority, images, scheduledDate } = req.body;
    validate(req.body, {
      propertyId: rules.requiredMongoId('Property ID'),
      title: rules.requiredStringWithMax('Title', 200),
      description: rules.optionalStringWithMax('Description', 2000),
      category: rules.oneOf('Category', ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'general']),
      priority: rules.oneOf('Priority', ['low', 'medium', 'high', 'emergency']),
      images: rules.optionalArray('Images'),
    });

    // Verify property exists
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new AppError('Property not found', 404);

    const request = await prisma.maintenance.create({
      data: {
        requesterId: userId,
        propertyId,
        title: sanitizeString(title.trim()),
        description: description ? sanitizeString(description) : null,
        category: category || 'general',
        priority: priority || 'medium',
        images: images || [],
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      },
      include: {
        property: { select: { id: true, title: true, location: true } },
      },
    });

    logger.info('Maintenance request created', {
      userId,
      requestId: request.id,
      propertyId,
      priority: request.priority,
    });
    res.status(201).json({ success: true, data: request });
  }),
);

// ─── PATCH /api/maintenance/:id — Update a maintenance request ───────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    validateIdParam(id, 'maintenance');
    const existing = await prisma.maintenance.findUnique({ where: { id } });
    if (!existing) throw new AppError('Maintenance request not found', 404);

    // Requester can update their own; owner can update any
    if (existing.requesterId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    const { title, description, category, priority, status, scheduledDate, completedAt, cost, notes, images } =
      req.body;
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = sanitizeString(title);
    if (description !== undefined) updateData.description = sanitizeString(description);
    if (category !== undefined) {
      const validCategories = ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'general'];
      if (!validCategories.includes(category)) {
        throw new AppError(`Invalid category`, 400);
      }
      updateData.category = category;
    }
    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high', 'emergency'];
      if (!validPriorities.includes(priority)) {
        throw new AppError(`Invalid priority`, 400);
      }
      updateData.priority = priority;
    }
    if (status !== undefined) {
      const validStatuses = ['open', 'in_progress', 'scheduled', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      updateData.status = status;
      if (status === 'completed') updateData.completedAt = new Date();
    }
    if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    if (completedAt !== undefined) updateData.completedAt = completedAt ? new Date(completedAt) : null;
    if (cost !== undefined) updateData.cost = cost;
    if (notes !== undefined) updateData.notes = notes;
    if (images !== undefined) updateData.images = images;

    const updated = await prisma.maintenance.update({ where: { id }, data: updateData });

    logger.info('Maintenance request updated', { userId, requestId: id, status: updated.status });
    res.json({ success: true, data: updated });
  }),
);

// ─── DELETE /api/maintenance/:id — Delete a maintenance request ──────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    validateIdParam(id, 'maintenance');
    const existing = await prisma.maintenance.findUnique({ where: { id } });
    if (!existing) throw new AppError('Maintenance request not found', 404);

    if (existing.requesterId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    await prisma.maintenance.delete({ where: { id } });

    logger.info('Maintenance request deleted', { userId, requestId: id });
    res.json({ success: true, message: 'Maintenance request deleted' });
  }),
);

export default router;
