# Ejari Suite Performance Unit — Contract

- Issue: #2493
- Parent issue: #1923
- Status: Draft (child scope, non-closing)

## 1. Purpose

Defines the behavioral and performance contract for the Ejari Suite Performance Unit — the
benchmarking/measurement layer used to validate throughput and latency characteristics of the
Ejari document generation/validation suite (`src/features/documents/*`) under representative
load. This contract is a specification artifact for issue #2493 and does not itself introduce
runtime dependencies; it defines the interface that any implementation module under
`src/features/documents/ejariSuitePerformanceUnit/` must satisfy.

## 2. Scope

### In scope

- Defining the TypeScript interface contract for performance benchmark units (input shape,
  output shape, error modes) for the Ejari document suite.
- Defining pass/fail thresholds and how they are reported.
- Defining test expectations (vitest) that assert real, measurable behavior (not placeholders).

### Out of scope (excluded)

- Closing parent issue #1923.
- Bulk GitHub mutations (issue/PR state changes, label churn, etc.).
- Destructive database operations of any kind.
- Rewriting or exposing production secrets/credentials.
- Any change to files outside this child's declared file list.

## 3. Interface Contract

A conforming implementation module MUST export the following shape (illustrative — the actual
`.ts` implementation, when authored under a subsequent child issue, must match this contract):

```ts
export interface EjariPerformanceSample {
  /** Name of the operation being measured, e.g. "generateEjariContract". */
  operationName: string;
  /** Wall-clock duration of the operation in milliseconds. Must be >= 0. */
  durationMs: number;
  /** Number of logical units processed in this sample (e.g. documents). Must be >= 1. */
  unitsProcessed: number;
}

export interface EjariPerformanceReport {
  operationName: string;
  sampleCount: number;
  totalDurationMs: number;
  averageDurationMs: number;
  unitsPerSecond: number;
  /** True when averageDurationMs is within the configured threshold. */
  withinThreshold: boolean;
}

export interface EjariPerformanceThresholds {
  /** Maximum acceptable average duration per unit, in milliseconds. */
  maxAverageDurationMsPerUnit: number;
}

/**
 * Aggregates raw samples into a performance report and evaluates them against thresholds.
 * Must not mutate the input array. Must throw a descriptive Error (not return a sentinel)
 * when `samples` is empty, since an average cannot be meaningfully computed.
 */
export declare function evaluateEjariPerformance(
  samples: readonly EjariPerformanceSample[],
  thresholds: EjariPerformanceThresholds
): EjariPerformanceReport;
```

## 4. Behavioral Rules

1. `evaluateEjariPerformance` MUST throw when `samples.length === 0`.
2. `evaluateEjariPerformance` MUST throw when any sample has `durationMs < 0` or
   `unitsProcessed < 1` — these represent invalid/corrupt measurements.
3. All samples passed to a single call MUST share the same `operationName`; a mismatch MUST
   throw, since aggregating unrelated operations produces a meaningless report.
4. `unitsPerSecond` MUST be computed as `(sum(unitsProcessed) / totalDurationMs) * 1000`, guarding
   against division by zero (if `totalDurationMs === 0`, `unitsPerSecond` MUST be `Infinity`).
5. `withinThreshold` MUST be `true` if and only if
   `averageDurationMs <= thresholds.maxAverageDurationMsPerUnit`.
6. No `any` types are permitted anywhere in the implementation or its type declarations.

## 5. Test Expectations

Conforming test suites (vitest) MUST assert real, computed values — for example:

- Given 3 samples of durations `[10, 20, 30]` and `unitsProcessed` `[1, 1, 1]`, the report's
  `averageDurationMs` MUST equal `20` and `totalDurationMs` MUST equal `60`.
- Empty sample arrays MUST cause a thrown error, asserted via `expect(() => ...).toThrow()`.
- Threshold boundary equality (`averageDurationMs === maxAverageDurationMsPerUnit`) MUST report
  `withinThreshold: true` (inclusive boundary).

## 6. Rollback

This contract file is documentation-only and additive. Rollback is a plain file deletion/revert
of this document; no runtime code, schema, or GitHub state is affected.
