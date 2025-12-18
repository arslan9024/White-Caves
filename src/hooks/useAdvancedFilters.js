import { useState, useCallback, useMemo } from 'react';

const DEFAULT_FILTERS = {
  priceRange: [0, 50000000],
  propertyTypes: [],
  bedrooms: null,
  bathrooms: null,
  sizeRange: [0, 20000],
  amenities: [],
  areas: [],
  listingType: 'all',
  sortBy: 'newest',
  radius: null,
  keywords: ''
};

export const useAdvancedFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleFilter = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openFilters = useCallback(() => setIsOpen(true), []);
  const closeFilters = useCallback(() => setIsOpen(false), []);

  const applyToProperties = useCallback((properties) => {
    let filtered = [...properties];

    if (filters.listingType !== 'all') {
      filtered = filtered.filter(p => 
        filters.listingType === 'buy' ? p.forSale : p.forRent
      );
    }

    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => 
        filters.propertyTypes.includes(p.type?.toLowerCase())
      );
    }

    const [minPrice, maxPrice] = filters.priceRange;
    if (minPrice > 0 || maxPrice < 50000000) {
      filtered = filtered.filter(p => {
        const price = p.price || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    if (filters.bedrooms) {
      const bedroomValue = filters.bedrooms === '6+' ? 6 : parseInt(filters.bedrooms);
      filtered = filtered.filter(p => {
        if (filters.bedrooms === '6+') return (p.bedrooms || 0) >= 6;
        return p.bedrooms === bedroomValue;
      });
    }

    if (filters.bathrooms) {
      const bathroomValue = filters.bathrooms === '5+' ? 5 : parseInt(filters.bathrooms);
      filtered = filtered.filter(p => {
        if (filters.bathrooms === '5+') return (p.bathrooms || 0) >= 5;
        return p.bathrooms === bathroomValue;
      });
    }

    const [minSize, maxSize] = filters.sizeRange;
    if (minSize > 0 || maxSize < 20000) {
      filtered = filtered.filter(p => {
        const size = p.size || p.sqft || 0;
        return size >= minSize && size <= maxSize;
      });
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p => {
        const propertyAmenities = p.amenities || [];
        return filters.amenities.every(a => 
          propertyAmenities.some(pa => 
            pa.toLowerCase().includes(a.toLowerCase())
          )
        );
      });
    }

    if (filters.areas.length > 0) {
      filtered = filtered.filter(p => {
        const location = p.location || p.area || '';
        return filters.areas.some(area => 
          location.toLowerCase().includes(area.toLowerCase())
        );
      });
    }

    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase().split(/\s+/);
      filtered = filtered.filter(p => {
        const searchText = `${p.title || ''} ${p.description || ''} ${p.location || ''}`.toLowerCase();
        return keywords.some(kw => searchText.includes(kw));
      });
    }

    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'size_large':
        filtered.sort((a, b) => (b.size || b.sqft || 0) - (a.size || a.sqft || 0));
        break;
      case 'size_small':
        filtered.sort((a, b) => (a.size || a.sqft || 0) - (b.size || b.sqft || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return filtered;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 20000) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.areas.length > 0) count++;
    if (filters.listingType !== 'all') count++;
    if (filters.keywords) count++;
    return count;
  }, [filters]);

  const getFilterSummary = useCallback(() => {
    const parts = [];
    
    if (filters.listingType !== 'all') {
      parts.push(filters.listingType === 'buy' ? 'For Sale' : 'For Rent');
    }
    
    if (filters.propertyTypes.length > 0) {
      parts.push(filters.propertyTypes.join(', '));
    }
    
    if (filters.bedrooms) {
      parts.push(`${filters.bedrooms} bed`);
    }
    
    if (filters.areas.length > 0) {
      parts.push(filters.areas.slice(0, 2).join(', ') + 
        (filters.areas.length > 2 ? ` +${filters.areas.length - 2}` : '')
      );
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'All Properties';
  }, [filters]);

  return {
    filters,
    isOpen,
    activeFilterCount,
    updateFilters,
    resetFilters,
    toggleFilter,
    openFilters,
    closeFilters,
    applyToProperties,
    getFilterSummary
  };
};

export default useAdvancedFilters;
