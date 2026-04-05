/**
 * usePropertyBrowser Hook
 * =======================
 * Extracted from PropertiesPage — owns Redux data fetching,
 * property mapping, search filtering, and favorites management.
 */

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../store/dashboardSlice';
import { selectAllProperties, selectPropertiesLoading, fetchPropertiesFromAPI } from '../store/crmDataSlice';

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
  const images = Array.isArray(p.images) && p.images.length > 0
    ? (p.images as string[])
    : [PLACEHOLDER_IMAGE];
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

export type { PropertyType };

export function usePropertyBrowser() {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => selectFavorites(state));
  const apiProperties = useSelector(selectAllProperties) as Record<string, unknown>[];
  const loading = useSelector(selectPropertiesLoading);

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);

  // Fetch properties from API on mount
  useEffect(() => {
    const promise = dispatch(fetchPropertiesFromAPI({}));
    return () => { promise.abort?.(); };
  }, [dispatch]);

  // Map API properties to display format
  const properties = useMemo(
    () => apiProperties.map(mapApiProperty),
    [apiProperties]
  );

  // Filter by search term
  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) return properties;
    const term = searchTerm.toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.type.toLowerCase().includes(term)
    );
  }, [properties, searchTerm]);

  const handleFavoriteToggle = useCallback((property: PropertyType) => {
    const isFavorited = favorites.some(f => f.id === property.id);
    if (isFavorited) {
      dispatch(removeFromFavorites(property.id));
    } else {
      dispatch(addToFavorites({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price.toLocaleString(),
        image: property.image,
      }));
    }
  }, [favorites, dispatch]);

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
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    handleFavoriteToggle,
    isFavorite,
  };
}
