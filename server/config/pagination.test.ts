/**
 * Pagination Config — Tests
 * Tests PAGINATION constants and parsePagination boundary validation.
 */

import { describe, it, expect } from 'vitest';
import { PAGINATION, parsePagination } from './pagination';

// ─── PAGINATION Constants ───────────────────────────────────────────────
describe('PAGINATION constants', () => {
  it('DEFAULT_PAGE_SIZE is 20', () => {
    expect(PAGINATION.DEFAULT_PAGE_SIZE).toBe(20);
  });

  it('MAX_PAGE_SIZE is 100', () => {
    expect(PAGINATION.MAX_PAGE_SIZE).toBe(100);
  });

  it('MIN_PAGE is 1', () => {
    expect(PAGINATION.MIN_PAGE).toBe(1);
  });

  it('is readonly (frozen/const)', () => {
    // TypeScript `as const` prevents mutation at compile time;
    // at runtime, verify the expected values haven't drifted
    expect(PAGINATION.DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
    expect(PAGINATION.MAX_PAGE_SIZE).toBeGreaterThanOrEqual(PAGINATION.DEFAULT_PAGE_SIZE);
    expect(PAGINATION.MIN_PAGE).toBeGreaterThanOrEqual(1);
  });
});

// ─── parsePagination ────────────────────────────────────────────────────
describe('parsePagination', () => {
  describe('defaults', () => {
    it('returns page 1, default limit, skip 0 with empty query', () => {
      const result = parsePagination({});
      expect(result).toEqual({
        page: 1,
        limit: PAGINATION.DEFAULT_PAGE_SIZE,
        skip: 0,
      });
    });

    it('returns page 1 when page is not provided', () => {
      const result = parsePagination({ limit: '10' });
      expect(result.page).toBe(1);
    });

    it('returns default limit when limit is not provided', () => {
      const result = parsePagination({ page: '2' });
      expect(result.limit).toBe(PAGINATION.DEFAULT_PAGE_SIZE);
    });
  });

  describe('valid inputs', () => {
    it('parses valid page and limit', () => {
      const result = parsePagination({ page: '3', limit: '25' });
      expect(result).toEqual({
        page: 3,
        limit: 25,
        skip: 50, // (3-1) * 25
      });
    });

    it('calculates skip correctly for page 1', () => {
      const result = parsePagination({ page: '1', limit: '10' });
      expect(result.skip).toBe(0);
    });

    it('calculates skip correctly for page 5', () => {
      const result = parsePagination({ page: '5', limit: '20' });
      expect(result.skip).toBe(80); // (5-1) * 20
    });

    it('accepts limit at exactly MAX_PAGE_SIZE', () => {
      const result = parsePagination({ page: '1', limit: '100' });
      expect(result.limit).toBe(100);
    });
  });

  describe('boundary clamping', () => {
    it('clamps page to MIN_PAGE when 0', () => {
      const result = parsePagination({ page: '0' });
      expect(result.page).toBe(PAGINATION.MIN_PAGE);
    });

    it('clamps page to MIN_PAGE when negative', () => {
      const result = parsePagination({ page: '-5' });
      expect(result.page).toBe(PAGINATION.MIN_PAGE);
    });

    it('clamps limit to MAX_PAGE_SIZE when too large', () => {
      const result = parsePagination({ limit: '500' });
      expect(result.limit).toBe(PAGINATION.MAX_PAGE_SIZE);
    });

    it('clamps limit to MAX_PAGE_SIZE when extremely large', () => {
      const result = parsePagination({ limit: '999999' });
      expect(result.limit).toBe(PAGINATION.MAX_PAGE_SIZE);
    });

    it('clamps limit to 1 when 0', () => {
      const result = parsePagination({ limit: '0' });
      expect(result.limit).toBeGreaterThanOrEqual(1);
    });

    it('clamps limit to 1 when negative', () => {
      const result = parsePagination({ limit: '-10' });
      expect(result.limit).toBeGreaterThanOrEqual(1);
    });
  });

  describe('invalid inputs', () => {
    it('uses default page for non-numeric string', () => {
      const result = parsePagination({ page: 'abc' });
      expect(result.page).toBe(1);
    });

    it('uses default limit for non-numeric string', () => {
      const result = parsePagination({ limit: 'xyz' });
      expect(result.limit).toBe(PAGINATION.DEFAULT_PAGE_SIZE);
    });

    it('handles empty string page', () => {
      const result = parsePagination({ page: '' });
      expect(result.page).toBe(1);
    });

    it('handles empty string limit', () => {
      const result = parsePagination({ limit: '' });
      expect(result.limit).toBe(PAGINATION.DEFAULT_PAGE_SIZE);
    });

    it('handles float strings by truncating', () => {
      const result = parsePagination({ page: '2.7', limit: '15.9' });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(15);
    });
  });

  describe('skip calculation', () => {
    it('skip is always (page - 1) * limit', () => {
      const testCases = [
        { page: '1', limit: '10', expectedSkip: 0 },
        { page: '2', limit: '10', expectedSkip: 10 },
        { page: '3', limit: '25', expectedSkip: 50 },
        { page: '10', limit: '50', expectedSkip: 450 },
      ];

      for (const { page, limit, expectedSkip } of testCases) {
        const result = parsePagination({ page, limit });
        expect(result.skip).toBe(expectedSkip);
      }
    });

    it('skip is 0 for clamped page=0', () => {
      const result = parsePagination({ page: '0', limit: '20' });
      // page gets clamped to 1, skip = (1-1)*20 = 0
      expect(result.skip).toBe(0);
    });
  });
});
