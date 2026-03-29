/**
 * @file PendingApprovalPage.test.tsx
 * @description Comprehensive tests for PendingApprovalPage auth component
 * Tests: rendering, redirects, user info display, logout, role labels, null states
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

const mockDispatch = vi.fn();

const { mockSafeStorage } = vi.hoisted(() => ({
  mockSafeStorage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    getJSON: vi.fn(),
    setJSON: vi.fn(),
  },
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: Function) => selector(mockReduxState),
  useDispatch: () => mockDispatch,
}));

const { mockSignOut } = vi.hoisted(() => ({
  mockSignOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('firebase/auth', () => ({
  signOut: mockSignOut,
}));

vi.mock('../../../config/firebase', () => ({
  auth: {},
}));

vi.mock('../../../store/userSlice', () => ({
  setUser: (val: any) => ({ type: 'user/setUser', payload: val }),
}));

vi.mock('../../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('../../../utils/safeStorage', () => ({
  safeStorage: mockSafeStorage,
}));

vi.mock('../AuthPages.css', () => ({}));

let mockReduxState: any;

import PendingApprovalPage from '../PendingApprovalPage';

describe('PendingApprovalPage', () => {
  const mockUser = {
    id: 'user-1',
    name: 'Ahmed Hassan',
    email: 'ahmed@whitecaves.com',
    photo: 'https://example.com/ahmed.jpg',
  };

  const mockUserData = {
    role: 'leasing-agent',
    status: 'pending',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockReduxState = { user: { currentUser: mockUser } };
    mockSafeStorage.getJSON.mockReturnValue(mockUserData);
  });

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders the pending approval page', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Pending Approval')).toBeInTheDocument();
    });

    it('displays the subtitle', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Your staff account is awaiting admin approval')).toBeInTheDocument();
    });

    it('displays the pending icon', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText('⏳')).toBeInTheDocument();
    });

    it('displays company logo link', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByAltText('White Caves')).toBeInTheDocument();
    });

    it('displays info about review process', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText(/team will review your application/)).toBeInTheDocument();
      expect(screen.getByText(/1-2 business days/)).toBeInTheDocument();
    });
  });

  // ── User Details ───────────────────────────────────────
  describe('User Details', () => {
    it('displays user name', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Ahmed Hassan')).toBeInTheDocument();
    });

    it('displays user email', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText('ahmed@whitecaves.com')).toBeInTheDocument();
    });

    it('displays role label', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Leasing Agent')).toBeInTheDocument();
    });

    it('displays pending status', async () => {
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Pending Review')).toBeInTheDocument();
    });

    it('displays "Not provided" for missing name', async () => {
      mockReduxState = { user: { currentUser: { email: 'test@test.com' } } };
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Not provided')).toBeInTheDocument();
    });
  });

  // ── Role Labels ────────────────────────────────────────
  describe('Role Labels', () => {
    it('maps leasing-agent to Leasing Agent', async () => {
      mockSafeStorage.getJSON.mockReturnValue({ role: 'leasing-agent', status: 'pending' });
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Leasing Agent')).toBeInTheDocument();
    });

    it('maps secondary-sales-agent to Sales Agent', async () => {
      mockSafeStorage.getJSON.mockReturnValue({ role: 'secondary-sales-agent', status: 'pending' });
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Sales Agent')).toBeInTheDocument();
    });

    it('maps team-leader to Team Leader', async () => {
      mockSafeStorage.getJSON.mockReturnValue({ role: 'team-leader', status: 'pending' });
      render(<PendingApprovalPage />);
      expect(await screen.findByText('Team Leader')).toBeInTheDocument();
    });

    it('falls back to raw role for unknown roles', async () => {
      mockSafeStorage.getJSON.mockReturnValue({ role: 'custom-role', status: 'pending' });
      render(<PendingApprovalPage />);
      expect(await screen.findByText('custom-role')).toBeInTheDocument();
    });
  });

  // ── Redirects ──────────────────────────────────────────
  describe('Redirects', () => {
    it('redirects to /signin when no user', () => {
      mockReduxState = { user: { currentUser: null } };
      render(<PendingApprovalPage />);
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    it('redirects to dashboard when status is not pending', () => {
      mockSafeStorage.getJSON.mockReturnValue({ role: 'leasing-agent', status: 'approved' });
      render(<PendingApprovalPage />);
      expect(mockNavigate).toHaveBeenCalledWith('/leasing-agent/dashboard');
    });

    it('does not redirect when status is pending', () => {
      render(<PendingApprovalPage />);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ── Logout ─────────────────────────────────────────────
  describe('Logout', () => {
    it('calls signOut on logout click', async () => {
      render(<PendingApprovalPage />);
      const signOutBtn = await screen.findByText('Sign Out');
      fireEvent.click(signOutBtn);
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('removes userRole from storage', async () => {
      render(<PendingApprovalPage />);
      const signOutBtn = await screen.findByText('Sign Out');
      fireEvent.click(signOutBtn);
      await waitFor(() => {
        expect(mockSafeStorage.remove).toHaveBeenCalledWith('userRole');
      });
    });

    it('dispatches setUser(null)', async () => {
      render(<PendingApprovalPage />);
      const signOutBtn = await screen.findByText('Sign Out');
      fireEvent.click(signOutBtn);
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/setUser', payload: null });
      });
    });

    it('navigates to / after logout', async () => {
      render(<PendingApprovalPage />);
      const signOutBtn = await screen.findByText('Sign Out');
      fireEvent.click(signOutBtn);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  // ── Action Links ───────────────────────────────────────
  describe('Action Links', () => {
    it('has Browse Properties link', async () => {
      render(<PendingApprovalPage />);
      const link = await screen.findByText('Browse Properties');
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/');
    });
  });

  // ── Null State ─────────────────────────────────────────
  describe('Null State', () => {
    it('renders nothing when no user and no userData', () => {
      mockReduxState = { user: { currentUser: null } };
      mockSafeStorage.getJSON.mockReturnValue(null);
      const { container } = render(<PendingApprovalPage />);
      // redirects to /signin, renders null
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    it('renders nothing when user exists but no userData', () => {
      mockSafeStorage.getJSON.mockReturnValue(null);
      const { container } = render(<PendingApprovalPage />);
      // No userData means early-return null
      expect(container.firstChild).toBeNull();
    });
  });
});
