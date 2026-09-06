import type { FC, FormEvent } from 'react';
import {
  EXPENSE_CLAIM_CATEGORY_LABELS,
  EXPENSE_CLAIM_FORM_COPY,
} from './data/expenseClaimsForm.data';
import { useExpenseClaimForm } from './logic/useExpenseClaimForm.logic';
import {
  ExpenseClaimActions,
  ExpenseClaimButton,
  ExpenseClaimError,
  ExpenseClaimField,
  ExpenseClaimFormShell,
  ExpenseClaimGrid,
  ExpenseClaimInput,
  ExpenseClaimSelect,
  ExpenseClaimTextarea,
  ExpenseClaimTitle,
} from './styles/ExpenseClaimForm.style';

export interface ExpenseClaimFormProps {
  initialLanguage?: 'en' | 'ar';
  onValidated?: () => void;
}

export const ExpenseClaimForm: FC<ExpenseClaimFormProps> = ({
  initialLanguage = 'en',
  onValidated,
}) => {
  const form = useExpenseClaimForm();
  const language = form.state.language || initialLanguage;
  const copy = EXPENSE_CLAIM_FORM_COPY[language];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.submit()) onValidated?.();
  };

  return (
    <ExpenseClaimFormShell
      onSubmit={handleSubmit}
      noValidate
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <ExpenseClaimTitle>{copy.title}</ExpenseClaimTitle>
      <ExpenseClaimGrid>
        <ExpenseClaimField>
          {copy.employeeId}
          <ExpenseClaimInput
            value={form.state.employeeId}
            aria-invalid={Boolean(form.submitted && form.validation.errors.employeeId)}
            onChange={event => form.update('employeeId', event.target.value)}
          />
        </ExpenseClaimField>
        <ExpenseClaimField>
          {copy.category}
          <ExpenseClaimSelect
            value={form.state.category}
            onChange={event => form.setCategory(event.target.value as typeof form.state.category)}
          >
            {form.categories.map(category => (
              <option key={category} value={category}>
                {EXPENSE_CLAIM_CATEGORY_LABELS[category][language]}
              </option>
            ))}
          </ExpenseClaimSelect>
        </ExpenseClaimField>
        <ExpenseClaimField>
          {copy.amountAed}
          <ExpenseClaimInput
            type="number"
            min="0"
            step="0.01"
            value={form.state.amountAed || ''}
            aria-invalid={Boolean(form.submitted && form.validation.errors.amountAed)}
            onChange={event => form.update('amountAed', Number(event.target.value))}
          />
        </ExpenseClaimField>
        <ExpenseClaimField>
          {copy.incurredOn}
          <ExpenseClaimInput
            type="date"
            value={form.state.incurredOn}
            aria-invalid={Boolean(form.submitted && form.validation.errors.incurredOn)}
            onChange={event => form.update('incurredOn', event.target.value)}
          />
        </ExpenseClaimField>
      </ExpenseClaimGrid>
      <ExpenseClaimField>
        {copy.description}
        <ExpenseClaimTextarea
          value={form.state.description}
          aria-invalid={Boolean(form.submitted && form.validation.errors.description)}
          onChange={event => form.update('description', event.target.value)}
        />
      </ExpenseClaimField>
      <ExpenseClaimField>
        {copy.receiptReference}
        <ExpenseClaimInput
          value={form.state.receiptReference || ''}
          onChange={event => form.update('receiptReference', event.target.value)}
        />
      </ExpenseClaimField>
      <ExpenseClaimField>
        {copy.receiptFile}
        <ExpenseClaimInput
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          onChange={event => form.selectReceipt(event.target.files?.[0])}
          aria-invalid={Boolean(form.submitted && !form.receiptValidation.valid)}
        />
      </ExpenseClaimField>
      {form.submitted && !form.validation.valid && (
        <ExpenseClaimError role="alert">{copy.invalid}</ExpenseClaimError>
      )}
      {form.submitted && !form.receiptValidation.valid && (
        <ExpenseClaimError role="alert">
          {form.receiptValidation.errors.mimeType ||
            form.receiptValidation.errors.sizeBytes ||
            form.receiptValidation.errors.fileName}
        </ExpenseClaimError>
      )}
      <ExpenseClaimActions>
        <ExpenseClaimButton type="submit">{copy.submit}</ExpenseClaimButton>
        <ExpenseClaimButton type="button" $secondary onClick={form.reset}>
          {copy.reset}
        </ExpenseClaimButton>
      </ExpenseClaimActions>
    </ExpenseClaimFormShell>
  );
};

export default ExpenseClaimForm;
