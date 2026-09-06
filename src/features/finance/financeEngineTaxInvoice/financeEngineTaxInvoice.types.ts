/**
 * Types, constants, and pure helper functions for the Finance Engine Tax Invoice
 * feature (parent issue #1928, child issue #2466).
 *
 * This module intentionally stays within its declared child scope: it defines
 * the shape of tax invoices/line items used across the finance engine and a
 * small set of pure, side-effect-free calculation/validation helpers that
 * downstream services (persistence, PDF rendering, GitHub-linked billing
 * flows, etc.) can rely on without duplicating VAT arithmetic.
 */

/** UAE standard VAT rate (5%), expressed as a decimal fraction. */
export const DEFAULT_TAX_RATE = 0.05;

/** Supported ISO 4217 currency codes for tax invoices issued by the finance engine. */
export const SUPPORTED_TAX_INVOICE_CURRENCIES = ['AED', 'USD', 'EUR', 'GBP'] as const;

/** Currency code accepted on a tax invoice. */
export type TaxInvoiceCurrency = (typeof SUPPORTED_TAX_INVOICE_CURRENCIES)[number];

/** Lifecycle states a tax invoice can be in. */
export const TAX_INVOICE_STATUSES = ['draft', 'issued', 'paid', 'overdue', 'void'] as const;

/** Status of a tax invoice. */
export type TaxInvoiceStatus = (typeof TAX_INVOICE_STATUSES)[number];

/** A single billable line item on a tax invoice. */
export interface TaxInvoiceLineItem {
  readonly id: string;
  readonly description: string;
  /** Number of units billed. Must be a positive, finite number. */
  readonly quantity: number;
  /** Price per unit before tax, in the invoice's currency minor-agnostic units. */
  readonly unitPrice: number;
  /** Tax rate applied to this line item, expressed as a decimal fraction (e.g. 0.05 for 5%). */
  readonly taxRate: number;
}

/** Computed monetary breakdown for a single line item. */
export interface TaxInvoiceLineItemTotals {
  readonly netAmount: number;
  readonly taxAmount: number;
  readonly grossAmount: number;
}

/** Party (payer or payee) referenced on a tax invoice. */
export interface TaxInvoiceParty {
  readonly name: string;
  readonly email?: string;
  readonly taxRegistrationNumber?: string;
  readonly address?: string;
}

/** Full tax invoice record managed by the finance engine. */
export interface TaxInvoice {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly status: TaxInvoiceStatus;
  readonly currency: TaxInvoiceCurrency;
  readonly issueDate: string;
  readonly dueDate: string;
  readonly issuer: TaxInvoiceParty;
  readonly recipient: TaxInvoiceParty;
  readonly lineItems: readonly TaxInvoiceLineItem[];
  readonly notes?: string;
}

/** Computed monetary breakdown for a full invoice. */
export interface TaxInvoiceTotals {
  readonly subtotal: number;
  readonly taxTotal: number;
  readonly grandTotal: number;
  readonly lineItemTotals: readonly TaxInvoiceLineItemTotals[];
}

/** Error thrown when a tax invoice or line item fails validation. */
export class TaxInvoiceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaxInvoiceValidationError';
  }
}

/** Rounds a monetary amount to 2 decimal places using standard half-up rounding. */
export function roundToCurrencyPrecision(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/** Type guard for {@link TaxInvoiceStatus}. */
export function isTaxInvoiceStatus(value: unknown): value is TaxInvoiceStatus {
  return typeof value === 'string' && (TAX_INVOICE_STATUSES as readonly string[]).includes(value);
}

/** Type guard for {@link TaxInvoiceCurrency}. */
export function isTaxInvoiceCurrency(value: unknown): value is TaxInvoiceCurrency {
  return (
    typeof value === 'string' &&
    (SUPPORTED_TAX_INVOICE_CURRENCIES as readonly string[]).includes(value)
  );
}

/**
 * Validates a single line item's numeric fields.
 * Throws {@link TaxInvoiceValidationError} on the first violation found.
 */
export function assertValidTaxInvoiceLineItem(lineItem: TaxInvoiceLineItem): void {
  if (!Number.isFinite(lineItem.quantity) || lineItem.quantity <= 0) {
    throw new TaxInvoiceValidationError(
      `Line item "${lineItem.id}" has an invalid quantity: ${lineItem.quantity}`
    );
  }
  if (!Number.isFinite(lineItem.unitPrice) || lineItem.unitPrice < 0) {
    throw new TaxInvoiceValidationError(
      `Line item "${lineItem.id}" has an invalid unit price: ${lineItem.unitPrice}`
    );
  }
  if (!Number.isFinite(lineItem.taxRate) || lineItem.taxRate < 0 || lineItem.taxRate > 1) {
    throw new TaxInvoiceValidationError(
      `Line item "${lineItem.id}" has an invalid tax rate: ${lineItem.taxRate}`
    );
  }
}

/**
 * Computes the net, tax, and gross amounts for a single line item.
 * Throws {@link TaxInvoiceValidationError} when the line item is invalid.
 */
export function calculateTaxInvoiceLineItemTotals(
  lineItem: TaxInvoiceLineItem
): TaxInvoiceLineItemTotals {
  assertValidTaxInvoiceLineItem(lineItem);

  const netAmount = roundToCurrencyPrecision(lineItem.quantity * lineItem.unitPrice);
  const taxAmount = roundToCurrencyPrecision(netAmount * lineItem.taxRate);
  const grossAmount = roundToCurrencyPrecision(netAmount + taxAmount);

  return { netAmount, taxAmount, grossAmount };
}

/**
 * Computes the full monetary breakdown (subtotal, tax total, grand total) for
 * a tax invoice's line items. Returns zeroed totals for an empty invoice.
 */
export function calculateTaxInvoiceTotals(
  lineItems: readonly TaxInvoiceLineItem[]
): TaxInvoiceTotals {
  const lineItemTotals = lineItems.map(calculateTaxInvoiceLineItemTotals);

  const subtotal = roundToCurrencyPrecision(
    lineItemTotals.reduce((sum, item) => sum + item.netAmount, 0)
  );
  const taxTotal = roundToCurrencyPrecision(
    lineItemTotals.reduce((sum, item) => sum + item.taxAmount, 0)
  );
  const grandTotal = roundToCurrencyPrecision(subtotal + taxTotal);

  return { subtotal, taxTotal, grandTotal, lineItemTotals };
}

/**
 * Determines whether an invoice should be considered overdue given a
 * reference date (defaults to now). An invoice already marked `paid` or
 * `void` is never overdue.
 */
export function isTaxInvoiceOverdue(
  invoice: TaxInvoice,
  referenceDate: Date = new Date()
): boolean {
  if (invoice.status === 'paid' || invoice.status === 'void') {
    return false;
  }
  const due = new Date(invoice.dueDate);
  if (Number.isNaN(due.getTime())) {
    throw new TaxInvoiceValidationError(
      `Invoice "${invoice.id}" has an invalid due date: ${invoice.dueDate}`
    );
  }
  return referenceDate.getTime() > due.getTime();
}

/**
 * Derives the effective status of an invoice, promoting `issued` invoices
 * past their due date to `overdue`. Does not mutate the input invoice.
 */
export function deriveTaxInvoiceStatus(
  invoice: TaxInvoice,
  referenceDate: Date = new Date()
): TaxInvoiceStatus {
  if (invoice.status === 'issued' && isTaxInvoiceOverdue(invoice, referenceDate)) {
    return 'overdue';
  }
  return invoice.status;
}
