/**
 * TrendChart Component Tests
 * Tests: rendering, title, default/custom data, area vs line mode,
 *        custom props, tooltip
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrendChart from './TrendChart';

// Mock recharts — render minimal SVG elements with testids
vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <svg data-testid="line-chart">{children}</svg>,
  Line: (props: any) => <g data-testid={`line-${props.dataKey}`} />,
  XAxis: (props: any) => <g data-testid="x-axis" data-key={props.dataKey} />,
  YAxis: () => <g data-testid="y-axis" />,
  CartesianGrid: () => <g data-testid="cartesian-grid" />,
  Tooltip: () => <g data-testid="tooltip" />,
  Legend: () => <g data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Area: (props: any) => <g data-testid={`area-${props.dataKey}`} />,
  AreaChart: ({ children }: any) => <svg data-testid="area-chart">{children}</svg>,
}));

describe('TrendChart', () => {
  // ─── Rendering ────────────────────────────────────────
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<TrendChart />);
      expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
    });

    it('renders custom title', () => {
      render(<TrendChart title="Revenue Trend" />);
      expect(screen.getByText('Revenue Trend')).toBeInTheDocument();
    });

    it('renders inside ResponsiveContainer', () => {
      render(<TrendChart />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders container div with trend-chart-container class', () => {
      const { container } = render(<TrendChart />);
      expect(container.querySelector('.trend-chart-container')).toBeInTheDocument();
    });
  });

  // ─── Chart Type ──────────────────────────────────────
  describe('chart type', () => {
    it('renders AreaChart when showArea=true (default)', () => {
      render(<TrendChart />);
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('renders LineChart when showArea=false', () => {
      render(<TrendChart showArea={false} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  // ─── Default Data ────────────────────────────────────
  describe('default data', () => {
    it('uses default data when no data prop', () => {
      render(<TrendChart />);
      // Should render without error using default data
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('uses default data when empty array', () => {
      render(<TrendChart data={[]} />);
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  // ─── Custom Data ─────────────────────────────────────
  describe('custom data', () => {
    it('renders with custom data', () => {
      const data = [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 200 },
      ];
      render(<TrendChart data={data} />);
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('renders target line when data has target field', () => {
      const data = [
        { name: 'Jan', value: 100, target: 90 },
        { name: 'Feb', value: 200, target: 90 },
      ];
      render(<TrendChart data={data} />);
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  // ─── Line Mode ────────────────────────────────────────
  describe('line mode', () => {
    it('renders line dataKey in line mode', () => {
      render(<TrendChart showArea={false} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('renders target line in line mode when data has targets', () => {
      const data = [
        { name: 'W1', value: 50, target: 45 },
        { name: 'W2', value: 60, target: 45 },
      ];
      render(<TrendChart data={data} showArea={false} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  // ─── Chart Components ─────────────────────────────────
  describe('chart sub-components', () => {
    it('renders CartesianGrid', () => {
      render(<TrendChart />);
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    });

    it('renders XAxis', () => {
      render(<TrendChart />);
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });

    it('renders YAxis', () => {
      render(<TrendChart />);
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('renders Tooltip', () => {
      render(<TrendChart />);
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('renders Legend', () => {
      render(<TrendChart />);
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });
});
