/**
 * MainNavBar — Unit Tests
 * Tests: rendering, logo, search, theme toggle, notifications,
 * profile menu, keyboard shortcuts, sidebar toggles, super-user features
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock the styles module to avoid styled-components complexity in tests
vi.mock('./styles', () => {
  const createDiv = (name: string) => {
    const C = React.forwardRef<HTMLDivElement, Record<string, unknown>>(
      ({ children, ...props }: Record<string, unknown>, ref) => {
        // Filter out styled-component transient props ($-prefixed)
        const cleaned: Record<string, unknown> = {};
        Object.keys(props).forEach((k) => {
          if (!k.startsWith('$')) cleaned[k] = props[k];
        });
        return React.createElement('div', { ...cleaned, 'data-testid': name, ref }, children as React.ReactNode);
      },
    );
    C.displayName = name;
    return C;
  };
  const createButton = (name: string) => {
    const C = React.forwardRef<HTMLButtonElement, Record<string, unknown>>(
      ({ children, ...props }: Record<string, unknown>, ref) => {
        const cleaned: Record<string, unknown> = {};
        Object.keys(props).forEach((k) => {
          if (!k.startsWith('$')) cleaned[k] = props[k];
        });
        return React.createElement('button', { ...cleaned, 'data-testid': name, ref }, children as React.ReactNode);
      },
    );
    C.displayName = name;
    return C;
  };
  const createSpan = (name: string) => {
    const C = ({ children, ...props }: Record<string, unknown>) => {
      const cleaned: Record<string, unknown> = {};
      Object.keys(props).forEach((k) => {
        if (!k.startsWith('$')) cleaned[k] = props[k];
      });
      return React.createElement('span', { ...cleaned, 'data-testid': name }, children as React.ReactNode);
    };
    C.displayName = name;
    return C;
  };
  const createH4 = (name: string) => {
    const C = ({ children, ...props }: Record<string, unknown>) => {
      const cleaned: Record<string, unknown> = {};
      Object.keys(props).forEach((k) => {
        if (!k.startsWith('$')) cleaned[k] = props[k];
      });
      return React.createElement('h4', { ...cleaned, 'data-testid': name }, children as React.ReactNode);
    };
    C.displayName = name;
    return C;
  };
  const createImg = (name: string) => {
    const C = (props: Record<string, unknown>) => {
      const cleaned: Record<string, unknown> = {};
      Object.keys(props).forEach((k) => {
        if (!k.startsWith('$')) cleaned[k] = props[k];
      });
      return React.createElement('img', { ...cleaned, 'data-testid': name });
    };
    C.displayName = name;
    return C;
  };
  const createInput = (name: string) => {
    const C = React.forwardRef<HTMLInputElement, Record<string, unknown>>(
      (props: Record<string, unknown>, ref) => {
        const cleaned: Record<string, unknown> = {};
        Object.keys(props).forEach((k) => {
          if (!k.startsWith('$')) cleaned[k] = props[k];
        });
        return React.createElement('input', { ...cleaned, 'data-testid': name, ref });
      },
    );
    C.displayName = name;
    return C;
  };
  const createP = (name: string) => {
    const C = ({ children, ...props }: Record<string, unknown>) => {
      const cleaned: Record<string, unknown> = {};
      Object.keys(props).forEach((k) => {
        if (!k.startsWith('$')) cleaned[k] = props[k];
      });
      return React.createElement('p', { ...cleaned, 'data-testid': name }, children as React.ReactNode);
    };
    C.displayName = name;
    return C;
  };

  return {
    NavBarContainer: createDiv('NavBarContainer'),
    NavLeftSection: createDiv('NavLeftSection'),
    LogoButton: createButton('LogoButton'),
    LogoIcon: createDiv('LogoIcon'),
    LogoLetter: createSpan('LogoLetter'),
    LogoText: createDiv('LogoText'),
    LogoTitle: createSpan('LogoTitle'),
    LogoSubtitle: createSpan('LogoSubtitle'),
    NavCenterSection: createDiv('NavCenterSection'),
    QuickStatsBar: createDiv('QuickStatsBar'),
    StatItem: createDiv('StatItem'),
    StatLabel: createSpan('StatLabel'),
    StatValue: createSpan('StatValue'),
    SearchContainer: createDiv('SearchContainer'),
    SearchIcon: createDiv('SearchIcon'),
    SearchInput: createInput('SearchInput'),
    SearchShortcut: createDiv('SearchShortcut'),
    ShortcutKey: createSpan('ShortcutKey'),
    NavRightSection: createDiv('NavRightSection'),
    NavIconButton: createButton('NavIconButton'),
    NotificationBadge: createSpan('NotificationBadge'),
    DropdownContainer: createDiv('DropdownContainer'),
    DropdownMenu: createDiv('DropdownMenu'),
    DropdownHeader: createDiv('DropdownHeader'),
    MarkAllReadButton: createButton('MarkAllReadButton'),
    DropdownContent: createDiv('DropdownContent'),
    EmptyState: createDiv('EmptyState'),
    NotificationItem: createDiv('NotificationItem'),
    NotifIcon: createDiv('NotifIcon'),
    NotifContent: createDiv('NotifContent'),
    NotifTitle: createSpan('NotifTitle'),
    NotifTime: createSpan('NotifTime'),
    ProfileTrigger: createButton('ProfileTrigger'),
    UserAvatar: createDiv('UserAvatar'),
    SuperUserBadge: createSpan('SuperUserBadge'),
    UserInfo: createDiv('UserInfo'),
    UserName: createSpan('UserName'),
    UserRole: createSpan('UserRole'),
    ChevronIcon: createSpan('ChevronIcon'),
    DropdownDivider: createDiv('DropdownDivider'),
    DropdownItem: createButton('DropdownItem'),
    ProfileHeader: createDiv('ProfileHeader'),
    ProfileAvatar: createDiv('ProfileAvatar'),
    ProfileInfo: createDiv('ProfileInfo'),
    ProfileName: createSpan('ProfileName'),
    ProfileEmail: createSpan('ProfileEmail'),
    DropdownFooter: createDiv('DropdownFooter'),
    SidebarToggleButton: createButton('SidebarToggleButton'),
  };
});

import MainNavBar from './MainNavBar';
import authReducer from '../../../store/authSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = (authOverrides: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: { id: 'u1', displayName: 'Ahmed', email: 'ahmed@wc.ae', role: 'owner' },
        token: 'tok',
        refreshToken: null,
        session: { isLoggedIn: true, lastActive: null, sessions: [], expiresAt: null, activeSessionId: null },
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

const renderNavBar = (props: Record<string, unknown> = {}) => {
  const store = createMockStore(props.authOverrides as Record<string, unknown>);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MainNavBar
          theme="light"
          onThemeToggle={vi.fn()}
          user={{ displayName: 'Ahmed Al-Rashid', email: 'ahmed@whitecaves.ae' }}
          notifications={[]}
          onLogout={vi.fn()}
          onToggleLeftSidebar={vi.fn()}
          {...props}
        />
      </MemoryRouter>
    </Provider>,
  );
};

// ── Tests ────────────────────────────────────────────────────────

describe('MainNavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the navbar container', () => {
      renderNavBar();
      expect(screen.getByTestId('NavBarContainer')).toBeInTheDocument();
    });

    it('should render logo with "W" letter and title', () => {
      renderNavBar();
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('White Caves')).toBeInTheDocument();
      expect(screen.getByText('AI Command Center')).toBeInTheDocument();
    });

    it('should render search input', () => {
      renderNavBar();
      expect(screen.getByPlaceholderText('Search assistants, properties, leads...')).toBeInTheDocument();
    });

    it('should render sidebar toggle button', () => {
      renderNavBar();
      const toggleBtns = screen.getAllByTestId('SidebarToggleButton');
      expect(toggleBtns.length).toBe(1); // left only (unified sidebar)
    });
  });

  // ── Logo ─────────────────────────────────────────────────────

  describe('Logo', () => {
    it('should navigate to home on logo click', () => {
      renderNavBar();
      fireEvent.click(screen.getByTestId('LogoButton'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // ── Search ───────────────────────────────────────────────────

  describe('Search', () => {
    it('should update search value on input', () => {
      renderNavBar();
      const input = screen.getByPlaceholderText('Search assistants, properties, leads...') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test query' } });
      expect(input.value).toBe('test query');
    });
  });

  // ── Theme Toggle ─────────────────────────────────────────────

  describe('Theme Toggle', () => {
    it('should call onThemeToggle when theme button is clicked', () => {
      const onThemeToggle = vi.fn();
      renderNavBar({ onThemeToggle });
      // Theme toggle is one of the NavIconButtons
      const buttons = screen.getAllByTestId('NavIconButton');
      // Click theme toggle (first one due to order)
      fireEvent.click(buttons[0]);
      expect(onThemeToggle).toHaveBeenCalled();
    });
  });

  // ── Notifications ────────────────────────────────────────────

  describe('Notifications', () => {
    it('should show "No notifications" when list is empty', () => {
      renderNavBar();
      // Click on notification bell button (second NavIconButton)
      const buttons = screen.getAllByTestId('NavIconButton');
      fireEvent.click(buttons[1]);
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('should show notification items when provided', () => {
      const notifications = [
        { id: 'n1', isRead: false, title: 'New lead arrived', time: '5m ago', color: '#3B82F6' },
        { id: 'n2', isRead: true, title: 'Task completed', time: '1h ago', color: '#10B981' },
      ];
      renderNavBar({ notifications });
      const buttons = screen.getAllByTestId('NavIconButton');
      fireEvent.click(buttons[1]);
      expect(screen.getByText('New lead arrived')).toBeInTheDocument();
      expect(screen.getByText('Task completed')).toBeInTheDocument();
    });

    it('should show unread badge count', () => {
      const notifications = [
        { id: 'n1', isRead: false, title: 'Alert 1', time: '1m' },
        { id: 'n2', isRead: false, title: 'Alert 2', time: '2m' },
        { id: 'n3', isRead: true, title: 'Read', time: '3m' },
      ];
      renderNavBar({ notifications });
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should show 9+ for more than 9 unread', () => {
      const notifications = Array.from({ length: 12 }, (_, i) => ({
        id: `n${i}`,
        isRead: false,
        title: `Alert ${i}`,
        time: `${i}m`,
      }));
      renderNavBar({ notifications });
      expect(screen.getByText('9+')).toBeInTheDocument();
    });

    it('should show Notifications header and Mark all read in dropdown', () => {
      renderNavBar();
      const buttons = screen.getAllByTestId('NavIconButton');
      fireEvent.click(buttons[1]);
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Mark all read')).toBeInTheDocument();
    });

    it('should show View all notifications link when notifications exist', () => {
      const notifications = [{ id: 'n1', isRead: false, title: 'Test', time: '1m' }];
      renderNavBar({ notifications });
      const buttons = screen.getAllByTestId('NavIconButton');
      fireEvent.click(buttons[1]);
      expect(screen.getByText('View all notifications')).toBeInTheDocument();
    });
  });

  // ── Profile Menu ─────────────────────────────────────────────

  describe('Profile Menu', () => {
    it('should display user initials when no photo', () => {
      renderNavBar();
      // "Ahmed Al-Rashid" → "AA"
      const avatars = screen.getAllByText('AA');
      expect(avatars.length).toBeGreaterThanOrEqual(1);
    });

    it('should show user display name', () => {
      renderNavBar();
      const names = screen.getAllByText('Ahmed Al-Rashid');
      expect(names.length).toBeGreaterThanOrEqual(1);
    });

    it('should open profile dropdown on click', () => {
      renderNavBar();
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      expect(screen.getByText('My Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Billing')).toBeInTheDocument();
      expect(screen.getByText('Help Center')).toBeInTheDocument();
      expect(screen.getByText('Log Out')).toBeInTheDocument();
    });

    it('should navigate to /profile on My Profile click', () => {
      renderNavBar();
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      fireEvent.click(screen.getByText('My Profile'));
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('should navigate to /settings on Settings click', () => {
      renderNavBar();
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      fireEvent.click(screen.getByText('Settings'));
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('should navigate to /billing on Billing click', () => {
      renderNavBar();
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      fireEvent.click(screen.getByText('Billing'));
      expect(mockNavigate).toHaveBeenCalledWith('/billing');
    });

    it('should call onLogout on Log Out click', () => {
      const onLogout = vi.fn();
      renderNavBar({ onLogout });
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      fireEvent.click(screen.getByText('Log Out'));
      expect(onLogout).toHaveBeenCalled();
    });

    it('should show "WC" when user is null', () => {
      renderNavBar({ user: null });
      const initials = screen.getAllByText('WC');
      expect(initials.length).toBeGreaterThanOrEqual(1);
    });

    it('should show default name "Company Owner" when user has no name', () => {
      renderNavBar({ user: null });
      const names = screen.getAllByText('Company Owner');
      expect(names.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Super User Features ──────────────────────────────────────

  describe('Super User Features', () => {
    it('should show quick stats bar for super user', () => {
      renderNavBar({
        isSuperUser: true,
        quickStats: { properties: 120, users: 45, leads: 89, systemHealth: 'good' },
      });
      expect(screen.getByText('120')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('89')).toBeInTheDocument();
      expect(screen.getByText('GOOD')).toBeInTheDocument();
    });

    it('should not show quick stats for non-super user', () => {
      renderNavBar({ isSuperUser: false, quickStats: { properties: 10 } });
      expect(screen.queryByText('Props')).not.toBeInTheDocument();
    });

    it('should show Admin Dashboard option for super user', () => {
      renderNavBar({ isSuperUser: true });
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('should navigate to admin dashboard on click', () => {
      renderNavBar({ isSuperUser: true });
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      fireEvent.click(screen.getByText('Admin Dashboard'));
      expect(mockNavigate).toHaveBeenCalledWith('/lion/admin-dashboard');
    });

    it('should not show Admin Dashboard for non-super user', () => {
      renderNavBar({ isSuperUser: false });
      fireEvent.click(screen.getByTestId('ProfileTrigger'));
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('should show super user badge', () => {
      renderNavBar({ isSuperUser: true });
      expect(screen.getByTestId('SuperUserBadge')).toBeInTheDocument();
    });
  });

  // ── Sidebar Toggles ──────────────────────────────────────────

  describe('Sidebar Toggles', () => {
    it('should call onToggleLeftSidebar when left toggle clicked', () => {
      const onToggleLeftSidebar = vi.fn();
      renderNavBar({ onToggleLeftSidebar });
      const toggleBtns = screen.getAllByTestId('SidebarToggleButton');
      fireEvent.click(toggleBtns[0]);
      expect(onToggleLeftSidebar).toHaveBeenCalled();
    });
  });

  // ── Keyboard Shortcuts ───────────────────────────────────────

  describe('Keyboard Shortcuts', () => {
    it('should focus search on Ctrl+/', () => {
      renderNavBar();
      const input = screen.getByPlaceholderText('Search assistants, properties, leads...');
      const focusSpy = vi.spyOn(input, 'focus');

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '/', ctrlKey: true }));
      });

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  // ── User Initials ────────────────────────────────────────────

  describe('User Initials', () => {
    it('should return first letter of email when no displayName', () => {
      renderNavBar({ user: { email: 'test@example.com' } });
      const initials = screen.getAllByText('T');
      expect(initials.length).toBeGreaterThanOrEqual(1);
    });
  });
});
