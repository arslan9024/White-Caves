/**
 * Viewing Common Utilities & Notifications
 */

import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

export interface ViewingNotificationPayload {
  id: string;
  scheduledAt: Date;
  duration: number;
  type: string;
  status: string;
  location?: string | null;
  property?: { title?: string; location?: string } | null;
  agent?: { name?: string; email?: string } | null;
}

/**
 * Send viewing notification (email + WhatsApp) on create/confirm/cancel.
 * Fire-and-forget — errors are logged but don't block the response.
 */
export async function sendViewingNotification(
  viewing: ViewingNotificationPayload,
  event: 'created' | 'confirmed' | 'cancelled'
): Promise<void> {
  try {
    const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../../services/emailService.js');

    if (event === 'created' || event === 'confirmed') {
      const fullViewing = await prisma.viewing.findUnique({
        where: { id: viewing.id },
        include: { user: { select: { name: true, email: true } } },
      });

      if (fullViewing?.user?.email) {
        const template = EMAIL_TEMPLATES.viewingConfirmation(
          fullViewing.user.name || 'Valued Client',
          viewing.property?.title || 'Property',
          viewing.scheduledAt.toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }),
          viewing.agent?.name || 'Your Agent'
        );

        await sendEmailTracked({
          to: fullViewing.user.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          tags: [{ name: 'type', value: `viewing_${event}` }],
        });
      }
    }

    if (event === 'cancelled') {
      const fullViewing = await prisma.viewing.findUnique({
        where: { id: viewing.id },
        include: { user: { select: { name: true, email: true } } },
      });

      if (fullViewing?.user?.email) {
        const template = EMAIL_TEMPLATES.viewingCancelled(
          fullViewing.user.name || 'Valued Client',
          viewing.property?.title || 'Property',
          viewing.scheduledAt.toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }),
          viewing.agent?.name || 'Your Agent'
        );

        await sendEmailTracked({
          to: fullViewing.user.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          tags: [{ name: 'type', value: 'viewing_cancelled' }],
        });
      }
    }

    logger.info('Viewing notification sent', { viewingId: viewing.id, event });
  } catch (error) {
    logger.warn('Viewing notification failed (non-blocking)', {
      viewingId: viewing.id,
      event,
      error,
    });
  }
}

