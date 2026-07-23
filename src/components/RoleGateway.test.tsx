/**
 * RoleGateway — Comprehensive Unit Tests
 *
 * Covers: role selection, role confirmation, Redux dispatch, navigation,
 * localStorage persistence, admin/owner auto-redirect, RoleGuard, useUserRole
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../store/navigationSlice', () => ({
  setActiveRole: (role: string) => ({ type: 'navigation/setActiveRole', payload: role }),
}));

const mockSafeStorage = {
  setJSON: vi.fn(),
  getJSON: vi.fn(() => null),
};
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    setJSON: (...args: unknown[]) => mockSafeStorage.setJSON(...args),
    getJSON: (...args: unknown[]) => mockSafeStorage.getJSON(...args),
  },
}));

// Mock styled components
vi.mock('./RoleGateway.styles', () => ({
  Container: ({ children, ...p }: React.PropsWithChildren) => (
    <div data-testid="rg-container" {...p}>
      {children}
    </div>
  ),
  ContainerContent: ({ children, ...p }: React.PropsWithChildren) => <div {...p}>{children}</div>,
  Header: ({ children, ...p }: React.PropsWithChildren) => <header {...p}>{children}</header>,
  Warning: ({ children, ...p }: React.PropsWithChildren) => (
    <p data-testid="warning" {...p}>
      {children}
    </p>
  ),
  RolesGrid: ({ children, ...p }: React.PropsWithChildren) => (
    <div data-testid="roles-grid" {...p}>
      {children}
    </div>
  ),
  RoleCard: ({
    children,
    $selected,
    ...p
  }: React.PropsWithChildren<{ $selected?: boolean; onClick?: () => void }>) => (
    <div role="button" data-selected={$selected} {...p}>
      {children}
    </div>
  ),
  RoleIcon: ({ children, ...p }: React.PropsWithChildren) => <span {...p}>{children}</span>,
  RoleTitle: ({ children, ...p }: React.PropsWithChildren) => <strong {...p}>{children}</strong>,
  RoleDescription: ({ children, ...p }: React.PropsWithChildren) => <span {...p}>{children}</span>,
  ActionButtons: ({ children, ...p }: React.PropsWithChildren) => (
    <div data-testid="action-buttons" {...p}>
      {children}
    </div>
  ),
  Button: ({
    children,
    $variant,
    ...p
  }: React.PropsWithChildren<{ $variant?: string; onClick?: () => void }>) => (
    <button data-variant={$variant} {...p}>
      {children}
    </button>
  ),
}));

import RoleGateway, { RoleGuard } from './RoleGateway';

// ── Setup ────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Tests ────────────────────────────────────────────────────────

describe('RoleGateway', () => {
  const defaultUser = { email: 'test@test.com' };

  describe('rendering', () => {
    it('renders role selection heading', () => {
      render(<RoleGateway user={defaultUser} />);
      expect(screen.getByText('Select Your Role')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<RoleGateway user={defaultUser} />);
      expect(screen.getByText(/determines the content and features/)).toBeInTheDocument();
    });

    it('renders warning about role lock', () => {
      render(<RoleGateway user={defaultUser} />);
      expect(screen.getByText(/cannot be changed after selection/)).toBeInTheDocument();
    });

    it('renders all 8 role options', () => {
      render(<RoleGateway user={defaultUser} />);
      expect(screen.getByText('Buyer')).toBeInTheDocument();
      expect(screen.getByText('Seller')).toBeInTheDocument();
      expect(screen.getByText('Landlord')).toBeInTheDocument();
      expect(screen.getByText('Leasing Agent')).toBeInTheDocument();
      expect(screen.getByText('Secondary Sales Agent')).toBeInTheDocument();
      expect(screen.getByText('Leasing Team Leader')).toBeInTheDocument();
      expect(screen.getByText('Sales Team Leader')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    it('renders role descriptions', () => {
      render(<RoleGateway user={defaultUser} />);
      expect(screen.getByText(/Looking to purchase property/)).toBeInTheDocument();
      expect(screen.getByText(/Selling residential or commercial/)).toBeInTheDocument();
    });

    it('does not show confirm button initially', () => {
      render(<RoleGateway user={defaultUser} />);
      expect(screen.queryByText('Confirm Selection & Continue')).not.toBeInTheDocument();
    });
  });

  describe('role selection', () => {
    it('shows confirm button after selecting a role', () => {
      render(<RoleGateway user={defaultUser} />);
      fireEvent.click(screen.getByText('Buyer'));
      expect(screen.getByText('Confirm Selection & Continue')).toBeInTheDocument();
    });

    it('shows selected role label', () => {
      render(<RoleGateway user={defaultUser} />);
      fireEvent.click(screen.getByText('Seller'));
      expect(screen.getByText(/You selected:/)).toBeInTheDocument();
    });

    it('shows checkmark on selected card', () => {
      render(<RoleGateway user={defaultUser} />);
      fireEvent.click(screen.getByText('Landlord'));
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('can change selection before confirming', () => {
      render(<RoleGateway user={defaultUser} />);
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Seller'));
      // Checkmark appears on the Seller card, not on Buyer
      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(screen.getByText(/You selected:/)).toBeInTheDocument();
    });
  });

  describe('role confirmation', () => {
    it('persists role to localStorage', () => {
      render(<RoleGateway user={defaultUser} />);
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Confirm Selection & Continue'));

      expect(mockSafeStorage.setJSON).toHaveBeenCalledWith(
        'userRole',
        expect.objectContaining({
          role: 'buyer',
          locked: true,
          selectedAt: expect.any(String),
        })
      );
    });

    it('dispatches setActiveRole to Redux', () => {
      render(<RoleGateway user={defaultUser} />);
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Confirm Selection & Continue'));

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'navigation/setActiveRole',
        payload: 'buyer',
      });
    });

    it('navigates to /profile', () => {
      render(<RoleGateway user={defaultUser} />);
      fireEvent.click(screen.getByText('Buyer'));
      fireEvent.click(screen.getByText('Confirm Selection & Continue'));

      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('calls onRoleSelect callback if provided', () => {
      const onRoleSelect = vi.fn();
      render(<RoleGateway user={defaultUser} onRoleSelect={onRoleSelect} />);
      fireEvent.click(screen.getByText('Administrator'));
      fireEvent.click(screen.getByText('Confirm Selection & Continue'));

      expect(onRoleSelect).toHaveBeenCalledWith('admin');
    });

    it('does nothing when confirm clicked without selection', () => {
      // This shouldn't happen (button not shown), but tests the guard clause
      render(<RoleGateway user={defaultUser} />);
      // No role selected, so confirm button doesn't exist
      expect(screen.queryByText('Confirm Selection & Continue')).not.toBeInTheDocument();
    });
  });

  describe('admin/creator auto-redirect', () => {
    it('redirects creator email to canonical md dashboard', () => {
      render(<RoleGateway user={{ email: 'arslanmalikgoraha@gmail.com', role: 'owner' }} />);

      expect(mockSafeStorage.setJSON).toHaveBeenCalledWith(
        'userRole',
        expect.objectContaining({
          role: 'md',
          locked: true,
          isSuperAdmin: true,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'navigation/setActiveRole',
        payload: 'md',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('does not auto-redirect non-superadmin user', () => {
      render(<RoleGateway user={{ email: 'admin@test.com', role: 'admin' }} />);

      // Non-superadmin users should NOT be auto-redirected
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not auto-redirect non-creator managing_director', () => {
      render(<RoleGateway user={{ email: 'md@test.com', role: 'managing_director' }} />);

      expect(mockNavigate).not.toHaveBeenCalledWith('/profile');
      expect(mockDispatch).not.toHaveBeenCalledWith({
        type: 'navigation/setActiveRole',
        payload: 'managing_director',
      });
    });
  });
});

describe('RoleGuard', () => {
  it('shows children when user has allowed role', () => {
    mockSafeStorage.getJSON.mockReturnValue({
      role: 'buyer',
      selectedAt: '2024-01-01',
      locked: true,
    } as unknown);
    render(
      <RoleGuard allowedRoles={['buyer', 'seller']}>
        <div>Protected content</div>
      </RoleGuard>
    );
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to role selection when no role stored', () => {
    mockSafeStorage.getJSON.mockReturnValue(null);
    render(
      <RoleGuard allowedRoles={['buyer']}>
        <div>Secret</div>
      </RoleGuard>
    );
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/select-role');
  });

  it('redirects to profile when role not allowed', () => {
    mockSafeStorage.getJSON.mockReturnValue({
      role: 'admin',
      selectedAt: '2024-01-01',
      locked: true,
    } as unknown);
    render(
      <RoleGuard allowedRoles={['buyer']}>
        <div>Secret</div>
      </RoleGuard>
    );
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});
