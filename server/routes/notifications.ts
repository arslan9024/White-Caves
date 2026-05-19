/**
 * Notifications API Routes — Full CRUD Implementation
 * In-app notification management for authenticated users
 * Endpoints: /api/notifications
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';

const VALID_NOTIFICATION_TYPES = [
  'info',
  'success',
  'warning',
  'error',
  'lead',
  'property',
  'commission',
  'system',
] as const;
const VALID_CHANNELS = ['in_app', 'email', 'whatsapp'] as const;

const router = Router();
const db = prisma as any;

// ─── GET /api/notifications ─────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { read } = req.query;

    const {
      page: pageNum,
      limit,
      skip,
    } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where: Record<string, unknown> = { userId };
    if (read === 'true') where.read = true;
    if (read === 'false') where.read = false;

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.notification.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page: pageNum,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

// ─── GET /api/notifications/unread-count ────────────────────────────────
router.get(
  '/unread-count',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const count = await db.notification.count({
      where: { userId, read: false },
    });

    res.status(200).json({ success: true, data: { unreadCount: count } });
  })
);

// ─── PATCH /api/notifications/read-all ──────────────────────────────────
router.patch(
  '/read-all',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const result = await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.status(200).json({
      success: true,
      data: { updated: result.count },
      message: `${result.count} notification(s) marked as read`,
    });
  })
);

// ─── PATCH /api/notifications/:id/read ──────────────────────────────────
router.patch(
  '/:id/read',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Notification ID');
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const notification = await db.notification.findUnique({ where: { id } });
    if (!notification) throw new AppError('Notification not found', 404);
    if (notification.userId !== userId) {
      throw new AppError('Access denied — you can only read your own notifications', 403);
    }

    const updated = await db.notification.update({
      where: { id },
      data: { read: true },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

// ─── DELETE /api/notifications/:id ──────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Notification ID');
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const notification = await db.notification.findUnique({ where: { id } });
    if (!notification) throw new AppError('Notification not found', 404);
    if (notification.userId !== userId) {
      throw new AppError('Access denied — you can only delete your own notifications', 403);
    }

    await db.notification.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Notification deleted' });
  })
);

// ─── POST /api/notifications ────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only admin/system can create notifications (for testing/system use)
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — notification creation requires admin role', 403);
    }

    const { userId, type, channel, title, message, metadata } = req.body;

    validate(req.body, {
      userId: rules.requiredMongoId('User ID'),
      title: rules.requiredStringWithMax('Title', 255),
      message: rules.requiredStringWithMax('Message', 2000),
      type: rules.oneOf('Type', [...VALID_NOTIFICATION_TYPES]),
      channel: rules.oneOf('Channel', [...VALID_CHANNELS]),
    });

    const notification = await db.notification.create({
      data: {
        userId,
        type: type || 'info',
        channel: channel || 'in_app',
        title: sanitizeString(title.trim()),
        message: sanitizeString(message.trim()),
        metadata: metadata || null,
      },
    });

    res.status(201).json({ success: true, data: notification });
  })
);

export default router;
