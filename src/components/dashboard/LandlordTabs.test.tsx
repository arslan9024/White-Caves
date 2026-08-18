/**
 * LandlordTabs.test.tsx — Smoke tests for all 5 landlord dashboard sub-tabs
 * ──────────────────────────────────────────────────────────────────────────
 * LandlordProperties, TenantManagement, MaintenanceRequests, FinancialSummary, LeaseManagement
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  LandlordProperties,
  TenantManagement,
  MaintenanceRequests,
  FinancialSummary,
  LeaseManagement,
} from './LandlordTabs';

const mockAuthFetch = vi.fn() as Mock;
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

function jsonRes(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('LandlordTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue(jsonRes({ success: true, data: [], pagination: { total: 0 } }));
  });

  // ── LandlordProperties ─────────────────────────────────────────────
  describe('LandlordProperties', () => {
    it('renders heading', async () => {
      render(<LandlordProperties />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/My Properties/i));
    });

    it('shows empty state', async () => {
      render(<LandlordProperties />);
      await waitFor(() => expect(screen.getByText(/No properties/i)).toBeInTheDocument());
    });

    it('renders property cards', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'p1', title: 'Marina Studio', location: 'Dubai Marina', bedrooms: 1, area: 650, price: 55000, status: 'rented' }],
      }));
      render(<LandlordProperties />);
      await waitFor(() => expect(screen.getByText('Marina Studio')).toBeInTheDocument());
    });

    it('calls /api/properties with landlord role', async () => {
      render(<LandlordProperties />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('role=landlord');
    });
  });

  // ── TenantManagement ───────────────────────────────────────────────
  describe('TenantManagement', () => {
    it('renders heading', async () => {
      render(<TenantManagement />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Tenant Management/i));
    });

    it('shows empty state', async () => {
      render(<TenantManagement />);
      await waitFor(() => expect(screen.getByText(/No tenants yet/i)).toBeInTheDocument());
    });

    it('renders tenant table', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'l1', tenant: { name: 'John' }, property: { title: 'Creek Apt' }, monthlyRent: 4000, endDate: '2027-01-01', status: 'active' }],
      }));
      render(<TenantManagement />);
      await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());
    });
  });

  // ── MaintenanceRequests ────────────────────────────────────────────
  describe('MaintenanceRequests', () => {
    it('renders heading', async () => {
      render(<MaintenanceRequests />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Maintenance Requests/i));
    });

    it('shows empty state', async () => {
      render(<MaintenanceRequests />);
      await waitFor(() => expect(screen.getByText(/No maintenance requests/i)).toBeInTheDocument());
    });

    it('calls both /api/maintenance and /api/maintenance/stats', async () => {
      render(<MaintenanceRequests />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      const urls = mockAuthFetch.mock.calls.map((c: unknown[]) => c[0] as string);
      expect(urls.some(u => u.includes('/api/maintenance') && !u.includes('stats'))).toBe(true);
      expect(urls.some(u => u.includes('/api/maintenance/stats'))).toBe(true);
    });
  });

  // ── FinancialSummary ───────────────────────────────────────────────
  describe('FinancialSummary', () => {
    it('renders heading', async () => {
      render(<FinancialSummary />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Financial Summary/i));
    });

    it('shows stats even with empty data', async () => {
      render(<FinancialSummary />);
      await waitFor(() => expect(screen.getByText(/Monthly Rental Income/i)).toBeInTheDocument());
    });
  });

  // ── LeaseManagement ────────────────────────────────────────────────
  describe('LeaseManagement', () => {
    it('renders heading', async () => {
      render(<LeaseManagement />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Lease Management/i));
    });

    it('calls leases and expiring endpoints', async () => {
      render(<LeaseManagement />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      const urls = mockAuthFetch.mock.calls.map((c: unknown[]) => c[0] as string);
      expect(urls.some(u => u.includes('/api/leases') && !u.includes('expiring'))).toBe(true);
      expect(urls.some(u => u.includes('/api/leases/expiring'))).toBe(true);
    });

    it('shows empty state', async () => {
      render(<LeaseManagement />);
      await waitFor(() => expect(screen.getByText(/No leases/i)).toBeInTheDocument());
    });
  });
});
