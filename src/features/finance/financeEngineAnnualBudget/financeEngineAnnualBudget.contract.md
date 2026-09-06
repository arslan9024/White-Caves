# Finance Engine — Annual Budget Contract

- Issue: #2445
- Parent issue: #1934
- Module: `src/features/finance/financeEngineAnnualBudget`

## Purpose

Defines the data contract and computation rules for the Annual Budget capability
of the Finance Engine. This module is responsible for deriving an annual budget
summary (per category, per month, and in total) from a set of monthly budget line
items, without performing any I/O, persistence, or external side effects.

This contract document is the source of truth for the shape of inputs/outputs and
the invariants the implementation must uphold. Where a conflict exists between this
document and a prior implementation, this contract (and its associated tests)
governs.

## Scope

In scope:

- Pure computation of annual totals, per-category totals, and per-month totals
  from an array of monthly budget line items.
- Validation of input line items (structural and value validation) with typed
  error results — no thrown exceptions for expected validation failures.
- Variance calculation (planned vs. actual) at category and annual level.
- Rollback/recompute support: the engine is a pure function of its inputs, so
  "rollback" is achieved by recomputing from a prior snapshot of inputs (no
  in-module mutable state to roll back).

Out of scope (excluded scope per issue #2445):

- Parent issue closure (#1934 remains open until all child work is reconciled).
- Bulk GitHub mutation of any kind.
- Destructive database operations (this module has no database access).
- Production secret rewrites or configuration changes.
- Persistence, network calls, or scheduling — this is a pure calculation module.

## Types

```ts
export type BudgetCategory = 'revenue' | 'operations' | 'marketing' | 'payroll' | 'capex' | 'other';

export interface MonthlyBudgetLineItem {
  /** 1-12 inclusive, calendar month within the fiscal year. */
  month: number;
  category: BudgetCategory;
  /** Planned amount in minor currency units (e.g. cents). Must be finite, >= 0. */
  plannedAmount: number;
  /** Actual amount in minor currency units. Must be finite, >= 0. Optional if not yet incurred. */
  actualAmount?: number;
  currency: string;
}

export interface CategoryBudgetSummary {
  category: BudgetCategory;
  plannedTotal: number;
  actualTotal: number;
  variance: number;
  variancePercent: number;
}

export interface MonthlyBudgetSummary {
  month: number;
  plannedTotal: number;
  actualTotal: number;
  variance: number;
}

export interface AnnualBudgetSummary {
  fiscalYear: number;
  currency: string;
  plannedTotal: number;
  actualTotal: number;
  variance: number;
  variancePercent: number;
  byCategory: CategoryBudgetSummary[];
  byMonth: MonthlyBudgetSummary[];
}

export type BudgetValidationErrorCode =
  | 'INVALID_MONTH'
  | 'NEGATIVE_AMOUNT'
  | 'NON_FINITE_AMOUNT'
  | 'CURRENCY_MISMATCH'
  | 'EMPTY_INPUT';

export interface BudgetValidationError {
  code: BudgetValidationErrorCode;
  message: string;
  index?: number;
}

export type AnnualBudgetResult =
  | { ok: true; summary: AnnualBudgetSummary }
  | { ok: false; errors: BudgetValidationError[] };
```

## Invariants

1. `computeAnnualBudget` MUST be a pure function: identical inputs always produce
   an identical `AnnualBudgetResult`, and it must not mutate the input array or
   any of its elements.
2. All line items in a single computation MUST share the same `currency`. A
   mismatch produces a `CURRENCY_MISMATCH` validation error and no partial
   summary is returned.
3. `month` MUST be an integer in `[1, 12]`. Any other value produces
   `INVALID_MONTH`.
4. `plannedAmount` and `actualAmount` (when present) MUST be finite numbers
   `>= 0`. Non-finite values produce `NON_FINITE_AMOUNT`; negative values
   produce `NEGATIVE_AMOUNT`.
5. An empty `lineItems` array produces an `EMPTY_INPUT` validation error (there
   is no meaningful annual summary for zero inputs).
6. When validation fails, `computeAnnualBudget` returns `{ ok: false, errors }`
   with one or more errors and performs no partial aggregation.
7. `variancePercent` is computed as `(actualTotal - plannedTotal) / plannedTotal * 100`,
   and is `0` when `plannedTotal` is `0` (to avoid division by zero / `NaN`/`Infinity`
   leaking into results).
8. `byCategory` and `byMonth` are sorted deterministically: `byCategory` in the
   fixed category order defined by `BudgetCategory`'s declaration order restricted
   to categories present in the input; `byMonth` ascending by month number.

## Rollback Note

This module holds no mutable/persistent state. "Rollback" of a computed budget is
achieved by discarding the derived `AnnualBudgetSummary` and recomputing from the
last-known-good array of `MonthlyBudgetLineItem` inputs (e.g., a prior snapshot
retained by the caller). Removing this module entirely is a safe, self-contained
rollback: delete the `financeEngineAnnualBudget` directory; no other module
depends on it as of issue #2445 (parent #1934 tracks eventual wiring into a
consuming feature, which has not yet occurred).
