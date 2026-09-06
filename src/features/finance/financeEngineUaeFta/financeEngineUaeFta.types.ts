/**
 * Shared data model, constants, type guards, and error types for the UAE FTA
 * VAT calculation module (`src/features/finance/financeEngineUaeFta/`).
 *
 * This file intentionally contains ONLY types, constants, type guards, and
 * an error class — no VAT arithmetic. It exists so that consumers (and the
 * sibling `financeEngineUaeFta.logic.ts` module, when present) can share a
 * single, authoritative definition of the VAT data model described in
 * `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-VAT-1927.md` (section 4).
 *
 * Design constraints (per the SDD):
 * - No I/O, no persistence, no mutation of inputs (NFR-1/NFR-2).
 * - Strict TypeScript, no `any` (NFR-3).
 * - `InvalidTrnError` must be a real class so callers can use
 *   `instanceof` narrowing (SDD section 3.1 / section 5).
 */

/** The four UAE FTA VAT rate categories a line item can fall into. */
export type VatRateCategory = 'standard' | 'zeroRated' | 'exempt' | 'outOfScope';

/** Ordered, immutable list of every valid {@link VatRateCategory} value. */
export const VAT_RATE_CATEGORIES: readonly VatRateCategory[] = [
  'standard',
  'zeroRated',
  'exempt',
  'outOfScope',
];

/**
 * Runtime type guard for {@link VatRateCategory}. Useful at the boundary of
 * the module (e.g. when a category originates from an untyped source such
 * as a form submission or an external API payload) where a compile-time
 * type alone cannot guarantee validity.
 */
export function isVatRateCategory(value: unknown): value is VatRateCategory {
  return typeof value === 'string' && (VAT_RATE_CATEGORIES as readonly string[]).includes(value);
}

/** The UAE FTA standard VAT rate (5%), expressed as a decimal fraction. */
export const STANDARD_VAT_RATE = 0.05;

/** The VAT rate applied to zero-rated, exempt, and out-of-scope categories. */
export const ZERO_VAT_RATE = 0;

/** Number of decimal places VAT amounts must be rounded to (FR-3). */
export const VAT_ROUNDING_DECIMAL_PLACES = 2;

/** Required length of a valid UAE Tax Registration Number (FR-6). */
export const UAE_TRN_LENGTH = 15;

/** Pattern a string must match to be a valid UAE TRN: exactly 15 digits. */
export const UAE_TRN_PATTERN = /^\d{15}$/;

/**
 * A single invoice/transaction line item prior to VAT calculation.
 * Matches the SDD section 4 data model verbatim.
 */
export interface VatLineItem {
  readonly description: string;
  readonly netAmount: number;
  readonly category: VatRateCategory;
}

/**
 * The result of applying VAT calculation to a {@link VatLineItem}. Extends
 * the input fields (read-only, never mutated) with the computed rate,
 * amount, and gross total.
 */
export interface VatLineItemResult extends VatLineItem {
  readonly vatRate: number;
  readonly vatAmount: number;
  readonly grossAmount: number;
}

/**
 * A VAT period summary aggregating output (sales) and input (purchase)
 * line items into totals suitable for an FTA VAT return.
 */
export interface VatSummary {
  readonly outputVat: number;
  readonly inputVat: number;
  readonly netVatPayable: number;
  readonly lineItems: readonly VatLineItemResult[];
}

/**
 * Thrown when an invalid UAE TRN is used in a context that requires a
 * validated TRN (SDD section 5). Distinguishable from generic runtime
 * errors via `instanceof InvalidTrnError`.
 */
export class InvalidTrnError extends Error {
  /** The invalid TRN value that triggered this error. */
  public readonly trn: string;

  constructor(trn: string) {
    super(`Invalid UAE TRN: "${trn}" (expected exactly ${UAE_TRN_LENGTH} numeric digits)`);
    this.name = 'InvalidTrnError';
    this.trn = trn;
    Object.setPrototypeOf(this, InvalidTrnError.prototype);
  }
}
