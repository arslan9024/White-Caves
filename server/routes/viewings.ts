/**
 * Viewings API Routes
 * ───────────────────
 * CRUD endpoints for property viewing/tour scheduling.
 *
 * GET    /api/viewings           — List user's viewings (upcoming & past)
 * POST   /api/viewings           — Schedule a new viewing
 * PATCH  /api/viewings/:id       — Update viewing (reschedule, cancel, add feedback)
 * DELETE /api/viewings/:id       — Delete a viewing
 * GET    /api/viewings/upcoming  — Upcoming viewings only
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { sendSuccess, sendCreated, buildPagination } from '../utils/apiResponse';

const router = Router();

// ─── GET /api/viewings — List all viewings for current user ──────────────────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;

    const [viewings, total] = await Promise.all([
      prisma.viewing.findMany({
        where,
        include: {
          property: {
            select: { id: true, title: true, location: true, price: true, images: true, type: true },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.viewing.count({ where }),
    ]);

    sendSuccess(res, viewings, 'OK', 200, buildPagination(page, pageSize, total));
  }),
);

// ─── GET /api/viewings/upcoming — Only future viewings ───────────────────────
router.get(
  '/upcoming',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const viewings = await prisma.viewing.findMany({
      where: {
        userId,
        scheduledAt: { gte: new Date() },
        status: { in: ['scheduled', 'confirmed'] },
      },
      include: {
        property: {
          select: { id: true, title: true, location: true, price: true, images: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 20,
    });

    sendSuccess(res, viewings); ────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId, scheduledAt, type, notes, leadId, duration } = req.body;
    if (!propertyId) throw new AppError('propertyId is required', 400);
    if (!scheduledAt) throw new AppError('scheduledAt is required', 400);

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) throw new AppError('Invalid scheduledAt date', 400);
    if (scheduledDate < new Date()) throw new AppError('Cannot schedule viewings in the past', 400);

    // Verify property exists
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new AppError('Property not found', 404);

    const viewing = await prisma.viewing.create({
      data: {
        userId,
        propertyId,
        scheduledAt: scheduledDate,
        type: type || 'in_person',
        notes: notes || null,
        leadId: leadId || null,
        duration: duration || 30,
      },
      include: {
        property: {
          select: { id: true, title: true, location: true, price: true },
        },
      },
    });

    logger.info('Viewing scheduled', { userId, viewingId: viewing.id, propertyId });
    sendCreated(res, viewing);
  }),
);

// ─── PATCH /api/viewings/:id — Update a viewing ─────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.viewing.findUnique({ where: { id } });
    if (!existing) throw new AppError('Viewing not found', 404);
    if (existing.userId !== userId) throw new AppError('Access denied', 403);

    const { scheduledAt, status, notes, feedback, rating, type } = req.body;
    const updateData: Record<string, unknown> = {};

    if (scheduledAt !== undefined) {
      const d = new Date(scheduledAt);
      if (isNaN(d.getTime())) throw new AppError('Invalid scheduledAt date', 400);
      updateData.scheduledAt = d;
    }
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new AppError('Rating must be 1-5', 400);
      }
      updateData.rating = rating;
    }
    if (type !== undefined) updateData.type = type;

    const updated = await prisma.viewing.update({ where: { id }, data: updateData });

    logger.info('Viewing updated', { userId, viewingId: id, status: updated.status });
    sendSuccess(res, updated);
  }),
);

// ─── DELETE /api/viewings/:id — Delete a viewing ────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.viewing.findUnique({ where: { id } });
    if (!existing) throw new AppError('Viewing not found', 404);
    if (existing.userId !== userId) throw new AppError('Access denied', 403);

    await prisma.viewing.delete({ where: { id } });

    logger.info('Viewing deleted', { userId, viewingId: id });
    sendSuccess(res, null, 'Viewing deleted');
  }),
);

export default router;
