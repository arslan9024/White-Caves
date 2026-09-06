/**
 * financeEngineTaxInvoice.logic.ts
 *
 * Core logic for the Finance Engine's Tax Invoice sub-module.
 * Responsible for computing tax invoice line items, aggregating totals,
 * validating invoice inputs, and generating a deterministic invoice number.
 *
 * This module has no I/O side effects (no filesystem, no network, no
 * database access). It only performs deterministic calculations over data
 * supplied by the caller.
 *
 * Parent issue: #1928
 * Child issue: #2467
 */

/** A single line item on a tax invoice, prior to tax computation. */
export interface TaxInvoiceLineItemInput {
  /** Human readable description of the line item. */
  description: string;
  /** Quantity of units for this line item. Must be a positive number. */
  quantity: number;
  /** Unit price in the invoice's currency minor-agnostic decimal form. */
  unitPrice: number;
  /** Tax rate expressed as a decimal fraction (e.g. 0.05 for 5%). */
  taxRate: number;
}

/** A computed line item, including derived subtotal, tax, and total. */
export interface TaxInvoiceLineItemResult extends TaxInvoiceLineItemInput {
  /** quantity * unitPrice, rounded to 2 decimal places. */
  subtotal: number;
  /** subtotal * taxRate, rounded to 2 decimal places. */
  taxAmount: number;
  /** subtotal + taxAmount, rounded to 2 decimal places. */
  total: number;
}

/** Input required to compute a full tax invoice. */
export interface TaxInvoiceInput {
  /** Unique identifier for the customer/tenant being invoiced. */
  customerId: string;
  /** ISO 8601 date string representing the invoice issue date. */
  issueDate: string;
  /** Line items to include on the invoice. Must contain at least one item. */
  lineItems: TaxInvoiceLineItemInput[];
  /** Optional currency code (ISO 4217). Defaults to 'AED' if omitted. */
  currency?: string;
}

/** Aggregated computation result for a tax invoice. */
export interface TaxInvoiceResult {
  /** Deterministically generated invoice number. */
  invoiceNumber: string;
  customerId: string;
  issueDate: string;
  currency: string;
  lineItems: TaxInvoiceLineItemResult[];
  /** Sum of all line item subtotals, rounded to 2 decimal places. */
  subtotal: number;
  /** Sum of all line item tax amounts, rounded to 2 decimal places. */
  totalTax: number;
  /** subtotal + totalTax, rounded to 2 decimal places. */
  grandTotal: number;
}

/** Error thrown when tax invoice input fails validation. */
export class TaxInvoiceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaxInvoiceValidationError';
  }
}

const DEFAULT_CURRENCY = 'AED';

/**
 * Rounds a number to 2 decimal places using standard half-up rounding,
 * guarding against floating point artifacts (e.g. 1.005 -> 1.01 rather than 1.00).
 */
export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Validates a single line item input. Throws TaxInvoiceValidationError on
 * any invalid field.
 */
export function validateLineItem(item: TaxInvoiceLineItemInput, index: number): void {
  if (!item.description || item.description.trim().length === 0) {
    throw new TaxInvoiceValidationError(`Line item at index ${index} is missing a description.`);
  }
  if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
    throw new TaxInvoiceValidationError(
      `Line item at index ${index} must have a positive finite quantity.`
    );
  }
  if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
    throw new TaxInvoiceValidationError(
      `Line item at index ${index} must have a non-negative finite unit price.`
    );
  }
  if (!Number.isFinite(item.taxRate) || item.taxRate < 0 || item.taxRate > 1) {
    throw new TaxInvoiceValidationError(
      `Line item at index ${index} must have a tax rate between 0 and 1.`
    );
  }
}

/**
 * Validates the top-level tax invoice input. Throws TaxInvoiceValidationError
 * on any invalid field, including delegating to validateLineItem for each item.
 */
export function validateTaxInvoiceInput(input: TaxInvoiceInput): void {
  if (!input.customerId || input.customerId.trim().length === 0) {
    throw new TaxInvoiceValidationError('customerId is required.');
  }
  if (!input.issueDate || Number.isNaN(Date.parse(input.issueDate))) {
    throw new TaxInvoiceValidationError('issueDate must be a valid ISO 8601 date string.');
  }
  if (!Array.isArray(input.lineItems) || input.lineItems.length === 0) {
    throw new TaxInvoiceValidationError('At least one line item is required.');
  }
  input.lineItems.forEach((item, index) => validateLineItem(item, index));
}

/**
 * Computes derived subtotal/taxAmount/total fields for a single line item.
 */
export function computeLineItem(item: TaxInvoiceLineItemInput): TaxInvoiceLineItemResult {
  const subtotal = roundCurrency(item.quantity * item.unitPrice);
  const taxAmount = roundCurrency(subtotal * item.taxRate);
  const total = roundCurrency(subtotal + taxAmount);
  return { ...item, subtotal, taxAmount, total };
}

/**
 * Generates a deterministic invoice number from customerId and issueDate.
 * Format: INV-<YYYYMMDD>-<sanitizedCustomerId>
 */
export function generateInvoiceNumber(customerId: string, issueDate: string): string {
  const date = new Date(issueDate);
  const yyyy = date.getUTCFullYear().toString().padStart(4, '0');
  const mm = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const dd = date.getUTCDate().toString().padStart(2, '0');
  const sanitizedCustomerId = customerId
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return `INV-${yyyy}${mm}${dd}-${sanitizedCustomerId}`;
}

/**
 * Computes a full tax invoice: validates input, computes per-line-item
 * tax breakdowns, aggregates totals, and generates an invoice number.
 *
 * @throws TaxInvoiceValidationError if input fails validation.
 */
export function computeTaxInvoice(input: TaxInvoiceInput): TaxInvoiceResult {
  validateTaxInvoiceInput(input);

  const currency = input.currency ?? DEFAULT_CURRENCY;
  const lineItems = input.lineItems.map(computeLineItem);

  const subtotal = roundCurrency(lineItems.reduce((sum, item) => sum + item.subtotal, 0));
  const totalTax = roundCurrency(lineItems.reduce((sum, item) => sum + item.taxAmount, 0));
  const grandTotal = roundCurrency(subtotal + totalTax);

  return {
    invoiceNumber: generateInvoiceNumber(input.customerId, input.issueDate),
    customerId: input.customerId,
    issueDate: input.issueDate,
    currency,
    lineItems,
    subtotal,
    totalTax,
    grandTotal,
  };
}
