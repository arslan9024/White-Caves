/**
 * Shared type contracts for the Finance Engine Architecture Double module.
 *
 * Work stream W56 (parent issue #1925). This module was extracted out of the
 * single-file `financeEngineArchitectureDouble.logic.ts` design (see SDD
 * Section 8.1) so that a shared, dependency-free `FinanceEngine` contract can
 * be reused by both the double implementation and any future real,
 * production-backed engine without those consumers needing to depend on the
 * double's concrete implementation module.
 *
 * This file intentionally contains ONLY types, interfaces, small pure type
 * guards, and the `FinanceEngineValidationError` class. It performs no I/O
 * and has no side effects, per FR-6/FR-7 of the SRS.
 */

/** Currency codes supported by the finance engine double's default configuration. */
export type CurrencyCode = 'AED' | 'USD' | 'EUR';

/** All currency codes recognized by this module, in a stable, iterable order. */
export const SUPPORTED_CURRENCY_CODES: readonly CurrencyCode[] = ['AED', 'USD', 'EUR'];

/**
 * Narrowing type guard for {@link CurrencyCode}. Accepts an arbitrary string
 * (e.g. from an untyped API payload) and confirms it is a supported code.
 */
export function isCurrencyCode(value: string): value is CurrencyCode {
  return (SUPPORTED_CURRENCY_CODES as readonly string[]).includes(value);
}

/**
 * A single itemized line within a breakdown or split result, expressed in
 * integer minor units (e.g. fils/cents) per FR-4. `rateBasisPoints` is
 * optional because not every line item (e.g. a flat referral fee) is
 * necessarily rate-derived.
 */
export interface LineItem {
  readonly label: string;
  readonly rateBasisPoints?: number;
  readonly amountMinorUnits: number;
}

/** Input for {@link FinanceEngine.computePriceBreakdown}. */
export interface PriceBreakdownInput {
  readonly baseAmountMinorUnits: number;
  readonly currency: CurrencyCode;
  readonly taxRateBasisPoints?: number;
  readonly feeRateBasisPoints?: number;
}

/** Result of {@link FinanceEngine.computePriceBreakdown}. */
export interface PriceBreakdownResult {
  readonly currency: CurrencyCode;
  readonly baseAmountMinorUnits: number;
  readonly lineItems: readonly LineItem[];
  readonly totalMinorUnits: number;
}

/** Input for {@link FinanceEngine.computeCommissionSplit}. */
export interface CommissionSplitInput {
  readonly transactionAmountMinorUnits: number;
  readonly currency: CurrencyCode;
  readonly agentShareBasisPoints: number;
  readonly agencyShareBasisPoints: number;
  readonly referralShareBasisPoints?: number;
}

/** Result of {@link FinanceEngine.computeCommissionSplit}. */
export interface CommissionSplitResult {
  readonly currency: CurrencyCode;
  readonly transactionAmountMinorUnits: number;
  readonly lineItems: readonly LineItem[];
  readonly totalDistributedMinorUnits: number;
}

/** Input for {@link FinanceEngine.convertCurrency}. */
export interface CurrencyConversionInput {
  readonly amountMinorUnits: number;
  readonly fromCurrency: CurrencyCode;
  readonly toCurrency: CurrencyCode;
}

/** Result of {@link FinanceEngine.convertCurrency}. */
export interface CurrencyConversionResult {
  readonly amountMinorUnits: number;
  readonly fromCurrency: CurrencyCode;
  readonly toCurrency: CurrencyCode;
  readonly convertedAmountMinorUnits: number;
  readonly rateApplied: number;
}

/** Supported installment cadences for {@link PaymentScheduleInput}. */
export type PaymentCadence = 'monthly' | 'quarterly' | 'annually';

/** Input for {@link FinanceEngine.projectPaymentSchedule}. */
export interface PaymentScheduleInput {
  readonly totalAmountMinorUnits: number;
  readonly currency: CurrencyCode;
  readonly numberOfInstallments: number;
  readonly downPaymentMinorUnits?: number;
  readonly startDateIso: string;
  readonly cadence: PaymentCadence;
}

/** A single due installment within a projected payment schedule. */
export interface Installment {
  readonly sequence: number;
  readonly dueDateIso: string;
  readonly amountMinorUnits: number;
}

/** Result of {@link FinanceEngine.projectPaymentSchedule}. */
export interface PaymentScheduleResult {
  readonly currency: CurrencyCode;
  readonly installments: readonly Installment[];
  readonly totalScheduledMinorUnits: number;
}

/**
 * Error thrown by any {@link FinanceEngine} implementation when it receives
 * invalid input (FR-5). `field` identifies which input property was invalid,
 * when that can be determined.
 */
export class FinanceEngineValidationError extends Error {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'FinanceEngineValidationError';
    this.field = field;
    // Maintain proper prototype chain when compiled targets downlevel `Error`.
    Object.setPrototypeOf(this, FinanceEngineValidationError.prototype);
  }
}

/**
 * The stable contract shared by every finance engine implementation (the
 * in-memory architecture double as well as any future production-backed
 * engine). Consumers MUST depend only on this interface (NFR-4), never on a
 * concrete class, so implementations remain interchangeable.
 *
 * Implementations MUST:
 *  - be deterministic given identical inputs (NFR-1);
 *  - perform no network, filesystem, or database access from these methods (FR-7);
 *  - never mutate the input object passed to them (FR-6);
 *  - throw {@link FinanceEngineValidationError} on invalid input rather than
 *    returning `NaN`, `undefined`, or silently clamped values (FR-5).
 */
export interface FinanceEngine {
  computePriceBreakdown(input: PriceBreakdownInput): PriceBreakdownResult;
  computeCommissionSplit(input: CommissionSplitInput): CommissionSplitResult;
  convertCurrency(input: CurrencyConversionInput): CurrencyConversionResult;
  projectPaymentSchedule(input: PaymentScheduleInput): PaymentScheduleResult;
}
