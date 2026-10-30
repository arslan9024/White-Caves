/**
 * User Mutation Controller
 * Handles user profile, role updates, and account status transitions with audit logging.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { resolveBackendRole } from '../../middleware/rbac.js';
import {
  ALL_VALID_ROLES,
  VALID_STATUSES,
  UserStatus,
  routeParamToString,
} from './userCommon.js';

export const updateUser = async (req: Request, res: Response): Promise<void> => {
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
    // Resolve alias → canonical (e.g. 'managing_director' → 'owner')
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
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
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
};

