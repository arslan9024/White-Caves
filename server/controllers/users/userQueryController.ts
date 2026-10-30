/**
 * User Query Controller
 * Endpoints for querying users, current authenticated profile, pending approval lists, and specific user details.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { parsePagination } from '../../config/pagination.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import {
  RouteRequest,
  VALID_STATUSES,
  UserStatus,
  routeParamToString,
} from './userCommon.js';

export const getUsers = async (req: RouteRequest, res: Response): Promise<void> => {
  const { role, status, search, department } = req.query as Record<string, string | undefined>;

  const {
    page: pageNum,
    limit,
    skip,
  } = parsePagination({
    page: req.query.page as string,
    limit: req.query.pageSize as string,
  });

  const where: Record<string, unknown> = {};

  if (role && typeof role === 'string') {
    where.role = role;
  }
  if (status && VALID_STATUSES.includes(status as UserStatus)) {
    where.status = status as string;
  }
  if (department && typeof department === 'string') {
    where.department = sanitizeString(department);
  }
  if (search && typeof search === 'string') {
    const s = sanitizeString(search.trim()).slice(0, 100);
    where.OR = [
      { name: { contains: s, mode: 'insensitive' } },
      { email: { contains: s, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        status: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
        brnNumber: true,
        brnExpiry: true,
        _count: {
          select: {
            leadsAssigned: true,
            commissions: true,
            properties: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: pageNum,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getCurrentUser = async (req: RouteRequest, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) throw new AppError('Not authenticated', 401);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      department: true,
      photoUrl: true,
      status: true,
      createdAt: true,
      brnNumber: true,
      brnExpiry: true,
    },
  });

  if (!user) throw new AppError('User not found', 404);

  res.status(200).json({ success: true, data: user });
};

export const getPendingUsers = async (req: RouteRequest, res: Response): Promise<void> => {
  const {
    page: pageNum,
    limit,
    skip,
  } = parsePagination({
    page: req.query.page as string,
    limit: req.query.pageSize as string,
  });

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { status: 'pending' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where: { status: 'pending' } }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: pageNum,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = routeParamToString(req.params.id);
  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  validateIdParam(userId, 'User ID');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      department: true,
      photoUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      brnNumber: true,
      brnExpiry: true,
      _count: {
        select: {
          leadsAssigned: true,
          commissions: true,
          properties: true,
        },
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  res.status(200).json({ success: true, data: user });
};

