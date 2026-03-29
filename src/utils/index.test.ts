import { describe, it, expect, vi } from 'vitest';
import {
  formatDate,
  formatCurrency,
  formatCurrencyAbbreviated,
  formatPrice,
  generateId,
  getInitials,
  sortBy,
} from './index';

// ═══════════════════════════════════════════════════════════════════════
describe('utils/index', () => {
  // ── formatDate ────────────────────────────────────────────────────
  describe('formatDate', () => {
    it('returns dash for null', () => {
      expect(formatDate(null)).toBe('—');
    });

    it('returns dash for undefined', () => {
      expect(formatDate(undefined)).toBe('—');
    });

    it('formats a valid Date object', () => {
      const d = new Date('2025-06-15T12:00:00Z');
      const result = formatDate(d);
      expect(result).toContain('2025');
      expect(result).toContain('15');
    });

    it('formats a valid date string', () => {
      const result = formatDate('2025-01-01');
      expect(result).toContain('2025');
    });

    it('returns dash for invalid date string', () => {
      expect(formatDate('not-a-date')).toBe('—');
    });

    it('respects custom options', () => {
      const result = formatDate(new Date('2025-03-10'), { year: 'numeric' });
      expect(result).toContain('2025');
    });

    it('respects custom locale', () => {
      const result = formatDate(new Date('2025-03-10'), undefined, 'en-US');
      expect(typeof result).toBe('string');
    });
  });

  // ── formatCurrency ────────────────────────────────────────────────
  describe('formatCurrency', () => {
    it('returns "AED 0" for null', () => {
      expect(formatCurrency(null)).toBe('AED 0');
    });

    it('returns "AED 0" for undefined', () => {
      expect(formatCurrency(undefined)).toBe('AED 0');
    });

    it('returns "AED 0" for NaN', () => {
      expect(formatCurrency(NaN)).toBe('AED 0');
    });

    it('formats a valid amount', () => {
      const result = formatCurrency(1000);
      // Output varies by environment (AED 1,000 or AED\xa01,000, etc.)
      expect(result).toContain('AED');
      expect(result).toContain('1');
    });

    it('formats with custom currency', () => {
      const result = formatCurrency(500, 'USD');
      expect(result).toContain('$');
    });

    it('respects maximumFractionDigits', () => {
      const result = formatCurrency(1234.567, 'AED', { maximumFractionDigits: 2 });
      expect(result).toContain('AED');
    });
  });

  // ── formatCurrencyAbbreviated ─────────────────────────────────────
  describe('formatCurrencyAbbreviated', () => {
    it('abbreviates billions', () => {
      expect(formatCurrencyAbbreviated(2_500_000_000)).toBe('AED 2.5B');
    });

    it('abbreviates millions', () => {
      expect(formatCurrencyAbbreviated(3_200_000)).toBe('AED 3.2M');
    });

    it('abbreviates thousands', () => {
      expect(formatCurrencyAbbreviated(450_000)).toBe('AED 450K');
    });

    it('formats small amounts with locale string', () => {
      const result = formatCurrencyAbbreviated(999);
      expect(result).toContain('AED');
      expect(result).toContain('999');
    });

    it('uses custom currency prefix', () => {
      expect(formatCurrencyAbbreviated(1_000_000, 'USD')).toBe('USD 1.0M');
    });

    it('handles exactly 1 billion', () => {
      expect(formatCurrencyAbbreviated(1_000_000_000)).toBe('AED 1.0B');
    });

    it('handles exactly 1 million', () => {
      expect(formatCurrencyAbbreviated(1_000_000)).toBe('AED 1.0M');
    });

    it('handles exactly 1 thousand', () => {
      expect(formatCurrencyAbbreviated(1_000)).toBe('AED 1K');
    });
  });

  // ── formatPrice ───────────────────────────────────────────────────
  describe('formatPrice', () => {
    it('returns "Price on Request" for null', () => {
      expect(formatPrice(null)).toBe('Price on Request');
    });

    it('returns "Price on Request" for undefined', () => {
      expect(formatPrice()).toBe('Price on Request');
    });

    it('returns custom fallback for null', () => {
      expect(formatPrice(null, { fallback: 'N/A' })).toBe('N/A');
    });

    it('returns "Price on Request" for NaN', () => {
      expect(formatPrice(NaN)).toBe('Price on Request');
    });

    it('uses abbreviated format by default', () => {
      expect(formatPrice(2_500_000)).toBe('AED 2.5M');
    });

    it('appends priceType suffix', () => {
      const result = formatPrice(120_000, { priceType: 'year' });
      expect(result).toContain('/year');
      expect(result).toContain('AED');
    });

    it('appends unit suffix', () => {
      const result = formatPrice(150, { unit: 'per sqft' });
      expect(result).toContain('per sqft');
      expect(result).toContain('AED');
    });

    it('priceType takes precedence over unit', () => {
      const result = formatPrice(8000, { priceType: 'month', unit: 'per sqft' });
      expect(result).toContain('/month');
    });
  });

  // ── generateId ────────────────────────────────────────────────────
  describe('generateId', () => {
    it('generates a non-empty string', () => {
      expect(generateId().length).toBeGreaterThan(0);
    });

    it('includes prefix', () => {
      expect(generateId('prop_')).toMatch(/^prop_/);
    });

    it('generates unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });
  });

  // ── getInitials ───────────────────────────────────────────────────
  describe('getInitials', () => {
    it('returns first two initials', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns single initial for one word', () => {
      expect(getInitials('Alice')).toBe('A');
    });

    it('caps at 2 initials', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('returns "?" for empty string', () => {
      expect(getInitials('')).toBe('?');
    });

    it('returns "?" for whitespace-only', () => {
      expect(getInitials('   ')).toBe('?');
    });

    it('uppercases initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  // ── sortBy ────────────────────────────────────────────────────────
  describe('sortBy', () => {
    const items = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
    ];

    it('sorts strings ascending by default', () => {
      const sorted = sortBy(items, 'name');
      expect(sorted.map((i) => i.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('sorts strings descending', () => {
      const sorted = sortBy(items, 'name', 'desc');
      expect(sorted.map((i) => i.name)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('sorts numbers ascending', () => {
      const sorted = sortBy(items, 'age');
      expect(sorted.map((i) => i.age)).toEqual([25, 30, 35]);
    });

    it('sorts numbers descending', () => {
      const sorted = sortBy(items, 'age', 'desc');
      expect(sorted.map((i) => i.age)).toEqual([35, 30, 25]);
    });

    it('does not mutate original array', () => {
      const original = [...items];
      sortBy(items, 'name');
      expect(items).toEqual(original);
    });

    it('handles null values in ascending — nulls first', () => {
      const data = [
        { name: 'B', val: 2 },
        { name: null as unknown as string, val: null as unknown as number },
        { name: 'A', val: 1 },
      ];
      const sorted = sortBy(data, 'name');
      expect(sorted[0].name).toBeNull();
    });

    it('handles all-null values', () => {
      const data = [
        { x: null as unknown as string },
        { x: null as unknown as string },
      ];
      const sorted = sortBy(data, 'x');
      expect(sorted).toHaveLength(2);
    });

    it('returns empty array for empty input', () => {
      expect(sortBy([], 'name')).toEqual([]);
    });
  });
});
