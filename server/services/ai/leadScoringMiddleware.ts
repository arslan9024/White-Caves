/**
 * Lead Scoring Middleware — Phase 4A
 *
 * Real-time lead scoring via Prisma middleware ($use).
 * Automatically triggers async re-scoring when relevant models change:
 *   - Lead create/update → score immediately
 *   - Activity create (with leadId) → re-score the lead
 *   - Viewing create (with leadId) → re-score the lead
 *   - Offer create (with leadId) → re-score the lead
 *   - Transaction create/update (with leadId) → re-score the lead
 *
 * Features:
 *   - Debounce: won't re-score the same lead within 30 seconds
 *   - Async: doesn't block the original operation
 *   - Error isolation: scoring failures never break the original operation
 *   - Tier change detection with event emission
 *
 * Usage:
 *   import { registerLeadScoringMiddleware } from './leadScoringMiddleware';
 *   registerLeadScoringMiddleware(prisma);
 */

import type { PrismaClient, Prisma } from '@prisma/client';
import { scoreLead, getTier } from './leadScoringEngine.js';
import logger from '../../utils/logger.js';

// ─── Debounce Map ───────────────────────────────────────────────────────
// Prevents scoring the same lead multiple times in rapid succession
const DEBOUNCE_MS = 30_000; // 30 seconds
const lastScoredMap = new Map<string, number>();

function shouldScore(leadId: string): boolean {
  const lastScored = lastScoredMap.get(leadId);
  const now = Date.now();
  if (lastScored && now - lastScored < DEBOUNCE_MS) {
    return false;
  }
  lastScoredMap.set(leadId, now);
  return true;
}

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const cutoff = Date.now() - DEBOUNCE_MS * 2;
  for (const [id, ts] of lastScoredMap.entries()) {
    if (ts < cutoff) lastScoredMap.delete(id);
  }
}, 10 * 60 * 1000).unref();

// ─── Tier Change Events ─────────────────────────────────────────────────

export interface TierChangeEvent {
  leadId: string;
  previousScore: number;
  newScore: number;
  previousTier: string;
  newTier: string;
  direction: 'upgraded' | 'downgraded';
  timestamp: string;
}

type TierChangeListener = (event: TierChangeEvent) => void;
const tierChangeListeners: TierChangeListener[] = [];

/**
 * Register a listener for tier change events.
 * Used by auto-routing, notifications, etc.
 */
export function onTierChange(listener: TierChangeListener): () => void {
  tierChangeListeners.push(listener);
  return () => {
    const idx = tierChangeListeners.indexOf(listener);
    if (idx >= 0) tierChangeListeners.splice(idx, 1);
  };
}

function emitTierChange(event: TierChangeEvent): void {
  for (const listener of tierChangeListeners) {
    try {
      listener(event);
    } catch (err) {
      logger.warn('[LeadScoringMiddleware] Tier change listener error', { error: err });
    }
  }
}

// ─── Async Scoring Trigger ──────────────────────────────────────────────

/**
 * Trigger async re-scoring for a lead. Never blocks, never throws.
 * Detects tier changes and emits events.
 */
async function triggerScoring(leadId: string, reason: string): Promise<void> {
  if (!shouldScore(leadId)) {
    logger.debug(`[LeadScoringMiddleware] Debounced scoring for ${leadId} (${reason})`);
    return;
  }

  logger.info(`[LeadScoringMiddleware] Scoring triggered: ${leadId} (${reason})`);

  try {
    const result = await scoreLead(leadId);

    if (result.changed) {
      logger.info(
        `[LeadScoringMiddleware] Score changed: ${result.previousScore} → ${result.newScore} ` +
        `(${result.previousTier} → ${result.newTier}) for ${leadId}`
      );

      // Detect tier change direction
      const TIER_RANK: Record<string, number> = { inactive: 0, cold: 1, warm: 2, hot: 3 };
      const prevRank = TIER_RANK[result.previousTier] ?? 1;
      const newRank = TIER_RANK[result.newTier] ?? 1;

      if (prevRank !== newRank) {
        const event: TierChangeEvent = {
          leadId,
          previousScore: result.previousScore,
          newScore: result.newScore,
          previousTier: result.previousTier,
          newTier: result.newTier,
          direction: newRank > prevRank ? 'upgraded' : 'downgraded',
          timestamp: new Date().toISOString(),
        };
        emitTierChange(event);
      }
    }
  } catch (err) {
    // Never let scoring failures impact the original operation
    logger.warn(`[LeadScoringMiddleware] Scoring failed for ${leadId}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── Extract Lead ID from Prisma args ───────────────────────────────────

function extractLeadIdFromArgs(model: string, action: string, args: Record<string, unknown>): string | null {
  // For Lead model operations
  if (model === 'Lead') {
    // create → args.data.id (not available until after), update → args.where.id
    if (action === 'update' || action === 'upsert') {
      const where = args.where as Record<string, unknown> | undefined;
      return (where?.id as string) || null;
    }
    // For create, we return null — we'll get the ID from the result
    return null;
  }

  // For related models, extract leadId from the data
  const data = args.data as Record<string, unknown> | undefined;
  if (data?.leadId && typeof data.leadId === 'string') {
    return data.leadId;
  }

  // Check where clause for leadId
  const where = args.where as Record<string, unknown> | undefined;
  if (where?.leadId && typeof where.leadId === 'string') {
    return where.leadId;
  }

  return null;
}

// ─── Models that trigger scoring ────────────────────────────────────────

const SCORING_TRIGGERS: Record<string, string[]> = {
  Lead: ['create', 'update', 'upsert'],
  Activity: ['create'],
  Viewing: ['create', 'update'],
  Offer: ['create', 'update'],
  Transaction: ['create', 'update'],
  Commission: ['create'],
};

// ─── Register Middleware ────────────────────────────────────────────────

/**
 * Register Prisma middleware for real-time lead scoring.
 * Call once after PrismaClient initialization.
 *
 * @param prisma - PrismaClient instance to attach middleware to
 */
export function registerLeadScoringMiddleware(prisma: PrismaClient): void {
  const middlewareApi = prisma as PrismaClient & {
    $use?: (
      middleware: (
        params: Prisma.MiddlewareParams,
        next: (params: Prisma.MiddlewareParams) => Promise<unknown>
      ) => Promise<unknown>
    ) => void;
  };

  if (typeof middlewareApi.$use !== 'function') {
    logger.warn('[LeadScoringMiddleware] Prisma middleware API ($use) not available; skipping registration');
    return;
  }

  middlewareApi.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<unknown>) => {
    const model = params.model;
    const action = params.action;

    if (!model || !action) return next(params);

    // Check if this operation should trigger scoring
    const triggeredActions = SCORING_TRIGGERS[model];
    if (!triggeredActions || !triggeredActions.includes(action)) {
      return next(params);
    }

    // Execute the original operation first
    const result = await next(params);

    // Extract lead ID for scoring
    let leadId: string | null = null;

    if (model === 'Lead') {
      if (action === 'create') {
        // For new leads, get the ID from the result
        leadId = (result as Record<string, unknown>)?.id as string || null;
      } else {
        leadId = extractLeadIdFromArgs(model, action, params.args as Record<string, unknown>);
      }
    } else {
      // For related models (Activity, Viewing, Offer, Transaction, Commission)
      leadId = extractLeadIdFromArgs(model, action, params.args as Record<string, unknown>);

      // If not in args, try to get it from the result
      if (!leadId && result) {
        leadId = (result as Record<string, unknown>)?.leadId as string || null;
      }
    }

    // Skip scoring for score_changed / score_override activities (avoid infinite loop)
    if (model === 'Activity' && action === 'create') {
      const data = (params.args as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
      if (data?.action === 'score_changed' || data?.action === 'score_override') {
        return result;
      }
    }

    // Trigger async scoring (fire-and-forget)
    if (leadId) {
      const reason = `${model}.${action}`;
      // Intentionally not awaiting — fire and forget
      triggerScoring(leadId, reason).catch(() => {
        // Already handled inside triggerScoring
      });
    }

    return result;
  });

  logger.info('[LeadScoringMiddleware] Registered — real-time scoring active for: Lead, Activity, Viewing, Offer, Transaction, Commission');
}

// ─── Utilities ──────────────────────────────────────────────────────────

/**
 * Get debounce stats for monitoring/debugging.
 */
export function getMiddlewareStats(): { trackedLeads: number; debounceMs: number } {
  return {
    trackedLeads: lastScoredMap.size,
    debounceMs: DEBOUNCE_MS,
  };
}

/**
 * Clear debounce cache (for testing or forced re-scoring).
 */
export function clearDebounceCache(): void {
  lastScoredMap.clear();
  logger.info('[LeadScoringMiddleware] Debounce cache cleared');
}

export default {
  registerLeadScoringMiddleware,
  onTierChange,
  getMiddlewareStats,
  clearDebounceCache,
};
