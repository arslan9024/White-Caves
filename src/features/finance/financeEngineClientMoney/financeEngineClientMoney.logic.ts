/**
 * Finance Engine - Client Money Logic
 *
 * Child scope of parent issue #1940 (issue #2417).
 *
 * Provides pure, side-effect-free domain logic for tracking, validating and
 * reconciling "client money" (funds held on behalf of clients, e.g. rental
 * deposits, escrow, or trust balances) so that:
 *   - client funds are never allowed to go negative (no commingling / no
 *     spending money the firm does not hold on behalf of a client),
 *   - a running ledger balance can be derived deterministically from a list
 *     of transactions,
 *   - the internally computed ledger balance can be reconciled against an
 *     external bank statement balance to detect shortfalls or surpluses.
 *
 * This module intentionally has no I/O, no framework dependencies and no
 * mutation of its inputs so it can be unit tested in isolation and reused by
 * both server and client bundles.
 */

/** The kinds of movements that can affect a client money ledger. */
export type ClientMoneyTransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out'
  | 'fee';

/** A single immutable client money transaction record. */
export interface ClientMoneyTransaction {
  readonly id: string;
  readonly clientId: string;
  readonly type: ClientMoneyTransactionType;
  /** Amount in the currency's decimal unit, always >= 0. */
  readonly amount: number;
  /** ISO-8601 timestamp string. */
  readonly occurredAt: string;
  readonly description?: string;
}

/** A ledger entry augmented with the running balance after it was applied. */
export interface ClientMoneyLedgerEntry {
  readonly transaction: ClientMoneyTransaction;
  readonly balanceAfter: number;
}

/** Result of validating a single transaction against a current balance. */
export interface ClientMoneyValidationResult {
  readonly valid: boolean;
  readonly reason?: string;
}

/** Result of reconciling the computed ledger balance against a bank balance. */
export interface ClientMoneyReconciliationResult {
  readonly ledgerBalance: number;
  readonly bankBalance: number;
  /** ledgerBalance - bankBalance, positive means the ledger overstates funds. */
  readonly variance: number;
  readonly isReconciled: boolean;
  readonly hasShortfall: boolean;
}

/** Aggregate balance summary for one client. */
export interface ClientBalanceSummary {
  readonly clientId: string;
  readonly balance: number;
  readonly transactionCount: number;
}

const CREDIT_TYPES: ReadonlySet<ClientMoneyTransactionType> = new Set(['deposit', 'transfer_in']);

const DEBIT_TYPES: ReadonlySet<ClientMoneyTransactionType> = new Set([
  'withdrawal',
  'transfer_out',
  'fee',
]);

/** The maximum absolute variance (in currency units) still considered reconciled. */
const RECONCILIATION_TOLERANCE = 0.01;

/**
 * Returns the signed effect of a transaction's amount on a client money
 * balance: positive for credits, negative for debits.
 */
export function signedAmount(transaction: ClientMoneyTransaction): number {
  if (CREDIT_TYPES.has(transaction.type)) {
    return transaction.amount;
  }
  if (DEBIT_TYPES.has(transaction.type)) {
    return -transaction.amount;
  }
  // Exhaustiveness guard: every ClientMoneyTransactionType must be classified.
  throw new Error(`Unclassified client money transaction type: ${transaction.type as string}`);
}

/**
 * Validates that a transaction's `amount` is a finite, non-negative number
 * and that applying it to `currentBalance` would not drive the client money
 * balance below zero.
 */
export function validateClientMoneyTransaction(
  transaction: ClientMoneyTransaction,
  currentBalance: number
): ClientMoneyValidationResult {
  if (!Number.isFinite(transaction.amount) || transaction.amount < 0) {
    return { valid: false, reason: 'Transaction amount must be a non-negative finite number.' };
  }

  const projectedBalance = currentBalance + signedAmount(transaction);

  if (projectedBalance < -RECONCILIATION_TOLERANCE) {
    return {
      valid: false,
      reason: `Transaction would result in a negative client money balance (${projectedBalance.toFixed(2)}).`,
    };
  }

  return { valid: true };
}

/**
 * Sorts transactions chronologically (stable for equal timestamps, preserving
 * original relative order) without mutating the input array.
 */
function sortChronologically(
  transactions: readonly ClientMoneyTransaction[]
): ClientMoneyTransaction[] {
  return transactions
    .map((transaction, index) => ({ transaction, index }))
    .sort((a, b) => {
      const timeDiff = Date.parse(a.transaction.occurredAt) - Date.parse(b.transaction.occurredAt);
      return timeDiff !== 0 ? timeDiff : a.index - b.index;
    })
    .map(entry => entry.transaction);
}

/**
 * Computes a running client money balance ledger from a list of
 * transactions, applied in chronological order. Throws if any transaction
 * would violate {@link validateClientMoneyTransaction}.
 */
export function computeClientMoneyLedger(
  transactions: readonly ClientMoneyTransaction[]
): ClientMoneyLedgerEntry[] {
  const ordered = sortChronologically(transactions);
  const ledger: ClientMoneyLedgerEntry[] = [];
  let balance = 0;

  for (const transaction of ordered) {
    const validation = validateClientMoneyTransaction(transaction, balance);
    if (!validation.valid) {
      throw new Error(
        `Invalid client money transaction "${transaction.id}": ${validation.reason ?? 'unknown reason'}`
      );
    }
    balance += signedAmount(transaction);
    ledger.push({ transaction, balanceAfter: balance });
  }

  return ledger;
}

/**
 * Returns the current total client money balance across all transactions,
 * regardless of client. Does not throw on invalid intermediate states;
 * callers who need strict validation should use
 * {@link computeClientMoneyLedger}.
 */
export function getTotalClientMoneyBalance(
  transactions: readonly ClientMoneyTransaction[]
): number {
  return transactions.reduce((balance, transaction) => balance + signedAmount(transaction), 0);
}

/**
 * Returns the current client money balance for a single client.
 */
export function getClientBalance(
  transactions: readonly ClientMoneyTransaction[],
  clientId: string
): number {
  return getTotalClientMoneyBalance(transactions.filter(t => t.clientId === clientId));
}

/**
 * Groups transactions by client and returns a balance summary per client,
 * sorted by clientId ascending for deterministic output.
 */
export function summarizeClientBalances(
  transactions: readonly ClientMoneyTransaction[]
): ClientBalanceSummary[] {
  const byClient = new Map<string, ClientMoneyTransaction[]>();

  for (const transaction of transactions) {
    const existing = byClient.get(transaction.clientId);
    if (existing) {
      existing.push(transaction);
    } else {
      byClient.set(transaction.clientId, [transaction]);
    }
  }

  return Array.from(byClient.entries())
    .map(([clientId, clientTransactions]) => ({
      clientId,
      balance: getTotalClientMoneyBalance(clientTransactions),
      transactionCount: clientTransactions.length,
    }))
    .sort((a, b) => a.clientId.localeCompare(b.clientId));
}

/**
 * Reconciles the internally computed client money ledger balance against an
 * externally reported bank balance (e.g. from a trust/escrow bank
 * statement). A positive variance means the ledger believes there is more
 * money than the bank actually holds (a shortfall risk); a negative variance
 * means the bank holds more than the ledger accounts for (a surplus).
 */
export function reconcileClientMoneyAccount(
  transactions: readonly ClientMoneyTransaction[],
  bankBalance: number
): ClientMoneyReconciliationResult {
  const ledgerBalance = getTotalClientMoneyBalance(transactions);
  const variance = Number((ledgerBalance - bankBalance).toFixed(2));
  const isReconciled = Math.abs(variance) <= RECONCILIATION_TOLERANCE;

  return {
    ledgerBalance,
    bankBalance,
    variance,
    isReconciled,
    hasShortfall: variance > RECONCILIATION_TOLERANCE,
  };
}
