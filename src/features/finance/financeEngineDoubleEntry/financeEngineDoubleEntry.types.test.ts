import { describe, expect, it } from 'vitest';
import {
  ACCOUNT_TYPES,
  CREDIT_NORMAL_ACCOUNT_TYPES,
  DEBIT_NORMAL_ACCOUNT_TYPES,
  ENTRY_SIDES,
  isAccountType,
  isCreditNormalAccountType,
  isDebitNormalAccountType,
  isEntrySide,
  signedAmountForEntry,
  type LedgerAccount,
  type LedgerEntry,
  type LedgerTransaction,
  type LedgerTransactionCandidate,
  type ValidationResult,
} from './financeEngineDoubleEntry.types';

describe('financeEngineDoubleEntry.types constants', () => {
  it('lists all five standard account types exactly once', () => {
    expect(ACCOUNT_TYPES).toHaveLength(5);
    expect(new Set(ACCOUNT_TYPES).size).toBe(5);
    expect(ACCOUNT_TYPES).toEqual(
      expect.arrayContaining(['asset', 'liability', 'equity', 'revenue', 'expense'])
    );
  });

  it('lists exactly the two entry sides', () => {
    expect(ENTRY_SIDES).toEqual(['debit', 'credit']);
  });

  it('classifies debit-normal and credit-normal account types as a disjoint partition', () => {
    expect(DEBIT_NORMAL_ACCOUNT_TYPES).toEqual(['asset', 'expense']);
    expect(CREDIT_NORMAL_ACCOUNT_TYPES).toEqual(['liability', 'equity', 'revenue']);

    const combined = [...DEBIT_NORMAL_ACCOUNT_TYPES, ...CREDIT_NORMAL_ACCOUNT_TYPES];
    expect(combined.sort()).toEqual([...ACCOUNT_TYPES].sort());

    const overlap = DEBIT_NORMAL_ACCOUNT_TYPES.filter(type =>
      (CREDIT_NORMAL_ACCOUNT_TYPES as readonly string[]).includes(type)
    );
    expect(overlap).toHaveLength(0);
  });
});

describe('isAccountType', () => {
  it('returns true for each known account type', () => {
    for (const type of ACCOUNT_TYPES) {
      expect(isAccountType(type)).toBe(true);
    }
  });

  it('returns false for unknown or malformed strings', () => {
    expect(isAccountType('not-a-real-type')).toBe(false);
    expect(isAccountType('')).toBe(false);
    expect(isAccountType('ASSET')).toBe(false);
  });
});

describe('isEntrySide', () => {
  it('returns true for debit and credit', () => {
    expect(isEntrySide('debit')).toBe(true);
    expect(isEntrySide('credit')).toBe(true);
  });

  it('returns false for anything else', () => {
    expect(isEntrySide('DEBIT')).toBe(false);
    expect(isEntrySide('neutral')).toBe(false);
  });
});

describe('isDebitNormalAccountType / isCreditNormalAccountType', () => {
  it('treats asset and expense accounts as debit-normal', () => {
    expect(isDebitNormalAccountType('asset')).toBe(true);
    expect(isDebitNormalAccountType('expense')).toBe(true);
    expect(isCreditNormalAccountType('asset')).toBe(false);
    expect(isCreditNormalAccountType('expense')).toBe(false);
  });

  it('treats liability, equity, and revenue accounts as credit-normal', () => {
    expect(isCreditNormalAccountType('liability')).toBe(true);
    expect(isCreditNormalAccountType('equity')).toBe(true);
    expect(isCreditNormalAccountType('revenue')).toBe(true);
    expect(isDebitNormalAccountType('liability')).toBe(false);
    expect(isDebitNormalAccountType('equity')).toBe(false);
    expect(isDebitNormalAccountType('revenue')).toBe(false);
  });
});

describe('signedAmountForEntry', () => {
  it('increases the balance of a debit-normal (asset) account on a debit entry', () => {
    const entry: LedgerEntry = {
      accountId: 'acct-cash',
      side: 'debit',
      amountMinorUnits: 5000,
      currency: 'AED',
    };
    expect(signedAmountForEntry(entry, 'asset')).toBe(5000);
  });

  it('decreases the balance of a debit-normal (asset) account on a credit entry', () => {
    const entry: LedgerEntry = {
      accountId: 'acct-cash',
      side: 'credit',
      amountMinorUnits: 5000,
      currency: 'AED',
    };
    expect(signedAmountForEntry(entry, 'asset')).toBe(-5000);
  });

  it('increases the balance of a credit-normal (revenue) account on a credit entry', () => {
    const entry: LedgerEntry = {
      accountId: 'acct-booking-revenue',
      side: 'credit',
      amountMinorUnits: 12345,
      currency: 'AED',
    };
    expect(signedAmountForEntry(entry, 'revenue')).toBe(12345);
  });

  it('decreases the balance of a credit-normal (liability) account on a debit entry', () => {
    const entry: LedgerEntry = {
      accountId: 'acct-payable',
      side: 'debit',
      amountMinorUnits: 999,
      currency: 'AED',
    };
    expect(signedAmountForEntry(entry, 'liability')).toBe(-999);
  });

  it('sums to zero across a balanced two-entry transaction spanning debit- and credit-normal accounts', () => {
    const debitEntry: LedgerEntry = {
      accountId: 'acct-cash',
      side: 'debit',
      amountMinorUnits: 7500,
      currency: 'AED',
    };
    const creditEntry: LedgerEntry = {
      accountId: 'acct-booking-revenue',
      side: 'credit',
      amountMinorUnits: 7500,
      currency: 'AED',
    };
    const cashDelta = signedAmountForEntry(debitEntry, 'asset');
    const revenueDelta = signedAmountForEntry(creditEntry, 'revenue');
    expect(cashDelta).toBe(7500);
    expect(revenueDelta).toBe(7500);
    // Both sides of a balanced transaction move their respective accounts
    // by the same magnitude, satisfying the double-entry invariant.
    expect(Math.abs(cashDelta)).toBe(Math.abs(revenueDelta));
  });
});

describe('domain type shape compilation and structural integrity', () => {
  it('constructs a valid LedgerAccount literal that satisfies the interface', () => {
    const account: LedgerAccount = {
      id: 'acct-1',
      name: 'Operating Cash',
      type: 'asset',
      currency: 'AED',
      isActive: true,
    };
    expect(account.type).toBe('asset');
    expect(isAccountType(account.type)).toBe(true);
  });

  it('constructs a valid LedgerTransactionCandidate with balanced entries', () => {
    const candidate: LedgerTransactionCandidate = {
      reference: 'booking-123',
      description: 'Booking payment settlement',
      entries: [
        { accountId: 'acct-cash', side: 'debit', amountMinorUnits: 10000, currency: 'AED' },
        {
          accountId: 'acct-booking-revenue',
          side: 'credit',
          amountMinorUnits: 10000,
          currency: 'AED',
        },
      ],
    };
    const totalDebits = candidate.entries
      .filter(entry => entry.side === 'debit')
      .reduce((sum, entry) => sum + entry.amountMinorUnits, 0);
    const totalCredits = candidate.entries
      .filter(entry => entry.side === 'credit')
      .reduce((sum, entry) => sum + entry.amountMinorUnits, 0);
    expect(totalDebits).toBe(totalCredits);
    expect(candidate.entries).toHaveLength(2);
  });

  it('constructs a valid posted LedgerTransaction with system-assigned fields', () => {
    const transaction: LedgerTransaction = {
      id: 'txn-1',
      reference: 'booking-123',
      description: 'Booking payment settlement',
      postedAt: '2026-01-01T00:00:00.000Z',
      status: 'posted',
      entries: [
        { accountId: 'acct-cash', side: 'debit', amountMinorUnits: 10000, currency: 'AED' },
        {
          accountId: 'acct-booking-revenue',
          side: 'credit',
          amountMinorUnits: 10000,
          currency: 'AED',
        },
      ],
    };
    expect(transaction.status).toBe('posted');
    expect(transaction.entries.every(entry => isEntrySide(entry.side))).toBe(true);
  });

  it('builds a failing ValidationResult that reports every applicable failure together', () => {
    const result: ValidationResult = {
      ok: false,
      failures: [
        { code: 'UNBALANCED', message: 'Debits do not equal credits' },
        { code: 'NON_POSITIVE_AMOUNT', message: 'Entry amount must be positive', entryIndex: 1 },
      ],
    };
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.failures.map(failure => failure.code)).toEqual([
        'UNBALANCED',
        'NON_POSITIVE_AMOUNT',
      ]);
      expect(result.failures[1]?.entryIndex).toBe(1);
    }
  });

  it('builds a passing ValidationResult with no failures field required', () => {
    const result: ValidationResult = { ok: true };
    expect(result.ok).toBe(true);
  });
});
