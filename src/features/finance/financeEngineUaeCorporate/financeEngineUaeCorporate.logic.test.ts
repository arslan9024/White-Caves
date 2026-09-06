import { describe, expect, it } from 'vitest';
import {
  calculateUaeCorporateTax,
  DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE,
  UaeCorporateTaxValidationError,
  type UaeCorporateTaxCalculationInput,
  type UaeCorporateTaxRateTable,
} from './financeEngineUaeCorporate.logic';

const baseInput: UaeCorporateTaxCalculationInput = {
  accountingProfitAed: 0,
  nonDeductibleAddBacksAed: 0,
  exemptIncomeAed: 0,
  currency: 'AED',
};

describe('calculateUaeCorporateTax', () => {
  it('computes taxable income as profit + add-backs - exempt income (FR-1)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 500_000,
      nonDeductibleAddBacksAed: 20_000,
      exemptIncomeAed: 10_000,
    });

    expect(result.taxableIncomeAed).toBe(510_000);
  });

  it('applies Small Business Relief when taxable income equals the threshold exactly (FR-2)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 375_000,
    });

    expect(result.taxableIncomeAed).toBe(375_000);
    expect(result.reliefApplied).toBe(true);
    expect(result.taxDueAed).toBe(0);
  });

  it('applies Small Business Relief when taxable income is below the threshold (FR-2)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 100_000,
    });

    expect(result.reliefApplied).toBe(true);
    expect(result.taxDueAed).toBe(0);
  });

  it('applies the 9% rate only to the excess over the threshold at the boundary + 1 AED (FR-3)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 375_001,
    });

    expect(result.reliefApplied).toBe(false);
    // Excess = 1 AED; tax = 1 * 9% = 0.09
    expect(result.taxDueAed).toBe(0.09);
  });

  it('computes standard-rate tax correctly well above the relief threshold (FR-3)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 1_375_000,
    });

    // Excess = 1,375,000 - 375,000 = 1,000,000; tax = 1,000,000 * 9% = 90,000
    expect(result.taxableIncomeAed).toBe(1_375_000);
    expect(result.reliefApplied).toBe(false);
    expect(result.taxDueAed).toBe(90_000);
  });

  it('rejects any currency other than AED with a typed validation error (FR-4)', () => {
    const invalidInput = {
      ...baseInput,
      currency: 'USD',
    } as unknown as UaeCorporateTaxCalculationInput;

    expect(() => calculateUaeCorporateTax(invalidInput)).toThrow(UaeCorporateTaxValidationError);
    expect(() => calculateUaeCorporateTax(invalidInput)).toThrow(/AED/);
  });

  it('records the default rateTableVersion on every result for audit traceability (FR-5)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 500_000,
    });

    expect(result.rateTableVersion).toBe(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE.version);
  });

  it('records a custom rateTableVersion when a rate table override is supplied (FR-5)', () => {
    const customRateTable: UaeCorporateTaxRateTable = {
      version: 'UAE-CT-TEST-v2',
      standardRatePercent: 9,
      smallBusinessReliefThresholdAed: 375_000,
    };

    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 500_000,
      rateTable: customRateTable,
    });

    expect(result.rateTableVersion).toBe('UAE-CT-TEST-v2');
  });

  it('is deterministic: identical input always yields identical output (FR-6)', () => {
    const input: UaeCorporateTaxCalculationInput = {
      ...baseInput,
      accountingProfitAed: 823_456.78,
      nonDeductibleAddBacksAed: 12_345.67,
      exemptIncomeAed: 5_000,
    };

    const firstResult = calculateUaeCorporateTax(input);
    const secondResult = calculateUaeCorporateTax(input);

    expect(firstResult).toEqual(secondResult);
  });

  it('does not mutate the input object (pure function, FR-7)', () => {
    const input: UaeCorporateTaxCalculationInput = {
      ...baseInput,
      accountingProfitAed: 500_000,
    };
    const inputSnapshot = { ...input };

    calculateUaeCorporateTax(input);

    expect(input).toEqual(inputSnapshot);
  });

  it('floors negative taxable income at zero and applies no tax (FR-1, FR-2)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: -50_000,
      exemptIncomeAed: 10_000,
    });

    expect(result.taxableIncomeAed).toBe(0);
    expect(result.reliefApplied).toBe(true);
    expect(result.taxDueAed).toBe(0);
  });

  it('floors zero accounting profit at zero taxable income with no tax due (FR-1, FR-2)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 0,
    });

    expect(result.taxableIncomeAed).toBe(0);
    expect(result.taxDueAed).toBe(0);
  });

  it('rounds tax due to 2 decimal places matching AED accounting precision (NFR-4)', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 375_010.005,
    });

    // Excess = 10.005; tax = 10.005 * 9% = 0.90045 -> rounds to 0.9
    expect(result.taxDueAed).toBeCloseTo(0.9, 2);
    expect(Number.isInteger(result.taxDueAed * 100)).toBe(true);
  });

  it('always returns currency AED in the result', () => {
    const result = calculateUaeCorporateTax({
      ...baseInput,
      accountingProfitAed: 500_000,
    });

    expect(result.currency).toBe('AED');
  });
});
