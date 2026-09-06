/**
 * UAE FTA VAT calculation engine.
 *
 * Pure, deterministic VAT arithmetic for UAE transactions, realizing the
 * requirements in:
 *   plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-VAT-1927.md
 * and the design in:
 *   plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-VAT-1927.md
 *
 * No I/O, no persistence, no network calls. All functions are pure and
 * side-effect free so downstream invoice/reporting features can rely on
 * consistent, auditable behavior.
 */

/** UAE FTA standard VAT rate (5%), applied only to `standard` category line items. */
export const UAE_STANDARD_VAT_RATE = 0.05;

/** VAT treatment categories recognized by the UAE FTA VAT engine. */
export type VatRateCategory = 'standard' | 'zeroRated' | 'exempt' | 'outOfScope';

/** A single VAT-relevant line item before calculation. */
export interface VatLineItem {
  readonly description: string;
  readonly netAmount: number;
  readonly category: VatRateCategory;
}

/** A VAT line item after calculation, including the derived VAT and gross amounts. */
export interface VatLineItemResult extends VatLineItem {
  readonly vatRate: number;
  readonly vatAmount: number;
  readonly grossAmount: number;
}

/** A VAT period summary combining output (sales) and input (purchase) line items. */
export interface VatSummary {
  readonly outputVat: number;
  readonly inputVat: number;
  readonly netVatPayable: number;
  readonly lineItems: readonly VatLineItemResult[];
}

/**
 * Raised when a UAE Tax Registration Number (TRN) fails validation in a
 * context that requires a valid TRN. Distinguishable from generic runtime
 * errors via `instanceof InvalidTrnError`.
 */
export class InvalidTrnError extends Error {
  public readonly trn: string;

  constructor(trn: string) {
    super(`Invalid UAE TRN: "${trn}". A UAE TRN must be exactly 15 numeric digits.`);
    this.name = 'InvalidTrnError';
    this.trn = trn;
    Object.setPrototypeOf(this, InvalidTrnError.prototype);
  }
}

/**
 * Rounds a number to 2 decimal places using round-half-up semantics.
 *
 * Deliberately avoids `toFixed`, which uses round-half-to-even (banker's
 * rounding) in some JS engines and can silently misround `.xx5` boundary
 * values. A small epsilon is added before scaling to counteract binary
 * floating point representation error (e.g. `1.005 * 100` evaluating to
 * `100.49999999999999` instead of `100.5`).
 */
function roundHalfUp2(value: number): number {
  const epsilon = 1e-8;
  const scaled = value * 100 + (value >= 0 ? epsilon : -epsilon);
  return Math.round(scaled) / 100;
}

/**
 * Returns the applicable VAT rate for a given VAT category under UAE FTA
 * rules: 5% for `standard`, 0% for `zeroRated`, `exempt`, and `outOfScope`.
 */
export function getVatRateForCategory(category: VatRateCategory): number {
  return category === 'standard' ? UAE_STANDARD_VAT_RATE : 0;
}

/**
 * Calculates VAT and gross amount for a single line item.
 *
 * @throws {RangeError} if `netAmount` is negative or not a finite number.
 */
export function calculateLineItemVat(lineItem: VatLineItem): VatLineItemResult {
  const { netAmount } = lineItem;

  if (!Number.isFinite(netAmount) || netAmount < 0) {
    throw new RangeError(
      `Invalid netAmount "${String(netAmount)}": must be a finite, non-negative number.`
    );
  }

  const vatRate = getVatRateForCategory(lineItem.category);
  const vatAmount = roundHalfUp2(netAmount * vatRate);
  const grossAmount = roundHalfUp2(netAmount + vatAmount);

  return {
    ...lineItem,
    vatRate,
    vatAmount,
    grossAmount,
  };
}

/**
 * Produces a VAT period summary given output (sales) line items and input
 * (purchase) line items. `netVatPayable` is positive when output VAT
 * exceeds input VAT (VAT owed to the FTA) and negative when input VAT
 * exceeds output VAT (VAT reclaimable).
 */
export function summarizeVat(
  outputLineItems: readonly VatLineItem[],
  inputLineItems: readonly VatLineItem[]
): VatSummary {
  const calculatedOutputs = outputLineItems.map(calculateLineItemVat);
  const calculatedInputs = inputLineItems.map(calculateLineItemVat);

  const outputVat = roundHalfUp2(calculatedOutputs.reduce((sum, item) => sum + item.vatAmount, 0));
  const inputVat = roundHalfUp2(calculatedInputs.reduce((sum, item) => sum + item.vatAmount, 0));
  const netVatPayable = roundHalfUp2(outputVat - inputVat);

  return {
    outputVat,
    inputVat,
    netVatPayable,
    lineItems: [...calculatedOutputs, ...calculatedInputs],
  };
}

/**
 * Validates that a UAE Tax Registration Number (TRN) is exactly 15
 * numeric digits. Pure boolean predicate; never throws.
 */
export function isValidUaeTrn(trn: string): boolean {
  return /^\d{15}$/.test(trn);
}

/**
 * Asserts that a UAE TRN is valid, raising a typed `InvalidTrnError` when
 * it is not. Intended for workflows (e.g. attaching a TRN to an invoice)
 * that must enforce validity rather than merely check it.
 *
 * @throws {InvalidTrnError} if `trn` is not a valid 15-digit UAE TRN.
 */
export function assertValidUaeTrn(trn: string): void {
  if (!isValidUaeTrn(trn)) {
    throw new InvalidTrnError(trn);
  }
}
