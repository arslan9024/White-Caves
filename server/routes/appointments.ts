/**
 * Appointments API Routes
 * ────────────────────────
 * Full CRUD for scheduling appointments (client meetings, viewings,
 * landlord meetings, RERA inspections, handovers, team meetings).
 *
 * GET    /api/appointments              — List appointments (paginated, filtered)
 * GET    /api/appointments/upcoming     — Upcoming appointments only
 * GET    /api/appointments/:id          — Get single appointment
 * POST   /api/appointments              — Create an appointment
 * PATCH  /api/appointments/:id          — Update / reschedule / complete
 * DELETE /api/appointments/:id          — Delete a non-completed appointment
 */

import { Router, Response } from 'express';
import crypto from 'crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

const VALID_TYPES = ['viewing', 'client_meeting', 'landlord_meeting', 'rera_inspection', 'handover', 'team_meeting'];
const VALID_STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled'];

// ─── GET /api/appointments ────────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const where: Record<string, unknown> = {};

    // Admins/owners see all; agents see their own
    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      where.OR = [{ agentId: userId }, { clientId: userId }, { createdBy: userId }];
    }

    if (status) where.status = status;
    if (type) where.type = type;
    if (from || to) {
      const scheduledAt: Record<string, Date> = {};
      if (from) scheduledAt.gte = new Date(from);
      if (to) scheduledAt.lte = new Date(to);
      where.scheduledAt = scheduledAt;
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({
      success: true,
      data: appointments,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  }),
);

// ─── GET /api/appointments/upcoming ──────────────────────────────────────────
router.get(
  '/upcoming',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 10));

    const where: Record<string, unknown> = {
      scheduledAt: { gte: new Date() },
      status: { in: ['scheduled', 'confirmed'] },
    };

    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      (where as Record<string, unknown>).OR = [
        { agentId: userId },
        { clientId: userId },
        { createdBy: userId },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    });

    res.json({ success: true, data: appointments });
  }),
);

// ─── GET /api/appointments/:id ────────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
    });

    if (!appointment) throw new AppError('Appointment not found', 404);

    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      const parties = [appointment.agentId, appointment.clientId, appointment.createdBy];
      if (!parties.includes(userId)) {
        throw new AppError('Access denied', 403);
      }
    }

    res.json({ success: true, data: appointment });
  }),
);

// ─── POST /api/appointments ───────────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const {
      type,
      title,
      agentId,
      clientId,
      propertyId,
      scheduledAt,
      durationMinutes,
      location,
      isVirtual,
      meetingLink,
      notes,
    } = req.body;

    if (!scheduledAt) throw new AppError('scheduledAt is required', 400);

    const parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime())) throw new AppError('scheduledAt must be a valid date', 400);

    if (type && !VALID_TYPES.includes(type)) {
      throw new AppError(`type must be one of: ${VALID_TYPES.join(', ')}`, 400);
    }

    const icsToken = crypto.randomBytes(16).toString('hex');

    const appointment = await prisma.appointment.create({
      data: {
        type: type ?? 'viewing',
        title: title ?? null,
        agentId: agentId ?? userId,
        clientId: clientId ?? null,
        propertyId: propertyId ?? null,
        scheduledAt: parsedDate,
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 60,
        location: location ?? null,
        isVirtual: isVirtual ?? false,
        meetingLink: meetingLink ?? null,
        notes: notes ?? null,
        icsToken,
        createdBy: userId,
      },
    });

    logger.info('Appointment created', {
      id: appointment.id,
      type: appointment.type,
      scheduledAt: appointment.scheduledAt,
      createdBy: userId,
    });

    res.status(201).json({ success: true, data: appointment });
  }),
);

// ─── PATCH /api/appointments/:id ──────────────────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const existing = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Appointment not found', 404);

    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      const parties = [existing.agentId, existing.clientId, existing.createdBy];
      if (!parties.includes(userId)) {
        throw new AppError('Access denied', 403);
      }
    }

    const {
      type,
      title,
      agentId,
      clientId,
      propertyId,
      scheduledAt,
      durationMinutes,
      location,
      isVirtual,
      meetingLink,
      status,
      feedbackRating,
      feedbackText,
      outcome,
      notes,
      googleEventId,
    } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError(`status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }

    const updateData: Record<string, unknown> = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (agentId !== undefined) updateData.agentId = agentId;
    if (clientId !== undefined) updateData.clientId = clientId;
    if (propertyId !== undefined) updateData.propertyId = propertyId;
    if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt);
    if (durationMinutes !== undefined) updateData.durationMinutes = parseInt(durationMinutes);
    if (location !== undefined) updateData.location = location;
    if (isVirtual !== undefined) updateData.isVirtual = isVirtual;
    if (meetingLink !== undefined) updateData.meetingLink = meetingLink;
    if (status !== undefined) updateData.status = status;
    if (feedbackRating !== undefined) updateData.feedbackRating = parseInt(feedbackRating);
    if (feedbackText !== undefined) updateData.feedbackText = feedbackText;
    if (outcome !== undefined) updateData.outcome = outcome;
    if (notes !== undefined) updateData.notes = notes;
    if (googleEventId !== undefined) updateData.googleEventId = googleEventId;

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: updateData,
    });

    logger.info('Appointment updated', { id: req.params.id, status, updatedBy: userId });

    res.json({ success: true, data: updated });
  }),
);

// ─── DELETE /api/appointments/:id ─────────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const existing = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Appointment not found', 404);

    if (existing.status === 'completed') {
      throw new AppError('Cannot delete a completed appointment', 400);
    }

    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      const parties = [existing.agentId, existing.createdBy];
      if (!parties.includes(userId)) {
        throw new AppError('Access denied', 403);
      }
    }

    await prisma.appointment.delete({ where: { id: req.params.id } });

    logger.info('Appointment deleted', { id: req.params.id, deletedBy: userId });

    res.json({ success: true, message: 'Appointment deleted' });
  }),
);

export default router;
