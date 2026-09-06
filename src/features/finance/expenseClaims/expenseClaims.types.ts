/**
 * Domain types for the Expense Claims feature (Finance module).
 *
 * Scope: type-only definitions consumed by expense claim services, reducers,
 * and UI components. No runtime logic lives in this file.
 *
 * Parent issue: #1947
 * Child issue: #2389
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

// ---------------------------------------------------------------------------
// Receipt capture & enforcement (Parent issue: #1929, Child issue: #2462)
//
// Adds pure, exported types/helpers enabling callers to determine whether a
// given expense claim line item requires a receipt, and whether its existing
// `attachments` (see {@link ExpenseAttachment}) satisfy that requirement.
// Purely additive: no existing exported symbol above is modified.
// ---------------------------------------------------------------------------

/** MIME types accepted as valid receipt evidence for an expense line item. */
export const ALLOWED_RECEIPT_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
] as const;

/** Union of MIME type strings accepted as valid receipt evidence. */
export type ReceiptMimeType = (typeof ALLOWED_RECEIPT_MIME_TYPES)[number];

/**
 * Amount threshold (in the line item's own currency's decimal units) at or
 * below which a line item may be submitted without a receipt attachment.
 */
export const RECEIPT_REQUIRED_THRESHOLD = 25;

/** Maximum allowed size, in bytes, for an individual receipt attachment file. */
export const MAX_RECEIPT_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Type guard narrowing an unknown value to an allow-listed {@link ReceiptMimeType}. */
export function isReceiptMimeType(value: unknown): value is ReceiptMimeType {
  return (
    typeof value === 'string' &&
    (ALLOWED_RECEIPT_MIME_TYPES as ReadonlyArray<string>).includes(value)
  );
}

/**
 * Determines whether a line item amount requires a receipt to be attached.
 * Non-finite amounts (e.g. `NaN`, `Infinity`) are treated as requiring a
 * receipt (fail safe) since their true magnitude cannot be established.
 */
export function requiresReceipt(amount: number): boolean {
  if (!Number.isFinite(amount)) {
    return true;
  }
  return amount > RECEIPT_REQUIRED_THRESHOLD;
}

/**
 * Structural validity check for a single {@link ExpenseAttachment} used as
 * receipt evidence: non-blank identifiers, an allow-listed MIME type, a
 * positive size within {@link MAX_RECEIPT_FILE_SIZE_BYTES}, and a parseable
 * upload timestamp.
 */
export function isValidReceiptAttachment(attachment: ExpenseAttachment): boolean {
  const hasId = typeof attachment.id === 'string' && attachment.id.trim().length > 0;
  const hasUrl = typeof attachment.url === 'string' && attachment.url.trim().length > 0;
  const hasValidMimeType = isReceiptMimeType(attachment.mimeType);
  const hasValidSize =
    Number.isFinite(attachment.sizeBytes) &&
    attachment.sizeBytes > 0 &&
    attachment.sizeBytes <= MAX_RECEIPT_FILE_SIZE_BYTES;
  const hasValidTimestamp =
    typeof attachment.uploadedAt === 'string' && !Number.isNaN(Date.parse(attachment.uploadedAt));

  return hasId && hasUrl && hasValidMimeType && hasValidSize && hasValidTimestamp;
}

/** Whether a line item currently carries at least one structurally valid receipt attachment. */
export function hasValidReceiptForLineItem(item: ExpenseClaimLineItem): boolean {
  return item.attachments.some(isValidReceiptAttachment);
}

/**
 * Combines the amount threshold ({@link requiresReceipt}) with attachment
 * validity ({@link hasValidReceiptForLineItem}) to determine whether a line
 * item, as a whole, satisfies the receipt requirement.
 */
export function lineItemSatisfiesReceiptRequirement(item: ExpenseClaimLineItem): boolean {
  if (!requiresReceipt(item.amount.amount)) {
    return true;
  }
  return hasValidReceiptForLineItem(item);
}

/**
 * Validates the receipt requirement across every line item of a claim and
 * returns a discriminated {@link ExpenseClaimValidationResult}. Only checks
 * receipt evidence; does not duplicate other field-level validation owned
 * elsewhere (e.g. category/amount/date checks in sibling validators).
 */
export function validateExpenseClaimReceipts(
  lineItems: ReadonlyArray<ExpenseClaimLineItem>
): ExpenseClaimValidationResult {
  const errors: ExpenseClaimValidationError[] = [];

  lineItems.forEach((item, index) => {
    if (!lineItemSatisfiesReceiptRequirement(item)) {
      errors.push({
        field: `lineItems[${index}].attachments`,
        message: `Line item "${item.description}" requires at least one valid receipt attachment.`,
        code: 'MISSING_ATTACHMENT',
      });
    }
  });

  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  return { isValid: true };
}

/**
 * Produces a deterministic, human-readable summary of receipt compliance
 * across a set of line items, e.g. "2 of 3 line items requiring a receipt
 * have one attached." or the no-requirement message when nothing exceeds
 * {@link RECEIPT_REQUIRED_THRESHOLD}.
 */
export function summarizeReceiptStatus(lineItems: ReadonlyArray<ExpenseClaimLineItem>): string {
  const requiring = lineItems.filter(item => requiresReceipt(item.amount.amount));
  if (requiring.length === 0) {
    return 'No line items require a receipt.';
  }
  const satisfied = requiring.filter(hasValidReceiptForLineItem).length;
  return `${satisfied} of ${requiring.length} line items requiring a receipt have one attached.`;
}
