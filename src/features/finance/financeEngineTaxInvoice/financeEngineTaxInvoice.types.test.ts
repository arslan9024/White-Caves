import { describe, expect, it } from 'vitest';
import {
  TAX_INVOICE_STATUSES,
  TaxInvoiceValidationError,
  assertValidLineItem,
  calculateLineItemTotals,
  calculateTaxInvoiceTotals,
  canTransitionTaxInvoiceStatus,
  createDraftTaxInvoice,
  getAllowedTaxInvoiceStatusTransitions,
  isTaxInvoiceStatus,
  roundMoney,
  transitionTaxInvoiceStatus,
  type TaxInvoiceLineItem,
} from './financeEngineTaxInvoice.types';

function makeLineItem(overrides: Partial<TaxInvoiceLineItem> = {}): TaxInvoiceLineItem {
  return {
    id: 'line-1',
    description: 'Service charge',
    quantity: 2,
    unitPrice: 100,
    taxRatePercent: 5,
    ...overrides,
  };
}

describe('isTaxInvoiceStatus', () => {
  it('returns true for every known status', () => {
    for (const status of TAX_INVOICE_STATUSES) {
      expect(isTaxInvoiceStatus(status)).toBe(true);
    }
  });

  it('returns false for unknown strings and non-strings', () => {
    expect(isTaxInvoiceStatus('cancelled')).toBe(false);
    expect(isTaxInvoiceStatus(42)).toBe(false);
    expect(isTaxInvoiceStatus(null)).toBe(false);
    expect(isTaxInvoiceStatus(undefined)).toBe(false);
  });
});

describe('roundMoney', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundMoney(10.005)).toBeCloseTo(10.01, 5);
    expect(roundMoney(10.004)).toBeCloseTo(10.0, 5);
    expect(roundMoney(1 / 3)).toBeCloseTo(0.33, 5);
  });
});

describe('assertValidLineItem', () => {
  it('does not throw for a valid line item', () => {
    expect(() => assertValidLineItem(makeLineItem())).not.toThrow();
  });

  it('throws TaxInvoiceValidationError for empty id', () => {
    expect(() => assertValidLineItem(makeLineItem({ id: '' }))).toThrow(TaxInvoiceValidationError);
  });

  it('throws for empty description', () => {
    expect(() => assertValidLineItem(makeLineItem({ description: '  ' }))).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for non-positive quantity', () => {
    expect(() => assertValidLineItem(makeLineItem({ quantity: 0 }))).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => assertValidLineItem(makeLineItem({ quantity: -1 }))).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for negative unitPrice', () => {
    expect(() => assertValidLineItem(makeLineItem({ unitPrice: -5 }))).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for taxRatePercent out of [0, 100] bounds', () => {
    expect(() => assertValidLineItem(makeLineItem({ taxRatePercent: -1 }))).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => assertValidLineItem(makeLineItem({ taxRatePercent: 101 }))).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for non-finite numeric fields', () => {
    expect(() => assertValidLineItem(makeLineItem({ quantity: Number.POSITIVE_INFINITY }))).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => assertValidLineItem(makeLineItem({ unitPrice: NaN }))).toThrow(
      TaxInvoiceValidationError
    );
  });
});

describe('calculateLineItemTotals', () => {
  it('computes net, tax, and gross amounts correctly', () => {
    const totals = calculateLineItemTotals(
      makeLineItem({ quantity: 2, unitPrice: 100, taxRatePercent: 5 })
    );
    expect(totals.lineItemId).toBe('line-1');
    expect(totals.netAmount).toBe(200);
    expect(totals.taxAmount).toBe(10);
    expect(totals.grossAmount).toBe(210);
  });

  it('handles zero tax rate', () => {
    const totals = calculateLineItemTotals(
      makeLineItem({ quantity: 3, unitPrice: 50, taxRatePercent: 0 })
    );
    expect(totals.netAmount).toBe(150);
    expect(totals.taxAmount).toBe(0);
    expect(totals.grossAmount).toBe(150);
  });

  it('propagates validation errors for invalid line items', () => {
    expect(() => calculateLineItemTotals(makeLineItem({ quantity: -1 }))).toThrow(
      TaxInvoiceValidationError
    );
  });
});

describe('calculateTaxInvoiceTotals', () => {
  it('aggregates totals across multiple line items', () => {
    const lineItems: TaxInvoiceLineItem[] = [
      makeLineItem({ id: 'a', quantity: 1, unitPrice: 100, taxRatePercent: 5 }),
      makeLineItem({ id: 'b', quantity: 2, unitPrice: 50, taxRatePercent: 10 }),
    ];
    const totals = calculateTaxInvoiceTotals(lineItems);

    expect(totals.subtotal).toBe(200);
    expect(totals.taxTotal).toBe(15);
    expect(totals.grandTotal).toBe(215);
    expect(totals.lineItemTotals).toHaveLength(2);
    expect(totals.lineItemTotals[0].lineItemId).toBe('a');
    expect(totals.lineItemTotals[1].lineItemId).toBe('b');
  });

  it('returns zeroed totals for an empty line item list', () => {
    const totals = calculateTaxInvoiceTotals([]);
    expect(totals.subtotal).toBe(0);
    expect(totals.taxTotal).toBe(0);
    expect(totals.grandTotal).toBe(0);
    expect(totals.lineItemTotals).toEqual([]);
  });
});

describe('createDraftTaxInvoice', () => {
  const validInput = {
    id: 'inv-1',
    invoiceNumber: 'INV-0001',
    currency: 'AED',
    issueDate: '2026-01-01',
    dueDate: '2026-01-31',
    customerId: 'cust-1',
    lineItems: [makeLineItem()],
  };

  it('creates a draft invoice with status "draft"', () => {
    const invoice = createDraftTaxInvoice(validInput);
    expect(invoice.status).toBe('draft');
    expect(invoice.id).toBe('inv-1');
    expect(invoice.invoiceNumber).toBe('INV-0001');
    expect(invoice.lineItems).toHaveLength(1);
  });

  it('throws when lineItems is empty', () => {
    expect(() => createDraftTaxInvoice({ ...validInput, lineItems: [] })).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws when required string fields are blank', () => {
    expect(() => createDraftTaxInvoice({ ...validInput, id: '' })).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => createDraftTaxInvoice({ ...validInput, invoiceNumber: '' })).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => createDraftTaxInvoice({ ...validInput, currency: '' })).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => createDraftTaxInvoice({ ...validInput, customerId: '' })).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for malformed dates', () => {
    expect(() => createDraftTaxInvoice({ ...validInput, issueDate: 'not-a-date' })).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => createDraftTaxInvoice({ ...validInput, dueDate: '2026-13-40' })).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws when dueDate is earlier than issueDate', () => {
    expect(() =>
      createDraftTaxInvoice({
        ...validInput,
        issueDate: '2026-02-01',
        dueDate: '2026-01-01',
      })
    ).toThrow(TaxInvoiceValidationError);
  });

  it('propagates line item validation errors', () => {
    expect(() =>
      createDraftTaxInvoice({
        ...validInput,
        lineItems: [makeLineItem({ unitPrice: -10 })],
      })
    ).toThrow(TaxInvoiceValidationError);
  });
});

describe('getAllowedTaxInvoiceStatusTransitions / canTransitionTaxInvoiceStatus', () => {
  it('allows draft -> issued and draft -> void', () => {
    expect(getAllowedTaxInvoiceStatusTransitions('draft')).toEqual(['issued', 'void']);
    expect(canTransitionTaxInvoiceStatus('draft', 'issued')).toBe(true);
    expect(canTransitionTaxInvoiceStatus('draft', 'void')).toBe(true);
    expect(canTransitionTaxInvoiceStatus('draft', 'paid')).toBe(false);
  });

  it('allows issued -> paid, overdue, void', () => {
    expect(canTransitionTaxInvoiceStatus('issued', 'paid')).toBe(true);
    expect(canTransitionTaxInvoiceStatus('issued', 'overdue')).toBe(true);
    expect(canTransitionTaxInvoiceStatus('issued', 'void')).toBe(true);
    expect(canTransitionTaxInvoiceStatus('issued', 'draft')).toBe(false);
  });

  it('treats paid and void as terminal states', () => {
    expect(getAllowedTaxInvoiceStatusTransitions('paid')).toEqual([]);
    expect(getAllowedTaxInvoiceStatusTransitions('void')).toEqual([]);
    expect(canTransitionTaxInvoiceStatus('paid', 'draft')).toBe(false);
    expect(canTransitionTaxInvoiceStatus('void', 'issued')).toBe(false);
  });
});

describe('transitionTaxInvoiceStatus', () => {
  const baseInvoice = createDraftTaxInvoice({
    id: 'inv-2',
    invoiceNumber: 'INV-0002',
    currency: 'AED',
    issueDate: '2026-01-01',
    dueDate: '2026-01-31',
    customerId: 'cust-2',
    lineItems: [makeLineItem()],
  });

  it('returns a new invoice object with the updated status on a valid transition', () => {
    const issued = transitionTaxInvoiceStatus(baseInvoice, 'issued');
    expect(issued.status).toBe('issued');
    expect(issued).not.toBe(baseInvoice);
    expect(baseInvoice.status).toBe('draft');
    expect(issued.id).toBe(baseInvoice.id);
  });

  it('throws TaxInvoiceValidationError on an invalid transition', () => {
    expect(() => transitionTaxInvoiceStatus(baseInvoice, 'paid')).toThrow(
      TaxInvoiceValidationError
    );
  });
});
