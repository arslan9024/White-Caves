/**
 * W5-007 — Cross-Lane Routing Arbitration
 *
 * Provides deterministic, provenance-tagged routing decisions for all
 * inbound and outbound communications events across:
 *  - Linda lane: localauth / agent-device WhatsApp sessions
 *  - Nadia lane: WABA / Meta Cloud API
 *
 * Also maintains a 60-second deduplication window to prevent double-handling
 * the same message across both lanes.
 */

export type Lane = 'linda' | 'nadia' | 'unknown';

export type Provider = 'localauth' | 'meta' | 'unknown';

export interface MessageProvenance {
  lane: Lane;
  provider: Provider;
  policyVersion: string;
  sourceLane: Lane;
  dedupeKey: string;
  processedAt: Date;
}

export interface LaneRouterResult {
  lane: Lane;
  provenance: MessageProvenance;
  reason: string;
  handledBy: 'linda' | 'nadia' | 'supervisor';
}

export interface RoutingMessage {
  from: string;
  body?: string;
  providerHint?: string;
  isTemplate?: boolean;
  dedupeKey?: string;
}

const POLICY_VERSION = '1.0.0';
const DEDUPE_WINDOW_MS = 60_000;

function resolveProvider(providerHint?: string): Provider {
  if (!providerHint) return 'unknown';
  const lower = providerHint.toLowerCase();
  if (lower === 'localauth') return 'localauth';
  if (lower === 'meta' || lower === 'waba') return 'meta';
  return 'unknown';
}

export class LaneRouter {
  private readonly dedupeCache: Map<string, Date> = new Map();
  private readonly routingStats: Record<Lane, number> = {
    linda: 0,
    nadia: 0,
    unknown: 0,
  };

  /**
   * Route a message to the correct lane and return full provenance.
   */
  route(message: RoutingMessage): LaneRouterResult {
    const dedupeKey = message.dedupeKey || this.buildDedupeKey(message);

    // Check for duplicate processing
    if (this.isDuplicate(dedupeKey)) {
      const provenance = this.buildProvenance('unknown', 'unknown', dedupeKey);
      this.routingStats.unknown += 1;
      return {
        lane: 'unknown',
        provenance,
        reason: 'duplicate_detected',
        handledBy: 'supervisor',
      };
    }

    this.markProcessed(dedupeKey);

    const provider = resolveProvider(message.providerHint);

    // Rule 1: explicit Meta/WABA hint → Nadia
    if (provider === 'meta') {
      return this.decision('nadia', provider, dedupeKey, 'meta_provider_hint', 'nadia');
    }

    // Rule 2: explicit localauth hint → Linda
    if (provider === 'localauth') {
      return this.decision('linda', provider, dedupeKey, 'localauth_provider_hint', 'linda');
    }

    // Rule 3: template messages always go through Nadia (WABA lane)
    if (message.isTemplate === true) {
      return this.decision('nadia', 'meta', dedupeKey, 'template_requires_waba', 'nadia');
    }

    // Rule 4: default → Nadia (WABA is the primary enterprise lane)
    return this.decision('nadia', 'unknown', dedupeKey, 'default_waba_lane', 'nadia');
  }

  /**
   * Returns true if the dedupeKey was processed within the last 60 seconds.
   */
  isDuplicate(dedupeKey: string): boolean {
    const processedAt = this.dedupeCache.get(dedupeKey);
    if (!processedAt) return false;
    return Date.now() - processedAt.getTime() < DEDUPE_WINDOW_MS;
  }

  /**
   * Record a dedupeKey as processed right now.
   */
  markProcessed(dedupeKey: string): void {
    this.dedupeCache.set(dedupeKey, new Date());
  }

  /**
   * Remove dedupe entries older than the given threshold (default: 60 s).
   * Returns the count of entries removed.
   */
  clearDuplicates(olderThanMs: number = DEDUPE_WINDOW_MS): number {
    const cutoff = Date.now() - olderThanMs;
    let removed = 0;
    for (const [key, processedAt] of this.dedupeCache) {
      if (processedAt.getTime() < cutoff) {
        this.dedupeCache.delete(key);
        removed++;
      }
    }
    return removed;
  }

  /**
   * Return per-lane routing counts.
   */
  getStats(): Record<Lane, number> {
    return { ...this.routingStats };
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private decision(
    lane: Lane,
    provider: Provider,
    dedupeKey: string,
    reason: string,
    handledBy: 'linda' | 'nadia' | 'supervisor'
  ): LaneRouterResult {
    this.routingStats[lane] += 1;
    return {
      lane,
      provenance: this.buildProvenance(lane, provider, dedupeKey),
      reason,
      handledBy,
    };
  }

  private buildProvenance(lane: Lane, provider: Provider, dedupeKey: string): MessageProvenance {
    return {
      lane,
      provider,
      policyVersion: POLICY_VERSION,
      sourceLane: lane,
      dedupeKey,
      processedAt: new Date(),
    };
  }

  private buildDedupeKey(message: RoutingMessage): string {
    const body = message.body || '';
    const from = message.from || '';
    // Simple content hash: from + first 64 chars of body
    const digest = `${from}:${body.slice(0, 64)}`;
    return `dk-${digest.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9:_-]/g, '').slice(0, 80)}`;
  }
}

/**
 * Module-level singleton used by webhook and route handlers.
 */
export const laneRouter = new LaneRouter();
