/**
 * Phase 6 Notification Dispatcher Controller
 * Endpoints for web-push subscriptions, preference management, notification logs, and dispatch statistics.
 */

import { Request, Response } from 'express';
import { notificationService } from './phase6Common.js';

export const subscribeNotificationDevice = (req: Request, res: Response): void => {
  const { subscription } = req.body;

  if (!subscription) {
    res.status(400).json({ error: 'Subscription is required' });
    return;
  }

  const success = notificationService.subscribeDevice((req as any).userId, subscription);

  if (!success) {
    res.status(500).json({ error: 'Failed to subscribe device' });
    return;
  }

  res.json({ message: 'Device subscribed' });
};

export const getNotificationPreferences = (req: Request, res: Response): void => {
  const preferences = notificationService.getPreferences((req as any).userId);
  res.json(preferences);
};

export const updateNotificationPreferences = (req: Request, res: Response): void => {
  const preferences = req.body;
  notificationService.setPreferences((req as any).userId, preferences);
  res.json({ message: 'Preferences updated' });
};

export const getNotificationLog = (req: Request, res: Response): void => {
  const { limit = 50 } = req.query as Record<string, string | undefined>;
  const logs = notificationService.getNotificationLog((req as any).userId, Number(limit));
  res.json({ notifications: logs, count: logs.length });
};

export const getNotificationStats = (req: Request, res: Response): void => {
  const stats = notificationService.getStats((req as any).userId);
  res.json(stats);
};

