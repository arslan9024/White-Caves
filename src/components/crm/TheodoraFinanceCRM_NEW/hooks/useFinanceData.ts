import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Invoice, Expense } from '../data/finance';
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
  fetchInvoicesFromAPI,
  createInvoiceAPI,
  updateInvoiceAPI,
  deleteInvoiceAPI,
  selectAllInvoices,
  selectPendingInvoices,
  selectPaidInvoices,
  selectOverdueInvoices,
  selectInvoicesLoading,
  selectInvoicesError,
  fetchExpensesFromAPI,
  createExpenseAPI,
  updateExpenseAPI,
  deleteExpenseAPI,
  selectAllExpenses,
  selectPendingExpenses,
  selectApprovedExpenses,
  selectExpensesLoading,
  selectExpensesError,
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

  // Redux state for invoices (real API data)
  const invoices = useSelector(selectAllInvoices) as Invoice[];
  const pendingInvoices = useSelector(selectPendingInvoices) as Invoice[];
  const paidInvoices = useSelector(selectPaidInvoices) as Invoice[];
  const overdueInvoices = useSelector(selectOverdueInvoices) as Invoice[];
  const invoicesLoading = useSelector(selectInvoicesLoading);
  const invoicesError = useSelector(selectInvoicesError);

  // Redux state for expenses (real API data)
  const expenses = useSelector(selectAllExpenses) as Expense[];
  const pendingExpensesList = useSelector(selectPendingExpenses) as Expense[];
  const approvedExpensesList = useSelector(selectApprovedExpenses) as Expense[];
  const expensesLoading = useSelector(selectExpensesLoading);
  const expensesError = useSelector(selectExpensesError);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [financeSummary, setFinanceSummary] = useState<Record<string, unknown> | null>(null);

  // Fetch commissions, invoices, expenses, and finance summary on mount
  useEffect(() => {
    dispatch(fetchCommissionsFromAPI({}));
    dispatch(fetchInvoicesFromAPI({}));
    dispatch(fetchExpensesFromAPI({}));
    dispatch(fetchFinanceSummary()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFinanceSummary(result.payload as Record<string, unknown>);
      }
    });
  }, [dispatch]);

  // Compute finance stats from real data when available, fallback to mock
  const financeStats = useMemo(() => {
    // Calculate invoice totals from real data
    const invoiceTotalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount ?? inv.amount) || 0), 0);
    const invoicePendingAmount = pendingInvoices.reduce((sum, inv) => sum + (Number(inv.totalAmount ?? inv.amount) || 0), 0);
    const invoiceOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + (Number(inv.totalAmount ?? inv.amount) || 0), 0);
    // Calculate expense totals from real data
    const expensesTotal = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const expensesPendingTotal = pendingExpensesList.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const expensesApprovedTotal = approvedExpensesList.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    if (financeSummary) {
      const commissionsData = financeSummary.commissions as Record<string, Record<string, number>> | undefined;
      return {
        totalRevenue: invoiceTotalRevenue || (financeSummary.totalRevenue as number) || 0,
        revenueTrend: 18, // TODO: Calculate from historical data
        pendingAmount: invoicePendingAmount || commissionsData?.pending?.value || 0,
        pendingCount: pendingInvoices.length || commissionsData?.pending?.count || pendingCommissions.length,
        overdueAmount: invoiceOverdueAmount,
        overdueCount: overdueInvoices.length,
        totalExpenses: expensesTotal || (financeSummary.totalExpenses as number) || 0,
        approvedExpenses: expensesApprovedTotal || commissionsData?.approved?.value || 0,
        pendingExpenses: expensesPendingTotal || commissionsData?.pending?.value || 0,
      };
    }
    // Use real data if any exists
    if (invoices.length > 0 || expenses.length > 0 || commissions.length > 0) {
      const commTotalValue = commissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
      const pendingValue = pendingCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
      const approvedValue = approvedCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
      return {
        totalRevenue: invoiceTotalRevenue || commTotalValue,
        revenueTrend: 0,
        pendingAmount: invoicePendingAmount || pendingValue,
        pendingCount: pendingInvoices.length || pendingCommissions.length,
        overdueAmount: invoiceOverdueAmount,
        overdueCount: overdueInvoices.length,
        totalExpenses: expensesTotal || commTotalValue,
        approvedExpenses: expensesApprovedTotal || approvedValue,
        pendingExpenses: expensesPendingTotal || pendingValue,
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
  }, [financeSummary, invoices, pendingInvoices, overdueInvoices, expenses, pendingExpensesList, approvedExpensesList, commissions, pendingCommissions, approvedCommissions]);

  const handleGeneratePaymentMessage = useCallback((_message?: string, _method?: string) => {
    setGeneratedMessage(_message ?? '');
  }, []);

  const handleSelectInvoice = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
  }, []);

  const handleApproveExpense = useCallback((expenseId: number) => {
    dispatch(updateExpenseAPI({ id: String(expenseId), status: 'approved' }));
  }, [dispatch]);

  const handleRejectExpense = useCallback((expenseId: number) => {
    dispatch(updateExpenseAPI({ id: String(expenseId), status: 'rejected' }));
  }, [dispatch]);

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
    dispatch(fetchInvoicesFromAPI({}));
    dispatch(fetchExpensesFromAPI({}));
    dispatch(fetchFinanceSummary()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFinanceSummary(result.payload as Record<string, unknown>);
      }
    });
  }, [dispatch]);

  return {
    // Invoices (real API data)
    invoices,
    pendingInvoices,
    paidInvoices,
    overdueInvoices,
    invoicesLoading,
    invoicesError,
    // Expenses (real API data)
    expenses,
    pendingExpensesList,
    approvedExpensesList,
    expensesLoading,
    expensesError,
    // UI state
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
    // Invoice CRUD
    handleCreateInvoice: useCallback(
      (data: Partial<Invoice>) => dispatch(createInvoiceAPI(data)),
      [dispatch]
    ),
    handleUpdateInvoice: useCallback(
      (data: { id: string } & Partial<Invoice>) => dispatch(updateInvoiceAPI(data)),
      [dispatch]
    ),
    handleDeleteInvoice: useCallback(
      (id: string) => dispatch(deleteInvoiceAPI(id)),
      [dispatch]
    ),
    // Expense CRUD
    handleCreateExpense: useCallback(
      (data: Partial<Expense>) => dispatch(createExpenseAPI(data)),
      [dispatch]
    ),
    handleUpdateExpense: useCallback(
      (data: { id: string } & Partial<Expense>) => dispatch(updateExpenseAPI(data)),
      [dispatch]
    ),
    handleDeleteExpense: useCallback(
      (id: string) => dispatch(deleteExpenseAPI(id)),
      [dispatch]
    ),
  };
};
