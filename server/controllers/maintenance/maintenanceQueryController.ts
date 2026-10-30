/**
 * Maintenance Query Controller
 * Endpoints for listing maintenance requests, statistical overviews, and request detail retrieval.
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../database.js';

export const getMaintenanceRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  if (!userId) throw new AppError('Authentication required', 401);

  const status = req.query.status as string | undefined;
  const priority = req.query.priority as string | undefined;
  const category = req.query.category as string | undefined;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));

  const where: Record<string, unknown> = {};

  // Role-based scoping:
  //   owner / admin / manager → see all
  //   landlord → see maintenance for properties they own (property.userId = landlord.id)
  //   everyone else (tenant, agent) → see only requests they submitted
  if (userRole === 'owner' || userRole === 'admin' || userRole === 'manager') {
    // no extra filter – sees all
  } else if (userRole === 'landlord') {
    where.property = { userId };
  } else {
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
};

export const getMaintenanceStats = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const getMaintenanceRequestById = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
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
};

