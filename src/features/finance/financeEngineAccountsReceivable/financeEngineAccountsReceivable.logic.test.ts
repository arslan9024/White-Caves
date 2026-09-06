import { describe, expect, it } from 'vitest';
import {
  applyPayment,
  buildAgingReport,
  deriveInvoiceStatus,
  getAgingBucket,
  getDaysPastDue,
  getInvoiceBalance,
  getInvoicesForAccount,
  InvalidReceivableInvoiceError,
  InvalidReceivablePaymentError,
  isInvoiceSettled,
  summarizeAccountsReceivable,
  type ReceivableInvoice,
} from './financeEngineAccountsReceivable.logic';

function makeInvoice(overrides: Partial<ReceivableInvoice> = {}): ReceivableInvoice {
  return {
    id: 'inv-1',
    accountId: 'acct-1',
    amount: 1000,
    amountPaid: 0,
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    status: 'open',
    ...overrides,
  };
}

describe('getInvoiceBalance', () => {
  it('returns the full amount when nothing has been paid', () => {
    expect(getInvoiceBalance(makeInvoice())).toBe(1000);
  });

  it('returns the remaining balance after a partial payment', () => {
    expect(getInvoiceBalance(makeInvoice({ amountPaid: 400 }))).toBe(600);
  });

  it('clamps to zero when overpaid', () => {
    expect(getInvoiceBalance(makeInvoice({ amountPaid: 1500 }))).toBe(0);
  });

  it('throws InvalidReceivableInvoiceError for a negative amount', () => {
    expect(() => getInvoiceBalance(makeInvoice({ amount: -5 }))).toThrow(
      InvalidReceivableInvoiceError
    );
  });

  it('throws InvalidReceivableInvoiceError when dueDate precedes issueDate', () => {
    expect(() =>
      getInvoiceBalance(makeInvoice({ issueDate: '2024-02-01', dueDate: '2024-01-01' }))
    ).toThrow(InvalidReceivableInvoiceError);
  });

  it('throws InvalidReceivableInvoiceError for a missing id', () => {
    expect(() => getInvoiceBalance(makeInvoice({ id: '' }))).toThrow(InvalidReceivableInvoiceError);
  });
});

describe('isInvoiceSettled', () => {
  it('returns false for an unpaid invoice', () => {
    expect(isInvoiceSettled(makeInvoice())).toBe(false);
  });

  it('returns true once the balance reaches zero', () => {
    expect(isInvoiceSettled(makeInvoice({ amountPaid: 1000 }))).toBe(true);
  });
});

describe('getDaysPastDue', () => {
  it('returns 0 when the invoice is not yet due', () => {
    expect(getDaysPastDue(makeInvoice(), '2024-01-15')).toBe(0);
  });

  it('returns 0 exactly on the due date', () => {
    expect(getDaysPastDue(makeInvoice(), '2024-01-31')).toBe(0);
  });

  it('returns the correct number of days past the due date', () => {
    expect(getDaysPastDue(makeInvoice(), '2024-02-15')).toBe(15);
  });
});

describe('getAgingBucket', () => {
  it('buckets non-positive days as current', () => {
    expect(getAgingBucket(0)).toBe('current');
    expect(getAgingBucket(-5)).toBe('current');
  });

  it('buckets 1-30 days correctly', () => {
    expect(getAgingBucket(1)).toBe('1-30');
    expect(getAgingBucket(30)).toBe('1-30');
  });

  it('buckets 31-60 days correctly', () => {
    expect(getAgingBucket(31)).toBe('31-60');
    expect(getAgingBucket(60)).toBe('31-60');
  });

  it('buckets 61-90 days correctly', () => {
    expect(getAgingBucket(61)).toBe('61-90');
    expect(getAgingBucket(90)).toBe('61-90');
  });

  it('buckets more than 90 days as 90+', () => {
    expect(getAgingBucket(91)).toBe('90+');
  });
});

describe('deriveInvoiceStatus', () => {
  it('keeps draft status untouched', () => {
    expect(deriveInvoiceStatus(makeInvoice({ status: 'draft' }), '2024-01-15')).toBe('draft');
  });

  it('keeps void status untouched even if there is an outstanding balance', () => {
    expect(deriveInvoiceStatus(makeInvoice({ status: 'void' }), '2024-02-15')).toBe('void');
  });

  it('returns paid once the balance is zero', () => {
    expect(deriveInvoiceStatus(makeInvoice({ amountPaid: 1000 }), '2024-01-15')).toBe('paid');
  });

  it('returns overdue when past due date with a remaining balance', () => {
    expect(deriveInvoiceStatus(makeInvoice(), '2024-02-15')).toBe('overdue');
  });

  it('returns partially_paid when some payment has been made but not overdue', () => {
    expect(deriveInvoiceStatus(makeInvoice({ amountPaid: 200 }), '2024-01-15')).toBe(
      'partially_paid'
    );
  });

  it('returns open when nothing has been paid and not overdue', () => {
    expect(deriveInvoiceStatus(makeInvoice(), '2024-01-15')).toBe('open');
  });
});

describe('applyPayment', () => {
  it('applies a partial payment and updates status to partially_paid', () => {
    const result = applyPayment(makeInvoice(), {
      invoiceId: 'inv-1',
      amount: 300,
      paidDate: '2024-01-10',
    });
    expect(result.invoice.amountPaid).toBe(300);
    expect(result.invoice.status).toBe('partially_paid');
    expect(result.appliedAmount).toBe(300);
    expect(result.overpaymentAmount).toBe(0);
  });

  it('applies a full payment and updates status to paid', () => {
    const result = applyPayment(makeInvoice(), {
      invoiceId: 'inv-1',
      amount: 1000,
      paidDate: '2024-01-10',
    });
    expect(result.invoice.amountPaid).toBe(1000);
    expect(result.invoice.status).toBe('paid');
    expect(result.appliedAmount).toBe(1000);
    expect(result.overpaymentAmount).toBe(0);
  });

  it('caps the applied amount at the outstanding balance and reports overpayment', () => {
    const result = applyPayment(makeInvoice({ amountPaid: 800 }), {
      invoiceId: 'inv-1',
      amount: 500,
      paidDate: '2024-01-10',
    });
    expect(result.appliedAmount).toBe(200);
    expect(result.overpaymentAmount).toBe(300);
    expect(result.invoice.amountPaid).toBe(1000);
    expect(result.invoice.status).toBe('paid');
  });

  it('marks the invoice overdue when the payment leaves a balance past due', () => {
    const result = applyPayment(
      makeInvoice(),
      { invoiceId: 'inv-1', amount: 200, paidDate: '2024-02-15' },
      '2024-02-15'
    );
    expect(result.invoice.status).toBe('overdue');
  });

  it('throws InvalidReceivablePaymentError when invoiceId does not match', () => {
    expect(() =>
      applyPayment(makeInvoice(), {
        invoiceId: 'wrong-id',
        amount: 100,
        paidDate: '2024-01-10',
      })
    ).toThrow(InvalidReceivablePaymentError);
  });

  it('throws InvalidReceivablePaymentError for a non-positive payment amount', () => {
    expect(() =>
      applyPayment(makeInvoice(), {
        invoiceId: 'inv-1',
        amount: 0,
        paidDate: '2024-01-10',
      })
    ).toThrow(InvalidReceivablePaymentError);
  });
});

describe('buildAgingReport', () => {
  it('excludes settled and void invoices, and buckets the rest', () => {
    const invoices: ReceivableInvoice[] = [
      makeInvoice({ id: 'inv-1', dueDate: '2024-01-31' }), // overdue by 15 days as of 2024-02-15
      makeInvoice({ id: 'inv-2', amountPaid: 1000 }), // settled, excluded
      makeInvoice({ id: 'inv-3', status: 'void' }), // void, excluded
      makeInvoice({ id: 'inv-4', dueDate: '2024-03-01' }), // not yet due
    ];

    const report = buildAgingReport(invoices, '2024-02-15');

    expect(report).toHaveLength(2);
    const inv1 = report.find(r => r.invoiceId === 'inv-1');
    expect(inv1?.bucket).toBe('1-30');
    expect(inv1?.daysPastDue).toBe(15);
    expect(inv1?.balance).toBe(1000);

    const inv4 = report.find(r => r.invoiceId === 'inv-4');
    expect(inv4?.bucket).toBe('current');
    expect(inv4?.daysPastDue).toBe(0);
  });

  it('returns an empty array when all invoices are settled', () => {
    const invoices: ReceivableInvoice[] = [makeInvoice({ amountPaid: 1000 })];
    expect(buildAgingReport(invoices, '2024-02-15')).toEqual([]);
  });
});

describe('summarizeAccountsReceivable', () => {
  it('aggregates totals across multiple invoices, excluding void ones', () => {
    const invoices: ReceivableInvoice[] = [
      makeInvoice({ id: 'inv-1', amount: 1000, amountPaid: 0, dueDate: '2024-01-31' }), // overdue
      makeInvoice({ id: 'inv-2', amount: 500, amountPaid: 500, dueDate: '2024-01-31' }), // paid
      makeInvoice({ id: 'inv-3', amount: 2000, amountPaid: 2000, status: 'void' }), // void, excluded
      makeInvoice({ id: 'inv-4', amount: 300, amountPaid: 100, dueDate: '2024-03-01' }), // open, not due
    ];

    const summary = summarizeAccountsReceivable(invoices, '2024-02-15');

    expect(summary.totalInvoiced).toBe(1000 + 500 + 300);
    expect(summary.totalPaid).toBe(0 + 500 + 100);
    expect(summary.totalOutstanding).toBe(1000 + 0 + 200);
    expect(summary.totalOverdue).toBe(1000);
    expect(summary.invoiceCount).toBe(3);
    expect(summary.openInvoiceCount).toBe(2);
  });

  it('returns all-zero summary for an empty invoice list', () => {
    const summary = summarizeAccountsReceivable([], '2024-02-15');
    expect(summary).toEqual({
      totalInvoiced: 0,
      totalPaid: 0,
      totalOutstanding: 0,
      totalOverdue: 0,
      invoiceCount: 0,
      openInvoiceCount: 0,
    });
  });
});

describe('getInvoicesForAccount', () => {
  it('filters invoices to the given account', () => {
    const invoices: ReceivableInvoice[] = [
      makeInvoice({ id: 'inv-1', accountId: 'acct-a' }),
      makeInvoice({ id: 'inv-2', accountId: 'acct-b' }),
      makeInvoice({ id: 'inv-3', accountId: 'acct-a' }),
    ];

    const result = getInvoicesForAccount(invoices, 'acct-a');
    expect(result.map(inv => inv.id)).toEqual(['inv-1', 'inv-3']);
  });

  it('returns an empty array when no invoices match', () => {
    expect(getInvoicesForAccount([makeInvoice()], 'nonexistent')).toEqual([]);
  });
});
