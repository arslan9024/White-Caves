import { createHash } from 'node:crypto';
import { prisma } from '../../database.js';
import { notificationService } from '../NotificationService.js';
import logger from '../../utils/logger.js';
import { activeDocumentFilter } from './documentVault.js';

type ReminderDatabase = Pick<typeof prisma, 'henryScannedDocument' | 'henryExpiryReminder'>;
type ReminderDelivery = Pick<typeof notificationService, 'pushOnceInApp'>;
const checkpointId = createHash('sha256').update('henry-expiry-scan-checkpoint').digest('hex').slice(0, 24);

export async function runHenryExpiryReminders(
  now = new Date(),
  db: ReminderDatabase = prisma,
  delivery: ReminderDelivery = notificationService
): Promise<Record<string, number>> {
  const until = new Date(now.getTime() + 30 * 86400000);
  let cursor: string | null = null;
  let cursorExpiry: Date | null = null;
  let scanned = 0, sent = 0, failed = 0;
  try {
    const checkpoint = await db.henryExpiryReminder.upsert({
      where: { id: checkpointId },
      create: { id: checkpointId, scanCursor: null, scanExpiryAt: null },
      update: {},
    });
    cursor = checkpoint.scanCursor;
    cursorExpiry = checkpoint.scanExpiryAt;
    for (let batch = 0; batch < 20; batch++) {
      const rows = await db.henryScannedDocument.findMany({
        where: {
          ...activeDocumentFilter,
          AND: [
            { OR: [{ reminderDismissedAt: null }, { reminderDismissedAt: { isSet: false } }] },
            { expiryAt: { gte: now, lt: until } },
            ...(cursor && cursorExpiry ? [{ OR: [
              { expiryAt: { gt: cursorExpiry } },
              { expiryAt: cursorExpiry, id: { gt: cursor } },
            ] }] : []),
          ],
        },
        select: { id: true, ownerUserId: true, expiryAt: true },
        orderBy: [{ expiryAt: 'asc' }, { id: 'asc' }], take: 500,
      });
      for (const row of rows) {
        scanned++;
        if (!row.expiryAt) continue;
        // Opaque deterministic ObjectId: retry/restart/concurrent ticks cannot duplicate delivery.
        const id = createHash('sha256').update(`henry-expiry:${row.ownerUserId}:${row.id}:${row.expiryAt.toISOString()}`).digest('hex').slice(0, 24);
        try {
          if (await delivery.pushOnceInApp({
            id, userId: row.ownerUserId, type: 'warning',
            title: 'Document expiry review',
            message: 'An archived document expires within 30 days. Open your document archive to review it.',
          })) sent++;
        } catch {
          failed++;
          logger.warn('Henry expiry reminder delivery failed; next daily tick will retry');
        }
      }
      if (rows.length < 500) {
        // Wrap next tick so new documents and prior skipped/failed deliveries remain retryable.
        cursor = null;
        cursorExpiry = null;
        break;
      }
      cursor = rows[rows.length - 1]!.id;
      cursorExpiry = rows[rows.length - 1]!.expiryAt;
      if (batch === 19) logger.warn('Henry expiry scan reached 10000-document safety limit');
    }
    // Compare-and-swap prevents a slower concurrent tick overwriting newer progress.
    await db.henryExpiryReminder.updateMany({
      where: { id: checkpointId, scanRevision: checkpoint.scanRevision },
      data: { scanCursor: cursor, scanExpiryAt: cursorExpiry, scanRevision: { increment: 1 } },
    });
    if (failed) throw new Error(`Henry expiry reminder deliveries failed: ${failed}`);
    return { scanned, sent, failed };
  } catch (error) {
    logger.warn('Henry expiry reminder tick failed; no sensitive document details logged');
    throw error;
  }
}
