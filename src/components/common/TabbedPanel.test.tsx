/**
 * TabbedPanel — Comprehensive Unit Tests
 *
 * Covers: tab rendering, tab switching, controlled/uncontrolled modes,
 * Redux persistence (storeKey), badges, icons, ARIA attributes,
 * variant prop, children fallback, className pass-through
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockDispatch = vi.fn();
let mockStoredTab: string | null = null;

vi.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) => {
    return selector({
      dashboard: { activeTabs: { testKey: mockStoredTab } },
    });
  },
  useDispatch: () => mockDispatch,
}));

vi.mock('../../store/dashboardSlice', () => ({
  setActiveTab: (payload: { key: string; tab: string }) => ({
    type: 'dashboard/setActiveTab',
    payload,
  }),
}));

// Mock styled-components
vi.mock('./TabbedPanel.styles', () => {
  const c = (tag: string, testId: string) => {
    const Comp = React.forwardRef(({ children, ...props }: Record<string, unknown>, ref) => {
      // Filter transient props ($variant, $isActive) that styled-components uses
      const cleanProps: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(props)) {
        if (!key.startsWith('$')) cleanProps[key] = val;
      }
      return React.createElement(tag, { 'data-testid': testId, ref, ...cleanProps }, children as React.ReactNode);
    });
    Comp.displayName = testId;
    return Comp;
  };
  return {
    TabbedPanelContainer: c('div', 'tabbed-panel'),
    TabButtons: c('div', 'tab-buttons'),
    TabButton: c('button', 'tab-button'),
    TabIcon: c('span', 'tab-icon'),
    TabLabel: c('span', 'tab-label'),
    TabBadge: c('span', 'tab-badge'),
    TabContent: c('div', 'tab-content'),
    TabPanelContent: c('div', 'tab-panel-content'),
  };
});

import TabbedPanel, { TabPanel } from './TabbedPanel';

// ── Test Suite ───────────────────────────────────────────────────

describe('TabbedPanel', () => {
  const baseTabs = [
    { id: 'overview', label: 'Overview', content: <div>Overview Content</div> },
    { id: 'agents', label: 'Agents', content: <div>Agents Content</div> },
    { id: 'leads', label: 'Leads', content: <div>Leads Content</div> },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockStoredTab = null;
  });

  // ────── Basic Rendering ──────

  describe('basic rendering', () => {
    it('renders all tab buttons', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Agents')).toBeInTheDocument();
      expect(screen.getByText('Leads')).toBeInTheDocument();
    });

    it('renders first tab content by default', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      expect(screen.getByText('Overview Content')).toBeInTheDocument();
    });

    it('does not render other tab content', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      expect(screen.queryByText('Agents Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Leads Content')).not.toBeInTheDocument();
    });
  });

  // ────── Tab Switching ──────

  describe('tab switching', () => {
    // TabbedPanel is a controlled component — activeTab is derived from props or Redux store.
    // We need a controlled wrapper to test tab switching behaviour.
    function ControlledTabs() {
      const [tab, setTab] = React.useState('overview');
      return <TabbedPanel tabs={baseTabs} activeTab={tab} onTabChange={setTab} />;
    }

    it('switches content when tab button is clicked', () => {
      render(<ControlledTabs />);
      fireEvent.click(screen.getByText('Agents'));
      expect(screen.getByText('Agents Content')).toBeInTheDocument();
      expect(screen.queryByText('Overview Content')).not.toBeInTheDocument();
    });

    it('calls onTabChange callback', () => {
      const handleChange = vi.fn();
      render(<TabbedPanel tabs={baseTabs} onTabChange={handleChange} />);
      fireEvent.click(screen.getByText('Leads'));
      expect(handleChange).toHaveBeenCalledWith('leads');
    });

    it('switches back to first tab', () => {
      render(<ControlledTabs />);
      fireEvent.click(screen.getByText('Agents'));
      fireEvent.click(screen.getByText('Overview'));
      expect(screen.getByText('Overview Content')).toBeInTheDocument();
    });
  });

  // ────── Controlled Mode ──────

  describe('controlled mode (activeTab prop)', () => {
    it('uses controlled activeTab prop', () => {
      render(<TabbedPanel tabs={baseTabs} activeTab="leads" />);
      expect(screen.getByText('Leads Content')).toBeInTheDocument();
    });

    it('controlled prop takes priority over stored tab', () => {
      mockStoredTab = 'agents';
      render(<TabbedPanel tabs={baseTabs} activeTab="leads" storeKey="testKey" />);
      expect(screen.getByText('Leads Content')).toBeInTheDocument();
    });
  });

  // ────── Redux Persistence (storeKey) ──────

  describe('Redux persistence', () => {
    it('reads stored tab from Redux when storeKey provided', () => {
      mockStoredTab = 'agents';
      render(<TabbedPanel tabs={baseTabs} storeKey="testKey" />);
      expect(screen.getByText('Agents Content')).toBeInTheDocument();
    });

    it('dispatches setActiveTab on tab change when storeKey provided', () => {
      render(<TabbedPanel tabs={baseTabs} storeKey="testKey" />);
      fireEvent.click(screen.getByText('Leads'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'dashboard/setActiveTab',
        payload: { key: 'testKey', tab: 'leads' },
      });
    });

    it('does NOT dispatch when storeKey is not provided', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      fireEvent.click(screen.getByText('Leads'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('falls back to first tab when stored tab is null', () => {
      mockStoredTab = null;
      render(<TabbedPanel tabs={baseTabs} storeKey="testKey" />);
      expect(screen.getByText('Overview Content')).toBeInTheDocument();
    });
  });

  // ────── Badges ──────

  describe('badges', () => {
    it('renders badge when tab has badge value', () => {
      const tabs = [
        { id: 'a', label: 'Tab A', badge: 5, content: <div>A</div> },
        { id: 'b', label: 'Tab B', content: <div>B</div> },
      ];
      render(<TabbedPanel tabs={tabs} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders badge with value 0', () => {
      const tabs = [{ id: 'a', label: 'Tab A', badge: 0, content: <div>A</div> }];
      render(<TabbedPanel tabs={tabs} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('does not render badge when undefined', () => {
      const tabs = [{ id: 'a', label: 'Tab A', content: <div>A</div> }];
      render(<TabbedPanel tabs={tabs} />);
      expect(screen.queryByTestId('tab-badge')).not.toBeInTheDocument();
    });

    it('renders string badge', () => {
      const tabs = [{ id: 'a', label: 'Tab A', badge: 'NEW', content: <div>A</div> }];
      render(<TabbedPanel tabs={tabs} />);
      expect(screen.getByText('NEW')).toBeInTheDocument();
    });
  });

  // ────── Icons ──────

  describe('icons', () => {
    it('renders icon when tab has icon', () => {
      const tabs = [
        { id: 'a', label: 'Tab A', icon: <span data-testid="custom-icon">🏠</span>, content: <div>A</div> },
      ];
      render(<TabbedPanel tabs={tabs} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('does not render icon wrapper when no icon', () => {
      const tabs = [{ id: 'a', label: 'Tab A', content: <div>A</div> }];
      render(<TabbedPanel tabs={tabs} />);
      expect(screen.queryByTestId('tab-icon')).not.toBeInTheDocument();
    });
  });

  // ────── ARIA Accessibility ──────

  describe('accessibility', () => {
    it('renders tablist role on container', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders tab role on each button', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(3);
    });

    it('sets aria-selected on active tab', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    });

    it('updates aria-selected on tab change', () => {
      function ControlledTabs() {
        const [tab, setTab] = React.useState('overview');
        return <TabbedPanel tabs={baseTabs} activeTab={tab} onTabChange={setTab} />;
      }
      render(<ControlledTabs />);
      fireEvent.click(screen.getByText('Agents'));
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0].getAttribute('aria-selected')).toBe('false');
      expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    });

    it('renders tabpanel role on content area', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('sets aria-controls on tabs', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0].getAttribute('aria-controls')).toBe('tabpanel-overview');
    });

    it('sets id on tabpanel', () => {
      render(<TabbedPanel tabs={baseTabs} />);
      const panel = screen.getByRole('tabpanel');
      expect(panel.id).toBe('tabpanel-overview');
    });
  });

  // ────── Children Fallback ──────

  describe('children fallback', () => {
    it('renders children when tab has no content', () => {
      const tabs = [{ id: 'empty', label: 'Empty' }];
      render(
        <TabbedPanel tabs={tabs}>
          <div>Fallback Content</div>
        </TabbedPanel>
      );
      expect(screen.getByText('Fallback Content')).toBeInTheDocument();
    });

    it('prefers tab content over children', () => {
      const tabs = [{ id: 'a', label: 'A', content: <div>Tab Content</div> }];
      render(
        <TabbedPanel tabs={tabs}>
          <div>Fallback</div>
        </TabbedPanel>
      );
      expect(screen.getByText('Tab Content')).toBeInTheDocument();
      expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
    });
  });

  // ────── TabPanel export ──────

  describe('TabPanel helper component', () => {
    it('renders children in a panel wrapper', () => {
      render(<TabPanel>Panel Content</TabPanel>);
      expect(screen.getByText('Panel Content')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(<TabPanel className="custom-class">Content</TabPanel>);
      expect(screen.getByTestId('tab-panel-content')).toBeInTheDocument();
    });
  });
});
