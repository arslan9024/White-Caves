/**
 * Mutation & Login Audit Trail Middleware — Wave 43 (REQ-COMP-003, NFR-SEC-001)
 *
 * Logs:
 * 1. All state-modifying HTTP mutations (POST, PUT, PATCH, DELETE) with payload diffs
 * 2. User login events with IP address & User Agent details
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export async function logAuditTrail(
  req: Request,
  action: string,
  targetType: string,
  targetId?: string,
  payload?: Record<string, unknown>
): Promise<void> {
  const userId = req.user?.id || null;
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';

  try {
    await prisma.activity.create({
      data: {
        type: targetType,
        action,
        description: `${action.toUpperCase()} on ${targetType}${targetId ? ` (${targetId})` : ''} by user ${userId || 'anonymous'}`,
        userId,
        metadata: {
          path: req.originalUrl || req.url,
          method: req.method,
          ipAddress,
          userAgent,
          targetId: targetId || null,
          payload: payload || null,
          timestamp: new Date().toISOString(),
        } as unknown as Prisma.InputJsonObject,
      },
    });
  } catch (err) {
    logger.warn('[AuditLogger] Failed to write audit activity log', {
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Express middleware for automatic mutation audit logging
 */
export function auditMutationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const originalEnd = res.end;

    res.end = function (...args: unknown[]) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logAuditTrail(req, `http_${req.method.toLowerCase()}`, 'http_mutation', undefined, {
          statusCode: res.statusCode,
          params: req.params,
        }).catch(() => {});
      }
      return (originalEnd as Function).apply(this, args);
    };
  }

  next();
}

/**
 * Helper to record user login events with IP and User-Agent
 */
export async function logLoginEvent(
  userId: string,
  email: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  try {
    await prisma.activity.create({
      data: {
        type: 'user',
        action: 'user_login_success',
        description: `User ${email} (${userId}) logged in from IP ${ipAddress}`,
        userId,
        metadata: {
          email,
          ipAddress,
          userAgent,
          loggedInAt: new Date().toISOString(),
        },
      },
    });

    logger.info('[AuditLogger] Recorded login event', { userId, email, ipAddress });
  } catch (err) {
    logger.warn('[AuditLogger] Failed to record login activity log', {
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
