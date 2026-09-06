import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RATE_TABLE_VERSION,
  SMALL_BUSINESS_RELIEF_THRESHOLD_AED,
  STANDARD_CORPORATE_TAX_RATE,
  calculate,
  validateUaeCorporateTaxInput,
  formatAedAmount,
  UaeCorporateTaxValidationError,
  type UaeCorporateTaxInput,
} from './financeEngineUaeCorporate.logic';

describe('financeEngineUaeCorporate.logic', () => {
  describe('calculate - standard rate above the relief threshold', () => {
    it('applies 9% tax on the portion of taxable income above AED 375,000', () => {
      const input: UaeCorporateTaxInput = {
        accountingProfit: 1_000_000,
        currency: 'AED',
      };
      const result = calculate(input);

      const expectedTaxDue =
        (1_000_000 - SMALL_BUSINESS_RELIEF_THRESHOLD_AED) * STANDARD_CORPORATE_TAX_RATE;

      expect(result.reliefApplied).toBe(false);
      expect(result.taxableIncome).toBe(1_000_000);
      expect(result.taxDue).toBeCloseTo(expectedTaxDue, 2);
      expect(result.currency).toBe('AED');
      expect(result.rateTableVersion).toBe(DEFAULT_RATE_TABLE_VERSION);
    });

    it('includes non-deductible add-backs and subtracts exempt income before taxing', () => {
      const result = calculate({
        accountingProfit: 500_000,
        nonDeductibleAddBacks: 100_000,
        exemptIncome: 50_000,
        currency: 'AED',
      });

      // taxable income = 500,000 + 100,000 - 50,000 = 550,000
      const expectedTaxableIncome = 550_000;
      const expectedTaxDue =
        (expectedTaxableIncome - SMALL_BUSINESS_RELIEF_THRESHOLD_AED) * STANDARD_CORPORATE_TAX_RATE;

      expect(result.taxableIncome).toBe(expectedTaxableIncome);
      expect(result.taxDue).toBeCloseTo(expectedTaxDue, 2);
      expect(result.reliefApplied).toBe(false);
    });
  });

  describe('calculate - boundary at the relief threshold', () => {
    it('applies Small Business Relief (zero tax) exactly at AED 375,000', () => {
      const result = calculate({
        accountingProfit: SMALL_BUSINESS_RELIEF_THRESHOLD_AED,
        currency: 'AED',
      });

      expect(result.reliefApplied).toBe(true);
      expect(result.taxDue).toBe(0);
      expect(result.taxableIncome).toBe(SMALL_BUSINESS_RELIEF_THRESHOLD_AED);
    });

    it('taxes only the excess over AED 375,000 at AED 375,001', () => {
      const result = calculate({
        accountingProfit: SMALL_BUSINESS_RELIEF_THRESHOLD_AED + 1,
        currency: 'AED',
      });

      expect(result.reliefApplied).toBe(false);
      expect(result.taxDue).toBeCloseTo(1 * STANDARD_CORPORATE_TAX_RATE, 2);
    });
  });

  describe('calculate - zero and negative accounting profit', () => {
    it('floors taxable income at zero and produces zero tax for zero profit', () => {
      const result = calculate({ accountingProfit: 0, currency: 'AED' });

      expect(result.taxableIncome).toBe(0);
      expect(result.taxDue).toBe(0);
      expect(result.reliefApplied).toBe(true);
    });

    it('floors taxable income at zero and produces zero tax for negative profit', () => {
      const result = calculate({ accountingProfit: -250_000, currency: 'AED' });

      expect(result.taxableIncome).toBe(0);
      expect(result.taxDue).toBe(0);
      expect(result.reliefApplied).toBe(true);
    });

    it('floors taxable income at zero even when add-backs are insufficient to offset a loss', () => {
      const result = calculate({
        accountingProfit: -500_000,
        nonDeductibleAddBacks: 100_000,
        currency: 'AED',
      });

      expect(result.taxableIncome).toBe(0);
      expect(result.taxDue).toBe(0);
    });
  });

  describe('calculate - rateTableVersion pass-through and input immutability', () => {
    it('defaults to DEFAULT_RATE_TABLE_VERSION when none is supplied', () => {
      const result = calculate({ accountingProfit: 1_000_000, currency: 'AED' });
      expect(result.rateTableVersion).toBe(DEFAULT_RATE_TABLE_VERSION);
    });

    it('passes through an explicitly supplied known rateTableVersion', () => {
      const result = calculate({
        accountingProfit: 1_000_000,
        currency: 'AED',
        rateTableVersion: DEFAULT_RATE_TABLE_VERSION,
      });
      expect(result.rateTableVersion).toBe(DEFAULT_RATE_TABLE_VERSION);
    });

    it('throws for an unknown rateTableVersion', () => {
      expect(() =>
        calculate({
          accountingProfit: 1_000_000,
          currency: 'AED',
          rateTableVersion: 'NON-EXISTENT-VERSION',
        })
      ).toThrow(UaeCorporateTaxValidationError);
    });

    it('does not mutate the input object passed to calculate', () => {
      const input: UaeCorporateTaxInput = Object.freeze({
        accountingProfit: 1_000_000,
        currency: 'AED',
      });

      expect(() => calculate(input)).not.toThrow();
      // Object.freeze guarantees a TypeError would be thrown on any attempted
      // mutation, so successfully completing calculate() over a frozen input
      // is itself proof that no mutation occurred.
      expect(input.accountingProfit).toBe(1_000_000);
    });
  });

  describe('calculate - currency validation', () => {
    it('rejects a non-AED currency value', () => {
      const invalidInput = {
        accountingProfit: 1_000_000,
        currency: 'USD',
      } as unknown as UaeCorporateTaxInput;

      expect(() => calculate(invalidInput)).toThrow(UaeCorporateTaxValidationError);
    });
  });

  describe('validateUaeCorporateTaxInput', () => {
    it('throws when accountingProfit is not finite', () => {
      expect(() =>
        validateUaeCorporateTaxInput({
          accountingProfit: Number.NaN,
          currency: 'AED',
        })
      ).toThrow(UaeCorporateTaxValidationError);
    });

    it('throws when nonDeductibleAddBacks is not finite', () => {
      expect(() =>
        validateUaeCorporateTaxInput({
          accountingProfit: 100,
          nonDeductibleAddBacks: Number.POSITIVE_INFINITY,
          currency: 'AED',
        })
      ).toThrow(UaeCorporateTaxValidationError);
    });

    it('throws when exemptIncome is not finite', () => {
      expect(() =>
        validateUaeCorporateTaxInput({
          accountingProfit: 100,
          exemptIncome: Number.NEGATIVE_INFINITY,
          currency: 'AED',
        })
      ).toThrow(UaeCorporateTaxValidationError);
    });

    it('does not throw for valid input', () => {
      expect(() =>
        validateUaeCorporateTaxInput({ accountingProfit: 500_000, currency: 'AED' })
      ).not.toThrow();
    });
  });

  describe('formatAedAmount', () => {
    it('formats a positive amount with the AED prefix and two decimals', () => {
      expect(formatAedAmount(12345.6)).toBe('AED 12,345.60');
    });

    it('formats zero correctly', () => {
      expect(formatAedAmount(0)).toBe('AED 0.00');
    });

    it('throws for non-finite input', () => {
      expect(() => formatAedAmount(Number.POSITIVE_INFINITY)).toThrow(
        UaeCorporateTaxValidationError
      );
    });
  });
});
