/**
 * Expense claim approval logic.
 *
 * Pure, side-effect-free domain logic for driving an expense claim through
 * its approval workflow. No I/O, no framework dependencies. Intended to be
 * called from route handlers / services that own persistence and auth.
 *
 * Scope (per issue #2391, parent #1947): approval state machine, approver
 * eligibility, and multi-level sign-off calculation for expense claims.
 *
 * Extended (per issue #2464, parent #1929): receipt attachment validation
 * and enforcement, ensuring a claim cannot be approved above a minor-amount
 * threshold without at least one well-formed receipt attached.
 * Explicitly out of scope: persistence, notifications, GitHub automation.
 */

/** Roles permitted to act as approvers within the finance workflow. */
export type ApproverRole = 'team-lead' | 'finance-manager' | 'finance-director';

/** Lifecycle states of an expense claim. */
export type ExpenseClaimStatus =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'paid'
  | 'cancelled';

/** Allowed next statuses from each lifecycle state (simple status machine). */
const ALLOWED_STATUS_TRANSITIONS: Readonly<
  Record<ExpenseClaimStatus, readonly ExpenseClaimStatus[]>
> = {
  draft: ['submitted'],
  submitted: ['approved', 'rejected'],
  'in-review': ['approved', 'rejected'],
  approved: ['paid'],
  rejected: ['draft'],
  paid: [],
  cancelled: [],
};

/** Returns the list of statuses a claim may transition to from `from`. */
export function getAllowedExpenseClaimTransitions(
  from: ExpenseClaimStatus
): readonly ExpenseClaimStatus[] {
  return ALLOWED_STATUS_TRANSITIONS[from] ?? [];
}

/** Outcome of attempting a status transition. */
export interface ExpenseClaimTransitionResult {
  readonly allowed: boolean;
  readonly nextStatus: ExpenseClaimStatus;
}

/**
 * Evaluates whether a claim may move from `from` to `to`. Pure and total:
 * always returns the effective next status (the original status when the
 * transition is not permitted), never throws.
 */
export function transitionExpenseClaimStatus(
  from: ExpenseClaimStatus,
  to: ExpenseClaimStatus
): ExpenseClaimTransitionResult {
  const allowed = getAllowedExpenseClaimTransitions(from).includes(to);
  return { allowed, nextStatus: allowed ? to : from };
}

/** A single approval decision made by an approver on a claim. */
export interface ApprovalRecord {
  readonly approverId: string;
  readonly role: ApproverRole;
  readonly decision: 'approve' | 'reject';
  readonly comment?: string;
  readonly decidedAt: string; // ISO-8601 timestamp
}

/** A receipt file attached as evidence for an expense claim line item. */
export interface ReceiptAttachment {
  readonly id: string;
  readonly url: string;
  readonly mimeType: string;
  readonly fileSizeBytes: number;
  readonly uploadedAt: string; // ISO-8601 timestamp
}

/** The expense claim entity as understood by the approval logic. */
export interface ExpenseClaim {
  readonly id: string;
  readonly submitterId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: ExpenseClaimStatus;
  readonly approvals: readonly ApprovalRecord[];
  /** Receipts evidencing the claim. Optional for backward compatibility;
   * treated as an empty list when absent. */
  readonly receipts?: readonly ReceiptAttachment[];
}

/** A requested approval action, prior to being validated/applied. */
export interface ApprovalRequest {
  readonly approverId: string;
  readonly role: ApproverRole;
  readonly decision: 'approve' | 'reject';
  readonly comment?: string;
  readonly decidedAt?: string;
}

export type ExpenseClaimApprovalErrorCode =
  | 'CLAIM_NOT_SUBMITTED'
  | 'CLAIM_ALREADY_FINALIZED'
  | 'SELF_APPROVAL_NOT_ALLOWED'
  | 'APPROVER_ALREADY_DECIDED'
  | 'INSUFFICIENT_APPROVER_ROLE'
  | 'INVALID_AMOUNT'
  | 'INVALID_COMMENT_FOR_REJECTION'
  | 'MISSING_RECEIPT'
  | 'INVALID_RECEIPT';

export class ExpenseClaimApprovalError extends Error {
  readonly code: ExpenseClaimApprovalErrorCode;

  constructor(code: ExpenseClaimApprovalErrorCode, message: string) {
    super(message);
    this.name = 'ExpenseClaimApprovalError';
    this.code = code;
  }
}

export type ApprovalResult =
  | { readonly ok: true; readonly claim: ExpenseClaim }
  | { readonly ok: false; readonly error: ExpenseClaimApprovalError };

/** Ordered approval tiers, weakest to strongest authority. */
const ROLE_RANK: Readonly<Record<ApproverRole, number>> = {
  'team-lead': 1,
  'finance-manager': 2,
  'finance-director': 3,
};

/** Amount thresholds (in the claim's stated currency) that gate which role
 * must ultimately sign off before a claim can be marked approved. */
const AMOUNT_THRESHOLDS: ReadonlyArray<{ readonly max: number; readonly role: ApproverRole }> = [
  { max: 500, role: 'team-lead' },
  { max: 5000, role: 'finance-manager' },
  { max: Number.POSITIVE_INFINITY, role: 'finance-director' },
];

/**
 * Determines the minimum approver role required to finalize a claim of the
 * given amount. Throws for negative or non-finite amounts, which are never
 * valid claim totals.
 */
export function requiredApproverRole(amount: number): ApproverRole {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ExpenseClaimApprovalError(
      'INVALID_AMOUNT',
      `Expense claim amount must be a non-negative finite number, received: ${amount}`
    );
  }

  const tier = AMOUNT_THRESHOLDS.find(entry => amount <= entry.max);
  // AMOUNT_THRESHOLDS always terminates in Number.POSITIVE_INFINITY, so a
  // matching tier is guaranteed for any valid amount.
  return (tier as { readonly max: number; readonly role: ApproverRole }).role;
}

/**
 * Returns true when the given role meets or exceeds the authority required
 * to finalize approval for a claim of the given amount.
 */
export function isRoleSufficientForAmount(role: ApproverRole, amount: number): boolean {
  const required = requiredApproverRole(amount);
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

/**
 * Returns true when the claim has accumulated a sufficient approval (from a
 * role with adequate authority) and has not been rejected.
 */
export function isFullyApproved(claim: ExpenseClaim): boolean {
  const hasRejection = claim.approvals.some(a => a.decision === 'reject');
  if (hasRejection) {
    return false;
  }

  return claim.approvals.some(
    a => a.decision === 'approve' && isRoleSufficientForAmount(a.role, claim.amount)
  );
}

/** Claims at or below this amount (in the claim's currency) may be approved
 * without a receipt on file; anything above requires at least one valid
 * receipt attachment before it can move to "approved". */
export const RECEIPT_REQUIRED_THRESHOLD = 25;

/** MIME types accepted for receipt attachments. */
const ALLOWED_RECEIPT_MIME_TYPES: ReadonlySet<string> = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
]);

/** Maximum accepted receipt file size, in bytes (10 MiB). */
export const MAX_RECEIPT_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Determines whether a claim of the given amount must have at least one
 * valid receipt attached before it can be approved.
 */
export function requiresReceipt(amount: number): boolean {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ExpenseClaimApprovalError(
      'INVALID_AMOUNT',
      `Expense claim amount must be a non-negative finite number, received: ${amount}`
    );
  }

  return amount > RECEIPT_REQUIRED_THRESHOLD;
}

/**
 * Validates the structural integrity of a single receipt attachment. Pure
 * predicate; does not throw.
 */
export function isValidReceipt(receipt: ReceiptAttachment): boolean {
  return (
    receipt.id.trim() !== '' &&
    receipt.url.trim() !== '' &&
    ALLOWED_RECEIPT_MIME_TYPES.has(receipt.mimeType) &&
    Number.isFinite(receipt.fileSizeBytes) &&
    receipt.fileSizeBytes > 0 &&
    receipt.fileSizeBytes <= MAX_RECEIPT_FILE_SIZE_BYTES &&
    !Number.isNaN(Date.parse(receipt.uploadedAt))
  );
}

/**
 * Returns true when the claim carries at least one structurally valid
 * receipt attachment. A claim with no `receipts` field is treated as having
 * none.
 */
export function hasValidReceipt(claim: ExpenseClaim): boolean {
  return (claim.receipts ?? []).some(isValidReceipt);
}

/**
 * Determines whether the claim currently satisfies its receipt requirement:
 * either the amount is at or below the no-receipt threshold, or it carries
 * at least one valid receipt.
 */
export function satisfiesReceiptRequirement(claim: ExpenseClaim): boolean {
  return !requiresReceipt(claim.amount) || hasValidReceipt(claim);
}

export type AttachReceiptResult =
  | { readonly ok: true; readonly claim: ExpenseClaim }
  | { readonly ok: false; readonly error: ExpenseClaimApprovalError };

/**
 * Attaches a receipt to a claim, returning a new claim (claims are treated
 * as immutable). Rejects structurally invalid receipts and never mutates
 * the input claim.
 */
export function attachReceipt(
  claim: ExpenseClaim,
  receipt: ReceiptAttachment
): AttachReceiptResult {
  if (!isValidReceipt(receipt)) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'INVALID_RECEIPT',
        `Receipt ${receipt.id || '(missing id)'} for claim ${claim.id} failed validation ` +
          '(id/url/mimeType/fileSizeBytes/uploadedAt must all be well-formed).'
      ),
    };
  }

  return {
    ok: true,
    claim: {
      ...claim,
      receipts: [...(claim.receipts ?? []), receipt],
    },
  };
}

/**
 * Produces a human-readable summary of a claim's receipt compliance,
 * useful for UI display or audit logging.
 */
export function summarizeReceiptStatus(claim: ExpenseClaim): string {
  const count = (claim.receipts ?? []).filter(isValidReceipt).length;
  const required = requiresReceipt(claim.amount);
  const satisfied = satisfiesReceiptRequirement(claim);
  return (
    `Claim ${claim.id}: receiptRequired=${required}, validReceipts=${count}, ` +
    `satisfied=${satisfied}`
  );
}

/**
 * Applies an approval or rejection decision to a claim, returning a new
 * claim reflecting the outcome (claims are treated as immutable). Never
 * mutates the input claim.
 */
export function applyApprovalDecision(
  claim: ExpenseClaim,
  request: ApprovalRequest
): ApprovalResult {
  if (claim.status === 'draft') {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'CLAIM_NOT_SUBMITTED',
        `Expense claim ${claim.id} must be submitted before it can be reviewed.`
      ),
    };
  }

  if (claim.status === 'approved' || claim.status === 'rejected' || claim.status === 'cancelled') {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'CLAIM_ALREADY_FINALIZED',
        `Expense claim ${claim.id} is already finalized with status "${claim.status}".`
      ),
    };
  }

  if (request.approverId === claim.submitterId) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'SELF_APPROVAL_NOT_ALLOWED',
        `Approver ${request.approverId} may not approve their own expense claim ${claim.id}.`
      ),
    };
  }

  const alreadyDecided = claim.approvals.some(a => a.approverId === request.approverId);
  if (alreadyDecided) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'APPROVER_ALREADY_DECIDED',
        `Approver ${request.approverId} has already recorded a decision for claim ${claim.id}.`
      ),
    };
  }

  if (request.decision === 'approve' && !satisfiesReceiptRequirement(claim)) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'MISSING_RECEIPT',
        `Claim ${claim.id} for ${claim.amount} ${claim.currency} exceeds the ` +
          `${RECEIPT_REQUIRED_THRESHOLD} ${claim.currency} no-receipt threshold and requires ` +
          'at least one valid receipt attachment before it can be approved.'
      ),
    };
  }

  if (request.decision === 'approve' && !isRoleSufficientForAmount(request.role, claim.amount)) {
    const required = requiredApproverRole(claim.amount);
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'INSUFFICIENT_APPROVER_ROLE',
        `Claim ${claim.id} for ${claim.amount} ${claim.currency} requires at least role ` +
          `"${required}"; approver has role "${request.role}".`
      ),
    };
  }

  if (
    request.decision === 'reject' &&
    request.comment !== undefined &&
    request.comment.trim() === ''
  ) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'INVALID_COMMENT_FOR_REJECTION',
        'A rejection comment, if provided, must not be blank.'
      ),
    };
  }

  const record: ApprovalRecord = {
    approverId: request.approverId,
    role: request.role,
    decision: request.decision,
    comment: request.comment,
    decidedAt: request.decidedAt ?? new Date().toISOString(),
  };

  const approvals = [...claim.approvals, record];

  const nextStatus: ExpenseClaimStatus =
    request.decision === 'reject'
      ? 'rejected'
      : isFullyApproved({ ...claim, approvals })
        ? 'approved'
        : 'in-review';

  return {
    ok: true,
    claim: {
      ...claim,
      approvals,
      status: nextStatus,
    },
  };
}

/**
 * Submits a draft claim for review. Returns an error result if the claim is
 * not currently a draft.
 */
export function submitClaim(claim: ExpenseClaim): ApprovalResult {
  if (claim.status !== 'draft') {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'CLAIM_ALREADY_FINALIZED',
        `Expense claim ${claim.id} cannot be submitted from status "${claim.status}".`
      ),
    };
  }

  return {
    ok: true,
    claim: {
      ...claim,
      status: 'submitted',
    },
  };
}

/**
 * Produces a human-readable summary of a claim's current approval progress,
 * useful for UI display or audit logging.
 */
export function summarizeApprovalProgress(claim: ExpenseClaim): string {
  const required = requiredApproverRole(claim.amount);
  const approveCount = claim.approvals.filter(a => a.decision === 'approve').length;
  const rejectCount = claim.approvals.filter(a => a.decision === 'reject').length;

  return (
    `Claim ${claim.id}: status=${claim.status}, requires>=${required}, ` +
    `approvals=${approveCount}, rejections=${rejectCount}`
  );
}
