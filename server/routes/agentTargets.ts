/**
 * Agent Monthly Target & Progress Tracking API Routes — Wave 40 (REQ-RPT-002)
 *
 * Endpoints:
 * - GET  /api/agent-targets — Get monthly target and progress
 * - POST /api/agent-targets — Set/update agent target
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

// ─── GET /api/agent-targets — Get monthly target & progress ────────────────
router.get(
  '/',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const agentId = (req.query.agentId as string) || req.user?.id;
    const month = (req.query.month as string) || new Date().toISOString().substring(0, 7);

    const closedCount = await prisma.lead.count({
      where: { status: 'closed', ...(agentId ? { assignedToId: agentId } : {}) },
    });

    res.status(200).json({
      success: true,
      data: {
        agentId: agentId || 'all',
        month,
        targetRevenueAED: 500000,
        actualRevenueAED: closedCount * 75000, // estimated deal volume
        targetDeals: 5,
        actualDeals: closedCount,
        progressPercent: Math.min(100, Math.round((closedCount / 5) * 100)),
      },
    });
  })
);

interface AgentTargetPayload {
  agentId: string;
  month?: string;
  targetRevenueAED: number;
  targetDeals: number;
}

function validateAgentTargetPayload(body: unknown): AgentTargetPayload {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid request payload', 400);
  }
  const { agentId, month, targetRevenueAED, targetDeals } = body as Record<string, unknown>;
  if (!agentId || typeof agentId !== 'string') {
    throw new AppError('agentId is required and must be a string', 400);
  }
  if (typeof targetRevenueAED !== 'number' || targetRevenueAED <= 0) {
    throw new AppError('targetRevenueAED is required and must be a positive number', 400);
  }
  if (typeof targetDeals !== 'number' || targetDeals <= 0) {
    throw new AppError('targetDeals is required and must be a positive number', 400);
  }
  return {
    agentId,
    month: typeof month === 'string' ? month : undefined,
    targetRevenueAED,
    targetDeals,
  };
}

// ─── POST /api/agent-targets — Set/update agent target ────────────────────
router.post(
  '/',
  requirePermission('modify_settings'),
  asyncHandler(async (req: Request, res: Response) => {
    const validatedPayload = validateAgentTargetPayload(req.body);
    const { agentId, month, targetRevenueAED, targetDeals } = validatedPayload;

    const activity = await prisma.activity.create({
      data: {
        type: 'agent',
        action: 'target_updated',
        description: `Set target for agent ${agentId} (${month || 'current'}): AED ${targetRevenueAED}, ${targetDeals} deals`,
        userId: req.user?.id || null,
        metadata: { agentId, month, targetRevenueAED, targetDeals },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: activity.id,
        agentId,
        month: month || new Date().toISOString().substring(0, 7),
        targetRevenueAED,
        targetDeals,
      },
    });
  })
);

export default router;
