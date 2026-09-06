import { useMemo, useState } from 'react';
import {
  EXPENSE_CLAIM_CATEGORIES,
  type ExpenseClaimCategory,
  type ExpenseClaimDraft,
  validateExpenseClaimDraft,
} from '../expenseClaims.types';
import {
  validateExpenseReceiptMetadata,
  type ExpenseReceiptMetadata,
} from '../receiptMetadata.types';

export interface ExpenseClaimFormState extends ExpenseClaimDraft {
  language: 'en' | 'ar';
  receiptMetadata?: ExpenseReceiptMetadata;
}

const INITIAL_STATE: ExpenseClaimFormState = {
  employeeId: '',
  category: 'other',
  amountAed: 0,
  incurredOn: '',
  description: '',
  receiptReference: '',
  language: 'en',
  receiptMetadata: undefined,
};

export function useExpenseClaimForm() {
  const [state, setState] = useState<ExpenseClaimFormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const validation = useMemo(() => validateExpenseClaimDraft(state), [state]);
  const receiptValidation = useMemo(
    () =>
      state.receiptMetadata
        ? validateExpenseReceiptMetadata(state.receiptMetadata)
        : { valid: true, errors: {} },
    [state.receiptMetadata]
  );

  const update = <K extends keyof ExpenseClaimFormState>(
    key: K,
    value: ExpenseClaimFormState[K]
  ) => {
    setState(current => ({ ...current, [key]: value }));
    setSubmitted(false);
  };

  const setCategory = (category: ExpenseClaimCategory) => update('category', category);
  const selectReceipt = (file: Pick<File, 'name' | 'type' | 'size'> | undefined) => {
    if (!file) {
      update('receiptMetadata', undefined);
      return;
    }
    update('receiptMetadata', { fileName: file.name, mimeType: file.type, sizeBytes: file.size });
  };
  const reset = () => {
    setState(INITIAL_STATE);
    setSubmitted(false);
  };
  const submit = () => {
    setSubmitted(true);
    return validation.valid && receiptValidation.valid;
  };

  return {
    state,
    categories: EXPENSE_CLAIM_CATEGORIES,
    validation,
    receiptValidation,
    submitted,
    update,
    setCategory,
    selectReceipt,
    reset,
    submit,
  };
}
