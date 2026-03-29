/**
 * AppLayout — Unit Tests
 * Tests: rendering, role detection from URL, page title extraction,
 * children rendering, nav visibility toggle, user info pass-through
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('../UnifiedNavbar', () => ({
  UnifiedNavbar: ({ title, user, systemStatus }: Record<string, unknown>) => (
    <div data-testid="unified-navbar" data-title={title as string} data-status={systemStatus as string}>
      {user ? (user as Record<string, string>).name : 'No user'}
    </div>
  ),
}));

vi.mock('../common', () => ({
  UniversalNav: (props: Record<string, unknown>) => (
    <div data-testid="universal-nav">UniversalNav</div>
  ),
}));

vi.mock('../../features/auth/components/BiometricLogin', () => ({
  BiometricReminder: () => <div data-testid="biometric-reminder">BiometricReminder</div>,
}));

vi.mock('./AppLayout/styles', () => ({
  AppLayoutContainer: ({ children, ...props }: Record<string, unknown>) =>
    <div data-testid="app-layout-container">{children as React.ReactNode}</div>,
  AppMain: ({ children, ...props }: Record<string, unknown>) =>
    <main data-testid="app-main">{children as React.ReactNode}</main>,
}));

import AppLayout from './AppLayout';
import navigationReducer from '../../store/navigationSlice';
import userReducer from '../../store/userSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = (userOverrides: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      user: userReducer,
    },
    preloadedState: {
      user: {
        currentUser: null,
        loading: false,
        error: null,
        ...userOverrides,
      } as ReturnType<typeof userReducer>,
    },
  });
};

const renderLayout = (
  path = '/',
  userOverrides: Record<string, unknown> = {},
  props: Record<string, unknown> = {},
) => {
  const store = createMockStore(userOverrides);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <AppLayout {...props}>
          <div data-testid="child-content">Hello</div>
        </AppLayout>
      </MemoryRouter>
    </Provider>,
  );
};

// ── Tests ────────────────────────────────────────────────────────

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the layout container', () => {
      renderLayout();
      expect(screen.getByTestId('app-layout-container')).toBeInTheDocument();
    });

    it('should render the unified navbar', () => {
      renderLayout();
      expect(screen.getByTestId('unified-navbar')).toBeInTheDocument();
    });

    it('should render the UniversalNav by default', () => {
      renderLayout();
      expect(screen.getByTestId('universal-nav')).toBeInTheDocument();
    });

    it('should render BiometricReminder', () => {
      renderLayout();
      expect(screen.getByTestId('biometric-reminder')).toBeInTheDocument();
    });

    it('should render children content', () => {
      renderLayout();
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should render the main content area', () => {
      renderLayout();
      expect(screen.getByTestId('app-main')).toBeInTheDocument();
    });
  });

  // ── Nav Visibility ───────────────────────────────────────────

  describe('Nav Visibility', () => {
    it('should hide UniversalNav when showNav is false', () => {
      renderLayout('/', {}, { showNav: false });
      expect(screen.queryByTestId('universal-nav')).not.toBeInTheDocument();
    });

    it('should show UniversalNav when showNav is true (default)', () => {
      renderLayout();
      expect(screen.getByTestId('universal-nav')).toBeInTheDocument();
    });
  });

  // ── Page Title ───────────────────────────────────────────────

  describe('Page Title', () => {
    it('should pass "Home" title for root path', () => {
      renderLayout('/');
      const navbar = screen.getByTestId('unified-navbar');
      expect(navbar.getAttribute('data-title')).toBe('Home');
    });

    it('should extract title from path and capitalize', () => {
      renderLayout('/owner/crm');
      const navbar = screen.getByTestId('unified-navbar');
      expect(navbar.getAttribute('data-title')).toBe('Crm');
    });

    it('should replace hyphens with spaces in title', () => {
      renderLayout('/owner/agent-performance');
      const navbar = screen.getByTestId('unified-navbar');
      expect(navbar.getAttribute('data-title')).toBe('Agent Performance');
    });

    it('should use last path segment as title', () => {
      renderLayout('/owner/crm/leads');
      const navbar = screen.getByTestId('unified-navbar');
      expect(navbar.getAttribute('data-title')).toBe('Leads');
    });
  });

  // ── Role Detection ───────────────────────────────────────────

  describe('Role Detection', () => {
    it('should detect "buyer" role from URL path', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/buyer/dashboard']}>
            <AppLayout><div>content</div></AppLayout>
          </MemoryRouter>
        </Provider>,
      );
      expect(store.getState().navigation.activeRole).toBe('buyer');
    });

    it('should detect "owner" role from URL path', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/owner/properties']}>
            <AppLayout><div>content</div></AppLayout>
          </MemoryRouter>
        </Provider>,
      );
      expect(store.getState().navigation.activeRole).toBe('owner');
    });

    it('should detect "tenant" role from URL path', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/tenant/payments']}>
            <AppLayout><div>content</div></AppLayout>
          </MemoryRouter>
        </Provider>,
      );
      expect(store.getState().navigation.activeRole).toBe('tenant');
    });

    it('should detect "landlord" role from URL path', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/landlord/rentals']}>
            <AppLayout><div>content</div></AppLayout>
          </MemoryRouter>
        </Provider>,
      );
      expect(store.getState().navigation.activeRole).toBe('landlord');
    });

    it('should not set role for unknown path segments', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/unknown/route']}>
            <AppLayout><div>content</div></AppLayout>
          </MemoryRouter>
        </Provider>,
      );
      // activeRole should remain at its initial value (not 'unknown')
      expect(store.getState().navigation.activeRole).not.toBe('unknown');
    });
  });

  // ── User Info Pass-Through ───────────────────────────────────

  describe('User Info', () => {
    it('should pass user info to navbar when user exists', () => {
      renderLayout('/', {
        currentUser: { id: 'u1', name: 'Ahmed', email: 'ahmed@wc.ae', role: 'owner' },
      });
      expect(screen.getByText('Ahmed')).toBeInTheDocument();
    });

    it('should show "No user" when no user is logged in', () => {
      renderLayout('/', { currentUser: null });
      expect(screen.getByText('No user')).toBeInTheDocument();
    });

    it('should pass system status to navbar', () => {
      renderLayout();
      const navbar = screen.getByTestId('unified-navbar');
      expect(navbar.getAttribute('data-status')).toBe('online');
    });
  });
});
