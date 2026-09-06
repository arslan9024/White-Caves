/**
 * Finance Engine — Rolling Month
 *
 * Parent issue: #1933
 * Child issue: #2450
 *
 * Pure, side-effect-free logic for computing "rolling month" windows: a
 * continuous 1-calendar-month span `[start, end)` anchored to a fixed
 * day-of-month, that brackets a given reference ("now") date. This is
 * distinct from a fixed calendar-month (1st-to-1st) window, since the
 * rolling window can start/end on any day of the month (e.g. the 15th).
 *
 * No I/O, no GitHub mutation, no database access — this module only
 * computes derived data from inputs it is given.
 */

/**
 * A rolling-month window. `start` is inclusive, `end` is exclusive, both
 * expressed as ISO 8601 timestamp strings (UTC, millisecond precision).
 */
export interface RollingMonthWindow {
  readonly start: string;
  readonly end: string;
}

/** Number of days in a given UTC year/month (month is 0-indexed). */
function daysInMonthUtc(year: number, month: number): number {
  // Day 0 of "next month" is the last day of "month".
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * Builds a UTC Date for the given year/month (0-indexed) and day-of-month,
 * clamping the day to the last valid day of that month when it overflows
 * (e.g. day=31 in a 30-day month becomes the 30th).
 */
function dateForMonthWithDay(year: number, month: number, day: number): Date {
  const clampedDay = Math.min(day, daysInMonthUtc(year, month));
  return new Date(Date.UTC(year, month, clampedDay));
}

/** Adds `delta` months to a (year, month) pair, normalizing month overflow. */
function shiftYearMonth(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const total = year * 12 + month + delta;
  const normalizedYear = Math.floor(total / 12);
  const normalizedMonth = ((total % 12) + 12) % 12;
  return { year: normalizedYear, month: normalizedMonth };
}

/**
 * Computes the rolling-month window `[start, end)` that brackets `now`,
 * anchored to the day-of-month of `anchor`.
 *
 * The window's `start` is the most recent occurrence of the anchor
 * day-of-month that is on or before `now`, and `end` is the following
 * month's occurrence of that same anchor day-of-month (clamped to the
 * last day of the month when the anchor day does not exist in that
 * month, e.g. day 31 in February).
 *
 * @throws {Error} if `anchor` or `now` is an invalid Date.
 */
export function computeRollingMonthWindow(anchor: Date, now: Date): RollingMonthWindow {
  if (Number.isNaN(anchor.getTime())) {
    throw new Error('Invalid anchor date');
  }
  if (Number.isNaN(now.getTime())) {
    throw new Error('Invalid reference ("now") date');
  }

  const anchorDay = anchor.getUTCDate();

  let year = now.getUTCFullYear();
  let month = now.getUTCMonth();
  let start = dateForMonthWithDay(year, month, anchorDay);

  if (start.getTime() > now.getTime()) {
    const shifted = shiftYearMonth(year, month, -1);
    year = shifted.year;
    month = shifted.month;
    start = dateForMonthWithDay(year, month, anchorDay);
  }

  let endShift = shiftYearMonth(year, month, 1);
  let end = dateForMonthWithDay(endShift.year, endShift.month, anchorDay);

  // Defensive loop: guarantees end > now even in pathological clamped-day
  // edge cases (e.g. anchor day 31 repeatedly clamped in short months).
  while (end.getTime() <= now.getTime()) {
    endShift = shiftYearMonth(endShift.year, endShift.month, 1);
    end = dateForMonthWithDay(endShift.year, endShift.month, anchorDay);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Returns true when `date` falls within the rolling-month `window`
 * (inclusive of `start`, exclusive of `end`).
 */
export function isWithinRollingMonth(date: Date, window: RollingMonthWindow): boolean {
  const time = date.getTime();
  const startTime = Date.parse(window.start);
  const endTime = Date.parse(window.end);
  return time >= startTime && time < endTime;
}
