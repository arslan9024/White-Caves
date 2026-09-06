/**
 * financeEngineRollingMonth.logic.ts
 *
 * Rolling-month finance engine utilities.
 *
 * A "rolling month" window is a contiguous 30-day (or N-day) period anchored to
 * an arbitrary reference date, as opposed to a calendar-month window that is
 * anchored to the 1st of the month. This module provides pure, deterministic
 * helpers to compute rolling-month windows, bucket dated financial entries into
 * those windows, and aggregate totals per window.
 *
 * Design decisions:
 * - All functions are pure (no I/O, no mutation of inputs) so they are easy to
 *   unit test and safe to use inside reducers/selectors.
 * - Dates are handled via native `Date` objects normalized to UTC midnight to
 *   avoid timezone drift across environments.
 * - Window length defaults to 30 days but is configurable to support 28/31 day
 *   rolling windows used elsewhere in the finance engine.
 */

export interface RollingMonthWindow {
  /** Inclusive start of the window (UTC midnight). */
  start: Date;
  /** Exclusive end of the window (UTC midnight). */
  end: Date;
  /** Zero-based index of this window relative to the anchor date. */
  index: number;
}

export interface FinanceEntry {
  /** ISO date string or Date representing when the entry occurred. */
  date: string | Date;
  /** Signed monetary amount (positive = inflow, negative = outflow). */
  amount: number;
  /** Optional category/label for the entry. */
  category?: string;
}

export interface RollingMonthBucket {
  window: RollingMonthWindow;
  entries: FinanceEntry[];
  total: number;
  inflow: number;
  outflow: number;
}

export const DEFAULT_ROLLING_WINDOW_DAYS = 30;

/**
 * Normalize a Date or ISO date string to a UTC-midnight Date instance.
 * Throws if the input cannot be parsed into a valid date.
 */
export function toUtcMidnight(input: string | Date): Date {
  const parsed = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`financeEngineRollingMonth: invalid date input "${String(input)}"`);
  }
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

/**
 * Add a number of days to a Date, returning a new Date (does not mutate input).
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Compute the number of whole days between two dates (end - start).
 */
export function diffInDays(start: Date, end: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

/**
 * Build a single rolling-month window anchored at `anchorDate`, offset by
 * `index` window-lengths, using `windowDays` as the window size.
 */
export function buildRollingMonthWindow(
  anchorDate: string | Date,
  index: number,
  windowDays: number = DEFAULT_ROLLING_WINDOW_DAYS
): RollingMonthWindow {
  if (windowDays <= 0) {
    throw new Error('financeEngineRollingMonth: windowDays must be a positive integer');
  }
  if (!Number.isInteger(index)) {
    throw new Error('financeEngineRollingMonth: index must be an integer');
  }
  const anchor = toUtcMidnight(anchorDate);
  const start = addDays(anchor, index * windowDays);
  const end = addDays(start, windowDays);
  return { start, end, index };
}

/**
 * Determine which rolling-month window (relative to `anchorDate`) a given
 * `entryDate` falls into. Returns the window index (can be negative for
 * dates before the anchor).
 */
export function getRollingMonthIndex(
  anchorDate: string | Date,
  entryDate: string | Date,
  windowDays: number = DEFAULT_ROLLING_WINDOW_DAYS
): number {
  if (windowDays <= 0) {
    throw new Error('financeEngineRollingMonth: windowDays must be a positive integer');
  }
  const anchor = toUtcMidnight(anchorDate);
  const entry = toUtcMidnight(entryDate);
  const dayDiff = diffInDays(anchor, entry);
  return Math.floor(dayDiff / windowDays);
}

/**
 * Returns true when `entryDate` falls within `window` (start inclusive, end exclusive).
 */
export function isWithinRollingMonthWindow(
  window: RollingMonthWindow,
  entryDate: string | Date
): boolean {
  const entry = toUtcMidnight(entryDate);
  return entry.getTime() >= window.start.getTime() && entry.getTime() < window.end.getTime();
}

/**
 * Group finance entries into rolling-month buckets anchored at `anchorDate`.
 * Every entry is assigned to exactly one bucket based on its date. Buckets
 * are returned sorted by window index ascending, and only buckets that
 * contain at least one entry are included.
 */
export function groupEntriesByRollingMonth(
  entries: FinanceEntry[],
  anchorDate: string | Date,
  windowDays: number = DEFAULT_ROLLING_WINDOW_DAYS
): RollingMonthBucket[] {
  if (windowDays <= 0) {
    throw new Error('financeEngineRollingMonth: windowDays must be a positive integer');
  }

  const bucketsByIndex = new Map<number, FinanceEntry[]>();

  for (const entry of entries) {
    const index = getRollingMonthIndex(anchorDate, entry.date, windowDays);
    const bucket = bucketsByIndex.get(index);
    if (bucket) {
      bucket.push(entry);
    } else {
      bucketsByIndex.set(index, [entry]);
    }
  }

  const sortedIndexes = Array.from(bucketsByIndex.keys()).sort((a, b) => a - b);

  return sortedIndexes.map(index => {
    const bucketEntries = bucketsByIndex.get(index) as FinanceEntry[];
    const window = buildRollingMonthWindow(anchorDate, index, windowDays);
    return summarizeBucket(window, bucketEntries);
  });
}

/**
 * Compute inflow/outflow/net totals for a set of entries within a window.
 */
function summarizeBucket(window: RollingMonthWindow, entries: FinanceEntry[]): RollingMonthBucket {
  let inflow = 0;
  let outflow = 0;

  for (const entry of entries) {
    if (entry.amount >= 0) {
      inflow += entry.amount;
    } else {
      outflow += entry.amount;
    }
  }

  return {
    window,
    entries,
    total: inflow + outflow,
    inflow,
    outflow,
  };
}

/**
 * Compute the current rolling-month window that contains `asOfDate`, relative
 * to a fixed `anchorDate` (e.g. an account creation date or fiscal start).
 */
export function getCurrentRollingMonthWindow(
  anchorDate: string | Date,
  asOfDate: string | Date,
  windowDays: number = DEFAULT_ROLLING_WINDOW_DAYS
): RollingMonthWindow {
  const index = getRollingMonthIndex(anchorDate, asOfDate, windowDays);
  return buildRollingMonthWindow(anchorDate, index, windowDays);
}

/**
 * Filter entries to only those within the rolling-month window that contains
 * `asOfDate`, and return the aggregated bucket for convenience.
 */
export function getCurrentRollingMonthBucket(
  entries: FinanceEntry[],
  anchorDate: string | Date,
  asOfDate: string | Date,
  windowDays: number = DEFAULT_ROLLING_WINDOW_DAYS
): RollingMonthBucket {
  const window = getCurrentRollingMonthWindow(anchorDate, asOfDate, windowDays);
  const matching = entries.filter(entry => isWithinRollingMonthWindow(window, entry.date));
  return summarizeBucket(window, matching);
}
