/**
 * Type definitions for the Finance Engine – Accounts Receivable module.
 *
 * This module models outstanding receivable invoices raised against tenants,
 * landlords, or other counterparties, their payment schedules, and the
 * aggregate ledger summaries derived from them.
 *
 * Scope: type-only definitions and pure helper guards/utilities used to
 * validate and derive values from those types. No I/O, no side effects.
 */

/** ISO-8601 date string, e.g. "2026-09-06" or "2026-09-06T21:42:31.000Z". */
export type IsoDateString = string;

/** Three-letter currency code, e.g. "AED", "USD". */
export type CurrencyCode = string;

/** Lifecycle status of a single accounts-receivable invoice. */
export type ReceivableInvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'written_off'
  | 'cancelled';

/** Status of an individual payment applied against a receivable invoice. */
export type ReceivablePaymentStatus = 'pending' | 'cleared' | 'failed' | 'reversed';

/** The type of counterparty a receivable invoice is raised against. */
export type ReceivableCounterpartyType = 'tenant' | 'landlord' | 'agent' | 'other';

/** A monetary amount paired with the currency it is denominated in. */
export interface MonetaryAmount {
  readonly amount: number;
  readonly currency: CurrencyCode;
}

/** A single line item on a receivable invoice. */
export interface ReceivableLineItem {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitAmount: MonetaryAmount;
  /** Pre-computed line total (quantity * unitAmount.amount), same currency as unitAmount. */
  readonly total: MonetaryAmount;
}

/** A payment recorded against a receivable invoice. */
export interface ReceivablePayment {
  readonly id: string;
  readonly invoiceId: string;
  readonly amount: MonetaryAmount;
  readonly status: ReceivablePaymentStatus;
  readonly receivedAt: IsoDateString;
  readonly method?: string;
  readonly reference?: string;
}

/** The counterparty (payer) associated with a receivable invoice. */
export interface ReceivableCounterparty {
  readonly id: string;
  readonly type: ReceivableCounterpartyType;
  readonly displayName: string;
  readonly email?: string;
}

/** A single accounts-receivable invoice tracked by the finance engine. */
export interface ReceivableInvoice {
  readonly id: string;
  readonly counterparty: ReceivableCounterparty;
  readonly lineItems: readonly ReceivableLineItem[];
  readonly issuedAt: IsoDateString;
  readonly dueAt: IsoDateString;
  readonly status: ReceivableInvoiceStatus;
  readonly subtotal: MonetaryAmount;
  readonly taxTotal: MonetaryAmount;
  readonly grandTotal: MonetaryAmount;
  readonly payments: readonly ReceivablePayment[];
  readonly notes?: string;
}

/** Aggregate summary of the accounts-receivable ledger for a given period or scope. */
export interface AccountsReceivableSummary {
  readonly currency: CurrencyCode;
  readonly totalInvoiced: number;
  readonly totalCollected: number;
  readonly totalOutstanding: number;
  readonly overdueCount: number;
  readonly invoiceCount: number;
  readonly asOf: IsoDateString;
}

/** Buckets of outstanding balances grouped by age, used for aging reports. */
export interface ReceivableAgingBucket {
  readonly label: '0-30' | '31-60' | '61-90' | '90+';
  readonly minDays: number;
  readonly maxDays: number | null;
  readonly totalOutstanding: number;
  readonly invoiceCount: number;
}

/** Result of computing the aging report for a set of receivable invoices. */
export interface AccountsReceivableAgingReport {
  readonly currency: CurrencyCode;
  readonly asOf: IsoDateString;
  readonly buckets: readonly ReceivableAgingBucket[];
}

/** Set of statuses considered "open" (not fully resolved) for a receivable invoice. */
export const OPEN_RECEIVABLE_INVOICE_STATUSES: readonly ReceivableInvoiceStatus[] = [
  'draft',
  'issued',
  'partially_paid',
  'overdue',
];

/** Set of statuses considered terminal/closed for a receivable invoice. */
export const CLOSED_RECEIVABLE_INVOICE_STATUSES: readonly ReceivableInvoiceStatus[] = [
  'paid',
  'written_off',
  'cancelled',
];

const RECEIVABLE_INVOICE_STATUSES: readonly ReceivableInvoiceStatus[] = [
  ...OPEN_RECEIVABLE_INVOICE_STATUSES,
  ...CLOSED_RECEIVABLE_INVOICE_STATUSES,
];

const RECEIVABLE_PAYMENT_STATUSES: readonly ReceivablePaymentStatus[] = [
  'pending',
  'cleared',
  'failed',
  'reversed',
];

const RECEIVABLE_COUNTERPARTY_TYPES: readonly ReceivableCounterpartyType[] = [
  'tenant',
  'landlord',
  'agent',
  'other',
];

/** Type guard confirming a string is a known {@link ReceivableInvoiceStatus}. */
export function isReceivableInvoiceStatus(value: unknown): value is ReceivableInvoiceStatus {
  return (
    typeof value === 'string' && (RECEIVABLE_INVOICE_STATUSES as readonly string[]).includes(value)
  );
}

/** Type guard confirming a string is a known {@link ReceivablePaymentStatus}. */
export function isReceivablePaymentStatus(value: unknown): value is ReceivablePaymentStatus {
  return (
    typeof value === 'string' && (RECEIVABLE_PAYMENT_STATUSES as readonly string[]).includes(value)
  );
}

/** Type guard confirming a string is a known {@link ReceivableCounterpartyType}. */
export function isReceivableCounterpartyType(value: unknown): value is ReceivableCounterpartyType {
  return (
    typeof value === 'string' &&
    (RECEIVABLE_COUNTERPARTY_TYPES as readonly string[]).includes(value)
  );
}

/** Returns true when the invoice's status is one of the "open" (unresolved) statuses. */
export function isOpenReceivableInvoice(invoice: ReceivableInvoice): boolean {
  return OPEN_RECEIVABLE_INVOICE_STATUSES.includes(invoice.status);
}

/** Returns true when the invoice's status is terminal/closed. */
export function isClosedReceivableInvoice(invoice: ReceivableInvoice): boolean {
  return CLOSED_RECEIVABLE_INVOICE_STATUSES.includes(invoice.status);
}

/**
 * Sums the cleared payments recorded against an invoice. Only payments with
 * status `cleared` count toward the collected total; `pending`, `failed`,
 * and `reversed` payments are excluded.
 */
export function sumClearedPayments(invoice: ReceivableInvoice): number {
  return invoice.payments
    .filter(payment => payment.status === 'cleared')
    .reduce((total, payment) => total + payment.amount.amount, 0);
}

/**
 * Computes the outstanding balance on an invoice: grand total minus the sum
 * of cleared payments. Never returns a value below zero.
 */
export function computeOutstandingBalance(invoice: ReceivableInvoice): number {
  const outstanding = invoice.grandTotal.amount - sumClearedPayments(invoice);
  return outstanding > 0 ? outstanding : 0;
}

/**
 * Builds an {@link AccountsReceivableSummary} from a list of receivable
 * invoices, all of which are assumed to share the given currency.
 */
export function summarizeReceivables(
  invoices: readonly ReceivableInvoice[],
  currency: CurrencyCode,
  asOf: IsoDateString
): AccountsReceivableSummary {
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.grandTotal.amount, 0);
  const totalCollected = invoices.reduce((sum, invoice) => sum + sumClearedPayments(invoice), 0);
  const totalOutstanding = invoices.reduce(
    (sum, invoice) => sum + computeOutstandingBalance(invoice),
    0
  );
  const overdueCount = invoices.filter(invoice => invoice.status === 'overdue').length;

  return {
    currency,
    totalInvoiced,
    totalCollected,
    totalOutstanding,
    overdueCount,
    invoiceCount: invoices.length,
    asOf,
  };
}
