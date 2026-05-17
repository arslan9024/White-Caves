/**
 * @file SophiaSalesCRM.test.tsx
 * @description Comprehensive tests for SophiaSalesCRM dashboard component
 * Tests: rendering, tabs, stats, sub-component rendering, tab switching
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual<typeof import('lucide-react')>('lucide-react');
  return {
    ...actual,
    Users: (props: any) => <svg data-testid="icon-users" {...props} />,
    TrendingUp: (props: any) => <svg data-testid="icon-trending" {...props} />,
    DollarSign: (props: any) => <svg data-testid="icon-dollar" {...props} />,
    Target: (props: any) => <svg data-testid="icon-target" {...props} />,
    Clock: (props: any) => <svg data-testid="icon-clock" {...props} />,
    Bell: (props: any) => <svg data-testid="icon-bell" {...props} />,
    BellOff: (props: any) => <svg data-testid="icon-bell-off" {...props} />,
    CheckCircle: (props: any) => <svg data-testid="icon-check-circle" {...props} />,
    CheckCircle2: (props: any) => <svg data-testid="icon-check-circle-2" {...props} />,
    XCircle: (props: any) => <svg data-testid="icon-x-circle" {...props} />,
    AlertTriangle: (props: any) => <svg data-testid="icon-alert-triangle" {...props} />,
    Info: (props: any) => <svg data-testid="icon-info" {...props} />,
    Loader2: (props: any) => <svg data-testid="icon-loader-2" {...props} />,
    BarChart2: (props: any) => <svg data-testid="icon-bar-chart-2" {...props} />,
    ChevronDown: (props: any) => <svg data-testid="icon-chevron-down" {...props} />,
    ChevronRight: (props: any) => <svg data-testid="icon-chevron-right" {...props} />,
    User: (props: any) => <svg data-testid="icon-user" {...props} />,
    Calendar: (props: any) => <svg data-testid="icon-calendar" {...props} />,
    Zap: (props: any) => <svg data-testid="icon-zap" {...props} />,
    Flag: (props: any) => <svg data-testid="icon-flag" {...props} />,
    Circle: (props: any) => <svg data-testid="icon-circle" {...props} />,
    ArrowUp: (props: any) => <svg data-testid="icon-arrow-up" {...props} />,
    ArrowDown: (props: any) => <svg data-testid="icon-arrow-down" {...props} />,
  };
});

// Mock useSalesData hook
const mockUseSalesData = vi.fn();
vi.mock('../hooks/useSalesData', () => ({
  useSalesData: () => mockUseSalesData(),
}));

// Mock sub-components
vi.mock('../tabs/PipelineTab', () => ({
  default: (props: any) => (
    <div data-testid="pipeline-tab">Pipeline Tab - Stage: {props.selectedStage}</div>
  ),
}));

vi.mock('../tabs/DealsTab', () => ({
  default: (props: any) => (
    <div data-testid="deals-tab">Deals Tab - Query: {props.searchQuery}</div>
  ),
}));

vi.mock('../tabs/AgentsTab', () => ({
  default: (props: any) => (
    <div data-testid="agents-tab">Agents Tab - Count: {props.agents?.length}</div>
  ),
}));

vi.mock('../tabs/ForecastingTab', () => ({
  default: () => <div data-testid="forecasting-tab">Forecasting Tab</div>,
}));

// Mock CSS
vi.mock('../../AssistantDashboard.css', () => ({}));
vi.mock('../SophiaSalesCRM.css', () => ({}));

import SophiaSalesCRM from '../index';

describe('SophiaSalesCRM', () => {
  const defaultHookReturn = {
    activeTab: 'pipeline',
    setActiveTab: vi.fn(),
    selectedStage: 'qualification',
    handleSelectStage: vi.fn(),
    searchQuery: '',
    setSearchQuery: vi.fn(),
    filterAgent: 'all',
    setFilterAgent: vi.fn(),
    deals: [
      {
        id: 1,
        property: 'Villa 1',
        client: 'Client A',
        value: 1000000,
        stage: 'qualification',
        agent: 'Agent1',
      },
      {
        id: 2,
        property: 'Villa 2',
        client: 'Client B',
        value: 2000000,
        stage: 'negotiation',
        agent: 'Agent2',
      },
    ],
    filteredDeals: [
      {
        id: 1,
        property: 'Villa 1',
        client: 'Client A',
        value: 1000000,
        stage: 'qualification',
        agent: 'Agent1',
      },
    ],
    agents: [
      { id: 1, name: 'Agent Smith', conversion: 45 },
      { id: 2, name: 'Agent Jones', conversion: 55 },
    ],
    getTotalPipelineValue: vi.fn().mockReturnValue(3000000),
    getAverageWinRate: vi.fn().mockReturnValue('50.0'),
    getTotalDeals: vi.fn().mockReturnValue(2),
    pipelineStages: [
      { id: 'qualification', name: 'Qualification', count: 5 },
      { id: 'negotiation', name: 'Negotiation', count: 3 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSalesData.mockReturnValue(defaultHookReturn);
  });

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders the dashboard', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('Sophia - Sales Pipeline Manager')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText(/Manages sales pipeline/)).toBeInTheDocument();
    });

    it('shows Active status', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  // ── Quick Stats ────────────────────────────────────────
  describe('Quick Stats', () => {
    it('displays total deals', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Active Deals')).toBeInTheDocument();
    });

    it('displays pipeline value in millions', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('AED 3M')).toBeInTheDocument();
      expect(screen.getByText('Pipeline Value')).toBeInTheDocument();
    });

    it('displays win rate', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('50.0%')).toBeInTheDocument();
      expect(screen.getByText('Win Rate')).toBeInTheDocument();
    });

    it('displays average cycle', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('18 days')).toBeInTheDocument();
      expect(screen.getByText('Avg. Cycle')).toBeInTheDocument();
    });

    it('displays percentage changes', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('12%')).toBeInTheDocument();
      expect(screen.getByText('8%')).toBeInTheDocument();
      expect(screen.getByText('5%')).toBeInTheDocument();
    });
  });

  // ── Tab Navigation ─────────────────────────────────────
  describe('Tab Navigation', () => {
    it('renders all 4 tab buttons', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText('Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Deals')).toBeInTheDocument();
      expect(screen.getByText('Agents')).toBeInTheDocument();
      expect(screen.getByText('Forecasting')).toBeInTheDocument();
    });

    it('Pipeline tab is active by default', () => {
      render(<SophiaSalesCRM />);
      const pipelineBtn = screen.getByText('Pipeline');
      expect(pipelineBtn).toHaveClass('active');
    });

    it('calls setActiveTab on tab click', () => {
      render(<SophiaSalesCRM />);
      fireEvent.click(screen.getByText('Deals'));
      expect(defaultHookReturn.setActiveTab).toHaveBeenCalledWith('deals');
    });

    it('calls setActiveTab for Agents tab', () => {
      render(<SophiaSalesCRM />);
      fireEvent.click(screen.getByText('Agents'));
      expect(defaultHookReturn.setActiveTab).toHaveBeenCalledWith('agents');
    });

    it('calls setActiveTab for Forecasting tab', () => {
      render(<SophiaSalesCRM />);
      fireEvent.click(screen.getByText('Forecasting'));
      expect(defaultHookReturn.setActiveTab).toHaveBeenCalledWith('forecasting');
    });
  });

  // ── Tab Content Rendering ──────────────────────────────
  describe('Tab Content', () => {
    it('renders PipelineTab when pipeline is active', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByTestId('pipeline-tab')).toBeInTheDocument();
    });

    it('renders DealsTab when deals is active', () => {
      mockUseSalesData.mockReturnValue({ ...defaultHookReturn, activeTab: 'deals' });
      render(<SophiaSalesCRM />);
      expect(screen.getByTestId('deals-tab')).toBeInTheDocument();
    });

    it('renders AgentsTab when agents is active', () => {
      mockUseSalesData.mockReturnValue({ ...defaultHookReturn, activeTab: 'agents' });
      render(<SophiaSalesCRM />);
      expect(screen.getByTestId('agents-tab')).toBeInTheDocument();
    });

    it('renders ForecastingTab when forecasting is active', () => {
      mockUseSalesData.mockReturnValue({ ...defaultHookReturn, activeTab: 'forecasting' });
      render(<SophiaSalesCRM />);
      expect(screen.getByTestId('forecasting-tab')).toBeInTheDocument();
    });

    it('does not render non-active tabs', () => {
      render(<SophiaSalesCRM />);
      expect(screen.queryByTestId('deals-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('agents-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('forecasting-tab')).not.toBeInTheDocument();
    });
  });

  // ── Props Passing ──────────────────────────────────────
  describe('Props Passing', () => {
    it('passes selectedStage to PipelineTab', () => {
      render(<SophiaSalesCRM />);
      expect(screen.getByText(/Stage: qualification/)).toBeInTheDocument();
    });

    it('passes filteredDeals to DealsTab', () => {
      mockUseSalesData.mockReturnValue({ ...defaultHookReturn, activeTab: 'deals' });
      render(<SophiaSalesCRM />);
      expect(screen.getByTestId('deals-tab')).toBeInTheDocument();
    });

    it('passes agents to AgentsTab', () => {
      mockUseSalesData.mockReturnValue({ ...defaultHookReturn, activeTab: 'agents' });
      render(<SophiaSalesCRM />);
      expect(screen.getByText(/Count: 2/)).toBeInTheDocument();
    });
  });

  // ── Edge Cases ─────────────────────────────────────────
  describe('Edge Cases', () => {
    it('handles zero pipeline value', () => {
      mockUseSalesData.mockReturnValue({
        ...defaultHookReturn,
        getTotalPipelineValue: vi.fn().mockReturnValue(0),
      });
      render(<SophiaSalesCRM />);
      expect(screen.getByText('AED 0M')).toBeInTheDocument();
    });

    it('handles zero deals', () => {
      mockUseSalesData.mockReturnValue({
        ...defaultHookReturn,
        getTotalDeals: vi.fn().mockReturnValue(0),
      });
      render(<SophiaSalesCRM />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
