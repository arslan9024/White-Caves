// turingUtils.ts – helper functions used by the orchestrator core

import { PromptEvaluationContext, CreditVelocityPlan } from './turingTypes';
import { SUPREME_CREDIT_VELOCITY_CONFIG } from './turingConstants';
import { CONTEXT_SET } from './turingConstants';

/** Evaluate credit and speed budget for a prompt */
export function evaluateCreditAndSpeedBudget(context: PromptEvaluationContext): CreditVelocityPlan {
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

/** Validate that only allowed context triad names are used */
export function validateContextTriad(contextNames: string[]): { valid: boolean; unauthorized: string[] } {
  const unauthorized = contextNames.filter(name => !CONTEXT_SET.has(name));
  return { valid: unauthorized.length === 0 && contextNames.length <= 3, unauthorized };
}

/** File line‑count compliance check */
export function checkFileLineLimit(
  lineCount: number,
  filePath: string,
  maxLineLimit: number,
): boolean {
  if (lineCount > maxLineLimit) {
    console.warn(
      `[TuringOrchestrator] Single Purpose File Law Warning: ${filePath} is ${lineCount} lines (limit: ${maxLineLimit}).`
    );
    return false;
  }
  return true;
}

