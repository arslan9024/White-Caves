import { describe, expect, it } from 'vitest';
import {
  assertValidCommissionLedgerEntry,
  calculateNetCommission,
  CommissionLedgerEntry,
  CommissionLedgerValidationError,
  filterCommissionLedgerEntriesByStatus,
  isCommissionLedgerEntry,
  isCommissionLedgerStatus,
  isCommissionType,
  isEntryFinalized,
  isEntryPayable,
  sortCommissionLedgerEntriesByCreatedAt,
  summarizeCommissionLedgerEntries,
} from './financeEngineCommissionLedger.types';

function buildEntry(overrides: Partial<CommissionLedgerEntry> = {}): CommissionLedgerEntry {
  const grossAmount = overrides.grossAmount ?? 10000;
  const commissionRate = overrides.commissionRate ?? 0.05;
  return {
    id: 'entry-1',
    agentId: 'agent-1',
    dealId: 'deal-1',
    type: 'sale',
    status: 'pending',
    grossAmount,
    commissionRate,
    netAmount: calculateNetCommission(grossAmount, commissionRate),
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('isCommissionLedgerStatus', () => {
  it('accepts all known statuses', () => {
    expect(isCommissionLedgerStatus('pending')).toBe(true);
    expect(isCommissionLedgerStatus('approved')).toBe(true);
    expect(isCommissionLedgerStatus('paid')).toBe(true);
    expect(isCommissionLedgerStatus('reversed')).toBe(true);
    expect(isCommissionLedgerStatus('disputed')).toBe(true);
  });

  it('rejects unknown or non-string values', () => {
    expect(isCommissionLedgerStatus('cancelled')).toBe(false);
    expect(isCommissionLedgerStatus(42)).toBe(false);
    expect(isCommissionLedgerStatus(null)).toBe(false);
    expect(isCommissionLedgerStatus(undefined)).toBe(false);
  });
});

describe('isCommissionType', () => {
  it('accepts all known types', () => {
    expect(isCommissionType('referral')).toBe(true);
    expect(isCommissionType('sale')).toBe(true);
    expect(isCommissionType('renewal')).toBe(true);
    expect(isCommissionType('bonus')).toBe(true);
    expect(isCommissionType('override')).toBe(true);
  });

  it('rejects unknown or non-string values', () => {
    expect(isCommissionType('kickback')).toBe(false);
    expect(isCommissionType({})).toBe(false);
  });
});

describe('isCommissionLedgerEntry', () => {
  it('returns true for a well-formed entry', () => {
    expect(isCommissionLedgerEntry(buildEntry())).toBe(true);
  });

  it('returns false when required fields are missing', () => {
    const { id: _id, ...rest } = buildEntry();
    expect(isCommissionLedgerEntry(rest)).toBe(false);
  });

  it('returns false when status is invalid', () => {
    expect(isCommissionLedgerEntry({ ...buildEntry(), status: 'cancelled' })).toBe(false);
  });

  it('returns false for non-object values', () => {
    expect(isCommissionLedgerEntry(null)).toBe(false);
    expect(isCommissionLedgerEntry('entry')).toBe(false);
    expect(isCommissionLedgerEntry(123)).toBe(false);
  });

  it('accepts optional fields when present with correct types', () => {
    const entry = buildEntry({ paidAt: '2024-02-01T00:00:00.000Z', notes: 'ok' });
    expect(isCommissionLedgerEntry(entry)).toBe(true);
  });
});

describe('calculateNetCommission', () => {
  it('computes gross * rate rounded to two decimals', () => {
    expect(calculateNetCommission(10000, 0.05)).toBe(500);
    expect(calculateNetCommission(999.99, 0.1)).toBe(100);
    expect(calculateNetCommission(0, 0.5)).toBe(0);
  });

  it('rounds fractional cents correctly', () => {
    expect(calculateNetCommission(33.333, 0.1)).toBe(3.33);
  });
});

describe('assertValidCommissionLedgerEntry', () => {
  it('does not throw for a valid entry', () => {
    expect(() => assertValidCommissionLedgerEntry(buildEntry())).not.toThrow();
  });

  it('throws CommissionLedgerValidationError for negative grossAmount', () => {
    expect(() =>
      assertValidCommissionLedgerEntry(buildEntry({ grossAmount: -100, netAmount: -5 }))
    ).toThrow(CommissionLedgerValidationError);
  });

  it('throws for commissionRate outside [0, 1]', () => {
    expect(() =>
      assertValidCommissionLedgerEntry(buildEntry({ commissionRate: 1.5, netAmount: 15000 }))
    ).toThrow(CommissionLedgerValidationError);
  });

  it('throws when netAmount is inconsistent with gross * rate', () => {
    expect(() =>
      assertValidCommissionLedgerEntry(
        buildEntry({ grossAmount: 10000, commissionRate: 0.05, netAmount: 999 })
      )
    ).toThrow(CommissionLedgerValidationError);
  });
});

describe('isEntryPayable', () => {
  it('is true only for approved entries', () => {
    expect(isEntryPayable(buildEntry({ status: 'approved' }))).toBe(true);
    expect(isEntryPayable(buildEntry({ status: 'pending' }))).toBe(false);
    expect(isEntryPayable(buildEntry({ status: 'paid' }))).toBe(false);
  });
});

describe('isEntryFinalized', () => {
  it('is true for paid or reversed entries', () => {
    expect(isEntryFinalized(buildEntry({ status: 'paid' }))).toBe(true);
    expect(isEntryFinalized(buildEntry({ status: 'reversed' }))).toBe(true);
  });

  it('is false for pending, approved, or disputed entries', () => {
    expect(isEntryFinalized(buildEntry({ status: 'pending' }))).toBe(false);
    expect(isEntryFinalized(buildEntry({ status: 'approved' }))).toBe(false);
    expect(isEntryFinalized(buildEntry({ status: 'disputed' }))).toBe(false);
  });
});

describe('summarizeCommissionLedgerEntries', () => {
  it('aggregates totals across mixed statuses for one agent', () => {
    const entries = [
      buildEntry({
        id: 'e1',
        status: 'paid',
        grossAmount: 10000,
        commissionRate: 0.05,
        netAmount: 500,
      }),
      buildEntry({
        id: 'e2',
        status: 'pending',
        grossAmount: 4000,
        commissionRate: 0.1,
        netAmount: 400,
      }),
      buildEntry({
        id: 'e3',
        status: 'reversed',
        grossAmount: 2000,
        commissionRate: 0.1,
        netAmount: 200,
      }),
    ];

    const summary = summarizeCommissionLedgerEntries(entries);

    expect(summary.agentId).toBe('agent-1');
    expect(summary.currency).toBe('USD');
    expect(summary.entryCount).toBe(3);
    expect(summary.totalGross).toBe(16000);
    expect(summary.totalNet).toBe(1100);
    expect(summary.totalPaid).toBe(500);
    expect(summary.totalPending).toBe(400);
    expect(summary.totalReversed).toBe(200);
  });

  it('throws when the entry list is empty', () => {
    expect(() => summarizeCommissionLedgerEntries([])).toThrow(CommissionLedgerValidationError);
  });

  it('throws when entries belong to different agents', () => {
    const entries = [
      buildEntry({ id: 'e1', agentId: 'agent-1' }),
      buildEntry({ id: 'e2', agentId: 'agent-2' }),
    ];
    expect(() => summarizeCommissionLedgerEntries(entries)).toThrow(
      CommissionLedgerValidationError
    );
  });

  it('throws when entries have mismatched currencies', () => {
    const entries = [
      buildEntry({ id: 'e1', currency: 'USD' }),
      buildEntry({ id: 'e2', currency: 'AED' }),
    ];
    expect(() => summarizeCommissionLedgerEntries(entries)).toThrow(
      CommissionLedgerValidationError
    );
  });
});

describe('sortCommissionLedgerEntriesByCreatedAt', () => {
  it('sorts entries ascending by createdAt without mutating input', () => {
    const entries = [
      buildEntry({ id: 'e2', createdAt: '2024-03-01T00:00:00.000Z' }),
      buildEntry({ id: 'e1', createdAt: '2024-01-01T00:00:00.000Z' }),
      buildEntry({ id: 'e3', createdAt: '2024-02-01T00:00:00.000Z' }),
    ];
    const originalOrder = entries.map(entry => entry.id);

    const sorted = sortCommissionLedgerEntriesByCreatedAt(entries);

    expect(sorted.map(entry => entry.id)).toEqual(['e1', 'e3', 'e2']);
    expect(entries.map(entry => entry.id)).toEqual(originalOrder);
  });
});

describe('filterCommissionLedgerEntriesByStatus', () => {
  it('returns only entries matching the requested status', () => {
    const entries = [
      buildEntry({ id: 'e1', status: 'pending' }),
      buildEntry({ id: 'e2', status: 'paid' }),
      buildEntry({ id: 'e3', status: 'pending' }),
    ];

    const pending = filterCommissionLedgerEntriesByStatus(entries, 'pending');

    expect(pending).toHaveLength(2);
    expect(pending.map(entry => entry.id)).toEqual(['e1', 'e3']);
  });

  it('returns an empty array when no entries match', () => {
    const entries = [buildEntry({ status: 'pending' })];
    expect(filterCommissionLedgerEntriesByStatus(entries, 'disputed')).toEqual([]);
  });
});
