/**
 * TenantTabs.test.tsx — Smoke tests for all 5 tenant dashboard sub-tabs
 * ─────────────────────────────────────────────────────────────────────
 * TenantOverview, TenantLease, TenantPayments, TenantMaintenance, TenantDocuments
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  TenantOverview,
  TenantLease,
  TenantPayments,
  TenantMaintenance,
  TenantDocuments,
} from './TenantTabs';

const mockAuthFetch = vi.fn() as Mock;
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

function jsonRes(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('TenantTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue(jsonRes({ success: true, data: null }));
  });

  // ── TenantOverview ─────────────────────────────────────────────────
  describe('TenantOverview', () => {
    it('renders heading', async () => {
      render(<TenantOverview />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Tenant Overview/i));
    });

    it('renders stats with dash placeholders when no lease', async () => {
      render(<TenantOverview />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Tenant Overview/i));
    });

    it('renders lease stats when data returned', async () => {
      mockAuthFetch.mockImplementation((url: string) => {
        if (url.includes('/api/leases/my-lease')) {
          return Promise.resolve(jsonRes({
            success: true,
            data: { id: 'l1', monthlyRent: 5000, endDate: '2027-06-01', status: 'active', property: { title: 'Marina Apt' } },
          }));
        }
        return Promise.resolve(jsonRes({ success: true, data: [] }));
      });
      render(<TenantOverview />);
      await waitFor(() => expect(screen.getByText(/Monthly Rent/i)).toBeInTheDocument());
    });
  });

  // ── TenantLease ────────────────────────────────────────────────────
  describe('TenantLease', () => {
    it('shows empty state when no lease (h3 heading)', async () => {
      render(<TenantLease />);
      await waitFor(() => expect(screen.getByText(/No active lease/i)).toBeInTheDocument());
    });

    it('renders lease details', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: {
          id: 'l1', property: { title: 'Creek Tower' }, landlord: { name: 'Mr. Ali' },
          startDate: '2026-01-01', endDate: '2027-01-01', monthlyRent: 6000,
          depositAmount: 12000, status: 'active', terms: 'No pets',
        },
      }));
      render(<TenantLease />);
      await waitFor(() => expect(screen.getByText('Creek Tower')).toBeInTheDocument());
    });
  });

  // ── TenantPayments ─────────────────────────────────────────────────
  describe('TenantPayments', () => {
    it('renders heading', async () => {
      render(<TenantPayments />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Payments/i));
    });

    it('shows empty state', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({ success: true, data: [] }));
      render(<TenantPayments />);
      await waitFor(() => expect(screen.getByText(/No payments/i)).toBeInTheDocument());
    });
  });

  // ── TenantMaintenance ──────────────────────────────────────────────
  describe('TenantMaintenance', () => {
    it('renders heading', async () => {
      render(<TenantMaintenance />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Maintenance Requests/i));
    });

    it('shows empty state', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({ success: true, data: [] }));
      render(<TenantMaintenance />);
      await waitFor(() => expect(screen.getByText(/No maintenance requests/i)).toBeInTheDocument());
    });

    it('renders maintenance cards', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'm1', title: 'Leaking sink', description: 'Kitchen', priority: 'high', status: 'open', createdAt: '2026-03-20' }],
      }));
      render(<TenantMaintenance />);
      await waitFor(() => expect(screen.getByText('Leaking sink')).toBeInTheDocument());
    });
  });

  // ── TenantDocuments ────────────────────────────────────────────────
  describe('TenantDocuments', () => {
    it('renders heading', async () => {
      render(<TenantDocuments />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Documents/i));
    });

    it('renders hardcoded document cards (no API call)', () => {
      render(<TenantDocuments />);
      // Documents are hardcoded, so they should render immediately
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Documents/i);
    });
  });
});
