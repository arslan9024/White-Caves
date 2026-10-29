import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CommandCenter from './CommandCenter';

const fetchAllReports = vi.fn();
const fetchFunnel = vi.fn();
const fetchTrends = vi.fn();
const fetchAgents = vi.fn();
const fetchAging = vi.fn();
const baseReports = () => ({
  executive: { portfolioValue: 1200000, leads: { byStatus: {}, bySource: {} }, properties: { byStatus: {}, byType: {} }, commissions: [] },
  kpis: { newLeads: 12, wonDeals: 3, newListings: 4, totalRevenue: 50000, avgDealSize: 17000 },
  leadFunnel: { funnel: [{ stage: 'new', count: 12, percentage: 60 }], tierDistribution: [], total: 12 },
  trends: { period: '30d', startDate: '2025-01-01', series: [{ date: '2025-01-01', leads: 4, transactions: 1, transactionValue: 10, commissions: 1, commissionValue: 2 }] },
  propertyAging: { totalAvailable: 8, avgDaysOnMarket: 12, buckets: [{ label: '0-7 days', count: 2 }], staleProperties: [] },
  agentPerformance: { agents: [{ id: 'a1', name: 'A. Broker', department: 'Sales', totalLeads: 4, wonLeads: 1, conversionRate: 25, totalCommission: 1000, dealsClosed: 1, activeDeals: 2 }], total: 1 },
  loading: false,
  error: null,
  fetchAllReports,
  fetchFunnel,
  fetchTrends,
  fetchAgents,
  fetchAging,
});
let reports = baseReports();
vi.mock('../../../hooks/crm/useReporting', () => ({ useReporting: () => reports }));

describe('CommandCenter', () => {
  beforeEach(() => {
    reports = baseReports();
    fetchAllReports.mockResolvedValue({ failedCount: 0 });
    vi.clearAllMocks();
  });

  it('renders a successful executive snapshot', async () => {
    render(<CommandCenter serverRole="manager" />);
    expect(await screen.findByText('AED 1,200,000')).toBeInTheDocument();
    expect(screen.getByText('A. Broker')).toBeInTheDocument();
  });

  it('shows initial loading and does not present success metadata', async () => {
    fetchAllReports.mockReturnValue(new Promise(() => undefined));
    render(<CommandCenter serverRole="manager" />);
    expect(await screen.findByRole('button', { name: 'Refreshing…' })).toBeInTheDocument();
    expect(screen.queryByText(/Last complete refresh/)).not.toBeInTheDocument();
  });

  it('labels a partial refresh without claiming a successful refresh', async () => {
    fetchAllReports.mockResolvedValue({ failedCount: 2 });
    render(<CommandCenter serverRole="manager" />);
    expect(await screen.findByText(/Partial refresh/)).toBeInTheDocument();
    expect(screen.queryByText(/Last complete refresh/)).not.toBeInTheDocument();
  });

  it('renders composed empty states from empty server responses', async () => {
    reports = { ...baseReports(), leadFunnel: { funnel: [], tierDistribution: [], total: 0 }, trends: { period: '30d', startDate: '2025-01-01', series: [] }, propertyAging: { totalAvailable: 0, avgDaysOnMarket: 0, buckets: [], staleProperties: [] }, agentPerformance: { agents: [], total: 0 } };
    render(<CommandCenter serverRole="manager" />);
    expect(await screen.findAllByText('No records returned for this period.')).toHaveLength(4);
  });

  it('refreshes on demand and records a complete attempt', async () => {
    render(<CommandCenter serverRole="manager" />);
    const refresh = await screen.findByRole('button', { name: 'Refresh reports' });
    fireEvent.click(refresh);
    await waitFor(() => expect(fetchAllReports).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/Last complete refresh/)).toBeInTheDocument();
  });

  it('gives agents a focused workspace without fetching reports', () => {
    render(<CommandCenter serverRole="agent" />);
    expect(screen.getByTestId('agent-command-center')).toBeInTheDocument();
    expect(screen.getByText('Assigned leads')).toBeInTheDocument();
    expect(fetchAllReports).not.toHaveBeenCalled();
  });

  it('normalizes supported agent aliases into the focused workspace', () => {
    render(<CommandCenter serverRole="sales_agent" />);
    expect(screen.getByTestId('agent-command-center')).toBeInTheDocument();
    expect(screen.getByText('Role: sales agent')).toBeInTheDocument();
    expect(fetchAllReports).not.toHaveBeenCalled();
  });

  it('fails closed for unsupported roles without fetching reports', () => {
    render(<CommandCenter serverRole="contractor" />);
    expect(screen.getByTestId('command-center-unauthorized')).toBeInTheDocument();
    expect(fetchAllReports).not.toHaveBeenCalled();
  });
});