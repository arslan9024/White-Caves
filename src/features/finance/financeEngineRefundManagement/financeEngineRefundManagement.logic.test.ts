import { describe, expect, it } from 'vitest';
import {
  RefundEngine,
  RefundNotFoundError,
  RefundValidationError,
  calculateRefundFee,
  createRefundEngine,
  validateRefundRequest,
  type RefundPolicy,
  type RefundRequestInput,
} from './financeEngineRefundManagement.logic';

const basePolicy: RefundPolicy = {
  maxRefundWindowDays: 30,
  processingFeePercentage: 5,
  requiresApprovalAboveAmount: 500,
  allowedReasons: [
    'duplicate_payment',
    'service_not_rendered',
    'overpayment',
    'goodwill',
    'cancellation',
  ],
};

function buildInput(overrides: Partial<RefundRequestInput> = {}): RefundRequestInput {
  return {
    id: 'refund-1',
    paymentId: 'payment-1',
    requestedAmount: 100,
    currency: 'USD',
    reason: 'overpayment',
    requestedAt: new Date('2024-01-10T00:00:00Z'),
    originalPaymentAmount: 100,
    originalPaymentDate: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

describe('calculateRefundFee', () => {
  it('computes a percentage-based fee rounded to 2 decimal places', () => {
    expect(calculateRefundFee(100, basePolicy)).toBe(5);
    expect(calculateRefundFee(33.33, basePolicy)).toBe(1.67);
  });

  it('returns zero fee for zero amount', () => {
    expect(calculateRefundFee(0, basePolicy)).toBe(0);
  });

  it('throws RefundValidationError for negative amounts', () => {
    expect(() => calculateRefundFee(-10, basePolicy)).toThrow(RefundValidationError);
  });
});

describe('validateRefundRequest', () => {
  it('passes for a well-formed request within policy', () => {
    expect(() => validateRefundRequest(buildInput(), basePolicy)).not.toThrow();
  });

  it('rejects a missing id', () => {
    expect(() => validateRefundRequest(buildInput({ id: '' }), basePolicy)).toThrow(
      RefundValidationError
    );
  });

  it('rejects amounts greater than the original payment', () => {
    expect(() => validateRefundRequest(buildInput({ requestedAmount: 150 }), basePolicy)).toThrow(
      /cannot exceed/
    );
  });

  it('rejects amounts less than or equal to zero', () => {
    expect(() => validateRefundRequest(buildInput({ requestedAmount: 0 }), basePolicy)).toThrow(
      RefundValidationError
    );
  });

  it('rejects reasons not allowed by policy', () => {
    expect(() => validateRefundRequest(buildInput({ reason: 'other' }), basePolicy)).toThrow(
      /not permitted/
    );
  });

  it('rejects requests submitted before the original payment date', () => {
    expect(() =>
      validateRefundRequest(
        buildInput({
          requestedAt: new Date('2023-12-31T00:00:00Z'),
          originalPaymentDate: new Date('2024-01-01T00:00:00Z'),
        }),
        basePolicy
      )
    ).toThrow(/cannot precede/);
  });

  it('rejects requests outside the refund window', () => {
    expect(() =>
      validateRefundRequest(
        buildInput({ requestedAt: new Date('2024-03-01T00:00:00Z') }),
        basePolicy
      )
    ).toThrow(/outside the allowed window/);
  });
});

describe('RefundEngine.submitRequest', () => {
  it('creates a record in the requested state with history seeded', () => {
    const engine = createRefundEngine(basePolicy);
    const record = engine.submitRequest(buildInput());

    expect(record.status).toBe('requested');
    expect(record.feeAmount).toBe(0);
    expect(record.netRefundAmount).toBe(0);
    expect(record.statusHistory).toHaveLength(1);
    expect(record.statusHistory[0].status).toBe('requested');
  });

  it('throws when submitting a duplicate id', () => {
    const engine = createRefundEngine(basePolicy);
    engine.submitRequest(buildInput());
    expect(() => engine.submitRequest(buildInput())).toThrow(RefundValidationError);
  });

  it('propagates validation failures from an invalid request', () => {
    const engine = createRefundEngine(basePolicy);
    expect(() => engine.submitRequest(buildInput({ requestedAmount: -5 }))).toThrow(
      RefundValidationError
    );
  });
});

describe('RefundEngine lifecycle transitions', () => {
  it('processes a low-value refund directly from requested without approval', () => {
    const engine = createRefundEngine(basePolicy);
    engine.submitRequest(buildInput({ requestedAmount: 100 }));

    const processed = engine.process('refund-1', new Date('2024-01-11T00:00:00Z'));

    expect(processed.status).toBe('processed');
    expect(processed.feeAmount).toBe(5);
    expect(processed.netRefundAmount).toBe(95);
    expect(processed.statusHistory.map(event => event.status)).toEqual(['requested', 'processed']);
  });

  it('requires approval before processing amounts above the threshold', () => {
    const engine = createRefundEngine(basePolicy);
    engine.submitRequest(buildInput({ requestedAmount: 600, originalPaymentAmount: 600 }));

    expect(() => engine.process('refund-1')).toThrow(/must be approved/);

    engine.approve('refund-1', 'manager-1');
    const processed = engine.process('refund-1');

    expect(processed.status).toBe('processed');
    expect(processed.netRefundAmount).toBe(570);
  });

  it('rejects a requested refund and prevents further processing', () => {
    const engine = createRefundEngine(basePolicy);
    engine.submitRequest(buildInput());
    const rejected = engine.reject('refund-1', 'manager-1', 'duplicate submission');

    expect(rejected.status).toBe('rejected');
    expect(() => engine.process('refund-1')).toThrow(RefundValidationError);
  });

  it('cancels a requested refund and prevents further transitions', () => {
    const engine = createRefundEngine(basePolicy);
    engine.submitRequest(buildInput());
    const cancelled = engine.cancel('refund-1', 'customer-1', 'customer withdrew request');

    expect(cancelled.status).toBe('cancelled');
    expect(() => engine.approve('refund-1', 'manager-1')).toThrow(RefundValidationError);
  });

  it('throws RefundNotFoundError for unknown ids', () => {
    const engine = createRefundEngine(basePolicy);
    expect(() => engine.getRecord('missing')).toThrow(RefundNotFoundError);
    expect(() => engine.approve('missing', 'manager-1')).toThrow(RefundNotFoundError);
  });

  it('exposes requiresApproval based on policy threshold', () => {
    const engine = createRefundEngine(basePolicy);
    expect(engine.requiresApproval(500)).toBe(false);
    expect(engine.requiresApproval(500.01)).toBe(true);
  });
});

describe('RefundEngine querying and summaries', () => {
  it('lists records filtered by status', () => {
    const engine = createRefundEngine(basePolicy);
    engine.submitRequest(buildInput({ id: 'r1' }));
    engine.submitRequest(buildInput({ id: 'r2' }));
    engine.process('r1');

    expect(engine.listByStatus('processed')).toHaveLength(1);
    expect(engine.listByStatus('requested')).toHaveLength(1);
    expect(engine.listAll()).toHaveLength(2);
  });

  it('aggregates a summary across processed and pending refunds', () => {
    const engine = createRefundEngine(basePolicy);
    engine.submitRequest(buildInput({ id: 'r1', requestedAmount: 100 }));
    engine.submitRequest(buildInput({ id: 'r2', requestedAmount: 200 }));
    engine.process('r1');
    engine.reject('r2', 'manager-1', 'not eligible');

    const summary = engine.getSummary();

    expect(summary.totalRequestedAmount).toBe(300);
    expect(summary.totalProcessedAmount).toBe(100);
    expect(summary.totalFeesCollected).toBe(5);
    expect(summary.totalNetRefunded).toBe(95);
    expect(summary.countByStatus.processed).toBe(1);
    expect(summary.countByStatus.rejected).toBe(1);
  });
});
