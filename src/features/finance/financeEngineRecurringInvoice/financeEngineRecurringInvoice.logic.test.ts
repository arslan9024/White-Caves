import { describe, expect, it } from 'vitest';
import {
  buildInvoiceDraft,
  calculateInvoiceTotals,
  computeNextDueDate,
  computeNextOccurrence,
  formatIsoDate,
  generateDueInvoices,
  isScheduleDueForGeneration,
  parseIsoDate,
  type RecurringInvoiceSchedule,
} from './financeEngineRecurringInvoice.logic';

function makeSchedule(overrides: Partial<RecurringInvoiceSchedule> = {}): RecurringInvoiceSchedule {
  return {
    id: 'sched-1',
    customerId: 'cust-1',
    frequency: 'monthly',
    status: 'active',
    startDate: '2024-01-01',
    lineItems: [{ description: 'Service fee', quantity: 1, unitAmount: 100 }],
    currency: 'USD',
    ...overrides,
  };
}

describe('parseIsoDate / formatIsoDate', () => {
  it('round-trips a valid ISO date', () => {
    const date = parseIsoDate('2024-03-15');
    expect(formatIsoDate(date)).toBe('2024-03-15');
  });

  it('throws on malformed date strings', () => {
    expect(() => parseIsoDate('2024/03/15')).toThrow();
    expect(() => parseIsoDate('not-a-date')).toThrow();
  });

  it('throws on invalid calendar dates', () => {
    expect(() => parseIsoDate('2024-02-30')).toThrow();
    expect(() => parseIsoDate('2024-13-01')).toThrow();
  });
});

describe('computeNextOccurrence', () => {
  it('adds 7 days for weekly frequency', () => {
    const next = computeNextOccurrence(parseIsoDate('2024-01-01'), 'weekly');
    expect(formatIsoDate(next)).toBe('2024-01-08');
  });

  it('adds 14 days for biweekly frequency', () => {
    const next = computeNextOccurrence(parseIsoDate('2024-01-01'), 'biweekly');
    expect(formatIsoDate(next)).toBe('2024-01-15');
  });

  it('adds 1 month for monthly frequency', () => {
    const next = computeNextOccurrence(parseIsoDate('2024-01-15'), 'monthly');
    expect(formatIsoDate(next)).toBe('2024-02-15');
  });

  it('adds 3 months for quarterly frequency', () => {
    const next = computeNextOccurrence(parseIsoDate('2024-01-15'), 'quarterly');
    expect(formatIsoDate(next)).toBe('2024-04-15');
  });

  it('adds 12 months for yearly frequency', () => {
    const next = computeNextOccurrence(parseIsoDate('2024-01-15'), 'yearly');
    expect(formatIsoDate(next)).toBe('2025-01-15');
  });

  it('clamps end-of-month overflow (Jan 31 + 1 month => Feb 29 on leap year)', () => {
    const next = computeNextOccurrence(parseIsoDate('2024-01-31'), 'monthly');
    expect(formatIsoDate(next)).toBe('2024-02-29');
  });

  it('clamps end-of-month overflow on a non-leap year', () => {
    const next = computeNextOccurrence(parseIsoDate('2023-01-31'), 'monthly');
    expect(formatIsoDate(next)).toBe('2023-02-28');
  });
});

describe('computeNextDueDate', () => {
  it('returns the start date when no invoice has been generated yet', () => {
    const schedule = makeSchedule({ startDate: '2024-05-01' });
    expect(formatIsoDate(computeNextDueDate(schedule))).toBe('2024-05-01');
  });

  it('returns the next occurrence after the last generated date', () => {
    const schedule = makeSchedule({
      startDate: '2024-01-01',
      lastGeneratedDate: '2024-03-01',
      frequency: 'monthly',
    });
    expect(formatIsoDate(computeNextDueDate(schedule))).toBe('2024-04-01');
  });
});

describe('calculateInvoiceTotals', () => {
  it('computes subtotal without tax', () => {
    const totals = calculateInvoiceTotals([
      { description: 'A', quantity: 2, unitAmount: 50 },
      { description: 'B', quantity: 1, unitAmount: 25 },
    ]);
    expect(totals.subtotal).toBe(125);
    expect(totals.taxAmount).toBe(0);
    expect(totals.total).toBe(125);
  });

  it('applies a tax rate percentage', () => {
    const totals = calculateInvoiceTotals(
      [{ description: 'A', quantity: 1, unitAmount: 200 }],
      7.5
    );
    expect(totals.subtotal).toBe(200);
    expect(totals.taxAmount).toBe(15);
    expect(totals.total).toBe(215);
  });

  it('rounds fractional cents correctly', () => {
    const totals = calculateInvoiceTotals(
      [{ description: 'A', quantity: 3, unitAmount: 10.005 }],
      10
    );
    expect(totals.subtotal).toBe(30.02);
    expect(totals.total).toBeCloseTo(33.02, 2);
  });
});

describe('buildInvoiceDraft', () => {
  it('builds a draft with a due date 14 days after issue date', () => {
    const schedule = makeSchedule({ taxRatePercent: 10 });
    const draft = buildInvoiceDraft(schedule, parseIsoDate('2024-06-01'));
    expect(draft.scheduleId).toBe('sched-1');
    expect(draft.customerId).toBe('cust-1');
    expect(draft.issueDate).toBe('2024-06-01');
    expect(draft.dueDate).toBe('2024-06-15');
    expect(draft.subtotal).toBe(100);
    expect(draft.taxAmount).toBe(10);
    expect(draft.total).toBe(110);
    expect(draft.currency).toBe('USD');
    expect(draft.lineItems).toEqual(schedule.lineItems);
  });
});

describe('isScheduleDueForGeneration', () => {
  it('is false for paused schedules', () => {
    const schedule = makeSchedule({ status: 'paused', startDate: '2024-01-01' });
    expect(isScheduleDueForGeneration(schedule, parseIsoDate('2024-06-01'))).toBe(false);
  });

  it('is false for cancelled schedules', () => {
    const schedule = makeSchedule({ status: 'cancelled', startDate: '2024-01-01' });
    expect(isScheduleDueForGeneration(schedule, parseIsoDate('2024-06-01'))).toBe(false);
  });

  it('is false when the next due date is in the future', () => {
    const schedule = makeSchedule({ startDate: '2024-12-01' });
    expect(isScheduleDueForGeneration(schedule, parseIsoDate('2024-06-01'))).toBe(false);
  });

  it('is true when the next due date has arrived', () => {
    const schedule = makeSchedule({ startDate: '2024-06-01' });
    expect(isScheduleDueForGeneration(schedule, parseIsoDate('2024-06-01'))).toBe(true);
  });

  it('is false once past the schedule end date', () => {
    const schedule = makeSchedule({
      startDate: '2024-01-01',
      lastGeneratedDate: '2024-05-01',
      endDate: '2024-05-15',
      frequency: 'monthly',
    });
    // Next due date would be 2024-06-01, which is after the end date.
    expect(isScheduleDueForGeneration(schedule, parseIsoDate('2024-06-01'))).toBe(false);
  });

  it('is false when there are no line items', () => {
    const schedule = makeSchedule({ startDate: '2024-01-01', lineItems: [] });
    expect(isScheduleDueForGeneration(schedule, parseIsoDate('2024-06-01'))).toBe(false);
  });
});

describe('generateDueInvoices', () => {
  it('generates invoices only for due, active schedules and skips the rest', () => {
    const dueSchedule = makeSchedule({
      id: 'due-1',
      startDate: '2024-01-01',
      status: 'active',
    });
    const futureSchedule = makeSchedule({
      id: 'future-1',
      startDate: '2025-01-01',
      status: 'active',
    });
    const pausedSchedule = makeSchedule({
      id: 'paused-1',
      startDate: '2024-01-01',
      status: 'paused',
    });

    const result = generateDueInvoices(
      [dueSchedule, futureSchedule, pausedSchedule],
      parseIsoDate('2024-06-01')
    );

    expect(result.generated).toHaveLength(1);
    expect(result.generated[0].scheduleId).toBe('due-1');
    expect(result.skippedScheduleIds).toEqual(['future-1', 'paused-1']);
  });

  it('returns an empty generated list when no schedules are due', () => {
    const result = generateDueInvoices(
      [makeSchedule({ id: 'future-only', startDate: '2030-01-01' })],
      parseIsoDate('2024-01-01')
    );
    expect(result.generated).toEqual([]);
    expect(result.skippedScheduleIds).toEqual(['future-only']);
  });
});
