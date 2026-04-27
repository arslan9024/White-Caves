/**
 * useTransactionsData — Unit tests
 * Pattern: Mock Redux state → real selectors execute against it
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransactionsData } from '../useTransactionsData';

// ─── Mock Redux state ───────────────────────────────────────────────────
const makeTx = (overrides: Record<string, unknown> = {}) => ({
  id: `tx_${Math.random().toString(36).slice(2, 8)}`,
  type: 'sale',
  status: 'draft',
  amount: 100000,
  propertyId: null,
  leadId: null,
  agentId: null,
  closingDate: null,
  notes: null,
  documents: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const MOCK_TRANSACTIONS = [
  makeTx({ id: 'tx1', type: 'sale', status: 'draft', amount: 500000 }),
  makeTx({ id: 'tx2', type: 'sale', status: 'pending', amount: 750000 }),
  makeTx({ id: 'tx3', type: 'lease', status: 'active', amount: 120000 }),
  makeTx({ id: 'tx4', type: 'rental', status: 'completed', amount: 48000 }),
  makeTx({ id: 'tx5', type: 'sale', status: 'cancelled', amount: 300000 }),
  makeTx({ id: 'tx6', type: 'lease', status: 'completed', amount: 200000 }),
  makeTx({ id: 'tx7', type: 'rental', status: 'pending', amount: 36000 }),
];

let mockState: Record<string, unknown>;

const resetMockState = () => {
  mockState = {
    crmData: {
      transactions: {
        items: [...MOCK_TRANSACTIONS],
        loading: false,
        error: null,
      },
      // Other slices needed by store shape
      leads: { items: [], selected: null, loading: false, error: null },
      clients: { items: [], selected: null, loading: false, error: null },
      agents: { items: [], selected: null, loading: false, error: null },
      properties: { items: [], selected: null, loading: false, error: null },
      commissions: { items: [], loading: false, error: null },
      invoices: { items: [], loading: false, error: null },
      expenses: { items: [], loading: false, error: null },
      activities: { items: [], loading: false, error: null },
      overview: null,
      lastUpdated: new Date().toISOString(),
    },
  };
};

// ─── Mock dispatch & thunks ─────────────────────────────────────────────
const mockDispatch = vi.fn(() => Promise.resolve({ unwrap: () => Promise.resolve() }));

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector(mockState),
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/crmDataSlice', async () => {
  const actual = await vi.importActual('../../../store/crmDataSlice');
  return {
    ...actual,
    fetchTransactionsFromAPI: vi.fn((params) => ({ type: 'mock/fetchTransactions', payload: params })),
    createTransactionAPI: vi.fn((data) => ({ type: 'mock/createTransaction', payload: data })),
    updateTransactionAPI: vi.fn((data) => ({ type: 'mock/updateTransaction', payload: data })),
    deleteTransactionAPI: vi.fn((id) => ({ type: 'mock/deleteTransaction', payload: id })),
    fetchTransactionStatsAPI: vi.fn(() => ({ type: 'mock/fetchTransactionStats' })),
  };
});

// ─── Tests ──────────────────────────────────────────────────────────────
describe('useTransactionsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockState();
  });

  // ────── Data loading ──────
  describe('data loading', () => {
    it('returns all transactions from Redux state', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.allTransactions).toHaveLength(7);
    });

    it('auto-fetches on mount by default', () => {
      renderHook(() => useTransactionsData());
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/fetchTransactions' }),
      );
    });

    it('skips auto-fetch when autoFetch = false', () => {
      renderHook(() => useTransactionsData({ autoFetch: false }));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('exposes loading state', () => {
      (mockState as any).crmData.transactions.loading = true;
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.loading).toBe(true);
    });

    it('exposes error state', () => {
      (mockState as any).crmData.transactions.error = 'Network error';
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.error).toBe('Network error');
    });
  });

  // ────── Category filtering ──────
  describe('status filtering', () => {
    it('returns draft transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.draftTransactions).toHaveLength(1);
      expect(result.current.draftTransactions[0].id).toBe('tx1');
    });

    it('returns pending transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.pendingTransactions).toHaveLength(2);
    });

    it('returns active transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.activeTransactions).toHaveLength(1);
      expect(result.current.activeTransactions[0].id).toBe('tx3');
    });

    it('returns completed transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.completedTransactions).toHaveLength(2);
    });

    it('returns cancelled transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.cancelledTransactions).toHaveLength(1);
      expect(result.current.cancelledTransactions[0].id).toBe('tx5');
    });

    it('filters transactions by status option', () => {
      const { result } = renderHook(() => useTransactionsData({ status: 'completed' }));
      expect(result.current.transactions).toHaveLength(2);
      result.current.transactions.forEach((t) => expect(t.status).toBe('completed'));
    });
  });

  // ────── Type filtering ──────
  describe('type filtering', () => {
    it('returns sale transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.saleTransactions).toHaveLength(3);
    });

    it('returns lease transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.leaseTransactions).toHaveLength(2);
    });

    it('returns rental transactions', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.rentalTransactions).toHaveLength(2);
    });

    it('filters transactions by type option', () => {
      const { result } = renderHook(() => useTransactionsData({ type: 'lease' }));
      expect(result.current.transactions).toHaveLength(2);
      result.current.transactions.forEach((t) => expect(t.type).toBe('lease'));
    });

    it('filters by both status and type options', () => {
      const { result } = renderHook(() =>
        useTransactionsData({ status: 'pending', type: 'sale' }),
      );
      expect(result.current.transactions).toHaveLength(1);
      expect(result.current.transactions[0].id).toBe('tx2');
    });
  });

  // ────── Stats computation ──────
  describe('stats computation', () => {
    it('computes total count', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.stats.total).toBe(7);
    });

    it('computes status counts', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.stats.draftCount).toBe(1);
      expect(result.current.stats.pendingCount).toBe(2);
      expect(result.current.stats.activeCount).toBe(1);
      expect(result.current.stats.completedCount).toBe(2);
      expect(result.current.stats.cancelledCount).toBe(1);
    });

    it('computes type counts', () => {
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.stats.saleCount).toBe(3);
      expect(result.current.stats.leaseCount).toBe(2);
      expect(result.current.stats.rentalCount).toBe(2);
    });

    it('computes totalValue from all amounts', () => {
      const { result } = renderHook(() => useTransactionsData());
      // 500000 + 750000 + 120000 + 48000 + 300000 + 200000 + 36000 = 1,954,000
      expect(result.current.stats.totalValue).toBe(1954000);
    });

    it('computes completedValue from completed transactions only', () => {
      const { result } = renderHook(() => useTransactionsData());
      // tx4 (48000) + tx6 (200000) = 248000
      expect(result.current.stats.completedValue).toBe(248000);
    });

    it('handles empty transactions gracefully', () => {
      (mockState as any).crmData.transactions.items = [];
      const { result } = renderHook(() => useTransactionsData());
      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.totalValue).toBe(0);
      expect(result.current.stats.completedValue).toBe(0);
    });
  });

  // ────── CRUD dispatch verification ──────
  describe('CRUD operations', () => {
    it('dispatches createTransaction', () => {
      const { result } = renderHook(() => useTransactionsData({ autoFetch: false }));
      act(() => {
        result.current.createTransaction({ type: 'sale', amount: 100000 });
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/createTransaction', payload: { type: 'sale', amount: 100000 } }),
      );
    });

    it('dispatches updateTransaction', () => {
      const { result } = renderHook(() => useTransactionsData({ autoFetch: false }));
      act(() => {
        result.current.updateTransaction({ id: 'tx1', status: 'pending' });
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/updateTransaction', payload: { id: 'tx1', status: 'pending' } }),
      );
    });

    it('dispatches deleteTransaction', () => {
      const { result } = renderHook(() => useTransactionsData({ autoFetch: false }));
      act(() => {
        result.current.deleteTransaction('tx1');
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/deleteTransaction', payload: 'tx1' }),
      );
    });

    it('dispatches fetchStats', () => {
      const { result } = renderHook(() => useTransactionsData({ autoFetch: false }));
      act(() => {
        result.current.fetchStats();
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/fetchTransactionStats' }),
      );
    });

    it('dispatches refresh with current filter params', () => {
      const { result } = renderHook(() =>
        useTransactionsData({ autoFetch: false, status: 'active', type: 'lease' }),
      );
      act(() => {
        result.current.refresh();
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/fetchTransactions',
          payload: { status: 'active', type: 'lease' },
        }),
      );
    });
  });

  // ────── Handler exposure ──────
  describe('handler exposure', () => {
    it('exposes all expected handlers', () => {
      const { result } = renderHook(() => useTransactionsData({ autoFetch: false }));
      expect(typeof result.current.createTransaction).toBe('function');
      expect(typeof result.current.updateTransaction).toBe('function');
      expect(typeof result.current.deleteTransaction).toBe('function');
      expect(typeof result.current.fetchStats).toBe('function');
      expect(typeof result.current.refresh).toBe('function');
    });

    it('exposes all expected data properties', () => {
      const { result } = renderHook(() => useTransactionsData({ autoFetch: false }));
      expect(result.current).toHaveProperty('transactions');
      expect(result.current).toHaveProperty('allTransactions');
      expect(result.current).toHaveProperty('draftTransactions');
      expect(result.current).toHaveProperty('pendingTransactions');
      expect(result.current).toHaveProperty('activeTransactions');
      expect(result.current).toHaveProperty('completedTransactions');
      expect(result.current).toHaveProperty('cancelledTransactions');
      expect(result.current).toHaveProperty('saleTransactions');
      expect(result.current).toHaveProperty('leaseTransactions');
      expect(result.current).toHaveProperty('rentalTransactions');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('stats');
    });
  });
});
