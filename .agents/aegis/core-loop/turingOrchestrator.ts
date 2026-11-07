/**
 * turingOrchestrator.ts — Public facade & singleton for the AEGIS V5.0 Turing Orchestrator.
 * Re-exports all types, constants, and the singleton instance for backward compatibility.
 */
import {
  TuringOrchestratorCore,
  processPlans,
  CodebaseDebtCheckResult,
  PromptEvaluationContext,
  TuringAuditRule,
  IdempotentSubmissionEnvelope,
  CreditVelocityPlan,
  SUPREME_CREDIT_VELOCITY_CONFIG,
  AEGIS_PROTOCOL_FILES,
  ALLOWED_CONTEXT_TRIAD,
} from './turingCore';

export {
  TuringOrchestratorCore as TuringOrchestrator,
  processPlans,
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
 * Public singleton instance used throughout the codebase.
 * @see AEG-001 – Orchestration API contract.
 */
export const turingOrchestrator = TuringOrchestratorCore.getInstance();
export default turingOrchestrator;
