/**
 * turingCore.ts — AEGIS V5.0 Turing Orchestrator Core Engine
 * Implements plan processing, rule evaluation, idempotency, credit budgeting, and graceful shutdown.
 */
import * as path from 'path';
import { writeFileSync } from 'fs';
import { logger } from './turingLogger';
import { planProcessed, ruleViolation, creditUsage } from './turingMetrics';
import { TuringQueue } from './turingQueue';
import { retry } from './turingRetry';
import { isOpen, recordFailure, resetFailures } from './turingCircuitBreaker';
import {
  CodebaseDebtCheckResult,
  PromptEvaluationContext,
  TuringAuditRule,
  IdempotentSubmissionEnvelope,
  CreditVelocityPlan,
} from './turingTypes';
import {
  SUPREME_CREDIT_VELOCITY_CONFIG,
  AEGIS_PROTOCOL_FILES,
  ALLOWED_CONTEXT_TRIAD,
} from './turingConstants';
import { getDefaultRules } from './turingRules';
import { pluginRegistry } from './turingPlugin';

export {
  CodebaseDebtCheckResult,
  PromptEvaluationContext,
  TuringAuditRule,
  IdempotentSubmissionEnvelope,
  CreditVelocityPlan,
  SUPREME_CREDIT_VELOCITY_CONFIG,
  AEGIS_PROTOCOL_FILES,
  ALLOWED_CONTEXT_TRIAD,
};

/**
 * Core orchestrator implementing plan processing, rule evaluation, idempotency, and credit budgeting.
 * @class TuringOrchestratorCore
 * @see AEG-001 – Orchestration API contract.
 */
export class TuringOrchestratorCore {
  private static instance: TuringOrchestratorCore;
  private maxFileLineLimit = 350;
  private rules: TuringAuditRule[] = [];
  private processedIdempotencyKeys: Set<string> = new Set();
  public queue: TuringQueue = new TuringQueue(5);
  private isShuttingDown = false;

  private constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Returns the singleton instance of TuringOrchestratorCore.
   * @see AEG-001
   */
  public static getInstance(): TuringOrchestratorCore {
    if (!TuringOrchestratorCore.instance) {
      TuringOrchestratorCore.instance = new TuringOrchestratorCore();
    }
    return TuringOrchestratorCore.instance;
  }

  private initializeDefaultRules(): void {
    this.rules = getDefaultRules();
  }

  /**
   * Process the contents of plan markdown files via bounded TuringQueue.
   * @see AEG-001
   */
  public async processPlans(): Promise<void> {
    if (this.isShuttingDown || isOpen()) {
      logger.warn('[TuringOrchestrator] Skipping processPlans (shutting down or circuit breaker open)');
      return;
    }

    try {
      const { readPlans } = await import('./readPlans');
      const rawPlans = await retry(() => readPlans(), 2, 50);

      // Support both Record<string, string> and Array<{ id: string; content: string }> (for tests)
      const entries: Array<[string, string]> = Array.isArray(rawPlans)
        ? rawPlans.map((item: { id?: string; name?: string; content?: string }, idx: number) => [
            item.id ?? item.name ?? `plan-${idx}`,
            typeof item.content === 'string' ? item.content : String(item),
          ])
        : Object.entries(rawPlans || {});

      if (entries.length === 0) {
        logger.info('[TuringOrchestrator] No plans to process');
        return;
      }

      await Promise.all(
        entries.map(([name, content]) =>
          this.queue.enqueue(async () => {
            const lines = String(content).split(/\r?\n/);
            const pending: string[] = [];
            const completed: string[] = [];
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('- [ ]')) {
                pending.push(trimmed.replace('- [ ]', '').trim());
              } else if (trimmed.startsWith('- [x]')) {
                completed.push(trimmed.replace('- [x]', '').trim());
              }
            }
            logger.info(
              `[TuringOrchestrator] Plan ${name}: ${pending.length} pending, ${completed.length} completed`
            );
            planProcessed();
            if (pending.length === 0 && !Array.isArray(rawPlans)) {
              const flagPath = path.resolve(process.cwd(), '.agents', 'plans', 'NEED_NEW_PLAN');
              try {
                writeFileSync(flagPath, 'true');
              } catch {
                // Ignore if plans dir doesn't exist in test env
              }
            }
          })
        )
      );
      resetFailures();
    } catch (e) {
      recordFailure();
      logger.error('[TuringOrchestrator] Error processing plans:', e);
    }
  }

  /**
   * Load all markdown plan files and list them.
   * @see AEG-001
   */
  public async logPlans(): Promise<void> {
    try {
      const { readPlans } = await import('./readPlans');
      const plans = await readPlans();
      const planNames = Object.keys(plans);
      if (planNames.length === 0) {
        logger.info('[TuringOrchestrator] No plan files found in .agents/plans');
        return;
      }
      logger.info(`[TuringOrchestrator] Loaded ${planNames.length} plan files`);
    } catch (e) {
      logger.error('[TuringOrchestrator] Failed to load plans:', e);
    }
  }

  /**
   * Generate idempotent submission envelope and block duplicate submissions.
   * @see AEG-012
   */
  public registerIdempotentSubmission<T>(
    module: IdempotentSubmissionEnvelope<T>['module'],
    entityId: string,
    payload: T
  ): { accepted: boolean; envelope: IdempotentSubmissionEnvelope<T> } {
    const idempotencyKey = `AEG-${module}-${entityId}`;
    const envelope: IdempotentSubmissionEnvelope<T> = {
      idempotencyKey,
      module,
      timestampIso: new Date().toISOString(),
      payload,
    };
    if (this.processedIdempotencyKeys.has(idempotencyKey)) {
      return { accepted: false, envelope };
    }
    this.processedIdempotencyKeys.add(idempotencyKey);
    return { accepted: true, envelope };
  }

  /**
   * Evaluate credit and speed budget for a prompt under TURING-LAW-000.
   * @see TURING-LAW-000
   */
  public evaluateCreditAndSpeedBudget(context: PromptEvaluationContext): CreditVelocityPlan {
    const text = (context.promptText || '').toLowerCase();
    const isBulkOrMechanical =
      text.includes('rename') ||
      text.includes('scaffold') ||
      text.includes('format') ||
      text.includes('bulk');
    const isSimpleResearchOrDocs =
      text.includes('search') ||
      text.includes('summarize') ||
      text.includes('list') ||
      text.includes('check');
    const firstTarget = context.targetFiles?.[0];
    const targetedTestCommand = firstTarget
      ? `npx vitest run ${firstTarget}`
      : 'npx vitest run --changed';

    if (isBulkOrMechanical) {
      creditUsage(2000);
      return {
        executionLane: 'ZERO_TOKEN_SCRIPT',
        recommendedModel: 'none',
        maxTokenCeiling: 2000,
        parallelToolBatchingRequired: true,
        targetedTestCommand,
      };
    }
    if (isSimpleResearchOrDocs) {
      creditUsage(5000);
      return {
        executionLane: 'FLASH_FAST_LANE',
        recommendedModel: 'flash_lite',
        maxTokenCeiling: 5000,
        parallelToolBatchingRequired: true,
        targetedTestCommand,
      };
    }
    creditUsage(SUPREME_CREDIT_VELOCITY_CONFIG.maxTaskTokens);
    return {
      executionLane: 'SURGICAL_SINGLE_TURN',
      recommendedModel: 'inherit',
      maxTokenCeiling: SUPREME_CREDIT_VELOCITY_CONFIG.maxTaskTokens,
      parallelToolBatchingRequired: true,
      targetedTestCommand,
    };
  }

  /**
   * Validate that only allowed Context Triad names (Theme, Language, Currency) are used.
   * @see AEG-003
   * @see AEG-041
   */
  public validateContextTriad(contextNames: string[]): { valid: boolean; unauthorized: string[] } {
    const allowed = new Set<string>(ALLOWED_CONTEXT_TRIAD);
    const unauthorized = contextNames.filter(name => !allowed.has(name));
    return { valid: unauthorized.length === 0 && contextNames.length <= 3, unauthorized };
  }

  /**
   * Evaluate prompt against all default and plugin rules and produce a debt-check result.
   * @see AEG-001
   */
  public evaluatePromptContext(context: PromptEvaluationContext): CodebaseDebtCheckResult {
    const violations: string[] = [];
    const recommendations: string[] = [];
    const pluginRules = pluginRegistry.flatMap(p => (p.getRules ? p.getRules() : []));
    const allRules = [...this.rules, ...pluginRules];

    for (const rule of allRules) {
      const result = rule.check(context);
      if (!result.valid && result.message) {
        violations.push(`[${rule.id}] ${result.message}`);
        ruleViolation();
      }
    }
    if (violations.length > 0) {
      recommendations.push('Refactor plan to isolate CRUD management inside Left Sidebar.');
      recommendations.push('Maintain pure read-only 1-12-108 inspection inside Right Sidebar.');
      recommendations.push('Enforce 350-line modular decomposition using 7-Category architecture.');
    }
    const score = Math.max(0, 100 - violations.length * 25);
    return { passed: violations.length === 0, score, violations, recommendations };
  }

  /**
   * File line count compliance check (< 350 lines).
   * @see AEG-042
   */
  public checkFileLineLimit(lineCount: number, filePath: string): boolean {
    if (lineCount > this.maxFileLineLimit) {
      logger.warn(
        `[TuringOrchestrator] Single Purpose File Law Warning: ${filePath} is ${lineCount} lines (limit: ${this.maxFileLineLimit}).`
      );
      return false;
    }
    return true;
  }

  /**
   * Gracefully shuts down the orchestrator queue and resets state.
   * @see Phase 10 Final Polish
   */
  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    this.queue.shutdown();
    this.processedIdempotencyKeys.clear();
    this.isShuttingDown = false;
  }
}

/**
 * Convenience top-level helper to process plans using the singleton instance.
 * @see AEG-001
 */
export async function processPlans(): Promise<void> {
  return TuringOrchestratorCore.getInstance().processPlans();
}
