import { describe, expect, it } from 'vitest';
import {
  BUDGET_CATEGORY_ORDER,
  computeVariance,
  computeVariancePercent,
  createBudgetValidationError,
  isAnnualBudgetFailure,
  isAnnualBudgetSuccess,
  isBudgetCategory,
  isValidBudgetAmount,
  isValidBudgetMonth,
  type AnnualBudgetResult,
  type AnnualBudgetSummary,
  type BudgetValidationError,
  type MonthlyBudgetLineItem,
} from './financeEngineAnnualBudget.types';

describe('BUDGET_CATEGORY_ORDER', () => {
  it('is a fixed, non-empty, deterministic ordering', () => {
    expect(BUDGET_CATEGORY_ORDER.length).toBeGreaterThan(0);
    expect(BUDGET_CATEGORY_ORDER).toEqual([
      'housing',
      'utilities',
      'payroll',
      'marketing',
      'operations',
      'other',
    ]);
  });

  it('contains no duplicate categories', () => {
    const unique = new Set(BUDGET_CATEGORY_ORDER);
    expect(unique.size).toBe(BUDGET_CATEGORY_ORDER.length);
  });
});

describe('isBudgetCategory', () => {
  it('returns true for every canonical category', () => {
    for (const category of BUDGET_CATEGORY_ORDER) {
      expect(isBudgetCategory(category)).toBe(true);
    }
  });

  it('returns false for an unknown string', () => {
    expect(isBudgetCategory('not-a-real-category')).toBe(false);
    expect(isBudgetCategory('')).toBe(false);
  });
});

describe('isValidBudgetMonth', () => {
  it('accepts integers 1 through 12', () => {
    for (let month = 1; month <= 12; month += 1) {
      expect(isValidBudgetMonth(month)).toBe(true);
    }
  });

  it('rejects 0, 13, negative, and non-integer months', () => {
    expect(isValidBudgetMonth(0)).toBe(false);
    expect(isValidBudgetMonth(13)).toBe(false);
    expect(isValidBudgetMonth(-1)).toBe(false);
    expect(isValidBudgetMonth(5.5)).toBe(false);
    expect(isValidBudgetMonth(Number.NaN)).toBe(false);
  });
});

describe('isValidBudgetAmount', () => {
  it('accepts 0 and positive finite numbers', () => {
    expect(isValidBudgetAmount(0)).toBe(true);
    expect(isValidBudgetAmount(1500.75)).toBe(true);
  });

  it('rejects negative numbers', () => {
    expect(isValidBudgetAmount(-0.01)).toBe(false);
  });

  it('rejects non-finite numbers (NaN, Infinity, -Infinity)', () => {
    expect(isValidBudgetAmount(Number.NaN)).toBe(false);
    expect(isValidBudgetAmount(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isValidBudgetAmount(Number.NEGATIVE_INFINITY)).toBe(false);
  });
});

describe('computeVariance', () => {
  it('computes actual minus planned', () => {
    expect(computeVariance(1000, 1200)).toBe(200);
    expect(computeVariance(1000, 800)).toBe(-200);
    expect(computeVariance(500, 500)).toBe(0);
  });
});

describe('computeVariancePercent', () => {
  it('computes percentage variance relative to plannedTotal', () => {
    expect(computeVariancePercent(1000, 200)).toBe(20);
    expect(computeVariancePercent(1000, -100)).toBe(-10);
  });

  it('returns exactly 0 (never NaN/Infinity) when plannedTotal is 0', () => {
    const result = computeVariancePercent(0, 500);
    expect(result).toBe(0);
    expect(Number.isNaN(result)).toBe(false);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('returns 0 when plannedTotal and variance are both 0', () => {
    expect(computeVariancePercent(0, 0)).toBe(0);
  });
});

describe('createBudgetValidationError', () => {
  it('builds an error with the default message for a given code', () => {
    const error: BudgetValidationError = createBudgetValidationError('EMPTY_INPUT');
    expect(error.code).toBe('EMPTY_INPUT');
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.index).toBeUndefined();
  });

  it('attaches the offending line item index when provided', () => {
    const error = createBudgetValidationError('INVALID_MONTH', { index: 3 });
    expect(error.code).toBe('INVALID_MONTH');
    expect(error.index).toBe(3);
  });

  it('allows overriding the default message', () => {
    const error = createBudgetValidationError('CURRENCY_MISMATCH', {
      message: 'custom currency mismatch message',
    });
    expect(error.message).toBe('custom currency mismatch message');
  });

  it('produces distinct default messages for distinct error codes', () => {
    const codes = [
      'EMPTY_INPUT',
      'INVALID_MONTH',
      'NON_FINITE_AMOUNT',
      'NEGATIVE_AMOUNT',
      'CURRENCY_MISMATCH',
    ] as const;
    const messages = codes.map(code => createBudgetValidationError(code).message);
    expect(new Set(messages).size).toBe(codes.length);
  });
});

describe('isAnnualBudgetSuccess / isAnnualBudgetFailure', () => {
  const summary: AnnualBudgetSummary = {
    fiscalYear: 2026,
    currency: 'USD',
    plannedTotal: 1000,
    actualTotal: 1100,
    variance: 100,
    variancePercent: 10,
    byCategory: [],
    byMonth: [],
  };

  it('narrows a success result', () => {
    const result: AnnualBudgetResult = { ok: true, summary };
    expect(isAnnualBudgetSuccess(result)).toBe(true);
    expect(isAnnualBudgetFailure(result)).toBe(false);
    if (isAnnualBudgetSuccess(result)) {
      // Narrowed access must compile and reflect the original summary.
      expect(result.summary.fiscalYear).toBe(2026);
    }
  });

  it('narrows a failure result', () => {
    const errors: BudgetValidationError[] = [createBudgetValidationError('EMPTY_INPUT')];
    const result: AnnualBudgetResult = { ok: false, errors };
    expect(isAnnualBudgetFailure(result)).toBe(true);
    expect(isAnnualBudgetSuccess(result)).toBe(false);
    if (isAnnualBudgetFailure(result)) {
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe('EMPTY_INPUT');
    }
  });
});

describe('MonthlyBudgetLineItem shape', () => {
  it('supports an item without an actualAmount', () => {
    const item: MonthlyBudgetLineItem = {
      month: 1,
      category: 'housing',
      currency: 'USD',
      plannedAmount: 500,
    };
    expect(item.actualAmount).toBeUndefined();
    expect(isValidBudgetMonth(item.month)).toBe(true);
    expect(isValidBudgetAmount(item.plannedAmount)).toBe(true);
  });

  it('supports an item with an actualAmount', () => {
    const item: MonthlyBudgetLineItem = {
      month: 12,
      category: 'payroll',
      currency: 'AED',
      plannedAmount: 2000,
      actualAmount: 2150.5,
    };
    expect(item.actualAmount).toBe(2150.5);
    expect(item.actualAmount !== undefined && isValidBudgetAmount(item.actualAmount)).toBe(true);
  });
});
