/**
 * financeEngineCommissionLedger.types.ts
 *
 * Type definitions and pure helper utilities for the Finance Engine's
 * Commission Ledger domain. This module tracks commission entries earned
 * by agents against deals, their lifecycle status, and derived summaries
 * used for payout reconciliation.
 *
 * Parent issue: #1930
 */

/** Lifecycle status of a single commission ledger entry. */
export type CommissionLedgerStatus = 'pending' | 'approved' | 'paid' | 'reversed' | 'disputed';

/** The category of commission being recorded. */
export type CommissionType = 'referral' | 'sale' | 'renewal' | 'bonus' | 'override';

/** ISO 4217 currency code, kept as a branded-ish string alias for clarity. */
export type CurrencyCode = string;

/** All valid commission ledger statuses, used for guards and iteration. */
export const COMMISSION_LEDGER_STATUSES: readonly CommissionLedgerStatus[] = [
  'pending',
  'approved',
  'paid',
  'reversed',
  'disputed',
];

/** All valid commission types, used for guards and iteration. */
export const COMMISSION_TYPES: readonly CommissionType[] = [
  'referral',
  'sale',
  'renewal',
  'bonus',
  'override',
];

/** A single commission ledger entry belonging to an agent for a specific deal. */
export interface CommissionLedgerEntry {
  readonly id: string;
  readonly agentId: string;
  readonly dealId: string;
  readonly type: CommissionType;
  readonly status: CommissionLedgerStatus;
  /** The gross deal amount the commission rate is applied to. */
  readonly grossAmount: number;
  /** Commission rate expressed as a decimal fraction, e.g. 0.05 for 5%. */
  readonly commissionRate: number;
  /** The computed commission amount (grossAmount * commissionRate), rounded. */
  readonly netAmount: number;
  readonly currency: CurrencyCode;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly paidAt?: string;
  readonly reversedAt?: string;
  readonly notes?: string;
}

/** Aggregated totals for a set of commission ledger entries, typically per agent. */
export interface CommissionLedgerSummary {
  readonly agentId: string;
  readonly entryCount: number;
  readonly totalGross: number;
  readonly totalNet: number;
  readonly totalPaid: number;
  readonly totalPending: number;
  readonly totalReversed: number;
  readonly currency: CurrencyCode;
}

/** Error thrown when commission ledger entries fail structural validation. */
export class CommissionLedgerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommissionLedgerValidationError';
  }
}

/** Type guard for {@link CommissionLedgerStatus}. */
export function isCommissionLedgerStatus(value: unknown): value is CommissionLedgerStatus {
  return (
    typeof value === 'string' && (COMMISSION_LEDGER_STATUSES as readonly string[]).includes(value)
  );
}

/** Type guard for {@link CommissionType}. */
export function isCommissionType(value: unknown): value is CommissionType {
  return typeof value === 'string' && (COMMISSION_TYPES as readonly string[]).includes(value);
}

/**
 * Type guard verifying that an unknown value conforms to the
 * {@link CommissionLedgerEntry} shape. Performs a shallow structural check;
 * it does not validate cross-field business rules (see {@link assertValidCommissionLedgerEntry}).
 */
export function isCommissionLedgerEntry(value: unknown): value is CommissionLedgerEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.agentId === 'string' &&
    typeof candidate.dealId === 'string' &&
    isCommissionType(candidate.type) &&
    isCommissionLedgerStatus(candidate.status) &&
    typeof candidate.grossAmount === 'number' &&
    typeof candidate.commissionRate === 'number' &&
    typeof candidate.netAmount === 'number' &&
    typeof candidate.currency === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    (candidate.paidAt === undefined || typeof candidate.paidAt === 'string') &&
    (candidate.reversedAt === undefined || typeof candidate.reversedAt === 'string') &&
    (candidate.notes === undefined || typeof candidate.notes === 'string')
  );
}

/**
 * Asserts that a commission ledger entry is structurally valid and enforces
 * business invariants (non-negative amounts, rate within [0, 1], consistent
 * net amount). Throws {@link CommissionLedgerValidationError} on failure.
 */
export function assertValidCommissionLedgerEntry(entry: CommissionLedgerEntry): void {
  if (!isCommissionLedgerEntry(entry)) {
    throw new CommissionLedgerValidationError(
      'Commission ledger entry failed structural validation.'
    );
  }
  if (entry.grossAmount < 0) {
    throw new CommissionLedgerValidationError('grossAmount must be non-negative.');
  }
  if (entry.commissionRate < 0 || entry.commissionRate > 1) {
    throw new CommissionLedgerValidationError('commissionRate must be between 0 and 1 inclusive.');
  }
  const expectedNet = calculateNetCommission(entry.grossAmount, entry.commissionRate);
  if (Math.abs(expectedNet - entry.netAmount) > 0.01) {
    throw new CommissionLedgerValidationError(
      `netAmount (${entry.netAmount}) does not match grossAmount * commissionRate (${expectedNet}).`
    );
  }
}

/**
 * Computes the net commission amount from a gross amount and a commission
 * rate, rounded to two decimal places (currency-safe rounding).
 */
export function calculateNetCommission(grossAmount: number, commissionRate: number): number {
  return Math.round(grossAmount * commissionRate * 100) / 100;
}

/** Returns true when an entry is eligible to be paid out (approved but not yet paid/reversed). */
export function isEntryPayable(entry: CommissionLedgerEntry): boolean {
  return entry.status === 'approved';
}

/** Returns true when an entry represents a final, immutable state. */
export function isEntryFinalized(entry: CommissionLedgerEntry): boolean {
  return entry.status === 'paid' || entry.status === 'reversed';
}

/**
 * Builds an aggregated {@link CommissionLedgerSummary} for a homogeneous list
 * of entries belonging to the same agent and currency. Throws if the list is
 * empty or mixes agents/currencies, since summaries are meaningless otherwise.
 */
export function summarizeCommissionLedgerEntries(
  entries: readonly CommissionLedgerEntry[]
): CommissionLedgerSummary {
  if (entries.length === 0) {
    throw new CommissionLedgerValidationError(
      'Cannot summarize an empty list of commission ledger entries.'
    );
  }

  const agentId = entries[0].agentId;
  const currency = entries[0].currency;

  const summary = entries.reduce<{
    totalGross: number;
    totalNet: number;
    totalPaid: number;
    totalPending: number;
    totalReversed: number;
  }>(
    (acc, entry) => {
      if (entry.agentId !== agentId) {
        throw new CommissionLedgerValidationError(
          'All entries must belong to the same agentId to be summarized together.'
        );
      }
      if (entry.currency !== currency) {
        throw new CommissionLedgerValidationError(
          'All entries must share the same currency to be summarized together.'
        );
      }

      acc.totalGross += entry.grossAmount;
      acc.totalNet += entry.netAmount;

      if (entry.status === 'paid') {
        acc.totalPaid += entry.netAmount;
      } else if (entry.status === 'pending' || entry.status === 'approved') {
        acc.totalPending += entry.netAmount;
      } else if (entry.status === 'reversed') {
        acc.totalReversed += entry.netAmount;
      }

      return acc;
    },
    {
      totalGross: 0,
      totalNet: 0,
      totalPaid: 0,
      totalPending: 0,
      totalReversed: 0,
    }
  );

  return {
    agentId,
    currency,
    entryCount: entries.length,
    totalGross: Math.round(summary.totalGross * 100) / 100,
    totalNet: Math.round(summary.totalNet * 100) / 100,
    totalPaid: Math.round(summary.totalPaid * 100) / 100,
    totalPending: Math.round(summary.totalPending * 100) / 100,
    totalReversed: Math.round(summary.totalReversed * 100) / 100,
  };
}

/**
 * Sorts commission ledger entries by createdAt ascending. Returns a new
 * array; the input is not mutated.
 */
export function sortCommissionLedgerEntriesByCreatedAt(
  entries: readonly CommissionLedgerEntry[]
): CommissionLedgerEntry[] {
  return [...entries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/** Filters entries down to those matching the provided status. */
export function filterCommissionLedgerEntriesByStatus(
  entries: readonly CommissionLedgerEntry[],
  status: CommissionLedgerStatus
): CommissionLedgerEntry[] {
  return entries.filter(entry => entry.status === status);
}
