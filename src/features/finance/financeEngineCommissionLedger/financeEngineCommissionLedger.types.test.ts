import { describe, expect, it } from 'vitest';
import {
  canTransitionCommissionLedgerStatus,
  COMMISSION_LEDGER_STATUS_TRANSITIONS,
  isCommissionLedgerEntry,
  isCommissionLedgerEntryStatus,
  isCommissionLedgerEntryType,
  isMonetaryAmount,
  isTerminalCommissionLedgerStatus,
  summarizeCommissionLedgerEntries,
  TERMINAL_COMMISSION_LEDGER_STATUSES,
  type CommissionLedgerEntry,
} from './financeEngineCommissionLedger.types';

function makeEntry(overrides: Partial<CommissionLedgerEntry> = {}): CommissionLedgerEntry {
  return {
    id: 'entry-1',
    beneficiary: { id: 'agent-1', displayName: 'Jane Agent' },
    type: 'accrual',
    status: 'pending',
    amount: { minorUnits: 10000, currency: 'USD' },
    dealId: 'deal-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('isCommissionLedgerEntryStatus', () => {
  it('returns true for every known status', () => {
    for (const status of ['pending', 'approved', 'paid', 'reversed', 'voided']) {
      expect(isCommissionLedgerEntryStatus(status)).toBe(true);
    }
  });

  it('returns false for unknown or non-string values', () => {
    expect(isCommissionLedgerEntryStatus('archived')).toBe(false);
    expect(isCommissionLedgerEntryStatus(42)).toBe(false);
    expect(isCommissionLedgerEntryStatus(undefined)).toBe(false);
    expect(isCommissionLedgerEntryStatus(null)).toBe(false);
  });
});

describe('isCommissionLedgerEntryType', () => {
  it('returns true for every known type', () => {
    for (const type of ['accrual', 'adjustment', 'payout', 'reversal']) {
      expect(isCommissionLedgerEntryType(type)).toBe(true);
    }
  });

  it('returns false for unknown values', () => {
    expect(isCommissionLedgerEntryType('bonus')).toBe(false);
    expect(isCommissionLedgerEntryType({})).toBe(false);
  });
});

describe('isMonetaryAmount', () => {
  it('accepts a well-formed monetary amount', () => {
    expect(isMonetaryAmount({ minorUnits: 500, currency: 'AED' })).toBe(true);
  });

  it('rejects non-integer minorUnits', () => {
    expect(isMonetaryAmount({ minorUnits: 5.5, currency: 'AED' })).toBe(false);
  });

  it('rejects malformed currency codes', () => {
    expect(isMonetaryAmount({ minorUnits: 500, currency: 'usd' })).toBe(false);
    expect(isMonetaryAmount({ minorUnits: 500, currency: 'US' })).toBe(false);
  });

  it('rejects non-object input', () => {
    expect(isMonetaryAmount(null)).toBe(false);
    expect(isMonetaryAmount('USD 500')).toBe(false);
  });
});

describe('isCommissionLedgerEntry', () => {
  it('accepts a fully well-formed entry', () => {
    expect(isCommissionLedgerEntry(makeEntry())).toBe(true);
  });

  it('rejects an entry missing a beneficiary', () => {
    const { beneficiary: _beneficiary, ...rest } = makeEntry();
    expect(isCommissionLedgerEntry(rest)).toBe(false);
  });

  it('rejects an entry with an invalid type', () => {
    const invalid = { ...makeEntry(), type: 'bonus' };
    expect(isCommissionLedgerEntry(invalid)).toBe(false);
  });

  it('rejects an entry with a malformed amount', () => {
    const invalid = { ...makeEntry(), amount: { minorUnits: 'oops', currency: 'USD' } };
    expect(isCommissionLedgerEntry(invalid)).toBe(false);
  });
});

describe('canTransitionCommissionLedgerStatus', () => {
  it('allows pending -> approved', () => {
    expect(canTransitionCommissionLedgerStatus('pending', 'approved')).toBe(true);
  });

  it('allows approved -> paid', () => {
    expect(canTransitionCommissionLedgerStatus('approved', 'paid')).toBe(true);
  });

  it('disallows pending -> paid directly', () => {
    expect(canTransitionCommissionLedgerStatus('pending', 'paid')).toBe(false);
  });

  it('disallows any transition out of a terminal status', () => {
    expect(canTransitionCommissionLedgerStatus('voided', 'approved')).toBe(false);
    expect(canTransitionCommissionLedgerStatus('reversed', 'paid')).toBe(false);
  });

  it('matches the exported transition table exactly', () => {
    for (const from of Object.keys(COMMISSION_LEDGER_STATUS_TRANSITIONS) as Array<
      keyof typeof COMMISSION_LEDGER_STATUS_TRANSITIONS
    >) {
      for (const to of COMMISSION_LEDGER_STATUS_TRANSITIONS[from]) {
        expect(canTransitionCommissionLedgerStatus(from, to)).toBe(true);
      }
    }
  });
});

describe('isTerminalCommissionLedgerStatus', () => {
  it('flags paid, reversed, and voided as terminal', () => {
    for (const status of TERMINAL_COMMISSION_LEDGER_STATUSES) {
      expect(isTerminalCommissionLedgerStatus(status)).toBe(true);
    }
  });

  it('does not flag pending or approved as terminal', () => {
    expect(isTerminalCommissionLedgerStatus('pending')).toBe(false);
    expect(isTerminalCommissionLedgerStatus('approved')).toBe(false);
  });
});

describe('summarizeCommissionLedgerEntries', () => {
  it('aggregates accrual, payout, and reversal totals for a beneficiary', () => {
    const entries: CommissionLedgerEntry[] = [
      makeEntry({ id: 'e1', type: 'accrual', amount: { minorUnits: 10000, currency: 'USD' } }),
      makeEntry({ id: 'e2', type: 'adjustment', amount: { minorUnits: -500, currency: 'USD' } }),
      makeEntry({ id: 'e3', type: 'payout', amount: { minorUnits: 4000, currency: 'USD' } }),
      makeEntry({ id: 'e4', type: 'reversal', amount: { minorUnits: 1000, currency: 'USD' } }),
    ];

    const summary = summarizeCommissionLedgerEntries('agent-1', 'USD', entries);

    expect(summary).toEqual({
      beneficiaryId: 'agent-1',
      currency: 'USD',
      totalAccruedMinorUnits: 9500,
      totalPaidMinorUnits: 4000,
      totalReversedMinorUnits: 1000,
      outstandingMinorUnits: 4500,
    });
  });

  it('ignores entries belonging to a different beneficiary or currency', () => {
    const entries: CommissionLedgerEntry[] = [
      makeEntry({ id: 'e1', beneficiary: { id: 'agent-1', displayName: 'Jane' } }),
      makeEntry({ id: 'e2', beneficiary: { id: 'agent-2', displayName: 'John' } }),
      makeEntry({ id: 'e3', amount: { minorUnits: 10000, currency: 'AED' } }),
    ];

    const summary = summarizeCommissionLedgerEntries('agent-1', 'USD', entries);

    expect(summary.totalAccruedMinorUnits).toBe(10000);
    expect(summary.outstandingMinorUnits).toBe(10000);
  });

  it('returns all-zero totals for an empty entry list', () => {
    const summary = summarizeCommissionLedgerEntries('agent-1', 'USD', []);
    expect(summary).toEqual({
      beneficiaryId: 'agent-1',
      currency: 'USD',
      totalAccruedMinorUnits: 0,
      totalPaidMinorUnits: 0,
      totalReversedMinorUnits: 0,
      outstandingMinorUnits: 0,
    });
  });
});
