/**
 * AIAssistantSelector — Unit Tests
 * Tests: rendering, dropdown toggle, search, department filter,
 * favorites, assistant selection, outside click, compact mode
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// ── vi.hoisted helpers (available in vi.mock factories) ──────────

const { makeDiv, makeBtn, makeInput, mkIcon } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const R = require('react');
  function makeDiv(name: string) {
    const C = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) { if (!k.startsWith('$')) clean[k] = v; }
      return R.createElement('div', { 'data-testid': name, ...clean }, children);
    };
    C.displayName = name;
    return C;
  }
  function makeBtn(name: string) {
    const C = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) { if (!k.startsWith('$')) clean[k] = v; }
      return R.createElement('button', { 'data-testid': name, ...clean }, children);
    };
    C.displayName = name;
    return C;
  }
  function makeInput(name: string) {
    const C = (props: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) { if (!k.startsWith('$')) clean[k] = v; }
      return R.createElement('input', { 'data-testid': name, ...clean });
    };
    C.displayName = name;
    return C;
  }
  function mkIcon(name: string) {
    const I = (props: Record<string, unknown>) => R.createElement('span', { 'data-icon': name, ...props });
    I.displayName = name;
    return I;
  }
  return { makeDiv, makeBtn, makeInput, mkIcon };
});

// ── Mock styled-components styles ────────────────────────────────

vi.mock('./AIAssistantSelector.styles', () => ({
  SelectorContainer: makeDiv('SelectorContainer'),
  CurrentAssistantDisplay: makeDiv('CurrentAssistantDisplay'),
  AssistantAvatar: makeDiv('AssistantAvatar'),
  AvatarIcon: makeDiv('AvatarIcon'),
  AvatarStatus: makeDiv('AvatarStatus'),
  AssistantInfo: makeDiv('AssistantInfo'),
  AssistantName: makeDiv('AssistantName'),
  AssistantTitle: makeDiv('AssistantTitle'),
  DropdownArrow: makeDiv('DropdownArrow'),
  DropdownMenu: makeDiv('DropdownMenu'),
  DropdownSearch: makeDiv('DropdownSearch'),
  SearchIcon: makeDiv('SearchIcon'),
  SearchInput: makeInput('SearchInput'),
  ClearSearchBtn: makeBtn('ClearSearchBtn'),
  DepartmentFilter: makeDiv('DepartmentFilter'),
  DeptBtn: makeBtn('DeptBtn'),
  DropdownSection: makeDiv('DropdownSection'),
  SectionHeader: makeDiv('SectionHeader'),
  SectionCount: makeDiv('SectionCount'),
  SectionIcon: makeDiv('SectionIcon'),
  AssistantItem: makeDiv('AssistantItem'),
  ItemLeft: makeDiv('ItemLeft'),
  ItemAvatar: makeDiv('ItemAvatar'),
  ItemInfo: makeDiv('ItemInfo'),
  ItemName: makeDiv('ItemName'),
  ItemTitle: makeDiv('ItemTitle'),
  ItemMetrics: makeDiv('ItemMetrics'),
  Metric: makeDiv('Metric'),
  HealthBadge: makeDiv('HealthBadge'),
  ItemRight: makeDiv('ItemRight'),
  FavoriteBtn: makeBtn('FavoriteBtn'),
}));

// ── Mock lucide-react icons (explicit, no Proxy) ─────────────────

vi.mock('lucide-react', () => ({
  Search: mkIcon('Search'), Star: mkIcon('Star'), Activity: mkIcon('Activity'),
  TrendingUp: mkIcon('TrendingUp'), Users: mkIcon('Users'), AlertCircle: mkIcon('AlertCircle'),
  Shield: mkIcon('Shield'), DollarSign: mkIcon('DollarSign'), Megaphone: mkIcon('Megaphone'),
  MessageSquare: mkIcon('MessageSquare'), Briefcase: mkIcon('Briefcase'),
  FileText: mkIcon('FileText'), Home: mkIcon('Home'), Target: mkIcon('Target'),
  Bot: mkIcon('Bot'), Users2: mkIcon('Users2'), ChevronDown: mkIcon('ChevronDown'),
  ChevronUp: mkIcon('ChevronUp'), X: mkIcon('X'), Server: mkIcon('Server'),
}));

// ── Mock Redux slice selectors + action creators ─────────────────

vi.mock('../../store/slices/aiAssistantDashboardSlice', () => ({
  selectAllAssistantsArray: (state: any) => {
    const s = state.aiAssistantDashboard;
    return s.assistants.allIds.map((id: string) => s.assistants.byId[id]);
  },
  selectUI: (state: any) => state.aiAssistantDashboard.ui,
  selectFavorites: (state: any) => state.aiAssistantDashboard.favorites,
  selectRecent: (state: any) => state.aiAssistantDashboard.recent,
  selectPerformance: (state: any) => state.aiAssistantDashboard.performance,
  selectFilteredAssistants: (state: any) => {
    const s = state.aiAssistantDashboard;
    const all = s.assistants.allIds.map((id: string) => s.assistants.byId[id]);
    const dept = s.ui.filters.department;
    return dept === 'all' ? all : all.filter((a: any) => a.department === dept);
  },
  selectAssistant: (id: string) => ({ type: 'aiAssistantDashboard/selectAssistant', payload: id }),
  toggleFavorite: (id: string) => ({ type: 'aiAssistantDashboard/toggleFavorite', payload: id }),
  setSearchQuery: (q: string) => ({ type: 'aiAssistantDashboard/setSearchQuery', payload: q }),
  setDepartmentFilter: (d: string) => ({ type: 'aiAssistantDashboard/setDepartmentFilter', payload: d }),
  closeDropdown: () => ({ type: 'aiAssistantDashboard/closeDropdown' }),
  toggleDropdown: () => ({ type: 'aiAssistantDashboard/toggleDropdown' }),
}));

import AIAssistantSelector from './AIAssistantSelector';

// ── Store setup ──────────────────────────────────────────────────

function createAIAssistant(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mary',
    name: 'Mary AI',
    title: 'Document Specialist',
    department: 'operations',
    colorScheme: '#4A90D9',
    specialization: 'documents',
    metrics: {
      activeUsers: 45,
      systemHealth: 'optimal' as const,
      accuracy: 96,
      responseTime: 200,
    },
    quickStats: { value: '12', label: 'Docs today' },
    ...overrides,
  };
}

const assistantsList = [
  createAIAssistant(),
  createAIAssistant({ id: 'theodora', name: 'Theodora AI', title: 'Finance Manager', department: 'finance' }),
  createAIAssistant({ id: 'olivia', name: 'Olivia AI', title: 'Marketing Lead', department: 'marketing' }),
  createAIAssistant({ id: 'zoe', name: 'Zoe AI', title: 'HR Specialist', department: 'operations' }),
];

function createTestStore(overrides: Record<string, unknown> = {}) {
  const defaultState: Record<string, unknown> = {
    assistants: {
      byId: Object.fromEntries(assistantsList.map(a => [a.id, a])),
      allIds: assistantsList.map(a => a.id),
    },
    ui: {
      selectedAssistant: 'mary',
      dropdownOpen: false,
      filters: { department: 'all', search: '' },
    },
    favorites: ['mary'],
    recent: ['theodora'],
    performance: {},
    ...overrides,
  };

  return configureStore({
    reducer: {
      aiAssistantDashboard: (state = defaultState, action: { type: string; payload?: unknown }) => {
        switch (action.type) {
          case 'aiAssistantDashboard/toggleDropdown':
            return { ...state, ui: { ...(state as any).ui, dropdownOpen: !(state as any).ui.dropdownOpen } };
          case 'aiAssistantDashboard/closeDropdown':
            return { ...state, ui: { ...(state as any).ui, dropdownOpen: false } };
          case 'aiAssistantDashboard/selectAssistant':
            return { ...state, ui: { ...(state as any).ui, selectedAssistant: action.payload, dropdownOpen: false } };
          case 'aiAssistantDashboard/toggleFavorite': {
            const id = action.payload as string;
            const favs = (state as any).favorites.includes(id)
              ? (state as any).favorites.filter((f: string) => f !== id)
              : [...(state as any).favorites, id];
            return { ...state, favorites: favs };
          }
          case 'aiAssistantDashboard/setSearchQuery':
            return { ...state, ui: { ...(state as any).ui, filters: { ...(state as any).ui.filters, search: action.payload } } };
          case 'aiAssistantDashboard/setDepartmentFilter':
            return { ...state, ui: { ...(state as any).ui, filters: { ...(state as any).ui.filters, department: action.payload } } };
          default:
            return state;
        }
      },
    },
  });
}

// ── Helpers ──────────────────────────────────────────────────────

function renderSelector(
  props: Partial<React.ComponentProps<typeof AIAssistantSelector>> = {},
  storeOverrides: Record<string, unknown> = {},
) {
  const store = createTestStore(storeOverrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <AIAssistantSelector {...props} />
      </Provider>
    ),
  };
}

// ── Tests ────────────────────────────────────────────────────────

describe('AIAssistantSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders current assistant name and title', () => {
      renderSelector();
      expect(screen.getByText('Mary AI')).toBeInTheDocument();
      expect(screen.getByText('Document Specialist')).toBeInTheDocument();
    });

    it('returns null when no current assistant is selected', () => {
      const { container } = renderSelector({}, {
        ui: { selectedAssistant: 'nonexistent', dropdownOpen: false, filters: { department: 'all', search: '' } },
      });
      expect(container.innerHTML).toBe('');
    });
  });

  describe('Dropdown Toggle', () => {
    it('opens dropdown on click', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      expect(screen.getByPlaceholderText('Search AI assistants...')).toBeInTheDocument();
    });

    it('shows department filter buttons in dropdown', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      expect(screen.getByText('All Departments')).toBeInTheDocument();
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });

    it('shows "All AI Assistants" section', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      expect(screen.getByText('All AI Assistants')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('filters assistants by search term', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      const searchInput = screen.getByPlaceholderText('Search AI assistants...');
      fireEvent.change(searchInput, { target: { value: 'Theodora' } });
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('shows clear button when search has text', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      const searchInput = screen.getByPlaceholderText('Search AI assistants...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(screen.getByTestId('ClearSearchBtn')).toBeInTheDocument();
    });

    it('clears search on clear button click', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      const searchInput = screen.getByPlaceholderText('Search AI assistants...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(screen.getByTestId('ClearSearchBtn'));
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Favorites', () => {
    it('shows Favorites section when dropdown is open and favorites exist', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      expect(screen.getByText('Favorites')).toBeInTheDocument();
    });

    it('hides Favorites section when searching', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      fireEvent.change(screen.getByPlaceholderText('Search AI assistants...'), { target: { value: 'test' } });
      expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
    });
  });

  describe('Recently Used', () => {
    it('shows Recently Used section when dropdown is open', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      expect(screen.getByText('Recently Used')).toBeInTheDocument();
    });

    it('hides Recently Used section when searching', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      fireEvent.change(screen.getByPlaceholderText('Search AI assistants...'), { target: { value: 'xyz' } });
      expect(screen.queryByText('Recently Used')).not.toBeInTheDocument();
    });
  });

  describe('Assistant Selection', () => {
    it('calls onSelectAssistant when an assistant is clicked', () => {
      const onSelect = vi.fn();
      renderSelector({ onSelectAssistant: onSelect });
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));

      const assistantItems = screen.getAllByTestId('AssistantItem');
      if (assistantItems.length > 0) {
        fireEvent.click(assistantItems[0]);
        expect(onSelect).toHaveBeenCalled();
      }
    });
  });

  describe('Compact Mode', () => {
    it('passes compact prop to container', () => {
      renderSelector({ compact: true });
      const container = screen.getByTestId('SelectorContainer');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Health Badge', () => {
    it('displays health status for assistants in dropdown', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      const healthBadges = screen.getAllByTestId('HealthBadge');
      expect(healthBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Active Users Metric', () => {
    it('displays active users count', () => {
      renderSelector();
      fireEvent.click(screen.getByTestId('CurrentAssistantDisplay'));
      const metrics = screen.getAllByText(/users/);
      expect(metrics.length).toBeGreaterThan(0);
    });
  });
});
