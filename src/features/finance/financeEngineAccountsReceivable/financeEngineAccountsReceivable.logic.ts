/**
 * Finance Engine — Accounts Receivable
 *
 * Pure business logic for tracking, aging, and settling receivable
 * invoices (money owed to the business by tenants/clients). This module
 * has no I/O; it operates purely on plain data structures so it can be
 * unit tested in isolation and composed by higher-level services.
 *
 * Parent issue: #1942
 * Issue: #2409
 */

export type ReceivableStatus = 'draft' | 'open' | 'partially_paid' | 'paid' | 'overdue' | 'void';

export type AgingBucket = 'current' | '1-30' | '31-60' | '61-90' | '90+';

export interface ReceivableInvoice {
  readonly id: string;
  readonly accountId: string;
  /** Original invoiced amount, in minor currency units (e.g. cents). Must be >= 0. */
  readonly amount: number;
  /** Sum of all payments applied so far, in minor currency units. Must be >= 0. */
  readonly amountPaid: number;
  readonly issueDate: string; // ISO date string (YYYY-MM-DD)
  readonly dueDate: string; // ISO date string (YYYY-MM-DD)
  readonly status: ReceivableStatus;
}

export interface ReceivablePayment {
  readonly invoiceId: string;
  /** Payment amount in minor currency units. Must be > 0. */
  readonly amount: number;
  readonly paidDate: string; // ISO date string (YYYY-MM-DD)
}

export interface AgedReceivable {
  readonly invoiceId: string;
  readonly accountId: string;
  readonly balance: number;
  readonly daysPastDue: number;
  readonly bucket: AgingBucket;
}

export interface AccountsReceivableSummary {
  readonly totalInvoiced: number;
  readonly totalPaid: number;
  readonly totalOutstanding: number;
  readonly totalOverdue: number;
  readonly invoiceCount: number;
  readonly openInvoiceCount: number;
}

export interface ApplyPaymentResult {
  readonly invoice: ReceivableInvoice;
  readonly appliedAmount: number;
  readonly overpaymentAmount: number;
}

export class InvalidReceivableInvoiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReceivableInvoiceError';
  }
}

export class InvalidReceivablePaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReceivablePaymentError';
  }
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseIsoDate(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) {
    throw new InvalidReceivableInvoiceError(`Invalid date string: "${dateStr}"`);
  }
  return parsed;
}

function assertValidInvoice(invoice: ReceivableInvoice): void {
  if (!invoice.id) {
    throw new InvalidReceivableInvoiceError('Invoice id is required.');
  }
  if (!invoice.accountId) {
    throw new InvalidReceivableInvoiceError('Invoice accountId is required.');
  }
  if (!Number.isFinite(invoice.amount) || invoice.amount < 0) {
    throw new InvalidReceivableInvoiceError(
      `Invoice amount must be a non-negative finite number, got ${invoice.amount}.`
    );
  }
  if (!Number.isFinite(invoice.amountPaid) || invoice.amountPaid < 0) {
    throw new InvalidReceivableInvoiceError(
      `Invoice amountPaid must be a non-negative finite number, got ${invoice.amountPaid}.`
    );
  }
  const issue = parseIsoDate(invoice.issueDate);
  const due = parseIsoDate(invoice.dueDate);
  if (due < issue) {
    throw new InvalidReceivableInvoiceError(
      `Invoice dueDate (${invoice.dueDate}) cannot be before issueDate (${invoice.issueDate}).`
    );
  }
}

/**
 * Computes the outstanding balance owed on an invoice.
 * Never returns a negative value (overpayments are clamped to zero).
 */
export function getInvoiceBalance(invoice: ReceivableInvoice): number {
  assertValidInvoice(invoice);
  return Math.max(0, invoice.amount - invoice.amountPaid);
}

/**
 * Determines whether an invoice is fully settled (balance is zero or less).
 */
export function isInvoiceSettled(invoice: ReceivableInvoice): boolean {
  return getInvoiceBalance(invoice) === 0;
}

/**
 * Computes the number of whole days an invoice is past due, relative to
 * `asOfDate`. Returns 0 if the invoice is not yet past due.
 */
export function getDaysPastDue(invoice: ReceivableInvoice, asOfDate: string): number {
  assertValidInvoice(invoice);
  const due = parseIsoDate(invoice.dueDate);
  const asOf = parseIsoDate(asOfDate);
  const diffDays = Math.floor((asOf - due) / MS_PER_DAY);
  return Math.max(0, diffDays);
}

/**
 * Buckets a number of days-past-due into a standard aging category.
 */
export function getAgingBucket(daysPastDue: number): AgingBucket {
  if (daysPastDue <= 0) return 'current';
  if (daysPastDue <= 30) return '1-30';
  if (daysPastDue <= 60) return '31-60';
  if (daysPastDue <= 90) return '61-90';
  return '90+';
}

/**
 * Derives the effective status of an invoice based on its balance and
 * due date, honoring terminal statuses (`void`) as-is.
 */
export function deriveInvoiceStatus(
  invoice: ReceivableInvoice,
  asOfDate: string
): ReceivableStatus {
  assertValidInvoice(invoice);
  if (invoice.status === 'void' || invoice.status === 'draft') {
    return invoice.status;
  }
  const balance = getInvoiceBalance(invoice);
  if (balance === 0) {
    return 'paid';
  }
  const daysPastDue = getDaysPastDue(invoice, asOfDate);
  if (daysPastDue > 0) {
    return 'overdue';
  }
  return invoice.amountPaid > 0 ? 'partially_paid' : 'open';
}

/**
 * Applies a payment to an invoice, returning a new invoice object with the
 * updated `amountPaid` and derived `status`. Overpayments are tracked but
 * not applied beyond the outstanding balance.
 */
export function applyPayment(
  invoice: ReceivableInvoice,
  payment: ReceivablePayment,
  asOfDate: string = payment.paidDate
): ApplyPaymentResult {
  assertValidInvoice(invoice);
  if (payment.invoiceId !== invoice.id) {
    throw new InvalidReceivablePaymentError(
      `Payment invoiceId "${payment.invoiceId}" does not match invoice id "${invoice.id}".`
    );
  }
  if (!Number.isFinite(payment.amount) || payment.amount <= 0) {
    throw new InvalidReceivablePaymentError(
      `Payment amount must be a positive finite number, got ${payment.amount}.`
    );
  }

  const balance = getInvoiceBalance(invoice);
  const appliedAmount = Math.min(balance, payment.amount);
  const overpaymentAmount = payment.amount - appliedAmount;

  const updatedInvoice: ReceivableInvoice = {
    ...invoice,
    amountPaid: invoice.amountPaid + appliedAmount,
  };

  const status = deriveInvoiceStatus(updatedInvoice, asOfDate);

  return {
    invoice: { ...updatedInvoice, status },
    appliedAmount,
    overpaymentAmount,
  };
}

/**
 * Produces an aging report entry for each invoice that still carries an
 * outstanding balance as of `asOfDate`. Settled invoices are excluded.
 */
export function buildAgingReport(
  invoices: readonly ReceivableInvoice[],
  asOfDate: string
): AgedReceivable[] {
  return invoices
    .filter(invoice => invoice.status !== 'void' && !isInvoiceSettled(invoice))
    .map(invoice => {
      const daysPastDue = getDaysPastDue(invoice, asOfDate);
      return {
        invoiceId: invoice.id,
        accountId: invoice.accountId,
        balance: getInvoiceBalance(invoice),
        daysPastDue,
        bucket: getAgingBucket(daysPastDue),
      };
    });
}

/**
 * Summarizes a collection of receivable invoices: totals invoiced, paid,
 * outstanding, and overdue amounts, along with invoice counts.
 */
export function summarizeAccountsReceivable(
  invoices: readonly ReceivableInvoice[],
  asOfDate: string
): AccountsReceivableSummary {
  let totalInvoiced = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;
  let totalOverdue = 0;
  let openInvoiceCount = 0;

  for (const invoice of invoices) {
    if (invoice.status === 'void') {
      continue;
    }
    assertValidInvoice(invoice);
    totalInvoiced += invoice.amount;
    totalPaid += invoice.amountPaid;
    const balance = getInvoiceBalance(invoice);
    totalOutstanding += balance;
    if (balance > 0) {
      openInvoiceCount += 1;
      if (getDaysPastDue(invoice, asOfDate) > 0) {
        totalOverdue += balance;
      }
    }
  }

  return {
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    totalOverdue,
    invoiceCount: invoices.filter(i => i.status !== 'void').length,
    openInvoiceCount,
  };
}

/**
 * Filters invoices belonging to a specific account.
 */
export function getInvoicesForAccount(
  invoices: readonly ReceivableInvoice[],
  accountId: string
): ReceivableInvoice[] {
  return invoices.filter(invoice => invoice.accountId === accountId);
}
