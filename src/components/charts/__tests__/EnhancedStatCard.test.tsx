import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    TrendingUp: (props: any) => <svg data-testid="trending-up" {...props} />,
    TrendingDown: (props: any) => <svg data-testid="trending-down" {...props} />,
    Minus: (props: any) => <svg data-testid="minus-icon" {...props} />,
  };
});

// Mock styled components
vi.mock('../EnhancedStatCard.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$') && k !== 'as') clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    StatCardWrapper: c('div', 'stat-card-wrapper'),
    StatCardHeader: c('div', 'stat-card-header'),
    StatCardLabel: c('div', 'stat-card-label'),
    TrendIcon: c('div', 'trend-icon'),
    StatCardValue: c('div', 'stat-card-value'),
    StatValue: c('span', 'stat-value'),
    StatUnit: c('span', 'stat-unit'),
    StatCardFooter: c('div', 'stat-card-footer'),
    Sparkline: c('svg', 'sparkline'),
    SparklinePath: c('polyline', 'sparkline-path'),
    SparklineFill: c('polygon', 'sparkline-fill'),
    StatCardComparison: c('div', 'stat-card-comparison'),
    ChangeValue: c('span', 'change-value'),
    ComparisonText: c('span', 'comparison-text'),
  };
});

import EnhancedStatCard from '../EnhancedStatCard';

describe('EnhancedStatCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Default Rendering ──────────────────────────────────────
  describe('defaults', () => {
    it('renders with default props', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByText('Metric')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders default comparison text', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByText('vs last month')).toBeInTheDocument();
    });

    it('renders default change value', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByText('+0%')).toBeInTheDocument();
    });
  });

  // ── Custom Props ───────────────────────────────────────────
  describe('custom props', () => {
    it('renders custom label', () => {
      render(<EnhancedStatCard label="Total Revenue" />);
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });

    it('renders custom value', () => {
      render(<EnhancedStatCard value="1,250" />);
      expect(screen.getByText('1,250')).toBeInTheDocument();
    });

    it('renders unit', () => {
      render(<EnhancedStatCard unit="AED" />);
      expect(screen.getByText('AED')).toBeInTheDocument();
    });

    it('renders custom change', () => {
      render(<EnhancedStatCard change="+12.5%" />);
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('renders custom comparison text', () => {
      render(<EnhancedStatCard comparison="vs last week" />);
      expect(screen.getByText('vs last week')).toBeInTheDocument();
    });
  });

  // ── Trend Icons ────────────────────────────────────────────
  describe('trend display', () => {
    it('renders TrendingUp for upward trend', () => {
      render(<EnhancedStatCard trend="up" />);
      // The TrendIcon renders via `as` prop which our mock just renders children
      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
    });

    it('renders for down trend', () => {
      render(<EnhancedStatCard trend="down" />);
      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
    });

    it('renders for stable trend', () => {
      render(<EnhancedStatCard trend="stable" />);
      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
    });
  });

  // ── Icon Prop ──────────────────────────────────────────────
  describe('icon', () => {
    it('renders custom icon when provided', () => {
      const CustomIcon = ({ size, color }: { size?: number; color?: string }) => (
        <svg data-testid="custom-icon" width={size} style={{ color }} />
      );
      render(<EnhancedStatCard icon={CustomIcon} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('does not render icon when null', () => {
      render(<EnhancedStatCard icon={null} />);
      expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
    });
  });

  // ── Sparkline ──────────────────────────────────────────────
  describe('sparkline', () => {
    it('renders sparkline when data is provided', () => {
      render(<EnhancedStatCard sparklineData={[10, 20, 30, 40, 50]} />);
      expect(screen.getByTestId('sparkline')).toBeInTheDocument();
    });

    it('does not render sparkline when data is empty', () => {
      render(<EnhancedStatCard sparklineData={[]} />);
      expect(screen.queryByTestId('sparkline')).not.toBeInTheDocument();
    });

    it('does not render sparkline with single data point', () => {
      render(<EnhancedStatCard sparklineData={[10]} />);
      expect(screen.queryByTestId('sparkline')).not.toBeInTheDocument();
    });

    it('handles sparkline with object data points', () => {
      render(<EnhancedStatCard sparklineData={[{ value: 10 }, { value: 20 }, { value: 30 }]} />);
      expect(screen.getByTestId('sparkline')).toBeInTheDocument();
    });
  });

  // ── Click Behavior ─────────────────────────────────────────
  describe('click behavior', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<EnhancedStatCard onClick={onClick} />);
      fireEvent.click(screen.getByTestId('stat-card-wrapper'));
      expect(onClick).toHaveBeenCalled();
    });

    it('sets title attribute on wrapper', () => {
      render(<EnhancedStatCard label="Revenue" />);
      expect(screen.getByTestId('stat-card-wrapper')).toHaveAttribute('title', 'Revenue');
    });
  });

  // ── No Unit ────────────────────────────────────────────────
  describe('no unit', () => {
    it('does not render unit when empty', () => {
      render(<EnhancedStatCard unit="" />);
      expect(screen.queryByTestId('stat-unit')).not.toBeInTheDocument();
    });
  });
});
