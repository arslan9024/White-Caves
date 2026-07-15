import admin from 'firebase-admin';
import { prisma } from '../lib/db.js';

export class PushNotificationService {
  /**
   * Send a push notification to a specific user
   */
  static async sendToUser(userId: string, payload: { title: string; body: string; url?: string }) {
    try {
      const tokens = await prisma.userPushToken.findMany({
        where: { userId },
      });

      if (tokens.length === 0) return;

      const messages = tokens.map(t => ({
        token: t.token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          url: payload.url || '/',
        },
      }));

      // Firebase Admin might not be initialized if not provided with credentials,
      // so we use a try-catch for the sendAll operation.
      // If we don't have a valid firebase-admin init, it will throw.
      try {
        const response = await admin.messaging().sendEach(messages);

        // Remove stale tokens
        const staleTokens = [];
        response.responses.forEach((res, idx) => {
          if (!res.success && res.error?.code === 'messaging/registration-token-not-registered') {
            staleTokens.push(tokens[idx].token);
          }
        });

        if (staleTokens.length > 0) {
          await prisma.userPushToken.deleteMany({
            where: { token: { in: staleTokens } },
          });
        }
      } catch (err: any) {
        if (err.code === 'app/no-app') {
          console.warn('Firebase Admin is not initialized. Mocking push notification:', payload);
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}
