/**
 * Types and pure helpers for the Ejari Suite production release gate.
 *
 * This module models the release-readiness checklist that must be satisfied
 * before the Ejari document suite (contract registration, renewal, and
 * cancellation workflows) can be promoted to production. It is intentionally
 * data-only (no side effects, no I/O) so it can be unit tested in isolation
 * and consumed by both UI and CI-facing tooling.
 *
 * Parent issue: #1924 (Ejari Suite production readiness program)
 * Child issue: #2488
 */

/** Identifiers for each individual release gate check. */
export type EjariReleaseCheckId =
  | 'schemaValidation'
  | 'documentGenerationSmokeTest'
  | 'signatureWorkflowVerification'
  | 'auditTrailIntegrity'
  | 'rollbackPlanRecorded';

/** Outcome states for a single release gate check. */
export type EjariReleaseCheckStatus = 'pending' | 'passed' | 'failed' | 'skipped';

/** Overall readiness status for the entire release gate. */
export type EjariGateStatus = 'not-ready' | 'blocked' | 'ready';

/** Result of evaluating one release gate check. */
export interface EjariReleaseCheckResult {
  readonly id: EjariReleaseCheckId;
  readonly status: EjariReleaseCheckStatus;
  /** Human-readable explanation, required when status is 'failed' or 'skipped'. */
  readonly detail?: string;
  /** ISO-8601 timestamp of when this check was last evaluated. */
  readonly evaluatedAt?: string;
}

/** The full set of checks that make up the production release gate. */
export interface EjariSuiteProductionReleaseGate {
  readonly issueRef: string;
  readonly parentIssueRef: string;
  readonly checks: readonly EjariReleaseCheckResult[];
}

/** Aggregated summary describing the state of a release gate. */
export interface EjariGateSummary {
  readonly status: EjariGateStatus;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly pendingChecks: number;
  readonly skippedChecks: number;
  readonly blockingCheckIds: readonly EjariReleaseCheckId[];
}

/** Canonical ordered list of all checks required for the gate to be complete. */
export const EJARI_RELEASE_CHECK_IDS: readonly EjariReleaseCheckId[] = [
  'schemaValidation',
  'documentGenerationSmokeTest',
  'signatureWorkflowVerification',
  'auditTrailIntegrity',
  'rollbackPlanRecorded',
];

/**
 * Builds a fresh gate with every required check in the `pending` state.
 * Useful as the starting point before running the actual verification logic.
 */
export function createInitialGateState(
  issueRef: string,
  parentIssueRef: string
): EjariSuiteProductionReleaseGate {
  return {
    issueRef,
    parentIssueRef,
    checks: EJARI_RELEASE_CHECK_IDS.map(id => ({
      id,
      status: 'pending' as const,
    })),
  };
}

/**
 * Returns a new gate with the given check's result updated. The original
 * gate object is left untouched (immutable update).
 */
export function withCheckResult(
  gate: EjariSuiteProductionReleaseGate,
  result: EjariReleaseCheckResult
): EjariSuiteProductionReleaseGate {
  const existingIndex = gate.checks.findIndex(check => check.id === result.id);
  const nextChecks =
    existingIndex === -1
      ? [...gate.checks, result]
      : gate.checks.map((check, index) => (index === existingIndex ? result : check));

  return {
    ...gate,
    checks: nextChecks,
  };
}

/**
 * Produces an aggregated summary of a gate's check results, including which
 * failing checks are blocking the release.
 */
export function summarizeGate(gate: EjariSuiteProductionReleaseGate): EjariGateSummary {
  const totalChecks = gate.checks.length;
  let passedChecks = 0;
  let failedChecks = 0;
  let pendingChecks = 0;
  let skippedChecks = 0;
  const blockingCheckIds: EjariReleaseCheckId[] = [];

  for (const check of gate.checks) {
    switch (check.status) {
      case 'passed':
        passedChecks += 1;
        break;
      case 'failed':
        failedChecks += 1;
        blockingCheckIds.push(check.id);
        break;
      case 'pending':
        pendingChecks += 1;
        break;
      case 'skipped':
        skippedChecks += 1;
        break;
      default: {
        const exhaustiveCheck: never = check.status;
        throw new Error(`Unhandled check status: ${String(exhaustiveCheck)}`);
      }
    }
  }

  const status: EjariGateStatus =
    failedChecks > 0 ? 'blocked' : pendingChecks > 0 ? 'not-ready' : 'ready';

  return {
    status,
    totalChecks,
    passedChecks,
    failedChecks,
    pendingChecks,
    skippedChecks,
    blockingCheckIds,
  };
}

/** Convenience predicate: is the gate fully satisfied and safe to release? */
export function isGateReadyForRelease(gate: EjariSuiteProductionReleaseGate): boolean {
  return summarizeGate(gate).status === 'ready';
}

/**
 * Validates that a gate declares exactly the required checks (no missing,
 * no duplicate, no unknown ids). Returns a list of validation error
 * messages; an empty array means the gate is structurally valid.
 */
export function validateGateStructure(gate: EjariSuiteProductionReleaseGate): string[] {
  const errors: string[] = [];
  const seen = new Set<EjariReleaseCheckId>();

  for (const check of gate.checks) {
    if (seen.has(check.id)) {
      errors.push(`Duplicate check id: ${check.id}`);
    }
    seen.add(check.id);

    if (!EJARI_RELEASE_CHECK_IDS.includes(check.id)) {
      errors.push(`Unknown check id: ${check.id}`);
    }

    if ((check.status === 'failed' || check.status === 'skipped') && !check.detail) {
      errors.push(`Check ${check.id} with status "${check.status}" requires a detail message`);
    }
  }

  for (const requiredId of EJARI_RELEASE_CHECK_IDS) {
    if (!seen.has(requiredId)) {
      errors.push(`Missing required check: ${requiredId}`);
    }
  }

  return errors;
}
