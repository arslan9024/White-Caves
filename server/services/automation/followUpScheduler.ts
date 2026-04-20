/**
 * Follow-Up Scheduler — Processes due follow-up steps on a regular interval
 *
 * Production:  every 5 minutes (follow-ups need timely execution)
 * Development: every 2 minutes (if ENABLE_DEV_FOLLOWUP=true)
 *
 * Pattern matches leadScoringScheduler.ts (setInterval + overlap guard).
 */

import { processScheduledSteps } from './followUpEngine.js';
import { logger } from '../../utils/logger.js';

const FIVE_MINUTES = 5 * 60 * 1000;
const TWO_MINUTES = 2 * 60 * 1000;

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

async function runFollowUpBatch(): Promise<void> {
  if (isRunning) {
    logger.info('[FollowUpScheduler] Previous batch still running, skipping');
    return;
  }

  isRunning = true;
  try {
    const result = await processScheduledSteps();
    if (result.processed > 0) {
      logger.info(
        `[FollowUpScheduler] Batch complete: ${result.processed} processed, ` +
        `${result.sent} sent, ${result.failed} failed, ${result.skipped} skipped`,
      );
    }
  } catch (error) {
    logger.error('[FollowUpScheduler] Batch error:', error);
  } finally {
    isRunning = false;
  }
}

export function startFollowUpScheduler(): void {
  if (schedulerInterval) {
    logger.info('[FollowUpScheduler] Already running');
    return;
  }

  const isDev = process.env.NODE_ENV !== 'production';
  const enabled = isDev ? process.env.ENABLE_DEV_FOLLOWUP === 'true' : true;

  if (!enabled) {
    logger.info('[FollowUpScheduler] Disabled in dev (set ENABLE_DEV_FOLLOWUP=true to enable)');
    return;
  }

  const interval = isDev ? TWO_MINUTES : FIVE_MINUTES;
  schedulerInterval = setInterval(runFollowUpBatch, interval);

  logger.info(
    `[FollowUpScheduler] Started — processing every ${interval / 1000}s ` +
    `(${isDev ? 'development' : 'production'} mode)`,
  );
}

export function stopFollowUpScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    logger.info('[FollowUpScheduler] Stopped');
  }
}
