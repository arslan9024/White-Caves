/**
 * financeEngineAgentPayroll.logic.ts
 *
 * Pure business logic for the Finance Engine Agent's payroll sub-domain.
 * Scope (issue #2455, parent #1931): payroll gross/tax/deduction/net
 * calculation and a small "agent" batch runner that processes a queue of
 * payroll tasks deterministically, collecting per-employee results and
 * batch-level diagnostics.
 *
 * This module is intentionally dependency-free and side-effect-free so it
 * can be unit tested in isolation and safely composed into larger finance
 * orchestration flows without introducing coupling to I/O, GitHub, or
 * database concerns.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single progressive tax bracket. `upTo` is exclusive-of-next, inclusive
 * of itself; use `Number.POSITIVE_INFINITY` for the top-most bracket. */
export interface PayrollTaxBracket {
  readonly upTo: number;
  readonly rate: number;
}

/** A named, fixed or percentage-based payroll deduction. */
export interface PayrollDeduction {
  readonly name: string;
  /** Fixed currency amount deducted, mutually exclusive with `percentage`. */
  readonly amount?: number;
  /** Percentage (0-1) of gross pay deducted, mutually exclusive with `amount`. */
  readonly percentage?: number;
}

/** Raw input describing a single employee's pay period. */
export interface PayrollEmployeeInput {
  readonly employeeId: string;
  readonly hourlyRate: number;
  readonly hoursWorked: number;
  /** Overtime hours, paid at `overtimeMultiplier` times `hourlyRate`. */
  readonly overtimeHours?: number;
  readonly overtimeMultiplier?: number;
  readonly deductions?: readonly PayrollDeduction[];
}

/** Result of computing a single employee's payroll for a period. */
export interface PayrollCalculationResult {
  readonly employeeId: string;
  readonly grossPay: number;
  readonly taxWithheld: number;
  readonly totalDeductions: number;
  readonly netPay: number;
  readonly deductionBreakdown: readonly { name: string; amount: number }[];
}

/** A validation problem discovered while checking employee input. */
export interface PayrollValidationIssue {
  readonly employeeId: string;
  readonly field: string;
  readonly message: string;
}

/** A unit of work for the payroll agent batch runner. */
export interface PayrollAgentTask {
  readonly taskId: string;
  readonly input: PayrollEmployeeInput;
}

/** Outcome of a single task processed by the agent. */
export interface PayrollAgentTaskOutcome {
  readonly taskId: string;
  readonly status: 'success' | 'failed';
  readonly result?: PayrollCalculationResult;
  readonly issues?: readonly PayrollValidationIssue[];
}

/** Aggregate outcome of running a batch of payroll tasks. */
export interface PayrollAgentBatchResult {
  readonly processedCount: number;
  readonly successCount: number;
  readonly failedCount: number;
  readonly totalNetPay: number;
  readonly outcomes: readonly PayrollAgentTaskOutcome[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default progressive tax brackets applied when none are supplied. */
export const DEFAULT_TAX_BRACKETS: readonly PayrollTaxBracket[] = [
  { upTo: 500, rate: 0.1 },
  { upTo: 1500, rate: 0.2 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
];

const CURRENCY_PRECISION = 2;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Rounds a currency value to 2 decimal places using half-up rounding. */
function roundCurrency(value: number): number {
  const factor = 10 ** CURRENCY_PRECISION;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Validates a single employee's payroll input, returning a list of issues.
 * An empty array means the input is valid.
 */
export function validatePayrollInput(input: PayrollEmployeeInput): PayrollValidationIssue[] {
  const issues: PayrollValidationIssue[] = [];
  const employeeId = input.employeeId ?? '';

  if (!input.employeeId || input.employeeId.trim().length === 0) {
    issues.push({
      employeeId,
      field: 'employeeId',
      message: 'employeeId must be a non-empty string',
    });
  }
  if (!Number.isFinite(input.hourlyRate) || input.hourlyRate < 0) {
    issues.push({
      employeeId,
      field: 'hourlyRate',
      message: 'hourlyRate must be a finite number >= 0',
    });
  }
  if (!Number.isFinite(input.hoursWorked) || input.hoursWorked < 0) {
    issues.push({
      employeeId,
      field: 'hoursWorked',
      message: 'hoursWorked must be a finite number >= 0',
    });
  }
  if (
    input.overtimeHours !== undefined &&
    (!Number.isFinite(input.overtimeHours) || input.overtimeHours < 0)
  ) {
    issues.push({
      employeeId,
      field: 'overtimeHours',
      message: 'overtimeHours must be a finite number >= 0 when provided',
    });
  }
  if (
    input.overtimeMultiplier !== undefined &&
    (!Number.isFinite(input.overtimeMultiplier) || input.overtimeMultiplier <= 0)
  ) {
    issues.push({
      employeeId,
      field: 'overtimeMultiplier',
      message: 'overtimeMultiplier must be a finite number > 0 when provided',
    });
  }
  (input.deductions ?? []).forEach((deduction, index) => {
    const hasAmount = deduction.amount !== undefined;
    const hasPercentage = deduction.percentage !== undefined;
    if (hasAmount === hasPercentage) {
      issues.push({
        employeeId,
        field: `deductions[${index}]`,
        message: 'deduction must specify exactly one of amount or percentage',
      });
      return;
    }
    if (hasAmount && (!Number.isFinite(deduction.amount) || (deduction.amount as number) < 0)) {
      issues.push({
        employeeId,
        field: `deductions[${index}].amount`,
        message: 'deduction amount must be a finite number >= 0',
      });
    }
    if (
      hasPercentage &&
      (!Number.isFinite(deduction.percentage) ||
        (deduction.percentage as number) < 0 ||
        (deduction.percentage as number) > 1)
    ) {
      issues.push({
        employeeId,
        field: `deductions[${index}].percentage`,
        message: 'deduction percentage must be a finite number between 0 and 1',
      });
    }
  });

  return issues;
}

/** Computes gross pay from regular and overtime hours. */
export function calculateGrossPay(input: PayrollEmployeeInput): number {
  const overtimeHours = input.overtimeHours ?? 0;
  const overtimeMultiplier = input.overtimeMultiplier ?? 1.5;
  const regularPay = input.hourlyRate * input.hoursWorked;
  const overtimePay = input.hourlyRate * overtimeMultiplier * overtimeHours;
  return roundCurrency(regularPay + overtimePay);
}

/**
 * Applies a progressive tax schedule to `grossPay`. Each bracket taxes only
 * the portion of income within its band, matching standard progressive
 * withholding semantics.
 */
export function calculateTaxWithholding(
  grossPay: number,
  brackets: readonly PayrollTaxBracket[] = DEFAULT_TAX_BRACKETS
): number {
  if (grossPay <= 0) {
    return 0;
  }
  let remaining = grossPay;
  let lowerBound = 0;
  let tax = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) {
      break;
    }
    const bandWidth = bracket.upTo - lowerBound;
    const taxableInBand = Math.min(remaining, bandWidth);
    tax += taxableInBand * bracket.rate;
    remaining -= taxableInBand;
    lowerBound = bracket.upTo;
  }

  return roundCurrency(tax);
}

/**
 * Computes total deductions and a per-deduction breakdown given gross pay.
 */
export function calculateDeductions(
  grossPay: number,
  deductions: readonly PayrollDeduction[] = []
): { total: number; breakdown: { name: string; amount: number }[] } {
  const breakdown = deductions.map(deduction => {
    const amount =
      deduction.amount !== undefined ? deduction.amount : grossPay * (deduction.percentage ?? 0);
    return { name: deduction.name, amount: roundCurrency(amount) };
  });
  const total = roundCurrency(breakdown.reduce((sum, item) => sum + item.amount, 0));
  return { total, breakdown };
}

/**
 * Computes the full payroll result for a single, already-validated employee
 * input. Callers should run `validatePayrollInput` first; this function does
 * not itself throw on invalid input, it simply computes with the given
 * numbers (NaN/negative inputs will propagate as NaN/negative outputs).
 */
export function computePayrollForEmployee(
  input: PayrollEmployeeInput,
  taxBrackets: readonly PayrollTaxBracket[] = DEFAULT_TAX_BRACKETS
): PayrollCalculationResult {
  const grossPay = calculateGrossPay(input);
  const taxWithheld = calculateTaxWithholding(grossPay, taxBrackets);
  const { total: totalDeductions, breakdown } = calculateDeductions(grossPay, input.deductions);
  const netPay = roundCurrency(grossPay - taxWithheld - totalDeductions);

  return {
    employeeId: input.employeeId,
    grossPay,
    taxWithheld,
    totalDeductions,
    netPay,
    deductionBreakdown: breakdown,
  };
}

/**
 * Builds a `PayrollAgentTask` list from raw inputs, generating a stable
 * `taskId` per employee based on their `employeeId` and position, so that
 * duplicate employee ids in a batch remain individually addressable.
 */
export function createPayrollAgentTasks(
  inputs: readonly PayrollEmployeeInput[]
): PayrollAgentTask[] {
  return inputs.map((input, index) => ({
    taskId: `${input.employeeId || 'unknown'}-${index}`,
    input,
  }));
}

/**
 * The payroll "agent" batch runner: validates and computes payroll for every
 * task in the queue, never throwing on individual task failure. Failures are
 * reported per-task in the returned `outcomes` array so a single bad record
 * cannot abort an entire payroll run.
 */
export function runPayrollAgentBatch(
  tasks: readonly PayrollAgentTask[],
  taxBrackets: readonly PayrollTaxBracket[] = DEFAULT_TAX_BRACKETS
): PayrollAgentBatchResult {
  const outcomes: PayrollAgentTaskOutcome[] = tasks.map(task => {
    const issues = validatePayrollInput(task.input);
    if (issues.length > 0) {
      return { taskId: task.taskId, status: 'failed', issues };
    }
    const result = computePayrollForEmployee(task.input, taxBrackets);
    return { taskId: task.taskId, status: 'success', result };
  });

  const successCount = outcomes.filter(o => o.status === 'success').length;
  const failedCount = outcomes.length - successCount;
  const totalNetPay = roundCurrency(
    outcomes.reduce((sum, outcome) => sum + (outcome.result?.netPay ?? 0), 0)
  );

  return {
    processedCount: outcomes.length,
    successCount,
    failedCount,
    totalNetPay,
    outcomes,
  };
}
