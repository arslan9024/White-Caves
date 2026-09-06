import { describe, expect, it } from 'vitest';

import {
  BUDGET_CATEGORIES,
  computeAnnualBudget,
  type MonthlyBudgetLineItem,
} from './financeEngineAnnualBudget.logic';

function lineItem(overrides: Partial<MonthlyBudgetLineItem> = {}): MonthlyBudgetLineItem {
  return {
    month: 1,
    category: 'Revenue',
    plannedAmount: 1000,
    actualAmount: 900,
    currency: 'USD',
    ...overrides,
  };
}

describe('computeAnnualBudget', () => {
  describe('validation', () => {
    it('rejects an empty lineItems array with EMPTY_INPUT and short-circuits other checks', () => {
      const result = computeAnnualBudget(2026, []);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('expected validation failure');
      }
      expect(result.errors).toEqual([{ code: 'EMPTY_INPUT', message: expect.any(String) }]);
    });

    it('reports INVALID_MONTH with the offending index for out-of-range and non-integer months', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ month: 0 }),
        lineItem({ month: 13 }),
        lineItem({ month: 1.5 }),
      ]);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('expected validation failure');
      }
      const invalidMonthErrors = result.errors.filter(e => e.code === 'INVALID_MONTH');
      expect(invalidMonthErrors).toHaveLength(3);
      expect(invalidMonthErrors.map(e => e.index)).toEqual([0, 1, 2]);
    });

    it('reports NON_FINITE_AMOUNT for non-finite plannedAmount and actualAmount', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ plannedAmount: Number.NaN }),
        lineItem({ actualAmount: Number.POSITIVE_INFINITY }),
      ]);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('expected validation failure');
      }
      const nonFiniteErrors = result.errors.filter(e => e.code === 'NON_FINITE_AMOUNT');
      expect(nonFiniteErrors).toHaveLength(2);
      expect(nonFiniteErrors.map(e => e.index)).toEqual([0, 1]);
    });

    it('reports NEGATIVE_AMOUNT for negative plannedAmount and actualAmount', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ plannedAmount: -1 }),
        lineItem({ actualAmount: -5 }),
      ]);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('expected validation failure');
      }
      const negativeErrors = result.errors.filter(e => e.code === 'NEGATIVE_AMOUNT');
      expect(negativeErrors).toHaveLength(2);
      expect(negativeErrors.map(e => e.index)).toEqual([0, 1]);
    });

    it('reports CURRENCY_MISMATCH when line items use different currencies', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ currency: 'USD' }),
        lineItem({ currency: 'AED' }),
      ]);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('expected validation failure');
      }
      expect(result.errors).toEqual([
        {
          code: 'CURRENCY_MISMATCH',
          message: expect.any(String),
          index: 1,
        },
      ]);
    });

    it('collects all applicable errors in a single pass rather than failing fast', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ month: 0, plannedAmount: -1, currency: 'USD' }),
        lineItem({ month: 1, currency: 'AED' }),
      ]);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('expected validation failure');
      }
      const codes = result.errors.map(e => e.code).sort();
      expect(codes).toEqual(['CURRENCY_MISMATCH', 'INVALID_MONTH', 'NEGATIVE_AMOUNT']);
    });
  });

  describe('happy path aggregation', () => {
    it('computes annual totals, variance, and variancePercent across multiple categories/months', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ month: 1, category: 'Revenue', plannedAmount: 1000, actualAmount: 1200 }),
        lineItem({ month: 2, category: 'Payroll', plannedAmount: 500, actualAmount: 500 }),
        lineItem({ month: 1, category: 'Payroll', plannedAmount: 300, actualAmount: 250 }),
      ]);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('expected success');
      }

      expect(result.summary.fiscalYear).toBe(2026);
      expect(result.summary.currency).toBe('USD');
      expect(result.summary.plannedTotal).toBe(1800);
      expect(result.summary.actualTotal).toBe(1950);
      expect(result.summary.variance).toBe(150);
      expect(result.summary.variancePercent).toBeCloseTo((150 / 1800) * 100, 10);
    });

    it('breaks down byCategory in BUDGET_CATEGORIES declaration order, including only present categories', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ month: 1, category: 'Other', plannedAmount: 100, actualAmount: 100 }),
        lineItem({ month: 1, category: 'Revenue', plannedAmount: 200, actualAmount: 200 }),
        lineItem({ month: 1, category: 'Payroll', plannedAmount: 300, actualAmount: 300 }),
      ]);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('expected success');
      }

      const categoriesInOutput = result.summary.byCategory.map(c => c.category);
      const expectedOrder = BUDGET_CATEGORIES.filter(c => categoriesInOutput.includes(c));
      expect(categoriesInOutput).toEqual(expectedOrder);
      expect(categoriesInOutput).toEqual(['Revenue', 'Payroll', 'Other']);
    });

    it('breaks down byMonth sorted ascending by month number', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ month: 12, plannedAmount: 100, actualAmount: 100 }),
        lineItem({ month: 3, plannedAmount: 100, actualAmount: 100 }),
        lineItem({ month: 7, plannedAmount: 100, actualAmount: 100 }),
      ]);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('expected success');
      }

      expect(result.summary.byMonth.map(m => m.month)).toEqual([3, 7, 12]);
    });

    it('computes correct planned/actual/variance for each category and month bucket', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ month: 1, category: 'Revenue', plannedAmount: 1000, actualAmount: 1100 }),
        lineItem({ month: 1, category: 'Revenue', plannedAmount: 500, actualAmount: 400 }),
      ]);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('expected success');
      }

      expect(result.summary.byCategory).toEqual([
        {
          category: 'Revenue',
          plannedTotal: 1500,
          actualTotal: 1500,
          variance: 0,
          variancePercent: 0,
        },
      ]);
      expect(result.summary.byMonth).toEqual([
        { month: 1, plannedTotal: 1500, actualTotal: 1500, variance: 0 },
      ]);
    });

    it('defaults actualAmount to 0 for aggregation when omitted', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ month: 1, category: 'Marketing', plannedAmount: 250, actualAmount: undefined }),
      ]);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('expected success');
      }

      expect(result.summary.actualTotal).toBe(0);
      expect(result.summary.byCategory[0]).toEqual({
        category: 'Marketing',
        plannedTotal: 250,
        actualTotal: 0,
        variance: -250,
        variancePercent: -100,
      });
    });
  });

  describe('variancePercent edge cases', () => {
    it('is 0 (not NaN/Infinity) at the annual level when plannedTotal is 0', () => {
      const result = computeAnnualBudget(2026, [lineItem({ plannedAmount: 0, actualAmount: 0 })]);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('expected success');
      }

      expect(result.summary.plannedTotal).toBe(0);
      expect(result.summary.variancePercent).toBe(0);
      expect(Number.isNaN(result.summary.variancePercent)).toBe(false);
    });

    it('is 0 (not NaN/Infinity) at the category level when a category plannedTotal is 0', () => {
      const result = computeAnnualBudget(2026, [
        lineItem({ category: 'CapitalExpenditure', plannedAmount: 0, actualAmount: 500 }),
      ]);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('expected success');
      }

      expect(result.summary.byCategory[0].plannedTotal).toBe(0);
      expect(result.summary.byCategory[0].variancePercent).toBe(0);
    });
  });

  describe('purity and determinism', () => {
    it('does not mutate the input lineItems array or its entries', () => {
      const input: MonthlyBudgetLineItem[] = [
        lineItem({ month: 1, category: 'Revenue', plannedAmount: 100, actualAmount: 90 }),
        lineItem({ month: 2, category: 'Payroll', plannedAmount: 200, actualAmount: 210 }),
      ];
      const snapshotBefore = JSON.parse(JSON.stringify(input)) as unknown;

      computeAnnualBudget(2026, input);

      expect(JSON.parse(JSON.stringify(input))).toEqual(snapshotBefore);
    });

    it('is referentially deterministic: same input yields deep-equal output across calls', () => {
      const input: MonthlyBudgetLineItem[] = [
        lineItem({
          month: 5,
          category: 'OperatingExpenses',
          plannedAmount: 700,
          actualAmount: 650,
        }),
        lineItem({ month: 5, category: 'Revenue', plannedAmount: 1200, actualAmount: 1300 }),
      ];

      const first = computeAnnualBudget(2026, input);
      const second = computeAnnualBudget(2026, input);

      expect(first).toEqual(second);
    });
  });
});
