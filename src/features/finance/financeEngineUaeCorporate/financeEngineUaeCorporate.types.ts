/**
 * Shared type definitions for the UAE Corporate Tax finance engine.
 *
 * Scope: child issue #2438 (parent #1935). This module extracts the pure
 * type/constant/error surface referenced by
 * `SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935.md` (§2 target module layout) so
 * that type definitions can be consumed independently of the calculation
 * logic implementation. This file introduces no I/O and no side effects.
 */

/**
 * UAE Corporate Tax is computed strictly in AED for the current scope.
 * Multi-currency support is explicitly deferred (see paired SRS §2.3).
 */
export type UaeCorporateTaxCurrency = 'AED';

/**
 * A versioned rate table capturing the legislative values (standard rate and
 * Small Business Relief threshold) in effect for a given `version`. Rate
 * tables are versioned rather than hard-coded so historical calculations
 * remain reproducible after future legislative changes (SDD §3.2).
 */
export interface UaeCorporateTaxRateTable {
  /** Unique identifier for this rate table revision, e.g. 'UAE-CT-FDL47-2022-v1'. */
  readonly version: string;
  /** Taxable income at or below this AED amount is fully relieved (zero tax due). */
  readonly smallBusinessReliefThreshold: number;
  /** Tax rate (as a decimal fraction, e.g. 0.09 for 9%) applied above the threshold. */
  readonly standardRate: number;
}

/**
 * Input to a UAE Corporate Tax calculation. All monetary fields are
 * denominated in AED and represent a single taxable period.
 */
export interface UaeCorporateTaxCalculationInput {
  /** Accounting profit for the taxable period, in AED. */
  readonly accountingProfit: number;
  /** Non-deductible add-backs (per FDL 47/2022) to be added to accounting profit. */
  readonly nonDeductibleAddBacks: number;
  /** Exempt income to be subtracted from accounting profit. */
  readonly exemptIncome: number;
  /** Must be the literal 'AED'; any other value is rejected at validation. */
  readonly currency: UaeCorporateTaxCurrency;
  /** Optional rate table override; defaults to `DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE`. */
  readonly rateTable?: UaeCorporateTaxRateTable;
}

/**
 * Result of a UAE Corporate Tax calculation. Deterministic for a given input
 * (FR-6): identical input always yields an identical result.
 */
export interface UaeCorporateTaxCalculationResult {
  /** Taxable income after add-backs/exemptions, floored at 0, in AED. */
  readonly taxableIncome: number;
  /** Final tax due in AED, rounded to 2 decimal places. */
  readonly taxDue: number;
  /** True when Small Business Relief reduced tax due to zero. */
  readonly reliefApplied: boolean;
  /** The exact `rateTable.version` used to compute this result, for audit traceability. */
  readonly rateTableVersion: string;
  /** Echoes the validated input currency; always 'AED' in the current scope. */
  readonly currency: UaeCorporateTaxCurrency;
}

/**
 * Default rate table implementing UAE Federal Decree-Law No. 47 of 2022:
 * a 9% standard rate applied to taxable income in excess of AED 375,000,
 * with Small Business Relief (zero tax) at or below that threshold.
 */
export const DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE: UaeCorporateTaxRateTable = Object.freeze({
  version: 'UAE-CT-FDL47-2022-v1',
  smallBusinessReliefThreshold: 375000,
  standardRate: 0.09,
});

/**
 * Typed validation error raised when calculation input violates a
 * requirement of the UAE Corporate Tax engine (e.g. FR-4: non-AED currency).
 */
export class UaeCorporateTaxValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UaeCorporateTaxValidationError';
    Object.setPrototypeOf(this, UaeCorporateTaxValidationError.prototype);
  }
}

/**
 * Type guard narrowing an arbitrary value to `UaeCorporateTaxCurrency`.
 * Used at validation boundaries to implement FR-4 without resorting to `any`.
 */
export function isUaeCorporateTaxCurrency(value: unknown): value is UaeCorporateTaxCurrency {
  return value === 'AED';
}

/**
 * Type guard validating that an unknown value is shaped like a
 * `UaeCorporateTaxRateTable` (all required fields present with correct types).
 */
export function isUaeCorporateTaxRateTable(value: unknown): value is UaeCorporateTaxRateTable {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.version === 'string' &&
    typeof candidate.smallBusinessReliefThreshold === 'number' &&
    typeof candidate.standardRate === 'number'
  );
}
