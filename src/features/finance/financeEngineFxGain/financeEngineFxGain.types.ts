/**
 * Shared type definitions for the FX Gain/Loss Calculation module.
 *
 * Issue: #2420 (child of parent #1939, Workstream W56: Finance Engine).
 *
 * This file contains only the pure type/interface/error surface for the
 * module: no calculation logic lives here. Splitting the type contract
 * out from the calculation logic (`financeEngineFxGain.logic.ts`, tracked
 * under sibling issue #2421) keeps the public API independently
 * reviewable and revertible from the implementation that consumes it.
 *
 * See:
 * - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-FX-1939.md
 * - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-FX-1939.md
 */

/** ISO-4217-shaped currency code, e.g. `'USD'`, `'AED'`. */
export type CurrencyCode = string;

/**
 * Input describing a single multi-currency transaction that needs its
 * FX gain/loss calculated between booking time and settlement/valuation
 * time.
 */
export interface FxTransactionInput {
  transactionId: string;
  transactionCurrency: CurrencyCode;
  baseCurrency: CurrencyCode;
  transactionAmount: number;
  bookingRate: number;
  settlementRate: number;
  settlementStatus: 'realized' | 'unrealized';
}

/**
 * Discriminated direction of an FX gain/loss result. `'none'` is a
 * distinct state (rather than relying on `0`/`-0` comparisons) so that
 * downstream reporting can branch explicitly on "no FX exposure or no
 * movement" versus a signed numeric value.
 */
export type FxGainLossDirection = 'gain' | 'loss' | 'none';

/**
 * Result of calculating FX gain/loss for a single transaction.
 */
export interface FxGainLossResult {
  transactionId: string;
  bookedBaseAmount: number;
  settledBaseAmount: number;
  gainLossAmount: number;
  direction: FxGainLossDirection;
  settlementStatus: 'realized' | 'unrealized';
}

/**
 * Aggregate totals produced by summarizing FX gain/loss across a batch
 * of `FxGainLossResult` values.
 */
export interface FxGainLossSummary {
  totalGain: number;
  totalLoss: number;
  netAmount: number;
}

/**
 * Distinct, switchable error codes for every input-validation failure
 * the module can raise. Kept as a closed union (rather than free-form
 * strings on a generic `Error`) so callers can `switch` exhaustively.
 */
export type FxGainErrorCode =
  | 'INVALID_CURRENCY_CODE'
  | 'NON_FINITE_AMOUNT'
  | 'NEGATIVE_AMOUNT'
  | 'NON_POSITIVE_RATE';

/**
 * Typed error raised by the FX Gain/Loss module's validation logic.
 * Carries a machine-readable `code` in addition to the human-readable
 * `message`, so callers can branch on `code` without string-matching the
 * message text.
 */
export class FxGainCalculationError extends Error {
  public readonly code: FxGainErrorCode;

  constructor(message: string, code: FxGainErrorCode) {
    super(message);
    this.name = 'FxGainCalculationError';
    this.code = code;

    // Restore the prototype chain so `instanceof FxGainCalculationError`
    // checks work correctly when compiled against ES2015+ targets that
    // extend built-ins such as `Error`.
    Object.setPrototypeOf(this, FxGainCalculationError.prototype);
  }
}
