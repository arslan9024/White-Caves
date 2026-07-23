/**
 * Viewings API Routes — Enhanced Phase 3C
 * ────────────────────────────────────────
 * CRUD endpoints for property viewing/tour scheduling with
 * intelligent slot computation, conflict detection, .ics export,
 * and automated notifications.
 *
 * GET    /api/viewings              — List user's viewings (upcoming & past)
 * GET    /api/viewings/upcoming     — Upcoming viewings only
 * GET    /api/viewings/slots        — Available time slots for an agent on a date
 * GET    /api/viewings/:id/ics      — Download .ics calendar file
 * POST   /api/viewings              — Schedule a new viewing (with conflict detection)
 * PATCH  /api/viewings/:id          — Update viewing (reschedule, cancel, confirm, feedback)
 * DELETE /api/viewings/:id          — Delete a viewing
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { triggerLeadRescore } from '../services/ai/leadAutoRescore.js';
import {
  getAvailableSlots,
  detectConflicts,
  generateViewingICS,
  generateIcsToken,
} from '../services/schedulingService.js';

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
            select: {
              id: true,
              title: true,
              location: true,
              price: true,
              images: true,
              type: true,
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.viewing.count({ where }),
    ]);

    res.json({
      success: true,
      data: viewings,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  })
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

    res.json({ success: true, data: viewings });
  })
);

// ─── GET /api/viewings/slots — Available time slots for an agent ─────────
router.get(
  '/slots',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const agentId = req.query.agentId as string;
    const dateStr = req.query.date as string;
    const duration = parseInt(req.query.duration as string) || undefined;

    if (!agentId) throw new AppError('agentId query parameter is required', 400);
    if (!dateStr) throw new AppError('date query parameter is required (YYYY-MM-DD)', 400);

    const date = new Date(dateStr + 'T00:00:00.000Z');
    if (isNaN(date.getTime())) throw new AppError('Invalid date format (use YYYY-MM-DD)', 400);

    // Don't allow checking slots in the past
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (date < today) throw new AppError('Cannot check slots for past dates', 400);

    // Verify agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId },
      select: { id: true, name: true },
    });
    if (!agent) throw new AppError('Agent not found', 404);

    const slots = await getAvailableSlots(agentId, date, duration);
    const available = slots.filter(s => s.available);

    res.json({
      success: true,
      data: {
        agentId,
        agentName: agent.name,
        date: dateStr,
        totalSlots: slots.length,
        availableSlots: available.length,
        slots,
      },
    });
  })
);

// ─── GET /api/viewings/:id/ics — Download .ics calendar file ─────────────
router.get(
  '/:id/ics',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    const token = req.query.token as string;

    // Authenticate: either logged in user owns the viewing, or valid icsToken
    const viewing = await prisma.viewing.findUnique({
      where: { id },
      select: { userId: true, agentId: true, icsToken: true },
    });

    if (!viewing) throw new AppError('Viewing not found', 404);

    const userId = req.user?.id;
    const isOwner = userId && (viewing.userId === userId || viewing.agentId === userId);
    const isTokenValid = token && viewing.icsToken && token === viewing.icsToken;

    if (!isOwner && !isTokenValid) {
      throw new AppError('Access denied. Provide valid token or authenticate.', 403);
    }

    const icsContent = await generateViewingICS(id);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="viewing-${id}.ics"`);
    res.send(icsContent);
  })
);

// ─── POST /api/viewings — Schedule a new viewing ────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId, scheduledAt, type, notes, leadId, duration, agentId, location } = req.body;
    if (!propertyId) throw new AppError('propertyId is required', 400);
    if (!scheduledAt) throw new AppError('scheduledAt is required', 400);

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) throw new AppError('Invalid scheduledAt date', 400);
    if (scheduledDate < new Date()) throw new AppError('Cannot schedule viewings in the past', 400);

    const viewingDuration = duration || 30;

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, location: true },
    });
    if (!property) throw new AppError('Property not found', 404);

    // Verify agent exists (if provided)
    if (agentId) {
      const agent = await prisma.user.findUnique({ where: { id: agentId } });
      if (!agent) throw new AppError('Agent not found', 404);
    }

    // Check for scheduling conflicts
    const conflict = await detectConflicts(agentId || null, userId, scheduledDate, viewingDuration);

    if (conflict.hasConflict) {
      throw new AppError(conflict.message || 'Scheduling conflict detected', 409);
    }

    // Generate ICS token for calendar download
    const icsToken = generateIcsToken();

    let resolvedLeadId = typeof leadId === 'string' && leadId.length > 0 ? leadId : null;

    if (!resolvedLeadId) {
      const existingLead = req.user?.email
        ? await prisma.lead.findFirst({
            where: {
              email: req.user.email,
              propertyId,
              status: { not: 'lost' },
            },
            select: { id: true },
          })
        : null;

      if (existingLead) {
        resolvedLeadId = existingLead.id;
      } else {
        const inquiryLead = await prisma.lead.create({
          data: {
            name: req.user?.email || 'Viewing inquiry',
            email: req.user?.email || null,
            phone: null,
            source: 'website',
            status: 'viewing',
            propertyId,
            createdById: userId,
            assignedToId: agentId || null,
            lastContact: new Date(),
            notes: `Auto-created from viewing request for property ${property.title}`,
            score: 20,
            tags: ['viewing_request', 'website'],
          } as never,
          select: { id: true },
        });
        resolvedLeadId = inquiryLead.id;
      }
    }

    const viewing = await prisma.viewing.create({
      data: {
        userId,
        propertyId,
        scheduledAt: scheduledDate,
        type: type || 'in_person',
        notes: notes || null,
        leadId: resolvedLeadId,
        duration: viewingDuration,
        agentId: agentId || null,
        location: location || property.location || null,
        icsToken,
      },
      include: {
        property: {
          select: { id: true, title: true, location: true, price: true },
        },
        agent: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (resolvedLeadId) {
      await prisma.activity.create({
        data: {
          type: 'lead',
          action: 'viewing_requested',
          description: `Viewing requested for ${property.title}`,
          userId,
          leadId: resolvedLeadId,
          metadata: {
            viewingId: viewing.id,
            propertyId,
            scheduledAt: scheduledDate.toISOString(),
          },
        },
      });
    }

    // Fire-and-forget notification (don't block response)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendViewingNotification(viewing as any, 'created').catch(err =>
      logger.warn('Failed to send viewing creation notification', { err })
    );

    logger.info('Viewing scheduled', {
      userId,
      viewingId: viewing.id,
      propertyId,
      agentId: agentId || null,
      scheduledAt: scheduledDate.toISOString(),
      ...(conflict.message ? { warning: conflict.message } : {}),
    });
    triggerLeadRescore(viewing.leadId ?? resolvedLeadId, 'viewing_scheduled');

    res.status(201).json({
      success: true,
      data: viewing,
      ...(conflict.message ? { warning: conflict.message } : {}),
    });
  })
);

// ─── PATCH /api/viewings/:id — Update a viewing ─────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const existing = await prisma.viewing.findUnique({
      where: { id },
      include: {
        property: { select: { title: true, location: true } },
        agent: { select: { name: true, email: true } },
      },
    });
    if (!existing) throw new AppError('Viewing not found', 404);
    if (existing.userId !== userId && existing.agentId !== userId) {
      throw new AppError('Access denied', 403);
    }

    const { scheduledAt, status, notes, feedback, rating, type, cancelReason, location } = req.body;
    const updateData: Record<string, unknown> = {};

    if (scheduledAt !== undefined) {
      const d = new Date(scheduledAt);
      if (isNaN(d.getTime())) throw new AppError('Invalid scheduledAt date', 400);

      // Check conflicts if rescheduling
      const conflict = await detectConflicts(
        existing.agentId,
        existing.userId,
        d,
        existing.duration,
        id // Exclude current viewing from conflict check
      );
      if (conflict.hasConflict) {
        throw new AppError(conflict.message || 'Rescheduling conflict detected', 409);
      }

      updateData.scheduledAt = d;
      updateData.reminderSent = false; // Reset reminder for rescheduled viewings
      if (conflict.message) {
        logger.info('Rescheduling buffer warning', { viewingId: id, warning: conflict.message });
      }
    }

    if (status !== undefined) {
      const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      updateData.status = status;

      // Track confirmation timestamp
      if (status === 'confirmed') {
        updateData.confirmedAt = new Date();
      }

      // Require cancelReason for cancellations
      if (status === 'cancelled' && cancelReason) {
        updateData.cancelReason = cancelReason;
      }
    }

    if (notes !== undefined) updateData.notes = notes;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (location !== undefined) updateData.location = location;
    if (cancelReason !== undefined) updateData.cancelReason = cancelReason;

    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new AppError('Rating must be 1-5', 400);
      }
      updateData.rating = rating;
    }
    if (type !== undefined) updateData.type = type;

    const updated = await prisma.viewing.update({
      where: { id },
      data: updateData,
      include: {
        property: { select: { id: true, title: true, location: true } },
        agent: { select: { id: true, name: true, email: true } },
      },
    });

    // Send notification on status change
    if (status === 'confirmed' || status === 'cancelled') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendViewingNotification(updated as any, status).catch(err =>
        logger.warn('Failed to send viewing status notification', { err })
      );
    }

    logger.info('Viewing updated', { userId, viewingId: id, status: updated.status });
    triggerLeadRescore(updated.leadId, 'viewing_updated');
    res.json({ success: true, data: updated });
  })
);

// ─── DELETE /api/viewings/:id — Delete a viewing ────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const existing = await prisma.viewing.findUnique({ where: { id } });
    if (!existing) throw new AppError('Viewing not found', 404);
    if (existing.userId !== userId) throw new AppError('Access denied', 403);

    await prisma.viewing.delete({ where: { id } });

    logger.info('Viewing deleted', { userId, viewingId: id });
    res.json({ success: true, message: 'Viewing deleted' });
  })
);

// ─── Notification Helper ─────────────────────────────────────────────────

/**
 * Send viewing notification (email + WhatsApp) on create/confirm/cancel.
 * Fire-and-forget — errors are logged but don't block the response.
 */
async function sendViewingNotification(
  viewing: {
    id: string;
    scheduledAt: Date;
    duration: number;
    type: string;
    status: string;
    location?: string | null;
    property?: { title?: string; location?: string } | null;
    agent?: { name?: string; email?: string } | null;
  },
  event: 'created' | 'confirmed' | 'cancelled'
): Promise<void> {
  try {
    const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../services/emailService.js');

    if (event === 'created' || event === 'confirmed') {
      // Get viewing user info for email
      const fullViewing = await prisma.viewing.findUnique({
        where: { id: viewing.id },
        include: { user: { select: { name: true, email: true } } },
      });

      if (fullViewing?.user?.email) {
        const template = EMAIL_TEMPLATES.viewingConfirmation(
          fullViewing.user.name || 'Valued Client',
          viewing.property?.title || 'Property',
          viewing.scheduledAt.toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }),
          viewing.agent?.name || 'Your Agent'
        );

        await sendEmailTracked({
          to: fullViewing.user.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          tags: [{ name: 'type', value: `viewing_${event}` }],
        });
      }
    }

    if (event === 'cancelled') {
      // Notify client that their viewing was cancelled
      const fullViewing = await prisma.viewing.findUnique({
        where: { id: viewing.id },
        include: { user: { select: { name: true, email: true } } },
      });

      if (fullViewing?.user?.email) {
        const template = EMAIL_TEMPLATES.viewingCancelled(
          fullViewing.user.name || 'Valued Client',
          viewing.property?.title || 'Property',
          viewing.scheduledAt.toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }),
          viewing.agent?.name || 'Your Agent'
        );

        await sendEmailTracked({
          to: fullViewing.user.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          tags: [{ name: 'type', value: 'viewing_cancelled' }],
        });
      }
    }

    logger.info('Viewing notification sent', { viewingId: viewing.id, event });
  } catch (error) {
    logger.warn('Viewing notification failed (non-blocking)', {
      viewingId: viewing.id,
      event,
      error,
    });
  }
}

export default router;
