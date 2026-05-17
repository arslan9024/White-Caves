/**
 * Role Requests API Routes
 * ─────────────────────────────────────────────────────────────────────────
 * Self-service role elevation — any authenticated user can request a
 * different role; admins approve or reject.
 *
 * POST   /api/users/role-request              — Submit request (any user)
 * GET    /api/admin/role-requests             — List all requests (admin)
 * GET    /api/admin/role-requests/mine        — My own requests
 * POST   /api/admin/role-requests/:id/approve — Approve + set role (admin)
 * POST   /api/admin/role-requests/:id/reject  — Reject with reason (admin)
 */

import { Router, Response } from 'express';
import type { Request } from 'express';
import { randomUUID } from 'crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { requirePermission } from '../middleware/rbac.js';

export const roleRequestRouter = Router();
export const adminRoleRequestRouter = Router();

// Allowed roles a user can request elevation to
const REQUESTABLE_ROLES = [
  'agent',
  'senior_agent',
  'manager',
  'property_manager',
  'finance_manager',
  'compliance_officer',
  'marketing_specialist',
  'legal_counsel',
  'data_analyst',
  'it_admin',
] as const;

const mockRoleRequests: Array<Record<string, any>> = [];

const normalizeId = () => randomUUID().replace(/-/g, '').slice(0, 24);

const matchWhere = (item: Record<string, any>, where?: Record<string, any>) => {
  if (!where) return true;
  return Object.entries(where).every(([key, value]) => item[key] === value);
};

const createMockRoleRequestModel = () => ({
  findFirst: async ({ where }: any) => mockRoleRequests.find(r => matchWhere(r, where)) ?? null,

  findMany: async ({ where, orderBy }: any = {}) => {
    const rows = mockRoleRequests.filter(r => matchWhere(r, where));
    if (orderBy?.createdAt) {
      return rows.sort((a, b) => {
        const av = new Date(a.createdAt).getTime();
        const bv = new Date(b.createdAt).getTime();
        return orderBy.createdAt === 'asc' ? av - bv : bv - av;
      });
    }
    return rows;
  },

  findUnique: async ({ where }: any) => mockRoleRequests.find(r => r.id === where.id) ?? null,

  create: async ({ data }: any) => {
    const created = {
      id: normalizeId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockRoleRequests.push(created);
    return created;
  },

  update: async ({ where, data }: any) => {
    const idx = mockRoleRequests.findIndex(r => r.id === where.id);
    if (idx < 0) throw new AppError('Role request not found', 404);
    mockRoleRequests[idx] = {
      ...mockRoleRequests[idx],
      ...data,
      updatedAt: new Date(),
    };
    return mockRoleRequests[idx];
  },
});

const getRoleRequestModel = () => {
  const roleRequestModel = (prisma as unknown as { roleRequest?: any }).roleRequest;
  if (!roleRequestModel) {
    return createMockRoleRequestModel();
  }
  return roleRequestModel;
};

// ─── POST /api/users/role-request ────────────────────────────────────────
roleRequestRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const roleRequestModel = getRoleRequestModel();
    const { requestedRole, reason } = req.body;

    if (!requestedRole) throw new AppError('requestedRole is required', 400);
    if (!REQUESTABLE_ROLES.includes(requestedRole as (typeof REQUESTABLE_ROLES)[number])) {
      throw new AppError(`Invalid role. Allowed: ${REQUESTABLE_ROLES.join(', ')}`, 400);
    }

    validate(req.body, {
      reason: rules.optionalStringWithMax('Reason', 1000),
    });

    const currentRole = req.user?.role || 'guest';
    if (currentRole === requestedRole) {
      throw new AppError('You already have this role', 400);
    }

    // Check for an already-pending request for the same role
    const existing = await roleRequestModel.findFirst({
      where: {
        userId: req.user?.id as string,
        requestedRole,
        status: 'pending',
      },
    });
    if (existing) {
      throw new AppError('You already have a pending request for this role', 409);
    }

    const roleRequest = await roleRequestModel.create({
      data: {
        userId: req.user?.id as string,
        currentRole,
        requestedRole,
        reason: reason ? sanitizeString(reason) : null,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      data: roleRequest,
      message: 'Role request submitted — an administrator will review it shortly.',
    });
  })
);

// ─── GET /api/admin/role-requests/mine ──────────────────────────────────
adminRoleRequestRouter.get(
  '/mine',
  asyncHandler(async (req: Request, res: Response) => {
    const roleRequestModel = getRoleRequestModel();
    const requests = await roleRequestModel.findMany({
      where: { userId: req.user?.id as string },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: { requests } });
  })
);

// ─── GET /api/admin/role-requests ────────────────────────────────────────
adminRoleRequestRouter.get(
  '/',
  requirePermission('manage_users'),
  asyncHandler(async (req: Request, res: Response) => {
    const roleRequestModel = getRoleRequestModel();
    const { status } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status;
    }

    const requests = await roleRequestModel.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with requester info
    const userIds = Array.from(
      new Set(
        requests
          .map((r: { userId?: string | null }) => r.userId)
          .filter((id: string | null | undefined): id is string => Boolean(id))
      )
    ) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, role: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    const enriched = requests.map((r: { userId: string }) => ({
      ...r,
      user: userMap.get(r.userId) || null,
    }));

    res.status(200).json({ success: true, data: { requests: enriched } });
  })
);

// ─── POST /api/admin/role-requests/:id/approve ──────────────────────────
adminRoleRequestRouter.post(
  '/:id/approve',
  requirePermission('manage_users'),
  asyncHandler(async (req: Request, res: Response) => {
    const roleRequestModel = getRoleRequestModel();
    const { id } = req.params;
    validateIdParam(id, 'Role request ID');

    const roleReq = await roleRequestModel.findUnique({ where: { id } });
    if (!roleReq) throw new AppError('Role request not found', 404);
    if (roleReq.status !== 'pending') {
      throw new AppError(`Cannot approve a request with status "${roleReq.status}"`, 400);
    }

    const { reviewNote } = req.body;

    // Apply the role to the user
    await prisma.user.update({
      where: { id: roleReq.userId },
      data: { role: roleReq.requestedRole },
    });

    const updated = await roleRequestModel.update({
      where: { id },
      data: {
        status: 'approved',
        reviewNote: reviewNote ? sanitizeString(reviewNote) : null,
        reviewedById: req.user?.id || null,
        reviewedAt: new Date(),
      },
    });

    await prisma.activity.create({
      data: {
        type: 'user',
        action: 'role_approved',
        description: `Role request approved: user ${roleReq.userId} granted role "${roleReq.requestedRole}" by ${req.user?.email}`,
        userId: req.user?.id || null,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: `Role "${roleReq.requestedRole}" granted successfully.`,
    });
  })
);

// ─── POST /api/admin/role-requests/:id/reject ───────────────────────────
adminRoleRequestRouter.post(
  '/:id/reject',
  requirePermission('manage_users'),
  asyncHandler(async (req: Request, res: Response) => {
    const roleRequestModel = getRoleRequestModel();
    const { id } = req.params;
    validateIdParam(id, 'Role request ID');

    const roleReq = await roleRequestModel.findUnique({ where: { id } });
    if (!roleReq) throw new AppError('Role request not found', 404);
    if (roleReq.status !== 'pending') {
      throw new AppError(`Cannot reject a request with status "${roleReq.status}"`, 400);
    }

    const { reason, reviewNote } = req.body;
    validate(req.body, {
      reason: rules.optionalStringWithMax('Reason', 500),
      reviewNote: rules.optionalStringWithMax('Review note', 1000),
    });

    const updated = await roleRequestModel.update({
      where: { id },
      data: {
        status: 'rejected',
        reviewNote: reviewNote
          ? sanitizeString(reviewNote)
          : reason
            ? sanitizeString(reason)
            : null,
        reviewedById: req.user?.id || null,
        reviewedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Role request rejected.',
    });
  })
);
