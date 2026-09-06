/**
 * Domain types for the Expense Claims feature (Finance module).
 *
 * Scope: type-only definitions consumed by expense claim services, reducers,
 * and UI components. No runtime logic lives in this file.
 *
 * Parent issue: #1947
 * Child issue: #2389
 *
 * Receipt-requirement compliance types/helpers below were added under the
 * W56-FINANCE-RECEIPT track.
 * Parent issue: #1929
 * Child issue: #2462
 */

/** ISO-8601 date-time string, e.g. "2026-09-06T13:09:55.120Z". */
export type IsoDateTimeString = string;

/** ISO-8601 calendar date string, e.g. "2026-09-06". */
export type IsoDateString = string;

/** Three-letter ISO 4217 currency code, e.g. "AED", "USD". */
export type CurrencyCode = string;

/** Lifecycle states an expense claim can occupy. */
export type ExpenseClaimStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'reimbursed'
  | 'cancelled';

/** Categories used to classify individual expense line items. */
export type ExpenseCategory =
  | 'travel'
  | 'accommodation'
  | 'meals'
  | 'transport'
  | 'office_supplies'
  | 'client_entertainment'
  | 'software_subscription'
  | 'training'
  | 'utilities'
  | 'other';

/** Supported payment methods used to fund an expense at time of purchase. */
export type ExpensePaymentMethod =
  | 'personal_card'
  | 'company_card'
  | 'cash'
  | 'bank_transfer'
  | 'other';

/** A monetary amount paired with the currency it is denominated in. */
export interface Money {
  /** Amount expressed in the smallest currency unit is NOT used here; this is a decimal amount. */
  readonly amount: number;
  readonly currency: CurrencyCode;
}

/** Metadata describing a single uploaded receipt/attachment. */
export interface ExpenseAttachment {
  readonly id: string;
  readonly fileName: string;
  /** MIME type of the stored file, e.g. "application/pdf", "image/png". */
  readonly mimeType: string;
  /** Size of the stored file in bytes. */
  readonly sizeBytes: number;
  /** URL or storage key the file can be retrieved from. */
  readonly url: string;
  readonly uploadedAt: IsoDateTimeString;
  readonly uploadedByUserId: string;
}

/** A single line item within an expense claim. */
export interface ExpenseClaimLineItem {
  readonly id: string;
  readonly category: ExpenseCategory;
  readonly description: string;
  readonly incurredOn: IsoDateString;
  readonly paymentMethod: ExpensePaymentMethod;
  readonly amount: Money;
  /** Whether this line item includes recoverable tax/VAT. */
  readonly isTaxRecoverable: boolean;
  readonly attachments: ReadonlyArray<ExpenseAttachment>;
  readonly notes?: string;
}

/** A single approval or rejection decision recorded against a claim. */
export interface ExpenseClaimApprovalStep {
  readonly id: string;
  readonly approverUserId: string;
  readonly decision: 'approved' | 'rejected' | 'pending';
  readonly decidedAt: IsoDateTimeString | null;
  readonly comment?: string;
  /** Ordering position of this step within the overall approval chain. */
  readonly sequence: number;
}

/** Full expense claim record, aggregating one or more line items. */
export interface ExpenseClaim {
  readonly id: string;
  readonly claimNumber: string;
  readonly submittedByUserId: string;
  readonly status: ExpenseClaimStatus;
  readonly title: string;
  readonly description?: string;
  readonly lineItems: ReadonlyArray<ExpenseClaimLineItem>;
  readonly approvalSteps: ReadonlyArray<ExpenseClaimApprovalStep>;
  /** Total claimed amount; currency must be consistent across all line items. */
  readonly totalAmount: Money;
  readonly createdAt: IsoDateTimeString;
  readonly updatedAt: IsoDateTimeString;
  readonly submittedAt: IsoDateTimeString | null;
  readonly reimbursedAt: IsoDateTimeString | null;
  /** Free-form tags used for filtering/reporting, e.g. project codes. */
  readonly tags: ReadonlyArray<string>;
}

/** Payload accepted when creating a new expense claim line item (no generated fields). */
export type CreateExpenseClaimLineItemInput = Omit<ExpenseClaimLineItem, 'id' | 'attachments'> & {
  readonly attachments?: ReadonlyArray<ExpenseAttachment>;
};

/** Payload accepted when creating a new expense claim (no generated/system fields). */
export interface CreateExpenseClaimInput {
  readonly title: string;
  readonly description?: string;
  readonly submittedByUserId: string;
  readonly lineItems: ReadonlyArray<CreateExpenseClaimLineItemInput>;
  readonly tags?: ReadonlyArray<string>;
}

/** Payload accepted when updating a mutable subset of an existing expense claim. */
export type UpdateExpenseClaimInput = Partial<
  Pick<ExpenseClaim, 'title' | 'description' | 'tags'>
> & {
  readonly lineItems?: ReadonlyArray<CreateExpenseClaimLineItemInput>;
};

/** Filter criteria used when querying/listing expense claims. */
export interface ExpenseClaimFilter {
  readonly status?: ReadonlyArray<ExpenseClaimStatus>;
  readonly submittedByUserId?: string;
  readonly category?: ExpenseCategory;
  readonly fromDate?: IsoDateString;
  readonly toDate?: IsoDateString;
  readonly tags?: ReadonlyArray<string>;
}

/** Summary statistics aggregated across a set of expense claims. */
export interface ExpenseClaimSummary {
  readonly totalClaims: number;
  readonly totalAmount: Money;
  readonly byStatus: Readonly<Record<ExpenseClaimStatus, number>>;
  readonly byCategory: Readonly<Partial<Record<ExpenseCategory, number>>>;
}

/** Discriminated result type for expense claim validation outcomes. */
export type ExpenseClaimValidationResult =
  | { readonly isValid: true }
  | { readonly isValid: false; readonly errors: ReadonlyArray<ExpenseClaimValidationError> };

/** A single field-level validation error for an expense claim submission. */
export interface ExpenseClaimValidationError {
  readonly field: string;
  readonly message: string;
  readonly code:
    | 'REQUIRED'
    | 'INVALID_AMOUNT'
    | 'INVALID_DATE'
    | 'CURRENCY_MISMATCH'
    | 'MISSING_ATTACHMENT'
    | 'INVALID_STATUS_TRANSITION';
}

/** Type guard narrowing an unknown value to a valid ExpenseClaimStatus. */
export function isExpenseClaimStatus(value: unknown): value is ExpenseClaimStatus {
  return (
    typeof value === 'string' &&
    (
      [
        'draft',
        'submitted',
        'in_review',
        'approved',
        'rejected',
        'reimbursed',
        'cancelled',
      ] as ReadonlyArray<string>
    ).includes(value)
  );
}

/** Type guard narrowing an unknown value to a valid ExpenseCategory. */
export function isExpenseCategory(value: unknown): value is ExpenseCategory {
  return (
    typeof value === 'string' &&
    (
      [
        'travel',
        'accommodation',
        'meals',
        'transport',
        'office_supplies',
        'client_entertainment',
        'software_subscription',
        'training',
        'utilities',
        'other',
      ] as ReadonlyArray<string>
    ).includes(value)
  );
}

/** Statuses considered final; no further transitions are permitted from these states. */
export const TERMINAL_EXPENSE_CLAIM_STATUSES: ReadonlyArray<ExpenseClaimStatus> = [
  'reimbursed',
  'cancelled',
];

/** Map of valid forward transitions for the expense claim status state machine. */
export const EXPENSE_CLAIM_STATUS_TRANSITIONS: Readonly<
  Record<ExpenseClaimStatus, ReadonlyArray<ExpenseClaimStatus>>
> = {
  draft: ['submitted', 'cancelled'],
  submitted: ['in_review', 'cancelled'],
  in_review: ['approved', 'rejected', 'cancelled'],
  approved: ['reimbursed', 'cancelled'],
  rejected: ['draft', 'cancelled'],
  reimbursed: [],
  cancelled: [],
};

/** Category alias used by the expense claim form (mirrors {@link ExpenseCategory}). */
export type ExpenseClaimCategory = ExpenseCategory;

/** Ordered list of all expense claim categories for form pickers. */
export const EXPENSE_CLAIM_CATEGORIES: readonly ExpenseClaimCategory[] = [
  'travel',
  'accommodation',
  'meals',
  'transport',
  'office_supplies',
  'client_entertainment',
  'software_subscription',
  'training',
  'utilities',
  'other',
];

/** Flat draft shape used by the expense claim form before submission. */
export interface ExpenseClaimDraft {
  readonly employeeId: string;
  readonly category: ExpenseClaimCategory;
  readonly amountAed: number;
  readonly incurredOn: string;
  readonly description: string;
  readonly receiptReference?: string;
}

/** Field-level validation result for an expense claim draft. */
export interface ExpenseClaimDraftValidation {
  readonly valid: boolean;
  readonly errors: Readonly<Partial<Record<keyof ExpenseClaimDraft, string>>>;
}

/** Pure validator for an expense claim draft; returns per-field error messages. */
export function validateExpenseClaimDraft(draft: ExpenseClaimDraft): ExpenseClaimDraftValidation {
  const errors: Partial<Record<keyof ExpenseClaimDraft, string>> = {};

  if (!draft.employeeId || draft.employeeId.trim().length === 0) {
    errors.employeeId = 'Employee ID is required.';
  }
  if (!isExpenseCategory(draft.category)) {
    errors.category = 'A supported expense category is required.';
  }
  if (!Number.isFinite(draft.amountAed) || draft.amountAed <= 0) {
    errors.amountAed = 'Amount must be greater than zero AED.';
  }
  const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;
  if (!draft.incurredOn || !YYYY_MM_DD.test(draft.incurredOn)) {
    errors.incurredOn = 'Incurred date must use YYYY-MM-DD format.';
  }
  if (!draft.description || draft.description.trim().length === 0) {
    errors.description = 'Description is required.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/* -------------------------------------------------------------------------
 * Receipt requirement compliance (W56-FINANCE-RECEIPT track, issue #2462,
 * parent #1929).
 *
 * These types/helpers determine whether a given expense claim line item
 * requires a supporting receipt attachment, and evaluate a whole claim for
 * compliance with a configurable receipt-requirement policy. This is a pure,
 * additive extension of the domain model above: it introduces no changes to
 * any pre-existing exported symbol.
 * ---------------------------------------------------------------------- */

/**
 * Configurable policy describing when a receipt attachment is mandatory for
 * an expense claim line item.
 */
export interface ReceiptRequirementPolicy {
  /**
   * Minimum line-item amount (inclusive) at or above which a receipt is
   * always required, regardless of category. Expressed in the same
   * currency as {@link ReceiptRequirementPolicy.thresholdCurrency}.
   */
  readonly thresholdAmount: number;
  /** Currency the {@link ReceiptRequirementPolicy.thresholdAmount} is denominated in. */
  readonly thresholdCurrency: CurrencyCode;
  /**
   * Categories that always require a receipt, irrespective of amount
   * (e.g. client entertainment is frequently receipt-mandatory even for
   * small amounts).
   */
  readonly requiredCategories: ReadonlyArray<ExpenseCategory>;
  /**
   * Payment methods exempt from the receipt requirement even when the
   * amount/category rules would otherwise mandate one (e.g. recurring
   * company-card software subscriptions already reconciled elsewhere).
   */
  readonly exemptPaymentMethods?: ReadonlyArray<ExpensePaymentMethod>;
}

/** Default, conservative receipt-requirement policy used absent an override. */
export const DEFAULT_RECEIPT_REQUIREMENT_POLICY: ReceiptRequirementPolicy = {
  thresholdAmount: 100,
  thresholdCurrency: 'AED',
  requiredCategories: ['client_entertainment', 'training'],
  exemptPaymentMethods: [],
};

/**
 * Pure predicate determining whether a single line item requires a receipt
 * under the given policy.
 *
 * Rules (evaluated in order):
 * 1. If the line item's payment method is listed in
 *    {@link ReceiptRequirementPolicy.exemptPaymentMethods}, no receipt is
 *    required.
 * 2. Otherwise, if the line item's category is listed in
 *    {@link ReceiptRequirementPolicy.requiredCategories}, a receipt is
 *    required.
 * 3. Otherwise, a receipt is required when the line item's amount is in the
 *    same currency as the policy threshold and is greater than or equal to
 *    {@link ReceiptRequirementPolicy.thresholdAmount}.
 *
 * A currency mismatch between the line item amount and the policy
 * threshold is treated conservatively: the amount-based rule is skipped
 * (cannot be safely compared), but category/payment-method rules still
 * apply.
 */
export function claimLineItemRequiresReceipt(
  lineItem: ExpenseClaimLineItem,
  policy: ReceiptRequirementPolicy = DEFAULT_RECEIPT_REQUIREMENT_POLICY
): boolean {
  if (policy.exemptPaymentMethods?.includes(lineItem.paymentMethod)) {
    return false;
  }
  if (policy.requiredCategories.includes(lineItem.category)) {
    return true;
  }
  if (lineItem.amount.currency !== policy.thresholdCurrency) {
    return false;
  }
  return lineItem.amount.amount >= policy.thresholdAmount;
}

/** Identifies a single line item that requires a receipt but has none attached. */
export interface MissingReceiptViolation {
  readonly lineItemId: string;
  readonly category: ExpenseCategory;
  readonly amount: Money;
}

/** Discriminated result of evaluating an entire claim's receipt compliance. */
export type ExpenseClaimReceiptComplianceResult =
  | { readonly compliant: true }
  | { readonly compliant: false; readonly violations: ReadonlyArray<MissingReceiptViolation> };

/**
 * Evaluates every line item in a claim against {@link claimLineItemRequiresReceipt}
 * and reports any line item that requires a receipt but has zero attachments.
 *
 * Pure function: performs no I/O and relies only on its inputs.
 */
export function evaluateExpenseClaimReceiptCompliance(
  claim: Pick<ExpenseClaim, 'lineItems'>,
  policy: ReceiptRequirementPolicy = DEFAULT_RECEIPT_REQUIREMENT_POLICY
): ExpenseClaimReceiptComplianceResult {
  const violations: MissingReceiptViolation[] = [];

  for (const lineItem of claim.lineItems) {
    const requiresReceipt = claimLineItemRequiresReceipt(lineItem, policy);
    if (requiresReceipt && lineItem.attachments.length === 0) {
      violations.push({
        lineItemId: lineItem.id,
        category: lineItem.category,
        amount: lineItem.amount,
      });
    }
  }

  return violations.length === 0 ? { compliant: true } : { compliant: false, violations };
}
