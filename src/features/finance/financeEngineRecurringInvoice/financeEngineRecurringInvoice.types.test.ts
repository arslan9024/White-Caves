import { describe, expect, it } from 'vitest';
import {
  calculateLineItemSubtotal,
  calculateLineItemTax,
  calculateRecurringInvoiceTotals,
  computeNextOccurrenceDate,
  isIsoDateString,
  isRecurringInvoiceFrequency,
  isRecurringInvoiceStatus,
  roundToCents,
  validateRecurringInvoiceTemplate,
  type RecurringInvoiceLineItem,
  type RecurringInvoiceTemplate,
} from './financeEngineRecurringInvoice.types';

function buildLineItem(
  overrides: Partial<RecurringInvoiceLineItem> = {}
): RecurringInvoiceLineItem {
  return {
    id: 'li-1',
    description: 'Monthly hosting fee',
    quantity: 2,
    unitAmount: 49.99,
    taxRatePercent: 5,
    ...overrides,
  };
}

function buildTemplate(
  overrides: Partial<RecurringInvoiceTemplate> = {}
): RecurringInvoiceTemplate {
  return {
    id: 'inv-tmpl-1',
    customerId: 'cust-1',
    currency: 'USD',
    status: 'active',
    schedule: {
      frequency: 'monthly',
      startDate: '2024-01-15',
    },
    lineItems: [buildLineItem()],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('isRecurringInvoiceFrequency', () => {
  it('accepts all valid frequency values', () => {
    for (const frequency of ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']) {
      expect(isRecurringInvoiceFrequency(frequency)).toBe(true);
    }
  });

  it('rejects invalid or non-string values', () => {
    expect(isRecurringInvoiceFrequency('annually')).toBe(false);
    expect(isRecurringInvoiceFrequency(42)).toBe(false);
    expect(isRecurringInvoiceFrequency(undefined)).toBe(false);
  });
});

describe('isRecurringInvoiceStatus', () => {
  it('accepts all valid status values', () => {
    for (const status of ['active', 'paused', 'completed', 'cancelled']) {
      expect(isRecurringInvoiceStatus(status)).toBe(true);
    }
  });

  it('rejects invalid values', () => {
    expect(isRecurringInvoiceStatus('archived')).toBe(false);
    expect(isRecurringInvoiceStatus(null)).toBe(false);
  });
});

describe('isIsoDateString', () => {
  it('accepts well-formed ISO-8601 dates', () => {
    expect(isIsoDateString('2024-01-15')).toBe(true);
    expect(isIsoDateString('2024-02-29')).toBe(true); // leap year
  });

  it('rejects malformed or invalid calendar dates', () => {
    expect(isIsoDateString('2024-13-01')).toBe(false);
    expect(isIsoDateString('2023-02-29')).toBe(false); // not a leap year
    expect(isIsoDateString('15-01-2024')).toBe(false);
    expect(isIsoDateString(20240115)).toBe(false);
  });
});

describe('roundToCents', () => {
  it('rounds to two decimal places', () => {
    expect(roundToCents(10.005)).toBeCloseTo(10.01, 5);
    expect(roundToCents(9.999)).toBeCloseTo(10.0, 5);
    expect(roundToCents(3)).toBe(3);
  });
});

describe('calculateLineItemSubtotal and calculateLineItemTax', () => {
  it('computes subtotal as quantity * unitAmount', () => {
    const item = buildLineItem({ quantity: 3, unitAmount: 10 });
    expect(calculateLineItemSubtotal(item)).toBe(30);
  });

  it('computes tax based on the tax rate percentage', () => {
    const item = buildLineItem({ quantity: 2, unitAmount: 100, taxRatePercent: 10 });
    expect(calculateLineItemTax(item)).toBe(20);
  });

  it('returns zero tax when taxRatePercent is zero', () => {
    const item = buildLineItem({ quantity: 5, unitAmount: 20, taxRatePercent: 0 });
    expect(calculateLineItemTax(item)).toBe(0);
  });
});

describe('calculateRecurringInvoiceTotals', () => {
  it('sums subtotal, tax, and total across multiple line items', () => {
    const template = {
      lineItems: [
        buildLineItem({ id: 'a', quantity: 1, unitAmount: 100, taxRatePercent: 10 }),
        buildLineItem({ id: 'b', quantity: 2, unitAmount: 50, taxRatePercent: 5 }),
      ],
    };

    const totals = calculateRecurringInvoiceTotals(template);

    expect(totals.subtotal).toBe(200); // 100 + (2*50)
    expect(totals.tax).toBe(15); // 10 + 5
    expect(totals.total).toBe(215);
  });

  it('returns zero totals for an empty line item list', () => {
    const totals = calculateRecurringInvoiceTotals({ lineItems: [] });
    expect(totals).toEqual({ subtotal: 0, tax: 0, total: 0 });
  });
});

describe('validateRecurringInvoiceTemplate', () => {
  it('returns isValid=true and no errors for a well-formed template', () => {
    const result = validateRecurringInvoiceTemplate(buildTemplate());
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('flags a missing customerId', () => {
    const result = validateRecurringInvoiceTemplate(buildTemplate({ customerId: '' }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('customerId is required');
  });

  it('flags an invalid currency code', () => {
    const result = validateRecurringInvoiceTemplate(buildTemplate({ currency: 'US' }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('currency must be a 3-letter ISO-4217 code');
  });

  it('flags an end date before the start date', () => {
    const result = validateRecurringInvoiceTemplate(
      buildTemplate({
        schedule: {
          frequency: 'monthly',
          startDate: '2024-06-01',
          endDate: '2024-01-01',
        },
      })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('schedule.endDate must not be before schedule.startDate');
  });

  it('flags a non-positive maxOccurrences', () => {
    const result = validateRecurringInvoiceTemplate(
      buildTemplate({
        schedule: {
          frequency: 'weekly',
          startDate: '2024-01-01',
          maxOccurrences: 0,
        },
      })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'schedule.maxOccurrences must be a positive integer when provided'
    );
  });

  it('flags an empty lineItems array', () => {
    const result = validateRecurringInvoiceTemplate(buildTemplate({ lineItems: [] }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('lineItems must contain at least one item');
  });

  it('flags a line item with non-positive quantity', () => {
    const result = validateRecurringInvoiceTemplate(
      buildTemplate({ lineItems: [buildLineItem({ quantity: 0 })] })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('lineItems[0].quantity must be greater than 0');
  });

  it('flags a taxRatePercent outside of 0-100', () => {
    const result = validateRecurringInvoiceTemplate(
      buildTemplate({ lineItems: [buildLineItem({ taxRatePercent: 150 })] })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('lineItems[0].taxRatePercent must be between 0 and 100');
  });
});

describe('computeNextOccurrenceDate', () => {
  it('adds a fixed number of days for daily/weekly/biweekly frequencies', () => {
    expect(computeNextOccurrenceDate('daily', '2024-01-15')).toBe('2024-01-16');
    expect(computeNextOccurrenceDate('weekly', '2024-01-15')).toBe('2024-01-22');
    expect(computeNextOccurrenceDate('biweekly', '2024-01-15')).toBe('2024-01-29');
  });

  it('advances by calendar month for monthly frequency, handling shorter months', () => {
    expect(computeNextOccurrenceDate('monthly', '2024-01-31')).toBe('2024-03-02'); // JS Date month overflow behavior
    expect(computeNextOccurrenceDate('monthly', '2024-01-15')).toBe('2024-02-15');
  });

  it('advances by three calendar months for quarterly frequency', () => {
    expect(computeNextOccurrenceDate('quarterly', '2024-01-15')).toBe('2024-04-15');
  });

  it('advances by twelve calendar months for yearly frequency', () => {
    expect(computeNextOccurrenceDate('yearly', '2024-02-29')).toBe('2025-03-01'); // leap day overflow
    expect(computeNextOccurrenceDate('yearly', '2024-01-15')).toBe('2025-01-15');
  });

  it('throws when given a malformed previous occurrence date', () => {
    expect(() => computeNextOccurrenceDate('monthly', 'not-a-date')).toThrow(
      'previousOccurrenceIsoDate must be a valid ISO-8601 date'
    );
  });
});
