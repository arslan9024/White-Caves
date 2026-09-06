import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MATCH_OPTIONS,
  RECONCILIATION_STATUSES,
  isBankStatementLine,
  isConsistentReconciliationSummary,
  isLedgerTransaction,
  isReconciliationMatch,
  isReconciliationStatus,
  isReconciliationSummary,
  resolveMatchOptions,
  type BankStatementLine,
  type LedgerTransaction,
  type ReconciliationMatch,
  type ReconciliationSummary,
} from './financeEngineBankReconciliation.types';

const validBankLine: BankStatementLine = {
  id: 'bank-1',
  postedDate: '2024-03-15',
  amountCents: 10000,
  description: 'Wire transfer',
  referenceNumber: 'REF-001',
};

const validLedgerTransaction: LedgerTransaction = {
  id: 'ledger-1',
  transactionDate: '2024-03-15',
  amountCents: 10000,
  memo: 'Client invoice payment',
  referenceNumber: 'REF-001',
};

const validMatch: ReconciliationMatch = {
  bankLineId: 'bank-1',
  ledgerTransactionId: 'ledger-1',
  status: 'matched',
  confidence: 1,
  varianceCents: 0,
};

describe('RECONCILIATION_STATUSES', () => {
  it('contains exactly the four documented statuses', () => {
    expect(RECONCILIATION_STATUSES).toEqual([
      'matched',
      'unmatched',
      'amount-mismatch',
      'date-out-of-window',
    ]);
  });
});

describe('isReconciliationStatus', () => {
  it('returns true for each documented status value', () => {
    for (const status of RECONCILIATION_STATUSES) {
      expect(isReconciliationStatus(status)).toBe(true);
    }
  });

  it('returns false for an unrelated string', () => {
    expect(isReconciliationStatus('pending')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isReconciliationStatus(42)).toBe(false);
    expect(isReconciliationStatus(null)).toBe(false);
    expect(isReconciliationStatus(undefined)).toBe(false);
  });
});

describe('DEFAULT_MATCH_OPTIONS', () => {
  it('defaults to a 3-day window and 0-cent tolerance', () => {
    expect(DEFAULT_MATCH_OPTIONS).toEqual({
      dateWindowDays: 3,
      amountToleranceCents: 0,
    });
  });
});

describe('resolveMatchOptions', () => {
  it('returns the defaults when called with no arguments', () => {
    expect(resolveMatchOptions()).toEqual(DEFAULT_MATCH_OPTIONS);
  });

  it('returns the defaults when called with an empty object', () => {
    expect(resolveMatchOptions({})).toEqual(DEFAULT_MATCH_OPTIONS);
  });

  it('overrides only the provided fields', () => {
    expect(resolveMatchOptions({ dateWindowDays: 7 })).toEqual({
      dateWindowDays: 7,
      amountToleranceCents: 0,
    });
    expect(resolveMatchOptions({ amountToleranceCents: 50 })).toEqual({
      dateWindowDays: 3,
      amountToleranceCents: 50,
    });
  });

  it('overrides both fields when both are provided', () => {
    expect(resolveMatchOptions({ dateWindowDays: 1, amountToleranceCents: 200 })).toEqual({
      dateWindowDays: 1,
      amountToleranceCents: 200,
    });
  });
});

describe('isBankStatementLine', () => {
  it('returns true for a well-formed bank statement line', () => {
    expect(isBankStatementLine(validBankLine)).toBe(true);
  });

  it('returns false when a required field is missing', () => {
    const { id: _id, ...withoutId } = validBankLine;
    expect(isBankStatementLine(withoutId)).toBe(false);
  });

  it('returns false when amountCents is not a finite number', () => {
    expect(isBankStatementLine({ ...validBankLine, amountCents: Number.NaN })).toBe(false);
    expect(isBankStatementLine({ ...validBankLine, amountCents: '10000' })).toBe(false);
  });

  it('returns false for non-object values', () => {
    expect(isBankStatementLine(null)).toBe(false);
    expect(isBankStatementLine('not an object')).toBe(false);
    expect(isBankStatementLine(42)).toBe(false);
  });
});

describe('isLedgerTransaction', () => {
  it('returns true for a well-formed ledger transaction', () => {
    expect(isLedgerTransaction(validLedgerTransaction)).toBe(true);
  });

  it('returns false when a required field is missing', () => {
    const { memo: _memo, ...withoutMemo } = validLedgerTransaction;
    expect(isLedgerTransaction(withoutMemo)).toBe(false);
  });

  it('returns false when amountCents is not a finite number', () => {
    expect(isLedgerTransaction({ ...validLedgerTransaction, amountCents: Infinity })).toBe(false);
  });

  it('returns false for non-object values', () => {
    expect(isLedgerTransaction(undefined)).toBe(false);
    expect(isLedgerTransaction([])).toBe(false);
  });
});

describe('isReconciliationMatch', () => {
  it('returns true for a well-formed match with a ledger transaction id', () => {
    expect(isReconciliationMatch(validMatch)).toBe(true);
  });

  it('returns true when ledgerTransactionId is explicitly null', () => {
    expect(
      isReconciliationMatch({
        ...validMatch,
        ledgerTransactionId: null,
        status: 'unmatched',
        confidence: 0,
      })
    ).toBe(true);
  });

  it('returns false when confidence is out of the [0, 1] range', () => {
    expect(isReconciliationMatch({ ...validMatch, confidence: 1.5 })).toBe(false);
    expect(isReconciliationMatch({ ...validMatch, confidence: -0.1 })).toBe(false);
  });

  it('returns false when status is not a recognized ReconciliationStatus', () => {
    expect(isReconciliationMatch({ ...validMatch, status: 'pending-review' })).toBe(false);
  });

  it('returns false for non-object values', () => {
    expect(isReconciliationMatch(null)).toBe(false);
  });
});

describe('isReconciliationSummary and isConsistentReconciliationSummary', () => {
  const consistentSummary: ReconciliationSummary = {
    totalBankLines: 2,
    totalMatched: 1,
    totalUnmatched: 1,
    matches: [
      validMatch,
      {
        bankLineId: 'bank-2',
        ledgerTransactionId: null,
        status: 'unmatched',
        confidence: 0,
        varianceCents: 0,
      },
    ],
  };

  it('recognizes a well-formed summary', () => {
    expect(isReconciliationSummary(consistentSummary)).toBe(true);
  });

  it('rejects a summary whose matches array contains an invalid entry', () => {
    const invalidSummary = {
      ...consistentSummary,
      matches: [...consistentSummary.matches, { bankLineId: 'bad' }],
    };
    expect(isReconciliationSummary(invalidSummary)).toBe(false);
  });

  it('confirms totals are internally consistent for a valid summary', () => {
    expect(isConsistentReconciliationSummary(consistentSummary)).toBe(true);
  });

  it('detects an inconsistent summary where totals do not add up', () => {
    const inconsistentSummary: ReconciliationSummary = {
      ...consistentSummary,
      totalMatched: 2,
    };
    expect(isConsistentReconciliationSummary(inconsistentSummary)).toBe(false);
  });

  it('detects an inconsistent summary where totalBankLines disagrees with matches.length', () => {
    const inconsistentSummary: ReconciliationSummary = {
      ...consistentSummary,
      totalBankLines: 5,
    };
    expect(isConsistentReconciliationSummary(inconsistentSummary)).toBe(false);
  });
});
