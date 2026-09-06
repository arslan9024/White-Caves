/**
 * Ejari Suite Performance Unit — core logic.
 *
 * Pure, dependency-free module that validates a batch of performance samples
 * captured while exercising the Ejari document suite
 * (`src/features/documents/*`) and aggregates them into a single report that
 * can be compared against a configured throughput/latency threshold.
 *
 * See companion specification documents:
 * - plans/implementation_handoffs/SRS-ISSUE-W55-EJARI-BENCH-1923.md
 * - plans/implementation_handoffs/SDD-ISSUE-W55-EJARI-BENCH-1923.md
 *
 * Design decisions (see SDD sections 4-6 for full rationale):
 * - Invalid input throws synchronously rather than returning a sentinel
 *   value, so invalid-input failures are never confused with genuine
 *   performance regressions.
 * - The threshold comparison is inclusive (`<=`), so a benchmark exactly
 *   matching the configured budget is considered passing.
 * - `unitsPerSecond` is `Infinity` when `totalDurationMs` is `0`, since zero
 *   elapsed time processing at least one unit represents unbounded
 *   throughput.
 */

/** A single raw timing observation for one Ejari operation invocation. */
export interface EjariPerformanceSample {
  readonly operationName: string;
  readonly durationMs: number;
  readonly unitsProcessed: number;
}

/** Threshold configuration used to judge whether a report is acceptable. */
export interface EjariPerformanceThresholds {
  readonly maxAverageDurationMsPerUnit: number;
}

/** Aggregated performance report produced from a batch of samples. */
export interface EjariPerformanceReport {
  readonly operationName: string;
  readonly sampleCount: number;
  readonly totalDurationMs: number;
  readonly averageDurationMs: number;
  readonly unitsPerSecond: number;
  readonly withinThreshold: boolean;
}

/**
 * Validates that every sample in the batch is well-formed and that the batch
 * references exactly one distinct `operationName`.
 *
 * @throws Error if the batch is empty, contains a sample with
 * `durationMs < 0` or `unitsProcessed < 1`, or references more than one
 * distinct `operationName`.
 */
function validateSamples(samples: readonly EjariPerformanceSample[]): void {
  if (samples.length === 0) {
    throw new Error('evaluateEjariPerformance: samples array must not be empty.');
  }

  const operationName = samples[0].operationName;

  samples.forEach((sample, index) => {
    if (sample.durationMs < 0) {
      throw new Error(
        `evaluateEjariPerformance: sample at index ${index} has a negative durationMs (${sample.durationMs}).`
      );
    }

    if (sample.unitsProcessed < 1) {
      throw new Error(
        `evaluateEjariPerformance: sample at index ${index} has unitsProcessed < 1 (${sample.unitsProcessed}).`
      );
    }

    if (sample.operationName !== operationName) {
      throw new Error(
        `evaluateEjariPerformance: samples reference more than one distinct operationName ("${operationName}" and "${sample.operationName}"). A single evaluation call must cover exactly one operation.`
      );
    }
  });
}

/**
 * Aggregates a validated, homogeneous batch of samples into a performance
 * report, comparing the computed average duration against the supplied
 * threshold.
 */
function aggregateSamples(
  samples: readonly EjariPerformanceSample[],
  thresholds: EjariPerformanceThresholds
): EjariPerformanceReport {
  const sampleCount = samples.length;

  let totalDurationMs = 0;
  let totalUnitsProcessed = 0;

  for (const sample of samples) {
    totalDurationMs += sample.durationMs;
    totalUnitsProcessed += sample.unitsProcessed;
  }

  const averageDurationMs = totalDurationMs / sampleCount;

  const unitsPerSecond =
    totalDurationMs === 0 ? Infinity : (totalUnitsProcessed / totalDurationMs) * 1000;

  const withinThreshold = averageDurationMs <= thresholds.maxAverageDurationMsPerUnit;

  return {
    operationName: samples[0].operationName,
    sampleCount,
    totalDurationMs,
    averageDurationMs,
    unitsPerSecond,
    withinThreshold,
  };
}

/**
 * Validates and aggregates a batch of Ejari performance samples into a
 * single report, evaluated against the supplied thresholds.
 *
 * The input array and its elements are never mutated.
 *
 * @throws Error when the samples array is empty, contains an invalid
 * sample (`durationMs < 0` or `unitsProcessed < 1`), or references more
 * than one distinct `operationName`.
 */
export function evaluateEjariPerformance(
  samples: readonly EjariPerformanceSample[],
  thresholds: EjariPerformanceThresholds
): EjariPerformanceReport {
  validateSamples(samples);
  return aggregateSamples(samples, thresholds);
}
