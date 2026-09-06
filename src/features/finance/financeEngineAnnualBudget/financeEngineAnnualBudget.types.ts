/**
 * Type contract for the Finance Engine "Annual Budget" capability.
 *
 * Parent issue: #1934
 * This module defines the shape of the pure, in-memory annual budget
 * computation described in:
 *   - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BUDGET-1934.md
 *   - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BUDGET-1934.md
 *
 * This file intentionally contains only types plus small, pure, dependency-free
 * runtime helpers (type guards, validation predicates, and error/variance
 * factories) that the future `.ts` computation implementation and any caller
 * can reuse consistently. No I/O, persistence, or network code lives here.
 */

/** Fixed, documented declaration order used for deterministic `byCategory` output. */
export const BUDGET_CATEGORY_ORDER = [
  'housing',
  'utilities',
  'payroll',
  'marketing',
  'operations',
  'other',
] as const;

/** Budget category discriminant. Order above is the canonical sort order. */
export type BudgetCategory = (typeof BUDGET_CATEGORY_ORDER)[number];

/** A single caller-supplied monthly budget line item (planned vs. actual). */
export interface MonthlyBudgetLineItem {
  /** Calendar month, integer in [1, 12]. */
  readonly month: number;
  readonly category: BudgetCategory;
  /** ISO-4217-style currency code; all line items in a request must match. */
  readonly currency: string;
  /** Planned/budgeted amount; must be a finite number >= 0. */
  readonly plannedAmount: number;
  /** Actual spend amount; optional, defaults to 0 for aggregation when absent. */
  readonly actualAmount?: number;
}

/** Typed validation error codes for invalid `MonthlyBudgetLineItem[]` input. */
export type BudgetValidationErrorCode =
  | 'EMPTY_INPUT'
  | 'INVALID_MONTH'
  | 'NON_FINITE_AMOUNT'
  | 'NEGATIVE_AMOUNT'
  | 'CURRENCY_MISMATCH';

/** A single validation error, optionally referencing the offending line item index. */
export interface BudgetValidationError {
  readonly code: BudgetValidationErrorCode;
  readonly message: string;
  readonly index?: number;
}

/** Planned/actual/variance summary for a single budget category across the year. */
export interface CategoryBudgetSummary {
  readonly category: BudgetCategory;
  readonly plannedTotal: number;
  readonly actualTotal: number;
  readonly variance: number;
  readonly variancePercent: number;
}

/**
 * Planned/actual/variance summary for a single month across all categories.
 * Per the SRS/SDD, month-level summaries carry `variance` but not
 * `variancePercent`.
 */
export interface MonthlyBudgetSummary {
  readonly month: number;
  readonly plannedTotal: number;
  readonly actualTotal: number;
  readonly variance: number;
}

/** Full annual budget summary, returned when input validation succeeds. */
export interface AnnualBudgetSummary {
  readonly fiscalYear: number;
  readonly currency: string;
  readonly plannedTotal: number;
  readonly actualTotal: number;
  readonly variance: number;
  readonly variancePercent: number;
  /** Sorted in `BUDGET_CATEGORY_ORDER`, including only categories present in the input. */
  readonly byCategory: readonly CategoryBudgetSummary[];
  /** Sorted ascending by month number. */
  readonly byMonth: readonly MonthlyBudgetSummary[];
}

/** Successful computation result. */
export interface AnnualBudgetSuccessResult {
  readonly ok: true;
  readonly summary: AnnualBudgetSummary;
}

/** Failed computation result; never a partial/best-effort summary. */
export interface AnnualBudgetFailureResult {
  readonly ok: false;
  readonly errors: readonly BudgetValidationError[];
}

/** Discriminated union returned by the annual budget computation function. */
export type AnnualBudgetResult = AnnualBudgetSuccessResult | AnnualBudgetFailureResult;

/** Type guard narrowing an `AnnualBudgetResult` to its success variant. */
export function isAnnualBudgetSuccess(
  result: AnnualBudgetResult
): result is AnnualBudgetSuccessResult {
  return result.ok === true;
}

/** Type guard narrowing an `AnnualBudgetResult` to its failure variant. */
export function isAnnualBudgetFailure(
  result: AnnualBudgetResult
): result is AnnualBudgetFailureResult {
  return result.ok === false;
}

/** True when `category` is one of the canonical `BudgetCategory` values. */
export function isBudgetCategory(value: string): value is BudgetCategory {
  return (BUDGET_CATEGORY_ORDER as readonly string[]).includes(value);
}

/** FR-2: a valid month is an integer in the inclusive range [1, 12]. */
export function isValidBudgetMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

/** FR-3: a valid budget amount is a finite number that is not negative. */
export function isValidBudgetAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount >= 0;
}

/**
 * FR-9: variance percent is defined as `(variance / plannedTotal) * 100`,
 * but is defined to be exactly `0` (never `NaN`/`Infinity`) when
 * `plannedTotal` is `0`.
 */
export function computeVariancePercent(plannedTotal: number, variance: number): number {
  if (plannedTotal === 0) {
    return 0;
  }
  return (variance / plannedTotal) * 100;
}

/** Convenience helper: `variance = actualTotal - plannedTotal`. */
export function computeVariance(plannedTotal: number, actualTotal: number): number {
  return actualTotal - plannedTotal;
}

/** Human-readable default messages, keyed by validation error code. */
const DEFAULT_ERROR_MESSAGES: Readonly<Record<BudgetValidationErrorCode, string>> = {
  EMPTY_INPUT: 'lineItems must contain at least one MonthlyBudgetLineItem.',
  INVALID_MONTH: 'month must be an integer in the range [1, 12].',
  NON_FINITE_AMOUNT: 'plannedAmount/actualAmount must be a finite number.',
  NEGATIVE_AMOUNT: 'plannedAmount/actualAmount must be greater than or equal to 0.',
  CURRENCY_MISMATCH: 'All line items must share the same currency.',
};

/**
 * Builds a `BudgetValidationError` with a consistent default message for the
 * given code, optionally overriding the message and/or attaching the
 * offending item's index (per FR-2/FR-3/FR-4).
 */
export function createBudgetValidationError(
  code: BudgetValidationErrorCode,
  options?: { readonly index?: number; readonly message?: string }
): BudgetValidationError {
  const message = options?.message ?? DEFAULT_ERROR_MESSAGES[code];
  if (options?.index !== undefined) {
    return { code, message, index: options.index };
  }
  return { code, message };
}
