/**
 * ViewingReminderCron — Wave 23 (W23-007)
 *
 * Cron job running every 5 minutes that:
 *  1. Queries viewings with scheduledAt in the next 30–35 minute window
 *  2. Filters for viewings where reminderSent !== true
 *  3. Sends FCM push notification to the assigned agent
 *  4. Marks viewing as reminderSent: true
 *
 * Designed to run as part of the SchedulerService.
 * Dubai timezone: Asia/Dubai (UTC+4).
 *
 * @agent @Mira — Wave 23
 */

import { prisma } from '../database.js';
import { PushNotificationService } from './PushNotificationService.js';

const CRON_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const REMINDER_WINDOW_MIN = 30; // minutes before viewing
const REMINDER_WINDOW_MAX = 35; // minutes before viewing (5-min buffer for cron interval)

let cronIntervalId: NodeJS.Timeout | null = null;

/**
 * Check for upcoming viewings and send reminders
 */
async function processViewingReminders(): Promise<void> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() + REMINDER_WINDOW_MIN * 60_000);
    const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MAX * 60_000);

    // Find viewings in the reminder window that haven't been reminded yet
    const upcomingViewings = await prisma.viewing.findMany({
      where: {
        scheduledAt: {
          gte: windowStart,
          lte: windowEnd,
        },
        status: { in: ['scheduled', 'confirmed'] },
        reminderSent: { not: true },
      },
      include: {
        property: {
          select: {
            title: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    if (upcomingViewings.length === 0) return;

    console.log(`[ViewingReminderCron] Found ${upcomingViewings.length} viewings needing reminders`);

    for (const viewing of upcomingViewings) {
      try {
        // Send push to the assigned agent
        if (viewing.agent?.id) {
          await PushNotificationService.sendViewingReminderNotification(
            viewing.agent.id,
            {
              id: viewing.id,
              propertyTitle: viewing.property?.title || 'Property Viewing',
              clientName: viewing.client?.name || 'Client',
              scheduledAt: viewing.scheduledAt,
              lat: viewing.property?.latitude?.toString(),
              lng: viewing.property?.longitude?.toString(),
            }
          );
        }

        // Mark as reminded
        await prisma.viewing.update({
          where: { id: viewing.id },
          data: { reminderSent: true },
        });

        console.log(`[ViewingReminderCron] Reminder sent for viewing ${viewing.id}`);
      } catch (viewingError) {
        console.error(
          `[ViewingReminderCron] Failed to process viewing ${viewing.id}:`,
          viewingError
        );
        // Continue processing other viewings — don't let one failure stop the batch
      }
    }
  } catch (error) {
    console.error('[ViewingReminderCron] Error processing reminders:', error);
  }
}

/**
 * Start the viewing reminder cron job
 */
export function startViewingReminderCron(): void {
  if (cronIntervalId) {
    console.warn('[ViewingReminderCron] Cron already running');
    return;
  }

  console.log('[ViewingReminderCron] Starting (every 5 minutes)');

  // Run immediately on start, then every 5 minutes
  processViewingReminders().catch(console.error);
  cronIntervalId = setInterval(processViewingReminders, CRON_INTERVAL_MS);
}

/**
 * Stop the viewing reminder cron job
 */
export function stopViewingReminderCron(): void {
  if (cronIntervalId) {
    clearInterval(cronIntervalId);
    cronIntervalId = null;
    console.log('[ViewingReminderCron] Stopped');
  }
}

export { processViewingReminders };
