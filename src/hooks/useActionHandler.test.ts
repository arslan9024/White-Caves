import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock dependencies before importing the hook
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('../store/slices/notificationSlice', () => ({
  addNotification: vi.fn((payload) => ({ type: 'notifications/addNotification', payload })),
}));

import { useActionHandler } from './useActionHandler';
import { addNotification } from '../store/slices/notificationSlice';

describe('useActionHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── getActionRoute ─────────────────────────────────────────────
  describe('getActionRoute', () => {
    // Sales department
    describe('sales department', () => {
      it.each([
        ['view leads', 'sales', '/dashboard/sales/leads'],
        ['add lead', 'sales', '/dashboard/sales/leads/new'],
        ['lead analytics', 'sales', '/dashboard/sales/lead-analytics'],
        ['deal pipeline', 'sales', '/dashboard/sales/deals/pipeline'],
        ['deal analysis', 'sales', '/dashboard/sales/deals/analysis'],
        ['new deal', 'sales', '/dashboard/sales/deals/new'],
        ['view negotiation', 'sales', '/dashboard/sales/negotiations'],
        ['add negotiation', 'sales', '/dashboard/sales/negotiations/new'],
        ['commission log', 'sales', '/dashboard/sales/commissions/log'],
        ['commission calculate', 'sales', '/dashboard/sales/commissions/calculator'],
        ['commission report', 'sales', '/dashboard/sales/commissions/report'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // Property management
    describe('properties department', () => {
      it.each([
        ['portfolio overview', 'properties', '/dashboard/properties/portfolio'],
        ['property valuation', 'properties', '/dashboard/properties/valuation'],
        ['upload document', 'properties', '/dashboard/properties/documents'],
        ['legal review', 'properties', '/dashboard/properties/legal'],
        ['maintenance request', 'properties', '/dashboard/properties/maintenance'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // Tenant management
    describe('tenant department', () => {
      it.each([
        ['lease agreement', 'tenant', '/dashboard/tenant/leases'],
        ['maintenance request', 'tenant', '/dashboard/tenant/maintenance'],
        ['tenant screening', 'tenant', '/dashboard/tenant/screening'],
        ['send message', 'tenant', '/dashboard/tenant/messages'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // Finance
    describe('finance department', () => {
      it.each([
        ['budget overview', 'finance', '/dashboard/finance/budget'],
        ['expense tracking', 'finance', '/dashboard/finance/expenses'],
        ['cash flow', 'finance', '/dashboard/finance/cash-flow'],
        ['bank reconcile', 'finance', '/dashboard/finance/reconciliation'],
        ['financial report', 'finance', '/dashboard/finance/reports'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // Marketing
    describe('marketing department', () => {
      it.each([
        ['campaign manager', 'marketing', '/dashboard/marketing/campaigns'],
        ['content planner', 'marketing', '/dashboard/marketing/content'],
        ['lead nurture', 'marketing', '/dashboard/marketing/lead-nurture'],
        ['marketing analytics', 'marketing', '/dashboard/marketing/analytics'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // HR
    describe('hr department', () => {
      it.each([
        ['employee directory', 'hr', '/dashboard/hr/employees'],
        ['post job', 'hr', '/dashboard/hr/jobs'],
        ['review applicant', 'hr', '/dashboard/hr/applicants'],
        ['process payroll', 'hr', '/dashboard/hr/payroll'],
        ['leave management', 'hr', '/dashboard/hr/leaves'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // Operations
    describe('operations department', () => {
      it.each([
        ['create task', 'operations', '/dashboard/operations/tasks'],
        ['project status', 'operations', '/dashboard/operations/projects'],
        ['sprint planning', 'operations', '/dashboard/operations/sprints'],
        ['release notes', 'operations', '/dashboard/operations/releases'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // Legal
    describe('legal department', () => {
      it.each([
        ['contract review', 'legal', '/dashboard/legal/contracts'],
        ['agreement signing', 'legal', '/dashboard/legal/agreements'],
        ['compliance check', 'legal', '/dashboard/legal/compliance'],
        ['legal document', 'legal', '/dashboard/legal/documents'],
      ])('routes "%s" in %s to %s', (action, dept, expected) => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute(action, dept)).toBe(expected);
      });
    });

    // Unknown
    describe('unknown routes', () => {
      it('returns null for unknown department', () => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute('anything', 'unknown')).toBeNull();
      });

      it('returns null for unknown action in valid department', () => {
        const { result } = renderHook(() => useActionHandler());
        expect(result.current.getActionRoute('zzz-nonexistent', 'sales')).toBeNull();
      });
    });
  });

  // ─── handleAction ───────────────────────────────────────────────
  describe('handleAction', () => {
    it('dispatches processing notification then navigates on known route', () => {
      const { result } = renderHook(() => useActionHandler());
      result.current.handleAction('View Leads', 'sales');

      // First dispatch: processing notification
      expect(mockDispatch).toHaveBeenCalled();
      expect(addNotification).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'info', title: 'Processing...' })
      );

      // Navigation
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/sales/leads');

      // Second dispatch: success notification
      expect(addNotification).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );
    });

    it('dispatches "coming soon" notification for unknown route', () => {
      const { result } = renderHook(() => useActionHandler());
      result.current.handleAction('Unknown Feature', 'unknown-dept');

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          message: expect.stringContaining('coming soon'),
        })
      );
    });

    it('lowercases the action label for route matching', () => {
      const { result } = renderHook(() => useActionHandler());
      result.current.handleAction('VIEW LEADS', 'sales');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/sales/leads');
    });

    it('dispatches error notification on exception', () => {
      mockDispatch.mockImplementationOnce(() => { throw new Error('dispatch fail'); });
      const { result } = renderHook(() => useActionHandler());
      result.current.handleAction('View Leads', 'sales');

      // After retry-like behavior, should have dispatched error notification
      // The error is caught internally
      expect(addNotification).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      );
    });
  });
});
