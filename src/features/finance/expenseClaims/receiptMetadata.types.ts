export const EXPENSE_RECEIPT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;
export const MAX_EXPENSE_RECEIPT_SIZE_BYTES = 10 * 1024 * 1024;

export type ExpenseReceiptMimeType = (typeof EXPENSE_RECEIPT_MIME_TYPES)[number];

export interface ExpenseReceiptMetadata {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ExpenseReceiptValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ExpenseReceiptMetadata, string>>;
}

export function validateExpenseReceiptMetadata(
  metadata: ExpenseReceiptMetadata
): ExpenseReceiptValidationResult {
  const errors: ExpenseReceiptValidationResult['errors'] = {};

  if (!metadata.fileName.trim()) errors.fileName = 'Receipt filename is required.';
  if (!EXPENSE_RECEIPT_MIME_TYPES.includes(metadata.mimeType as ExpenseReceiptMimeType)) {
    errors.mimeType = 'Receipt must be a PDF, JPEG, or PNG file.';
  }
  if (
    !Number.isInteger(metadata.sizeBytes) ||
    metadata.sizeBytes <= 0 ||
    metadata.sizeBytes > MAX_EXPENSE_RECEIPT_SIZE_BYTES
  ) {
    errors.sizeBytes = 'Receipt must be greater than zero and no larger than 10 MB.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
