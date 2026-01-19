import logger from '../utils/logger.js';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string;
  };
  notificationTypes: {
    messageReceived: boolean;
    conversationInvite: boolean;
    systemAlert: boolean;
    analytics: boolean;
  };
}

export interface NotificationLog {
  id: string;
  userId: string;
  type: string;
  payload: PushNotificationPayload;
  sentAt: Date;
  status: 'pending' | 'sent' | 'failed' | 'read';
  error?: string;
}

export class NotificationService {
  private userPreferences: Map<string, NotificationPreferences> = new Map();
  private userDevices: Map<string, string[]> = new Map(); // userId -> subscriptionIds
  private notificationLogs: Map<string, NotificationLog> = new Map();
  private notificationQueue: PushNotificationPayload[] = [];

  constructor() {
    this.setupCleanup();
  }

  /**
   * Subscribe user device for push notifications
   */
  public subscribeDevice(userId: string, subscription: PushSubscription): boolean {
    try {
      const subscriptionId = JSON.stringify(subscription);
      const devices = this.userDevices.get(userId) || [];

      if (!devices.includes(subscriptionId)) {
        devices.push(subscriptionId);
        this.userDevices.set(userId, devices);
        logger.info(`Device subscribed for user ${userId}`);
      }

      return true;
    } catch (error) {
      logger.error('Failed to subscribe device:', error);
      return false;
    }
  }

  /**
   * Unsubscribe device from push notifications
   */
  public unsubscribeDevice(userId: string, subscription: PushSubscription): boolean {
    try {
      const subscriptionId = JSON.stringify(subscription);
      const devices = this.userDevices.get(userId) || [];
      const index = devices.indexOf(subscriptionId);

      if (index > -1) {
        devices.splice(index, 1);
        this.userDevices.set(userId, devices);
        logger.info(`Device unsubscribed for user ${userId}`);
      }

      return true;
    } catch (error) {
      logger.error('Failed to unsubscribe device:', error);
      return false;
    }
  }

  /**
   * Set user notification preferences
   */
  public setPreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const existing = this.userPreferences.get(userId) || this.getDefaultPreferences(userId);
    const updated = { ...existing, ...preferences, userId };
    this.userPreferences.set(userId, updated);

    logger.info(`Notification preferences updated for user ${userId}`);
  }

  /**
   * Get user notification preferences
   */
  public getPreferences(userId: string): NotificationPreferences {
    return (
      this.userPreferences.get(userId) || this.getDefaultPreferences(userId)
    );
  }

  /**
   * Send notification to user
   */
  public async sendNotification(
    userId: string,
    type: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    const preferences = this.getPreferences(userId);

    // Check if notifications are enabled
    if (!preferences.pushEnabled) {
      logger.debug(`Push notifications disabled for user ${userId}`);
      return false;
    }

    // Check notification type preferences
    if (
      type === 'message_received' &&
      !preferences.notificationTypes.messageReceived
    ) {
      return false;
    }
    if (
      type === 'conversation_invite' &&
      !preferences.notificationTypes.conversationInvite
    ) {
      return false;
    }

    // Check do not disturb
    if (this.isInDoNotDisturbWindow(preferences)) {
      logger.debug(`User ${userId} is in do not disturb window`);
      // Still send, but with silent flag
      payload.data = { ...payload.data, silent: true };
    }

    // Get user devices
    const devices = this.userDevices.get(userId) || [];
    if (devices.length === 0) {
      logger.warn(`No devices registered for user ${userId}`);
      return false;
    }

    // Send to all devices
    let successCount = 0;
    for (const subscriptionId of devices) {
      try {
        const subscription = JSON.parse(subscriptionId);
        await this.sendToDevice(userId, subscription, payload, type);
        successCount++;
      } catch (error) {
        logger.error(`Failed to send notification to device for user ${userId}:`, error);
      }
    }

    return successCount > 0;
  }

  /**
   * Send bulk notifications
   */
  public async sendBulkNotifications(
    userIds: string[],
    type: string,
    payload: PushNotificationPayload
  ): Promise<number> {
    let successCount = 0;

    for (const userId of userIds) {
      const success = await this.sendNotification(userId, type, payload);
      if (success) {
        successCount++;
      }
    }

    logger.info(`Bulk notification sent to ${successCount}/${userIds.length} users`);
    return successCount;
  }

  /**
   * Send notification for message
   */
  public async sendMessageNotification(
    userId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
  ): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: `New message from ${senderName}`,
      body: messagePreview,
      badge: '1',
      tag: `message-${conversationId}`,
      data: {
        type: 'message',
        conversationId,
        action: 'open_conversation',
      },
      actions: [
        {
          action: 'reply',
          title: 'Reply',
        },
        {
          action: 'close',
          title: 'Dismiss',
        },
      ],
    };

    return this.sendNotification(userId, 'message_received', payload);
  }

  /**
   * Send conversation invite notification
   */
  public async sendConversationInviteNotification(
    userId: string,
    inviterName: string,
    conversationId: string
  ): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'You\'ve been added to a conversation',
      body: `${inviterName} added you to a conversation`,
      badge: '1',
      data: {
        type: 'conversation_invite',
        conversationId,
        action: 'open_conversation',
      },
      actions: [
        {
          action: 'accept',
          title: 'View',
        },
      ],
    };

    return this.sendNotification(userId, 'conversation_invite', payload);
  }

  /**
   * Send system alert
   */
  public async sendSystemAlert(
    userId: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title,
      body: message,
      badge: priority === 'high' ? '2' : '1',
      data: {
        type: 'system_alert',
        priority,
      },
    };

    return this.sendNotification(userId, 'system_alert', payload);
  }

  /**
   * Get notification log for user
   */
  public getNotificationLog(userId: string, limit: number = 50): NotificationLog[] {
    const logs: NotificationLog[] = [];

    for (const log of this.notificationLogs.values()) {
      if (log.userId === userId) {
        logs.push(log);
      }
    }

    return logs.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()).slice(0, limit);
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string): boolean {
    const log = this.notificationLogs.get(notificationId);
    if (log) {
      log.status = 'read';
      return true;
    }
    return false;
  }

  /**
   * Get notification stats
   */
  public getStats(userId?: string): {
    totalSent: number;
    totalFailed: number;
    totalRead: number;
    pendingCount: number;
  } {
    let totalSent = 0;
    let totalFailed = 0;
    let totalRead = 0;
    let pendingCount = 0;

    for (const log of this.notificationLogs.values()) {
      if (userId && log.userId !== userId) {
        continue;
      }

      if (log.status === 'sent') totalSent++;
      else if (log.status === 'failed') totalFailed++;
      else if (log.status === 'read') totalRead++;
      else if (log.status === 'pending') pendingCount++;
    }

    return {
      totalSent,
      totalFailed,
      totalRead,
      pendingCount,
    };
  }

  /**
   * Send to device (stub - implement with actual push service)
   */
  private async sendToDevice(
    userId: string,
    subscription: PushSubscription,
    payload: PushNotificationPayload,
    type: string
  ): Promise<void> {
    const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const log: NotificationLog = {
      id: notificationId,
      userId,
      type,
      payload,
      sentAt: new Date(),
      status: 'pending',
    };

    this.notificationLogs.set(notificationId, log);

    try {
      // TODO: Implement actual push notification service
      // This would use a service like Firebase Cloud Messaging, OneSignal, etc.
      log.status = 'sent';
      logger.info(`Notification sent to user ${userId}`);
    } catch (error) {
      log.status = 'failed';
      log.error = (error as Error).message;
      logger.error(`Failed to send notification to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if user is in do not disturb window
   */
  private isInDoNotDisturbWindow(preferences: NotificationPreferences): boolean {
    if (!preferences.doNotDisturb.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const { startTime, endTime } = preferences.doNotDisturb;

    if (startTime < endTime) {
      // Normal range (e.g., 22:00 to 08:00 next day)
      return currentTime >= startTime && currentTime < endTime;
    } else {
      // Range crosses midnight
      return currentTime >= startTime || currentTime < endTime;
    }
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      userId,
      pushEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      doNotDisturb: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
      notificationTypes: {
        messageReceived: true,
        conversationInvite: true,
        systemAlert: true,
        analytics: false,
      },
    };
  }

  /**
   * Setup cleanup for old logs
   */
  private setupCleanup(): void {
    setInterval(() => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      let deleted = 0;

      for (const [id, log] of this.notificationLogs.entries()) {
        if (log.sentAt < thirtyDaysAgo) {
          this.notificationLogs.delete(id);
          deleted++;
        }
      }

      if (deleted > 0) {
        logger.info(`Notification cleanup: Removed ${deleted} old logs`);
      }
    }, 24 * 60 * 60 * 1000); // Every 24 hours
  }
}

export default NotificationService;
