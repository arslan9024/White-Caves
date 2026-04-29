/**
 * RentalManagementPage — Unit Tests
 * Tests: rendering, filter buttons, property cards, tenant info,
 * status badges, conditional rendering, filter logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

vi.mock('../RolePages.css', () => ({}));

import RentalManagementPage from './RentalManagementPage';

describe('RentalManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ────── Basic Rendering ──────

  it('renders page title', () => {
    render(<RentalManagementPage />);
    expect(screen.getByText('Rental Management')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<RentalManagementPage />);
    expect(screen.getByText('Manage your rental properties and tenants')).toBeInTheDocument();
  });

  // ────── Filter Buttons ──────

  it('renders all 3 filter buttons', () => {
    render(<RentalManagementPage />);
    expect(screen.getByRole('button', { name: 'All Properties' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Occupied' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Available' })).toBeInTheDocument();
  });

  it('shows all properties by default', () => {
    render(<RentalManagementPage />);
    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('Downtown Studio')).toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  // ────── Filter Logic ──────

  it('filters to occupied only', () => {
    render(<RentalManagementPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Occupied' }));

    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('Downtown Studio')).toBeInTheDocument();
    expect(screen.queryByText('JBR 3BR Apartment')).not.toBeInTheDocument();
  });

  it('filters to available only', () => {
    render(<RentalManagementPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));

    expect(screen.queryByText('Marina View 2BR Apartment')).not.toBeInTheDocument();
    expect(screen.queryByText('Downtown Studio')).not.toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  it('returns to all when clicking All Properties', () => {
    render(<RentalManagementPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    expect(screen.queryByText('Marina View 2BR Apartment')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All Properties' }));
    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  // ────── Property Card Details ──────

  it('renders property locations', () => {
    render(<RentalManagementPage />);
    expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
    expect(screen.getByText('Downtown Dubai')).toBeInTheDocument();
    expect(screen.getByText('JBR')).toBeInTheDocument();
  });

  it('renders property types', () => {
    render(<RentalManagementPage />);
    expect(screen.getAllByText('Apartment')).toHaveLength(2);
    expect(screen.getByText('Studio')).toBeInTheDocument();
  });

  it('renders rent amounts', () => {
    render(<RentalManagementPage />);
    expect(screen.getByText('AED 95,000/yr')).toBeInTheDocument();
    expect(screen.getByText('AED 65,000/yr')).toBeInTheDocument();
    expect(screen.getByText('AED 180,000/yr')).toBeInTheDocument();
  });

  // ────── Status Badges ──────

  it('renders status badges', () => {
    render(<RentalManagementPage />);
    const occupiedBadges = screen.getAllByText('Occupied');
    // 2 occupied properties = 2 badges (the filter btn also says "Occupied" but is a button)
    expect(occupiedBadges.length).toBeGreaterThanOrEqual(2);
  });

  // ────── Tenant Information (Occupied only) ──────

  it('shows tenant names for occupied properties', () => {
    render(<RentalManagementPage />);
    expect(screen.getByText('Ahmed Al-Rashid')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  it('shows lease end dates for occupied properties', () => {
    render(<RentalManagementPage />);
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jun 30, 2024')).toBeInTheDocument();
  });

  it('does not show tenant info for available properties', () => {
    render(<RentalManagementPage />);
    // JBR 3BR Apartment is available — no tenant shown
    // If we filter to available only, there should be no tenant rows
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    expect(screen.queryByText('Ahmed Al-Rashid')).not.toBeInTheDocument();
    expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument();
  });

  // ────── Action Buttons ──────

  it('renders View Details buttons', () => {
    render(<RentalManagementPage />);
    const viewBtns = screen.getAllByText('View Details');
    expect(viewBtns).toHaveLength(3); // one per property
  });

  it('renders Edit buttons', () => {
    render(<RentalManagementPage />);
    const editBtns = screen.getAllByText('Edit');
    expect(editBtns).toHaveLength(3);
  });

  // ────── Sequential Filter Changes ──────

  it('handles rapid filter changes', () => {
    render(<RentalManagementPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Occupied' }));
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    fireEvent.click(screen.getByRole('button', { name: 'All Properties' }));

    // After cycling through all filters, should show all 3 properties
    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('Downtown Studio')).toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });
});
