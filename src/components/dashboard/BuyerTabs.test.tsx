/**
 * BuyerTabs.test.tsx — Smoke tests for all 5 buyer dashboard sub-tabs
 * ────────────────────────────────────────────────────────────────────
 * Tests: BuyerOverview, SavedProperties, ViewingSchedule,
 *        PriceAlerts, BuyerOffers — loading → data → empty states.
 *
 * authFetch is mocked at the module level so no network calls are made.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  BuyerOverview,
  SavedProperties,
  ViewingSchedule,
  PriceAlerts,
  BuyerOffers,
} from './BuyerTabs';

// ─── Mock authFetch ──────────────────────────────────────────────────

const mockAuthFetch = vi.fn() as Mock;

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

// Helper: create a mock Response with json()
function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

// Helper: make authFetch always return { success: true, data: [] } by default
function setDefaultEmpty() {
  mockAuthFetch.mockResolvedValue(jsonResponse({ success: true, data: [], pagination: { total: 0 } }));
}

// ─── Tests ───────────────────────────────────────────────────────────

describe('BuyerTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setDefaultEmpty();
  });

  // ── BuyerOverview ─────────────────────────────────────────────────
  describe('BuyerOverview', () => {
    it('shows loading state then renders dashboard', async () => {
      render(<BuyerOverview />);
      // Should eventually render the title
      await waitFor(() => {
        expect(screen.getByText(/Buyer Dashboard/i)).toBeInTheDocument();
      });
    });

    it('displays stat cards with zero counts on empty data', async () => {
      render(<BuyerOverview />);
      await waitFor(() => expect(screen.getByText('❤️ Favorites')).toBeInTheDocument());
      expect(screen.getByText('👁️ Scheduled Viewings')).toBeInTheDocument();
      expect(screen.getByText('💰 Active Offers')).toBeInTheDocument();
      expect(screen.getByText('🔍 Saved Searches')).toBeInTheDocument();
    });

    it('shows "No upcoming viewings" when data is empty', async () => {
      render(<BuyerOverview />);
      await waitFor(() => {
        expect(screen.getByText(/No upcoming viewings/i)).toBeInTheDocument();
      });
    });

    it('renders viewings table when data is returned', async () => {
      // Override: viewings endpoint returns data
      mockAuthFetch.mockImplementation((url: string) => {
        if (url.includes('/api/viewings')) {
          return Promise.resolve(jsonResponse({
            success: true,
            data: [
              { id: 'v1', property: { title: 'Marina Studio' }, scheduledAt: '2026-04-01T10:00:00Z', status: 'scheduled' },
            ],
            pagination: { total: 1 },
          }));
        }
        return Promise.resolve(jsonResponse({ success: true, data: [] }));
      });
      render(<BuyerOverview />);
      await waitFor(() => {
        expect(screen.getByText('Marina Studio')).toBeInTheDocument();
      });
    });
  });

  // ── SavedProperties ───────────────────────────────────────────────
  describe('SavedProperties', () => {
    it('renders heading', async () => {
      render(<SavedProperties />);
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Saved Properties/i);
      });
    });

    it('shows empty state when no favorites', async () => {
      render(<SavedProperties />);
      await waitFor(() => {
        expect(screen.getByText(/No saved properties/i)).toBeInTheDocument();
      });
    });

    it('renders property cards when data returned', async () => {
      mockAuthFetch.mockResolvedValue(jsonResponse({
        success: true,
        data: [
          { id: 'f1', property: { title: 'Palm Villa', location: 'Palm Jumeirah', price: 2500000, bedrooms: 3, bathrooms: 2 } },
        ],
      }));
      render(<SavedProperties />);
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
        expect(screen.getByText(/Palm Jumeirah/)).toBeInTheDocument();
      });
    });
  });

  // ── ViewingSchedule ───────────────────────────────────────────────
  describe('ViewingSchedule', () => {
    it('renders heading', async () => {
      render(<ViewingSchedule />);
      await waitFor(() => {
        expect(screen.getByText(/Viewing Schedule/i)).toBeInTheDocument();
      });
    });

    it('shows empty state when no viewings', async () => {
      render(<ViewingSchedule />);
      await waitFor(() => {
        expect(screen.getByText(/No viewings scheduled/i)).toBeInTheDocument();
      });
    });

    it('renders table with viewing data', async () => {
      mockAuthFetch.mockResolvedValue(jsonResponse({
        success: true,
        data: [
          { id: 'v1', property: { title: 'Creek Harbour Apt' }, agent: { name: 'Sarah' }, scheduledAt: '2026-04-15T14:00:00Z', status: 'scheduled', rating: null },
        ],
      }));
      render(<ViewingSchedule />);
      await waitFor(() => {
        expect(screen.getByText('Creek Harbour Apt')).toBeInTheDocument();
        expect(screen.getByText('Sarah')).toBeInTheDocument();
      });
    });
  });

  // ── PriceAlerts ───────────────────────────────────────────────────
  describe('PriceAlerts', () => {
    it('renders heading', async () => {
      render(<PriceAlerts />);
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Price Alerts/i);
      });
    });

    it('shows empty state when no alert-enabled searches', async () => {
      render(<PriceAlerts />);
      await waitFor(() => {
        expect(screen.getByText(/No price alerts active/i)).toBeInTheDocument();
      });
    });

    it('renders alert cards with data', async () => {
      mockAuthFetch.mockResolvedValue(jsonResponse({
        success: true,
        data: [
          { id: 'ss1', name: 'Marina 2BR', alertEnabled: true, matchCount: 7, filters: { type: 'Apartment', location: 'Dubai Marina', bedrooms: 2 } },
        ],
      }));
      render(<PriceAlerts />);
      await waitFor(() => {
        expect(screen.getByText('Marina 2BR')).toBeInTheDocument();
        expect(screen.getByText(/7 matches/)).toBeInTheDocument();
      });
    });
  });

  // ── BuyerOffers ───────────────────────────────────────────────────
  describe('BuyerOffers', () => {
    it('renders heading', async () => {
      render(<BuyerOffers />);
      await waitFor(() => {
        expect(screen.getByText(/My Offers/i)).toBeInTheDocument();
      });
    });

    it('shows empty state when no offers', async () => {
      render(<BuyerOffers />);
      await waitFor(() => {
        expect(screen.getByText(/No offers submitted/i)).toBeInTheDocument();
      });
    });

    it('renders offers table with data', async () => {
      mockAuthFetch.mockResolvedValue(jsonResponse({
        success: true,
        data: [
          { id: 'o1', property: { title: 'JBR Penthouse' }, amount: 3000000, counterAmount: null, status: 'pending', createdAt: '2026-03-20T00:00:00Z' },
        ],
      }));
      render(<BuyerOffers />);
      await waitFor(() => {
        expect(screen.getByText('JBR Penthouse')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
      });
    });

    it('renders accepted/rejected status badges', async () => {
      mockAuthFetch.mockResolvedValue(jsonResponse({
        success: true,
        data: [
          { id: 'o1', property: { title: 'Villa A' }, amount: 1000000, status: 'accepted', createdAt: '2026-03-01' },
          { id: 'o2', property: { title: 'Villa B' }, amount: 2000000, status: 'rejected', createdAt: '2026-03-02' },
        ],
      }));
      render(<BuyerOffers />);
      await waitFor(() => {
        expect(screen.getByText('Accepted')).toBeInTheDocument();
        expect(screen.getByText('Rejected')).toBeInTheDocument();
      });
    });
  });

  // ── API call verification ─────────────────────────────────────────
  describe('API integration', () => {
    it('BuyerOverview calls 4 API endpoints', async () => {
      render(<BuyerOverview />);
      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalled();
      });
      const urls = mockAuthFetch.mock.calls.map((c: unknown[]) => c[0]);
      expect(urls).toContain('/api/favorites/ids');
      expect(urls.some((u: string) => u.includes('/api/viewings'))).toBe(true);
      expect(urls.some((u: string) => u.includes('/api/offers'))).toBe(true);
      expect(urls).toContain('/api/saved-searches');
    });

    it('SavedProperties calls /api/favorites', async () => {
      render(<SavedProperties />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/favorites');
    });

    it('ViewingSchedule calls /api/viewings', async () => {
      render(<ViewingSchedule />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/viewings');
    });

    it('PriceAlerts calls /api/saved-searches', async () => {
      render(<PriceAlerts />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/saved-searches');
    });

    it('BuyerOffers calls /api/offers', async () => {
      render(<BuyerOffers />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      expect(mockAuthFetch.mock.calls[0][0]).toContain('/api/offers');
    });
  });
});
