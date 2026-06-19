/**
 * Users API Routes — Full User Management
 * Endpoints: /api/users
 *
 * Provides admin-level CRUD over all platform users (all roles).
 * Separate from /api/agents which is specific to agent performance data.
 *
 * Access control:
 *   GET /                  â€” requireMinRole('admin')
 *   GET /me                â€” any authenticated user
 *   GET /pending           â€” requireMinRole('admin')
 *   GET /:id               â€” requireMinRole('admin')
 *   PATCH /:id             â€” requireRole('owner') â€” change role / status
 *   PATCH /:id/status      â€” requireMinRole('admin') â€” activate / suspend
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import {
  requireRole,
  requireMinRole,
  ROLE_ALIAS_MAP,
  resolveBackendRole,
} from '../middleware/rbac';

const router = Router();

const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

// All role strings accepted by the PATCH endpoint.
// Includes both canonical backend roles and frontend UI aliases.
const ALL_VALID_ROLES = Object.keys(ROLE_ALIAS_MAP);

// Valid status strings
const VALID_STATUSES = ['active', 'pending', 'inactive', 'suspended', 'rejected'] as const;
type UserStatus = (typeof VALID_STATUSES)[number];

// â”€â”€â”€ GET /api/users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * List all users across all roles. Requires admin or above.
 * Supports: role, status, search, page, pageSize filters.
 */
router.get(
  '/',
  requireMinRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// â”€â”€â”€ GET /api/users/me â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Return the currently authenticated user's profile.
 * Any authenticated user can call this.
 */
router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// â”€â”€â”€ GET /api/users/pending â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * List users whose status is 'pending' (awaiting admin approval).
 * Used by the managing director to approve or reject new staff sign-ups.
 * Requires admin role or above.
 */
router.get(
  '/pending',
  requireMinRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// â”€â”€â”€ GET /api/users/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Get a single user by ID. Requires admin or above.
 */
router.get(
  '/:id',
  requireMinRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// â”€â”€â”€ PATCH /api/users/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Update a user's role, status, department, name, or phone.
 * Only the owner (managing director) can change roles.
 * Admins can change status only.
 *
 * @body role?       â€” new role string (owner-only)
 * @body status?     â€” 'active' | 'pending' | 'inactive' | 'suspended' | 'rejected'
 * @body department? â€” department string
 * @body name?       â€” display name
 * @body phone?      â€” phone number
 */
router.patch(
  '/:id',
  requireRole('owner'),
  asyncHandler(async (req: Request, res: Response) => {
    const targetId = routeParamToString(req.params.id);
    if (!targetId) {
      throw new AppError('User ID is required', 400);
    }

    validateIdParam(targetId, 'User ID');

    const requesterId = (req as AuthRequest).user?.id;

    // Owners cannot remove their own owner role (safety guard)
    if (
      requesterId === targetId &&
      req.body.role &&
      resolveBackendRole(req.body.role) !== 'owner'
    ) {
      throw new AppError('You cannot downgrade your own owner role', 403);
    }

    const { role, status, department, name, phone } = req.body;
    const data: Record<string, unknown> = {};

    // Validate role early (before DB lookup) to return 400 fast on bad input
    let canonicalRole: string | undefined;
    if (role !== undefined) {
      const rawRole = String(role).toLowerCase().trim();
      if (!ALL_VALID_ROLES.includes(rawRole)) {
        throw new AppError(`Invalid role. Must be one of: ${ALL_VALID_ROLES.join(', ')}`, 400);
      }
      // Resolve alias â†’ canonical (e.g. 'managing_director' â†’ 'owner')
      canonicalRole = resolveBackendRole(rawRole);
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status as UserStatus)) {
        throw new AppError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
      }
      data.status = status as string;
    }

    if (department !== undefined) {
      data.department = sanitizeString(String(department || '').trim()) || null;
    }

    if (name !== undefined) {
      const sanitized = sanitizeString(String(name).trim());
      if (sanitized.length > 100) throw new AppError('Name must be 100 characters or less', 400);
      data.name = sanitized;
    }

    if (phone !== undefined) {
      const sanitized = sanitizeString(String(phone || '').trim());
      if (sanitized.length > 30) throw new AppError('Phone must be 30 characters or less', 400);
      data.phone = sanitized || null;
    }

    if (canonicalRole === undefined && Object.keys(data).length === 0) {
      throw new AppError('No valid fields provided to update', 400);
    }
    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) throw new AppError('User not found', 404);

    if (canonicalRole !== undefined) {
      // Guard: prevent demoting the last active owner in the system
      if (target.role === 'owner' && canonicalRole !== 'owner') {
        const ownerCount = await prisma.user.count({
          where: { role: 'owner', status: 'active' },
        });
        if (ownerCount <= 1) {
          throw new AppError(
            'Cannot demote the last active owner. Promote another user to owner first.',
            409
          );
        }
      }
      data.role = canonicalRole; // Always persist canonical role, never an alias
    }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        status: true,
        phone: true,
        photoUrl: true,
        updatedAt: true,
      },
    });

    // Audit trail
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'updated',
        description: `User ${target.email} updated by ${requesterId}: ${JSON.stringify(data)}`,
        userId: requesterId ?? null,
      },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

// â”€â”€â”€ PATCH /api/users/:id/status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Activate, suspend, or reject a user. Requires admin or above.
 * The owner-only PATCH /:id endpoint also handles this â€” this is a
 * convenience endpoint for the approval flow (admin can approve pending users).
 *
 * @body status â€” 'active' | 'pending' | 'inactive' | 'suspended' | 'rejected'
 */
router.patch(
  '/:id/status',
  requireMinRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = routeParamToString(req.params.id);
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    validateIdParam(userId, 'User ID');

    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status as UserStatus)) {
      throw new AppError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }
    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new AppError('User not found', 404);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status: status as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    const requesterId = (req as AuthRequest).user?.id;
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'updated',
        description: `User ${target.email} status set to '${status}' by ${requesterId}`,
        userId: requesterId ?? null,
      },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

export default router;
