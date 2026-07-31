import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardConfigurator from './DashboardConfigurator';
import type { DashboardWidgetOption } from './DashboardConfigurator';

const widgets: DashboardWidgetOption[] = [
  { id: 'kpi', label: 'KPI Strip', enabled: true, description: 'Key performance indicators' },
  { id: 'feed', label: 'Activity Feed', enabled: false },
  { id: 'chart', label: 'Revenue Chart', enabled: true, description: 'Monthly revenue trend' },
];

describe('DashboardConfigurator', () => {
  it('renders all widget toggles', () => {
    render(<DashboardConfigurator widgets={widgets} onToggleWidget={vi.fn()} />);
    expect(screen.getByText('KPI Strip')).toBeInTheDocument();
    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(screen.getByText('Revenue Chart')).toBeInTheDocument();
  });

  it('displays the enabled count correctly', () => {
    render(<DashboardConfigurator widgets={widgets} onToggleWidget={vi.fn()} />);
    expect(screen.getByText('2 of 3 enabled')).toBeInTheDocument();
  });

  it('calls onToggleWidget when a checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(<DashboardConfigurator widgets={widgets} onToggleWidget={onToggle} />);
    const checkbox = screen.getByLabelText('Activity Feed');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('feed', true);
  });

  it('renders Reset button when onReset is provided', () => {
    const onReset = vi.fn();
    render(<DashboardConfigurator widgets={widgets} onToggleWidget={vi.fn()} onReset={onReset} />);
    fireEvent.click(screen.getByLabelText('Reset dashboard configuration'));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('shows empty state when no widgets are provided', () => {
    render(<DashboardConfigurator widgets={[]} onToggleWidget={vi.fn()} />);
    expect(screen.getByText('No widgets available to configure.')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <DashboardConfigurator widgets={widgets} onToggleWidget={vi.fn()} title="Widget Settings" />
    );
    expect(screen.getByText('Widget Settings')).toBeInTheDocument();
  });
});
