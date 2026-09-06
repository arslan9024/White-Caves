# Software Design Document (SDD)

- ID: SDD-ISSUE-W56-FINANCE-BUDGET-1934
- Child issue: #2445
- Parent issue: #1934
- Track: W56 — Finance Engine, Annual Budget capability
- Companion: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BUDGET-1934.md`

## 1. Design Goals

- Deliver a small, pure, easily testable calculation module for annual budget
  aggregation with no hidden state or side effects.
- Make invalid inputs explicit and typed rather than throwing exceptions,
  so callers (UI, reporting, or future services) can render actionable
  validation feedback.
- Keep the module fully decoupled from persistence/transport concerns so it
  can be reused by any future consumer (API route, batch job, UI widget)
  without modification.

## 2. Module Structure

```
src/features/finance/financeEngineAnnualBudget/
  financeEngineAnnualBudget.contract.md   # type + invariant source of truth
  README.md                                # module overview & status
  (future) financeEngineAnnualBudget.ts    # pure computation implementation
  (future) financeEngineAnnualBudget.test.ts  # vitest suite
```

This issue (#2445) delivers the two documentation files above. The `.ts`
source and test files are intentionally deferred to a follow-up
implementation task under parent #1934, so that the contract can be reviewed
independently before code is written against it, per the declared child
scope.

## 3. Algorithm Design (for the future implementation)

`computeAnnualBudget(fiscalYear: number, lineItems: MonthlyBudgetLineItem[]): AnnualBudgetResult`

1. **Validate input shape** (in order, collecting ALL applicable errors
   rather than failing fast on the first one, so callers get a complete
   picture in one pass):
   - If `lineItems.length === 0`, add `EMPTY_INPUT` and return early with
     `{ ok: false, errors }` (no further checks are meaningful).
   - For each item, check `month` is an integer in `[1, 12]`
     (`INVALID_MONTH` with `index`).
   - For each item, check `plannedAmount` (and `actualAmount` if present) are
     finite (`NON_FINITE_AMOUNT`) and `>= 0` (`NEGATIVE_AMOUNT`).
   - Check all `currency` values are identical (`CURRENCY_MISMATCH`).
2. If any errors were collected, return `{ ok: false, errors }`.
3. **Aggregate**:
   - Reduce all items into a `Map<BudgetCategory, { planned, actual }>` and a
     `Map<number, { planned, actual }>` (month → totals), plus running annual
     totals, in a single pass (`O(n)`).
   - `actualAmount` defaults to `0` when absent for aggregation purposes.
4. **Derive summaries**:
   - Build `byCategory` from the category map, iterating in the fixed
     declaration order of `BudgetCategory` and including only categories
     present in the input.
   - Build `byMonth` from the month map sorted ascending by month number.
   - Compute `variance = actual - planned` and
     `variancePercent = planned === 0 ? 0 : ((actual - planned) / planned) * 100`
     at annual and category level (month-level summary carries `variance` but
     not `variancePercent`, per the contract's `MonthlyBudgetSummary` shape).
5. Return `{ ok: true, summary }`.

### Complexity

- Time: `O(n)` where `n = lineItems.length` (single validation pass + single
  aggregation pass).
- Space: `O(c + m)` where `c` = distinct categories present, `m` = distinct
  months present (both bounded by small constants: ≤6 categories, ≤12
  months).

### Error Handling Philosophy

- Expected, user-correctable problems (bad month, negative amount, mixed
  currency, empty input) are **typed validation results**, never thrown
  exceptions — this keeps the function safe to call from UI form validation
  without try/catch.
- Programmer errors (e.g., passing `null` where the type system requires an
  array) are out of scope for runtime guarding beyond what TypeScript's
  strict mode already enforces at compile time.

## 4. Design Decisions

| Decision                                                                     | Rationale                                                                                                                                                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Return typed `AnnualBudgetResult` union instead of throwing on invalid input | Keeps the module safe for UI/form validation call sites and makes all failure modes explicit in the type system, satisfying "no `any`" and strict-TS requirements without exception-based control flow. |
| Collect all validation errors in one pass instead of failing fast            | Gives calling UIs a complete list of problems to display at once, avoiding a frustrating fix-one-error-at-a-time loop for users entering budget data.                                                   |
| `variancePercent` defaults to `0` when `plannedTotal` is `0`                 | Prevents `NaN`/`Infinity` from leaking into consumer UI (e.g., percentage displays), which is a common real-world bug source in financial dashboards.                                                   |
| Defer `.ts` implementation/tests to a follow-up task under #1934             | Matches the exact file list authorized for this child issue (#2445); avoids expanding scope beyond the declared child scope, and lets the contract be reviewed before code is written against it.       |
| No persistence/service layer in this module                                  | Keeps the Finance Engine's core computation reusable across any future consumer (REST endpoint, CLI report, UI widget) without coupling to a specific storage or transport choice.                      |

## 5. Validation Plan (for the follow-up implementation task)

- Unit tests (vitest) covering, at minimum:
  - Happy path: multiple categories/months aggregate to correct totals and
    variance.
  - Each validation error code triggers correctly and reports the right
    `index` where applicable.
  - `EMPTY_INPUT` short-circuits before other checks.
  - `variancePercent` is `0` (not `NaN`) when `plannedTotal` is `0`.
  - Determinism: calling twice with the same input array yields deep-equal
    results, and the input array is not mutated (verify via structural
    equality snapshot before/after the call).
  - Sort order of `byCategory` and `byMonth` is stable and documented.
- Required validation commands (run for the affected package only, no new
  tooling introduced): strict TypeScript compile/typecheck, existing
  lint script, and existing vitest test script.

## 6. Rollback Plan

- **What changed**: Two new documentation files were added under
  `src/features/finance/financeEngineAnnualBudget/` (contract + README), plus
  this SRS/SDD pair under `plans/implementation_handoffs/`. No existing files
  were modified, and no source/runtime code was added.
- **Rollback mechanism**: Delete the four newly added files:
  - `src/features/finance/financeEngineAnnualBudget/financeEngineAnnualBudget.contract.md`
  - `src/features/finance/financeEngineAnnualBudget/README.md`
  - `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BUDGET-1934.md`
  - `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BUDGET-1934.md`
- **Blast radius**: None — purely additive documentation with no imports,
  no build/runtime dependencies, and no other module references these files.
  Rollback is a simple file deletion with no data migration or cleanup steps.
- **Parent issue state**: This rollback does not affect parent issue #1934,
  which remains open regardless, until all of its child issues (including
  #2445 and future implementation work) are reconciled.

## 7. Completion Evidence

- Files created exactly as authorized for child issue #2445 (see file list
  above); no files outside that list were created or modified.
- This document and its SRS companion record the requirements, design, and
  rollback note required by the issue's acceptance criteria. Test/build
  command evidence will be attached by the follow-up implementation task
  that introduces the `.ts` source and vitest test files described in
  Section 2 and Section 5.
