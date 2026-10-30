/**
 * Maintenance Mutation Controller
 * Handles maintenance request submission, status changes, contractor assignment with SLA, and ratings.
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import { notificationService } from '../../services/NotificationService.js';
import {
  VALID_MAINTENANCE_CATEGORIES,
  VALID_MAINTENANCE_PRIORITIES,
  VALID_MAINTENANCE_STATUSES,
} from './maintenanceCommon.js';

export const createMaintenanceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { propertyId, title, description, category, priority, images, scheduledDate } = req.body;
  if (!propertyId) throw new AppError('propertyId is required', 400);
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError('title is required', 400);
  }

  if (category && !VALID_MAINTENANCE_CATEGORIES.includes(category)) {
    throw new AppError(
      `Invalid category. Must be one of: ${VALID_MAINTENANCE_CATEGORIES.join(', ')}`,
      400
    );
  }

  if (priority && !VALID_MAINTENANCE_PRIORITIES.includes(priority)) {
    throw new AppError(
      `Invalid priority. Must be one of: ${VALID_MAINTENANCE_PRIORITIES.join(', ')}`,
      400
    );
  }

  // Verify property exists
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new AppError('Property not found', 404);

  const request = await prisma.maintenance.create({
    data: {
      requesterId: userId,
      propertyId,
      title: title.trim(),
      description: description || null,
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
  if (property.userId && property.userId !== userId) {
    await notificationService.pushToUser({
      userId: property.userId,
      type: 'property',
      title: 'New maintenance request',
      message: `${request.title} was reported for ${property.title}`,
      metadata: { maintenanceId: request.id, propertyId },
    });
  }
  res.status(201).json({ success: true, data: request });
};

export const updateMaintenanceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const existing = await prisma.maintenance.findUnique({ where: { id } });
  if (!existing) throw new AppError('Maintenance request not found', 404);

  // Requester can update their own; owner can update any
  if (existing.requesterId !== userId && userRole !== 'owner') {
    throw new AppError('Access denied', 403);
  }

  const {
    title,
    description,
    category,
    priority,
    status,
    scheduledDate,
    completedAt,
    cost,
    notes,
    images,
  } = req.body;
  const updateData: Record<string, unknown> = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) {
    if (!VALID_MAINTENANCE_CATEGORIES.includes(category)) {
      throw new AppError(`Invalid category`, 400);
    }
    updateData.category = category;
  }
  if (priority !== undefined) {
    if (!VALID_MAINTENANCE_PRIORITIES.includes(priority)) {
      throw new AppError(`Invalid priority`, 400);
    }
    updateData.priority = priority;
  }
  if (status !== undefined) {
    if (!VALID_MAINTENANCE_STATUSES.includes(status)) {
      throw new AppError(
        `Invalid status. Must be one of: ${VALID_MAINTENANCE_STATUSES.join(', ')}`,
        400
      );
    }
    updateData.status = status;
    if (status === 'completed') updateData.completedAt = new Date();
  }
  if (scheduledDate !== undefined)
    updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
  if (completedAt !== undefined)
    updateData.completedAt = completedAt ? new Date(completedAt) : null;
  if (cost !== undefined) updateData.cost = cost;
  if (notes !== undefined) updateData.notes = notes;
  if (images !== undefined) updateData.images = images;

  const updated = await prisma.maintenance.update({ where: { id }, data: updateData });

  logger.info('Maintenance request updated', { userId, requestId: id, status: updated.status });
  if (existing.requesterId && status !== undefined) {
    await notificationService.pushToUser({
      userId: existing.requesterId,
      type: 'property',
      title: 'Maintenance status updated',
      message: `${updated.title} is now ${updated.status}`,
      metadata: { maintenanceId: updated.id, status: updated.status },
    });
  }
  res.json({ success: true, data: updated });
};

export const assignContractor = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  if (!userId) throw new AppError('Authentication required', 401);
  if (!['owner', 'admin', 'manager'].includes(userRole || '')) {
    throw new AppError('Only managers and admins can assign contractors', 403);
  }

  const { id } = req.params as Record<string, string>;
  const { contractorId, contractorName } = req.body as {
    contractorId: string;
    contractorName?: string;
  };

  if (!contractorId) throw new AppError('contractorId is required', 400);

  const existing = await prisma.maintenance.findUnique({ where: { id } });
  if (!existing) throw new AppError('Maintenance request not found', 404);

  const now = new Date();
  // SLA: 4 hours for emergency, 48 hours for normal
  const slaHours = existing.priority === 'emergency' ? 4 : 48;
  const slaDeadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

  const updated = await prisma.maintenance.update({
    where: { id },
    data: {
      contractorId,
      contractorName: contractorName || 'Licensed Contractor',
      assignedAt: now,
      slaDeadline,
      status: 'in_progress',
    },
  });

  await prisma.activity.create({
    data: {
      type: 'maintenance',
      action: 'contractor_assigned',
      description: `Contractor "${contractorName || contractorId}" assigned to maintenance #${id} (SLA: ${slaHours}h)`,
      userId,
    },
  });

  res.status(200).json({ success: true, data: updated });
};

export const rateMaintenanceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const { rating, feedback } = req.body as { rating: number; feedback?: string };

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Rating must be an integer between 1 and 5', 400);
  }

  const existing = await prisma.maintenance.findUnique({ where: { id } });
  if (!existing) throw new AppError('Maintenance request not found', 404);

  if (existing.requesterId !== userId) {
    throw new AppError('Only the original requester can submit feedback', 403);
  }

  const updated = await prisma.maintenance.update({
    where: { id },
    data: {
      tenantRating: Math.round(rating),
      tenantFeedback: feedback || null,
    },
  });

  res.status(200).json({ success: true, data: updated });
};

export const deleteMaintenanceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const existing = await prisma.maintenance.findUnique({ where: { id } });
  if (!existing) throw new AppError('Maintenance request not found', 404);

  if (existing.requesterId !== userId && userRole !== 'owner') {
    throw new AppError('Access denied', 403);
  }

  await prisma.maintenance.delete({ where: { id } });

  logger.info('Maintenance request deleted', { userId, requestId: id });
  res.json({ success: true, message: 'Maintenance request deleted' });
};

