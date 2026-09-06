import { describe, expect, it } from 'vitest';
import {
  type ClientMoneyTransaction,
  signedAmount,
  validateClientMoneyTransaction,
  computeClientMoneyLedger,
  getTotalClientMoneyBalance,
  getClientBalance,
  summarizeClientBalances,
  reconcileClientMoneyAccount,
} from './financeEngineClientMoney.logic';

function tx(
  overrides: Partial<ClientMoneyTransaction> &
    Pick<ClientMoneyTransaction, 'id' | 'clientId' | 'type' | 'amount' | 'occurredAt'>
): ClientMoneyTransaction {
  return { ...overrides };
}

describe('signedAmount', () => {
  it('returns a positive amount for deposit transactions', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'deposit',
      amount: 100,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    expect(signedAmount(t)).toBe(100);
  });

  it('returns a positive amount for transfer_in transactions', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'transfer_in',
      amount: 50,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    expect(signedAmount(t)).toBe(50);
  });

  it('returns a negative amount for withdrawal transactions', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'withdrawal',
      amount: 40,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    expect(signedAmount(t)).toBe(-40);
  });

  it('returns a negative amount for transfer_out and fee transactions', () => {
    const transferOut = tx({
      id: '1',
      clientId: 'c1',
      type: 'transfer_out',
      amount: 20,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    const fee = tx({
      id: '2',
      clientId: 'c1',
      type: 'fee',
      amount: 5,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    expect(signedAmount(transferOut)).toBe(-20);
    expect(signedAmount(fee)).toBe(-5);
  });
});

describe('validateClientMoneyTransaction', () => {
  it('accepts a deposit against a zero balance', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'deposit',
      amount: 100,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    const result = validateClientMoneyTransaction(t, 0);
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('rejects a withdrawal that would drive the balance negative', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'withdrawal',
      amount: 150,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    const result = validateClientMoneyTransaction(t, 100);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/negative client money balance/);
  });

  it('rejects a transaction with a negative amount', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'deposit',
      amount: -10,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    const result = validateClientMoneyTransaction(t, 100);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/non-negative finite number/);
  });

  it('rejects a transaction with a non-finite amount', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'deposit',
      amount: Number.POSITIVE_INFINITY,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    const result = validateClientMoneyTransaction(t, 100);
    expect(result.valid).toBe(false);
  });

  it('allows a withdrawal that exactly zeroes the balance', () => {
    const t = tx({
      id: '1',
      clientId: 'c1',
      type: 'withdrawal',
      amount: 100,
      occurredAt: '2024-01-01T00:00:00Z',
    });
    const result = validateClientMoneyTransaction(t, 100);
    expect(result.valid).toBe(true);
  });
});

describe('computeClientMoneyLedger', () => {
  it('computes a running balance in chronological order regardless of input order', () => {
    const transactions: ClientMoneyTransaction[] = [
      tx({
        id: '2',
        clientId: 'c1',
        type: 'withdrawal',
        amount: 30,
        occurredAt: '2024-01-02T00:00:00Z',
      }),
      tx({
        id: '1',
        clientId: 'c1',
        type: 'deposit',
        amount: 100,
        occurredAt: '2024-01-01T00:00:00Z',
      }),
      tx({ id: '3', clientId: 'c1', type: 'fee', amount: 5, occurredAt: '2024-01-03T00:00:00Z' }),
    ];

    const ledger = computeClientMoneyLedger(transactions);

    expect(ledger.map(entry => entry.transaction.id)).toEqual(['1', '2', '3']);
    expect(ledger.map(entry => entry.balanceAfter)).toEqual([100, 70, 65]);
  });

  it('throws when a transaction would overdraw the client money balance', () => {
    const transactions: ClientMoneyTransaction[] = [
      tx({
        id: '1',
        clientId: 'c1',
        type: 'withdrawal',
        amount: 50,
        occurredAt: '2024-01-01T00:00:00Z',
      }),
    ];

    expect(() => computeClientMoneyLedger(transactions)).toThrow(
      /Invalid client money transaction/
    );
  });

  it('does not mutate the input transactions array', () => {
    const transactions: ClientMoneyTransaction[] = [
      tx({
        id: '2',
        clientId: 'c1',
        type: 'withdrawal',
        amount: 30,
        occurredAt: '2024-01-02T00:00:00Z',
      }),
      tx({
        id: '1',
        clientId: 'c1',
        type: 'deposit',
        amount: 100,
        occurredAt: '2024-01-01T00:00:00Z',
      }),
    ];
    const original = [...transactions];

    computeClientMoneyLedger(transactions);

    expect(transactions).toEqual(original);
  });
});

describe('getTotalClientMoneyBalance and getClientBalance', () => {
  const transactions: ClientMoneyTransaction[] = [
    tx({
      id: '1',
      clientId: 'c1',
      type: 'deposit',
      amount: 200,
      occurredAt: '2024-01-01T00:00:00Z',
    }),
    tx({
      id: '2',
      clientId: 'c1',
      type: 'withdrawal',
      amount: 50,
      occurredAt: '2024-01-02T00:00:00Z',
    }),
    tx({
      id: '3',
      clientId: 'c2',
      type: 'deposit',
      amount: 300,
      occurredAt: '2024-01-01T00:00:00Z',
    }),
  ];

  it('sums signed amounts across all clients for the total balance', () => {
    expect(getTotalClientMoneyBalance(transactions)).toBe(450);
  });

  it('filters by clientId for a single client balance', () => {
    expect(getClientBalance(transactions, 'c1')).toBe(150);
    expect(getClientBalance(transactions, 'c2')).toBe(300);
  });

  it('returns zero for a client with no transactions', () => {
    expect(getClientBalance(transactions, 'unknown-client')).toBe(0);
  });
});

describe('summarizeClientBalances', () => {
  it('groups and sorts balances by clientId', () => {
    const transactions: ClientMoneyTransaction[] = [
      tx({
        id: '1',
        clientId: 'c2',
        type: 'deposit',
        amount: 300,
        occurredAt: '2024-01-01T00:00:00Z',
      }),
      tx({
        id: '2',
        clientId: 'c1',
        type: 'deposit',
        amount: 200,
        occurredAt: '2024-01-01T00:00:00Z',
      }),
      tx({
        id: '3',
        clientId: 'c1',
        type: 'withdrawal',
        amount: 50,
        occurredAt: '2024-01-02T00:00:00Z',
      }),
    ];

    const summary = summarizeClientBalances(transactions);

    expect(summary).toEqual([
      { clientId: 'c1', balance: 150, transactionCount: 2 },
      { clientId: 'c2', balance: 300, transactionCount: 1 },
    ]);
  });

  it('returns an empty array for no transactions', () => {
    expect(summarizeClientBalances([])).toEqual([]);
  });
});

describe('reconcileClientMoneyAccount', () => {
  const transactions: ClientMoneyTransaction[] = [
    tx({
      id: '1',
      clientId: 'c1',
      type: 'deposit',
      amount: 500,
      occurredAt: '2024-01-01T00:00:00Z',
    }),
    tx({
      id: '2',
      clientId: 'c1',
      type: 'withdrawal',
      amount: 100,
      occurredAt: '2024-01-02T00:00:00Z',
    }),
  ];

  it('reports reconciled when bank balance matches ledger balance', () => {
    const result = reconcileClientMoneyAccount(transactions, 400);
    expect(result.ledgerBalance).toBe(400);
    expect(result.bankBalance).toBe(400);
    expect(result.variance).toBe(0);
    expect(result.isReconciled).toBe(true);
    expect(result.hasShortfall).toBe(false);
  });

  it('detects a shortfall when the ledger balance exceeds the bank balance', () => {
    const result = reconcileClientMoneyAccount(transactions, 350);
    expect(result.variance).toBe(50);
    expect(result.isReconciled).toBe(false);
    expect(result.hasShortfall).toBe(true);
  });

  it('detects a surplus (negative variance) without flagging it as a shortfall', () => {
    const result = reconcileClientMoneyAccount(transactions, 450);
    expect(result.variance).toBe(-50);
    expect(result.isReconciled).toBe(false);
    expect(result.hasShortfall).toBe(false);
  });

  it('treats variances within tolerance as reconciled', () => {
    const result = reconcileClientMoneyAccount(transactions, 400.005);
    expect(result.isReconciled).toBe(true);
  });
});
