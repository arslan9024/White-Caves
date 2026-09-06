/**
 * Domain types for the double-entry finance ledger engine (work stream W56).
 *
 * Scope: parent issue #1926, child issue #2475. This module defines the
 * shared domain vocabulary consumed by the consolidated
 * `financeEngineDoubleEntry.logic.ts` module (validation, posting, balance
 * derivation, reversal) without introducing any I/O, persistence, or
 * framework dependency. All types are readonly to prevent accidental
 * mutation of ledger data by consumers (NFR-3, SRS-ISSUE-W56-FINANCE-LEDGER-1926).
 *
 * No `any` types are used anywhere in this module (NFR-1).
 */

/** The five standard accounting classifications a ledger account may have. */
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

/** The two sides an individual ledger entry can post to. */
export type EntrySide = 'debit' | 'credit';

/** Exhaustive, ordered list of all valid account types. Used for runtime validation. */
export const ACCOUNT_TYPES: readonly AccountType[] = [
  'asset',
  'liability',
  'equity',
  'revenue',
  'expense',
];

/** Exhaustive, ordered list of all valid entry sides. Used for runtime validation. */
export const ENTRY_SIDES: readonly EntrySide[] = ['debit', 'credit'];

/**
 * Account types for which a debit increases the balance and a credit
 * decreases it (FR-10 debit-normal accounting).
 */
export const DEBIT_NORMAL_ACCOUNT_TYPES: readonly AccountType[] = ['asset', 'expense'];

/**
 * Account types for which a credit increases the balance and a debit
 * decreases it (FR-10 credit-normal accounting).
 */
export const CREDIT_NORMAL_ACCOUNT_TYPES: readonly AccountType[] = [
  'liability',
  'equity',
  'revenue',
];

/** A named bucket that ledger entries post against. */
export interface LedgerAccount {
  readonly id: string;
  readonly name: string;
  readonly type: AccountType;
  readonly currency: string;
  readonly isActive: boolean;
}

/** A single debit or credit line item, referencing an account by id. */
export interface LedgerEntry {
  readonly accountId: string;
  readonly side: EntrySide;
  readonly amountMinorUnits: number;
  readonly currency: string;
}

/**
 * A caller-supplied, not-yet-validated transaction candidate. This is the
 * shape passed into `validateTransaction` / `postTransaction` in the logic
 * module.
 */
export interface LedgerTransactionCandidate {
  readonly reference: string;
  readonly description: string;
  readonly entries: readonly LedgerEntry[];
  readonly metadata?: Readonly<Record<string, string>>;
}

/** Lifecycle status of a transaction once it has been through posting. */
export type LedgerTransactionStatus = 'posted' | 'reversed';

/**
 * A transaction that has been validated and posted to the ledger. Extends
 * the candidate shape with system-assigned identity and audit fields.
 */
export interface LedgerTransaction extends LedgerTransactionCandidate {
  readonly id: string;
  readonly postedAt: string;
  readonly status: LedgerTransactionStatus;
  readonly metadata?: Readonly<Record<string, string>>;
}

/** The subset of ledger state required to check posting idempotency (FR-9). */
export interface LedgerState {
  readonly postedTransactions: readonly LedgerTransaction[];
}

/** Every distinct reason a candidate transaction can fail validation. */
export type ValidationFailureCode =
  | 'INSUFFICIENT_ENTRIES'
  | 'MISSING_DEBIT_OR_CREDIT'
  | 'UNBALANCED'
  | 'MIXED_CURRENCY'
  | 'NON_INTEGER_AMOUNT'
  | 'NON_POSITIVE_AMOUNT'
  | 'UNKNOWN_ACCOUNT'
  | 'INACTIVE_ACCOUNT';

/** A single validation problem found on a candidate transaction. */
export interface ValidationFailure {
  readonly code: ValidationFailureCode;
  readonly message: string;
  /** Index into the candidate's `entries` array, when the failure is entry-specific. */
  readonly entryIndex?: number;
}

/**
 * Result of validating a candidate transaction. Discriminated on `ok` so
 * callers get exhaustive type narrowing (FR-7: all applicable failures are
 * reported together, never just the first one).
 */
export type ValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly failures: readonly ValidationFailure[] };

/** Type guard: narrows an arbitrary string to `AccountType`. */
export function isAccountType(value: string): value is AccountType {
  return (ACCOUNT_TYPES as readonly string[]).includes(value);
}

/** Type guard: narrows an arbitrary string to `EntrySide`. */
export function isEntrySide(value: string): value is EntrySide {
  return (ENTRY_SIDES as readonly string[]).includes(value);
}

/** True when a debit increases the balance of accounts of the given type (FR-10). */
export function isDebitNormalAccountType(type: AccountType): boolean {
  return (DEBIT_NORMAL_ACCOUNT_TYPES as readonly AccountType[]).includes(type);
}

/** True when a credit increases the balance of accounts of the given type (FR-10). */
export function isCreditNormalAccountType(type: AccountType): boolean {
  return (CREDIT_NORMAL_ACCOUNT_TYPES as readonly AccountType[]).includes(type);
}

/**
 * Returns the signed contribution of a single entry's amount to its
 * account's balance, applying debit-normal / credit-normal accounting
 * (FR-10). Positive values increase the balance, negative values decrease
 * it. Pure function: no I/O, no mutation.
 */
export function signedAmountForEntry(entry: LedgerEntry, accountType: AccountType): number {
  const isDebitNormal = isDebitNormalAccountType(accountType);
  const increasesBalance =
    (isDebitNormal && entry.side === 'debit') || (!isDebitNormal && entry.side === 'credit');
  return increasesBalance ? entry.amountMinorUnits : -entry.amountMinorUnits;
}
