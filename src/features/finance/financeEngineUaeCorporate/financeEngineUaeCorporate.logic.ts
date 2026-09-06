/**
 * UAE Corporate Tax calculation engine.
 *
 * Implements the core computation rules of UAE Federal Decree-Law No. 47 of 2022
 * ("Corporate Tax Law") as designed in the paired handoff documents:
 *  - SRS-ISSUE-W56-FINANCE-CORPORATE-TAX-1935.md
 *  - SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935.md
 *
 * Design decisions carried over from the SDD (see SDD §3):
 *  - Pure function (`calculate`) rather than a stateful class/service.
 *  - Rates/thresholds resolved via a versioned rate table (`rateTableVersion`)
 *    rather than hard-coded inline, so historical recalculation remains possible
 *    if legislation changes the rate or threshold in a future rate table version.
 *  - `currency` is restricted to the literal type `'AED'` and validated at the
 *    boundary; no other currency is accepted.
 *  - Taxable income is floored at zero (no negative taxable income / refund
 *    semantics in this scope).
 *
 * This module is a pure calculation engine: it performs no I/O, no network calls,
 * and no persistence, and never mutates its input.
 */

/** A single versioned UAE Corporate Tax rate table entry. */
export interface UaeCorporateTaxRateTable {
  /** Unique identifier for this rate table version, e.g. 'FDL-47-2022-v1'. */
  version: string;
  /** Standard corporate tax rate applied above the relief threshold (e.g. 0.09 for 9%). */
  standardRate: number;
  /** Small Business Relief / zero-rate threshold, in AED. */
  reliefThresholdAed: number;
}

/** Identifier for the initial UAE Corporate Tax rate table (FDL 47/2022, as enacted). */
export const DEFAULT_RATE_TABLE_VERSION = 'FDL-47-2022-v1';

/** Registry of known, versioned UAE Corporate Tax rate tables. */
export const UAE_CORPORATE_TAX_RATE_TABLES: Readonly<Record<string, UaeCorporateTaxRateTable>> =
  Object.freeze({
    [DEFAULT_RATE_TABLE_VERSION]: Object.freeze({
      version: DEFAULT_RATE_TABLE_VERSION,
      standardRate: 0.09,
      reliefThresholdAed: 375_000,
    }),
  });

/** Convenience re-export of the currently effective relief threshold, in AED. */
export const SMALL_BUSINESS_RELIEF_THRESHOLD_AED =
  UAE_CORPORATE_TAX_RATE_TABLES[DEFAULT_RATE_TABLE_VERSION].reliefThresholdAed;

/** Convenience re-export of the currently effective standard corporate tax rate. */
export const STANDARD_CORPORATE_TAX_RATE =
  UAE_CORPORATE_TAX_RATE_TABLES[DEFAULT_RATE_TABLE_VERSION].standardRate;

/** Currency accepted by this engine. UAE Corporate Tax is computed exclusively in AED. */
export type UaeCorporateTaxCurrency = 'AED';

/** Input parameters describing a single UAE Corporate Tax computation. */
export interface UaeCorporateTaxInput {
  /** Accounting (net) profit for the tax period, in AED. May be negative. */
  accountingProfit: number;
  /** Non-deductible expenses added back to accounting profit, in AED. Defaults to 0. */
  nonDeductibleAddBacks?: number;
  /** Income exempt from corporate tax, in AED. Defaults to 0. */
  exemptIncome?: number;
  /** Currency of the supplied amounts. Only 'AED' is accepted. */
  currency: UaeCorporateTaxCurrency;
  /** Rate table version to apply. Defaults to {@link DEFAULT_RATE_TABLE_VERSION}. */
  rateTableVersion?: string;
}

/** Result of a UAE Corporate Tax computation. */
export interface UaeCorporateTaxResult {
  /** Taxable income used in the computation, in AED, floored at 0. */
  taxableIncome: number;
  /** Total tax due, in AED, rounded to 2 decimal places. */
  taxDue: number;
  /** Whether Small Business Relief (0% rate) applied to this computation. */
  reliefApplied: boolean;
  /** The rate table version actually applied. */
  rateTableVersion: string;
  /** Currency of the result. Always 'AED'. */
  currency: UaeCorporateTaxCurrency;
}

/** Error thrown when UAE Corporate Tax input fails validation. */
export class UaeCorporateTaxValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UaeCorporateTaxValidationError';
  }
}

function assertFiniteNumber(value: number, fieldName: string): void {
  if (!Number.isFinite(value)) {
    throw new UaeCorporateTaxValidationError(`${fieldName} must be a finite number.`);
  }
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function resolveRateTable(rateTableVersion: string | undefined): UaeCorporateTaxRateTable {
  const version = rateTableVersion ?? DEFAULT_RATE_TABLE_VERSION;
  const rateTable = UAE_CORPORATE_TAX_RATE_TABLES[version];
  if (!rateTable) {
    throw new UaeCorporateTaxValidationError(`Unknown rateTableVersion: '${version}'.`);
  }
  return rateTable;
}

/**
 * Validates the raw input for a UAE Corporate Tax computation.
 * Throws UaeCorporateTaxValidationError on any invalid input.
 */
export function validateUaeCorporateTaxInput(input: UaeCorporateTaxInput): void {
  assertFiniteNumber(input.accountingProfit, 'accountingProfit');

  if (input.nonDeductibleAddBacks !== undefined) {
    assertFiniteNumber(input.nonDeductibleAddBacks, 'nonDeductibleAddBacks');
  }
  if (input.exemptIncome !== undefined) {
    assertFiniteNumber(input.exemptIncome, 'exemptIncome');
  }

  if (input.currency !== 'AED') {
    throw new UaeCorporateTaxValidationError(
      `Unsupported currency: '${String(input.currency)}'. Only 'AED' is supported.`
    );
  }

  // Validates that the rate table resolves; throws otherwise.
  resolveRateTable(input.rateTableVersion);
}

/**
 * Computes UAE Corporate Tax due for a single tax period.
 *
 * Taxable income = max(0, accountingProfit + nonDeductibleAddBacks - exemptIncome).
 * Small Business Relief applies (0% / no tax due) when taxable income is at or below
 * the rate table's relief threshold; otherwise the standard rate applies to the
 * portion of taxable income exceeding the threshold.
 *
 * The input object is never mutated.
 */
export function calculate(input: UaeCorporateTaxInput): UaeCorporateTaxResult {
  validateUaeCorporateTaxInput(input);

  const nonDeductibleAddBacks = input.nonDeductibleAddBacks ?? 0;
  const exemptIncome = input.exemptIncome ?? 0;
  const rateTable = resolveRateTable(input.rateTableVersion);

  const rawTaxableIncome = input.accountingProfit + nonDeductibleAddBacks - exemptIncome;
  const taxableIncome = Math.max(rawTaxableIncome, 0);

  const reliefApplied = taxableIncome <= rateTable.reliefThresholdAed;
  const taxableAboveThreshold = reliefApplied ? 0 : taxableIncome - rateTable.reliefThresholdAed;
  const taxDue = roundCurrency(taxableAboveThreshold * rateTable.standardRate);

  return {
    taxableIncome: roundCurrency(taxableIncome),
    taxDue,
    reliefApplied,
    rateTableVersion: rateTable.version,
    currency: 'AED',
  };
}

/**
 * Convenience helper: formats an AED amount for display, e.g. "AED 12,345.67".
 */
export function formatAedAmount(amountAed: number): string {
  if (!Number.isFinite(amountAed)) {
    throw new UaeCorporateTaxValidationError('amountAed must be a finite number.');
  }
  const formatted = new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountAed);
  return `AED ${formatted}`;
}
