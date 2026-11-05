/**
 * REPropertyManager.test.tsx
 * 7-Category Architecture: Test Layer
 * Comprehensive Suite for Real Estate Property Management & Inventory
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { REPropertyManagerView } from './REPropertyManagerView';
import { CANONICAL_RE_PROPERTIES } from './REPropertyManager.data';
import {
  executeCalculateYieldAndROI,
  executeValidateTrakheesiPermit,
} from './REPropertyManager.workflow';

describe('Real Estate Property Management (REproperties) Suite', () => {
  it('renders property management workspace with title, metrics deck, and inventory grid', () => {
    render(<REPropertyManagerView initialProperties={CANONICAL_RE_PROPERTIES} />);

    expect(screen.getByTestId('re-property-manager-view')).toBeInTheDocument();
    expect(screen.getByText(/Real Estate Properties & Inventory Management/i)).toBeInTheDocument();
    expect(screen.getByTestId('property-metrics-row')).toBeInTheDocument();
    expect(screen.getByTestId('properties-cards-grid')).toBeInTheDocument();

    // Check that canonical property cards are present
    expect(screen.getByTestId('property-card-REP-001')).toBeInTheDocument();
    expect(screen.getByText(/Palm Jumeirah Ultra-Luxury Frond N/i)).toBeInTheDocument();
    expect(screen.getByTestId('property-card-REP-002')).toBeInTheDocument();
  });

  it('filters properties dynamically by purpose (BUY vs RENT)', () => {
    render(<REPropertyManagerView initialProperties={CANONICAL_RE_PROPERTIES} />);

    // Click For Lease button
    const forLeaseBtn = screen.getByTestId('toggle-purpose-rent');
    fireEvent.click(forLeaseBtn);

    // Should show Dubai Hills (REP-005) or DIFC (REP-006) which are for RENT
    expect(screen.getByTestId('property-card-REP-005')).toBeInTheDocument();
    expect(screen.queryByTestId('property-card-REP-001')).not.toBeInTheDocument();

    // Click For Sale button
    const forSaleBtn = screen.getByTestId('toggle-purpose-buy');
    fireEvent.click(forSaleBtn);

    expect(screen.getByTestId('property-card-REP-001')).toBeInTheDocument();
    expect(screen.queryByTestId('property-card-REP-005')).not.toBeInTheDocument();
  });

  it('filters properties by location dropdown', () => {
    render(<REPropertyManagerView initialProperties={CANONICAL_RE_PROPERTIES} />);

    const locationSelect = screen.getByTestId('location-filter-select');
    fireEvent.change(locationSelect, { target: { value: 'DAMAC Hills 2' } });

    expect(screen.getByTestId('property-card-REP-004')).toBeInTheDocument();
    expect(screen.queryByTestId('property-card-REP-001')).not.toBeInTheDocument();
  });

  it('searches properties dynamically by keyword', () => {
    render(<REPropertyManagerView initialProperties={CANONICAL_RE_PROPERTIES} />);

    const searchInput = screen.getByTestId('property-search-input');
    fireEvent.change(searchInput, { target: { value: 'Montgomerie' } });

    expect(screen.getByTestId('property-card-REP-002')).toBeInTheDocument();
    expect(screen.queryByTestId('property-card-REP-001')).not.toBeInTheDocument();
  });

  it('opens property inspection detail modal when clicking Inspect Unit', () => {
    render(<REPropertyManagerView initialProperties={CANONICAL_RE_PROPERTIES} />);

    const inspectBtn = screen.getByTestId('inspect-btn-REP-001');
    fireEvent.click(inspectBtn);

    expect(screen.getByTestId('property-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText('TRAK-7840192-A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TD-908124').length).toBeGreaterThan(0);

    // Close modal
    const closeBtn = screen.getByTestId('close-property-modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('property-detail-modal')).not.toBeInTheDocument();
  });

  it('auto-opens detail modal when selectedPropertyId prop is provided (deep link)', () => {
    render(
      <REPropertyManagerView
        selectedPropertyId="REP-003"
        initialProperties={CANONICAL_RE_PROPERTIES}
      />
    );

    expect(screen.getByTestId('property-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Il Primo Full-Floor Sky Penthouse/i).length).toBeGreaterThan(0);
  });

  it('advances property inventory status from AVAILABLE to UNDER_OFFER', () => {
    render(
      <REPropertyManagerView
        selectedPropertyId="REP-001"
        initialProperties={CANONICAL_RE_PROPERTIES}
      />
    );

    const statusSelect = screen.getByTestId('property-status-select');
    fireEvent.change(statusSelect, { target: { value: 'UNDER_OFFER' } });

    expect(statusSelect).toHaveValue('UNDER_OFFER');
  });

  it('opens register new property drawer and adds a property unit', () => {
    render(<REPropertyManagerView initialProperties={CANONICAL_RE_PROPERTIES} />);

    const addBtn = screen.getByTestId('add-property-btn');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('property-edit-drawer')).toBeInTheDocument();

    const titleInput = screen.getByTestId('input-property-title');
    fireEvent.change(titleInput, { target: { value: 'Jumeirah Bay Island Bulgari Mansion' } });

    const priceInput = screen.getByTestId('input-property-price');
    fireEvent.change(priceInput, { target: { value: '160000000' } });

    const submitBtn = screen.getByTestId('submit-property-btn');
    fireEvent.click(submitBtn);

    expect(screen.queryByTestId('property-edit-drawer')).not.toBeInTheDocument();
    expect(screen.getByText('Jumeirah Bay Island Bulgari Mansion')).toBeInTheDocument();
  });

  it('executes calculateYieldAndROI and validateTrakheesiPermit workflows', () => {
    const prop = CANONICAL_RE_PROPERTIES[0];
    const yieldResult = executeCalculateYieldAndROI(prop);

    expect(yieldResult.grossYieldPercent).toBeGreaterThan(0);
    expect(yieldResult.paybackYears).toBeGreaterThan(0);
    expect(yieldResult.estimatedAnnualServiceChargesAED).toBeGreaterThan(0);

    const trakResult = executeValidateTrakheesiPermit(prop);
    expect(trakResult.isValidFormat).toBe(true);
    expect(trakResult.dldPermitActive).toBe(true);
    expect(trakResult.qrVerificationUrl).toContain('dubailand.gov.ae');
  });
});
