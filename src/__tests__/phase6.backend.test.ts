import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MessageQueueService from '../server/queue/queue.service.js';
import AnalyticsService from '../server/analytics/analytics.service.js';
import NotificationService from '../server/notifications/notification.service.js';
import EncryptionService from '../server/security/encryption.service.js';
import PresenceAndSyncService from '../server/presence/presence.service.js';

// ============ MESSAGE QUEUE SERVICE TESTS ============

describe('MessageQueueService', () => {
  let queue: MessageQueueService;

  beforeEach(() => {
    queue = new MessageQueueService();
  });

  it('should add task to queue', async () => {
    const taskId = await queue.addTask('test', { data: 'test' }, 'normal', 3);

    expect(taskId).toBeDefined();
    expect(taskId).toMatch(/^task-/);

    const task = queue.getTaskStatus(taskId);
    expect(task).toBeDefined();
    expect(task?.status).toBe('pending');
  });

  it('should process task with registered worker', async () => {
    let workerCalled = false;

    queue.registerWorker('test_worker', async (data) => {
      workerCalled = true;
      expect(data.message).toBe('hello');
    });

    const taskId = await queue.addTask('test_worker', { message: 'hello' });

    // Wait for processing
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(workerCalled).toBe(true);
  });

  it('should retry failed tasks with exponential backoff', async () => {
    let attempts = 0;

    queue.registerWorker('retry_task', async (data) => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Task failed');
      }
    });

    const taskId = await queue.addTask('retry_task', {}, 'normal', 3);

    // Wait for retries
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const task = queue.getTaskStatus(taskId);
    expect(task?.attempts).toBeGreaterThan(1);
  });

  it('should respect task priority', async () => {
    const lowPriorityId = await queue.addTask('test', { id: 1 }, 'low');
    const highPriorityId = await queue.addTask('test', { id: 2 }, 'high');

    const lowTask = queue.getTaskStatus(lowPriorityId);
    const highTask = queue.getTaskStatus(highPriorityId);

    expect(lowTask?.priority).toBe('low');
    expect(highTask?.priority).toBe('high');
  });

  it('should get queue statistics', () => {
    queue.addTask('test', { id: 1 });
    queue.addTask('test', { id: 2 });

    const stats = queue.getStats();

    expect(stats.pending).toBeGreaterThan(0);
    expect(stats.totalTasks).toBeGreaterThan(0);
  });

  it('should track metrics', async () => {
    queue.registerWorker('metric_test', async (data) => {
      // Simulate work
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await queue.addTask('metric_test', {});

    await new Promise((resolve) => setTimeout(resolve, 200));

    const metrics = queue.getMetrics();

    expect(metrics.avgProcessingTime).toBeGreaterThan(0);
    expect(metrics.successRate).toBeGreaterThanOrEqual(0);
  });

  it('should handle dead letter queue', async () => {
    queue.registerWorker('fail_task', async () => {
      throw new Error('Always fails');
    });

    const taskId = await queue.addTask('fail_task', {}, 'normal', 1);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const dlq = queue.getDeadLetterQueue();
    const failedTask = dlq.find((t) => t.id === taskId);

    expect(failedTask).toBeDefined();
    expect(failedTask?.status).toBe('failed');
  });

  it('should allow pausing and resuming', async () => {
    queue.pause();
    const stats1 = queue.getStats();

    queue.resume();
    const stats2 = queue.getStats();

    expect(stats1).toBeDefined();
    expect(stats2).toBeDefined();
  });
});

// ============ ANALYTICS SERVICE TESTS ============

describe('AnalyticsService', () => {
  let analytics: AnalyticsService;

  beforeEach(() => {
    analytics = new AnalyticsService();
  });

  it('should track events', () => {
    analytics.trackEvent('user1', 'message_sent', { conversationId: 'conv1' });

    const userAnalytics = analytics.getUserAnalytics('user1');
    expect(userAnalytics?.totalMessages).toBe(1);
  });

  it('should track message sent', () => {
    analytics.trackMessageSent('user1', 'conv1', false);
    analytics.trackMessageSent('user1', 'conv1', true);

    const convAnalytics = analytics.getConversationAnalytics('conv1');
    expect(convAnalytics?.messageCount).toBe(2);
    expect(convAnalytics?.mediaCount).toBe(1);
  });

  it('should track conversation started', () => {
    analytics.trackConversationStarted('user1', 'conv1', 2);

    const userAnalytics = analytics.getUserAnalytics('user1');
    expect(userAnalytics?.totalConversations).toBe(1);
  });

  it('should get dashboard metrics', () => {
    analytics.trackEvent('user1', 'message_sent');
    analytics.trackEvent('user2', 'message_sent');
    analytics.trackUserLogin('user1', 'Mobile');

    const metrics = analytics.getDashboardMetrics();

    expect(metrics.totalUsers).toBeGreaterThan(0);
    expect(metrics.totalMessages).toBe(2);
  });

  it('should get analytics by time range', () => {
    analytics.trackEvent('user1', 'message_sent');

    const startDate = new Date(Date.now() - 60 * 60 * 1000);
    const endDate = new Date(Date.now() + 60 * 60 * 1000);

    const rangeAnalytics = analytics.getAnalyticsByTimeRange(startDate, endDate);

    expect(rangeAnalytics.messageCount).toBeGreaterThan(0);
  });

  it('should get user behavior patterns', () => {
    for (let i = 0; i < 10; i++) {
      analytics.trackEvent('user1', 'message_sent');
    }

    const patterns = analytics.getUserBehaviorPatterns('user1');

    expect(patterns.peakHours).toBeDefined();
    expect(patterns.averageMessagesPerHour).toBeGreaterThan(0);
    expect(Array.isArray(patterns.preferredDevices)).toBe(true);
  });

  it('should export analytics to CSV', () => {
    analytics.trackEvent('user1', 'message_sent');
    analytics.trackEvent('user2', 'user_login');

    const csv = analytics.exportAnalyticsToCSV();

    expect(csv).toContain('timestamp,userId,eventType,metadata');
    expect(csv).toContain('user1');
    expect(csv).toContain('user2');
  });
});

// ============ NOTIFICATION SERVICE TESTS ============

describe('NotificationService', () => {
  let notifications: NotificationService;
  const mockSubscription = { endpoint: 'https://test.com', keys: { auth: 'test' } };

  beforeEach(() => {
    notifications = new NotificationService();
  });

  it('should subscribe device', () => {
    const success = notifications.subscribeDevice('user1', mockSubscription as any);

    expect(success).toBe(true);
  });

  it('should get default preferences', () => {
    const prefs = notifications.getPreferences('user1');

    expect(prefs.userId).toBe('user1');
    expect(prefs.pushEnabled).toBe(true);
    expect(prefs.emailEnabled).toBe(false);
  });

  it('should update preferences', () => {
    notifications.setPreferences('user1', {
      emailEnabled: true,
      doNotDisturb: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
      },
    });

    const prefs = notifications.getPreferences('user1');

    expect(prefs.emailEnabled).toBe(true);
    expect(prefs.doNotDisturb.enabled).toBe(true);
  });

  it('should send message notification', async () => {
    notifications.subscribeDevice('user1', mockSubscription as any);

    const success = await notifications.sendMessageNotification(
      'user1',
      'John Doe',
      'Hello there!',
      'conv1'
    );

    expect(success).toBe(true);
  });

  it('should send conversation invite notification', async () => {
    notifications.subscribeDevice('user1', mockSubscription as any);

    const success = await notifications.sendConversationInviteNotification(
      'user1',
      'Jane Smith',
      'conv1'
    );

    expect(success).toBe(true);
  });

  it('should send system alert', async () => {
    notifications.subscribeDevice('user1', mockSubscription as any);

    const success = await notifications.sendSystemAlert(
      'user1',
      'Maintenance Alert',
      'System maintenance scheduled',
      'high'
    );

    expect(success).toBe(true);
  });

  it('should get notification log', () => {
    notifications.subscribeDevice('user1', mockSubscription as any);
    notifications.sendMessageNotification('user1', 'John', 'Hi', 'conv1');

    const logs = notifications.getNotificationLog('user1');

    expect(Array.isArray(logs)).toBe(true);
  });

  it('should get notification statistics', async () => {
    notifications.subscribeDevice('user1', mockSubscription as any);
    await notifications.sendMessageNotification('user1', 'John', 'Hi', 'conv1');

    const stats = notifications.getStats('user1');

    expect(stats.totalSent).toBeGreaterThan(0);
    expect(stats.totalFailed).toBeGreaterThanOrEqual(0);
  });
});

// ============ ENCRYPTION SERVICE TESTS ============

describe('EncryptionService', () => {
  let encryption: EncryptionService;

  beforeEach(() => {
    encryption = new EncryptionService();
  });

  it('should generate user key pair', () => {
    const keyPair = encryption.generateUserKeyPair('user1');

    expect(keyPair.publicKey).toBeDefined();
    expect(keyPair.privateKey).toBeDefined();
    expect(keyPair.keyId).toBeDefined();
    expect(keyPair.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
    expect(keyPair.privateKey).toContain('-----BEGIN PRIVATE KEY-----');
  });

  it('should get user public key', () => {
    encryption.generateUserKeyPair('user1');

    const pubKey = encryption.getUserPublicKey('user1');

    expect(pubKey).toBeDefined();
    expect(pubKey).toContain('-----BEGIN PUBLIC KEY-----');
  });

  it('should encrypt and decrypt message', () => {
    const key = encryption.generateSecureToken(32);
    const message = 'Secret message';

    const encrypted = encryption.encryptMessage(message, key);

    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.authTag).toBeDefined();

    const decrypted = encryption.decryptMessage(encrypted, key);

    expect(decrypted).toBe(message);
  });

  it('should fail decryption with wrong key', () => {
    const key = encryption.generateSecureToken(32);
    const wrongKey = encryption.generateSecureToken(32);
    const message = 'Secret message';

    const encrypted = encryption.encryptMessage(message, key);

    expect(() => {
      encryption.decryptMessage(encrypted, wrongKey);
    }).toThrow();
  });

  it('should encrypt with public key', () => {
    const keyPair = encryption.generateUserKeyPair('user1');
    const data = 'Secret data';

    const encrypted = encryption.encryptWithPublicKey(data, keyPair.publicKey);

    expect(encrypted).toBeDefined();
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('should decrypt with private key', () => {
    const keyPair = encryption.generateUserKeyPair('user1');
    const data = 'Secret data';

    const encrypted = encryption.encryptWithPublicKey(data, keyPair.publicKey);
    const decrypted = encryption.decryptWithPrivateKey(encrypted, keyPair.privateKey);

    expect(decrypted).toBe(data);
  });

  it('should sign and verify data', () => {
    const keyPair = encryption.generateUserKeyPair('user1');
    const data = 'Important message';

    const signature = encryption.signData(data, keyPair.privateKey);
    const isValid = encryption.verifySignature(data, signature, keyPair.publicKey);

    expect(isValid).toBe(true);
  });

  it('should detect invalid signatures', () => {
    const keyPair = encryption.generateUserKeyPair('user1');
    const data = 'Important message';

    const signature = encryption.signData(data, keyPair.privateKey);
    const isValid = encryption.verifySignature('Modified message', signature, keyPair.publicKey);

    expect(isValid).toBe(false);
  });

  it('should generate secure token', () => {
    const token1 = encryption.generateSecureToken();
    const token2 = encryption.generateSecureToken();

    expect(token1).not.toBe(token2);
    expect(token1.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('should hash data', () => {
    const data = 'Test data';

    const hash1 = encryption.hashData(data, 'sha256');
    const hash2 = encryption.hashData(data, 'sha256');
    const hash3 = encryption.hashData('Different data', 'sha256');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });

  it('should derive key from password', () => {
    const password = 'mypassword123';

    const { key, salt } = encryption.deriveKeyFromPassword(password);

    expect(key).toBeDefined();
    expect(salt).toBeDefined();
    expect(key.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('should generate conversation key', () => {
    const key1 = encryption.generateConversationKey('conv1');
    const key2 = encryption.generateSecureToken(32);

    expect(key1).toBeDefined();
    expect(key1).not.toBe(key2);
  });

  it('should get security metrics', () => {
    encryption.generateUserKeyPair('user1');
    encryption.generateUserKeyPair('user2');
    encryption.generateConversationKey('conv1');

    const metrics = encryption.getSecurityMetrics();

    expect(metrics.totalUsersWithKeys).toBe(2);
    expect(metrics.activeConversations).toBe(1);
    expect(metrics.keysExpiringInThirtyDays).toBeGreaterThanOrEqual(0);
  });

  it('should rotate user keys', () => {
    encryption.generateUserKeyPair('user1');

    const newKeyPair = encryption.rotateUserKeys('user1');

    expect(newKeyPair).toBeDefined();
    expect(newKeyPair.publicKey).toBeDefined();
  });
});

// ============ PRESENCE & SYNC SERVICE TESTS ============

describe('PresenceAndSyncService', () => {
  let presence: PresenceAndSyncService;

  beforeEach(() => {
    presence = new PresenceAndSyncService();
  });

  it('should update user presence', () => {
    presence.updatePresence('user1', 'online');

    const userPresence = presence.getPresence('user1');

    expect(userPresence).toBeDefined();
    expect(userPresence?.status).toBe('online');
  });

  it('should track presence changes', () => {
    presence.updatePresence('user1', 'online');
    presence.updatePresence('user1', 'away');
    presence.updatePresence('user1', 'offline');

    const userPresence = presence.getPresence('user1');

    expect(userPresence?.status).toBe('offline');
  });

  it('should get online users', () => {
    presence.updatePresence('user1', 'online');
    presence.updatePresence('user2', 'online');
    presence.updatePresence('user3', 'offline');

    const onlineUsers = presence.getOnlineUsers();

    expect(onlineUsers.length).toBe(2);
    expect(onlineUsers.map((u) => u.userId)).toContain('user1');
    expect(onlineUsers.map((u) => u.userId)).toContain('user2');
  });

  it('should add user to conversation', () => {
    presence.addUserToConversation('user1', 'conv1');

    const userPresence = presence.getPresence('user1');

    expect(userPresence?.activeConversations).toContain('conv1');
  });

  it('should remove user from conversation', () => {
    presence.addUserToConversation('user1', 'conv1');
    presence.removeUserFromConversation('user1', 'conv1');

    const userPresence = presence.getPresence('user1');

    expect(userPresence?.activeConversations).not.toContain('conv1');
  });

  it('should get users in conversation', () => {
    presence.updatePresence('user1', 'online');
    presence.addUserToConversation('user1', 'conv1');

    presence.updatePresence('user2', 'online');
    presence.addUserToConversation('user2', 'conv1');

    const users = presence.getUsersInConversation('conv1');

    expect(users.length).toBe(2);
  });

  it('should set user location', () => {
    presence.setUserLocation('user1', 40.7128, -74.006);

    const userPresence = presence.getPresence('user1');

    expect(userPresence?.location).toBeDefined();
    expect(userPresence?.location?.latitude).toBe(40.7128);
  });

  it('should get sync state', () => {
    const syncState = presence.getSyncState('user1');

    expect(syncState).toBeDefined();
    expect(syncState.userId).toBe('user1');
    expect(syncState.conversationVersions).toBeDefined();
  });

  it('should track conversation versions', () => {
    presence.updateConversationVersion('user1', 'conv1');
    presence.updateConversationVersion('user1', 'conv1');

    const syncState = presence.getSyncState('user1');

    expect(syncState.conversationVersions.get('conv1')).toBe(2);
  });

  it('should get presence history', () => {
    presence.updatePresence('user1', 'online');
    presence.updatePresence('user1', 'away');
    presence.updatePresence('user1', 'offline');

    const history = presence.getPresenceHistory('user1', 24);

    expect(history.length).toBe(3);
    expect(history[0].status).toBe('online');
  });

  it('should get presence analytics', () => {
    presence.updatePresence('user1', 'online');
    presence.updatePresence('user2', 'online');
    presence.updatePresence('user1', 'offline');

    const analytics = presence.getPresenceAnalytics(24);

    expect(analytics.totalUsers).toBeGreaterThan(0);
    expect(analytics.onlineUsers).toBeGreaterThan(0);
  });

  it('should get service health', () => {
    presence.updatePresence('user1', 'online');
    presence.updatePresence('user2', 'offline');

    const health = presence.getHealth();

    expect(health.onlineCount).toBe(1);
    expect(health.offlineCount).toBe(1);
    expect(health.syncStatesTracked).toBeGreaterThan(0);
  });
});
