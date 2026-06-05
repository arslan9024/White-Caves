/**
 * TopBar — Comprehensive Unit Tests
 *
 * Tests: logo rendering, breadcrumb navigation, search trigger,
 * keyboard shortcuts, notifications badge, user menu dropdown,
 * role-based admin menu, logout callback, click-outside dismiss
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockLocation = { pathname: '/dashboard', search: '', hash: '', state: null, key: 'default' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock('./styles', () => ({
  TopBarContainer: ({ children, ...props }: Record<string, unknown>) => (
    <header data-testid="topbar-container" {...props}>{children as React.ReactNode}</header>
  ),
  LogoSection: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="logo-section" role="button" {...props}>{children as React.ReactNode}</div>
  ),
  LogoMark: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="logo-mark" {...props}>{children as React.ReactNode}</div>
  ),
  LogoName: ({ children, ...props }: Record<string, unknown>) => (
    <span data-testid="logo-name" {...props}>{children as React.ReactNode}</span>
  ),
  VerticalDivider: (props: Record<string, unknown>) => <div data-testid="divider" {...props} />,
  BreadcrumbsSection: ({ children, ...props }: Record<string, unknown>) => (
    <nav data-testid="breadcrumbs" {...props}>{children as React.ReactNode}</nav>
  ),
  BreadcrumbItem: ({ children, $isLast, ...props }: Record<string, unknown>) => (
    <button data-testid="breadcrumb-item" data-is-last={$isLast} {...props}>{children as React.ReactNode}</button>
  ),
  BreadcrumbSeparator: ({ children, ...props }: Record<string, unknown>) => (
    <span data-testid="breadcrumb-sep" {...props}>{children as React.ReactNode}</span>
  ),
  ActionsSection: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="actions-section" {...props}>{children as React.ReactNode}</div>
  ),
  ActionAnchor: React.forwardRef<HTMLDivElement, Record<string, unknown>>(({ children, ...props }, ref) => (
    <div data-testid="action-anchor" ref={ref} {...props}>{children as React.ReactNode}</div>
  )),
  SearchTrigger: ({ children, ...props }: Record<string, unknown>) => (
    <button data-testid="search-trigger" {...props}>{children as React.ReactNode}</button>
  ),
  SearchShortcut: ({ children, ...props }: Record<string, unknown>) => (
    <kbd data-testid="search-shortcut" {...props}>{children as React.ReactNode}</kbd>
  ),
  QuickActionButton: ({ children, ...props }: Record<string, unknown>) => (
    <button {...props}>{children as React.ReactNode}</button>
  ),
  IconButton: ({ children, ...props }: Record<string, unknown>) => (
    <button data-testid="icon-button" {...props}>{children as React.ReactNode}</button>
  ),
  NotifBadge: ({ children, ...props }: Record<string, unknown>) => (
    <span data-testid="notif-badge" {...props}>{children as React.ReactNode}</span>
  ),
  UserButton: ({ children, ...props }: Record<string, unknown>) => (
    <button data-testid="user-button" {...props}>{children as React.ReactNode}</button>
  ),
  UserAvatar: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="user-avatar" {...props}>{children as React.ReactNode}</div>
  ),
  UserName: ({ children, ...props }: Record<string, unknown>) => (
    <span data-testid="user-name" {...props}>{children as React.ReactNode}</span>
  ),
  DropdownOverlay: (props: Record<string, unknown>) => (
    <div data-testid="dropdown-overlay" {...props} />
  ),
  DropdownMenu: React.forwardRef<HTMLDivElement, Record<string, unknown>>(({ children, $align, ...props }, ref) => (
    <div data-testid="dropdown-menu" data-align={$align} ref={ref} {...props}>{children as React.ReactNode}</div>
  )),
  DropdownItem: ({ children, $danger, disabled, ...props }: Record<string, unknown>) => (
    <button data-testid="dropdown-item" data-danger={$danger} disabled={disabled as boolean} {...props}>
      {children as React.ReactNode}
    </button>
  ),
  DropdownDivider: (props: Record<string, unknown>) => <hr data-testid="dropdown-divider" {...props} />,
  DropdownHeader: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="dropdown-header" {...props}>{children as React.ReactNode}</div>
  ),
  DropdownHeaderName: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="dropdown-header-name" {...props}>{children as React.ReactNode}</div>
  ),
  DropdownHeaderEmail: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="dropdown-header-email" {...props}>{children as React.ReactNode}</div>
  ),
  DropdownHeaderRole: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="dropdown-header-role" {...props}>{children as React.ReactNode}</div>
  ),
  HamburgerButton: ({ children, ...props }: Record<string, unknown>) => (
    <button data-testid="hamburger-button" {...props}>{children as React.ReactNode}</button>
  ),
}));

vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="icon-search" />,
  Bell: () => <svg data-testid="icon-bell" />,
  ChevronDown: () => <svg data-testid="icon-chevron-down" />,
  User: () => <svg data-testid="icon-user" />,
  Settings: () => <svg data-testid="icon-settings" />,
  LogOut: () => <svg data-testid="icon-logout" />,
  Shield: () => <svg data-testid="icon-shield" />,
  Menu: () => <svg data-testid="icon-menu" />,
  Plus: () => <svg data-testid="icon-plus" />,
}));

import TopBar from './TopBar';
import authReducer from '../../../store/authSlice';
import sidebarReducer from '../../../store/slices/sidebarSlice';

// ── Helpers ───────────────────────────────────────────────────────────────

function createTestStore(overrides: { auth?: Record<string, unknown>; sidebar?: Record<string, unknown> } = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      sidebar: sidebarReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        refreshToken: null,
        session: {
          isLoggedIn: false,
          lastActive: null,
          sessions: [],
          expiresAt: null,
          activeSessionId: null,
        },
        loginMethods: { social: false, email: false, mobile: false },
        loginProvider: null,
        rememberMe: false,
        sessionTimeout: 1800000,
        loading: false,
        error: null,
        ...overrides.auth,
      } as any,
      sidebar: {
        flyoutOpen: false,
        flyoutDepartment: null,
        aiCommandOpen: false,
        aiAssistantSearch: '',
        aiAssistantFilter: 'all',
        selectedAssistant: null,
        selectedDepartment: null,
        selectedService: null,
        commandPaletteOpen: false,
        mobileSheetOpen: false,
        ...overrides.sidebar,
      } as any,
    },
  });
}

interface RenderOptions {
  auth?: Record<string, unknown>;
  sidebar?: Record<string, unknown>;
  notifications?: Array<{ id: string; read: boolean }>;
  onLogout?: () => void;
}

function renderTopBar(options: RenderOptions = {}) {
  const { auth, sidebar, notifications, onLogout } = options;
  const store = createTestStore({ auth, sidebar });

  const result = render(
    <Provider store={store}>
      <MemoryRouter>
        <TopBar notifications={notifications} onLogout={onLogout} />
      </MemoryRouter>
    </Provider>,
  );

  return { ...result, store };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = '/dashboard';
  });

  // ── Rendering ───────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders the container', () => {
      renderTopBar();
      expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
    });

    it('renders the logo with WC mark and White Caves name', () => {
      renderTopBar();
      expect(screen.getByTestId('logo-mark')).toHaveTextContent('WC');
      expect(screen.getByTestId('logo-name')).toHaveTextContent('White Caves');
    });

    it('renders the vertical divider', () => {
      renderTopBar();
      expect(screen.getByTestId('divider')).toBeInTheDocument();
    });

    it('renders the breadcrumbs section', () => {
      renderTopBar();
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    });

    it('renders the actions section', () => {
      renderTopBar();
      expect(screen.getByTestId('actions-section')).toBeInTheDocument();
    });

    it('renders quick actions button', () => {
      renderTopBar();
      expect(screen.getByTestId('quick-actions-btn')).toBeInTheDocument();
      expect(screen.getByLabelText('Quick actions')).toBeInTheDocument();
    });

    it('renders the search trigger with label', () => {
      renderTopBar();
      const trigger = screen.getByTestId('search-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-label', 'Open search (Ctrl+K)');
    });

    it('renders the ⌘K shortcut hint', () => {
      renderTopBar();
      expect(screen.getByTestId('search-shortcut')).toHaveTextContent('⌘K');
    });
  });

  // ── Logo Navigation ─────────────────────────────────────────────────

  describe('logo navigation', () => {
    it('navigates to /crm when logo is clicked', () => {
      renderTopBar();
      fireEvent.click(screen.getByTestId('logo-section'));
      expect(mockNavigate).toHaveBeenCalledWith('/crm');
    });

    it('has accessible label on logo section', () => {
      renderTopBar();
      expect(screen.getByTestId('logo-section')).toHaveAttribute('aria-label', 'Go to dashboard');
    });
  });

  // ── Breadcrumbs ─────────────────────────────────────────────────────

  describe('breadcrumbs', () => {
    it('shows "Dashboard" as default root breadcrumb', () => {
      renderTopBar();
      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items[0]).toHaveTextContent('Dashboard');
    });

    it('marks the last breadcrumb with aria-current="page"', () => {
      renderTopBar();
      const items = screen.getAllByTestId('breadcrumb-item');
      const last = items[items.length - 1];
      expect(last).toHaveAttribute('aria-current', 'page');
    });

    it('adds department breadcrumb when department is selected', () => {
      renderTopBar({ sidebar: { selectedDepartment: 'sales' } });
      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items.some(item => item.textContent === 'Sales')).toBe(true);
    });

    it('adds service breadcrumb when service is selected', () => {
      renderTopBar({ sidebar: { selectedDepartment: 'finance', selectedService: 'Invoices' } });
      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items.some(item => item.textContent === 'Invoices')).toBe(true);
    });

    it('renders separators between breadcrumb items', () => {
      renderTopBar({ sidebar: { selectedDepartment: 'operations' } });
      const seps = screen.getAllByTestId('breadcrumb-sep');
      expect(seps.length).toBeGreaterThan(0);
      expect(seps[0]).toHaveTextContent('/');
    });

    it('builds path-based breadcrumbs for role routes', () => {
      mockLocation.pathname = '/buyer/properties';
      renderTopBar();
      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items[0]).toHaveTextContent('Buyer');
      expect(items[1]).toHaveTextContent('Properties');
    });
  });

  // ── Search Trigger ──────────────────────────────────────────────────

  describe('search trigger', () => {
    it('dispatches toggleCommandPalette on click', () => {
      const { store } = renderTopBar();
      fireEvent.click(screen.getByTestId('search-trigger'));
      expect(store.getState().sidebar.commandPaletteOpen).toBe(true);
    });

    it('dispatches toggleCommandPalette on Ctrl+K', () => {
      const { store } = renderTopBar();
      fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
      expect(store.getState().sidebar.commandPaletteOpen).toBe(true);
    });

    it('dispatches toggleCommandPalette on Meta+K (Mac)', () => {
      const { store } = renderTopBar();
      fireEvent.keyDown(window, { key: 'k', metaKey: true });
      expect(store.getState().sidebar.commandPaletteOpen).toBe(true);
    });

    it('does not toggle on plain K key press', () => {
      const { store } = renderTopBar();
      fireEvent.keyDown(window, { key: 'k' });
      expect(store.getState().sidebar.commandPaletteOpen).toBe(false);
    });
  });

  // ── Quick Actions ───────────────────────────────────────────────────

  describe('quick actions', () => {
    it('opens quick actions dropdown', () => {
      renderTopBar();
      fireEvent.click(screen.getByTestId('quick-actions-btn'));
      expect(screen.getByTestId('quick-actions-menu')).toBeInTheDocument();
    });

    it('navigates to /leads/new from quick actions', () => {
      renderTopBar();
      fireEvent.click(screen.getByTestId('quick-actions-btn'));
      fireEvent.click(screen.getByText('Create Lead'));
      expect(mockNavigate).toHaveBeenCalledWith('/leads/new');
    });

    it('navigates to /properties/new from quick actions', () => {
      renderTopBar();
      fireEvent.click(screen.getByTestId('quick-actions-btn'));
      fireEvent.click(screen.getByText('Add Property'));
      expect(mockNavigate).toHaveBeenCalledWith('/properties/new');
    });

    it('closes quick actions on Escape', () => {
      renderTopBar();
      fireEvent.click(screen.getByTestId('quick-actions-btn'));
      expect(screen.getByTestId('quick-actions-menu')).toBeInTheDocument();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByTestId('quick-actions-menu')).not.toBeInTheDocument();
    });
  });

  // ── Notifications ───────────────────────────────────────────────────

  describe('notifications', () => {
    it('does not show badge when no notifications', () => {
      renderTopBar({ notifications: [] });
      expect(screen.queryByTestId('notif-badge')).not.toBeInTheDocument();
    });

    it('does not show badge when all notifications are read', () => {
      renderTopBar({
        notifications: [
          { id: '1', read: true },
          { id: '2', read: true },
        ],
      });
      expect(screen.queryByTestId('notif-badge')).not.toBeInTheDocument();
    });

    it('shows unread count badge', () => {
      renderTopBar({
        notifications: [
          { id: '1', read: false },
          { id: '2', read: true },
          { id: '3', read: false },
        ],
      });
      expect(screen.getByTestId('notif-badge')).toHaveTextContent('2');
    });

    it('caps badge display at 9+', () => {
      const notifs = Array.from({ length: 12 }, (_, i) => ({ id: String(i), read: false }));
      renderTopBar({ notifications: notifs });
      expect(screen.getByTestId('notif-badge')).toHaveTextContent('9+');
    });

    it('shows accessible notification label with count', () => {
      renderTopBar({
        notifications: [{ id: '1', read: false }],
      });
      const bellButton = screen.getByLabelText('Notifications (1 unread)');
      expect(bellButton).toBeInTheDocument();
    });

    it('opens notification dropdown on bell click', () => {
      renderTopBar({ notifications: [] });
      const bellButton = screen.getByLabelText('Notifications');
      fireEvent.click(bellButton);
      // Should now show dropdown with "No new notifications"
      const items = screen.getAllByTestId('dropdown-item');
      expect(items.some(item => item.textContent?.includes('No new notifications'))).toBe(true);
    });

    it('shows notification items in dropdown', () => {
      renderTopBar({
        notifications: [
          { id: 'n1', read: false },
          { id: 'n2', read: true },
        ],
      });
      const bellButton = screen.getByLabelText('Notifications (1 unread)');
      fireEvent.click(bellButton);
      const items = screen.getAllByTestId('dropdown-item');
      expect(items.some(item => item.textContent?.includes('Notification n1'))).toBe(true);
    });

    it('closes notification dropdown when overlay is clicked', () => {
      renderTopBar({ notifications: [] });
      const bellButton = screen.getByLabelText('Notifications');
      fireEvent.click(bellButton);
      expect(screen.getByTestId('dropdown-overlay')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('dropdown-overlay'));
      expect(screen.queryByTestId('dropdown-overlay')).not.toBeInTheDocument();
    });

    it('closes notifications when quick actions are opened', () => {
      renderTopBar({ notifications: [] });
      fireEvent.click(screen.getByLabelText('Notifications'));
      expect(screen.getByText('No new notifications')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('quick-actions-btn'));
      expect(screen.queryByText('No new notifications')).not.toBeInTheDocument();
    });
  });

  // ── User Menu ───────────────────────────────────────────────────────

  describe('user menu', () => {
    const authUser = {
      user: {
        id: 'u1',
        email: 'admin@whitecaves.com',
        name: 'Ahmed Al Mansouri',
        role: 'manager',
      },
    };

    it('displays user initials in avatar', () => {
      renderTopBar({ auth: authUser });
      expect(screen.getByTestId('user-avatar')).toHaveTextContent('AA');
    });

    it('displays user name', () => {
      renderTopBar({ auth: authUser });
      expect(screen.getByTestId('user-name')).toHaveTextContent('Ahmed Al Mansouri');
    });

    it('falls back to email when name is absent', () => {
      renderTopBar({
        auth: { user: { id: 'u2', email: 'test@wc.com' } },
      });
      expect(screen.getByTestId('user-name')).toHaveTextContent('test@wc.com');
    });

    it('falls back to "User" when no user data', () => {
      renderTopBar();
      expect(screen.getByTestId('user-name')).toHaveTextContent('User');
    });

    it('shows single letter initial for single name', () => {
      renderTopBar({
        auth: { user: { id: 'u3', email: 'test@wc.com', name: 'Sara' } },
      });
      expect(screen.getByTestId('user-avatar')).toHaveTextContent('S');
    });

    it('opens user dropdown on user button click', () => {
      renderTopBar({ auth: authUser });
      fireEvent.click(screen.getByTestId('user-button'));
      expect(screen.getByTestId('dropdown-header-name')).toHaveTextContent('Ahmed Al Mansouri');
      expect(screen.getByTestId('dropdown-header-email')).toHaveTextContent('admin@whitecaves.com');
      expect(screen.getByTestId('dropdown-header-role')).toHaveTextContent('manager');
    });

    it('renders Profile and Settings menu items', () => {
      renderTopBar({ auth: authUser });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      expect(items.some(item => item.textContent?.includes('Profile'))).toBe(true);
      expect(items.some(item => item.textContent?.includes('Settings'))).toBe(true);
    });

    it('navigates to /profile on Profile click', () => {
      renderTopBar({ auth: authUser });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      const profileItem = items.find(item => item.textContent?.includes('Profile'));
      fireEvent.click(profileItem!);
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('navigates to /settings on Settings click', () => {
      renderTopBar({ auth: authUser });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      const settingsItem = items.find(item => item.textContent?.includes('Settings'));
      fireEvent.click(settingsItem!);
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('calls onLogout and closes menu on Sign out click', () => {
      const mockLogout = vi.fn();
      renderTopBar({ auth: authUser, onLogout: mockLogout });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      const signOutItem = items.find(item => item.textContent?.includes('Sign out'));
      fireEvent.click(signOutItem!);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('closes user dropdown when overlay is clicked', () => {
      renderTopBar({ auth: authUser });
      fireEvent.click(screen.getByTestId('user-button'));
      // Two overlays may exist; get the last one (user menu overlay)
      const overlays = screen.getAllByTestId('dropdown-overlay');
      fireEvent.click(overlays[overlays.length - 1]);
      expect(screen.queryByTestId('dropdown-header-name')).not.toBeInTheDocument();
    });
  });

  // ── Role-Based Admin Menu ───────────────────────────────────────────

  describe('role-based admin visibility', () => {
    it('shows Admin Dashboard link for lion (super user) role', () => {
      renderTopBar({
        auth: { user: { id: 'u1', email: 'lion@wc.com', name: 'Super Admin', role: 'lion' } },
      });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      expect(items.some(item => item.textContent?.includes('Admin Dashboard'))).toBe(true);
    });

    it('shows Operations Cockpit link for lion (super user) role', () => {
      renderTopBar({
        auth: { user: { id: 'u1', email: 'lion@wc.com', name: 'Super Admin', role: 'lion' } },
      });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      expect(items.some(item => item.textContent?.includes('Operations Cockpit'))).toBe(true);
    });

    it('hides Admin Dashboard link for non-lion roles', () => {
      renderTopBar({
        auth: { user: { id: 'u1', email: 'agent@wc.com', name: 'Agent', role: 'sales-agent' } },
      });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      expect(items.some(item => item.textContent?.includes('Admin Dashboard'))).toBe(false);
      expect(items.some(item => item.textContent?.includes('Operations Cockpit'))).toBe(false);
    });

    it('navigates to admin cockpit mode on Admin Dashboard click', () => {
      renderTopBar({
        auth: { user: { id: 'u1', email: 'lion@wc.com', name: 'Lion', role: 'lion' } },
      });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      const adminItem = items.find(item => item.textContent?.includes('Admin Dashboard'));
      fireEvent.click(adminItem!);
      expect(mockNavigate).toHaveBeenCalledWith('/crm?tab=admin&cockpit=md');
    });

    it('navigates to cockpit mode on Operations Cockpit click', () => {
      renderTopBar({
        auth: { user: { id: 'u1', email: 'lion@wc.com', name: 'Lion', role: 'lion' } },
      });
      fireEvent.click(screen.getByTestId('user-button'));
      const items = screen.getAllByTestId('dropdown-item');
      const cockpitItem = items.find(item => item.textContent?.includes('Operations Cockpit'));
      fireEvent.click(cockpitItem!);
      expect(mockNavigate).toHaveBeenCalledWith('/crm?tab=overview&cockpit=md');
    });
  });

  // ── Keyboard Shortcut Lifecycle ─────────────────────────────────────

  describe('keyboard shortcut cleanup', () => {
    it('removes keyboard listener on unmount', () => {
      const addSpy = vi.spyOn(window, 'addEventListener');
      const removeSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = renderTopBar();

      const addCall = addSpy.mock.calls.find(c => c[0] === 'keydown');
      expect(addCall).toBeDefined();

      unmount();

      const removeCall = removeSpy.mock.calls.find(c => c[0] === 'keydown');
      expect(removeCall).toBeDefined();
      // Same handler reference should be used for cleanup
      expect(removeCall![1]).toBe(addCall![1]);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });

  // ── Edge Cases ──────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('handles missing notifications prop gracefully (defaults to [])', () => {
      // No notifications prop = defaults to []
      renderTopBar();
      expect(screen.queryByTestId('notif-badge')).not.toBeInTheDocument();
    });

    it('handles user with only email, no name', () => {
      renderTopBar({
        auth: { user: { id: 'u1', email: 'noname@wc.com' } },
      });
      // Avatar should show first letter of email
      expect(screen.getByTestId('user-avatar')).toHaveTextContent('N');
    });

    it('handles deeply nested route paths', () => {
      mockLocation.pathname = '/leasing-agent/properties/active';
      renderTopBar();
      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items[0]).toHaveTextContent('Leasing Agent');
      expect(items.length).toBeGreaterThanOrEqual(3);
    });

    it('does not duplicate department in breadcrumbs if already in path', () => {
      mockLocation.pathname = '/dashboard';
      renderTopBar({ sidebar: { selectedDepartment: 'sales' } });
      const items = screen.getAllByTestId('breadcrumb-item');
      const salesCount = items.filter(item => item.textContent === 'Sales').length;
      expect(salesCount).toBe(1);
    });
  });
});
