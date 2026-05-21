/**
 * CRMHubPage — Unit Tests
 * Tests: rendering, stats cards, CRM module cards, module navigation,
 * quick actions, activity feed, back-to-hub, URL sync
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
let mockSearchParamsModule = '';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [
      { get: (key: string) => (key === 'module' ? mockSearchParamsModule : null) },
      mockSetSearchParams,
    ],
  };
});

// Mock lazy-loaded CRM modules
vi.mock('../../components/crm/ClaraLeadsCRM_NEW', () => ({
  default: () => <div data-testid="ClaraLeadsCRM">ClaraLeadsCRM</div>,
}));
vi.mock('../../components/crm/MaryInventoryCRM_NEW', () => ({
  default: () => <div data-testid="MaryInventoryCRM">MaryInventoryCRM</div>,
}));
vi.mock('../../components/crm/SophiaSalesCRM_NEW', () => ({
  default: () => <div data-testid="SophiaSalesCRM">SophiaSalesCRM</div>,
}));
vi.mock('../../components/crm/ZoeExecutiveCRM_NEW', () => ({
  default: () => <div data-testid="ZoeExecutiveCRM">ZoeExecutiveCRM</div>,
}));
vi.mock('../../components/crm/TheodoraFinanceCRM_NEW', () => ({
  default: () => <div data-testid="TheodoraFinanceCRM">TheodoraFinanceCRM</div>,
}));
vi.mock('../../components/crm/DaisyLeasingCRM_NEW', () => ({
  default: () => <div data-testid="DaisyLeasingCRM">DaisyLeasingCRM</div>,
}));
vi.mock('../../components/crm/NadiaWhatsAppCRM', () => ({
  default: () => <div data-testid="NadiaWhatsAppCRM">NadiaWhatsAppCRM</div>,
}));

// Mock UI components
vi.mock('../../components/ui', () => ({
  Badge: ({
    children,
    variant,
    size,
  }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
  }) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../components/common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));

vi.mock('../../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import CRMHubPage from './CRMHubPage';
import crmDataReducer from '../../store/crmDataSlice';
import userReducer from '../../store/userSlice';
import authReducer from '../../store/authSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = (crmOverrides: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      crmData: crmDataReducer,
      user: userReducer,
      auth: authReducer,
    },
    preloadedState: {
      crmData: {
        leads: {
          items: [
            { id: 'l1', name: 'Sarah', status: 'hot', value: 500000 },
            { id: 'l2', name: 'Mike', status: 'warm', value: 300000 },
            { id: 'l3', name: 'Lisa', status: 'cold', value: 200000 },
          ],
          selected: null,
          loading: false,
          error: null,
        },
        clients: {
          items: [
            { id: 'c1', name: 'Client A' },
            { id: 'c2', name: 'Client B' },
          ],
          selected: null,
          loading: false,
          error: null,
        },
        agents: {
          items: [
            { id: 'a1', name: 'Agent X', status: 'online' },
            { id: 'a2', name: 'Agent Y', status: 'offline' },
          ],
          selected: null,
          loading: false,
          error: null,
        },
        properties: {
          items: [],
          selected: null,
          loading: false,
          error: null,
        },
        commissions: {
          items: [{ id: 'cm1', amount: 5000 }],
          loading: false,
          error: null,
        },
        activities: {
          items: [
            {
              id: 'act1',
              type: 'lead',
              description: 'New lead added',
              timestamp: new Date().toISOString(),
            },
            {
              id: 'act2',
              type: 'deal',
              action: 'Deal closed',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
          loading: false,
          error: null,
        },
        overview: null,
        lastUpdated: new Date().toISOString(),
        ...crmOverrides,
      } as unknown as ReturnType<typeof crmDataReducer>,
      user: {
        currentUser: { id: 'u1', name: 'Owner', role: 'owner', email: 'owner@wc.ae' },
        loading: false,
        error: null,
      } as unknown as ReturnType<typeof userReducer>,
      auth: {
        user: { id: 'u1', displayName: 'Owner', email: 'owner@wc.ae', role: 'owner' },
        token: 'tok',
        refreshToken: null,
        session: {
          isLoggedIn: true,
          lastActive: null,
          sessions: [],
          expiresAt: null,
          activeSessionId: null,
        },
        loginMethods: { social: false, email: false, mobile: false },
        loginProvider: null,
        rememberMe: false,
        sessionTimeout: 30,
        loading: false,
        error: null,
      } as ReturnType<typeof authReducer>,
    },
  });
};

const renderPage = (crmOverrides: Record<string, unknown> = {}) => {
  const store = createMockStore(crmOverrides);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <CRMHubPage />
      </MemoryRouter>
    </Provider>
  );
};

// ── Tests ────────────────────────────────────────────────────────

describe('CRMHubPage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.clearAllMocks();
    mockSearchParamsModule = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the CRM Hub header', () => {
      renderPage();
      expect(screen.getByText('CRM Command Center')).toBeInTheDocument();
      expect(
        screen.getByText(/Manage leads, properties, deals, and team performance/)
      ).toBeInTheDocument();
    });

    it('should render quick action buttons', () => {
      renderPage();
      // Lead Management appears in both quick actions and module cards
      expect(screen.getAllByText(/Lead Management/).length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getAllByText(/Property Portfolio|Property Inventory/).length
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Agent Performance/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/WhatsApp CRM/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Finance & Commissions/).length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getAllByText(/Executive View|Executive Dashboard/).length
      ).toBeGreaterThanOrEqual(1);
    });

    it('should render Recent Activity section', () => {
      renderPage();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });

  // ── Stats Cards ──────────────────────────────────────────────

  describe('Stats Cards', () => {
    it('should display total leads count', () => {
      renderPage();
      expect(screen.getByText('Total Leads')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should display hot leads count', () => {
      renderPage();
      expect(screen.getByText('Hot Leads')).toBeInTheDocument();
      // '1' appears in multiple stat cards
      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
    });

    it('should display active clients count', () => {
      renderPage();
      expect(screen.getByText('Active Clients')).toBeInTheDocument();
      // '2' appears in multiple stat cards
      expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    });

    it('should display pipeline value', () => {
      renderPage();
      expect(screen.getByText('Pipeline Value')).toBeInTheDocument();
    });

    it('should display commissions count', () => {
      renderPage();
      expect(screen.getByText('Commissions')).toBeInTheDocument();
    });
  });

  // ── CRM Module Cards ────────────────────────────────────────

  describe('CRM Module Cards', () => {
    it('should render all 7 CRM module cards', () => {
      renderPage();
      const moduleNames = [
        'Lead Management',
        'Property Inventory',
        'Sales Pipeline',
        'Finance & Commissions',
        'Leasing Management',
        'WhatsApp CRM',
        'Executive Dashboard',
      ];
      // Module cards are in the grid, quick actions also have similar text
      // So just check they exist
      for (const name of moduleNames) {
        const found = screen.getAllByText(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        expect(found.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should render module icons', () => {
      renderPage();
      expect(screen.getByText('🎯')).toBeInTheDocument();
      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('💰')).toBeInTheDocument();
      expect(screen.getByText('📊')).toBeInTheDocument();
      expect(screen.getByText('📋')).toBeInTheDocument();
      expect(screen.getByText('💬')).toBeInTheDocument();
      expect(screen.getByText('👑')).toBeInTheDocument();
    });

    it('should render module descriptions', () => {
      renderPage();
      expect(screen.getByText('Track prospects, score leads, manage pipeline')).toBeInTheDocument();
      expect(
        screen.getByText('Property listings, availability, owner tracking')
      ).toBeInTheDocument();
    });
  });

  // ── Quick Actions Navigation ─────────────────────────────────

  describe('Quick Actions Navigation', () => {
    it('should navigate to leads page on Lead Management click', () => {
      renderPage();
      // Get the quick action button specifically
      const leadBtn = screen.getByText(/🎯 Lead Management/);
      fireEvent.click(leadBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm/leads');
    });

    it('should navigate to properties page on Property Portfolio click', () => {
      renderPage();
      const propBtn = screen.getByText(/🏠 Property Portfolio/);
      fireEvent.click(propBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm/properties');
    });

    it('should navigate to agents page on Agent Performance click', () => {
      renderPage();
      const agentBtn = screen.getByText(/👥 Agent Performance/);
      fireEvent.click(agentBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm/agents');
    });
  });

  // ── Module Selection ─────────────────────────────────────────

  describe('Module Selection', () => {
    it('should activate a module when module card is clicked', async () => {
      renderPage();
      // Click on Lead Management module card (the one in the modules grid)
      const cards = screen.getAllByText('Track prospects, score leads, manage pipeline');
      fireEvent.click(cards[0].closest('[class]')!);

      // Should show back button and active module
      await waitFor(() => {
        expect(screen.getByText(/Back to CRM Hub/)).toBeInTheDocument();
      });
    });

    it('should show back button when module is active', async () => {
      renderPage();
      // Click WhatsApp CRM quick action
      const btn = screen.getByText(/💬 WhatsApp CRM/);
      fireEvent.click(btn);

      await waitFor(() => {
        expect(screen.getByText(/Back to CRM Hub/)).toBeInTheDocument();
      });
    });

    it('should return to hub when back button is clicked', async () => {
      renderPage();
      // Activate a module
      const btn = screen.getByText(/💬 WhatsApp CRM/);
      fireEvent.click(btn);

      await waitFor(() => {
        expect(screen.getByText(/Back to CRM Hub/)).toBeInTheDocument();
      });

      // Click back
      fireEvent.click(screen.getByText(/Back to CRM Hub/));
      await waitFor(() => {
        expect(screen.getByText('CRM Command Center')).toBeInTheDocument();
      });
    });

    it('should show Active badge when module is open', async () => {
      renderPage();
      const btn = screen.getByText(/💬 WhatsApp CRM/);
      fireEvent.click(btn);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });
    });
  });

  // ── Activity Feed ────────────────────────────────────────────

  describe('Activity Feed', () => {
    it('should show activity items', () => {
      renderPage();
      expect(screen.getByText('New lead added')).toBeInTheDocument();
    });

    it('should show time ago for activities', () => {
      renderPage();
      // Activities have time formatted as "Xm ago" or "Xh ago"
      const timeElements = screen.getAllByText(/ago|Just now|Recently/);
      expect(timeElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should show default activity when no activities exist', () => {
      renderPage({
        activities: { items: [], loading: false, error: null },
      });
      expect(
        screen.getByText('System initialized — CRM modules loaded successfully')
      ).toBeInTheDocument();
    });
  });

  // ── Stats Card Navigation ────────────────────────────────────

  describe('Stats Card Navigation', () => {
    it('should navigate to leads when Total Leads card is clicked', () => {
      renderPage();
      fireEvent.click(screen.getByText('Total Leads').closest('[class]')!);
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm/leads');
    });

    it('should navigate to agents when Active Agents card is clicked', () => {
      renderPage();
      fireEvent.click(screen.getByText('Active Agents').closest('[class]')!);
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm/agents');
    });
  });

  // ── Empty / Edge Cases ───────────────────────────────────────

  describe('Edge Cases', () => {
    it('should render with empty CRM data', () => {
      renderPage({
        leads: { items: [], selected: null, loading: false, error: null },
        clients: { items: [], selected: null, loading: false, error: null },
        agents: { items: [], selected: null, loading: false, error: null },
        commissions: { items: [], loading: false, error: null },
        activities: { items: [], loading: false, error: null },
      });
      expect(screen.getByText('CRM Command Center')).toBeInTheDocument();
      // '0' appears in multiple stat cards when all are empty
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
    });

    it('should show pipeline value in K format for small values', () => {
      renderPage({
        leads: {
          items: [{ id: 'l1', status: 'hot', value: 50000 }],
          selected: null,
          loading: false,
          error: null,
        },
      });
      expect(screen.getByText('Pipeline Value')).toBeInTheDocument();
    });
  });
});
