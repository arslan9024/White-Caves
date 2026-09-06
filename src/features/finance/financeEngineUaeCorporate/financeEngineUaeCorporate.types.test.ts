import { describe, expect, it } from 'vitest';

import {
  assertUaeCorporateTaxCurrency,
  assertValidUaeCorporateTaxInput,
  isUaeCorporateTaxCurrency,
  isUaeCorporateTaxRateTable,
  UaeCorporateTaxValidationError,
  type UaeCorporateTaxInput,
  type UaeCorporateTaxRateTable,
} from './financeEngineUaeCorporate.types';

const validInput: UaeCorporateTaxInput = {
  accountingProfitAed: 500_000,
  nonDeductibleAddBacksAed: 10_000,
  exemptIncomeAed: 5_000,
  currency: 'AED',
  rateTableVersion: '2023-06-01',
};

const validRateTable: UaeCorporateTaxRateTable = {
  version: '2023-06-01',
  standardRate: 0.09,
  smallBusinessReliefThresholdAed: 375_000,
  effectiveFrom: '2023-06-01',
};

describe('isUaeCorporateTaxCurrency', () => {
  it('returns true for the literal AED value', () => {
    expect(isUaeCorporateTaxCurrency('AED')).toBe(true);
  });

  it('returns false for any other string', () => {
    expect(isUaeCorporateTaxCurrency('USD')).toBe(false);
    expect(isUaeCorporateTaxCurrency('aed')).toBe(false);
    expect(isUaeCorporateTaxCurrency('')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isUaeCorporateTaxCurrency(undefined)).toBe(false);
    expect(isUaeCorporateTaxCurrency(null)).toBe(false);
    expect(isUaeCorporateTaxCurrency(123)).toBe(false);
    expect(isUaeCorporateTaxCurrency({ currency: 'AED' })).toBe(false);
  });
});

describe('assertUaeCorporateTaxCurrency', () => {
  it('does not throw for the literal AED value', () => {
    expect(() => assertUaeCorporateTaxCurrency('AED')).not.toThrow();
  });

  it('throws a UaeCorporateTaxValidationError with code INVALID_CURRENCY for other values', () => {
    expect(() => assertUaeCorporateTaxCurrency('USD')).toThrow(UaeCorporateTaxValidationError);

    try {
      assertUaeCorporateTaxCurrency('USD');
      expect.fail('expected assertUaeCorporateTaxCurrency to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(UaeCorporateTaxValidationError);
      expect((error as UaeCorporateTaxValidationError).code).toBe('INVALID_CURRENCY');
      expect((error as UaeCorporateTaxValidationError).name).toBe('UaeCorporateTaxValidationError');
      expect((error as UaeCorporateTaxValidationError).message).toContain('USD');
    }
  });
});

describe('UaeCorporateTaxValidationError', () => {
  it('is an instance of Error and preserves its code and message', () => {
    const error = new UaeCorporateTaxValidationError('boom', 'NEGATIVE_ADD_BACKS');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UaeCorporateTaxValidationError);
    expect(error.code).toBe('NEGATIVE_ADD_BACKS');
    expect(error.message).toBe('boom');
    expect(error.name).toBe('UaeCorporateTaxValidationError');
  });
});

describe('isUaeCorporateTaxRateTable', () => {
  it('returns true for a well-formed rate table', () => {
    expect(isUaeCorporateTaxRateTable(validRateTable)).toBe(true);
  });

  it('returns false when version is missing or empty', () => {
    expect(isUaeCorporateTaxRateTable({ ...validRateTable, version: '' })).toBe(false);
    const { version, ...withoutVersion } = validRateTable;
    void version;
    expect(isUaeCorporateTaxRateTable(withoutVersion)).toBe(false);
  });

  it('returns false when standardRate is negative or not finite', () => {
    expect(isUaeCorporateTaxRateTable({ ...validRateTable, standardRate: -0.01 })).toBe(false);
    expect(isUaeCorporateTaxRateTable({ ...validRateTable, standardRate: Number.NaN })).toBe(false);
    expect(
      isUaeCorporateTaxRateTable({ ...validRateTable, standardRate: Number.POSITIVE_INFINITY })
    ).toBe(false);
  });

  it('returns false when smallBusinessReliefThresholdAed is negative', () => {
    expect(
      isUaeCorporateTaxRateTable({ ...validRateTable, smallBusinessReliefThresholdAed: -1 })
    ).toBe(false);
  });

  it('returns false when effectiveFrom is not an ISO-8601 date string', () => {
    expect(isUaeCorporateTaxRateTable({ ...validRateTable, effectiveFrom: '06/01/2023' })).toBe(
      false
    );
    expect(isUaeCorporateTaxRateTable({ ...validRateTable, effectiveFrom: '2023-6-1' })).toBe(
      false
    );
  });

  it('returns false for non-object values', () => {
    expect(isUaeCorporateTaxRateTable(null)).toBe(false);
    expect(isUaeCorporateTaxRateTable(undefined)).toBe(false);
    expect(isUaeCorporateTaxRateTable('rate table')).toBe(false);
    expect(isUaeCorporateTaxRateTable(42)).toBe(false);
  });
});

describe('assertValidUaeCorporateTaxInput', () => {
  it('does not throw for a fully valid input', () => {
    expect(() => assertValidUaeCorporateTaxInput(validInput)).not.toThrow();
  });

  it('does not mutate the input object', () => {
    const snapshot = { ...validInput };
    assertValidUaeCorporateTaxInput(validInput);
    expect(validInput).toEqual(snapshot);
  });

  it('throws INVALID_CURRENCY for a non-AED currency', () => {
    const invalid = { ...validInput, currency: 'USD' } as unknown as UaeCorporateTaxInput;

    try {
      assertValidUaeCorporateTaxInput(invalid);
      expect.fail('expected assertValidUaeCorporateTaxInput to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(UaeCorporateTaxValidationError);
      expect((error as UaeCorporateTaxValidationError).code).toBe('INVALID_CURRENCY');
    }
  });

  it('throws NEGATIVE_ADD_BACKS for a negative nonDeductibleAddBacksAed', () => {
    const invalid: UaeCorporateTaxInput = { ...validInput, nonDeductibleAddBacksAed: -1 };

    try {
      assertValidUaeCorporateTaxInput(invalid);
      expect.fail('expected assertValidUaeCorporateTaxInput to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(UaeCorporateTaxValidationError);
      expect((error as UaeCorporateTaxValidationError).code).toBe('NEGATIVE_ADD_BACKS');
    }
  });

  it('throws NEGATIVE_EXEMPT_INCOME for a negative exemptIncomeAed', () => {
    const invalid: UaeCorporateTaxInput = { ...validInput, exemptIncomeAed: -1 };

    try {
      assertValidUaeCorporateTaxInput(invalid);
      expect.fail('expected assertValidUaeCorporateTaxInput to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(UaeCorporateTaxValidationError);
      expect((error as UaeCorporateTaxValidationError).code).toBe('NEGATIVE_EXEMPT_INCOME');
    }
  });

  it('throws INVALID_RATE_TABLE_VERSION for an empty rateTableVersion', () => {
    const invalid: UaeCorporateTaxInput = { ...validInput, rateTableVersion: '' };

    try {
      assertValidUaeCorporateTaxInput(invalid);
      expect.fail('expected assertValidUaeCorporateTaxInput to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(UaeCorporateTaxValidationError);
      expect((error as UaeCorporateTaxValidationError).code).toBe('INVALID_RATE_TABLE_VERSION');
    }
  });

  it('accepts a zero accountingProfitAed and a negative one (floor handling is a calculation concern)', () => {
    expect(() =>
      assertValidUaeCorporateTaxInput({ ...validInput, accountingProfitAed: 0 })
    ).not.toThrow();
    expect(() =>
      assertValidUaeCorporateTaxInput({ ...validInput, accountingProfitAed: -100 })
    ).not.toThrow();
  });
});
