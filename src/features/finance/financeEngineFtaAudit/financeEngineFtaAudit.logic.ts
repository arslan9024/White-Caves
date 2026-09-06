/**
 * Finance Engine — FTA (Federal Tax Authority) Audit Logic
 *
 * Provides pure, side-effect-free functions for auditing finance transactions
 * against UAE FTA VAT compliance rules:
 *  - TRN (Tax Registration Number) format validation
 *  - VAT amount calculation validation (standard 5% rate, with configurable rate)
 *  - Tax period reconciliation across a batch of transactions
 *
 * This module intentionally has zero external dependencies so it can be
 * unit tested in isolation and reused by any finance reporting surface.
 */

/** UAE standard VAT rate (5%) used unless a transaction specifies its own. */
export const STANDARD_UAE_VAT_RATE = 0.05;

/** Allowed floating point tolerance (in currency units) for VAT amount checks. */
export const VAT_AMOUNT_TOLERANCE = 0.01;

/** UAE Tax Registration Numbers are exactly 15 numeric digits. */
const TRN_PATTERN = /^\d{15}$/;

export type FtaAuditSeverity = 'critical' | 'warning' | 'info';

export type FtaAuditFindingCode =
  | 'MISSING_TRN'
  | 'INVALID_TRN_FORMAT'
  | 'MISSING_INVOICE_NUMBER'
  | 'NEGATIVE_TAXABLE_AMOUNT'
  | 'NEGATIVE_VAT_AMOUNT'
  | 'VAT_AMOUNT_MISMATCH'
  | 'UNSUPPORTED_CURRENCY'
  | 'MISSING_TAX_PERIOD'
  | 'FUTURE_DATED_TRANSACTION';

export interface FtaAuditTransaction {
  /** Unique identifier of the transaction (invoice/credit note id). */
  readonly id: string;
  /** Human readable invoice number as issued to the customer. */
  readonly invoiceNumber: string;
  /** UAE Tax Registration Number of the issuing entity. */
  readonly vatRegistrationNumber: string;
  /** Net amount subject to VAT, in the transaction currency. */
  readonly taxableAmount: number;
  /** VAT amount charged, in the transaction currency. */
  readonly vatAmount: number;
  /** ISO 4217 currency code, e.g. "AED". */
  readonly currency: string;
  /** ISO 8601 date string of when the transaction occurred. */
  readonly transactionDate: string;
  /** FTA tax period identifier this transaction belongs to, e.g. "2026-Q1". */
  readonly taxPeriod: string;
  /** Optional override of the applicable VAT rate (defaults to 5%). */
  readonly vatRate?: number;
}

export interface FtaAuditFinding {
  readonly severity: FtaAuditSeverity;
  readonly code: FtaAuditFindingCode;
  readonly message: string;
  readonly transactionId: string;
}

export interface FtaAuditReport {
  readonly generatedAt: string;
  readonly totalTransactions: number;
  readonly totalTaxableAmount: number;
  readonly totalVatAmount: number;
  readonly findings: readonly FtaAuditFinding[];
  readonly isCompliant: boolean;
}

export interface FtaTaxPeriodReconciliation {
  readonly taxPeriod: string;
  readonly transactionCount: number;
  readonly totalTaxableAmount: number;
  readonly totalVatAmount: number;
  readonly expectedVatAmount: number;
  readonly variance: number;
  readonly isReconciled: boolean;
}

/** Currencies accepted for FTA audit purposes. AED is mandatory for UAE filings. */
const SUPPORTED_CURRENCIES: ReadonlySet<string> = new Set(['AED', 'USD']);

/**
 * Validates the structural format of a UAE Tax Registration Number.
 * A valid TRN is a non-empty string of exactly 15 digits.
 */
export function validateVatRegistrationNumber(vrn: string): boolean {
  return TRN_PATTERN.test(vrn.trim());
}

/**
 * Checks whether the recorded VAT amount matches the expected calculation
 * (taxableAmount * vatRate) within the allowed tolerance.
 */
export function isVatAmountValid(transaction: FtaAuditTransaction): boolean {
  const rate = transaction.vatRate ?? STANDARD_UAE_VAT_RATE;
  const expected = transaction.taxableAmount * rate;
  return Math.abs(expected - transaction.vatAmount) <= VAT_AMOUNT_TOLERANCE;
}

/**
 * Runs all FTA compliance checks against a single transaction and returns
 * the list of findings. An empty array means the transaction is fully compliant.
 */
export function auditTransaction(
  transaction: FtaAuditTransaction,
  now: Date = new Date()
): FtaAuditFinding[] {
  const findings: FtaAuditFinding[] = [];
  const push = (severity: FtaAuditSeverity, code: FtaAuditFindingCode, message: string): void => {
    findings.push({ severity, code, message, transactionId: transaction.id });
  };

  if (!transaction.vatRegistrationNumber || transaction.vatRegistrationNumber.trim().length === 0) {
    push('critical', 'MISSING_TRN', 'Transaction is missing a VAT registration number (TRN).');
  } else if (!validateVatRegistrationNumber(transaction.vatRegistrationNumber)) {
    push(
      'critical',
      'INVALID_TRN_FORMAT',
      `TRN "${transaction.vatRegistrationNumber}" must be exactly 15 digits.`
    );
  }

  if (!transaction.invoiceNumber || transaction.invoiceNumber.trim().length === 0) {
    push('critical', 'MISSING_INVOICE_NUMBER', 'Transaction is missing an invoice number.');
  }

  if (transaction.taxableAmount < 0) {
    push('critical', 'NEGATIVE_TAXABLE_AMOUNT', 'Taxable amount cannot be negative.');
  }

  if (transaction.vatAmount < 0) {
    push('critical', 'NEGATIVE_VAT_AMOUNT', 'VAT amount cannot be negative.');
  }

  if (
    transaction.taxableAmount >= 0 &&
    transaction.vatAmount >= 0 &&
    !isVatAmountValid(transaction)
  ) {
    const rate = transaction.vatRate ?? STANDARD_UAE_VAT_RATE;
    const expected = transaction.taxableAmount * rate;
    push(
      'warning',
      'VAT_AMOUNT_MISMATCH',
      `Expected VAT amount ${expected.toFixed(2)} but found ${transaction.vatAmount.toFixed(2)}.`
    );
  }

  if (!SUPPORTED_CURRENCIES.has(transaction.currency)) {
    push(
      'warning',
      'UNSUPPORTED_CURRENCY',
      `Currency "${transaction.currency}" is not supported for FTA filing.`
    );
  }

  if (!transaction.taxPeriod || transaction.taxPeriod.trim().length === 0) {
    push('critical', 'MISSING_TAX_PERIOD', 'Transaction is missing a tax period.');
  }

  const parsedDate = new Date(transaction.transactionDate);
  if (!Number.isNaN(parsedDate.getTime()) && parsedDate.getTime() > now.getTime()) {
    push('warning', 'FUTURE_DATED_TRANSACTION', 'Transaction date is in the future.');
  }

  return findings;
}

/**
 * Audits a batch of transactions, aggregating totals and findings into a
 * single report. The report is considered compliant only if no 'critical'
 * severity findings were produced.
 */
export function auditTransactions(
  transactions: readonly FtaAuditTransaction[],
  now: Date = new Date()
): FtaAuditReport {
  const findings: FtaAuditFinding[] = [];
  let totalTaxableAmount = 0;
  let totalVatAmount = 0;

  for (const transaction of transactions) {
    findings.push(...auditTransaction(transaction, now));
    totalTaxableAmount += transaction.taxableAmount;
    totalVatAmount += transaction.vatAmount;
  }

  const isCompliant = !findings.some(finding => finding.severity === 'critical');

  return {
    generatedAt: now.toISOString(),
    totalTransactions: transactions.length,
    totalTaxableAmount,
    totalVatAmount,
    findings,
    isCompliant,
  };
}

/**
 * Groups transactions by their declared tax period and reconciles the
 * recorded VAT total against the mathematically expected VAT total for
 * that period.
 */
export function reconcileTaxPeriods(
  transactions: readonly FtaAuditTransaction[]
): readonly FtaTaxPeriodReconciliation[] {
  const byPeriod = new Map<string, FtaAuditTransaction[]>();

  for (const transaction of transactions) {
    const period = transaction.taxPeriod;
    const bucket = byPeriod.get(period);
    if (bucket) {
      bucket.push(transaction);
    } else {
      byPeriod.set(period, [transaction]);
    }
  }

  const results: FtaTaxPeriodReconciliation[] = [];

  for (const [taxPeriod, periodTransactions] of byPeriod) {
    let totalTaxableAmount = 0;
    let totalVatAmount = 0;
    let expectedVatAmount = 0;

    for (const transaction of periodTransactions) {
      const rate = transaction.vatRate ?? STANDARD_UAE_VAT_RATE;
      totalTaxableAmount += transaction.taxableAmount;
      totalVatAmount += transaction.vatAmount;
      expectedVatAmount += transaction.taxableAmount * rate;
    }

    const variance = Number((totalVatAmount - expectedVatAmount).toFixed(2));

    results.push({
      taxPeriod,
      transactionCount: periodTransactions.length,
      totalTaxableAmount: Number(totalTaxableAmount.toFixed(2)),
      totalVatAmount: Number(totalVatAmount.toFixed(2)),
      expectedVatAmount: Number(expectedVatAmount.toFixed(2)),
      variance,
      isReconciled: Math.abs(variance) <= VAT_AMOUNT_TOLERANCE,
    });
  }

  return results;
}
