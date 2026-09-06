# SDD — Ejari Suite Performance Benchmark Unit

- Handoff ID: SDD-ISSUE-W55-EJARI-BENCH-1923
- Issue: #2493
- Parent issue: #1923
- Type: Software Design Document (implementation handoff)
- Status: Draft — child scope, non-closing
- Companion: `plans/implementation_handoffs/SRS-ISSUE-W55-EJARI-BENCH-1923.md`

## 1. Design Overview

The Ejari Suite Performance Unit is designed as a small, dependency-free, pure-function module
under `src/features/documents/ejariSuitePerformanceUnit/`. It has one primary responsibility:
transform a set of raw timing samples into a validated, aggregated performance report that can be
compared against a threshold. This document specifies the module layout, data flow, error
handling strategy, and test plan for the implementation that a subsequent child issue (under
parent #1923) will author.

## 2. Module Layout (target, for the follow-on implementation issue)

```
src/features/documents/ejariSuitePerformanceUnit/
├── ejariSuitePerformanceUnit.contract.md   # interface + behavioral spec (this issue, #2493)
├── README.md                                # overview + status (this issue, #2493)
├── ejariSuitePerformanceUnit.ts             # implementation (future child issue)
└── ejariSuitePerformanceUnit.test.ts        # vitest suite (future child issue)
```

Only the first two files are in scope for issue #2493. They fully define what the latter two
files must implement and test.

## 3. Data Flow

```
EjariPerformanceSample[]  ──▶  validate()  ──▶  aggregate()  ──▶  EjariPerformanceReport
        │                         │                  │
        │                         │                  └─ sums durations/units, computes
        │                         │                     average, unitsPerSecond, withinThreshold
        │                         └─ throws on: empty array, negative duration,
        │                                       unitsProcessed < 1, mixed operationName
        └─ caller-owned, never mutated
```

`evaluateEjariPerformance` is the single public entry point composing `validate` then `aggregate`
internally (both are implementation details, not part of the public contract).

## 4. Error Handling Strategy

All invalid-input conditions throw synchronously with a descriptive `Error` message, rather than
returning a sentinel value (e.g. `null` or a report with `withinThreshold: false`). This is a
deliberate design decision:

- **Design decision:** fail loudly (throw) instead of silently producing a zeroed/false report.
- **Why:** a caller that accidentally passes an empty array or corrupt samples should see the
  failure immediately in a stack trace / CI log, not a misleadingly "passing" report with
  `withinThreshold: false` that could be mistaken for a genuine performance regression. Throwing
  makes the two failure classes (invalid input vs. genuine regression) unambiguous.

## 5. Threshold Semantics

- **Design decision:** the threshold comparison is inclusive (`<=`), not strict (`<`).
- **Why:** a benchmark exactly matching the configured budget should be considered passing;
  otherwise teams would need to set thresholds artificially higher than their real target to
  avoid false failures on exact-match runs, which defeats the purpose of a precise budget.

## 6. Division-by-zero Handling for `unitsPerSecond`

- **Design decision:** when `totalDurationMs === 0`, `unitsPerSecond` is defined as `Infinity`
  rather than `0` or `NaN`.
- **Why:** zero elapsed time processing at least one unit represents unbounded (immeasurably
  fast) throughput, which `Infinity` represents mathematically correctly; `NaN` would make the
  report field unusable in comparisons, and `0` would incorrectly suggest no throughput at all.

## 7. Type Safety

All public types (`EjariPerformanceSample`, `EjariPerformanceReport`,
`EjariPerformanceThresholds`) are explicit interfaces with primitive field types (`string`,
`number`, `boolean`). No `any`, no implicit `any` via untyped parameters, and no type assertions
(`as`) are permitted in the eventual implementation, per NFR-1 in the companion SRS.

## 8. Test Plan (for the follow-on implementation issue)

The vitest suite must cover, at minimum:

1. **Happy path aggregation** — verify `totalDurationMs`, `averageDurationMs`, `sampleCount`,
   and `unitsPerSecond` against hand-computed expected values for a fixed sample set.
2. **Empty input** — `expect(() => evaluateEjariPerformance([], thresholds)).toThrow()`.
3. **Negative duration** — a sample with `durationMs: -1` throws.
4. **Sub-unit sample** — a sample with `unitsProcessed: 0` throws.
5. **Mixed operation names** — two samples with different `operationName` values throw.
6. **Threshold boundary** — `averageDurationMs` exactly equal to
   `maxAverageDurationMsPerUnit` yields `withinThreshold: true`.
7. **Threshold breach** — `averageDurationMs` greater than the threshold yields
   `withinThreshold: false`.
8. **Zero-duration throughput** — all samples with `durationMs: 0` yields
   `unitsPerSecond === Infinity`.
9. **Immutability** — the input samples array (and its objects) are unchanged after the call
   (e.g., via a deep-equality snapshot comparison before/after).

## 9. Scope & Constraints Recap

- No new dependencies.
- No changes outside this issue's four declared files.
- No GitHub issue closures or bulk mutations.
- No destructive database operations.
- No production secret rewrites.
- Parent issue #1923 stays open.

## 10. Rollback Note

This SDD is documentation-only. Rollback is a plain revert/delete of this file; no runtime code,
schema, or GitHub state is affected.
