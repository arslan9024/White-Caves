import { describe, expect, it } from 'vitest';
import {
  BalanceSheetLineItem,
  BalanceSheetValidationError,
  computeBalanceSheet,
  formatMinorUnits,
  validateLineItem,
  validateLineItems,
} from './financeEngineBalanceSheet.logic';

function makeItem(overrides: Partial<BalanceSheetLineItem> = {}): BalanceSheetLineItem {
  return {
    id: 'cash',
    label: 'Cash and cash equivalents',
    category: 'asset',
    subCategory: 'current',
    amountMinorUnits: 10000,
    ...overrides,
  };
}

describe('validateLineItem', () => {
  it('accepts a well formed line item', () => {
    expect(() => validateLineItem(makeItem())).not.toThrow();
  });

  it('rejects an empty id', () => {
    expect(() => validateLineItem(makeItem({ id: '' }))).toThrow(BalanceSheetValidationError);
  });

  it('rejects an empty label', () => {
    expect(() => validateLineItem(makeItem({ label: '   ' }))).toThrow(BalanceSheetValidationError);
  });

  it('rejects an invalid category', () => {
    expect(() =>
      validateLineItem(
        makeItem({ category: 'revenue' as unknown as BalanceSheetLineItem['category'] })
      )
    ).toThrow(BalanceSheetValidationError);
  });

  it('rejects an invalid subCategory', () => {
    expect(() =>
      validateLineItem(
        makeItem({ subCategory: 'weird' as unknown as BalanceSheetLineItem['subCategory'] })
      )
    ).toThrow(BalanceSheetValidationError);
  });

  it('rejects non-integer amounts', () => {
    expect(() => validateLineItem(makeItem({ amountMinorUnits: 10.5 }))).toThrow(
      BalanceSheetValidationError
    );
  });

  it('rejects NaN amounts', () => {
    expect(() => validateLineItem(makeItem({ amountMinorUnits: Number.NaN }))).toThrow(
      BalanceSheetValidationError
    );
  });
});

describe('validateLineItems', () => {
  it('detects duplicate ids', () => {
    const items = [makeItem({ id: 'dup' }), makeItem({ id: 'dup' })];
    expect(() => validateLineItems(items)).toThrow(BalanceSheetValidationError);
  });

  it('passes for a list of unique valid items', () => {
    const items = [makeItem({ id: 'a' }), makeItem({ id: 'b' })];
    expect(() => validateLineItems(items)).not.toThrow();
  });
});

describe('computeBalanceSheet', () => {
  it('throws when asOf is missing', () => {
    expect(() => computeBalanceSheet([], '')).toThrow(BalanceSheetValidationError);
  });

  it('propagates validation errors from malformed line items', () => {
    const items = [makeItem({ amountMinorUnits: Number.NaN })];
    expect(() => computeBalanceSheet(items, '2024-12-31')).toThrow(BalanceSheetValidationError);
  });

  it('computes a balanced sheet with correct section totals', () => {
    const items: BalanceSheetLineItem[] = [
      makeItem({ id: 'cash', category: 'asset', subCategory: 'current', amountMinorUnits: 500000 }),
      makeItem({
        id: 'inventory',
        label: 'Inventory',
        category: 'asset',
        subCategory: 'current',
        amountMinorUnits: 250000,
      }),
      makeItem({
        id: 'property',
        label: 'Property',
        category: 'asset',
        subCategory: 'nonCurrent',
        amountMinorUnits: 1000000,
      }),
      makeItem({
        id: 'payables',
        label: 'Accounts payable',
        category: 'liability',
        subCategory: 'current',
        amountMinorUnits: 300000,
      }),
      makeItem({
        id: 'loan',
        label: 'Long term loan',
        category: 'liability',
        subCategory: 'nonCurrent',
        amountMinorUnits: 450000,
      }),
      makeItem({
        id: 'retainedEarnings',
        label: 'Retained earnings',
        category: 'equity',
        subCategory: 'nonCurrent',
        amountMinorUnits: 1000000,
      }),
    ];

    const report = computeBalanceSheet(items, '2024-12-31');

    expect(report.asOf).toBe('2024-12-31');
    expect(report.assets.totalMinorUnits).toBe(1750000);
    expect(report.liabilities.totalMinorUnits).toBe(750000);
    expect(report.equity.totalMinorUnits).toBe(1000000);
    expect(report.totalAssetsMinorUnits).toBe(1750000);
    expect(report.totalLiabilitiesAndEquityMinorUnits).toBe(1750000);
    expect(report.isBalanced).toBe(true);
    expect(report.balanceDifferenceMinorUnits).toBe(0);

    const currentAssetsGroup = report.assets.groups.find(g => g.subCategory === 'current');
    expect(currentAssetsGroup?.totalMinorUnits).toBe(750000);
    expect(currentAssetsGroup?.items).toHaveLength(2);

    const nonCurrentAssetsGroup = report.assets.groups.find(g => g.subCategory === 'nonCurrent');
    expect(nonCurrentAssetsGroup?.totalMinorUnits).toBe(1000000);
  });

  it('flags an unbalanced sheet without throwing', () => {
    const items: BalanceSheetLineItem[] = [
      makeItem({ id: 'cash', category: 'asset', subCategory: 'current', amountMinorUnits: 100000 }),
      makeItem({
        id: 'equityOnly',
        label: 'Owner equity',
        category: 'equity',
        subCategory: 'nonCurrent',
        amountMinorUnits: 50000,
      }),
    ];

    const report = computeBalanceSheet(items, '2024-12-31');

    expect(report.isBalanced).toBe(false);
    expect(report.balanceDifferenceMinorUnits).toBe(50000);
  });

  it('omits empty groups from a section', () => {
    const items: BalanceSheetLineItem[] = [
      makeItem({ id: 'cash', category: 'asset', subCategory: 'current', amountMinorUnits: 100000 }),
      makeItem({
        id: 'equityOnly',
        label: 'Owner equity',
        category: 'equity',
        subCategory: 'nonCurrent',
        amountMinorUnits: 100000,
      }),
    ];

    const report = computeBalanceSheet(items, '2024-12-31');

    expect(report.assets.groups).toHaveLength(1);
    expect(report.assets.groups[0].subCategory).toBe('current');
    expect(report.liabilities.groups).toHaveLength(0);
    expect(report.liabilities.totalMinorUnits).toBe(0);
  });

  it('handles an empty list of line items as a balanced, zeroed report', () => {
    const report = computeBalanceSheet([], '2024-12-31');

    expect(report.totalAssetsMinorUnits).toBe(0);
    expect(report.totalLiabilitiesAndEquityMinorUnits).toBe(0);
    expect(report.isBalanced).toBe(true);
    expect(report.assets.groups).toHaveLength(0);
  });
});

describe('formatMinorUnits', () => {
  it('formats a positive amount with two decimal places', () => {
    expect(formatMinorUnits(123456)).toBe('1234.56');
  });

  it('formats a negative amount preserving the sign', () => {
    expect(formatMinorUnits(-500)).toBe('-5.00');
  });

  it('formats zero correctly', () => {
    expect(formatMinorUnits(0)).toBe('0.00');
  });

  it('pads fractional minor units below ten', () => {
    expect(formatMinorUnits(105)).toBe('1.05');
  });

  it('throws for non-integer input', () => {
    expect(() => formatMinorUnits(10.5)).toThrow(BalanceSheetValidationError);
  });
});
