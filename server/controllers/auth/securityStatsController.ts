/**
 * Security Audit & Statistics Controller
 * Single Purpose: Query active lockouts and security telemetry.
 */

import { Response } from 'express';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../database.js';
import {
  LOGIN_LOCKOUT_WINDOW_MINUTES,
  LOGIN_LOCKOUT_THRESHOLD,
  LOGIN_IP_LOCKOUT_THRESHOLD,
} from './authCommon.js';

export const getActiveLockoutsHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
    const rows = await prisma.activity.findMany({
      where: {
        type: 'system',
        action: 'login_failed',
        createdAt: { gte: since },
      },
      select: {
        userId: true,
        createdAt: true,
        metadata: true,
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 5000,
    });

    interface Bucket {
      key: string;
      label: string | null;
      failures: number;
      oldest: Date;
    }
    const accountBuckets = new Map<string, Bucket>();
    const ipBuckets = new Map<string, Bucket>();

    for (const r of rows) {
      const md = (r.metadata || {}) as Record<string, unknown>;
      if (r.userId) {
        const b = accountBuckets.get(r.userId);
        if (b) {
          b.failures += 1;
        } else {
          accountBuckets.set(r.userId, {
            key: r.userId,
            label: r.user?.email ?? null,
            failures: 1,
            oldest: r.createdAt,
          });
        }
      }
      const ip = typeof md.ip === 'string' ? md.ip : null;
      if (ip && ip !== 'unknown') {
        const b = ipBuckets.get(ip);
        if (b) {
          b.failures += 1;
        } else {
          ipBuckets.set(ip, { key: ip, label: ip, failures: 1, oldest: r.createdAt });
        }
      }
    }

    const now = Date.now();
    const windowMs = LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000;
    const computeRetry = (oldest: Date): number =>
      Math.max(1, Math.ceil((oldest.getTime() + windowMs - now) / 1000));

    const accounts = [...accountBuckets.values()]
      .filter(b => b.failures >= LOGIN_LOCKOUT_THRESHOLD)
      .sort((a, b) => b.failures - a.failures)
      .map(b => ({
        userId: b.key,
        email: b.label,
        failures: b.failures,
        retryAfterSeconds: computeRetry(b.oldest),
      }));

    const ips = [...ipBuckets.values()]
      .filter(b => b.failures >= LOGIN_IP_LOCKOUT_THRESHOLD)
      .sort((a, b) => b.failures - a.failures)
      .map(b => ({
        ip: b.key,
        failures: b.failures,
        retryAfterSeconds: computeRetry(b.oldest),
      }));

    res.status(200).json({
      success: true,
      data: {
        windowMinutes: LOGIN_LOCKOUT_WINDOW_MINUTES,
        accountThreshold: LOGIN_LOCKOUT_THRESHOLD,
        ipThreshold: LOGIN_IP_LOCKOUT_THRESHOLD,
        accounts,
        ips,
      },
    });
  });

export const getSecurityStatsHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const rawSince = Number.parseInt(String(req.query.sinceMinutes ?? '1440'), 10);
    const sinceMinutes = Number.isFinite(rawSince)
      ? Math.min(Math.max(rawSince, 1), 60 * 24 * 30)
      : 1440;
    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);

    const trackedActions = [
      'login',
      'login_failed',
      'password_changed',
      'password_change_failed',
      'account_unlocked',
      'ip_unlocked',
    ];

    const rows = await prisma.activity.findMany({
      where: {
        type: 'system',
        action: { in: trackedActions },
        createdAt: { gte: since },
      },
      select: {
        action: true,
        description: true,
        metadata: true,
        user: { select: { email: true } },
      },
      take: 5000, // hard ceiling — we only need aggregates
    });

    const totals = {
      logins: 0,
      loginFailures: 0,
      passwordChanges: 0,
      passwordChangeFailures: 0,
      accountUnlocks: 0,
      ipUnlocks: 0,
    };

    const ipCounts = new Map<string, number>(); // failures by ip
    const emailCounts = new Map<string, number>(); // failures by targeted email
    const uniqueIps = new Set<string>();

    for (const r of rows) {
      const md = (r.metadata || {}) as Record<string, unknown>;
      const ip = typeof md.ip === 'string' ? md.ip : null;
      if (ip) uniqueIps.add(ip);

      switch (r.action) {
        case 'login':
          totals.logins += 1;
          break;
        case 'login_failed': {
          totals.loginFailures += 1;
          if (ip) ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
          const email =
            (typeof md.emailAttempt === 'string' && md.emailAttempt) || r.user?.email || null;
          if (email) emailCounts.set(email, (emailCounts.get(email) || 0) + 1);
          break;
        }
        case 'password_changed':
          totals.passwordChanges += 1;
          break;
        case 'password_change_failed':
          totals.passwordChangeFailures += 1;
          break;
        case 'account_unlocked':
          totals.accountUnlocks += 1;
          break;
        case 'ip_unlocked':
          totals.ipUnlocks += 1;
          break;
      }
    }

    const topOffendingIps = [...ipCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ip, failures]) => ({ ip, failures }));
    const topTargetedEmails = [...emailCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, failures]) => ({ email, failures }));

    res.status(200).json({
      success: true,
      data: {
        totals,
        uniqueIpCount: uniqueIps.size,
        topOffendingIps,
        topTargetedEmails,
        windowMinutes: sinceMinutes,
      },
    });
  });
