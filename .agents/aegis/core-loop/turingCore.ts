// turingCore.ts
import path from 'path';
import { writeFileSync } from 'fs';
import { logger } from './turingLogger';
import { planProcessed, ruleViolation, creditUsage, inc } from './turingMetrics';
import { TuringQueue } from './turingQueue';
import { retry } from './turingRetry';
import { isOpen, recordFailure, resetFailures, getFailureCount } from './turingCircuitBreaker';
import { PlanReadError, RuleEvalError } from './turingErrors';
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
  CONTEXT_SET,
} from './turingConstants';
import { getDefaultRules } from './turingRules';

/**
 * Core Turing Orchestrator class – implements plan processing, rule evaluation,
 * idempotent submission handling, and credit‑speed budgeting.
 */
/**
 * Core orchestrator implementing plan processing, rule evaluation, idempotency, and credit budgeting.
 *
 * @class TuringOrchestratorCore
 * @see AEG-001 – Orchestration API contract.
 */
export class TuringOrchestratorCore {
  private static instance: TuringOrchestratorCore;
  private maxFileLineLimit = 350;
  private rules: TuringAuditRule[] = [];
  private processedIdempotencyKeys: Set<string> = new Set();

  private constructor() {
    this.initializeDefaultRules();
  }

  public static getInstance(): TuringOrchestratorCore {
    if (!TuringOrchestratorCore.instance) {
      TuringOrchestratorCore.instance = new TuringOrchestratorCore();
    }
    return TuringOrchestratorCore.instance;
  }

  /** Process the contents of plan markdown files. */
  public async processPlans(): Promise<void> {
    try {
      const { readPlans } = await import('./readPlans');
      const plans = await readPlans();
      const planNames = Object.keys(plans);
      if (planNames.length === 0) {
        logger.info('No plans to process');
        return;
      }
      // Parallel processing of plans (respecting parallel tool batching)
      await Promise.all(
        planNames.map(async name => {
          const content = plans[name];
          const lines = content.split('\\n');
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
          logger.info(`Plan ${name}: ${pending.length} pending, ${completed.length} completed`);
          if (pending.length) {
            logger.info('Pending tasks:', pending);
          }
          if (completed.length) {
            logger.info('Completed tasks:', completed);
          }
          if (pending.length === 0) {
            const flagPath = path.resolve(__dirname, '..', '..', 'plans', 'NEED_NEW_PLAN');
            try {
              writeFileSync(flagPath, 'true');
            } catch (e) {
              logger.error('Failed to write flag file', e);
            }
          }
          // Placeholder: invoke sub‑agents based on pending items.
        })
      );
    } catch (e) {
      logger.error('Error processing plans:', e);
    }
  }

    try {
  const { readPlans } = await import('./readPlans');
  const plans = await readPlans();
  const planNames = Object.keys(plans);
  if (planNames.length === 0) {
    console.log('[TuringOrchestrator] No plans to process');
    return;
  }
  for (const name of planNames) {
    const content = plans[name];
    const lines = content.split('\n');
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
    console.log(`[TuringOrchestrator] Plan ${name}: ${pending.length} pending, ${completed.length} completed`);
    if (pending.length) {
      console.log('  Pending tasks:');
      pending.forEach(t => console.log(`    • ${t}`));
    }
    if (completed.length) {
      console.log('  Completed tasks:');
      completed.forEach(t => console.log(`    ✓ ${t}`));
    }
    if (pending.length === 0) {
      const flagPath = path.resolve(__dirname, '..', '..', 'plans', 'NEED_NEW_PLAN');
      try {
        writeFileSync(flagPath, 'true');
      } catch (e) {
        console.error('Failed to write flag file', e);
      }
    }
    // Placeholder: invoke sub‑agents based on pending items.
    // (future: dispatch sub‑agents via AEGIS orchestrator queue)
  }
} catch (e) {
  console.error('[TuringOrchestrator] Error processing plans:', e);
}
  }

  /** Load all markdown plan files and list them. */
  public async logPlans(): Promise < void> {
  try {
    const { readPlans } = await import('./readPlans');
    const plans = await readPlans();
    const planNames = Object.keys(plans);
    if(planNames.length === 0) {
  console.log('[TuringOrchestrator] No plan files found in .agents/plans');
  return;
}
console.log('[TuringOrchestrator] Loaded plan files:');
for (const name of planNames) {
  console.log(`  - ${name}`);
}
    } catch (e) {
  console.error('[TuringOrchestrator] Failed to load plans:', e);
}
  }

  private initializeDefaultRules(): void {
  this.rules = getDefaultRules();
}

  // Additional methods (audit, idempotency, credit handling, etc.) would be here.

  /** Generate idempotent submission envelope. */
  public registerIdempotentSubmission<T>(
  module: IdempotentSubmissionEnvelope < T > ['module'],
  entityId: string,
  payload: T,
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

  /** Evaluate credit and speed budget for a prompt. */
  public evaluateCreditAndSpeedBudget(context: PromptEvaluationContext): CreditVelocityPlan {
  const text = context.promptText.toLowerCase();
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
  const targetedTestCommand = firstTarget ? `npx vitest run ${firstTarget}` : 'npx vitest run --changed';

  if (isBulkOrMechanical) {
    return {
      executionLane: 'ZERO_TOKEN_SCRIPT',
      recommendedModel: 'none',
      maxTokenCeiling: 2000,
      parallelToolBatchingRequired: true,
      targetedTestCommand,
    };
  }
  if (isSimpleResearchOrDocs) {
    return {
      executionLane: 'FLASH_FAST_LANE',
      recommendedModel: 'flash_lite',
      maxTokenCeiling: 5000,
      parallelToolBatchingRequired: true,
      targetedTestCommand,
    };
  }
  return {
    executionLane: 'SURGICAL_SINGLE_TURN',
    recommendedModel: 'inherit',
    maxTokenCeiling: SUPREME_CREDIT_VELOCITY_CONFIG.maxTaskTokens,
    parallelToolBatchingRequired: true,
    targetedTestCommand,
  };
}

  /** Validate that only allowed context triad names are used. */
  public validateContextTriad(contextNames: string[]): { valid: boolean; unauthorized: string[] } {
  const allowed = new Set<string>(ALLOWED_CONTEXT_TRIAD);
  const unauthorized = contextNames.filter(name => !allowed.has(name));
  return { valid: unauthorized.length === 0 && contextNames.length <= 3, unauthorized };
}

  /** Evaluate prompt against all rules and produce a debt‑check result. */
  public evaluatePromptContext(context: PromptEvaluationContext): CodebaseDebtCheckResult {
  const violations: string[] = [];
  const recommendations: string[] = [];
  for (const rule of this.rules) {
    const result = rule.check(context);
    if (!result.valid && result.message) {
      violations.push(`[${rule.id}] ${result.message}`);
    }
  }
  if (violations.length > 0) {
    recommendations.push('Refactor plan to isolate CRUD management inside Left Sidebar.');
    recommendations.push('Maintain pure read‑only 1-12-108 inspection inside Right Sidebar.');
    recommendations.push('Enforce 350‑line modular decomposition using 7‑Category architecture.');
  }
  const score = Math.max(0, 100 - violations.length * 25);
  return { passed: violations.length === 0, score, violations, recommendations };
}

  /** File line count compliance check. */
  public checkFileLineLimit(lineCount: number, filePath: string): boolean {
  if (lineCount > this.maxFileLineLimit) {
    console.warn(`[TuringOrchestrator] Single Purpose File Law Warning: ${filePath} is ${lineCount} lines (limit: ${this.maxFileLineLimit}).`);
    return false;
  }
  return true;
}
}
