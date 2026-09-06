/**
 * Types and helpers for the "RERA-off" finance engine mode.
 *
 * This module models payment-plan calculations for projects/entities that
 * operate outside RERA (Real Estate Regulatory Authority) escrow rules,
 * e.g. off-plan sales in jurisdictions or deal structures where RERA
 * milestone-escrow constraints do not apply. It intentionally exposes a
 * narrower, unconstrained payment-milestone model compared to a RERA-on
 * engine (no escrow-stage validation, no regulator-mandated caps).
 *
 * Scope: type definitions plus small, pure runtime helpers (type guards and
 * validation) that are needed to exercise real behavior in tests. No I/O,
 * no network, no persistence.
 */

/** Discriminator confirming a plan was computed in RERA-off mode. */
export type FinanceComplianceMode = 'rera-off';

/** A single payment milestone within a RERA-off payment plan. */
export interface FinanceMilestoneReraOff {
  /** Stable identifier for the milestone (e.g. "booking", "handover"). */
  readonly id: string;
  /** Human-readable label shown to end users. */
  readonly label: string;
  /** Percentage of total price due at this milestone, in the range (0, 100]. */
  readonly percentage: number;
  /** Optional ISO-8601 due date; undefined means "on trigger event". */
  readonly dueDate?: string;
  /** Optional free-text trigger description (e.g. "On foundation completion"). */
  readonly trigger?: string;
}

/** Input required to compute a RERA-off finance plan. */
export interface FinanceEngineReraOffInput {
  /** Total sale price of the unit/asset, must be a positive finite number. */
  readonly totalPrice: number;
  /** Currency code, ISO-4217 (e.g. "AED", "USD"). */
  readonly currency: string;
  /** Ordered list of payment milestones; percentages must sum to 100. */
  readonly milestones: readonly FinanceMilestoneReraOff[];
  /** Optional discount percentage applied to totalPrice, in the range [0, 100). */
  readonly discountPercentage?: number;
}

/** A single computed line in the resulting payment schedule. */
export interface FinanceScheduleLineReraOff {
  readonly milestoneId: string;
  readonly label: string;
  readonly percentage: number;
  readonly amountDue: number;
  readonly dueDate?: string;
  readonly trigger?: string;
}

/** Result of computing a RERA-off finance plan. */
export interface FinanceEngineReraOffResult {
  readonly mode: FinanceComplianceMode;
  readonly currency: string;
  readonly grossTotalPrice: number;
  readonly netTotalPrice: number;
  readonly discountApplied: number;
  readonly schedule: readonly FinanceScheduleLineReraOff[];
}

/** Structured validation error describing exactly what failed and where. */
export interface FinanceEngineReraOffValidationError {
  readonly field: string;
  readonly message: string;
}

/** Result of validating a {@link FinanceEngineReraOffInput}. */
export type FinanceEngineReraOffValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly errors: readonly FinanceEngineReraOffValidationError[] };

const PERCENTAGE_SUM_TOLERANCE = 1e-6;

/** Type guard for {@link FinanceMilestoneReraOff}. */
export function isFinanceMilestoneReraOff(value: unknown): value is FinanceMilestoneReraOff {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || candidate.id.trim().length === 0) {
    return false;
  }
  if (typeof candidate.label !== 'string' || candidate.label.trim().length === 0) {
    return false;
  }
  if (
    typeof candidate.percentage !== 'number' ||
    !Number.isFinite(candidate.percentage) ||
    candidate.percentage <= 0 ||
    candidate.percentage > 100
  ) {
    return false;
  }
  if (candidate.dueDate !== undefined && typeof candidate.dueDate !== 'string') {
    return false;
  }
  if (candidate.trigger !== undefined && typeof candidate.trigger !== 'string') {
    return false;
  }
  return true;
}

/** Type guard for {@link FinanceEngineReraOffInput}. */
export function isFinanceEngineReraOffInput(value: unknown): value is FinanceEngineReraOffInput {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.totalPrice !== 'number' || !Number.isFinite(candidate.totalPrice)) {
    return false;
  }
  if (typeof candidate.currency !== 'string' || candidate.currency.trim().length === 0) {
    return false;
  }
  if (!Array.isArray(candidate.milestones)) {
    return false;
  }
  if (!candidate.milestones.every(item => isFinanceMilestoneReraOff(item))) {
    return false;
  }
  if (
    candidate.discountPercentage !== undefined &&
    (typeof candidate.discountPercentage !== 'number' ||
      !Number.isFinite(candidate.discountPercentage))
  ) {
    return false;
  }
  return true;
}

/**
 * Validates business rules for a RERA-off finance engine input beyond basic
 * shape checks: positive total price, percentages summing to exactly 100,
 * unique milestone ids, and a discount percentage within [0, 100).
 */
export function validateFinanceEngineReraOffInput(
  input: FinanceEngineReraOffInput
): FinanceEngineReraOffValidationResult {
  const errors: FinanceEngineReraOffValidationError[] = [];

  if (!Number.isFinite(input.totalPrice) || input.totalPrice <= 0) {
    errors.push({ field: 'totalPrice', message: 'totalPrice must be a positive finite number.' });
  }

  if (!input.currency || input.currency.trim().length === 0) {
    errors.push({ field: 'currency', message: 'currency is required.' });
  }

  if (input.milestones.length === 0) {
    errors.push({ field: 'milestones', message: 'At least one milestone is required.' });
  } else {
    const seenIds = new Set<string>();
    for (const milestone of input.milestones) {
      if (seenIds.has(milestone.id)) {
        errors.push({
          field: `milestones.${milestone.id}`,
          message: `Duplicate milestone id "${milestone.id}".`,
        });
      }
      seenIds.add(milestone.id);

      if (milestone.percentage <= 0 || milestone.percentage > 100) {
        errors.push({
          field: `milestones.${milestone.id}.percentage`,
          message: 'Milestone percentage must be within (0, 100].',
        });
      }
    }

    const percentageSum = input.milestones.reduce(
      (sum, milestone) => sum + milestone.percentage,
      0
    );
    if (Math.abs(percentageSum - 100) > PERCENTAGE_SUM_TOLERANCE) {
      errors.push({
        field: 'milestones',
        message: `Milestone percentages must sum to 100 (got ${percentageSum}).`,
      });
    }
  }

  if (input.discountPercentage !== undefined) {
    if (
      !Number.isFinite(input.discountPercentage) ||
      input.discountPercentage < 0 ||
      input.discountPercentage >= 100
    ) {
      errors.push({
        field: 'discountPercentage',
        message: 'discountPercentage must be within [0, 100).',
      });
    }
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

/**
 * Rounds a monetary amount to 2 decimal places using standard rounding,
 * avoiding common floating point artifacts (e.g. 1.005 -> 1).
 */
function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Computes a RERA-off finance plan from validated input. Callers should run
 * {@link validateFinanceEngineReraOffInput} first; this function still
 * throws on invalid input to remain safe when used directly.
 */
export function computeFinanceEngineReraOff(
  input: FinanceEngineReraOffInput
): FinanceEngineReraOffResult {
  const validation = validateFinanceEngineReraOffInput(input);
  if (!validation.valid) {
    const message = validation.errors.map(error => `${error.field}: ${error.message}`).join('; ');
    throw new Error(`Invalid FinanceEngineReraOffInput: ${message}`);
  }

  const discountPercentage = input.discountPercentage ?? 0;
  const netTotalPrice = roundCurrency(input.totalPrice * (1 - discountPercentage / 100));
  const discountApplied = roundCurrency(input.totalPrice - netTotalPrice);

  const schedule: FinanceScheduleLineReraOff[] = input.milestones.map(milestone => ({
    milestoneId: milestone.id,
    label: milestone.label,
    percentage: milestone.percentage,
    amountDue: roundCurrency((netTotalPrice * milestone.percentage) / 100),
    dueDate: milestone.dueDate,
    trigger: milestone.trigger,
  }));

  return {
    mode: 'rera-off',
    currency: input.currency,
    grossTotalPrice: roundCurrency(input.totalPrice),
    netTotalPrice,
    discountApplied,
    schedule,
  };
}
