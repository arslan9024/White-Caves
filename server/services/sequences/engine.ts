import { prisma } from '../../database.js';
import { sendEmail } from '../emailService.js';
import { getMetaClient } from '../../routes/meta-webhook.js'; // Assumes meta client is exported or similar
import logger from '../../utils/logger.js';

export interface SequenceTemplate {
  id: string;
  name: string;
  steps: {
    dayDelay: number;
    actionType: 'whatsapp' | 'email' | 'task';
    payload: any;
  }[];
}

// W24-011: Seed sequence templates
export const SEQUENCES: Record<string, SequenceTemplate> = {
  new_lead_7day_nurture: {
    id: 'new_lead_7day_nurture',
    name: 'New Lead 7-Day Nurture',
    steps: [
      { dayDelay: 1, actionType: 'whatsapp', payload: { template: 'day_1_checkin' } },
      { dayDelay: 3, actionType: 'email', payload: { template: 'day_3_newsletter' } },
      { dayDelay: 7, actionType: 'task', payload: { title: 'Call Lead to Follow Up' } },
    ],
  },
  lease_renewal_90day: {
    id: 'lease_renewal_90day',
    name: 'Lease Renewal (90 Days)',
    steps: [
      { dayDelay: -90, actionType: 'email', payload: { template: 'renewal_reminder_90' } },
      { dayDelay: -60, actionType: 'whatsapp', payload: { template: 'renewal_reminder_60' } },
      { dayDelay: -30, actionType: 'task', payload: { title: 'Finalize Renewal Offer' } },
    ],
  },
};

/**
 * W24-010: Sequence Engine
 * Enqueue a new sequence for an entity
 */
export async function enqueueSequence(
  entityId: string,
  entityType: 'lead' | 'lease',
  sequenceId: string,
  anchorDate: Date = new Date()
) {
  const sequence = SEQUENCES[sequenceId];
  if (!sequence) throw new Error(`Sequence not found: ${sequenceId}`);

  // Determine if it's already active
  const existing = await prisma.followUpQueue.findFirst({
    where: { entityId, entityType, sequenceId, status: 'pending' },
  });
  if (existing) {
    logger.info(`[Sequences] Sequence ${sequenceId} already active for ${entityType} ${entityId}`);
    return;
  }

  const queueEntries = sequence.steps.map(step => {
    const scheduledAt = new Date(anchorDate.getTime());
    scheduledAt.setDate(scheduledAt.getDate() + step.dayDelay);

    return {
      entityId,
      entityType,
      sequenceId,
      actionType: step.actionType,
      scheduledAt,
      payload: step.payload,
      status: 'pending',
    };
  });

  await prisma.followUpQueue.createMany({
    data: queueEntries,
  });

  logger.info(`[Sequences] Enqueued ${queueEntries.length} steps for ${sequenceId} on ${entityId}`);
}

/**
 * W24-010: Process Due Items (Run via Cron)
 */
export async function processSequenceQueue() {
  const dueItems = await prisma.followUpQueue.findMany({
    where: {
      status: 'pending',
      scheduledAt: { lte: new Date() },
    },
    take: 50,
  });

  if (dueItems.length === 0) return;
  logger.info(`[Sequences] Processing ${dueItems.length} due items...`);

  for (const item of dueItems) {
    try {
      // 1. Check if we should pause/cancel (e.g., manual contact within 24h)
      if (item.entityType === 'lead') {
        const recentActivity = await prisma.activity.findFirst({
          where: {
            leadId: item.entityId,
            action: 'call',
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24h
          },
        });
        if (recentActivity) {
          logger.info(
            `[Sequences] Pausing sequence step for lead ${item.entityId} due to manual contact`
          );
          await prisma.followUpQueue.update({
            where: { id: item.id },
            data: { status: 'paused', processedAt: new Date() },
          });
          continue;
        }
      }

      // 2. Execute Action
      const payload = item.payload as any;
      if (item.actionType === 'whatsapp') {
        // Mock WhatsApp dispatch
        logger.info(
          `[Sequences] Firing WhatsApp for ${item.entityId} -> template: ${payload.template}`
        );
      } else if (item.actionType === 'email') {
        // Mock Email dispatch
        logger.info(
          `[Sequences] Firing Email for ${item.entityId} -> template: ${payload.template}`
        );
      } else if (item.actionType === 'task') {
        // Create CRM task (Activity for now)
        await prisma.activity.create({
          data: {
            type: 'system',
            action: 'task_created',
            description: payload.title,
            leadId: item.entityType === 'lead' ? item.entityId : undefined,
          },
        });
      }

      // 3. Mark processed
      await prisma.followUpQueue.update({
        where: { id: item.id },
        data: { status: 'processed', processedAt: new Date() },
      });
    } catch (err) {
      logger.error(`[Sequences] Failed to process item ${item.id}`, err);
      await prisma.followUpQueue.update({
        where: { id: item.id },
        data: { status: 'failed', processedAt: new Date() },
      });
    }
  }
}
