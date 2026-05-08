/**
 * Role Requests API Routes
 * ─────────────────────────
 * Allows users to request role changes; admins/owners review and approve or reject.
 *
 * POST   /api/role-requests                    — Submit a role change request
 * GET    /api/role-requests/mine               — List current user's own requests
 * GET    /api/role-requests                    — List all pending requests (admin+)
 * GET    /api/role-requests/:id                — Get single request
 * POST   /api/role-requests/:id/approve        — Approve request (admin+)
 * POST   /api/role-requests/:id/reject         — Reject request (admin+)
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { requirePermission, ROLE_ALIAS_MAP, resolveBackendRole } from '../middleware/rbac.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── POST /api/role-requests — submit a request ───────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { requestedRole, reason } = req.body;
    if (!requestedRole) throw new AppError('requestedRole is required', 400);

    if (!Object.hasOwn(ROLE_ALIAS_MAP, requestedRole)) {
      throw new AppError(
        `Invalid role: "${requestedRole}". Must be one of: ${Object.keys(ROLE_ALIAS_MAP).join(', ')}`,
        422,
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) throw new AppError('User not found', 404);

    if (user.role === resolveBackendRole(requestedRole)) {
      throw new AppError('You already have this role', 400);
    }

    // Only allow one pending request at a time
    const existing = await prisma.roleRequest.findFirst({
      where: { userId, status: 'pending' },
    });
    if (existing) {
      throw new AppError('You already have a pending role request', 409);
    }

    const roleRequest = await prisma.roleRequest.create({
      data: {
        userId,
        requestedRole: resolveBackendRole(requestedRole),
        currentRole: user.role,
        reason: reason ?? null,
      },
    });

    logger.info('Role request submitted', { userId, requestedRole: roleRequest.requestedRole });

    res.status(201).json({ success: true, data: roleRequest });
  }),
);

// ─── GET /api/role-requests/mine ──────────────────────────────────────────────
router.get(
  '/mine',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const requests = await prisma.roleRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: requests });
  }),
);

// ─── GET /api/role-requests — list all (admin+) ───────────────────────────────
router.get(
  '/',
  requirePermission('manage_users'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const status = req.query.status as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      prisma.roleRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.roleRequest.count({ where }),
    ]);

    res.json({
      success: true,
      data: requests,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  }),
);

// ─── GET /api/role-requests/:id ───────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const request = await prisma.roleRequest.findUnique({ where: { id: req.params.id } });
    if (!request) throw new AppError('Role request not found', 404);

    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '') && request.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    res.json({ success: true, data: request });
  }),
);

// ─── POST /api/role-requests/:id/approve ─────────────────────────────────────
router.post(
  '/:id/approve',
  requirePermission('manage_users'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const reviewerId = req.user?.id;
    if (!reviewerId) throw new AppError('Authentication required', 401);

    const roleRequest = await prisma.roleRequest.findUnique({ where: { id: req.params.id } });
    if (!roleRequest) throw new AppError('Role request not found', 404);

    if (roleRequest.status !== 'pending') {
      throw new AppError(`Request is already ${roleRequest.status}`, 400);
    }

    const [updated] = await prisma.$transaction([
      prisma.roleRequest.update({
        where: { id: req.params.id },
        data: {
          status: 'approved',
          reviewedBy: reviewerId,
          reviewNote: req.body.reviewNote ?? null,
          reviewedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: roleRequest.userId },
        data: { role: roleRequest.requestedRole },
      }),
      prisma.activity.create({
        data: {
          type: 'system',
          action: 'updated',
          description: `Role changed to ${roleRequest.requestedRole} (approved request)`,
          userId: roleRequest.userId,
        },
      }),
    ]);

    logger.info('Role request approved', {
      requestId: req.params.id,
      userId: roleRequest.userId,
      newRole: roleRequest.requestedRole,
      approvedBy: reviewerId,
    });

    res.json({ success: true, data: updated });
  }),
);

// ─── POST /api/role-requests/:id/reject ──────────────────────────────────────
router.post(
  '/:id/reject',
  requirePermission('manage_users'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const reviewerId = req.user?.id;
    if (!reviewerId) throw new AppError('Authentication required', 401);

    const roleRequest = await prisma.roleRequest.findUnique({ where: { id: req.params.id } });
    if (!roleRequest) throw new AppError('Role request not found', 404);

    if (roleRequest.status !== 'pending') {
      throw new AppError(`Request is already ${roleRequest.status}`, 400);
    }

    const updated = await prisma.roleRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'rejected',
        reviewedBy: reviewerId,
        reviewNote: req.body.reason ?? req.body.reviewNote ?? null,
        reviewedAt: new Date(),
      },
    });

    logger.info('Role request rejected', {
      requestId: req.params.id,
      userId: roleRequest.userId,
      rejectedBy: reviewerId,
    });

    res.json({ success: true, data: updated });
  }),
);

export default router;
