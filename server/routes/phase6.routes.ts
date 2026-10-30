import { Router } from 'express';
import {
  queueService,
  analyticsService,
  notificationService,
  encryptionService,
  presenceService,
  requireAuth,
  addTask,
  getTaskStatus,
  getQueueStats,
  getDlq,
  retryDlqTask,
  trackEvent,
  getDashboardMetrics,
  getUserAnalytics,
  getUserBehaviorPatterns,
  getAnalyticsRange,
  exportAnalyticsCsv,
  subscribeNotificationDevice,
  getNotificationPreferences,
  updateNotificationPreferences,
  getNotificationLog,
  getNotificationStats,
  generateKeyPair,
  getPublicKey,
  encryptMessage,
  decryptMessage,
  getSecurityMetrics,
  updatePresence,
  getUserPresence,
  getOnlineUsers,
  getConversationUsers,
  getSyncState,
  getSyncChanges,
  getPresenceHistory,
  getPresenceAnalyticsSummary,
  getHealth,
} from '../controllers/phase6/index.js';

const router = Router();

// ============ QUEUE ENDPOINTS ============
router.post('/queue/tasks', requireAuth, addTask);
router.get('/queue/tasks/:taskId', requireAuth, getTaskStatus);
router.get('/queue/stats', requireAuth, getQueueStats);
router.get('/queue/dlq', requireAuth, getDlq);
router.post('/queue/dlq/:taskId/retry', requireAuth, retryDlqTask);

// ============ ANALYTICS ENDPOINTS ============
router.post('/analytics/events', requireAuth, trackEvent);
router.get('/analytics/dashboard', requireAuth, getDashboardMetrics);
router.get('/analytics/users/:userId', requireAuth, getUserAnalytics);
router.get('/analytics/users/:userId/patterns', requireAuth, getUserBehaviorPatterns);
router.get('/analytics/range', requireAuth, getAnalyticsRange);
router.get('/analytics/export/csv', requireAuth, exportAnalyticsCsv);

// ============ NOTIFICATION ENDPOINTS ============
router.post('/notifications/subscribe', requireAuth, subscribeNotificationDevice);
router.get('/notifications/preferences', requireAuth, getNotificationPreferences);
router.put('/notifications/preferences', requireAuth, updateNotificationPreferences);
router.get('/notifications/log', requireAuth, getNotificationLog);
router.get('/notifications/stats', requireAuth, getNotificationStats);

// ============ ENCRYPTION ENDPOINTS ============
router.post('/encryption/keys/generate', requireAuth, generateKeyPair);
router.get('/encryption/keys/public/:userId', getPublicKey);
router.post('/encryption/messages/encrypt', requireAuth, encryptMessage);
router.post('/encryption/messages/decrypt', requireAuth, decryptMessage);
router.get('/encryption/metrics', requireAuth, getSecurityMetrics);

// ============ PRESENCE & SYNC ENDPOINTS ============
router.post('/presence/update', requireAuth, updatePresence);
router.get('/presence/:userId', getUserPresence);
router.get('/presence', getOnlineUsers);
router.get('/presence/conversations/:conversationId', getConversationUsers);
router.get('/sync/state', requireAuth, getSyncState);
router.get('/sync/changes', requireAuth, getSyncChanges);
router.get('/presence/:userId/history', requireAuth, getPresenceHistory);
router.get('/presence/analytics/summary', requireAuth, getPresenceAnalyticsSummary);

// ============ HEALTH CHECK ============
router.get('/health', getHealth);

export { router as phase6Router };
export { queueService, analyticsService, notificationService, encryptionService, presenceService };
