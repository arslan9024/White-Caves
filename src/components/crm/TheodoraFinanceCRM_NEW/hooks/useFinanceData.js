import { useState, useCallback } from 'react';
import { INVOICES, EXPENSES } from '../data/finance';
import { FINANCE_FEATURES } from '../data/features';

export const useFinanceData = () => {
  const [invoices, setInvoices] = useState(INVOICES);
  const [expenses, setExpenses] = useState(EXPENSES);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [generatedMessage, setGeneratedMessage] = useState('');

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

  const handleGeneratePaymentMessage = useCallback((message, method) => {
    setGeneratedMessage(message);
  }, []);

  const handleSelectInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice);
  }, []);

  const handleApproveExpense = useCallback((expenseId) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === expenseId ? { ...exp, status: 'approved' } : exp
      )
    );
  }, []);

  const handleRejectExpense = useCallback((expenseId) => {
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
