import { describe, expect, it } from 'vitest';
import {
  MAX_ROLLING_MONTH_DAY_SPAN,
  MIN_ROLLING_MONTH_DAY_SPAN,
  MS_PER_DAY,
  computeDaySpan,
  isRollingMonthWindow,
  isValidIsoDateString,
  isValidRollingMonthAnchorDay,
  validateRollingMonthWindow,
  type RollingMonthWindow,
} from './financeEngineRollingMonth.types';

describe('financeEngineRollingMonth.types', () => {
  describe('constants', () => {
    it('declares the correct day-span bounds and millisecond constant', () => {
      expect(MIN_ROLLING_MONTH_DAY_SPAN).toBe(28);
      expect(MAX_ROLLING_MONTH_DAY_SPAN).toBe(31);
      expect(MS_PER_DAY).toBe(86_400_000);
    });
  });

  describe('isValidRollingMonthAnchorDay', () => {
    it('accepts integers from 1 to 31 inclusive', () => {
      expect(isValidRollingMonthAnchorDay(1)).toBe(true);
      expect(isValidRollingMonthAnchorDay(15)).toBe(true);
      expect(isValidRollingMonthAnchorDay(31)).toBe(true);
    });

    it('rejects zero, negative, out-of-range, non-integer, and non-number values', () => {
      expect(isValidRollingMonthAnchorDay(0)).toBe(false);
      expect(isValidRollingMonthAnchorDay(-1)).toBe(false);
      expect(isValidRollingMonthAnchorDay(32)).toBe(false);
      expect(isValidRollingMonthAnchorDay(15.5)).toBe(false);
      expect(isValidRollingMonthAnchorDay('15')).toBe(false);
      expect(isValidRollingMonthAnchorDay(null)).toBe(false);
      expect(isValidRollingMonthAnchorDay(undefined)).toBe(false);
      expect(isValidRollingMonthAnchorDay(Number.NaN)).toBe(false);
    });
  });

  describe('isValidIsoDateString', () => {
    it('accepts valid ISO date strings', () => {
      expect(isValidIsoDateString('2024-01-01T00:00:00.000Z')).toBe(true);
      expect(isValidIsoDateString('2024-02-29T12:00:00.000Z')).toBe(true);
    });

    it('rejects empty, whitespace-only, unparsable, and non-string values', () => {
      expect(isValidIsoDateString('')).toBe(false);
      expect(isValidIsoDateString('   ')).toBe(false);
      expect(isValidIsoDateString('not-a-date')).toBe(false);
      expect(isValidIsoDateString(1704067200000)).toBe(false);
      expect(isValidIsoDateString(null)).toBe(false);
      expect(isValidIsoDateString(undefined)).toBe(false);
    });
  });

  describe('computeDaySpan', () => {
    it('computes the whole-day span between two ISO date strings', () => {
      expect(computeDaySpan('2024-01-01T00:00:00.000Z', '2024-01-29T00:00:00.000Z')).toBe(28);
      expect(computeDaySpan('2024-02-01T00:00:00.000Z', '2024-03-01T00:00:00.000Z')).toBe(29);
      expect(computeDaySpan('2024-01-01T00:00:00.000Z', '2024-02-01T00:00:00.000Z')).toBe(31);
    });

    it('throws for invalid start or end date strings', () => {
      expect(() => computeDaySpan('not-a-date', '2024-01-29T00:00:00.000Z')).toThrow(
        /invalid start/
      );
      expect(() => computeDaySpan('2024-01-01T00:00:00.000Z', 'not-a-date')).toThrow(/invalid end/);
    });
  });

  describe('validateRollingMonthWindow', () => {
    it('reports valid: true for a well-formed window', () => {
      const window: RollingMonthWindow = {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-29T00:00:00.000Z',
        daySpan: 28,
      };
      expect(validateRollingMonthWindow(window)).toEqual({ valid: true });
    });

    it('reports a specific reason when the value is not an object', () => {
      expect(validateRollingMonthWindow(null)).toEqual({
        valid: false,
        reason: 'value is not an object',
      });
      expect(validateRollingMonthWindow('string')).toEqual({
        valid: false,
        reason: 'value is not an object',
      });
    });

    it('reports a specific reason for an invalid start', () => {
      const result = validateRollingMonthWindow({
        start: 'not-a-date',
        end: '2024-01-29T00:00:00.000Z',
        daySpan: 28,
      });
      expect(result).toEqual({
        valid: false,
        reason: 'start is not a valid ISO date string',
      });
    });

    it('reports a specific reason for an invalid end', () => {
      const result = validateRollingMonthWindow({
        start: '2024-01-01T00:00:00.000Z',
        end: 'not-a-date',
        daySpan: 28,
      });
      expect(result).toEqual({
        valid: false,
        reason: 'end is not a valid ISO date string',
      });
    });

    it('reports a specific reason when end is not strictly after start', () => {
      const result = validateRollingMonthWindow({
        start: '2024-01-29T00:00:00.000Z',
        end: '2024-01-01T00:00:00.000Z',
        daySpan: 28,
      });
      expect(result).toEqual({
        valid: false,
        reason: 'end must be strictly after start',
      });
    });

    it('reports a specific reason when daySpan is not an integer', () => {
      const result = validateRollingMonthWindow({
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-29T00:00:00.000Z',
        daySpan: 28.5,
      });
      expect(result).toEqual({
        valid: false,
        reason: 'daySpan is not an integer',
      });
    });

    it('reports a specific reason when daySpan is outside [28, 31]', () => {
      const result = validateRollingMonthWindow({
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-10T00:00:00.000Z',
        daySpan: 9,
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain('outside the valid range');
      }
    });

    it('reports a specific reason when daySpan does not match the computed span', () => {
      const result = validateRollingMonthWindow({
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-29T00:00:00.000Z',
        daySpan: 30,
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain('does not match computed span 28');
      }
    });
  });

  describe('isRollingMonthWindow', () => {
    it('returns true for a structurally and semantically valid window', () => {
      expect(
        isRollingMonthWindow({
          start: '2024-03-01T00:00:00.000Z',
          end: '2024-04-01T00:00:00.000Z',
          daySpan: 31,
        })
      ).toBe(true);
    });

    it('returns false for a window with mismatched daySpan', () => {
      expect(
        isRollingMonthWindow({
          start: '2024-03-01T00:00:00.000Z',
          end: '2024-04-01T00:00:00.000Z',
          daySpan: 28,
        })
      ).toBe(false);
    });

    it('returns false for missing fields', () => {
      expect(isRollingMonthWindow({ start: '2024-03-01T00:00:00.000Z' })).toBe(false);
      expect(isRollingMonthWindow({})).toBe(false);
      expect(isRollingMonthWindow(undefined)).toBe(false);
    });
  });
});
