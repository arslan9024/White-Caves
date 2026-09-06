import { describe, expect, it } from 'vitest';
import {
  LEDGER_DIRECTIONS,
  REJECTION_REASONS,
  SUPPORTED_CURRENCIES,
  createPostedResult,
  createRejectedResult,
  isPostedTransferResult,
  isRejectedTransferResult,
  isRejectionReason,
  isSupportedCurrency,
  type IntercompanyTransferResult,
  type LedgerEntry,
} from './financeEngineIntercompanyTransfer.types';

function makeLedgerEntry(overrides: Partial<LedgerEntry> = {}): LedgerEntry {
  return {
    id: 'ledger-1',
    entityId: 'entity-a',
    direction: 'debit',
    amountMinorUnits: 1_000,
    currency: 'AED',
    requestId: 'req-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('financeEngineIntercompanyTransfer.types', () => {
  describe('SUPPORTED_CURRENCIES / isSupportedCurrency', () => {
    it('lists exactly the four allow-listed currencies', () => {
      expect(SUPPORTED_CURRENCIES).toEqual(['AED', 'USD', 'EUR', 'GBP']);
    });

    it('returns true for each supported currency', () => {
      for (const currency of SUPPORTED_CURRENCIES) {
        expect(isSupportedCurrency(currency)).toBe(true);
      }
    });

    it('returns false for an unsupported currency code', () => {
      expect(isSupportedCurrency('JPY')).toBe(false);
      expect(isSupportedCurrency('')).toBe(false);
      expect(isSupportedCurrency('aed')).toBe(false);
    });
  });

  describe('REJECTION_REASONS / isRejectionReason', () => {
    it('is ordered per SDD §3.1: structural checks before authorization before duplicate detection', () => {
      expect(REJECTION_REASONS).toEqual([
        'SAME_ENTITY',
        'NON_POSITIVE_AMOUNT',
        'UNSUPPORTED_CURRENCY',
        'UNKNOWN_ENTITY',
        'INSUFFICIENT_AUTHORIZATION',
        'DUPLICATE_REQUEST_ID',
      ]);
    });

    it('recognizes every listed reason as valid', () => {
      for (const reason of REJECTION_REASONS) {
        expect(isRejectionReason(reason)).toBe(true);
      }
    });

    it('rejects a string that is not a known rejection reason', () => {
      expect(isRejectionReason('NOT_A_REAL_REASON')).toBe(false);
    });
  });

  describe('LEDGER_DIRECTIONS', () => {
    it('contains exactly debit and credit', () => {
      expect(LEDGER_DIRECTIONS).toEqual(['debit', 'credit']);
    });
  });

  describe('createRejectedResult', () => {
    it('builds a RejectedTransferResult with the given requestId and reason', () => {
      const result = createRejectedResult('req-42', 'SAME_ENTITY');
      expect(result).toEqual({ status: 'rejected', requestId: 'req-42', reason: 'SAME_ENTITY' });
    });
  });

  describe('createPostedResult', () => {
    it('builds a PostedTransferResult carrying the given debit/credit entries', () => {
      const debitEntry = makeLedgerEntry({ id: 'debit-1', direction: 'debit' });
      const creditEntry = makeLedgerEntry({
        id: 'credit-1',
        entityId: 'entity-b',
        direction: 'credit',
      });

      const result = createPostedResult('req-7', debitEntry, creditEntry);

      expect(result).toEqual({
        status: 'posted',
        requestId: 'req-7',
        debitEntry,
        creditEntry,
      });
    });
  });

  describe('isPostedTransferResult / isRejectedTransferResult', () => {
    it('narrows a posted result correctly and excludes it from the rejected guard', () => {
      const posted: IntercompanyTransferResult = createPostedResult(
        'req-1',
        makeLedgerEntry({ id: 'debit-1' }),
        makeLedgerEntry({ id: 'credit-1', entityId: 'entity-b', direction: 'credit' })
      );

      expect(isPostedTransferResult(posted)).toBe(true);
      expect(isRejectedTransferResult(posted)).toBe(false);

      if (isPostedTransferResult(posted)) {
        // Compile-time proof of narrowing: debitEntry/creditEntry are accessible here.
        expect(posted.debitEntry.id).toBe('debit-1');
        expect(posted.creditEntry.id).toBe('credit-1');
      }
    });

    it('narrows a rejected result correctly and excludes it from the posted guard', () => {
      const rejected: IntercompanyTransferResult = createRejectedResult(
        'req-2',
        'UNSUPPORTED_CURRENCY'
      );

      expect(isRejectedTransferResult(rejected)).toBe(true);
      expect(isPostedTransferResult(rejected)).toBe(false);

      if (isRejectedTransferResult(rejected)) {
        expect(rejected.reason).toBe('UNSUPPORTED_CURRENCY');
      }
    });
  });
});
