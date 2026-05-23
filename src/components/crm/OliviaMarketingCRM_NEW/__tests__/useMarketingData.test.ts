/**
 * @file useMarketingData.test.ts
 * @description Comprehensive tests for the useMarketingData hook
 * Tests: initial state, filtering, stats calculation, CRUD operations, status badge helpers
 */

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the marketing data
vi.mock('../data/marketing', () => ({
  CAMPAIGNS: [
    { id: 1, name: 'Summer Showcase', platform: 'facebook', status: 'active', budget: 25000, spent: 18500, reach: 125000, leads: 48, cpl: 385 },
    { id: 2, name: 'Luxury Villas', platform: 'instagram', status: 'active', budget: 15000, spent: 12000, reach: 89000, leads: 32, cpl: 375 },
    { id: 3, name: 'DAMAC Promo', platform: 'google', status: 'paused', budget: 20000, spent: 8000, reach: 45000, leads: 18, cpl: 444 },
    { id: 4, name: 'Email Newsletter', platform: 'email', status: 'completed', budget: 5000, spent: 5000, reach: 25000, leads: 85, cpl: 59 },
  ],
  SOCIAL_STATS: [
    { platform: 'Instagram', followers: 45200, growth: 12.5, engagement: 4.8, posts: 156 },
    { platform: 'Facebook', followers: 32100, growth: 8.2, engagement: 2.1, posts: 89 },
  ],
  LISTINGS: [
    { id: 1, property: 'Villa 348', views: 2450, inquiries: 28, quality: 92, available: 12 },
    { id: 2, property: 'Penthouse 2501', views: 1890, inquiries: 15, quality: 88, available: 3 },
    { id: 3, property: 'Apartment 1205', views: 1560, inquiries: 22, quality: 85, available: 0 },
  ],
  MONITORED_SITES: [
    { name: 'Bayut', status: 'healthy', lastCheck: '2025-01-01', dataPoints: 1250 },
    { name: 'Dubizzle', status: 'degraded', lastCheck: '2025-01-01', dataPoints: 650 },
  ],
  MARKET_INSIGHTS: {
    priceIndex: 152.3,
    priceChange: 2.4,
    avgRentalYield: 6.8,
    supplyDemandRatio: 0.78,
    hotspots: [],
    trends: [],
  },
}));

import { useMarketingData } from '../hooks/useMarketingData';

describe('useMarketingData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Initial State ──────────────────────────────────────
  describe('Initial State', () => {
    it('returns campaigns from mock data', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.campaigns).toHaveLength(4);
    });

    it('returns social stats', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.socialStats).toHaveLength(2);
    });

    it('returns listings', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.listings).toHaveLength(3);
    });

    it('returns monitored sites', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.monitoredSites).toHaveLength(2);
    });

    it('returns market insights', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.marketInsights.priceIndex).toBe(152.3);
    });

    it('initializes search query as empty', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.searchQuery).toBe('');
    });

    it('initializes filter platform as all', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.filterPlatform).toBe('all');
    });

    it('initializes filter campaign status as all', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.filterCampaignStatus).toBe('all');
    });

    it('initializes selected campaign as null', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.selectedCampaign).toBeNull();
    });

    it('initializes oliviaActive as true', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.oliviaActive).toBe(true);
    });
  });

  // ── Campaign Stats ────────────────────────────────────
  describe('Campaign Stats', () => {
    it('calculates total campaigns', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.campaignStats.total).toBe(4);
    });

    it('calculates active campaigns', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.campaignStats.active).toBe(2);
    });

    it('calculates total budget', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.campaignStats.totalBudget).toBe(65000);
    });

    it('calculates total spent', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.campaignStats.totalSpent).toBe(43500);
    });

    it('calculates total leads', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.campaignStats.totalLeads).toBe(183);
    });
  });

  // ── Social Metrics ────────────────────────────────────
  describe('Social Metrics', () => {
    it('calculates total followers', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.socialMetrics.totalFollowers).toBe(77300);
    });

    it('calculates average engagement', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.socialMetrics.avgEngagement).toBe('3.5'); // (4.8+2.1)/2
    });

    it('calculates total posts', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.socialMetrics.totalPosts).toBe(245);
    });
  });

  // ── Listing Stats ─────────────────────────────────────
  describe('Listing Stats', () => {
    it('calculates total views', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.listingStats.totalViews).toBe(5900);
    });

    it('calculates total inquiries', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.listingStats.totalInquiries).toBe(65);
    });

    it('calculates average quality', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.listingStats.avgQuality).toBe('88'); // (92+88+85)/3
    });

    it('calculates available listings', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.listingStats.availableListings).toBe(2); // Villa & Penthouse
    });
  });

  // ── Filtering ──────────────────────────────────────────
  describe('Filtering', () => {
    it('filters by search query', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.setSearchQuery('summer'));
      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].name).toBe('Summer Showcase');
    });

    it('filters by campaign status', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.setFilterCampaignStatus('paused'));
      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].name).toBe('DAMAC Promo');
    });

    it('filters by platform', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.setFilterPlatform('facebook'));
      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].name).toBe('Summer Showcase');
    });

    it('combines multiple filters', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => {
        result.current.setFilterCampaignStatus('active');
        result.current.setFilterPlatform('instagram');
      });
      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].name).toBe('Luxury Villas');
    });

    it('returns all when filters are "all"', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.filteredCampaigns).toHaveLength(4);
    });

    it('returns empty when no match', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.setSearchQuery('nonexistent'));
      expect(result.current.filteredCampaigns).toHaveLength(0);
    });
  });

  // ── CRUD Operations ────────────────────────────────────
  describe('CRUD Operations', () => {
    it('adds a new campaign', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => {
        result.current.addCampaign({
          name: 'New Campaign',
          platform: 'tiktok',
          status: 'active',
          budget: 10000,
          spent: 0,
          reach: 0,
          leads: 0,
          cpl: 0,
        });
      });
      expect(result.current.campaigns).toHaveLength(5);
      expect(result.current.campaigns[4].name).toBe('New Campaign');
    });

    it('updates an existing campaign', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.updateCampaign(1, { name: 'Updated Showcase' }));
      const updated = result.current.campaigns.find(c => c.id === 1);
      expect(updated?.name).toBe('Updated Showcase');
    });

    it('deletes a campaign', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.deleteCampaign(1));
      expect(result.current.campaigns).toHaveLength(3);
      expect(result.current.campaigns.find(c => c.id === 1)).toBeUndefined();
    });

    it('updates a listing', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.updateListing(1, { views: 5000 }));
      const updated = result.current.listings.find(l => l.id === 1);
      expect(updated?.views).toBe(5000);
    });
  });

  // ── Selection State ────────────────────────────────────
  describe('Selection State', () => {
    it('selects a campaign', () => {
      const { result } = renderHook(() => useMarketingData());
      const campaign = result.current.campaigns[0];
      act(() => result.current.setSelectedCampaign(campaign));
      expect(result.current.selectedCampaign).toEqual(campaign);
    });

    it('toggles olivia active state', () => {
      const { result } = renderHook(() => useMarketingData());
      act(() => result.current.setOliviaActive(false));
      expect(result.current.oliviaActive).toBe(false);
    });
  });

  // ── Status Badge Helpers ───────────────────────────────
  describe('Status Badge Helpers', () => {
    it('returns green for active campaign', () => {
      const { result } = renderHook(() => useMarketingData());
      const badge = result.current.getCampaignStatusBadge('active');
      expect(badge.color).toBe('#10b981');
    });

    it('returns yellow for paused campaign', () => {
      const { result } = renderHook(() => useMarketingData());
      const badge = result.current.getCampaignStatusBadge('paused');
      expect(badge.color).toBe('#f59e0b');
    });

    it('returns gray for completed campaign', () => {
      const { result } = renderHook(() => useMarketingData());
      const badge = result.current.getCampaignStatusBadge('completed');
      expect(badge.color).toBe('#6b7280');
    });

    it('returns gray for unknown status', () => {
      const { result } = renderHook(() => useMarketingData());
      const badge = result.current.getCampaignStatusBadge('unknown');
      expect(badge.color).toBe('#6b7280');
    });

    it('returns green for healthy site', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.getSiteStatusColor('healthy')).toBe('#10b981');
    });

    it('returns yellow for degraded site', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.getSiteStatusColor('degraded')).toBe('#f59e0b');
    });

    it('returns red for down site', () => {
      const { result } = renderHook(() => useMarketingData());
      expect(result.current.getSiteStatusColor('down')).toBe('#ef4444');
    });
  });
});
