import { describe, expect, it } from 'vitest';
import {
  DEFAULT_VAT_RATE,
  FinanceQuarterlyVatError,
  FinanceVatTransaction,
  calculateQuarterlyVat,
  formatQuarterLabel,
  getQuarterForDate,
  getQuarterlyVatSummary,
  groupTransactionsByQuarter,
  resolveTransactionVat,
} from './financeEngineQuarterlyVat.logic';

function tx(
  overrides: Partial<FinanceVatTransaction> & Pick<FinanceVatTransaction, 'id'>
): FinanceVatTransaction {
  return {
    date: '2024-01-15',
    amount: 1000,
    type: 'sale',
    ...overrides,
  };
}

describe('getQuarterForDate', () => {
  it('maps January-March to Q1', () => {
    expect(getQuarterForDate('2024-01-01')).toEqual({ year: 2024, quarter: 1 });
    expect(getQuarterForDate('2024-03-31')).toEqual({ year: 2024, quarter: 1 });
  });

  it('maps April-June to Q2', () => {
    expect(getQuarterForDate('2024-04-01')).toEqual({ year: 2024, quarter: 2 });
    expect(getQuarterForDate('2024-06-30')).toEqual({ year: 2024, quarter: 2 });
  });

  it('maps July-September to Q3', () => {
    expect(getQuarterForDate('2024-07-01')).toEqual({ year: 2024, quarter: 3 });
    expect(getQuarterForDate('2024-09-30')).toEqual({ year: 2024, quarter: 3 });
  });

  it('maps October-December to Q4', () => {
    expect(getQuarterForDate('2024-10-01')).toEqual({ year: 2024, quarter: 4 });
    expect(getQuarterForDate('2024-12-31')).toEqual({ year: 2024, quarter: 4 });
  });

  it('throws FinanceQuarterlyVatError for an invalid date string', () => {
    expect(() => getQuarterForDate('not-a-date')).toThrow(FinanceQuarterlyVatError);
  });
});

describe('formatQuarterLabel', () => {
  it('formats a quarter key as YYYY-QN', () => {
    expect(formatQuarterLabel({ year: 2024, quarter: 3 })).toBe('2024-Q3');
  });
});

describe('resolveTransactionVat', () => {
  it('computes VAT from amount and rate when vatAmount is not supplied', () => {
    const transaction = tx({ id: 't1', amount: 200 });
    expect(resolveTransactionVat(transaction, DEFAULT_VAT_RATE)).toBeCloseTo(10);
  });

  it('uses the explicit vatAmount override when supplied', () => {
    const transaction = tx({ id: 't2', amount: 200, vatAmount: 5 });
    expect(resolveTransactionVat(transaction, DEFAULT_VAT_RATE)).toBe(5);
  });
});

describe('groupTransactionsByQuarter', () => {
  it('groups transactions into their respective quarter buckets', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'a', date: '2024-01-10' }),
      tx({ id: 'b', date: '2024-02-20' }),
      tx({ id: 'c', date: '2024-05-01' }),
    ];
    const groups = groupTransactionsByQuarter(transactions);
    expect(groups.get('2024-Q1')?.map(t => t.id)).toEqual(['a', 'b']);
    expect(groups.get('2024-Q2')?.map(t => t.id)).toEqual(['c']);
    expect(groups.size).toBe(2);
  });

  it('returns an empty map for no transactions', () => {
    expect(groupTransactionsByQuarter([]).size).toBe(0);
  });
});

describe('calculateQuarterlyVat', () => {
  it('computes output VAT, input VAT, and net VAT for a single quarter', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'sale1', date: '2024-02-01', amount: 1000, type: 'sale' }),
      tx({ id: 'purchase1', date: '2024-02-15', amount: 400, type: 'purchase' }),
    ];

    const summaries = calculateQuarterlyVat(transactions);

    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toEqual({
      year: 2024,
      quarter: 1,
      label: '2024-Q1',
      totalSales: 1000,
      totalPurchases: 400,
      outputVat: 50,
      inputVat: 20,
      netVat: 30,
      transactionCount: 2,
    });
  });

  it('produces multiple sorted quarterly summaries across a year', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 's-q3', date: '2024-08-01', amount: 500, type: 'sale' }),
      tx({ id: 's-q1', date: '2024-01-05', amount: 1000, type: 'sale' }),
      tx({ id: 'p-q2', date: '2024-05-10', amount: 200, type: 'purchase' }),
    ];

    const summaries = calculateQuarterlyVat(transactions);

    expect(summaries.map(s => s.label)).toEqual(['2024-Q1', '2024-Q2', '2024-Q3']);
    expect(summaries[0].outputVat).toBeCloseTo(50);
    expect(summaries[1].inputVat).toBeCloseTo(10);
    expect(summaries[2].outputVat).toBeCloseTo(25);
  });

  it('respects an explicit vatAmount instead of recalculating from the rate', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'sale1', date: '2024-01-01', amount: 1000, type: 'sale', vatAmount: 12.34 }),
    ];
    const summaries = calculateQuarterlyVat(transactions);
    expect(summaries[0].outputVat).toBe(12.34);
  });

  it('applies a custom vatRate option to all recalculated transactions', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'sale1', date: '2024-01-01', amount: 1000, type: 'sale' }),
    ];
    const summaries = calculateQuarterlyVat(transactions, { vatRate: 0.1 });
    expect(summaries[0].outputVat).toBe(100);
  });

  it('filters to a single year when the year option is provided', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'y2023', date: '2023-06-01', amount: 100, type: 'sale' }),
      tx({ id: 'y2024', date: '2024-06-01', amount: 200, type: 'sale' }),
    ];
    const summaries = calculateQuarterlyVat(transactions, { year: 2024 });
    expect(summaries).toHaveLength(1);
    expect(summaries[0].year).toBe(2024);
    expect(summaries[0].totalSales).toBe(200);
  });

  it('returns an empty array for no transactions', () => {
    expect(calculateQuarterlyVat([])).toEqual([]);
  });

  it('produces a net-refundable (negative) VAT position when purchases exceed sales', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'sale1', date: '2024-01-01', amount: 100, type: 'sale' }),
      tx({ id: 'purchase1', date: '2024-01-05', amount: 1000, type: 'purchase' }),
    ];
    const summaries = calculateQuarterlyVat(transactions);
    expect(summaries[0].netVat).toBeCloseTo(5 - 50);
    expect(summaries[0].netVat).toBeLessThan(0);
  });

  it('rounds monetary totals to 2 decimal places to avoid floating point noise', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'a', date: '2024-01-01', amount: 10.1, type: 'sale' }),
      tx({ id: 'b', date: '2024-01-02', amount: 20.2, type: 'sale' }),
      tx({ id: 'c', date: '2024-01-03', amount: 30.3, type: 'sale' }),
    ];
    const summaries = calculateQuarterlyVat(transactions);
    expect(summaries[0].totalSales).toBe(60.6);
  });

  it('throws FinanceQuarterlyVatError when a transaction has a negative amount', () => {
    const transactions: FinanceVatTransaction[] = [tx({ id: 'bad', amount: -5 })];
    expect(() => calculateQuarterlyVat(transactions)).toThrow(FinanceQuarterlyVatError);
  });

  it('throws FinanceQuarterlyVatError when a transaction has an invalid type', () => {
    const transactions = [
      tx({ id: 'bad', type: 'refund' as unknown as FinanceVatTransaction['type'] }),
    ];
    expect(() => calculateQuarterlyVat(transactions)).toThrow(FinanceQuarterlyVatError);
  });

  it('throws FinanceQuarterlyVatError when a transaction has an invalid date', () => {
    const transactions: FinanceVatTransaction[] = [tx({ id: 'bad', date: 'nope' })];
    expect(() => calculateQuarterlyVat(transactions)).toThrow(FinanceQuarterlyVatError);
  });

  it('throws FinanceQuarterlyVatError for a negative vatRate option', () => {
    const transactions: FinanceVatTransaction[] = [tx({ id: 'a' })];
    expect(() => calculateQuarterlyVat(transactions, { vatRate: -0.1 })).toThrow(
      FinanceQuarterlyVatError
    );
  });

  it('throws FinanceQuarterlyVatError for a non-integer year option', () => {
    const transactions: FinanceVatTransaction[] = [tx({ id: 'a' })];
    expect(() => calculateQuarterlyVat(transactions, { year: 2024.5 })).toThrow(
      FinanceQuarterlyVatError
    );
  });

  it('omits quarters with zero transactions when omitEmptyQuarters is true (default behavior has no empty quarters anyway)', () => {
    const transactions: FinanceVatTransaction[] = [tx({ id: 'a', date: '2024-01-01' })];
    const summaries = calculateQuarterlyVat(transactions, { omitEmptyQuarters: true });
    expect(summaries.every(s => s.transactionCount > 0)).toBe(true);
  });

  it('does not mutate the input transactions array', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'a', date: '2024-01-01', amount: 100 }),
    ];
    const snapshot = JSON.parse(JSON.stringify(transactions)) as FinanceVatTransaction[];
    calculateQuarterlyVat(transactions);
    expect(transactions).toEqual(snapshot);
  });
});

describe('getQuarterlyVatSummary', () => {
  it('returns the summary for a specific requested quarter', () => {
    const transactions: FinanceVatTransaction[] = [
      tx({ id: 'sale1', date: '2024-02-01', amount: 1000, type: 'sale' }),
      tx({ id: 'sale2', date: '2024-08-01', amount: 500, type: 'sale' }),
    ];
    const summary = getQuarterlyVatSummary(transactions, { year: 2024, quarter: 1 });
    expect(summary?.label).toBe('2024-Q1');
    expect(summary?.totalSales).toBe(1000);
  });

  it('returns undefined when no transactions fall in the requested quarter', () => {
    const transactions: FinanceVatTransaction[] = [tx({ id: 'sale1', date: '2024-02-01' })];
    const summary = getQuarterlyVatSummary(transactions, { year: 2024, quarter: 4 });
    expect(summary).toBeUndefined();
  });
});
