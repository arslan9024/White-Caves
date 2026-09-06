/**
 * Expense claim approval logic.
 *
 * Pure, side-effect-free domain logic for driving an expense claim through
 * its approval workflow. No I/O, no framework dependencies. Intended to be
 * called from route handlers / services that own persistence and auth.
 *
 * Scope (per issue #2391, parent #1947): approval state machine, approver
 * eligibility, and multi-level sign-off calculation for expense claims.
 * Explicitly out of scope: persistence, notifications, GitHub automation.
 *
 * Extension (per issue #2464, parent #1929): receipt-attachment
 * requirements. Claims above a policy threshold must carry at least one
 * valid receipt record before an "approve" decision may be applied. This
 * extension is additive only; every previously exported symbol and
 * behavior above this threshold-agnostic baseline is preserved unchanged.
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

/**
 * A receipt document attached in support of an expense claim. `amount`, when
 * present, is the value printed on the receipt itself (for reconciliation
 * against the claim total); it is not required to match exactly, since a
 * single claim may aggregate several receipts.
 */
export interface Receipt {
  readonly id: string;
  readonly url: string;
  readonly uploadedAt: string; // ISO-8601 timestamp
  readonly amount?: number;
}

/** The expense claim entity as understood by the approval logic. */
export interface ExpenseClaim {
  readonly id: string;
  readonly submitterId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: ExpenseClaimStatus;
  readonly approvals: readonly ApprovalRecord[];
  /**
   * Receipts attached in support of this claim. Optional for backward
   * compatibility with claims constructed before receipt tracking existed;
   * treated as an empty list when absent.
   */
  readonly receipts?: readonly Receipt[];
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
 * Minimum claim amount (in the claim's stated currency) at or above which at
 * least one receipt must be attached before an "approve" decision can be
 * applied. Below this threshold, receipts remain optional (e.g. small
 * incidental expenses such as parking or minor supplies).
 */
export const RECEIPT_REQUIRED_THRESHOLD = 25;

/**
 * Returns true when a claim of the given amount must carry at least one
 * receipt before it can be approved.
 */
export function isReceiptRequired(amount: number): boolean {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ExpenseClaimApprovalError(
      'INVALID_AMOUNT',
      `Expense claim amount must be a non-negative finite number, received: ${amount}`
    );
  }
  return amount >= RECEIPT_REQUIRED_THRESHOLD;
}

/**
 * Returns true when a receipt record is well-formed: it has a non-blank id
 * and url, a parseable `uploadedAt` timestamp, and (if present) a finite,
 * non-negative `amount`.
 */
export function isValidReceipt(receipt: Receipt): boolean {
  if (receipt.id.trim() === '' || receipt.url.trim() === '') {
    return false;
  }
  if (Number.isNaN(Date.parse(receipt.uploadedAt))) {
    return false;
  }
  if (receipt.amount !== undefined && (!Number.isFinite(receipt.amount) || receipt.amount < 0)) {
    return false;
  }
  return true;
}

/**
 * Returns true when the claim's receipt requirement (if any) is satisfied,
 * i.e. either no receipt is required for its amount, or it carries at least
 * one valid receipt.
 */
export function hasSatisfiedReceiptRequirement(claim: ExpenseClaim): boolean {
  if (!isReceiptRequired(claim.amount)) {
    return true;
  }
  const receipts = claim.receipts ?? [];
  return receipts.some(isValidReceipt);
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

  if (request.decision === 'approve' && !hasSatisfiedReceiptRequirement(claim)) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'MISSING_RECEIPT',
        `Claim ${claim.id} for ${claim.amount} ${claim.currency} requires at least one valid ` +
          `receipt (threshold: ${RECEIPT_REQUIRED_THRESHOLD}) before it can be approved.`
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
 * Attaches a receipt to a claim, returning a new claim (immutable update).
 * Rejects malformed receipts and duplicate receipt ids so callers cannot
 * silently accumulate invalid or repeated evidence.
 */
export function attachReceipt(claim: ExpenseClaim, receipt: Receipt): ApprovalResult {
  if (!isValidReceipt(receipt)) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'INVALID_RECEIPT',
        `Receipt ${receipt.id || '(blank id)'} is missing required fields or has an invalid ` +
          `amount/timestamp.`
      ),
    };
  }

  const existing = claim.receipts ?? [];
  if (existing.some(r => r.id === receipt.id)) {
    return {
      ok: false,
      error: new ExpenseClaimApprovalError(
        'INVALID_RECEIPT',
        `Receipt ${receipt.id} is already attached to claim ${claim.id}.`
      ),
    };
  }

  return {
    ok: true,
    claim: {
      ...claim,
      receipts: [...existing, receipt],
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
  const receiptStatus = isReceiptRequired(claim.amount)
    ? hasSatisfiedReceiptRequirement(claim)
      ? 'receipt=ok'
      : 'receipt=missing'
    : 'receipt=n/a';

  return (
    `Claim ${claim.id}: status=${claim.status}, requires>=${required}, ` +
    `approvals=${approveCount}, rejections=${rejectCount}, ${receiptStatus}`
  );
}
