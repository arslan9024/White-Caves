import { describe, expect, it } from 'vitest';
import {
  getAllowedExpenseClaimTransitions,
  transitionExpenseClaimStatus,
} from './expenseClaimApproval.logic';

describe('expense claim approval transitions', () => {
  it('allows the draft submission path', () => {
    expect(transitionExpenseClaimStatus('draft', 'submitted')).toEqual({
      allowed: true,
      nextStatus: 'submitted',
    });
  });

  it('allows review outcomes and payment after approval', () => {
    expect(getAllowedExpenseClaimTransitions('submitted')).toEqual(['approved', 'rejected']);
    expect(transitionExpenseClaimStatus('approved', 'paid')).toEqual({
      allowed: true,
      nextStatus: 'paid',
    });
    expect(transitionExpenseClaimStatus('rejected', 'draft')).toEqual({
      allowed: true,
      nextStatus: 'draft',
    });
  });

  it('rejects payment before approval and changes after payment', () => {
    const beforeApproval = transitionExpenseClaimStatus('submitted', 'paid');
    const afterPayment = transitionExpenseClaimStatus('paid', 'draft');

    expect(beforeApproval.allowed).toBe(false);
    expect(beforeApproval.nextStatus).toBe('submitted');
    expect(afterPayment.allowed).toBe(false);
    expect(afterPayment.nextStatus).toBe('paid');
  });
});
