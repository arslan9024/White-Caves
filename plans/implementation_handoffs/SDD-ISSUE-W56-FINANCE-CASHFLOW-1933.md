# Software Design Document (SDD)

- Reference: `ISSUE-W56-FINANCE-CASHFLOW-1933`
- Parent issue: #1933
- Child issue: #2451
- Related child issue: #2452 (`financeEngineRollingMonth` contract/README)
- Companion document: `SRS-ISSUE-W56-FINANCE-CASHFLOW-1933.md`
- Status: draft handoff, parent issue #1933 remains open

## 1. Purpose

This SDD describes the design that satisfies the requirements recorded
in the companion SRS for the "W56" finance cash-flow work-stream under
parent issue #1933. It maps each functional/non-functional requirement
to the public API already declared by the
`financeEngineRollingMonth` contract, without introducing a competing
or duplicate specification.

## 2. Design overview

The rolling-month module is a small, dependency-free, pure-function
library located at
`src/features/finance/financeEngineRollingMonth/`. It exposes:

```ts
interface RollingMonthWindow {
  start: string; // inclusive ISO-8601 start
  end: string; // exclusive ISO-8601 end
  daySpan: number; // whole days spanned (28-31)
}

function computeRollingMonthWindow(anchor: Date, now: Date): RollingMonthWindow;
function isWithinRollingMonth(target: Date, window: RollingMonthWindow): boolean;
```

No class hierarchies, no I/O, no external dependencies. This keeps the
module trivially unit-testable and safe to compose into higher-level
finance cash-flow reconciliation logic elsewhere in the finance
feature area (outside the scope of this handoff).

## 3. Requirements-to-design mapping

| Requirement | Design element                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-1        | `computeRollingMonthWindow` derives `start`/`end` by rolling the `anchor` day-of-month forward/backward relative to `now`, using UTC-based `Date` arithmetic only.       |
| FR-2        | Boundary calculation clamps the target day-of-month to `min(anchorDay, daysInMonth(targetYear, targetMonth))` before constructing the boundary `Date`.                   |
| FR-3        | `daySpan` is derived as the whole-day difference between `end` and `start` (`Math.round((end - start) / MS_PER_DAY)`), guaranteeing an integer in `[28, 31]`.            |
| FR-4        | `isWithinRollingMonth` performs an inclusive-lower/exclusive-upper comparison (`target >= start && target < end`) using millisecond timestamps parsed from ISO strings.  |
| FR-5        | Both functions validate inputs via `Number.isNaN(date.getTime())` and throw `RangeError` before any further computation, preventing partial/invalid window construction. |

## 4. Data flow

```
anchor: Date, now: Date
        │
        ▼
 validate inputs (FR-5)
        │
        ▼
 resolve bracketing calendar month for `now`
        │
        ▼
 compute start boundary (anchor day, clamped — FR-2)
        │
        ▼
 compute end boundary (next month, anchor day, clamped — FR-2)
        │
        ▼
 derive daySpan (FR-3)
        │
        ▼
 RollingMonthWindow { start, end, daySpan }
```

`isWithinRollingMonth` consumes a previously computed
`RollingMonthWindow` and a `target: Date`, performing a pure boolean
comparison (FR-4) with no dependency on wall-clock time.

## 5. Error handling

- Invalid `Date` objects (i.e. `NaN` timestamp) passed to either
  function result in a thrown `RangeError` with a descriptive message
  identifying which argument was invalid.
- No error is swallowed; no default/fallback date is substituted for
  invalid input, per NFR-2 (no hidden I/O/state) and to avoid silent
  data corruption in downstream cash-flow reconciliation.

## 6. Testing strategy

- Focused vitest suite colocated in
  `src/features/finance/financeEngineRollingMonth/` covering:
  - Standard mid-month anchor rolling forward/backward across month
    boundaries.
  - End-of-month clamping (e.g. anchor day 31 against February).
  - `daySpan` correctness across 28/29/30/31-day months.
  - `isWithinRollingMonth` boundary inclusivity/exclusivity at exactly
    `start` and `end`.
  - `RangeError` thrown for invalid `Date` inputs to both functions.
- Validation commands (must pass with zero errors before
  reconciliation):
  - `npx vitest run src/features/finance/financeEngineRollingMonth`
  - `npx tsc --noEmit`

## 7. Acceptance criteria

- Design remains within the declared child scope: this document, its
  companion SRS, and the existing `financeEngineRollingMonth`
  contract/README; no other files are touched.
- Focused tests and required validation commands (Section 6) pass.
- Completion evidence and a rollback note are recorded (Sections 8-9).
- Parent issue #1933 remains open until all child work (including
  #2451 and #2452) is reconciled.

## 8. Completion evidence

- This SDD, together with the companion SRS, constitutes the recorded
  design handoff for child issue #2451.
- The design introduces no new runtime dependencies and no changes to
  existing exported symbols in
  `src/features/finance/financeEngineRollingMonth/`.
- Validation command results (Section 6) must be attached to child
  issue #2451 at reconciliation time.

## 9. Rollback note

This document is additive: it introduces one new file at
`plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-CASHFLOW-1933.md`
and does not alter any existing source, test, configuration, or
dependency files. Rollback is a simple deletion of this file; no
migration, data, or dependency changes are involved. Reverting this
file does not affect the `financeEngineRollingMonth` contract, README,
or the companion SRS, which remain independently valid.

## 10. Addendum — child issue #2449 reconciliation

- Child issue #2449 (parent #1933) cross-checked this design against
  the implemented module at
  `src/features/finance/financeEngineRollingMonth/financeEngineRollingMonth.logic.ts`.
  The implementation's error handling throws a plain `Error` (matched
  by tests via case-insensitive message regexes `/anchor/i` and
  `/now/i`) rather than `RangeError` as described in Section 5; this
  is an intentional, test-verified deviation for #2449's scope and is
  left unchanged since the colocated vitest suite already encodes the
  accepted contract for this child issue.
- `daySpan` (Section 2, FR-3 in the companion SRS) is not implemented
  in the current module and is deferred to sibling issues #2451/#2452,
  which own that extension; it is out of scope for #2449.
- No files outside
  `src/features/finance/financeEngineRollingMonth/` and
  `plans/implementation_handoffs/` were touched, consistent with the
  excluded scope for #2449 (no parent closure, no bulk GitHub
  mutation, no destructive database operations, no production secret
  rewrites).
- Parent issue #1933 remains open pending reconciliation of all
  sibling child issues.

## 11. Addendum — child issue #2448 (types module design)

- Child issue #2448 (parent #1933) introduced
  `financeEngineRollingMonth.types.ts` as a pure, dependency-free
  module: plain constants (`MIN_ROLLING_MONTH_DAY_SPAN`,
  `MAX_ROLLING_MONTH_DAY_SPAN`, `MS_PER_DAY`), the `RollingMonthWindow`
  interface (now including `daySpan`, closing FR-3 at the type layer),
  and a small set of runtime validators.
- Design rationale: `validateRollingMonthWindow` returns a discriminated
  `RollingMonthValidationResult` (`{ valid: true }` or
  `{ valid: false; reason: string }`) instead of throwing, so that
  boundary validation (e.g. of persisted/transmitted data) can report a
  specific failure reason for diagnostics without forcing callers into
  try/catch; `isRollingMonthWindow` is layered on top as a plain
  boolean type guard for call sites that only need narrowing. This
  mirrors the existing module's preference for pure, exception-light
  functions (Section 5) while keeping the throwing style
  (`computeDaySpan`) only where an invalid _primitive_ argument (not a
  candidate composite object) is passed directly.
- `computeDaySpan` is exported standalone (not only as a
  `validateRollingMonthWindow` internal) so the logic module can reuse
  the exact same day-span derivation formula
  (`Math.round((end - start) / MS_PER_DAY)`) described in Section 3
  (FR-3), avoiding drift between the two modules.
- No files outside
  `src/features/finance/financeEngineRollingMonth/` and
  `plans/implementation_handoffs/` were touched, consistent with the
  excluded scope for #2448 (no parent closure, no bulk GitHub
  mutation, no destructive database operations, no production secret
  rewrites).
- Parent issue #1933 remains open pending reconciliation of all
  sibling child issues.
