/**
 * RERA Permit Expiry Cron Service — Wave 34 (REQ-PROP-002, SRS §4.3)
 *
 * Runs daily to:
 * 1. Find all active listings (`status === 'available'`) with expired RERA permits (`reraPermitExpiryDate < now`)
 * 2. Unpublish them (set `status: 'off_market'`, `inventoryStage: 'draft_collected'`)
 * 3. Log warning activities for compliance audit trail
 *
 * Compliance with RERA Law No. 16/2007 (mandatory valid permit for advertising)
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export interface ReraPermitCronResult {
  unpublishedCount: number;
  unpublishedPropertyIds: string[];
}

/**
 * Process expired RERA permits and unpublish non-compliant properties
 */
export async function processExpiredReraPermits(): Promise<ReraPermitCronResult> {
  const now = new Date();

  const expiredListings = await prisma.property.findMany({
    where: {
      status: 'available',
      reraPermitExpiryDate: {
        lt: now,
      },
    },
    select: {
      id: true,
      title: true,
      reraPermitNumber: true,
      reraPermitExpiryDate: true,
      userId: true,
    },
  });

  const unpublishedPropertyIds: string[] = [];

  for (const property of expiredListings) {
    await prisma.property.update({
      where: { id: property.id },
      data: {
        status: 'off_market',
        inventoryStage: 'draft_collected',
      },
    });

    await prisma.activity.create({
      data: {
        type: 'property',
        action: 'rera_permit_expired_unpublish',
        description: `Property "${property.title}" unpublished automatically: RERA permit ${property.reraPermitNumber || 'UNKNOWN'} expired on ${property.reraPermitExpiryDate?.toISOString().split('T')[0]}`,
        userId: property.userId,
      },
    });

    unpublishedPropertyIds.push(property.id);
  }

  logger.info('RERA permit expiry cron completed', {
    unpublishedCount: unpublishedPropertyIds.length,
    unpublishedPropertyIds,
  });

  return {
    unpublishedCount: unpublishedPropertyIds.length,
    unpublishedPropertyIds,
  };
}

let cronTimer: NodeJS.Timeout | null = null;

export const reraPermitCron = {
  start(intervalMs = 24 * 60 * 60 * 1000) {
    if (cronTimer) return;
    processExpiredReraPermits().catch(err => logger.error('RERA permit cron initial run error', err));
    cronTimer = setInterval(() => {
      processExpiredReraPermits().catch(err => logger.error('RERA permit cron interval error', err));
    }, intervalMs);
    logger.info('RERA permit expiry cron started', { intervalMs });
  },

  stop() {
    if (cronTimer) {
      clearInterval(cronTimer);
      cronTimer = null;
      logger.info('RERA permit expiry cron stopped');
    }
  },
};
