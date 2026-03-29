/**
 * @file ProfilePanel.test.tsx
 * @description Comprehensive tests for shared ProfilePanel component
 * Tests: rendering, user info, super user admin controls, navigation, sign out, keyboard
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const { mockSignOut } = vi.hoisted(() => ({
  mockSignOut: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../../../../config/firebase', () => ({
  auth: { signOut: mockSignOut },
}));

vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('../../../../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    getJSON: vi.fn(),
    setJSON: vi.fn(),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
  User: (props: any) => <svg data-testid="icon-user" {...props} />,
  Mail: (props: any) => <svg data-testid="icon-mail" {...props} />,
  Phone: (props: any) => <svg data-testid="icon-phone" {...props} />,
  Shield: (props: any) => <svg data-testid="icon-shield" {...props} />,
  Settings: (props: any) => <svg data-testid="icon-settings" {...props} />,
  LogOut: (props: any) => <svg data-testid="icon-logout" {...props} />,
  Edit2: (props: any) => <svg data-testid="icon-edit" {...props} />,
  BarChart3: (props: any) => <svg data-testid="icon-chart" {...props} />,
  Users: (props: any) => <svg data-testid="icon-users" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="icon-alert" {...props} />,
  Zap: (props: any) => <svg data-testid="icon-zap" {...props} />,
}));

// Mock Redux useSelector
const mockAuthRole = vi.fn().mockReturnValue('user');
vi.mock('react-redux', () => ({
  useSelector: (selector: Function) => {
    // Simulate state with auth role
    const state = { auth: { user: { role: mockAuthRole() } } };
    return selector(state);
  },
}));

// Mock CSS import
vi.mock('../ProfilePanel.css', () => ({}));

import ProfilePanel from '../ProfilePanel';

describe('ProfilePanel', () => {
  const mockUser = {
    name: 'John Smith',
    email: 'john@whitecaves.com',
    phone: '+971 55 123 4567',
    photo: 'https://example.com/photo.jpg',
    role: 'Sales Agent',
  };

  const defaultProps = {
    user: mockUser,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthRole.mockReturnValue('user');
  });

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders profile panel', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    it('renders as dialog', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal true', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-label for profile', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'User profile');
    });
  });

  // ── User Information ──────────────────────────────────
  describe('User Information', () => {
    it('displays user name', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    it('displays user email', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('john@whitecaves.com')).toBeInTheDocument();
    });

    it('displays user phone', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('+971 55 123 4567')).toBeInTheDocument();
    });

    it('displays user role', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('Sales Agent')).toBeInTheDocument();
    });

    it('displays user photo when provided', () => {
      render(<ProfilePanel {...defaultProps} />);
      const img = screen.getByAltText('John Smith');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    });

    it('displays placeholder when no photo', () => {
      render(<ProfilePanel {...defaultProps} user={{ ...mockUser, photo: undefined }} />);
      expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    });

    it('displays "User" when no name', () => {
      render(<ProfilePanel {...defaultProps} user={{ email: 'test@test.com' }} />);
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('uses displayName fallback', () => {
      render(<ProfilePanel {...defaultProps} user={{ displayName: 'Jane Doe' }} />);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  // ── Stats Section ──────────────────────────────────────
  describe('Stats Section', () => {
    it('displays activity count', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Activities')).toBeInTheDocument();
    });

    it('displays properties count', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
    });

    it('displays messages count', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });
  });

  // ── Action Buttons ─────────────────────────────────────
  describe('Action Buttons', () => {
    it('has Edit Profile button', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('has Settings button', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('has Sign Out button', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('navigates to /profile on Edit Profile click', () => {
      render(<ProfilePanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Edit Profile'));
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('navigates to /settings on Settings click', () => {
      render(<ProfilePanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Settings'));
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  // ── Sign Out ───────────────────────────────────────────
  describe('Sign Out', () => {
    it('calls auth.signOut on Sign Out click', async () => {
      render(<ProfilePanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Sign Out'));
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('navigates to / after sign out', async () => {
      render(<ProfilePanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Sign Out'));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('calls onClose after sign out', async () => {
      render(<ProfilePanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Sign Out'));
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });
  });

  // ── Super User / Admin ─────────────────────────────────
  describe('Super User', () => {
    it('shows admin controls when isSuperUser prop is true', () => {
      render(<ProfilePanel {...defaultProps} isSuperUser={true} />);
      expect(screen.getByText('Admin Controls')).toBeInTheDocument();
    });

    it('shows admin controls when Redux role is lion', () => {
      mockAuthRole.mockReturnValue('lion');
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByText('Admin Controls')).toBeInTheDocument();
    });

    it('shows Super User badge for super users', () => {
      render(<ProfilePanel {...defaultProps} isSuperUser={true} />);
      expect(screen.getByText(/Super User/)).toBeInTheDocument();
    });

    it('shows Admin Dashboard button for super users', () => {
      render(<ProfilePanel {...defaultProps} isSuperUser={true} />);
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('navigates to admin dashboard', () => {
      render(<ProfilePanel {...defaultProps} isSuperUser={true} />);
      fireEvent.click(screen.getByText('Admin Dashboard'));
      expect(mockNavigate).toHaveBeenCalledWith('/lion/admin-dashboard');
    });

    it('hides admin controls for regular users', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.queryByText('Admin Controls')).not.toBeInTheDocument();
    });

    it('shows quick action buttons for super users', () => {
      render(<ProfilePanel {...defaultProps} isSuperUser={true} />);
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('navigates to system health', () => {
      render(<ProfilePanel {...defaultProps} isSuperUser={true} />);
      fireEvent.click(screen.getByText('Health'));
      expect(mockNavigate).toHaveBeenCalledWith('/lion/system-health');
    });

    it('navigates to user management', () => {
      render(<ProfilePanel {...defaultProps} isSuperUser={true} />);
      fireEvent.click(screen.getByText('Users'));
      expect(mockNavigate).toHaveBeenCalledWith('/lion/users');
    });
  });

  // ── Close Behavior ─────────────────────────────────────
  describe('Close Behavior', () => {
    it('calls onClose when overlay is clicked', () => {
      render(<ProfilePanel {...defaultProps} />);
      const overlay = screen.getByRole('presentation');
      fireEvent.click(overlay);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close button is clicked', () => {
      render(<ProfilePanel {...defaultProps} />);
      const closeBtn = screen.getByLabelText('Close profile panel');
      fireEvent.click(closeBtn);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose on Escape key', () => {
      render(<ProfilePanel {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape' });
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ── Null User ──────────────────────────────────────────
  describe('Null User', () => {
    it('handles null user gracefully', () => {
      render(<ProfilePanel user={null} onClose={vi.fn()} />);
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  // ── Edit Avatar ────────────────────────────────────────
  describe('Edit Avatar', () => {
    it('has edit avatar button with aria-label', () => {
      render(<ProfilePanel {...defaultProps} />);
      expect(screen.getByLabelText('Edit profile picture')).toBeInTheDocument();
    });
  });
});
