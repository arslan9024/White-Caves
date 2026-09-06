# financeEngineRollingMonth

Child feature of the finance engine (parent issue #1933, child issues
#2451 and #2452). This module owns **rolling-month** period
computation: given an anchor day-of-month and a reference "now" date,
it derives the continuous rolling window `[start, end)` that brackets
`now`, as distinct from a fixed calendar-month (1st-to-1st) window.

See [`financeEngineRollingMonth.contract.md`](./financeEngineRollingMonth.contract.md)
for the full functional and non-functional contract, validation
commands, and reconciliation gate.

## Status

- Parent issue #1933: **open**
- Child issue #2452: scope declared, documentation landed.
- Child issue #2451: scope declared; contributes the SRS/SDD
  implementation handoff documents under
  `plans/implementation_handoffs/` (`ISSUE-W56-FINANCE-CASHFLOW-1933`)
  that formalize requirements/design handed off from this contract.
- Parent issue remains open until #2451, #2452, and all other child
  work under #1933 is reconciled.

## Scope

This directory is self-contained:

- Public API: `computeRollingMonthWindow`, `isWithinRollingMonth`, and
  the `RollingMonthWindow` type (see contract for exact signatures).
- No dependencies added; no files outside this directory are touched.
- No GitHub issue mutation, database mutation, or secret rewrites are
  performed by this child.

## Usage (contract-level, once implemented)

```ts
import { computeRollingMonthWindow, isWithinRollingMonth } from './financeEngineRollingMonth';

const anchor = new Date('2026-01-15T00:00:00.000Z');
const now = new Date('2026-02-20T00:00:00.000Z');

const window = computeRollingMonthWindow(anchor, now);
// window.start === '2026-02-15T00:00:00.000Z'
// window.end   === '2026-03-15T00:00:00.000Z'

isWithinRollingMonth(now, window); // true
```

## Testing

Tests live alongside implementation files in this directory and use
`vitest`:

```
npx vitest run src/features/finance/financeEngineRollingMonth
```

Typecheck (strict mode, no `any`):

```
npx tsc --noEmit
```

## Rollback

Deleting this directory fully reverts this child issue's changes. No
other files, dependencies, or persisted data are affected.

## Related

- Parent: #1933
- Child issues: #2451 (implementation handoff docs), #2452 (this
  directory's contract/README)
