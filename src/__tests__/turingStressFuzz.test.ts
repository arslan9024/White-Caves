// @vitest-environment node
/**
 * turingStressFuzz.test.ts — Phase 9 Test Expansion
 * Covers:
 * 1. Stress testing TuringQueue under high-volume concurrent task bursts (100+ tasks).
 * 2. Hot-reload rule version increments & dynamic plugin rule registration.
 * 3. Fuzz testing TuringOrchestrator prompt evaluation, Context Triad validation, and circuit breaker resilience.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TuringOrchestrator, turingOrchestrator } from '../../.agents/aegis/core-loop/turingOrchestrator';
import { TuringQueue } from '../../.agents/aegis/core-loop/turingQueue';
import { RULES_VERSION, bumpRulesVersion } from '../../.agents/aegis/core-loop/turingConstants';
import { registerPlugin, pluginRegistry } from '../../.agents/aegis/core-loop/turingPlugin';
import {
  isOpen,
  recordFailure,
  resetFailures,
  getFailureCount,
} from '../../.agents/aegis/core-loop/turingCircuitBreaker';
import { computeHash, verifyPlanIntegrity, saveHashes } from '../../.agents/aegis/core-loop/turingIntegrity';
import { debounce } from '../../.agents/aegis/core-loop/turingDebounce';
import { getMetrics, inc, set } from '../../.agents/aegis/core-loop/turingMetrics';
import { runWithRequestId, getCurrentRequestId } from '../../.agents/aegis/core-loop/turingRequestContext';
import { serializeError } from '../../.agents/aegis/core-loop/turingErrorUtil';
import { OrchestratorError, PlanReadError, RuleEvalError } from '../../.agents/aegis/core-loop/turingErrors';

describe('Phase 9 — Turing Orchestrator Stress, Hot-Reload, and Fuzz Suite', () => {
  beforeEach(() => {
    resetFailures();
    pluginRegistry.length = 0;
  });

  afterEach(async () => {
    await turingOrchestrator.shutdown();
    resetFailures();
    pluginRegistry.length = 0;
  });

  it('Stress: TuringQueue processes 120 concurrent async tasks while strictly respecting maxConcurrent=8', async () => {
    const queue = new TuringQueue(8);
    let completed = 0;

    const tasks = Array.from({ length: 120 }, (_, idx) =>
      queue.enqueue(async () => {
        await new Promise(res => setTimeout(res, (idx % 3) + 1));
        completed++;
        return idx;
      })
    );

    const results = await Promise.all(tasks);
    expect(results).toHaveLength(120);
    expect(completed).toBe(120);
    expect(queue.peakConcurrentCount).toBeLessThanOrEqual(8);
    expect(queue.activeCount).toBe(0);
    expect(queue.pendingCount).toBe(0);
  });

  it('Hot-Reload & Plugin Lifecycle: bumps RULES_VERSION and dynamically injects custom audit rules', () => {
    const initialVersion = RULES_VERSION;
    const nextVersion = bumpRulesVersion();
    expect(nextVersion).toBe(initialVersion + 1);

    let pluginInitialized = false;
    registerPlugin({
      init() {
        pluginInitialized = true;
      },
      getRulePriority() {
        return 10;
      },
      getRules() {
        return [
          {
            id: 'CUSTOM-HOT-RULE-999',
            name: 'Block Hardcoded Production Secrets',
            description: 'Blocks prompts containing hardcoded prod private keys',
            check: ctx => {
              if (ctx.promptText.includes('BEGIN_PROD_PRIVATE_KEY')) {
                return { valid: false, message: 'Hardcoded production private key blocked by plugin.' };
              }
              return { valid: true };
            },
          },
        ];
      },
    });

    expect(pluginInitialized).toBe(true);

    const evalRes = turingOrchestrator.evaluatePromptContext({
      promptText: 'Inject BEGIN_PROD_PRIVATE_KEY into config',
    });
    expect(evalRes.passed).toBe(false);
    expect(evalRes.violations.some(v => v.includes('CUSTOM-HOT-RULE-999'))).toBe(true);
  });

  it('Fuzz: evaluates randomized adversarial and malformed prompt inputs without throwing', () => {
    const fuzzInputs = [
      '',
      '   ',
      '\0\r\n\t🔥🇦🇪',
      'A'.repeat(10000),
      'createContext(CustomBadContext) && leftsidebar explorer && zero vat && read all files in repo',
      'ThemeContext LanguageContext CurrencyContext createContext',
      JSON.stringify({ nested: ['rename', 'scaffold', 'search', 'summarize'] }),
    ];

    for (const input of fuzzInputs) {
      const debtResult = turingOrchestrator.evaluatePromptContext({
        promptText: input,
        targetFiles: ['src/App.tsx', 'server/index.ts'],
      });
      expect(typeof debtResult.passed).toBe('boolean');
      expect(debtResult.score).toBeGreaterThanOrEqual(0);
      expect(debtResult.score).toBeLessThanOrEqual(100);

      const budgetPlan = turingOrchestrator.evaluateCreditAndSpeedBudget({
        promptText: input,
        targetFiles: ['src/__tests__/turingOrchestrator.test.ts'],
      });
      expect(['ZERO_TOKEN_SCRIPT', 'FLASH_FAST_LANE', 'SURGICAL_SINGLE_TURN']).toContain(
        budgetPlan.executionLane
      );
      expect(budgetPlan.maxTokenCeiling).toBeLessThanOrEqual(15000);
    }
  });

  it('Circuit Breaker & Error Hierarchy: opens after 5 consecutive failures and resets cleanly', () => {
    expect(isOpen()).toBe(false);
    for (let i = 0; i < 5; i++) {
      recordFailure();
    }
    expect(getFailureCount()).toBe(5);
    expect(isOpen()).toBe(true);

    resetFailures();
    expect(getFailureCount()).toBe(0);
    expect(isOpen()).toBe(false);

    const planErr = new PlanReadError('Corrupt plan');
    const ruleErr = new RuleEvalError('Rule failed');
    const baseErr = new OrchestratorError('Generic error');
    expect(planErr.code).toBe('PLAN_READ_ERR');
    expect(ruleErr.code).toBe('RULE_EVAL_ERR');
    expect(baseErr.code).toBe('ORCH_ERR');
    expect(serializeError(planErr).name).toBe('PlanReadError');
    expect(serializeError('raw-string')).toEqual({ error: 'raw-string' });
  });

  it('Integrity, Debounce, Metrics & RequestContext: verifies SHA-256 hashes, async context, and counters', async () => {
    saveHashes({});
    const hash1 = computeHash('# Plan A\n- [ ] Item 1');
    expect(hash1).toHaveLength(64);
    expect(() => verifyPlanIntegrity('plan-a.md', '# Plan A\n- [ ] Item 1')).not.toThrow();
    expect(() => verifyPlanIntegrity('plan-a.md', '# Plan A\n- [x] Tampered')).toThrow(PlanReadError);
    saveHashes({});

    inc('test_counter_total', 3);
    set('test_gauge_value', 42);
    const metricsText = getMetrics();
    expect(metricsText).toContain('test_counter_total');
    expect(metricsText).toContain('test_gauge_value 42');

    const capturedId = runWithRequestId('req-aegis-777', () => getCurrentRequestId());
    expect(capturedId).toBe('req-aegis-777');

    let callCount = 0;
    const debouncedFn = debounce(async (val: number) => {
      callCount++;
      return val * 2;
    }, 20);

    const [r1, r2, r3] = await Promise.all([debouncedFn(5), debouncedFn(10), debouncedFn(21)]);
    expect(callCount).toBe(1);
    expect(r1).toBe(42);
    expect(r2).toBe(42);
    expect(r3).toBe(42);
  });
});
