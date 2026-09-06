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

## 11. Addendum — Issue #2492 Implementation Follow-up

Issue #2492 (child of parent #1923) implemented the module described above. Two deviations from
the originally sketched file layout in Section 2 were made deliberately:

- **File naming:** `ejariSuitePerformanceUnit.logic.ts` / `ejariSuitePerformanceUnit.logic.test.ts`
  were used instead of the bare `ejariSuitePerformanceUnit.ts` / `.test.ts` sketched in Section 2.
  **Why:** this matches the established convention elsewhere in
  `src/features/*/*.logic.ts` for pure, side-effect-free business-logic modules, keeping the
  module discoverable and consistent with sibling features.
- **Single-file implementation:** `validateSamples` and `aggregateSamples` (Section 3's `validate`
  and `aggregate` steps) are private, non-exported helper functions colocated in
  `ejariSuitePerformanceUnit.logic.ts` rather than split into separate files. **Why:** both
  functions are small, tightly coupled, and have no independent reuse value outside
  `evaluateEjariPerformance`; splitting them would add indirection without benefit while keeping
  `evaluateEjariPerformance` as the sole public export, matching the "composing `validate` then
  `aggregate` internally" note in Section 3.

All design decisions in Sections 4-7 (throw-on-invalid-input, inclusive threshold comparison,
`Infinity` for zero-duration throughput, no `any`/no `as`) were implemented exactly as specified,
and the Section 8 test plan items 1-9 are each covered by a corresponding vitest case in
`ejariSuitePerformanceUnit.logic.test.ts`.

### Rollback Note (Issue #2492)

Revert or delete `ejariSuitePerformanceUnit.logic.ts` and `ejariSuitePerformanceUnit.logic.test.ts`
to fully roll back. The module is pure and dependency-free with no schema, network, or GitHub
state side effects; no other rollback steps are required. Parent issue #1923 remains open.

## 12. Addendum — Issue #2491 Shared Type Contracts

Issue #2491 (child of parent #1923) extracted the structural type contracts referenced throughout
this SDD (Section 7 in particular) into a standalone module,
`ejariSuitePerformanceUnit.types.ts`, so that they can be imported independently by the evaluation
logic module (`ejariSuitePerformanceUnit.logic.ts`, issue #2492) and by any future benchmark
harness without duplicating interface declarations.

- **Design decision:** the types module exports runtime type guards
  (`isEjariPerformanceSample`, `isEjariPerformanceSampleArray`, `isEjariPerformanceThresholds`,
  `isEjariPerformanceReport`) in addition to the plain interfaces.
  **Why:** interfaces alone are erased at compile time and provide no runtime narrowing ability;
  since the module's consumers (benchmark harnesses, CI glue code) may receive `unknown` data at
  their boundaries (e.g. parsed JSON), a dependency-free structural predicate lets them narrow
  safely without introducing `any` or unchecked type assertions (`as`), consistent with NFR-1.
- **Design decision:** the guards validate structural shape only (field presence and primitive
  `typeof` correctness), not business-rule constraints such as "durationMs must not be negative"
  or "operationName must be consistent across a batch".
  **Why:** those constraints are the responsibility of `evaluateEjariPerformance`'s internal
  `validateSamples` step (Section 11), which already owns FR-2 through FR-4. Duplicating those
  rules into the type guards would create two sources of truth for the same validation logic and
  risk them drifting out of sync.
- **Design decision:** every interface field is declared `readonly`.
  **Why:** this reinforces FR-9 (samples/report must not be mutated) at the type level, catching
  accidental reassignment attempts at compile time rather than relying solely on runtime
  discipline in the logic module.

All fields declared in Section 7 (`EjariPerformanceSample`, `EjariPerformanceReport`,
`EjariPerformanceThresholds`) are implemented exactly as specified, with no `any` types and no
type assertions used anywhere in the module.

### Rollback Note (Issue #2491)

Revert or delete `ejariSuitePerformanceUnit.types.ts` and `ejariSuitePerformanceUnit.types.test.ts`
to fully roll back. The module is pure, dependency-free, and exports no side effects. If a later
change wired `ejariSuitePerformanceUnit.logic.ts` to import types from this module, that import
would need to be reverted in tandem (or reduced back to locally-declared interfaces) to keep the
tree compiling; absent such a change, this rollback is fully isolated. Parent issue #1923 remains
open.
