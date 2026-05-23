import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock recharts
vi.mock('recharts', () => ({
  BarChart: ({ children, data, ...props }: any) => (
    <div data-testid="bar-chart" data-data={JSON.stringify(data)} {...props}>{children}</div>
  ),
  Bar: ({ children, dataKey, ...props }: any) => (
    <div data-testid="bar" data-datakey={dataKey}>{children}</div>
  ),
  XAxis: (props: any) => <div data-testid="x-axis" data-datakey={props.dataKey} />,
  YAxis: (props: any) => <div data-testid="y-axis" />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" />,
  Tooltip: (props: any) => <div data-testid="tooltip" />,
  Legend: (props: any) => <div data-testid="legend" />,
  ResponsiveContainer: ({ children, ...props }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Cell: (props: any) => <div data-testid="cell" />,
}));

// Mock charts.css
vi.mock('./charts.css', () => ({}));

import MetricsChart from './MetricsChart';

const mockData = [
  { label: 'Revenue', value: '50000', unit: 'AED' },
  { label: 'Leads', value: '128', unit: '' },
  { label: 'Conversions', value: '42', unit: '%' },
];

describe('MetricsChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders the chart container', () => {
      const { container } = render(<MetricsChart data={mockData} />);
      expect(container.querySelector('.metrics-chart-container')).toBeInTheDocument();
    });

    it('renders the default title "Metrics Overview"', () => {
      render(<MetricsChart data={mockData} />);
      expect(screen.getByText('Metrics Overview')).toBeInTheDocument();
    });

    it('renders a custom title', () => {
      render(<MetricsChart data={mockData} title="Sales Performance" />);
      expect(screen.getByText('Sales Performance')).toBeInTheDocument();
    });

    it('renders the ResponsiveContainer', () => {
      render(<MetricsChart data={mockData} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders the BarChart', () => {
      render(<MetricsChart data={mockData} />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('renders the XAxis', () => {
      render(<MetricsChart data={mockData} />);
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });

    it('renders the YAxis', () => {
      render(<MetricsChart data={mockData} />);
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('renders CartesianGrid', () => {
      render(<MetricsChart data={mockData} />);
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    });

    it('renders Tooltip', () => {
      render(<MetricsChart data={mockData} />);
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  // === DATA TRANSFORMATION ===
  describe('data transformation', () => {
    it('transforms metric data correctly', () => {
      render(<MetricsChart data={mockData} />);
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-data') || '[]');
      expect(chartData).toEqual([
        { name: 'Revenue', value: 50000, unit: 'AED' },
        { name: 'Leads', value: 128, unit: '' },
        { name: 'Conversions', value: 42, unit: '%' },
      ]);
    });

    it('handles non-numeric values by converting to 0', () => {
      const badData = [{ label: 'Test', value: 'not-a-number', unit: '' }];
      render(<MetricsChart data={badData} />);
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-data') || '[]');
      expect(chartData[0].value).toBe(0);
    });

    it('uses label for metric name', () => {
      const data = [{ label: 'Total Sales', value: '100', unit: 'AED' }];
      render(<MetricsChart data={data} />);
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-data') || '[]');
      expect(chartData[0].name).toBe('Total Sales');
    });

    it('uses fallback name when label is empty', () => {
      const data = [{ label: '', value: '100', unit: 'AED' }];
      render(<MetricsChart data={data} />);
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-data') || '[]');
      expect(chartData[0].name).toBe('Metric 1');
    });
  });

  // === DEFAULT PROPS ===
  describe('default props', () => {
    it('renders with empty data array by default', () => {
      render(<MetricsChart />);
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-data') || '[]');
      expect(chartData).toEqual([]);
    });

    it('renders with default title', () => {
      render(<MetricsChart />);
      expect(screen.getByText('Metrics Overview')).toBeInTheDocument();
    });
  });

  // === CELLS ===
  describe('cells', () => {
    it('renders Cell components for each data point', () => {
      render(<MetricsChart data={mockData} />);
      const cells = screen.getAllByTestId('cell');
      expect(cells.length).toBe(mockData.length);
    });
  });

  // === BAR CONFIG ===
  describe('bar configuration', () => {
    it('renders Bar with value dataKey', () => {
      render(<MetricsChart data={mockData} />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-datakey', 'value');
    });

    it('renders XAxis with name dataKey', () => {
      render(<MetricsChart data={mockData} />);
      const xAxis = screen.getByTestId('x-axis');
      expect(xAxis).toHaveAttribute('data-datakey', 'name');
    });
  });
});
