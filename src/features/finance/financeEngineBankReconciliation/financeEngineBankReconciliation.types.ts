/**
 * Finance Engine — Bank Reconciliation data contract.
 *
 * Issue: #2428 (child of parent issue #1937)
 *
 * This module defines the shared data shapes, enums, defaults, and
 * runtime type guards used by the bank reconciliation matching engine
 * described in:
 *   - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md
 *   - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md
 *
 * All exports here are pure data definitions and side-effect-free
 * validation helpers — no network, filesystem, or database access.
 */

/** A single imported bank statement line to be reconciled. */
export interface BankStatementLine {
  readonly id: string;
  /** ISO-8601 date string (e.g. "2024-03-15") the transaction posted on the bank statement. */
  readonly postedDate: string;
  /** Signed integer amount in cents (positive = credit, negative = debit). */
  readonly amountCents: number;
  readonly description: string;
  /** Bank-provided reference number, if any. Empty string means "no reference". */
  readonly referenceNumber: string;
}

/** A single internal finance engine ledger entry eligible for matching. */
export interface LedgerTransaction {
  readonly id: string;
  /** ISO-8601 date string (e.g. "2024-03-15") the transaction was recorded internally. */
  readonly transactionDate: string;
  /** Signed integer amount in cents (positive = credit, negative = debit). */
  readonly amountCents: number;
  readonly memo: string;
  /** Internal reference number, if any. Empty string means "no reference". */
  readonly referenceNumber: string;
}

/** Closed set of possible outcomes for a single bank-line-to-ledger match attempt. */
export type ReconciliationStatus =
  | 'matched'
  | 'unmatched'
  | 'amount-mismatch'
  | 'date-out-of-window';

/** Ordered, exhaustive list of all `ReconciliationStatus` values (used for validation/iteration). */
export const RECONCILIATION_STATUSES: readonly ReconciliationStatus[] = [
  'matched',
  'unmatched',
  'amount-mismatch',
  'date-out-of-window',
];

/** Runtime type guard for `ReconciliationStatus`. */
export function isReconciliationStatus(value: unknown): value is ReconciliationStatus {
  return (
    typeof value === 'string' && (RECONCILIATION_STATUSES as readonly string[]).includes(value)
  );
}

/** The outcome of matching a single bank statement line against the ledger. */
export interface ReconciliationMatch {
  readonly bankLineId: string;
  /** `null` when no compatible ledger transaction candidate exists at all. */
  readonly ledgerTransactionId: string | null;
  readonly status: ReconciliationStatus;
  /** Normalized confidence score in the closed interval [0, 1]. */
  readonly confidence: number;
  /** Absolute variance in cents between the bank line and matched/candidate ledger transaction. */
  readonly varianceCents: number;
}

/** Aggregate result of reconciling a full batch of bank statement lines. */
export interface ReconciliationSummary {
  readonly totalBankLines: number;
  readonly totalMatched: number;
  readonly totalUnmatched: number;
  readonly matches: readonly ReconciliationMatch[];
}

/** Configurable tolerances for the matching engine. */
export interface MatchOptions {
  /** Maximum number of days apart a bank line and ledger transaction may be to be considered in-window. */
  readonly dateWindowDays: number;
  /** Maximum absolute cent difference between amounts to still be considered a tolerated match. */
  readonly amountToleranceCents: number;
}

/** Default matching tolerances, per SDD §4 / §8: 3-day window, 0-cent tolerance. */
export const DEFAULT_MATCH_OPTIONS: MatchOptions = {
  dateWindowDays: 3,
  amountToleranceCents: 0,
};

/** Resolves a fully-populated `MatchOptions` from an optional partial override. */
export function resolveMatchOptions(options?: Partial<MatchOptions>): MatchOptions {
  return {
    dateWindowDays: options?.dateWindowDays ?? DEFAULT_MATCH_OPTIONS.dateWindowDays,
    amountToleranceCents:
      options?.amountToleranceCents ?? DEFAULT_MATCH_OPTIONS.amountToleranceCents,
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string';
}

/** Runtime type guard / shape validator for `BankStatementLine`. */
export function isBankStatementLine(value: unknown): value is BankStatementLine {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.postedDate) &&
    isFiniteNumber(candidate.amountCents) &&
    isNonEmptyString(candidate.description) &&
    isNonEmptyString(candidate.referenceNumber)
  );
}

/** Runtime type guard / shape validator for `LedgerTransaction`. */
export function isLedgerTransaction(value: unknown): value is LedgerTransaction {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.transactionDate) &&
    isFiniteNumber(candidate.amountCents) &&
    isNonEmptyString(candidate.memo) &&
    isNonEmptyString(candidate.referenceNumber)
  );
}

/** Runtime type guard / shape validator for `ReconciliationMatch`. */
export function isReconciliationMatch(value: unknown): value is ReconciliationMatch {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.bankLineId) &&
    (candidate.ledgerTransactionId === null || isNonEmptyString(candidate.ledgerTransactionId)) &&
    isReconciliationStatus(candidate.status) &&
    isFiniteNumber(candidate.confidence) &&
    candidate.confidence >= 0 &&
    candidate.confidence <= 1 &&
    isFiniteNumber(candidate.varianceCents)
  );
}

/** Runtime type guard / shape validator for `ReconciliationSummary`. */
export function isReconciliationSummary(value: unknown): value is ReconciliationSummary {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (
    !isFiniteNumber(candidate.totalBankLines) ||
    !isFiniteNumber(candidate.totalMatched) ||
    !isFiniteNumber(candidate.totalUnmatched) ||
    !Array.isArray(candidate.matches)
  ) {
    return false;
  }
  return (candidate.matches as unknown[]).every(match => isReconciliationMatch(match));
}

/**
 * Validates the internal invariant that
 * `totalMatched + totalUnmatched === totalBankLines === matches.length`.
 * Returns `true` when the summary's aggregate counters are self-consistent.
 */
export function isConsistentReconciliationSummary(summary: ReconciliationSummary): boolean {
  return (
    summary.totalBankLines === summary.matches.length &&
    summary.totalMatched + summary.totalUnmatched === summary.totalBankLines
  );
}
