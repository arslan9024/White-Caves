/**
 * MarketAnalyticsModule — Unit Tests
 * Tests: tab switching, KPI cards, agent performance table,
 * market trends, sales by property type, date range
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

import MarketAnalyticsModule from './MarketAnalyticsModule';

describe('MarketAnalyticsModule', () => {
  const defaultProps = {
    role: 'admin',
    user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'admin' },
    data: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ────── Basic Rendering ──────

  it('renders module title', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('Market Analytics & Reporting')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText(/real estate market insights/i)).toBeInTheDocument();
  });

  // ────── Tabs ──────

  it('renders all 3 tab buttons', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('Market Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Agent Performance')).toBeInTheDocument();
    expect(screen.getByText('Trends & Forecasts')).toBeInTheDocument();
  });

  it('shows dashboard tab by default', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('Total Sales (Month)')).toBeInTheDocument();
    expect(screen.getByText('45 deals')).toBeInTheDocument();
  });

  it('switches to agent performance tab', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Agent Performance'));
    expect(screen.getByText('Agent Performance Ranking')).toBeInTheDocument();
    expect(screen.getByText('Ahmed Al-Mansouri')).toBeInTheDocument();
  });

  it('switches to trends tab', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Trends & Forecasts'));
    expect(screen.getByText('Market Trends & Forecasts')).toBeInTheDocument();
    expect(screen.getByText('Dubai Real Estate Market Overview')).toBeInTheDocument();
  });

  it('switches back to dashboard from another tab', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Agent Performance'));
    expect(screen.queryByText('Total Sales (Month)')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Market Dashboard'));
    expect(screen.getByText('Total Sales (Month)')).toBeInTheDocument();
  });

  // ────── Dashboard KPI Cards ──────

  it('renders all 4 KPI cards', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('Total Sales (Month)')).toBeInTheDocument();
    expect(screen.getByText('Total Sales Value')).toBeInTheDocument();
    expect(screen.getByText('Rental Transactions')).toBeInTheDocument();
    expect(screen.getByText('Average Price/sqft')).toBeInTheDocument();
  });

  it('shows KPI values', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('45 deals')).toBeInTheDocument();
    expect(screen.getByText('AED 450M')).toBeInTheDocument();
    expect(screen.getByText('32 deals')).toBeInTheDocument();
    expect(screen.getByText('AED 1,450')).toBeInTheDocument();
  });

  it('shows percentage change indicators', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('↑ 12% from last month')).toBeInTheDocument();
    expect(screen.getByText('↑ 8% from last month')).toBeInTheDocument();
    expect(screen.getByText('→ 0% from last month')).toBeInTheDocument();
    expect(screen.getByText('↑ 2% from last month')).toBeInTheDocument();
  });

  // ────── Sales by Property Type Table ──────

  it('renders property type table', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('Sales by Property Type')).toBeInTheDocument();
    expect(screen.getByText('Apartments')).toBeInTheDocument();
    expect(screen.getByText('Villas')).toBeInTheDocument();
  });

  it('shows market share percentages', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    expect(screen.getByText('62%')).toBeInTheDocument();
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  // ────── Agent Performance Tab ──────

  it('renders agent performance table with all agents', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Agent Performance'));

    expect(screen.getByText('Ahmed Al-Mansouri')).toBeInTheDocument();
    expect(screen.getByText('Fatima Al-Naqbi')).toBeInTheDocument();
    expect(screen.getByText('Mohammed Al-Ketbi')).toBeInTheDocument();
    expect(screen.getByText('Zainab Al-Moradi')).toBeInTheDocument();
  });

  it('shows agent deal sizes', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Agent Performance'));

    expect(screen.getByText('AED 12.5M')).toBeInTheDocument();
    expect(screen.getByText('AED 10.2M')).toBeInTheDocument();
  });

  it('shows agent close rates', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Agent Performance'));

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('shows agent table headers', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Agent Performance'));

    expect(screen.getByText('Agent Name')).toBeInTheDocument();
    expect(screen.getByText('Total Deals')).toBeInTheDocument();
    expect(screen.getByText('Avg Deal Size')).toBeInTheDocument();
    expect(screen.getByText('Commission YTD')).toBeInTheDocument();
    expect(screen.getByText('Close Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Days-to-Close')).toBeInTheDocument();
  });

  // ────── Market Trends Tab ──────

  it('renders market overview list items', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Trends & Forecasts'));

    expect(screen.getByText(/stable with moderate growth/i)).toBeInTheDocument();
    expect(screen.getByText(/4-5% per annum/i)).toBeInTheDocument();
    expect(screen.getByText(/\+2.8%/)).toBeInTheDocument();
  });

  it('renders rental yields table', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Trends & Forecasts'));

    expect(screen.getByText('Rental Yields by Location')).toBeInTheDocument();
    expect(screen.getByText('4.4%')).toBeInTheDocument();
    expect(screen.getByText('4.1%')).toBeInTheDocument();
    expect(screen.getByText('4.8%')).toBeInTheDocument();
  });

  it('renders most active areas', () => {
    render(<MarketAnalyticsModule {...defaultProps} />);
    fireEvent.click(screen.getByText('Trends & Forecasts'));

    expect(screen.getByText(/Marina, Downtown, JBR/)).toBeInTheDocument();
  });
});
