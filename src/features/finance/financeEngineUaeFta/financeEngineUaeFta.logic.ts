/**
 * UAE Federal Tax Authority (FTA) VAT calculation engine.
 *
 * Pure, deterministic VAT arithmetic for UAE-domiciled transactions.
 * See ./financeEngineUaeFta.contract.md for the authoritative behavioral
 * contract this implementation conforms to.
 *
 * Issue: #2471 (implementation) · Parent: #1927 · Work stream: W56-FINANCE-VAT
 */

export type VatRateCategory = 'standard' | 'zeroRated' | 'exempt' | 'outOfScope';

export interface VatLineItem {
  readonly description: string;
  readonly netAmount: number; // AED, exclusive of VAT
  readonly category: VatRateCategory;
}

export interface VatLineItemResult extends VatLineItem {
  readonly vatRate: number; // 0.05 for standard, 0 otherwise
  readonly vatAmount: number; // rounded to 2 decimals
  readonly grossAmount: number; // netAmount + vatAmount
}

export interface VatSummary {
  readonly outputVat: number;
  readonly inputVat: number;
  readonly netVatPayable: number; // may be negative (reclaimable)
  readonly lineItems: readonly VatLineItemResult[];
}

const STANDARD_VAT_RATE = 0.05;
const ZERO_VAT_RATE = 0;
const UAE_TRN_PATTERN = /^\d{15}$/;

/**
 * Typed error raised when an invalid UAE TRN is used in a context that
 * requires validation (e.g. attaching a TRN to a taxable transaction).
 */
export class InvalidTrnError extends Error {
  constructor(trn: string) {
    super(`Invalid UAE TRN: "${trn}". Expected 15 numeric digits.`);
    this.name = 'InvalidTrnError';
    Object.setPrototypeOf(this, InvalidTrnError.prototype);
  }
}

/**
 * Rounds a number to 2 decimal places using round-half-up semantics.
 *
 * `toFixed`/`Math.round` alone can misround values like `1.005` due to
 * binary floating point representation, so we nudge the value by a small
 * epsilon before rounding to compensate.
 */
function round2(value: number): number {
  const epsilon = 1e-8;
  return Math.round((value + epsilon) * 100) / 100;
}

function vatRateForCategory(category: VatRateCategory): number {
  return category === 'standard' ? STANDARD_VAT_RATE : ZERO_VAT_RATE;
}

/**
 * Computes VAT for a single line item per FTA rules: 5% for `standard`
 * category, 0% for all other categories. Amounts are rounded to 2 decimal
 * places using round-half-up.
 *
 * @throws {RangeError} if `netAmount` is negative or non-finite.
 */
export function calculateLineItemVat(item: VatLineItem): VatLineItemResult {
  const { netAmount } = item;

  if (!Number.isFinite(netAmount) || netAmount < 0) {
    throw new RangeError(
      `Invalid netAmount: ${String(netAmount)}. Must be a finite, non-negative number.`
    );
  }

  const vatRate = vatRateForCategory(item.category);
  const vatAmount = round2(netAmount * vatRate);
  const grossAmount = round2(netAmount + vatAmount);

  return {
    ...item,
    vatRate,
    vatAmount,
    grossAmount,
  };
}

/**
 * Produces a VAT period summary given output (sales) and input (purchase)
 * line items: output VAT total, input VAT total, and net VAT payable
 * (negative indicates a reclaimable amount).
 */
export function summarizeVat(
  outputLineItems: readonly VatLineItem[],
  inputLineItems: readonly VatLineItem[]
): VatSummary {
  const outputResults = outputLineItems.map(calculateLineItemVat);
  const inputResults = inputLineItems.map(calculateLineItemVat);

  const outputVat = round2(outputResults.reduce((sum, result) => sum + result.vatAmount, 0));
  const inputVat = round2(inputResults.reduce((sum, result) => sum + result.vatAmount, 0));
  const netVatPayable = round2(outputVat - inputVat);

  return {
    outputVat,
    inputVat,
    netVatPayable,
    lineItems: [...outputResults, ...inputResults],
  };
}

/**
 * Validates that `trn` is a UAE Tax Registration Number: exactly 15
 * numeric digits. Never throws; returns `false` for any non-conforming
 * input including empty strings.
 */
export function isValidUaeTrn(trn: string): boolean {
  return UAE_TRN_PATTERN.test(trn);
}

/**
 * Asserts that `trn` is a valid UAE TRN, throwing a typed `InvalidTrnError`
 * if it is not. Intended for workflows (e.g. invoice issuance) that must
 * fail hard on an invalid TRN rather than silently proceeding.
 *
 * @throws {InvalidTrnError} if `trn` does not match the 15-digit format.
 */
export function assertValidUaeTrn(trn: string): void {
  if (!isValidUaeTrn(trn)) {
    throw new InvalidTrnError(trn);
  }
}
