/**
 * InsightsTab.test.tsx — Batch 31
 * Comprehensive tests for InsightsTab component
 * Covers: rendering, KPI calculations, pipeline stats, lead breakdowns,
 *         edge cases (empty leads, zero values), recommendations section
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ─── Mock useLeadsData ──────────────────────────────────────────────────
const mockUseLeadsData = vi.fn();
vi.mock('../../hooks/useLeadsData', () => ({
  useLeadsData: () => mockUseLeadsData(),
}));

import InsightsTab from '../InsightsTab';

// ─── Helpers ────────────────────────────────────────────────────────────
function makeLead(overrides: Record<string, unknown> = {}) {
  return {
    id: `lead-${Math.random()}`,
    name: 'Test Lead',
    type: 'commercial',
    size: 'medium',
    status: 'qualified',
    value: 100000,
    stage: 'proposal',
    probability: 75,
    ...overrides,
  };
}

function defaultHookReturn(overrides: Record<string, unknown> = {}) {
  const leads = [
    makeLead({ type: 'commercial', size: 'enterprise', status: 'qualified', value: 150000, stage: 'proposal' }),
    makeLead({ type: 'startup', size: 'small', status: 'interested', value: 50000, stage: 'discovery' }),
    makeLead({ type: 'enterprise', size: 'enterprise', status: 'qualified', value: 300000, stage: 'negotiation' }),
    makeLead({ type: 'sme', size: 'medium', status: 'contacted', value: 30000, stage: 'initial_contact' }),
    makeLead({ type: 'commercial', size: 'large', status: 'qualified', value: 200000, stage: 'contract_review' }),
  ];
  return {
    leads,
    stats: {
      totalLeads: 5,
      qualifiedLeads: 3,
      totalValue: 730000,
      avgProbability: 60,
      stageCounts: {
        initial_contact: 1,
        discovery: 1,
        proposal: 1,
        negotiation: 1,
        contract_review: 1,
        closed_won: 0,
        closed_lost: 0,
      },
    },
    ...overrides,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('InsightsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLeadsData.mockReturnValue(defaultHookReturn());
  });

  // ── Rendering ──

  it('renders the Analytics & Insights header', () => {
    render(<InsightsTab />);
    expect(screen.getByText('Analytics & Insights')).toBeInTheDocument();
    expect(screen.getByText('Key metrics and performance indicators')).toBeInTheDocument();
  });

  it('renders all 6 main KPI cards', () => {
    render(<InsightsTab />);
    expect(screen.getByText('Total Pipeline Value')).toBeInTheDocument();
    expect(screen.getByText('Qualified Leads')).toBeInTheDocument();
    expect(screen.getByText('Average Deal Size')).toBeInTheDocument();
    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('Sales Cycle')).toBeInTheDocument();
    expect(screen.getByText('Forecast Accuracy')).toBeInTheDocument();
  });

  // ── KPI Calculations ──

  it('displays correct pipeline value (totalValue / 1000)', () => {
    render(<InsightsTab />);
    // 730000 / 1000 = 730 → "$730K"
    expect(screen.getByText('$730K')).toBeInTheDocument();
  });

  it('displays qualified leads count', () => {
    render(<InsightsTab />);
    // stats.qualifiedLeads = 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays correct qualified percentage', () => {
    render(<InsightsTab />);
    // 3/5 = 60%
    expect(screen.getByText('60% of total')).toBeInTheDocument();
  });

  it('displays correct average deal size', () => {
    render(<InsightsTab />);
    // 730000 / 3 = 243333 → 243333/1000 = 243 → "$243K"
    expect(screen.getByText('$243K')).toBeInTheDocument();
  });

  it('displays active opportunities count', () => {
    render(<InsightsTab />);
    expect(screen.getByText('5 active opportunities')).toBeInTheDocument();
  });

  it('displays in-progress count (leads - qualified)', () => {
    render(<InsightsTab />);
    // 5 - 3 = 2
    expect(screen.getByText('2 in progress')).toBeInTheDocument();
  });

  it('displays hardcoded win rate (68%)', () => {
    render(<InsightsTab />);
    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('displays hardcoded forecast accuracy (92%)', () => {
    render(<InsightsTab />);
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  // ── Breakdown by Type ──

  it('renders "Leads by Company Type" section', () => {
    render(<InsightsTab />);
    expect(screen.getByText('Leads by Company Type')).toBeInTheDocument();
  });

  it('shows lead counts by type', () => {
    render(<InsightsTab />);
    // commercial: 2, startup: 1, enterprise: 1, sme: 1
    expect(screen.getByText('commercial')).toBeInTheDocument();
    expect(screen.getByText('startup')).toBeInTheDocument();
    // 'enterprise' appears both as type and size, use getAllByText
    expect(screen.getAllByText('enterprise').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('sme')).toBeInTheDocument();
  });

  // ── Breakdown by Size ──

  it('renders "Leads by Company Size" section', () => {
    render(<InsightsTab />);
    expect(screen.getByText('Leads by Company Size')).toBeInTheDocument();
  });

  it('shows lead counts by size', () => {
    render(<InsightsTab />);
    // We only check for the size labels
    expect(screen.getByText('small')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('large')).toBeInTheDocument();
  });

  // ── Pipeline by Stage ──

  it('renders "Pipeline by Stage" section', () => {
    render(<InsightsTab />);
    expect(screen.getByText('Pipeline by Stage')).toBeInTheDocument();
  });

  it('renders stage names with underscores replaced by spaces', () => {
    render(<InsightsTab />);
    expect(screen.getByText('initial contact')).toBeInTheDocument();
    expect(screen.getByText('contract review')).toBeInTheDocument();
  });

  // ── Recommendations ──

  it('renders recommendations section', () => {
    render(<InsightsTab />);
    expect(screen.getByText('✨ Recommendations')).toBeInTheDocument();
    expect(screen.getByText(/pipeline is performing 68% above industry average/)).toBeInTheDocument();
  });

  // ── Edge Cases ──

  it('handles empty leads array', () => {
    mockUseLeadsData.mockReturnValue({
      leads: [],
      stats: {
        totalLeads: 0,
        qualifiedLeads: 0,
        totalValue: 0,
        avgProbability: 0,
        stageCounts: {},
      },
    });
    render(<InsightsTab />);
    // $0K appears in both pipeline value and avg deal size cards
    expect(screen.getAllByText('$0K').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('0% of total')).toBeInTheDocument();
    expect(screen.getByText('0 active opportunities')).toBeInTheDocument();
  });

  it('handles zero qualified leads (avgDealSize = 0)', () => {
    mockUseLeadsData.mockReturnValue({
      leads: [makeLead({ status: 'contacted' })],
      stats: {
        totalLeads: 1,
        qualifiedLeads: 0,
        totalValue: 100000,
        avgProbability: 50,
        stageCounts: { proposal: 1 },
      },
    });
    render(<InsightsTab />);
    // avgDealSize should be 0 when qualifiedLeads = 0
    // In the KPI "Across 0 deals"
    expect(screen.getByText('Across 0 deals')).toBeInTheDocument();
  });

  it('renders correct number of stat change indicators', () => {
    render(<InsightsTab />);
    // All 6 KPI cards have "positive" class changes
    expect(screen.getByText('↑ 12% from last month')).toBeInTheDocument();
    expect(screen.getByText('↑ 8% from baseline')).toBeInTheDocument();
    expect(screen.getByText('↑ 5% trend')).toBeInTheDocument();
    expect(screen.getByText('↓ 12% faster')).toBeInTheDocument();
    expect(screen.getByText('↑ 3% improvement')).toBeInTheDocument();
  });

  it('renders sales cycle card with static value', () => {
    render(<InsightsTab />);
    expect(screen.getByText('34 days')).toBeInTheDocument();
    expect(screen.getByText('vs. previous year')).toBeInTheDocument();
  });

  it('renders industry average reference', () => {
    render(<InsightsTab />);
    expect(screen.getByText('Industry average: 42%')).toBeInTheDocument();
  });

  it('renders last 12 months detail', () => {
    render(<InsightsTab />);
    expect(screen.getByText('Last 12 months')).toBeInTheDocument();
  });
});
