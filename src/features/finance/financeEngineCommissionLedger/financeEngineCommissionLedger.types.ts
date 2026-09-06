/**
 * Type definitions for the Finance Engine Commission Ledger feature.
 *
 * This module models the commission ledger entries that track commission
 * accruals, adjustments, and payouts for agents/brokers within the finance
 * engine. It intentionally contains only types, type guards, and pure
 * helper functions -- no side effects, no I/O.
 */

/** Supported commission ledger entry statuses across their lifecycle. */
export type CommissionLedgerEntryStatus = 'pending' | 'approved' | 'paid' | 'reversed' | 'voided';

/** The kind of monetary movement a ledger entry represents. */
export type CommissionLedgerEntryType = 'accrual' | 'adjustment' | 'payout' | 'reversal';

/** ISO 4217 currency code, constrained to a 3-letter uppercase string. */
export type CurrencyCode = string;

/**
 * A single monetary amount tied to a currency. Amounts are always stored
 * as integer minor units (e.g. cents) to avoid floating point drift.
 */
export interface MonetaryAmount {
  /** Integer amount in the currency's minor unit (e.g. cents). */
  readonly minorUnits: number;
  /** ISO 4217 currency code, e.g. "USD", "AED". */
  readonly currency: CurrencyCode;
}

/** Identifies the party (agent/broker) a commission ledger entry belongs to. */
export interface CommissionBeneficiary {
  readonly id: string;
  readonly displayName: string;
}

/** A single, immutable line item in the commission ledger. */
export interface CommissionLedgerEntry {
  readonly id: string;
  readonly beneficiary: CommissionBeneficiary;
  readonly type: CommissionLedgerEntryType;
  readonly status: CommissionLedgerEntryStatus;
  readonly amount: MonetaryAmount;
  /** Related deal/transaction identifier this entry was generated from. */
  readonly dealId: string;
  /** ISO 8601 timestamp of when the entry was created. */
  readonly createdAt: string;
  /** ISO 8601 timestamp of the last status transition, if any. */
  readonly updatedAt?: string;
  /** Free-form note explaining adjustments or reversals. */
  readonly memo?: string;
}

/** Aggregated ledger totals for a single beneficiary. */
export interface CommissionLedgerSummary {
  readonly beneficiaryId: string;
  readonly currency: CurrencyCode;
  readonly totalAccruedMinorUnits: number;
  readonly totalPaidMinorUnits: number;
  readonly totalReversedMinorUnits: number;
  readonly outstandingMinorUnits: number;
}

/** Input required to append a new entry to the ledger. */
export interface CreateCommissionLedgerEntryInput {
  readonly beneficiary: CommissionBeneficiary;
  readonly type: CommissionLedgerEntryType;
  readonly amount: MonetaryAmount;
  readonly dealId: string;
  readonly memo?: string;
}

/** Valid terminal statuses that indicate no further transitions are allowed. */
export const TERMINAL_COMMISSION_LEDGER_STATUSES: readonly CommissionLedgerEntryStatus[] = [
  'paid',
  'reversed',
  'voided',
];

const COMMISSION_LEDGER_ENTRY_STATUSES: readonly CommissionLedgerEntryStatus[] = [
  'pending',
  'approved',
  'paid',
  'reversed',
  'voided',
];

const COMMISSION_LEDGER_ENTRY_TYPES: readonly CommissionLedgerEntryType[] = [
  'accrual',
  'adjustment',
  'payout',
  'reversal',
];

/** Allowed status transitions for a commission ledger entry's lifecycle. */
export const COMMISSION_LEDGER_STATUS_TRANSITIONS: Readonly<
  Record<CommissionLedgerEntryStatus, readonly CommissionLedgerEntryStatus[]>
> = {
  pending: ['approved', 'voided'],
  approved: ['paid', 'reversed', 'voided'],
  paid: ['reversed'],
  reversed: [],
  voided: [],
};

/** Type guard for {@link CommissionLedgerEntryStatus}. */
export function isCommissionLedgerEntryStatus(
  value: unknown
): value is CommissionLedgerEntryStatus {
  return (
    typeof value === 'string' &&
    (COMMISSION_LEDGER_ENTRY_STATUSES as readonly string[]).includes(value)
  );
}

/** Type guard for {@link CommissionLedgerEntryType}. */
export function isCommissionLedgerEntryType(value: unknown): value is CommissionLedgerEntryType {
  return (
    typeof value === 'string' &&
    (COMMISSION_LEDGER_ENTRY_TYPES as readonly string[]).includes(value)
  );
}

/** Returns true if the given amount is a well-formed {@link MonetaryAmount}. */
export function isMonetaryAmount(value: unknown): value is MonetaryAmount {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.minorUnits === 'number' &&
    Number.isInteger(candidate.minorUnits) &&
    typeof candidate.currency === 'string' &&
    /^[A-Z]{3}$/.test(candidate.currency)
  );
}

/** Type guard for {@link CommissionLedgerEntry}. */
export function isCommissionLedgerEntry(value: unknown): value is CommissionLedgerEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  const beneficiary = candidate.beneficiary as Record<string, unknown> | undefined;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof beneficiary === 'object' &&
    beneficiary !== null &&
    typeof beneficiary.id === 'string' &&
    typeof beneficiary.displayName === 'string' &&
    isCommissionLedgerEntryType(candidate.type) &&
    isCommissionLedgerEntryStatus(candidate.status) &&
    isMonetaryAmount(candidate.amount) &&
    typeof candidate.dealId === 'string' &&
    typeof candidate.createdAt === 'string'
  );
}

/**
 * Determines whether an entry may transition from `from` to `to` according
 * to {@link COMMISSION_LEDGER_STATUS_TRANSITIONS}.
 */
export function canTransitionCommissionLedgerStatus(
  from: CommissionLedgerEntryStatus,
  to: CommissionLedgerEntryStatus
): boolean {
  return COMMISSION_LEDGER_STATUS_TRANSITIONS[from].includes(to);
}

/** Returns true when the given status is terminal (no further transitions). */
export function isTerminalCommissionLedgerStatus(status: CommissionLedgerEntryStatus): boolean {
  return TERMINAL_COMMISSION_LEDGER_STATUSES.includes(status);
}

/**
 * Computes an aggregated {@link CommissionLedgerSummary} for a single
 * beneficiary from a list of ledger entries. All entries must share the
 * same currency; entries with a mismatched currency are ignored.
 *
 * Sign conventions: `accrual` and `payout` contribute positively toward
 * accrued/paid totals respectively; `reversal` contributes to the reversed
 * total; `adjustment` amounts may be positive or negative and are folded
 * into the accrued total.
 */
export function summarizeCommissionLedgerEntries(
  beneficiaryId: string,
  currency: CurrencyCode,
  entries: readonly CommissionLedgerEntry[]
): CommissionLedgerSummary {
  let totalAccruedMinorUnits = 0;
  let totalPaidMinorUnits = 0;
  let totalReversedMinorUnits = 0;

  for (const entry of entries) {
    if (entry.beneficiary.id !== beneficiaryId || entry.amount.currency !== currency) {
      continue;
    }
    switch (entry.type) {
      case 'accrual':
      case 'adjustment':
        totalAccruedMinorUnits += entry.amount.minorUnits;
        break;
      case 'payout':
        totalPaidMinorUnits += entry.amount.minorUnits;
        break;
      case 'reversal':
        totalReversedMinorUnits += entry.amount.minorUnits;
        break;
      default: {
        const exhaustiveCheck: never = entry.type;
        throw new Error(`Unhandled commission ledger entry type: ${String(exhaustiveCheck)}`);
      }
    }
  }

  const outstandingMinorUnits =
    totalAccruedMinorUnits - totalPaidMinorUnits - totalReversedMinorUnits;

  return {
    beneficiaryId,
    currency,
    totalAccruedMinorUnits,
    totalPaidMinorUnits,
    totalReversedMinorUnits,
    outstandingMinorUnits,
  };
}
