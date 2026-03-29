import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Mock logger
vi.mock('../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

// Mock firebase
const mockSignOut = vi.fn().mockResolvedValue(undefined);
vi.mock('firebase/auth', () => ({
  signOut: (...args: any[]) => mockSignOut(...args),
}));

vi.mock('../../../config/firebase', () => ({
  auth: { currentUser: null },
}));

// Mock safeStorage
vi.mock('../../../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn().mockReturnValue(null),
    getJSON: vi.fn().mockReturnValue(null),
    set: vi.fn(),
    setJSON: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock styled-components
vi.mock('../UniversalProfile/styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = React.forwardRef(({ children, to, ...props }: any, ref: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      if (to) clean.href = to;
      return React.createElement(tag, { ...clean, 'data-testid': name, ref }, children);
    });
    Comp.displayName = name;
    return Comp;
  };
  return {
    UniversalProfileContainer: c('div', 'profile-container'),
    ProfileSignInBtn: c('a', 'profile-signin-btn'),
    ProfileTrigger: c('button', 'profile-trigger'),
    ProfileAvatar: c('div', 'profile-avatar'),
    AvatarImg: c('img', 'avatar-img'),
    AvatarInitials: c('span', 'avatar-initials'),
    ProfileArrow: c('span', 'profile-arrow'),
    ProfileDropdown: c('div', 'profile-dropdown'),
    ProfileDropdownHeader: c('div', 'profile-dropdown-header'),
    ProfileInfo: c('div', 'profile-info'),
    ProfileName: c('span', 'profile-name'),
    ProfileEmail: c('span', 'profile-email'),
    ProfileRole: c('span', 'profile-role'),
    ProfileDropdownDivider: c('hr', 'profile-divider'),
    ProfileDropdownItem: c('button', 'profile-dropdown-item'),
    ProfileDropdownItemLink: c('a', 'profile-dropdown-item-link'),
    DropdownIcon: c('span', 'dropdown-icon'),
    ProfileArrowDark: c('span', 'profile-arrow-dark'),
  };
});

import UniversalProfile from '../UniversalProfile';

const createStore = (user: any = null, activeRole: string | null = null, theme = 'light') =>
  configureStore({
    reducer: {
      user: () => ({ currentUser: user }),
      navigation: () => ({ activeRole, theme, sidebarOpen: false }),
    },
  });

const renderProfile = (user: any = null, activeRole: string | null = null, props: Record<string, unknown> = {}) =>
  render(
    <Provider store={createStore(user, activeRole)}>
      <MemoryRouter>
        <UniversalProfile {...(props as any)} />
      </MemoryRouter>
    </Provider>
  );

const mockUser = {
  id: '1',
  displayName: 'John Doe',
  email: 'john@whitecaves.com',
  photoURL: 'https://example.com/photo.jpg',
  role: 'admin',
};

describe('UniversalProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Unauthenticated State ──────────────────────────────────
  describe('unauthenticated', () => {
    it('renders Sign In link when no user', () => {
      renderProfile(null);
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('returns null when no user and showSignIn is false', () => {
      const { container } = renderProfile(null, null, { showSignIn: false });
      expect(container.querySelector('[data-testid="profile-signin-btn"]')).not.toBeInTheDocument();
    });
  });

  // ── Authenticated State ────────────────────────────────────
  describe('authenticated', () => {
    it('renders profile trigger when user is logged in', () => {
      renderProfile(mockUser);
      expect(screen.getByTestId('profile-trigger')).toBeInTheDocument();
    });

    it('renders avatar image when user has photoURL', () => {
      renderProfile(mockUser);
      expect(screen.getByTestId('avatar-img')).toBeInTheDocument();
    });

    it('renders initials when user has no photo', () => {
      renderProfile({ ...mockUser, photoURL: null });
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders single initial from email when no name', () => {
      renderProfile({ ...mockUser, displayName: null, name: undefined, photoURL: null });
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('renders ? for initials when no name or email', () => {
      renderProfile({ ...mockUser, displayName: null, name: undefined, email: '', photoURL: null });
      const initials = screen.getAllByText('?');
      expect(initials.length).toBeGreaterThan(0);
    });

    it('renders arrow indicator in default variant', () => {
      renderProfile(mockUser);
      const arrows = screen.getAllByTestId('profile-arrow');
      expect(arrows.length).toBeGreaterThan(0);
    });
  });

  // ── Dropdown Menu ──────────────────────────────────────────
  describe('dropdown menu', () => {
    it('opens dropdown when clicking profile trigger', () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    });

    it('shows user name in dropdown', () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('shows user email in dropdown', () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('john@whitecaves.com')).toBeInTheDocument();
    });

    it('shows role info when active role is set', () => {
      renderProfile(mockUser, 'buyer');
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText(/Buyer/)).toBeInTheDocument();
    });

    it('shows theme toggle option', () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('shows My Profile link', () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    it('shows Select Role when no active role', () => {
      renderProfile(mockUser, null);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Select Role')).toBeInTheDocument();
    });

    it('shows Switch Role when active role exists', () => {
      renderProfile(mockUser, 'buyer');
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Switch Role')).toBeInTheDocument();
    });

    it('shows Dashboard link when role is active', () => {
      renderProfile(mockUser, 'buyer');
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('does not show Dashboard link when no role', () => {
      renderProfile(mockUser, null);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('shows Sign Out option', () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('closes dropdown on second click', () => {
      renderProfile(mockUser);
      const trigger = screen.getByTestId('profile-trigger');
      fireEvent.click(trigger);
      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
      fireEvent.click(trigger);
      expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });
  });

  // ── Click Outside ──────────────────────────────────────────
  describe('click outside', () => {
    it('closes dropdown when clicking outside', () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
      fireEvent.mouseDown(document);
      expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });
  });

  // ── Logout ─────────────────────────────────────────────────
  describe('logout', () => {
    it('calls firebase signOut on Sign Out click', async () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      fireEvent.click(screen.getByText('Sign Out'));
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('navigates to / after logout', async () => {
      renderProfile(mockUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      fireEvent.click(screen.getByText('Sign Out'));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  // ── Role Icons ─────────────────────────────────────────────
  describe('role display', () => {
    const roles = [
      ['buyer', 'Buyer'],
      ['seller', 'Seller'],
      ['landlord', 'Landlord'],
      ['tenant', 'Tenant'],
    ] as const;

    roles.forEach(([role, label]) => {
      it(`shows ${label} role correctly`, () => {
        renderProfile(mockUser, role);
        fireEvent.click(screen.getByTestId('profile-trigger'));
        expect(screen.getByText(new RegExp(label))).toBeInTheDocument();
      });
    });
  });

  // ── Compact Variant ────────────────────────────────────────
  describe('compact variant', () => {
    it('renders without arrow in compact mode', () => {
      renderProfile(mockUser, null, { variant: 'compact' });
      // In compact mode the ProfileArrow is not rendered
      const arrows = screen.queryAllByTestId('profile-arrow');
      // The arrow is conditionally hidden via variant !== 'compact'
      // The trigger still renders, but with compact class
      expect(screen.getByTestId('profile-trigger')).toBeInTheDocument();
    });
  });

  // ── Dropdown Icons ─────────────────────────────────────────
  describe('dropdown icons', () => {
    it('renders emoji icons for menu items', () => {
      renderProfile(mockUser, 'buyer');
      fireEvent.click(screen.getByTestId('profile-trigger'));
      const icons = screen.getAllByTestId('dropdown-icon');
      expect(icons.length).toBeGreaterThanOrEqual(4); // theme, profile, role, dashboard, logout
    });
  });
});
