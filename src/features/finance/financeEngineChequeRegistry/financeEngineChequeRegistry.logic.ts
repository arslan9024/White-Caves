/**
 * Finance Engine Cheque Registry
 *
 * Pure, dependency-free TypeScript library that models cheque records,
 * validates them, enforces lifecycle transitions, and offers query /
 * aggregation helpers. It has no persistence, no network calls, and no
 * mutation of shared state.
 *
 * Spec source of truth:
 * - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-CHEQUE-1938.md
 * - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-CHEQUE-1938.md
 *
 * Parent issue: #1938 (remains open; this module does not close it).
 */

export type ChequeStatus = 'pending' | 'cleared' | 'bounced' | 'cancelled';

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

export interface CreateChequeRecordInput {
  readonly id: string;
  readonly chequeNumber: string;
  readonly amount: number;
  readonly issueDate: string;
  readonly ledgerReference: string;
  readonly note?: string;
}

export interface TransitionChequeOptions {
  readonly clearedDate?: string;
  readonly note?: string;
}

const ALLOWED_TRANSITIONS: Record<ChequeStatus, ChequeStatus[]> = {
  pending: ['cleared', 'bounced', 'cancelled'],
  cleared: [],
  bounced: [],
  cancelled: [],
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(value + 'T00:00:00.000Z');
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }
  // Guard against JS Date normalizing invalid calendar dates (e.g. 2024-02-30).
  return parsed.toISOString().slice(0, 10) === value;
}

/**
 * Validates a cheque record against the module invariants (FR-2 – FR-5).
 * Returns an array of human-readable violation messages; an empty array
 * means the record is valid.
 */
export function validateChequeRecord(record: ChequeRecord): string[] {
  const violations: string[] = [];

  if (!Number.isFinite(record.amount) || record.amount <= 0) {
    violations.push('amount must be a finite number greater than zero');
  }

  if (record.chequeNumber.trim().length === 0) {
    violations.push('chequeNumber must be a non-empty trimmed string');
  }

  if (record.ledgerReference.trim().length === 0) {
    violations.push('ledgerReference must be a non-empty trimmed string');
  }

  if (!isValidIsoDate(record.issueDate)) {
    violations.push('issueDate must be a valid ISO-8601 (YYYY-MM-DD) date');
  }

  if (record.clearedDate !== undefined) {
    if (!isValidIsoDate(record.clearedDate)) {
      violations.push('clearedDate must be a valid ISO-8601 (YYYY-MM-DD) date');
    } else if (isValidIsoDate(record.issueDate) && record.clearedDate < record.issueDate) {
      violations.push('clearedDate must not be earlier than issueDate');
    }
  }

  return violations;
}

/**
 * Builds a new `ChequeRecord` in `pending` status. Trims `chequeNumber`
 * and `ledgerReference` before storing. Throws if the constructed record
 * violates any invariant.
 */
export function createChequeRecord(input: CreateChequeRecordInput): ChequeRecord {
  const record: ChequeRecord = {
    id: input.id,
    chequeNumber: input.chequeNumber.trim(),
    amount: input.amount,
    issueDate: input.issueDate,
    ledgerReference: input.ledgerReference.trim(),
    status: 'pending',
    ...(input.note !== undefined ? { note: input.note } : {}),
  };

  const violations = validateChequeRecord(record);
  if (violations.length > 0) {
    throw new Error(violations.join('; '));
  }

  return record;
}

/**
 * Pure lookup of whether a lifecycle transition from `from` to `to` is
 * permitted (FR-6).
 */
export function canTransition(from: ChequeStatus, to: ChequeStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * Transitions a cheque record to a new status, returning a new object
 * (never mutating the input). Throws if the transition is not permitted,
 * if a required `clearedDate` is missing for `cleared`/`bounced`
 * transitions, or if the resulting record is invalid.
 */
export function transitionCheque(
  record: ChequeRecord,
  toStatus: ChequeStatus,
  options?: TransitionChequeOptions
): ChequeRecord {
  if (!canTransition(record.status, toStatus)) {
    throw new Error(`Invalid cheque transition: ${record.status} -> ${toStatus}`);
  }

  if ((toStatus === 'cleared' || toStatus === 'bounced') && !options?.clearedDate) {
    throw new Error(`clearedDate is required when transitioning to ${toStatus}`);
  }

  const nextNote = options?.note !== undefined ? options.note : record.note;

  const updated: ChequeRecord = {
    ...record,
    status: toStatus,
    ...(options?.clearedDate !== undefined ? { clearedDate: options.clearedDate } : {}),
    ...(nextNote !== undefined ? { note: nextNote } : {}),
  };

  const violations = validateChequeRecord(updated);
  if (violations.length > 0) {
    throw new Error(violations.join('; '));
  }

  return updated;
}

/**
 * Returns the subset of `records` matching the given `status` (FR-7).
 */
export function filterByStatus(
  records: readonly ChequeRecord[],
  status: ChequeStatus
): ChequeRecord[] {
  return records.filter(record => record.status === status);
}

/**
 * Returns the subset of `records` matching the given `ledgerReference`
 * (FR-7).
 */
export function filterByLedgerReference(
  records: readonly ChequeRecord[],
  ledgerReference: string
): ChequeRecord[] {
  return records.filter(record => record.ledgerReference === ledgerReference);
}

/**
 * Returns the total outstanding (`pending`) cheque amount across `records`
 * (FR-8).
 */
export function sumOutstandingAmount(records: readonly ChequeRecord[]): number {
  return records
    .filter(record => record.status === 'pending')
    .reduce((sum, record) => sum + record.amount, 0);
}
