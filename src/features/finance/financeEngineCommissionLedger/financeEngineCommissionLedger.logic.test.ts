import { describe, expect, it } from 'vitest';
import {
  applyTransitionToLedger,
  CommissionLedgerEntry,
  CommissionLedgerNotFoundError,
  CommissionLedgerTransitionError,
  CommissionLedgerValidationError,
  createCommissionEntry,
  filterByAgent,
  filterByStatus,
  findCommissionEntry,
  summarizeCommissionLedger,
  transitionCommissionEntry,
} from './financeEngineCommissionLedger.logic';

const baseInput = {
  dealId: 'deal-1',
  agentId: 'agent-1',
  grossAmount: 100000,
  commissionRate: 0.025,
  earnedAt: '2025-01-15T00:00:00.000Z',
};

describe('createCommissionEntry', () => {
  it('computes commissionAmount from grossAmount and commissionRate', () => {
    const entry = createCommissionEntry(baseInput);
    expect(entry.commissionAmount).toBe(2500);
    expect(entry.status).toBe('pending');
    expect(entry.settledAt).toBeNull();
    expect(entry.dealId).toBe('deal-1');
    expect(entry.agentId).toBe('agent-1');
  });

  it('rounds commissionAmount to 2 decimal places', () => {
    const entry = createCommissionEntry({
      ...baseInput,
      grossAmount: 33333.33,
      commissionRate: 0.03,
    });
    expect(entry.commissionAmount).toBe(1000);
  });

  it('assigns a unique id to each entry', () => {
    const entry1 = createCommissionEntry(baseInput);
    const entry2 = createCommissionEntry(baseInput);
    expect(entry1.id).not.toBe(entry2.id);
  });

  it('sets note to null when not provided or blank', () => {
    const entry = createCommissionEntry(baseInput);
    expect(entry.note).toBeNull();
    const blankNoteEntry = createCommissionEntry({ ...baseInput, note: '   ' });
    expect(blankNoteEntry.note).toBeNull();
  });

  it('preserves a provided note', () => {
    const entry = createCommissionEntry({ ...baseInput, note: 'Referral bonus included' });
    expect(entry.note).toBe('Referral bonus included');
  });

  it('throws CommissionLedgerValidationError when dealId is missing', () => {
    expect(() => createCommissionEntry({ ...baseInput, dealId: '' })).toThrow(
      CommissionLedgerValidationError
    );
  });

  it('throws CommissionLedgerValidationError when agentId is missing', () => {
    expect(() => createCommissionEntry({ ...baseInput, agentId: '  ' })).toThrow(
      CommissionLedgerValidationError
    );
  });

  it('throws CommissionLedgerValidationError when grossAmount is negative', () => {
    expect(() => createCommissionEntry({ ...baseInput, grossAmount: -1 })).toThrow(
      CommissionLedgerValidationError
    );
  });

  it('throws CommissionLedgerValidationError when grossAmount is not finite', () => {
    expect(() => createCommissionEntry({ ...baseInput, grossAmount: Number.NaN })).toThrow(
      CommissionLedgerValidationError
    );
  });

  it('throws CommissionLedgerValidationError when commissionRate is out of range', () => {
    expect(() => createCommissionEntry({ ...baseInput, commissionRate: 1.5 })).toThrow(
      CommissionLedgerValidationError
    );
    expect(() => createCommissionEntry({ ...baseInput, commissionRate: -0.1 })).toThrow(
      CommissionLedgerValidationError
    );
  });

  it('throws CommissionLedgerValidationError when earnedAt is not a valid date', () => {
    expect(() => createCommissionEntry({ ...baseInput, earnedAt: 'not-a-date' })).toThrow(
      CommissionLedgerValidationError
    );
  });
});

describe('transitionCommissionEntry', () => {
  it('transitions from pending to paid and records settledAt', () => {
    const entry = createCommissionEntry(baseInput);
    const settledAt = '2025-02-01T00:00:00.000Z';
    const updated = transitionCommissionEntry(entry, 'paid', settledAt);
    expect(updated.status).toBe('paid');
    expect(updated.settledAt).toBe(settledAt);
    // original entry must not be mutated
    expect(entry.status).toBe('pending');
    expect(entry.settledAt).toBeNull();
  });

  it('transitions from pending to void', () => {
    const entry = createCommissionEntry(baseInput);
    const updated = transitionCommissionEntry(entry, 'void');
    expect(updated.status).toBe('void');
    expect(updated.settledAt).not.toBeNull();
  });

  it('returns the same entry when transitioning to the same status', () => {
    const entry = createCommissionEntry(baseInput);
    const updated = transitionCommissionEntry(entry, 'pending');
    expect(updated).toBe(entry);
  });

  it('throws CommissionLedgerTransitionError for illegal transitions from paid', () => {
    const entry = createCommissionEntry(baseInput);
    const paid = transitionCommissionEntry(entry, 'paid');
    expect(() => transitionCommissionEntry(paid, 'pending')).toThrow(
      CommissionLedgerTransitionError
    );
    expect(() => transitionCommissionEntry(paid, 'void')).toThrow(CommissionLedgerTransitionError);
  });

  it('throws CommissionLedgerTransitionError for illegal transitions from void', () => {
    const entry = createCommissionEntry(baseInput);
    const voided = transitionCommissionEntry(entry, 'void');
    expect(() => transitionCommissionEntry(voided, 'paid')).toThrow(
      CommissionLedgerTransitionError
    );
  });
});

describe('findCommissionEntry / applyTransitionToLedger', () => {
  it('finds an entry by id', () => {
    const entry = createCommissionEntry(baseInput);
    const ledger: CommissionLedgerEntry[] = [entry];
    expect(findCommissionEntry(ledger, entry.id)).toBe(entry);
  });

  it('throws CommissionLedgerNotFoundError when entry id does not exist', () => {
    expect(() => findCommissionEntry([], 'missing-id')).toThrow(CommissionLedgerNotFoundError);
  });

  it('applies a transition to the correct entry within a ledger without mutating others', () => {
    const entryA = createCommissionEntry(baseInput);
    const entryB = createCommissionEntry({ ...baseInput, dealId: 'deal-2', agentId: 'agent-2' });
    const ledger: CommissionLedgerEntry[] = [entryA, entryB];

    const updatedLedger = applyTransitionToLedger(ledger, entryA.id, 'paid');

    expect(updatedLedger).toHaveLength(2);
    expect(updatedLedger.find(entry => entry.id === entryA.id)?.status).toBe('paid');
    expect(updatedLedger.find(entry => entry.id === entryB.id)?.status).toBe('pending');
    // original ledger array must remain unchanged
    expect(ledger[0].status).toBe('pending');
  });

  it('throws when applying a transition to a non-existent entry id', () => {
    const ledger: CommissionLedgerEntry[] = [createCommissionEntry(baseInput)];
    expect(() => applyTransitionToLedger(ledger, 'bad-id', 'paid')).toThrow(
      CommissionLedgerNotFoundError
    );
  });
});

describe('filterByStatus / filterByAgent', () => {
  it('filters entries by status', () => {
    const pendingEntry = createCommissionEntry(baseInput);
    const paidEntry = transitionCommissionEntry(createCommissionEntry(baseInput), 'paid');
    const ledger: CommissionLedgerEntry[] = [pendingEntry, paidEntry];

    expect(filterByStatus(ledger, 'pending')).toEqual([pendingEntry]);
    expect(filterByStatus(ledger, 'paid')).toEqual([paidEntry]);
  });

  it('filters entries by agent', () => {
    const agent1Entry = createCommissionEntry(baseInput);
    const agent2Entry = createCommissionEntry({ ...baseInput, agentId: 'agent-2' });
    const ledger: CommissionLedgerEntry[] = [agent1Entry, agent2Entry];

    expect(filterByAgent(ledger, 'agent-1')).toEqual([agent1Entry]);
    expect(filterByAgent(ledger, 'agent-2')).toEqual([agent2Entry]);
    expect(filterByAgent(ledger, 'agent-3')).toEqual([]);
  });
});

describe('summarizeCommissionLedger', () => {
  it('aggregates totals by status and agent', () => {
    const pending = createCommissionEntry(baseInput); // 2500
    const paid = transitionCommissionEntry(
      createCommissionEntry({ ...baseInput, grossAmount: 200000, commissionRate: 0.02 }),
      'paid'
    ); // 4000
    const voided = transitionCommissionEntry(
      createCommissionEntry({
        ...baseInput,
        agentId: 'agent-2',
        grossAmount: 50000,
        commissionRate: 0.01,
      }),
      'void'
    ); // 500

    const ledger: CommissionLedgerEntry[] = [pending, paid, voided];
    const summary = summarizeCommissionLedger(ledger);

    expect(summary.totalEntries).toBe(3);
    expect(summary.totalCommission).toBe(2500 + 4000 + 500);
    expect(summary.pendingCommission).toBe(2500);
    expect(summary.paidCommission).toBe(4000);
    expect(summary.voidCommission).toBe(500);
    expect(summary.byAgent['agent-1']).toBe(2500 + 4000);
    expect(summary.byAgent['agent-2']).toBe(500);
  });

  it('returns a zeroed summary for an empty ledger', () => {
    const summary = summarizeCommissionLedger([]);
    expect(summary.totalEntries).toBe(0);
    expect(summary.totalCommission).toBe(0);
    expect(summary.paidCommission).toBe(0);
    expect(summary.pendingCommission).toBe(0);
    expect(summary.voidCommission).toBe(0);
    expect(summary.byAgent).toEqual({});
  });
});
