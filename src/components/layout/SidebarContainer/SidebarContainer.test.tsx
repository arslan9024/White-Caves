/**
 * SidebarContainer – Unit Tests (Redux-driven icon rail + flyout)
 * Tests: rendering, department navigation, flyout, admin visibility, tooltips,
 *        collapsible groups, badge counts, localStorage persistence
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from '../../../store/slices/sidebarSlice';

// ── localStorage Mock ────────────────────────────────────────
let _lsStore: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn((key: string): string | null => _lsStore[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    _lsStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete _lsStore[key];
  }),
  clear: vi.fn(() => {
    _lsStore = {};
  }),
  get length() {
    return Object.keys(_lsStore).length;
  },
  key: vi.fn((i: number): string | null => Object.keys(_lsStore)[i] ?? null),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

// Minimal auth reducer
const authReducer = (state = { user: { role: 'user' } }, action: any) => {
  if (action.type === 'SET_ROLE') return { user: { role: action.payload } };
  return state;
};

// Minimal crmData reducer (supports badge selectors)
const crmDataReducer = (
  state: any = {
    leads: { items: [], loading: false, error: null, selected: null },
    properties: { items: [], loading: false, error: null, selected: null },
    clients: { items: [], loading: false, error: null, selected: null },
    agents: { items: [], loading: false, error: null, selected: null },
    commissions: { items: [], loading: false, error: null, selected: null },
    activities: { items: [], loading: false, error: null },
    overview: null,
    lastUpdated: null,
  },
  action: any
) => {
  if (action.type === 'SET_HOT_LEADS') {
    return { ...state, leads: { ...state.leads, items: action.payload } };
  }
  if (action.type === 'SET_PROPERTIES') {
    return { ...state, properties: { ...state.properties, items: action.payload } };
  }
  return state;
};

// Minimal nadia reducer
const nadiaReducer = (
  state: any = {
    queue: [],
    connectionStatus: 'disconnected',
    conversations: [],
    stats: null,
    isLoading: false,
    error: null,
    selectedConversation: null,
    settings: {},
    syncStatus: { lastSync: null, inProgress: false, error: null },
  },
  action: any
) => {
  if (action.type === 'SET_QUEUE') return { ...state, queue: action.payload };
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
    KeySquare: stub('KeySquare'),
    Bot: stub('Bot'),
    Shield: stub('Shield'),
    ChevronLeft: stub('ChevronLeft'),
    ChevronDown: stub('ChevronDown'),
    Search: stub('Search'),
  };
});

// Mock assistantRegistry
vi.mock('../../../config/assistantRegistry', () => ({
  getAllAssistants: () => [
    {
      id: 'hazel',
      name: 'Hazel',
      title: 'CRM Assistant',
      department: 'operations',
      color: '#3B82F6',
      avatar: 'H',
    },
    {
      id: 'clara',
      name: 'Clara',
      title: 'Communications',
      department: 'communications',
      color: '#8B5CF6',
      avatar: 'C',
    },
  ],
  DEPARTMENTS: {
    operations: {
      id: 'operations',
      label: 'Operations',
      color: '#3B82F6',
      gradient: '',
      icon: 'building',
    },
    communications: {
      id: 'communications',
      label: 'Communications',
      color: '#8B5CF6',
      gradient: '',
      icon: 'message',
    },
  },
}));

// Mock styled-components with simple divs
vi.mock('./styles', () => {
  const stub = (name: string, tag = 'div') => {
    const C = ({ children, onClick, title, ...rest }: any) => {
      // Filter out styled-component transient props ($active, $color, etc.)
      const filtered: any = {};
      for (const [k, v] of Object.entries(rest)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement(
        tag,
        { 'data-testid': name, onClick, title, ...filtered },
        children
      );
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
    RailGroupHeader: stub('RailGroupHeader', 'button'),
    RailGroupContent: stub('RailGroupContent'),
    RailBadge: stub('RailBadge'),
    FlyoutPanel: stub('FlyoutPanel'),
    FlyoutHeader: stub('FlyoutHeader'),
    FlyoutTitle: stub('FlyoutTitle'),
    FlyoutClose: stub('FlyoutClose', 'button'),
    FlyoutNav: stub('FlyoutNav'),
    FlyoutItem: stub('FlyoutItem', 'button'),
    FlyoutDot: stub('FlyoutDot'),
    FlyoutBackdrop: stub('FlyoutBackdrop'),
    AISearchBar: stub('AISearchBar'),
    AISearchInput: stub('AISearchInput'),
    AIGroupHeader: stub('AIGroupHeader', 'button'),
    AIAssistantBtn: stub('AIAssistantBtn', 'button'),
    AIAvatar: stub('AIAvatar'),
    AIAssistantName: stub('AIAssistantName'),
    AIAssistantDesc: stub('AIAssistantDesc'),
    AIAssistantInfo: stub('AIAssistantInfo'),
    AIFooter: stub('AIFooter'),
  };
});

import SidebarContainer from './SidebarContainer';

// ── Helpers ──────────────────────────────────────────────────────

function makeStore(
  overrides: Record<string, unknown> = {},
  role = 'user',
  crmOverrides: any = {},
  nadiaOverrides: any = {}
) {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      auth: authReducer,
      crmData: crmDataReducer,
      nadia: nadiaReducer,
    },
    preloadedState: {
      sidebar: {
        flyoutOpen: false,
        flyoutDepartment: null,
        aiCommandOpen: false,
        aiAssistantSearch: '',
        aiAssistantFilter: 'all' as const,
        selectedAssistant: null,
        selectedDepartment: null,
        selectedService: null,
        commandPaletteOpen: false,
        mobileSheetOpen: false,
        ...overrides,
      } as ReturnType<typeof sidebarReducer>,
      auth: { user: { role } } as any,
      crmData: {
        leads: { items: [], loading: false, error: null, selected: null, ...crmOverrides.leads },
        properties: {
          items: [],
          loading: false,
          error: null,
          selected: null,
          ...crmOverrides.properties,
        },
        clients: { items: [], loading: false, error: null, selected: null },
        agents: { items: [], loading: false, error: null, selected: null },
        commissions: { items: [], loading: false, error: null, selected: null },
        activities: { items: [], loading: false, error: null },
        overview: null,
        lastUpdated: null,
      } as any,
      nadia: {
        queue: nadiaOverrides.queue || [],
        connectionStatus: 'disconnected',
        conversations: [],
        stats: null,
        isLoading: false,
        error: null,
        selectedConversation: null,
        settings: {},
        syncStatus: { lastSync: null, inProgress: false, error: null },
      } as any,
    },
  });
}

function renderSidebar(
  overrides: Record<string, unknown> = {},
  role = 'user',
  crmOverrides: any = {},
  nadiaOverrides: any = {}
) {
  const store = makeStore(overrides, role, crmOverrides, nadiaOverrides);
  const utils = render(
    <Provider store={store}>
      <SidebarContainer />
    </Provider>
  );
  return { store, ...utils };
}

// ── Tests ────────────────────────────────────────────────────────

describe('SidebarContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _lsStore = {};
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

    it('renders AI Command Center button', () => {
      renderSidebar();
      expect(screen.getByText('AI Command Center')).toBeInTheDocument();
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

  describe('AI Command Center toggle', () => {
    it('dispatches toggleAICommand when AI Command Center clicked', () => {
      const { store } = renderSidebar();
      const aiBtn = screen.getByTitle('AI Command Center');
      fireEvent.click(aiBtn);
      expect(store.getState().sidebar.aiCommandOpen).toBe(true);
    });
  });

  // ── Collapsible Groups ───────────────────────────────────

  describe('collapsible groups', () => {
    it('renders Company group header', () => {
      renderSidebar();
      expect(screen.getByLabelText('Toggle Company departments')).toBeInTheDocument();
    });

    it('renders AI group header', () => {
      renderSidebar();
      expect(screen.getByLabelText('Toggle AI Command Center')).toBeInTheDocument();
    });

    it('renders RailGroupContent wrappers', () => {
      renderSidebar();
      expect(screen.getAllByTestId('RailGroupContent').length).toBe(2);
    });

    it('toggles Company group collapse on header click', () => {
      renderSidebar();
      const header = screen.getByLabelText('Toggle Company departments');
      // Initially expanded — departments should be visible
      expect(screen.getByText('Operations')).toBeInTheDocument();
      // Click to collapse
      fireEvent.click(header);
      // localStorage should be updated
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'wc-sidebar-collapse',
        expect.stringContaining('"company":true')
      );
    });

    it('toggles AI group collapse on header click', () => {
      renderSidebar();
      const header = screen.getByLabelText('Toggle AI Command Center');
      fireEvent.click(header);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'wc-sidebar-collapse',
        expect.stringContaining('"ai":true')
      );
    });

    it('reads collapse state from localStorage on mount', () => {
      _lsStore['wc-sidebar-collapse'] = JSON.stringify({ company: true });
      renderSidebar();
      // localStorage.getItem should have been called
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('wc-sidebar-collapse');
    });
  });

  // ── Badge Counts ─────────────────────────────────────────

  describe('badge counts', () => {
    it('shows no badges when all counts are 0', () => {
      renderSidebar();
      expect(screen.queryAllByTestId('RailBadge')).toHaveLength(0);
    });

    it('shows badge on Sales when hot leads exist', () => {
      renderSidebar({}, 'user', {
        leads: {
          items: [
            { id: '1', name: 'A', status: 'hot' },
            { id: '2', name: 'B', status: 'hot' },
            { id: '3', name: 'C', status: 'warm' },
          ],
        },
      });
      const badges = screen.getAllByTestId('RailBadge');
      expect(badges.length).toBeGreaterThanOrEqual(1);
      // Hot leads = 2
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('shows badge on Operations when properties exist', () => {
      renderSidebar({}, 'user', {
        properties: {
          items: [
            { id: '1', title: 'P1', status: 'available' },
            { id: '2', title: 'P2', status: 'available' },
            { id: '3', title: 'P3', status: 'sold' },
          ],
        },
      });
      const badges = screen.getAllByTestId('RailBadge');
      expect(badges.length).toBeGreaterThanOrEqual(1);
      // All 3 properties shown (selectAllProperties returns all)
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows badge on Communications when queued messages exist', () => {
      renderSidebar(
        {},
        'user',
        {},
        {
          queue: [
            { id: '1', contact: 'A', message: 'hi' },
            { id: '2', contact: 'B', message: 'hello' },
            { id: '3', contact: 'C', message: 'hey' },
            { id: '4', contact: 'D', message: 'yo' },
            { id: '5', contact: 'E', message: 'sup' },
          ],
        }
      );
      const badges = screen.getAllByTestId('RailBadge');
      expect(badges.length).toBeGreaterThanOrEqual(1);
      // 5 queued
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows 99+ for counts over 99', () => {
      const bigLeads = Array.from({ length: 120 }, (_, i) => ({
        id: String(i),
        name: `Lead ${i}`,
        status: 'hot',
      }));
      renderSidebar({}, 'user', { leads: { items: bigLeads } });
      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });
});
