import { describe, expect, it } from 'vitest';
import {
  applyDeposit,
  applyWithdrawal,
  ClientMoneyAccount,
  ClientMoneyInvariantError,
  ClientMoneyTransaction,
  reconcileAccount,
} from './financeEngineClientMoney.logic';

function makeAccount(overrides: Partial<ClientMoneyAccount> = {}): ClientMoneyAccount {
  return {
    accountId: overrides.accountId ?? 'acct-001',
    ownerType: overrides.ownerType ?? 'tenant',
    ownerId: overrides.ownerId ?? 'tenant-42',
    currency: overrides.currency ?? 'AED',
    balanceMinorUnits: overrides.balanceMinorUnits ?? 0,
    createdAt: overrides.createdAt ?? '2026-01-01T00:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2026-01-01T00:00:00.000Z',
  };
}

describe('applyDeposit', () => {
  it('increases the account balance and records a matching transaction', () => {
    const account = makeAccount({ balanceMinorUnits: 1000 });
    const result = applyDeposit(account, 500, 'inv-1', '2026-01-02T00:00:00.000Z');

    expect(result.account.balanceMinorUnits).toBe(1500);
    expect(result.account.updatedAt).toBe('2026-01-02T00:00:00.000Z');
    expect(result.transaction.type).toBe('deposit');
    expect(result.transaction.amountMinorUnits).toBe(500);
    expect(result.transaction.postedBalanceMinorUnits).toBe(1500);
    expect(result.transaction.accountId).toBe(account.accountId);
    expect(result.transaction.reference).toBe('inv-1');
    expect(typeof result.transaction.transactionId).toBe('string');
    expect(result.transaction.transactionId.length).toBeGreaterThan(0);
  });

  it('does not mutate the original account object', () => {
    const account = makeAccount({ balanceMinorUnits: 1000 });
    applyDeposit(account, 500, 'inv-1', '2026-01-02T00:00:00.000Z');
    expect(account.balanceMinorUnits).toBe(1000);
  });

  it('throws ClientMoneyInvariantError for a non-positive amount', () => {
    const account = makeAccount({ balanceMinorUnits: 1000 });
    expect(() => applyDeposit(account, 0, 'inv-1', '2026-01-02T00:00:00.000Z')).toThrow(
      ClientMoneyInvariantError
    );
    expect(() => applyDeposit(account, -100, 'inv-1', '2026-01-02T00:00:00.000Z')).toThrow(
      ClientMoneyInvariantError
    );
  });

  it('throws ClientMoneyInvariantError for a non-integer amount', () => {
    const account = makeAccount({ balanceMinorUnits: 1000 });
    expect(() => applyDeposit(account, 12.5, 'inv-1', '2026-01-02T00:00:00.000Z')).toThrow(
      ClientMoneyInvariantError
    );
  });

  it('throws ClientMoneyInvariantError for an invalid occurredAt timestamp', () => {
    const account = makeAccount({ balanceMinorUnits: 1000 });
    expect(() => applyDeposit(account, 100, 'inv-1', 'not-a-date')).toThrow(
      ClientMoneyInvariantError
    );
  });
});

describe('applyWithdrawal', () => {
  it('decreases the account balance when funds are sufficient', () => {
    const account = makeAccount({ balanceMinorUnits: 1000 });
    const result = applyWithdrawal(account, 400, 'payout-1', '2026-01-03T00:00:00.000Z');

    expect(result.account.balanceMinorUnits).toBe(600);
    expect(result.transaction.type).toBe('withdrawal');
    expect(result.transaction.postedBalanceMinorUnits).toBe(600);
  });

  it('allows a withdrawal that exactly zeroes the balance', () => {
    const account = makeAccount({ balanceMinorUnits: 250 });
    const result = applyWithdrawal(account, 250, 'payout-1', '2026-01-03T00:00:00.000Z');
    expect(result.account.balanceMinorUnits).toBe(0);
  });

  it('rejects an overdraft withdrawal without mutating the account', () => {
    const account = makeAccount({ balanceMinorUnits: 100 });
    expect(() => applyWithdrawal(account, 200, 'payout-1', '2026-01-03T00:00:00.000Z')).toThrow(
      ClientMoneyInvariantError
    );
    expect(account.balanceMinorUnits).toBe(100);
  });

  it('throws ClientMoneyInvariantError for a non-positive amount', () => {
    const account = makeAccount({ balanceMinorUnits: 1000 });
    expect(() => applyWithdrawal(account, 0, 'payout-1', '2026-01-03T00:00:00.000Z')).toThrow(
      ClientMoneyInvariantError
    );
  });
});

describe('reconcileAccount', () => {
  it('returns true when replaying transactions matches the stated balance', () => {
    const account = makeAccount({ balanceMinorUnits: 700 });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't1',
        accountId: account.accountId,
        type: 'deposit',
        amountMinorUnits: 1000,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 1000,
      },
      {
        transactionId: 't2',
        accountId: account.accountId,
        type: 'withdrawal',
        amountMinorUnits: 300,
        reference: 'ref-2',
        occurredAt: '2026-01-02T00:00:00.000Z',
        postedBalanceMinorUnits: 700,
      },
    ];
    expect(reconcileAccount(account, transactions)).toBe(true);
  });

  it('returns false when the replayed balance does not match the stated balance', () => {
    const account = makeAccount({ balanceMinorUnits: 999 });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't1',
        accountId: account.accountId,
        type: 'deposit',
        amountMinorUnits: 1000,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 1000,
      },
    ];
    expect(reconcileAccount(account, transactions)).toBe(false);
  });

  it('replays out-of-order transactions in occurredAt ascending order', () => {
    const account = makeAccount({ balanceMinorUnits: 700 });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't2',
        accountId: account.accountId,
        type: 'withdrawal',
        amountMinorUnits: 300,
        reference: 'ref-2',
        occurredAt: '2026-01-02T00:00:00.000Z',
        postedBalanceMinorUnits: 700,
      },
      {
        transactionId: 't1',
        accountId: account.accountId,
        type: 'deposit',
        amountMinorUnits: 1000,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 1000,
      },
    ];
    expect(reconcileAccount(account, transactions)).toBe(true);
  });

  it('applies transfer_in and transfer_out with the same sign as deposit/withdrawal', () => {
    const account = makeAccount({ balanceMinorUnits: 1200 });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't1',
        accountId: account.accountId,
        type: 'transfer_in',
        amountMinorUnits: 1500,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 1500,
      },
      {
        transactionId: 't2',
        accountId: account.accountId,
        type: 'transfer_out',
        amountMinorUnits: 300,
        reference: 'ref-2',
        occurredAt: '2026-01-02T00:00:00.000Z',
        postedBalanceMinorUnits: 1200,
      },
    ];
    expect(reconcileAccount(account, transactions)).toBe(true);
  });

  it('applies an adjustment using its recorded postedBalanceMinorUnits as the new balance', () => {
    const account = makeAccount({ balanceMinorUnits: 850 });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't1',
        accountId: account.accountId,
        type: 'deposit',
        amountMinorUnits: 1000,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 1000,
      },
      {
        transactionId: 't2',
        accountId: account.accountId,
        type: 'adjustment',
        amountMinorUnits: 0,
        reference: 'correction',
        occurredAt: '2026-01-02T00:00:00.000Z',
        postedBalanceMinorUnits: 850,
      },
    ];
    expect(reconcileAccount(account, transactions)).toBe(true);
  });

  it('returns false (never throws) for a non-integer transaction amount', () => {
    const account = makeAccount({ balanceMinorUnits: 100 });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't1',
        accountId: account.accountId,
        type: 'deposit',
        amountMinorUnits: 100.5,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 100.5,
      },
    ];
    expect(() => reconcileAccount(account, transactions)).not.toThrow();
    expect(reconcileAccount(account, transactions)).toBe(false);
  });

  it('returns false for a non-positive amount on a non-adjustment transaction', () => {
    const account = makeAccount({ balanceMinorUnits: 0 });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't1',
        accountId: account.accountId,
        type: 'deposit',
        amountMinorUnits: 0,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 0,
      },
    ];
    expect(reconcileAccount(account, transactions)).toBe(false);
  });

  it('returns false when a transaction references a different accountId', () => {
    const account = makeAccount({ balanceMinorUnits: 1000, accountId: 'acct-001' });
    const transactions: ClientMoneyTransaction[] = [
      {
        transactionId: 't1',
        accountId: 'acct-999',
        type: 'deposit',
        amountMinorUnits: 1000,
        reference: 'ref-1',
        occurredAt: '2026-01-01T00:00:00.000Z',
        postedBalanceMinorUnits: 1000,
      },
    ];
    expect(reconcileAccount(account, transactions)).toBe(false);
  });

  it('returns true for an empty transaction list against a zero balance', () => {
    const account = makeAccount({ balanceMinorUnits: 0 });
    expect(reconcileAccount(account, [])).toBe(true);
  });
});
