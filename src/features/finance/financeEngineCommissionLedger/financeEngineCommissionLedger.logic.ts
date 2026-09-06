/**
 * financeEngineCommissionLedger.logic.ts
 *
 * Child scope of parent issue #1930 (Issue #2459).
 *
 * Provides pure, deterministic logic for maintaining a commission ledger:
 * recording commission entries earned by agents/brokers on property deals,
 * tracking their settlement (paid/pending/void) status, and computing
 * aggregate summaries. No I/O, no database, no GitHub mutation — pure
 * in-memory data transformations only, per the excluded-scope constraints.
 */

/** Status of an individual commission ledger entry. */
export type CommissionEntryStatus = 'pending' | 'paid' | 'void';

/** Input required to create a new commission ledger entry. */
export interface CommissionEntryInput {
  /** Unique identifier of the underlying deal/transaction. */
  dealId: string;
  /** Unique identifier of the agent/broker earning the commission. */
  agentId: string;
  /** Gross sale/lease amount the commission is calculated from. */
  grossAmount: number;
  /** Commission rate expressed as a decimal fraction (e.g. 0.025 for 2.5%). */
  commissionRate: number;
  /** ISO-8601 date string for when the commission was earned. */
  earnedAt: string;
  /** Optional free-text note. */
  note?: string;
}

/** A fully materialized commission ledger entry. */
export interface CommissionLedgerEntry {
  id: string;
  dealId: string;
  agentId: string;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionEntryStatus;
  earnedAt: string;
  settledAt: string | null;
  note: string | null;
}

/** Aggregate summary of commission ledger entries. */
export interface CommissionLedgerSummary {
  totalEntries: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  voidCommission: number;
  byAgent: Record<string, number>;
}

/** Error thrown when ledger input fails validation. */
export class CommissionLedgerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommissionLedgerValidationError';
  }
}

/** Error thrown when an operation targets an entry that does not exist. */
export class CommissionLedgerNotFoundError extends Error {
  constructor(entryId: string) {
    super(`Commission ledger entry not found: ${entryId}`);
    this.name = 'CommissionLedgerNotFoundError';
  }
}

/** Error thrown when a status transition is not permitted. */
export class CommissionLedgerTransitionError extends Error {
  constructor(from: CommissionEntryStatus, to: CommissionEntryStatus) {
    super(`Illegal commission ledger status transition: ${from} -> ${to}`);
    this.name = 'CommissionLedgerTransitionError';
  }
}

/** Rounds a monetary value to 2 decimal places using standard rounding. */
function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function validateInput(input: CommissionEntryInput): void {
  if (!input.dealId || input.dealId.trim().length === 0) {
    throw new CommissionLedgerValidationError('dealId is required.');
  }
  if (!input.agentId || input.agentId.trim().length === 0) {
    throw new CommissionLedgerValidationError('agentId is required.');
  }
  if (!Number.isFinite(input.grossAmount) || input.grossAmount < 0) {
    throw new CommissionLedgerValidationError('grossAmount must be a non-negative finite number.');
  }
  if (
    !Number.isFinite(input.commissionRate) ||
    input.commissionRate < 0 ||
    input.commissionRate > 1
  ) {
    throw new CommissionLedgerValidationError(
      'commissionRate must be a finite number between 0 and 1.'
    );
  }
  if (Number.isNaN(Date.parse(input.earnedAt))) {
    throw new CommissionLedgerValidationError('earnedAt must be a valid ISO-8601 date string.');
  }
}

/** Allowed forward status transitions for a commission ledger entry. */
const ALLOWED_TRANSITIONS: Record<CommissionEntryStatus, CommissionEntryStatus[]> = {
  pending: ['paid', 'void'],
  paid: [],
  void: [],
};

let autoIncrementSeed = 0;

/** Generates a reasonably unique, deterministic-per-process ledger entry id. */
function generateEntryId(): string {
  autoIncrementSeed += 1;
  return `commission-${Date.now()}-${autoIncrementSeed}`;
}

/**
 * Creates a new commission ledger entry from validated input, computing the
 * commission amount from gross amount and rate.
 */
export function createCommissionEntry(input: CommissionEntryInput): CommissionLedgerEntry {
  validateInput(input);

  const commissionAmount = roundCurrency(input.grossAmount * input.commissionRate);

  return {
    id: generateEntryId(),
    dealId: input.dealId,
    agentId: input.agentId,
    grossAmount: roundCurrency(input.grossAmount),
    commissionRate: input.commissionRate,
    commissionAmount,
    status: 'pending',
    earnedAt: input.earnedAt,
    settledAt: null,
    note: input.note && input.note.trim().length > 0 ? input.note : null,
  };
}

/**
 * Transitions a commission ledger entry to a new status, enforcing the
 * allowed transition graph. Returns a new entry object; does not mutate
 * the input.
 */
export function transitionCommissionEntry(
  entry: CommissionLedgerEntry,
  nextStatus: CommissionEntryStatus,
  settledAt?: string
): CommissionLedgerEntry {
  if (entry.status === nextStatus) {
    return entry;
  }

  const allowed = ALLOWED_TRANSITIONS[entry.status];
  if (!allowed.includes(nextStatus)) {
    throw new CommissionLedgerTransitionError(entry.status, nextStatus);
  }

  const resolvedSettledAt =
    nextStatus === 'paid' || nextStatus === 'void' ? (settledAt ?? new Date().toISOString()) : null;

  return {
    ...entry,
    status: nextStatus,
    settledAt: resolvedSettledAt,
  };
}

/** Finds an entry by id within a ledger, throwing if it does not exist. */
export function findCommissionEntry(
  ledger: readonly CommissionLedgerEntry[],
  entryId: string
): CommissionLedgerEntry {
  const found = ledger.find(entry => entry.id === entryId);
  if (!found) {
    throw new CommissionLedgerNotFoundError(entryId);
  }
  return found;
}

/**
 * Returns a new ledger array with the targeted entry replaced by the result
 * of applying the given status transition. Does not mutate the input array.
 */
export function applyTransitionToLedger(
  ledger: readonly CommissionLedgerEntry[],
  entryId: string,
  nextStatus: CommissionEntryStatus,
  settledAt?: string
): CommissionLedgerEntry[] {
  const target = findCommissionEntry(ledger, entryId);
  const updated = transitionCommissionEntry(target, nextStatus, settledAt);
  return ledger.map(entry => (entry.id === entryId ? updated : entry));
}

/** Filters ledger entries by status. */
export function filterByStatus(
  ledger: readonly CommissionLedgerEntry[],
  status: CommissionEntryStatus
): CommissionLedgerEntry[] {
  return ledger.filter(entry => entry.status === status);
}

/** Filters ledger entries belonging to a specific agent. */
export function filterByAgent(
  ledger: readonly CommissionLedgerEntry[],
  agentId: string
): CommissionLedgerEntry[] {
  return ledger.filter(entry => entry.agentId === agentId);
}

/**
 * Computes an aggregate summary of a commission ledger: totals by status
 * and per-agent commission totals.
 */
export function summarizeCommissionLedger(
  ledger: readonly CommissionLedgerEntry[]
): CommissionLedgerSummary {
  const summary: CommissionLedgerSummary = {
    totalEntries: ledger.length,
    totalCommission: 0,
    paidCommission: 0,
    pendingCommission: 0,
    voidCommission: 0,
    byAgent: {},
  };

  for (const entry of ledger) {
    summary.totalCommission = roundCurrency(summary.totalCommission + entry.commissionAmount);

    if (entry.status === 'paid') {
      summary.paidCommission = roundCurrency(summary.paidCommission + entry.commissionAmount);
    } else if (entry.status === 'pending') {
      summary.pendingCommission = roundCurrency(summary.pendingCommission + entry.commissionAmount);
    } else {
      summary.voidCommission = roundCurrency(summary.voidCommission + entry.commissionAmount);
    }

    const existingAgentTotal = summary.byAgent[entry.agentId] ?? 0;
    summary.byAgent[entry.agentId] = roundCurrency(existingAgentTotal + entry.commissionAmount);
  }

  return summary;
}
