/**
 * financeEngineAgentPayroll.types.ts
 *
 * Shared type contracts, enums, and configuration helpers for the Finance
 * Engine Agent's payroll sub-domain (issue #2454, parent #1931). This module
 * complements `financeEngineAgentPayroll.logic.ts` by describing the run
 * configuration, scheduling period, and lifecycle status contracts consumed
 * by orchestration layers, without duplicating the calculation-level types
 * already exported from the logic module.
 *
 * This module is intentionally dependency-free (aside from the sibling
 * logic module's type-only exports) and side-effect-free so it can be unit
 * tested in isolation and safely composed into larger finance orchestration
 * flows without introducing coupling to I/O, GitHub, or database concerns.
 */

import type { PayrollAgentBatchResult, PayrollTaxBracket } from './financeEngineAgentPayroll.logic';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported payroll run cadences. */
export type PayrollFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

/** Lifecycle status of a payroll agent run. */
export type PayrollAgentStatus = 'idle' | 'running' | 'completed' | 'failed';

/** ISO-8601 date-bounded pay period covered by a payroll run. */
export interface PayrollPeriod {
  readonly start: string;
  readonly end: string;
  readonly frequency: PayrollFrequency;
}

/** Configuration governing how the payroll agent executes a batch run. */
export interface PayrollAgentConfig {
  readonly maxBatchSize: number;
  readonly taxBrackets?: readonly PayrollTaxBracket[];
  readonly failFast: boolean;
}

/** Request payload describing a single payroll agent run. */
export interface PayrollAgentRunRequest {
  readonly runId: string;
  readonly period: PayrollPeriod;
  readonly config: PayrollAgentConfig;
}

/**
 * Summary of a completed payroll agent run, pairing the batch result with
 * its originating request metadata for downstream reporting.
 */
export interface PayrollAgentRunSummary {
  readonly runId: string;
  readonly period: PayrollPeriod;
  readonly status: PayrollAgentStatus;
  readonly batch: PayrollAgentBatchResult;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAYROLL_FREQUENCIES: readonly PayrollFrequency[] = [
  'weekly',
  'biweekly',
  'semimonthly',
  'monthly',
];

const PAYROLL_AGENT_STATUSES: readonly PayrollAgentStatus[] = [
  'idle',
  'running',
  'completed',
  'failed',
];

/** Default configuration applied when a caller does not override values. */
export const DEFAULT_PAYROLL_AGENT_CONFIG: PayrollAgentConfig = {
  maxBatchSize: 100,
  failFast: false,
};

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

/** Type guard narrowing an arbitrary string to a `PayrollFrequency`. */
export function isPayrollFrequency(value: string): value is PayrollFrequency {
  return (PAYROLL_FREQUENCIES as readonly string[]).includes(value);
}

/** Type guard narrowing an arbitrary string to a `PayrollAgentStatus`. */
export function isPayrollAgentStatus(value: string): value is PayrollAgentStatus {
  return (PAYROLL_AGENT_STATUSES as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Validates a `PayrollPeriod`: `start` and `end` must be parseable ISO
 * dates, `start` must not be after `end`, and `frequency` must be a known
 * `PayrollFrequency`.
 */
export function isValidPayrollPeriod(period: PayrollPeriod): boolean {
  if (!isPayrollFrequency(period.frequency)) {
    return false;
  }
  const start = Date.parse(period.start);
  const end = Date.parse(period.end);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }
  return start <= end;
}

/**
 * Merges partial overrides onto `DEFAULT_PAYROLL_AGENT_CONFIG`, producing a
 * fully-populated `PayrollAgentConfig`. `maxBatchSize` values that are not
 * finite positive integers are rejected in favor of the default.
 */
export function createPayrollAgentConfig(
  overrides: Partial<PayrollAgentConfig> = {}
): PayrollAgentConfig {
  const maxBatchSize =
    overrides.maxBatchSize !== undefined &&
    Number.isInteger(overrides.maxBatchSize) &&
    overrides.maxBatchSize > 0
      ? overrides.maxBatchSize
      : DEFAULT_PAYROLL_AGENT_CONFIG.maxBatchSize;

  return {
    maxBatchSize,
    taxBrackets: overrides.taxBrackets ?? DEFAULT_PAYROLL_AGENT_CONFIG.taxBrackets,
    failFast: overrides.failFast ?? DEFAULT_PAYROLL_AGENT_CONFIG.failFast,
  };
}

/**
 * Builds a `PayrollAgentRunSummary` from a request and its resulting batch,
 * deriving `status` from the batch outcome counts: `'failed'` when at least
 * one task was processed and none succeeded, `'completed'` otherwise
 * (including a fully successful batch, a partially successful/mixed batch,
 * and an empty batch with zero processed tasks).
 */
export function summarizePayrollAgentRun(
  request: PayrollAgentRunRequest,
  batch: PayrollAgentBatchResult
): PayrollAgentRunSummary {
  const status: PayrollAgentStatus =
    batch.processedCount > 0 && batch.successCount === 0 ? 'failed' : 'completed';

  return {
    runId: request.runId,
    period: request.period,
    status,
    batch,
  };
}
