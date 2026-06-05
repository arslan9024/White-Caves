// @ts-nocheck
import express, { Router, Request, Response, NextFunction } from 'express';
import MessageQueueService from '../queue/queue.service.js';
import AnalyticsService from '../analytics/analytics.service.js';
import NotificationService from '../notifications/notification.service.js';
import EncryptionService from '../security/encryption.service.js';
import PresenceAndSyncService from '../presence/presence.service.js';
import logger from '../utils/logger.js';

// Initialize services
const queueService = new MessageQueueService();
const analyticsService = new AnalyticsService();
const notificationService = new NotificationService();
const encryptionService = new EncryptionService();
const presenceService = new PresenceAndSyncService();

// Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  (req as any).userId = userId;
  next();
};

const router = Router();

// ============ QUEUE ENDPOINTS ============

/**
 * Add task to queue
 */
router.post('/queue/tasks', requireAuth, (req: Request, res: Response) => {
  try {
    const { type, data, priority = 'normal', maxAttempts = 3 } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    const taskId = queueService.addTask(type, data, priority, maxAttempts);

    analyticsService.trackEvent((req as any).userId, 'queue_task_added', { type });

    res.json({ taskId, status: 'queued' });
  } catch (error) {
    logger.error('Failed to add queue task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

/**
 * Get task status
 */
router.get('/queue/tasks/:taskId', requireAuth, (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = queueService.getTaskStatus(taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

/**
 * Get queue stats
 */
router.get('/queue/stats', requireAuth, (req: Request, res: Response) => {
  const stats = queueService.getStats();
  const metrics = queueService.getMetrics();

  res.json({ stats, metrics });
});

/**
 * Get dead letter queue
 */
router.get('/queue/dlq', requireAuth, (req: Request, res: Response) => {
  const dlq = queueService.getDeadLetterQueue();
  res.json({ items: dlq, count: dlq.length });
});

/**
 * Retry task from DLQ
 */
router.post('/queue/dlq/:taskId/retry', requireAuth, async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const success = await queueService.retryFromDLQ(taskId);

  if (!success) {
    return res.status(404).json({ error: 'Task not found in DLQ' });
  }

  res.json({ message: 'Task retry scheduled' });
});

// ============ ANALYTICS ENDPOINTS ============

/**
 * Track event
 */
router.post('/analytics/events', requireAuth, (req: Request, res: Response) => {
  const { eventType, metadata } = req.body;

  if (!eventType) {
    return res.status(400).json({ error: 'Event type is required' });
  }

  analyticsService.trackEvent((req as any).userId, eventType, metadata);

  res.json({ message: 'Event tracked' });
});

/**
 * Get dashboard metrics
 */
router.get('/analytics/dashboard', requireAuth, (req: Request, res: Response) => {
  const metrics = analyticsService.getDashboardMetrics();
  res.json(metrics);
});

/**
 * Get user analytics
 */
router.get('/analytics/users/:userId', requireAuth, (req: Request, res: Response) => {
  const { userId } = req.params;
  const analytics = analyticsService.getUserAnalytics(userId);

  if (!analytics) {
    return res.status(404).json({ error: 'No analytics found for user' });
  }

  res.json(analytics);
});

/**
 * Get user behavior patterns
 */
router.get('/analytics/users/:userId/patterns', requireAuth, (req: Request, res: Response) => {
  const { userId } = req.params;
  const patterns = analyticsService.getUserBehaviorPatterns(userId);

  res.json(patterns);
});

/**
 * Get analytics by time range
 */
router.get('/analytics/range', requireAuth, (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start and end dates are required' });
  }

  const analytics = analyticsService.getAnalyticsByTimeRange(
    new Date(startDate as string),
    new Date(endDate as string)
  );

  res.json(analytics);
});

/**
 * Export analytics to CSV
 */
router.get('/analytics/export/csv', requireAuth, (req: Request, res: Response) => {
  const csv = analyticsService.exportAnalyticsToCSV();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
  res.send(csv);
});

// ============ NOTIFICATION ENDPOINTS ============

/**
 * Subscribe device for push notifications
 */
router.post('/notifications/subscribe', requireAuth, (req: Request, res: Response) => {
  const { subscription } = req.body;

  if (!subscription) {
    return res.status(400).json({ error: 'Subscription is required' });
  }

  const success = notificationService.subscribeDevice((req as any).userId, subscription);

  if (!success) {
    return res.status(500).json({ error: 'Failed to subscribe device' });
  }

  res.json({ message: 'Device subscribed' });
});

/**
 * Get notification preferences
 */
router.get('/notifications/preferences', requireAuth, (req: Request, res: Response) => {
  const preferences = notificationService.getPreferences((req as any).userId);
  res.json(preferences);
});

/**
 * Update notification preferences
 */
router.put('/notifications/preferences', requireAuth, (req: Request, res: Response) => {
  const preferences = req.body;
  notificationService.setPreferences((req as any).userId, preferences);

  res.json({ message: 'Preferences updated' });
});

/**
 * Get notification log
 */
router.get('/notifications/log', requireAuth, (req: Request, res: Response) => {
  const { limit = 50 } = req.query;
  const logs = notificationService.getNotificationLog((req as any).userId, Number(limit));

  res.json({ notifications: logs, count: logs.length });
});

/**
 * Get notification stats
 */
router.get('/notifications/stats', requireAuth, (req: Request, res: Response) => {
  const stats = notificationService.getStats((req as any).userId);
  res.json(stats);
});

// ============ ENCRYPTION ENDPOINTS ============

/**
 * Generate user key pair
 */
router.post('/encryption/keys/generate', requireAuth, (req: Request, res: Response) => {
  const keyPair = encryptionService.generateUserKeyPair((req as any).userId);

  res.json({
    keyId: keyPair.keyId,
    publicKey: keyPair.publicKey,
    createdAt: keyPair.createdAt,
    expiresAt: keyPair.expiresAt,
  });
});

/**
 * Get user public key
 */
router.get('/encryption/keys/public/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const publicKey = encryptionService.getUserPublicKey(userId);

  if (!publicKey) {
    return res.status(404).json({ error: 'Public key not found' });
  }

  res.json({ publicKey });
});

/**
 * Encrypt message
 */
router.post('/encryption/messages/encrypt', requireAuth, (req: Request, res: Response) => {
  const { message, key } = req.body;

  if (!message || !key) {
    return res.status(400).json({ error: 'Message and key are required' });
  }

  const encrypted = encryptionService.encryptMessage(message, key);

  analyticsService.trackEvent((req as any).userId, 'message_encrypted');

  res.json(encrypted);
});

/**
 * Decrypt message
 */
router.post('/encryption/messages/decrypt', requireAuth, (req: Request, res: Response) => {
  const { encrypted, key } = req.body;

  if (!encrypted || !key) {
    return res.status(400).json({ error: 'Encrypted message and key are required' });
  }

  try {
    const decrypted = encryptionService.decryptMessage(encrypted, key);

    analyticsService.trackEvent((req as any).userId, 'message_decrypted');

    res.json({ message: decrypted });
  } catch (error) {
    logger.error('Decryption failed:', error);
    res.status(400).json({ error: 'Decryption failed' });
  }
});

/**
 * Get security metrics
 */
router.get('/encryption/metrics', requireAuth, (req: Request, res: Response) => {
  const metrics = encryptionService.getSecurityMetrics();
  res.json(metrics);
});

// ============ PRESENCE & SYNC ENDPOINTS ============

/**
 * Update user presence
 */
router.post('/presence/update', requireAuth, (req: Request, res: Response) => {
  const { status } = req.body;

  if (!status || !['online', 'offline', 'away', 'busy'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  presenceService.updatePresence((req as any).userId, status);

  res.json({ message: 'Presence updated' });
});

/**
 * Get user presence
 */
router.get('/presence/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const presence = presenceService.getPresence(userId);

  if (!presence) {
    return res.status(404).json({ error: 'Presence not found' });
  }

  res.json(presence);
});

/**
 * Get online users
 */
router.get('/presence', (req: Request, res: Response) => {
  const onlineUsers = presenceService.getOnlineUsers();
  res.json({ users: onlineUsers, count: onlineUsers.length });
});

/**
 * Get users in conversation
 */
router.get('/presence/conversations/:conversationId', (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const users = presenceService.getUsersInConversation(conversationId);

  res.json({ users, count: users.length });
});

/**
 * Get sync state
 */
router.get('/sync/state', requireAuth, (req: Request, res: Response) => {
  const syncState = presenceService.getSyncState((req as any).userId);
  res.json(syncState);
});

/**
 * Get changes since sync
 */
router.get('/sync/changes', requireAuth, (req: Request, res: Response) => {
  const { lastSyncTime } = req.query;

  if (!lastSyncTime) {
    return res.status(400).json({ error: 'Last sync time is required' });
  }

  const changes = presenceService.getChangesSinceSync(
    (req as any).userId,
    new Date(lastSyncTime as string)
  );

  res.json(changes);
});

/**
 * Get presence history
 */
router.get('/presence/:userId/history', requireAuth, (req: Request, res: Response) => {
  const { userId } = req.params;
  const { hoursBack = 24 } = req.query;

  const history = presenceService.getPresenceHistory(userId, Number(hoursBack));

  res.json({ history, count: history.length });
});

/**
 * Get presence analytics
 */
router.get('/presence/analytics/summary', requireAuth, (req: Request, res: Response) => {
  const { hoursBack = 24 } = req.query;

  const analytics = presenceService.getPresenceAnalytics(Number(hoursBack));

  res.json(analytics);
});

// ============ HEALTH CHECK ============

router.get('/health', (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    queue: queueService.getStats(),
    presence: presenceService.getHealth(),
    timestamp: new Date(),
  };

  res.json(health);
});

export { router as phase6Router };
export {
  queueService,
  analyticsService,
  notificationService,
  encryptionService,
  presenceService,
};
