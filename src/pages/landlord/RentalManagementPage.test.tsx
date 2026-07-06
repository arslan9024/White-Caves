/**
 * RentalManagementPage — Unit Tests
 * Tests: rendering, filter buttons, property cards, tenant info,
 * status badges, conditional rendering, filter logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
    property: {
      id: 'p1',
      title: 'Marina View 2BR Apartment',
      location: 'Dubai Marina',
      type: 'Apartment',
    },
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

const MOCK_OVERDUE_QUEUE = [
  {
    id: 'pdc-1',
    chequeNumber: 'CHK-001',
    amount: 8000,
    currency: 'AED',
    dueDate: '2026-06-01T00:00:00.000Z',
    status: 'pending',
    daysOverdue: 3,
    lease: {
      id: 'l1',
      leaseNumber: 'L-001',
      property: { id: 'p1', title: 'Marina View 2BR Apartment', location: 'Dubai Marina' },
      tenant: { id: 't1', name: 'Ahmed Al-Rashid', email: 'ahmed@test.ae', phone: '+971501111111' },
    },
  },
];

const renderLoaded = async () => {
  render(<RentalManagementPage />);
  await screen.findAllByText('Marina View 2BR Apartment');
};

const getPropertiesGridQueries = () => {
  const grid = document.querySelector('.properties-grid');
  if (!(grid instanceof HTMLElement)) {
    throw new Error('properties grid not found');
  }
  return within(grid);
};

describe('RentalManagementPage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.clearAllMocks();
    mockAuthFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes('/api/leases/collections/overdue-queue') && (!init || !init.method)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: MOCK_OVERDUE_QUEUE }),
        });
      }

      if (url.includes('/api/leases/collections/overdue-queue/') && init?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: MOCK_LEASES }),
      });
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
    const grid = getPropertiesGridQueries();
    expect(grid.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(grid.getByText('Downtown Studio')).toBeInTheDocument();
    expect(grid.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  // ────── Filter Logic ──────

  it('filters to occupied only', async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole('button', { name: 'Occupied' }));
    const grid = getPropertiesGridQueries();

    expect(grid.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(grid.getByText('Downtown Studio')).toBeInTheDocument();
    expect(grid.queryByText('JBR 3BR Apartment')).not.toBeInTheDocument();
  });

  it('filters to available only', async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    const grid = getPropertiesGridQueries();

    expect(grid.queryByText('Marina View 2BR Apartment')).not.toBeInTheDocument();
    expect(grid.queryByText('Downtown Studio')).not.toBeInTheDocument();
    expect(grid.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  it('returns to all when clicking All Properties', async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    let grid = getPropertiesGridQueries();
    expect(grid.queryByText('Marina View 2BR Apartment')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All Properties' }));
    grid = getPropertiesGridQueries();
    expect(grid.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(grid.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  // ────── Property Card Details ──────

  it('renders property locations', async () => {
    await renderLoaded();
    const grid = getPropertiesGridQueries();
    expect(grid.getByText('Dubai Marina')).toBeInTheDocument();
    expect(grid.getByText('Downtown Dubai')).toBeInTheDocument();
    expect(grid.getByText('JBR')).toBeInTheDocument();
  });

  it('renders property types', async () => {
    await renderLoaded();
    const grid = getPropertiesGridQueries();
    expect(grid.getAllByText('Apartment')).toHaveLength(2);
    expect(grid.getByText('Studio')).toBeInTheDocument();
  });

  it('renders rent amounts', async () => {
    await renderLoaded();
    const grid = getPropertiesGridQueries();
    expect(grid.getByText(/AED 95,000/)).toBeInTheDocument();
    expect(grid.getByText(/AED 65,000/)).toBeInTheDocument();
    expect(grid.getByText('AED 180,000/yr')).toBeInTheDocument();
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
    const grid = getPropertiesGridQueries();
    expect(grid.getByText('Ahmed Al-Rashid')).toBeInTheDocument();
    expect(grid.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  it('shows lease end dates for occupied properties', async () => {
    await renderLoaded();
    const grid = getPropertiesGridQueries();
    expect(grid.getByText(/31 Dec 2024/)).toBeInTheDocument();
    expect(grid.getByText(/30 Jun 2024/)).toBeInTheDocument();
  });

  it('does not show tenant info for available properties', async () => {
    await renderLoaded();
    // JBR 3BR Apartment is available — no tenant shown
    // If we filter to available only, there should be no tenant rows
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    const grid = getPropertiesGridQueries();
    expect(grid.queryByText('Ahmed Al-Rashid')).not.toBeInTheDocument();
    expect(grid.queryByText('Sarah Johnson')).not.toBeInTheDocument();
  });

  // ────── Action Buttons ──────

  it('renders View Details buttons', async () => {
    await renderLoaded();
    const grid = getPropertiesGridQueries();
    const viewBtns = grid.getAllByText('View Details');
    expect(viewBtns).toHaveLength(3); // one per property
  });

  it('renders Call Tenant links for occupied leases', async () => {
    await renderLoaded();
    const grid = getPropertiesGridQueries();
    const callBtns = grid.getAllByText('Call Tenant');
    expect(callBtns.length).toBe(2);
  });

  // ────── Sequential Filter Changes ──────

  it('handles rapid filter changes', async () => {
    await renderLoaded();

    fireEvent.click(screen.getByRole('button', { name: 'Occupied' }));
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    fireEvent.click(screen.getByRole('button', { name: 'All Properties' }));
    const grid = getPropertiesGridQueries();

    // After cycling through all filters, should show all 3 properties
    expect(grid.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
    expect(grid.getByText('Downtown Studio')).toBeInTheDocument();
    expect(grid.getByText('JBR 3BR Apartment')).toBeInTheDocument();
  });

  it('renders overdue collection queue section when overdue items exist', async () => {
    await renderLoaded();

    expect(screen.getByLabelText('Overdue rent collection queue')).toBeInTheDocument();
    expect(screen.getByText('Overdue Rent Collection Queue')).toBeInTheDocument();
    expect(screen.getByText(/item\(s\) require collection follow-up/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Send collection reminder for cheque CHK-001/i })
    ).toBeInTheDocument();
  });

  it('sends overdue collection reminder and shows success state', async () => {
    await renderLoaded();

    fireEvent.click(
      screen.getByRole('button', { name: /Send collection reminder for cheque CHK-001/i })
    );

    expect(await screen.findByText('Reminder logged successfully.')).toBeInTheDocument();
  });
});
