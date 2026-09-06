import { describe, expect, it } from 'vitest';
import {
  CLOSED_RECEIVABLE_INVOICE_STATUSES,
  OPEN_RECEIVABLE_INVOICE_STATUSES,
  computeOutstandingBalance,
  isClosedReceivableInvoice,
  isOpenReceivableInvoice,
  isReceivableCounterpartyType,
  isReceivableInvoiceStatus,
  isReceivablePaymentStatus,
  summarizeReceivables,
  sumClearedPayments,
  type ReceivableInvoice,
  type ReceivablePayment,
} from './financeEngineAccountsReceivable.types';

function makePayment(overrides: Partial<ReceivablePayment> = {}): ReceivablePayment {
  return {
    id: 'pay-1',
    invoiceId: 'inv-1',
    amount: { amount: 100, currency: 'AED' },
    status: 'cleared',
    receivedAt: '2026-01-01',
    ...overrides,
  };
}

function makeInvoice(overrides: Partial<ReceivableInvoice> = {}): ReceivableInvoice {
  return {
    id: 'inv-1',
    counterparty: {
      id: 'tenant-1',
      type: 'tenant',
      displayName: 'Jane Doe',
    },
    lineItems: [
      {
        id: 'line-1',
        description: 'Monthly rent',
        quantity: 1,
        unitAmount: { amount: 1000, currency: 'AED' },
        total: { amount: 1000, currency: 'AED' },
      },
    ],
    issuedAt: '2026-01-01',
    dueAt: '2026-01-31',
    status: 'issued',
    subtotal: { amount: 1000, currency: 'AED' },
    taxTotal: { amount: 0, currency: 'AED' },
    grandTotal: { amount: 1000, currency: 'AED' },
    payments: [],
    ...overrides,
  };
}

describe('isReceivableInvoiceStatus', () => {
  it('returns true for every known invoice status', () => {
    const allStatuses = [
      ...OPEN_RECEIVABLE_INVOICE_STATUSES,
      ...CLOSED_RECEIVABLE_INVOICE_STATUSES,
    ];
    for (const status of allStatuses) {
      expect(isReceivableInvoiceStatus(status)).toBe(true);
    }
  });

  it('returns false for unknown strings and non-string values', () => {
    expect(isReceivableInvoiceStatus('not-a-status')).toBe(false);
    expect(isReceivableInvoiceStatus(42)).toBe(false);
    expect(isReceivableInvoiceStatus(null)).toBe(false);
    expect(isReceivableInvoiceStatus(undefined)).toBe(false);
  });
});

describe('isReceivablePaymentStatus', () => {
  it('accepts all known payment statuses', () => {
    expect(isReceivablePaymentStatus('pending')).toBe(true);
    expect(isReceivablePaymentStatus('cleared')).toBe(true);
    expect(isReceivablePaymentStatus('failed')).toBe(true);
    expect(isReceivablePaymentStatus('reversed')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isReceivablePaymentStatus('processing')).toBe(false);
    expect(isReceivablePaymentStatus({})).toBe(false);
  });
});

describe('isReceivableCounterpartyType', () => {
  it('accepts all known counterparty types', () => {
    expect(isReceivableCounterpartyType('tenant')).toBe(true);
    expect(isReceivableCounterpartyType('landlord')).toBe(true);
    expect(isReceivableCounterpartyType('agent')).toBe(true);
    expect(isReceivableCounterpartyType('other')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isReceivableCounterpartyType('vendor')).toBe(false);
  });
});

describe('isOpenReceivableInvoice / isClosedReceivableInvoice', () => {
  it('classifies open statuses correctly', () => {
    const invoice = makeInvoice({ status: 'partially_paid' });
    expect(isOpenReceivableInvoice(invoice)).toBe(true);
    expect(isClosedReceivableInvoice(invoice)).toBe(false);
  });

  it('classifies closed statuses correctly', () => {
    const invoice = makeInvoice({ status: 'paid' });
    expect(isOpenReceivableInvoice(invoice)).toBe(false);
    expect(isClosedReceivableInvoice(invoice)).toBe(true);
  });
});

describe('sumClearedPayments', () => {
  it('sums only cleared payments, excluding pending/failed/reversed', () => {
    const invoice = makeInvoice({
      payments: [
        makePayment({ id: 'p1', amount: { amount: 300, currency: 'AED' }, status: 'cleared' }),
        makePayment({ id: 'p2', amount: { amount: 200, currency: 'AED' }, status: 'pending' }),
        makePayment({ id: 'p3', amount: { amount: 150, currency: 'AED' }, status: 'failed' }),
        makePayment({ id: 'p4', amount: { amount: 100, currency: 'AED' }, status: 'reversed' }),
        makePayment({ id: 'p5', amount: { amount: 50, currency: 'AED' }, status: 'cleared' }),
      ],
    });

    expect(sumClearedPayments(invoice)).toBe(350);
  });

  it('returns 0 when there are no payments', () => {
    expect(sumClearedPayments(makeInvoice({ payments: [] }))).toBe(0);
  });
});

describe('computeOutstandingBalance', () => {
  it('subtracts cleared payments from the grand total', () => {
    const invoice = makeInvoice({
      grandTotal: { amount: 1000, currency: 'AED' },
      payments: [makePayment({ amount: { amount: 400, currency: 'AED' }, status: 'cleared' })],
    });

    expect(computeOutstandingBalance(invoice)).toBe(600);
  });

  it('never returns a negative balance when overpaid', () => {
    const invoice = makeInvoice({
      grandTotal: { amount: 500, currency: 'AED' },
      payments: [makePayment({ amount: { amount: 700, currency: 'AED' }, status: 'cleared' })],
    });

    expect(computeOutstandingBalance(invoice)).toBe(0);
  });

  it('equals the grand total when nothing has been paid', () => {
    const invoice = makeInvoice({ grandTotal: { amount: 1200, currency: 'AED' }, payments: [] });
    expect(computeOutstandingBalance(invoice)).toBe(1200);
  });
});

describe('summarizeReceivables', () => {
  it('aggregates invoiced, collected, outstanding totals and overdue count', () => {
    const invoices: ReceivableInvoice[] = [
      makeInvoice({
        id: 'inv-1',
        status: 'partially_paid',
        grandTotal: { amount: 1000, currency: 'AED' },
        payments: [makePayment({ amount: { amount: 400, currency: 'AED' }, status: 'cleared' })],
      }),
      makeInvoice({
        id: 'inv-2',
        status: 'overdue',
        grandTotal: { amount: 500, currency: 'AED' },
        payments: [],
      }),
      makeInvoice({
        id: 'inv-3',
        status: 'paid',
        grandTotal: { amount: 750, currency: 'AED' },
        payments: [makePayment({ amount: { amount: 750, currency: 'AED' }, status: 'cleared' })],
      }),
    ];

    const summary = summarizeReceivables(invoices, 'AED', '2026-02-01');

    expect(summary).toEqual({
      currency: 'AED',
      totalInvoiced: 2250,
      totalCollected: 1150,
      totalOutstanding: 1100,
      overdueCount: 1,
      invoiceCount: 3,
      asOf: '2026-02-01',
    });
  });

  it('returns zeroed totals for an empty invoice list', () => {
    const summary = summarizeReceivables([], 'USD', '2026-02-01');

    expect(summary).toEqual({
      currency: 'USD',
      totalInvoiced: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      overdueCount: 0,
      invoiceCount: 0,
      asOf: '2026-02-01',
    });
  });
});
