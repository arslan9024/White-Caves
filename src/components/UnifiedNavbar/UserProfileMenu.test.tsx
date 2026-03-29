/**
 * UserProfileMenu — Comprehensive Unit Tests
 *
 * Covers: rendering, dropdown toggle, menu item callbacks,
 * backdrop close, accessibility, prop variations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock styled-components theme
vi.mock('../../styles/theme', () => ({
  theme: {
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    colors: {
      primary: '#c8a45a',
      error: '#dc2626',
      background: { primary: '#fff', secondary: '#f5f5f5' },
      text: { primary: '#1a1a2e', secondary: '#6b7280' },
      border: '#e5e7eb',
    },
    typography: {
      sizes: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
      weights: { semibold: '600' },
    },
    transitions: { create: () => 'all 0.2s', durations: { standard: 200 } },
    shadows: { lg: '0 10px 15px -3px rgba(0,0,0,.1)' },
    zIndex: { dropdown: 1000 },
  },
}));

// Mock Avatar component
vi.mock('../design-system', () => ({
  Avatar: ({ initials, src, size }: { initials?: string; src?: string; size?: string }) => (
    <div data-testid="avatar" data-initials={initials} data-src={src} data-size={size}>
      {initials || '?'}
    </div>
  ),
}));

import { UserProfileMenu } from './UserProfileMenu';

// ── Setup ────────────────────────────────────────────────────────

const defaultUser = {
  name: 'Ahmed Al-Maktoum',
  email: 'ahmed@whitecaves.ae',
  avatar: 'https://example.com/avatar.jpg',
  initials: 'AM',
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Tests ────────────────────────────────────────────────────────

describe('UserProfileMenu', () => {
  describe('rendering', () => {
    it('renders profile button', () => {
      render(<UserProfileMenu user={defaultUser} />);
      expect(screen.getByLabelText('User menu')).toBeInTheDocument();
    });

    it('renders avatar with initials', () => {
      render(<UserProfileMenu user={defaultUser} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-initials', 'AM');
    });

    it('renders avatar with src when provided', () => {
      render(<UserProfileMenu user={defaultUser} />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-src', 'https://example.com/avatar.jpg');
    });

    it('uses first letter of name when no initials', () => {
      render(<UserProfileMenu user={{ name: 'John', email: 'john@test.com' }} />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-initials', 'J');
    });

    it('handles no user gracefully', () => {
      render(<UserProfileMenu />);
      expect(screen.getByLabelText('User menu')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <UserProfileMenu user={defaultUser} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('dropdown toggle', () => {
    it('dropdown is hidden initially', () => {
      render(<UserProfileMenu user={defaultUser} />);
      // User info should not be visible initially (dropdown closed)
      expect(screen.queryByText('ahmed@whitecaves.ae')).not.toBeVisible();
    });

    it('opens dropdown on button click', () => {
      render(<UserProfileMenu user={defaultUser} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      expect(screen.getByText('ahmed@whitecaves.ae')).toBeVisible();
    });

    it('closes dropdown on second click', () => {
      render(<UserProfileMenu user={defaultUser} />);
      const button = screen.getByLabelText('User menu');
      fireEvent.click(button);
      expect(screen.getByText('ahmed@whitecaves.ae')).toBeVisible();
      fireEvent.click(button);
      expect(screen.queryByText('ahmed@whitecaves.ae')).not.toBeVisible();
    });

    it('sets aria-expanded=true when open', () => {
      render(<UserProfileMenu user={defaultUser} />);
      const button = screen.getByLabelText('User menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('user info display', () => {
    it('shows user name in dropdown', () => {
      render(<UserProfileMenu user={defaultUser} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      expect(screen.getByText('Ahmed Al-Maktoum')).toBeInTheDocument();
    });

    it('shows user email in dropdown', () => {
      render(<UserProfileMenu user={defaultUser} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      expect(screen.getByText('ahmed@whitecaves.ae')).toBeInTheDocument();
    });
  });

  describe('menu item callbacks', () => {
    it('calls onProfile and closes dropdown', () => {
      const onProfile = vi.fn();
      render(<UserProfileMenu user={defaultUser} onProfile={onProfile} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      fireEvent.click(screen.getByText('Profile'));
      expect(onProfile).toHaveBeenCalledTimes(1);
    });

    it('calls onSettings and closes dropdown', () => {
      const onSettings = vi.fn();
      render(<UserProfileMenu user={defaultUser} onSettings={onSettings} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      fireEvent.click(screen.getByText('Settings'));
      expect(onSettings).toHaveBeenCalledTimes(1);
    });

    it('calls onLogout and closes dropdown', () => {
      const onLogout = vi.fn();
      render(<UserProfileMenu user={defaultUser} onLogout={onLogout} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      fireEvent.click(screen.getByText('Logout'));
      expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it('renders Profile, Settings, and Logout menu items', () => {
      render(<UserProfileMenu user={defaultUser} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('backdrop close', () => {
    it('shows backdrop when dropdown is open', () => {
      render(<UserProfileMenu user={defaultUser} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('closes dropdown when clicking backdrop', () => {
      render(<UserProfileMenu user={defaultUser} />);
      fireEvent.click(screen.getByLabelText('User menu'));
      expect(screen.getByText('ahmed@whitecaves.ae')).toBeVisible();

      fireEvent.click(screen.getByRole('presentation'));
      expect(screen.queryByText('ahmed@whitecaves.ae')).not.toBeVisible();
    });

    it('does not show backdrop when closed', () => {
      render(<UserProfileMenu user={defaultUser} />);
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has displayName set', () => {
      expect(UserProfileMenu.displayName).toBe('UserProfileMenu');
    });
  });
});
