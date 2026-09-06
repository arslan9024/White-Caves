/**
 * Finance Engine FX Gain/Loss — shared types and runtime guards.
 *
 * Issue: #2420 (child of parent #1939)
 *
 * This module is the canonical source for the FX gain/loss data contract
 * (`FxAmount`, `FxGainResult`, `FxRate`) plus small, pure runtime guard and
 * assertion helpers used to validate inputs before they are handed to the
 * finance engine's FX calculation logic.
 *
 * Design notes:
 * - Kept dependency-free and side-effect-free (NFR-2/NFR-4 of the parent
 *   SRS): no I/O, no randomness, no clock access.
 * - `FxRate` is a nominal-ish alias over `number` used purely for
 *   documentation/readability at call sites; it does not change runtime
 *   behavior.
 * - Validation mirrors FR-5 from SRS-ISSUE-W56-FINANCE-FX-1939.md: a rate of
 *   `0`, `NaN`, `Infinity`, or a negative number is invalid and MUST throw a
 *   `RangeError` rather than being silently coerced.
 */

/** 1 unit of `foreignCurrency` = `rate` units of the base currency. */
export type FxRate = number;

/** A monetary amount denominated in a foreign currency, with its FX rate. */
export interface FxAmount {
  foreignAmount: number;
  foreignCurrency: string;
  rate: FxRate;
}

/** Result of an FX gain/loss calculation. */
export interface FxGainResult {
  gainOrLoss: number;
  originalBaseValue: number;
  currentBaseValue: number;
}

/**
 * Type guard: returns `true` when `value` structurally satisfies `FxAmount`
 * (correct shape and primitive types), without validating that the rate is
 * within a valid numeric domain. Use `assertValidFxRate` in addition to this
 * guard when full domain validation is required.
 */
export function isFxAmount(value: unknown): value is FxAmount {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.foreignAmount === 'number' &&
    typeof candidate.foreignCurrency === 'string' &&
    candidate.foreignCurrency.length > 0 &&
    typeof candidate.rate === 'number'
  );
}

/**
 * Type guard: returns `true` when `rate` is a finite, strictly positive
 * number — the only domain of valid FX rates per FR-5.
 */
export function isValidFxRate(rate: number): rate is FxRate {
  return Number.isFinite(rate) && rate > 0;
}

/**
 * Asserts that `rate` is a valid FX rate (finite and strictly positive).
 * Throws `RangeError` otherwise, per FR-5.
 *
 * @param rate - the numeric rate to validate.
 * @param label - optional identifier included in the error message to help
 *   pinpoint which rate (e.g. "original.rate" vs "current.rate") failed
 *   validation.
 */
export function assertValidFxRate(rate: number, label = 'rate'): asserts rate is FxRate {
  if (!isValidFxRate(rate)) {
    throw new RangeError(`FX ${label} must be a positive finite number, received: ${rate}`);
  }
}

/**
 * Returns `true` when the two currency codes represent the same currency.
 * Comparison is case-insensitive to tolerate caller inconsistency (e.g.
 * `"usd"` vs `"USD"`) without silently treating distinct currencies as
 * equal.
 */
export function isSameCurrency(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase();
}
