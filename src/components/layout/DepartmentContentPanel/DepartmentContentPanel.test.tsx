/**
 * DepartmentContentPanel — Comprehensive Unit Tests
 *
 * Covers: empty state, department overview, service drill-down,
 * quick actions, keyboard accessibility, lazy chart loading,
 * service card clicks, Suspense fallbacks
 */

import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// NOTE: Mock data is defined inside vi.mock factory to avoid hoisting issues

// ── Mocks ────────────────────────────────────────────────────────

const mockDispatch = vi.fn();
let mockSelectedDepartment: string | null = null;
let mockSelectedService: string | null = null;
const mockHandleAction = vi.fn();

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => {
    // Build a fake state that the selector can read
    const fakeState = {
      sidebar: {
        selectedDepartment: mockSelectedDepartment,
        selectedService: mockSelectedService,
      },
    };
    return selector(fakeState);
  },
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/slices/sidebarSlice', () => ({
  selectService: vi.fn((payload: { department: string; service: string }) => ({
    type: 'sidebar/selectService',
    payload,
  })),
}));

vi.mock('../../../hooks/useActionHandler', () => ({
  __esModule: true,
  default: () => ({ handleAction: mockHandleAction }),
}));

vi.mock('../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('../../charts/charts.css', () => ({}));

// Mock lazy-loaded chart components
vi.mock('../../charts/MetricsChart', () => ({
  __esModule: true,
  default: ({ title, data }: { title: string; data: unknown[] }) => (
    <div data-testid="metrics-chart">{title}</div>
  ),
}));

vi.mock('../../charts/TrendChart', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="trend-chart">{title}</div>,
}));

vi.mock('../../charts/DistributionChart', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="distribution-chart">{title}</div>,
}));

vi.mock('../../charts/EnhancedStatCard', () => ({
  __esModule: true,
  default: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="stat-card">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
}));

// Mock departmentData — inline to avoid hoisting issues
vi.mock('./departmentData', () => {
  const React = require('react');
  return {
    DEPARTMENT_CONTENT: {
      operations: {
        name: 'Operations',
        icon: 'Building2',
        color: '#3B82F6',
        bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        description: 'Manage inventory, properties, assets, and operational data',
        metrics: [
          { label: 'Total Properties', value: '9,378', change: '+12%', trend: 'up' },
          { label: 'Assets Under Management', value: '12,450', change: '+5%', trend: 'up' },
        ],
        services: {
          'Inventory Management': {
            description: 'Manage All Property Inventory',
            stats: [
              { label: 'Indexed Properties', value: '9,378' },
              { label: 'Active Listings', value: '4,250' },
            ],
            actions: [
              { label: 'View Inventory', icon: () => React.createElement('span', null, '📋') },
              { label: 'Import Data', icon: () => React.createElement('span', null, '📥') },
            ],
          },
          Properties: {
            description: 'Property Management & Tracking',
            stats: [{ label: 'Total Properties', value: '9,378' }],
            actions: [
              { label: 'View Properties', icon: () => React.createElement('span', null, '📄') },
            ],
          },
        },
      },
    },
  };
});

// Mock lucide-react Briefcase
vi.mock('lucide-react', () => ({
  Briefcase: (props: Record<string, unknown>) => <svg data-testid="briefcase-icon" {...props} />,
}));

// Mock styled-components — render as plain HTML elements with data-testid
vi.mock('./styles', () => {
  const createStyledMock = (tag: string, testId: string) => {
    const Component = React.forwardRef(({ children, ...props }: Record<string, unknown>, ref) => {
      const sanitizedProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => key !== 'as' && !key.startsWith('$'))
      );
      return React.createElement(
        tag,
        { 'data-testid': testId, ref, ...sanitizedProps },
        children as React.ReactNode
      );
    });
    Component.displayName = testId;
    return Component;
  };

  return {
    DepartmentPanel: createStyledMock('div', 'department-panel'),
    ContentHeader: createStyledMock('div', 'content-header'),
    HeaderContent: createStyledMock('div', 'header-content'),
    ContentBreadcrumbs: createStyledMock('nav', 'content-breadcrumbs'),
    BreadcrumbItem: createStyledMock('span', 'breadcrumb-item'),
    BreadcrumbSeparator: createStyledMock('span', 'breadcrumb-separator'),
    HeaderTitle: createStyledMock('h1', 'header-title'),
    HeaderDescription: createStyledMock('p', 'header-description'),
    ContentBody: createStyledMock('div', 'content-body'),
    EmptyState: createStyledMock('div', 'empty-state'),
    EmptyStateIcon: createStyledMock('svg', 'empty-state-icon'),
    EmptyStateHeading: createStyledMock('h2', 'empty-state-heading'),
    EmptyStateText: createStyledMock('p', 'empty-state-text'),
    ServiceContent: createStyledMock('div', 'service-content'),
    ServiceHeader: createStyledMock('div', 'service-header'),
    ServiceTitle: createStyledMock('h2', 'service-title'),
    ServiceDescription: createStyledMock('p', 'service-description'),
    StatsGrid: createStyledMock('div', 'stats-grid'),
    StatCard: createStyledMock('div', 'stat-card-styled'),
    StatLabel: createStyledMock('div', 'stat-label'),
    StatValue: createStyledMock('div', 'stat-value'),
    OverviewSection: createStyledMock('div', 'overview-section'),
    OverviewHeading: createStyledMock('h2', 'overview-heading'),
    OverviewText: createStyledMock('p', 'overview-text'),
    MetricsSection: createStyledMock('div', 'metrics-section'),
    MetricsSectionHeading: createStyledMock('h2', 'metrics-heading'),
    MetricsGrid: createStyledMock('div', 'metrics-grid'),
    LoadingSection: createStyledMock('div', 'loading-section'),
    AnalyticsSection: createStyledMock('div', 'analytics-section'),
    ServicesSection: createStyledMock('div', 'services-section'),
    ServicesSectionHeading: createStyledMock('h2', 'services-heading'),
    ServicesGrid: createStyledMock('div', 'services-grid'),
    ServiceCard: createStyledMock('div', 'service-card'),
    ServiceCardTitle: createStyledMock('div', 'service-card-title'),
    ServiceCardDescription: createStyledMock('p', 'service-card-desc'),
    ServiceCardAction: createStyledMock('button', 'service-card-action'),
    ActionsSection: createStyledMock('div', 'actions-section'),
    ActionsSectionHeading: createStyledMock('h3', 'actions-heading'),
    ActionsGrid: createStyledMock('div', 'actions-grid'),
    ActionButton: createStyledMock('button', 'action-button'),
  };
});

import DepartmentContentPanel from './DepartmentContentPanel';

// ── Test Suite ───────────────────────────────────────────────────

describe('DepartmentContentPanel', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectedDepartment = null;
    mockSelectedService = null;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // ────── Empty State ──────

  describe('empty state (no department selected)', () => {
    it('renders empty state message', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Select a Department')).toBeInTheDocument();
    });

    it('renders empty state help text', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText(/Choose a department from the left sidebar/)).toBeInTheDocument();
    });

    it('renders icon in empty state', () => {
      render(<DepartmentContentPanel />);
      // The Briefcase icon is passed via `as` prop to EmptyStateIcon styled component
      expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
    });

    it('does NOT render department header', () => {
      render(<DepartmentContentPanel />);
      expect(screen.queryByTestId('content-header')).not.toBeInTheDocument();
    });
  });

  // ────── Department Overview (no service selected) ──────

  describe('department overview', () => {
    beforeEach(() => {
      mockSelectedDepartment = 'operations';
      mockSelectedService = null;
    });

    it('renders department name in header', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByTestId('header-title')).toHaveTextContent('Operations');
    });

    it('renders department description in header', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText(/Manage inventory, properties, assets/)).toBeInTheDocument();
    });

    it('renders overview breadcrumb context', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByTestId('content-breadcrumbs')).toBeInTheDocument();
      expect(screen.getAllByText('Operations').length).toBeGreaterThan(0);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
      expect(breadcrumbItems[1]).toHaveAttribute('aria-current', 'page');
    });

    it('renders "Department Overview" section heading', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Department Overview')).toBeInTheDocument();
    });

    it('renders overview guidance text', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText(/Select a service from the left sidebar/)).toBeInTheDocument();
    });

    it('renders "Key Metrics" section', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Key Metrics')).toBeInTheDocument();
    });

    it('renders EnhancedStatCards for each metric', () => {
      render(<DepartmentContentPanel />);
      const cards = screen.getAllByTestId('stat-card');
      expect(cards.length).toBe(2); // 2 metrics in mock
      expect(screen.getByText('Total Properties')).toBeInTheDocument();
      expect(screen.getByText('9,378')).toBeInTheDocument();
    });

    it('renders analytics charts', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByTestId('metrics-chart')).toBeInTheDocument();
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
      expect(screen.getByTestId('distribution-chart')).toBeInTheDocument();
    });

    it('renders chart titles with department name', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Operations Metrics Overview')).toBeInTheDocument();
      expect(screen.getByText('Operations Trend Analysis')).toBeInTheDocument();
      expect(screen.getByText('Operations Service Distribution')).toBeInTheDocument();
    });

    it('renders "Available Services" section', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Available Services')).toBeInTheDocument();
    });

    it('renders service cards for each service', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Inventory Management')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
    });

    it('renders "View Service →" link for each service card', () => {
      render(<DepartmentContentPanel />);
      const viewLinks = screen.getAllByText('View Service →');
      expect(viewLinks.length).toBe(2);
    });

    it('dispatches selectService when service card is clicked', () => {
      render(<DepartmentContentPanel />);
      // Find the service card containing 'Inventory Management'
      const card = screen.getByText('Inventory Management').closest('[data-testid="service-card"]');
      expect(card).toBeTruthy();
      fireEvent.click(card!);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sidebar/selectService',
        payload: { department: 'operations', service: 'Inventory Management' },
      });
    });

    it('dispatches selectService when "View Service →" is clicked', () => {
      render(<DepartmentContentPanel />);
      // Get the first "View Service →" button
      const viewBtns = screen.getAllByText('View Service →');
      fireEvent.click(viewBtns[0]);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  // ────── Keyboard Accessibility ──────

  describe('keyboard accessibility', () => {
    beforeEach(() => {
      mockSelectedDepartment = 'operations';
      mockSelectedService = null;
    });

    it('service cards have role="button" and tabIndex=0', () => {
      render(<DepartmentContentPanel />);
      const cards = screen.getAllByTestId('service-card');
      cards.forEach(card => {
        expect(card.getAttribute('role')).toBe('button');
        expect(card.getAttribute('tabindex')).toBe('0');
        expect(card.getAttribute('aria-label')).toMatch(/^Open .* service$/);
      });
    });

    it('activates service on Enter key press', () => {
      render(<DepartmentContentPanel />);
      const card = screen.getByText('Inventory Management').closest('[data-testid="service-card"]');
      fireEvent.keyDown(card!, { key: 'Enter' });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('activates service on Space key press', () => {
      render(<DepartmentContentPanel />);
      const card = screen.getByText('Properties').closest('[data-testid="service-card"]');
      const didBubbleWithoutCancel = fireEvent.keyDown(card!, {
        key: ' ',
        code: 'Space',
        charCode: 32,
      });
      expect(didBubbleWithoutCancel).toBe(false);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('connects service card description for screen readers', () => {
      render(<DepartmentContentPanel />);
      const card = screen.getByText('Inventory Management').closest('[data-testid="service-card"]');
      expect(card).toHaveAttribute('aria-describedby', 'service-desc-inventory-management');
      expect(screen.getByText('Manage All Property Inventory')).toHaveAttribute(
        'id',
        'service-desc-inventory-management'
      );
    });

    it('does NOT dispatch on other key presses', () => {
      render(<DepartmentContentPanel />);
      const card = screen.getByText('Properties').closest('[data-testid="service-card"]');
      fireEvent.keyDown(card!, { key: 'Tab' });
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  // ────── Service Drill-Down ──────

  describe('service-specific content', () => {
    beforeEach(() => {
      mockSelectedDepartment = 'operations';
      mockSelectedService = 'Inventory Management';
    });

    it('renders service title', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByTestId('service-title')).toHaveTextContent('Inventory Management');
    });

    it('renders service breadcrumb context', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByTestId('content-breadcrumbs')).toBeInTheDocument();
      const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
      expect(breadcrumbItems[1]).toHaveTextContent('Inventory Management');
    });

    it('renders service description', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Manage All Property Inventory')).toBeInTheDocument();
    });

    it('renders service stats', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Indexed Properties')).toBeInTheDocument();
      expect(screen.getByText('Active Listings')).toBeInTheDocument();
    });

    it('renders stat values', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('4,250')).toBeInTheDocument();
    });

    it('renders "Quick Actions" heading', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    it('renders action buttons for each service action', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByText('View Inventory')).toBeInTheDocument();
      expect(screen.getByText('Import Data')).toBeInTheDocument();
    });

    it('calls handleAction when action button is clicked', () => {
      render(<DepartmentContentPanel />);
      fireEvent.click(screen.getByText('View Inventory'));
      expect(mockHandleAction).toHaveBeenCalledWith(
        'View Inventory',
        'operations',
        'Inventory Management'
      );
    });

    it('does NOT render department overview when service is selected', () => {
      render(<DepartmentContentPanel />);
      expect(screen.queryByText('Department Overview')).not.toBeInTheDocument();
      expect(screen.queryByText('Available Services')).not.toBeInTheDocument();
    });

    it('does NOT render charts when viewing a service', () => {
      render(<DepartmentContentPanel />);
      expect(screen.queryByTestId('metrics-chart')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trend-chart')).not.toBeInTheDocument();
    });

    it('still renders department header with name and description', () => {
      render(<DepartmentContentPanel />);
      expect(screen.getByTestId('header-title')).toHaveTextContent('Operations');
      expect(screen.getByText(/Manage inventory, properties, assets/)).toBeInTheDocument();
    });
  });

  // ────── Invalid Department ──────

  describe('invalid department', () => {
    it('shows empty state for unknown department', () => {
      mockSelectedDepartment = 'nonexistent';
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Select a Department')).toBeInTheDocument();
    });
  });

  // ────── Service Not Found ──────

  describe('service not found in department', () => {
    it('renders explicit service not found empty state', () => {
      mockSelectedDepartment = 'operations';
      mockSelectedService = 'Nonexistent Service';
      render(<DepartmentContentPanel />);
      expect(screen.getByText('Service Not Found')).toBeInTheDocument();
      expect(screen.getByText(/no longer available in Operations/i)).toBeInTheDocument();
    });
  });
});
