import { describe, expect, it } from 'vitest';

import {
  InvalidTrnError,
  assertValidUaeTrn,
  calculateLineItemVat,
  isValidUaeTrn,
  summarizeVat,
  type VatLineItem,
} from './financeEngineUaeFta.logic';

describe('calculateLineItemVat', () => {
  it('computes 5% VAT for a standard-rated line item', () => {
    const item: VatLineItem = {
      description: 'Consulting services',
      netAmount: 200,
      category: 'standard',
    };

    const result = calculateLineItemVat(item);

    expect(result.vatRate).toBe(0.05);
    expect(result.vatAmount).toBe(10);
    expect(result.grossAmount).toBe(210);
  });

  it('rounds VAT using round-half-up at a .xx5 boundary', () => {
    // 0.5 * 0.05 = 0.025 -> rounds up to 0.03, not down to 0.02.
    const item: VatLineItem = {
      description: 'Boundary rounding case',
      netAmount: 0.5,
      category: 'standard',
    };

    const result = calculateLineItemVat(item);

    expect(result.vatAmount).toBe(0.03);
    expect(result.grossAmount).toBe(0.53);
  });

  it('computes 0 VAT for a zero-rated line item and gross equals net', () => {
    const item: VatLineItem = {
      description: 'Export of goods',
      netAmount: 500,
      category: 'zeroRated',
    };

    const result = calculateLineItemVat(item);

    expect(result.vatRate).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(500);
  });

  it('computes 0 VAT for an exempt line item and gross equals net', () => {
    const item: VatLineItem = {
      description: 'Residential rent',
      netAmount: 1000,
      category: 'exempt',
    };

    const result = calculateLineItemVat(item);

    expect(result.vatRate).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(1000);
  });

  it('computes 0 VAT for an out-of-scope line item', () => {
    const item: VatLineItem = {
      description: 'Non-taxable transaction',
      netAmount: 75,
      category: 'outOfScope',
    };

    const result = calculateLineItemVat(item);

    expect(result.vatRate).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(75);
  });

  it('throws a RangeError for a negative netAmount', () => {
    const item: VatLineItem = {
      description: 'Invalid negative amount',
      netAmount: -10,
      category: 'standard',
    };

    expect(() => calculateLineItemVat(item)).toThrow(RangeError);
  });

  it('throws a RangeError for a non-finite netAmount', () => {
    const item: VatLineItem = {
      description: 'Invalid non-finite amount',
      netAmount: Number.POSITIVE_INFINITY,
      category: 'standard',
    };

    expect(() => calculateLineItemVat(item)).toThrow(RangeError);
  });

  it('does not mutate the input line item', () => {
    const item: VatLineItem = {
      description: 'Immutability check',
      netAmount: 100,
      category: 'standard',
    };
    const snapshot = { ...item };

    calculateLineItemVat(item);

    expect(item).toEqual(snapshot);
  });
});

describe('summarizeVat', () => {
  it('computes a positive netVatPayable when output VAT exceeds input VAT', () => {
    const outputLineItems: VatLineItem[] = [
      { description: 'Sale A', netAmount: 1000, category: 'standard' },
      { description: 'Sale B', netAmount: 200, category: 'zeroRated' },
    ];
    const inputLineItems: VatLineItem[] = [
      { description: 'Purchase A', netAmount: 200, category: 'standard' },
    ];

    const summary = summarizeVat(outputLineItems, inputLineItems);

    expect(summary.outputVat).toBe(50);
    expect(summary.inputVat).toBe(10);
    expect(summary.netVatPayable).toBe(40);
    expect(summary.lineItems).toHaveLength(3);
  });

  it('computes a negative netVatPayable (reclaimable) when input VAT exceeds output VAT', () => {
    const outputLineItems: VatLineItem[] = [
      { description: 'Sale A', netAmount: 100, category: 'standard' },
    ];
    const inputLineItems: VatLineItem[] = [
      { description: 'Purchase A', netAmount: 1000, category: 'standard' },
    ];

    const summary = summarizeVat(outputLineItems, inputLineItems);

    expect(summary.outputVat).toBe(5);
    expect(summary.inputVat).toBe(50);
    expect(summary.netVatPayable).toBe(-45);
  });

  it('handles empty line item lists, returning zero totals', () => {
    const summary = summarizeVat([], []);

    expect(summary.outputVat).toBe(0);
    expect(summary.inputVat).toBe(0);
    expect(summary.netVatPayable).toBe(0);
    expect(summary.lineItems).toEqual([]);
  });

  it('orders lineItems as all output results followed by all input results', () => {
    const outputLineItems: VatLineItem[] = [
      { description: 'Output 1', netAmount: 10, category: 'standard' },
      { description: 'Output 2', netAmount: 20, category: 'standard' },
    ];
    const inputLineItems: VatLineItem[] = [
      { description: 'Input 1', netAmount: 30, category: 'standard' },
    ];

    const summary = summarizeVat(outputLineItems, inputLineItems);

    expect(summary.lineItems.map(item => item.description)).toEqual([
      'Output 1',
      'Output 2',
      'Input 1',
    ]);
  });
});

describe('isValidUaeTrn', () => {
  it('returns true for a valid 15-digit numeric TRN', () => {
    expect(isValidUaeTrn('123456789012345')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isValidUaeTrn('')).toBe(false);
  });

  it('returns false for a 14-digit (too short) TRN', () => {
    expect(isValidUaeTrn('12345678901234')).toBe(false);
  });

  it('returns false for a 16-digit (too long) TRN', () => {
    expect(isValidUaeTrn('1234567890123456')).toBe(false);
  });

  it('returns false for an alphanumeric TRN', () => {
    expect(isValidUaeTrn('12345678901234A')).toBe(false);
  });

  it('never throws for malformed input', () => {
    expect(() => isValidUaeTrn('not-a-trn')).not.toThrow();
  });
});

describe('InvalidTrnError', () => {
  it('carries the offending TRN value in its message', () => {
    const error = new InvalidTrnError('123');

    expect(error.message).toContain('123');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidTrnError);
  });

  it('is raised by assertValidUaeTrn for an invalid TRN', () => {
    expect(() => assertValidUaeTrn('abc')).toThrow(InvalidTrnError);
  });

  it('is not raised by assertValidUaeTrn for a valid TRN', () => {
    expect(() => assertValidUaeTrn('123456789012345')).not.toThrow();
  });
});
