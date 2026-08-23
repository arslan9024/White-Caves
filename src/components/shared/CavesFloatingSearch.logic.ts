import { useState, useMemo, useCallback } from 'react';
import { GLOBAL_PROPERTY_MOCKS, GlobalPropertyMock } from '../../mocks/globalPropertyMocks';

export interface FloatingSearchFilters {
  searchTerm: string;
  community: string;
  minPrice: number | '';
  maxPrice: number | '';
  beds: number | 'All';
  status: string;
  propertyType: string;
}

export function useCavesFloatingSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FloatingSearchFilters>({
    searchTerm: '',
    community: 'All',
    minPrice: '',
    maxPrice: '',
    beds: 'All',
    status: 'All',
    propertyType: 'All',
  });

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  const updateFilter = useCallback(
    <K extends keyof FloatingSearchFilters>(key: K, value: FloatingSearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      community: 'All',
      minPrice: '',
      maxPrice: '',
      beds: 'All',
      status: 'All',
      propertyType: 'All',
    });
  }, []);

  // Filter 100 properties entirely in memory without server latency
  const filteredProperties = useMemo(() => {
    return GLOBAL_PROPERTY_MOCKS.filter((prop) => {
      // Search term (title, id, community, features)
      if (filters.searchTerm.trim()) {
        const query = filters.searchTerm.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesId = prop.id.toLowerCase().includes(query);
        const matchesCommunity = (prop.community || '').toLowerCase().includes(query);
        const matchesFeature = (prop.features || []).some((f: string) => (typeof f === 'string' ? f.toLowerCase().includes(query) : false));
        if (!matchesTitle && !matchesId && !matchesCommunity && !matchesFeature) {
          return false;
        }
      }

      // Community filter
      if (filters.community !== 'All' && prop.community !== filters.community) {
        return false;
      }

      // Price filter
      if (typeof filters.minPrice === 'number' && (prop.priceAED || 0) < filters.minPrice) {
        return false;
      }
      if (typeof filters.maxPrice === 'number' && (prop.priceAED || 0) > filters.maxPrice) {
        return false;
      }

      // Beds filter
      if (filters.beds !== 'All' && prop.beds !== filters.beds) {
        return false;
      }

      // Status filter
      if (filters.status !== 'All' && prop.status !== filters.status) {
        return false;
      }

      // Property Type filter
      if (filters.propertyType !== 'All' && prop.propertyType !== filters.propertyType) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const communitiesList = useMemo(() => {
    const set = new Set(GLOBAL_PROPERTY_MOCKS.map((p) => p.community));
    return ['All', ...Array.from(set)];
  }, []);

  const totalSeededCount = GLOBAL_PROPERTY_MOCKS.length;
  const availableCount = useMemo(
    () => GLOBAL_PROPERTY_MOCKS.filter((p) => p.status === 'Available').length,
    []
  );

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    filters,
    updateFilter,
    resetFilters,
    filteredProperties,
    communitiesList,
    totalSeededCount,
    availableCount,
  };
}
