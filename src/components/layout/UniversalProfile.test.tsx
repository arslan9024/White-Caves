/**
 * UniversalProfile Component Tests
 * Tests: signed-out state, signed-in rendering, avatar/initials, dropdown menu,
 *        theme toggle, role info, logout, click-outside
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UniversalProfile from './UniversalProfile';

// Mock logger
vi.mock('../../utils/logger', () => ({
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
vi.mock('../../config/firebase', () => ({
  auth: { currentUser: null },
}));

// Mock safeStorage
vi.mock('../../utils/safeStorage', () => ({
  safeStorage: { get: vi.fn(), set: vi.fn(), remove: vi.fn(), getJSON: vi.fn(), setJSON: vi.fn() },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock styled components
vi.mock('./UniversalProfile/styles', () => ({
  UniversalProfileContainer: React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} data-testid="profile-container">{children}</div>),
  ProfileSignInBtn: ({ children, to }: any) => <a href={to} data-testid="sign-in-btn">{children}</a>,
  ProfileTrigger: ({ children, onClick, ...props }: any) => <button data-testid="profile-trigger" onClick={onClick} aria-label={props['aria-label']}>{children}</button>,
  ProfileAvatar: ({ children }: any) => <div data-testid="profile-avatar">{children}</div>,
  AvatarImg: (props: any) => <img data-testid="avatar-img" {...props} />,
  AvatarInitials: ({ children }: any) => <span data-testid="avatar-initials">{children}</span>,
  ProfileArrow: ({ children }: any) => <span data-testid="profile-arrow">{children}</span>,
  ProfileDropdown: ({ children }: any) => <div data-testid="profile-dropdown">{children}</div>,
  ProfileDropdownHeader: ({ children }: any) => <div>{children}</div>,
  ProfileInfo: ({ children }: any) => <div>{children}</div>,
  ProfileName: ({ children }: any) => <span data-testid="profile-name">{children}</span>,
  ProfileEmail: ({ children }: any) => <span data-testid="profile-email">{children}</span>,
  ProfileRole: ({ children, ...props }: any) => <span data-testid="profile-role" {...props}>{children}</span>,
  ProfileDropdownDivider: () => <hr />,
  ProfileDropdownItem: ({ children, onClick, ...props }: any) => <button data-testid={props.$logout ? 'logout-btn' : 'dropdown-item'} onClick={onClick}>{children}</button>,
  ProfileDropdownItemLink: ({ children, to, onClick }: any) => <a href={to} data-testid={`link-${to}`} onClick={onClick}>{children}</a>,
  DropdownIcon: ({ children }: any) => <span>{children}</span>,
  ProfileArrowDark: ({ children }: any) => <span>{children}</span>,
}));

const createStore = (userOverrides: any = null, navOverrides: any = {}) =>
  configureStore({
    reducer: {
      user: (state = { currentUser: userOverrides }) => state,
      navigation: (state = {
        isOnline: true,
        currentTime: new Date().toISOString(),
        roleMenuOpen: false,
        activeRole: null,
        profileMenuOpen: false,
        theme: 'light',
        ...navOverrides,
      }) => state,
    },
  });

const renderProfile = (user: any = null, navOverrides: any = {}, props: any = {}) => {
  const store = createStore(user, navOverrides);
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <UniversalProfile {...props} />
        </MemoryRouter>
      </Provider>,
    ),
    store,
  };
};

const testUser = {
  uid: 'u1',
  displayName: 'Ahmed Ali',
  email: 'ahmed@whitecaves.com',
  photoURL: null,
};

describe('UniversalProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Signed-Out State ──────────────────────────────────
  describe('signed-out state', () => {
    it('shows Sign In button when no user', () => {
      renderProfile(null);
      expect(screen.getByTestId('sign-in-btn')).toHaveTextContent('Sign In');
    });

    it('Sign In links to /signin', () => {
      renderProfile(null);
      expect(screen.getByTestId('sign-in-btn')).toHaveAttribute('href', '/signin');
    });

    it('returns null when showSignIn=false and no user', () => {
      const { container } = renderProfile(null, {}, { showSignIn: false });
      expect(container.querySelector('[data-testid="profile-container"]')).not.toBeInTheDocument();
    });
  });

  // ─── Signed-In Rendering ──────────────────────────────
  describe('signed-in rendering', () => {
    it('renders profile trigger when user is logged in', () => {
      renderProfile(testUser);
      expect(screen.getByTestId('profile-trigger')).toBeInTheDocument();
    });

    it('renders avatar initials for user without photo', () => {
      renderProfile(testUser);
      expect(screen.getByTestId('avatar-initials')).toHaveTextContent('AA');
    });

    it('renders avatar image when user has photoURL', () => {
      renderProfile({ ...testUser, photoURL: '/photo.jpg' });
      expect(screen.getByTestId('avatar-img')).toHaveAttribute('src', '/photo.jpg');
    });

    it('shows arrow indicator', () => {
      renderProfile(testUser);
      expect(screen.getByTestId('profile-arrow')).toBeInTheDocument();
    });
  });

  // ─── Dropdown ──────────────────────────────────────────
  describe('dropdown', () => {
    it('dropdown not visible by default', () => {
      renderProfile(testUser);
      expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });

    it('opens dropdown on trigger click', () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    });

    it('shows user name in dropdown', () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByTestId('profile-name')).toHaveTextContent('Ahmed Ali');
    });

    it('shows user email in dropdown', () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByTestId('profile-email')).toHaveTextContent('ahmed@whitecaves.com');
    });

    it('shows My Profile link', () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    it('shows Select Role link when no active role', () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Select Role')).toBeInTheDocument();
    });

    it('shows Switch Role when an active role exists', () => {
      renderProfile(testUser, { activeRole: 'buyer' });
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Switch Role')).toBeInTheDocument();
    });

    it('shows Dashboard link when active role is set', () => {
      renderProfile(testUser, { activeRole: 'buyer' });
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('does not show Dashboard link when no role', () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });
  });

  // ─── Theme Toggle ─────────────────────────────────────
  describe('theme toggle', () => {
    it('shows Dark Mode option in light theme', () => {
      renderProfile(testUser, { theme: 'light' });
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('shows Light Mode option in dark theme', () => {
      renderProfile(testUser, { theme: 'dark' });
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Light Mode')).toBeInTheDocument();
    });
  });

  // ─── Role Info ─────────────────────────────────────────
  describe('role info', () => {
    it('displays buyer role with correct label', () => {
      renderProfile(testUser, { activeRole: 'buyer' });
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByTestId('profile-role')).toHaveTextContent('Buyer');
    });

    it('displays owner role with correct label', () => {
      renderProfile(testUser, { activeRole: 'owner' });
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByTestId('profile-role')).toHaveTextContent('Owner');
    });
  });

  // ─── Logout ────────────────────────────────────────────
  describe('logout', () => {
    it('renders Sign Out button', () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('calls signOut on logout click', async () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      fireEvent.click(screen.getByTestId('logout-btn'));
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('navigates to / after logout', async () => {
      renderProfile(testUser);
      fireEvent.click(screen.getByTestId('profile-trigger'));
      fireEvent.click(screen.getByTestId('logout-btn'));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  // ─── Initials Logic ────────────────────────────────────
  describe('initials logic', () => {
    it('uses first letters of first and last name', () => {
      renderProfile({ ...testUser, displayName: 'Sara Khan' });
      expect(screen.getByTestId('avatar-initials')).toHaveTextContent('SK');
    });

    it('uses email first char when no name', () => {
      renderProfile({ ...testUser, displayName: null, name: undefined });
      expect(screen.getByTestId('avatar-initials')).toHaveTextContent('A'); // ahmed@...
    });
  });
});
