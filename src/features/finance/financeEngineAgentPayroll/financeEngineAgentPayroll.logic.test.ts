import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TAX_BRACKETS,
  calculateDeductions,
  calculateGrossPay,
  calculateTaxWithholding,
  computePayrollForEmployee,
  createPayrollAgentTasks,
  runPayrollAgentBatch,
  validatePayrollInput,
  type PayrollEmployeeInput,
} from './financeEngineAgentPayroll.logic';

describe('calculateGrossPay', () => {
  it('computes regular pay with no overtime', () => {
    const input: PayrollEmployeeInput = {
      employeeId: 'emp-1',
      hourlyRate: 20,
      hoursWorked: 40,
    };
    expect(calculateGrossPay(input)).toBe(800);
  });

  it('applies the default 1.5x overtime multiplier', () => {
    const input: PayrollEmployeeInput = {
      employeeId: 'emp-1',
      hourlyRate: 20,
      hoursWorked: 40,
      overtimeHours: 10,
    };
    // 40*20 + 10*20*1.5 = 800 + 300 = 1100
    expect(calculateGrossPay(input)).toBe(1100);
  });

  it('respects a custom overtime multiplier', () => {
    const input: PayrollEmployeeInput = {
      employeeId: 'emp-1',
      hourlyRate: 10,
      hoursWorked: 0,
      overtimeHours: 5,
      overtimeMultiplier: 2,
    };
    expect(calculateGrossPay(input)).toBe(100);
  });
});

describe('calculateTaxWithholding', () => {
  it('returns 0 for zero or negative gross pay', () => {
    expect(calculateTaxWithholding(0)).toBe(0);
    expect(calculateTaxWithholding(-50)).toBe(0);
  });

  it('taxes entirely within the first bracket', () => {
    // 400 * 0.1 = 40
    expect(calculateTaxWithholding(400, DEFAULT_TAX_BRACKETS)).toBe(40);
  });

  it('applies progressive rates across multiple brackets', () => {
    // bracket1: 500*0.1 = 50
    // bracket2: (1500-500)=1000 width, taxable 500*0.2=100
    // total = 150 for grossPay=1000
    expect(calculateTaxWithholding(1000, DEFAULT_TAX_BRACKETS)).toBe(150);
  });

  it('taxes income spilling into the top unlimited bracket', () => {
    // bracket1: 500*0.1=50
    // bracket2: 1000*0.2=200
    // bracket3: (2000-1500)=500 * 0.3=150
    // total = 400 for grossPay=2000
    expect(calculateTaxWithholding(2000, DEFAULT_TAX_BRACKETS)).toBe(400);
  });
});

describe('calculateDeductions', () => {
  it('returns zero total when there are no deductions', () => {
    const { total, breakdown } = calculateDeductions(1000, []);
    expect(total).toBe(0);
    expect(breakdown).toEqual([]);
  });

  it('sums fixed-amount deductions', () => {
    const { total, breakdown } = calculateDeductions(1000, [
      { name: 'insurance', amount: 50 },
      { name: 'union dues', amount: 25 },
    ]);
    expect(total).toBe(75);
    expect(breakdown).toEqual([
      { name: 'insurance', amount: 50 },
      { name: 'union dues', amount: 25 },
    ]);
  });

  it('computes percentage-based deductions relative to gross pay', () => {
    const { total, breakdown } = calculateDeductions(1000, [
      { name: 'retirement', percentage: 0.05 },
    ]);
    expect(total).toBe(50);
    expect(breakdown).toEqual([{ name: 'retirement', amount: 50 }]);
  });

  it('supports mixed fixed and percentage deductions', () => {
    const { total } = calculateDeductions(2000, [
      { name: 'retirement', percentage: 0.1 },
      { name: 'parking', amount: 30 },
    ]);
    expect(total).toBe(230);
  });
});

describe('validatePayrollInput', () => {
  it('returns no issues for valid input', () => {
    const input: PayrollEmployeeInput = {
      employeeId: 'emp-1',
      hourlyRate: 25,
      hoursWorked: 40,
      deductions: [{ name: 'insurance', amount: 20 }],
    };
    expect(validatePayrollInput(input)).toEqual([]);
  });

  it('flags a missing employeeId', () => {
    const issues = validatePayrollInput({
      employeeId: '',
      hourlyRate: 10,
      hoursWorked: 10,
    });
    expect(issues.some(issue => issue.field === 'employeeId')).toBe(true);
  });

  it('flags a negative hourlyRate', () => {
    const issues = validatePayrollInput({
      employeeId: 'emp-1',
      hourlyRate: -5,
      hoursWorked: 10,
    });
    expect(issues.some(issue => issue.field === 'hourlyRate')).toBe(true);
  });

  it('flags a negative hoursWorked', () => {
    const issues = validatePayrollInput({
      employeeId: 'emp-1',
      hourlyRate: 10,
      hoursWorked: -1,
    });
    expect(issues.some(issue => issue.field === 'hoursWorked')).toBe(true);
  });

  it('flags an invalid overtimeMultiplier', () => {
    const issues = validatePayrollInput({
      employeeId: 'emp-1',
      hourlyRate: 10,
      hoursWorked: 10,
      overtimeHours: 2,
      overtimeMultiplier: 0,
    });
    expect(issues.some(issue => issue.field === 'overtimeMultiplier')).toBe(true);
  });

  it('flags a deduction with both amount and percentage set', () => {
    const issues = validatePayrollInput({
      employeeId: 'emp-1',
      hourlyRate: 10,
      hoursWorked: 10,
      deductions: [{ name: 'bad', amount: 10, percentage: 0.1 }],
    });
    expect(issues.some(issue => issue.field === 'deductions[0]')).toBe(true);
  });

  it('flags a deduction with neither amount nor percentage set', () => {
    const issues = validatePayrollInput({
      employeeId: 'emp-1',
      hourlyRate: 10,
      hoursWorked: 10,
      deductions: [{ name: 'bad' }],
    });
    expect(issues.some(issue => issue.field === 'deductions[0]')).toBe(true);
  });

  it('flags an out-of-range deduction percentage', () => {
    const issues = validatePayrollInput({
      employeeId: 'emp-1',
      hourlyRate: 10,
      hoursWorked: 10,
      deductions: [{ name: 'bad', percentage: 1.5 }],
    });
    expect(issues.some(issue => issue.field === 'deductions[0].percentage')).toBe(true);
  });
});

describe('computePayrollForEmployee', () => {
  it('computes gross, tax, deductions, and net pay end-to-end', () => {
    const input: PayrollEmployeeInput = {
      employeeId: 'emp-42',
      hourlyRate: 25,
      hoursWorked: 40,
      deductions: [{ name: 'insurance', amount: 30 }],
    };
    const result = computePayrollForEmployee(input);

    // grossPay = 25*40 = 1000
    expect(result.employeeId).toBe('emp-42');
    expect(result.grossPay).toBe(1000);
    // tax: 500*0.1 + 500*0.2 = 150
    expect(result.taxWithheld).toBe(150);
    expect(result.totalDeductions).toBe(30);
    // net = 1000 - 150 - 30 = 820
    expect(result.netPay).toBe(820);
    expect(result.deductionBreakdown).toEqual([{ name: 'insurance', amount: 30 }]);
  });

  it('handles an employee with zero hours worked', () => {
    const result = computePayrollForEmployee({
      employeeId: 'emp-0',
      hourlyRate: 30,
      hoursWorked: 0,
    });
    expect(result.grossPay).toBe(0);
    expect(result.taxWithheld).toBe(0);
    expect(result.totalDeductions).toBe(0);
    expect(result.netPay).toBe(0);
  });
});

describe('createPayrollAgentTasks', () => {
  it('creates one task per input with stable, unique taskIds', () => {
    const inputs: PayrollEmployeeInput[] = [
      { employeeId: 'emp-1', hourlyRate: 10, hoursWorked: 10 },
      { employeeId: 'emp-1', hourlyRate: 10, hoursWorked: 20 },
    ];
    const tasks = createPayrollAgentTasks(inputs);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].taskId).not.toBe(tasks[1].taskId);
    expect(tasks[0].input).toBe(inputs[0]);
  });
});

describe('runPayrollAgentBatch', () => {
  it('processes a batch of valid tasks and aggregates net pay', () => {
    const tasks = createPayrollAgentTasks([
      { employeeId: 'emp-1', hourlyRate: 20, hoursWorked: 40 },
      { employeeId: 'emp-2', hourlyRate: 30, hoursWorked: 40 },
    ]);
    const batch = runPayrollAgentBatch(tasks);

    expect(batch.processedCount).toBe(2);
    expect(batch.successCount).toBe(2);
    expect(batch.failedCount).toBe(0);
    expect(batch.outcomes.every(o => o.status === 'success')).toBe(true);
    // Net pay for both employees combined must be a positive finite number.
    expect(batch.totalNetPay).toBeGreaterThan(0);
    expect(Number.isFinite(batch.totalNetPay)).toBe(true);
  });

  it('isolates a failing task without aborting the whole batch', () => {
    const tasks = createPayrollAgentTasks([
      { employeeId: 'emp-1', hourlyRate: 20, hoursWorked: 40 },
      { employeeId: '', hourlyRate: -5, hoursWorked: -1 },
    ]);
    const batch = runPayrollAgentBatch(tasks);

    expect(batch.processedCount).toBe(2);
    expect(batch.successCount).toBe(1);
    expect(batch.failedCount).toBe(1);

    const failed = batch.outcomes.find(o => o.status === 'failed');
    expect(failed).toBeDefined();
    expect(failed?.issues && failed.issues.length).toBeGreaterThan(0);

    const succeeded = batch.outcomes.find(o => o.status === 'success');
    expect(succeeded?.result?.employeeId).toBe('emp-1');
  });

  it('returns an empty result for an empty task queue', () => {
    const batch = runPayrollAgentBatch([]);
    expect(batch.processedCount).toBe(0);
    expect(batch.successCount).toBe(0);
    expect(batch.failedCount).toBe(0);
    expect(batch.totalNetPay).toBe(0);
    expect(batch.outcomes).toEqual([]);
  });
});
