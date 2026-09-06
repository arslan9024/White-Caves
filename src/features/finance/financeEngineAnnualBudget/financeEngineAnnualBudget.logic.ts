/**
 * Finance Engine — Annual Budget capability.
 *
 * Pure, in-memory computation of annual, per-category, and per-month budget
 * summaries (planned vs. actual, with variance) from a caller-supplied list
 * of monthly budget line items.
 *
 * Design contract (see plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BUDGET-1934.md
 * and SDD-ISSUE-W56-FINANCE-BUDGET-1934.md for the full requirements/design):
 *  - No side effects, no network/filesystem/database access.
 *  - Invalid input never throws; it is reported as a typed, collected list
 *    of validation errors.
 *  - Deterministic: same input always yields deep-equal output, and inputs
 *    are never mutated.
 */

/**
 * Budget categories in fixed declaration order. This order is used when
 * building the `byCategory` breakdown so output ordering is deterministic
 * and documented (only categories actually present in the input appear).
 */
export const BUDGET_CATEGORIES = [
  'Revenue',
  'OperatingExpenses',
  'Payroll',
  'Marketing',
  'CapitalExpenditure',
  'Other',
] as const;

export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];

/** A single planned/actual budget entry for one month and category. */
export interface MonthlyBudgetLineItem {
  /** Calendar month, 1 (January) through 12 (December). */
  month: number;
  category: BudgetCategory;
  /** Planned (budgeted) amount for this line item. Must be finite and >= 0. */
  plannedAmount: number;
  /**
   * Actual (incurred/received) amount for this line item, if known yet.
   * Must be finite and >= 0 when present. Defaults to 0 for aggregation
   * purposes when omitted.
   */
  actualAmount?: number;
  /** ISO 4217 currency code (e.g. 'USD', 'AED'). Must be identical across
   * all line items supplied in a single call. */
  currency: string;
}

/** Validation error codes produced by {@link computeAnnualBudget}. */
export type BudgetValidationErrorCode =
  | 'EMPTY_INPUT'
  | 'INVALID_MONTH'
  | 'NON_FINITE_AMOUNT'
  | 'NEGATIVE_AMOUNT'
  | 'CURRENCY_MISMATCH';

/** A single validation problem found while checking the supplied line items. */
export interface BudgetValidationError {
  code: BudgetValidationErrorCode;
  message: string;
  /** Index (within the original `lineItems` array) of the offending item,
   * when the error is attributable to a specific item. */
  index?: number;
}

/** Planned/actual/variance metrics for a single budget category. */
export interface CategoryBudgetSummary {
  category: BudgetCategory;
  plannedTotal: number;
  actualTotal: number;
  variance: number;
  variancePercent: number;
}

/** Planned/actual/variance metrics for a single calendar month. */
export interface MonthlyBudgetSummary {
  month: number;
  plannedTotal: number;
  actualTotal: number;
  variance: number;
}

/** Full annual budget summary returned on successful validation. */
export interface AnnualBudgetSummary {
  fiscalYear: number;
  currency: string;
  plannedTotal: number;
  actualTotal: number;
  variance: number;
  variancePercent: number;
  /** Breakdown by category, in `BUDGET_CATEGORIES` declaration order,
   * including only categories present in the input. */
  byCategory: CategoryBudgetSummary[];
  /** Breakdown by month, sorted ascending by month number. */
  byMonth: MonthlyBudgetSummary[];
}

/** Result of {@link computeAnnualBudget}: either a computed summary or a
 * complete list of validation errors (never both, never partial). */
export type AnnualBudgetResult =
  | { ok: true; summary: AnnualBudgetSummary }
  | { ok: false; errors: BudgetValidationError[] };

function isFiniteNumber(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Validates the supplied line items, collecting ALL applicable errors
 * (rather than failing fast) so callers can present a complete picture of
 * every problem in one pass.
 */
function validateLineItems(lineItems: readonly MonthlyBudgetLineItem[]): BudgetValidationError[] {
  const errors: BudgetValidationError[] = [];

  if (lineItems.length === 0) {
    errors.push({
      code: 'EMPTY_INPUT',
      message: 'lineItems must contain at least one entry.',
    });
    return errors;
  }

  let referenceCurrency: string | undefined;

  lineItems.forEach((item, index) => {
    if (!Number.isInteger(item.month) || item.month < 1 || item.month > 12) {
      errors.push({
        code: 'INVALID_MONTH',
        message: `Line item at index ${index} has an invalid month: ${String(item.month)}. Month must be an integer between 1 and 12.`,
        index,
      });
    }

    if (!isFiniteNumber(item.plannedAmount)) {
      errors.push({
        code: 'NON_FINITE_AMOUNT',
        message: `Line item at index ${index} has a non-finite plannedAmount.`,
        index,
      });
    } else if (item.plannedAmount < 0) {
      errors.push({
        code: 'NEGATIVE_AMOUNT',
        message: `Line item at index ${index} has a negative plannedAmount.`,
        index,
      });
    }

    if (item.actualAmount !== undefined) {
      if (!isFiniteNumber(item.actualAmount)) {
        errors.push({
          code: 'NON_FINITE_AMOUNT',
          message: `Line item at index ${index} has a non-finite actualAmount.`,
          index,
        });
      } else if (item.actualAmount < 0) {
        errors.push({
          code: 'NEGATIVE_AMOUNT',
          message: `Line item at index ${index} has a negative actualAmount.`,
          index,
        });
      }
    }

    if (referenceCurrency === undefined) {
      referenceCurrency = item.currency;
    } else if (item.currency !== referenceCurrency) {
      errors.push({
        code: 'CURRENCY_MISMATCH',
        message: `Line item at index ${index} has currency "${item.currency}", expected "${referenceCurrency}".`,
        index,
      });
    }
  });

  return errors;
}

function computeVariancePercent(planned: number, actual: number): number {
  if (planned === 0) {
    return 0;
  }
  return ((actual - planned) / planned) * 100;
}

/**
 * Computes an annual budget summary (planned vs. actual, with variance) for
 * the given fiscal year from a list of monthly budget line items.
 *
 * Pure function: does not mutate `lineItems`, performs no I/O, and is
 * referentially deterministic (same input always yields deep-equal output).
 *
 * @param fiscalYear the fiscal year the summary is computed for (echoed
 *   back on the result; not itself validated beyond being carried through).
 * @param lineItems the monthly budget line items to aggregate.
 * @returns `{ ok: true, summary }` on success, or `{ ok: false, errors }`
 *   with the complete list of validation problems on failure.
 */
export function computeAnnualBudget(
  fiscalYear: number,
  lineItems: readonly MonthlyBudgetLineItem[]
): AnnualBudgetResult {
  const errors = validateLineItems(lineItems);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const currency = lineItems[0].currency;

  const categoryTotals = new Map<BudgetCategory, { planned: number; actual: number }>();
  const monthTotals = new Map<number, { planned: number; actual: number }>();

  let plannedTotal = 0;
  let actualTotal = 0;

  for (const item of lineItems) {
    const actualAmount = item.actualAmount ?? 0;

    plannedTotal += item.plannedAmount;
    actualTotal += actualAmount;

    const existingCategory = categoryTotals.get(item.category) ?? { planned: 0, actual: 0 };
    existingCategory.planned += item.plannedAmount;
    existingCategory.actual += actualAmount;
    categoryTotals.set(item.category, existingCategory);

    const existingMonth = monthTotals.get(item.month) ?? { planned: 0, actual: 0 };
    existingMonth.planned += item.plannedAmount;
    existingMonth.actual += actualAmount;
    monthTotals.set(item.month, existingMonth);
  }

  const byCategory: CategoryBudgetSummary[] = BUDGET_CATEGORIES.filter(category =>
    categoryTotals.has(category)
  ).map(category => {
    const totals = categoryTotals.get(category);
    if (!totals) {
      throw new Error(`Unexpected missing totals for category "${category}".`);
    }
    return {
      category,
      plannedTotal: totals.planned,
      actualTotal: totals.actual,
      variance: totals.actual - totals.planned,
      variancePercent: computeVariancePercent(totals.planned, totals.actual),
    };
  });

  const byMonth: MonthlyBudgetSummary[] = Array.from(monthTotals.entries())
    .sort(([monthA], [monthB]) => monthA - monthB)
    .map(([month, totals]) => ({
      month,
      plannedTotal: totals.planned,
      actualTotal: totals.actual,
      variance: totals.actual - totals.planned,
    }));

  const summary: AnnualBudgetSummary = {
    fiscalYear,
    currency,
    plannedTotal,
    actualTotal,
    variance: actualTotal - plannedTotal,
    variancePercent: computeVariancePercent(plannedTotal, actualTotal),
    byCategory,
    byMonth,
  };

  return { ok: true, summary };
}
