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

interface InvoiceRecord extends Invoice {
  totalAmount?: number;
  notes?: string;
  vatAmount?: number;
}

interface ExpenseRecord extends Expense {
  notes?: string;
  receiptUrl?: string;
}

interface CommissionRecord {
  id: string;
  amount: number;
  status: string;
  agentId?: string;
  agentName?: string;
  agent_name?: string;
  leadId?: string;
  propertyId?: string;
  percentage?: number;
  type?: string;
  notes?: string;
  paidAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}

const mapInvoiceRecord = (item: Record<string, unknown>): InvoiceRecord => ({
  id: String(item.id ?? ''),
  client: String(item.client ?? 'Unknown Client'),
  property: String(item.property ?? 'N/A'),
  amount: Number(item.amount ?? 0),
  totalAmount: item.totalAmount !== undefined ? Number(item.totalAmount) : undefined,
  status: String(item.status ?? 'pending'),
  date: String(item.date ?? item.createdAt ?? new Date().toISOString().slice(0, 10)),
  dueDate: String(item.dueDate ?? new Date().toISOString().slice(0, 10)),
  notes: item.notes ? String(item.notes) : undefined,
  vatAmount: item.vatAmount !== undefined ? Number(item.vatAmount) : undefined,
});

const mapExpenseRecord = (item: Record<string, unknown>): ExpenseRecord => ({
  id: Number(item.id ?? 0),
  category: String(item.category ?? 'General'),
  description: String(item.description ?? ''),
  amount: Number(item.amount ?? 0),
  date: String(item.date ?? item.createdAt ?? new Date().toISOString().slice(0, 10)),
  status: String(item.status ?? 'pending'),
  notes: item.notes ? String(item.notes) : undefined,
  receiptUrl: item.receiptUrl ? String(item.receiptUrl) : undefined,
});

const mapCommissionRecord = (item: Record<string, unknown>): CommissionRecord => ({
  id: String(item.id ?? ''),
  amount: Number(item.amount ?? 0),
  status: String(item.status ?? 'pending'),
  agentId: item.agentId ? String(item.agentId) : undefined,
  agentName: item.agentName ? String(item.agentName) : undefined,
  agent_name: item.agent_name ? String(item.agent_name) : undefined,
  leadId: item.leadId ? String(item.leadId) : undefined,
  propertyId: item.propertyId ? String(item.propertyId) : undefined,
  percentage: item.percentage !== undefined ? Number(item.percentage) : undefined,
  type: item.type ? String(item.type) : undefined,
  notes: item.notes ? String(item.notes) : undefined,
  paidAt: item.paidAt ? String(item.paidAt) : undefined,
  createdAt: item.createdAt ? String(item.createdAt) : undefined,
});

export const useFinanceData = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state for commissions (real API data)
  const commissionsRaw = useSelector(selectAllCommissions);
  const pendingCommissionsRaw = useSelector(selectPendingCommissions);
  const approvedCommissionsRaw = useSelector(selectApprovedCommissions);
  const paidCommissionsRaw = useSelector(selectPaidCommissions);
  const commissionsLoading = useSelector(selectCommissionsLoading);
  const commissionsError = useSelector(selectCommissionsError);

  // Redux state for invoices (real API data)
  const invoicesRaw = useSelector(selectAllInvoices);
  const pendingInvoicesRaw = useSelector(selectPendingInvoices);
  const paidInvoicesRaw = useSelector(selectPaidInvoices);
  const overdueInvoicesRaw = useSelector(selectOverdueInvoices);
  const invoicesLoading = useSelector(selectInvoicesLoading);
  const invoicesError = useSelector(selectInvoicesError);

  // Redux state for expenses (real API data)
  const expensesRaw = useSelector(selectAllExpenses);
  const pendingExpensesRaw = useSelector(selectPendingExpenses);
  const approvedExpensesRaw = useSelector(selectApprovedExpenses);
  const expensesLoading = useSelector(selectExpensesLoading);
  const expensesError = useSelector(selectExpensesError);

  const commissions = useMemo(
    () => commissionsRaw.map((item) => mapCommissionRecord(item as Record<string, unknown>)),
    [commissionsRaw],
  );
  const pendingCommissions = useMemo(
    () => pendingCommissionsRaw.map((item) => mapCommissionRecord(item as Record<string, unknown>)),
    [pendingCommissionsRaw],
  );
  const approvedCommissions = useMemo(
    () => approvedCommissionsRaw.map((item) => mapCommissionRecord(item as Record<string, unknown>)),
    [approvedCommissionsRaw],
  );
  const paidCommissions = useMemo(
    () => paidCommissionsRaw.map((item) => mapCommissionRecord(item as Record<string, unknown>)),
    [paidCommissionsRaw],
  );

  const invoices = useMemo(
    () => invoicesRaw.map((item) => mapInvoiceRecord(item as Record<string, unknown>)),
    [invoicesRaw],
  );
  const pendingInvoices = useMemo(
    () => pendingInvoicesRaw.map((item) => mapInvoiceRecord(item as Record<string, unknown>)),
    [pendingInvoicesRaw],
  );
  const paidInvoices = useMemo(
    () => paidInvoicesRaw.map((item) => mapInvoiceRecord(item as Record<string, unknown>)),
    [paidInvoicesRaw],
  );
  const overdueInvoices = useMemo(
    () => overdueInvoicesRaw.map((item) => mapInvoiceRecord(item as Record<string, unknown>)),
    [overdueInvoicesRaw],
  );

  const expenses = useMemo(
    () => expensesRaw.map((item) => mapExpenseRecord(item as Record<string, unknown>)),
    [expensesRaw],
  );
  const pendingExpensesList = useMemo(
    () => pendingExpensesRaw.map((item) => mapExpenseRecord(item as Record<string, unknown>)),
    [pendingExpensesRaw],
  );
  const approvedExpensesList = useMemo(
    () => approvedExpensesRaw.map((item) => mapExpenseRecord(item as Record<string, unknown>)),
    [approvedExpensesRaw],
  );

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
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
        // Compute revenueTrend: % change vs prior 30-day window using sorted invoices
        revenueTrend: (() => {
          const now = Date.now();
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          const currentRevenue = invoices
            .filter((inv) => new Date(inv.createdAt ?? inv.date ?? 0).getTime() >= now - thirtyDays)
            .reduce((s, inv) => s + (Number(inv.totalAmount ?? inv.amount) || 0), 0);
          const priorRevenue = invoices
            .filter((inv) => {
              const t = new Date(inv.createdAt ?? inv.date ?? 0).getTime();
              return t >= now - 2 * thirtyDays && t < now - thirtyDays;
            })
            .reduce((s, inv) => s + (Number(inv.totalAmount ?? inv.amount) || 0), 0);
          if (priorRevenue === 0) return 18; // Fallback baseline trend
          return Math.round(((currentRevenue - priorRevenue) / priorRevenue) * 100);
        })(),
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
    // No data available yet — return zeros so the UI shows an empty state
    return {
      totalRevenue: 0,
      revenueTrend: 0,
      pendingAmount: 0,
      pendingCount: 0,
      overdueAmount: 0,
      overdueCount: 0,
      totalExpenses: 0,
      approvedExpenses: 0,
      pendingExpenses: 0,
    };
  }, [financeSummary, invoices, pendingInvoices, overdueInvoices, expenses, pendingExpensesList, approvedExpensesList, commissions, pendingCommissions, approvedCommissions]);

  const handleGeneratePaymentMessage = useCallback((_message?: string, _method?: string) => {
    setGeneratedMessage(_message ?? '');
  }, []);

  const handleSelectInvoice = useCallback((invoice: InvoiceRecord) => {
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
      (data: Partial<InvoiceRecord>) => dispatch(createInvoiceAPI({
        client: data.client ?? 'Unknown Client',
        amount: Number(data.amount ?? 0),
        dueDate: data.dueDate ?? new Date().toISOString().slice(0, 10),
        property: data.property,
        notes: data.notes,
        vatAmount: data.vatAmount,
        lineItems: undefined,
      })),
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
      (data: Partial<ExpenseRecord>) => dispatch(createExpenseAPI({
        category: data.category ?? 'General',
        description: data.description ?? '',
        amount: Number(data.amount ?? 0),
        date: data.date,
        notes: data.notes,
        receiptUrl: data.receiptUrl,
      })),
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
