import { describe, expect, it } from 'vitest';
import {
  appendRefundStatusHistory,
  calculateRefundTotal,
  canTransitionRefundStatus,
  isRefundMethod,
  isRefundReasonCode,
  isRefundStatus,
  isTerminalRefundStatus,
  roundToCents,
  validateRefundRequest,
  type RefundLineItem,
  type RefundRequest,
} from './financeEngineRefundManagement.types';

function buildLineItem(overrides: Partial<RefundLineItem> = {}): RefundLineItem {
  return {
    id: 'ref-li-1',
    originalChargeId: 'chg-1',
    description: 'Room charge refund',
    amount: 100,
    ...overrides,
  };
}

function buildRequest(overrides: Partial<RefundRequest> = {}): RefundRequest {
  return {
    id: 'refund-1',
    invoiceId: 'inv-1',
    customerId: 'cust-1',
    currency: 'USD',
    status: 'requested',
    reasonCode: 'customer_request',
    method: 'original_payment_method',
    lineItems: [buildLineItem()],
    maxRefundableAmount: 200,
    statusHistory: [{ status: 'requested', occurredAt: '2024-01-01T00:00:00.000Z' }],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('isRefundStatus', () => {
  it('accepts all valid status values', () => {
    for (const status of [
      'requested',
      'approved',
      'rejected',
      'processing',
      'processed',
      'failed',
      'cancelled',
    ]) {
      expect(isRefundStatus(status)).toBe(true);
    }
  });

  it('rejects invalid or non-string values', () => {
    expect(isRefundStatus('pending')).toBe(false);
    expect(isRefundStatus(42)).toBe(false);
    expect(isRefundStatus(undefined)).toBe(false);
  });
});

describe('isRefundReasonCode', () => {
  it('accepts all valid reason codes', () => {
    for (const reason of [
      'duplicate_payment',
      'booking_cancelled',
      'service_not_rendered',
      'billing_error',
      'customer_request',
      'goodwill',
      'other',
    ]) {
      expect(isRefundReasonCode(reason)).toBe(true);
    }
  });

  it('rejects invalid values', () => {
    expect(isRefundReasonCode('fraud')).toBe(false);
    expect(isRefundReasonCode(null)).toBe(false);
  });
});

describe('isRefundMethod', () => {
  it('accepts all valid methods', () => {
    for (const method of ['original_payment_method', 'bank_transfer', 'store_credit', 'cheque']) {
      expect(isRefundMethod(method)).toBe(true);
    }
  });

  it('rejects invalid values', () => {
    expect(isRefundMethod('crypto')).toBe(false);
    expect(isRefundMethod(7)).toBe(false);
  });
});

describe('isTerminalRefundStatus', () => {
  it('identifies terminal statuses', () => {
    expect(isTerminalRefundStatus('processed')).toBe(true);
    expect(isTerminalRefundStatus('failed')).toBe(true);
    expect(isTerminalRefundStatus('cancelled')).toBe(true);
    expect(isTerminalRefundStatus('rejected')).toBe(true);
  });

  it('identifies non-terminal statuses', () => {
    expect(isTerminalRefundStatus('requested')).toBe(false);
    expect(isTerminalRefundStatus('approved')).toBe(false);
    expect(isTerminalRefundStatus('processing')).toBe(false);
  });
});

describe('roundToCents', () => {
  it('rounds to two decimal places', () => {
    expect(roundToCents(10.005)).toBeCloseTo(10.01, 5);
    expect(roundToCents(9.999)).toBeCloseTo(10.0, 5);
    expect(roundToCents(3)).toBe(3);
  });
});

describe('calculateRefundTotal', () => {
  it('sums the amount of all line items', () => {
    const request = {
      lineItems: [
        buildLineItem({ id: 'a', amount: 49.99 }),
        buildLineItem({ id: 'b', amount: 10.02 }),
      ],
    };
    expect(calculateRefundTotal(request)).toBe(60.01);
  });

  it('returns zero for an empty line item list', () => {
    expect(calculateRefundTotal({ lineItems: [] })).toBe(0);
  });
});

describe('canTransitionRefundStatus', () => {
  it('allows requested -> approved, rejected, cancelled', () => {
    expect(canTransitionRefundStatus('requested', 'approved')).toBe(true);
    expect(canTransitionRefundStatus('requested', 'rejected')).toBe(true);
    expect(canTransitionRefundStatus('requested', 'cancelled')).toBe(true);
  });

  it('allows approved -> processing and processing -> processed/failed', () => {
    expect(canTransitionRefundStatus('approved', 'processing')).toBe(true);
    expect(canTransitionRefundStatus('processing', 'processed')).toBe(true);
    expect(canTransitionRefundStatus('processing', 'failed')).toBe(true);
  });

  it('allows retrying from failed back to processing', () => {
    expect(canTransitionRefundStatus('failed', 'processing')).toBe(true);
  });

  it('disallows transitions out of terminal statuses', () => {
    expect(canTransitionRefundStatus('processed', 'processing')).toBe(false);
    expect(canTransitionRefundStatus('rejected', 'approved')).toBe(false);
    expect(canTransitionRefundStatus('cancelled', 'requested')).toBe(false);
  });

  it('disallows skipping states, e.g. requested -> processed', () => {
    expect(canTransitionRefundStatus('requested', 'processed')).toBe(false);
  });

  it('returns false for invalid status values', () => {
    expect(canTransitionRefundStatus('requested' as never, 'not-a-status' as never)).toBe(false);
  });
});

describe('validateRefundRequest', () => {
  it('returns isValid=true and no errors for a well-formed request', () => {
    const result = validateRefundRequest(buildRequest());
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('flags a missing customerId', () => {
    const result = validateRefundRequest(buildRequest({ customerId: '' }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('customerId is required');
  });

  it('flags an invalid currency code', () => {
    const result = validateRefundRequest(buildRequest({ currency: 'US' }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('currency must be a 3-letter ISO-4217 code');
  });

  it('flags an invalid reasonCode', () => {
    const result = validateRefundRequest(
      buildRequest({ reasonCode: 'fraud' as unknown as RefundRequest['reasonCode'] })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('reasonCode must be a valid refund reason code');
  });

  it('flags an empty lineItems array', () => {
    const result = validateRefundRequest(buildRequest({ lineItems: [] }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('lineItems must contain at least one item');
  });

  it('flags a line item with non-positive amount', () => {
    const result = validateRefundRequest(
      buildRequest({ lineItems: [buildLineItem({ amount: 0 })] })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('lineItems[0].amount must be greater than 0');
  });

  it('flags a total exceeding maxRefundableAmount', () => {
    const result = validateRefundRequest(
      buildRequest({
        maxRefundableAmount: 50,
        lineItems: [buildLineItem({ amount: 100 })],
      })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('total refund amount must not exceed maxRefundableAmount');
  });

  it('flags a negative maxRefundableAmount', () => {
    const result = validateRefundRequest(buildRequest({ maxRefundableAmount: -1 }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('maxRefundableAmount must be greater than or equal to 0');
  });
});

describe('appendRefundStatusHistory', () => {
  it('appends a new entry for a legal transition', () => {
    const request = buildRequest();
    const history = appendRefundStatusHistory(request, 'approved', '2024-01-02T00:00:00.000Z');
    expect(history).toHaveLength(2);
    expect(history[1]).toEqual({ status: 'approved', occurredAt: '2024-01-02T00:00:00.000Z' });
  });

  it('includes an optional note when provided', () => {
    const request = buildRequest();
    const history = appendRefundStatusHistory(
      request,
      'rejected',
      '2024-01-02T00:00:00.000Z',
      'Refund window expired'
    );
    expect(history[1]).toEqual({
      status: 'rejected',
      occurredAt: '2024-01-02T00:00:00.000Z',
      note: 'Refund window expired',
    });
  });

  it('does not mutate the original statusHistory array', () => {
    const request = buildRequest();
    const originalLength = request.statusHistory.length;
    appendRefundStatusHistory(request, 'approved', '2024-01-02T00:00:00.000Z');
    expect(request.statusHistory).toHaveLength(originalLength);
  });

  it('throws when the transition is not permitted', () => {
    const request = buildRequest({ status: 'processed' });
    expect(() =>
      appendRefundStatusHistory(request, 'processing', '2024-01-02T00:00:00.000Z')
    ).toThrow('cannot transition refund status from processed to processing');
  });
});
