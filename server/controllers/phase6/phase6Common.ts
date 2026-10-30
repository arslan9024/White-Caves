/**
 * Phase 6 Microservices Common Service Instances & Auth Middleware
 */

import { Request, Response, NextFunction } from 'express';
import MessageQueueService from '../../queue/queue.service.js';
import AnalyticsService from '../../analytics/analytics.service.js';
import NotificationService from '../../notifications/notification.service.js';
import EncryptionService from '../../security/encryption.service.js';
import PresenceAndSyncService from '../../presence/presence.service.js';

// Service singletons
export const queueService = new MessageQueueService();
export const analyticsService = new AnalyticsService();
export const notificationService = new NotificationService();
export const encryptionService = new EncryptionService();
export const presenceService = new PresenceAndSyncService();

/**
 * Header-based authorization middleware for microservice communication
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  (req as any).userId = userId;
  next();
};

