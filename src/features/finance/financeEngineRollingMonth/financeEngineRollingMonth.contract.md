# Contract: financeEngineRollingMonth

- Parent issue: #1933
- Child issue: #2452
- Status: open (parent issue remains open until all child work is reconciled)

## Purpose

Defines the scope, interfaces, and validation contract for the
`financeEngineRollingMonth` child feature of the finance engine. This
child is responsible for rolling-month period computation (i.e. deriving
a continuous 30/31-day-agnostic "rolling month" window, as opposed to a
fixed calendar-month window) used by downstream finance reporting and
reconciliation logic.

## Declared scope

In scope:

- `src/features/finance/financeEngineRollingMonth/` directory only.
- Documentation describing the rolling-month contract (this file and
  `README.md`).
- Type/interface definitions and pure computation logic for deriving a
  rolling-month window from an anchor date and a reference "now" date.

Out of scope (see "Excluded scope" below and issue #2452):

- Parent issue (#1933) closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- Any file outside this directory.

## Functional contract

### `RollingMonthWindow`

```ts
interface RollingMonthWindow {
  /** Inclusive ISO-8601 start of the rolling-month window. */
  start: string;
  /** Exclusive ISO-8601 end of the rolling-month window. */
  end: string;
  /** Number of whole days spanned by the window (28-31). */
  daySpan: number;
}
```

### `computeRollingMonthWindow(anchor: Date, now: Date): RollingMonthWindow`

- Given an `anchor` date (e.g. a billing cycle start day-of-month) and a
  `now` reference date, returns the rolling-month window that contains
  `now`.
- The window boundary is always the `anchor`'s day-of-month, rolled
  forward/backward as needed to bracket `now`.
- If the anchor day-of-month does not exist in a given calendar month
  (e.g. anchor day 31 in February), the window boundary clamps to the
  last day of that month.
- Must be a pure function: no I/O, no mutation of inputs, deterministic
  for identical inputs.
- Throws `RangeError` if `anchor` or `now` is an invalid `Date`.

### `isWithinRollingMonth(target: Date, window: RollingMonthWindow): boolean`

- Returns `true` when `target` falls within `[window.start, window.end)`.
- Pure function, no I/O.

## Non-functional requirements

- Strict TypeScript; no `any` types anywhere in implementation or tests.
- All public functions must be independently unit-testable without
  network, filesystem, or database access.
- Test files use `vitest` (`import { describe, expect, it } from 'vitest'`)
  with real behavior assertions (no placeholder `expect(true).toBe(true)`
  style tests).

## Validation commands (required before reconciliation)

- `npx vitest run src/features/finance/financeEngineRollingMonth`
- `npx tsc --noEmit` (or the project's existing strict typecheck target)

Both commands must pass with zero errors before this child issue can be
marked reconciled against parent issue #1933.

## Completion evidence

- This contract file and the accompanying `README.md` constitute the
  documented scope agreement for child issue #2452.
- Implementation source files (`*.ts`) and test files (`*.test.ts`) for
  `computeRollingMonthWindow` / `isWithinRollingMonth`, when added under
  this same directory, must reference this contract and satisfy the
  validation commands above.
- Evidence of a passing validation run (command + result) should be
  attached to child issue #2452 at the time implementation lands.

## Rollback note

This change only adds two new documentation files under a brand-new
directory (`src/features/finance/financeEngineRollingMonth/`). No
existing files are modified, no exports are removed, and no runtime
behavior is affected. Rollback is a simple deletion of this directory;
no migration, data, or dependency changes are involved.

## Reconciliation gate

Parent issue #1933 remains open. This child issue (#2452) is considered
reconciled only when:

1. The contract above is implemented and covered by passing vitest
   tests.
2. `npx tsc --noEmit` passes with no new errors attributable to this
   directory.
3. Completion evidence is attached to #2452.
4. No excluded-scope actions (parent closure, bulk GitHub mutation,
   destructive DB operations, secret rewrites) have been performed.
