/**
 * financeEngineRecurringInvoice.types.ts
 *
 * Domain types and pure helper functions for the Recurring Invoice engine
 * (Finance module). Scope is limited to type definitions, type guards, and
 * side-effect-free validation/scheduling helpers used by the recurring
 * invoice generation pipeline.
 *
 * Parent issue: #1948
 * Child issue: #2385
 */

/** Supported recurrence frequencies for a recurring invoice schedule. */
export type RecurringInvoiceFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

/** Lifecycle status of a recurring invoice template. */
export type RecurringInvoiceStatus = 'active' | 'paused' | 'completed' | 'cancelled';

/** ISO-4217 currency code, e.g. "USD", "AED". */
export type CurrencyCode = string;

/** A single billable line item on a recurring invoice template. */
export interface RecurringInvoiceLineItem {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitAmount: number;
  readonly taxRatePercent: number;
}

/** Configuration describing how/when a recurring invoice is generated. */
export interface RecurringInvoiceSchedule {
  readonly frequency: RecurringInvoiceFrequency;
  /** ISO-8601 date string (YYYY-MM-DD) for the first invoice occurrence. */
  readonly startDate: string;
  /** ISO-8601 date string (YYYY-MM-DD); when omitted the schedule has no end. */
  readonly endDate?: string;
  /** Maximum number of occurrences to generate; undefined means unlimited. */
  readonly maxOccurrences?: number;
}

/** Core entity representing a recurring invoice template. */
export interface RecurringInvoiceTemplate {
  readonly id: string;
  readonly customerId: string;
  readonly currency: CurrencyCode;
  readonly status: RecurringInvoiceStatus;
  readonly schedule: RecurringInvoiceSchedule;
  readonly lineItems: readonly RecurringInvoiceLineItem[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Result of validating a recurring invoice template. */
export interface RecurringInvoiceValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

const VALID_FREQUENCIES: readonly RecurringInvoiceFrequency[] = [
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
  'yearly',
];

const VALID_STATUSES: readonly RecurringInvoiceStatus[] = [
  'active',
  'paused',
  'completed',
  'cancelled',
];

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Type guard for {@link RecurringInvoiceFrequency}. */
export function isRecurringInvoiceFrequency(value: unknown): value is RecurringInvoiceFrequency {
  return typeof value === 'string' && (VALID_FREQUENCIES as readonly string[]).includes(value);
}

/** Type guard for {@link RecurringInvoiceStatus}. */
export function isRecurringInvoiceStatus(value: unknown): value is RecurringInvoiceStatus {
  return typeof value === 'string' && (VALID_STATUSES as readonly string[]).includes(value);
}

/** Returns true when the given string is a well-formed ISO-8601 date (YYYY-MM-DD). */
export function isIsoDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

/** Computes the pre-tax subtotal for a single line item (quantity * unitAmount). */
export function calculateLineItemSubtotal(item: RecurringInvoiceLineItem): number {
  return roundToCents(item.quantity * item.unitAmount);
}

/** Computes the tax amount owed for a single line item. */
export function calculateLineItemTax(item: RecurringInvoiceLineItem): number {
  const subtotal = calculateLineItemSubtotal(item);
  return roundToCents(subtotal * (item.taxRatePercent / 100));
}

/** Computes the subtotal, tax, and total for an entire recurring invoice template. */
export function calculateRecurringInvoiceTotals(
  template: Pick<RecurringInvoiceTemplate, 'lineItems'>
): { readonly subtotal: number; readonly tax: number; readonly total: number } {
  const subtotal = roundToCents(
    template.lineItems.reduce((sum, item) => sum + calculateLineItemSubtotal(item), 0)
  );
  const tax = roundToCents(
    template.lineItems.reduce((sum, item) => sum + calculateLineItemTax(item), 0)
  );
  return { subtotal, tax, total: roundToCents(subtotal + tax) };
}

/** Rounds a monetary value to two decimal places (cents), avoiding float drift. */
export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Validates a recurring invoice template's structural and business invariants.
 * Returns a list of human-readable error messages; an empty list means valid.
 */
export function validateRecurringInvoiceTemplate(
  template: RecurringInvoiceTemplate
): RecurringInvoiceValidationResult {
  const errors: string[] = [];

  if (!template.id || template.id.trim().length === 0) {
    errors.push('id is required');
  }
  if (!template.customerId || template.customerId.trim().length === 0) {
    errors.push('customerId is required');
  }
  if (!template.currency || template.currency.trim().length !== 3) {
    errors.push('currency must be a 3-letter ISO-4217 code');
  }
  if (!isRecurringInvoiceStatus(template.status)) {
    errors.push('status must be one of active, paused, completed, cancelled');
  }
  if (!isRecurringInvoiceFrequency(template.schedule?.frequency)) {
    errors.push('schedule.frequency is invalid');
  }
  if (!isIsoDateString(template.schedule?.startDate)) {
    errors.push('schedule.startDate must be a valid ISO-8601 date');
  }
  if (template.schedule?.endDate !== undefined && !isIsoDateString(template.schedule.endDate)) {
    errors.push('schedule.endDate must be a valid ISO-8601 date when provided');
  }
  if (
    template.schedule?.endDate !== undefined &&
    isIsoDateString(template.schedule.startDate) &&
    isIsoDateString(template.schedule.endDate) &&
    template.schedule.endDate < template.schedule.startDate
  ) {
    errors.push('schedule.endDate must not be before schedule.startDate');
  }
  if (
    template.schedule?.maxOccurrences !== undefined &&
    (!Number.isInteger(template.schedule.maxOccurrences) || template.schedule.maxOccurrences <= 0)
  ) {
    errors.push('schedule.maxOccurrences must be a positive integer when provided');
  }
  if (!Array.isArray(template.lineItems) || template.lineItems.length === 0) {
    errors.push('lineItems must contain at least one item');
  } else {
    template.lineItems.forEach((item, index) => {
      if (!item.description || item.description.trim().length === 0) {
        errors.push(`lineItems[${index}].description is required`);
      }
      if (!(item.quantity > 0)) {
        errors.push(`lineItems[${index}].quantity must be greater than 0`);
      }
      if (!(item.unitAmount >= 0)) {
        errors.push(`lineItems[${index}].unitAmount must be greater than or equal to 0`);
      }
      if (item.taxRatePercent < 0 || item.taxRatePercent > 100) {
        errors.push(`lineItems[${index}].taxRatePercent must be between 0 and 100`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

const FREQUENCY_DAY_INCREMENT: Record<RecurringInvoiceFrequency, number | null> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: null,
  quarterly: null,
  yearly: null,
};

/**
 * Computes the next occurrence date (ISO-8601, YYYY-MM-DD) for a recurring
 * invoice schedule given the previous occurrence date. Month-based
 * frequencies (monthly/quarterly/yearly) advance by calendar months to
 * correctly account for varying month lengths.
 */
export function computeNextOccurrenceDate(
  frequency: RecurringInvoiceFrequency,
  previousOccurrenceIsoDate: string
): string {
  if (!isIsoDateString(previousOccurrenceIsoDate)) {
    throw new Error('previousOccurrenceIsoDate must be a valid ISO-8601 date');
  }

  const date = new Date(`${previousOccurrenceIsoDate}T00:00:00.000Z`);
  const dayIncrement = FREQUENCY_DAY_INCREMENT[frequency];

  if (dayIncrement !== null) {
    date.setUTCDate(date.getUTCDate() + dayIncrement);
  } else {
    const monthIncrement = frequency === 'monthly' ? 1 : frequency === 'quarterly' ? 3 : 12;
    date.setUTCMonth(date.getUTCMonth() + monthIncrement);
  }

  return date.toISOString().slice(0, 10);
}
