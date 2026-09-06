/**
 * financeEngineRefundManagement.types.ts
 *
 * Domain types and pure helper functions for the Refund Management engine
 * (Finance module). Scope is limited to type definitions, type guards, and
 * side-effect-free validation/calculation helpers used by the refund
 * request lifecycle (requested -> approved/rejected -> processed).
 *
 * Parent issue: #1941
 * Child issue: #2412
 */

/** Lifecycle status of a refund request. */
export type RefundStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'processed'
  | 'failed'
  | 'cancelled';

/** Reason category for why a refund was requested. */
export type RefundReasonCode =
  | 'duplicate_payment'
  | 'booking_cancelled'
  | 'service_not_rendered'
  | 'billing_error'
  | 'customer_request'
  | 'goodwill'
  | 'other';

/** Method through which a refund is disbursed back to the customer. */
export type RefundMethod = 'original_payment_method' | 'bank_transfer' | 'store_credit' | 'cheque';

/** ISO-4217 currency code, e.g. "USD", "AED". */
export type CurrencyCode = string;

/** A single line item captured on a refund request, tied to an original charge line. */
export interface RefundLineItem {
  readonly id: string;
  readonly originalChargeId: string;
  readonly description: string;
  readonly amount: number;
}

/** An auditable status transition entry recorded on a refund request. */
export interface RefundStatusHistoryEntry {
  readonly status: RefundStatus;
  /** ISO-8601 timestamp for when the status transition occurred. */
  readonly occurredAt: string;
  readonly note?: string;
}

/** Core entity representing a refund request. */
export interface RefundRequest {
  readonly id: string;
  readonly invoiceId: string;
  readonly customerId: string;
  readonly currency: CurrencyCode;
  readonly status: RefundStatus;
  readonly reasonCode: RefundReasonCode;
  readonly method: RefundMethod;
  readonly lineItems: readonly RefundLineItem[];
  /** Maximum amount eligible for refund, typically the original paid amount. */
  readonly maxRefundableAmount: number;
  readonly statusHistory: readonly RefundStatusHistoryEntry[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Result of validating a refund request. */
export interface RefundValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

const VALID_STATUSES: readonly RefundStatus[] = [
  'requested',
  'approved',
  'rejected',
  'processing',
  'processed',
  'failed',
  'cancelled',
];

const VALID_REASON_CODES: readonly RefundReasonCode[] = [
  'duplicate_payment',
  'booking_cancelled',
  'service_not_rendered',
  'billing_error',
  'customer_request',
  'goodwill',
  'other',
];

const VALID_METHODS: readonly RefundMethod[] = [
  'original_payment_method',
  'bank_transfer',
  'store_credit',
  'cheque',
];

/** Terminal statuses from which no further transition is permitted. */
const TERMINAL_STATUSES: readonly RefundStatus[] = ['processed', 'failed', 'cancelled', 'rejected'];

/** Allowed forward transitions between refund statuses. */
const ALLOWED_TRANSITIONS: Record<RefundStatus, readonly RefundStatus[]> = {
  requested: ['approved', 'rejected', 'cancelled'],
  approved: ['processing', 'cancelled'],
  rejected: [],
  processing: ['processed', 'failed'],
  processed: [],
  failed: ['processing', 'cancelled'],
  cancelled: [],
};

/** Type guard for {@link RefundStatus}. */
export function isRefundStatus(value: unknown): value is RefundStatus {
  return typeof value === 'string' && (VALID_STATUSES as readonly string[]).includes(value);
}

/** Type guard for {@link RefundReasonCode}. */
export function isRefundReasonCode(value: unknown): value is RefundReasonCode {
  return typeof value === 'string' && (VALID_REASON_CODES as readonly string[]).includes(value);
}

/** Type guard for {@link RefundMethod}. */
export function isRefundMethod(value: unknown): value is RefundMethod {
  return typeof value === 'string' && (VALID_METHODS as readonly string[]).includes(value);
}

/** Returns true when the given refund status has no further valid transitions. */
export function isTerminalRefundStatus(status: RefundStatus): boolean {
  return (TERMINAL_STATUSES as readonly RefundStatus[]).includes(status);
}

/** Rounds a monetary value to two decimal places (cents), avoiding float drift. */
export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Computes the total requested refund amount by summing all line item amounts. */
export function calculateRefundTotal(request: Pick<RefundRequest, 'lineItems'>): number {
  return roundToCents(request.lineItems.reduce((sum, item) => sum + item.amount, 0));
}

/**
 * Determines whether a transition from `from` to `to` is permitted by the
 * refund status state machine.
 */
export function canTransitionRefundStatus(from: RefundStatus, to: RefundStatus): boolean {
  if (!isRefundStatus(from) || !isRefundStatus(to)) {
    return false;
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * Validates a refund request's structural and business invariants, including
 * that the requested total does not exceed the maximum refundable amount.
 * Returns a list of human-readable error messages; an empty list means valid.
 */
export function validateRefundRequest(request: RefundRequest): RefundValidationResult {
  const errors: string[] = [];

  if (!request.id || request.id.trim().length === 0) {
    errors.push('id is required');
  }
  if (!request.invoiceId || request.invoiceId.trim().length === 0) {
    errors.push('invoiceId is required');
  }
  if (!request.customerId || request.customerId.trim().length === 0) {
    errors.push('customerId is required');
  }
  if (!request.currency || request.currency.trim().length !== 3) {
    errors.push('currency must be a 3-letter ISO-4217 code');
  }
  if (!isRefundStatus(request.status)) {
    errors.push('status must be a valid refund status');
  }
  if (!isRefundReasonCode(request.reasonCode)) {
    errors.push('reasonCode must be a valid refund reason code');
  }
  if (!isRefundMethod(request.method)) {
    errors.push('method must be a valid refund method');
  }
  if (!(request.maxRefundableAmount >= 0)) {
    errors.push('maxRefundableAmount must be greater than or equal to 0');
  }

  if (!Array.isArray(request.lineItems) || request.lineItems.length === 0) {
    errors.push('lineItems must contain at least one item');
  } else {
    request.lineItems.forEach((item, index) => {
      if (!item.originalChargeId || item.originalChargeId.trim().length === 0) {
        errors.push(`lineItems[${index}].originalChargeId is required`);
      }
      if (!item.description || item.description.trim().length === 0) {
        errors.push(`lineItems[${index}].description is required`);
      }
      if (!(item.amount > 0)) {
        errors.push(`lineItems[${index}].amount must be greater than 0`);
      }
    });

    if (request.maxRefundableAmount >= 0) {
      const total = calculateRefundTotal(request);
      if (total > request.maxRefundableAmount) {
        errors.push('total refund amount must not exceed maxRefundableAmount');
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Appends a new status history entry for a status transition, validating
 * that the transition is legal per the refund status state machine. Throws
 * when the transition is not permitted.
 */
export function appendRefundStatusHistory(
  request: RefundRequest,
  nextStatus: RefundStatus,
  occurredAt: string,
  note?: string
): readonly RefundStatusHistoryEntry[] {
  if (!canTransitionRefundStatus(request.status, nextStatus)) {
    throw new Error(`cannot transition refund status from ${request.status} to ${nextStatus}`);
  }

  const entry: RefundStatusHistoryEntry = note
    ? { status: nextStatus, occurredAt, note }
    : { status: nextStatus, occurredAt };

  return [...request.statusHistory, entry];
}
