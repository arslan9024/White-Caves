import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';
import { getSocketServer } from './socketServer.js';
import logger from '../utils/logger.js';
import { PushNotificationService } from './PushNotificationService.js';

export type NotificationKind =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'lead'
  | 'property'
  | 'commission'
  | 'system';

interface PushNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationKind;
  channel?: 'in_app' | 'email' | 'whatsapp';
  metadata?: Record<string, unknown> | null;
}

class NotificationService {
  async pushToUser(input: PushNotificationInput): Promise<void> {
    try {
      // Fetch user notification preferences (W24-015)
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId: input.userId },
      });

      const channel = input.channel ?? 'in_app';

      if (preferences) {
        if (channel === 'in_app' && !preferences.inApp) {
          logger.info(`In-app notification skipped for user ${input.userId} due to preferences`);
          return;
        }
        if (channel === 'email' && !preferences.email) {
          logger.info(`Email notification skipped for user ${input.userId} due to preferences`);
          return;
        }
        if (channel === 'whatsapp' && !preferences.whatsapp) {
          logger.info(`WhatsApp notification skipped for user ${input.userId} due to preferences`);
          return;
        }
      }

      const notification = await prisma.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          message: input.message,
          type: input.type ?? 'info',
          channel,
          metadata: (input.metadata ?? null) as Prisma.InputJsonValue | null,
        },
      });

      getSocketServer()?.emitNotification(notification.userId, {
        id: notification.id,
        type: notification.type as 'info' | 'success' | 'warning' | 'error',
        title: notification.title,
        message: notification.message,
      });

      // Fire FCM push notification
      let pushUrl = '/';
      if (input.type === 'lead' && input.metadata?.leadId) {
        pushUrl = `crm/leads/${input.metadata.leadId}`;
      } else if (input.type === 'property' && input.metadata?.propertyId) {
        pushUrl = `crm/properties/${input.metadata.propertyId}`;
      } else if (input.metadata?.viewingId) {
        pushUrl = `crm/viewings`;
      }

      if (!preferences || preferences.push) {
        PushNotificationService.sendToUser(input.userId, {
          title: input.title,
          body: input.message,
          url: pushUrl,
        }).catch(err => {
          logger.warn('FCM push notification failed', { error: err.message, userId: input.userId });
        });
      } else {
        logger.info(`FCM push notification skipped for user ${input.userId} due to preferences`);
      }
    } catch (error) {
      logger.warn('Notification push failed', {
        userId: input.userId,
        title: input.title,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const notificationService = new NotificationService();
