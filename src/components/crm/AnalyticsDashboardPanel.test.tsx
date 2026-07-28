import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AnalyticsDashboardPanel } from './AnalyticsDashboardPanel';

describe('AnalyticsDashboardPanel — production quality tests', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(<AnalyticsDashboardPanel />);
    expect(screen.getByText(/Executive Analytics/i)).toBeInTheDocument();
  });

  it('renders lead conversion funnel stages', () => {
    render(<AnalyticsDashboardPanel />);
    expect(screen.getByText('Inbound Leads')).toBeInTheDocument();
    expect(screen.getByText('Contacted / Engaged')).toBeInTheDocument();
    expect(screen.getByText('Deals Closed (Contracts)')).toBeInTheDocument();
  });

  it('renders lead sources performance table', () => {
    render(<AnalyticsDashboardPanel />);
    expect(screen.getByText('Property Finder syndication')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Inbound Automation')).toBeInTheDocument();
  });

  it('allows changing revenue forecast timeframe dropdown', () => {
    render(<AnalyticsDashboardPanel />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: '12' } });
    expect(select).toHaveValue('12');
  });

  it('triggers export without calling window.alert', () => {
    render(<AnalyticsDashboardPanel />);
    const exportBtn = screen.getByText(/Export Forecast Data Sheet/i);
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
