/**
 * AgentTabs.test.tsx — Smoke tests for all 10 agent dashboard sub-tabs
 * ────────────────────────────────────────────────────────────────────
 * Leasing: LeasingPipeline, LeasingProperties, LeaseContracts,
 *          LeasingViewings, TenantApplications, LeaseRenewals
 * Sales:   SalesPipeline, SalesLeads, ActiveDeals, AgentPerformance
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  LeasingPipeline,
  LeasingProperties,
  LeaseContracts,
  LeasingViewings,
  TenantApplications,
  LeaseRenewals,
  SalesPipeline,
  SalesLeads,
  ActiveDeals,
  AgentPerformance,
} from './AgentTabs';

const mockAuthFetch = vi.fn() as Mock;
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

function jsonRes(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('AgentTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue(jsonRes({ success: true, data: [], pagination: { total: 0 } }));
  });

  // ═══ LEASING AGENT ═══════════════════════════════════════════════

  describe('LeasingPipeline', () => {
    it('renders heading', async () => {
      render(<LeasingPipeline />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Leasing Pipeline/i));
    });

    it('calls /api/leases', async () => {
      render(<LeasingPipeline />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/leases');
    });
  });

  describe('LeasingProperties', () => {
    it('renders heading', async () => {
      render(<LeasingProperties />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Leasing Properties/i));
    });

    it('shows empty state', async () => {
      render(<LeasingProperties />);
      await waitFor(() => expect(screen.getByText(/No rental properties/i)).toBeInTheDocument());
    });

    it('renders property cards', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'p1', title: 'Marina 1BR', location: 'Marina', bedrooms: 1, price: 45000, status: 'available' }],
      }));
      render(<LeasingProperties />);
      await waitFor(() => expect(screen.getByText('Marina 1BR')).toBeInTheDocument());
    });
  });

  describe('LeaseContracts', () => {
    it('renders heading', async () => {
      render(<LeaseContracts />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Lease Contracts/i));
    });

    it('shows empty state', async () => {
      render(<LeaseContracts />);
      await waitFor(() => expect(screen.getByText(/No contracts/i)).toBeInTheDocument());
    });
  });

  describe('LeasingViewings', () => {
    it('renders heading', async () => {
      render(<LeasingViewings />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Property Viewings/i));
    });

    it('shows empty state', async () => {
      render(<LeasingViewings />);
      await waitFor(() => expect(screen.getByText(/No viewings scheduled/i)).toBeInTheDocument());
    });

    it('renders viewing table', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'v1', property: { title: 'JBR Tower' }, client: { name: 'Sara' }, scheduledAt: '2026-04-01T10:00:00Z', status: 'scheduled', notes: '' }],
      }));
      render(<LeasingViewings />);
      await waitFor(() => expect(screen.getByText('JBR Tower')).toBeInTheDocument());
    });
  });

  describe('TenantApplications', () => {
    it('renders heading', async () => {
      render(<TenantApplications />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Tenant Applications/i));
    });

    it('shows empty state', async () => {
      render(<TenantApplications />);
      await waitFor(() => expect(screen.getByText(/No applications/i)).toBeInTheDocument());
    });
  });

  describe('LeaseRenewals', () => {
    it('renders heading', async () => {
      render(<LeaseRenewals />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Lease Renewals/i));
    });

    it('shows empty state when no expiring leases', async () => {
      render(<LeaseRenewals />);
      await waitFor(() => expect(screen.getByText(/No upcoming renewals/i)).toBeInTheDocument());
    });

    it('calls /api/leases/expiring', async () => {
      render(<LeaseRenewals />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/leases/expiring');
    });
  });

  // ═══ SALES AGENT ═════════════════════════════════════════════════

  describe('SalesPipeline', () => {
    it('renders heading', async () => {
      render(<SalesPipeline />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Sales Pipeline/i));
    });

    it('calls /api/offers', async () => {
      render(<SalesPipeline />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/offers');
    });
  });

  describe('SalesLeads', () => {
    it('renders heading', async () => {
      render(<SalesLeads />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Sales Leads/i));
    });

    it('shows empty state', async () => {
      render(<SalesLeads />);
      await waitFor(() => expect(screen.getByText(/No leads/i)).toBeInTheDocument());
    });

    it('renders lead table', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'l1', name: 'Ali Khan', source: 'website', propertyInterest: 'Villa', budget: 5000000, status: 'hot', lastContactedAt: '2026-03-20' }],
      }));
      render(<SalesLeads />);
      await waitFor(() => expect(screen.getByText('Ali Khan')).toBeInTheDocument());
    });
  });

  describe('ActiveDeals', () => {
    it('renders heading', async () => {
      render(<ActiveDeals />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Active Deals/i));
    });

    it('shows empty state', async () => {
      render(<ActiveDeals />);
      await waitFor(() => expect(screen.getByText(/No active deals/i)).toBeInTheDocument());
    });
  });

  describe('AgentPerformance', () => {
    it('renders heading', async () => {
      render(<AgentPerformance />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Agent Performance/i));
    });

    it('calls /api/offers/stats', async () => {
      render(<AgentPerformance />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/offers');
    });
  });
});
