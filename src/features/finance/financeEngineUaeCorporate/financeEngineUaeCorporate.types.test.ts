import { describe, expect, it } from 'vitest';
import {
  DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE,
  UaeCorporateTaxValidationError,
  isUaeCorporateTaxCurrency,
  isUaeCorporateTaxRateTable,
  type UaeCorporateTaxCalculationInput,
  type UaeCorporateTaxCalculationResult,
  type UaeCorporateTaxRateTable,
} from './financeEngineUaeCorporate.types';

describe('DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE', () => {
  it('encodes the FDL 47/2022 standard rate and Small Business Relief threshold', () => {
    expect(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE.version).toBe('UAE-CT-FDL47-2022-v1');
    expect(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE.smallBusinessReliefThreshold).toBe(375000);
    expect(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE.standardRate).toBe(0.09);
  });

  it('is frozen so callers cannot mutate the shared default rate table', () => {
    expect(Object.isFrozen(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE)).toBe(true);
    expect(() => {
      (DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE as { standardRate: number }).standardRate = 0.5;
    }).toThrow();
    expect(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE.standardRate).toBe(0.09);
  });
});

describe('isUaeCorporateTaxCurrency', () => {
  it('returns true only for the literal string AED', () => {
    expect(isUaeCorporateTaxCurrency('AED')).toBe(true);
  });

  it('returns false for other currency-like strings', () => {
    expect(isUaeCorporateTaxCurrency('USD')).toBe(false);
    expect(isUaeCorporateTaxCurrency('aed')).toBe(false);
    expect(isUaeCorporateTaxCurrency('')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isUaeCorporateTaxCurrency(null)).toBe(false);
    expect(isUaeCorporateTaxCurrency(undefined)).toBe(false);
    expect(isUaeCorporateTaxCurrency(123)).toBe(false);
    expect(isUaeCorporateTaxCurrency({})).toBe(false);
  });
});

describe('isUaeCorporateTaxRateTable', () => {
  it('returns true for a well-formed rate table object', () => {
    const candidate: UaeCorporateTaxRateTable = {
      version: 'UAE-CT-FDL47-2022-v2',
      smallBusinessReliefThreshold: 400000,
      standardRate: 0.1,
    };

    expect(isUaeCorporateTaxRateTable(candidate)).toBe(true);
  });

  it('returns true for the shared default rate table', () => {
    expect(isUaeCorporateTaxRateTable(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE)).toBe(true);
  });

  it('returns false when a required field is missing', () => {
    expect(
      isUaeCorporateTaxRateTable({
        version: 'v1',
        smallBusinessReliefThreshold: 375000,
      })
    ).toBe(false);
  });

  it('returns false when a field has the wrong type', () => {
    expect(
      isUaeCorporateTaxRateTable({
        version: 'v1',
        smallBusinessReliefThreshold: '375000',
        standardRate: 0.09,
      })
    ).toBe(false);
  });

  it('returns false for null, arrays, and primitives', () => {
    expect(isUaeCorporateTaxRateTable(null)).toBe(false);
    expect(isUaeCorporateTaxRateTable([])).toBe(false);
    expect(isUaeCorporateTaxRateTable('rate-table')).toBe(false);
    expect(isUaeCorporateTaxRateTable(42)).toBe(false);
  });
});

describe('UaeCorporateTaxValidationError', () => {
  it('is a real Error subclass carrying the provided message', () => {
    const error = new UaeCorporateTaxValidationError('currency must be AED');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UaeCorporateTaxValidationError);
    expect(error.name).toBe('UaeCorporateTaxValidationError');
    expect(error.message).toBe('currency must be AED');
  });

  it('preserves the correct prototype chain across a throw/catch boundary', () => {
    expect.hasAssertions();

    try {
      throw new UaeCorporateTaxValidationError('non-AED currency rejected');
    } catch (caught) {
      expect(caught).toBeInstanceOf(UaeCorporateTaxValidationError);
      if (caught instanceof UaeCorporateTaxValidationError) {
        expect(caught.message).toBe('non-AED currency rejected');
      }
    }
  });
});

describe('type contract usage', () => {
  it('allows constructing a fully-typed calculation input using the default rate table', () => {
    const input: UaeCorporateTaxCalculationInput = {
      accountingProfit: 500000,
      nonDeductibleAddBacks: 25000,
      exemptIncome: 10000,
      currency: 'AED',
      rateTable: DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE,
    };

    expect(input.currency).toBe('AED');
    expect(input.rateTable?.version).toBe(DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE.version);
  });

  it('allows constructing a fully-typed calculation result shape', () => {
    const result: UaeCorporateTaxCalculationResult = {
      taxableIncome: 140000,
      taxDue: 12600,
      reliefApplied: false,
      rateTableVersion: DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE.version,
      currency: 'AED',
    };

    expect(result.taxDue).toBe(12600);
    expect(result.reliefApplied).toBe(false);
    expect(result.rateTableVersion).toBe('UAE-CT-FDL47-2022-v1');
  });
});
