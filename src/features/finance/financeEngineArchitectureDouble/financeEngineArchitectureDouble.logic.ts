/**
 * Finance Engine Architecture Double
 *
 * Issue: #2482 (child of parent #1925, work stream W56 — Finance Engine Architecture)
 *
 * This module implements the in-memory, deterministic "double" for the
 * `FinanceEngine` interface described in:
 *   - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-SPEC-1925.md
 *   - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md
 *
 * It performs price breakdown, commission split, currency conversion, and
 * payment schedule projection using integer "minor units" (e.g. fils/cents)
 * to avoid floating-point rounding drift (FR-4). It performs no network,
 * filesystem, or database I/O (FR-7) and never mutates its inputs (FR-6).
 *
 * Consumers should depend only on the `FinanceEngine` interface exported
 * here (NFR-4); this double is intended strictly for tests/dev use, never
 * production wiring.
 */

/* ------------------------------------------------------------------------
 * Shared primitives
 * ---------------------------------------------------------------------- */

/** A single itemized line in a computed breakdown, for auditability (NFR-5). */
export interface FinanceLineItem {
  readonly label: string;
  readonly amountMinorUnits: number;
  /** Rate applied to produce this line item, if any (e.g. 0.05 for 5%). */
  readonly ratePercent?: number;
}

/**
 * Error thrown by every `FinanceEngine` method on invalid input (FR-5).
 * Carries an optional `field` identifying which input was invalid so
 * callers/tests can assert on the precise failure.
 */
export class FinanceEngineValidationError extends Error {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'FinanceEngineValidationError';
    this.field = field;
    Object.setPrototypeOf(this, FinanceEngineValidationError.prototype);
  }
}

/* ------------------------------------------------------------------------
 * Price breakdown
 * ---------------------------------------------------------------------- */

export interface PriceBreakdownInput {
  readonly baseAmountMinorUnits: number;
  /** Overrides the double's default tax rate (percent, e.g. 5 for 5%). */
  readonly taxRatePercent?: number;
  /** An optional flat fee, in minor units, added on top of tax. */
  readonly feeAmountMinorUnits?: number;
}

export interface PriceBreakdownResult {
  readonly baseAmountMinorUnits: number;
  readonly taxAmountMinorUnits: number;
  readonly feeAmountMinorUnits: number;
  readonly totalMinorUnits: number;
  readonly lineItems: readonly FinanceLineItem[];
}

/* ------------------------------------------------------------------------
 * Commission split
 * ---------------------------------------------------------------------- */

export interface CommissionSplitInput {
  readonly transactionAmountMinorUnits: number;
  readonly agentSharePercent?: number;
  readonly agencySharePercent?: number;
  readonly referralSharePercent?: number;
}

export interface CommissionSplitResult {
  readonly agentAmountMinorUnits: number;
  readonly agencyAmountMinorUnits: number;
  readonly referralAmountMinorUnits: number;
  readonly totalMinorUnits: number;
  readonly lineItems: readonly FinanceLineItem[];
}

/* ------------------------------------------------------------------------
 * Currency conversion
 * ---------------------------------------------------------------------- */

export type CurrencyCode = string;

export interface CurrencyConversionInput {
  readonly amountMinorUnits: number;
  readonly fromCurrency: CurrencyCode;
  readonly toCurrency: CurrencyCode;
}

export interface CurrencyConversionResult {
  readonly amountMinorUnits: number;
  readonly fromCurrency: CurrencyCode;
  readonly toCurrency: CurrencyCode;
  readonly rateApplied: number;
}

/* ------------------------------------------------------------------------
 * Payment schedule
 * ---------------------------------------------------------------------- */

export interface PaymentScheduleInput {
  readonly totalAmountMinorUnits: number;
  readonly installmentCount: number;
  readonly downPaymentMinorUnits?: number;
  /** ISO-8601 date (YYYY-MM-DD) for the first installment's due date. */
  readonly startDateIso?: string;
  /** Number of days between successive installments. Defaults to 30. */
  readonly cadenceDays?: number;
}

export interface PaymentInstallment {
  readonly index: number;
  readonly dueDateIso: string;
  readonly amountMinorUnits: number;
}

export interface PaymentScheduleResult {
  readonly downPaymentMinorUnits: number;
  readonly installments: readonly PaymentInstallment[];
  readonly totalScheduledMinorUnits: number;
}

/* ------------------------------------------------------------------------
 * FinanceEngine interface (contract shared by real engine and double)
 * ---------------------------------------------------------------------- */

export interface FinanceEngine {
  computePriceBreakdown(input: PriceBreakdownInput): PriceBreakdownResult;
  computeCommissionSplit(input: CommissionSplitInput): CommissionSplitResult;
  convertCurrency(input: CurrencyConversionInput): CurrencyConversionResult;
  projectPaymentSchedule(input: PaymentScheduleInput): PaymentScheduleResult;
}

/* ------------------------------------------------------------------------
 * Double configuration
 * ---------------------------------------------------------------------- */

export interface FinanceEngineDoubleConfig {
  /** Default flat tax rate (percent) applied by `computePriceBreakdown`. */
  readonly defaultTaxRatePercent: number;
  /** Default agent commission share (percent). */
  readonly defaultAgentSharePercent: number;
  /** Default agency commission share (percent). */
  readonly defaultAgencySharePercent: number;
  /** Default referral commission share (percent). */
  readonly defaultReferralSharePercent: number;
  /** Fixed currency rate table, keyed by `"FROM_TO"` (e.g. `"USD_AED"`). */
  readonly currencyRates: Readonly<Record<string, number>>;
  /** Default cadence, in days, between payment schedule installments. */
  readonly defaultCadenceDays: number;
  /** Fallback ISO-8601 start date used when a schedule input omits one. */
  readonly defaultStartDateIso: string;
}

/** Documented, clearly-non-production default configuration (SDD 4.3). */
export const DEFAULT_FINANCE_ENGINE_DOUBLE_CONFIG: FinanceEngineDoubleConfig = {
  defaultTaxRatePercent: 5,
  defaultAgentSharePercent: 2.5,
  defaultAgencySharePercent: 2.5,
  defaultReferralSharePercent: 0,
  currencyRates: {
    AED_AED: 1,
    USD_USD: 1,
    EUR_EUR: 1,
    USD_AED: 3.6725,
    AED_USD: 1 / 3.6725,
    EUR_AED: 4.0,
    AED_EUR: 1 / 4.0,
    USD_EUR: 0.91,
    EUR_USD: 1 / 0.91,
  },
  defaultCadenceDays: 30,
  defaultStartDateIso: '2024-01-01',
};

export type FinanceEngineDoubleConfigOverride = Partial<FinanceEngineDoubleConfig>;

/* ------------------------------------------------------------------------
 * Validation guards (shared across all four methods, per SDD 4.2)
 * ---------------------------------------------------------------------- */

function assertFiniteNumber(value: number, field: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new FinanceEngineValidationError(`${field} must be a finite number`, field);
  }
}

function assertNonNegativeAmount(value: number, field: string): void {
  assertFiniteNumber(value, field);
  if (value < 0) {
    throw new FinanceEngineValidationError(`${field} must be >= 0`, field);
  }
}

function assertValidPercent(value: number, field: string): void {
  assertFiniteNumber(value, field);
  if (value < 0 || value > 100) {
    throw new FinanceEngineValidationError(`${field} must be between 0 and 100`, field);
  }
}

function assertKnownCurrency(
  code: string,
  field: string,
  rates: Readonly<Record<string, number>>
): void {
  if (typeof code !== 'string' || code.trim().length === 0) {
    throw new FinanceEngineValidationError(`${field} must be a non-empty currency code`, field);
  }
  const selfKey = `${code}_${code}`;
  const hasAnyRate =
    rates[selfKey] !== undefined ||
    Object.keys(rates).some(key => key.startsWith(`${code}_`) || key.endsWith(`_${code}`));
  if (!hasAnyRate) {
    throw new FinanceEngineValidationError(`${field} is not a known currency code: ${code}`, field);
  }
}

function assertPositiveInteger(value: number, field: string): void {
  assertFiniteNumber(value, field);
  if (!Number.isInteger(value) || value <= 0) {
    throw new FinanceEngineValidationError(`${field} must be a positive integer`, field);
  }
}

function assertValidIsoDate(value: string, field: string): void {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    throw new FinanceEngineValidationError(`${field} must be a valid ISO-8601 date`, field);
  }
}

/* ------------------------------------------------------------------------
 * FinanceEngineArchitectureDouble
 * ---------------------------------------------------------------------- */

/**
 * Deterministic, in-memory implementation of `FinanceEngine` for use in
 * tests and local development. Ships with non-production default values
 * and accepts a partial config override so individual tests can exercise
 * edge cases without forking the double (SDD 4.3, NFR-3).
 */
export class FinanceEngineArchitectureDouble implements FinanceEngine {
  private readonly config: FinanceEngineDoubleConfig;

  constructor(configOverride: FinanceEngineDoubleConfigOverride = {}) {
    this.config = {
      ...DEFAULT_FINANCE_ENGINE_DOUBLE_CONFIG,
      ...configOverride,
      currencyRates: {
        ...DEFAULT_FINANCE_ENGINE_DOUBLE_CONFIG.currencyRates,
        ...(configOverride.currencyRates ?? {}),
      },
    };
  }

  public computePriceBreakdown(input: PriceBreakdownInput): PriceBreakdownResult {
    assertNonNegativeAmount(input.baseAmountMinorUnits, 'baseAmountMinorUnits');

    const taxRatePercent = input.taxRatePercent ?? this.config.defaultTaxRatePercent;
    assertValidPercent(taxRatePercent, 'taxRatePercent');

    const feeAmountMinorUnits = input.feeAmountMinorUnits ?? 0;
    assertNonNegativeAmount(feeAmountMinorUnits, 'feeAmountMinorUnits');

    const taxAmountMinorUnits = Math.round((input.baseAmountMinorUnits * taxRatePercent) / 100);
    const totalMinorUnits = input.baseAmountMinorUnits + taxAmountMinorUnits + feeAmountMinorUnits;

    const lineItems: FinanceLineItem[] = [
      { label: 'base', amountMinorUnits: input.baseAmountMinorUnits },
      { label: 'tax', amountMinorUnits: taxAmountMinorUnits, ratePercent: taxRatePercent },
    ];
    if (feeAmountMinorUnits > 0) {
      lineItems.push({ label: 'fee', amountMinorUnits: feeAmountMinorUnits });
    }

    return {
      baseAmountMinorUnits: input.baseAmountMinorUnits,
      taxAmountMinorUnits,
      feeAmountMinorUnits,
      totalMinorUnits,
      lineItems,
    };
  }

  public computeCommissionSplit(input: CommissionSplitInput): CommissionSplitResult {
    assertNonNegativeAmount(input.transactionAmountMinorUnits, 'transactionAmountMinorUnits');

    const agentSharePercent = input.agentSharePercent ?? this.config.defaultAgentSharePercent;
    const agencySharePercent = input.agencySharePercent ?? this.config.defaultAgencySharePercent;
    const referralSharePercent =
      input.referralSharePercent ?? this.config.defaultReferralSharePercent;

    assertValidPercent(agentSharePercent, 'agentSharePercent');
    assertValidPercent(agencySharePercent, 'agencySharePercent');
    assertValidPercent(referralSharePercent, 'referralSharePercent');

    const totalSharePercent = agentSharePercent + agencySharePercent + referralSharePercent;
    if (totalSharePercent > 100) {
      throw new FinanceEngineValidationError(
        'sum of agentSharePercent, agencySharePercent, and referralSharePercent must not exceed 100',
        'totalSharePercent'
      );
    }

    const agentAmountMinorUnits = Math.round(
      (input.transactionAmountMinorUnits * agentSharePercent) / 100
    );
    const agencyAmountMinorUnits = Math.round(
      (input.transactionAmountMinorUnits * agencySharePercent) / 100
    );
    const referralAmountMinorUnits = Math.round(
      (input.transactionAmountMinorUnits * referralSharePercent) / 100
    );

    const totalMinorUnits =
      agentAmountMinorUnits + agencyAmountMinorUnits + referralAmountMinorUnits;

    const lineItems: FinanceLineItem[] = [
      { label: 'agent', amountMinorUnits: agentAmountMinorUnits, ratePercent: agentSharePercent },
      {
        label: 'agency',
        amountMinorUnits: agencyAmountMinorUnits,
        ratePercent: agencySharePercent,
      },
      {
        label: 'referral',
        amountMinorUnits: referralAmountMinorUnits,
        ratePercent: referralSharePercent,
      },
    ];

    return {
      agentAmountMinorUnits,
      agencyAmountMinorUnits,
      referralAmountMinorUnits,
      totalMinorUnits,
      lineItems,
    };
  }

  public convertCurrency(input: CurrencyConversionInput): CurrencyConversionResult {
    assertNonNegativeAmount(input.amountMinorUnits, 'amountMinorUnits');
    assertKnownCurrency(input.fromCurrency, 'fromCurrency', this.config.currencyRates);
    assertKnownCurrency(input.toCurrency, 'toCurrency', this.config.currencyRates);

    if (input.fromCurrency === input.toCurrency) {
      return {
        amountMinorUnits: input.amountMinorUnits,
        fromCurrency: input.fromCurrency,
        toCurrency: input.toCurrency,
        rateApplied: 1,
      };
    }

    const rateKey = `${input.fromCurrency}_${input.toCurrency}`;
    const rate = this.config.currencyRates[rateKey];
    if (rate === undefined) {
      throw new FinanceEngineValidationError(
        `no conversion rate configured for ${rateKey}`,
        'toCurrency'
      );
    }

    const convertedAmountMinorUnits = Math.round(input.amountMinorUnits * rate);

    return {
      amountMinorUnits: convertedAmountMinorUnits,
      fromCurrency: input.fromCurrency,
      toCurrency: input.toCurrency,
      rateApplied: rate,
    };
  }

  public projectPaymentSchedule(input: PaymentScheduleInput): PaymentScheduleResult {
    assertNonNegativeAmount(input.totalAmountMinorUnits, 'totalAmountMinorUnits');
    assertPositiveInteger(input.installmentCount, 'installmentCount');

    const downPaymentMinorUnits = input.downPaymentMinorUnits ?? 0;
    assertNonNegativeAmount(downPaymentMinorUnits, 'downPaymentMinorUnits');
    if (downPaymentMinorUnits > input.totalAmountMinorUnits) {
      throw new FinanceEngineValidationError(
        'downPaymentMinorUnits must not exceed totalAmountMinorUnits',
        'downPaymentMinorUnits'
      );
    }

    const cadenceDays = input.cadenceDays ?? this.config.defaultCadenceDays;
    assertPositiveInteger(cadenceDays, 'cadenceDays');

    const startDateIso = input.startDateIso ?? this.config.defaultStartDateIso;
    assertValidIsoDate(startDateIso, 'startDateIso');

    const remainingMinorUnits = input.totalAmountMinorUnits - downPaymentMinorUnits;
    const baseInstallmentMinorUnits = Math.floor(remainingMinorUnits / input.installmentCount);
    const remainderMinorUnits =
      remainingMinorUnits - baseInstallmentMinorUnits * input.installmentCount;

    const startDateMs = Date.parse(startDateIso);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    const installments: PaymentInstallment[] = Array.from(
      { length: input.installmentCount },
      (_unused, index) => {
        // Assign any rounding remainder to the final installment so the
        // schedule always sums exactly to `remainingMinorUnits`.
        const isLast = index === input.installmentCount - 1;
        const amountMinorUnits = isLast
          ? baseInstallmentMinorUnits + remainderMinorUnits
          : baseInstallmentMinorUnits;
        const dueDateMs = startDateMs + index * cadenceDays * millisecondsPerDay;
        const dueDateIso = new Date(dueDateMs).toISOString().slice(0, 10);

        return {
          index,
          dueDateIso,
          amountMinorUnits,
        };
      }
    );

    const totalScheduledMinorUnits =
      downPaymentMinorUnits +
      installments.reduce((sum, installment) => sum + installment.amountMinorUnits, 0);

    return {
      downPaymentMinorUnits,
      installments,
      totalScheduledMinorUnits,
    };
  }
}
