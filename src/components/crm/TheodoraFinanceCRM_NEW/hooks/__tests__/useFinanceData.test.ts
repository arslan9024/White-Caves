/**
 * @file useFinanceData.test.ts
 * @description Comprehensive tests for useFinanceData hook — Finance & invoicing management
 * Tests: invoice selection, payment message, expense approve/reject, finance stats
 * Updated for Phase 1B: Now tests Redux-based invoice/expense state instead of mock imports
 */

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// ── Mock Data ──────────────────────────────────────────
const MOCK_INVOICES = [
  { id: 'INV-001', client: 'Ahmed Al Rashid', property: 'Villa 348', amount: 250000, totalAmount: 250000, status: 'paid', date: '2024-01-08', dueDate: '2024-01-15' },
  { id: 'INV-002', client: 'Sara Hassan', property: 'Apt 205', amount: 180000, totalAmount: 180000, status: 'pending', date: '2024-01-09', dueDate: '2024-01-20' },
  { id: 'INV-003', client: 'Omar Khalid', property: 'Villa 102', amount: 95000, totalAmount: 95000, status: 'overdue', date: '2024-01-01', dueDate: '2024-01-05' },
];

const MOCK_EXPENSES = [
  { id: 1, category: 'Marketing', description: 'Facebook Ads', amount: 15000, date: '2024-01-08', status: 'approved' },
  { id: 2, category: 'Office', description: 'Rent', amount: 5000, date: '2024-01-09', status: 'pending' },
  { id: 3, category: 'Travel', description: 'Site Visit', amount: 700, date: '2024-01-10', status: 'pending' },
];

// Map selector names to mock return values
// (handled by mock Redux state + real selectors — see mockState below)

// ── Mock react-redux ──────────────────────────────────
const mockDispatch = vi.fn((action) => {
  if (action && typeof action.then === 'function') return action;
  return Promise.resolve({ meta: { requestStatus: 'rejected' }, payload: null });
});

// Provide a mock Redux state — real selectors will execute against this
const mockState = {
  crmData: {
    leads: { items: [], loading: false, error: null, selected: null },
    clients: { items: [], loading: false, error: null, selected: null },
    agents: { items: [], loading: false, error: null, selected: null },
    properties: { items: [], loading: false, error: null, selected: null },
    commissions: { items: [], loading: false, error: null },
    invoices: { items: MOCK_INVOICES, loading: false, error: null },
    expenses: { items: MOCK_EXPENSES, loading: false, error: null },
    activities: { items: [] },
    overview: {},
    lastUpdated: null,
  },
};

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => {
    try {
      return selector(mockState);
    } catch {
      return undefined;
    }
  },
}));

// ── Mock the thunks ──────────────────────────────────
vi.mock('../../../../../store/crmDataSlice', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../../../store/crmDataSlice')>();
  return {
    ...original,
    fetchCommissionsFromAPI: vi.fn(() => ({ type: 'mock/fetchCommissions' })),
    fetchFinanceSummary: vi.fn(() => ({ type: 'mock/fetchFinanceSummary' })),
    createCommissionAPI: vi.fn(() => ({ type: 'mock/createCommission' })),
    updateCommissionAPI: vi.fn(() => ({ type: 'mock/updateCommission' })),
    bulkPayCommissionsAPI: vi.fn(() => ({ type: 'mock/bulkPay' })),
    fetchInvoicesFromAPI: vi.fn(() => ({ type: 'mock/fetchInvoices' })),
    createInvoiceAPI: vi.fn(() => ({ type: 'mock/createInvoice' })),
    updateInvoiceAPI: vi.fn(() => ({ type: 'mock/updateInvoice' })),
    deleteInvoiceAPI: vi.fn(() => ({ type: 'mock/deleteInvoice' })),
    fetchExpensesFromAPI: vi.fn(() => ({ type: 'mock/fetchExpenses' })),
    createExpenseAPI: vi.fn(() => ({ type: 'mock/createExpense' })),
    updateExpenseAPI: vi.fn((data: any) => ({ type: 'mock/updateExpense', payload: data })),
    deleteExpenseAPI: vi.fn(() => ({ type: 'mock/deleteExpense' })),
  };
});

// Mock store module to avoid import errors
vi.mock('../../../../../store/store', () => ({
  AppDispatch: undefined,
}));

// Mock data modules (still needed for type exports)
vi.mock('../../data/finance', () => ({
  Invoice: undefined,
  Expense: undefined,
}));

vi.mock('../../data/features', () => ({
  FINANCE_FEATURES: ['Invoice generation', 'Payment processing', 'Expense management'],
}));

import { useFinanceData } from '../useFinanceData';

describe('useFinanceData', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Initial State ────────────────────────────────────
  describe('Initial State', () => {
    it('returns invoices from Redux', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.invoices).toHaveLength(3);
      expect(result.current.invoices[0].id).toBe('INV-001');
    });

    it('returns expenses from Redux', () => {
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

    it('dispatches fetch on mount for commissions, invoices, and expenses', () => {
      renderHook(() => useFinanceData());
      const dispatchedTypes = mockDispatch.mock.calls.map(([a]: any[]) => a?.type).filter(Boolean);
      expect(dispatchedTypes).toContain('mock/fetchCommissions');
      expect(dispatchedTypes).toContain('mock/fetchInvoices');
      expect(dispatchedTypes).toContain('mock/fetchExpenses');
    });
  });

  // ── Finance Stats ──────────────────────────────────────
  describe('financeStats', () => {
    it('computes totalRevenue from invoice data', () => {
      const { result } = renderHook(() => useFinanceData());
      // 250000 + 180000 + 95000 = 525000
      expect(result.current.financeStats.totalRevenue).toBe(525000);
    });

    it('computes pendingAmount from pending invoices', () => {
      const { result } = renderHook(() => useFinanceData());
      // Only INV-002: 180000
      expect(result.current.financeStats.pendingAmount).toBe(180000);
    });

    it('computes pendingCount from pending invoices', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.financeStats.pendingCount).toBe(1);
    });

    it('computes overdueAmount from overdue invoices', () => {
      const { result } = renderHook(() => useFinanceData());
      // Only INV-003: 95000
      expect(result.current.financeStats.overdueAmount).toBe(95000);
    });

    it('computes overdueCount from overdue invoices', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(result.current.financeStats.overdueCount).toBe(1);
    });

    it('computes totalExpenses from expenses data', () => {
      const { result } = renderHook(() => useFinanceData());
      // 15000 + 5000 + 700 = 20700
      expect(result.current.financeStats.totalExpenses).toBe(20700);
    });

    it('computes approvedExpenses from approved expenses', () => {
      const { result } = renderHook(() => useFinanceData());
      // Only Marketing 15000
      expect(result.current.financeStats.approvedExpenses).toBe(15000);
    });

    it('computes pendingExpenses from pending expenses', () => {
      const { result } = renderHook(() => useFinanceData());
      // 5000 + 700 = 5700
      expect(result.current.financeStats.pendingExpenses).toBe(5700);
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

  // ── Approve Expense (now dispatches Redux thunk) ───────
  describe('handleApproveExpense', () => {
    it('dispatches updateExpenseAPI with approved status', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleApproveExpense(2));
      const updateCalls = mockDispatch.mock.calls.filter(
        ([a]: any[]) => a?.type === 'mock/updateExpense'
      );
      expect(updateCalls.length).toBeGreaterThanOrEqual(1);
      // Verify the dispatched payload
      const lastCall = updateCalls[updateCalls.length - 1][0];
      expect(lastCall.payload).toEqual({ id: '2', status: 'approved' });
    });
  });

  // ── Reject Expense (now dispatches Redux thunk) ────────
  describe('handleRejectExpense', () => {
    it('dispatches updateExpenseAPI with rejected status', () => {
      const { result } = renderHook(() => useFinanceData());
      act(() => result.current.handleRejectExpense(2));
      const updateCalls = mockDispatch.mock.calls.filter(
        ([a]: any[]) => a?.type === 'mock/updateExpense'
      );
      expect(updateCalls.length).toBeGreaterThanOrEqual(1);
      const lastCall = updateCalls[updateCalls.length - 1][0];
      expect(lastCall.payload).toEqual({ id: '2', status: 'rejected' });
    });
  });

  // ── CRUD Handlers ──────────────────────────────────────
  describe('CRUD handlers', () => {
    it('exposes handleCreateInvoice', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(typeof result.current.handleCreateInvoice).toBe('function');
    });

    it('exposes handleUpdateInvoice', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(typeof result.current.handleUpdateInvoice).toBe('function');
    });

    it('exposes handleDeleteInvoice', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(typeof result.current.handleDeleteInvoice).toBe('function');
    });

    it('exposes handleCreateExpense', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(typeof result.current.handleCreateExpense).toBe('function');
    });

    it('exposes handleUpdateExpense', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(typeof result.current.handleUpdateExpense).toBe('function');
    });

    it('exposes handleDeleteExpense', () => {
      const { result } = renderHook(() => useFinanceData());
      expect(typeof result.current.handleDeleteExpense).toBe('function');
    });
  });

  // ── Refresh ────────────────────────────────────────────
  describe('handleRefreshCommissions', () => {
    it('dispatches fetch for commissions, invoices, and expenses on refresh', () => {
      const { result } = renderHook(() => useFinanceData());
      mockDispatch.mockClear();
      act(() => result.current.handleRefreshCommissions());
      const dispatchedTypes = mockDispatch.mock.calls.map(([a]: any[]) => a?.type).filter(Boolean);
      expect(dispatchedTypes).toContain('mock/fetchCommissions');
      expect(dispatchedTypes).toContain('mock/fetchInvoices');
      expect(dispatchedTypes).toContain('mock/fetchExpenses');
    });
  });
});
