import { describe, expect, it } from 'vitest';
import { validateExpenseClaimDraft } from './expenseClaims.types';

describe('validateExpenseClaimDraft', () => {
  it('accepts a complete AED expense claim draft', () => {
    expect(
      validateExpenseClaimDraft({
        employeeId: 'employee-123',
        category: 'travel',
        amountAed: 425.5,
        incurredOn: '2026-09-06',
        description: 'Taxi fare for client viewing.',
        receiptReference: 'receipt-local-reference',
      })
    ).toEqual({ valid: true, errors: {} });
  });

  it('rejects missing identity, invalid amount, date, and description', () => {
    const result = validateExpenseClaimDraft({
      employeeId: ' ',
      category: 'travel',
      amountAed: 0,
      incurredOn: '06/09/2026',
      description: '',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      employeeId: 'Employee ID is required.',
      amountAed: 'Amount must be greater than zero AED.',
      incurredOn: 'Incurred date must use YYYY-MM-DD format.',
      description: 'Description is required.',
    });
  });

  it('rejects unsupported categories at runtime', () => {
    const result = validateExpenseClaimDraft({
      employeeId: 'employee-123',
      category: 'unsupported' as never,
      amountAed: 100,
      incurredOn: '2026-09-06',
      description: 'Unrecognized category should fail.',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.category).toBe('A supported expense category is required.');
  });
});
