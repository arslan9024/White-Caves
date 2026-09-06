import { describe, expect, it } from 'vitest';
import {
  getAccountBalance,
  LedgerPostingError,
  postTransaction,
  reverseTransaction,
  validateTransaction,
  type LedgerAccount,
  type LedgerState,
  type LedgerTransaction,
  type LedgerTransactionCandidate,
} from './financeEngineDoubleEntry.logic';

const cashAccount: LedgerAccount = {
  id: 'acct-cash',
  name: 'Cash',
  type: 'asset',
  currency: 'AED',
  isActive: true,
};

const revenueAccount: LedgerAccount = {
  id: 'acct-revenue',
  name: 'Booking Revenue',
  type: 'revenue',
  currency: 'AED',
  isActive: true,
};

const payableAccount: LedgerAccount = {
  id: 'acct-payable',
  name: 'Payouts Payable',
  type: 'liability',
  currency: 'AED',
  isActive: true,
};

const inactiveAccount: LedgerAccount = {
  id: 'acct-inactive',
  name: 'Retired Account',
  type: 'expense',
  currency: 'AED',
  isActive: false,
};

const accounts: readonly LedgerAccount[] = [
  cashAccount,
  revenueAccount,
  payableAccount,
  inactiveAccount,
];

function balancedCandidate(
  overrides: Partial<LedgerTransactionCandidate> = {}
): LedgerTransactionCandidate {
  return {
    reference: 'booking-123',
    entries: [
      { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 10000, currency: 'AED' },
      { accountId: revenueAccount.id, side: 'credit', amountMinorUnits: 10000, currency: 'AED' },
    ],
    ...overrides,
  };
}

const emptyLedgerState: LedgerState = { postedTransactions: [] };

describe('validateTransaction', () => {
  it('accepts a balanced two-entry transaction (FR-3)', () => {
    const result = validateTransaction(balancedCandidate(), accounts);
    expect(result.ok).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  it('rejects a transaction with fewer than two entries (FR-1)', () => {
    const candidate = balancedCandidate({
      entries: [
        { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 10000, currency: 'AED' },
      ],
    });
    const result = validateTransaction(candidate, accounts);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.failures.map(f => f.code)).toContain(
      'INSUFFICIENT_ENTRIES'
    );
  });

  it('rejects a transaction missing a debit or credit side (FR-2)', () => {
    const candidate = balancedCandidate({
      entries: [
        { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 5000, currency: 'AED' },
        { accountId: revenueAccount.id, side: 'debit', amountMinorUnits: 5000, currency: 'AED' },
      ],
    });
    const result = validateTransaction(candidate, accounts);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.failures.map(f => f.code)).toContain(
      'MISSING_DEBIT_OR_CREDIT'
    );
  });

  it('rejects an unbalanced transaction (FR-3)', () => {
    const candidate = balancedCandidate({
      entries: [
        { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 10000, currency: 'AED' },
        { accountId: revenueAccount.id, side: 'credit', amountMinorUnits: 9000, currency: 'AED' },
      ],
    });
    const result = validateTransaction(candidate, accounts);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.failures.map(f => f.code)).toContain('UNBALANCED');
  });

  it('rejects a transaction referencing more than one currency (FR-4)', () => {
    const candidate = balancedCandidate({
      entries: [
        { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 10000, currency: 'AED' },
        { accountId: revenueAccount.id, side: 'credit', amountMinorUnits: 10000, currency: 'USD' },
      ],
    });
    const result = validateTransaction(candidate, accounts);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.failures.map(f => f.code)).toContain('MIXED_CURRENCY');
  });

  it('rejects non-integer and non-positive amounts (FR-5)', () => {
    const candidate = balancedCandidate({
      entries: [
        { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 10.5, currency: 'AED' },
        { accountId: revenueAccount.id, side: 'credit', amountMinorUnits: -5, currency: 'AED' },
      ],
    });
    const result = validateTransaction(candidate, accounts);
    expect(result.ok).toBe(false);
    const codes = result.ok === false ? result.failures.map(f => f.code) : [];
    expect(codes).toContain('NON_INTEGER_AMOUNT');
    expect(codes).toContain('NON_POSITIVE_AMOUNT');
  });

  it('rejects unknown and inactive accounts (FR-6)', () => {
    const candidate = balancedCandidate({
      entries: [
        { accountId: 'acct-unknown', side: 'debit', amountMinorUnits: 5000, currency: 'AED' },
        { accountId: inactiveAccount.id, side: 'credit', amountMinorUnits: 5000, currency: 'AED' },
      ],
    });
    const result = validateTransaction(candidate, accounts);
    expect(result.ok).toBe(false);
    const codes = result.ok === false ? result.failures.map(f => f.code) : [];
    expect(codes).toContain('UNKNOWN_ACCOUNT');
    expect(codes).toContain('INACTIVE_ACCOUNT');
  });

  it('reports all applicable failures at once, not just the first (FR-7)', () => {
    const candidate: LedgerTransactionCandidate = {
      reference: 'multi-fail',
      entries: [
        { accountId: 'acct-unknown', side: 'debit', amountMinorUnits: 10.5, currency: 'AED' },
        { accountId: 'acct-unknown2', side: 'debit', amountMinorUnits: -5, currency: 'USD' },
      ],
    };
    const result = validateTransaction(candidate, accounts);
    expect(result.ok).toBe(false);
    const codes = result.ok === false ? result.failures.map(f => f.code) : [];
    expect(codes).toContain('MISSING_DEBIT_OR_CREDIT');
    expect(codes).toContain('MIXED_CURRENCY');
    expect(codes).toContain('NON_INTEGER_AMOUNT');
    expect(codes).toContain('NON_POSITIVE_AMOUNT');
    expect(codes).toContain('UNKNOWN_ACCOUNT');
    expect(codes.length).toBeGreaterThan(1);
  });
});

describe('postTransaction', () => {
  it('posts a valid transaction and returns a stable id/postedAt (FR-8)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    expect(posted.reference).toBe('booking-123');
    expect(typeof posted.id).toBe('string');
    expect(posted.id.length).toBeGreaterThan(0);
    expect(() => new Date(posted.postedAt).toISOString()).not.toThrow();
  });

  it('throws LedgerPostingError and does not post an invalid transaction (FR-8)', () => {
    const invalidCandidate = balancedCandidate({
      entries: [
        { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 10000, currency: 'AED' },
        { accountId: revenueAccount.id, side: 'credit', amountMinorUnits: 9000, currency: 'AED' },
      ],
    });
    expect(() => postTransaction(invalidCandidate, accounts, emptyLedgerState)).toThrow(
      LedgerPostingError
    );
  });

  it('is idempotent: reposting the same reference returns the existing transaction (FR-9)', () => {
    const first = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    const stateWithFirst: LedgerState = { postedTransactions: [first] };
    const second = postTransaction(
      balancedCandidate({
        entries: [
          { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 99999, currency: 'AED' },
          {
            accountId: revenueAccount.id,
            side: 'credit',
            amountMinorUnits: 99999,
            currency: 'AED',
          },
        ],
      }),
      accounts,
      stateWithFirst
    );
    expect(second).toBe(first);
    expect(second.entries[0].amountMinorUnits).toBe(10000);
  });

  it('does not allow mutation of a posted transaction (FR-12)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    expect(Object.isFrozen(posted)).toBe(true);
    expect(Object.isFrozen(posted.entries)).toBe(true);

    // Attempted mutation must be a no-op regardless of strict-mode throw behavior.
    try {
      (posted as { reference: string }).reference = 'tampered';
    } catch {
      // Ignored: strict mode throws on frozen-object writes; sloppy mode silently no-ops.
    }
    expect(posted.reference).toBe('booking-123');
  });
});

describe('getAccountBalance', () => {
  it('derives debit-normal balances for asset accounts (FR-10)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    const balance = getAccountBalance(cashAccount.id, [posted], accounts);
    expect(balance).toBe(10000);
  });

  it('derives credit-normal balances for revenue accounts (FR-10)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    const balance = getAccountBalance(revenueAccount.id, [posted], accounts);
    expect(balance).toBe(10000);
  });

  it('derives credit-normal balances for liability accounts across multiple transactions (FR-10)', () => {
    const txn1 = postTransaction(
      {
        reference: 'payout-1',
        entries: [
          { accountId: cashAccount.id, side: 'credit', amountMinorUnits: 4000, currency: 'AED' },
          { accountId: payableAccount.id, side: 'debit', amountMinorUnits: 4000, currency: 'AED' },
        ],
      },
      accounts,
      emptyLedgerState
    );
    const txn2 = postTransaction(
      {
        reference: 'payout-2',
        entries: [
          { accountId: cashAccount.id, side: 'debit', amountMinorUnits: 1500, currency: 'AED' },
          { accountId: payableAccount.id, side: 'credit', amountMinorUnits: 1500, currency: 'AED' },
        ],
      },
      accounts,
      { postedTransactions: [txn1] }
    );
    const balance = getAccountBalance(payableAccount.id, [txn1, txn2], accounts);
    // debit 4000 decreases liability, credit 1500 increases liability => -4000 + 1500 = -2500
    expect(balance).toBe(-2500);
  });

  it('returns 0 for an account with no posted activity (FR-10)', () => {
    const balance = getAccountBalance(payableAccount.id, [], accounts);
    expect(balance).toBe(0);
  });

  it('throws for an unknown account id', () => {
    expect(() => getAccountBalance('acct-does-not-exist', [], accounts)).toThrow(TypeError);
  });
});

describe('reverseTransaction', () => {
  it('flips each entry side while preserving amounts and currency (FR-11)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    const reversalCandidate = reverseTransaction(posted);

    expect(reversalCandidate.entries).toHaveLength(posted.entries.length);
    reversalCandidate.entries.forEach((reversedEntry, index) => {
      const originalEntry = posted.entries[index];
      expect(reversedEntry.accountId).toBe(originalEntry.accountId);
      expect(reversedEntry.amountMinorUnits).toBe(originalEntry.amountMinorUnits);
      expect(reversedEntry.currency).toBe(originalEntry.currency);
      expect(reversedEntry.side).toBe(originalEntry.side === 'debit' ? 'credit' : 'debit');
    });
  });

  it('records a back-reference to the original transaction in metadata (FR-13)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    const reversalCandidate = reverseTransaction(posted);
    expect(reversalCandidate.metadata?.reversalOf).toBe(posted.id);
  });

  it('produces a reversal that, once posted, nets the original balance to zero (FR-11)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    const state: LedgerState = { postedTransactions: [posted] };
    const reversalCandidate = reverseTransaction(posted);
    const reversalPosted = postTransaction(reversalCandidate, accounts, state);

    const balance = getAccountBalance(cashAccount.id, [posted, reversalPosted], accounts);
    expect(balance).toBe(0);
  });

  it('does not mutate the original transaction when building a reversal (FR-12)', () => {
    const posted = postTransaction(balancedCandidate(), accounts, emptyLedgerState);
    const originalEntriesSnapshot: readonly LedgerTransaction['entries'][number][] =
      posted.entries.map(e => ({ ...e }));
    reverseTransaction(posted);
    expect(posted.entries).toEqual(originalEntriesSnapshot);
  });
});
