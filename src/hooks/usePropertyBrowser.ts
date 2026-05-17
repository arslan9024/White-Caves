/**
 * usePropertyBrowser Hook
 * =======================
 * Extracted from PropertiesPage — owns Redux data fetching,
 * property mapping, search filtering, and favorites management.
 */

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../store/dashboardSlice';
import {
  selectAllProperties,
  selectPropertiesLoading,
  fetchPropertiesFromAPI,
} from '../store/crmDataSlice';

interface PropertyType {
  id: string;
  title: string;
  location: string;
  type: string;
  purpose: 'buy' | 'rent';
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  priceType?: string;
  images: string[];
  image: string;
  amenities: string[];
  featured: boolean;
  yearBuilt: number;
}

/** Default placeholder image when property has no images */
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

/** Map a CRM API property to the display format */
function mapApiProperty(p: Record<string, unknown>): PropertyType {
  const images =
    Array.isArray(p.images) && p.images.length > 0 ? (p.images as string[]) : [PLACEHOLDER_IMAGE];
  return {
    id: String(p.id || ''),
    title: String(p.title || 'Untitled Property'),
    location: String(p.location || p.area || 'Dubai'),
    type: String(p.type || 'Apartment'),
    purpose: (p.purpose as 'buy' | 'rent') || 'buy',
    beds: Number(p.bedrooms ?? p.beds ?? 0),
    baths: Number(p.bathrooms ?? p.baths ?? 0),
    sqft: Number(p.sqft ?? 0),
    price: Number(p.price ?? 0),
    priceType: p.priceType ? String(p.priceType) : undefined,
    images,
    image: images[0],
    amenities: Array.isArray(p.amenities) ? (p.amenities as string[]) : [],
    featured: Boolean(p.featured),
    yearBuilt: Number(p.yearBuilt ?? p.year_built ?? new Date().getFullYear()),
  };
}

/** Sort properties by a given key */
function sortProperties(props: PropertyType[], sortBy: string): PropertyType[] {
  const sorted = [...props];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'sqft_desc':
      return sorted.sort((a, b) => b.sqft - a.sqft);
    case 'newest':
      return sorted.sort((a, b) => b.yearBuilt - a.yearBuilt);
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

export type { PropertyType };

function normalizeAreaParam(area?: string | null): string | undefined {
  if (!area) return undefined;

  const compact = area.trim();
  if (!compact) return undefined;

  const special: Record<string, string> = {
    jbr: 'Jumeirah Beach Residence',
    jvc: 'Jumeirah Village Circle',
    'dubai-hills': 'Dubai Hills Estate',
  };

  if (special[compact.toLowerCase()]) {
    return special[compact.toLowerCase()];
  }

  return compact.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
}

export function usePropertyBrowser() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const favorites = useSelector((state: RootState) => selectFavorites(state));
  const apiProperties = useSelector(selectAllProperties) as Record<string, unknown>[];
  const loading = useSelector(selectPropertiesLoading);
  const filters = useSelector((state: RootState) => state.properties.filters);

  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);

  const queryFilters = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const area = params.get('area');
    const locationParam = params.get('location');
    const resolvedLocation = locationParam || normalizeAreaParam(area);
    // Phase 34: ?mode=rent|buy from hero leasing CTA → purpose filter
    const modeParam = params.get('mode')?.toLowerCase();
    const mode = modeParam === 'rent' || modeParam === 'buy' ? modeParam : undefined;

    return {
      search: params.get('search') || undefined,
      location: resolvedLocation || undefined,
      type: params.get('type') || undefined,
      beds: params.get('beds') ? Number(params.get('beds')) : undefined,
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      mode,
    };
  }, [location.search]);

  // Fetch properties from API and keep backend query in sync with current URL + Redux filters
  useEffect(() => {
    const promise = dispatch(
      fetchPropertiesFromAPI({
        search: queryFilters.search || filters.search || undefined,
        location:
          queryFilters.location ||
          (filters.locations.length > 0 ? filters.locations[0] : undefined),
        type:
          queryFilters.type ||
          (filters.propertyTypes.length > 0 ? filters.propertyTypes[0] : undefined),
        beds: queryFilters.beds || (filters.beds > 0 ? filters.beds : undefined),
        baths: filters.baths > 0 ? filters.baths : undefined,
        minPrice: queryFilters.minPrice ?? (filters.minPrice > 0 ? filters.minPrice : undefined),
        maxPrice:
          queryFilters.maxPrice ?? (filters.maxPrice < 100_000_000 ? filters.maxPrice : undefined),
        sortBy: filters.sortBy,
        sortOrder: filters.sortBy === 'price_asc' ? 'asc' : 'desc',
        pageSize: 100,
      })
    );
    return () => {
      promise.abort?.();
    };
  }, [dispatch, queryFilters, filters]);

  // Map API properties to display format
  const properties = useMemo(() => apiProperties.map(mapApiProperty), [apiProperties]);

  // Apply Redux filters + local search
  const filteredProperties = useMemo(() => {
    let result = properties;

    // Text search (local input OR Redux filters.search)
    const term = (searchTerm || filters.search || '').toLowerCase().trim();
    if (term) {
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term) ||
          p.type.toLowerCase().includes(term)
      );
    }

    // Location filter
    if (filters.locations.length > 0) {
      result = result.filter(p => filters.locations.includes(p.location));
    }

    // Property type filter
    if (filters.propertyTypes.length > 0) {
      result = result.filter(p => filters.propertyTypes.includes(p.type));
    }

    // Bedrooms
    if (filters.beds > 0) {
      result = result.filter(p => p.beds >= filters.beds);
    }

    // Bathrooms
    if (filters.baths > 0) {
      result = result.filter(p => p.baths >= filters.baths);
    }

    // Price range
    if (filters.minPrice > 0) {
      result = result.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice < 100_000_000) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    // Area (sqft)
    if (filters.minSqft > 0) {
      result = result.filter(p => p.sqft >= filters.minSqft);
    }
    if (filters.maxSqft < 20_000) {
      result = result.filter(p => p.sqft <= filters.maxSqft);
    }

    // Phase 34: Purpose filter from ?mode param (rent/buy leasing conversion funnel)
    if (queryFilters.mode === 'rent') {
      result = result.filter(p => p.purpose === 'rent');
    } else if (queryFilters.mode === 'buy') {
      result = result.filter(p => p.purpose === 'buy');
    }

    // Amenities
    if (filters.amenities.length > 0) {
      result = result.filter(p => filters.amenities.every(a => p.amenities.includes(a)));
    }

    // Sort
    result = sortProperties(result, filters.sortBy);

    return result;
  }, [properties, searchTerm, filters, queryFilters.mode]);

  const handleFavoriteToggle = useCallback(
    (property: PropertyType) => {
      const isFavorited = favorites.some(f => f.id === property.id);
      if (isFavorited) {
        dispatch(removeFromFavorites(property.id));
      } else {
        dispatch(
          addToFavorites({
            id: property.id,
            title: property.title,
            location: property.location,
            price: property.price.toLocaleString(),
            image: property.image,
          })
        );
      }
    },
    [favorites, dispatch]
  );

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favorites.some(f => f.id === propertyId),
    [favorites]
  );

  return {
    loading,
    favorites,
    view,
    setView,
    searchTerm,
    handleSearchChange,
    properties,
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    handleFavoriteToggle,
    isFavorite,
  };
}
