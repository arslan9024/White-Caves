/**
 * Finance Engine: Refund Management
 * Parent issue: #1941 | Child issue: #2413
 *
 * Self-contained refund lifecycle engine. Handles refund request intake,
 * validation against a configurable policy, approval/rejection workflow,
 * fee computation, processing, cancellation, and summary reporting.
 *
 * Scope is intentionally limited to in-memory refund lifecycle logic.
 * No persistence, network, or external side effects are performed here.
 */

/** Possible lifecycle states for a refund record. */
export type RefundStatus = 'requested' | 'approved' | 'rejected' | 'processed' | 'cancelled';

/** Reasons a refund may be requested for. */
export type RefundReason =
  | 'duplicate_payment'
  | 'service_not_rendered'
  | 'overpayment'
  | 'goodwill'
  | 'cancellation'
  | 'other';

/** Configurable business rules governing refund eligibility and fees. */
export interface RefundPolicy {
  /** Maximum number of days after the original payment during which a refund may be requested. */
  readonly maxRefundWindowDays: number;
  /** Processing fee percentage (0-100) deducted from the refunded amount. */
  readonly processingFeePercentage: number;
  /** Refund requests strictly above this amount require explicit approval before processing. */
  readonly requiresApprovalAboveAmount: number;
  /** Reasons accepted by this policy. */
  readonly allowedReasons: readonly RefundReason[];
}

/** Input payload used to submit a new refund request. */
export interface RefundRequestInput {
  readonly id: string;
  readonly paymentId: string;
  readonly requestedAmount: number;
  readonly currency: string;
  readonly reason: RefundReason;
  readonly requestedAt: Date;
  readonly originalPaymentAmount: number;
  readonly originalPaymentDate: Date;
  readonly notes?: string;
}

/** A single transition in a refund record's history. */
export interface RefundStatusEvent {
  readonly status: RefundStatus;
  readonly timestamp: Date;
  readonly actorId?: string;
  readonly note?: string;
}

/** Full persisted state of a refund throughout its lifecycle. */
export interface RefundRecord extends RefundRequestInput {
  status: RefundStatus;
  feeAmount: number;
  netRefundAmount: number;
  readonly statusHistory: RefundStatusEvent[];
}

/** Aggregate reporting summary across all refund records held by an engine instance. */
export interface RefundSummary {
  readonly totalRequestedAmount: number;
  readonly totalProcessedAmount: number;
  readonly totalFeesCollected: number;
  readonly totalNetRefunded: number;
  readonly countByStatus: Readonly<Record<RefundStatus, number>>;
}

/** Raised whenever a refund request or transition violates policy or state rules. */
export class RefundValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RefundValidationError';
  }
}

/** Raised when an operation references a refund id that does not exist. */
export class RefundNotFoundError extends Error {
  constructor(id: string) {
    super(`Refund record not found: ${id}`);
    this.name = 'RefundNotFoundError';
  }
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(earlier: Date, later: Date): number {
  return (later.getTime() - earlier.getTime()) / MS_PER_DAY;
}

/** Rounds a monetary amount to 2 decimal places, avoiding floating point drift. */
function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Computes the processing fee for a given refund amount under a policy.
 * Exported standalone so callers can preview fees before submitting a request.
 */
export function calculateRefundFee(amount: number, policy: RefundPolicy): number {
  if (amount < 0) {
    throw new RefundValidationError('Refund amount cannot be negative.');
  }
  const fee = amount * (policy.processingFeePercentage / 100);
  return roundCurrency(fee);
}

/**
 * Validates a refund request against a policy without mutating any state.
 * Throws `RefundValidationError` on the first violation encountered.
 */
export function validateRefundRequest(input: RefundRequestInput, policy: RefundPolicy): void {
  if (!input.id || input.id.trim().length === 0) {
    throw new RefundValidationError('Refund request id is required.');
  }
  if (!input.paymentId || input.paymentId.trim().length === 0) {
    throw new RefundValidationError('Payment id is required.');
  }
  if (!input.currency || input.currency.trim().length === 0) {
    throw new RefundValidationError('Currency is required.');
  }
  if (input.requestedAmount <= 0) {
    throw new RefundValidationError('Requested amount must be greater than zero.');
  }
  if (input.originalPaymentAmount <= 0) {
    throw new RefundValidationError('Original payment amount must be greater than zero.');
  }
  if (input.requestedAmount > input.originalPaymentAmount) {
    throw new RefundValidationError('Requested amount cannot exceed the original payment amount.');
  }
  if (!policy.allowedReasons.includes(input.reason)) {
    throw new RefundValidationError(`Refund reason "${input.reason}" is not permitted by policy.`);
  }
  if (input.requestedAt.getTime() < input.originalPaymentDate.getTime()) {
    throw new RefundValidationError(
      'Refund request date cannot precede the original payment date.'
    );
  }
  const windowDays = daysBetween(input.originalPaymentDate, input.requestedAt);
  if (windowDays > policy.maxRefundWindowDays) {
    throw new RefundValidationError(
      `Refund request falls outside the allowed window of ${policy.maxRefundWindowDays} day(s).`
    );
  }
}

/**
 * Stateful engine that manages refund records for a single policy configuration.
 * Instances are independent; each holds its own in-memory record store.
 */
export class RefundEngine {
  private readonly records = new Map<string, RefundRecord>();

  constructor(private readonly policy: RefundPolicy) {}

  /** Submits and validates a new refund request, seeding it into the 'requested' state. */
  submitRequest(input: RefundRequestInput): RefundRecord {
    if (this.records.has(input.id)) {
      throw new RefundValidationError(`Refund request with id "${input.id}" already exists.`);
    }
    validateRefundRequest(input, this.policy);

    const record: RefundRecord = {
      ...input,
      status: 'requested',
      feeAmount: 0,
      netRefundAmount: 0,
      statusHistory: [{ status: 'requested', timestamp: input.requestedAt }],
    };
    this.records.set(input.id, record);
    return record;
  }

  /** Returns whether the given amount requires explicit approval under this engine's policy. */
  requiresApproval(amount: number): boolean {
    return amount > this.policy.requiresApprovalAboveAmount;
  }

  private getOrThrow(id: string): RefundRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new RefundNotFoundError(id);
    }
    return record;
  }

  private assertStatus(record: RefundRecord, expected: RefundStatus): void {
    if (record.status !== expected) {
      throw new RefundValidationError(
        `Refund "${record.id}" must be in "${expected}" state, but is "${record.status}".`
      );
    }
  }

  /** Approves a pending refund request, moving it into the 'approved' state. */
  approve(id: string, actorId: string, note?: string, timestamp: Date = new Date()): RefundRecord {
    const record = this.getOrThrow(id);
    this.assertStatus(record, 'requested');
    record.status = 'approved';
    record.statusHistory.push({ status: 'approved', timestamp, actorId, note });
    return record;
  }

  /** Rejects a pending refund request, moving it into a terminal 'rejected' state. */
  reject(id: string, actorId: string, note: string, timestamp: Date = new Date()): RefundRecord {
    const record = this.getOrThrow(id);
    this.assertStatus(record, 'requested');
    record.status = 'rejected';
    record.statusHistory.push({ status: 'rejected', timestamp, actorId, note });
    return record;
  }

  /** Cancels a refund request that has not yet been approved, rejected, or processed. */
  cancel(id: string, actorId: string, note?: string, timestamp: Date = new Date()): RefundRecord {
    const record = this.getOrThrow(id);
    this.assertStatus(record, 'requested');
    record.status = 'cancelled';
    record.statusHistory.push({ status: 'cancelled', timestamp, actorId, note });
    return record;
  }

  /**
   * Processes a refund, computing the fee and net payout, and moving it into
   * the terminal 'processed' state. Requests above the policy's approval
   * threshold must be approved first; smaller requests may be processed
   * directly from 'requested'.
   */
  process(id: string, timestamp: Date = new Date()): RefundRecord {
    const record = this.getOrThrow(id);

    if (record.status === 'requested') {
      if (this.requiresApproval(record.requestedAmount)) {
        throw new RefundValidationError(
          `Refund "${record.id}" exceeds the approval threshold and must be approved before processing.`
        );
      }
    } else if (record.status !== 'approved') {
      throw new RefundValidationError(
        `Refund "${record.id}" must be in "requested" or "approved" state, but is "${record.status}".`
      );
    }

    const fee = calculateRefundFee(record.requestedAmount, this.policy);
    const net = roundCurrency(record.requestedAmount - fee);

    record.feeAmount = fee;
    record.netRefundAmount = net;
    record.status = 'processed';
    record.statusHistory.push({ status: 'processed', timestamp });
    return record;
  }

  /** Retrieves a refund record by id, or throws `RefundNotFoundError`. */
  getRecord(id: string): RefundRecord {
    return this.getOrThrow(id);
  }

  /** Lists all refund records currently in the given status. */
  listByStatus(status: RefundStatus): RefundRecord[] {
    return Array.from(this.records.values()).filter(record => record.status === status);
  }

  /** Lists every refund record held by this engine instance. */
  listAll(): RefundRecord[] {
    return Array.from(this.records.values());
  }

  /** Produces an aggregate summary of all refund activity tracked by this engine. */
  getSummary(): RefundSummary {
    const countByStatus: Record<RefundStatus, number> = {
      requested: 0,
      approved: 0,
      rejected: 0,
      processed: 0,
      cancelled: 0,
    };

    let totalRequestedAmount = 0;
    let totalProcessedAmount = 0;
    let totalFeesCollected = 0;
    let totalNetRefunded = 0;

    for (const record of this.records.values()) {
      countByStatus[record.status] += 1;
      totalRequestedAmount = roundCurrency(totalRequestedAmount + record.requestedAmount);
      if (record.status === 'processed') {
        totalProcessedAmount = roundCurrency(totalProcessedAmount + record.requestedAmount);
        totalFeesCollected = roundCurrency(totalFeesCollected + record.feeAmount);
        totalNetRefunded = roundCurrency(totalNetRefunded + record.netRefundAmount);
      }
    }

    return {
      totalRequestedAmount,
      totalProcessedAmount,
      totalFeesCollected,
      totalNetRefunded,
      countByStatus,
    };
  }
}

/** Convenience factory mirroring `new RefundEngine(policy)` for functional call sites. */
export function createRefundEngine(policy: RefundPolicy): RefundEngine {
  return new RefundEngine(policy);
}
