// turingErrors.ts
// Typed error hierarchy for the Turing Orchestrator.

export class OrchestratorError extends Error {
  public readonly code: string;
  constructor(message: string, code: string = 'ORCH_ERR') {
    super(message);
    this.name = 'OrchestratorError';
    this.code = code;
  }
}

export class PlanReadError extends OrchestratorError {
  constructor(message: string) {
    super(message, 'PLAN_READ_ERR');
    this.name = 'PlanReadError';
  }
}

export class RuleEvalError extends OrchestratorError {
  constructor(message: string) {
    super(message, 'RULE_EVAL_ERR');
    this.name = 'RuleEvalError';
  }
}

