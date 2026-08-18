/**
 * SellerTabs.test.tsx — Smoke tests for all 5 seller dashboard sub-tabs
 * ──────────────────────────────────────────────────────────────────────
 * SellerListings, SellerInquiries, MarketInsights, ReceivedOffers, SellerAnalytics
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  SellerListings,
  SellerInquiries,
  MarketInsights,
  ReceivedOffers,
  SellerAnalytics,
} from './SellerTabs';

const mockAuthFetch = vi.fn() as Mock;
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

function jsonRes(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('SellerTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue(jsonRes({ success: true, data: [], pagination: { total: 0 } }));
  });

  // ── SellerListings ──────────────────────────────────────────────────
  describe('SellerListings', () => {
    it('renders heading', async () => {
      render(<SellerListings />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/My Listings/i));
    });

    it('shows empty state', async () => {
      render(<SellerListings />);
      await waitFor(() => expect(screen.getByText(/No listings yet/i)).toBeInTheDocument());
    });

    it('renders data rows', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'p1', title: 'JBR Apt', location: 'JBR', type: 'Apartment', price: 2000000, status: 'active', views: 45, createdAt: '2026-01-01' }],
      }));
      render(<SellerListings />);
      await waitFor(() => expect(screen.getByText('JBR Apt')).toBeInTheDocument());
    });

    it('calls /api/properties with seller role', async () => {
      render(<SellerListings />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/properties');
      expect(mockAuthFetch.mock.calls[0][0]).toContain('role=seller');
    });
  });

  // ── SellerInquiries ─────────────────────────────────────────────────
  describe('SellerInquiries', () => {
    it('renders heading', async () => {
      render(<SellerInquiries />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Inquiries/i));
    });

    it('shows empty state', async () => {
      render(<SellerInquiries />);
      await waitFor(() => expect(screen.getByText(/No inquiries yet/i)).toBeInTheDocument());
    });

    it('renders inquiry data', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'l1', name: 'Ahmed', email: 'ahmed@test.ae', phone: '050-123', property: { title: 'Marina Apt' }, score: 85, status: 'new', createdAt: '2026-03-01' }],
      }));
      render(<SellerInquiries />);
      await waitFor(() => expect(screen.getByText('Ahmed')).toBeInTheDocument());
    });
  });

  // ── MarketInsights ──────────────────────────────────────────────────
  describe('MarketInsights', () => {
    it('renders heading (no API call)', async () => {
      render(<MarketInsights />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Market Insights/i));
    });

    it('renders hardcoded area data', async () => {
      render(<MarketInsights />);
      await waitFor(() => expect(screen.getByText(/Top Performing/i)).toBeInTheDocument());
    });
  });

  // ── ReceivedOffers ──────────────────────────────────────────────────
  describe('ReceivedOffers', () => {
    it('renders heading', async () => {
      render(<ReceivedOffers />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Received Offers/i));
    });

    it('shows empty state', async () => {
      render(<ReceivedOffers />);
      await waitFor(() => expect(screen.getByText(/No offers received/i)).toBeInTheDocument());
    });

    it('renders offer data', async () => {
      mockAuthFetch.mockResolvedValue(jsonRes({
        success: true,
        data: [{ id: 'o1', property: { title: 'Palm Villa' }, buyer: { name: 'Sara' }, amount: 3000000, status: 'pending', createdAt: '2026-03-15' }],
      }));
      render(<ReceivedOffers />);
      await waitFor(() => expect(screen.getByText('Palm Villa')).toBeInTheDocument());
    });
  });

  // ── SellerAnalytics ─────────────────────────────────────────────────
  describe('SellerAnalytics', () => {
    it('renders heading', async () => {
      render(<SellerAnalytics />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Seller Analytics/i));
    });

    it('calls both properties and offers APIs', async () => {
      render(<SellerAnalytics />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      const urls = mockAuthFetch.mock.calls.map((c: unknown[]) => c[0] as string);
      expect(urls.some(u => u.includes('/api/properties'))).toBe(true);
      expect(urls.some(u => u.includes('/api/offers'))).toBe(true);
    });
  });
});
