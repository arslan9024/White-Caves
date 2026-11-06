// FILE: src/components/crm/LandlordManager/LandlordManager.test.tsx
/**
 * White Caves Real Estate LLC - Landlord Manager Vitest Integration Assertions
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { LandlordManagerView } from './LandlordManagerView';
import { LandlordManagerFallback } from './LandlordManager.fallback';
import { calculateLandlordMetrics, transitionChequeStatus } from './LandlordManager.workflow';
import {
  INITIAL_LANDLORD_PROPERTIES,
  INITIAL_PDC_CHEQUES,
  INITIAL_MAINTENANCE_TICKETS,
} from './LandlordManager.data';

describe('LandlordManager Suite (12-Way Co-Location Blueprint)', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders workspace title, metric cards, and active leases', () => {
    render(<LandlordManagerView />);

    expect(screen.getByText('Sovereign Landlord Asset Hub')).toBeInTheDocument();
    expect(screen.getByText(/Portfolio Properties/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual Gross Rent/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending PDC Inflow/i)).toBeInTheDocument();
    expect(screen.getByText('Marina Gate Tower 1 Luxury 2BR')).toBeInTheDocument();
  });

  it('switches between navigation tabs and renders corresponding widgets', () => {
    render(<LandlordManagerView />);

    // Click PDC Tab
    const pdcTab = screen.getByTestId('tab-pdc');
    fireEvent.click(pdcTab);
    expect(
      screen.getByText('Post-Dated Cheque (PDC) Schedule & Escrow Tracking')
    ).toBeInTheDocument();
    expect(screen.getByText('CHQ-882910')).toBeInTheDocument();

    // Click Maintenance Tab
    const maintTab = screen.getByTestId('tab-maintenance');
    fireEvent.click(maintTab);
    expect(screen.getByText('Tenant Maintenance Requests & Work Orders')).toBeInTheDocument();
    expect(screen.getByText('TKT-HVAC-901')).toBeInTheDocument();

    // Click Yield Tab
    const yieldTab = screen.getByTestId('tab-yield');
    fireEvent.click(yieldTab);
    expect(
      screen.getByText('Dubai Property Yield & Net Rental Cash Flow Analytics')
    ).toBeInTheDocument();
    expect(screen.getByText('Annual Cash Flow Waterfall')).toBeInTheDocument();
  });

  it('updates PDC cheque status when Mark Cleared button is triggered', () => {
    render(<LandlordManagerView />);

    const pdcTab = screen.getByTestId('tab-pdc');
    fireEvent.click(pdcTab);

    // Look for pending cheque CHQ-882911
    const clearBtn = screen.getByTestId('btn-clear-pdc-002');
    fireEvent.click(clearBtn);

    // After click, button should be replaced by Settled status
    expect(clearBtn).not.toBeInTheDocument();
  });

  it('approves work order when Approve Order button is triggered', () => {
    render(<LandlordManagerView />);

    const maintTab = screen.getByTestId('tab-maintenance');
    fireEvent.click(maintTab);

    const approveBtn = screen.getByTestId('btn-approve-tkt-maint-002');
    fireEvent.click(approveBtn);

    expect(approveBtn).not.toBeInTheDocument();
  });

  it('calculates metrics with accuracy in pure workflow engine', () => {
    const metrics = calculateLandlordMetrics(
      INITIAL_LANDLORD_PROPERTIES,
      INITIAL_PDC_CHEQUES,
      INITIAL_MAINTENANCE_TICKETS
    );

    expect(metrics.totalProperties).toBe(4);
    expect(metrics.occupancyRate).toBe(75);
    expect(metrics.totalAnnualRentAed).toBe(1345000);
    expect(metrics.activeMaintenanceTickets).toBe(2);
    expect(metrics.netRentalYieldPercent).toBeGreaterThan(6);
  });

  it('transitions cheque status idempotently in workflow', () => {
    const result = transitionChequeStatus(INITIAL_PDC_CHEQUES, 'pdc-002', 'cleared');
    expect(result.success).toBe(true);
    const target = result.data.find(c => c.id === 'pdc-002');
    expect(target?.status).toBe('cleared');
  });

  it('renders LandlordManagerFallback with error message and retry button', () => {
    const onRetry = vi.fn();
    render(
      <LandlordManagerFallback error="DLD Escrow network connection timed out" onRetry={onRetry} />
    );

    expect(screen.getByTestId('landlord-manager-fallback')).toBeInTheDocument();
    expect(screen.getByText('DLD Escrow network connection timed out')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Gateway/i });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
