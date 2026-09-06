import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TAX_RATE,
  SUPPORTED_TAX_INVOICE_CURRENCIES,
  TAX_INVOICE_STATUSES,
  TaxInvoiceValidationError,
  assertValidTaxInvoiceLineItem,
  calculateTaxInvoiceLineItemTotals,
  calculateTaxInvoiceTotals,
  deriveTaxInvoiceStatus,
  isTaxInvoiceCurrency,
  isTaxInvoiceOverdue,
  isTaxInvoiceStatus,
  roundToCurrencyPrecision,
  type TaxInvoice,
  type TaxInvoiceLineItem,
} from './financeEngineTaxInvoice.types';

const makeLineItem = (overrides: Partial<TaxInvoiceLineItem> = {}): TaxInvoiceLineItem => ({
  id: 'line-1',
  description: 'Property management fee',
  quantity: 1,
  unitPrice: 1000,
  taxRate: DEFAULT_TAX_RATE,
  ...overrides,
});

const makeInvoice = (overrides: Partial<TaxInvoice> = {}): TaxInvoice => ({
  id: 'inv-1',
  invoiceNumber: 'TWC-2026-0001',
  status: 'issued',
  currency: 'AED',
  issueDate: '2026-01-01T00:00:00.000Z',
  dueDate: '2026-01-15T00:00:00.000Z',
  issuer: { name: 'The White Caves LLC' },
  recipient: { name: 'Jane Tenant' },
  lineItems: [makeLineItem()],
  ...overrides,
});

describe('financeEngineTaxInvoice.types constants', () => {
  it('defines the standard UAE VAT rate', () => {
    expect(DEFAULT_TAX_RATE).toBe(0.05);
  });

  it('lists the supported currencies including AED', () => {
    expect(SUPPORTED_TAX_INVOICE_CURRENCIES).toContain('AED');
    expect(SUPPORTED_TAX_INVOICE_CURRENCIES.length).toBeGreaterThan(0);
  });

  it('lists all invoice lifecycle statuses', () => {
    expect(TAX_INVOICE_STATUSES).toEqual(['draft', 'issued', 'paid', 'overdue', 'void']);
  });
});

describe('isTaxInvoiceStatus', () => {
  it('returns true for every known status', () => {
    for (const status of TAX_INVOICE_STATUSES) {
      expect(isTaxInvoiceStatus(status)).toBe(true);
    }
  });

  it('returns false for unknown or non-string values', () => {
    expect(isTaxInvoiceStatus('cancelled')).toBe(false);
    expect(isTaxInvoiceStatus(42)).toBe(false);
    expect(isTaxInvoiceStatus(undefined)).toBe(false);
  });
});

describe('isTaxInvoiceCurrency', () => {
  it('returns true for every supported currency', () => {
    for (const currency of SUPPORTED_TAX_INVOICE_CURRENCIES) {
      expect(isTaxInvoiceCurrency(currency)).toBe(true);
    }
  });

  it('returns false for unsupported currency codes', () => {
    expect(isTaxInvoiceCurrency('JPY')).toBe(false);
    expect(isTaxInvoiceCurrency(123)).toBe(false);
  });
});

describe('roundToCurrencyPrecision', () => {
  it('rounds to two decimal places', () => {
    expect(roundToCurrencyPrecision(10.005)).toBeCloseTo(10.01, 5);
    expect(roundToCurrencyPrecision(1.005)).toBeCloseTo(1.01, 5);
    expect(roundToCurrencyPrecision(100)).toBe(100);
  });
});

describe('assertValidTaxInvoiceLineItem', () => {
  it('does not throw for a valid line item', () => {
    expect(() => assertValidTaxInvoiceLineItem(makeLineItem())).not.toThrow();
  });

  it('throws TaxInvoiceValidationError for non-positive quantity', () => {
    expect(() => assertValidTaxInvoiceLineItem(makeLineItem({ quantity: 0 }))).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => assertValidTaxInvoiceLineItem(makeLineItem({ quantity: -2 }))).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for a negative unit price', () => {
    expect(() => assertValidTaxInvoiceLineItem(makeLineItem({ unitPrice: -1 }))).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for a tax rate outside the 0-1 range', () => {
    expect(() => assertValidTaxInvoiceLineItem(makeLineItem({ taxRate: 1.5 }))).toThrow(
      TaxInvoiceValidationError
    );
    expect(() => assertValidTaxInvoiceLineItem(makeLineItem({ taxRate: -0.1 }))).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for non-finite numeric fields', () => {
    expect(() => assertValidTaxInvoiceLineItem(makeLineItem({ quantity: Number.NaN }))).toThrow(
      TaxInvoiceValidationError
    );
  });
});

describe('calculateTaxInvoiceLineItemTotals', () => {
  it('computes net, tax, and gross amounts using the default VAT rate', () => {
    const totals = calculateTaxInvoiceLineItemTotals(
      makeLineItem({ quantity: 2, unitPrice: 500, taxRate: 0.05 })
    );

    expect(totals.netAmount).toBe(1000);
    expect(totals.taxAmount).toBe(50);
    expect(totals.grossAmount).toBe(1050);
  });

  it('handles a zero tax rate', () => {
    const totals = calculateTaxInvoiceLineItemTotals(
      makeLineItem({ quantity: 3, unitPrice: 100, taxRate: 0 })
    );

    expect(totals.netAmount).toBe(300);
    expect(totals.taxAmount).toBe(0);
    expect(totals.grossAmount).toBe(300);
  });

  it('propagates validation errors from invalid line items', () => {
    expect(() => calculateTaxInvoiceLineItemTotals(makeLineItem({ unitPrice: -50 }))).toThrow(
      TaxInvoiceValidationError
    );
  });
});

describe('calculateTaxInvoiceTotals', () => {
  it('sums multiple line items into subtotal, tax total, and grand total', () => {
    const lineItems: TaxInvoiceLineItem[] = [
      makeLineItem({ id: 'l1', quantity: 1, unitPrice: 1000, taxRate: 0.05 }),
      makeLineItem({ id: 'l2', quantity: 2, unitPrice: 250, taxRate: 0.05 }),
    ];

    const totals = calculateTaxInvoiceTotals(lineItems);

    expect(totals.subtotal).toBe(1500);
    expect(totals.taxTotal).toBe(75);
    expect(totals.grandTotal).toBe(1575);
    expect(totals.lineItemTotals).toHaveLength(2);
  });

  it('returns zeroed totals for an empty invoice', () => {
    const totals = calculateTaxInvoiceTotals([]);

    expect(totals.subtotal).toBe(0);
    expect(totals.taxTotal).toBe(0);
    expect(totals.grandTotal).toBe(0);
    expect(totals.lineItemTotals).toEqual([]);
  });
});

describe('isTaxInvoiceOverdue', () => {
  it('returns true when the reference date is after the due date and status is issued', () => {
    const invoice = makeInvoice({ status: 'issued', dueDate: '2026-01-15T00:00:00.000Z' });
    expect(isTaxInvoiceOverdue(invoice, new Date('2026-02-01T00:00:00.000Z'))).toBe(true);
  });

  it('returns false when the reference date is before the due date', () => {
    const invoice = makeInvoice({ status: 'issued', dueDate: '2026-01-15T00:00:00.000Z' });
    expect(isTaxInvoiceOverdue(invoice, new Date('2026-01-01T00:00:00.000Z'))).toBe(false);
  });

  it('returns false for paid invoices even if past due', () => {
    const invoice = makeInvoice({ status: 'paid', dueDate: '2026-01-01T00:00:00.000Z' });
    expect(isTaxInvoiceOverdue(invoice, new Date('2026-06-01T00:00:00.000Z'))).toBe(false);
  });

  it('returns false for void invoices even if past due', () => {
    const invoice = makeInvoice({ status: 'void', dueDate: '2026-01-01T00:00:00.000Z' });
    expect(isTaxInvoiceOverdue(invoice, new Date('2026-06-01T00:00:00.000Z'))).toBe(false);
  });

  it('throws TaxInvoiceValidationError for an unparsable due date', () => {
    const invoice = makeInvoice({ dueDate: 'not-a-date' });
    expect(() => isTaxInvoiceOverdue(invoice)).toThrow(TaxInvoiceValidationError);
  });
});

describe('deriveTaxInvoiceStatus', () => {
  it('promotes an issued invoice past its due date to overdue', () => {
    const invoice = makeInvoice({ status: 'issued', dueDate: '2026-01-15T00:00:00.000Z' });
    expect(deriveTaxInvoiceStatus(invoice, new Date('2026-02-01T00:00:00.000Z'))).toBe('overdue');
  });

  it('leaves a still-current issued invoice unchanged', () => {
    const invoice = makeInvoice({ status: 'issued', dueDate: '2026-01-15T00:00:00.000Z' });
    expect(deriveTaxInvoiceStatus(invoice, new Date('2026-01-01T00:00:00.000Z'))).toBe('issued');
  });

  it('leaves draft, paid, and void invoices unchanged regardless of due date', () => {
    expect(
      deriveTaxInvoiceStatus(
        makeInvoice({ status: 'draft', dueDate: '2020-01-01T00:00:00.000Z' }),
        new Date('2026-01-01T00:00:00.000Z')
      )
    ).toBe('draft');
    expect(
      deriveTaxInvoiceStatus(
        makeInvoice({ status: 'paid', dueDate: '2020-01-01T00:00:00.000Z' }),
        new Date('2026-01-01T00:00:00.000Z')
      )
    ).toBe('paid');
    expect(
      deriveTaxInvoiceStatus(
        makeInvoice({ status: 'void', dueDate: '2020-01-01T00:00:00.000Z' }),
        new Date('2026-01-01T00:00:00.000Z')
      )
    ).toBe('void');
  });
});
