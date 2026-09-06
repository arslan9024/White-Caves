/**
 * Finance Engine — Refund Management
 * -----------------------------------
 * Child scope of parent issue #1941 (Finance Engine), tracked as issue #2413.
 *
 * This module implements the pure business logic for handling refund
 * requests raised against orders: eligibility validation, fee/amount
 * calculation, state-machine transitions, and a small in-memory ledger
 * used to aggregate refund activity per order.
 *
 * The module is intentionally free of any I/O (no network/database calls)
 * so it can be unit tested deterministically and composed by higher level
 * services (API handlers, queues, etc.) elsewhere in the finance engine.
 */

/** Reasons a customer/agent may cite when requesting a refund. */
export type RefundReason =
  | 'customer_request'
  | 'duplicate_charge'
  | 'service_not_rendered'
  | 'billing_error'
  | 'fraud'
  | 'other';

/** Lifecycle states a refund record can occupy. */
export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';

/** Policy configuration governing refund eligibility and fees. */
export interface RefundPolicy {
  /** Number of days after the order date during which refunds are allowed. */
  readonly windowDays: number;
  /** Percentage (0-100) of the refund amount withheld as a processing fee. */
  readonly feePercentage: number;
  /** Item identifiers that are explicitly excluded from refunds. */
  readonly nonRefundableItemIds?: readonly string[];
  /** Minimum refundable amount (in the smallest currency unit, e.g. cents). */
  readonly minimumRefundAmount?: number;
}

/** Default policy used when callers do not supply one explicitly. */
export const DEFAULT_REFUND_POLICY: RefundPolicy = {
  windowDays: 30,
  feePercentage: 0,
  nonRefundableItemIds: [],
  minimumRefundAmount: 0,
};

/** Incoming request to refund all or part of an order. */
export interface RefundRequest {
  readonly id: string;
  readonly orderId: string;
  /** Requested refund amount, in the smallest currency unit (e.g. cents). Must be > 0. */
  readonly amount: number;
  readonly orderDate: Date;
  readonly requestedAt: Date;
  readonly reason: RefundReason;
  /** Optional identifier of a specific line item being refunded. */
  readonly itemId?: string;
}

/** Result of amount/fee calculation for an eligible refund. */
export interface RefundCalculation {
  readonly refundAmount: number;
  readonly feeCharged: number;
  readonly netAmount: number;
}

/** Result of validating a refund request against a policy. */
export interface RefundValidationResult {
  readonly valid: boolean;
  readonly reason?: string;
}

/** Persisted representation of a refund as it moves through its lifecycle. */
export interface RefundRecord extends RefundRequest {
  readonly status: RefundStatus;
  readonly refundAmount?: number;
  readonly feeCharged?: number;
  readonly netAmount?: number;
  readonly rejectionReason?: string;
  readonly failureReason?: string;
  readonly processedAt?: Date;
}

/** Error thrown when an invalid state transition is attempted. */
export class RefundTransitionError extends Error {
  constructor(
    public readonly from: RefundStatus,
    public readonly to: RefundStatus
  ) {
    super(`Cannot transition refund from "${from}" to "${to}"`);
    this.name = 'RefundTransitionError';
  }
}

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Determines whether `requestedAt` falls within `windowDays` of `orderDate`.
 * Boundary day is inclusive.
 */
export function isWithinRefundWindow(
  orderDate: Date,
  requestedAt: Date,
  windowDays: number
): boolean {
  if (requestedAt.getTime() < orderDate.getTime()) {
    return false;
  }
  const elapsedDays = (requestedAt.getTime() - orderDate.getTime()) / MILLISECONDS_PER_DAY;
  return elapsedDays <= windowDays;
}

/**
 * Validates a refund request against the supplied policy.
 * Does not mutate anything; pure predicate + reason.
 */
export function validateRefundRequest(
  request: RefundRequest,
  policy: RefundPolicy = DEFAULT_REFUND_POLICY
): RefundValidationResult {
  if (!request.amount || request.amount <= 0) {
    return { valid: false, reason: 'Refund amount must be greater than zero.' };
  }

  const minimum = policy.minimumRefundAmount ?? 0;
  if (request.amount < minimum) {
    return {
      valid: false,
      reason: `Refund amount must be at least ${minimum}.`,
    };
  }

  if (!isWithinRefundWindow(request.orderDate, request.requestedAt, policy.windowDays)) {
    return { valid: false, reason: 'Refund request is outside the allowed refund window.' };
  }

  const nonRefundable = policy.nonRefundableItemIds ?? [];
  if (request.itemId && nonRefundable.includes(request.itemId)) {
    return { valid: false, reason: `Item "${request.itemId}" is not eligible for refunds.` };
  }

  return { valid: true };
}

/**
 * Calculates the fee-adjusted refund amount for an eligible request.
 * The fee is rounded to the nearest whole unit; net amount is never negative.
 */
export function calculateRefundAmount(
  amount: number,
  policy: RefundPolicy = DEFAULT_REFUND_POLICY
): RefundCalculation {
  const feePercentage = Math.min(Math.max(policy.feePercentage, 0), 100);
  const feeCharged = Math.round((amount * feePercentage) / 100);
  const netAmount = Math.max(amount - feeCharged, 0);
  return { refundAmount: amount, feeCharged, netAmount };
}

/**
 * Creates a new refund record from a request, immediately validating it.
 * Valid requests start as "pending"; invalid ones start as "rejected" with
 * a `rejectionReason` explaining why.
 */
export function createRefundRecord(
  request: RefundRequest,
  policy: RefundPolicy = DEFAULT_REFUND_POLICY
): RefundRecord {
  const validation = validateRefundRequest(request, policy);
  if (!validation.valid) {
    return {
      ...request,
      status: 'rejected',
      rejectionReason: validation.reason,
    };
  }
  return {
    ...request,
    status: 'pending',
  };
}

function assertTransition(
  record: RefundRecord,
  allowedFrom: readonly RefundStatus[],
  to: RefundStatus
): void {
  if (!allowedFrom.includes(record.status)) {
    throw new RefundTransitionError(record.status, to);
  }
}

/** Transitions a pending refund into the "approved" state. */
export function approveRefund(record: RefundRecord): RefundRecord {
  assertTransition(record, ['pending'], 'approved');
  return { ...record, status: 'approved' };
}

/** Transitions a pending (or previously approved) refund into "rejected". */
export function rejectRefund(record: RefundRecord, reason: string): RefundRecord {
  assertTransition(record, ['pending', 'approved'], 'rejected');
  return { ...record, status: 'rejected', rejectionReason: reason };
}

/**
 * Transitions an approved refund into "processed", computing the final
 * refund/fee/net amounts using the supplied policy.
 */
export function processRefund(
  record: RefundRecord,
  policy: RefundPolicy = DEFAULT_REFUND_POLICY,
  processedAt: Date = new Date()
): RefundRecord {
  assertTransition(record, ['approved'], 'processed');
  const { refundAmount, feeCharged, netAmount } = calculateRefundAmount(record.amount, policy);
  return {
    ...record,
    status: 'processed',
    refundAmount,
    feeCharged,
    netAmount,
    processedAt,
  };
}

/** Marks an approved refund as "failed" (e.g. payment gateway error). */
export function failRefund(record: RefundRecord, reason: string): RefundRecord {
  assertTransition(record, ['approved'], 'failed');
  return { ...record, status: 'failed', failureReason: reason };
}

/**
 * In-memory ledger that aggregates refund activity per order. Useful for
 * enforcing "cannot refund more than the order total" style invariants at
 * a higher level, and for reporting.
 */
export class RefundLedger {
  private readonly records = new Map<string, RefundRecord[]>();

  /** Adds or replaces a refund record, keyed by order id then refund id. */
  public upsert(record: RefundRecord): void {
    const existing = this.records.get(record.orderId) ?? [];
    const filtered = existing.filter(r => r.id !== record.id);
    filtered.push(record);
    this.records.set(record.orderId, filtered);
  }

  /** Returns all refund records for an order, most recently added first not guaranteed. */
  public getByOrder(orderId: string): readonly RefundRecord[] {
    return this.records.get(orderId) ?? [];
  }

  /** Total net amount successfully refunded (status "processed") for an order. */
  public totalProcessed(orderId: string): number {
    return this.getByOrder(orderId)
      .filter(r => r.status === 'processed')
      .reduce((sum, r) => sum + (r.netAmount ?? 0), 0);
  }

  /** Total requested amount currently pending or approved (not yet resolved) for an order. */
  public totalInFlight(orderId: string): number {
    return this.getByOrder(orderId)
      .filter(r => r.status === 'pending' || r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0);
  }

  /**
   * Determines whether refunding `additionalAmount` on top of existing
   * processed + in-flight refunds would exceed `orderTotal`.
   */
  public wouldExceedOrderTotal(
    orderId: string,
    additionalAmount: number,
    orderTotal: number
  ): boolean {
    const committed = this.totalProcessed(orderId) + this.totalInFlight(orderId);
    return committed + additionalAmount > orderTotal;
  }

  /** Clears all tracked records. Primarily useful for tests. */
  public clear(): void {
    this.records.clear();
  }
}
