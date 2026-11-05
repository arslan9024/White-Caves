/**
 * White Caves Real Estate LLC - Deal Manager Unit Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DealManagerView } from './DealManagerView';
import { CANONICAL_DEALS } from './DealManager.data';
import { executeValidateDealGates, calculateDealCommission } from './DealManager.workflow';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('DealManager Suite (7-Category Architecture Standard)', () => {
  it('renders workspace title, metrics deck, and canonical deal cards', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    expect(screen.getByText(/Deal Tracking & Revenue Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Deals Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Gross Commission/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed Sales Volume/i)).toBeInTheDocument();

    // Check first canonical deal
    expect(screen.getByText('DAMAC Hills 2 Luxury Villa Annual Lease')).toBeInTheDocument();
    expect(screen.getByTestId('deal-card-DEAL-001')).toBeInTheDocument();
  });

  it('filters deals by type toggle (Leasing vs Sales)', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const salesBtn = screen.getByTestId('toggle-type-sales');
    fireEvent.click(salesBtn);

    // Sales deals should remain visible
    expect(
      screen.getByText('Palm Jumeirah Signature Beachfront Villa Acquisition')
    ).toBeInTheDocument();
    // Leasing deal should be filtered out
    expect(screen.queryByText('DAMAC Hills 2 Luxury Villa Annual Lease')).not.toBeInTheDocument();
  });

  it('filters deals by search query', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const searchInput = screen.getByTestId('deal-search-input');
    fireEvent.change(searchInput, { target: { value: 'Il Primo' } });

    expect(screen.getByText('Il Primo Full-Floor Sky Penthouse Sale')).toBeInTheDocument();
    expect(screen.queryByText('DAMAC Hills 2 Luxury Villa Annual Lease')).not.toBeInTheDocument();
  });

  it('opens deal inspection detail modal when clicking Inspect Deal', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const inspectBtn = screen.getByTestId('inspect-deal-DEAL-001');
    fireEvent.click(inspectBtn);

    expect(screen.getByTestId('deal-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/CHQ-1001/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hassan Al-Nuaimi/i).length).toBeGreaterThan(0);

    // Close modal
    const closeBtn = screen.getByTestId('close-deal-modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('deal-detail-modal')).not.toBeInTheDocument();
  });

  it('auto-opens detail modal when selectedDealId prop is provided (deep link)', () => {
    renderWithRouter(<DealManagerView selectedDealId="DEAL-003" initialDeals={CANONICAL_DEALS} />);

    expect(screen.getByTestId('deal-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Sir Arthur Pendelton/i).length).toBeGreaterThan(0);
  });

  it('advances deal stage via modal status select', () => {
    renderWithRouter(<DealManagerView selectedDealId="DEAL-002" initialDeals={CANONICAL_DEALS} />);

    const statusSelect = screen.getByTestId('deal-status-select');
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } });

    expect(screen.getAllByText(/Revenue Booked/i).length).toBeGreaterThan(0);
  });

  it('opens create drawer and registers a new deal', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const createBtn = screen.getByTestId('create-deal-btn');
    fireEvent.click(createBtn);

    expect(screen.getByTestId('deal-edit-drawer')).toBeInTheDocument();

    const titleInput = screen.getByTestId('deal-title-input');
    fireEvent.change(titleInput, { target: { value: 'Downtown Dubai Penthouse Lease' } });

    const clientInput = screen.getByTestId('deal-client-input');
    fireEvent.change(clientInput, { target: { value: 'Karim Benzema' } });

    const saveBtn = screen.getByTestId('save-deal-btn');
    fireEvent.click(saveBtn);

    expect(screen.queryByTestId('deal-edit-drawer')).not.toBeInTheDocument();
    expect(screen.getByText('Downtown Dubai Penthouse Lease')).toBeInTheDocument();
  });

  it('validates deal gates correctly in workflow', () => {
    const completedDeal = CANONICAL_DEALS[0];
    const result = executeValidateDealGates(completedDeal);

    expect(result.gates.titleDeedGate).toBe(true);
    expect(result.gates.kycGate).toBe(true);
    expect(result.gates.offerGate).toBe(true);
    expect(result.gates.pdcScheduleGate).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('calculates deal commission and UAE VAT correctly', () => {
    const leasingCalc = calculateDealCommission(180000, 'LEASING');
    expect(leasingCalc.commissionAED).toBe(9000); // 5%
    expect(leasingCalc.vatAED).toBe(450); // 5% VAT on commission

    const salesCalc = calculateDealCommission(45000000, 'SALES');
    expect(salesCalc.commissionAED).toBe(900000); // 2%
    expect(salesCalc.vatAED).toBe(45000);
  });
});
