/**
 * Viewing Query Controller
 * Endpoints for listing user viewings, upcoming tours, available agent slots, and .ics export.
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../database.js';
import {
  getAvailableSlots,
  generateViewingICS,
} from '../../services/schedulingService.js';

export const getViewings = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const getUpcomingViewings = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const getViewingSlots = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const getViewingIcs = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

