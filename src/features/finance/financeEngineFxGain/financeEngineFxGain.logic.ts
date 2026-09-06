/**
 * FX Gain/Loss Calculation Logic
 *
 * Pure, dependency-free calculation module for the White Caves Finance
 * Engine (Workstream 56). Computes the base-currency value of a
 * multi-currency transaction at booking and settlement/valuation time,
 * derives the realized/unrealized FX gain or loss, and aggregates
 * results across a batch of transactions.
 *
 * Scope: pure calculation only. No network, filesystem, database, or
 * GitHub API access is performed by this module. See:
 * - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-FX-1939.md
 * - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-FX-1939.md
 *
 * Parent issue: #1939. This module is additive and self-contained; it
 * does not close or mutate the parent issue.
 */

/** Settlement lifecycle state of the underlying transaction. */
export type FxSettlementStatus = 'realized' | 'unrealized';

/** Direction of the computed FX gain/loss. */
export type FxGainLossDirection = 'gain' | 'loss' | 'none';

/** Discriminated error codes for input validation failures. */
export type FxGainErrorCode =
  | 'INVALID_CURRENCY_CODE'
  | 'NON_FINITE_AMOUNT'
  | 'NEGATIVE_AMOUNT'
  | 'NON_POSITIVE_RATE';

/** Input describing a single multi-currency transaction to evaluate. */
export interface FxTransactionInput {
  readonly transactionId: string;
  readonly transactionCurrency: string;
  readonly baseCurrency: string;
  readonly transactionAmount: number;
  readonly bookingRate: number;
  readonly settlementRate: number;
  readonly settlementStatus: FxSettlementStatus;
}

/** Result of evaluating a single transaction's FX gain/loss. */
export interface FxGainLossResult {
  readonly transactionId: string;
  readonly bookedBaseAmount: number;
  readonly settledBaseAmount: number;
  readonly gainLossAmount: number;
  readonly direction: FxGainLossDirection;
  readonly settlementStatus: FxSettlementStatus;
}

/** Aggregate totals across a batch of FX gain/loss results. */
export interface FxGainLossSummary {
  readonly totalGain: number;
  readonly totalLoss: number;
  readonly netAmount: number;
}

/**
 * Typed error thrown when an {@link FxTransactionInput} fails validation.
 * Callers should branch on `code` rather than parsing `message`.
 */
export class FxGainCalculationError extends Error {
  public readonly code: FxGainErrorCode;

  constructor(message: string, code: FxGainErrorCode) {
    super(message);
    this.name = 'FxGainCalculationError';
    this.code = code;
    // Preserve `instanceof` checks across compiled targets that extend
    // built-in Error.
    Object.setPrototypeOf(this, FxGainCalculationError.prototype);
  }
}

/** ISO-4217-shaped currency code: exactly three uppercase A-Z letters. */
const ISO_CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

function isValidCurrencyCode(code: string): boolean {
  return ISO_CURRENCY_CODE_PATTERN.test(code);
}

/** Rounds a number to 2 decimal places (currency minor-unit precision). */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function resolveDirection(gainLossAmount: number): FxGainLossDirection {
  if (gainLossAmount > 0) return 'gain';
  if (gainLossAmount < 0) return 'loss';
  return 'none';
}

function validateInput(input: FxTransactionInput): void {
  if (!isValidCurrencyCode(input.transactionCurrency) || !isValidCurrencyCode(input.baseCurrency)) {
    throw new FxGainCalculationError(
      `Invalid currency code(s): transactionCurrency="${input.transactionCurrency}", baseCurrency="${input.baseCurrency}"`,
      'INVALID_CURRENCY_CODE'
    );
  }

  if (!Number.isFinite(input.transactionAmount)) {
    throw new FxGainCalculationError(
      `transactionAmount must be a finite number, received: ${input.transactionAmount}`,
      'NON_FINITE_AMOUNT'
    );
  }

  if (input.transactionAmount < 0) {
    throw new FxGainCalculationError(
      `transactionAmount must not be negative, received: ${input.transactionAmount}`,
      'NEGATIVE_AMOUNT'
    );
  }

  if (
    !Number.isFinite(input.bookingRate) ||
    !Number.isFinite(input.settlementRate) ||
    input.bookingRate <= 0 ||
    input.settlementRate <= 0
  ) {
    throw new FxGainCalculationError(
      `bookingRate and settlementRate must be finite and positive, received bookingRate=${input.bookingRate}, settlementRate=${input.settlementRate}`,
      'NON_POSITIVE_RATE'
    );
  }
}

/**
 * Calculates the FX gain or loss for a single multi-currency transaction.
 *
 * Validation order is fixed (currency codes -> amount finiteness ->
 * amount sign -> rate validity) so error precedence is deterministic.
 *
 * When `transactionCurrency === baseCurrency`, no FX exposure exists by
 * definition: the result reports `gainLossAmount: 0` and
 * `direction: 'none'` regardless of the supplied rates.
 */
export function calculateFxGainLoss(input: FxTransactionInput): FxGainLossResult {
  validateInput(input);

  if (input.transactionCurrency === input.baseCurrency) {
    const sameCurrencyAmount = round2(input.transactionAmount);
    return {
      transactionId: input.transactionId,
      bookedBaseAmount: sameCurrencyAmount,
      settledBaseAmount: sameCurrencyAmount,
      gainLossAmount: 0,
      direction: 'none',
      settlementStatus: input.settlementStatus,
    };
  }

  const bookedBaseAmount = round2(input.transactionAmount * input.bookingRate);
  const settledBaseAmount = round2(input.transactionAmount * input.settlementRate);
  const gainLossAmount = round2(settledBaseAmount - bookedBaseAmount);

  return {
    transactionId: input.transactionId,
    bookedBaseAmount,
    settledBaseAmount,
    gainLossAmount,
    direction: resolveDirection(gainLossAmount),
    settlementStatus: input.settlementStatus,
  };
}

/**
 * Aggregates FX gain/loss results across a batch of transactions.
 *
 * Gains and losses are summed separately (losses as an absolute value),
 * and `netAmount` is the difference between the two totals. An empty
 * list yields all-zero totals.
 */
export function summarizeFxGainLoss(results: readonly FxGainLossResult[]): FxGainLossSummary {
  let totalGain = 0;
  let totalLoss = 0;

  for (const result of results) {
    if (result.gainLossAmount > 0) {
      totalGain += result.gainLossAmount;
    } else if (result.gainLossAmount < 0) {
      totalLoss += Math.abs(result.gainLossAmount);
    }
  }

  totalGain = round2(totalGain);
  totalLoss = round2(totalLoss);
  const netAmount = round2(totalGain - totalLoss);

  return { totalGain, totalLoss, netAmount };
}
