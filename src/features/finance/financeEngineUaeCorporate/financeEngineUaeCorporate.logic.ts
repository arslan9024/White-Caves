/**
 * UAE Corporate Tax calculation engine.
 *
 * Handoff traceability:
 * - SRS-ISSUE-W56-FINANCE-CORPORATE-TAX-1935
 * - SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935
 * Parent issue: #1935 (open; not closed by this module)
 *
 * This module is a pure, side-effect-free calculation engine (FR-7). It performs no
 * network, disk, or database I/O and does not mutate its inputs.
 */

/** Currency is fixed to AED for this scope (see SRS §2.3, §3.3). */
export type UaeCorporateTaxCurrency = 'AED';

/**
 * Versioned rate table describing the legislative parameters used to compute
 * corporate tax. Versioning isolates legislative changes from the calculation
 * contract (SDD §3.2).
 */
export interface UaeCorporateTaxRateTable {
  /** Unique identifier for this rate table revision, recorded on every result (FR-5). */
  readonly version: string;
  /** Standard corporate tax rate, expressed as a percentage (e.g. 9 for 9%). */
  readonly standardRatePercent: number;
  /** Small Business Relief threshold in AED; taxable income at or below this is tax-free. */
  readonly smallBusinessReliefThresholdAed: number;
}

/**
 * Default rate table reflecting UAE Federal Decree-Law No. 47 of 2022: a 9% standard
 * rate and an AED 375,000 Small Business Relief threshold.
 */
export const DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE: UaeCorporateTaxRateTable = {
  version: 'UAE-CT-FDL47-2022-v1',
  standardRatePercent: 9,
  smallBusinessReliefThresholdAed: 375_000,
};

/** Input to a single UAE Corporate Tax calculation. */
export interface UaeCorporateTaxCalculationInput {
  /** Accounting (book) profit for the taxable period, in AED. May be negative. */
  readonly accountingProfitAed: number;
  /** Non-deductible expenses added back to arrive at taxable income, in AED. */
  readonly nonDeductibleAddBacksAed: number;
  /** Income exempt from corporate tax, subtracted from taxable income, in AED. */
  readonly exemptIncomeAed: number;
  /** Currency of the supplied amounts; must be `'AED'` (FR-4). */
  readonly currency: UaeCorporateTaxCurrency;
  /** Rate table to apply. Defaults to {@link DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE}. */
  readonly rateTable?: UaeCorporateTaxRateTable;
}

/** Result of a UAE Corporate Tax calculation. */
export interface UaeCorporateTaxCalculationResult {
  /** Taxable income after add-backs/exemptions, floored at zero, rounded to 2dp. */
  readonly taxableIncomeAed: number;
  /** Corporate tax due, rounded to 2dp. Zero when Small Business Relief applies. */
  readonly taxDueAed: number;
  /** Whether Small Business Relief was applied (taxable income <= threshold). */
  readonly reliefApplied: boolean;
  /** Rate table version used to produce this result (FR-5, audit traceability). */
  readonly rateTableVersion: string;
  /** Currency of the result; always `'AED'` in this scope. */
  readonly currency: UaeCorporateTaxCurrency;
}

/**
 * Typed validation error raised when a calculation input violates a scope invariant
 * (e.g. non-AED currency). Distinct from generic `Error` so callers can discriminate
 * validation failures from unexpected runtime errors.
 */
export class UaeCorporateTaxValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UaeCorporateTaxValidationError';
    Object.setPrototypeOf(this, UaeCorporateTaxValidationError.prototype);
  }
}

/** Rounds a number to 2 decimal places to match AED accounting precision (NFR-4). */
function roundToAedPrecision(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Computes UAE Corporate Tax due for a taxable period.
 *
 * - Taxable income = accountingProfit + nonDeductibleAddBacks - exemptIncome, floored at 0 (FR-1).
 * - If taxable income <= relief threshold, Small Business Relief applies and tax due is 0 (FR-2).
 * - Otherwise, the standard rate is applied only to the excess over the threshold (FR-3).
 * - Rejects any `currency !== 'AED'` (FR-4).
 * - Deterministic and side-effect free: identical input always yields identical output (FR-6, FR-7).
 *
 * @throws {UaeCorporateTaxValidationError} when `input.currency !== 'AED'`.
 */
export function calculateUaeCorporateTax(
  input: UaeCorporateTaxCalculationInput
): UaeCorporateTaxCalculationResult {
  if (input.currency !== 'AED') {
    throw new UaeCorporateTaxValidationError(
      `Unsupported currency "${String(input.currency)}": UAE Corporate Tax calculations require AED.`
    );
  }

  const rateTable = input.rateTable ?? DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE;

  const rawTaxableIncome =
    input.accountingProfitAed + input.nonDeductibleAddBacksAed - input.exemptIncomeAed;
  const taxableIncomeAed = roundToAedPrecision(Math.max(0, rawTaxableIncome));

  const reliefApplied = taxableIncomeAed <= rateTable.smallBusinessReliefThresholdAed;

  const taxableExcessAed = reliefApplied
    ? 0
    : taxableIncomeAed - rateTable.smallBusinessReliefThresholdAed;

  const taxDueAed = roundToAedPrecision(
    reliefApplied ? 0 : taxableExcessAed * (rateTable.standardRatePercent / 100)
  );

  return {
    taxableIncomeAed,
    taxDueAed,
    reliefApplied,
    rateTableVersion: rateTable.version,
    currency: 'AED',
  };
}
