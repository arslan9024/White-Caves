/**
 * Finance Engine — Intercompany Transfer (shared domain types)
 *
 * Canonical type definitions for the capability specified in:
 * - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md
 * - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-TRANSFER-1936.md
 *
 * Parent issue: #1936. This module is intentionally limited to types, closed
 * string-literal unions, and small pure runtime helpers that are tightly
 * coupled to discriminating those types (type guards, ordered constant
 * lists, and result constructors). It introduces no side effects, no I/O,
 * and no new runtime dependencies (NFR-5), and every interface here is
 * fully typed with no `any` (SDD §3.5).
 *
 * These types intentionally mirror the shapes already used by
 * `financeEngineIntercompanyTransfer.logic.ts` so both modules describe the
 * same domain contract; this file does not import from or modify that
 * module.
 */

/** Allow-list of currencies supported by the intercompany transfer capability (FR-4). */
export const SUPPORTED_CURRENCIES = ['AED', 'USD', 'EUR', 'GBP'] as const;

/** A currency supported by this module. */
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

/** Runtime type guard narrowing an arbitrary string to a supported {@link Currency}. */
export function isSupportedCurrency(currency: string): currency is Currency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(currency);
}

/**
 * Rejection reasons, listed in the fixed evaluation order mandated by SDD
 * §3.1: SAME_ENTITY -> NON_POSITIVE_AMOUNT -> UNSUPPORTED_CURRENCY ->
 * UNKNOWN_ENTITY -> INSUFFICIENT_AUTHORIZATION -> DUPLICATE_REQUEST_ID.
 */
export type RejectionReason =
  | 'SAME_ENTITY'
  | 'NON_POSITIVE_AMOUNT'
  | 'UNSUPPORTED_CURRENCY'
  | 'UNKNOWN_ENTITY'
  | 'INSUFFICIENT_AUTHORIZATION'
  | 'DUPLICATE_REQUEST_ID';

/**
 * The full set of {@link RejectionReason} values, in the fixed evaluation
 * order from SDD §3.1. Kept as a runtime constant (rather than only a type)
 * so callers can iterate exhaustively (e.g. for UI copy tables or
 * property-based tests) without hand-maintaining a duplicate list.
 */
export const REJECTION_REASONS: readonly RejectionReason[] = [
  'SAME_ENTITY',
  'NON_POSITIVE_AMOUNT',
  'UNSUPPORTED_CURRENCY',
  'UNKNOWN_ENTITY',
  'INSUFFICIENT_AUTHORIZATION',
  'DUPLICATE_REQUEST_ID',
];

/** Runtime type guard for values that are a valid {@link RejectionReason}. */
export function isRejectionReason(value: string): value is RejectionReason {
  return (REJECTION_REASONS as readonly string[]).includes(value);
}

/** Direction of a single ledger entry. */
export type LedgerDirection = 'debit' | 'credit';

/** The full set of {@link LedgerDirection} values. */
export const LEDGER_DIRECTIONS: readonly LedgerDirection[] = ['debit', 'credit'];

/** Request to move value between two entities (FR-1). */
export interface IntercompanyTransferRequest {
  /** Idempotency key. Duplicate submissions with the same requestId are safely no-op'd (FR-6). */
  readonly requestId: string;
  readonly sourceEntityId: string;
  readonly destinationEntityId: string;
  /** Integer minor units (e.g. fils, cents). Must be a positive integer (FR-3). */
  readonly amountMinorUnits: number;
  /** Raw currency code, validated against SUPPORTED_CURRENCIES at submission time (FR-4). */
  readonly currency: string;
  /** Identifier of the caller submitting the transfer, used for authorization checks (FR-9). */
  readonly requestedBy: string;
}

/** A single posted ledger entry. Entries are append-only and never mutated in place. */
export interface LedgerEntry {
  readonly id: string;
  readonly entityId: string;
  readonly direction: LedgerDirection;
  readonly amountMinorUnits: number;
  readonly currency: Currency;
  readonly requestId: string;
  readonly createdAt: string;
  /** Present only on entries created by a reversal; references the original requestId. */
  readonly reversalOfRequestId?: string;
}

/** Successful transfer outcome: exactly two entries, sharing requestId (FR-7). */
export interface PostedTransferResult {
  readonly status: 'posted';
  readonly requestId: string;
  readonly debitEntry: LedgerEntry;
  readonly creditEntry: LedgerEntry;
}

/** Rejected transfer outcome, carrying a single deterministic rejection reason. */
export interface RejectedTransferResult {
  readonly status: 'rejected';
  readonly requestId: string;
  readonly reason: RejectionReason;
}

/** Discriminated union of every possible {@link IntercompanyTransferRequest} outcome. */
export type IntercompanyTransferResult = PostedTransferResult | RejectedTransferResult;

/** Outcome of reversing a previously posted transfer (FR-8). */
export interface ReversalResult {
  readonly status: 'reversed';
  readonly originalRequestId: string;
  readonly reversalRequestId: string;
  readonly debitEntry: LedgerEntry;
  readonly creditEntry: LedgerEntry;
}

/** Runtime type guard narrowing an {@link IntercompanyTransferResult} to its posted variant. */
export function isPostedTransferResult(
  result: IntercompanyTransferResult
): result is PostedTransferResult {
  return result.status === 'posted';
}

/** Runtime type guard narrowing an {@link IntercompanyTransferResult} to its rejected variant. */
export function isRejectedTransferResult(
  result: IntercompanyTransferResult
): result is RejectedTransferResult {
  return result.status === 'rejected';
}

/**
 * Pure constructor for a {@link RejectedTransferResult}. Centralizing this
 * shape (rather than letting every rejection site build the literal inline)
 * keeps the "reject" outcome shape consistent across the eventual
 * validation and service layers.
 */
export function createRejectedResult(
  requestId: string,
  reason: RejectionReason
): RejectedTransferResult {
  return { status: 'rejected', requestId, reason };
}

/**
 * Pure constructor for a {@link PostedTransferResult} from an already-posted
 * debit/credit entry pair. Does not perform any posting itself; callers are
 * responsible for atomically producing the two entries beforehand (SDD §3.3).
 */
export function createPostedResult(
  requestId: string,
  debitEntry: LedgerEntry,
  creditEntry: LedgerEntry
): PostedTransferResult {
  return { status: 'posted', requestId, debitEntry, creditEntry };
}
