import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./RoleSelection.css', () => ({}));

// Mock Redux
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (fn: any) => fn({ auth: { token: 'test-token-123' } }),
  };
});

// Mock roleSlice
vi.mock('../../../../store/roleSlice', () => ({
  setUserRoles: vi.fn((roles) => ({ type: 'role/setUserRoles', payload: roles })),
  setActiveRole: vi.fn((role) => ({ type: 'role/setActiveRole', payload: role })),
  submitRoleChangeRequest: vi.fn((data) => ({ type: 'role/submitRoleChangeRequest', payload: data })),
}));

// Mock apiClient
const mockPost = vi.fn().mockResolvedValue({ data: { success: true } });
const mockSetAuthToken = vi.fn();
vi.mock('../../../../utils/apiClient', () => ({
  apiClient: {
    post: (...args: any[]) => mockPost(...args),
    setAuthToken: (...args: any[]) => mockSetAuthToken(...args),
  },
}));

// Mock logger
vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }),
}));

import RoleSelectionForm from './RoleSelectionForm';
import { setUserRoles, setActiveRole, submitRoleChangeRequest } from '../../../../store/roleSlice';

const defaultProps = {
  userId: 'user-123',
  onComplete: vi.fn(),
  onSkip: vi.fn(),
};

const renderForm = (props = {}) => render(<RoleSelectionForm {...defaultProps} {...props} />);

describe('RoleSelectionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockResolvedValue({ data: { success: true } });
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders heading', () => {
      renderForm();
      expect(screen.getByText('Choose Your Role')).toBeInTheDocument();
    });

    it('renders description', () => {
      renderForm();
      expect(screen.getByText("Select how you'd like to use White Caves Real Estate")).toBeInTheDocument();
    });

    it('renders all 6 role options', () => {
      renderForm();
      expect(screen.getByText('Buyer')).toBeInTheDocument();
      expect(screen.getByText('Tenant')).toBeInTheDocument();
      expect(screen.getByText('Seller')).toBeInTheDocument();
      expect(screen.getByText('Landlord')).toBeInTheDocument();
      expect(screen.getByText('Leasing Agent')).toBeInTheDocument();
      expect(screen.getByText('Sales Agent')).toBeInTheDocument();
    });

    it('renders role descriptions', () => {
      renderForm();
      expect(screen.getByText('Looking to buy property in Dubai')).toBeInTheDocument();
      expect(screen.getByText('Looking to rent a property')).toBeInTheDocument();
    });

    it('renders Continue button', () => {
      renderForm();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('renders Skip button', () => {
      renderForm();
      expect(screen.getByText('Skip for now')).toBeInTheDocument();
    });

    it('shows Requires Approval badge on non-auto-approve roles', () => {
      renderForm();
      const badges = screen.getAllByText('Requires Approval');
      // Seller, Landlord, Leasing Agent, Sales Agent = 4
      expect(badges.length).toBe(4);
    });
  });

  // ── Role Selection ─────────────────────────────────────────
  describe('role selection', () => {
    it('disables Continue when no role selected', () => {
      renderForm();
      expect(screen.getByText('Continue')).toBeDisabled();
    });

    it('enables Continue when a role is selected', () => {
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      expect(screen.getByText('Continue')).not.toBeDisabled();
    });

    it('selects the radio when role option is clicked', () => {
      renderForm();
      fireEvent.click(screen.getByText('Tenant'));
      const radio = screen.getByDisplayValue('tenant') as HTMLInputElement;
      expect(radio.checked).toBe(true);
    });

    it('does not show approval notice for auto-approve roles', () => {
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      expect(screen.queryByText('Approval Required')).not.toBeInTheDocument();
    });

    it('shows approval notice for non-auto-approve roles', () => {
      renderForm();
      fireEvent.click(screen.getByText('Seller'));
      expect(screen.getByText('Approval Required')).toBeInTheDocument();
    });

    it('shows textarea for reason when non-auto-approve', () => {
      renderForm();
      fireEvent.click(screen.getByText('Landlord'));
      expect(screen.getByPlaceholderText(/Why are you requesting this role/)).toBeInTheDocument();
    });

    it('hides approval notice when switching to auto-approve role', () => {
      renderForm();
      fireEvent.click(screen.getByText('Seller'));
      expect(screen.getByText('Approval Required')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Buyer'));
      expect(screen.queryByText('Approval Required')).not.toBeInTheDocument();
    });
  });

  // ── Skip ───────────────────────────────────────────────────
  describe('skip', () => {
    it('calls onSkip when Skip button is clicked', () => {
      renderForm();
      fireEvent.click(screen.getByText('Skip for now'));
      expect(defaultProps.onSkip).toHaveBeenCalled();
    });
  });

  // ── Submit ─────────────────────────────────────────────────
  describe('submit', () => {
    it('submits auto-approve role via API', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(mockSetAuthToken).toHaveBeenCalledWith('test-token-123');
        expect(mockPost).toHaveBeenCalledWith('/users/role', {
          userId: 'user-123',
          role: 'buyer',
          status: 'approved',
        });
      });
    });

    it('dispatches setUserRoles and setActiveRole for auto-approve', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(setUserRoles(['buyer']));
        expect(mockDispatch).toHaveBeenCalledWith(setActiveRole('buyer'));
      });
    });

    it('calls onComplete with role and autoApproved=true', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(defaultProps.onComplete).toHaveBeenCalledWith('buyer', true);
      });
    });

    it('submits non-auto-approve role as role-request', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Seller'));
      const textarea = screen.getByPlaceholderText(/Why are you requesting/);
      fireEvent.change(textarea, { target: { value: 'I want to sell' } });
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/users/role-request', {
          userId: 'user-123',
          requestedRole: 'seller',
          reason: 'I want to sell',
        });
      });
    });

    it('dispatches submitRoleChangeRequest for non-auto-approve', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Seller'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          submitRoleChangeRequest({
            userId: 'user-123',
            currentRole: 'buyer',
            requestedRole: 'seller',
            reason: '',
          })
        );
      });
    });

    it('falls back to buyer role for non-auto-approve', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Landlord'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(setUserRoles(['buyer']));
        expect(mockDispatch).toHaveBeenCalledWith(setActiveRole('buyer'));
      });
    });

    it('calls onComplete with autoApproved=false for non-auto-approve', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Seller'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(defaultProps.onComplete).toHaveBeenCalledWith('seller', false);
      });
    });

    it('shows Processing... during submission', async () => {
      mockPost.mockImplementation(() => new Promise(() => {})); // never resolves
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(screen.getByText('Processing...')).toBeInTheDocument();
      });
    });
  });

  // ── Error Handling ─────────────────────────────────────────
  describe('error handling', () => {
    it('re-enables form after API failure', async () => {
      mockPost.mockRejectedValue(new Error('Network error'));
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(screen.getByText('Continue')).not.toBeDisabled();
      });
    });

    it('does not call onComplete on API failure', async () => {
      mockPost.mockRejectedValue(new Error('Network error'));
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(screen.getByText('Continue')).not.toBeDisabled();
      });
      expect(defaultProps.onComplete).not.toHaveBeenCalled();
    });

    it('re-enables form after non-Error thrown', async () => {
      mockPost.mockRejectedValue('something went wrong');
      renderForm();
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(screen.getByText('Continue')).not.toBeDisabled();
      });
    });
  });
});
