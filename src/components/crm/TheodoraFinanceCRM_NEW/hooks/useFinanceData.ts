import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { INVOICES, EXPENSES, Invoice, Expense } from '../data/finance';
import { FINANCE_FEATURES } from '../data/features';
import {
  fetchCommissionsFromAPI,
  fetchFinanceSummary,
  createCommissionAPI,
  updateCommissionAPI,
  bulkPayCommissionsAPI,
  selectAllCommissions,
  selectPendingCommissions,
  selectApprovedCommissions,
  selectPaidCommissions,
  selectCommissionsLoading,
  selectCommissionsError,
} from '../../../../store/crmDataSlice';
import type { AppDispatch } from '../../../../store/store';

export const useFinanceData = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state for commissions (real API data)
  const commissions = useSelector(selectAllCommissions);
  const pendingCommissions = useSelector(selectPendingCommissions);
  const approvedCommissions = useSelector(selectApprovedCommissions);
  const paidCommissions = useSelector(selectPaidCommissions);
  const commissionsLoading = useSelector(selectCommissionsLoading);
  const commissionsError = useSelector(selectCommissionsError);

  // Local state for invoices/expenses (still mock — Phase 5 will add Invoice model)
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [financeSummary, setFinanceSummary] = useState<Record<string, unknown> | null>(null);

  // Fetch commissions and finance summary on mount
  useEffect(() => {
    dispatch(fetchCommissionsFromAPI({}));
    dispatch(fetchFinanceSummary()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFinanceSummary(result.payload as Record<string, unknown>);
      }
    });
  }, [dispatch]);

  // Compute finance stats from real data when available, fallback to mock
  const financeStats = useMemo(() => {
    if (financeSummary) {
      const commissionsData = financeSummary.commissions as Record<string, Record<string, number>> | undefined;
      return {
        totalRevenue: (financeSummary.totalRevenue as number) || 0,
        revenueTrend: 18, // TODO: Calculate from historical data
        pendingAmount: commissionsData?.pending?.value || 0,
        pendingCount: commissionsData?.pending?.count || pendingCommissions.length,
        overdueAmount: 0, // TODO: Add overdue tracking
        overdueCount: 0,
        totalExpenses: (financeSummary.totalExpenses as number) || 0,
        approvedExpenses: commissionsData?.approved?.value || 0,
        pendingExpenses: commissionsData?.pending?.value || 0,
      };
    }
    // Fallback: compute from Redux commission state
    if (commissions.length > 0) {
      const totalCommValue = commissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
      const pendingValue = pendingCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
      const approvedValue = approvedCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
      return {
        totalRevenue: totalCommValue,
        revenueTrend: 0,
        pendingAmount: pendingValue,
        pendingCount: pendingCommissions.length,
        overdueAmount: 0,
        overdueCount: 0,
        totalExpenses: totalCommValue,
        approvedExpenses: approvedValue,
        pendingExpenses: pendingValue,
      };
    }
    // Final fallback: hardcoded mock data for dev/demo
    return {
      totalRevenue: 4200000,
      revenueTrend: 18,
      pendingAmount: 860000,
      pendingCount: 12,
      overdueAmount: 95000,
      overdueCount: 3,
      totalExpenses: 470700,
      approvedExpenses: 20700,
      pendingExpenses: 2500,
    };
  }, [financeSummary, commissions, pendingCommissions, approvedCommissions]);

  const handleGeneratePaymentMessage = useCallback((_message: string, _method: string) => {
    setGeneratedMessage(_message);
  }, []);

  const handleSelectInvoice = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
  }, []);

  const handleApproveExpense = useCallback((expenseId: number) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === expenseId ? { ...exp, status: 'approved' } : exp
      )
    );
  }, []);

  const handleRejectExpense = useCallback((expenseId: number) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === expenseId ? { ...exp, status: 'rejected' } : exp
      )
    );
  }, []);

  // Commission-specific actions
  const handleCreateCommission = useCallback(
    (data: { agentId: string; amount: number; percentage?: number; type?: string; notes?: string; leadId?: string; propertyId?: string }) => {
      return dispatch(createCommissionAPI(data));
    },
    [dispatch]
  );

  const handleUpdateCommission = useCallback(
    (data: { id: string; status?: string; amount?: number; notes?: string }) => {
      return dispatch(updateCommissionAPI(data));
    },
    [dispatch]
  );

  const handleBulkPay = useCallback(
    (commissionIds: string[]) => {
      return dispatch(bulkPayCommissionsAPI(commissionIds));
    },
    [dispatch]
  );

  const handleRefreshCommissions = useCallback(() => {
    dispatch(fetchCommissionsFromAPI({}));
    dispatch(fetchFinanceSummary()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFinanceSummary(result.payload as Record<string, unknown>);
      }
    });
  }, [dispatch]);

  return {
    // Invoices & Expenses (still mock)
    invoices,
    expenses,
    selectedInvoice,
    generatedMessage,
    financeStats,
    setSelectedInvoice: handleSelectInvoice,
    handleGeneratePaymentMessage,
    handleApproveExpense,
    handleRejectExpense,
    features: FINANCE_FEATURES,
    // Commission data (real API)
    commissions,
    pendingCommissions,
    approvedCommissions,
    paidCommissions,
    commissionsLoading,
    commissionsError,
    handleCreateCommission,
    handleUpdateCommission,
    handleBulkPay,
    handleRefreshCommissions,
  };
};
