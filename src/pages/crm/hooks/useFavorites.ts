/**
 * useFavorites — Custom hook for Favorites management
 * Fetches favorite properties from Redux and provides add/remove functionality.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency as formatCurrencyUtil } from '../../../utils';
import { createLogger } from '../../../utils/logger';

const log = createLogger('useFavorites');
import type { AppDispatch } from '../../../store/store';
import {
  selectAllFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
  fetchFavoritesAPI,
  removeFavoriteAPI,
  addActivity,
} from '../../../store/crmDataSlice';

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
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allFavorites = useSelector(selectAllFavorites) as FavoriteProperty[];
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchFavoritesAPI());
  }, [dispatch]);

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

  const handleRemoveFavorite = useCallback(
    (propertyId: string | number) => {
      dispatch(removeFavoriteAPI(String(propertyId)))
        .then((result: any) => {
          if (removeFavoriteAPI.fulfilled.match(result)) {
            dispatch(
              addActivity({
                id: Date.now(),
                type: 'favorite',
                description: 'Property removed from favorites',
                timestamp: new Date().toISOString(),
              })
            );
          }
        })
        .catch((error: unknown) => {
          log.error(
            'Failed to remove favorite:',
            error instanceof Error ? error.message : String(error)
          );
        });
    },
    [dispatch]
  );

  const formatCurrency = useCallback(
    (amount: number | undefined) => formatCurrencyUtil(amount),
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    dispatch(fetchFavoritesAPI());
  }, [dispatch]);

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
