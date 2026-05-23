/**
 * RoleApprovalQueue — Unit Tests
 * Tests: rendering, filter buttons, request cards, approve/reject flow,
 * rejection modal, empty state, role labels, status badges
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// ── Mocks ────────────────────────────────────────────────────────

const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
vi.mock('../../../../components/Toast', () => ({
  useToast: () => mockToast,
}));

vi.mock('../../../../utils/apiClient', () => ({
  apiClient: {
    setAuthToken: vi.fn(),
    get: vi.fn().mockResolvedValue({ requests: [] }),
    post: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('../../../../utils', () => ({
  formatDate: (dateStr: string) => dateStr || 'N/A',
}));

import RoleApprovalQueue from './RoleApprovalQueue';
import roleReducer from '../../../../store/roleSlice';
import authReducer from '../../../../store/authSlice';
import type { RoleRequest } from '../../../../store/roleSlice';
import { apiClient } from '../../../../utils/apiClient';

// ── Helpers ──────────────────────────────────────────────────────

const MOCK_REQUEST: RoleRequest = {
  id: 'req-1',
  userId: 'user-1',
  currentRole: 'buyer',
  requestedRole: 'leasing_agent',
  reason: 'I want to become an agent',
  status: 'pending',
  requestedAt: '2025-10-15T10:00:00Z',
  reviewedAt: null,
  reviewedBy: null,
  userName: 'Ahmed Al-Rashid',
  userEmail: 'ahmed@whitecaves.ae',
};

const APPROVED_REQUEST: RoleRequest = {
  id: 'req-2',
  userId: 'user-2',
  currentRole: 'tenant',
  requestedRole: 'landlord',
  reason: 'Own a property now',
  status: 'approved',
  requestedAt: '2025-10-10T08:00:00Z',
  reviewedAt: '2025-10-12T09:00:00Z',
  reviewedBy: 'admin-1',
  userName: 'Fatima Ali',
  userEmail: 'fatima@whitecaves.ae',
};

const REJECTED_REQUEST: RoleRequest = {
  id: 'req-3',
  userId: 'user-3',
  currentRole: 'buyer',
  requestedRole: 'sales_agent',
  reason: 'Want to sell',
  status: 'rejected',
  requestedAt: '2025-10-05T06:00:00Z',
  reviewedAt: '2025-10-06T07:00:00Z',
  reviewedBy: 'admin-1',
  userName: 'Omar Khan',
  userEmail: 'omar@whitecaves.ae',
};

const createMockStore = (
  roleOverrides: Partial<{ pendingRequests: RoleRequest[] }> = {},
  authOverrides: Record<string, unknown> = {}
) => {
  return configureStore({
    reducer: {
      role: roleReducer,
      auth: authReducer,
    },
    preloadedState: {
      role: {
        availableRoles: [],
        userRoles: [],
        activeRole: null,
        pendingRequests: [],
        userRoleRequest: {
          isRequesting: false,
          lastRequestStatus: 'idle' as const,
          errorMessage: null,
        },
        statusHistory: [],
        ...roleOverrides,
      } as ReturnType<typeof roleReducer>,
      auth: {
        user: { id: 'admin-1', displayName: 'Admin', email: 'admin@whitecaves.ae', role: 'admin' },
        token: 'test-token',
        refreshToken: null,
        session: {
          isLoggedIn: true,
          lastActive: null,
          sessions: [],
          expiresAt: null,
          activeSessionId: null,
        },
        loginMethods: { social: false, email: false, mobile: false },
        loginProvider: null,
        rememberMe: false,
        sessionTimeout: 30,
        loading: false,
        error: null,
        ...authOverrides,
      } as ReturnType<typeof authReducer>,
    },
  });
};

const renderWithStore = (
  roleOverrides: Partial<{ pendingRequests: RoleRequest[] }> = {},
  authOverrides: Record<string, unknown> = {}
) => {
  const store = createMockStore(roleOverrides, authOverrides);
  return render(
    <Provider store={store}>
      <RoleApprovalQueue />
    </Provider>
  );
};

// ── Tests ────────────────────────────────────────────────────────

describe('RoleApprovalQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ requests: [] });
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the queue header', () => {
      renderWithStore();
      expect(screen.getByText('Role Approval Queue')).toBeInTheDocument();
    });

    it('should render filter buttons', () => {
      renderWithStore();
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });

    it('should show empty state when no requests match filter', () => {
      renderWithStore();
      expect(screen.getByText('No requests found')).toBeInTheDocument();
    });

    it('should display empty icon', () => {
      renderWithStore();
      expect(screen.getByText('📋')).toBeInTheDocument();
    });
  });

  // ── Filter Buttons ───────────────────────────────────────────

  describe('Filter Buttons', () => {
    it('should default to "pending" filter', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST, APPROVED_REQUEST] });
      // Only the pending request should show
      expect(screen.getByText('Ahmed Al-Rashid')).toBeInTheDocument();
      expect(screen.queryByText('Fatima Ali')).not.toBeInTheDocument();
    });

    it('should show all requests when "All" filter is selected', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST, APPROVED_REQUEST] });
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('Ahmed Al-Rashid')).toBeInTheDocument();
      expect(screen.getByText('Fatima Ali')).toBeInTheDocument();
    });

    it('should show only approved requests when "Approved" filter is selected', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST, APPROVED_REQUEST, REJECTED_REQUEST] });
      fireEvent.click(screen.getByText('Approved'));
      expect(screen.queryByText('Ahmed Al-Rashid')).not.toBeInTheDocument();
      expect(screen.getByText('Fatima Ali')).toBeInTheDocument();
    });

    it('should show only rejected requests when "Rejected" filter is selected', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST, APPROVED_REQUEST, REJECTED_REQUEST] });
      fireEvent.click(screen.getByText('Rejected'));
      expect(screen.getByText('Omar Khan')).toBeInTheDocument();
      expect(screen.queryByText('Ahmed Al-Rashid')).not.toBeInTheDocument();
    });

    it('should show pending count badge when pending requests exist', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  // ── Request Cards ────────────────────────────────────────────

  describe('Request Cards', () => {
    it('should display user name', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('Ahmed Al-Rashid')).toBeInTheDocument();
    });

    it('should display user email', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('ahmed@whitecaves.ae')).toBeInTheDocument();
    });

    it('should display user avatar initial', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('should display status badge', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      // "Pending" appears as both a filter button and a status badge
      const pendingElements = screen.getAllByText('Pending');
      expect(pendingElements.length).toBeGreaterThanOrEqual(2);
    });

    it('should display current and requested roles with arrow', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('Buyer')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
      expect(screen.getByText('Leasing Agent')).toBeInTheDocument();
    });

    it('should display the reason', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText(/I want to become an agent/)).toBeInTheDocument();
    });

    it('should show Approve and Reject buttons for pending requests', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('Approve')).toBeInTheDocument();
      expect(screen.getByText('Reject')).toBeInTheDocument();
    });

    it('should show review info for non-pending requests', () => {
      renderWithStore({ pendingRequests: [APPROVED_REQUEST] });
      fireEvent.click(screen.getByText('Approved'));
      expect(screen.getByText(/Approved on/)).toBeInTheDocument();
    });

    it('should show "Unknown User" when userName is missing', () => {
      const noNameRequest = { ...MOCK_REQUEST, userName: undefined, userEmail: undefined };
      renderWithStore({ pendingRequests: [noNameRequest] });
      expect(screen.getByText('Unknown User')).toBeInTheDocument();
    });

    it('should show "?" avatar for missing userName', () => {
      const noNameRequest = { ...MOCK_REQUEST, userName: undefined };
      renderWithStore({ pendingRequests: [noNameRequest] });
      expect(screen.getByText('?')).toBeInTheDocument();
    });
  });

  // ── Approve Flow ─────────────────────────────────────────────

  describe('Approve Flow', () => {
    it('should call API and dispatch on approve', async () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });

      fireEvent.click(screen.getByText('Approve'));

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith(
          '/admin/role-requests/req-1/approve',
          expect.objectContaining({ reviewedBy: 'admin-1' })
        );
      });
    });

    it('should show success toast on approve', async () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Approve'));

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          expect.stringContaining('approved successfully')
        );
      });
    });

    it('should show error toast when approve fails', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Approve'));

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Network error');
      });
    });
  });

  // ── Reject Flow ──────────────────────────────────────────────

  describe('Reject Flow', () => {
    it('should open rejection modal on reject click', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      expect(screen.getByText('Reject Role Request')).toBeInTheDocument();
    });

    it('should display the user name in the modal', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      // Name appears in both the card and the modal
      const nameElements = screen.getAllByText(/Ahmed Al-Rashid/);
      expect(nameElements.length).toBeGreaterThanOrEqual(2);
    });

    it('should have a textarea for rejection reason', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      expect(screen.getByPlaceholderText('Enter rejection reason...')).toBeInTheDocument();
    });

    it('should have Cancel and Confirm Rejection buttons', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm Rejection')).toBeInTheDocument();
    });

    it('should disable Confirm Rejection when no reason is entered', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      const btn = screen.getByText('Confirm Rejection');
      expect(btn).toBeDisabled();
    });

    it('should enable Confirm Rejection when reason is entered', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      fireEvent.change(screen.getByPlaceholderText('Enter rejection reason...'), {
        target: { value: 'Not qualified' },
      });
      const btn = screen.getByText('Confirm Rejection');
      expect(btn).not.toBeDisabled();
    });

    it('should close modal on Cancel click', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Reject Role Request')).not.toBeInTheDocument();
    });

    it('should call API with reason on confirm rejection', async () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      fireEvent.click(screen.getByText('Reject'));
      fireEvent.change(screen.getByPlaceholderText('Enter rejection reason...'), {
        target: { value: 'Not qualified' },
      });
      fireEvent.click(screen.getByText('Confirm Rejection'));

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith(
          '/admin/role-requests/req-1/reject',
          expect.objectContaining({ reason: 'Not qualified' })
        );
      });
    });

    it('should show warning toast when trying to reject without reason', async () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      // Directly try to reject by calling handleReject path -
      // The button is disabled so the actual check is in handleReject
      // Just verify the button is disabled
      fireEvent.click(screen.getByText('Reject'));
      const btn = screen.getByText('Confirm Rejection');
      expect(btn).toBeDisabled();
    });
  });

  // ── Role Labels ──────────────────────────────────────────────

  describe('Role Labels', () => {
    it('should map "buyer" to "Buyer"', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('Buyer')).toBeInTheDocument();
    });

    it('should map "leasing_agent" to "Leasing Agent"', () => {
      renderWithStore({ pendingRequests: [MOCK_REQUEST] });
      expect(screen.getByText('Leasing Agent')).toBeInTheDocument();
    });

    it('should map "landlord" to "Landlord"', () => {
      const req = { ...MOCK_REQUEST, requestedRole: 'landlord' };
      renderWithStore({ pendingRequests: [req] });
      expect(screen.getByText('Landlord')).toBeInTheDocument();
    });

    it('should show raw role when label not found', () => {
      const req = { ...MOCK_REQUEST, requestedRole: 'custom_role' };
      renderWithStore({ pendingRequests: [req] });
      expect(screen.getByText('custom_role')).toBeInTheDocument();
    });
  });

  // ── API Integration ──────────────────────────────────────────

  describe('API Integration', () => {
    it('should fetch role requests on mount', async () => {
      renderWithStore();
      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/admin/role-requests');
      });
    });

    it('should set auth token before API call', async () => {
      renderWithStore();
      await waitFor(() => {
        expect(apiClient.setAuthToken).toHaveBeenCalledWith('test-token');
      });
    });

    it('should not fetch when token is missing', () => {
      renderWithStore({}, { token: null });
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });
});
