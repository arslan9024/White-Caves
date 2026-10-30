/**
 * Phase 6 Message Queue Controller
 * Endpoints for enqueuing distributed tasks, tracking execution, and managing DLQ retries.
 */

import { Request, Response } from 'express';
import logger from '../../utils/logger.js';
import { queueService, analyticsService } from './phase6Common.js';

export const addTask = (req: Request, res: Response): void => {
  try {
    const { type, data, priority = 'normal', maxAttempts = 3 } = req.body;

    if (!type || !data) {
      res.status(400).json({ error: 'Type and data are required' });
      return;
    }

    const taskId = queueService.addTask(type, data, priority, maxAttempts);
    analyticsService.trackEvent((req as any).userId, 'queue_task_added', { type });

    res.json({ taskId, status: 'queued' });
  } catch (error) {
    logger.error('Failed to add queue task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
};

export const getTaskStatus = (req: Request, res: Response): void => {
  const { taskId } = req.params as Record<string, string>;
  const task = queueService.getTaskStatus(taskId);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(task);
};

export const getQueueStats = (_req: Request, res: Response): void => {
  const stats = queueService.getStats();
  const metrics = queueService.getMetrics();

  res.json({ stats, metrics });
};

export const getDlq = (_req: Request, res: Response): void => {
  const dlq = queueService.getDeadLetterQueue();
  res.json({ items: dlq, count: dlq.length });
};

export const retryDlqTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params as Record<string, string>;
  const success = await queueService.retryFromDLQ(taskId);

  if (!success) {
    res.status(404).json({ error: 'Task not found in DLQ' });
    return;
  }

  res.json({ message: 'Task retry scheduled' });
};

