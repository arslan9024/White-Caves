import type { ExpenseClaimStatus } from './expenseClaims.types';

export interface ExpenseClaimTransitionResult {
  allowed: boolean;
  nextStatus: ExpenseClaimStatus;
  reason?: string;
}

const ALLOWED_TRANSITIONS: Record<ExpenseClaimStatus, readonly ExpenseClaimStatus[]> = {
  draft: ['submitted'],
  submitted: ['approved', 'rejected'],
  approved: ['paid'],
  rejected: ['draft'],
  paid: [],
};

export function transitionExpenseClaimStatus(
  currentStatus: ExpenseClaimStatus,
  nextStatus: ExpenseClaimStatus
): ExpenseClaimTransitionResult {
  if (ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)) {
    return { allowed: true, nextStatus };
  }

  return {
    allowed: false,
    nextStatus: currentStatus,
    reason: `Transition from ${currentStatus} to ${nextStatus} is not allowed.`,
  };
}

export function getAllowedExpenseClaimTransitions(
  status: ExpenseClaimStatus
): readonly ExpenseClaimStatus[] {
  return ALLOWED_TRANSITIONS[status];
}
