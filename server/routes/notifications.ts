/**
 * Notification API Routes — White Caves CRM
 * Endpoints: /api/notifications
 * 
 * Provides REST endpoints for the notification bell / notification center UI.
 * All routes require authentication — users can only access their own notifications.
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { notificationService } from '../services/notificationService.js';
import { sendSuccess, sendError, buildPagination } from '../utils/apiResponse.js';
import { parsePagination } from '../config/pagination.js';

const router = Router();

// ─── GET /api/notifications — List user's notifications ────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { page: pageNum, limit } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const unreadOnly = req.query.unreadOnly === 'true';

    const result = await notificationService.getUserNotifications(userId, {
      page: pageNum,
      limit,
      unreadOnly,
    });

    sendSuccess(res, result.notifications, 'OK', 200, result.pagination);
  })
);

// ─── GET /api/notifications/count — Unread count (for badge) ───────────
router.get(
  '/count',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const count = await notificationService.getUnreadCount(userId);
    sendSuccess(res, { unread: count });
  })
);

// ─── POST /api/notifications/read — Mark specific notifications as read ─
router.post(
  '/read',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new AppError('ids must be a non-empty array of notification IDs', 400);
    }

    // Validate all IDs are strings
    if (!ids.every((id: unknown) => typeof id === 'string')) {
      throw new AppError('All notification IDs must be strings', 400);
    }

    const count = await notificationService.markAsRead(userId, ids);
    sendSuccess(res, { markedRead: count });
  })
);

// ─── POST /api/notifications/read-all — Mark all as read ───────────────
router.post(
  '/read-all',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const count = await notificationService.markAllAsRead(userId);
    sendSuccess(res, { markedRead: count });
  })
);

// ─── DELETE /api/notifications/:id — Dismiss a notification ────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    if (!id) throw new AppError('Notification ID required', 400);

    const dismissed = await notificationService.dismiss(userId, id);
    if (!dismissed) {
      return sendError(res, 404, 'Notification not found');
    }

    sendSuccess(res, { dismissed: true });
  })
);

export default router;
