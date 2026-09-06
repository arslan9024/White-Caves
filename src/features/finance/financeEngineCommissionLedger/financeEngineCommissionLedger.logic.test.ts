import { describe, expect, it } from 'vitest';
import {
  approveCommissionLedgerEntry,
  calculateTotalCommission,
  createCommissionLedgerEntry,
  filterCommissionLedgerEntriesByAgent,
  filterCommissionLedgerEntriesByDeal,
  groupCommissionTotalsByAgent,
  isCommissionLedgerEntryActionable,
  markCommissionLedgerEntryPaid,
  reverseCommissionLedgerEntry,
  roundToCents,
  summarizeCommissionLedger,
  validateCreateCommissionLedgerEntryInput,
  type CommissionLedgerEntry,
  type CreateCommissionLedgerEntryInput,
} from './financeEngineCommissionLedger.logic';

const baseInput: CreateCommissionLedgerEntryInput = {
  id: 'ledger-1',
  agentId: 'agent-1',
  dealId: 'deal-1',
  amount: 1000,
  currency: 'AED',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('roundToCents', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundToCents(10.005)).toBeCloseTo(10.01, 2);
    expect(roundToCents(10.004)).toBeCloseTo(10.0, 2);
  });

  it('fixes classic floating point drift', () => {
    expect(roundToCents(0.1 + 0.2)).toBe(0.3);
  });
});

describe('validateCreateCommissionLedgerEntryInput', () => {
  it('returns no errors for a valid input', () => {
    expect(validateCreateCommissionLedgerEntryInput(baseInput)).toEqual([]);
  });

  it('flags missing id, agentId and dealId', () => {
    const errors = validateCreateCommissionLedgerEntryInput({
      ...baseInput,
      id: '',
      agentId: '  ',
      dealId: '',
    });
    expect(errors).toContain('id is required');
    expect(errors).toContain('agentId is required');
    expect(errors).toContain('dealId is required');
  });

  it('flags non-positive and non-finite amounts', () => {
    expect(validateCreateCommissionLedgerEntryInput({ ...baseInput, amount: 0 })).toContain(
      'amount must be greater than zero'
    );
    expect(validateCreateCommissionLedgerEntryInput({ ...baseInput, amount: -5 })).toContain(
      'amount must be greater than zero'
    );
    expect(
      validateCreateCommissionLedgerEntryInput({
        ...baseInput,
        amount: Number.POSITIVE_INFINITY,
      })
    ).toContain('amount must be finite');
    expect(
      validateCreateCommissionLedgerEntryInput({
        ...baseInput,
        amount: Number.NaN,
      })
    ).toContain('amount must be a valid number');
  });

  it('flags invalid currency codes', () => {
    expect(validateCreateCommissionLedgerEntryInput({ ...baseInput, currency: 'aed' })).toContain(
      'currency must be a 3-letter uppercase ISO code'
    );
    expect(validateCreateCommissionLedgerEntryInput({ ...baseInput, currency: 'A' })).toContain(
      'currency must be a 3-letter uppercase ISO code'
    );
  });
});

describe('createCommissionLedgerEntry', () => {
  it('creates a pending entry with rounded amount', () => {
    const entry = createCommissionLedgerEntry({ ...baseInput, amount: 999.999 });
    expect(entry.status).toBe('pending');
    expect(entry.amount).toBe(1000);
    expect(entry.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(entry.updatedAt).toBe('2024-01-01T00:00:00.000Z');
  });

  it('throws for invalid input', () => {
    expect(() => createCommissionLedgerEntry({ ...baseInput, amount: -1 })).toThrow(
      /Invalid commission ledger entry/
    );
  });
});

describe('status transitions', () => {
  function makeEntry(): CommissionLedgerEntry {
    return createCommissionLedgerEntry(baseInput);
  }

  it('approves a pending entry', () => {
    const entry = makeEntry();
    const approved = approveCommissionLedgerEntry(entry, '2024-01-02T00:00:00.000Z');
    expect(approved.status).toBe('approved');
    expect(approved.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    // original entry is untouched (immutability)
    expect(entry.status).toBe('pending');
  });

  it('marks an approved entry as paid', () => {
    const entry = approveCommissionLedgerEntry(makeEntry());
    const paid = markCommissionLedgerEntryPaid(entry, '2024-01-03T00:00:00.000Z');
    expect(paid.status).toBe('paid');
    expect(paid.updatedAt).toBe('2024-01-03T00:00:00.000Z');
  });

  it('rejects marking a pending entry as paid directly', () => {
    const entry = makeEntry();
    expect(() => markCommissionLedgerEntryPaid(entry)).toThrow(
      /Cannot transition commission ledger entry/
    );
  });

  it('reverses a pending entry with a reason', () => {
    const entry = makeEntry();
    const reversed = reverseCommissionLedgerEntry(
      entry,
      'duplicate deal entry',
      '2024-01-04T00:00:00.000Z'
    );
    expect(reversed.status).toBe('reversed');
    expect(reversed.reversalReason).toBe('duplicate deal entry');
  });

  it('reverses an approved entry with a reason', () => {
    const entry = approveCommissionLedgerEntry(makeEntry());
    const reversed = reverseCommissionLedgerEntry(entry, 'deal fell through');
    expect(reversed.status).toBe('reversed');
  });

  it('requires a non-empty reversal reason', () => {
    const entry = makeEntry();
    expect(() => reverseCommissionLedgerEntry(entry, '')).toThrow(
      /non-empty reversal reason is required/
    );
  });

  it('rejects transitions out of terminal states', () => {
    const paid = markCommissionLedgerEntryPaid(approveCommissionLedgerEntry(makeEntry()));
    expect(() => reverseCommissionLedgerEntry(paid, 'too late')).toThrow(
      /Cannot transition commission ledger entry/
    );

    const reversed = reverseCommissionLedgerEntry(makeEntry(), 'cancelled');
    expect(() => approveCommissionLedgerEntry(reversed)).toThrow(
      /Cannot transition commission ledger entry/
    );
  });
});

describe('isCommissionLedgerEntryActionable', () => {
  it('returns true for pending and approved entries', () => {
    const pending = createCommissionLedgerEntry(baseInput);
    expect(isCommissionLedgerEntryActionable(pending)).toBe(true);
    expect(isCommissionLedgerEntryActionable(approveCommissionLedgerEntry(pending))).toBe(true);
  });

  it('returns false for terminal paid and reversed entries', () => {
    const paid = markCommissionLedgerEntryPaid(
      approveCommissionLedgerEntry(createCommissionLedgerEntry(baseInput))
    );
    expect(isCommissionLedgerEntryActionable(paid)).toBe(false);

    const reversed = reverseCommissionLedgerEntry(
      createCommissionLedgerEntry(baseInput),
      'cancelled'
    );
    expect(isCommissionLedgerEntryActionable(reversed)).toBe(false);
  });
});

describe('aggregation helpers', () => {
  const entries: CommissionLedgerEntry[] = [
    createCommissionLedgerEntry({
      ...baseInput,
      id: 'l1',
      agentId: 'agent-1',
      dealId: 'deal-1',
      amount: 100,
    }),
    approveCommissionLedgerEntry(
      createCommissionLedgerEntry({
        ...baseInput,
        id: 'l2',
        agentId: 'agent-1',
        dealId: 'deal-2',
        amount: 200,
      })
    ),
    markCommissionLedgerEntryPaid(
      approveCommissionLedgerEntry(
        createCommissionLedgerEntry({
          ...baseInput,
          id: 'l3',
          agentId: 'agent-2',
          dealId: 'deal-3',
          amount: 300,
        })
      )
    ),
    reverseCommissionLedgerEntry(
      createCommissionLedgerEntry({
        ...baseInput,
        id: 'l4',
        agentId: 'agent-2',
        dealId: 'deal-4',
        amount: 400,
      }),
      'cancelled'
    ),
  ];

  it('calculateTotalCommission sums all or filters by status', () => {
    expect(calculateTotalCommission(entries)).toBe(1000);
    expect(calculateTotalCommission(entries, 'pending')).toBe(100);
    expect(calculateTotalCommission(entries, 'approved')).toBe(200);
    expect(calculateTotalCommission(entries, 'paid')).toBe(300);
    expect(calculateTotalCommission(entries, 'reversed')).toBe(400);
  });

  it('groupCommissionTotalsByAgent aggregates per agent', () => {
    expect(groupCommissionTotalsByAgent(entries)).toEqual({
      'agent-1': 300,
      'agent-2': 700,
    });
  });

  it('summarizeCommissionLedger reports totals by lifecycle state', () => {
    const summary = summarizeCommissionLedger(entries);
    expect(summary).toEqual({
      totalPending: 100,
      totalApproved: 200,
      totalPaid: 300,
      totalReversed: 400,
      totalOutstanding: 300,
    });
  });

  it('filterCommissionLedgerEntriesByAgent returns only matching entries', () => {
    const filtered = filterCommissionLedgerEntriesByAgent(entries, 'agent-1');
    expect(filtered).toHaveLength(2);
    expect(filtered.every(e => e.agentId === 'agent-1')).toBe(true);
  });

  it('filterCommissionLedgerEntriesByDeal returns only matching entries', () => {
    const filtered = filterCommissionLedgerEntriesByDeal(entries, 'deal-3');
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe('l3');
  });
});
