/**
 * @file useFinanceData.test.ts
 * @description Comprehensive tests for useFinanceData hook — Finance & invoicing management
 * Tests: invoice selection, payment message, expense approve/reject, finance stats
 */

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock react-redux so useDispatch returns a mock that handles thunks,
// and useSelector always returns [] / false / null for commission selectors
const mockDispatch = vi.fn((action) => {
  // If thunk returns a promise, return it; otherwise return a resolved promise
  if (action && typeof action.then === 'function') return action;
  return Promise.resolve({ meta: { requestStatus: 'rejected' }, payload: null });
});

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => {
    // Return empty defaults for all commission selectors
    const name = selector?.name || '';
    if (name.includes('Loading')) return false;
    if (name.includes('Error')) return null;
    return [];
  },
}));

// Mock the thunks to return plain action-like objects
vi.mock('../../../../../store/crmDataSlice', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../../../store/crmDataSlice')>();
  return {
    ...original,
    fetchCommissionsFromAPI: vi.fn(() => ({ type: 'mock/fetchCommissions' })),
    fetchFinanceSummary: vi.fn(() => ({ type: 'mock/fetchFinanceSummary' })),
    createCommissionAPI: vi.fn(() => ({ type: 'mock/createCommission' })),
    updateCommissionAPI: vi.fn(() => ({ type: 'mock/updateCommission' })),
    bulkPayCommissionsAPI: vi.fn(() => ({ type: 'mock/bulkPay' })),
  };
});

// Mock store module to avoid import errors
vi.mock('../../../../../store/store', () => ({
  AppDispatch: undefined,
}));

// Mock data modules
vi.mock('../../data/finance', () => ({
  INVOICES: [
    { id: 'INV-001', client: 'Ahmed Al Rashid', property: 'Villa 348', amount: 250000, status: 'paid', date: '2024-01-08', dueDate: '2024-01-15' },
    { id: 'INV-002', client: 'Sara Hassan', property: 'Apt 205', amount: 180000, status: 'pending', date: '2024-01-09', dueDate: '2024-01-20' },
    { id: 'INV-003', client: 'Omar Khalid', property: 'Villa 102', amount: 95000, status: 'overdue', date: '2024-01-01', dueDate: '2024-01-05' },
  ],
  EXPENSES: [
    { id: 1, category: 'Marketing', description: 'Facebook Ads', amount: 15000, date: '2024-01-08', status: 'approved' },
    { id: 2, category: 'Office', description: 'Rent', amount: 5000, date: '2024-01-09', status: 'pending' },
    { id: 3, category: 'Travel', description: 'Site Visit', amount: 700, date: '2024-01-10', status: 'pending' },
  ],
  Invoice: undefined,
  Expense: undefined,
}));

vi.mock('../../data/features', () => ({
  FINANCE_FEATURES: ['Invoice generation', 'Payment processing', 'Expense management'],
}));

import { useFinanceData } from '../useFinanceData';

describe('useFinanceData', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Initial State ──────────────────────────────────────
  describe('Initial State', () => {
    it('returns invoices from data', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.invoices).toHaveLength(3);
      expect(result.current.invoices[0].id).toBe('INV-001');
    });

    it('returns expenses from data', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.expenses).toHaveLength(3);
    });

    it('selectedInvoice starts as null', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.selectedInvoice).toBeNull();
    });

    it('generatedMessage starts empty', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.generatedMessage).toBe('');
    });

    it('returns features array', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.features).toHaveLength(3);
    });
  });

  // ── Finance Stats ──────────────────────────────────────
  describe('financeStats', () => {
    it('has totalRevenue', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.financeStats.totalRevenue).toBe(4200000);
    });

    it('has revenueTrend', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.financeStats.revenueTrend).toBe(18);
    });

    it('has pendingAmount and pendingCount', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.financeStats.pendingAmount).toBe(860000);
      expect(result.current.financeStats.pendingCount).toBe(12);
    });

    it('has overdueAmount and overdueCount', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.financeStats.overdueAmount).toBe(95000);
      expect(result.current.financeStats.overdueCount).toBe(3);
    });

    it('has totalExpenses, approvedExpenses, pendingExpenses', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.financeStats.totalExpenses).toBe(470700);
      expect(result.current.financeStats.approvedExpenses).toBe(20700);
      expect(result.current.financeStats.pendingExpenses).toBe(2500);
    });
  });

  // ── Select Invoice ─────────────────────────────────────
  describe('setSelectedInvoice', () => {
    it('sets the selected invoice', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.setSelectedInvoice(result.current.invoices[1]));
      expect(result.current.selectedInvoice?.id).toBe('INV-002');
    });

    it('can change selection to different invoice', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.setSelectedInvoice(result.current.invoices[0]));
      act(() => result.current.setSelectedInvoice(result.current.invoices[2]));
      expect(result.current.selectedInvoice?.id).toBe('INV-003');
    });
  });

  // ── Generate Payment Message ───────────────────────────
  describe('handleGeneratePaymentMessage', () => {
    it('stores the generated message', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleGeneratePaymentMessage('Please pay AED 180,000', 'bank_transfer'));
      expect(result.current.generatedMessage).toBe('Please pay AED 180,000');
    });

    it('overwrites previous message', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleGeneratePaymentMessage('Message 1', 'cash'));
      act(() => result.current.handleGeneratePaymentMessage('Message 2', 'card'));
      expect(result.current.generatedMessage).toBe('Message 2');
    });
  });

  // ── Approve Expense ────────────────────────────────────
  describe('handleApproveExpense', () => {
    it('changes expense status to approved', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleApproveExpense(2));
      const exp = result.current.expenses.find(e => e.id === 2);
      expect(exp?.status).toBe('approved');
    });

    it('does not affect other expenses', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleApproveExpense(2));
      expect(result.current.expenses[0].status).toBe('approved'); // id:1 stays
      expect(result.current.expenses[2].status).toBe('pending');   // id:3 stays
    });

    it('is idempotent for already approved', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleApproveExpense(1)); // already approved
      expect(result.current.expenses[0].status).toBe('approved');
    });
  });

  // ── Reject Expense ─────────────────────────────────────
  describe('handleRejectExpense', () => {
    it('changes expense status to rejected', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleRejectExpense(2));
      const exp = result.current.expenses.find(e => e.id === 2);
      expect(exp?.status).toBe('rejected');
    });

    it('does not affect other expenses', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleRejectExpense(2));
      expect(result.current.expenses[0].status).toBe('approved');
      expect(result.current.expenses[2].status).toBe('pending');
    });

    it('can reject after approval', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleApproveExpense(2));
      act(() => result.current.handleRejectExpense(2));
      expect(result.current.expenses[1].status).toBe('rejected');
    });
  });
});
