/**
 * Ejari Suite Playwright E2E — pure logic module.
 *
 * This module contains the framework-agnostic planning/validation logic that
 * backs the Ejari document Playwright E2E test suite (parent issue #1921,
 * child issue #2503). It intentionally has NO dependency on `@playwright/test`
 * so it can be exercised with plain vitest unit tests: the actual Playwright
 * spec files are expected to import these helpers to build/validate their
 * scenario plans and to summarize results, keeping orchestration logic
 * testable in isolation from a real browser runtime.
 */

/** Supported Ejari document lifecycle stages exercised by the E2E suite. */
export type EjariStageName = 'upload' | 'validation' | 'submission' | 'approval' | 'renewal';

/** A single actionable step within an Ejari E2E scenario. */
export interface EjariStep {
  /** Stable identifier for the step, unique within its scenario. */
  readonly id: string;
  /** Human readable description of the action performed. */
  readonly description: string;
  /** Lifecycle stage this step belongs to. */
  readonly stage: EjariStageName;
  /** CSS/testid selector the step interacts with. */
  readonly selector: string;
  /** Maximum time (ms) the step is allowed to take before it is flagged slow. */
  readonly timeoutMs: number;
  /** Whether the step is required for the scenario to be considered valid. */
  readonly critical: boolean;
}

/** A full end-to-end scenario made up of ordered steps. */
export interface EjariScenario {
  readonly id: string;
  readonly title: string;
  readonly tags: readonly string[];
  readonly steps: readonly EjariStep[];
}

/** The result of executing a single step, as reported by the Playwright runner. */
export interface EjariStepResult {
  readonly stepId: string;
  readonly passed: boolean;
  readonly durationMs: number;
  readonly error?: string;
}

/** The result of executing an entire scenario. */
export interface EjariScenarioResult {
  readonly scenarioId: string;
  readonly stepResults: readonly EjariStepResult[];
}

/** Aggregate summary produced after a full suite run. */
export interface EjariSuiteSummary {
  readonly totalScenarios: number;
  readonly passedScenarios: number;
  readonly failedScenarios: number;
  readonly totalSteps: number;
  readonly passedSteps: number;
  readonly failedSteps: number;
  readonly slowSteps: readonly string[];
  readonly criticalFailures: readonly string[];
  readonly durationMs: number;
}

export class EjariScenarioValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EjariScenarioValidationError';
  }
}

const STAGE_ORDER: readonly EjariStageName[] = [
  'upload',
  'validation',
  'submission',
  'approval',
  'renewal',
];

function stageRank(stage: EjariStageName): number {
  const index = STAGE_ORDER.indexOf(stage);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/**
 * Validates that a scenario is well-formed:
 * - has at least one step
 * - step ids are unique within the scenario
 * - steps are ordered by non-decreasing lifecycle stage rank
 * - timeouts are positive
 *
 * Throws `EjariScenarioValidationError` describing the first violation found.
 */
export function validateScenario(scenario: EjariScenario): void {
  if (!scenario.id.trim()) {
    throw new EjariScenarioValidationError('Scenario id must not be empty.');
  }
  if (scenario.steps.length === 0) {
    throw new EjariScenarioValidationError(
      `Scenario "${scenario.id}" must contain at least one step.`
    );
  }

  const seenIds = new Set<string>();
  let previousRank = -1;

  for (const step of scenario.steps) {
    if (seenIds.has(step.id)) {
      throw new EjariScenarioValidationError(
        `Duplicate step id "${step.id}" in scenario "${scenario.id}".`
      );
    }
    seenIds.add(step.id);

    if (step.timeoutMs <= 0) {
      throw new EjariScenarioValidationError(
        `Step "${step.id}" must have a positive timeoutMs value.`
      );
    }

    if (!step.selector.trim()) {
      throw new EjariScenarioValidationError(
        `Step "${step.id}" must declare a non-empty selector.`
      );
    }

    const rank = stageRank(step.stage);
    if (rank < previousRank) {
      throw new EjariScenarioValidationError(
        `Step "${step.id}" in scenario "${scenario.id}" is out of lifecycle order.`
      );
    }
    previousRank = rank;
  }
}

/** Validates every scenario in a suite; throws on the first invalid scenario. */
export function validateSuite(scenarios: readonly EjariScenario[]): void {
  if (scenarios.length === 0) {
    throw new EjariScenarioValidationError('Suite must contain at least one scenario.');
  }

  const seenScenarioIds = new Set<string>();
  for (const scenario of scenarios) {
    if (seenScenarioIds.has(scenario.id)) {
      throw new EjariScenarioValidationError(`Duplicate scenario id "${scenario.id}" in suite.`);
    }
    seenScenarioIds.add(scenario.id);
    validateScenario(scenario);
  }
}

/** Returns only the scenarios that contain every tag in `tags` (AND semantics). */
export function filterScenariosByTags(
  scenarios: readonly EjariScenario[],
  tags: readonly string[]
): readonly EjariScenario[] {
  if (tags.length === 0) {
    return scenarios;
  }
  return scenarios.filter(scenario => tags.every(tag => scenario.tags.includes(tag)));
}

/** Returns the critical steps of a scenario, preserving original order. */
export function criticalSteps(scenario: EjariScenario): readonly EjariStep[] {
  return scenario.steps.filter(step => step.critical);
}

/**
 * Determines whether a scenario result counts as a pass: every step result
 * that corresponds to a *critical* step must have passed. Non-critical step
 * failures are tolerated and do not fail the scenario.
 */
export function isScenarioPassing(scenario: EjariScenario, result: EjariScenarioResult): boolean {
  const resultsByStepId = new Map(
    result.stepResults.map(stepResult => [stepResult.stepId, stepResult] as const)
  );

  for (const step of criticalSteps(scenario)) {
    const stepResult = resultsByStepId.get(step.id);
    if (!stepResult || !stepResult.passed) {
      return false;
    }
  }

  return true;
}

/**
 * Builds an aggregate summary for a suite run, given the scenarios that were
 * executed and their corresponding results (matched by `scenarioId`).
 *
 * Scenarios without a matching result are treated as not-run and are counted
 * as failures so silent omissions cannot hide regressions.
 */
export function summarizeSuiteRun(
  scenarios: readonly EjariScenario[],
  results: readonly EjariScenarioResult[]
): EjariSuiteSummary {
  const resultsByScenarioId = new Map(results.map(result => [result.scenarioId, result] as const));

  let passedScenarios = 0;
  let totalSteps = 0;
  let passedSteps = 0;
  const slowSteps: string[] = [];
  const criticalFailures: string[] = [];
  let durationMs = 0;

  for (const scenario of scenarios) {
    const result = resultsByScenarioId.get(scenario.id);

    if (!result) {
      criticalFailures.push(scenario.id);
      continue;
    }

    const stepsById = new Map(scenario.steps.map(step => [step.id, step] as const));

    for (const stepResult of result.stepResults) {
      totalSteps += 1;
      durationMs += stepResult.durationMs;
      if (stepResult.passed) {
        passedSteps += 1;
      }

      const step = stepsById.get(stepResult.stepId);
      if (step && stepResult.durationMs > step.timeoutMs) {
        slowSteps.push(stepResult.stepId);
      }
    }

    if (isScenarioPassing(scenario, result)) {
      passedScenarios += 1;
    } else {
      criticalFailures.push(scenario.id);
    }
  }

  const totalScenarios = scenarios.length;
  const failedSteps = totalSteps - passedSteps;

  return {
    totalScenarios,
    passedScenarios,
    failedScenarios: totalScenarios - passedScenarios,
    totalSteps,
    passedSteps,
    failedSteps,
    slowSteps,
    criticalFailures,
    durationMs,
  };
}

/** Convenience predicate: true when every scenario in the suite passed. */
export function isSuiteGreen(summary: EjariSuiteSummary): boolean {
  return summary.failedScenarios === 0 && summary.criticalFailures.length === 0;
}
