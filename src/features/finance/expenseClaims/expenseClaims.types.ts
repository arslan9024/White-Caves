export const EXPENSE_CLAIM_CATEGORIES = [
  'travel',
  'marketing',
  'client-entertainment',
  'office-supplies',
  'professional-services',
  'other',
] as const;

export type ExpenseClaimCategory = (typeof EXPENSE_CLAIM_CATEGORIES)[number];

export type ExpenseClaimStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';

export interface ExpenseClaimDraft {
  employeeId: string;
  category: ExpenseClaimCategory;
  amountAed: number;
  incurredOn: string;
  description: string;
  receiptReference?: string;
}

export interface ExpenseClaim extends ExpenseClaimDraft {
  id: string;
  status: ExpenseClaimStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseClaimValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ExpenseClaimDraft, string>>;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateExpenseClaimDraft(draft: ExpenseClaimDraft): ExpenseClaimValidationResult {
  const errors: ExpenseClaimValidationResult['errors'] = {};

  if (!draft.employeeId.trim()) errors.employeeId = 'Employee ID is required.';
  if (!EXPENSE_CLAIM_CATEGORIES.includes(draft.category))
    errors.category = 'A supported expense category is required.';
  if (!Number.isFinite(draft.amountAed) || draft.amountAed <= 0)
    errors.amountAed = 'Amount must be greater than zero AED.';
  if (!ISO_DATE_PATTERN.test(draft.incurredOn))
    errors.incurredOn = 'Incurred date must use YYYY-MM-DD format.';
  if (!draft.description.trim()) errors.description = 'Description is required.';

  return { valid: Object.keys(errors).length === 0, errors };
}
