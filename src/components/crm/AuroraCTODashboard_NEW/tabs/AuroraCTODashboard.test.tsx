import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('../AuroraCTODashboard.css', () => ({}));

// Mock tab components
vi.mock('./OverviewTab', () => ({
  default: ({ stats, systemStatus }: any) => (
    <div data-testid="overview-tab">Overview - Health: {stats?.systemHealth?.toFixed(0)}%</div>
  ),
}));
vi.mock('./AssistantsTab', () => ({
  default: ({ assistants }: any) => (
    <div data-testid="assistants-tab">Assistants ({assistants?.length || 0})</div>
  ),
}));
vi.mock('./ArchitectureTab', () => ({
  default: ({ modules }: any) => <div data-testid="architecture-tab">Architecture</div>,
}));
vi.mock('./ApplicationsTab', () => ({
  default: () => <div data-testid="applications-tab">Applications</div>,
}));
vi.mock('./APIPerformanceTab', () => ({
  default: () => <div data-testid="api-performance-tab">API Performance</div>,
}));

// Mock useCTOData hook
const mockOnSelectAssistant = vi.fn();
vi.mock('../hooks/useCTOData', () => ({
  useCTOData: () => ({
    stats: {
      totalAssistants: 7,
      activeAssistants: 5,
      totalModules: 24,
      productionModules: 18,
      systemHealth: 92.5,
    },
    assistants: [
      { id: 1, name: 'Zoe' },
      { id: 2, name: 'Clara' },
    ],
    departments: { Sales: [], Engineering: [] },
    selectedAssistant: null,
    onSelectAssistant: mockOnSelectAssistant,
    modules: [{ name: 'CRM', modules: [] }],
    techStack: [],
    systemComponents: [],
    systemStatus: 'operational',
    features: ['Real-time Monitoring', 'Auto-scaling', 'CI/CD Pipeline'],
  }),
}));

import AuroraCTODashboard from './index';

describe('AuroraCTODashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders dashboard header', () => {
      render(<AuroraCTODashboard />);
      expect(screen.getByText('Aurora - CTO & Systems Architect')).toBeInTheDocument();
    });

    it('renders assistant description', () => {
      render(<AuroraCTODashboard />);
      expect(screen.getByText(/System monitoring, technical documentation/)).toBeInTheDocument();
    });

    it('renders quick stats in header', () => {
      render(<AuroraCTODashboard />);
      expect(screen.getByText('7')).toBeInTheDocument(); // totalAssistants
      expect(screen.getAllByText('Assistants').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('24')).toBeInTheDocument(); // totalModules
      expect(screen.getAllByText('Modules').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Health')).toBeInTheDocument();
    });
  });

  describe('tab navigation', () => {
    it('renders all 6 tab buttons', () => {
      const { container } = render(<AuroraCTODashboard />);
      const tabNav = container.querySelector('.tab-navigation')!;
      expect(tabNav.querySelectorAll('button').length).toBe(6);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getAllByText('Assistants').length).toBe(2); // stats + tab
      expect(screen.getByText('Architecture')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
      expect(screen.getByText('API Performance')).toBeInTheDocument();
      expect(screen.getByText('Lifecycle')).toBeInTheDocument();
    });

    it('shows overview tab as active by default', () => {
      render(<AuroraCTODashboard />);
      const overviewBtn = screen.getByText('Overview').closest('button');
      expect(overviewBtn).toHaveAttribute('aria-selected', 'true');
    });

    it('switches to assistants tab on click', () => {
      const { container } = render(<AuroraCTODashboard />);
      const tabButtons = container.querySelectorAll('.tab-navigation button');
      fireEvent.click(tabButtons[1]); // Assistants tab
      expect(screen.getByTestId('assistants-tab')).toBeInTheDocument();
    });

    it('switches to architecture tab on click', () => {
      render(<AuroraCTODashboard />);
      fireEvent.click(screen.getByText('Architecture'));
      expect(screen.getByTestId('architecture-tab')).toBeInTheDocument();
    });

    it('switches to applications tab on click', () => {
      render(<AuroraCTODashboard />);
      fireEvent.click(screen.getByText('Applications'));
      expect(screen.getByTestId('applications-tab')).toBeInTheDocument();
    });

    it('switches to API performance tab on click', () => {
      render(<AuroraCTODashboard />);
      fireEvent.click(screen.getByText('API Performance'));
      expect(screen.getByTestId('api-performance-tab')).toBeInTheDocument();
    });

    it('sets aria-selected false for inactive tabs', () => {
      const { container } = render(<AuroraCTODashboard />);
      const tabButtons = container.querySelectorAll('.tab-navigation button');
      expect(tabButtons[1]).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('tab content', () => {
    it('shows overview tab by default', () => {
      render(<AuroraCTODashboard />);
      expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
    });

    it('passes stats to overview tab', () => {
      render(<AuroraCTODashboard />);
      expect(screen.getByTestId('overview-tab')).toHaveTextContent('Health: 93%');
    });
  });

  describe('features section', () => {
    it('renders features heading', () => {
      render(<AuroraCTODashboard />);
      expect(screen.getByText('Available Features')).toBeInTheDocument();
    });

    it('renders all feature items', () => {
      render(<AuroraCTODashboard />);
      expect(screen.getByText('Real-time Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Auto-scaling')).toBeInTheDocument();
      expect(screen.getByText('CI/CD Pipeline')).toBeInTheDocument();
    });
  });
});
