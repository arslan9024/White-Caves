import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';
import { getSocketServer } from './socketServer.js';
import logger from '../utils/logger.js';

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
      const notification = await prisma.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          message: input.message,
          type: input.type ?? 'info',
          channel: input.channel ?? 'in_app',
          metadata: (input.metadata ?? null) as Prisma.InputJsonValue | null,
        },
      });

      getSocketServer()?.emitNotification({
        id: notification.id,
        type: notification.type as 'info' | 'success' | 'warning' | 'error',
        title: notification.title,
        message: notification.message,
      });
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
