/**
 * Client Money Finance Engine — Type Definitions
 *
 * Domain: tracking of client (tenant/landlord/buyer) funds held in trust by
 * the agency (e.g. security deposits, holding deposits, rent collected on
 * behalf of a landlord). These funds must be strictly segregated from
 * company operating funds and fully reconciled at all times.
 *
 * Parent issue: #1940
 * Issue: #2416
 */

/** Distinguishes the nature of a client-money transaction. */
export enum ClientMoneyTransactionType {
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL',
  Transfer = 'TRANSFER',
  Refund = 'REFUND',
  Fee = 'FEE',
}

/** Lifecycle status of a client-money holding account. */
export enum ClientMoneyAccountStatus {
  Active = 'ACTIVE',
  Frozen = 'FROZEN',
  Closed = 'CLOSED',
}

/** Reconciliation state for a client-money account at a point in time. */
export enum ClientMoneyReconciliationStatus {
  Reconciled = 'RECONCILED',
  Pending = 'PENDING',
  Discrepant = 'DISCREPANT',
}

/** ISO 4217 currency code, restricted to a minimal supported set. */
export type SupportedCurrencyCode = 'AED' | 'USD' | 'GBP' | 'EUR';

/** A single immutable ledger entry recording movement of client funds. */
export interface ClientMoneyTransaction {
  readonly id: string;
  readonly accountId: string;
  readonly type: ClientMoneyTransactionType;
  /** Amount in minor units (e.g. fils/cents) to avoid floating point drift. */
  readonly amountMinorUnits: number;
  readonly currency: SupportedCurrencyCode;
  readonly createdAt: string;
  readonly reference: string;
  readonly relatedPartyId?: string;
  readonly notes?: string;
}

/** A client-money holding account, one per beneficiary/purpose. */
export interface ClientMoneyAccount {
  readonly id: string;
  readonly ownerName: string;
  readonly propertyId?: string;
  readonly status: ClientMoneyAccountStatus;
  readonly currency: SupportedCurrencyCode;
  readonly openedAt: string;
  readonly closedAt?: string;
}

/** Aggregated ledger summary for a single client-money account. */
export interface ClientMoneyLedgerSummary {
  readonly accountId: string;
  readonly balanceMinorUnits: number;
  readonly transactionCount: number;
  readonly lastTransactionAt: string | null;
  readonly reconciliationStatus: ClientMoneyReconciliationStatus;
}

/** Input to a reconciliation check between internal ledger and bank statement. */
export interface ClientMoneyReconciliationInput {
  readonly accountId: string;
  readonly ledgerBalanceMinorUnits: number;
  readonly bankStatementBalanceMinorUnits: number;
  readonly asOf: string;
}

/** Result of comparing ledger balance against an external bank statement. */
export interface ClientMoneyReconciliationResult {
  readonly accountId: string;
  readonly status: ClientMoneyReconciliationStatus;
  readonly differenceMinorUnits: number;
  readonly asOf: string;
}

const TRANSACTION_TYPES = new Set<string>(Object.values(ClientMoneyTransactionType));
const ACCOUNT_STATUSES = new Set<string>(Object.values(ClientMoneyAccountStatus));
const SUPPORTED_CURRENCIES = new Set<string>(['AED', 'USD', 'GBP', 'EUR']);

/** Transaction types that increase an account's held balance. */
const CREDIT_TYPES: ReadonlySet<ClientMoneyTransactionType> = new Set([
  ClientMoneyTransactionType.Deposit,
]);

/** Transaction types that decrease an account's held balance. */
const DEBIT_TYPES: ReadonlySet<ClientMoneyTransactionType> = new Set([
  ClientMoneyTransactionType.Withdrawal,
  ClientMoneyTransactionType.Transfer,
  ClientMoneyTransactionType.Refund,
  ClientMoneyTransactionType.Fee,
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Runtime type guard for {@link ClientMoneyTransaction}. */
export function isClientMoneyTransaction(value: unknown): value is ClientMoneyTransaction {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.accountId) &&
    typeof candidate.type === 'string' &&
    TRANSACTION_TYPES.has(candidate.type) &&
    isFiniteNumber(candidate.amountMinorUnits) &&
    typeof candidate.currency === 'string' &&
    SUPPORTED_CURRENCIES.has(candidate.currency) &&
    isNonEmptyString(candidate.createdAt) &&
    isNonEmptyString(candidate.reference)
  );
}

/** Runtime type guard for {@link ClientMoneyAccount}. */
export function isClientMoneyAccount(value: unknown): value is ClientMoneyAccount {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.ownerName) &&
    typeof candidate.status === 'string' &&
    ACCOUNT_STATUSES.has(candidate.status) &&
    typeof candidate.currency === 'string' &&
    SUPPORTED_CURRENCIES.has(candidate.currency) &&
    isNonEmptyString(candidate.openedAt)
  );
}

/**
 * Signed contribution of a single transaction to an account balance.
 * Deposits are positive; withdrawals/transfers/refunds/fees are negative.
 */
export function transactionSignedAmount(transaction: ClientMoneyTransaction): number {
  if (CREDIT_TYPES.has(transaction.type)) {
    return transaction.amountMinorUnits;
  }
  if (DEBIT_TYPES.has(transaction.type)) {
    return -transaction.amountMinorUnits;
  }
  // Exhaustiveness guard for future enum members.
  throw new Error(`Unsupported client money transaction type: ${String(transaction.type)}`);
}

/**
 * Computes the ledger balance for a given account from an ordered or
 * unordered list of transactions. Transactions belonging to other accounts
 * are ignored so callers may pass a full transaction log.
 */
export function calculateAccountBalance(
  accountId: string,
  transactions: readonly ClientMoneyTransaction[]
): number {
  return transactions
    .filter(transaction => transaction.accountId === accountId)
    .reduce((total, transaction) => total + transactionSignedAmount(transaction), 0);
}

/**
 * Builds a {@link ClientMoneyLedgerSummary} for an account from its
 * transaction history. Reconciliation status defaults to `Pending` since a
 * ledger summary alone cannot confirm agreement with a bank statement.
 */
export function summarizeAccountLedger(
  accountId: string,
  transactions: readonly ClientMoneyTransaction[]
): ClientMoneyLedgerSummary {
  const ownTransactions = transactions.filter(transaction => transaction.accountId === accountId);
  const balanceMinorUnits = ownTransactions.reduce(
    (total, transaction) => total + transactionSignedAmount(transaction),
    0
  );
  const lastTransactionAt = ownTransactions.reduce<string | null>(
    (latest, transaction) =>
      latest === null || transaction.createdAt > latest ? transaction.createdAt : latest,
    null
  );
  return {
    accountId,
    balanceMinorUnits,
    transactionCount: ownTransactions.length,
    lastTransactionAt,
    reconciliationStatus: ClientMoneyReconciliationStatus.Pending,
  };
}

/**
 * Reconciles a ledger balance against an externally reported bank statement
 * balance. Any non-zero difference is reported as `Discrepant`.
 */
export function reconcileClientMoneyAccount(
  input: ClientMoneyReconciliationInput
): ClientMoneyReconciliationResult {
  const differenceMinorUnits = input.ledgerBalanceMinorUnits - input.bankStatementBalanceMinorUnits;
  const status =
    differenceMinorUnits === 0
      ? ClientMoneyReconciliationStatus.Reconciled
      : ClientMoneyReconciliationStatus.Discrepant;
  return {
    accountId: input.accountId,
    status,
    differenceMinorUnits,
    asOf: input.asOf,
  };
}

/**
 * Validates that a withdrawal/transfer/refund/fee transaction would not
 * drive the account balance negative (client money must never be
 * overdrawn). Returns true if the transaction is permissible.
 */
export function canApplyTransactionWithoutOverdraft(
  currentBalanceMinorUnits: number,
  transaction: ClientMoneyTransaction
): boolean {
  const projected = currentBalanceMinorUnits + transactionSignedAmount(transaction);
  return projected >= 0;
}
