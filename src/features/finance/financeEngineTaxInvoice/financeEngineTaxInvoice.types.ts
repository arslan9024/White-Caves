/**
 * Types and pure helpers for the Finance Engine Tax Invoice domain.
 *
 * Scope (child of parent issue #1928, tracked under #2466):
 * - Define the shape of a tax invoice and its line items.
 * - Provide small, dependency-free pure functions to compute totals and
 *   validate/construct invoices, so behavior can be exercised in tests
 *   without pulling in any external service, database, or network code.
 *
 * This module intentionally has zero side effects and zero external
 * dependencies so it can be safely imported anywhere in the finance
 * feature without risk of circular imports or runtime coupling.
 */

/** Lifecycle states a tax invoice can be in. */
export type TaxInvoiceStatus = 'draft' | 'issued' | 'paid' | 'void' | 'overdue';

/** All valid tax invoice statuses, used for validation and iteration. */
export const TAX_INVOICE_STATUSES: readonly TaxInvoiceStatus[] = [
  'draft',
  'issued',
  'paid',
  'void',
  'overdue',
];

/** ISO 4217 currency code, e.g. 'AED', 'USD'. */
export type CurrencyCode = string;

/**
 * A single billable line on a tax invoice.
 *
 * `taxRatePercent` is expressed as a percentage value (e.g. `5` for 5% VAT),
 * not a fraction, to avoid floating point ambiguity in stored/serialized data.
 */
export interface TaxInvoiceLineItem {
  /** Unique identifier for the line item within its parent invoice. */
  readonly id: string;
  /** Human readable description of the billed item or service. */
  readonly description: string;
  /** Number of units billed. Must be a positive, finite number. */
  readonly quantity: number;
  /** Price per unit, in the invoice's currency minor-agnostic decimal form. */
  readonly unitPrice: number;
  /** Tax rate applied to this line item, as a percentage (0-100). */
  readonly taxRatePercent: number;
}

/** Computed monetary breakdown for a single line item. */
export interface TaxInvoiceLineItemTotals {
  readonly lineItemId: string;
  /** quantity * unitPrice, before tax. */
  readonly netAmount: number;
  /** Tax portion computed from netAmount and taxRatePercent. */
  readonly taxAmount: number;
  /** netAmount + taxAmount. */
  readonly grossAmount: number;
}

/** Computed monetary breakdown for an entire invoice. */
export interface TaxInvoiceTotals {
  readonly subtotal: number;
  readonly taxTotal: number;
  readonly grandTotal: number;
  readonly lineItemTotals: readonly TaxInvoiceLineItemTotals[];
}

/**
 * A tax invoice raised against a customer/property within the finance
 * engine. This is the canonical shape persisted and exchanged across the
 * finance feature's tax invoice workflows.
 */
export interface TaxInvoice {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly status: TaxInvoiceStatus;
  readonly currency: CurrencyCode;
  /** ISO 8601 date string, e.g. '2026-01-31'. */
  readonly issueDate: string;
  /** ISO 8601 date string, e.g. '2026-02-28'. */
  readonly dueDate: string;
  readonly customerId: string;
  /** Optional related property reference, when the invoice is tied to a unit. */
  readonly propertyId?: string;
  readonly lineItems: readonly TaxInvoiceLineItem[];
  readonly notes?: string;
}

/** Input required to construct a new draft tax invoice via {@link createDraftTaxInvoice}. */
export interface CreateDraftTaxInvoiceInput {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly currency: CurrencyCode;
  readonly issueDate: string;
  readonly dueDate: string;
  readonly customerId: string;
  readonly propertyId?: string;
  readonly lineItems: readonly TaxInvoiceLineItem[];
  readonly notes?: string;
}

/** Error thrown when tax invoice data fails validation. */
export class TaxInvoiceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaxInvoiceValidationError';
  }
}

/** Type guard for {@link TaxInvoiceStatus}. */
export function isTaxInvoiceStatus(value: unknown): value is TaxInvoiceStatus {
  return typeof value === 'string' && (TAX_INVOICE_STATUSES as readonly string[]).includes(value);
}

/**
 * Validates a single line item's numeric invariants.
 * Throws {@link TaxInvoiceValidationError} on the first violation found.
 */
export function assertValidLineItem(lineItem: TaxInvoiceLineItem): void {
  if (!lineItem.id || lineItem.id.trim().length === 0) {
    throw new TaxInvoiceValidationError('Line item id must be a non-empty string.');
  }
  if (!lineItem.description || lineItem.description.trim().length === 0) {
    throw new TaxInvoiceValidationError(
      `Line item ${lineItem.id} must have a non-empty description.`
    );
  }
  if (!Number.isFinite(lineItem.quantity) || lineItem.quantity <= 0) {
    throw new TaxInvoiceValidationError(
      `Line item ${lineItem.id} quantity must be a positive finite number.`
    );
  }
  if (!Number.isFinite(lineItem.unitPrice) || lineItem.unitPrice < 0) {
    throw new TaxInvoiceValidationError(
      `Line item ${lineItem.id} unitPrice must be a non-negative finite number.`
    );
  }
  if (
    !Number.isFinite(lineItem.taxRatePercent) ||
    lineItem.taxRatePercent < 0 ||
    lineItem.taxRatePercent > 100
  ) {
    throw new TaxInvoiceValidationError(
      `Line item ${lineItem.id} taxRatePercent must be between 0 and 100.`
    );
  }
}

/** Rounds a monetary value to 2 decimal places using standard half-up rounding. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Computes the net/tax/gross breakdown for a single line item. */
export function calculateLineItemTotals(lineItem: TaxInvoiceLineItem): TaxInvoiceLineItemTotals {
  assertValidLineItem(lineItem);
  const netAmount = roundMoney(lineItem.quantity * lineItem.unitPrice);
  const taxAmount = roundMoney(netAmount * (lineItem.taxRatePercent / 100));
  const grossAmount = roundMoney(netAmount + taxAmount);
  return {
    lineItemId: lineItem.id,
    netAmount,
    taxAmount,
    grossAmount,
  };
}

/**
 * Computes the full monetary breakdown for an invoice's line items.
 * Returns zeroed totals for an empty line item list.
 */
export function calculateTaxInvoiceTotals(
  lineItems: readonly TaxInvoiceLineItem[]
): TaxInvoiceTotals {
  const lineItemTotals = lineItems.map(calculateLineItemTotals);
  const subtotal = roundMoney(lineItemTotals.reduce((sum, item) => sum + item.netAmount, 0));
  const taxTotal = roundMoney(lineItemTotals.reduce((sum, item) => sum + item.taxAmount, 0));
  const grandTotal = roundMoney(subtotal + taxTotal);
  return { subtotal, taxTotal, grandTotal, lineItemTotals };
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertValidIsoDate(value: string, fieldName: string): void {
  if (!ISO_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    throw new TaxInvoiceValidationError(
      `${fieldName} must be a valid ISO 8601 date string (YYYY-MM-DD).`
    );
  }
}

/**
 * Constructs a new tax invoice in `draft` status from validated input.
 * Throws {@link TaxInvoiceValidationError} if any field is invalid, including
 * an empty `lineItems` array, malformed dates, or a due date before the
 * issue date.
 */
export function createDraftTaxInvoice(input: CreateDraftTaxInvoiceInput): TaxInvoice {
  if (!input.id || input.id.trim().length === 0) {
    throw new TaxInvoiceValidationError('Invoice id must be a non-empty string.');
  }
  if (!input.invoiceNumber || input.invoiceNumber.trim().length === 0) {
    throw new TaxInvoiceValidationError('Invoice invoiceNumber must be a non-empty string.');
  }
  if (!input.currency || input.currency.trim().length === 0) {
    throw new TaxInvoiceValidationError('Invoice currency must be a non-empty string.');
  }
  if (!input.customerId || input.customerId.trim().length === 0) {
    throw new TaxInvoiceValidationError('Invoice customerId must be a non-empty string.');
  }
  if (input.lineItems.length === 0) {
    throw new TaxInvoiceValidationError('Invoice must contain at least one line item.');
  }

  assertValidIsoDate(input.issueDate, 'issueDate');
  assertValidIsoDate(input.dueDate, 'dueDate');
  if (Date.parse(input.dueDate) < Date.parse(input.issueDate)) {
    throw new TaxInvoiceValidationError('dueDate cannot be earlier than issueDate.');
  }

  input.lineItems.forEach(assertValidLineItem);

  return {
    id: input.id,
    invoiceNumber: input.invoiceNumber,
    status: 'draft',
    currency: input.currency,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    customerId: input.customerId,
    propertyId: input.propertyId,
    lineItems: input.lineItems,
    notes: input.notes,
  };
}

/**
 * Returns the set of statuses a tax invoice may transition to from its
 * current status. Terminal states (`paid`, `void`) have no valid
 * transitions out.
 */
export function getAllowedTaxInvoiceStatusTransitions(
  current: TaxInvoiceStatus
): readonly TaxInvoiceStatus[] {
  switch (current) {
    case 'draft':
      return ['issued', 'void'];
    case 'issued':
      return ['paid', 'overdue', 'void'];
    case 'overdue':
      return ['paid', 'void'];
    case 'paid':
      return [];
    case 'void':
      return [];
    default:
      return [];
  }
}

/** Whether transitioning a tax invoice from `from` to `to` is permitted. */
export function canTransitionTaxInvoiceStatus(
  from: TaxInvoiceStatus,
  to: TaxInvoiceStatus
): boolean {
  return getAllowedTaxInvoiceStatusTransitions(from).includes(to);
}

/**
 * Returns a copy of the invoice with its status transitioned, or throws
 * {@link TaxInvoiceValidationError} if the transition is not permitted.
 */
export function transitionTaxInvoiceStatus(
  invoice: TaxInvoice,
  nextStatus: TaxInvoiceStatus
): TaxInvoice {
  if (!canTransitionTaxInvoiceStatus(invoice.status, nextStatus)) {
    throw new TaxInvoiceValidationError(
      `Cannot transition tax invoice ${invoice.id} from '${invoice.status}' to '${nextStatus}'.`
    );
  }
  return { ...invoice, status: nextStatus };
}
