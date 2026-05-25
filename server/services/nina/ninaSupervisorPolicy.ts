/**
 * W5-006 — Nina Supervisor Policy Engine v1
 *
 * Upgrades Nina from a pure NLP classifier to a cross-lane
 * policy engine that can:
 *  - evaluate supervisor context from either Linda or Nadia
 *  - emit deterministic policy decisions with audit trails
 *  - track overrides and compute governance metrics
 *
 * Decision priority order (first matching rule wins):
 *  1. flag_anomaly  — consecutive low-confidence NLP streak
 *  2. block         — marketing template with no opt-in
 *  3. escalate      — strong negative sentiment
 *  4. assign_agent  — outside the 24-hour service window (Nadia only)
 *  5. auto_respond  — high-confidence intent, no blocking conditions
 *  6. assign_agent  — default fallback
 */

export type PolicyDecisionType =
  | 'auto_respond'
  | 'assign_agent'
  | 'escalate'
  | 'flag_anomaly'
  | 'block';

export interface PolicyDecision {
  id: string;
  decisionType: PolicyDecisionType;
  confidence: number;
  reasonCodes: string[];
  policyVersion: string;
  timestamp: Date;
  overrideAllowed: boolean;
  supervisorNotes?: string;
}

export interface SupervisorContext {
  /** Total messages exchanged in the conversation */
  messageCount: number;
  /** Primary intent confidence from NinaEngine (0–1) */
  lastIntentConfidence: number;
  /** Sentiment score from NinaEngine (-1 to 1) */
  sentimentScore: number;
  /** Which transport lane originated the message */
  lane: 'linda' | 'nadia';
  /** Whether the customer has a valid WABA opt-in record */
  hasOptIn: boolean;
  /** Whether the message falls within the 24-hour service window */
  isWithin24hWindow: boolean;
  /** How many consecutive messages had intent confidence < 0.4 */
  consecutiveLowConfidence: number;
}

const POLICY_VERSION = '1.0.0';
const DECISION_LOG_CAP = 100;

// Thresholds
const ANOMALY_LOW_CONFIDENCE_THRESHOLD = 0.4;
const ANOMALY_STREAK_THRESHOLD = 3;
const NEGATIVE_SENTIMENT_THRESHOLD = -0.6;
const AUTO_RESPOND_CONFIDENCE_THRESHOLD = 0.7;

function generateDecisionId(): string {
  return `pd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export class NinaSupervisorPolicy {
  private readonly decisionLog: PolicyDecision[] = [];
  private readonly overrideLog: Map<
    string,
    { override: PolicyDecisionType; agentId: string; recordedAt: Date }
  > = new Map();

  /**
   * Evaluate a supervisor context and emit a policy decision.
   */
  evaluate(ctx: SupervisorContext): PolicyDecision {
    const decision = this.applyRules(ctx);
    this.appendToLog(decision);
    return decision;
  }

  /**
   * Record a human agent override for an existing decision.
   */
  recordFeedback(decisionId: string, override: PolicyDecisionType, agentId: string): void {
    this.overrideLog.set(decisionId, { override, agentId, recordedAt: new Date() });
  }

  /**
   * Return the last N decisions (capped at DECISION_LOG_CAP).
   */
  getDecisionLog(): PolicyDecision[] {
    return [...this.decisionLog];
  }

  /**
   * Compute aggregate governance metrics.
   */
  getMetrics(): {
    totalDecisions: number;
    byType: Record<PolicyDecisionType, number>;
    averageConfidence: number;
    overrideRate: number;
  } {
    const byType: Record<PolicyDecisionType, number> = {
      auto_respond: 0,
      assign_agent: 0,
      escalate: 0,
      flag_anomaly: 0,
      block: 0,
    };

    let confidenceSum = 0;

    for (const d of this.decisionLog) {
      byType[d.decisionType] += 1;
      confidenceSum += d.confidence;
    }

    const total = this.decisionLog.length;
    const overrides = this.overrideLog.size;

    return {
      totalDecisions: total,
      byType,
      averageConfidence: total > 0 ? confidenceSum / total : 0,
      overrideRate: total > 0 ? overrides / total : 0,
    };
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private applyRules(ctx: SupervisorContext): PolicyDecision {
    // Rule 1: Anomaly — NLP confidence streak below threshold
    if (
      ctx.lastIntentConfidence < ANOMALY_LOW_CONFIDENCE_THRESHOLD &&
      ctx.consecutiveLowConfidence >= ANOMALY_STREAK_THRESHOLD
    ) {
      return this.makeDecision('flag_anomaly', 0.9, ['low_confidence_streak'], true);
    }

    // Rule 2: Block — MARKETING template without opt-in
    if (!ctx.hasOptIn) {
      return this.makeDecision('block', 1.0, ['no_opt_in'], false, 'Opt-in required for marketing sends');
    }

    // Rule 3: Escalate — strong negative sentiment
    if (ctx.sentimentScore < NEGATIVE_SENTIMENT_THRESHOLD) {
      return this.makeDecision('escalate', 0.85, ['negative_sentiment'], true);
    }

    // Rule 4: Assign agent — outside 24-hour service window (Nadia/WABA lane only)
    if (!ctx.isWithin24hWindow && ctx.lane === 'nadia') {
      return this.makeDecision('assign_agent', 0.8, ['outside_service_window'], true);
    }

    // Rule 5: Auto-respond — high-confidence intent, no blockers
    if (ctx.lastIntentConfidence >= AUTO_RESPOND_CONFIDENCE_THRESHOLD) {
      return this.makeDecision('auto_respond', ctx.lastIntentConfidence, ['high_confidence_intent'], true);
    }

    // Rule 6: Default fallback
    return this.makeDecision('assign_agent', 0.6, ['default_fallback'], true);
  }

  private makeDecision(
    decisionType: PolicyDecisionType,
    confidence: number,
    reasonCodes: string[],
    overrideAllowed: boolean,
    supervisorNotes?: string
  ): PolicyDecision {
    return {
      id: generateDecisionId(),
      decisionType,
      confidence,
      reasonCodes,
      policyVersion: POLICY_VERSION,
      timestamp: new Date(),
      overrideAllowed,
      supervisorNotes,
    };
  }

  private appendToLog(decision: PolicyDecision): void {
    this.decisionLog.push(decision);
    // Keep log bounded
    if (this.decisionLog.length > DECISION_LOG_CAP) {
      this.decisionLog.shift();
    }
  }
}

/**
 * Module-level singleton used by Nadia/Linda orchestration paths.
 */
export const ninaSupervisorPolicy = new NinaSupervisorPolicy();
