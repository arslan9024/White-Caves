import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REFUND_POLICY,
  RefundLedger,
  RefundTransitionError,
  approveRefund,
  calculateRefundAmount,
  createRefundRecord,
  failRefund,
  isWithinRefundWindow,
  processRefund,
  rejectRefund,
  validateRefundRequest,
  type RefundPolicy,
  type RefundRecord,
  type RefundRequest,
} from './financeEngineRefundManagement.logic';

function makeRequest(overrides: Partial<RefundRequest> = {}): RefundRequest {
  return {
    id: 'refund-1',
    orderId: 'order-1',
    amount: 1000,
    orderDate: new Date('2024-01-01T00:00:00.000Z'),
    requestedAt: new Date('2024-01-05T00:00:00.000Z'),
    reason: 'customer_request',
    ...overrides,
  };
}

describe('isWithinRefundWindow', () => {
  it('returns true when requestedAt is before the window closes', () => {
    const orderDate = new Date('2024-01-01T00:00:00.000Z');
    const requestedAt = new Date('2024-01-10T00:00:00.000Z');
    expect(isWithinRefundWindow(orderDate, requestedAt, 30)).toBe(true);
  });

  it('returns true exactly on the boundary day', () => {
    const orderDate = new Date('2024-01-01T00:00:00.000Z');
    const requestedAt = new Date('2024-01-31T00:00:00.000Z');
    expect(isWithinRefundWindow(orderDate, requestedAt, 30)).toBe(true);
  });

  it('returns false once the window has elapsed', () => {
    const orderDate = new Date('2024-01-01T00:00:00.000Z');
    const requestedAt = new Date('2024-02-05T00:00:00.000Z');
    expect(isWithinRefundWindow(orderDate, requestedAt, 30)).toBe(false);
  });

  it('returns false when requestedAt precedes orderDate', () => {
    const orderDate = new Date('2024-01-10T00:00:00.000Z');
    const requestedAt = new Date('2024-01-01T00:00:00.000Z');
    expect(isWithinRefundWindow(orderDate, requestedAt, 30)).toBe(false);
  });
});

describe('validateRefundRequest', () => {
  it('rejects non-positive amounts', () => {
    const result = validateRefundRequest(makeRequest({ amount: 0 }));
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/greater than zero/);
  });

  it('rejects amounts below the policy minimum', () => {
    const policy: RefundPolicy = { ...DEFAULT_REFUND_POLICY, minimumRefundAmount: 500 };
    const result = validateRefundRequest(makeRequest({ amount: 100 }), policy);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/at least 500/);
  });

  it('rejects requests outside the refund window', () => {
    const result = validateRefundRequest(
      makeRequest({
        orderDate: new Date('2024-01-01T00:00:00.000Z'),
        requestedAt: new Date('2024-03-01T00:00:00.000Z'),
      }),
      { ...DEFAULT_REFUND_POLICY, windowDays: 30 }
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/outside the allowed refund window/);
  });

  it('rejects explicitly non-refundable items', () => {
    const policy: RefundPolicy = { ...DEFAULT_REFUND_POLICY, nonRefundableItemIds: ['item-x'] };
    const result = validateRefundRequest(makeRequest({ itemId: 'item-x' }), policy);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('item-x');
  });

  it('accepts a well-formed, in-window request', () => {
    const result = validateRefundRequest(makeRequest());
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
  });
});

describe('calculateRefundAmount', () => {
  it('charges no fee under the default policy', () => {
    const result = calculateRefundAmount(1000, DEFAULT_REFUND_POLICY);
    expect(result).toEqual({ refundAmount: 1000, feeCharged: 0, netAmount: 1000 });
  });

  it('applies a percentage fee and rounds it', () => {
    const policy: RefundPolicy = { ...DEFAULT_REFUND_POLICY, feePercentage: 10 };
    const result = calculateRefundAmount(999, policy);
    expect(result.feeCharged).toBe(100); // round(99.9) === 100
    expect(result.netAmount).toBe(899);
  });

  it('clamps out-of-range fee percentages and never returns a negative net amount', () => {
    const policy: RefundPolicy = { ...DEFAULT_REFUND_POLICY, feePercentage: 150 };
    const result = calculateRefundAmount(500, policy);
    expect(result.feeCharged).toBe(500);
    expect(result.netAmount).toBe(0);
  });
});

describe('createRefundRecord', () => {
  it('creates a pending record for a valid request', () => {
    const record = createRefundRecord(makeRequest());
    expect(record.status).toBe('pending');
    expect(record.rejectionReason).toBeUndefined();
  });

  it('creates a rejected record with a reason for an invalid request', () => {
    const record = createRefundRecord(makeRequest({ amount: -5 }));
    expect(record.status).toBe('rejected');
    expect(record.rejectionReason).toBeDefined();
  });
});

describe('refund state machine', () => {
  it('walks pending -> approved -> processed with computed amounts', () => {
    const policy: RefundPolicy = { ...DEFAULT_REFUND_POLICY, feePercentage: 5 };
    let record = createRefundRecord(makeRequest({ amount: 2000 }), policy);
    expect(record.status).toBe('pending');

    record = approveRefund(record);
    expect(record.status).toBe('approved');

    const processedAt = new Date('2024-01-06T00:00:00.000Z');
    record = processRefund(record, policy, processedAt);
    expect(record.status).toBe('processed');
    expect(record.refundAmount).toBe(2000);
    expect(record.feeCharged).toBe(100);
    expect(record.netAmount).toBe(1900);
    expect(record.processedAt).toBe(processedAt);
  });

  it('allows rejecting a pending refund with a reason', () => {
    const record = createRefundRecord(makeRequest());
    const rejected = rejectRefund(record, 'Customer withdrew request');
    expect(rejected.status).toBe('rejected');
    expect(rejected.rejectionReason).toBe('Customer withdrew request');
  });

  it('allows failing an approved refund', () => {
    let record = createRefundRecord(makeRequest());
    record = approveRefund(record);
    const failed = failRefund(record, 'Payment gateway timeout');
    expect(failed.status).toBe('failed');
    expect(failed.failureReason).toBe('Payment gateway timeout');
  });

  it('throws RefundTransitionError when approving a non-pending refund', () => {
    let record = createRefundRecord(makeRequest());
    record = approveRefund(record);
    expect(() => approveRefund(record)).toThrow(RefundTransitionError);
  });

  it('throws RefundTransitionError when processing a non-approved refund', () => {
    const record = createRefundRecord(makeRequest());
    expect(() => processRefund(record)).toThrow(RefundTransitionError);
  });

  it('throws RefundTransitionError when failing a non-approved refund', () => {
    const record = createRefundRecord(makeRequest());
    expect(() => failRefund(record, 'n/a')).toThrow(RefundTransitionError);
  });
});

describe('RefundLedger', () => {
  it('tracks processed totals per order', () => {
    const ledger = new RefundLedger();
    const policy: RefundPolicy = { ...DEFAULT_REFUND_POLICY, feePercentage: 0 };

    let record: RefundRecord = createRefundRecord(makeRequest({ id: 'r1', amount: 300 }), policy);
    record = processRefund(approveRefund(record), policy);
    ledger.upsert(record);

    expect(ledger.totalProcessed('order-1')).toBe(300);
    expect(ledger.getByOrder('order-1')).toHaveLength(1);
  });

  it('tracks in-flight totals separately from processed totals', () => {
    const ledger = new RefundLedger();
    const pending = createRefundRecord(makeRequest({ id: 'r1', amount: 200 }));
    const approved = approveRefund(createRefundRecord(makeRequest({ id: 'r2', amount: 150 })));
    ledger.upsert(pending);
    ledger.upsert(approved);

    expect(ledger.totalInFlight('order-1')).toBe(350);
    expect(ledger.totalProcessed('order-1')).toBe(0);
  });

  it('replaces a record with the same id instead of duplicating it', () => {
    const ledger = new RefundLedger();
    const record = createRefundRecord(makeRequest({ id: 'r1', amount: 100 }));
    ledger.upsert(record);
    const approved = approveRefund(record);
    ledger.upsert(approved);

    const stored = ledger.getByOrder('order-1');
    expect(stored).toHaveLength(1);
    expect(stored[0]?.status).toBe('approved');
  });

  it('detects when an additional refund would exceed the order total', () => {
    const ledger = new RefundLedger();
    const policy: RefundPolicy = { ...DEFAULT_REFUND_POLICY, feePercentage: 0 };
    const record = processRefund(
      approveRefund(createRefundRecord(makeRequest({ id: 'r1', amount: 800 }), policy)),
      policy
    );
    ledger.upsert(record);

    expect(ledger.wouldExceedOrderTotal('order-1', 300, 1000)).toBe(true);
    expect(ledger.wouldExceedOrderTotal('order-1', 100, 1000)).toBe(false);
  });

  it('clear() removes all tracked records', () => {
    const ledger = new RefundLedger();
    ledger.upsert(createRefundRecord(makeRequest()));
    ledger.clear();
    expect(ledger.getByOrder('order-1')).toHaveLength(0);
  });
});
