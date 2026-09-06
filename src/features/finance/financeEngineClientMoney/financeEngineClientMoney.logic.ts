/**
 * Finance Engine — Client Money Ledger (implementation)
 * ------------------------------------------------------
 * Implements the public contract defined in
 * `./financeEngineClientMoney.contract.md` for tracking, reconciling, and
 * reporting on client funds (tenant/landlord escrow, deposits, rent-in-transit
 * balances) held by White Caves strictly separate from company operating
 * funds.
 *
 * This module is deliberately dependency-free and isomorphic (no Node-only
 * or browser-only APIs beyond `globalThis.crypto`, which is guarded with a
 * fallback).
 *
 * Parent issue: #1940
 * Child issue: #2417 (implementation against the #2418 contract)
 */

/** Represents a single ring-fenced ledger of client funds. */
export interface ClientMoneyAccount {
  /** Stable unique identifier (UUID) for the account. */
  accountId: string;
  /** Whose funds this account holds. */
  ownerType: 'tenant' | 'landlord';
  /** Reference id of the owner entity. */
  ownerId: string;
  /** ISO 4217 currency code, e.g. 'AED'. */
  currency: string;
  /** Integer balance in minor currency units (fils/cents). Never a float amount. */
  balanceMinorUnits: number;
  /** ISO 8601 timestamp of account creation. */
  createdAt: string;
  /** ISO 8601 timestamp of the most recent mutation. */
  updatedAt: string;
}

/** Supported client money transaction kinds. */
export type ClientMoneyTransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out'
  | 'adjustment';

/** An immutable, append-only client money ledger entry. */
export interface ClientMoneyTransaction {
  /** Stable unique identifier (UUID) for the transaction. */
  transactionId: string;
  /** Foreign key to {@link ClientMoneyAccount.accountId}. */
  accountId: string;
  /** Transaction kind. */
  type: ClientMoneyTransactionType;
  /** Positive integer magnitude; sign is implied by `type` (may be 0 for `adjustment`). */
  amountMinorUnits: number;
  /** External reference (invoice id, payment id, etc.). */
  reference: string;
  /** ISO 8601 timestamp of when the transaction occurred. */
  occurredAt: string;
  /** Resulting account balance after this entry, for audit trail. */
  postedBalanceMinorUnits: number;
}

/** Result of a mutating client money operation: the updated account and its new transaction. */
export interface ClientMoneyOperationResult {
  account: ClientMoneyAccount;
  transaction: ClientMoneyTransaction;
}

/** Thrown when an operation would violate a client money invariant. */
export class ClientMoneyInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientMoneyInvariantError';
  }
}

/** Generates a UUID without introducing a new runtime dependency. */
function generateTransactionId(): string {
  const cryptoObj = (globalThis as { crypto?: Crypto }).crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  // Fallback: RFC-4122-ish v4 identifier using Math.random.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isPositiveSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function assertValidAmount(amountMinorUnits: number, operation: 'deposit' | 'withdrawal'): void {
  if (!isPositiveSafeInteger(amountMinorUnits)) {
    throw new ClientMoneyInvariantError(
      `${operation} amountMinorUnits must be a positive safe integer, received ${amountMinorUnits}`
    );
  }
}

function assertValidTimestamp(occurredAt: string, label: string): void {
  if (!occurredAt || Number.isNaN(Date.parse(occurredAt))) {
    throw new ClientMoneyInvariantError(
      `${label} must be a valid ISO 8601 timestamp, received "${occurredAt}"`
    );
  }
}

function assertValidAccountInvariants(account: ClientMoneyAccount): void {
  if (!Number.isSafeInteger(account.balanceMinorUnits) || account.balanceMinorUnits < 0) {
    throw new ClientMoneyInvariantError(
      `Account ${account.accountId} has an invalid balanceMinorUnits: ${account.balanceMinorUnits}`
    );
  }
}

/**
 * Applies a deposit to a client money account.
 * `amountMinorUnits` must be a positive safe integer.
 */
export function applyDeposit(
  account: ClientMoneyAccount,
  amountMinorUnits: number,
  reference: string,
  occurredAt: string
): ClientMoneyOperationResult {
  assertValidAccountInvariants(account);
  assertValidAmount(amountMinorUnits, 'deposit');
  assertValidTimestamp(occurredAt, 'occurredAt');

  const postedBalanceMinorUnits = account.balanceMinorUnits + amountMinorUnits;

  const transaction: ClientMoneyTransaction = {
    transactionId: generateTransactionId(),
    accountId: account.accountId,
    type: 'deposit',
    amountMinorUnits,
    reference,
    occurredAt,
    postedBalanceMinorUnits,
  };

  const updatedAccount: ClientMoneyAccount = {
    ...account,
    balanceMinorUnits: postedBalanceMinorUnits,
    updatedAt: occurredAt,
  };

  return { account: updatedAccount, transaction };
}

/**
 * Applies a withdrawal to a client money account.
 * Rejects (throws {@link ClientMoneyInvariantError}) if the withdrawal would
 * cause the account balance to go negative.
 */
export function applyWithdrawal(
  account: ClientMoneyAccount,
  amountMinorUnits: number,
  reference: string,
  occurredAt: string
): ClientMoneyOperationResult {
  assertValidAccountInvariants(account);
  assertValidAmount(amountMinorUnits, 'withdrawal');
  assertValidTimestamp(occurredAt, 'occurredAt');

  const postedBalanceMinorUnits = account.balanceMinorUnits - amountMinorUnits;
  if (postedBalanceMinorUnits < 0) {
    throw new ClientMoneyInvariantError(
      `Withdrawal of ${amountMinorUnits} would overdraw account ${account.accountId} ` +
        `(current balance ${account.balanceMinorUnits})`
    );
  }

  const transaction: ClientMoneyTransaction = {
    transactionId: generateTransactionId(),
    accountId: account.accountId,
    type: 'withdrawal',
    amountMinorUnits,
    reference,
    occurredAt,
    postedBalanceMinorUnits,
  };

  const updatedAccount: ClientMoneyAccount = {
    ...account,
    balanceMinorUnits: postedBalanceMinorUnits,
    updatedAt: occurredAt,
  };

  return { account: updatedAccount, transaction };
}

/**
 * Returns true if the given transaction has a well-formed `amountMinorUnits`
 * for its type, per contract section 5, rule 6:
 *  - `adjustment` may be zero, but must be a non-negative safe integer.
 *  - every other type must be a strictly positive safe integer.
 */
function hasValidAmountForType(transaction: ClientMoneyTransaction): boolean {
  const { amountMinorUnits, type } = transaction;
  if (!Number.isSafeInteger(amountMinorUnits)) {
    return false;
  }
  if (type === 'adjustment') {
    return amountMinorUnits >= 0;
  }
  return amountMinorUnits > 0;
}

/**
 * Reconciles a list of transactions against an account's stated balance.
 * Returns true only if replaying every transaction in chronological order
 * (by `occurredAt`, ties broken by original array order — a stable sort),
 * starting from a zero balance, produces exactly the account's current
 * `balanceMinorUnits`. Never throws; malformed input simply fails
 * reconciliation.
 */
export function reconcileAccount(
  account: ClientMoneyAccount,
  transactions: ReadonlyArray<ClientMoneyTransaction>
): boolean {
  const parsedTimes: number[] = new Array(transactions.length);
  for (let i = 0; i < transactions.length; i += 1) {
    const parsed = Date.parse(transactions[i].occurredAt);
    if (Number.isNaN(parsed)) {
      return false;
    }
    parsedTimes[i] = parsed;
  }

  const order = transactions.map((_, index) => index);
  order.sort((a, b) => parsedTimes[a] - parsedTimes[b]); // stable: ties keep original relative order

  let balance = 0;
  for (const index of order) {
    const transaction = transactions[index];
    if (transaction.accountId !== account.accountId) {
      return false;
    }
    if (!hasValidAmountForType(transaction)) {
      return false;
    }
    switch (transaction.type) {
      case 'deposit':
      case 'transfer_in':
        balance += transaction.amountMinorUnits;
        break;
      case 'withdrawal':
      case 'transfer_out':
        balance -= transaction.amountMinorUnits;
        break;
      case 'adjustment':
        // Adjustments carry their signed effect implicitly via the
        // recorded postedBalanceMinorUnits, per contract section 5 rule 4.
        balance = transaction.postedBalanceMinorUnits;
        break;
      default: {
        return false;
      }
    }
  }

  return balance === account.balanceMinorUnits;
}
