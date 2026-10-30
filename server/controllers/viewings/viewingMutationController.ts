/**
 * Viewing Mutation Controller
 * Handles viewing scheduling, conflict detection, rescheduling/cancellation, and deletion.
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import { triggerLeadRescore } from '../../services/ai/leadAutoRescore.js';
import {
  detectConflicts,
  generateIcsToken,
} from '../../services/schedulingService.js';
import { sendViewingNotification } from './viewingCommon.js';

export const scheduleViewing = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const updateViewing = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const deleteViewing = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const existing = await prisma.viewing.findUnique({ where: { id } });
  if (!existing) throw new AppError('Viewing not found', 404);
  if (existing.userId !== userId) throw new AppError('Access denied', 403);

  await prisma.viewing.delete({ where: { id } });

  logger.info('Viewing deleted', { userId, viewingId: id });
  res.json({ success: true, message: 'Viewing deleted' });
};

