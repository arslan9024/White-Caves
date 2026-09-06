/**
 * Finance Engine — Recurring Invoice
 *
 * Parent issue: #1948
 * Child issue: #2386
 *
 * Pure, side-effect-free logic for scheduling and generating recurring
 * invoices. No I/O, no GitHub mutation, no database access — this module
 * only computes derived data from inputs it is given.
 */

export type RecurringInvoiceFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export type RecurringInvoiceStatus = 'active' | 'paused' | 'cancelled';

export interface RecurringInvoiceLineItem {
  readonly description: string;
  readonly quantity: number;
  readonly unitAmount: number;
}

export interface RecurringInvoiceSchedule {
  readonly id: string;
  readonly customerId: string;
  readonly frequency: RecurringInvoiceFrequency;
  readonly status: RecurringInvoiceStatus;
  /** ISO 8601 date string (yyyy-mm-dd) marking when the schedule starts. */
  readonly startDate: string;
  /** Optional ISO 8601 date string; no invoices are generated after this date. */
  readonly endDate?: string;
  /** ISO 8601 date string of the last successfully generated invoice, if any. */
  readonly lastGeneratedDate?: string;
  readonly lineItems: readonly RecurringInvoiceLineItem[];
  readonly currency: string;
  readonly taxRatePercent?: number;
}

export interface GeneratedInvoiceDraft {
  readonly scheduleId: string;
  readonly customerId: string;
  readonly issueDate: string;
  readonly dueDate: string;
  readonly currency: string;
  readonly lineItems: readonly RecurringInvoiceLineItem[];
  readonly subtotal: number;
  readonly taxAmount: number;
  readonly total: number;
}

export interface RecurringInvoiceGenerationResult {
  readonly generated: readonly GeneratedInvoiceDraft[];
  readonly skippedScheduleIds: readonly string[];
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const NET_TERMS_DAYS = 14;

/**
 * Parses a strict yyyy-mm-dd ISO date string into a UTC Date. Throws on
 * malformed input so callers fail fast instead of silently misdating
 * invoices.
 */
export function parseIsoDate(isoDate: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`Invalid ISO date string: "${isoDate}"`);
  }
  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date: "${isoDate}"`);
  }
  return date;
}

/** Formats a UTC Date back into a yyyy-mm-dd ISO date string. */
export function formatIsoDate(date: Date): string {
  const year = date.getUTCFullYear().toString().padStart(4, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysUtc(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function addMonthsUtc(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const targetMonth = result.getUTCMonth() + months;
  const targetDay = result.getUTCDate();
  result.setUTCMonth(targetMonth);
  // Guard against month overflow (e.g. Jan 31 + 1 month => Mar 3 instead of Feb 31).
  if (result.getUTCDate() !== targetDay) {
    result.setUTCDate(0);
  }
  return result;
}

/**
 * Computes the next occurrence date for a schedule's frequency, given the
 * previous occurrence date.
 */
export function computeNextOccurrence(
  previousDate: Date,
  frequency: RecurringInvoiceFrequency
): Date {
  switch (frequency) {
    case 'weekly':
      return addDaysUtc(previousDate, 7);
    case 'biweekly':
      return addDaysUtc(previousDate, 14);
    case 'monthly':
      return addMonthsUtc(previousDate, 1);
    case 'quarterly':
      return addMonthsUtc(previousDate, 3);
    case 'yearly':
      return addMonthsUtc(previousDate, 12);
    default: {
      const exhaustiveCheck: never = frequency;
      throw new Error(`Unsupported frequency: ${String(exhaustiveCheck)}`);
    }
  }
}

/**
 * Determines the next date on or after which an invoice for the given
 * schedule should be generated, based on its start date and last
 * generation date (if any).
 */
export function computeNextDueDate(schedule: RecurringInvoiceSchedule): Date {
  const startDate = parseIsoDate(schedule.startDate);
  if (!schedule.lastGeneratedDate) {
    return startDate;
  }
  const lastGenerated = parseIsoDate(schedule.lastGeneratedDate);
  return computeNextOccurrence(lastGenerated, schedule.frequency);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Computes subtotal, tax, and total amounts for a set of line items. */
export function calculateInvoiceTotals(
  lineItems: readonly RecurringInvoiceLineItem[],
  taxRatePercent = 0
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = roundCurrency(
    lineItems.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0)
  );
  const taxAmount = roundCurrency(subtotal * (taxRatePercent / 100));
  const total = roundCurrency(subtotal + taxAmount);
  return { subtotal, taxAmount, total };
}

/**
 * Builds a single invoice draft for a schedule at a given issue date.
 * Pure function: performs no I/O and does not mutate the schedule.
 */
export function buildInvoiceDraft(
  schedule: RecurringInvoiceSchedule,
  issueDate: Date
): GeneratedInvoiceDraft {
  const { subtotal, taxAmount, total } = calculateInvoiceTotals(
    schedule.lineItems,
    schedule.taxRatePercent ?? 0
  );
  const dueDate = addDaysUtc(issueDate, NET_TERMS_DAYS);
  return {
    scheduleId: schedule.id,
    customerId: schedule.customerId,
    issueDate: formatIsoDate(issueDate),
    dueDate: formatIsoDate(dueDate),
    currency: schedule.currency,
    lineItems: schedule.lineItems,
    subtotal,
    taxAmount,
    total,
  };
}

/**
 * Returns true when a schedule is eligible to have an invoice generated
 * as of `asOfDate` (inclusive), considering status and end date.
 */
export function isScheduleDueForGeneration(
  schedule: RecurringInvoiceSchedule,
  asOfDate: Date
): boolean {
  if (schedule.status !== 'active') {
    return false;
  }
  const nextDue = computeNextDueDate(schedule);
  if (nextDue.getTime() > asOfDate.getTime()) {
    return false;
  }
  if (schedule.endDate) {
    const endDate = parseIsoDate(schedule.endDate);
    if (nextDue.getTime() > endDate.getTime()) {
      return false;
    }
  }
  if (schedule.lineItems.length === 0) {
    return false;
  }
  return true;
}

/**
 * Generates invoice drafts for every schedule that is due as of `asOfDate`.
 * Schedules that are paused, cancelled, past their end date, not yet due,
 * or have no line items are reported in `skippedScheduleIds` instead.
 */
export function generateDueInvoices(
  schedules: readonly RecurringInvoiceSchedule[],
  asOfDate: Date = new Date()
): RecurringInvoiceGenerationResult {
  const generated: GeneratedInvoiceDraft[] = [];
  const skippedScheduleIds: string[] = [];

  for (const schedule of schedules) {
    if (!isScheduleDueForGeneration(schedule, asOfDate)) {
      skippedScheduleIds.push(schedule.id);
      continue;
    }
    const nextDue = computeNextDueDate(schedule);
    generated.push(buildInvoiceDraft(schedule, nextDue));
  }

  return { generated, skippedScheduleIds };
}
