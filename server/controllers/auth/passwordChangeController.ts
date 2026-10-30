/**
 * Password Change & Reset Completion Controller
 * Single Purpose: Finalize password reset or change authenticated user password.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import { JWT_SECRET } from '../../config/env.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import {
  RouteRequest,
  db,
  getClientIp,
  hashPassword,
  verifyPassword,
  hashResetToken,
  parseIsoDate,
  toMetadataRecord,
} from './authCommon.js';

export const forgotPasswordResetHandler =   asyncHandler(async (req: Request, res: Response) => {
    const resetSessionToken =
      typeof req.body?.resetSessionToken === 'string' ? req.body.resetSessionToken.trim() : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (!resetSessionToken || !newPassword) {
      throw new AppError('resetSessionToken and newPassword are required', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      throw new AppError('Password must contain at least one letter and one number', 400);
    }

    const weakPasswords = [
      'password',
      '12345678',
      'qwerty12',
      'abc12345',
      'admin123',
      'welcome1',
      'letmein12',
      'changeme',
    ];
    if (weakPasswords.includes(newPassword.toLowerCase())) {
      throw new AppError('Password is too common. Please choose a stronger password.', 400);
    }

    let payload: {
      purpose?: string;
      email?: string;
      tokenHash?: string;
      tokenActivityId?: string;
    };

    try {
      payload = jwt.verify(resetSessionToken, JWT_SECRET, {
        algorithms: ['HS256'],
      }) as {
        purpose?: string;
        email?: string;
        tokenHash?: string;
        tokenActivityId?: string;
      };
    } catch {
      throw new AppError('Reset session is invalid or expired', 401);
    }

    if (
      payload.purpose !== 'password_reset' ||
      !payload.email ||
      !payload.tokenHash ||
      !payload.tokenActivityId
    ) {
      throw new AppError('Reset session is invalid or expired', 401);
    }

    const tokenActivity = await prisma.activity.findUnique({
      where: { id: payload.tokenActivityId },
    });

    if (!tokenActivity) {
      throw new AppError('Reset token record was not found', 401);
    }

    const metadata = toMetadataRecord(tokenActivity.metadata);
    const expiresAt = parseIsoDate(metadata.expiresAt);
    const isUsed = metadata.used === true;
    const tokenHash = typeof metadata.tokenHash === 'string' ? metadata.tokenHash : '';
    const tokenEmail =
      typeof metadata.email === 'string' ? metadata.email.toLowerCase().trim() : '';

    if (
      isUsed ||
      !expiresAt ||
      expiresAt.getTime() <= Date.now() ||
      tokenHash !== payload.tokenHash ||
      tokenEmail !== payload.email.toLowerCase().trim()
    ) {
      throw new AppError('Reset token is invalid or expired', 401);
    }

    const user = await prisma.user.findUnique({ where: { email: tokenEmail } });
    if (!user) {
      throw new AppError('Reset token is invalid or expired', 401);
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword, refreshTokenHash: null },
    });
    res.clearCookie('refresh_token', { path: '/api/auth' });

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);

    const updatedTokenMetadata = {
      ...metadata,
      used: true,
      usedAt: new Date().toISOString(),
      usedByIp: ip,
    } as Prisma.InputJsonValue;

    await prisma.activity.update({
      where: { id: tokenActivity.id },
      data: { metadata: updatedTokenMetadata },
    });

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'password_reset_success',
        description: `Password reset completed for ${tokenEmail}`,
        userId: user.id,
        metadata: { email: tokenEmail, ip, userAgent } as Prisma.InputJsonValue,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        reset: true,
        message: 'Password has been reset successfully. Please sign in with your new password.',
      },
    });
  });

export const changePasswordHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400);
    }

    // Block common weak passwords
    const weakPasswords = [
      'password',
      '12345678',
      'qwerty12',
      'abc12345',
      'admin123',
      'welcome1',
      'letmein12',
      'changeme',
    ];
    if (weakPasswords.includes(newPassword.toLowerCase())) {
      throw new AppError('Password is too common. Please choose a stronger password.', 400);
    }

    // Require at least one letter and one number
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      throw new AppError('Password must contain at least one letter and one number', 400);
    }

    // Verify current password if one exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);

    const storedHash = user.passwordHash;
    if (storedHash) {
      if (!currentPassword) {
        // Fire-and-forget audit; never block the 400 response
        prisma.activity
          .create({
            data: {
              type: 'system',
              action: 'password_change_failed',
              description: `Password change rejected for ${user.email}: missing current password`,
              userId,
              metadata: {
                reason: 'missing_current_password',
                ip,
                userAgent,
              } as Prisma.InputJsonValue,
            },
          })
          .catch(err => logger.warn('Failed to audit password_change_failed', { err }));
        throw new AppError('Current password is required to change password', 400);
      }
      const valid = await verifyPassword(currentPassword, storedHash);
      if (!valid) {
        prisma.activity
          .create({
            data: {
              type: 'system',
              action: 'password_change_failed',
              description: `Password change rejected for ${user.email}: invalid current password`,
              userId,
              metadata: {
                reason: 'invalid_current_password',
                ip,
                userAgent,
              } as Prisma.InputJsonValue,
            },
          })
          .catch(err => logger.warn('Failed to audit password_change_failed', { err }));
        throw new AppError('Current password is incorrect', 401);
      }
    }

    // Hash and store the new password and invalidate active refresh sessions
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, refreshTokenHash: null },
    });
    res.clearCookie('refresh_token', { path: '/api/auth' });

    // Audit success
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'password_changed',
        description: `Password changed for ${user.email}`,
        userId,
        metadata: { ip, userAgent } as Prisma.InputJsonValue,
      },
    });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  });
