import { describe, expect, it } from 'vitest';
import {
  CHEQUE_STATUSES,
  CHEQUE_TRANSITIONS,
  isChequeRecord,
  isChequeStatus,
  type ChequeRecord,
  type ChequeRecordInput,
  type ChequeStatus,
  type ChequeTransitionOptions,
} from './financeEngineChequeRegistry.types';

function buildRecord(overrides: Partial<ChequeRecord> = {}): ChequeRecord {
  return {
    id: 'cheque-1',
    chequeNumber: '000123',
    amount: 1500,
    issueDate: '2026-01-15',
    ledgerReference: 'lease-42',
    status: 'pending',
    ...overrides,
  };
}

describe('financeEngineChequeRegistry.types', () => {
  describe('CHEQUE_STATUSES', () => {
    it('contains exactly the four defined lifecycle states', () => {
      expect(CHEQUE_STATUSES).toEqual(['pending', 'cleared', 'bounced', 'cancelled']);
    });

    it('has no duplicate entries', () => {
      expect(new Set(CHEQUE_STATUSES).size).toBe(CHEQUE_STATUSES.length);
    });
  });

  describe('CHEQUE_TRANSITIONS', () => {
    it('allows pending to transition to cleared, bounced, or cancelled', () => {
      expect(CHEQUE_TRANSITIONS.pending).toEqual(['cleared', 'bounced', 'cancelled']);
    });

    it('treats cleared, bounced, and cancelled as terminal states', () => {
      expect(CHEQUE_TRANSITIONS.cleared).toEqual([]);
      expect(CHEQUE_TRANSITIONS.bounced).toEqual([]);
      expect(CHEQUE_TRANSITIONS.cancelled).toEqual([]);
    });

    it('defines an entry for every known status', () => {
      for (const status of CHEQUE_STATUSES) {
        expect(Object.prototype.hasOwnProperty.call(CHEQUE_TRANSITIONS, status)).toBe(true);
      }
    });
  });

  describe('isChequeStatus', () => {
    it('returns true for each valid status literal', () => {
      for (const status of CHEQUE_STATUSES) {
        expect(isChequeStatus(status)).toBe(true);
      }
    });

    it('returns false for an unrecognized string', () => {
      expect(isChequeStatus('processing')).toBe(false);
    });

    it('returns false for an empty string', () => {
      expect(isChequeStatus('')).toBe(false);
    });

    it('is case sensitive', () => {
      expect(isChequeStatus('Pending')).toBe(false);
      expect(isChequeStatus('PENDING')).toBe(false);
    });
  });

  describe('isChequeRecord', () => {
    it('returns true for a well-formed minimal record', () => {
      expect(isChequeRecord(buildRecord())).toBe(true);
    });

    it('returns true for a well-formed record with optional fields set', () => {
      expect(
        isChequeRecord(
          buildRecord({
            status: 'cleared',
            clearedDate: '2026-02-01',
            note: 'Cleared on presentation',
          })
        )
      ).toBe(true);
    });

    it('returns false for null', () => {
      expect(isChequeRecord(null)).toBe(false);
    });

    it('returns false for a non-object primitive', () => {
      expect(isChequeRecord('not a record')).toBe(false);
      expect(isChequeRecord(42)).toBe(false);
      expect(isChequeRecord(undefined)).toBe(false);
    });

    it('returns false when a required string field is missing', () => {
      const { id: _id, ...rest } = buildRecord();
      expect(isChequeRecord(rest)).toBe(false);
    });

    it('returns false when amount is not a number', () => {
      expect(isChequeRecord({ ...buildRecord(), amount: '1500' })).toBe(false);
    });

    it('returns false when status is not a recognized ChequeStatus', () => {
      expect(isChequeRecord({ ...buildRecord(), status: 'archived' })).toBe(false);
    });

    it('returns false when clearedDate is present but not a string', () => {
      expect(isChequeRecord({ ...buildRecord(), clearedDate: 20260201 })).toBe(false);
    });

    it('returns false when note is present but not a string', () => {
      expect(isChequeRecord({ ...buildRecord(), note: 12345 })).toBe(false);
    });

    it('narrows the type so ChequeRecord fields are accessible without casts', () => {
      const candidate: unknown = buildRecord({ status: 'bounced' });
      if (isChequeRecord(candidate)) {
        const status: ChequeStatus = candidate.status;
        expect(status).toBe('bounced');
      } else {
        throw new Error('expected candidate to be recognized as a ChequeRecord');
      }
    });
  });

  describe('type-level contracts (compile-time, exercised at runtime via usage)', () => {
    it('allows constructing a ChequeRecordInput without status or clearedDate', () => {
      const input: ChequeRecordInput = {
        id: 'cheque-2',
        chequeNumber: '000456',
        amount: 2500,
        issueDate: '2026-03-01',
        ledgerReference: 'invoice-7',
      };

      expect(input.chequeNumber).toBe('000456');
      expect('status' in input).toBe(false);
    });

    it('allows constructing ChequeTransitionOptions with only the fields needed', () => {
      const options: ChequeTransitionOptions = { clearedDate: '2026-03-05' };
      expect(options.clearedDate).toBe('2026-03-05');
      expect(options.note).toBeUndefined();
    });
  });
});
