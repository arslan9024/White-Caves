/**
 * UnifiedNavbar — Unit Tests
 * Tests: rendering, props, role-based rendering, notification section,
 * user profile, accessibility, responsiveness
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('./NotificationCenter', () => ({
  default: ({ notifications, onViewAll, onMarkAsRead }: Record<string, unknown>) => (
    <div data-testid="notification-center">
      <span data-testid="notification-count">{(notifications as unknown[])?.length ?? 0}</span>
      <button data-testid="view-all-btn" onClick={onViewAll as () => void}>View All</button>
    </div>
  ),
}));

vi.mock('./UserProfileMenu', () => ({
  default: ({ user, onProfile, onSettings, onLogout }: Record<string, unknown>) => (
    <div data-testid="user-profile-menu">
      <span data-testid="user-name">{(user as Record<string, string>)?.name ?? 'Guest'}</span>
      <button data-testid="profile-btn" onClick={onProfile as () => void}>Profile</button>
      <button data-testid="settings-btn" onClick={onSettings as () => void}>Settings</button>
      <button data-testid="logout-btn" onClick={onLogout as () => void}>Logout</button>
    </div>
  ),
}));

vi.mock('./AdminControls', () => ({
  default: ({ onUserManagement }: Record<string, unknown>) => (
    <div data-testid="admin-controls">
      <button data-testid="user-management-btn" onClick={onUserManagement as () => void}>Manage</button>
    </div>
  ),
}));

vi.mock('../../styles/theme', () => ({
  theme: {
    colors: {
      primary: '#D4AF37',
      primaryDark: '#B8860B',
      background: { primary: '#F8F9FA', secondary: '#FFFFFF', tertiary: '#F5F5F5', overlay: 'rgba(0,0,0,0.5)' },
      text: { primary: '#212121', secondary: '#666666', inverse: '#FFFFFF' },
      border: '#E0E0E0',
      success: '#388E3C',
      warning: '#F57F17',
      error: '#C62828',
      white: '#FFFFFF',
    },
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
    typography: {
      sizes: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem', xl: '1.5rem' },
      weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 },
      fontFamily: { primary: 'Inter, sans-serif', mono: 'monospace' },
    },
    shadows: { sm: '0 2px 4px rgba(0,0,0,0.1)', md: '0 4px 8px rgba(0,0,0,0.15)' },
    radius: { sm: '4px', md: '8px', lg: '12px' },
    breakpoints: { mobile: '768px', tablet: '1024px', desktop: '1280px' },
    zIndex: { navbar: 1000, modal: 2000, dropdown: 500 },
    transitions: { fast: '0.15s', default: '0.3s' },
  },
}));

import { UnifiedNavbar } from './UnifiedNavbar';
import type { UnifiedNavbarProps } from './UnifiedNavbar';

// ── Test Data ────────────────────────────────────────────────────

const mockUser = {
  name: 'Ahmed Al-Rashid',
  email: 'ahmed@whitecaves.ae',
  avatar: '/avatar.png',
  initials: 'AA',
  role: 'admin' as const,
};

const mockNotifications = [
  { id: 'n1', title: 'New Lead', message: 'A new lead submitted', timestamp: '2025-06-15T10:00:00Z', read: false },
  { id: 'n2', title: 'Task Due', message: 'Contract review due today', timestamp: '2025-06-15T09:00:00Z', read: true },
];

const defaultProps: UnifiedNavbarProps = {
  title: 'Dashboard',
  user: mockUser,
  notifications: mockNotifications,
  systemStatus: 'online',
  onNotificationViewAll: vi.fn(),
  onMarkNotificationAsRead: vi.fn(),
  onProfileClick: vi.fn(),
  onSettingsClick: vi.fn(),
  onLogout: vi.fn(),
  onUserManagement: vi.fn(),
};

// ── Tests ────────────────────────────────────────────────────────

describe('UnifiedNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the navbar', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render the dashboard title', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render logo text "White Caves"', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByText('White Caves')).toBeInTheDocument();
    });

    it('should render notification center', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByTestId('notification-center')).toBeInTheDocument();
    });

    it('should render user profile menu', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByTestId('user-profile-menu')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(<UnifiedNavbar {...defaultProps} title="CRM Hub" />);
      expect(screen.getByText('CRM Hub')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<UnifiedNavbar {...defaultProps} className="custom-nav" />);
      expect(container.querySelector('.custom-nav')).toBeTruthy();
    });
  });

  // ── Props Passthrough ────────────────────────────────────────

  describe('Props Passthrough', () => {
    it('should pass user name to UserProfileMenu', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByTestId('user-name')).toHaveTextContent('Ahmed Al-Rashid');
    });

    it('should pass notifications to NotificationCenter', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
    });

    it('should pass empty notifications when none provided', () => {
      render(<UnifiedNavbar {...defaultProps} notifications={[]} />);
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });
  });

  // ── Role-Based Rendering ─────────────────────────────────────

  describe('Role-Based Rendering', () => {
    it('should show AdminControls for admin users', () => {
      render(<UnifiedNavbar {...defaultProps} user={{ ...mockUser, role: 'admin' }} />);
      expect(screen.getByTestId('admin-controls')).toBeInTheDocument();
    });

    it('should show AdminControls for super_user', () => {
      render(<UnifiedNavbar {...defaultProps} user={{ ...mockUser, role: 'super_user' }} />);
      expect(screen.getByTestId('admin-controls')).toBeInTheDocument();
    });

    it('should hide AdminControls for agent users', () => {
      render(<UnifiedNavbar {...defaultProps} user={{ ...mockUser, role: 'agent' }} />);
      expect(screen.queryByTestId('admin-controls')).not.toBeInTheDocument();
    });

    it('should hide AdminControls for client users', () => {
      render(<UnifiedNavbar {...defaultProps} user={{ ...mockUser, role: 'client' }} />);
      expect(screen.queryByTestId('admin-controls')).not.toBeInTheDocument();
    });

    it('should hide AdminControls when no user', () => {
      render(<UnifiedNavbar {...defaultProps} user={undefined} />);
      expect(screen.queryByTestId('admin-controls')).not.toBeInTheDocument();
    });
  });

  // ── Callback Handlers ────────────────────────────────────────

  describe('Callback Handlers', () => {
    it('should call onNotificationViewAll when View All is clicked', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      fireEvent.click(screen.getByTestId('view-all-btn'));
      expect(defaultProps.onNotificationViewAll).toHaveBeenCalledTimes(1);
    });

    it('should call onProfileClick when Profile is clicked', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      fireEvent.click(screen.getByTestId('profile-btn'));
      expect(defaultProps.onProfileClick).toHaveBeenCalledTimes(1);
    });

    it('should call onSettingsClick when Settings is clicked', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      fireEvent.click(screen.getByTestId('settings-btn'));
      expect(defaultProps.onSettingsClick).toHaveBeenCalledTimes(1);
    });

    it('should call onLogout when Logout is clicked', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      fireEvent.click(screen.getByTestId('logout-btn'));
      expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    });

    it('should call onUserManagement when Manage is clicked (admin)', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      fireEvent.click(screen.getByTestId('user-management-btn'));
      expect(defaultProps.onUserManagement).toHaveBeenCalledTimes(1);
    });
  });

  // ── Accessibility ────────────────────────────────────────────

  describe('Accessibility', () => {
    it('should have role="navigation"', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have aria-label="Main navigation"', () => {
      render(<UnifiedNavbar {...defaultProps} />);
      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    });

    it('should have aria-hidden on decorative elements', () => {
      const { container } = render(<UnifiedNavbar {...defaultProps} />);
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements.length).toBeGreaterThan(0);
    });
  });

  // ── Defaults ─────────────────────────────────────────────────

  describe('Defaults', () => {
    it('should render with no title (default empty)', () => {
      render(<UnifiedNavbar />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render with no user', () => {
      render(<UnifiedNavbar />);
      expect(screen.getByTestId('user-name')).toHaveTextContent('Guest');
    });

    it('should render with no notifications', () => {
      render(<UnifiedNavbar />);
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });
  });

  // ── System Status ────────────────────────────────────────────

  describe('System Status', () => {
    it('should accept online status', () => {
      const { container } = render(<UnifiedNavbar {...defaultProps} systemStatus="online" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept warning status', () => {
      const { container } = render(<UnifiedNavbar {...defaultProps} systemStatus="warning" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept offline status', () => {
      const { container } = render(<UnifiedNavbar {...defaultProps} systemStatus="offline" />);
      expect(container.firstChild).toBeTruthy();
    });
  });
});
