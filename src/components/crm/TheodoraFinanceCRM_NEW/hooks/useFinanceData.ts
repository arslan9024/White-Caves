import { useState, useCallback } from 'react';
import { INVOICES, EXPENSES, Invoice, Expense } from '../data/finance';
import { FINANCE_FEATURES } from '../data/features';

export const useFinanceData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');

  const financeStats = {
    totalRevenue: 4200000,
    revenueTrend: 18,
    pendingAmount: 860000,
    pendingCount: 12,
    overdueAmount: 95000,
    overdueCount: 3,
    totalExpenses: 470700,
    approvedExpenses: 20700,
    pendingExpenses: 2500
  };

  const handleGeneratePaymentMessage = useCallback((message: string, method: string) => {
    setGeneratedMessage(message);
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
      prev.filter(exp => exp.id !== expenseId)
    );
  }, []);

  return {
    invoices,
    expenses,
    selectedInvoice,
    generatedMessage,
    financeStats,
    setSelectedInvoice: handleSelectInvoice,
    handleGeneratePaymentMessage,
    handleApproveExpense,
    handleRejectExpense,
    features: FINANCE_FEATURES
  };
};
