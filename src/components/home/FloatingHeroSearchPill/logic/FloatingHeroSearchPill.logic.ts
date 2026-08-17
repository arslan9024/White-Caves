/**
 * FloatingHeroSearchPill.logic.ts — Hook & Logic Layer
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_TABS, PROPERTY_TYPES, PRICE_RANGES } from '../data/FloatingHeroSearchPill.data';

export function useFloatingHeroSearchPillLogic() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [location, setLocation] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('any');

  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType !== 'all') params.set('type', propertyType);
    if (priceRange !== 'any') params.set('price', priceRange);
    if (activeTab !== 'all') params.set('tab', activeTab);
    navigate(`/properties?${params.toString()}`);
  }, [location, propertyType, priceRange, activeTab, navigate]);

  return {
    activeTab,
    setActiveTab,
    location,
    setLocation,
    propertyType,
    setPropertyType,
    priceRange,
    setPriceRange,
    handleSearch,
    tabs: SEARCH_TABS,
    propertyTypes: PROPERTY_TYPES,
    priceRanges: PRICE_RANGES,
  };
}
