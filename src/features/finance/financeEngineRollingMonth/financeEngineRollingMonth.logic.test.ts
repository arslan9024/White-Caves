import { describe, expect, it } from 'vitest';

import {
  computeRollingMonthWindow,
  isWithinRollingMonth,
  type RollingMonthWindow,
} from './financeEngineRollingMonth.logic';

describe('computeRollingMonthWindow', () => {
  it('brackets now with a window anchored to the anchor day-of-month (README example)', () => {
    const anchor = new Date('2026-01-15T00:00:00.000Z');
    const now = new Date('2026-02-20T00:00:00.000Z');

    const window = computeRollingMonthWindow(anchor, now);

    expect(window.start).toBe('2026-02-15T00:00:00.000Z');
    expect(window.end).toBe('2026-03-15T00:00:00.000Z');
  });

  it("rolls back to the previous month when now is before this month's anchor day", () => {
    const anchor = new Date('2026-01-15T00:00:00.000Z');
    const now = new Date('2026-02-10T00:00:00.000Z');

    const window = computeRollingMonthWindow(anchor, now);

    expect(window.start).toBe('2026-01-15T00:00:00.000Z');
    expect(window.end).toBe('2026-02-15T00:00:00.000Z');
  });

  it('treats now exactly on the anchor day as the start of a new window (inclusive start)', () => {
    const anchor = new Date('2026-01-15T00:00:00.000Z');
    const now = new Date('2026-02-15T00:00:00.000Z');

    const window = computeRollingMonthWindow(anchor, now);

    expect(window.start).toBe('2026-02-15T00:00:00.000Z');
    expect(window.end).toBe('2026-03-15T00:00:00.000Z');
  });

  it('clamps an anchor day of 31 to the last day of shorter months', () => {
    const anchor = new Date('2026-01-31T00:00:00.000Z');
    const now = new Date('2026-02-20T00:00:00.000Z');

    const window = computeRollingMonthWindow(anchor, now);

    // February 2026 has 28 days, so the window start clamps to Feb 28.
    expect(window.start).toBe('2026-02-28T00:00:00.000Z');
    // March has 31 days, so the anchor day is honored exactly for the end.
    expect(window.end).toBe('2026-03-31T00:00:00.000Z');
  });

  it('clamps correctly across a leap-year February', () => {
    const anchor = new Date('2024-01-31T00:00:00.000Z');
    const now = new Date('2024-02-20T00:00:00.000Z');

    const window = computeRollingMonthWindow(anchor, now);

    // 2024 is a leap year, so February has 29 days.
    expect(window.start).toBe('2024-02-29T00:00:00.000Z');
    expect(window.end).toBe('2024-03-31T00:00:00.000Z');
  });

  it('rolls over the year boundary correctly', () => {
    const anchor = new Date('2025-11-10T00:00:00.000Z');
    const now = new Date('2025-12-25T00:00:00.000Z');

    const window = computeRollingMonthWindow(anchor, now);

    expect(window.start).toBe('2025-12-10T00:00:00.000Z');
    expect(window.end).toBe('2026-01-10T00:00:00.000Z');
  });

  it('rolls back over the year boundary correctly', () => {
    const anchor = new Date('2025-11-10T00:00:00.000Z');
    const now = new Date('2026-01-05T00:00:00.000Z');

    const window = computeRollingMonthWindow(anchor, now);

    expect(window.start).toBe('2025-12-10T00:00:00.000Z');
    expect(window.end).toBe('2026-01-10T00:00:00.000Z');
  });

  it('throws on an invalid anchor date', () => {
    const invalidAnchor = new Date('not-a-date');
    const now = new Date('2026-02-20T00:00:00.000Z');

    expect(() => computeRollingMonthWindow(invalidAnchor, now)).toThrow(/anchor/i);
  });

  it('throws on an invalid reference ("now") date', () => {
    const anchor = new Date('2026-01-15T00:00:00.000Z');
    const invalidNow = new Date('not-a-date');

    expect(() => computeRollingMonthWindow(anchor, invalidNow)).toThrow(/now/i);
  });
});

describe('isWithinRollingMonth', () => {
  const window: RollingMonthWindow = {
    start: '2026-02-15T00:00:00.000Z',
    end: '2026-03-15T00:00:00.000Z',
  };

  it('returns true for a date inside the window', () => {
    expect(isWithinRollingMonth(new Date('2026-02-20T00:00:00.000Z'), window)).toBe(true);
  });

  it('returns true for a date exactly on the inclusive start boundary', () => {
    expect(isWithinRollingMonth(new Date('2026-02-15T00:00:00.000Z'), window)).toBe(true);
  });

  it('returns false for a date exactly on the exclusive end boundary', () => {
    expect(isWithinRollingMonth(new Date('2026-03-15T00:00:00.000Z'), window)).toBe(false);
  });

  it('returns false for a date before the window', () => {
    expect(isWithinRollingMonth(new Date('2026-02-14T23:59:59.999Z'), window)).toBe(false);
  });

  it('returns false for a date after the window', () => {
    expect(isWithinRollingMonth(new Date('2026-03-15T00:00:00.001Z'), window)).toBe(false);
  });
});

describe('computeRollingMonthWindow + isWithinRollingMonth integration', () => {
  it('always reports now as within its own computed window', () => {
    const anchor = new Date('2026-01-31T00:00:00.000Z');
    const samples = [
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-02-01T12:00:00.000Z'),
      new Date('2026-02-28T23:59:59.999Z'),
      new Date('2026-03-31T00:00:00.000Z'),
      new Date('2026-12-31T00:00:00.000Z'),
    ];

    for (const now of samples) {
      const window = computeRollingMonthWindow(anchor, now);
      expect(isWithinRollingMonth(now, window)).toBe(true);
    }
  });
});
