/**
 * SidebarContainer – Unit Tests (Redux-driven icon rail + flyout)
 * Tests: rendering, department navigation, flyout, admin visibility, tooltips
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from '../../../store/slices/sidebarSlice';

// Minimal auth reducer
const authReducer = (state = { user: { role: 'user' } }, action: any) => {
  if (action.type === 'SET_ROLE') return { user: { role: action.payload } };
  return state;
};

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const stub = (name: string) =>
    React.forwardRef(({ size, ...props }: any, ref: any) => (
      <span data-testid={`icon-${name.toLowerCase()}`} ref={ref} {...props} />
    ));
  return {
    Home: stub('Home'),
    BarChart3: stub('BarChart3'),
    Users2: stub('Users2'),
    Settings: stub('Settings'),
    TrendingUp: stub('TrendingUp'),
    Building2: stub('Building2'),
    DollarSign: stub('DollarSign'),
    Megaphone: stub('Megaphone'),
    MessageSquare: stub('MessageSquare'),
    Globe: stub('Globe'),
    Lock: stub('Lock'),
    Code: stub('Code'),
    Scale: stub('Scale'),
    Bot: stub('Bot'),
    Shield: stub('Shield'),
    ChevronLeft: stub('ChevronLeft'),
  };
});

// Mock styled-components with simple divs
vi.mock('./styles', () => {
  const stub = (name: string, tag = 'div') => {
    const C = ({ children, onClick, title, ...rest }: any) => {
      // Filter out styled-component transient props ($active, $color, etc.)
      const filtered: any = {};
      for (const [k, v] of Object.entries(rest)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement(tag, { 'data-testid': name, onClick, title, ...filtered }, children);
    };
    C.displayName = name;
    return C;
  };
  return {
    RailContainer: stub('RailContainer'),
    RailWrapper: stub('RailWrapper'),
    RailIcon: stub('RailIcon'),
    RailIconButton: stub('RailIconButton', 'button'),
    RailTooltip: stub('RailTooltip'),
    RailDivider: stub('RailDivider'),
    RailSpacer: stub('RailSpacer'),
    FlyoutPanel: stub('FlyoutPanel'),
    FlyoutHeader: stub('FlyoutHeader'),
    FlyoutTitle: stub('FlyoutTitle'),
    FlyoutClose: stub('FlyoutClose', 'button'),
    FlyoutNav: stub('FlyoutNav'),
    FlyoutItem: stub('FlyoutItem', 'button'),
    FlyoutDot: stub('FlyoutDot'),
    FlyoutBackdrop: stub('FlyoutBackdrop'),
  };
});

import SidebarContainer from './SidebarContainer';

// ── Helpers ──────────────────────────────────────────────────────

function makeStore(overrides: Record<string, unknown> = {}, role = 'user') {
  return configureStore({
    reducer: { sidebar: sidebarReducer, auth: authReducer },
    preloadedState: {
      sidebar: {
        flyoutOpen: false,
        flyoutDepartment: null,
        rightPanelOpen: false,
        selectedAssistant: null,
        selectedDepartment: null,
        selectedService: null,
        commandPaletteOpen: false,
        mobileSheetOpen: false,
        ...overrides,
      } as ReturnType<typeof sidebarReducer>,
      auth: { user: { role } } as any,
    },
  });
}

function renderSidebar(overrides: Record<string, unknown> = {}, role = 'user') {
  const store = makeStore(overrides, role);
  const utils = render(
    <Provider store={store}>
      <SidebarContainer />
    </Provider>,
  );
  return { store, ...utils };
}

// ── Tests ────────────────────────────────────────────────────────

describe('SidebarContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the rail container', () => {
      renderSidebar();
      expect(screen.getByTestId('RailContainer')).toBeInTheDocument();
    });

    it('renders top navigation items (Dashboard, Analytics, Clients)', () => {
      renderSidebar();
      const buttons = screen.getAllByTestId('RailIconButton');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('renders Dashboard tooltip', () => {
      renderSidebar();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders Analytics tooltip', () => {
      renderSidebar();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('renders Clients tooltip', () => {
      renderSidebar();
      expect(screen.getByText('Clients')).toBeInTheDocument();
    });

    it('renders department icons (Operations, Finance, Sales, etc.)', () => {
      renderSidebar();
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
    });

    it('renders Settings in bottom section', () => {
      renderSidebar();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders AI Assistants button', () => {
      renderSidebar();
      expect(screen.getByText('AI Assistants')).toBeInTheDocument();
    });
  });

  describe('department flyout', () => {
    it('dispatches toggleFlyout when department icon clicked', () => {
      const { store } = renderSidebar();
      const opsButton = screen.getByTitle('Operations');
      fireEvent.click(opsButton);
      expect(store.getState().sidebar.flyoutOpen).toBe(true);
      expect(store.getState().sidebar.flyoutDepartment).toBe('operations');
    });

    it('shows flyout content when flyout is open', () => {
      renderSidebar({ flyoutOpen: true, flyoutDepartment: 'operations' });
      expect(screen.getByText('Inventory Management')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
    });

    it('closes flyout when close button clicked', () => {
      const { store } = renderSidebar({ flyoutOpen: true, flyoutDepartment: 'sales' });
      const closeBtn = screen.getByLabelText('Close flyout');
      fireEvent.click(closeBtn);
      expect(store.getState().sidebar.flyoutOpen).toBe(false);
    });

    it('selects service when flyout item clicked', () => {
      const { store } = renderSidebar({ flyoutOpen: true, flyoutDepartment: 'finance' });
      fireEvent.click(screen.getByText('Invoicing'));
      expect(store.getState().sidebar.selectedService).toBe('Invoicing');
      expect(store.getState().sidebar.selectedDepartment).toBe('finance');
      // Flyout should close after service selection
      expect(store.getState().sidebar.flyoutOpen).toBe(false);
    });
  });

  describe('admin visibility', () => {
    it('does not show Admin button for regular users', () => {
      renderSidebar({}, 'user');
      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });

    it('shows Admin button for lion (super user) role', () => {
      renderSidebar({}, 'lion');
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  describe('AI assistants toggle', () => {
    it('dispatches toggleRightPanel when AI Assistants clicked', () => {
      const { store } = renderSidebar();
      const aiBtn = screen.getByTitle('AI Assistants');
      fireEvent.click(aiBtn);
      expect(store.getState().sidebar.rightPanelOpen).toBe(true);
    });
  });
});
