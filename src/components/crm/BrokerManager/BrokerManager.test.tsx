// FILE: src/components/crm/BrokerManager/BrokerManager.test.tsx
/**
 * White Caves Real Estate LLC - Broker Manager Vitest Integration Assertions
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { BrokerManagerView } from './BrokerManagerView';
import { BrokerManagerFallback } from './BrokerManager.fallback';
import {
  calculateBrokerCommission,
  calculateBrokerMetrics,
  updateLeadStatus,
} from './BrokerManager.workflow';
import {
  INITIAL_BROKER_DEALS,
  INITIAL_ASSIGNED_LEADS,
  INITIAL_RERA_PROFILE,
} from './BrokerManager.data';

describe('BrokerManager Suite (12-Way Co-Location Blueprint)', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders broker hub title, broker BRN, and metrics cards', () => {
    render(<BrokerManagerView />);

    expect(screen.getByText('Sovereign Licensed Broker Hub')).toBeInTheDocument();
    expect(screen.getByText(/BRN #58492/i)).toBeInTheDocument();
    expect(screen.getByText(/Closed Volume/i)).toBeInTheDocument();
    expect(screen.getByText(/YTD Net Commission/i)).toBeInTheDocument();
  });

  it('switches navigation tabs to commission schedule, leads, and compliance', () => {
    render(<BrokerManagerView />);

    // Click Commission Schedule tab
    const commTab = screen.getByTestId('tab-broker-commissions');
    fireEvent.click(commTab);
    expect(
      screen.getByText('Commission Tracking, UAE VAT 5% & Escrow Payout Schedule')
    ).toBeInTheDocument();
    expect(screen.getByText('WC-DEAL-2026-8801')).toBeInTheDocument();

    // Click Leads tab
    const leadsTab = screen.getByTestId('tab-broker-leads');
    fireEvent.click(leadsTab);
    expect(
      screen.getByText('Assigned High-Net-Worth Client Leads & 15-Minute SLA')
    ).toBeInTheDocument();
    expect(screen.getByText('Maximilian Sterling')).toBeInTheDocument();

    // Click Compliance tab
    const compTab = screen.getByTestId('tab-broker-compliance');
    fireEvent.click(compTab);
    expect(
      screen.getByText('Dubai Land Department RERA Broker Compliance Credentials')
    ).toBeInTheDocument();
  });

  it('updates lead status when Contact Lead is triggered', () => {
    render(<BrokerManagerView />);

    const leadsTab = screen.getByTestId('tab-broker-leads');
    fireEvent.click(leadsTab);

    const contactBtn = screen.getByTestId('btn-contact-lead-brk-101');
    fireEvent.click(contactBtn);

    expect(contactBtn).not.toBeInTheDocument();
    expect(screen.getAllByText(/In Conversation/i).length).toBeGreaterThan(0);
  });

  it('updates deal payout status when Request Payout is clicked', () => {
    render(<BrokerManagerView />);

    const commTab = screen.getByTestId('tab-broker-commissions');
    fireEvent.click(commTab);

    const reqBtn = screen.getByTestId('btn-request-payout-deal-brk-002');
    fireEvent.click(reqBtn);

    expect(reqBtn).not.toBeInTheDocument();
    expect(screen.getAllByText(/Processing DLD Escrow/i).length).toBeGreaterThan(0);
  });

  it('calculates commissions accurately in pure workflow engine', () => {
    const comm = calculateBrokerCommission(10000000, 2.0, 50.0, 5.0);

    expect(comm.grossCommissionAed).toBe(200000);
    expect(comm.vatAmountAed).toBe(10000);
    expect(comm.brokerNetCommissionAed).toBe(100000);
    expect(comm.companyNetCommissionAed).toBe(100000);
  });

  it('calculates broker metrics accurately in pure workflow engine', () => {
    const metrics = calculateBrokerMetrics(
      INITIAL_BROKER_DEALS,
      INITIAL_ASSIGNED_LEADS,
      INITIAL_RERA_PROFILE
    );

    expect(metrics.totalClosedVolumeAed).toBe(55400000);
    expect(metrics.ytdCommissionAed).toBe(554000);
    expect(metrics.activeLeadsCount).toBe(3);
    expect(metrics.reraDaysToExpiry).toBeGreaterThan(0);
  });

  it('updates lead status in pure workflow', () => {
    const updated = updateLeadStatus(INITIAL_ASSIGNED_LEADS, 'lead-brk-101', 'contacted');
    const target = updated.find(l => l.id === 'lead-brk-101');
    expect(target?.status).toBe('contacted');
  });

  it('renders BrokerManagerFallback with error message and retry button', () => {
    const onRetry = vi.fn();
    render(
      <BrokerManagerFallback
        error="DLD Trakheesi Permit Verification Timeout"
        onRetry={onRetry}
      />
    );

    expect(screen.getByTestId('broker-manager-fallback')).toBeInTheDocument();
    expect(
      screen.getByText('DLD Trakheesi Permit Verification Timeout')
    ).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Retry Workspace/i });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
