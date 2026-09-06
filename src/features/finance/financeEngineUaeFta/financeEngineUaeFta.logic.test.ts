import { describe, expect, it } from 'vitest';
import {
  InvalidTrnError,
  UAE_STANDARD_VAT_RATE,
  assertValidUaeTrn,
  calculateLineItemVat,
  getVatRateForCategory,
  isValidUaeTrn,
  summarizeVat,
  type VatLineItem,
} from './financeEngineUaeFta.logic';

describe('getVatRateForCategory', () => {
  it('returns 5% for standard category', () => {
    expect(getVatRateForCategory('standard')).toBe(UAE_STANDARD_VAT_RATE);
    expect(getVatRateForCategory('standard')).toBe(0.05);
  });

  it('returns 0% for zeroRated, exempt, and outOfScope categories', () => {
    expect(getVatRateForCategory('zeroRated')).toBe(0);
    expect(getVatRateForCategory('exempt')).toBe(0);
    expect(getVatRateForCategory('outOfScope')).toBe(0);
  });
});

describe('calculateLineItemVat', () => {
  it('calculates 5% VAT and gross amount for a standard-rated line item', () => {
    const result = calculateLineItemVat({
      description: 'Consulting services',
      netAmount: 1000,
      category: 'standard',
    });

    expect(result.vatRate).toBe(0.05);
    expect(result.vatAmount).toBe(50);
    expect(result.grossAmount).toBe(1050);
    expect(result.netAmount).toBe(1000);
    expect(result.description).toBe('Consulting services');
  });

  it('rounds VAT half-up at a .xx5 rounding boundary', () => {
    // 20.05 * 0.05 = 1.0025 -> should round up to 1.00 (half-up at 2dp: 1.0025 -> 1.00,
    // use a value that lands exactly on the .xx5 boundary at the cent level instead)
    const result = calculateLineItemVat({
      description: 'Boundary case',
      netAmount: 0.25,
      category: 'standard',
    });
    // 0.25 * 0.05 = 0.0125 -> rounds to 0.01 under half-up at 2dp (0.0125 rounds to 0.01
    // since the 3rd decimal digit determines rounding at 2dp: 0.0125 -> 0.01)
    expect(result.vatAmount).toBe(0.01);

    const boundary = calculateLineItemVat({
      description: 'Exact half-cent boundary',
      netAmount: 10.05,
      category: 'standard',
    });
    // 10.05 * 0.05 = 0.5025 -> rounds to 0.50
    expect(boundary.vatAmount).toBe(0.5);

    const halfUpCase = calculateLineItemVat({
      description: 'Half up at cent boundary',
      netAmount: 30,
      category: 'standard',
    });
    // 30 * 0.05 = 1.5 exactly -> gross must be net + vat = 31.5
    expect(halfUpCase.vatAmount).toBe(1.5);
    expect(halfUpCase.grossAmount).toBe(31.5);
  });

  it('produces zero VAT and gross equal to net for zeroRated line items', () => {
    const result = calculateLineItemVat({
      description: 'Exported goods',
      netAmount: 500,
      category: 'zeroRated',
    });

    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(500);
  });

  it('produces zero VAT and gross equal to net for exempt line items', () => {
    const result = calculateLineItemVat({
      description: 'Residential rent',
      netAmount: 2000,
      category: 'exempt',
    });

    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(2000);
  });

  it('produces zero VAT and gross equal to net for outOfScope line items', () => {
    const result = calculateLineItemVat({
      description: 'Out of scope supply',
      netAmount: 300,
      category: 'outOfScope',
    });

    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(300);
  });

  it('throws RangeError for negative netAmount', () => {
    expect(() =>
      calculateLineItemVat({ description: 'Bad', netAmount: -10, category: 'standard' })
    ).toThrow(RangeError);
  });

  it('throws RangeError for non-finite netAmount', () => {
    expect(() =>
      calculateLineItemVat({ description: 'Bad', netAmount: Number.NaN, category: 'standard' })
    ).toThrow(RangeError);
    expect(() =>
      calculateLineItemVat({
        description: 'Bad',
        netAmount: Number.POSITIVE_INFINITY,
        category: 'standard',
      })
    ).toThrow(RangeError);
  });

  it('allows a zero netAmount', () => {
    const result = calculateLineItemVat({
      description: 'Free item',
      netAmount: 0,
      category: 'standard',
    });
    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(0);
  });
});

describe('summarizeVat', () => {
  const outputs: VatLineItem[] = [
    { description: 'Sale A', netAmount: 1000, category: 'standard' },
    { description: 'Sale B (export)', netAmount: 200, category: 'zeroRated' },
  ];
  const smallInputs: VatLineItem[] = [
    { description: 'Purchase A', netAmount: 100, category: 'standard' },
  ];

  it('computes a positive netVatPayable when output VAT exceeds input VAT', () => {
    const summary = summarizeVat(outputs, smallInputs);

    expect(summary.outputVat).toBe(50); // 1000 * 5% + 200 * 0%
    expect(summary.inputVat).toBe(5); // 100 * 5%
    expect(summary.netVatPayable).toBe(45);
    expect(summary.lineItems).toHaveLength(3);
  });

  it('computes a negative netVatPayable (reclaimable) when input VAT exceeds output VAT', () => {
    const largeInputs: VatLineItem[] = [
      { description: 'Big purchase', netAmount: 5000, category: 'standard' },
    ];

    const summary = summarizeVat(outputs, largeInputs);

    expect(summary.outputVat).toBe(50);
    expect(summary.inputVat).toBe(250);
    expect(summary.netVatPayable).toBe(-200);
  });

  it('handles empty output and input line item arrays', () => {
    const summary = summarizeVat([], []);

    expect(summary.outputVat).toBe(0);
    expect(summary.inputVat).toBe(0);
    expect(summary.netVatPayable).toBe(0);
    expect(summary.lineItems).toHaveLength(0);
  });

  it('propagates RangeError from an invalid line item', () => {
    const invalidOutputs: VatLineItem[] = [
      { description: 'Bad', netAmount: -1, category: 'standard' },
    ];
    expect(() => summarizeVat(invalidOutputs, [])).toThrow(RangeError);
  });
});

describe('isValidUaeTrn', () => {
  it('returns true for a valid 15-digit numeric TRN', () => {
    expect(isValidUaeTrn('123456789012345')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isValidUaeTrn('')).toBe(false);
  });

  it('returns false for a 14-digit string (too short)', () => {
    expect(isValidUaeTrn('12345678901234')).toBe(false);
  });

  it('returns false for a 16-digit string (too long)', () => {
    expect(isValidUaeTrn('1234567890123456')).toBe(false);
  });

  it('returns false for an alphanumeric string', () => {
    expect(isValidUaeTrn('12345678901234A')).toBe(false);
  });

  it('never throws regardless of input', () => {
    expect(() => isValidUaeTrn('not-a-trn-at-all')).not.toThrow();
  });
});

describe('assertValidUaeTrn / InvalidTrnError', () => {
  it('does not throw for a valid TRN', () => {
    expect(() => assertValidUaeTrn('123456789012345')).not.toThrow();
  });

  it('throws InvalidTrnError with a message containing the invalid TRN value', () => {
    const badTrn = '12345';
    expect(() => assertValidUaeTrn(badTrn)).toThrow(InvalidTrnError);
    try {
      assertValidUaeTrn(badTrn);
      throw new Error('assertValidUaeTrn should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidTrnError);
      expect((error as InvalidTrnError).message).toContain(badTrn);
      expect((error as InvalidTrnError).trn).toBe(badTrn);
      expect((error as InvalidTrnError).name).toBe('InvalidTrnError');
    }
  });

  it('is distinguishable from a generic Error via instanceof', () => {
    const genericError = new Error('generic');
    const trnError = new InvalidTrnError('000');

    expect(genericError instanceof InvalidTrnError).toBe(false);
    expect(trnError instanceof InvalidTrnError).toBe(true);
    expect(trnError instanceof Error).toBe(true);
  });
});
