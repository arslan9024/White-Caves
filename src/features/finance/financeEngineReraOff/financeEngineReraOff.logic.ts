/**
 * financeEngineReraOff.logic.ts
 *
 * Finance engine for payment plan computation in jurisdictions/scenarios where
 * RERA (Real Estate Regulatory Authority) escrow constraints are OFF.
 *
 * Unlike a RERA-governed plan (which typically forces escrow-linked,
 * construction-milestone-gated disbursement rules), this engine allows a
 * flexible developer-defined milestone schedule as long as the declared
 * percentages are internally consistent (non-negative, sum to 100, unique
 * milestone identifiers, and chronologically non-decreasing due offsets).
 *
 * This module is intentionally pure and side-effect free so it can be unit
 * tested without any I/O, network, or database dependencies.
 */

/** A single payment milestone as declared by the developer/finance team. */
export interface FinanceMilestoneInput {
  /** Stable unique identifier for the milestone (e.g. "booking", "handover"). */
  readonly id: string;
  /** Human readable label shown to the buyer. */
  readonly label: string;
  /** Percentage of the total price allocated to this milestone (0-100]. */
  readonly percentage: number;
  /** Number of days after the plan start date this milestone falls due. */
  readonly dueOffsetDays: number;
}

/** Input required to compute a full non-RERA finance plan. */
export interface FinanceEngineReraOffInput {
  /** Total sale price of the unit, in the smallest currency's major unit (e.g. AED). */
  readonly totalPrice: number;
  /** Ordered or unordered list of milestones; engine sorts by due offset internally. */
  readonly milestones: readonly FinanceMilestoneInput[];
  /** ISO date string or Date representing when the plan begins (e.g. booking date). */
  readonly startDate: Date | string;
  /** Optional rounding precision for computed monetary amounts. Defaults to 2. */
  readonly roundingPrecision?: number;
}

/** A fully computed installment ready for presentation or scheduling. */
export interface FinanceInstallment {
  readonly id: string;
  readonly label: string;
  readonly percentage: number;
  readonly amount: number;
  readonly dueDate: Date;
  readonly dueOffsetDays: number;
}

/** Aggregate summary of a computed finance plan. */
export interface FinanceEngineReraOffSummary {
  readonly totalPrice: number;
  readonly totalAllocatedPercentage: number;
  readonly totalAllocatedAmount: number;
  readonly installments: readonly FinanceInstallment[];
}

/** Error thrown when a finance plan fails structural validation. */
export class FinanceEngineReraOffValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FinanceEngineReraOffValidationError';
  }
}

const DEFAULT_ROUNDING_PRECISION = 2;
const PERCENTAGE_TOTAL_TOLERANCE = 0.001;

function roundToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function toDate(value: Date | string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new FinanceEngineReraOffValidationError(`Invalid startDate provided: ${String(value)}`);
  }
  return date;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Validates the structural integrity of the supplied milestones.
 * Throws {@link FinanceEngineReraOffValidationError} on any violation.
 */
export function validateFinanceMilestones(milestones: readonly FinanceMilestoneInput[]): void {
  if (milestones.length === 0) {
    throw new FinanceEngineReraOffValidationError(
      'At least one milestone is required to compute a finance plan.'
    );
  }

  const seenIds = new Set<string>();
  let percentageTotal = 0;

  for (const milestone of milestones) {
    if (!milestone.id || milestone.id.trim().length === 0) {
      throw new FinanceEngineReraOffValidationError('Milestone id must be a non-empty string.');
    }
    if (seenIds.has(milestone.id)) {
      throw new FinanceEngineReraOffValidationError(
        `Duplicate milestone id detected: "${milestone.id}".`
      );
    }
    seenIds.add(milestone.id);

    if (!Number.isFinite(milestone.percentage) || milestone.percentage <= 0) {
      throw new FinanceEngineReraOffValidationError(
        `Milestone "${milestone.id}" percentage must be a positive finite number.`
      );
    }

    if (!Number.isFinite(milestone.dueOffsetDays) || milestone.dueOffsetDays < 0) {
      throw new FinanceEngineReraOffValidationError(
        `Milestone "${milestone.id}" dueOffsetDays must be a non-negative finite number.`
      );
    }

    percentageTotal += milestone.percentage;
  }

  if (Math.abs(percentageTotal - 100) > PERCENTAGE_TOTAL_TOLERANCE) {
    throw new FinanceEngineReraOffValidationError(
      `Milestone percentages must sum to 100, got ${percentageTotal}.`
    );
  }
}

/**
 * Computes the ordered list of installments (sorted by due offset ascending)
 * for a validated non-RERA finance plan.
 */
export function computeFinanceInstallments(input: FinanceEngineReraOffInput): FinanceInstallment[] {
  if (!Number.isFinite(input.totalPrice) || input.totalPrice <= 0) {
    throw new FinanceEngineReraOffValidationError(
      `totalPrice must be a positive finite number, got ${input.totalPrice}.`
    );
  }

  validateFinanceMilestones(input.milestones);

  const precision = input.roundingPrecision ?? DEFAULT_ROUNDING_PRECISION;
  const startDate = toDate(input.startDate);

  const sortedMilestones = [...input.milestones].sort((a, b) => a.dueOffsetDays - b.dueOffsetDays);

  return sortedMilestones.map(milestone => ({
    id: milestone.id,
    label: milestone.label,
    percentage: milestone.percentage,
    amount: roundToPrecision((input.totalPrice * milestone.percentage) / 100, precision),
    dueDate: addDays(startDate, milestone.dueOffsetDays),
    dueOffsetDays: milestone.dueOffsetDays,
  }));
}

/**
 * Computes a full finance plan summary, including totals, for a non-RERA
 * (developer-flexible) payment schedule.
 */
export function computeFinanceEngineReraOffSummary(
  input: FinanceEngineReraOffInput
): FinanceEngineReraOffSummary {
  const installments = computeFinanceInstallments(input);

  const totalAllocatedPercentage = roundToPrecision(
    installments.reduce((sum, installment) => sum + installment.percentage, 0),
    input.roundingPrecision ?? DEFAULT_ROUNDING_PRECISION
  );

  const totalAllocatedAmount = roundToPrecision(
    installments.reduce((sum, installment) => sum + installment.amount, 0),
    input.roundingPrecision ?? DEFAULT_ROUNDING_PRECISION
  );

  return {
    totalPrice: input.totalPrice,
    totalAllocatedPercentage,
    totalAllocatedAmount,
    installments,
  };
}
