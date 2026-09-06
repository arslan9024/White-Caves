/**
 * Shared type definitions for the UAE Corporate Tax finance engine.
 *
 * Handoff references:
 * - SRS-ISSUE-W56-FINANCE-CORPORATE-TAX-1935
 * - SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935
 *
 * This module is intentionally free of any calculation logic. It defines the
 * data contracts (`UaeCorporateTaxInput`, `UaeCorporateTaxResult`,
 * `UaeCorporateTaxRateTable`), the typed validation error, and small runtime
 * type guards used to validate untrusted input at the module boundary. The
 * calculation implementation (`calculate()`), the versioned rate table
 * registry, and formatting helpers live in sibling modules
 * (`financeEngineUaeCorporate.logic.ts` / `financeEngineUaeCorporate.rates.ts`)
 * per the module layout described in the SDD, Section 2.
 */

/**
 * UAE Corporate Tax is computed exclusively in AED for the current scope
 * (SRS FR-4). Restricting this to a literal type — rather than a generic
 * `string` — lets callers catch currency mistakes at compile time in
 * addition to the runtime validation performed by
 * {@link isUaeCorporateTaxCurrency} / {@link assertUaeCorporateTaxCurrency}.
 */
export type UaeCorporateTaxCurrency = 'AED';

/**
 * Identifies a specific version of the versioned rate table (SDD §3.2).
 * Kept as a plain string (rather than a closed union) because rate table
 * versions are expected to grow over time as legislation changes, and the
 * type module must not need to change whenever a new version is added.
 */
export type UaeCorporateTaxRateTableVersion = string;

/**
 * A single versioned UAE Corporate Tax rate table entry (SRS FR-5, SDD §3.2).
 * Rate tables are treated as versioned, configurable data rather than
 * hard-coded constants so that historical calculations remain reproducible
 * even after the standard rate or relief threshold changes.
 */
export interface UaeCorporateTaxRateTable {
  /** Unique identifier for this rate table version, echoed back on every result. */
  readonly version: UaeCorporateTaxRateTableVersion;
  /** Standard corporate tax rate applied above the relief threshold (e.g. 0.09 for 9%). */
  readonly standardRate: number;
  /** Small Business Relief threshold, in AED, below or at which tax due is zero. */
  readonly smallBusinessReliefThresholdAed: number;
  /** ISO-8601 date (YYYY-MM-DD) from which this rate table version is effective. */
  readonly effectiveFrom: string;
}

/**
 * Input to the UAE Corporate Tax calculation (SRS FR-1 through FR-5).
 * Consumers must supply a `rateTableVersion` explicitly so results remain
 * reproducible for historical/audit recomputation (SRS FR-6).
 */
export interface UaeCorporateTaxInput {
  /** Accounting profit for the taxable period, in AED. May be negative. */
  readonly accountingProfitAed: number;
  /** Non-deductible add-backs to accounting profit, in AED. Must be >= 0. */
  readonly nonDeductibleAddBacksAed: number;
  /** Exempt income to subtract from accounting profit, in AED. Must be >= 0. */
  readonly exemptIncomeAed: number;
  /** Currency of all monetary fields. Must be the literal `'AED'`. */
  readonly currency: UaeCorporateTaxCurrency;
  /** Which versioned rate table to apply for this calculation. */
  readonly rateTableVersion: UaeCorporateTaxRateTableVersion;
}

/**
 * Result of a UAE Corporate Tax calculation (SRS FR-1 through FR-6).
 * Every field is derived deterministically from the input and the resolved
 * rate table; identical input always yields an identical result (FR-6).
 */
export interface UaeCorporateTaxResult {
  /** Taxable income after add-backs/exemptions, floored at zero (FR-1), in AED. */
  readonly taxableIncomeAed: number;
  /** Final tax due after relief and rate application, in AED, rounded to 2 decimals (NFR-4). */
  readonly taxDueAed: number;
  /** Whether Small Business Relief was applied (taxable income <= threshold). */
  readonly reliefApplied: boolean;
  /** The exact rate table version used to compute this result (FR-5, audit traceability). */
  readonly rateTableVersion: UaeCorporateTaxRateTableVersion;
}

/**
 * Machine-checkable error codes for {@link UaeCorporateTaxValidationError}.
 * Kept as a closed union (rather than a free-form string) so callers can
 * safely switch on `error.code` without needing a fallback branch.
 */
export type UaeCorporateTaxValidationErrorCode =
  | 'INVALID_CURRENCY'
  | 'INVALID_RATE_TABLE_VERSION'
  | 'NEGATIVE_ADD_BACKS'
  | 'NEGATIVE_EXEMPT_INCOME';

/**
 * Typed validation error thrown when a {@link UaeCorporateTaxInput} (or a
 * candidate rate table) fails validation (SRS FR-4). Distinct from a plain
 * `Error` so calling code can discriminate validation failures from
 * unexpected runtime errors via `instanceof` and inspect a stable `code`.
 */
export class UaeCorporateTaxValidationError extends Error {
  public readonly code: UaeCorporateTaxValidationErrorCode;

  constructor(message: string, code: UaeCorporateTaxValidationErrorCode) {
    super(message);
    this.name = 'UaeCorporateTaxValidationError';
    this.code = code;
    // Restore the prototype chain: transpilation targets that downlevel
    // `class extends Error` can otherwise break `instanceof` checks.
    Object.setPrototypeOf(this, UaeCorporateTaxValidationError.prototype);
  }
}

/**
 * Runtime type guard for {@link UaeCorporateTaxCurrency}. Accepts `unknown`
 * so it can be used to validate values crossing an untyped boundary (e.g.
 * JSON parsed from a request body) before they are treated as trusted input.
 */
export function isUaeCorporateTaxCurrency(value: unknown): value is UaeCorporateTaxCurrency {
  return value === 'AED';
}

/**
 * Asserts that `value` is a valid {@link UaeCorporateTaxCurrency}, narrowing
 * the type on success. Throws {@link UaeCorporateTaxValidationError} with
 * code `INVALID_CURRENCY` on failure (SRS FR-4).
 */
export function assertUaeCorporateTaxCurrency(
  value: unknown
): asserts value is UaeCorporateTaxCurrency {
  if (!isUaeCorporateTaxCurrency(value)) {
    throw new UaeCorporateTaxValidationError(
      `Unsupported currency for UAE Corporate Tax calculation: ${String(value)}. Only 'AED' is supported.`,
      'INVALID_CURRENCY'
    );
  }
}

/**
 * Runtime type guard for {@link UaeCorporateTaxRateTable}. Verifies shape and
 * basic invariants (non-empty version, finite non-negative rate/threshold,
 * ISO-8601-shaped `effectiveFrom`) without asserting anything about whether
 * the version is registered in any particular rate table registry — that
 * lookup is the responsibility of the sibling `.rates.ts` module.
 */
export function isUaeCorporateTaxRateTable(value: unknown): value is UaeCorporateTaxRateTable {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.version === 'string' &&
    candidate.version.length > 0 &&
    typeof candidate.standardRate === 'number' &&
    Number.isFinite(candidate.standardRate) &&
    candidate.standardRate >= 0 &&
    typeof candidate.smallBusinessReliefThresholdAed === 'number' &&
    Number.isFinite(candidate.smallBusinessReliefThresholdAed) &&
    candidate.smallBusinessReliefThresholdAed >= 0 &&
    typeof candidate.effectiveFrom === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(candidate.effectiveFrom)
  );
}

/**
 * Validates the numeric invariants of a {@link UaeCorporateTaxInput} that are
 * independent of any rate table (currency validity, non-negative add-backs
 * and exempt income — SRS FR-1, FR-4). Does not validate that
 * `rateTableVersion` refers to a registered rate table; that check requires
 * the rate table registry and belongs to the calculation module.
 *
 * @throws {UaeCorporateTaxValidationError} if any invariant is violated.
 */
export function assertValidUaeCorporateTaxInput(input: UaeCorporateTaxInput): void {
  assertUaeCorporateTaxCurrency(input.currency);

  if (!Number.isFinite(input.nonDeductibleAddBacksAed) || input.nonDeductibleAddBacksAed < 0) {
    throw new UaeCorporateTaxValidationError(
      `nonDeductibleAddBacksAed must be a non-negative finite number, received: ${input.nonDeductibleAddBacksAed}`,
      'NEGATIVE_ADD_BACKS'
    );
  }

  if (!Number.isFinite(input.exemptIncomeAed) || input.exemptIncomeAed < 0) {
    throw new UaeCorporateTaxValidationError(
      `exemptIncomeAed must be a non-negative finite number, received: ${input.exemptIncomeAed}`,
      'NEGATIVE_EXEMPT_INCOME'
    );
  }

  if (typeof input.rateTableVersion !== 'string' || input.rateTableVersion.length === 0) {
    throw new UaeCorporateTaxValidationError(
      'rateTableVersion must be a non-empty string.',
      'INVALID_RATE_TABLE_VERSION'
    );
  }
}
