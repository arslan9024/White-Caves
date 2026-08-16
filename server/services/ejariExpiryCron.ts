/**
 * Ejari Expiry Warning Cron Service — Wave 33 (REQ-TENANT-003, SRS §4.7)
 *
 * Runs on a daily schedule to:
 * 1. Identify active leases with Ejari expiring within 30 days
 * 2. Update lease `ejariStatus` to 'expiring'
 * 3. Log notification activities for landlords and tenants
 *
 * Dubai Law / Decree No. 26/2013 Compliance
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export interface EjariExpiryCronResult {
  processedCount: number;
  updatedLeaseIds: string[];
}

/**
 * Process all leases with Ejari expiring within 30 days
 */
export async function processEjariExpiries(): Promise<EjariExpiryCronResult> {
  const now = new Date();
  const warningThreshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead

  const expiringLeases = await prisma.lease.findMany({
    where: {
      ejariStatus: 'registered',
      ejariExpiryDate: {
        gte: now,
        lte: warningThreshold,
      },
    },
    select: {
      id: true,
      leaseNumber: true,
      ejariNumber: true,
      ejariExpiryDate: true,
      landlordId: true,
      tenantId: true,
    },
  });

  const updatedLeaseIds: string[] = [];

  for (const lease of expiringLeases) {
    await prisma.lease.update({
      where: { id: lease.id },
      data: { ejariStatus: 'expiring' },
    });

    await prisma.activity.create({
      data: {
        type: 'lease',
        action: 'ejari_expiring_warning',
        description: `Ejari contract ${lease.ejariNumber || lease.id} expires within 30 days (${lease.ejariExpiryDate?.toISOString().split('T')[0]})`,
        userId: lease.landlordId,
      },
    });

    updatedLeaseIds.push(lease.id);
  }

  logger.info('Ejari expiry warning cron completed', {
    processedCount: updatedLeaseIds.length,
    updatedLeaseIds,
  });

  return {
    processedCount: updatedLeaseIds.length,
    updatedLeaseIds,
  };
}

let cronTimer: NodeJS.Timeout | null = null;

export const ejariExpiryCron = {
  start(intervalMs = 24 * 60 * 60 * 1000) {
    if (cronTimer) return;
    // Initial run
    processEjariExpiries().catch(err => logger.error('Ejari expiry cron initial run error', err));
    cronTimer = setInterval(() => {
      processEjariExpiries().catch(err => logger.error('Ejari expiry cron interval error', err));
    }, intervalMs);
    logger.info('Ejari expiry cron started', { intervalMs });
  },

  stop() {
    if (cronTimer) {
      clearInterval(cronTimer);
      cronTimer = null;
      logger.info('Ejari expiry cron stopped');
    }
  },
};
