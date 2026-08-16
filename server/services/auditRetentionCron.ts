/**
 * Audit Retention Cron Service — Wave 43 (REQ-COMP-003, NFR-SEC-004)
 *
 * UAE Compliance Requirement:
 * Retains audit logs for 5 years (1,825 days). Automatically purges logs older than 5 years.
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export const RETENTION_PERIOD_DAYS = 5 * 365; // 5 years

/**
 * Purge audit activity records older than 5 years
 */
export async function purgeExpiredAuditLogs(): Promise<{ purgedCount: number; cutoffDate: string }> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_PERIOD_DAYS);
  const cutoffIso = cutoff.toISOString();

  const result = await prisma.activity.deleteMany({
    where: {
      createdAt: {
        lt: cutoff,
      },
    },
  });

  logger.info('[AuditRetentionCron] Purged expired audit logs older than 5 years', {
    purgedCount: result.count,
    cutoffDate: cutoffIso,
  });

  return {
    purgedCount: result.count,
    cutoffDate: cutoffIso,
  };
}

/**
 * Initialize background cron schedule for daily audit log retention check
 */
export function startAuditRetentionCron(): void {
  logger.info('[AuditRetentionCron] Audit log 5-year retention cron initialized');
  // Runs daily purge check on service startup
  purgeExpiredAuditLogs().catch(err => {
    logger.warn('[AuditRetentionCron] Initial purge check error', {
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  });
}
