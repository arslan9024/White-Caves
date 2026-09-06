/**
 * Type definitions for the Ejari Suite Playwright end-to-end test harness.
 *
 * These types describe the shape of scenario definitions, step results, and
 * suite-level run reports used to drive and record Playwright E2E coverage
 * for the Ejari document workflow (upload, validation, submission, and
 * status tracking).
 */

/** Supported Ejari document lifecycle stages exercised by the E2E suite. */
export type EjariDocumentStage =
  | 'upload'
  | 'validation'
  | 'submission'
  | 'statusTracking'
  | 'completion';

/** Outcome of an individual Playwright step within a scenario. */
export type EjariStepStatus = 'passed' | 'failed' | 'skipped' | 'pending';

/** A single actionable step executed against the Ejari suite UI. */
export interface EjariE2eStep {
  readonly id: string;
  readonly description: string;
  readonly stage: EjariDocumentStage;
  readonly status: EjariStepStatus;
  readonly durationMs: number;
  readonly errorMessage?: string;
}

/** A named collection of steps representing one E2E scenario. */
export interface EjariE2eScenario {
  readonly scenarioId: string;
  readonly title: string;
  readonly tags: readonly string[];
  readonly steps: readonly EjariE2eStep[];
}

/** Aggregate status derived from all steps in a scenario or suite. */
export type EjariSuiteStatus = 'passed' | 'failed' | 'skipped';

/** Summary counters for a set of steps or scenarios. */
export interface EjariE2eSummary {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly skipped: number;
  readonly pending: number;
}

/** Full report produced after running the Ejari Playwright E2E suite. */
export interface EjariSuiteRunReport {
  readonly suiteId: string;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly scenarios: readonly EjariE2eScenario[];
  readonly summary: EjariE2eSummary;
  readonly status: EjariSuiteStatus;
}

/** Options used to configure a run of the Ejari Playwright E2E suite. */
export interface EjariSuiteRunOptions {
  readonly baseUrl: string;
  readonly headless: boolean;
  readonly retries: number;
  readonly scenarioFilter?: readonly string[];
}

/** Type guard confirming a value is a known {@link EjariDocumentStage}. */
export function isEjariDocumentStage(value: unknown): value is EjariDocumentStage {
  return (
    value === 'upload' ||
    value === 'validation' ||
    value === 'submission' ||
    value === 'statusTracking' ||
    value === 'completion'
  );
}

/** Type guard confirming a value is a known {@link EjariStepStatus}. */
export function isEjariStepStatus(value: unknown): value is EjariStepStatus {
  return value === 'passed' || value === 'failed' || value === 'skipped' || value === 'pending';
}

/** Type guard confirming a value conforms to {@link EjariE2eStep}. */
export function isEjariE2eStep(value: unknown): value is EjariE2eStep {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.description === 'string' &&
    isEjariDocumentStage(candidate.stage) &&
    isEjariStepStatus(candidate.status) &&
    typeof candidate.durationMs === 'number'
  );
}

/**
 * Computes an {@link EjariE2eSummary} from a flat list of steps, counting
 * each step exactly once by its status.
 */
export function summarizeEjariSteps(steps: readonly EjariE2eStep[]): EjariE2eSummary {
  const initial: EjariE2eSummary = {
    total: steps.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    pending: 0,
  };

  return steps.reduce<EjariE2eSummary>((acc, step) => {
    switch (step.status) {
      case 'passed':
        return { ...acc, passed: acc.passed + 1 };
      case 'failed':
        return { ...acc, failed: acc.failed + 1 };
      case 'skipped':
        return { ...acc, skipped: acc.skipped + 1 };
      case 'pending':
        return { ...acc, pending: acc.pending + 1 };
      default:
        return acc;
    }
  }, initial);
}

/**
 * Derives the aggregate {@link EjariSuiteStatus} for a suite: any failed
 * step fails the suite; otherwise any skipped step (with nothing passed)
 * marks it skipped; otherwise it is considered passed.
 */
export function deriveEjariSuiteStatus(summary: EjariE2eSummary): EjariSuiteStatus {
  if (summary.failed > 0) {
    return 'failed';
  }
  if (summary.skipped > 0 && summary.passed === 0) {
    return 'skipped';
  }
  return 'passed';
}
