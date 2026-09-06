/**
 * Finance Engine — FX Gain/Loss calculation module.
 *
 * Pure-function unit with no dependencies on persistence, network, or UI
 * layers. Implements the contract defined in
 * plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-FX-1939.md
 * (child of parent issue #1939).
 */

/**
 * A foreign-currency monetary amount together with the exchange rate used
 * to convert it into the organization's base reporting currency.
 */
export interface FxAmount {
  foreignAmount: number;
  foreignCurrency: string;
  /** 1 unit of foreignCurrency = rate units of base currency. */
  rate: number;
}

/**
 * Result of an FX gain/loss calculation.
 *
 * Sign convention: positive = gain, negative = loss, computed as
 * `currentBaseValue - originalBaseValue`.
 */
export interface FxGainResult {
  gainOrLoss: number;
  originalBaseValue: number;
  currentBaseValue: number;
}

/**
 * Rounds a numeric value to 2 decimal places using round-half-up semantics.
 *
 * Plain `Math.round(x * 100) / 100` suffers from binary floating-point
 * representation errors (e.g. `1.005` rounding down instead of up). Adding
 * `Number.EPSILON` before rounding corrects this without introducing an
 * external dependency.
 */
export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Validates that a supplied exchange rate is usable for FX calculations.
 * Throws a `RangeError` for `0`, `NaN`, negative, or non-finite values.
 */
function assertValidRate(rate: number): void {
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new RangeError('FX rate must be a positive finite number');
  }
}

/**
 * Computes realized or unrealized FX gain/loss for a foreign-currency
 * position by comparing its base-currency value at booking time
 * (`original`) against its base-currency value at settlement or
 * valuation time (`current`).
 *
 * - Realized gain/loss: pass the settlement rate/amount as `current`.
 * - Unrealized gain/loss: pass the valuation rate/amount as `current`.
 *
 * @throws {RangeError} if `original.rate` or `current.rate` is `<= 0`,
 *   `NaN`, or otherwise not a positive finite number.
 */
export function calculateFxGain(
  original: FxAmount,
  current: FxAmount,
  baseCurrency: string
): FxGainResult {
  assertValidRate(original.rate);
  assertValidRate(current.rate);

  if (original.foreignCurrency === baseCurrency) {
    const baseValue = roundToCents(original.foreignAmount);
    return {
      gainOrLoss: 0,
      originalBaseValue: baseValue,
      currentBaseValue: baseValue,
    };
  }

  const originalBaseValue = roundToCents(original.foreignAmount * original.rate);
  const currentBaseValue = roundToCents(current.foreignAmount * current.rate);
  const gainOrLoss = roundToCents(currentBaseValue - originalBaseValue);

  return { gainOrLoss, originalBaseValue, currentBaseValue };
}
