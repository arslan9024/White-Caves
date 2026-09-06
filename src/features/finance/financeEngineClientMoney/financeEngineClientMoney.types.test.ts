import { describe, expect, it } from 'vitest';
import {
  ClientMoneyAccountStatus,
  ClientMoneyReconciliationStatus,
  ClientMoneyTransactionType,
  type ClientMoneyAccount,
  type ClientMoneyTransaction,
  calculateAccountBalance,
  canApplyTransactionWithoutOverdraft,
  isClientMoneyAccount,
  isClientMoneyTransaction,
  reconcileClientMoneyAccount,
  summarizeAccountLedger,
  transactionSignedAmount,
} from './financeEngineClientMoney.types';

function makeTransaction(overrides: Partial<ClientMoneyTransaction> = {}): ClientMoneyTransaction {
  return {
    id: 'txn-1',
    accountId: 'acct-1',
    type: ClientMoneyTransactionType.Deposit,
    amountMinorUnits: 10000,
    currency: 'AED',
    createdAt: '2024-01-01T00:00:00.000Z',
    reference: 'REF-1',
    ...overrides,
  };
}

function makeAccount(overrides: Partial<ClientMoneyAccount> = {}): ClientMoneyAccount {
  return {
    id: 'acct-1',
    ownerName: 'Jane Landlord',
    status: ClientMoneyAccountStatus.Active,
    currency: 'AED',
    openedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('transactionSignedAmount', () => {
  it('returns a positive amount for deposits', () => {
    const transaction = makeTransaction({
      type: ClientMoneyTransactionType.Deposit,
      amountMinorUnits: 5000,
    });
    expect(transactionSignedAmount(transaction)).toBe(5000);
  });

  it('returns a negative amount for withdrawals', () => {
    const transaction = makeTransaction({
      type: ClientMoneyTransactionType.Withdrawal,
      amountMinorUnits: 3000,
    });
    expect(transactionSignedAmount(transaction)).toBe(-3000);
  });

  it('returns a negative amount for transfers, refunds, and fees', () => {
    expect(
      transactionSignedAmount(
        makeTransaction({ type: ClientMoneyTransactionType.Transfer, amountMinorUnits: 100 })
      )
    ).toBe(-100);
    expect(
      transactionSignedAmount(
        makeTransaction({ type: ClientMoneyTransactionType.Refund, amountMinorUnits: 200 })
      )
    ).toBe(-200);
    expect(
      transactionSignedAmount(
        makeTransaction({ type: ClientMoneyTransactionType.Fee, amountMinorUnits: 50 })
      )
    ).toBe(-50);
  });

  it('throws for an unsupported transaction type', () => {
    const transaction = makeTransaction({
      type: 'UNKNOWN' as ClientMoneyTransactionType,
    });
    expect(() => transactionSignedAmount(transaction)).toThrow(
      /Unsupported client money transaction type/
    );
  });
});

describe('calculateAccountBalance', () => {
  it('sums deposits and subtracts withdrawals for the matching account only', () => {
    const transactions: ClientMoneyTransaction[] = [
      makeTransaction({
        id: 't1',
        accountId: 'acct-1',
        type: ClientMoneyTransactionType.Deposit,
        amountMinorUnits: 10000,
      }),
      makeTransaction({
        id: 't2',
        accountId: 'acct-1',
        type: ClientMoneyTransactionType.Withdrawal,
        amountMinorUnits: 4000,
      }),
      makeTransaction({
        id: 't3',
        accountId: 'acct-2',
        type: ClientMoneyTransactionType.Deposit,
        amountMinorUnits: 999999,
      }),
    ];

    expect(calculateAccountBalance('acct-1', transactions)).toBe(6000);
  });

  it('returns 0 for an account with no transactions', () => {
    expect(calculateAccountBalance('acct-empty', [])).toBe(0);
  });
});

describe('summarizeAccountLedger', () => {
  it('produces an accurate summary including the latest transaction timestamp', () => {
    const transactions: ClientMoneyTransaction[] = [
      makeTransaction({
        id: 't1',
        accountId: 'acct-1',
        amountMinorUnits: 10000,
        createdAt: '2024-01-01T00:00:00.000Z',
      }),
      makeTransaction({
        id: 't2',
        accountId: 'acct-1',
        type: ClientMoneyTransactionType.Fee,
        amountMinorUnits: 500,
        createdAt: '2024-02-01T00:00:00.000Z',
      }),
    ];

    const summary = summarizeAccountLedger('acct-1', transactions);

    expect(summary).toEqual({
      accountId: 'acct-1',
      balanceMinorUnits: 9500,
      transactionCount: 2,
      lastTransactionAt: '2024-02-01T00:00:00.000Z',
      reconciliationStatus: ClientMoneyReconciliationStatus.Pending,
    });
  });

  it('returns a null lastTransactionAt when there are no transactions', () => {
    const summary = summarizeAccountLedger('acct-empty', []);
    expect(summary.lastTransactionAt).toBeNull();
    expect(summary.transactionCount).toBe(0);
    expect(summary.balanceMinorUnits).toBe(0);
  });
});

describe('reconcileClientMoneyAccount', () => {
  it('reports Reconciled when ledger and bank statement balances match', () => {
    const result = reconcileClientMoneyAccount({
      accountId: 'acct-1',
      ledgerBalanceMinorUnits: 10000,
      bankStatementBalanceMinorUnits: 10000,
      asOf: '2024-03-01T00:00:00.000Z',
    });

    expect(result.status).toBe(ClientMoneyReconciliationStatus.Reconciled);
    expect(result.differenceMinorUnits).toBe(0);
  });

  it('reports Discrepant and the signed difference when balances mismatch', () => {
    const result = reconcileClientMoneyAccount({
      accountId: 'acct-1',
      ledgerBalanceMinorUnits: 10500,
      bankStatementBalanceMinorUnits: 10000,
      asOf: '2024-03-01T00:00:00.000Z',
    });

    expect(result.status).toBe(ClientMoneyReconciliationStatus.Discrepant);
    expect(result.differenceMinorUnits).toBe(500);
  });
});

describe('canApplyTransactionWithoutOverdraft', () => {
  it('allows a withdrawal that leaves a zero or positive balance', () => {
    const transaction = makeTransaction({
      type: ClientMoneyTransactionType.Withdrawal,
      amountMinorUnits: 10000,
    });
    expect(canApplyTransactionWithoutOverdraft(10000, transaction)).toBe(true);
  });

  it('rejects a withdrawal that would overdraw the account', () => {
    const transaction = makeTransaction({
      type: ClientMoneyTransactionType.Withdrawal,
      amountMinorUnits: 10001,
    });
    expect(canApplyTransactionWithoutOverdraft(10000, transaction)).toBe(false);
  });

  it('always allows deposits regardless of current balance', () => {
    const transaction = makeTransaction({
      type: ClientMoneyTransactionType.Deposit,
      amountMinorUnits: 500,
    });
    expect(canApplyTransactionWithoutOverdraft(-100, transaction)).toBe(true);
  });
});

describe('isClientMoneyTransaction', () => {
  it('accepts a well-formed transaction', () => {
    expect(isClientMoneyTransaction(makeTransaction())).toBe(true);
  });

  it('rejects null and non-object values', () => {
    expect(isClientMoneyTransaction(null)).toBe(false);
    expect(isClientMoneyTransaction(undefined)).toBe(false);
    expect(isClientMoneyTransaction('not-an-object')).toBe(false);
    expect(isClientMoneyTransaction(42)).toBe(false);
  });

  it('rejects an object with an invalid transaction type', () => {
    const invalid = { ...makeTransaction(), type: 'NOT_REAL' };
    expect(isClientMoneyTransaction(invalid)).toBe(false);
  });

  it('rejects an object with an unsupported currency', () => {
    const invalid = { ...makeTransaction(), currency: 'JPY' };
    expect(isClientMoneyTransaction(invalid)).toBe(false);
  });

  it('rejects an object missing required string fields', () => {
    const invalid = { ...makeTransaction(), id: '' };
    expect(isClientMoneyTransaction(invalid)).toBe(false);
  });

  it('rejects an object with a non-finite amount', () => {
    const invalid = { ...makeTransaction(), amountMinorUnits: Number.NaN };
    expect(isClientMoneyTransaction(invalid)).toBe(false);
  });
});

describe('isClientMoneyAccount', () => {
  it('accepts a well-formed account', () => {
    expect(isClientMoneyAccount(makeAccount())).toBe(true);
  });

  it('rejects null and non-object values', () => {
    expect(isClientMoneyAccount(null)).toBe(false);
    expect(isClientMoneyAccount(123)).toBe(false);
  });

  it('rejects an account with an invalid status', () => {
    const invalid = { ...makeAccount(), status: 'DELETED' };
    expect(isClientMoneyAccount(invalid)).toBe(false);
  });

  it('rejects an account with an unsupported currency', () => {
    const invalid = { ...makeAccount(), currency: 'JPY' };
    expect(isClientMoneyAccount(invalid)).toBe(false);
  });

  it('rejects an account missing the owner name', () => {
    const invalid = { ...makeAccount(), ownerName: '   ' };
    expect(isClientMoneyAccount(invalid)).toBe(false);
  });
});
