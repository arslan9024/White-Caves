/**
 * nadiaQueueController.ts
 * Handlers for prioritized conversation queue retrieval, queue statistics, and agent queue assignment.
 */

import { Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler.js';
import {
  getQueuedConversations,
  assignFromQueue,
  getQueueStats,
} from '../../services/nadia/queueManager.js';

export async function getQueue(req: Request, res: Response): Promise<void> {
  const { limit = 10 } = req.query as Record<string, string | undefined>;

  const queued = await getQueuedConversations(Math.min(parseInt(limit as string) || 10, 100));

  res.status(200).json({
    success: true,
    data: queued,
  });
}

export async function getQueueStatsHandler(_req: Request, res: Response): Promise<void> {
  const stats = await getQueueStats();

  res.status(200).json({
    success: true,
    data: {
      totalQueued: stats.totalQueued,
      byPriority: {
        URGENT: stats.hotCount,
        HIGH: stats.warmCount,
        NORMAL: 0,
        LOW: stats.coldCount,
      },
      avgResponseTimeMinutes: 0,
      agentAvailability: stats.totalQueued === 0 ? 100 : Math.max(0, 100 - stats.totalQueued * 5),
      oldestInQueueMinutes: stats.oldestWaitMinutes,
    },
  });
}

export async function assignQueueEntry(req: Request, res: Response): Promise<void> {
  const { queueId } = req.params as Record<string, string>;
  const { agentPhone } = req.body;

  if (!agentPhone) {
    throw new AppError('agentPhone is required', 400);
  }

  const assigned = await assignFromQueue(queueId, agentPhone);

  if (!assigned) {
    throw new AppError('Queue entry not found', 404);
  }

  res.status(200).json({
    success: true,
    data: assigned,
  });
}
