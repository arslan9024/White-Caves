// FILE: src/components/crm/TenantManager/TenantManager.test.tsx
/**
 * White Caves Real Estate LLC - Tenant Manager Vitest Assertions
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TenantManagerView } from './TenantManagerView';
import { TenantManagerFallback } from './TenantManager.fallback';
import {
  calculateTenantMetrics,
  executeDigitalSignature,
  updateSnagItemStatus,
} from './TenantManager.workflow';
import {
  INITIAL_TENANT_LEASE,
  INITIAL_TENANT_PAYMENTS,
  INITIAL_INSPECTION_ITEMS,
  INITIAL_TENANT_TICKETS,
} from './TenantManager.data';

describe('TenantManager Suite (12-Way Co-Location Blueprint)', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders tenant portal title, property details, and active lease metrics', () => {
    render(<TenantManagerView />);

    expect(screen.getByText('Sovereign Tenant Portal')).toBeInTheDocument();
    expect(screen.getAllByText(/Marina Gate Tower 1 Luxury 2BR/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Annual Rent/i)).toBeInTheDocument();
    expect(screen.getByText(/Paid to Date/i)).toBeInTheDocument();
  });

  it('switches navigation tabs to payments, maintenance, and inspection checklist', () => {
    render(<TenantManagerView />);

    // Click Payments tab
    const payTab = screen.getByTestId('tab-tenant-payments');
    fireEvent.click(payTab);
    expect(screen.getByText('Rental Payment Schedule & Official Receipts')).toBeInTheDocument();
    expect(screen.getByText('1st Installment (Move-in Q1)')).toBeInTheDocument();

    // Click Maintenance tab
    const maintTab = screen.getByTestId('tab-tenant-maintenance');
    fireEvent.click(maintTab);
    expect(screen.getByText('Active Maintenance Tickets & Repair Requests')).toBeInTheDocument();
    expect(screen.getByText('TKT-AC-302')).toBeInTheDocument();

    // Click Inspection Snag Checklist tab
    const snagTab = screen.getByTestId('tab-tenant-inspection');
    fireEvent.click(snagTab);
    expect(screen.getByText('Move-in Handover & Snag Checklist Protocol')).toBeInTheDocument();
    expect(screen.getByText('Balcony Sliding Door Seal')).toBeInTheDocument();
  });

  it('resolves snag item when Accept Resolution is clicked', () => {
    render(<TenantManagerView />);

    const snagTab = screen.getByTestId('tab-tenant-inspection');
    fireEvent.click(snagTab);

    const resolveBtn = screen.getByTestId('btn-resolve-snag-snag-003');
    fireEvent.click(resolveBtn);

    expect(resolveBtn).not.toBeInTheDocument();
  });

  it('calculates tenant metrics correctly in pure workflow', () => {
    const metrics = calculateTenantMetrics(
      INITIAL_TENANT_LEASE,
      INITIAL_TENANT_PAYMENTS,
      INITIAL_TENANT_TICKETS,
      INITIAL_INSPECTION_ITEMS
    );

    expect(metrics.annualRentAed).toBe(165000);
    expect(metrics.totalPaidAed).toBe(82500);
    expect(metrics.openTicketsCount).toBe(2);
    expect(metrics.snagItemsCount).toBe(1);
  });

  it('executes digital lease signature in pure workflow', () => {
    const unsigned = { ...INITIAL_TENANT_LEASE, isSignedDigitally: false };
    const signed = executeDigitalSignature(unsigned);

    expect(signed.isSignedDigitally).toBe(true);
    expect(signed.signedAt).toBeDefined();
  });

  it('updates snag item status in pure workflow', () => {
    const updated = updateSnagItemStatus(INITIAL_INSPECTION_ITEMS, 'snag-003', 'resolved');
    const target = updated.find(i => i.id === 'snag-003');
    expect(target?.status).toBe('resolved');
  });

  it('renders TenantManagerFallback with error and calls onRetry', () => {
    const onRetry = vi.fn();
    render(<TenantManagerFallback error="UAE PASS auth gateway error" onRetry={onRetry} />);

    expect(screen.getByTestId('tenant-manager-fallback')).toBeInTheDocument();
    expect(screen.getByText('UAE PASS auth gateway error')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Retry Workspace/i });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
