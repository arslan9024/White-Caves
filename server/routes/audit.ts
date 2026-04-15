/**
 * Audit Log API Routes — White Caves CRM
 * Endpoints: /api/audit
 * 
 * Admin-only endpoints for reviewing the system audit trail.
 * Required for RERA compliance in Dubai real estate.
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { auditService } from '../services/auditService.js';
import { requireRole } from '../middleware/rbac.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// ─── GET /api/audit — List audit log entries (admin only) ──────────────
router.get(
  '/',
  requireRole('owner'),
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 50, 100);
    const entity = req.query.entity as string | undefined;
    const userId = req.query.userId as string | undefined;
    const action = req.query.action as string | undefined;

    const result = await auditService.getRecent({ page, limit, entity, userId, action });
    sendSuccess(res, result.entries, 'OK', 200, result.pagination);
  })
);

// ─── GET /api/audit/stats — Audit statistics (admin only) ──────────────
router.get(
  '/stats',
  requireRole('owner'),
  asyncHandler(async (req: Request, res: Response) => {
    const sinceStr = req.query.since as string | undefined;
    const since = sinceStr ? new Date(sinceStr) : undefined;

    if (since && isNaN(since.getTime())) {
      throw new AppError('Invalid "since" date format', 400);
    }

    const stats = await auditService.getStats(since);
    sendSuccess(res, stats);
  })
);

export default router;
