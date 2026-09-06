/**
 * Ejari Suite Production Release — logic module
 *
 * Scope (child of parent issue #1924, tracked under issue #2486):
 * Provides pure, side-effect-free helpers for evaluating whether the
 * Ejari document suite is ready for a production release. This module
 * intentionally does NOT perform any GitHub mutation, database write,
 * or secret rewrite — it only computes readiness state from data
 * supplied by the caller, and produces a rollback note for auditing.
 */

/** Severity of an individual release checklist item. */
export type ReleaseCheckSeverity = 'blocking' | 'warning' | 'informational';

/** Overall readiness status for the release. */
export type ReleaseReadinessStatus = 'ready' | 'blocked' | 'pending';

/** A single item on the production release checklist. */
export interface ReleaseCheckItem {
  /** Stable identifier for the check (e.g. "ejari-schema-migrated"). */
  readonly id: string;
  /** Human readable label describing what the check verifies. */
  readonly label: string;
  /** Whether the check has passed. */
  readonly passed: boolean;
  /** How severe a failure of this check is. */
  readonly severity: ReleaseCheckSeverity;
}

/** Aggregated result of evaluating a full checklist. */
export interface ReleaseReadinessSummary {
  readonly status: ReleaseReadinessStatus;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly blockingFailures: readonly ReleaseCheckItem[];
  readonly warningFailures: readonly ReleaseCheckItem[];
}

/** Metadata describing the release candidate being evaluated. */
export interface ReleaseCandidate {
  readonly version: string;
  readonly previousStableVersion: string;
  readonly checklist: readonly ReleaseCheckItem[];
}

/** A recorded rollback note for completion evidence / audit trail. */
export interface RollbackNote {
  readonly version: string;
  readonly previousStableVersion: string;
  readonly rollbackCommand: string;
  readonly reason: string;
  readonly generatedAt: string;
}

/**
 * Evaluates a release checklist and produces an aggregated readiness
 * summary. A release is:
 *  - "blocked" if any `blocking` severity item has failed,
 *  - "pending" if there are no blocking failures but at least one
 *    `warning` severity item has failed,
 *  - "ready" if every item has passed (informational failures do not
 *    affect readiness).
 */
export function evaluateReleaseChecklist(
  checklist: readonly ReleaseCheckItem[]
): ReleaseReadinessSummary {
  const totalChecks = checklist.length;
  const passedChecks = checklist.filter(item => item.passed).length;
  const failedChecks = totalChecks - passedChecks;

  const blockingFailures = checklist.filter(item => !item.passed && item.severity === 'blocking');
  const warningFailures = checklist.filter(item => !item.passed && item.severity === 'warning');

  let status: ReleaseReadinessStatus;
  if (blockingFailures.length > 0) {
    status = 'blocked';
  } else if (warningFailures.length > 0) {
    status = 'pending';
  } else {
    status = 'ready';
  }

  return {
    status,
    totalChecks,
    passedChecks,
    failedChecks,
    blockingFailures,
    warningFailures,
  };
}

/**
 * Convenience predicate for whether a release candidate may proceed to
 * production. Equivalent to `evaluateReleaseChecklist(candidate.checklist).status === 'ready'`.
 */
export function isReleaseApproved(candidate: ReleaseCandidate): boolean {
  return evaluateReleaseChecklist(candidate.checklist).status === 'ready';
}

/**
 * Builds a human-readable rollback note that records how to revert the
 * release candidate back to the previous stable version. This is
 * completion evidence only — it does not execute the rollback.
 */
export function createRollbackNote(
  candidate: ReleaseCandidate,
  reason: string,
  generatedAt: Date = new Date()
): RollbackNote {
  if (candidate.version.trim().length === 0) {
    throw new Error('ReleaseCandidate.version must be a non-empty string.');
  }
  if (candidate.previousStableVersion.trim().length === 0) {
    throw new Error('ReleaseCandidate.previousStableVersion must be a non-empty string.');
  }

  return {
    version: candidate.version,
    previousStableVersion: candidate.previousStableVersion,
    rollbackCommand: `deploy:ejari-suite --version=${candidate.previousStableVersion}`,
    reason,
    generatedAt: generatedAt.toISOString(),
  };
}

/**
 * Produces a short, deterministic completion-evidence summary string
 * suitable for logging or attaching to an audit record. Does not
 * perform any I/O.
 */
export function buildCompletionEvidence(candidate: ReleaseCandidate): string {
  const summary = evaluateReleaseChecklist(candidate.checklist);
  const blocking = summary.blockingFailures.map(item => item.id).join(', ');
  const warnings = summary.warningFailures.map(item => item.id).join(', ');

  const lines = [
    `Ejari Suite Production Release evidence for version ${candidate.version}`,
    `Status: ${summary.status}`,
    `Checks: ${summary.passedChecks}/${summary.totalChecks} passed`,
  ];

  if (blocking.length > 0) {
    lines.push(`Blocking failures: ${blocking}`);
  }
  if (warnings.length > 0) {
    lines.push(`Warning failures: ${warnings}`);
  }

  return lines.join('\n');
}

/**
 * Groups checklist items by severity for reporting/UI purposes.
 */
export function groupChecklistBySeverity(
  checklist: readonly ReleaseCheckItem[]
): Record<ReleaseCheckSeverity, readonly ReleaseCheckItem[]> {
  const blocking: ReleaseCheckItem[] = [];
  const warning: ReleaseCheckItem[] = [];
  const informational: ReleaseCheckItem[] = [];

  for (const item of checklist) {
    if (item.severity === 'blocking') {
      blocking.push(item);
    } else if (item.severity === 'warning') {
      warning.push(item);
    } else {
      informational.push(item);
    }
  }

  return { blocking, warning, informational };
}
