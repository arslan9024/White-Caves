/**
 * EnhancedStatCard Component Tests
 * Tests: rendering, label/value/unit, trend icons, sparkline,
 *        comparison, click handler, memoization, custom props
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EnhancedStatCard from './EnhancedStatCard';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  TrendingUp: (props: any) => <svg data-testid="icon-trending-up" {...props} />,
  TrendingDown: (props: any) => <svg data-testid="icon-trending-down" {...props} />,
  Minus: (props: any) => <svg data-testid="icon-minus" {...props} />,
}));

// Mock styled-components
vi.mock('./EnhancedStatCard.styles', () => ({
  StatCardWrapper: ({ children, onClick, title, ...props }: any) => (
    <div data-testid="stat-card" onClick={onClick} title={title}>{children}</div>
  ),
  StatCardHeader: ({ children }: any) => <div data-testid="stat-header">{children}</div>,
  StatCardLabel: ({ children }: any) => <div data-testid="stat-label">{children}</div>,
  TrendIcon: ({ as: Icon, ...props }: any) => Icon ? <Icon data-testid="trend-icon" /> : null,
  StatCardValue: ({ children }: any) => <div data-testid="stat-value-container">{children}</div>,
  StatValue: ({ children }: any) => <span data-testid="stat-value">{children}</span>,
  StatUnit: ({ children }: any) => <span data-testid="stat-unit">{children}</span>,
  StatCardFooter: ({ children }: any) => <div data-testid="stat-footer">{children}</div>,
  Sparkline: ({ children, ...props }: any) => <svg data-testid="sparkline" {...props}>{children}</svg>,
  SparklinePath: (props: any) => <polyline data-testid="sparkline-path" {...props} />,
  SparklineFill: (props: any) => <polygon data-testid="sparkline-fill" {...props} />,
  StatCardComparison: ({ children }: any) => <div data-testid="stat-comparison">{children}</div>,
  ChangeValue: ({ children }: any) => <span data-testid="change-value">{children}</span>,
  ComparisonText: ({ children }: any) => <span data-testid="comparison-text">{children}</span>,
}));

describe('EnhancedStatCard', () => {
  // ─── Default Rendering ────────────────────────────────
  describe('default rendering', () => {
    it('renders without crashing', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByTestId('stat-card')).toBeInTheDocument();
    });

    it('renders default label', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByText('Metric')).toBeInTheDocument();
    });

    it('renders default value', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByTestId('stat-value')).toHaveTextContent('0');
    });

    it('renders default change text', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByTestId('change-value')).toHaveTextContent('+0%');
    });

    it('renders default comparison text', () => {
      render(<EnhancedStatCard />);
      expect(screen.getByTestId('comparison-text')).toHaveTextContent('vs last month');
    });
  });

  // ─── Custom Props ─────────────────────────────────────
  describe('custom props', () => {
    it('renders custom label', () => {
      render(<EnhancedStatCard label="Active Properties" />);
      expect(screen.getByText('Active Properties')).toBeInTheDocument();
    });

    it('renders custom value', () => {
      render(<EnhancedStatCard value="1,250" />);
      expect(screen.getByTestId('stat-value')).toHaveTextContent('1,250');
    });

    it('renders unit when provided', () => {
      render(<EnhancedStatCard unit="AED" />);
      expect(screen.getByTestId('stat-unit')).toHaveTextContent('AED');
    });

    it('does not render unit when empty', () => {
      render(<EnhancedStatCard />);
      expect(screen.queryByTestId('stat-unit')).not.toBeInTheDocument();
    });

    it('renders custom change', () => {
      render(<EnhancedStatCard change="+15.3%" />);
      expect(screen.getByTestId('change-value')).toHaveTextContent('+15.3%');
    });

    it('renders custom comparison', () => {
      render(<EnhancedStatCard comparison="vs last week" />);
      expect(screen.getByTestId('comparison-text')).toHaveTextContent('vs last week');
    });

    it('sets title attribute to label', () => {
      render(<EnhancedStatCard label="Revenue" />);
      expect(screen.getByTestId('stat-card')).toHaveAttribute('title', 'Revenue');
    });
  });

  // ─── Trend Icons ──────────────────────────────────────
  describe('trend icons', () => {
    it('renders trend icon for up trend', () => {
      render(<EnhancedStatCard trend="up" />);
      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
    });

    it('renders trend icon for down trend', () => {
      render(<EnhancedStatCard trend="down" />);
      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
    });

    it('renders trend icon for stable trend', () => {
      render(<EnhancedStatCard trend="stable" />);
      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
    });
  });

  // ─── Custom Icon ──────────────────────────────────────
  describe('custom icon', () => {
    it('renders custom icon component', () => {
      const CustomIcon = (props: any) => <svg data-testid="custom-icon" {...props} />;
      render(<EnhancedStatCard icon={CustomIcon} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('does not render icon when null', () => {
      render(<EnhancedStatCard icon={null} />);
      expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
    });
  });

  // ─── Sparkline ────────────────────────────────────────
  describe('sparkline', () => {
    it('does not render sparkline with empty data', () => {
      render(<EnhancedStatCard sparklineData={[]} />);
      expect(screen.queryByTestId('sparkline')).not.toBeInTheDocument();
    });

    it('does not render sparkline with single data point', () => {
      render(<EnhancedStatCard sparklineData={[42]} />);
      expect(screen.queryByTestId('sparkline')).not.toBeInTheDocument();
    });

    it('renders sparkline with multiple data points', () => {
      render(<EnhancedStatCard sparklineData={[10, 20, 15, 30, 25]} />);
      expect(screen.getByTestId('sparkline')).toBeInTheDocument();
    });

    it('renders sparkline path', () => {
      render(<EnhancedStatCard sparklineData={[10, 20, 15, 30]} />);
      expect(screen.getByTestId('sparkline-path')).toBeInTheDocument();
    });

    it('handles object-form sparkline data', () => {
      render(<EnhancedStatCard sparklineData={[{ value: 10 }, { value: 20 }, { value: 30 }]} />);
      expect(screen.getByTestId('sparkline')).toBeInTheDocument();
    });
  });

  // ─── Click Handler ────────────────────────────────────
  describe('click handler', () => {
    it('calls onClick when provided', () => {
      const onClick = vi.fn();
      render(<EnhancedStatCard onClick={onClick} />);
      fireEvent.click(screen.getByTestId('stat-card'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not crash without onClick', () => {
      render(<EnhancedStatCard />);
      fireEvent.click(screen.getByTestId('stat-card'));
      // No error thrown
    });
  });
});
