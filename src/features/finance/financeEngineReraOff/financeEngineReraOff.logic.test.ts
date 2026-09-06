import { describe, expect, it } from 'vitest';

import {
  computeFinanceEngineReraOffSummary,
  computeFinanceInstallments,
  FinanceEngineReraOffValidationError,
  validateFinanceMilestones,
  type FinanceMilestoneInput,
} from './financeEngineReraOff.logic';

const baseMilestones: FinanceMilestoneInput[] = [
  { id: 'booking', label: 'Booking Payment', percentage: 20, dueOffsetDays: 0 },
  { id: 'construction-1', label: 'Construction Milestone 1', percentage: 30, dueOffsetDays: 90 },
  { id: 'construction-2', label: 'Construction Milestone 2', percentage: 30, dueOffsetDays: 180 },
  { id: 'handover', label: 'Handover', percentage: 20, dueOffsetDays: 365 },
];

describe('validateFinanceMilestones', () => {
  it('accepts a well-formed milestone list summing to 100 percent', () => {
    expect(() => validateFinanceMilestones(baseMilestones)).not.toThrow();
  });

  it('rejects an empty milestone list', () => {
    expect(() => validateFinanceMilestones([])).toThrow(FinanceEngineReraOffValidationError);
  });

  it('rejects milestones with duplicate ids', () => {
    const milestones: FinanceMilestoneInput[] = [
      { id: 'booking', label: 'Booking', percentage: 50, dueOffsetDays: 0 },
      { id: 'booking', label: 'Booking Again', percentage: 50, dueOffsetDays: 30 },
    ];
    expect(() => validateFinanceMilestones(milestones)).toThrow(/Duplicate milestone id/);
  });

  it('rejects milestones whose percentages do not sum to 100', () => {
    const milestones: FinanceMilestoneInput[] = [
      { id: 'booking', label: 'Booking', percentage: 40, dueOffsetDays: 0 },
      { id: 'handover', label: 'Handover', percentage: 40, dueOffsetDays: 365 },
    ];
    expect(() => validateFinanceMilestones(milestones)).toThrow(/sum to 100/);
  });

  it('rejects a non-positive percentage', () => {
    const milestones: FinanceMilestoneInput[] = [
      { id: 'booking', label: 'Booking', percentage: 0, dueOffsetDays: 0 },
      { id: 'handover', label: 'Handover', percentage: 100, dueOffsetDays: 365 },
    ];
    expect(() => validateFinanceMilestones(milestones)).toThrow(/positive finite number/);
  });

  it('rejects a negative dueOffsetDays', () => {
    const milestones: FinanceMilestoneInput[] = [
      { id: 'booking', label: 'Booking', percentage: 50, dueOffsetDays: -5 },
      { id: 'handover', label: 'Handover', percentage: 50, dueOffsetDays: 365 },
    ];
    expect(() => validateFinanceMilestones(milestones)).toThrow(/dueOffsetDays/);
  });

  it('rejects an empty milestone id', () => {
    const milestones: FinanceMilestoneInput[] = [
      { id: '   ', label: 'Booking', percentage: 100, dueOffsetDays: 0 },
    ];
    expect(() => validateFinanceMilestones(milestones)).toThrow(/non-empty string/);
  });

  it('tolerates floating point rounding noise near 100 percent', () => {
    const milestones: FinanceMilestoneInput[] = [
      { id: 'a', label: 'A', percentage: 33.34, dueOffsetDays: 0 },
      { id: 'b', label: 'B', percentage: 33.33, dueOffsetDays: 30 },
      { id: 'c', label: 'C', percentage: 33.33, dueOffsetDays: 60 },
    ];
    expect(() => validateFinanceMilestones(milestones)).not.toThrow();
  });
});

describe('computeFinanceInstallments', () => {
  it('computes correct amounts and due dates for each milestone', () => {
    const installments = computeFinanceInstallments({
      totalPrice: 1_000_000,
      milestones: baseMilestones,
      startDate: '2026-01-01T00:00:00.000Z',
    });

    expect(installments).toHaveLength(4);

    expect(installments[0]).toMatchObject({ id: 'booking', amount: 200_000, dueOffsetDays: 0 });
    expect(installments[1]).toMatchObject({
      id: 'construction-1',
      amount: 300_000,
      dueOffsetDays: 90,
    });
    expect(installments[2]).toMatchObject({
      id: 'construction-2',
      amount: 300_000,
      dueOffsetDays: 180,
    });
    expect(installments[3]).toMatchObject({ id: 'handover', amount: 200_000, dueOffsetDays: 365 });

    const totalAmount = installments.reduce((sum, i) => sum + i.amount, 0);
    expect(totalAmount).toBeCloseTo(1_000_000, 5);
  });

  it('sorts installments by dueOffsetDays regardless of input order', () => {
    const shuffled: FinanceMilestoneInput[] = [
      baseMilestones[3],
      baseMilestones[0],
      baseMilestones[2],
      baseMilestones[1],
    ];

    const installments = computeFinanceInstallments({
      totalPrice: 500_000,
      milestones: shuffled,
      startDate: '2026-01-01T00:00:00.000Z',
    });

    expect(installments.map(i => i.id)).toEqual([
      'booking',
      'construction-1',
      'construction-2',
      'handover',
    ]);
  });

  it('derives due dates as startDate plus dueOffsetDays', () => {
    const installments = computeFinanceInstallments({
      totalPrice: 100_000,
      milestones: baseMilestones,
      startDate: '2026-01-01T00:00:00.000Z',
    });

    const handover = installments.find(i => i.id === 'handover');
    expect(handover).toBeDefined();
    const expectedDate = new Date('2026-01-01T00:00:00.000Z');
    expectedDate.setDate(expectedDate.getDate() + 365);
    expect(handover?.dueDate.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
    expect(handover?.dueDate.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(handover?.dueDate.getUTCDate()).toBe(expectedDate.getUTCDate());
  });

  it('respects a custom rounding precision', () => {
    const milestones: FinanceMilestoneInput[] = [
      { id: 'a', label: 'A', percentage: 33.33, dueOffsetDays: 0 },
      { id: 'b', label: 'B', percentage: 66.67, dueOffsetDays: 30 },
    ];

    const installments = computeFinanceInstallments({
      totalPrice: 3,
      milestones,
      startDate: '2026-01-01T00:00:00.000Z',
      roundingPrecision: 4,
    });

    expect(installments[0].amount).toBeCloseTo(0.9999, 4);
    expect(installments[1].amount).toBeCloseTo(2.0001, 4);
  });

  it('throws when totalPrice is not positive', () => {
    expect(() =>
      computeFinanceInstallments({
        totalPrice: 0,
        milestones: baseMilestones,
        startDate: '2026-01-01T00:00:00.000Z',
      })
    ).toThrow(FinanceEngineReraOffValidationError);
  });

  it('throws on an invalid startDate string', () => {
    expect(() =>
      computeFinanceInstallments({
        totalPrice: 100_000,
        milestones: baseMilestones,
        startDate: 'not-a-date',
      })
    ).toThrow(FinanceEngineReraOffValidationError);
  });

  it('propagates milestone validation errors', () => {
    const badMilestones: FinanceMilestoneInput[] = [
      { id: 'booking', label: 'Booking', percentage: 40, dueOffsetDays: 0 },
    ];
    expect(() =>
      computeFinanceInstallments({
        totalPrice: 100_000,
        milestones: badMilestones,
        startDate: '2026-01-01T00:00:00.000Z',
      })
    ).toThrow(/sum to 100/);
  });
});

describe('computeFinanceEngineReraOffSummary', () => {
  it('produces a summary whose totals match the sum of installments', () => {
    const summary = computeFinanceEngineReraOffSummary({
      totalPrice: 750_000,
      milestones: baseMilestones,
      startDate: '2026-06-15T00:00:00.000Z',
    });

    expect(summary.totalPrice).toBe(750_000);
    expect(summary.totalAllocatedPercentage).toBe(100);
    expect(summary.totalAllocatedAmount).toBeCloseTo(750_000, 5);
    expect(summary.installments).toHaveLength(4);
    expect(summary.installments[0].id).toBe('booking');
    expect(summary.installments[summary.installments.length - 1].id).toBe('handover');
  });

  it('accepts a Date instance as startDate in addition to a string', () => {
    const summary = computeFinanceEngineReraOffSummary({
      totalPrice: 200_000,
      milestones: baseMilestones,
      startDate: new Date('2027-03-01T00:00:00.000Z'),
    });

    expect(summary.installments[0].dueDate.getUTCFullYear()).toBe(2027);
  });
});
