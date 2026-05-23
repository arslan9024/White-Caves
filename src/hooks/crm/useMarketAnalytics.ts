/**
 * useMarketAnalytics — Data hook for market analytics (Phase 4C)
 *
 * Provides:
 *   - Market overview, price trends, rental yields, comparables, demand heatmap, offer spread
 *   - Loading/error state management
 *   - Filter parameters
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  fetchMarketOverviewAPI,
  fetchPriceTrendsAPI,
  fetchRentalYieldsAPI,
  fetchComparablesAPI,
  fetchDemandHeatmapAPI,
  fetchOfferSpreadAPI,
} from '../../store/crmDataSlice';

// ─── Types ──────────────────────────────────────────────────────────────

interface PriceTrend {
  area: string;
  propertyType: string;
  avgPricePerSqft: number;
  medianPricePerSqft: number;
  minPricePerSqft: number;
  maxPricePerSqft: number;
  sampleSize: number;
  period: string;
}

interface RentalYield {
  area: string;
  propertyType: string;
  avgYield: number;
  avgAnnualRent: number;
  avgPropertyValue: number;
  sampleSize: number;
}

interface ComparableProperty {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  sqft: number;
  pricePerSqft: number;
  bedrooms: number;
  similarity: number;
}

interface DemandIndex {
  area: string;
  leadCount: number;
  availableInventory: number;
  demandIndex: number;
  avgBudget: number;
  avgLeadScore: number;
  viewingCount: number;
  status: 'hot' | 'warm' | 'balanced' | 'cool' | 'cold';
}

interface MarketOverview {
  totalProperties: number;
  totalAvailable: number;
  avgPrice: number;
  avgPricePerSqft: number;
  avgRentalYield: number;
  totalTransactions30d: number;
  totalTransactionValue30d: number;
  avgDaysOnMarket: number;
  topAreas: Array<{ area: string; count: number; avgPrice: number }>;
  priceDistribution: Array<{ range: string; count: number }>;
}

interface OfferSpread {
  area: string;
  avgListPrice: number;
  avgOfferPrice: number;
  avgSpread: number;
  acceptanceRate: number;
  sampleSize: number;
}

// ─── Hook ───────────────────────────────────────────────────────────────

export function useMarketAnalytics() {
  const dispatch = useDispatch<AppDispatch>();
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [priceTrends, setPriceTrends] = useState<PriceTrend[]>([]);
  const [rentalYields, setRentalYields] = useState<RentalYield[]>([]);
  const [comparables, setComparables] = useState<ComparableProperty[]>([]);
  const [demandHeatmap, setDemandHeatmap] = useState<DemandIndex[]>([]);
  const [offerSpreads, setOfferSpreads] = useState<OfferSpread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch full market overview snapshot */
  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchMarketOverviewAPI()).unwrap();
      setOverview(result as unknown as MarketOverview);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch market overview');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /** Fetch price per sqft trends with optional filters */
  const fetchTrends = useCallback(async (params?: { area?: string; type?: string; days?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchPriceTrendsAPI(params)).unwrap();
      setPriceTrends(result as unknown as PriceTrend[]);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch price trends');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /** Fetch rental yields */
  const fetchYields = useCallback(async (params?: { area?: string; type?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchRentalYieldsAPI(params)).unwrap();
      setRentalYields(result as unknown as RentalYield[]);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch rental yields');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /** Fetch comparable properties for a listing */
  const fetchComparableProperties = useCallback(async (propertyId: string, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchComparablesAPI({ propertyId, limit })).unwrap();
      setComparables(result as unknown as ComparableProperty[]);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch comparables');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /** Fetch demand heatmap */
  const fetchDemand = useCallback(async (days?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchDemandHeatmapAPI(days ? { days } : undefined)).unwrap();
      setDemandHeatmap(result as unknown as DemandIndex[]);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch demand heatmap');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /** Fetch offer spread analytics */
  const fetchOfferSpread = useCallback(async (params?: { area?: string; days?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchOfferSpreadAPI(params)).unwrap();
      setOfferSpreads(result as unknown as OfferSpread[]);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch offer spread');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    // Data
    overview,
    priceTrends,
    rentalYields,
    comparables,
    demandHeatmap,
    offerSpreads,

    // State
    loading,
    error,

    // Actions
    fetchOverview,
    fetchTrends,
    fetchYields,
    fetchComparableProperties,
    fetchDemand,
    fetchOfferSpread,
  };
}
