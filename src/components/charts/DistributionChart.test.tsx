/**
 * DistributionChart Component Tests
 * Tests: rendering, title, default/custom data, colors, hover effects,
 *        legend, tooltip
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DistributionChart from './DistributionChart';

// Mock recharts — render minimal elements with testids
vi.mock('recharts', () => {
  const MockPie = ({ children, data, onMouseEnter, onMouseLeave }: any) => (
    <div data-testid="pie">
      {data?.map((d: any, i: number) => (
        <div key={i} data-testid={`pie-slice-${i}`}
          onMouseEnter={() => onMouseEnter?.(d, i)}
          onMouseLeave={() => onMouseLeave?.()}
        >
          {d.name}: {d.value}
        </div>
      ))}
      {children}
    </div>
  );
  return {
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Pie: MockPie,
    Cell: ({ fill }: any) => <div data-testid="cell" style={{ background: fill }} />,
    Legend: ({ formatter }: any) => {
      // Call formatter if present to verify it works
      if (formatter) {
        const result = formatter('Test', { payload: { value: 50 } });
        return <div data-testid="legend">{result}</div>;
      }
      return <div data-testid="legend" />;
    },
    Tooltip: ({ content }: any) => {
      if (content) {
        const Content = content.type || content;
        return <div data-testid="tooltip"><Content active payload={[{ name: 'A', value: 10 }]} /></div>;
      }
      return <div data-testid="tooltip" />;
    },
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('DistributionChart', () => {
  // ─── Rendering ────────────────────────────────────────
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<DistributionChart />);
      expect(screen.getByText('Distribution')).toBeInTheDocument();
    });

    it('renders custom title', () => {
      render(<DistributionChart title="Property Types" />);
      expect(screen.getByText('Property Types')).toBeInTheDocument();
    });

    it('renders inside ResponsiveContainer', () => {
      render(<DistributionChart />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders container div with correct class', () => {
      const { container } = render(<DistributionChart />);
      expect(container.querySelector('.distribution-chart-container')).toBeInTheDocument();
    });
  });

  // ─── Default Data ────────────────────────────────────
  describe('default data', () => {
    it('uses default data when no data prop', () => {
      render(<DistributionChart />);
      expect(screen.getByText(/Category A/)).toBeInTheDocument();
      expect(screen.getByText(/Category B/)).toBeInTheDocument();
    });

    it('uses default data when empty array', () => {
      render(<DistributionChart data={[]} />);
      expect(screen.getByText(/Category A/)).toBeInTheDocument();
    });
  });

  // ─── Custom Data ─────────────────────────────────────
  describe('custom data', () => {
    const customData = [
      { name: 'Villas', value: 40 },
      { name: 'Apartments', value: 35 },
      { name: 'Townhouses', value: 25 },
    ];

    it('renders custom data slices', () => {
      render(<DistributionChart data={customData} />);
      expect(screen.getByText(/Villas/)).toBeInTheDocument();
      expect(screen.getByText(/Apartments/)).toBeInTheDocument();
      expect(screen.getByText(/Townhouses/)).toBeInTheDocument();
    });

    it('renders correct number of pie slices', () => {
      render(<DistributionChart data={customData} />);
      expect(screen.getAllByTestId(/pie-slice/)).toHaveLength(3);
    });
  });

  // ─── Chart Components ─────────────────────────────────
  describe('chart sub-components', () => {
    it('renders PieChart', () => {
      render(<DistributionChart />);
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('renders Pie', () => {
      render(<DistributionChart />);
      expect(screen.getByTestId('pie')).toBeInTheDocument();
    });

    it('renders Legend', () => {
      render(<DistributionChart />);
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('renders Tooltip', () => {
      render(<DistributionChart />);
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  // ─── Hover / Interaction ──────────────────────────────
  describe('hover interaction', () => {
    it('handles mouse enter on pie slice', () => {
      render(<DistributionChart />);
      const slices = screen.getAllByTestId(/pie-slice/);
      // Should not throw
      slices[0].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    it('handles mouse leave on pie slice', () => {
      render(<DistributionChart />);
      const slices = screen.getAllByTestId(/pie-slice/);
      slices[0].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
  });

  // ─── Props ────────────────────────────────────────────
  describe('props', () => {
    it('accepts custom inner radius', () => {
      render(<DistributionChart innerRadius={80} />);
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('accepts custom colors', () => {
      render(<DistributionChart colors={['#FF0000', '#00FF00']} />);
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('accepts custom height', () => {
      render(<DistributionChart height={400} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});
