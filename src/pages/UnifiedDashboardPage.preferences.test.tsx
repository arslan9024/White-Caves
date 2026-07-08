import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockUseUnifiedDashboard = vi.fn();
const mockUseSelector = vi.fn(() => null);

const mockFetchDashboardPreferences = vi.fn();
const mockSaveDashboardPreferences = vi.fn();
const mockFetchRoleDashboardConfig = vi.fn();
const { mockPageLogger } = vi.hoisted(() => ({
  mockPageLogger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-redux', () => ({
  useSelector: (...args: unknown[]) => mockUseSelector(...args),
}));

vi.mock('../hooks/useUnifiedDashboard', () => ({
  useUnifiedDashboard: (...args: unknown[]) => mockUseUnifiedDashboard(...args),
}));

vi.mock('../services/dashboardPreferencesAPI', () => ({
  fetchDashboardPreferences: (...args: unknown[]) => mockFetchDashboardPreferences(...args),
  saveDashboardPreferences: (...args: unknown[]) => mockSaveDashboardPreferences(...args),
  fetchRoleDashboardConfig: (...args: unknown[]) => mockFetchRoleDashboardConfig(...args),
}));

vi.mock('../utils/logger', () => ({
  createLogger: () => mockPageLogger,
}));

vi.mock('../components/common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));
vi.mock('../components/RouteErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('../components/layout/DepartmentContentPanel/DepartmentContentPanel', () => ({
  default: () => <div data-testid="department-panel" />,
}));
vi.mock('../components/layout/MobileCRMDrawer', () => ({
  default: () => <div data-testid="mobile-drawer" />,
}));
vi.mock('../components/layout/authenticated/AuthenticatedPageShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-shell">{children}</div>
  ),
}));
vi.mock('../components/layout/DashboardShell/DashboardShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-shell">{children}</div>
  ),
}));
vi.mock('../components/dashboard/DashboardTopBar', () => ({
  default: () => <div data-testid="topbar" />,
}));
vi.mock('../components/layout/DashboardSidebar/DashboardSidebar', () => ({
  default: () => <div data-testid="dashboard-sidebar" />,
}));
vi.mock('../components/common/SubNavBar', () => ({
  default: () => <div data-testid="subnav" />,
}));
vi.mock('../components/dashboard/DashboardRenderer', () => ({
  DashboardSubTabRenderer: () => <div data-testid="subtab-renderer" />,
}));
vi.mock('../components/dashboard/SuperuserControlCenter', () => ({
  default: () => <div data-testid="superuser-controls" />,
}));
vi.mock('../components/dashboard/DashboardSideRail', () => ({
  default: () => <div data-testid="side-rail" />,
}));
vi.mock('../components/dashboard/DashboardPageHeader', () => ({
  default: () => <div data-testid="page-header" />,
}));
vi.mock('../components/dashboard/DashboardKpiStrip', () => ({
  default: () => <div data-testid="kpi-strip" />,
}));
vi.mock('../components/dashboard/DashboardProfileCompletion', () => ({
  default: () => null,
}));
vi.mock('../components/dashboard/DashboardCommandPalette', () => ({
  default: () => null,
}));
vi.mock('../components/dashboard/DashboardModuleToolbar', () => ({
  default: () => <div data-testid="module-toolbar" />,
}));
vi.mock('../components/crm/CRMContextPanel', () => ({
  default: () => <div data-testid="context-panel" />,
}));

vi.mock('../components/owner/tabs/OverviewTab', () => ({
  default: () => <div data-testid="overview-tab">Overview</div>,
}));

const makeDashboardHookState = () => ({
  currentRole: 'managing_director',
  currentModule: 'managing_director',
  currentSubModule: null,
  user: {
    id: 'u-md',
    name: 'Managing Director',
    email: 'md@wc.ae',
    role: 'managing_director',
  },
  activeTab: 'overview',
  setActiveTab: vi.fn(),
  selectedCRMModule: null,
  dashboardData: {
    properties: [],
    agents: [],
    leads: [],
    hotLeads: [],
    contracts: [],
    overview: { monthlyRevenue: 1000000 },
    recentActivities: [],
  },
  filteredData: {
    properties: [],
    agents: [],
    leads: [],
    hotLeads: [],
    contracts: [],
    overview: { monthlyRevenue: 1000000 },
    recentActivities: [],
  },
  isLoading: false,
  error: null,
  selectedDepartment: null,
  availableTabs: [{ id: 'overview', label: 'Overview' }],
  roleInfo: { label: 'Managing Director', description: 'Executive view' },
  roleSubNavItems: [],
  isSuperUser: false,
  handleRetryAll: vi.fn(),
  handleCRMModuleSelect: vi.fn(),
  handleBackFromCRM: vi.fn(),
  handleWorkspaceSelect: vi.fn(),
});

import UnifiedDashboardPage from './UnifiedDashboardPage';

describe('UnifiedDashboardPage dashboard preferences integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseUnifiedDashboard.mockReturnValue(makeDashboardHookState());

    mockFetchDashboardPreferences.mockResolvedValue({
      role: 'managing_director',
      widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
      layout: 'default',
    });

    mockFetchRoleDashboardConfig.mockResolvedValue({
      role: 'managing_director',
      widgets: [{ id: 'team-kpis', title: 'Team KPIs', enabled: true }],
      layout: 'default',
    });

    mockSaveDashboardPreferences.mockResolvedValue({
      role: 'managing_director',
      widgets: [{ id: 'kpi-overview', title: 'KPI Overview', enabled: true }],
      layout: 'default',
    });
  });

  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/crm?tab=overview']}>
        <UnifiedDashboardPage />
      </MemoryRouter>
    );

  it('loads preferences and renders configurator for executive role', async () => {
    renderPage();

    await waitFor(() => {
      expect(mockFetchDashboardPreferences).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByRole('heading', { name: /Executive Widget Controls/i, level: 3 })
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /KPI Overview/i })).toBeInTheDocument();
  });

  it('saves updated widget state when toggled', async () => {
    renderPage();

    const checkbox = await screen.findByRole('checkbox', { name: /KPI Overview/i });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockSaveDashboardPreferences).toHaveBeenCalled();
    });

    const [widgets, layout] = mockSaveDashboardPreferences.mock.calls.at(-1) as [
      Array<{ id: string; title: string; enabled: boolean }>,
      string,
    ];

    expect(widgets).toEqual([{ id: 'kpi-overview', title: 'KPI Overview', enabled: false }]);
    expect(layout).toBe('default');
  });

  it('resets to role defaults and persists reset payload', async () => {
    renderPage();

    const resetButton = await screen.findByRole('button', {
      name: /Reset dashboard configuration/i,
    });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockFetchRoleDashboardConfig).toHaveBeenCalledTimes(1);
    });

    expect(mockSaveDashboardPreferences).toHaveBeenCalledWith(
      [{ id: 'team-kpis', title: 'Team KPIs', enabled: true }],
      'default'
    );
    expect(screen.getByRole('checkbox', { name: /Team KPIs/i })).toBeInTheDocument();
  });

  it('falls back to role defaults when preferences fetch fails', async () => {
    mockFetchDashboardPreferences.mockRejectedValueOnce(new Error('preferences failed'));

    renderPage();

    await waitFor(() => {
      expect(mockFetchRoleDashboardConfig).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText(/Could not load dashboard preferences. Using role defaults./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Team KPIs/i })).toBeInTheDocument();
  });

  it('shows inline error when widget preference save fails', async () => {
    mockSaveDashboardPreferences.mockRejectedValueOnce(new Error('save failed'));

    renderPage();

    const checkbox = await screen.findByRole('checkbox', { name: /KPI Overview/i });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(
        screen.getByText(/Could not save widget preferences. Please retry./i)
      ).toBeInTheDocument();
    });
  });
});
