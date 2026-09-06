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

/** The expense claim entity as understood by the approval logic. */
export interface ExpenseClaim {
  readonly id: string;
  readonly submitterId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: ExpenseClaimStatus;
  readonly approvals: readonly ApprovalRecord[];
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
  | 'INVALID_COMMENT_FOR_REJECTION';

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
