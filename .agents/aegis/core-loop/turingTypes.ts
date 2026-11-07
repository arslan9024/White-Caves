// Type definitions for Turing Orchestrator

export interface CodebaseDebtCheckResult {
  passed: boolean;
  score: number; // 0 - 100
  violations: string[];
  recommendations: string[];
}

export interface PromptEvaluationContext {
  promptText: string;
  sourceModule?: string;
  targetFiles?: string[];
  activeAgentId?: string;
}

export interface TuringAuditRule {
  id: string;
  name: string;
  description: string;
  // The check function returns a validation result
  check: (context: PromptEvaluationContext) => { valid: boolean; message?: string };
}

export interface IdempotentSubmissionEnvelope<T = unknown> {
  idempotencyKey: string;
  module: 'DLD' | 'EJARI' | 'FTA_TAX' | 'ZOHO_BOOKS';
  timestampIso: string;
  payload: T;
}

export interface CreditVelocityPlan {
  executionLane: 'ZERO_TOKEN_SCRIPT' | 'FLASH_FAST_LANE' | 'SURGICAL_SINGLE_TURN';
  recommendedModel: 'none' | 'flash_lite' | 'flash' | 'inherit';
  maxTokenCeiling: number;
  parallelToolBatchingRequired: boolean;
  targetedTestCommand: string;
}

