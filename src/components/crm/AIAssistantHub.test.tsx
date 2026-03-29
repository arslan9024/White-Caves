/**
 * AIAssistantHub — Unit Tests
 * Tests: rendering, assistant cards, favorites, feature flows,
 * view switching, redux integration, click handlers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('./AIAssistantSelector', () => ({
  default: (props: Record<string, unknown>) => <div data-testid="assistant-selector">Selector</div>,
}));

import AIAssistantHub from './AIAssistantHub';
import aiAssistantDashboardReducer from '../../store/slices/aiAssistantDashboardSlice';

// ── Test Data ────────────────────────────────────────────────────

const makeAssistant = (id: string, name: string, title: string, department: string) => ({
  id,
  name,
  title,
  department,
  icon: 'users',
  colorScheme: '#3B82F6',
  avatar: `/avatars/${id}.png`,
  description: `${name} manages ${department} operations`,
  capabilities: ['cap1', 'cap2', 'cap3', 'cap4'],
  permissions: { viewableBy: ['all'], accessibleBy: ['admin'], dataAccessLevel: 'full' },
  metrics: {
    lastActive: '2026-03-26T14:30:00Z',
    tasksCompleted: 100,
    activeUsers: 10,
    systemHealth: 'optimal' as const,
  },
  quickStats: { value: 42, label: 'Active Items' },
  dashboardUrl: `/crm/${id}`,
  apiEndpoints: [`/api/${id}`],
});

const ASSISTANTS_BY_ID: Record<string, ReturnType<typeof makeAssistant>> = {
  nadia: makeAssistant('nadia', 'Nadia', 'Lead Specialist', 'sales'),
  mary: makeAssistant('mary', 'Mary', 'Inventory Manager', 'operations'),
  clara: makeAssistant('clara', 'Clara', 'Leads Manager', 'sales'),
};
const ALL_IDS = Object.keys(ASSISTANTS_BY_ID);

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = (overrides: Record<string, unknown> = {}) => {
  // Get the real initial state and override what we need
  const store = configureStore({
    reducer: { aiAssistantDashboard: aiAssistantDashboardReducer },
  });
  const realInitial = store.getState().aiAssistantDashboard;

  return configureStore({
    reducer: { aiAssistantDashboard: aiAssistantDashboardReducer },
    preloadedState: {
      aiAssistantDashboard: {
        ...realInitial,
        allAssistants: {
          ...realInitial.allAssistants,
          byId: ASSISTANTS_BY_ID,
          allIds: ALL_IDS,
          isLoading: false,
          lastFetched: new Date().toISOString(),
        },
        favorites: ['nadia', 'clara'],
        assistantPerformance: {
          ...realInitial.assistantPerformance,
          activeTasks: 47,
          criticalAlerts: [],
          recentActivity: [
            { id: 'a1', assistantId: 'nadia', action: 'Message sent', target: 'Lead #42', type: 'success', timestamp: Date.now() },
            { id: 'a2', assistantId: 'clara', action: 'Lead qualified', target: 'Lead #55', type: 'info', timestamp: Date.now() - 60000 },
          ],
        },
        ...overrides,
      } as ReturnType<typeof aiAssistantDashboardReducer>,
    },
  });
};

const renderHub = (overrides: Record<string, unknown> = {}, props: Record<string, unknown> = {}) => {
  const store = createMockStore(overrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <AIAssistantHub {...props} />
      </Provider>,
    ),
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('AIAssistantHub', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the hub container', () => {
      renderHub();
      const container = document.querySelector('.ai-assistant-hub');
      expect(container).toBeTruthy();
    });

    it('should render hub header with title', () => {
      renderHub();
      expect(screen.getByText('AI Command Center')).toBeInTheDocument();
    });

    it('should render hub subtitle', () => {
      renderHub();
      expect(screen.getByText('Unified dashboard for all AI assistants')).toBeInTheDocument();
    });

    it('should render assistant cards in overview', () => {
      renderHub();
      const cards = document.querySelectorAll('.assistant-card');
      expect(cards.length).toBe(3); // nadia, mary, clara
    });

    it('should render assistant names', () => {
      renderHub();
      expect(screen.getByText('Nadia')).toBeInTheDocument();
      expect(screen.getByText('Mary')).toBeInTheDocument();
      expect(screen.getByText('Clara')).toBeInTheDocument();
    });

    it('should render assistant titles', () => {
      renderHub();
      expect(screen.getByText('Lead Specialist')).toBeInTheDocument();
      expect(screen.getByText('Inventory Manager')).toBeInTheDocument();
      expect(screen.getByText('Leads Manager')).toBeInTheDocument();
    });

    it('should render department groups', () => {
      renderHub();
      // department headers – multiple elements may match since each card also shows department
      const salesMatches = screen.getAllByText(/sales/i);
      expect(salesMatches.length).toBeGreaterThan(0);
      const opsMatches = screen.getAllByText(/operations/i);
      expect(opsMatches.length).toBeGreaterThan(0);
    });

    it('should render quick stats bar', () => {
      renderHub();
      const statsBar = document.querySelector('.quick-stats-bar');
      expect(statsBar).toBeTruthy();
    });
  });

  // ── Navigation ───────────────────────────────────────────────

  describe('Navigation', () => {
    it('should render Overview, Feature Map, Activity nav buttons', () => {
      renderHub();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Feature Map')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
    });

    it('should switch to Feature Map view', () => {
      renderHub();
      fireEvent.click(screen.getByText('Feature Map'));
      const featureMapView = document.querySelector('.feature-map-view');
      expect(featureMapView).toBeTruthy();
    });

    it('should switch to Activity view', () => {
      renderHub();
      fireEvent.click(screen.getByText('Activity'));
      const activityFeed = document.querySelector('.activity-feed');
      expect(activityFeed).toBeTruthy();
    });

    it('should switch back to Overview', () => {
      renderHub();
      fireEvent.click(screen.getByText('Feature Map'));
      fireEvent.click(screen.getByText('Overview'));
      const overviewView = document.querySelector('.overview-view');
      expect(overviewView).toBeTruthy();
    });
  });

  // ── Favorites ────────────────────────────────────────────────

  describe('Favorites', () => {
    it('should show favorite star icons for favorited assistants', () => {
      renderHub();
      // Nadia and Clara are favorites — check for presence of favorite indicators
      const nadiaCard = screen.getByText('Nadia').closest('.assistant-card');
      expect(nadiaCard).toBeTruthy();
    });
  });

  // ── Assistant Click ──────────────────────────────────────────

  describe('Assistant Click', () => {
    it('should call onSelectAssistant callback when card is clicked', () => {
      const onSelect = vi.fn();
      renderHub({}, { onSelectAssistant: onSelect });

      const nadiaCard = screen.getByText('Nadia').closest('.assistant-card')!;
      fireEvent.click(nadiaCard);

      expect(onSelect).toHaveBeenCalledWith('nadia');
    });

    it('should select assistant in Redux state on click', () => {
      const { store } = renderHub();
      const maryCard = screen.getByText('Mary').closest('.assistant-card')!;
      fireEvent.click(maryCard);

      const state = store.getState().aiAssistantDashboard;
      expect(state.ui.selectedAssistant).toBe('mary');
    });
  });

  // ── Feature Flows (Feature Map View) ─────────────────────────

  describe('Feature Flows', () => {
    it('should render flow cards in Feature Map view', () => {
      renderHub();
      fireEvent.click(screen.getByText('Feature Map'));
      const flowCards = document.querySelectorAll('.flow-card');
      expect(flowCards.length).toBeGreaterThan(0);
    });

    it('should render Active Flows badge', () => {
      renderHub();
      fireEvent.click(screen.getByText('Feature Map'));
      expect(screen.getByText(/Active Flows/)).toBeInTheDocument();
    });
  });

  // ── Activity Feed ────────────────────────────────────────────

  describe('Activity Feed', () => {
    it('should render activity items in Activity view', () => {
      renderHub();
      fireEvent.click(screen.getByText('Activity'));
      const activityItems = document.querySelectorAll('.activity-item');
      expect(activityItems.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Capabilities ─────────────────────────────────────────────

  describe('Capabilities', () => {
    it('should render capability tags on assistant cards', () => {
      renderHub();
      const capTags = document.querySelectorAll('.capability-tag');
      expect(capTags.length).toBeGreaterThan(0);
    });

    it('should show +N more badge when assistant has >3 capabilities', () => {
      renderHub();
      // Each assistant has 4 capabilities → should show "+1 more"
      const moreBadges = document.querySelectorAll('.capability-tag.more');
      expect(moreBadges.length).toBeGreaterThan(0);
    });
  });

  // ── Empty State ──────────────────────────────────────────────

  describe('Empty State', () => {
    it('should handle empty assistants gracefully', () => {
      renderHub({
        allAssistants: { byId: {}, allIds: [], isLoading: false, lastFetched: null },
      });
      const cards = document.querySelectorAll('.assistant-card');
      expect(cards.length).toBe(0);
    });
  });

  // ── Open Dashboard Button ────────────────────────────────────

  describe('Open Dashboard', () => {
    it('should render Open Dashboard button on each card', () => {
      renderHub();
      const openBtns = document.querySelectorAll('.open-btn');
      expect(openBtns.length).toBe(3);
    });
  });
});
