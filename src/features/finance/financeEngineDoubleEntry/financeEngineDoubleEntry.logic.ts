/**
 * financeEngineDoubleEntry.logic.ts
 *
 * Pure double-entry finance ledger engine.
 *
 * Implements the requirements captured in:
 *   plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-LEDGER-1926.md
 *   plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-LEDGER-1926.md
 *
 * This module is deliberately free of I/O, database access, and HTTP concerns.
 * It is a pure computation module: validation, posting (with idempotency against
 * caller-supplied ledger state), balance derivation, and reversal generation.
 *
 * Parent issue: #1926
 * Child issue: #2477
 */

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Standard accounting classifications that determine normal balance side. */
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

/** Which side of a double-entry line item an entry represents. */
export type EntrySide = 'debit' | 'credit';

/** A named bucket that ledger entries post against. */
export interface LedgerAccount {
  readonly id: string;
  readonly name: string;
  readonly type: AccountType;
  readonly currency: string;
  readonly isActive: boolean;
}

/** A single debit or credit line item within a transaction. */
export interface LedgerEntry {
  readonly accountId: string;
  readonly side: EntrySide;
  readonly amountMinorUnits: number;
  readonly currency: string;
}

/** Optional metadata carried by a transaction, including reversal linkage. */
export interface LedgerTransactionMetadata {
  readonly [key: string]: string | number | boolean | undefined;
  readonly reversalOf?: string;
}

/**
 * A candidate transaction supplied by a caller before validation/posting.
 * `id` and `postedAt` are assigned by `postTransaction`, not by the caller.
 */
export interface LedgerTransactionCandidate {
  readonly reference: string;
  readonly entries: readonly LedgerEntry[];
  readonly metadata?: LedgerTransactionMetadata;
}

/** A transaction that has been validated and posted to ledger state. */
export interface LedgerTransaction {
  readonly id: string;
  readonly reference: string;
  readonly entries: readonly LedgerEntry[];
  readonly metadata?: LedgerTransactionMetadata;
  readonly postedAt: string;
}

/** Discriminated set of reasons a candidate transaction can fail validation. */
export type ValidationFailureCode =
  | 'INSUFFICIENT_ENTRIES'
  | 'MISSING_DEBIT_OR_CREDIT'
  | 'UNBALANCED'
  | 'MIXED_CURRENCY'
  | 'NON_INTEGER_AMOUNT'
  | 'NON_POSITIVE_AMOUNT'
  | 'UNKNOWN_ACCOUNT'
  | 'INACTIVE_ACCOUNT';

/** A single validation failure, including which entry (if any) it relates to. */
export interface ValidationFailure {
  readonly code: ValidationFailureCode;
  readonly message: string;
  readonly entryIndex?: number;
}

/** Result of validating a candidate transaction: either fully valid, or a list of failures. */
export type ValidationResult =
  | { readonly ok: true; readonly failures: readonly [] }
  | { readonly ok: false; readonly failures: readonly ValidationFailure[] };

/** Thrown by `postTransaction` when called with a candidate that fails validation. */
export class LedgerPostingError extends Error {
  public readonly failures: readonly ValidationFailure[];

  constructor(failures: readonly ValidationFailure[]) {
    super(`Cannot post invalid ledger transaction: ${failures.map(f => f.code).join(', ')}`);
    this.name = 'LedgerPostingError';
    this.failures = failures;
  }
}

/** In-memory ledger state supplied by the caller (persistence is out of scope). */
export interface LedgerState {
  readonly postedTransactions: readonly LedgerTransaction[];
}

// ---------------------------------------------------------------------------
// Validation (FR-1 .. FR-7)
// ---------------------------------------------------------------------------

const ACCOUNT_TYPES_DEBIT_NORMAL: ReadonlySet<AccountType> = new Set(['asset', 'expense']);

/**
 * Validates a candidate transaction against FR-1 through FR-7.
 * Collects ALL applicable failures rather than short-circuiting on the first one.
 */
export function validateTransaction(
  candidate: LedgerTransactionCandidate,
  accounts: readonly LedgerAccount[]
): ValidationResult {
  const failures: ValidationFailure[] = [];
  const accountsById = new Map<string, LedgerAccount>(
    accounts.map(account => [account.id, account])
  );

  // FR-1: at least two entries required.
  if (candidate.entries.length < 2) {
    failures.push({
      code: 'INSUFFICIENT_ENTRIES',
      message: 'A transaction must contain at least two entries.',
    });
  }

  let debitTotal = 0;
  let creditTotal = 0;
  let hasDebit = false;
  let hasCredit = false;
  const currenciesSeen = new Set<string>();

  candidate.entries.forEach((entry, index) => {
    // FR-5: amount must be a positive integer.
    if (!Number.isInteger(entry.amountMinorUnits)) {
      failures.push({
        code: 'NON_INTEGER_AMOUNT',
        message: `Entry ${index} has a non-integer amountMinorUnits value.`,
        entryIndex: index,
      });
    } else if (entry.amountMinorUnits <= 0) {
      failures.push({
        code: 'NON_POSITIVE_AMOUNT',
        message: `Entry ${index} has a non-positive amountMinorUnits value.`,
        entryIndex: index,
      });
    }

    // FR-6: account must exist and be active.
    const account = accountsById.get(entry.accountId);
    if (!account) {
      failures.push({
        code: 'UNKNOWN_ACCOUNT',
        message: `Entry ${index} references unknown account "${entry.accountId}".`,
        entryIndex: index,
      });
    } else if (!account.isActive) {
      failures.push({
        code: 'INACTIVE_ACCOUNT',
        message: `Entry ${index} references inactive account "${entry.accountId}".`,
        entryIndex: index,
      });
    }

    currenciesSeen.add(entry.currency);

    if (entry.side === 'debit') {
      hasDebit = true;
      if (Number.isFinite(entry.amountMinorUnits)) {
        debitTotal += entry.amountMinorUnits;
      }
    } else {
      hasCredit = true;
      if (Number.isFinite(entry.amountMinorUnits)) {
        creditTotal += entry.amountMinorUnits;
      }
    }
  });

  // FR-2: must have at least one debit and one credit entry.
  if (candidate.entries.length >= 1 && (!hasDebit || !hasCredit)) {
    failures.push({
      code: 'MISSING_DEBIT_OR_CREDIT',
      message: 'A transaction must contain at least one debit entry and one credit entry.',
    });
  }

  // FR-4: single currency per transaction.
  if (currenciesSeen.size > 1) {
    failures.push({
      code: 'MIXED_CURRENCY',
      message: 'A transaction must not reference more than one currency.',
    });
  }

  // FR-3: debits must equal credits.
  if (hasDebit && hasCredit && debitTotal !== creditTotal) {
    failures.push({
      code: 'UNBALANCED',
      message: `Debit total (${debitTotal}) does not equal credit total (${creditTotal}).`,
    });
  }

  if (failures.length === 0) {
    return { ok: true, failures: [] };
  }
  return { ok: false, failures };
}

// ---------------------------------------------------------------------------
// Posting (FR-8, FR-9, FR-12)
// ---------------------------------------------------------------------------

let postedIdSequence = 0;

/** Generates a stable, monotonically increasing identifier for posted transactions. */
function generateTransactionId(): string {
  postedIdSequence += 1;
  return `txn_${Date.now().toString(36)}_${postedIdSequence.toString(36)}`;
}

/**
 * Validates and posts a candidate transaction (FR-8: no posting without validation passing).
 * Idempotent by `reference` (FR-9): if a transaction with the same reference already exists
 * in `ledgerState`, that existing transaction is returned unchanged rather than posting a
 * duplicate. Returned transactions are frozen (FR-12: no mutation once posted).
 *
 * Throws `LedgerPostingError` if the candidate fails validation.
 */
export function postTransaction(
  candidate: LedgerTransactionCandidate,
  accounts: readonly LedgerAccount[],
  ledgerState: LedgerState
): LedgerTransaction {
  const existing = ledgerState.postedTransactions.find(
    txn => txn.reference === candidate.reference
  );
  if (existing) {
    return existing;
  }

  const validationResult = validateTransaction(candidate, accounts);
  if (!validationResult.ok) {
    throw new LedgerPostingError(validationResult.failures);
  }

  const posted: LedgerTransaction = Object.freeze({
    id: generateTransactionId(),
    reference: candidate.reference,
    entries: Object.freeze(candidate.entries.map(entry => Object.freeze({ ...entry }))),
    metadata: candidate.metadata ? Object.freeze({ ...candidate.metadata }) : undefined,
    postedAt: new Date().toISOString(),
  });

  return posted;
}

// ---------------------------------------------------------------------------
// Balances (FR-10)
// ---------------------------------------------------------------------------

/**
 * Derives an account's balance deterministically from posted entries.
 * Debit-normal accounts (asset/expense) increase on debit, decrease on credit.
 * Credit-normal accounts (liability/equity/revenue) increase on credit, decrease on debit.
 * Returns 0 for an account with no posted activity.
 */
export function getAccountBalance(
  accountId: string,
  postedTransactions: readonly LedgerTransaction[],
  accounts: readonly LedgerAccount[]
): number {
  const account = accounts.find(candidate => candidate.id === accountId);
  if (!account) {
    throw new TypeError(`Cannot derive balance for unknown account "${accountId}".`);
  }

  const isDebitNormal = ACCOUNT_TYPES_DEBIT_NORMAL.has(account.type);

  let balance = 0;
  for (const transaction of postedTransactions) {
    for (const entry of transaction.entries) {
      if (entry.accountId !== accountId) {
        continue;
      }
      const signedAmount =
        entry.side === 'debit' ? entry.amountMinorUnits : -entry.amountMinorUnits;
      balance += isDebitNormal ? signedAmount : -signedAmount;
    }
  }

  return balance;
}

// ---------------------------------------------------------------------------
// Reversal (FR-11, FR-13)
// ---------------------------------------------------------------------------

/** Flips a single entry's side while preserving its amount and currency. */
function flipEntrySide(entry: LedgerEntry): LedgerEntry {
  return Object.freeze({
    ...entry,
    side: entry.side === 'debit' ? 'credit' : 'debit',
  });
}

/**
 * Builds a reversal candidate for a previously posted transaction: every entry's side is
 * flipped while amounts/currency are preserved, and metadata records a back-reference to the
 * original transaction (FR-13). The result is a candidate, not yet posted — callers must pass
 * it through `postTransaction` to commit it, keeping validation/idempotency uniform.
 */
export function reverseTransaction(original: LedgerTransaction): LedgerTransactionCandidate {
  return {
    reference: `${original.reference}:reversal`,
    entries: original.entries.map(flipEntrySide),
    metadata: Object.freeze({
      ...(original.metadata ?? {}),
      reversalOf: original.id,
    }),
  };
}
