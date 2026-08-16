/**
 * Maintenance SLA Clock & Breach Cron Service — Wave 36 (W36-004)
 *
 * Runs hourly to:
 * 1. Identify open/in_progress maintenance requests whose `slaDeadline` has passed
 * 2. Mark `slaBreached: true`
 * 3. Log escalation activity and send manager alerts
 *
 * Emergency SLA: 4 hours
 * Normal SLA: 48 hours
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export interface MaintenanceSLACronResult {
  breachedCount: number;
  breachedIds: string[];
}

/**
 * Process maintenance SLA deadlines and flag breached requests
 */
export async function processMaintenanceSLAChecks(): Promise<MaintenanceSLACronResult> {
  const now = new Date();

  const breachedRequests = await prisma.maintenance.findMany({
    where: {
      status: { in: ['open', 'in_progress'] },
      slaDeadline: { lt: now },
      slaBreached: false,
    },
    select: {
      id: true,
      title: true,
      priority: true,
      slaDeadline: true,
      requesterId: true,
      contractorName: true,
    },
  });

  const breachedIds: string[] = [];

  for (const req of breachedRequests) {
    await prisma.maintenance.update({
      where: { id: req.id },
      data: { slaBreached: true },
    });

    await prisma.activity.create({
      data: {
        type: 'maintenance',
        action: 'sla_breached_alert',
        description: `SLA BREACH: Maintenance #${req.id} ("${req.title}", priority: ${req.priority.toUpperCase()}) passed deadline of ${req.slaDeadline?.toISOString()}`,
        userId: req.requesterId,
      },
    });

    breachedIds.push(req.id);
  }

  logger.info('[MaintenanceSLACron] checked SLA deadlines', {
    breachedCount: breachedIds.length,
    breachedIds,
  });

  return {
    breachedCount: breachedIds.length,
    breachedIds,
  };
}

let cronTimer: NodeJS.Timeout | null = null;

export const maintenanceSLACron = {
  start(intervalMs = 60 * 60 * 1000) {
    if (cronTimer) return;
    processMaintenanceSLAChecks().catch(err => logger.error('Maintenance SLA cron initial run error', err));
    cronTimer = setInterval(() => {
      processMaintenanceSLAChecks().catch(err => logger.error('Maintenance SLA cron interval error', err));
    }, intervalMs);
    logger.info('Maintenance SLA cron started', { intervalMs });
  },

  stop() {
    if (cronTimer) {
      clearInterval(cronTimer);
      cronTimer = null;
      logger.info('Maintenance SLA cron stopped');
    }
  },
};
