import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardKpiStrip from './DashboardKpiStrip';
import type { KpiCardData } from './DashboardKpiStrip';

const cards: KpiCardData[] = [
  { id: 'leads', icon: '📈', label: 'Active Leads', value: '142', subtext: '+12 this week', trend: '↑ 8%', positive: true },
  { id: 'revenue', icon: '💰', label: 'Monthly Revenue', value: 'AED 1.2M', subtext: 'Target: 1.5M', trend: '↓ 3%', positive: false },
  { id: 'viewings', icon: '🏠', label: 'Viewings', value: '38', subtext: 'This month', trend: '↑ 15%', positive: true },
];

describe('DashboardKpiStrip', () => {
  it('renders the KPI strip section with correct aria-label', () => {
    render(<DashboardKpiStrip cards={cards} />);
    expect(screen.getByLabelText('Dashboard highlights')).toBeInTheDocument();
  });

  it('renders all KPI cards', () => {
    render(<DashboardKpiStrip cards={cards} />);
    expect(screen.getByText('Active Leads')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('Viewings')).toBeInTheDocument();
  });

  it('displays values and trends for each card', () => {
    render(<DashboardKpiStrip cards={cards} />);
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('AED 1.2M')).toBeInTheDocument();
    expect(screen.getByText('↑ 8%')).toBeInTheDocument();
    expect(screen.getByText('↓ 3%')).toBeInTheDocument();
  });

  it('applies positive/negative CSS class to trend indicators', () => {
    const { container } = render(<DashboardKpiStrip cards={cards} />);
    const trends = container.querySelectorAll('.dashboard-kpi-card__trend');
    expect(trends[0]).toHaveClass('positive');
    expect(trends[1]).toHaveClass('negative');
    expect(trends[2]).toHaveClass('positive');
  });

  it('renders nothing when cards array is empty', () => {
    const { container } = render(<DashboardKpiStrip cards={[]} />);
    expect(container.querySelectorAll('.dashboard-kpi-card')).toHaveLength(0);
  });
});
