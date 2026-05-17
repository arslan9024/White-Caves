/**
 * AppLayout — Unit Tests (updated for new CRM layout)
 * Tests: rendering, role detection from URL, children rendering,
 * nav visibility toggle, component composition
 */

import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

let responsiveLayoutMock = {
  isDesktop: true,
  isTablet: false,
  isMobile: false,
};

const unifiedSidebarMock = vi.fn((_props?: Record<string, unknown>) => (
  <div data-testid="unified-sidebar">UnifiedSidebar</div>
));

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('./TopBar', () => ({
  TopBar: () => <div data-testid="top-bar">TopBar</div>,
}));

vi.mock('./UnifiedSidebar', () => ({
  default: (props: Record<string, unknown>) => unifiedSidebarMock(props),
}));

vi.mock('../../hooks/navigation/useResponsiveLayout', () => ({
  useResponsiveLayout: () => responsiveLayoutMock,
}));

vi.mock('../common/CommandPalette', () => ({
  default: () => <div data-testid="command-palette">CommandPalette</div>,
}));

vi.mock('../../features/auth/components/BiometricLogin', () => ({
  BiometricReminder: () => <div data-testid="biometric-reminder">BiometricReminder</div>,
}));

vi.mock('./AppLayout/styles', () => ({
  AppLayoutContainer: ({ children, ..._props }: Record<string, unknown>) => (
    <div data-testid="app-layout-container">{children as React.ReactNode}</div>
  ),
  AppBody: ({ children, ..._props }: Record<string, unknown>) => (
    <div data-testid="app-body">{children as React.ReactNode}</div>
  ),
  AppMain: ({ children, id, tabIndex, ..._props }: Record<string, unknown>) => (
    <main data-testid="app-main" id={id as string} tabIndex={tabIndex as number}>
      {children as React.ReactNode}
    </main>
  ),
}));

import AppLayout from './AppLayout';
import navigationReducer from '../../store/navigationSlice';
import userReducer from '../../store/userSlice';
import sidebarReducer from '../../store/slices/sidebarSlice';
import nadiaReducer from '../../store/slices/nadiaSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = (overrides: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      user: userReducer,
      sidebar: sidebarReducer,
      nadia: nadiaReducer,
    },
    preloadedState: {
      user: {
        currentUser: { id: 'u1', name: 'Admin', email: 'admin@wc.ae', role: 'owner' },
        isLoading: false,
        error: null,
        ...overrides,
      } as ReturnType<typeof userReducer>,
    },
  });
};

const renderLayout = (
  path = '/',
  overrides: Record<string, unknown> = {},
  props: Record<string, unknown> = {}
) => {
  const store = createMockStore(overrides);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <AppLayout {...props}>
          <div data-testid="child-content">Hello</div>
        </AppLayout>
      </MemoryRouter>
    </Provider>
  );
};

const setResponsiveMode = (mode: 'desktop' | 'tablet' | 'mobile') => {
  responsiveLayoutMock = {
    isDesktop: mode === 'desktop',
    isTablet: mode === 'tablet',
    isMobile: mode === 'mobile',
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('AppLayout', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
    unifiedSidebarMock.mockClear();
    setResponsiveMode('desktop');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the layout container', () => {
      renderLayout();
      expect(screen.getByTestId('app-layout-container')).toBeInTheDocument();
    });

    it('should render the TopBar', () => {
      renderLayout();
      expect(screen.getByTestId('top-bar')).toBeInTheDocument();
    });

    it('should render the CommandPalette', () => {
      renderLayout();
      expect(screen.getByTestId('command-palette')).toBeInTheDocument();
    });

    it('should render the UnifiedSidebar by default for authenticated CRM users', () => {
      renderLayout();
      expect(screen.getByTestId('unified-sidebar')).toBeInTheDocument();
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

    it('should render the app body wrapper', () => {
      renderLayout();
      expect(screen.getByTestId('app-body')).toBeInTheDocument();
    });

    it('should render skip-to-content link for keyboard navigation (WCAG 2.4.1)', () => {
      renderLayout();
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink.tagName).toBe('A');
      expect(skipLink).toHaveAttribute('href', '#main-content');
      expect(skipLink).toHaveClass('skip-to-content');
    });
  });

  // ── Nav Visibility ───────────────────────────────────────────

  describe('Nav Visibility', () => {
    it('should hide sidebar navigation when showNav is false', () => {
      renderLayout('/', {}, { showNav: false });
      expect(screen.queryByTestId('unified-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('top-bar')).not.toBeInTheDocument();
    });

    it('should show UnifiedSidebar when showNav is true (default)', () => {
      renderLayout();
      expect(screen.getByTestId('unified-sidebar')).toBeInTheDocument();
    });

    it('should pass isSuperUser to UnifiedSidebar', () => {
      renderLayout('/', {}, { isSuperUser: true });
      expect(unifiedSidebarMock).toHaveBeenCalled();
      expect(unifiedSidebarMock).toHaveBeenCalledWith(
        expect.objectContaining({ isSuperUser: true })
      );
    });

    it('should still render UnifiedSidebar on tablet for authenticated users', () => {
      setResponsiveMode('tablet');
      renderLayout();
      expect(screen.getByTestId('unified-sidebar')).toBeInTheDocument();
    });

    it('should hide CRM chrome when there is no authenticated user', () => {
      renderLayout('/', { currentUser: null });
      expect(screen.queryByTestId('unified-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('top-bar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('command-palette')).not.toBeInTheDocument();
    });
  });

  // ── Role Detection ───────────────────────────────────────────

  describe('Role Detection', () => {
    it.each([
      { role: 'buyer', path: '/buyer/dashboard' },
      { role: 'seller', path: '/seller/leads' },
      { role: 'landlord', path: '/landlord/rentals' },
      { role: 'tenant', path: '/tenant/payments' },
      { role: 'leasing-agent', path: '/leasing-agent/pipeline' },
      { role: 'secondary-sales-agent', path: '/secondary-sales-agent/properties' },
      { role: 'owner', path: '/owner/properties' },
    ])('should detect "$role" role from URL path', ({ role, path }) => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <AppLayout>
              <div>content</div>
            </AppLayout>
          </MemoryRouter>
        </Provider>
      );
      expect(store.getState().navigation.activeRole).toBe(role);
    });

    it('should not set role for unknown path segments', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/unknown/route']}>
            <AppLayout>
              <div>content</div>
            </AppLayout>
          </MemoryRouter>
        </Provider>
      );
      expect(store.getState().navigation.activeRole).not.toBe('unknown');
    });
  });
});
