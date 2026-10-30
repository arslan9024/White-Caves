/**
 * User Profile Controllers
 * Single Purpose: Fetch and update the authenticated user's profile.
 */

import { Response } from 'express';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../database.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { RouteRequest, db, resolveProfileCompletion } from './authCommon.js';

export const getProfileHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const userId = req.user?.id;
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
        passwordHash: true,
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

    const { passwordHash, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: {
        ...safeUser,
        hasPassword: Boolean(passwordHash),
        ...resolveProfileCompletion(user),
        twoFactorEnabled: Boolean(
          (user as Record<string, unknown>).twoFactorEnabled ??
            (user as Record<string, unknown>).totpEnabled
        ),
      },
    });
  });

export const patchProfileHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    const { name, phone, photoUrl } = req.body;
    const data: Record<string, unknown> = {};
    if (name !== undefined) {
      const sanitized = sanitizeString(name.trim());
      if (sanitized.length > 100) throw new AppError('Name must be 100 characters or less', 400);
      data.name = sanitized;
    }
    if (phone !== undefined) {
      const sanitized = sanitizeString((phone || '').trim());
      if (sanitized.length > 30) throw new AppError('Phone must be 30 characters or less', 400);
      data.phone = sanitized || null;
    }
    if (photoUrl !== undefined) {
      const url = (photoUrl || '').trim();
      if (url && !/^https?:\/\//i.test(url))
        throw new AppError('Photo URL must be a valid HTTP/HTTPS URL', 400);
      if (url.length > 500) throw new AppError('Photo URL must be 500 characters or less', 400);
      data.photoUrl = url || null;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        photoUrl: true,
      },
    });

    res.status(200).json({ success: true, data: user });
  });
