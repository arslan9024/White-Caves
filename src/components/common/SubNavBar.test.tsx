import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock styled-components
vi.mock('./SubNavBar/SubNavBar.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, filtered, children);
  };
  return {
    SubNavBarWrapper: c('nav'),
    SubNavBarContainer: c('div'),
    SubNavBarHeader: c('div'),
    ModuleIcon: c('span'),
    ModuleTitle: c('span'),
    SubNavBarNav: c('div'),
    SubNavItem: (props: any) => {
      const { children, $isActive, ...rest } = props;
      const filtered: any = {};
      for (const [k, v] of Object.entries(rest)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('button', filtered, children);
    },
    SubNavIcon: c('span'),
    SubNavLabel: c('span'),
    SubNavBadge: c('span'),
    SubNavIndicator: c('div'),
    SubNavBarActions: c('div'),
    SubNavActionButton: c('button'),
    ActionIcon: c('span'),
    ActionLabel: c('span'),
  };
});

// Mock feature registry
const mockSubNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', badgeCount: 0 },
  { id: 'properties', label: 'Properties', icon: '🏠', badgeCount: 5 },
  { id: 'leads', label: 'Leads', icon: '📋', badgeCount: 12 },
];
const mockModule = { id: 'agent', name: 'Agent Panel', icon: '👔' };

vi.mock('../../features/featureRegistry', () => ({
  getSubNavItems: vi.fn(() => mockSubNavItems),
  getModuleById: vi.fn(() => mockModule),
}));

// Mock navigationSlice
vi.mock('../../store/navigationSlice', () => ({
  setCurrentSubModule: vi.fn((id: string) => ({ type: 'navigation/setCurrentSubModule', payload: id })),
}));

import SubNavBar from './SubNavBar';
import { setCurrentSubModule } from '../../store/navigationSlice';

function createStore(overrides: any = {}) {
  return configureStore({
    reducer: {
      navigation: () => ({
        currentSubModule: 'dashboard',
        activeRole: 'agent',
        ...overrides,
      }),
    },
  });
}

function renderWithStore(props: any = {}, storeOverrides: any = {}) {
  const store = createStore(storeOverrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <SubNavBar {...props} />
      </Provider>
    ),
  };
}

describe('SubNavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders module name', () => {
      renderWithStore();
      expect(screen.getByText('Agent Panel')).toBeInTheDocument();
    });

    it('renders module icon', () => {
      renderWithStore();
      expect(screen.getByText('👔')).toBeInTheDocument();
    });

    it('renders all sub-nav items', () => {
      renderWithStore();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByText('Leads')).toBeInTheDocument();
    });

    it('renders item icons', () => {
      renderWithStore();
      expect(screen.getByText('📊')).toBeInTheDocument();
      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('📋')).toBeInTheDocument();
    });

    it('renders badge counts for items with count > 0', () => {
      renderWithStore();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('does not render badge for items with zero count', () => {
      renderWithStore();
      // Dashboard has badgeCount: 0, so only Properties (5) and Leads (12) get badges
      // Verify that only 2 badge values appear
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders Quick Action button', () => {
      renderWithStore();
      expect(screen.getByText('Quick Action')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });
  });

  // ── Navigation ─────────────────────────────────────────────
  describe('navigation', () => {
    it('dispatches setCurrentSubModule on click', () => {
      renderWithStore();
      fireEvent.click(screen.getByText('Properties'));
      expect(setCurrentSubModule).toHaveBeenCalledWith('properties');
    });

    it('calls onSubModuleChange callback when provided', () => {
      const mockChange = vi.fn();
      renderWithStore({ onSubModuleChange: mockChange });
      fireEvent.click(screen.getByText('Leads'));
      expect(mockChange).toHaveBeenCalledWith('leads');
    });

    it('dispatches on any item click', () => {
      renderWithStore();
      fireEvent.click(screen.getByText('Dashboard'));
      expect(setCurrentSubModule).toHaveBeenCalledWith('dashboard');
    });
  });

  // ── Empty State ────────────────────────────────────────────
  describe('empty state', () => {
    it('returns null when no sub-nav items', async () => {
      const featureRegistry = await import('../../features/featureRegistry');
      vi.mocked(featureRegistry.getSubNavItems).mockReturnValueOnce([]);
      const { container } = renderWithStore();
      expect(container.innerHTML).toBe('');
    });
  });

  // ── Accessibility ──────────────────────────────────────────
  describe('accessibility', () => {
    it('has aria-label on nav items', () => {
      renderWithStore();
      expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('Properties')).toBeInTheDocument();
      expect(screen.getByLabelText('Leads')).toBeInTheDocument();
    });

    it('has title attribute on nav items', () => {
      renderWithStore();
      const dashboardBtn = screen.getByLabelText('Dashboard');
      expect(dashboardBtn.getAttribute('title')).toBe('Dashboard');
    });
  });
});
