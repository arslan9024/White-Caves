import { describe, it, expect } from 'vitest';
import {
  parseFlexibleDate,
  formatUaeDate,
  advanceRenewalDates,
} from './renewalDateCalculator';

describe('renewalDateCalculator', () => {
  it('parses YYYY-MM-DD format correctly', () => {
    const dt = parseFlexibleDate('2026-10-01');
    expect(dt).not.toBeNull();
    expect(dt?.getFullYear()).toBe(2026);
    expect(dt?.getMonth()).toBe(9);
    expect(dt?.getDate()).toBe(1);
  });

  it('parses DD-MM-YYYY format correctly', () => {
    const dt = parseFlexibleDate('01-10-2026');
    expect(dt).not.toBeNull();
    expect(dt?.getFullYear()).toBe(2026);
    expect(dt?.getMonth()).toBe(9);
    expect(dt?.getDate()).toBe(1);
  });

  it('formats Date to UAE standard DD-MM-YYYY', () => {
    const dt = new Date(2026, 9, 1);
    expect(formatUaeDate(dt)).toBe('01-10-2026');
  });

  it('advances both start and end dates forward by 1 calendar year', () => {
    const result = advanceRenewalDates('01-10-2025', '30-09-2026');
    expect(result.startDate).toBe('01-10-2026');
    expect(result.endDate).toBe('30-09-2027');
    expect(result.contractDate).toMatch(/^\d{2}-\d{2}-\d{4}$/);
  });
});

