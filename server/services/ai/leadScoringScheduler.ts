/**
 * Lead Scoring Scheduler — Cron-style batch re-scoring
 *
 * Runs batchRescoreLeads() every 6 hours in production mode.
 * In development, runs every 30 minutes for testing (if enabled).
 *
 * Usage:
 *   import { startLeadScoringScheduler, stopLeadScoringScheduler } from './leadScoringScheduler.js';
 *   startLeadScoringScheduler();
 */

import { batchRescoreLeads } from './leadScoringEngine.js';
import logger from '../../utils/logger.js';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

let schedulerTimer: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

/**
 * Start the lead scoring scheduler.
 * Production: every 6 hours
 * Development: every 30 minutes (if ENABLE_DEV_SCORING=true)
 */
export function startLeadScoringScheduler(): void {
  if (schedulerTimer) {
    logger.warn('[LeadScoringScheduler] Already running — skipping duplicate start');
    return;
  }

  const isProd = process.env.NODE_ENV === 'production';
  const enableDev = process.env.ENABLE_DEV_SCORING === 'true';

  if (!isProd && !enableDev) {
    logger.info('[LeadScoringScheduler] Skipped — not in production and ENABLE_DEV_SCORING not set');
    return;
  }

  const interval = isProd ? SIX_HOURS_MS : THIRTY_MINUTES_MS;
  const desc = isProd ? '6 hours' : '30 minutes';

  logger.info(`[LeadScoringScheduler] Starting — batch re-score every ${desc}`);

  schedulerTimer = setInterval(async () => {
    if (isRunning) {
      logger.warn('[LeadScoringScheduler] Previous batch still running — skipping');
      return;
    }

    isRunning = true;
    try {
      const result = await batchRescoreLeads();
      logger.info(`[LeadScoringScheduler] Batch complete: ${result.scored}/${result.total} scored, ` +
        `${result.upgraded} upgraded, ${result.downgraded} downgraded (${result.duration}ms)`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[LeadScoringScheduler] Batch failed: ${msg}`);
    } finally {
      isRunning = false;
    }
  }, interval);
}

/**
 * Stop the lead scoring scheduler (for graceful shutdown).
 */
export function stopLeadScoringScheduler(): void {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
    logger.info('[LeadScoringScheduler] Stopped');
  }
}

export default { startLeadScoringScheduler, stopLeadScoringScheduler };
