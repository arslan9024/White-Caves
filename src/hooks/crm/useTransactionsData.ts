/**
 * useTransactionsData — Data hook for Transaction management
 * Provides: filtered lists, CRUD handlers, stats, auto-fetch
 *
 * Usage:
 *   const { transactions, stats, createTransaction, ... } = useTransactionsData();
 *   const { transactions: sales } = useTransactionsData({ type: 'sale' });
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  fetchTransactionsFromAPI,
  createTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
  fetchTransactionStatsAPI,
  selectAllTransactions,
  selectDraftTransactions,
  selectPendingTransactions,
  selectActiveTransactions,
  selectCompletedTransactions,
  selectCancelledTransactions,
  selectSaleTransactions,
  selectLeaseTransactions,
  selectRentalTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
} from '../../store/crmDataSlice';

// ─── Options ────────────────────────────────────────────────────────────
interface UseTransactionsOptions {
  /** Auto-fetch on mount (default: true) */
  autoFetch?: boolean;
  /** Filter by status */
  status?: string;
  /** Filter by type */
  type?: string;
}

// ─── Return type ────────────────────────────────────────────────────────
interface TransactionItem {
  id: string | number;
  [key: string]: unknown;
}

interface TransactionStats {
  total: number;
  draftCount: number;
  pendingCount: number;
  activeCount: number;
  completedCount: number;
  cancelledCount: number;
  saleCount: number;
  leaseCount: number;
  rentalCount: number;
  totalValue: number;
  completedValue: number;
}

// ─── Hook ───────────────────────────────────────────────────────────────
export function useTransactionsData(options: UseTransactionsOptions = {}) {
  const { autoFetch = true, status, type } = options;
  const dispatch = useDispatch<AppDispatch>();

  // ── Selectors ──
  const allTransactions = useSelector(selectAllTransactions) as TransactionItem[];
  const draftTransactions = useSelector(selectDraftTransactions) as TransactionItem[];
  const pendingTransactions = useSelector(selectPendingTransactions) as TransactionItem[];
  const activeTransactions = useSelector(selectActiveTransactions) as TransactionItem[];
  const completedTransactions = useSelector(selectCompletedTransactions) as TransactionItem[];
  const cancelledTransactions = useSelector(selectCancelledTransactions) as TransactionItem[];
  const saleTransactions = useSelector(selectSaleTransactions) as TransactionItem[];
  const leaseTransactions = useSelector(selectLeaseTransactions) as TransactionItem[];
  const rentalTransactions = useSelector(selectRentalTransactions) as TransactionItem[];
  const loading = useSelector(selectTransactionsLoading) ?? false;
  const error = useSelector(selectTransactionsError) ?? null;

  // ── Auto-fetch ──
  useEffect(() => {
    if (autoFetch) {
      const params: Record<string, string | number> = {};
      if (status) params.status = status;
      if (type) params.type = type;
      dispatch(fetchTransactionsFromAPI(params));
    }
  }, [dispatch, autoFetch, status, type]);

  // ── Filtered list (applies option-level status/type filters) ──
  const transactions = useMemo(() => {
    let result = allTransactions;
    if (status) result = result.filter((t) => t.status === status);
    if (type) result = result.filter((t) => t.type === type);
    return result;
  }, [allTransactions, status, type]);

  // ── Stats ──
  const stats = useMemo<TransactionStats>(() => {
    const safeAmount = (item: TransactionItem) =>
      typeof item.amount === 'number' ? item.amount : 0;

    return {
      total: allTransactions.length,
      draftCount: draftTransactions.length,
      pendingCount: pendingTransactions.length,
      activeCount: activeTransactions.length,
      completedCount: completedTransactions.length,
      cancelledCount: cancelledTransactions.length,
      saleCount: saleTransactions.length,
      leaseCount: leaseTransactions.length,
      rentalCount: rentalTransactions.length,
      totalValue: allTransactions.reduce((sum, t) => sum + safeAmount(t), 0),
      completedValue: completedTransactions.reduce((sum, t) => sum + safeAmount(t), 0),
    };
  }, [
    allTransactions,
    draftTransactions,
    pendingTransactions,
    activeTransactions,
    completedTransactions,
    cancelledTransactions,
    saleTransactions,
    leaseTransactions,
    rentalTransactions,
  ]);

  // ── CRUD handlers ──
  const createTransaction = useCallback(
    (data: { type: string; amount: number; propertyId?: string; leadId?: string; agentId?: string; closingDate?: string; notes?: string }) =>
      dispatch(createTransactionAPI(data)),
    [dispatch],
  );

  const updateTransaction = useCallback(
    (data: { id: string; status?: string; amount?: number; type?: string; closingDate?: string; notes?: string; documents?: string[] }) =>
      dispatch(updateTransactionAPI(data)),
    [dispatch],
  );

  const deleteTransaction = useCallback(
    (id: string) => dispatch(deleteTransactionAPI(id)),
    [dispatch],
  );

  const fetchStats = useCallback(
    () => dispatch(fetchTransactionStatsAPI()),
    [dispatch],
  );

  const refresh = useCallback(() => {
    const params: Record<string, string | number> = {};
    if (status) params.status = status;
    if (type) params.type = type;
    return dispatch(fetchTransactionsFromAPI(params));
  }, [dispatch, status, type]);

  return {
    // Data
    transactions,
    allTransactions,
    draftTransactions,
    pendingTransactions,
    activeTransactions,
    completedTransactions,
    cancelledTransactions,
    saleTransactions,
    leaseTransactions,
    rentalTransactions,
    loading,
    error,

    // Stats
    stats,

    // Actions
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchStats,
    refresh,
  };
}

export default useTransactionsData;
