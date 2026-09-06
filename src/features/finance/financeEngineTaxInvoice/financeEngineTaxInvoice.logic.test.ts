import { describe, expect, it } from 'vitest';
import {
  computeLineItem,
  computeTaxInvoice,
  generateInvoiceNumber,
  roundCurrency,
  TaxInvoiceValidationError,
  validateLineItem,
  validateTaxInvoiceInput,
  type TaxInvoiceInput,
  type TaxInvoiceLineItemInput,
} from './financeEngineTaxInvoice.logic';

describe('roundCurrency', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundCurrency(1.005)).toBe(1.01);
    expect(roundCurrency(10.126)).toBe(10.13);
    expect(roundCurrency(10)).toBe(10);
  });

  it('avoids floating point artifacts', () => {
    expect(roundCurrency(0.1 + 0.2)).toBe(0.3);
  });
});

describe('validateLineItem', () => {
  const validItem: TaxInvoiceLineItemInput = {
    description: 'Widget',
    quantity: 2,
    unitPrice: 10,
    taxRate: 0.05,
  };

  it('does not throw for a valid line item', () => {
    expect(() => validateLineItem(validItem, 0)).not.toThrow();
  });

  it('throws for missing description', () => {
    expect(() => validateLineItem({ ...validItem, description: '' }, 0)).toThrow(
      TaxInvoiceValidationError
    );
  });

  it('throws for non-positive quantity', () => {
    expect(() => validateLineItem({ ...validItem, quantity: 0 }, 1)).toThrow(/quantity/);
    expect(() => validateLineItem({ ...validItem, quantity: -1 }, 1)).toThrow(/quantity/);
  });

  it('throws for negative unit price', () => {
    expect(() => validateLineItem({ ...validItem, unitPrice: -5 }, 2)).toThrow(/unit price/);
  });

  it('throws for tax rate out of range', () => {
    expect(() => validateLineItem({ ...validItem, taxRate: -0.1 }, 3)).toThrow(/tax rate/);
    expect(() => validateLineItem({ ...validItem, taxRate: 1.5 }, 3)).toThrow(/tax rate/);
  });
});

describe('validateTaxInvoiceInput', () => {
  const validInput: TaxInvoiceInput = {
    customerId: 'CUST-1',
    issueDate: '2024-01-15',
    lineItems: [{ description: 'Widget', quantity: 1, unitPrice: 100, taxRate: 0.05 }],
  };

  it('does not throw for valid input', () => {
    expect(() => validateTaxInvoiceInput(validInput)).not.toThrow();
  });

  it('throws when customerId is missing', () => {
    expect(() => validateTaxInvoiceInput({ ...validInput, customerId: '' })).toThrow(/customerId/);
  });

  it('throws when issueDate is invalid', () => {
    expect(() => validateTaxInvoiceInput({ ...validInput, issueDate: 'not-a-date' })).toThrow(
      /issueDate/
    );
  });

  it('throws when there are no line items', () => {
    expect(() => validateTaxInvoiceInput({ ...validInput, lineItems: [] })).toThrow(/line item/);
  });

  it('propagates line item validation errors with correct index', () => {
    expect(() =>
      validateTaxInvoiceInput({
        ...validInput,
        lineItems: [
          { description: 'Widget', quantity: 1, unitPrice: 100, taxRate: 0.05 },
          { description: '', quantity: 1, unitPrice: 100, taxRate: 0.05 },
        ],
      })
    ).toThrow(/index 1/);
  });
});

describe('computeLineItem', () => {
  it('computes subtotal, tax, and total correctly', () => {
    const result = computeLineItem({
      description: 'Widget',
      quantity: 3,
      unitPrice: 15.5,
      taxRate: 0.05,
    });
    expect(result.subtotal).toBe(46.5);
    expect(result.taxAmount).toBe(2.33);
    expect(result.total).toBe(48.83);
    expect(result.description).toBe('Widget');
  });

  it('handles zero tax rate', () => {
    const result = computeLineItem({
      description: 'Tax exempt item',
      quantity: 2,
      unitPrice: 50,
      taxRate: 0,
    });
    expect(result.subtotal).toBe(100);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(100);
  });
});

describe('generateInvoiceNumber', () => {
  it('generates a deterministic invoice number', () => {
    expect(generateInvoiceNumber('CUST-1', '2024-01-15')).toBe('INV-20240115-CUST1');
  });

  it('sanitizes non-alphanumeric characters and uppercases', () => {
    expect(generateInvoiceNumber('cust_42!', '2024-12-31')).toBe('INV-20241231-CUST42');
  });

  it('is stable across repeated calls with the same input', () => {
    const first = generateInvoiceNumber('CUST-9', '2023-06-01');
    const second = generateInvoiceNumber('CUST-9', '2023-06-01');
    expect(first).toBe(second);
  });
});

describe('computeTaxInvoice', () => {
  it('computes a full invoice with correct aggregated totals', () => {
    const input: TaxInvoiceInput = {
      customerId: 'CUST-1',
      issueDate: '2024-01-15',
      lineItems: [
        { description: 'Widget', quantity: 2, unitPrice: 10, taxRate: 0.05 },
        { description: 'Gadget', quantity: 1, unitPrice: 100, taxRate: 0.05 },
      ],
    };
    const result = computeTaxInvoice(input);

    expect(result.invoiceNumber).toBe('INV-20240115-CUST1');
    expect(result.currency).toBe('AED');
    expect(result.lineItems).toHaveLength(2);
    expect(result.subtotal).toBe(120);
    expect(result.totalTax).toBe(6);
    expect(result.grandTotal).toBe(126);
  });

  it('uses the provided currency when specified', () => {
    const input: TaxInvoiceInput = {
      customerId: 'CUST-2',
      issueDate: '2024-02-01',
      currency: 'USD',
      lineItems: [{ description: 'Service', quantity: 1, unitPrice: 200, taxRate: 0.1 }],
    };
    const result = computeTaxInvoice(input);
    expect(result.currency).toBe('USD');
    expect(result.grandTotal).toBe(220);
  });

  it('throws TaxInvoiceValidationError for invalid input', () => {
    const invalidInput: TaxInvoiceInput = {
      customerId: '',
      issueDate: '2024-01-15',
      lineItems: [{ description: 'Widget', quantity: 1, unitPrice: 10, taxRate: 0.05 }],
    };
    expect(() => computeTaxInvoice(invalidInput)).toThrow(TaxInvoiceValidationError);
  });

  it('correctly aggregates totals across multiple differing tax rates', () => {
    const input: TaxInvoiceInput = {
      customerId: 'CUST-3',
      issueDate: '2024-03-10',
      lineItems: [
        { description: 'A', quantity: 1, unitPrice: 33.33, taxRate: 0.05 },
        { description: 'B', quantity: 4, unitPrice: 12.49, taxRate: 0 },
        { description: 'C', quantity: 2, unitPrice: 5, taxRate: 0.2 },
      ],
    };
    const result = computeTaxInvoice(input);
    const expectedSubtotal = roundCurrency(33.33 + 4 * 12.49 + 2 * 5);
    expect(result.subtotal).toBe(expectedSubtotal);
    expect(result.grandTotal).toBe(roundCurrency(result.subtotal + result.totalTax));
  });
});
