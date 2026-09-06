import React, { useCallback, useMemo, useState } from 'react';

/**
 * Supported expense categories for a claim line item.
 */
export type ExpenseCategory =
  | 'travel'
  | 'accommodation'
  | 'meals'
  | 'supplies'
  | 'software'
  | 'other';

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'travel',
  'accommodation',
  'meals',
  'supplies',
  'software',
  'other',
];

/**
 * Allow-listed MIME types for an expense receipt attachment.
 * Mirrors the conservative allow-list used by the expense claim approval
 * workflow (image capture or scanned PDF only).
 */
export type ReceiptMimeType = 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf';

export const ALLOWED_RECEIPT_MIME_TYPES: readonly ReceiptMimeType[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
];

/** Amount (in the claim's currency) at or below which no receipt is required. */
export const RECEIPT_REQUIRED_THRESHOLD = 25;

/** Upper bound for an individual receipt file's declared size (10 MiB). */
export const MAX_RECEIPT_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Metadata describing a single receipt attachment.
 * This form captures only attachment metadata; the actual file
 * upload/storage transport is out of scope for this component.
 */
export interface ReceiptAttachment {
  id: string;
  url: string;
  mimeType: ReceiptMimeType | string;
  fileSizeBytes: number;
  uploadedAt: string; // ISO-8601 timestamp
}

/**
 * A single line item within an expense claim.
 */
export interface ExpenseClaimLineItem {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  incurredOn: string; // ISO date string (YYYY-MM-DD)
  receipts?: readonly ReceiptAttachment[];
}

/**
 * The full payload submitted when a user creates/updates an expense claim.
 */
export interface ExpenseClaimFormValues {
  claimantName: string;
  department: string;
  notes: string;
  lineItems: ExpenseClaimLineItem[];
}

export interface ExpenseClaimFormErrors {
  claimantName?: string;
  department?: string;
  lineItems?: string;
  lineItemErrors: Record<string, Partial<Record<keyof ExpenseClaimLineItem, string>>>;
}

export interface ExpenseClaimFormProps {
  /** Initial values used to prefill the form (e.g. when editing a draft claim). */
  initialValues?: Partial<ExpenseClaimFormValues>;
  /** Called with the validated, normalized form values on successful submit. */
  onSubmit: (values: ExpenseClaimFormValues) => void;
  /** Called when the user cancels editing. */
  onCancel?: () => void;
  /** Disables all inputs and hides submit/cancel actions while true. */
  isSubmitting?: boolean;
}

const MAX_NOTES_LENGTH = 1000;
const MAX_LINE_ITEMS = 50;

let idCounter = 0;

function createLineItemId(): string {
  idCounter += 1;
  return `line-item-${Date.now()}-${idCounter}`;
}

function createEmptyLineItem(): ExpenseClaimLineItem {
  return {
    id: createLineItemId(),
    description: '',
    category: 'other',
    amount: 0,
    incurredOn: '',
    receipts: [],
  };
}

function createReceiptId(): string {
  idCounter += 1;
  return `receipt-${Date.now()}-${idCounter}`;
}

function createEmptyReceipt(): ReceiptAttachment {
  return {
    id: createReceiptId(),
    url: '',
    mimeType: 'image/jpeg',
    fileSizeBytes: 0,
    uploadedAt: '',
  };
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

/**
 * Returns `true` when a line item's amount exceeds `RECEIPT_REQUIRED_THRESHOLD`
 * and therefore requires at least one valid receipt attachment.
 * Non-finite amounts are treated as requiring a receipt (fail safe).
 */
export function requiresReceipt(amount: number): boolean {
  if (!Number.isFinite(amount)) {
    return true;
  }
  return amount > RECEIPT_REQUIRED_THRESHOLD;
}

/**
 * Structurally validates a single receipt attachment: non-blank id/url,
 * an allow-listed MIME type, a positive file size within the configured
 * limit, and a parseable `uploadedAt` timestamp.
 */
export function isValidReceipt(receipt: ReceiptAttachment): boolean {
  if (!receipt.id.trim() || !receipt.url.trim()) {
    return false;
  }
  if (!ALLOWED_RECEIPT_MIME_TYPES.includes(receipt.mimeType as ReceiptMimeType)) {
    return false;
  }
  if (
    !Number.isFinite(receipt.fileSizeBytes) ||
    receipt.fileSizeBytes <= 0 ||
    receipt.fileSizeBytes > MAX_RECEIPT_FILE_SIZE_BYTES
  ) {
    return false;
  }
  if (!receipt.uploadedAt || Number.isNaN(Date.parse(receipt.uploadedAt))) {
    return false;
  }
  return true;
}

/** Whether the given line item carries at least one valid receipt attachment. */
export function hasValidReceiptForLineItem(item: ExpenseClaimLineItem): boolean {
  const receipts = item.receipts ?? [];
  return receipts.some(isValidReceipt);
}

/** Whether a line item satisfies the receipt requirement for its amount. */
export function lineItemSatisfiesReceiptRequirement(item: ExpenseClaimLineItem): boolean {
  if (!requiresReceipt(item.amount)) {
    return true;
  }
  return hasValidReceiptForLineItem(item);
}

/**
 * Produces a deterministic, human-readable summary of receipt compliance
 * across all line items in the given claim values.
 */
export function summarizeReceiptStatus(values: ExpenseClaimFormValues): string {
  const requiring = values.lineItems.filter(item => requiresReceipt(item.amount));
  const satisfied = requiring.filter(hasValidReceiptForLineItem);

  if (requiring.length === 0) {
    return 'No line items require a receipt.';
  }

  return `${satisfied.length} of ${requiring.length} line item(s) requiring a receipt have a valid receipt attached.`;
}

/**
 * Validates the given expense claim form values.
 * Returns an errors object; a claim is valid when every field is `undefined`
 * and `lineItemErrors` is empty.
 */
export function validateExpenseClaim(values: ExpenseClaimFormValues): ExpenseClaimFormErrors {
  const errors: ExpenseClaimFormErrors = { lineItemErrors: {} };

  if (!values.claimantName.trim()) {
    errors.claimantName = 'Claimant name is required.';
  }

  if (!values.department.trim()) {
    errors.department = 'Department is required.';
  }

  if (values.lineItems.length === 0) {
    errors.lineItems = 'At least one expense line item is required.';
  } else if (values.lineItems.length > MAX_LINE_ITEMS) {
    errors.lineItems = `A claim cannot contain more than ${MAX_LINE_ITEMS} line items.`;
  }

  for (const item of values.lineItems) {
    const itemErrors: Partial<Record<keyof ExpenseClaimLineItem, string>> = {};

    if (!item.description.trim()) {
      itemErrors.description = 'Description is required.';
    }

    if (!EXPENSE_CATEGORIES.includes(item.category)) {
      itemErrors.category = 'Select a valid category.';
    }

    if (!Number.isFinite(item.amount) || item.amount <= 0) {
      itemErrors.amount = 'Amount must be a positive number.';
    }

    if (!item.incurredOn || !isValidIsoDate(item.incurredOn)) {
      itemErrors.incurredOn = 'Enter a valid date (YYYY-MM-DD).';
    }

    if (!lineItemSatisfiesReceiptRequirement(item)) {
      itemErrors.receipts = `A valid receipt is required for amounts over ${RECEIPT_REQUIRED_THRESHOLD}.`;
    }

    if (Object.keys(itemErrors).length > 0) {
      errors.lineItemErrors[item.id] = itemErrors;
    }
  }

  return errors;
}

export function hasExpenseClaimErrors(errors: ExpenseClaimFormErrors): boolean {
  return Boolean(
    errors.claimantName ||
      errors.department ||
      errors.lineItems ||
      Object.keys(errors.lineItemErrors).length > 0
  );
}

export function calculateExpenseClaimTotal(lineItems: readonly ExpenseClaimLineItem[]): number {
  return lineItems.reduce((sum, item) => {
    const amount = Number.isFinite(item.amount) ? item.amount : 0;
    return sum + amount;
  }, 0);
}

function buildInitialValues(
  initialValues?: Partial<ExpenseClaimFormValues>
): ExpenseClaimFormValues {
  return {
    claimantName: initialValues?.claimantName ?? '',
    department: initialValues?.department ?? '',
    notes: initialValues?.notes ?? '',
    lineItems:
      initialValues?.lineItems && initialValues.lineItems.length > 0
        ? initialValues.lineItems
        : [createEmptyLineItem()],
  };
}

export const ExpenseClaimForm: React.FC<ExpenseClaimFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [values, setValues] = useState<ExpenseClaimFormValues>(() =>
    buildInitialValues(initialValues)
  );
  const [errors, setErrors] = useState<ExpenseClaimFormErrors>({ lineItemErrors: {} });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const total = useMemo(() => calculateExpenseClaimTotal(values.lineItems), [values.lineItems]);

  const updateField = useCallback(
    <K extends keyof Omit<ExpenseClaimFormValues, 'lineItems'>>(
      field: K,
      value: ExpenseClaimFormValues[K]
    ) => {
      setValues(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateLineItem = useCallback(
    <K extends keyof ExpenseClaimLineItem>(
      id: string,
      field: K,
      value: ExpenseClaimLineItem[K]
    ) => {
      setValues(prev => ({
        ...prev,
        lineItems: prev.lineItems.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const addLineItem = useCallback(() => {
    setValues(prev => {
      if (prev.lineItems.length >= MAX_LINE_ITEMS) {
        return prev;
      }
      return { ...prev, lineItems: [...prev.lineItems, createEmptyLineItem()] };
    });
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setValues(prev => ({
      ...prev,
      lineItems:
        prev.lineItems.length > 1 ? prev.lineItems.filter(item => item.id !== id) : prev.lineItems,
    }));
  }, []);

  const addReceipt = useCallback((lineItemId: string) => {
    setValues(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === lineItemId
          ? { ...item, receipts: [...(item.receipts ?? []), createEmptyReceipt()] }
          : item
      ),
    }));
  }, []);

  const updateReceipt = useCallback(
    <K extends keyof ReceiptAttachment>(
      lineItemId: string,
      receiptId: string,
      field: K,
      value: ReceiptAttachment[K]
    ) => {
      setValues(prev => ({
        ...prev,
        lineItems: prev.lineItems.map(item =>
          item.id === lineItemId
            ? {
                ...item,
                receipts: (item.receipts ?? []).map(receipt =>
                  receipt.id === receiptId ? { ...receipt, [field]: value } : receipt
                ),
              }
            : item
        ),
      }));
    },
    []
  );

  const removeReceipt = useCallback((lineItemId: string, receiptId: string) => {
    setValues(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === lineItemId
          ? { ...item, receipts: (item.receipts ?? []).filter(receipt => receipt.id !== receiptId) }
          : item
      ),
    }));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setHasAttemptedSubmit(true);
      const validationErrors = validateExpenseClaim(values);
      setErrors(validationErrors);
      if (!hasExpenseClaimErrors(validationErrors)) {
        onSubmit(values);
      }
    },
    [values, onSubmit]
  );

  return (
    <form
      aria-label="Expense claim form"
      noValidate
      onSubmit={handleSubmit}
      data-testid="expense-claim-form"
    >
      <fieldset disabled={isSubmitting}>
        <legend>Claim details</legend>

        <label htmlFor="expense-claimant-name">Claimant name</label>
        <input
          id="expense-claimant-name"
          name="claimantName"
          type="text"
          value={values.claimantName}
          onChange={event => updateField('claimantName', event.target.value)}
        />
        {hasAttemptedSubmit && errors.claimantName ? (
          <span role="alert">{errors.claimantName}</span>
        ) : null}

        <label htmlFor="expense-department">Department</label>
        <input
          id="expense-department"
          name="department"
          type="text"
          value={values.department}
          onChange={event => updateField('department', event.target.value)}
        />
        {hasAttemptedSubmit && errors.department ? (
          <span role="alert">{errors.department}</span>
        ) : null}

        <label htmlFor="expense-notes">Notes</label>
        <textarea
          id="expense-notes"
          name="notes"
          maxLength={MAX_NOTES_LENGTH}
          value={values.notes}
          onChange={event => updateField('notes', event.target.value)}
        />

        <div role="group" aria-label="Line items">
          {hasAttemptedSubmit && errors.lineItems ? (
            <span role="alert">{errors.lineItems}</span>
          ) : null}

          {values.lineItems.map((item, index) => {
            const itemErrors = errors.lineItemErrors[item.id] ?? {};
            return (
              <div key={item.id} data-testid={`line-item-${index}`}>
                <label htmlFor={`line-item-description-${item.id}`}>Description</label>
                <input
                  id={`line-item-description-${item.id}`}
                  type="text"
                  value={item.description}
                  onChange={event => updateLineItem(item.id, 'description', event.target.value)}
                />
                {hasAttemptedSubmit && itemErrors.description ? (
                  <span role="alert">{itemErrors.description}</span>
                ) : null}

                <label htmlFor={`line-item-category-${item.id}`}>Category</label>
                <select
                  id={`line-item-category-${item.id}`}
                  value={item.category}
                  onChange={event =>
                    updateLineItem(item.id, 'category', event.target.value as ExpenseCategory)
                  }
                >
                  {EXPENSE_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <label htmlFor={`line-item-amount-${item.id}`}>Amount</label>
                <input
                  id={`line-item-amount-${item.id}`}
                  type="number"
                  step="0.01"
                  value={item.amount}
                  onChange={event =>
                    updateLineItem(item.id, 'amount', Number.parseFloat(event.target.value) || 0)
                  }
                />
                {hasAttemptedSubmit && itemErrors.amount ? (
                  <span role="alert">{itemErrors.amount}</span>
                ) : null}

                <label htmlFor={`line-item-date-${item.id}`}>Date incurred</label>
                <input
                  id={`line-item-date-${item.id}`}
                  type="date"
                  value={item.incurredOn}
                  onChange={event => updateLineItem(item.id, 'incurredOn', event.target.value)}
                />
                {hasAttemptedSubmit && itemErrors.incurredOn ? (
                  <span role="alert">{itemErrors.incurredOn}</span>
                ) : null}

                <div role="group" aria-label={`Receipts for line item ${index + 1}`}>
                  {(item.receipts ?? []).map((receipt, receiptIndex) => (
                    <div
                      key={receipt.id}
                      data-testid={`line-item-${index}-receipt-${receiptIndex}`}
                    >
                      <label htmlFor={`receipt-url-${receipt.id}`}>Receipt URL</label>
                      <input
                        id={`receipt-url-${receipt.id}`}
                        type="text"
                        value={receipt.url}
                        onChange={event =>
                          updateReceipt(item.id, receipt.id, 'url', event.target.value)
                        }
                      />

                      <label htmlFor={`receipt-mime-${receipt.id}`}>File type</label>
                      <select
                        id={`receipt-mime-${receipt.id}`}
                        value={receipt.mimeType}
                        onChange={event =>
                          updateReceipt(
                            item.id,
                            receipt.id,
                            'mimeType',
                            event.target.value as ReceiptMimeType
                          )
                        }
                      >
                        {ALLOWED_RECEIPT_MIME_TYPES.map(mimeType => (
                          <option key={mimeType} value={mimeType}>
                            {mimeType}
                          </option>
                        ))}
                      </select>

                      <label htmlFor={`receipt-size-${receipt.id}`}>File size (bytes)</label>
                      <input
                        id={`receipt-size-${receipt.id}`}
                        type="number"
                        value={receipt.fileSizeBytes}
                        onChange={event =>
                          updateReceipt(
                            item.id,
                            receipt.id,
                            'fileSizeBytes',
                            Number.parseInt(event.target.value, 10) || 0
                          )
                        }
                      />

                      <label htmlFor={`receipt-uploaded-${receipt.id}`}>Uploaded at</label>
                      <input
                        id={`receipt-uploaded-${receipt.id}`}
                        type="datetime-local"
                        value={receipt.uploadedAt}
                        onChange={event =>
                          updateReceipt(item.id, receipt.id, 'uploadedAt', event.target.value)
                        }
                      />

                      <button type="button" onClick={() => removeReceipt(item.id, receipt.id)}>
                        Remove receipt
                      </button>
                    </div>
                  ))}

                  <button type="button" onClick={() => addReceipt(item.id)}>
                    Add receipt
                  </button>

                  {hasAttemptedSubmit && itemErrors.receipts ? (
                    <span role="alert">{itemErrors.receipts}</span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => removeLineItem(item.id)}
                  disabled={values.lineItems.length <= 1}
                >
                  Remove line item
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addLineItem}
            disabled={values.lineItems.length >= MAX_LINE_ITEMS}
          >
            Add line item
          </button>
        </div>

        <div data-testid="expense-claim-receipt-summary">{summarizeReceiptStatus(values)}</div>

        <div data-testid="expense-claim-total">Total: {total.toFixed(2)}</div>

        <div>
          <button type="submit">Submit claim</button>
          {onCancel ? (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
        </div>
      </fieldset>
    </form>
  );
};

export default ExpenseClaimForm;
