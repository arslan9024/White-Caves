/**
 * Ejari Suite Performance Unit — shared type contracts.
 *
 * Issue: #2491 (child of parent #1923)
 *
 * This module defines the public data shapes consumed/produced by the Ejari Suite Performance
 * Unit (see `plans/implementation_handoffs/SRS-ISSUE-W55-EJARI-BENCH-1923.md` and the companion
 * SDD for the full functional/non-functional specification). It intentionally contains no
 * aggregation or validation *business rules* (e.g. rejecting negative durations) — that behavior
 * belongs to the evaluation logic module. This file only defines structural shapes plus
 * lightweight, dependency-free runtime type guards so that consumers (including the evaluation
 * logic module and any benchmark harness) can safely narrow `unknown` values at their boundaries.
 *
 * Strict TypeScript: no `any` types and no type assertions are used anywhere in this file.
 */

/**
 * A single raw timing observation for one Ejari suite operation invocation.
 */
export interface EjariPerformanceSample {
  /** Name of the Ejari operation this sample was measured for (e.g. "generateContract"). */
  readonly operationName: string;
  /** Wall-clock duration of the measured operation, in milliseconds. */
  readonly durationMs: number;
  /** Number of logical units (e.g. documents, pages) processed during this sample. */
  readonly unitsProcessed: number;
}

/**
 * Threshold configuration used to judge whether an aggregated report is performing acceptably.
 */
export interface EjariPerformanceThresholds {
  /** Maximum acceptable average duration (ms) per processed unit, inclusive. */
  readonly maxAverageDurationMsPerUnit: number;
}

/**
 * Aggregated performance report produced from a batch of same-operation samples.
 */
export interface EjariPerformanceReport {
  /** The single operation name shared by every sample that contributed to this report. */
  readonly operationName: string;
  /** Number of samples that contributed to this report. */
  readonly sampleCount: number;
  /** Sum of every sample's `durationMs`. */
  readonly totalDurationMs: number;
  /** `totalDurationMs / sampleCount`. */
  readonly averageDurationMs: number;
  /** `(sum(unitsProcessed) / totalDurationMs) * 1000`; `Infinity` when `totalDurationMs` is 0. */
  readonly unitsPerSecond: number;
  /** `true` when `averageDurationMs <= thresholds.maxAverageDurationMsPerUnit` (inclusive). */
  readonly withinThreshold: boolean;
}

/**
 * Runtime type guard for {@link EjariPerformanceSample}.
 *
 * Validates only structural shape (presence and primitive `typeof` correctness of every field),
 * not business-rule constraints such as "durationMs must not be negative" — those constraints are
 * enforced by the evaluation logic module, keeping this guard a pure structural predicate.
 */
export function isEjariPerformanceSample(value: unknown): value is EjariPerformanceSample {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.operationName === 'string' &&
    typeof candidate.durationMs === 'number' &&
    typeof candidate.unitsProcessed === 'number'
  );
}

/**
 * Runtime type guard for a read-only array of {@link EjariPerformanceSample}.
 */
export function isEjariPerformanceSampleArray(
  value: unknown
): value is readonly EjariPerformanceSample[] {
  return Array.isArray(value) && value.every(item => isEjariPerformanceSample(item));
}

/**
 * Runtime type guard for {@link EjariPerformanceThresholds}.
 */
export function isEjariPerformanceThresholds(value: unknown): value is EjariPerformanceThresholds {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.maxAverageDurationMsPerUnit === 'number';
}

/**
 * Runtime type guard for {@link EjariPerformanceReport}.
 */
export function isEjariPerformanceReport(value: unknown): value is EjariPerformanceReport {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.operationName === 'string' &&
    typeof candidate.sampleCount === 'number' &&
    typeof candidate.totalDurationMs === 'number' &&
    typeof candidate.averageDurationMs === 'number' &&
    typeof candidate.unitsPerSecond === 'number' &&
    typeof candidate.withinThreshold === 'boolean'
  );
}
