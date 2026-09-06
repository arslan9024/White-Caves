import { describe, expect, it } from 'vitest';
import {
  reconcile,
  type BankStatementLine,
  type LedgerTransaction,
} from './financeEngineBankReconciliation.logic';

function statementLine(
  overrides: Partial<BankStatementLine> & Pick<BankStatementLine, 'id'>
): BankStatementLine {
  return {
    postedAt: '2024-01-01',
    amountMinorUnits: 0,
    currency: 'USD',
    description: 'statement line',
    externalReference: null,
    ...overrides,
  };
}

function ledgerTransaction(
  overrides: Partial<LedgerTransaction> & Pick<LedgerTransaction, 'id'>
): LedgerTransaction {
  return {
    bookedAt: '2024-01-01',
    amountMinorUnits: 0,
    currency: 'USD',
    memo: 'ledger transaction',
    reconciliationStatus: 'unreconciled',
    ...overrides,
  };
}

describe('reconcile — FR-3 exact matches', () => {
  it('classifies same-amount, same-date pairs as exact with confidence 1', () => {
    const lines = [statementLine({ id: 'S1', postedAt: '2024-01-05', amountMinorUnits: 10_000 })];
    const txns = [
      ledgerTransaction({ id: 'L1', bookedAt: '2024-01-05', amountMinorUnits: 10_000 }),
    ];

    const result = reconcile(lines, txns);

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toEqual({
      statementLineId: 'S1',
      ledgerTransactionId: 'L1',
      matchType: 'exact',
      confidence: 1,
    });
    expect(result.unmatchedStatementLines).toHaveLength(0);
    expect(result.unmatchedLedgerTransactions).toHaveLength(0);
    expect(result.validationErrors).toHaveLength(0);
  });
});

describe('reconcile — FR-4 amount-and-date matches with confidence scaling', () => {
  it('matches within the tolerance window and scales confidence down from 1', () => {
    const lines = [statementLine({ id: 'S1', postedAt: '2024-01-01', amountMinorUnits: 5_000 })];
    const txns = [ledgerTransaction({ id: 'L1', bookedAt: '2024-01-02', amountMinorUnits: 5_000 })];

    const result = reconcile(lines, txns, { dateToleranceDays: 4 });

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchType).toBe('amount-and-date');
    // diff = 1 day, tolerance = 4 => confidence = 1 - 0.5 * (1/4) = 0.875
    expect(result.matches[0].confidence).toBeCloseTo(0.875, 10);
  });

  it('reaches confidence 0.5 at the edge of the tolerance window', () => {
    const lines = [statementLine({ id: 'S1', postedAt: '2024-01-01', amountMinorUnits: 5_000 })];
    const txns = [ledgerTransaction({ id: 'L1', bookedAt: '2024-01-04', amountMinorUnits: 5_000 })];

    const result = reconcile(lines, txns, { dateToleranceDays: 3 });

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchType).toBe('amount-and-date');
    expect(result.matches[0].confidence).toBeCloseTo(0.5, 10);
  });

  it('does not match beyond the tolerance window', () => {
    const lines = [statementLine({ id: 'S1', postedAt: '2024-01-01', amountMinorUnits: 5_000 })];
    const txns = [ledgerTransaction({ id: 'L1', bookedAt: '2024-01-10', amountMinorUnits: 5_000 })];

    const result = reconcile(lines, txns, { dateToleranceDays: 3 });

    expect(result.matches).toHaveLength(0);
    expect(result.unmatchedStatementLines).toHaveLength(1);
    expect(result.unmatchedLedgerTransactions).toHaveLength(1);
  });
});

describe('reconcile — FR-2 currency isolation', () => {
  it('never matches statement lines and ledger transactions in different currencies', () => {
    const lines = [
      statementLine({ id: 'S1', currency: 'USD', amountMinorUnits: 1_000, postedAt: '2024-01-01' }),
    ];
    const txns = [
      ledgerTransaction({
        id: 'L1',
        currency: 'EUR',
        amountMinorUnits: 1_000,
        bookedAt: '2024-01-01',
      }),
    ];

    const result = reconcile(lines, txns);

    expect(result.matches).toHaveLength(0);
    expect(result.unmatchedStatementLines).toHaveLength(1);
    expect(result.unmatchedLedgerTransactions).toHaveLength(1);
  });
});

describe('reconcile — FR-5 no partial-amount matching', () => {
  it('never auto-produces a manual match and reports differing amounts as unmatched', () => {
    const lines = [statementLine({ id: 'S1', amountMinorUnits: 1_000, postedAt: '2024-01-01' })];
    const txns = [ledgerTransaction({ id: 'L1', amountMinorUnits: 1_050, bookedAt: '2024-01-01' })];

    const result = reconcile(lines, txns);

    expect(result.matches).toHaveLength(0);
    expect(result.matches.some(m => m.matchType === 'manual')).toBe(false);
    expect(result.unmatchedStatementLines[0].id).toBe('S1');
    expect(result.unmatchedLedgerTransactions[0].id).toBe('L1');
  });
});

describe('reconcile — matching consumes candidates at most once', () => {
  it('does not double-match a single ledger transaction against two statement lines', () => {
    const lines = [
      statementLine({ id: 'S1', amountMinorUnits: 1_000, postedAt: '2024-01-01' }),
      statementLine({ id: 'S2', amountMinorUnits: 1_000, postedAt: '2024-01-02' }),
    ];
    const txns = [ledgerTransaction({ id: 'L1', amountMinorUnits: 1_000, bookedAt: '2024-01-01' })];

    const result = reconcile(lines, txns, { dateToleranceDays: 5 });

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].statementLineId).toBe('S1');
    expect(result.unmatchedStatementLines).toHaveLength(1);
    expect(result.unmatchedStatementLines[0].id).toBe('S2');
  });
});

describe('reconcile — FR-6 no mutation of inputs', () => {
  it('leaves the input arrays and their elements untouched', () => {
    const lines: BankStatementLine[] = [
      statementLine({ id: 'S1', amountMinorUnits: 1_000, postedAt: '2024-01-01' }),
    ];
    const txns: LedgerTransaction[] = [
      ledgerTransaction({ id: 'L1', amountMinorUnits: 1_000, bookedAt: '2024-01-01' }),
    ];
    const linesSnapshot = JSON.parse(JSON.stringify(lines)) as unknown;
    const txnsSnapshot = JSON.parse(JSON.stringify(txns)) as unknown;

    reconcile(lines, txns);

    expect(JSON.parse(JSON.stringify(lines))).toEqual(linesSnapshot);
    expect(JSON.parse(JSON.stringify(txns))).toEqual(txnsSnapshot);
    // reconciliationStatus on the ledger transaction must remain untouched
    expect(txns[0].reconciliationStatus).toBe('unreconciled');
  });
});

describe('reconcile — FR-7 idempotency', () => {
  it('produces an identical result when invoked twice with the same input', () => {
    const lines = [
      statementLine({ id: 'S1', amountMinorUnits: 1_000, postedAt: '2024-01-01' }),
      statementLine({ id: 'S2', amountMinorUnits: 2_000, postedAt: '2024-01-05' }),
    ];
    const txns = [
      ledgerTransaction({ id: 'L1', amountMinorUnits: 1_000, bookedAt: '2024-01-01' }),
      ledgerTransaction({ id: 'L2', amountMinorUnits: 3_000, bookedAt: '2024-01-05' }),
    ];

    const first = reconcile(lines, txns);
    const second = reconcile(lines, txns);

    expect(second).toEqual(first);
  });
});

describe('reconcile — FR-8 malformed input handling', () => {
  it('excludes records with an invalid currency code and reports a validation error', () => {
    const lines = [
      statementLine({ id: 'S1', currency: 'usd', amountMinorUnits: 1_000, postedAt: '2024-01-01' }),
    ];
    const txns = [ledgerTransaction({ id: 'L1', amountMinorUnits: 1_000, bookedAt: '2024-01-01' })];

    const result = reconcile(lines, txns);

    expect(result.matches).toHaveLength(0);
    expect(result.validationErrors).toContainEqual({
      recordId: 'S1',
      recordType: 'statement_line',
      reason: 'invalid_currency',
    });
    // the malformed record must not silently appear as a normal unmatched item
    expect(result.unmatchedStatementLines.some(line => line.id === 'S1')).toBe(false);
  });

  it('excludes ledger records with a non-integer amount and reports a validation error', () => {
    const lines = [statementLine({ id: 'S1', amountMinorUnits: 1_000, postedAt: '2024-01-01' })];
    const txns = [
      ledgerTransaction({ id: 'L1', amountMinorUnits: 1_000.5, bookedAt: '2024-01-01' }),
    ];

    const result = reconcile(lines, txns);

    expect(result.validationErrors).toContainEqual({
      recordId: 'L1',
      recordType: 'ledger_transaction',
      reason: 'non_integer_amount',
    });
    expect(result.unmatchedLedgerTransactions.some(txn => txn.id === 'L1')).toBe(false);
    expect(result.unmatchedStatementLines.some(line => line.id === 'S1')).toBe(true);
  });
});

describe('reconcile — option validation and edge cases', () => {
  it('throws when dateToleranceDays is negative', () => {
    expect(() => reconcile([], [], { dateToleranceDays: -1 })).toThrow(
      'dateToleranceDays must be a non-negative number'
    );
  });

  it('returns empty result arrays for empty inputs', () => {
    const result = reconcile([], []);
    expect(result.matches).toHaveLength(0);
    expect(result.unmatchedStatementLines).toHaveLength(0);
    expect(result.unmatchedLedgerTransactions).toHaveLength(0);
    expect(result.validationErrors).toHaveLength(0);
  });

  it('prefers the closest date among multiple same-amount candidates, breaking ties by input order', () => {
    const lines = [statementLine({ id: 'S1', amountMinorUnits: 1_000, postedAt: '2024-01-05' })];
    const txns = [
      ledgerTransaction({ id: 'L-far', amountMinorUnits: 1_000, bookedAt: '2024-01-01' }),
      ledgerTransaction({ id: 'L-near', amountMinorUnits: 1_000, bookedAt: '2024-01-04' }),
    ];

    const result = reconcile(lines, txns, { dateToleranceDays: 10 });

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].ledgerTransactionId).toBe('L-near');
  });
});
