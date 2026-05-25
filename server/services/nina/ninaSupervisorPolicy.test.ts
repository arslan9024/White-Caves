import { describe, it, expect, beforeEach } from 'vitest';
import { NinaSupervisorPolicy, type SupervisorContext } from './ninaSupervisorPolicy.js';

function makeCtx(overrides: Partial<SupervisorContext> = {}): SupervisorContext {
  return {
    messageCount: 5,
    lastIntentConfidence: 0.75,
    sentimentScore: 0.1,
    lane: 'nadia',
    hasOptIn: true,
    isWithin24hWindow: true,
    consecutiveLowConfidence: 0,
    ...overrides,
  };
}

describe('NinaSupervisorPolicy', () => {
  let policy: NinaSupervisorPolicy;

  beforeEach(() => {
    policy = new NinaSupervisorPolicy();
  });

  // ─── Rule 1: flag_anomaly ────────────────────────────────────────────────

  it('emits flag_anomaly when consecutive low-confidence streak >= 3', () => {
    const decision = policy.evaluate(
      makeCtx({ lastIntentConfidence: 0.2, consecutiveLowConfidence: 3 })
    );
    expect(decision.decisionType).toBe('flag_anomaly');
    expect(decision.reasonCodes).toContain('low_confidence_streak');
  });

  it('does NOT emit flag_anomaly when streak < 3', () => {
    const decision = policy.evaluate(
      makeCtx({ lastIntentConfidence: 0.2, consecutiveLowConfidence: 2 })
    );
    expect(decision.decisionType).not.toBe('flag_anomaly');
  });

  it('does NOT emit flag_anomaly when confidence is above threshold even with streak >= 3', () => {
    // confidence >= 0.4 breaks the anomaly rule
    const decision = policy.evaluate(
      makeCtx({ lastIntentConfidence: 0.5, consecutiveLowConfidence: 5 })
    );
    expect(decision.decisionType).not.toBe('flag_anomaly');
  });

  // ─── Rule 2: block (no opt-in) ──────────────────────────────────────────

  it('emits block when hasOptIn is false', () => {
    const decision = policy.evaluate(makeCtx({ hasOptIn: false }));
    expect(decision.decisionType).toBe('block');
    expect(decision.reasonCodes).toContain('no_opt_in');
    expect(decision.overrideAllowed).toBe(false);
  });

  it('block takes priority over negative sentiment', () => {
    const decision = policy.evaluate(makeCtx({ hasOptIn: false, sentimentScore: -0.9 }));
    expect(decision.decisionType).toBe('block');
  });

  // ─── Rule 3: escalate ───────────────────────────────────────────────────

  it('emits escalate for strong negative sentiment', () => {
    const decision = policy.evaluate(makeCtx({ sentimentScore: -0.7 }));
    expect(decision.decisionType).toBe('escalate');
    expect(decision.reasonCodes).toContain('negative_sentiment');
  });

  it('does NOT escalate when sentiment is above threshold', () => {
    const decision = policy.evaluate(makeCtx({ sentimentScore: -0.5 }));
    expect(decision.decisionType).not.toBe('escalate');
  });

  // ─── Rule 4: assign_agent (outside 24h window) ──────────────────────────

  it('emits assign_agent when outside service window on nadia lane', () => {
    const decision = policy.evaluate(makeCtx({ isWithin24hWindow: false, lane: 'nadia' }));
    expect(decision.decisionType).toBe('assign_agent');
    expect(decision.reasonCodes).toContain('outside_service_window');
  });

  it('does NOT apply 24h-window rule for linda lane', () => {
    // On Linda lane, outside window does not trigger assign_agent from this rule
    const decision = policy.evaluate(
      makeCtx({ isWithin24hWindow: false, lane: 'linda', lastIntentConfidence: 0.8 })
    );
    expect(decision.decisionType).toBe('auto_respond');
  });

  // ─── Rule 5: auto_respond ────────────────────────────────────────────────

  it('emits auto_respond when confidence >= 0.7 and no blockers', () => {
    const decision = policy.evaluate(makeCtx({ lastIntentConfidence: 0.8 }));
    expect(decision.decisionType).toBe('auto_respond');
    expect(decision.confidence).toBeCloseTo(0.8);
  });

  it('emits auto_respond on boundary confidence of 0.7', () => {
    const decision = policy.evaluate(makeCtx({ lastIntentConfidence: 0.7 }));
    expect(decision.decisionType).toBe('auto_respond');
  });

  // ─── Rule 6: default assign_agent ────────────────────────────────────────

  it('emits assign_agent as default when confidence is below auto_respond threshold', () => {
    const decision = policy.evaluate(makeCtx({ lastIntentConfidence: 0.5 }));
    expect(decision.decisionType).toBe('assign_agent');
    expect(decision.reasonCodes).toContain('default_fallback');
  });

  // ─── Decision log ────────────────────────────────────────────────────────

  it('logs each decision', () => {
    policy.evaluate(makeCtx());
    policy.evaluate(makeCtx());
    expect(policy.getDecisionLog()).toHaveLength(2);
  });

  it('decision log is capped at 100 entries', () => {
    for (let i = 0; i < 110; i++) {
      policy.evaluate(makeCtx());
    }
    expect(policy.getDecisionLog().length).toBeLessThanOrEqual(100);
  });

  it('recordFeedback stores the override', () => {
    const decision = policy.evaluate(makeCtx());
    expect(() => policy.recordFeedback(decision.id, 'escalate', 'agent-007')).not.toThrow();
  });

  // ─── Metrics ─────────────────────────────────────────────────────────────

  it('getMetrics returns correct totals', () => {
    policy.evaluate(makeCtx({ lastIntentConfidence: 0.8 })); // auto_respond
    policy.evaluate(makeCtx({ hasOptIn: false })); // block
    const metrics = policy.getMetrics();
    expect(metrics.totalDecisions).toBe(2);
    expect(metrics.byType.auto_respond).toBe(1);
    expect(metrics.byType.block).toBe(1);
  });

  it('getMetrics returns 0 when no decisions recorded', () => {
    const metrics = policy.getMetrics();
    expect(metrics.totalDecisions).toBe(0);
    expect(metrics.averageConfidence).toBe(0);
    expect(metrics.overrideRate).toBe(0);
  });

  it('decision IDs are unique', () => {
    const d1 = policy.evaluate(makeCtx());
    const d2 = policy.evaluate(makeCtx());
    expect(d1.id).not.toBe(d2.id);
  });

  it('policyVersion is included in every decision', () => {
    const decision = policy.evaluate(makeCtx());
    expect(decision.policyVersion).toBeTruthy();
  });
});
