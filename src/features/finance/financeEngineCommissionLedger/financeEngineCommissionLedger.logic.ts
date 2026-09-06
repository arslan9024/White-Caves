/**
 * Finance Engine Commission Ledger — core business logic.
 *
 * Tracks commission ledger entries generated when a deal (property sale/
 * lease) closes and an agent becomes entitled to a commission payout.
 * The ledger is an append/transition oriented model: entries move through
 * a well defined status lifecycle and every transition returns a new
 * (immutable) entry object rather than mutating the input.
 *
 * Status lifecycle:
 *   pending -> approved -> paid
 *   pending -> approved -> reversed
 *   pending -> reversed
 */

export type CommissionLedgerStatus = 'pending' | 'approved' | 'paid' | 'reversed';

export interface CommissionLedgerEntry {
  readonly id: string;
  readonly agentId: string;
  readonly dealId: string;
  /** Commission amount, rounded to 2 decimal places. */
  readonly amount: number;
  readonly currency: string;
  readonly status: CommissionLedgerStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly notes?: string;
  readonly reversalReason?: string;
}

export interface CreateCommissionLedgerEntryInput {
  readonly id: string;
  readonly agentId: string;
  readonly dealId: string;
  readonly amount: number;
  readonly currency: string;
  readonly notes?: string;
  readonly createdAt?: string;
}

export interface CommissionLedgerSummary {
  readonly totalPending: number;
  readonly totalApproved: number;
  readonly totalPaid: number;
  readonly totalReversed: number;
  readonly totalOutstanding: number;
}

const VALID_STATUS_TRANSITIONS: Readonly<
  Record<CommissionLedgerStatus, ReadonlyArray<CommissionLedgerStatus>>
> = {
  pending: ['approved', 'reversed'],
  approved: ['paid', 'reversed'],
  paid: [],
  reversed: [],
};

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

/** Rounds a numeric amount to 2 decimal places, avoiding common float drift. */
export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Validates a commission ledger entry creation input.
 * Returns an array of human readable error messages; empty array means valid.
 */
export function validateCreateCommissionLedgerEntryInput(
  input: CreateCommissionLedgerEntryInput
): string[] {
  const errors: string[] = [];

  if (!input.id || input.id.trim().length === 0) {
    errors.push('id is required');
  }
  if (!input.agentId || input.agentId.trim().length === 0) {
    errors.push('agentId is required');
  }
  if (!input.dealId || input.dealId.trim().length === 0) {
    errors.push('dealId is required');
  }
  if (typeof input.amount !== 'number' || Number.isNaN(input.amount)) {
    errors.push('amount must be a valid number');
  } else if (!Number.isFinite(input.amount)) {
    errors.push('amount must be finite');
  } else if (input.amount <= 0) {
    errors.push('amount must be greater than zero');
  }
  if (!input.currency || !CURRENCY_CODE_PATTERN.test(input.currency)) {
    errors.push('currency must be a 3-letter uppercase ISO code');
  }

  return errors;
}

/**
 * Creates a new commission ledger entry in the `pending` status.
 * Throws if the input fails validation.
 */
export function createCommissionLedgerEntry(
  input: CreateCommissionLedgerEntryInput
): CommissionLedgerEntry {
  const errors = validateCreateCommissionLedgerEntryInput(input);
  if (errors.length > 0) {
    throw new Error(`Invalid commission ledger entry: ${errors.join(', ')}`);
  }

  const timestamp = input.createdAt ?? new Date().toISOString();

  return {
    id: input.id,
    agentId: input.agentId,
    dealId: input.dealId,
    amount: roundToCents(input.amount),
    currency: input.currency,
    status: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp,
    notes: input.notes,
  };
}

function assertTransitionAllowed(entry: CommissionLedgerEntry, next: CommissionLedgerStatus): void {
  const allowed = VALID_STATUS_TRANSITIONS[entry.status];
  if (!allowed.includes(next)) {
    throw new Error(
      `Cannot transition commission ledger entry ${entry.id} from '${entry.status}' to '${next}'`
    );
  }
}

/** Transitions a pending entry into the approved state. */
export function approveCommissionLedgerEntry(
  entry: CommissionLedgerEntry,
  updatedAt: string = new Date().toISOString()
): CommissionLedgerEntry {
  assertTransitionAllowed(entry, 'approved');
  return { ...entry, status: 'approved', updatedAt };
}

/** Transitions an approved entry into the paid state. */
export function markCommissionLedgerEntryPaid(
  entry: CommissionLedgerEntry,
  updatedAt: string = new Date().toISOString()
): CommissionLedgerEntry {
  assertTransitionAllowed(entry, 'paid');
  return { ...entry, status: 'paid', updatedAt };
}

/** Reverses a pending or approved entry, recording the reason. */
export function reverseCommissionLedgerEntry(
  entry: CommissionLedgerEntry,
  reason: string,
  updatedAt: string = new Date().toISOString()
): CommissionLedgerEntry {
  if (!reason || reason.trim().length === 0) {
    throw new Error('A non-empty reversal reason is required');
  }
  assertTransitionAllowed(entry, 'reversed');
  return {
    ...entry,
    status: 'reversed',
    reversalReason: reason,
    updatedAt,
  };
}

/**
 * Sums the amount of entries, optionally filtered by status.
 * Entries with mismatched currency to the first entry are still summed
 * numerically; callers are responsible for currency segregation upstream.
 */
export function calculateTotalCommission(
  entries: ReadonlyArray<CommissionLedgerEntry>,
  status?: CommissionLedgerStatus
): number {
  const filtered = status === undefined ? entries : entries.filter(e => e.status === status);
  const total = filtered.reduce((sum, entry) => sum + entry.amount, 0);
  return roundToCents(total);
}

/** Groups total commission amounts by agentId, across all statuses provided. */
export function groupCommissionTotalsByAgent(
  entries: ReadonlyArray<CommissionLedgerEntry>
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const entry of entries) {
    const current = totals[entry.agentId] ?? 0;
    totals[entry.agentId] = roundToCents(current + entry.amount);
  }
  return totals;
}

/** Builds an aggregate summary of the ledger across all lifecycle states. */
export function summarizeCommissionLedger(
  entries: ReadonlyArray<CommissionLedgerEntry>
): CommissionLedgerSummary {
  const totalPending = calculateTotalCommission(entries, 'pending');
  const totalApproved = calculateTotalCommission(entries, 'approved');
  const totalPaid = calculateTotalCommission(entries, 'paid');
  const totalReversed = calculateTotalCommission(entries, 'reversed');

  return {
    totalPending,
    totalApproved,
    totalPaid,
    totalReversed,
    totalOutstanding: roundToCents(totalPending + totalApproved),
  };
}

/** Returns only the entries belonging to a given agent. */
export function filterCommissionLedgerEntriesByAgent(
  entries: ReadonlyArray<CommissionLedgerEntry>,
  agentId: string
): CommissionLedgerEntry[] {
  return entries.filter(entry => entry.agentId === agentId);
}

/** Returns only the entries belonging to a given deal. */
export function filterCommissionLedgerEntriesByDeal(
  entries: ReadonlyArray<CommissionLedgerEntry>,
  dealId: string
): CommissionLedgerEntry[] {
  return entries.filter(entry => entry.dealId === dealId);
}

/** Returns true if the entry can still be transitioned (not terminal). */
export function isCommissionLedgerEntryActionable(entry: CommissionLedgerEntry): boolean {
  return VALID_STATUS_TRANSITIONS[entry.status].length > 0;
}
