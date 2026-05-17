/**
 * RentalManagementPage — Unit Tests
 * Tests: rendering, filter buttons, property cards, tenant info,
 * status badges, conditional rendering, filter logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('../RolePages.css', () => ({}));

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import RentalManagementPage from './RentalManagementPage';

const MOCK_LEASES = [
  {
    id: 'l1',
    property: { id: 'p1', title: 'Marina View 2BR Apartment', location: 'Dubai Marina', type: 'Apartment' },
    tenant: { id: 't1', name: 'Ahmed Al-Rashid', phone: '+971501111111' },
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 7916.67,
    status: 'active',
    ejariNumber: 'EJ-001',
    nextPaymentDue: '2024-08-01',
  },
  {
    id: 'l2',
    property: { id: 'p2', title: 'Downtown Studio', location: 'Downtown Dubai', type: 'Studio' },
    tenant: { id: 't2', name: 'Sarah Johnson', phone: '+971502222222' },
    startDate: '2023-07-01',
    endDate: '2024-06-30',
    monthlyRent: 5416.67,
    status: 'active',
    ejariNumber: 'EJ-002',
    nextPaymentDue: '2024-07-01',
  },
  {
    id: 'l3',
    property: { id: 'p3', title: 'JBR 3BR Apartment', location: 'JBR', type: 'Apartment' },
    tenant: null,
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    monthlyRent: 15000,
    status: 'vacant',
    ejariNumber: null,
    nextPaymentDue: null,
  },
];

const renderLoaded = async () => {
  render(<RentalManagementPage />);
  await screen.findByText('Marina View 2BR Apartment');
};

describe('RentalManagementPage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: MOCK_LEASES }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('shows all properties by default', async () => {
    await renderLoaded();
    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('Downtown Studio')).toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  // ────── Filter Logic ──────

  it('filters to occupied only', async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole('button', { name: 'Occupied' }));

    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('Downtown Studio')).toBeInTheDocument();
    expect(screen.queryByText('JBR 3BR Apartment')).not.toBeInTheDocument();
  });

  it('filters to available only', async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));

    expect(screen.queryByText('Marina View 2BR Apartment')).not.toBeInTheDocument();
    expect(screen.queryByText('Downtown Studio')).not.toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  it('returns to all when clicking All Properties', async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    expect(screen.queryByText('Marina View 2BR Apartment')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All Properties' }));
    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  // ────── Property Card Details ──────

  it('renders property locations', async () => {
    await renderLoaded();
    expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
    expect(screen.getByText('Downtown Dubai')).toBeInTheDocument();
    expect(screen.getByText('JBR')).toBeInTheDocument();
  });

  it('renders property types', async () => {
    await renderLoaded();
    expect(screen.getAllByText('Apartment')).toHaveLength(2);
    expect(screen.getByText('Studio')).toBeInTheDocument();
  });

  it('renders rent amounts', async () => {
    await renderLoaded();
    expect(screen.getByText(/AED 95,000/)).toBeInTheDocument();
    expect(screen.getByText(/AED 65,000/)).toBeInTheDocument();
    expect(screen.getByText('AED 180,000/yr')).toBeInTheDocument();
  });

  // ────── Status Badges ──────

  it('renders status badges', async () => {
    await renderLoaded();
    const occupiedBadges = screen.getAllByText('Occupied');
    // 2 occupied properties = 2 badges (the filter btn also says "Occupied" but is a button)
    expect(occupiedBadges.length).toBeGreaterThanOrEqual(2);
  });

  // ────── Tenant Information (Occupied only) ──────

  it('shows tenant names for occupied properties', async () => {
    await renderLoaded();
    expect(screen.getByText('Ahmed Al-Rashid')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  it('shows lease end dates for occupied properties', async () => {
    await renderLoaded();
    expect(screen.getByText(/31 Dec 2024/)).toBeInTheDocument();
    expect(screen.getByText(/30 Jun 2024/)).toBeInTheDocument();
  });

  it('does not show tenant info for available properties', async () => {
    await renderLoaded();
    // JBR 3BR Apartment is available — no tenant shown
    // If we filter to available only, there should be no tenant rows
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    expect(screen.queryByText('Ahmed Al-Rashid')).not.toBeInTheDocument();
    expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument();
  });

  // ────── Action Buttons ──────

  it('renders View Details buttons', async () => {
    await renderLoaded();
    const viewBtns = screen.getAllByText('View Details');
    expect(viewBtns).toHaveLength(3); // one per property
  });

  it('renders Call Tenant links for occupied leases', async () => {
    await renderLoaded();
    const callBtns = screen.getAllByText('Call Tenant');
    expect(callBtns.length).toBe(2);
  });

  // ────── Sequential Filter Changes ──────

  it('handles rapid filter changes', async () => {
    await renderLoaded();

    fireEvent.click(screen.getByRole('button', { name: 'Occupied' }));
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    fireEvent.click(screen.getByRole('button', { name: 'All Properties' }));

    // After cycling through all filters, should show all 3 properties
    expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(screen.getByText('Downtown Studio')).toBeInTheDocument();
    expect(screen.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });
});
