/**
 * UnifiedDashboardPage — Unit Tests
 * Tests: rendering, role-based tabs, tab switching, CRM module selection,
 * Redux data fetching, sidebar toggles, loading/error states, stats
 */

import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useLocation } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  };
});

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('../utils/authFetch', () => ({
  authFetch: vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) }),
}));

vi.mock('../components/common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));

vi.mock('../components/RouteErrorBoundary', () => ({
  default: ({ children, section }: { children: React.ReactNode; section: string }) => (
    <div data-testid={`error-boundary-${section}`}>{children}</div>
  ),
}));

// Mock tab components
vi.mock('../components/owner/tabs/OverviewTab', () => ({
  default: ({ data: _data }: Record<string, unknown>) => (
    <div data-testid="overview-tab">Overview</div>
  ),
}));
vi.mock('../components/owner/tabs/PropertiesTab', () => ({
  default: ({ data: _data }: Record<string, unknown>) => (
    <div data-testid="properties-tab">Properties</div>
  ),
}));
vi.mock('../components/owner/tabs/AgentsTab', () => ({
  default: ({ data: _data }: Record<string, unknown>) => <div data-testid="agents-tab">Agents</div>,
}));
vi.mock('../components/owner/tabs/LeadsTab', () => ({
  default: ({ data: _data }: Record<string, unknown>) => <div data-testid="leads-tab">Leads</div>,
}));
vi.mock('../components/owner/tabs/ContractsTab', () => ({
  default: ({ data: _data }: Record<string, unknown>) => (
    <div data-testid="contracts-tab">Contracts</div>
  ),
}));
vi.mock('../components/owner/tabs/AnalyticsTab', () => ({
  default: ({ data: _data }: Record<string, unknown>) => (
    <div data-testid="analytics-tab">Analytics</div>
  ),
}));
vi.mock('../components/owner/tabs/SettingsTab', () => ({
  default: ({ data: _data }: Record<string, unknown>) => (
    <div data-testid="settings-tab">Settings</div>
  ),
}));
vi.mock('../components/owner/tabs/UsersTab', () => ({
  default: () => <div data-testid="users-tab">Users</div>,
}));
vi.mock('../components/admin/AdminDashboard', () => ({
  default: () => <div data-testid="admin-dashboard">Admin Dashboard</div>,
}));

// Mock lazy-loaded components
vi.mock('../components/crm/AIAssistantHub', () => ({
  default: () => <div data-testid="ai-hub">AI Hub</div>,
}));
vi.mock('../components/crm/AICommandCenter', () => ({
  default: () => <div data-testid="ai-command">AI Command</div>,
}));
vi.mock('../components/crm/AICommandCenter.tsx', () => ({
  default: () => <div data-testid="ai-command">AI Command</div>,
}));
vi.mock('../components/crm/NadiaWhatsAppCRM', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="nadia-crm">Nadia</div>,
}));
vi.mock('../components/crm/MaryInventoryCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="mary-crm">Mary</div>,
}));
vi.mock('../components/crm/ClaraLeadsCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="clara-crm">Clara</div>,
}));
vi.mock('../components/crm/NinaWhatsAppBotCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="nina-crm">Nina</div>,
}));
vi.mock('../components/crm/NancyHRCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="nancy-crm">Nancy</div>,
}));
vi.mock('../components/crm/SophiaSalesCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="sophia-crm">Sophia</div>,
}));
vi.mock('../components/crm/DaisyLeasingCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="daisy-crm">Daisy</div>,
}));
vi.mock('../components/crm/TheodoraFinanceCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="theodora-crm">Theodora</div>,
}));
vi.mock('../components/crm/OliviaMarketingCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="olivia-crm">Olivia</div>,
}));
vi.mock('../components/crm/ZoeExecutiveCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="zoe-crm">Zoe</div>,
}));
vi.mock('../components/crm/LailaComplianceCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="laila-crm">Laila</div>,
}));
vi.mock('../components/crm/AuroraCTODashboard_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="aurora-crm">Aurora</div>,
}));
vi.mock('../components/crm/HazelFrontendCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="hazel-crm">Hazel</div>,
}));
vi.mock('../components/crm/WillowBackendCRM_NEW', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="willow-crm">Willow</div>,
}));
vi.mock('../components/crm/UnifiedCRM', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="unified-crm">UnifiedCRM</div>,
}));
vi.mock('../components/crm/RERAComplianceModule', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="rera-crm">RERA</div>,
}));
vi.mock('../components/crm/DLDIntegrationModule', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="dld-crm">DLD</div>,
}));
vi.mock('../components/crm/LeadScoringModule', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="lead-scoring">Lead Scoring</div>,
}));
vi.mock('../components/crm/PropertyValuationModule', () => ({
  default: (_props: Record<string, unknown>) => <div data-testid="valuation-crm">Valuation</div>,
}));
vi.mock('../components/crm/MarketAnalyticsModule', () => ({
  default: (_props: Record<string, unknown>) => (
    <div data-testid="market-analytics">Market Analytics</div>
  ),
}));

import UnifiedDashboardPage from './UnifiedDashboardPage';
import { CREATOR_SUPERUSER_EMAIL } from '../utils/superUserAccess';
import navigationReducer from '../store/navigationSlice';
import userReducer from '../store/userSlice';
import crmDataReducer from '../store/crmDataSlice';
import sidebarReducer from '../store/slices/sidebarSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = (overrides: Record<string, unknown> = {}) => {
  const baseCrmDataState = crmDataReducer(undefined, { type: '@@INIT' });

  return configureStore({
    reducer: {
      navigation: navigationReducer,
      user: userReducer,
      crmData: crmDataReducer,
      sidebar: sidebarReducer,
    },
    preloadedState: {
      navigation: {
        activeRole: 'owner',
        ...((overrides.navigation as object) || {}),
      } as ReturnType<typeof navigationReducer>,
      user: {
        currentUser: { id: 'u1', name: 'Admin', email: 'admin@wc.ae', role: 'owner' },
        loading: false,
        error: null,
        ...((overrides.user as object) || {}),
      } as unknown as ReturnType<typeof userReducer>,
      crmData: {
        ...baseCrmDataState,
        ...((overrides.crmData as object) || {}),
      } as unknown as ReturnType<typeof crmDataReducer>,
    },
  });
};

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location-search">{location.search}</div>;
};

const renderPage = (tab = 'overview', overrides: Record<string, unknown> = {}, extraQuery = '') => {
  const store = createMockStore(overrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/crm?tab=${tab}${extraQuery}`]}>
          <LocationProbe />
          <UnifiedDashboardPage />
        </MemoryRouter>
      </Provider>
    ),
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('UnifiedDashboardPage', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the dashboard page', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });
    });

    it('should render the dashboard header title for the active role', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Owner Dashboard/i })).toBeInTheDocument();
      });
    });

    it('should render the tab navigation inside the dashboard content area', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getAllByRole('button', { name: 'Overview' }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('button', { name: 'Analytics' }).length).toBeGreaterThan(0);
      });
    });

    it('should render dashboard highlights strip', async () => {
      renderPage();
      await waitFor(() => {
        const highlights = screen.getByLabelText('Dashboard highlights');
        expect(within(highlights).getByText('Properties')).toBeInTheDocument();
        expect(within(highlights).getByText('Agents')).toBeInTheDocument();
        expect(within(highlights).getByText('Leads')).toBeInTheDocument();
      });
    });

    it('should render empty-state guidance when dashboard data is not yet available', async () => {
      renderPage('overview', {
        user: {
          currentUser: {
            id: 'u3',
            name: 'Executive',
            email: 'executive@wc.ae',
            role: 'managing_director',
            phone: '+971500000003',
            photoURL: 'https://example.com/executive.jpg',
          },
        },
        navigation: { activeRole: 'managing_director' },
        crmData: {
          leads: { items: [], selected: null, loading: false, error: null },
          clients: { items: [], selected: null, loading: false, error: null },
          agents: { items: [], selected: null, loading: false, error: null },
          properties: { items: [], selected: null, loading: false, error: null },
          commissions: { items: [], loading: false, error: null },
          activities: { items: [], loading: false, error: null },
          overview: null,
        },
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Dashboard empty state')).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /Open command palette/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Open Unified CRM/i })).toBeInTheDocument();
    });

    it('should render profile completion guidance when profile fields are incomplete', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Complete your profile/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Finish profile setup/i })).toBeInTheDocument();
      });
    });

    it('should navigate to /profile when profile completion CTA is clicked', async () => {
      renderPage();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Finish profile setup/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Finish profile setup/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('should hide profile completion guidance when profile fields are complete', async () => {
      renderPage('overview', {
        user: {
          currentUser: {
            id: 'u1',
            name: 'Admin',
            email: 'admin@wc.ae',
            role: 'owner',
            phone: '+971500000001',
            photoURL: 'https://example.com/avatar.jpg',
          },
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });

      expect(
        screen.queryByRole('heading', { name: /Complete your profile/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Finish profile setup/i })
      ).not.toBeInTheDocument();
    });
  });

  // ── Tab Rendering ────────────────────────────────────────────

  describe('Tab Rendering', () => {
    it('should render OverviewTab by default', async () => {
      renderPage('overview');
      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });
    });

    it('should render PropertiesTab when tab=properties', async () => {
      renderPage('properties');
      await waitFor(() => {
        expect(screen.getByTestId('properties-tab')).toBeInTheDocument();
      });
    });

    it('should render AgentsTab when tab=agents', async () => {
      renderPage('agents');
      await waitFor(() => {
        expect(screen.getByTestId('agents-tab')).toBeInTheDocument();
      });
    });

    it('should render LeadsTab when tab=leads', async () => {
      renderPage('leads');
      await waitFor(() => {
        expect(screen.getByTestId('leads-tab')).toBeInTheDocument();
      });
    });

    it('should render ContractsTab when tab=contracts', async () => {
      renderPage('contracts');
      await waitFor(() => {
        expect(screen.getByTestId('contracts-tab')).toBeInTheDocument();
      });
    });

    it('should render AnalyticsTab when tab=analytics', async () => {
      renderPage('analytics');
      await waitFor(() => {
        expect(screen.getByTestId('analytics-tab')).toBeInTheDocument();
      });
    });

    it('should render SettingsTab when tab=settings', async () => {
      renderPage('settings');
      await waitFor(() => {
        expect(screen.getByTestId('settings-tab')).toBeInTheDocument();
      });
    });

    it('should render UsersTab when tab=users', async () => {
      renderPage('users');
      await waitFor(() => {
        expect(screen.getByTestId('users-tab')).toBeInTheDocument();
      });
    });

    it('should render AdminDashboard when tab=admin', async () => {
      renderPage('admin', { navigation: { activeRole: 'lion' } });
      await waitFor(() => {
        expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
      });
    });

    it('should render AI Command Center when tab is assistant deep-link (linda)', async () => {
      renderPage('linda');
      await waitFor(() => {
        expect(screen.getByTestId('ai-command')).toBeInTheDocument();
      });
    });

    it('should render AI Command Center when tab is assistant deep-link (henry)', async () => {
      renderPage('henry');
      await waitFor(() => {
        expect(screen.getByTestId('ai-command')).toBeInTheDocument();
      });
    });

    it('should preserve existing query params while syncing tab', async () => {
      renderPage('linda', {}, '&assistantMode=iframe');
      await waitFor(() => {
        expect(screen.getByTestId('ai-command')).toBeInTheDocument();
      });

      const search = screen.getByTestId('location-search').textContent || '';
      expect(search).toContain('tab=linda');
      expect(search).toContain('assistantMode=iframe');
    });

    it('should fallback to OverviewTab for unknown tab', async () => {
      renderPage('unknown-tab');
      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });
    });
  });

  // ── Error Boundaries ─────────────────────────────────────────

  describe('Error Boundaries', () => {
    it('should wrap tab content in RouteErrorBoundary', async () => {
      renderPage('overview');
      await waitFor(() => {
        expect(screen.getByTestId('error-boundary-Overview')).toBeInTheDocument();
      });
    });
  });

  // ── Role-Based Rendering ─────────────────────────────────────

  describe('Role-Based', () => {
    it('should render with owner role', async () => {
      renderPage('overview', { navigation: { activeRole: 'owner' } });
      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });
    });

    it('should render with buyer role', async () => {
      renderPage('overview', { navigation: { activeRole: 'buyer' } });
      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });
    });

    it('renders exactly two top-level workspaces for managing director role', async () => {
      renderPage('overview', {
        navigation: { activeRole: 'managing_director' },
        user: {
          currentUser: {
            id: 'u-md',
            name: 'Managing Director',
            email: 'md@wc.ae',
            role: 'managing_director',
          },
        },
      });

      await waitFor(() => {
        expect(
          screen.getByRole('navigation', { name: /Workspace navigation/i })
        ).toBeInTheDocument();
      });

      const workspaceNav = screen.getByRole('navigation', { name: /Workspace navigation/i });
      const workspaceButtons = within(workspaceNav).getAllByRole('button');
      expect(workspaceButtons).toHaveLength(2);
      expect(screen.getByLabelText('Executive controls')).toBeInTheDocument();
      expect(
        within(workspaceNav).getByRole('button', {
          name: /Company Structure & Business Process/i,
        })
      ).toBeInTheDocument();
      expect(
        within(workspaceNav).getByRole('button', { name: /AI Command Center/i })
      ).toBeInTheDocument();
    });

    it('opens AI command center workspace from MD top-level workspace button', async () => {
      renderPage('overview', {
        navigation: { activeRole: 'managing_director' },
        user: {
          currentUser: {
            id: 'u-md',
            name: 'Managing Director',
            email: 'md@wc.ae',
            role: 'managing_director',
          },
        },
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /AI Command Center/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /AI Command Center/i }));

      await waitFor(() => {
        expect(screen.getByTestId('ai-command')).toBeInTheDocument();
      });
    });

    it('shows superuser control strip for owner role', async () => {
      renderPage('overview', {
        navigation: { activeRole: 'owner' },
        user: {
          currentUser: {
            id: 'u1',
            name: 'Founder',
            email: CREATOR_SUPERUSER_EMAIL,
            role: 'owner',
          },
        },
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Superuser controls')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Refresh live data/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Open command palette/i })).toBeInTheDocument();
      });
    });

    it('shows managing director cockpit banner when cockpit=md query is present', async () => {
      renderPage(
        'overview',
        {
          navigation: { activeRole: 'owner' },
          user: {
            currentUser: {
              id: 'u1',
              name: 'Founder',
              email: CREATOR_SUPERUSER_EMAIL,
              role: 'owner',
            },
          },
        },
        '&cockpit=md'
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Managing Director cockpit mode')).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { name: /Executive cockpit engaged/i })
        ).toBeInTheDocument();
      });
    });

    it('navigates to /profile from cockpit banner action', async () => {
      renderPage(
        'overview',
        {
          navigation: { activeRole: 'owner' },
          user: {
            currentUser: {
              id: 'u1',
              name: 'Founder',
              email: CREATOR_SUPERUSER_EMAIL,
              role: 'owner',
            },
          },
        },
        '&cockpit=md'
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Back to profile/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Back to profile/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('hides superuser control strip for buyer role', async () => {
      renderPage('overview', {
        navigation: { activeRole: 'buyer' },
        user: {
          currentUser: { id: 'u2', name: 'Buyer', email: 'buyer@wc.ae', role: 'buyer' },
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      });

      expect(screen.queryByLabelText('Superuser controls')).not.toBeInTheDocument();
    });

    it('removes cockpit query mode for non-superusers', async () => {
      renderPage(
        'overview',
        {
          navigation: { activeRole: 'buyer' },
          user: {
            currentUser: { id: 'u2', name: 'Buyer', email: 'buyer@wc.ae', role: 'buyer' },
          },
        },
        '&cockpit=md'
      );

      await waitFor(() => {
        const search = screen.getByTestId('location-search').textContent || '';
        expect(search).toContain('tab=overview');
        expect(search).not.toContain('cockpit=md');
      });
    });
  });
});
