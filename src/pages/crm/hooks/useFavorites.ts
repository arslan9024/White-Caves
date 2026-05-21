/**
 * useFavorites — Custom hook for Favorites management
 * Fetches favorite properties from Redux and provides add/remove functionality.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency as formatCurrencyUtil } from '../../../utils';
import { createLogger } from '../../../utils/logger';
import * as crmService from '../../../services/crmService';

const log = createLogger('useFavorites');

// ─── Types ──────────────────────────────────────────────────────────────

export interface FavoriteProperty {
  id: string | number;
  property_id?: string | number;
  title?: string;
  location?: string;
  price?: number;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  images?: string[];
  status?: string;
  [key: string]: unknown;
}

// ─── Constants ──────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

// ─── Hook ───────────────────────────────────────────────────────────────

export function useFavorites() {
  const navigate = useNavigate();
  const [allFavorites, setAllFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await crmService.fetchFavorites();
      setAllFavorites((Array.isArray(items) ? items : []) as FavoriteProperty[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      log.error('Failed to fetch favorites:', message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // ─── Local state ────────────────────────────────────────────────

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ─── Derived data ───────────────────────────────────────────────

  const filteredFavorites = useMemo(() => {
    if (!search) return allFavorites;
    return allFavorites.filter((f: FavoriteProperty) =>
      [f.title, f.location].some(field => field?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [allFavorites, search]);

  const totalPages = Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE);

  const paginatedFavorites = filteredFavorites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Actions ────────────────────────────────────────────────────

  const handleRemoveFavorite = useCallback(async (propertyId: string | number) => {
    try {
      await crmService.removeFavorite(String(propertyId));
      setAllFavorites(prev =>
        prev.filter(fav => String(fav.property_id ?? fav.id) !== String(propertyId))
      );
    } catch (err: unknown) {
      log.error('Failed to remove favorite:', err instanceof Error ? err.message : String(err));
    }
  }, []);

  const formatCurrency = useCallback(
    (amount: number | undefined) => formatCurrencyUtil(amount),
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    allFavorites,
    filteredFavorites,
    paginatedFavorites,
    totalPages,
    loading,
    error,
    // State
    search,
    currentPage,
    // Page constants
    ITEMS_PER_PAGE,
    // Actions
    handleRemoveFavorite,
    handleSearchChange,
    setCurrentPage,
    retryFetch,
    goBack,
    // Formatters
    formatCurrency,
  };
}
