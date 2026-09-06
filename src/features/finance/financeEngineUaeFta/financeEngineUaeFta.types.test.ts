import { describe, expect, it } from 'vitest';
import {
  InvalidTrnError,
  STANDARD_VAT_RATE,
  UAE_TRN_LENGTH,
  UAE_TRN_PATTERN,
  VAT_RATE_CATEGORIES,
  VAT_ROUNDING_DECIMAL_PLACES,
  ZERO_VAT_RATE,
  isVatRateCategory,
  type VatLineItem,
  type VatLineItemResult,
  type VatRateCategory,
  type VatSummary,
} from './financeEngineUaeFta.types';

describe('financeEngineUaeFta.types', () => {
  describe('VAT_RATE_CATEGORIES', () => {
    it('contains exactly the four FTA VAT categories, in a stable order', () => {
      expect(VAT_RATE_CATEGORIES).toEqual(['standard', 'zeroRated', 'exempt', 'outOfScope']);
    });

    it('has no duplicate entries', () => {
      expect(new Set(VAT_RATE_CATEGORIES).size).toBe(VAT_RATE_CATEGORIES.length);
    });
  });

  describe('isVatRateCategory', () => {
    it.each(['standard', 'zeroRated', 'exempt', 'outOfScope'])(
      'returns true for the valid category %s',
      category => {
        expect(isVatRateCategory(category)).toBe(true);
      }
    );

    it('returns false for an unrecognized string', () => {
      expect(isVatRateCategory('reduced')).toBe(false);
    });

    it('returns false for an empty string', () => {
      expect(isVatRateCategory('')).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(isVatRateCategory(5)).toBe(false);
      expect(isVatRateCategory(null)).toBe(false);
      expect(isVatRateCategory(undefined)).toBe(false);
      expect(isVatRateCategory({ category: 'standard' })).toBe(false);
    });

    it('narrows the type for a valid category so it can be assigned to VatRateCategory', () => {
      const value: unknown = 'standard';
      if (isVatRateCategory(value)) {
        const narrowed: VatRateCategory = value;
        expect(narrowed).toBe('standard');
      } else {
        throw new Error('expected isVatRateCategory to return true for "standard"');
      }
    });
  });

  describe('rate and rounding constants', () => {
    it('defines the standard VAT rate as 5%', () => {
      expect(STANDARD_VAT_RATE).toBe(0.05);
    });

    it('defines the zero VAT rate as 0', () => {
      expect(ZERO_VAT_RATE).toBe(0);
    });

    it('defines VAT rounding to 2 decimal places', () => {
      expect(VAT_ROUNDING_DECIMAL_PLACES).toBe(2);
    });
  });

  describe('UAE TRN constants', () => {
    it('requires TRNs to be exactly 15 digits long', () => {
      expect(UAE_TRN_LENGTH).toBe(15);
    });

    it('matches a valid 15-digit numeric TRN', () => {
      const trn = '123456789012345';
      expect(trn).toHaveLength(UAE_TRN_LENGTH);
      expect(UAE_TRN_PATTERN.test(trn)).toBe(true);
    });

    it('rejects a TRN that is too short', () => {
      expect(UAE_TRN_PATTERN.test('12345678901234')).toBe(false);
    });

    it('rejects a TRN that is too long', () => {
      expect(UAE_TRN_PATTERN.test('1234567890123456')).toBe(false);
    });

    it('rejects an alphanumeric TRN', () => {
      expect(UAE_TRN_PATTERN.test('12345678901234A')).toBe(false);
    });

    it('rejects an empty TRN', () => {
      expect(UAE_TRN_PATTERN.test('')).toBe(false);
    });
  });

  describe('InvalidTrnError', () => {
    it('is an instance of both Error and InvalidTrnError', () => {
      const error = new InvalidTrnError('bad-trn');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(InvalidTrnError);
    });

    it('carries the offending TRN value on a readonly trn property', () => {
      const error = new InvalidTrnError('1234');
      expect(error.trn).toBe('1234');
    });

    it('includes the offending TRN value in the error message', () => {
      const error = new InvalidTrnError('not-a-trn');
      expect(error.message).toContain('not-a-trn');
    });

    it('sets a distinguishing error name', () => {
      const error = new InvalidTrnError('000000000000000');
      expect(error.name).toBe('InvalidTrnError');
    });
  });

  describe('data model shapes (compile-time contract, exercised via real objects)', () => {
    it('accepts a well-formed VatLineItem', () => {
      const lineItem: VatLineItem = {
        description: 'Consulting services',
        netAmount: 1000,
        category: 'standard',
      };
      expect(lineItem.category).toBe('standard');
      expect(isVatRateCategory(lineItem.category)).toBe(true);
    });

    it('accepts a well-formed VatLineItemResult extending VatLineItem', () => {
      const result: VatLineItemResult = {
        description: 'Consulting services',
        netAmount: 1000,
        category: 'standard',
        vatRate: STANDARD_VAT_RATE,
        vatAmount: 50,
        grossAmount: 1050,
      };
      expect(result.grossAmount).toBe(result.netAmount + result.vatAmount);
    });

    it('accepts a well-formed VatSummary aggregating line item results', () => {
      const lineItemResult: VatLineItemResult = {
        description: 'Export sale',
        netAmount: 500,
        category: 'zeroRated',
        vatRate: ZERO_VAT_RATE,
        vatAmount: 0,
        grossAmount: 500,
      };
      const summary: VatSummary = {
        outputVat: 0,
        inputVat: 0,
        netVatPayable: 0,
        lineItems: [lineItemResult],
      };
      expect(summary.lineItems).toHaveLength(1);
      expect(summary.netVatPayable).toBe(summary.outputVat - summary.inputVat);
    });
  });
});
