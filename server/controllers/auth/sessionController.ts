/**
 * Session Management Controllers
 * Single Purpose: Handle user logout and JWT session token refresh.
 */

import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import { JWT_SECRET, BCRYPT_ROUNDS } from '../../config/env.js';
import { prisma } from '../../database.js';
import { clearCsrfToken, issueCsrfToken } from '../../middleware/csrf.js';
import { RouteRequest, db, JWT_SIGN_OPTIONS, resolveProfileCompletion } from './authCommon.js';

export const logoutHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'logout',
        description: 'User logged out',
        userId,
      },
    });

    // Invalidate refresh token in DB and clear the httpOnly cookie
    await prisma.user
      .update({ where: { id: userId }, data: { refreshTokenHash: null } })
      .catch(() => {
        /* ignore — user may already be deleted */
      });
    const logoutCookieValue = req.cookies?.refresh_token as string | undefined;
    if (logoutCookieValue && logoutCookieValue.includes(':')) {
      const cookieUserId = logoutCookieValue.slice(0, logoutCookieValue.indexOf(':'));
      if (cookieUserId && cookieUserId !== userId) {
        await prisma.user
          .update({ where: { id: cookieUserId }, data: { refreshTokenHash: null } })
          .catch(() => {
            /* ignore — user may already be deleted */
          });
      }
    }
    res.clearCookie('refresh_token', { path: '/api/auth' });
    clearCsrfToken(res);

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });

export const refreshHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const cookieValue = req.cookies?.refresh_token as string | undefined;
    if (!cookieValue || !cookieValue.includes(':')) {
      throw new AppError('No refresh token provided', 401);
    }

    const colonIdx = cookieValue.indexOf(':');
    const userId = cookieValue.slice(0, colonIdx);
    const rawToken = cookieValue.slice(colonIdx + 1);
    if (!userId || !rawToken) {
      throw new AppError('Malformed refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        refreshTokenHash: true,
      },
    });

    if (!user || !user.refreshTokenHash || user.status !== 'active') {
      res.clearCookie('refresh_token', { path: '/api/auth' });
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const isValid = await bcrypt.compare(rawToken, user.refreshTokenHash);
    if (!isValid) {
      // Possible token theft — invalidate every active session for this user
      await prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
      res.clearCookie('refresh_token', { path: '/api/auth' });
      throw new AppError('Refresh token reuse detected — all sessions invalidated', 401);
    }

    // Rotate: mint a new refresh token and persist the hash
    const newRawToken = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenHash = await bcrypt.hash(newRawToken, BCRYPT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: newRefreshTokenHash },
    });

    // Issue a new access token using the same payload shape as /login
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    // Write the rotated cookie
    res.cookie('refresh_token', `${user.id}:${newRawToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });
    issueCsrfToken(res);

    res.json({
      success: true,
      data: {
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  });
