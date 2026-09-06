/**
 * Finance Engine Cheque Registry — shared type contract.
 *
 * Pure type/data-shape declarations for the cheque registry sub-capability
 * of the Finance Engine (parent issue #1938, child issue #2424). This file
 * intentionally contains no runtime logic beyond lightweight, side-effect
 * free type guards: business rules (validation, transitions, aggregation)
 * live in `financeEngineChequeRegistry.logic.ts` and consume these types.
 *
 * Design decisions:
 * - Fields are `readonly` so immutability of a `ChequeRecord` is a
 *   compile-time guarantee rather than a runtime convention.
 * - Dates are represented as ISO-8601 `YYYY-MM-DD` strings (not `Date`
 *   objects) to keep records trivially JSON-serializable and avoid
 *   timezone ambiguity across Node/browser environments.
 * - `ChequeStatus` is a closed string-literal union so the compiler
 *   enforces exhaustiveness at every call site (e.g. transition maps,
 *   switch statements) without relying on `any`.
 */

/** Lifecycle states a cheque record may occupy. */
export type ChequeStatus = 'pending' | 'cleared' | 'bounced' | 'cancelled';

/** All valid cheque statuses, useful for exhaustive iteration/validation. */
export const CHEQUE_STATUSES: readonly ChequeStatus[] = [
  'pending',
  'cleared',
  'bounced',
  'cancelled',
];

/**
 * A single tracked cheque, linked to a finance ledger entry (lease,
 * invoice, deposit, or service charge) via `ledgerReference`.
 */
export interface ChequeRecord {
  readonly id: string;
  readonly chequeNumber: string;
  readonly amount: number;
  readonly issueDate: string;
  readonly clearedDate?: string;
  readonly ledgerReference: string;
  readonly status: ChequeStatus;
  readonly note?: string;
}

/**
 * Input shape accepted when creating a new cheque record. `status` is
 * intentionally omitted: newly created records always start `pending`.
 */
export type ChequeRecordInput = Omit<ChequeRecord, 'status' | 'clearedDate'> & {
  readonly clearedDate?: string;
};

/**
 * Options accepted when transitioning a cheque to a new status.
 */
export interface ChequeTransitionOptions {
  readonly clearedDate?: string;
  readonly note?: string;
}

/** Adjacency map describing allowed lifecycle transitions. */
export type ChequeTransitionMap = Readonly<Record<ChequeStatus, readonly ChequeStatus[]>>;

export const CHEQUE_TRANSITIONS: ChequeTransitionMap = {
  pending: ['cleared', 'bounced', 'cancelled'],
  cleared: [],
  bounced: [],
  cancelled: [],
};

/** Type guard: narrows an arbitrary string to `ChequeStatus`. */
export function isChequeStatus(value: string): value is ChequeStatus {
  return (CHEQUE_STATUSES as readonly string[]).includes(value);
}

/**
 * Structural type guard for `ChequeRecord`. Performs shape/type checks
 * only (not business-rule validation, which belongs in
 * `financeEngineChequeRegistry.logic.ts`'s `validateChequeRecord`).
 */
export function isChequeRecord(value: unknown): value is ChequeRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  const hasRequiredStrings =
    typeof record.id === 'string' &&
    typeof record.chequeNumber === 'string' &&
    typeof record.issueDate === 'string' &&
    typeof record.ledgerReference === 'string';

  const hasValidAmount = typeof record.amount === 'number';

  const hasValidStatus = typeof record.status === 'string' && isChequeStatus(record.status);

  const hasValidOptionalClearedDate =
    record.clearedDate === undefined || typeof record.clearedDate === 'string';

  const hasValidOptionalNote = record.note === undefined || typeof record.note === 'string';

  return (
    hasRequiredStrings &&
    hasValidAmount &&
    hasValidStatus &&
    hasValidOptionalClearedDate &&
    hasValidOptionalNote
  );
}
