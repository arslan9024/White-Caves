import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ROLLING_WINDOW_DAYS,
  addDays,
  buildRollingMonthWindow,
  diffInDays,
  getCurrentRollingMonthBucket,
  getCurrentRollingMonthWindow,
  getRollingMonthIndex,
  groupEntriesByRollingMonth,
  isWithinRollingMonthWindow,
  toUtcMidnight,
  type FinanceEntry,
} from './financeEngineRollingMonth.logic';

describe('toUtcMidnight', () => {
  it('normalizes an ISO date string to UTC midnight', () => {
    const result = toUtcMidnight('2024-03-15T18:30:00Z');
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(2);
    expect(result.getUTCDate()).toBe(15);
    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
  });

  it('normalizes a Date instance to UTC midnight without mutating the input', () => {
    const input = new Date(Date.UTC(2024, 5, 1, 13, 45));
    const result = toUtcMidnight(input);
    expect(result.getUTCHours()).toBe(0);
    expect(input.getUTCHours()).toBe(13);
  });

  it('throws on invalid date input', () => {
    expect(() => toUtcMidnight('not-a-date')).toThrow(/invalid date input/i);
  });
});

describe('addDays', () => {
  it('adds positive days without mutating the original date', () => {
    const base = new Date(Date.UTC(2024, 0, 1));
    const result = addDays(base, 10);
    expect(result.getUTCDate()).toBe(11);
    expect(base.getUTCDate()).toBe(1);
  });

  it('supports negative day offsets', () => {
    const base = new Date(Date.UTC(2024, 0, 15));
    const result = addDays(base, -20);
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(11);
    expect(result.getUTCDate()).toBe(26);
  });
});

describe('diffInDays', () => {
  it('computes whole day difference between two dates', () => {
    const start = new Date(Date.UTC(2024, 0, 1));
    const end = new Date(Date.UTC(2024, 0, 31));
    expect(diffInDays(start, end)).toBe(30);
  });

  it('returns a negative value when end is before start', () => {
    const start = new Date(Date.UTC(2024, 0, 31));
    const end = new Date(Date.UTC(2024, 0, 1));
    expect(diffInDays(start, end)).toBe(-30);
  });
});

describe('buildRollingMonthWindow', () => {
  const anchor = '2024-01-01T00:00:00Z';

  it('builds the anchor window (index 0) using the default window size', () => {
    const window = buildRollingMonthWindow(anchor, 0);
    expect(window.index).toBe(0);
    expect(diffInDays(window.start, window.end)).toBe(DEFAULT_ROLLING_WINDOW_DAYS);
    expect(window.start.toISOString()).toBe(toUtcMidnight(anchor).toISOString());
  });

  it('builds forward-offset windows contiguous with the previous window', () => {
    const first = buildRollingMonthWindow(anchor, 0, 14);
    const second = buildRollingMonthWindow(anchor, 1, 14);
    expect(second.start.getTime()).toBe(first.end.getTime());
    expect(diffInDays(second.start, second.end)).toBe(14);
  });

  it('builds backward-offset (negative index) windows', () => {
    const window = buildRollingMonthWindow(anchor, -1, 30);
    expect(window.end.getTime()).toBe(toUtcMidnight(anchor).getTime());
    expect(diffInDays(window.start, window.end)).toBe(30);
  });

  it('throws when windowDays is not positive', () => {
    expect(() => buildRollingMonthWindow(anchor, 0, 0)).toThrow(
      /windowDays must be a positive integer/i
    );
    expect(() => buildRollingMonthWindow(anchor, 0, -5)).toThrow(
      /windowDays must be a positive integer/i
    );
  });

  it('throws when index is not an integer', () => {
    expect(() => buildRollingMonthWindow(anchor, 1.5)).toThrow(/index must be an integer/i);
  });
});

describe('getRollingMonthIndex', () => {
  const anchor = '2024-01-01T00:00:00Z';

  it('returns 0 for a date within the first window', () => {
    expect(getRollingMonthIndex(anchor, '2024-01-15T00:00:00Z')).toBe(0);
  });

  it('returns 1 for a date in the following window', () => {
    expect(getRollingMonthIndex(anchor, '2024-01-31T00:00:00Z')).toBe(1);
  });

  it('returns a negative index for dates before the anchor', () => {
    expect(getRollingMonthIndex(anchor, '2023-12-15T00:00:00Z')).toBe(-1);
  });

  it('respects a custom window size', () => {
    expect(getRollingMonthIndex(anchor, '2024-01-08T00:00:00Z', 7)).toBe(1);
  });
});

describe('isWithinRollingMonthWindow', () => {
  it('treats the start date as inclusive and the end date as exclusive', () => {
    const window = buildRollingMonthWindow('2024-01-01T00:00:00Z', 0, 30);
    expect(isWithinRollingMonthWindow(window, window.start)).toBe(true);
    expect(isWithinRollingMonthWindow(window, window.end)).toBe(false);
    expect(isWithinRollingMonthWindow(window, addDays(window.start, 15))).toBe(true);
  });
});

describe('groupEntriesByRollingMonth', () => {
  const anchor = '2024-01-01T00:00:00Z';

  it('buckets entries into the correct rolling-month windows sorted ascending', () => {
    const entries: FinanceEntry[] = [
      { date: '2024-01-05T00:00:00Z', amount: 100 },
      { date: '2024-01-20T00:00:00Z', amount: -40 },
      { date: '2024-02-10T00:00:00Z', amount: 200 },
      { date: '2023-12-20T00:00:00Z', amount: -10 },
    ];

    const buckets = groupEntriesByRollingMonth(entries, anchor, 30);

    expect(buckets.map(bucket => bucket.window.index)).toEqual([-1, 0, 1]);
    expect(buckets[0].entries).toHaveLength(1);
    expect(buckets[1].entries).toHaveLength(2);
    expect(buckets[2].entries).toHaveLength(1);
  });

  it('computes inflow, outflow, and net totals per bucket', () => {
    const entries: FinanceEntry[] = [
      { date: '2024-01-05T00:00:00Z', amount: 150 },
      { date: '2024-01-20T00:00:00Z', amount: -60 },
    ];

    const [bucket] = groupEntriesByRollingMonth(entries, anchor, 30);
    expect(bucket.inflow).toBe(150);
    expect(bucket.outflow).toBe(-60);
    expect(bucket.total).toBe(90);
  });

  it('returns an empty array when there are no entries', () => {
    expect(groupEntriesByRollingMonth([], anchor)).toEqual([]);
  });

  it('throws when windowDays is not positive', () => {
    expect(() => groupEntriesByRollingMonth([], anchor, 0)).toThrow(
      /windowDays must be a positive integer/i
    );
  });
});

describe('getCurrentRollingMonthWindow', () => {
  it('returns the window containing the as-of date', () => {
    const window = getCurrentRollingMonthWindow('2024-01-01T00:00:00Z', '2024-02-05T00:00:00Z', 30);
    expect(window.index).toBe(1);
    expect(isWithinRollingMonthWindow(window, '2024-02-05T00:00:00Z')).toBe(true);
  });
});

describe('getCurrentRollingMonthBucket', () => {
  const anchor = '2024-01-01T00:00:00Z';

  it('filters entries to only those in the current rolling-month window', () => {
    const entries: FinanceEntry[] = [
      { date: '2024-01-10T00:00:00Z', amount: 50 },
      { date: '2024-02-10T00:00:00Z', amount: 999 },
    ];

    const bucket = getCurrentRollingMonthBucket(entries, anchor, '2024-01-15T00:00:00Z', 30);

    expect(bucket.entries).toHaveLength(1);
    expect(bucket.entries[0].amount).toBe(50);
    expect(bucket.total).toBe(50);
  });

  it('returns an empty bucket when no entries fall in the current window', () => {
    const bucket = getCurrentRollingMonthBucket([], anchor, '2024-01-15T00:00:00Z', 30);
    expect(bucket.entries).toEqual([]);
    expect(bucket.total).toBe(0);
    expect(bucket.inflow).toBe(0);
    expect(bucket.outflow).toBe(0);
  });
});
