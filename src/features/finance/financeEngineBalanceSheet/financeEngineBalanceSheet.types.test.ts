import { describe, expect, it } from 'vitest';
import {
  buildBalanceSheet,
  isBalanceSheetAccount,
  isBalanceSheetInput,
  isValidIsoDate,
  type BalanceSheetAccount,
  type BalanceSheetInput,
} from './financeEngineBalanceSheet.types';

const assetCurrent: BalanceSheetAccount = {
  id: 'cash',
  name: 'Cash and cash equivalents',
  category: 'asset',
  subCategory: 'current',
  balance: 500_000,
};

const assetNonCurrent: BalanceSheetAccount = {
  id: 'property',
  name: 'Property, plant and equipment',
  category: 'asset',
  subCategory: 'nonCurrent',
  balance: 1_500_000,
};

const liabilityCurrent: BalanceSheetAccount = {
  id: 'payables',
  name: 'Accounts payable',
  category: 'liability',
  subCategory: 'current',
  balance: 300_000,
};

const equityAccount: BalanceSheetAccount = {
  id: 'retained-earnings',
  name: 'Retained earnings',
  category: 'equity',
  subCategory: 'equity',
  balance: 1_700_000,
};

const balancedInput: BalanceSheetInput = {
  asOfDate: '2026-09-06',
  accounts: [assetCurrent, assetNonCurrent, liabilityCurrent, equityAccount],
};

describe('isValidIsoDate', () => {
  it('accepts a well-formed calendar date', () => {
    expect(isValidIsoDate('2026-09-06')).toBe(true);
  });

  it('rejects a non-existent calendar date', () => {
    expect(isValidIsoDate('2026-02-30')).toBe(false);
  });

  it('rejects malformed strings', () => {
    expect(isValidIsoDate('09/06/2026')).toBe(false);
    expect(isValidIsoDate('not-a-date')).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(isValidIsoDate(20260906)).toBe(false);
    expect(isValidIsoDate(null)).toBe(false);
  });
});

describe('isBalanceSheetAccount', () => {
  it('accepts a well-formed account', () => {
    expect(isBalanceSheetAccount(assetCurrent)).toBe(true);
  });

  it('rejects an account with an invalid category', () => {
    expect(isBalanceSheetAccount({ ...assetCurrent, category: 'revenue' })).toBe(false);
  });

  it('rejects an account with a non-integer balance', () => {
    expect(isBalanceSheetAccount({ ...assetCurrent, balance: 100.5 })).toBe(false);
  });

  it('rejects an account missing required fields', () => {
    expect(isBalanceSheetAccount({ id: 'cash' })).toBe(false);
  });

  it('rejects non-object values', () => {
    expect(isBalanceSheetAccount(null)).toBe(false);
    expect(isBalanceSheetAccount('cash')).toBe(false);
  });
});

describe('isBalanceSheetInput', () => {
  it('accepts a well-formed input', () => {
    expect(isBalanceSheetInput(balancedInput)).toBe(true);
  });

  it('rejects input with an invalid asOfDate', () => {
    expect(isBalanceSheetInput({ ...balancedInput, asOfDate: 'bad-date' })).toBe(false);
  });

  it('rejects input with a non-array accounts field', () => {
    expect(isBalanceSheetInput({ ...balancedInput, accounts: 'nope' })).toBe(false);
  });

  it('rejects input containing an invalid account entry', () => {
    expect(
      isBalanceSheetInput({
        ...balancedInput,
        accounts: [{ id: 'x', name: 'X', category: 'asset', subCategory: 'current', balance: NaN }],
      })
    ).toBe(false);
  });
});

describe('buildBalanceSheet', () => {
  it('produces a zeroed, balanced report for empty accounts', () => {
    const result = buildBalanceSheet({ asOfDate: '2026-09-06', accounts: [] });
    expect(result.assets.total).toBe(0);
    expect(result.liabilities.total).toBe(0);
    expect(result.equity.total).toBe(0);
    expect(result.assets.sections).toHaveLength(0);
    expect(result.isBalanced).toBe(true);
  });

  it('computes correct section and category totals for a mixed set of accounts', () => {
    const result = buildBalanceSheet(balancedInput);

    expect(result.assets.total).toBe(2_000_000);
    expect(result.liabilities.total).toBe(300_000);
    expect(result.equity.total).toBe(1_700_000);

    expect(result.assets.sections).toHaveLength(2);
    expect(result.assets.sections[0]).toMatchObject({ subCategory: 'current', total: 500_000 });
    expect(result.assets.sections[1]).toMatchObject({
      subCategory: 'nonCurrent',
      total: 1_500_000,
    });

    expect(result.liabilities.sections).toEqual([
      { subCategory: 'current', total: 300_000, accounts: [liabilityCurrent] },
    ]);
  });

  it('reports isBalanced true when assets equal liabilities plus equity', () => {
    const result = buildBalanceSheet(balancedInput);
    expect(result.isBalanced).toBe(true);
  });

  it('reports isBalanced false when assets differ from liabilities plus equity', () => {
    const unbalancedInput: BalanceSheetInput = {
      asOfDate: '2026-09-06',
      accounts: [assetCurrent, liabilityCurrent, equityAccount],
    };
    const result = buildBalanceSheet(unbalancedInput);
    expect(result.isBalanced).toBe(false);
  });

  it('throws when asOfDate is not a valid ISO-8601 date', () => {
    expect(() => buildBalanceSheet({ asOfDate: 'not-a-date', accounts: [] })).toThrow(/asOfDate/);
  });

  it('throws when an account has an invalid category', () => {
    expect(() =>
      buildBalanceSheet({
        asOfDate: '2026-09-06',
        accounts: [{ ...assetCurrent, category: 'revenue' as BalanceSheetAccount['category'] }],
      })
    ).toThrow(/category/);
  });

  it('throws when an account has a non-integer balance', () => {
    expect(() =>
      buildBalanceSheet({
        asOfDate: '2026-09-06',
        accounts: [{ ...assetCurrent, balance: 12.34 }],
      })
    ).toThrow(/balance/);
  });

  it('preserves first-seen subCategory ordering across sections', () => {
    const input: BalanceSheetInput = {
      asOfDate: '2026-09-06',
      accounts: [
        { ...assetNonCurrent, id: 'a1', subCategory: 'zeta' },
        { ...assetCurrent, id: 'a2', subCategory: 'alpha' },
        { ...assetCurrent, id: 'a3', subCategory: 'zeta' },
      ],
    };
    const result = buildBalanceSheet(input);
    expect(result.assets.sections.map(section => section.subCategory)).toEqual(['zeta', 'alpha']);
  });
});
