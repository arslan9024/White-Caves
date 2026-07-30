import { prisma } from '../../database.js';
import {
  getLindaClientForMode,
  getLindaCoreMode,
  LindaStatus,
} from './linda-core/adapters/LindaCoreAdapter.js';
import {
  buildLindaParitySnapshot,
  emitLindaParitySnapshot,
} from './linda-core/bridge/shadowParityReporter.js';
import { rateLimiter } from './whatsappUtils.js';
import { LINDA_ENABLED } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

const db = prisma as any;
const DISPATCHABLE_STATUSES = new Set(['draft', 'scheduled']);

function applyTemplate(
  messageTemplate: string,
  templateVars?: Record<string, unknown> | null
): string {
  if (!templateVars || typeof templateVars !== 'object') return messageTemplate;
  let rendered = messageTemplate;
  for (const [key, value] of Object.entries(templateVars)) {
    rendered = rendered.split(`{{${key}}}`).join(String(value));
  }
  return rendered;
}

async function getOrInitLindaForCampaigns() {
  const mode = getLindaCoreMode();
  const linda = getLindaClientForMode({
    sessionPath: process.env.LINDA_SESSIONS_PATH || './.linda-sessions',
    headless: process.env.LINDA_HEADLESS !== 'false',
    autoRestart: true,
  });

  if (LINDA_ENABLED && linda.getStatus() === LindaStatus.DISCONNECTED) {
    try {
      await linda.initialize();
    } catch (err) {
      logger.warn(
        `[LindaCampaignService] Auto-init failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (mode === 'shadow') {
    emitLindaParitySnapshot(buildLindaParitySnapshot('campaign_get_or_init', linda, mode));
  }

  return linda;
}

export async function dispatchLindaCampaign(campaignId: string) {
  const campaign = await db.lindaBroadcastCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) throw new Error('Campaign not found');

  if (!DISPATCHABLE_STATUSES.has(campaign.status)) {
    throw new Error(`Campaign cannot be dispatched from status: ${campaign.status}`);
  }

  logger.info(
    `[LindaCampaignService] Dispatch start campaign=${campaign.id} status=${campaign.status} targets=${campaign.targetList?.length || 0}`
  );

  const linda = await getOrInitLindaForCampaigns();
  const finalMessage = applyTemplate(
    campaign.messageTemplate,
    campaign.templateVars as Record<string, unknown> | null
  );

  await db.lindaBroadcastCampaign.update({
    where: { id: campaign.id },
    data: {
      status: 'running',
      startedAt: new Date(),
    },
  });

  const recipients = (campaign.targetList || [])
    .map((p: unknown) => String(p).replace(/\D/g, ''))
    .filter(Boolean);

  if (recipients.length === 0) {
    await db.lindaBroadcastCampaign.update({
      where: { id: campaign.id },
      data: {
        status: 'failed',
        completedAt: new Date(),
        failedCount: 0,
        sentCount: 0,
        results: [{ error: 'no_valid_recipients' }],
      },
    });
    throw new Error('Campaign has no valid recipients after normalization');
  }

  const blockedResults: Array<{ phone: string; error?: string }> = [];
  const allowedRecipients: string[] = [];

  for (const phone of recipients) {
    const allowance = rateLimiter.canSend(phone);
    if (allowance.allowed) {
      allowedRecipients.push(phone);
    } else {
      blockedResults.push({
        phone,
        error: `rate_limited_retry_after_${allowance.retryAfterMs}ms`,
      });
    }
  }

  const sendResults = await linda.broadcastMessage(allowedRecipients, finalMessage);
  const combinedResults = [...sendResults, ...blockedResults];
  const sentCount = combinedResults.filter(r => !r.error).length;
  const failedCount = combinedResults.filter(r => !!r.error).length;

  const status = failedCount === 0 ? 'completed' : sentCount > 0 ? 'completed' : 'failed';

  logger.info(
    `[LindaCampaignService] Dispatch complete campaign=${campaign.id} status=${status} sent=${sentCount} failed=${failedCount}`
  );

  return db.lindaBroadcastCampaign.update({
    where: { id: campaign.id },
    data: {
      status,
      sentCount,
      failedCount,
      completedAt: new Date(),
      results: combinedResults,
    },
  });
}

export async function dispatchDueLindaCampaigns(limit = 20) {
  const now = new Date();
  const dueCampaigns = await db.lindaBroadcastCampaign.findMany({
    where: {
      status: 'scheduled',
      scheduledAt: { lte: now },
    },
    orderBy: { scheduledAt: 'asc' },
    take: limit,
    select: { id: true },
  });

  const results: Array<{ id: string; success: boolean; error?: string }> = [];
  for (const c of dueCampaigns) {
    try {
      await dispatchLindaCampaign(c.id);
      results.push({ id: c.id, success: true });
    } catch (err) {
      results.push({
        id: c.id,
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  logger.info(
    `[LindaCampaignService] Due dispatch summary due=${dueCampaigns.length} dispatched=${results.filter(r => r.success).length} failed=${results.filter(r => !r.success).length}`
  );

  return {
    due: dueCampaigns.length,
    dispatched: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
}

let campaignSchedulerInterval: ReturnType<typeof setInterval> | null = null;
let schedulerRunning = false;

export async function runLindaCampaignSchedulerTick(): Promise<'ran' | 'skipped'> {
  if (schedulerRunning) return 'skipped';

  schedulerRunning = true;
  try {
    const result = await dispatchDueLindaCampaigns();
    if (result.due > 0) {
      logger.info(
        `[LindaCampaignScheduler] Processed due campaigns: due=${result.due}, dispatched=${result.dispatched}, failed=${result.failed}`
      );
    }
    return 'ran';
  } catch (err) {
    logger.error('[LindaCampaignScheduler] Batch error:', err);
    return 'ran';
  } finally {
    schedulerRunning = false;
  }
}

export function startLindaCampaignScheduler(): void {
  if (campaignSchedulerInterval) {
    logger.info('[LindaCampaignScheduler] Already running');
    return;
  }

  const isDev = process.env.NODE_ENV !== 'production';
  const enabled = isDev
    ? process.env.ENABLE_DEV_LINDA_CAMPAIGN_SCHEDULER === 'true'
    : LINDA_ENABLED;

  if (!enabled) {
    logger.info('[LindaCampaignScheduler] Disabled in current environment');
    return;
  }

  const intervalMs = isDev ? 60_000 : 5 * 60 * 1000;

  campaignSchedulerInterval = setInterval(() => {
    void runLindaCampaignSchedulerTick();
  }, intervalMs);

  logger.info(
    `[LindaCampaignScheduler] Started (${isDev ? 'development' : 'production'}) every ${intervalMs / 1000}s`
  );
}

export function stopLindaCampaignScheduler(): void {
  if (!campaignSchedulerInterval) return;
  clearInterval(campaignSchedulerInterval);
  campaignSchedulerInterval = null;
  logger.info('[LindaCampaignScheduler] Stopped');
}
