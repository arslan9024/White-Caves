/**
 * Type declarations and runtime type guards for the `financeEngineRollingMonth`
 * module (parent issue #1933, work-stream `ISSUE-W56-FINANCE-CASHFLOW-1933`).
 *
 * This module is intentionally implementation-free: it only defines the
 * public shape of a rolling-month cash-flow window and provides pure,
 * dependency-free runtime validators that downstream logic (see
 * `financeEngineRollingMonth.logic.ts`, owned by sibling child issues) and
 * consumers can rely on to validate data crossing module/serialization
 * boundaries (e.g. persisted or transmitted `RollingMonthWindow` values).
 *
 * No I/O, no network, no database access. Every export here is a pure
 * function or a plain type/constant.
 */

/** Whole-day span bounds a rolling-month window may legally report. */
export const MIN_ROLLING_MONTH_DAY_SPAN = 28;
export const MAX_ROLLING_MONTH_DAY_SPAN = 31;

/** Milliseconds in a single calendar day, used for day-span derivation. */
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * A day-of-month anchor used to bracket a rolling-month window. Valid values
 * are whole numbers from 1 to 31 inclusive; months with fewer days clamp to
 * their own last day (see the companion SDD, Section 3, FR-2).
 */
export type RollingMonthAnchorDay = number;

/**
 * The public shape of a computed rolling-month cash-flow window.
 *
 * - `start` is an inclusive ISO-8601 timestamp string.
 * - `end` is an exclusive ISO-8601 timestamp string, strictly after `start`.
 * - `daySpan` is the whole number of days between `start` and `end`
 *   (always in the closed range [28, 31]).
 */
export interface RollingMonthWindow {
  readonly start: string;
  readonly end: string;
  readonly daySpan: number;
}

/**
 * Discriminated result type for validators that need to report *why* a
 * candidate value failed validation, without throwing. Consumers that only
 * need a boolean should prefer the `is*` type-guard functions below.
 */
export type RollingMonthValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

/**
 * Returns true when `value` is an integer day-of-month usable as a rolling
 * -month anchor (1-31 inclusive).
 */
export function isValidRollingMonthAnchorDay(value: unknown): value is RollingMonthAnchorDay {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 31;
}

/**
 * Returns true when `value` is a string that parses to a valid (non-`NaN`)
 * `Date` timestamp. Does not accept `Date` instances directly, since
 * `RollingMonthWindow.start`/`end` are declared as serialized ISO strings.
 */
export function isValidIsoDateString(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }
  return !Number.isNaN(new Date(value).getTime());
}

/**
 * Computes the whole-day span between two ISO date strings. Throws if either
 * argument is not a valid ISO date string, so callers get a clear failure
 * rather than `NaN` propagating silently.
 */
export function computeDaySpan(start: string, end: string): number {
  if (!isValidIsoDateString(start)) {
    throw new Error(`computeDaySpan: invalid start date string: ${String(start)}`);
  }
  if (!isValidIsoDateString(end)) {
    throw new Error(`computeDaySpan: invalid end date string: ${String(end)}`);
  }
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  return Math.round((endMs - startMs) / MS_PER_DAY);
}

/**
 * Full structural + semantic validation of a candidate `RollingMonthWindow`.
 * Reports the specific failure reason rather than a bare boolean, which is
 * useful for logging/diagnostics at module boundaries.
 */
export function validateRollingMonthWindow(value: unknown): RollingMonthValidationResult {
  if (typeof value !== 'object' || value === null) {
    return { valid: false, reason: 'value is not an object' };
  }

  const candidate = value as Record<string, unknown>;

  if (!isValidIsoDateString(candidate.start)) {
    return { valid: false, reason: 'start is not a valid ISO date string' };
  }
  if (!isValidIsoDateString(candidate.end)) {
    return { valid: false, reason: 'end is not a valid ISO date string' };
  }

  const start = candidate.start as string;
  const end = candidate.end as string;

  if (new Date(end).getTime() <= new Date(start).getTime()) {
    return { valid: false, reason: 'end must be strictly after start' };
  }

  if (typeof candidate.daySpan !== 'number' || !Number.isInteger(candidate.daySpan)) {
    return { valid: false, reason: 'daySpan is not an integer' };
  }

  const daySpan = candidate.daySpan;

  if (daySpan < MIN_ROLLING_MONTH_DAY_SPAN || daySpan > MAX_ROLLING_MONTH_DAY_SPAN) {
    return {
      valid: false,
      reason: `daySpan ${daySpan} is outside the valid range [${MIN_ROLLING_MONTH_DAY_SPAN}, ${MAX_ROLLING_MONTH_DAY_SPAN}]`,
    };
  }

  const expectedDaySpan = computeDaySpan(start, end);
  if (daySpan !== expectedDaySpan) {
    return {
      valid: false,
      reason: `daySpan ${daySpan} does not match computed span ${expectedDaySpan} between start and end`,
    };
  }

  return { valid: true };
}

/**
 * Type-guard convenience wrapper around `validateRollingMonthWindow` for call
 * sites that only need a boolean narrowing check.
 */
export function isRollingMonthWindow(value: unknown): value is RollingMonthWindow {
  return validateRollingMonthWindow(value).valid;
}
