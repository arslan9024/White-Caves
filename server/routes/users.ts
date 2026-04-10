/**
 * Users API Routes — User Management & RBAC
 * User listing, role management, status control
 * Endpoints: /api/users
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';

const VALID_ROLES = ['owner', 'manager', 'admin', 'agent', 'finance', 'viewer'] as const;
const VALID_USER_STATUSES = ['active', 'inactive'] as const;

const router = Router();

// ─── GET /api/users ─────────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only owner/manager can list all users
    const allowedRoles = ['owner', 'manager'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — user listing requires manager role or above', 403);
    }

    const { role, status, department, search } = req.query;

    const { page: pageNum, limit, skip } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where: Record<string, unknown> = {};
    if (role && role !== 'all') where.role = role as string;
    if (status && status !== 'all') where.status = status as string;
    if (department && department !== 'all') where.department = department as string;
    if (search) {
      const s = search as string;
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, email: true, name: true, photoUrl: true,
          role: true, phone: true, department: true, status: true,
          createdAt: true, updatedAt: true,
        },
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
  })
);

// ─── GET /api/users/stats ───────────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only owner/manager can view user statistics
    const allowedRoles = ['owner', 'manager'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — user statistics require manager role or above', 403);
    }

    const [total, byRole, byStatus] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      prisma.user.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const roleCounts: Record<string, number> = {};
    byRole.forEach((r) => { roleCounts[r.role] = r._count._all; });

    const statusCounts: Record<string, number> = {};
    byStatus.forEach((s) => { statusCounts[s.status] = s._count._all; });

    res.status(200).json({
      success: true,
      data: {
        total,
        byRole: roleCounts,
        byStatus: statusCounts,
      },
    });
  })
);

// ─── GET /api/users/:id ─────────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'User ID');

    // AUTHORIZATION: Only owner/manager can view user details
    const allowedRoles = ['owner', 'manager'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — user details require manager role or above', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, name: true, photoUrl: true,
        role: true, phone: true, department: true, status: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({ success: true, data: user });
  })
);

// ─── PATCH /api/users/:id/role ──────────────────────────────────────────
router.patch(
  '/:id/role',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'User ID');

    // AUTHORIZATION: Only owner can change roles
    if ((req as AuthRequest).user?.role !== 'owner') {
      throw new AppError('Access denied — role changes require owner role', 403);
    }

    const { role } = req.body;

    validate(req.body, {
      role: rules.oneOf('Role', [...VALID_ROLES]),
    });

    if (!role) throw new AppError('Role is required', 400);

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AppError('User not found', 404);

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true, email: true, name: true, role: true,
        status: true, department: true,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'updated',
        description: `User "${user.name || user.email}" role changed: ${existing.role} → ${role}`,
        userId: (req as AuthRequest).user?.id || null,
        metadata: { oldRole: existing.role, newRole: role },
      },
    });

    res.status(200).json({ success: true, data: user });
  })
);

// ─── PATCH /api/users/:id/status ────────────────────────────────────────
router.patch(
  '/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'User ID');

    // AUTHORIZATION: Only owner/manager can change user status
    const allowedRoles = ['owner', 'manager'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — user status changes require manager role or above', 403);
    }

    const { status } = req.body;

    validate(req.body, {
      status: rules.oneOf('Status', [...VALID_USER_STATUSES]),
    });

    if (!status) throw new AppError('Status is required', 400);

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AppError('User not found', 404);

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true, email: true, name: true, role: true,
        status: true, department: true,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'status_changed',
        description: `User "${user.name || user.email}" status changed: ${existing.status} → ${status}`,
        userId: (req as AuthRequest).user?.id || null,
        metadata: { oldStatus: existing.status, newStatus: status },
      },
    });

    res.status(200).json({ success: true, data: user });
  })
);

// ─── DELETE /api/users/:id ──────────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'User ID');

    // AUTHORIZATION: Only owner can deactivate users
    if ((req as AuthRequest).user?.role !== 'owner') {
      throw new AppError('Access denied — user deactivation requires owner role', 403);
    }

    // Prevent self-deactivation
    if (id === (req as AuthRequest).user?.id) {
      throw new AppError('You cannot deactivate your own account', 400);
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AppError('User not found', 404);

    // Soft delete — set status to inactive, NOT hard delete
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'inactive' },
      select: {
        id: true, email: true, name: true, role: true,
        status: true, department: true,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'status_changed',
        description: `User "${user.name || user.email}" deactivated by ${(req as AuthRequest).user?.email}`,
        userId: (req as AuthRequest).user?.id || null,
        metadata: { oldStatus: existing.status, newStatus: 'inactive' },
      },
    });

    res.status(200).json({ success: true, data: user, message: `User "${user.name || user.email}" deactivated` });
  })
);

export default router;
