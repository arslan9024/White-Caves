import { describe, expect, it } from 'vitest';
import {
  MAX_EXPENSE_RECEIPT_SIZE_BYTES,
  validateExpenseReceiptMetadata,
} from './receiptMetadata.types';

describe('validateExpenseReceiptMetadata', () => {
  it('accepts supported receipt metadata within the size limit', () => {
    expect(
      validateExpenseReceiptMetadata({
        fileName: 'taxi-receipt.png',
        mimeType: 'image/png',
        sizeBytes: 1024,
      })
    ).toEqual({ valid: true, errors: {} });
  });

  it('rejects unsupported types and oversized files', () => {
    const result = validateExpenseReceiptMetadata({
      fileName: 'receipt.exe',
      mimeType: 'application/octet-stream',
      sizeBytes: MAX_EXPENSE_RECEIPT_SIZE_BYTES + 1,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.mimeType).toContain('PDF');
    expect(result.errors.sizeBytes).toContain('10 MB');
  });

  it('rejects empty filenames and zero-byte files', () => {
    const result = validateExpenseReceiptMetadata({
      fileName: ' ',
      mimeType: 'application/pdf',
      sizeBytes: 0,
    });

    expect(result).toEqual({
      valid: false,
      errors: {
        fileName: 'Receipt filename is required.',
        sizeBytes: 'Receipt must be greater than zero and no larger than 10 MB.',
      },
    });
  });
});
