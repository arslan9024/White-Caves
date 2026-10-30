/**
 * Security & Lockout Unlock Controller
 * Single Purpose: Inspect failed login attempts and unlock accounts or IPs.
 */

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import { db, getClientIp, LOGIN_LOCKOUT_WINDOW_MINUTES } from './authCommon.js';

export const getLoginAttemptsHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const status = String(req.query.status || 'all').toLowerCase();
    const emailFilter = req.query.email ? String(req.query.email).toLowerCase().trim() : null;
    const rawLimit = Number.parseInt(String(req.query.limit ?? '50'), 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 200) : 50;
    const rawSince = Number.parseInt(String(req.query.sinceMinutes ?? '1440'), 10);
    const sinceMinutes = Number.isFinite(rawSince)
      ? Math.min(Math.max(rawSince, 1), 60 * 24 * 30)
      : 1440;

    const actions: string[] =
      status === 'failed'
        ? ['login_failed']
        : status === 'success'
          ? ['login']
          : status === 'password'
            ? ['password_changed', 'password_change_failed']
            : [
                'login',
                'login_failed',
                'password_changed',
                'password_change_failed',
                'account_unlocked',
                'ip_unlocked',
              ];

    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);

    const where: Prisma.ActivityWhereInput = {
      type: 'system',
      action: { in: actions },
      createdAt: { gte: since },
    };

    if (emailFilter) {
      where.OR = [
        { description: { contains: emailFilter, mode: 'insensitive' } },
        { user: { is: { email: { contains: emailFilter, mode: 'insensitive' } } } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, email: true, name: true, role: true } } },
    });

    res.status(200).json({
      success: true,
      data: activities.map(a => ({
        id: a.id,
        action: a.action,
        description: a.description,
        createdAt: a.createdAt,
        userId: a.userId,
        user: a.user,
        metadata: a.metadata,
      })),
      meta: { count: activities.length, limit, sinceMinutes, status, emailFilter },
    });
  });

export const unlockAccountHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const { userId, email } = req.body || {};
    if (!userId && !email) {
      throw new AppError('Provide either userId or email', 400);
    }

    const target = userId
      ? await prisma.user.findUnique({ where: { id: String(userId) } })
      : await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });

    if (!target) throw new AppError('User not found', 404);

    const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
    const result = await prisma.activity.deleteMany({
      where: {
        type: 'system',
        action: 'login_failed',
        userId: target.id,
        createdAt: { gte: since },
      },
    });

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'account_unlocked',
        description: `Account ${target.email} unlocked by ${req.user?.email || req.user?.id} (${result.count} failed attempts cleared)`,
        userId: target.id,
        metadata: {
          unlockedBy: req.user?.id,
          unlockedByEmail: req.user?.email,
          clearedFailures: result.count,
          ip,
          userAgent,
        } as Prisma.InputJsonValue,
      },
    });

    logger.info('Account unlocked by admin', {
      targetUserId: target.id,
      targetEmail: target.email,
      adminId: req.user?.id,
      clearedFailures: result.count,
    });

    res.status(200).json({
      success: true,
      data: {
        userId: target.id,
        email: target.email,
        clearedFailures: result.count,
      },
    });
  });

export const unlockIpHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const ipRaw = typeof req.body?.ip === 'string' ? req.body.ip.trim() : '';
    if (!ipRaw) throw new AppError('Provide an ip address to unlock', 400);
    if (ipRaw.length > 64) throw new AppError('Invalid ip address', 400);

    const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
    const result = await prisma.activity.deleteMany({
      where: {
        type: 'system',
        action: 'login_failed',
        createdAt: { gte: since },
        metadata: { path: ['ip'], equals: ipRaw } as Prisma.JsonFilter,
      },
    });

    const adminIp = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'ip_unlocked',
        description: `IP ${ipRaw} unlocked by ${req.user?.email || req.user?.id} (${result.count} failed attempts cleared)`,
        userId: req.user?.id,
        metadata: {
          unlockedIp: ipRaw,
          unlockedBy: req.user?.id,
          unlockedByEmail: req.user?.email,
          clearedFailures: result.count,
          ip: adminIp,
          userAgent,
        } as Prisma.InputJsonValue,
      },
    });

    logger.info('IP unlocked by admin', {
      ip: ipRaw,
      adminId: req.user?.id,
      clearedFailures: result.count,
    });

    res.status(200).json({
      success: true,
      data: { ip: ipRaw, clearedFailures: result.count },
    });
  });
