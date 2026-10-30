import { describe, it, expect } from 'vitest';
import {
  parseCleanAmount,
  formatAed,
  addMonthsToDate,
  calculateChequeSchedule,
  calculateSecurityDeposit,
  calculateAgencyCommissionBreakdown,
} from './chequeCalculator';

describe('chequeCalculator', () => {
  it('parses currency strings cleanly', () => {
    expect(parseCleanAmount('35,000.00 AED')).toBe(35000);
    expect(parseCleanAmount('AED 120,500')).toBe(120500);
    expect(parseCleanAmount(50000)).toBe(50000);
    expect(parseCleanAmount('')).toBe(0);
  });

  it('formats amounts in AED with 2 decimal places', () => {
    expect(formatAed(35000)).toBe('35,000.00 AED');
  });

  it('adds months to DD-MM-YYYY format accurately', () => {
    expect(addMonthsToDate('01-10-2026', 3)).toBe('01-01-2027');
    expect(addMonthsToDate('15-05-2026', 6)).toBe('15-11-2026');
  });

  it('splits annual rent into 4 cheques with zero drifting', () => {
    const schedule = calculateChequeSchedule({
      annualRent: '100,000.00 AED',
      chequeCount: 4,
      startDate: '01-10-2026',
    });
    expect(schedule).toHaveLength(4);
    expect(schedule[0].amount).toBe(25000);
    expect(schedule[0].memo).toContain('1st Cheque');
    expect(schedule[3].memo).toContain('Final');
    const total = schedule.reduce((sum, item) => sum + item.amount, 0);
    expect(total).toBe(100000);
  });

  it('absorbs rounding remainder on odd divisions (3 cheques for 100,000)', () => {
    const schedule = calculateChequeSchedule({
      annualRent: 100000,
      chequeCount: 3,
      startDate: '01-01-2026',
    });
    expect(schedule).toHaveLength(3);
    const sum = schedule.reduce((acc, c) => acc + c.amount, 0);
    expect(sum).toBe(100000);
  });

  it('calculates 5% security deposit for unfurnished and 10% for furnished', () => {
    const unfurnished = calculateSecurityDeposit({ annualRent: 80000, isFurnished: false });
    expect(unfurnished.percentage).toBe(5);
    expect(unfurnished.amount).toBe(4000);

    const furnished = calculateSecurityDeposit({ annualRent: 80000, isFurnished: true });
    expect(furnished.percentage).toBe(10);
    expect(furnished.amount).toBe(8000);
  });

  it('calculates 5% agency commission and 5% UAE VAT', () => {
    const breakdown = calculateAgencyCommissionBreakdown({ annualRent: 100000 });
    expect(breakdown.commissionAmount).toBe(5000);
    expect(breakdown.vatAmount).toBe(250);
    expect(breakdown.totalDue).toBe(5250);
  });
});

