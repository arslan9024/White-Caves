/**
 * Type definitions for the Quarterly VAT finance engine.
 *
 * These types describe the inputs, outputs, and supporting domain
 * primitives used to compute quarterly Value Added Tax (VAT) liabilities
 * from a set of taxable transactions.
 *
 * Parent issue: #1945
 * Child issue: #2397
 */

/** Supported fiscal quarters (Q1-Q4) for VAT reporting periods. */
export type FiscalQuarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

/** ISO 4217 currency code, e.g. "AED", "USD". */
export type CurrencyCode = string;

/** Direction of a VAT-relevant transaction relative to the reporting entity. */
export type VatTransactionDirection = 'sale' | 'purchase';

/**
 * A single VAT rate band applicable to a transaction line.
 * `ratePercent` is expressed as a percentage value (e.g. 5 for 5%, 0 for zero-rated).
 */
export interface VatRateBand {
  /** Human-readable label for the rate band, e.g. "Standard", "Zero-rated", "Exempt". */
  readonly label: string;
  /** VAT rate expressed as a percentage (0-100). */
  readonly ratePercent: number;
  /** Whether this band is exempt from VAT entirely (no output/input tax applies). */
  readonly isExempt: boolean;
}

/**
 * A single taxable transaction line item considered for quarterly VAT
 * calculation. Amounts are net of VAT (i.e. pre-tax amounts).
 */
export interface VatTransactionLine {
  /** Unique identifier for the transaction line. */
  readonly id: string;
  /** ISO 8601 date string on which the transaction occurred. */
  readonly transactionDate: string;
  /** Whether this line represents a sale (output tax) or purchase (input tax). */
  readonly direction: VatTransactionDirection;
  /** Net amount (excluding VAT) for the transaction line. */
  readonly netAmount: number;
  /** Currency code for the transaction amount. */
  readonly currency: CurrencyCode;
  /** VAT rate band applicable to this line. */
  readonly rateBand: VatRateBand;
  /** Optional free-form description or reference. */
  readonly description?: string;
}

/** Identifies a specific quarterly reporting period. */
export interface QuarterlyVatPeriod {
  /** Four-digit calendar year, e.g. 2026. */
  readonly year: number;
  /** Fiscal quarter within the year. */
  readonly quarter: FiscalQuarter;
  /** Inclusive ISO 8601 start date of the period. */
  readonly startDate: string;
  /** Inclusive ISO 8601 end date of the period. */
  readonly endDate: string;
}

/**
 * Input payload accepted by the quarterly VAT finance engine to compute
 * a VAT liability/refund result for a given period.
 */
export interface QuarterlyVatCalculationInput {
  /** The reporting period being calculated. */
  readonly period: QuarterlyVatPeriod;
  /** All transaction lines relevant to the period (sales and purchases). */
  readonly transactions: readonly VatTransactionLine[];
  /** Reporting currency used to present aggregated totals. */
  readonly reportingCurrency: CurrencyCode;
  /** Optional VAT carried forward from a prior period (credit or liability). */
  readonly openingBalance?: number;
}

/** Aggregated VAT totals for a single rate band within a period. */
export interface VatRateBandSummary {
  readonly rateBand: VatRateBand;
  /** Sum of net amounts for output (sales) transactions in this band. */
  readonly outputNetTotal: number;
  /** Sum of VAT charged on output (sales) transactions in this band. */
  readonly outputTaxTotal: number;
  /** Sum of net amounts for input (purchase) transactions in this band. */
  readonly inputNetTotal: number;
  /** Sum of VAT paid on input (purchase) transactions in this band. */
  readonly inputTaxTotal: number;
}

/**
 * Result produced by the quarterly VAT finance engine after processing a
 * `QuarterlyVatCalculationInput`.
 */
export interface QuarterlyVatCalculationResult {
  /** The reporting period this result pertains to. */
  readonly period: QuarterlyVatPeriod;
  /** Currency in which all aggregated totals are expressed. */
  readonly reportingCurrency: CurrencyCode;
  /** Total output VAT (charged on sales) for the period. */
  readonly totalOutputTax: number;
  /** Total input VAT (paid on purchases) for the period. */
  readonly totalInputTax: number;
  /** Net VAT position: totalOutputTax - totalInputTax + openingBalance. */
  readonly netVatPosition: number;
  /**
   * Whether the entity owes VAT to the authority (`payable`) or is due a
   * refund/credit (`refundable`), or the position is exactly zero (`neutral`).
   */
  readonly status: 'payable' | 'refundable' | 'neutral';
  /** Per rate-band breakdown of totals used to derive the aggregates above. */
  readonly rateBandSummaries: readonly VatRateBandSummary[];
  /** Number of transaction lines that were excluded from calculation, if any. */
  readonly excludedLineCount: number;
}

/** Error codes surfaced by validation failures in the quarterly VAT engine. */
export type QuarterlyVatValidationErrorCode =
  | 'INVALID_PERIOD_RANGE'
  | 'TRANSACTION_OUTSIDE_PERIOD'
  | 'NEGATIVE_NET_AMOUNT'
  | 'INVALID_RATE_PERCENT'
  | 'CURRENCY_MISMATCH';

/** Structured validation error describing why a calculation input was rejected. */
export interface QuarterlyVatValidationError {
  readonly code: QuarterlyVatValidationErrorCode;
  readonly message: string;
  /** Identifier of the offending transaction line, if applicable. */
  readonly transactionId?: string;
}

/**
 * Discriminated union representing the outcome of running the quarterly VAT
 * engine: either a successful calculation result or a list of validation
 * errors preventing calculation.
 */
export type QuarterlyVatEngineOutcome =
  | { readonly success: true; readonly result: QuarterlyVatCalculationResult }
  | { readonly success: false; readonly errors: readonly QuarterlyVatValidationError[] };
