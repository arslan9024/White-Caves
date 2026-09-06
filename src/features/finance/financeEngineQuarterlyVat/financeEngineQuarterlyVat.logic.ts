/**
 * financeEngineQuarterlyVat.logic.ts
 *
 * Pure, dependency-free logic for computing UAE-style quarterly VAT
 * (Value Added Tax) summaries from a list of finance transactions.
 *
 * This module has no I/O side effects (no filesystem, no network, no
 * database access). It only performs deterministic calculations over
 * data supplied by the caller, so it can be reused across browser and
 * Node contexts (e.g. UI reporting screens, scheduled export jobs).
 *
 * VAT model:
 * - Standard UAE VAT rate is 5% (0.05), applied to the net (pre-tax)
 *   amount of a transaction unless an explicit `vatAmount` is supplied.
 * - "sale" transactions produce output VAT (VAT collected from customers).
 * - "purchase" transactions produce input VAT (VAT paid to suppliers,
 *   recoverable against output VAT).
 * - Net VAT payable for a quarter = output VAT - input VAT. A negative
 *   value indicates a refundable/creditable position.
 * - Quarters follow the standard calendar quarters: Q1 (Jan-Mar),
 *   Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec).
 */

/** The two transaction directions that participate in VAT calculations. */
export type FinanceVatTransactionType = 'sale' | 'purchase';

/**
 * A single finance transaction relevant to VAT reporting.
 *
 * `amount` is the net (pre-tax) value of the transaction. `vatAmount`
 * may be supplied when the VAT amount was already determined
 * (e.g. imported from an invoice) and should be used verbatim instead
 * of being recalculated from `amount` and the standard rate.
 */
export interface FinanceVatTransaction {
  /** Unique identifier for the transaction (used for traceability only). */
  id: string;
  /** ISO-8601 date string (e.g. '2024-02-15' or a full timestamp). */
  date: string;
  /** Net (pre-tax) transaction amount. Must be a finite, non-negative number. */
  amount: number;
  /** Whether this transaction is a sale (output VAT) or purchase (input VAT). */
  type: FinanceVatTransactionType;
  /**
   * Explicit VAT amount for this transaction, when already known.
   * When omitted, VAT is computed as `amount * vatRate`.
   */
  vatAmount?: number;
  /** Optional free-form category/tag, carried through for reporting. */
  category?: string;
}

/** 1-based calendar quarter identifier. */
export type FinanceQuarterNumber = 1 | 2 | 3 | 4;

/** Identifies a specific calendar quarter (e.g. 2024 Q1). */
export interface FinanceQuarterKey {
  year: number;
  quarter: FinanceQuarterNumber;
}

/** Aggregated VAT figures for a single calendar quarter. */
export interface FinanceQuarterlyVatSummary {
  year: number;
  quarter: FinanceQuarterNumber;
  /** Human-readable label, e.g. "2024-Q1". */
  label: string;
  /** Total net sales amount (excluding VAT) for the quarter. */
  totalSales: number;
  /** Total net purchases amount (excluding VAT) for the quarter. */
  totalPurchases: number;
  /** Total VAT collected on sales (output VAT). */
  outputVat: number;
  /** Total VAT paid on purchases (input VAT, recoverable). */
  inputVat: number;
  /** outputVat - inputVat. Negative means refundable/creditable. */
  netVat: number;
  /** Number of transactions that fell into this quarter. */
  transactionCount: number;
}

/** Options controlling how quarterly VAT is calculated. */
export interface FinanceQuarterlyVatOptions {
  /**
   * VAT rate to apply to transactions without an explicit `vatAmount`.
   * Defaults to 0.05 (5%, the UAE standard rate).
   */
  vatRate?: number;
  /** When set, only transactions in this calendar year are included. */
  year?: number;
  /** When true, quarters with zero transactions are omitted. Defaults to false. */
  omitEmptyQuarters?: boolean;
}

/** Raised when input transactions or options are invalid. */
export class FinanceQuarterlyVatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FinanceQuarterlyVatError';
  }
}

/** Standard UAE VAT rate (5%). */
export const DEFAULT_VAT_RATE = 0.05;

const VALID_TRANSACTION_TYPES: readonly FinanceVatTransactionType[] = ['sale', 'purchase'];

function isValidTransactionType(value: unknown): value is FinanceVatTransactionType {
  return (
    typeof value === 'string' && (VALID_TRANSACTION_TYPES as readonly string[]).includes(value)
  );
}

function parseTransactionDate(dateStr: string): Date {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    throw new FinanceQuarterlyVatError(`Invalid transaction date: "${dateStr}".`);
  }
  return parsed;
}

/** Derives the calendar quarter (1-4) for a given month index (0-11). */
function monthToQuarter(monthIndex: number): FinanceQuarterNumber {
  return (Math.floor(monthIndex / 3) + 1) as FinanceQuarterNumber;
}

/**
 * Computes the {@link FinanceQuarterKey} (year + quarter) for a given
 * ISO date string, using UTC to avoid local timezone drift.
 */
export function getQuarterForDate(dateStr: string): FinanceQuarterKey {
  const date = parseTransactionDate(dateStr);
  return {
    year: date.getUTCFullYear(),
    quarter: monthToQuarter(date.getUTCMonth()),
  };
}

/** Formats a quarter key as a human-readable label, e.g. "2024-Q1". */
export function formatQuarterLabel(key: FinanceQuarterKey): string {
  return `${key.year}-Q${key.quarter}`;
}

function assertValidTransactions(transactions: readonly FinanceVatTransaction[]): void {
  if (!Array.isArray(transactions)) {
    throw new FinanceQuarterlyVatError('Transactions input must be an array.');
  }
  transactions.forEach((transaction, index) => {
    if (transaction === null || typeof transaction !== 'object') {
      throw new FinanceQuarterlyVatError(`Transaction at index ${index} must be an object.`);
    }
    if (typeof transaction.id !== 'string' || transaction.id.trim().length === 0) {
      throw new FinanceQuarterlyVatError(
        `Transaction at index ${index} must have a non-empty string "id".`
      );
    }
    if (typeof transaction.date !== 'string' || transaction.date.trim().length === 0) {
      throw new FinanceQuarterlyVatError(
        `Transaction "${transaction.id}" must have a non-empty string "date".`
      );
    }
    if (
      typeof transaction.amount !== 'number' ||
      !Number.isFinite(transaction.amount) ||
      transaction.amount < 0
    ) {
      throw new FinanceQuarterlyVatError(
        `Transaction "${transaction.id}" must have a finite, non-negative "amount".`
      );
    }
    if (!isValidTransactionType(transaction.type)) {
      throw new FinanceQuarterlyVatError(
        `Transaction "${transaction.id}" has invalid "type" (expected "sale" or "purchase").`
      );
    }
    if (
      transaction.vatAmount !== undefined &&
      (typeof transaction.vatAmount !== 'number' ||
        !Number.isFinite(transaction.vatAmount) ||
        transaction.vatAmount < 0)
    ) {
      throw new FinanceQuarterlyVatError(
        `Transaction "${transaction.id}" has an invalid "vatAmount" (must be a finite, non-negative number).`
      );
    }
  });
}

function assertValidOptions(options: FinanceQuarterlyVatOptions): void {
  if (
    options.vatRate !== undefined &&
    (typeof options.vatRate !== 'number' ||
      !Number.isFinite(options.vatRate) ||
      options.vatRate < 0)
  ) {
    throw new FinanceQuarterlyVatError('"vatRate" must be a finite, non-negative number.');
  }
  if (
    options.year !== undefined &&
    (typeof options.year !== 'number' || !Number.isInteger(options.year) || options.year < 1)
  ) {
    throw new FinanceQuarterlyVatError('"year" must be a positive integer.');
  }
}

/** Resolves the VAT amount for a transaction, honoring explicit overrides. */
export function resolveTransactionVat(transaction: FinanceVatTransaction, vatRate: number): number {
  return transaction.vatAmount !== undefined ? transaction.vatAmount : transaction.amount * vatRate;
}

/** Rounds a monetary value to 2 decimal places, avoiding floating point noise. */
function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Groups transactions by calendar quarter, preserving first-seen quarter
 * order. Does not perform any VAT calculation; use
 * {@link calculateQuarterlyVat} for full summaries.
 */
export function groupTransactionsByQuarter(
  transactions: readonly FinanceVatTransaction[]
): Map<string, FinanceVatTransaction[]> {
  const groups = new Map<string, FinanceVatTransaction[]>();
  for (const transaction of transactions) {
    const key = formatQuarterLabel(getQuarterForDate(transaction.date));
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(transaction);
    } else {
      groups.set(key, [transaction]);
    }
  }
  return groups;
}

/**
 * Calculates quarterly VAT summaries from a list of finance transactions.
 *
 * Transactions are grouped by calendar quarter (optionally filtered to a
 * single `year`), and for each quarter the output VAT (from sales),
 * input VAT (from purchases), and net VAT position are computed.
 *
 * Results are sorted chronologically by year then quarter.
 *
 * Throws {@link FinanceQuarterlyVatError} when input transactions or
 * options are malformed. Never mutates the input array.
 */
export function calculateQuarterlyVat(
  transactions: readonly FinanceVatTransaction[],
  options: FinanceQuarterlyVatOptions = {}
): FinanceQuarterlyVatSummary[] {
  assertValidTransactions(transactions);
  assertValidOptions(options);

  const vatRate = options.vatRate ?? DEFAULT_VAT_RATE;
  const omitEmptyQuarters = options.omitEmptyQuarters ?? false;

  const filtered =
    options.year === undefined
      ? transactions
      : transactions.filter(
          transaction => getQuarterForDate(transaction.date).year === options.year
        );

  const accumulators = new Map<
    string,
    {
      key: FinanceQuarterKey;
      totalSales: number;
      totalPurchases: number;
      outputVat: number;
      inputVat: number;
      transactionCount: number;
    }
  >();

  for (const transaction of filtered) {
    const key = getQuarterForDate(transaction.date);
    const label = formatQuarterLabel(key);
    const vat = resolveTransactionVat(transaction, vatRate);

    let acc = accumulators.get(label);
    if (!acc) {
      acc = {
        key,
        totalSales: 0,
        totalPurchases: 0,
        outputVat: 0,
        inputVat: 0,
        transactionCount: 0,
      };
      accumulators.set(label, acc);
    }

    if (transaction.type === 'sale') {
      acc.totalSales += transaction.amount;
      acc.outputVat += vat;
    } else {
      acc.totalPurchases += transaction.amount;
      acc.inputVat += vat;
    }
    acc.transactionCount += 1;
  }

  const summaries: FinanceQuarterlyVatSummary[] = Array.from(accumulators.values())
    .filter(acc => !omitEmptyQuarters || acc.transactionCount > 0)
    .map(acc => ({
      year: acc.key.year,
      quarter: acc.key.quarter,
      label: formatQuarterLabel(acc.key),
      totalSales: roundCurrency(acc.totalSales),
      totalPurchases: roundCurrency(acc.totalPurchases),
      outputVat: roundCurrency(acc.outputVat),
      inputVat: roundCurrency(acc.inputVat),
      netVat: roundCurrency(acc.outputVat - acc.inputVat),
      transactionCount: acc.transactionCount,
    }));

  summaries.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.quarter - b.quarter));

  return summaries;
}

/**
 * Convenience helper returning the summary for a single specific quarter,
 * or `undefined` when no transactions fall within it.
 */
export function getQuarterlyVatSummary(
  transactions: readonly FinanceVatTransaction[],
  key: FinanceQuarterKey,
  options: Omit<FinanceQuarterlyVatOptions, 'year' | 'omitEmptyQuarters'> = {}
): FinanceQuarterlyVatSummary | undefined {
  const summaries = calculateQuarterlyVat(transactions, { ...options, year: key.year });
  return summaries.find(summary => summary.quarter === key.quarter);
}
