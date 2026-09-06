import { describe, expect, it } from 'vitest';
import {
  computeFinanceEngineReraOff,
  isFinanceEngineReraOffInput,
  isFinanceMilestoneReraOff,
  validateFinanceEngineReraOffInput,
  type FinanceEngineReraOffInput,
} from './financeEngineReraOff.types';

const validInput: FinanceEngineReraOffInput = {
  totalPrice: 1_000_000,
  currency: 'AED',
  milestones: [
    { id: 'booking', label: 'Booking', percentage: 10 },
    { id: 'construction', label: 'Construction', percentage: 60 },
    { id: 'handover', label: 'Handover', percentage: 30, trigger: 'On handover' },
  ],
};

describe('isFinanceMilestoneReraOff', () => {
  it('accepts a well-formed milestone', () => {
    expect(isFinanceMilestoneReraOff({ id: 'booking', label: 'Booking', percentage: 10 })).toBe(
      true
    );
  });

  it('rejects a milestone with a non-positive percentage', () => {
    expect(isFinanceMilestoneReraOff({ id: 'booking', label: 'Booking', percentage: 0 })).toBe(
      false
    );
  });

  it('rejects a milestone with percentage above 100', () => {
    expect(isFinanceMilestoneReraOff({ id: 'booking', label: 'Booking', percentage: 101 })).toBe(
      false
    );
  });

  it('rejects a milestone missing required fields', () => {
    expect(isFinanceMilestoneReraOff({ id: 'booking' })).toBe(false);
  });

  it('rejects non-object values', () => {
    expect(isFinanceMilestoneReraOff(null)).toBe(false);
    expect(isFinanceMilestoneReraOff('booking')).toBe(false);
  });
});

describe('isFinanceEngineReraOffInput', () => {
  it('accepts a well-formed input', () => {
    expect(isFinanceEngineReraOffInput(validInput)).toBe(true);
  });

  it('rejects input with a non-array milestones field', () => {
    expect(isFinanceEngineReraOffInput({ ...validInput, milestones: 'nope' })).toBe(false);
  });

  it('rejects input with an invalid milestone entry', () => {
    expect(
      isFinanceEngineReraOffInput({
        ...validInput,
        milestones: [{ id: 'x', label: 'X', percentage: -5 }],
      })
    ).toBe(false);
  });

  it('rejects input with a non-numeric totalPrice', () => {
    expect(isFinanceEngineReraOffInput({ ...validInput, totalPrice: '1000000' })).toBe(false);
  });
});

describe('validateFinanceEngineReraOffInput', () => {
  it('returns valid for correct input', () => {
    const result = validateFinanceEngineReraOffInput(validInput);
    expect(result.valid).toBe(true);
  });

  it('flags a non-positive totalPrice', () => {
    const result = validateFinanceEngineReraOffInput({ ...validInput, totalPrice: 0 });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(error => error.field === 'totalPrice')).toBe(true);
    }
  });

  it('flags milestone percentages that do not sum to 100', () => {
    const result = validateFinanceEngineReraOffInput({
      ...validInput,
      milestones: [{ id: 'booking', label: 'Booking', percentage: 50 }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(error => error.field === 'milestones')).toBe(true);
    }
  });

  it('flags duplicate milestone ids', () => {
    const result = validateFinanceEngineReraOffInput({
      ...validInput,
      milestones: [
        { id: 'booking', label: 'Booking', percentage: 50 },
        { id: 'booking', label: 'Booking 2', percentage: 50 },
      ],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(error => error.field === 'milestones.booking')).toBe(true);
    }
  });

  it('flags an out-of-range discount percentage', () => {
    const result = validateFinanceEngineReraOffInput({ ...validInput, discountPercentage: 100 });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(error => error.field === 'discountPercentage')).toBe(true);
    }
  });

  it('flags an empty milestone list', () => {
    const result = validateFinanceEngineReraOffInput({ ...validInput, milestones: [] });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(error => error.field === 'milestones')).toBe(true);
    }
  });
});

describe('computeFinanceEngineReraOff', () => {
  it('computes a schedule whose amounts sum to the net total price', () => {
    const result = computeFinanceEngineReraOff(validInput);
    expect(result.mode).toBe('rera-off');
    expect(result.currency).toBe('AED');
    expect(result.grossTotalPrice).toBe(1_000_000);
    expect(result.netTotalPrice).toBe(1_000_000);
    expect(result.discountApplied).toBe(0);
    expect(result.schedule).toHaveLength(3);

    const sum = result.schedule.reduce((acc, line) => acc + line.amountDue, 0);
    expect(sum).toBeCloseTo(1_000_000, 2);

    expect(result.schedule[0]).toMatchObject({
      milestoneId: 'booking',
      label: 'Booking',
      percentage: 10,
      amountDue: 100_000,
    });
    expect(result.schedule[2].trigger).toBe('On handover');
  });

  it('applies a discount percentage to reduce the net total and schedule amounts', () => {
    const result = computeFinanceEngineReraOff({ ...validInput, discountPercentage: 10 });
    expect(result.grossTotalPrice).toBe(1_000_000);
    expect(result.netTotalPrice).toBe(900_000);
    expect(result.discountApplied).toBe(100_000);
    expect(result.schedule[0].amountDue).toBe(90_000);
  });

  it('throws a descriptive error when given invalid input', () => {
    expect(() => computeFinanceEngineReraOff({ ...validInput, totalPrice: -1 })).toThrow(
      /totalPrice/
    );
  });

  it('throws when milestone percentages do not sum to 100', () => {
    expect(() =>
      computeFinanceEngineReraOff({
        ...validInput,
        milestones: [{ id: 'only', label: 'Only', percentage: 40 }],
      })
    ).toThrow(/milestones/);
  });

  it('preserves an optional dueDate through to the schedule line', () => {
    const result = computeFinanceEngineReraOff({
      ...validInput,
      milestones: [{ id: 'booking', label: 'Booking', percentage: 100, dueDate: '2026-01-01' }],
    });
    expect(result.schedule[0].dueDate).toBe('2026-01-01');
  });
});
