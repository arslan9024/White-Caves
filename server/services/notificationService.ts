/**
 * Notification Service — White Caves CRM
 * 
 * Centralized notification system supporting multiple channels:
 *   - in_app: Stored in DB, queried via REST API (notification bell)
 *   - email:  Sent via emailService
 *   - push:   Future — Web Push / Firebase Cloud Messaging
 *   - sms:    Future — Twilio / similar
 * 
 * Usage:
 *   import { notificationService } from './services/notificationService.js';
 *   await notificationService.notify({
 *     userId: 'abc123',
 *     type: 'lead_assigned',
 *     title: 'New lead assigned',
 *     message: 'John Doe has been assigned to you',
 *     data: { leadId: 'xyz' },
 *     channels: ['in_app', 'email'],
 *   });
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { emailService, type EmailTemplate } from './emailService.js';

// ─── Types ────────────────────────────────────────────────────────────────

export type NotificationType =
  | 'lead_assigned'
  | 'viewing_confirmed'
  | 'viewing_reminder'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'commission_approved'
  | 'commission_paid'
  | 'lease_expiry'
  | 'maintenance_update'
  | 'system'
  | 'custom';

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotifyOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels?: NotificationChannel[];
  priority?: NotificationPriority;
  actionUrl?: string;
  expiresAt?: Date;
  /** Email-specific: override template (auto-mapped from type if not set) */
  emailTemplate?: EmailTemplate;
  /** Email-specific: data for template interpolation */
  emailData?: Record<string, unknown>;
  /** Email recipient override (defaults to user's email from DB) */
  emailTo?: string;
}

export interface NotificationResult {
  notificationId?: string;
  channels: Record<NotificationChannel, { success: boolean; error?: string }>;
}

// ─── Type → Email template mapping ─────────────────────────────────────

const TYPE_TO_EMAIL_TEMPLATE: Partial<Record<NotificationType, EmailTemplate>> = {
  lead_assigned: 'lead_assigned',
  viewing_confirmed: 'viewing_confirmation',
  viewing_reminder: 'viewing_reminder',
  offer_received: 'offer_received',
  offer_accepted: 'offer_accepted',
  offer_rejected: 'offer_rejected',
  commission_approved: 'commission_approved',
  commission_paid: 'commission_paid',
  lease_expiry: 'lease_expiry_reminder',
  maintenance_update: 'maintenance_update',
};

// ─── Service ────────────────────────────────────────────────────────────

class NotificationService {
  private _created = 0;
  private _emailsSent = 0;

  /**
   * Send a notification through one or more channels.
   * Defaults to in_app only. Email requires user lookup for address.
   */
  async notify(options: NotifyOptions): Promise<NotificationResult> {
    const channels = options.channels || ['in_app'];
    const result: NotificationResult = {
      channels: {} as NotificationResult['channels'],
    };

    // 1. In-app notification (persisted)
    if (channels.includes('in_app')) {
      try {
        const notification = await prisma.notification.create({
          data: {
            type: options.type,
            title: options.title,
            message: options.message,
            data: (options.data as any) || undefined,
            channel: 'in_app',
            priority: options.priority || 'normal',
            actionUrl: options.actionUrl,
            expiresAt: options.expiresAt,
            userId: options.userId,
          },
        });
        result.notificationId = notification.id;
        result.channels.in_app = { success: true };
        this._created++;
        logger.debug('Notification created', { id: notification.id, type: options.type, userId: options.userId });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        result.channels.in_app = { success: false, error: msg };
        logger.error('Failed to create notification', { type: options.type, userId: options.userId, error: msg });
      }
    }

    // 2. Email notification
    if (channels.includes('email')) {
      try {
        let emailTo = options.emailTo;
        if (!emailTo) {
          // Look up user's email from DB
          const user = await prisma.user.findUnique({
            where: { id: options.userId },
            select: { email: true, name: true },
          });
          emailTo = user?.email;
        }

        if (!emailTo) {
          result.channels.email = { success: false, error: 'User email not found' };
        } else {
          const template = options.emailTemplate || TYPE_TO_EMAIL_TEMPLATE[options.type] || 'generic';
          const emailData = options.emailData || {
            ...options.data,
            subject: options.title,
            heading: options.title,
            body: `<p>${options.message}</p>`,
          };

          const emailResult = await emailService.send({
            to: emailTo,
            subject: options.title,
            template,
            data: emailData,
            priority: options.priority === 'urgent' ? 'high' : 'normal',
            tags: [options.type],
          });

          result.channels.email = { success: emailResult.success, error: emailResult.error };
          if (emailResult.success) this._emailsSent++;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        result.channels.email = { success: false, error: msg };
        logger.error('Email notification failed', { type: options.type, userId: options.userId, error: msg });
      }
    }

    // 3. Push notification (future)
    if (channels.includes('push')) {
      result.channels.push = { success: false, error: 'Push notifications not yet implemented' };
    }

    // 4. SMS (future)
    if (channels.includes('sms')) {
      result.channels.sms = { success: false, error: 'SMS notifications not yet implemented' };
    }

    return result;
  }

  /**
   * Notify multiple users at once (e.g., all agents in a department)
   */
  async notifyMany(userIds: string[], options: Omit<NotifyOptions, 'userId'>): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    for (const userId of userIds) {
      const result = await this.notify({ ...options, userId });
      results.push(result);
    }
    return results;
  }

  /**
   * Get notifications for a user (paginated)
   */
  async getUserNotifications(
    userId: string,
    options: { page?: number; limit?: number; unreadOnly?: boolean } = {}
  ) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };
    if (unreadOnly) where.read = false;

    // Exclude expired notifications
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } },
    ];

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread count for notification badge
   */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });
  }

  /**
   * Mark one or more notifications as read
   */
  async markAsRead(userId: string, notificationIds: string[]): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId, // Security: only mark own notifications
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
    return result.count;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
    return result.count;
  }

  /**
   * Dismiss a notification (soft-delete)
   */
  async dismiss(userId: string, notificationId: string): Promise<boolean> {
    const result = await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { dismissed: true },
    });
    return result.count > 0;
  }

  /**
   * Delete old notifications (cleanup job)
   */
  async cleanup(olderThanDays = 30): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);

    const result = await prisma.notification.deleteMany({
      where: {
        OR: [
          { createdAt: { lt: cutoff }, read: true },
          { expiresAt: { lt: new Date() } },
        ],
      },
    });

    logger.info(`Notification cleanup: deleted ${result.count} old notifications`);
    return result.count;
  }

  /** Stats for monitoring */
  getStats() {
    return {
      created: this._created,
      emailsSent: this._emailsSent,
    };
  }
}

// Singleton
export const notificationService = new NotificationService();
export default notificationService;
