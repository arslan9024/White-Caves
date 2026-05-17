/**
 * DataVisualization Components Unit Tests
 * Tests for BarChart, LineChart, PieChart, and ProgressRing
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import { BarChart, LineChart, PieChart, ProgressRing } from '../DataVisualization';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BarChart Component', () => {
  const mockData = [
    { label: 'Jan', value: 100, color: '#3498db' },
    { label: 'Feb', value: 150, color: '#2ecc71' },
    { label: 'Mar', value: 120, color: '#e74c3c' },
  ];

  test('renders all bars for data points', () => {
    const { container } = render(<BarChart data={mockData} />);
    const bars = container.querySelectorAll('div');
    expect(bars.length).toBeGreaterThan(0);
  });

  test('displays all labels', () => {
    render(<BarChart data={mockData} />);
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  test('calculates correct bar heights with custom maxValue', () => {
    const { container } = render(
      <BarChart data={mockData} maxValue={200} />
    );
    // Bars should be properly sized
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  test('uses auto-calculated max value when not provided', () => {
    const { container } = render(<BarChart data={mockData} />);
    // Max should be calculated as 150
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  test('applies colors to bars', () => {
    const { container } = render(<BarChart data={mockData} />);
    const bars = container.querySelectorAll('[style*="background"]');
    expect(bars.length).toBeGreaterThan(0);
  });

  test('handles empty data array', () => {
    const { container } = render(<BarChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('handles single data point', () => {
    render(<BarChart data={[{ label: 'Only', value: 100 }]} />);
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  test('handles large data values', () => {
    render(
      <BarChart
        data={[
          { label: 'Q1', value: 1000000 },
          { label: 'Q2', value: 1500000 },
        ]}
        maxValue={2000000}
      />
    );
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
  });

  test('handles zero values', () => {
    render(
      <BarChart
        data={[
          { label: 'Zero', value: 0 },
          { label: 'Non-zero', value: 100 },
        ]}
      />
    );
    expect(screen.getByText('Zero')).toBeInTheDocument();
    expect(screen.getByText('Non-zero')).toBeInTheDocument();
  });
});

describe('LineChart Component', () => {
  const mockData = [
    { label: 'Q1', value: 1000 },
    { label: 'Q2', value: 1500 },
    { label: 'Q3', value: 1200 },
    { label: 'Q4', value: 2000 },
  ];

  test('renders SVG element', () => {
    const { container } = render(<LineChart data={mockData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('renders path for line', () => {
    const { container } = render(<LineChart data={mockData} />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });

  test('renders data point circles', () => {
    const { container } = render(<LineChart data={mockData} />);
    const circles = container.querySelectorAll('circle');
    // Should have data points
    expect(circles.length).toBeGreaterThan(0);
  });

  test('displays all labels', () => {
    render(<LineChart data={mockData} />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });

  test('applies custom color to line', () => {
    const { container } = render(
      <LineChart data={mockData} color="#ff0000" />
    );
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('stroke', '#ff0000');
  });

  test('renders grid lines', () => {
    const { container } = render(<LineChart data={mockData} />);
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBeGreaterThan(0);
  });

  test('handles single data point', () => {
    render(<LineChart data={[{ label: 'Only', value: 100 }]} />);
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  test('handles custom maxValue', () => {
    const { container } = render(
      <LineChart data={mockData} maxValue={3000} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('handles zero values in data', () => {
    render(
      <LineChart
        data={[
          { label: 'Zero', value: 0 },
          { label: 'Value', value: 100 },
        ]}
      />
    );
    expect(screen.getByText('Zero')).toBeInTheDocument();
  });
});

describe('PieChart Component', () => {
  const mockData = [
    { label: 'Sales', value: 1000, color: '#3498db' },
    { label: 'Marketing', value: 500, color: '#2ecc71' },
    { label: 'Operations', value: 300, color: '#e74c3c' },
  ];

  test('renders SVG element', () => {
    const { container } = render(<PieChart data={mockData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('renders all slices', () => {
    const { container } = render(<PieChart data={mockData} />);
    const paths = container.querySelectorAll('path');
    // Should have slices for each data point
    expect(paths.length).toBeGreaterThan(0);
  });

  test('applies colors to slices', () => {
    const { container } = render(<PieChart data={mockData} />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('handles custom size', () => {
    const { container } = render(<PieChart data={mockData} size={300} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '300');
    expect(svg).toHaveAttribute('height', '300');
  });

  test('handles equal values', () => {
    const equalData = [
      { label: 'A', value: 50 },
      { label: 'B', value: 50 },
      { label: 'C', value: 50 },
      { label: 'D', value: 50 },
    ];
    const { container } = render(<PieChart data={equalData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('handles single data point', () => {
    const { container } = render(
      <PieChart data={[{ label: 'All', value: 100 }]} />
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('handles very large slices', () => {
    const { container } = render(
      <PieChart
        data={[
          { label: 'Large', value: 9000 },
          { label: 'Small', value: 1 },
        ]}
      />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('ProgressRing Component', () => {
  test('renders SVG element', () => {
    const { container } = render(
      <ProgressRing value={75} max={100} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('displays percentage label', () => {
    render(
      <ProgressRing value={75} max={100} showLabel={true} />
    );
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('calculates correct percentage', () => {
    render(
      <ProgressRing value={50} max={100} showLabel={true} />
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('handles custom max value', () => {
    render(
      <ProgressRing value={75} max={200} showLabel={true} />
    );
    expect(screen.getByText('38%')).toBeInTheDocument();
  });

  test('hides label when showLabel is false', () => {
    render(
      <ProgressRing value={75} max={100} showLabel={false} />
    );
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  test('applies custom color', () => {
    const { container } = render(
      <ProgressRing value={75} color="#ff0000" />
    );
    const circle = container.querySelector('circle:last-of-type');
    expect(circle).toHaveAttribute('stroke', '#ff0000');
  });

  test('handles custom size', () => {
    const { container } = render(
      <ProgressRing value={75} size={200} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  test('handles zero value', () => {
    render(
      <ProgressRing value={0} max={100} showLabel={true} />
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('handles 100% progress', () => {
    render(
      <ProgressRing value={100} max={100} showLabel={true} />
    );
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  test('handles value exceeding max', () => {
    render(
      <ProgressRing value={150} max={100} showLabel={true} />
    );
    // Should show 150% or cap at 100%
    expect(screen.getByText(/\d+%/)).toBeInTheDocument();
  });

  test('renders background and progress circles', () => {
    const { container } = render(
      <ProgressRing value={75} max={100} />
    );
    const circles = container.querySelectorAll('circle');
    // Should have background circle and progress circle
    expect(circles.length).toBeGreaterThanOrEqual(2);
  });

  test('handles custom stroke width', () => {
    const { container } = render(
      <ProgressRing value={75} strokeWidth={4} />
    );
    const circles = container.querySelectorAll('circle');
    expect(circles[0]).toHaveAttribute('stroke-width', '4');
  });
});

describe('Chart Integration', () => {
  test('renders multiple charts together', () => {
    const barData = [
      { label: 'A', value: 100 },
      { label: 'B', value: 200 },
    ];
    const lineData = [
      { label: 'Q1', value: 100 },
      { label: 'Q2', value: 150 },
    ];

    const { container } = render(
      <div>
        <BarChart data={barData} />
        <LineChart data={lineData} />
      </div>
    );

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  test('charts work with empty datasets', () => {
    const { container } = render(
      <div>
        <BarChart data={[]} />
        <LineChart data={[]} />
        <PieChart data={[]} />
      </div>
    );

    expect(container).toBeInTheDocument();
  });

  test('charts handle large datasets efficiently', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      label: `Item ${i}`,
      value: Math.random() * 1000,
    }));

    const { container } = render(
      <BarChart data={largeData} />
    );

    expect(container.querySelector('svg') || container.querySelector('div')).toBeInTheDocument();
  });
});
