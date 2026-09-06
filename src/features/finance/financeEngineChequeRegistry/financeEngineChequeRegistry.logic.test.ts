import { describe, expect, it } from 'vitest';
import {
  canTransition,
  createChequeRecord,
  filterByLedgerReference,
  filterByStatus,
  sumOutstandingAmount,
  transitionCheque,
  validateChequeRecord,
  type ChequeRecord,
} from './financeEngineChequeRegistry.logic';

function buildValidRecord(overrides: Partial<ChequeRecord> = {}): ChequeRecord {
  return {
    id: 'chq-1',
    chequeNumber: '000123',
    amount: 5000,
    issueDate: '2024-01-10',
    ledgerReference: 'LEASE-001',
    status: 'pending',
    ...overrides,
  };
}

describe('createChequeRecord', () => {
  it('creates a pending record with trimmed fields for valid input', () => {
    const record = createChequeRecord({
      id: 'chq-1',
      chequeNumber: '  000123  ',
      amount: 2500,
      issueDate: '2024-02-01',
      ledgerReference: '  LEASE-002  ',
    });

    expect(record).toEqual({
      id: 'chq-1',
      chequeNumber: '000123',
      amount: 2500,
      issueDate: '2024-02-01',
      ledgerReference: 'LEASE-002',
      status: 'pending',
    });
  });

  it('preserves an optional note when provided', () => {
    const record = createChequeRecord({
      id: 'chq-2',
      chequeNumber: '111',
      amount: 100,
      issueDate: '2024-01-01',
      ledgerReference: 'INV-1',
      note: 'first installment',
    });

    expect(record.note).toBe('first installment');
  });

  it('throws when amount is zero or negative', () => {
    expect(() =>
      createChequeRecord({
        id: 'chq-3',
        chequeNumber: '111',
        amount: 0,
        issueDate: '2024-01-01',
        ledgerReference: 'INV-1',
      })
    ).toThrow(/amount/);

    expect(() =>
      createChequeRecord({
        id: 'chq-3',
        chequeNumber: '111',
        amount: -10,
        issueDate: '2024-01-01',
        ledgerReference: 'INV-1',
      })
    ).toThrow(/amount/);
  });

  it('throws when chequeNumber is empty after trimming', () => {
    expect(() =>
      createChequeRecord({
        id: 'chq-4',
        chequeNumber: '   ',
        amount: 100,
        issueDate: '2024-01-01',
        ledgerReference: 'INV-1',
      })
    ).toThrow(/chequeNumber/);
  });

  it('throws when ledgerReference is empty after trimming', () => {
    expect(() =>
      createChequeRecord({
        id: 'chq-5',
        chequeNumber: '111',
        amount: 100,
        issueDate: '2024-01-01',
        ledgerReference: '   ',
      })
    ).toThrow(/ledgerReference/);
  });

  it('throws when issueDate is not a valid ISO date', () => {
    expect(() =>
      createChequeRecord({
        id: 'chq-6',
        chequeNumber: '111',
        amount: 100,
        issueDate: '2024-13-40',
        ledgerReference: 'INV-1',
      })
    ).toThrow(/issueDate/);
  });
});

describe('validateChequeRecord', () => {
  it('returns an empty array for a fully valid record', () => {
    expect(validateChequeRecord(buildValidRecord())).toEqual([]);
  });

  it('flags a non-finite or non-positive amount', () => {
    expect(validateChequeRecord(buildValidRecord({ amount: Number.NaN }))).toContain(
      'amount must be a finite number greater than zero'
    );
    expect(validateChequeRecord(buildValidRecord({ amount: -1 }))).toContain(
      'amount must be a finite number greater than zero'
    );
  });

  it('flags an empty chequeNumber', () => {
    expect(validateChequeRecord(buildValidRecord({ chequeNumber: '  ' }))).toContain(
      'chequeNumber must be a non-empty trimmed string'
    );
  });

  it('flags an empty ledgerReference', () => {
    expect(validateChequeRecord(buildValidRecord({ ledgerReference: '' }))).toContain(
      'ledgerReference must be a non-empty trimmed string'
    );
  });

  it('flags an invalid issueDate', () => {
    expect(validateChequeRecord(buildValidRecord({ issueDate: 'not-a-date' }))).toContain(
      'issueDate must be a valid ISO-8601 (YYYY-MM-DD) date'
    );
  });

  it('flags an invalid clearedDate', () => {
    expect(
      validateChequeRecord(buildValidRecord({ status: 'cleared', clearedDate: 'bogus' }))
    ).toContain('clearedDate must be a valid ISO-8601 (YYYY-MM-DD) date');
  });

  it('flags a clearedDate earlier than issueDate', () => {
    expect(
      validateChequeRecord(
        buildValidRecord({ status: 'cleared', issueDate: '2024-02-10', clearedDate: '2024-01-01' })
      )
    ).toContain('clearedDate must not be earlier than issueDate');
  });
});

describe('canTransition', () => {
  it('allows pending -> cleared, pending -> bounced, and pending -> cancelled', () => {
    expect(canTransition('pending', 'cleared')).toBe(true);
    expect(canTransition('pending', 'bounced')).toBe(true);
    expect(canTransition('pending', 'cancelled')).toBe(true);
  });

  it('disallows same-state and all other transitions', () => {
    expect(canTransition('pending', 'pending')).toBe(false);
    expect(canTransition('cleared', 'pending')).toBe(false);
    expect(canTransition('cleared', 'bounced')).toBe(false);
    expect(canTransition('bounced', 'pending')).toBe(false);
    expect(canTransition('bounced', 'cleared')).toBe(false);
    expect(canTransition('cancelled', 'pending')).toBe(false);
    expect(canTransition('cancelled', 'cleared')).toBe(false);
  });
});

describe('transitionCheque', () => {
  it('transitions pending -> cleared with a new object and does not mutate the original', () => {
    const original = buildValidRecord();
    const updated = transitionCheque(original, 'cleared', { clearedDate: '2024-01-15' });

    expect(updated).not.toBe(original);
    expect(updated.status).toBe('cleared');
    expect(updated.clearedDate).toBe('2024-01-15');
    expect(original.status).toBe('pending');
    expect(original.clearedDate).toBeUndefined();
  });

  it('transitions pending -> bounced with a required clearedDate', () => {
    const updated = transitionCheque(buildValidRecord(), 'bounced', { clearedDate: '2024-01-20' });
    expect(updated.status).toBe('bounced');
    expect(updated.clearedDate).toBe('2024-01-20');
  });

  it('transitions pending -> cancelled without requiring a clearedDate', () => {
    const updated = transitionCheque(buildValidRecord(), 'cancelled');
    expect(updated.status).toBe('cancelled');
    expect(updated.clearedDate).toBeUndefined();
  });

  it('applies an updated note during a transition', () => {
    const updated = transitionCheque(buildValidRecord(), 'cancelled', {
      note: 'cancelled by tenant',
    });
    expect(updated.note).toBe('cancelled by tenant');
  });

  it('throws with the exact message for an invalid transition', () => {
    const cleared = buildValidRecord({ status: 'cleared', clearedDate: '2024-01-15' });
    expect(() => transitionCheque(cleared, 'pending')).toThrow(
      'Invalid cheque transition: cleared -> pending'
    );
  });

  it('throws when clearedDate is missing for a cleared transition', () => {
    expect(() => transitionCheque(buildValidRecord(), 'cleared')).toThrow(
      /clearedDate is required/
    );
  });

  it('throws when clearedDate is missing for a bounced transition', () => {
    expect(() => transitionCheque(buildValidRecord(), 'bounced')).toThrow(
      /clearedDate is required/
    );
  });

  it('throws when the resulting record would be invalid (clearedDate before issueDate)', () => {
    expect(() =>
      transitionCheque(buildValidRecord({ issueDate: '2024-05-01' }), 'cleared', {
        clearedDate: '2024-01-01',
      })
    ).toThrow(/clearedDate must not be earlier than issueDate/);
  });
});

describe('filterByStatus', () => {
  it('returns only records matching the given status', () => {
    const records = [
      buildValidRecord({ id: 'a', status: 'pending' }),
      buildValidRecord({ id: 'b', status: 'cleared', clearedDate: '2024-01-11' }),
      buildValidRecord({ id: 'c', status: 'pending' }),
    ];

    expect(filterByStatus(records, 'pending').map(r => r.id)).toEqual(['a', 'c']);
    expect(filterByStatus(records, 'cleared').map(r => r.id)).toEqual(['b']);
  });

  it('returns an empty array for an empty input', () => {
    expect(filterByStatus([], 'pending')).toEqual([]);
  });
});

describe('filterByLedgerReference', () => {
  it('returns only records matching the given ledgerReference', () => {
    const records = [
      buildValidRecord({ id: 'a', ledgerReference: 'LEASE-001' }),
      buildValidRecord({ id: 'b', ledgerReference: 'LEASE-002' }),
      buildValidRecord({ id: 'c', ledgerReference: 'LEASE-001' }),
    ];

    expect(filterByLedgerReference(records, 'LEASE-001').map(r => r.id)).toEqual(['a', 'c']);
  });

  it('returns an empty array when no records match', () => {
    const records = [buildValidRecord({ id: 'a', ledgerReference: 'LEASE-001' })];
    expect(filterByLedgerReference(records, 'LEASE-999')).toEqual([]);
  });

  it('returns an empty array for an empty input', () => {
    expect(filterByLedgerReference([], 'LEASE-001')).toEqual([]);
  });
});

describe('sumOutstandingAmount', () => {
  it('sums only pending record amounts', () => {
    const records = [
      buildValidRecord({ id: 'a', amount: 100, status: 'pending' }),
      buildValidRecord({ id: 'b', amount: 200, status: 'cleared', clearedDate: '2024-01-11' }),
      buildValidRecord({ id: 'c', amount: 300, status: 'pending' }),
    ];

    expect(sumOutstandingAmount(records)).toBe(400);
  });

  it('returns 0 for the empty-array edge case', () => {
    expect(sumOutstandingAmount([])).toBe(0);
  });

  it('returns 0 when no records are pending', () => {
    const records = [
      buildValidRecord({ id: 'a', amount: 100, status: 'cancelled' }),
      buildValidRecord({ id: 'b', amount: 200, status: 'bounced', clearedDate: '2024-01-11' }),
    ];

    expect(sumOutstandingAmount(records)).toBe(0);
  });
});
