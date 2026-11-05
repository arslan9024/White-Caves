/**
 * REPropertyManager.logic.ts
 * 7-Category Architecture: Pure Logic Layer
 * State management, inventory calculations & CRUD actions for Real Estate Properties
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback } from 'react';
import type {
  REPropertyNode,
  REPropertyFilterState,
  REPropertyMetrics,
  REPropertyStatus,
} from './REPropertyManager.types';
import { CANONICAL_RE_PROPERTIES } from './REPropertyManager.data';

export function useREPropertyManager(
  initialProperties: REPropertyNode[] = CANONICAL_RE_PROPERTIES
) {
  const [properties, setProperties] = useState<REPropertyNode[]>(initialProperties);
  const [filters, setFilters] = useState<REPropertyFilterState>({
    searchQuery: '',
    selectedPurpose: 'ALL',
    selectedType: 'All Types',
    selectedLocation: 'All Locations',
    selectedStatus: 'ALL',
  });

  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<REPropertyNode | null>(
    null
  );
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<REPropertyNode | null>(null);

  // Compute live portfolio metrics
  const metrics: REPropertyMetrics = useMemo(() => {
    let totalInventoryValue = 0;
    let availableCount = 0;
    let underOfferCount = 0;
    let leasedCount = 0;
    let soldCount = 0;

    for (const prop of properties) {
      if (prop.status === 'AVAILABLE' || prop.status === 'UNDER_OFFER') {
        totalInventoryValue += prop.priceAED;
      }
      if (prop.status === 'AVAILABLE') availableCount++;
      else if (prop.status === 'UNDER_OFFER') underOfferCount++;
      else if (prop.status === 'LEASED') leasedCount++;
      else if (prop.status === 'SOLD') soldCount++;
    }

    return {
      totalInventoryValue,
      totalUnits: properties.length,
      availableCount,
      underOfferCount,
      leasedCount,
      soldCount,
    };
  }, [properties]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    return properties.filter(prop => {
      // Search query
      if (q) {
        const matchesQuery =
          prop.title.toLowerCase().includes(q) ||
          prop.repropertyId.toLowerCase().includes(q) ||
          prop.location.toLowerCase().includes(q) ||
          prop.subLocation.toLowerCase().includes(q) ||
          prop.trakheesiPermit.toLowerCase().includes(q) ||
          prop.dldTitleDeedNumber.toLowerCase().includes(q) ||
          prop.developer.toLowerCase().includes(q) ||
          prop.assignedBroker.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Purpose
      if (filters.selectedPurpose !== 'ALL' && prop.purpose !== filters.selectedPurpose) {
        return false;
      }

      // Property Type
      if (filters.selectedType !== 'All Types' && prop.propertyType !== filters.selectedType) {
        return false;
      }

      // Location
      if (
        filters.selectedLocation !== 'All Locations' &&
        prop.location !== filters.selectedLocation
      ) {
        return false;
      }

      // Status
      if (filters.selectedStatus !== 'ALL' && prop.status !== filters.selectedStatus) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  // Handlers
  const handleSetSearch = useCallback((searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  }, []);

  const handleSetPurpose = useCallback((selectedPurpose: 'ALL' | 'BUY' | 'RENT') => {
    setFilters(prev => ({ ...prev, selectedPurpose }));
  }, []);

  const handleSetType = useCallback((selectedType: string) => {
    setFilters(prev => ({ ...prev, selectedType }));
  }, []);

  const handleSetLocation = useCallback((selectedLocation: string) => {
    setFilters(prev => ({ ...prev, selectedLocation }));
  }, []);

  const handleSetStatus = useCallback((selectedStatus: string) => {
    setFilters(prev => ({ ...prev, selectedStatus }));
  }, []);

  const handleCreateProperty = useCallback(
    (payload: Omit<REPropertyNode, '_id' | 'repropertyId' | 'createdAt'>) => {
      const nextNum = properties.length + 1;
      const newId = `REP-${String(nextNum).padStart(3, '0')}`;
      const newProperty: REPropertyNode = {
        ...payload,
        _id: `prop-${newId.toLowerCase()}`,
        repropertyId: newId,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProperties(prev => [newProperty, ...prev]);
      setIsEditDrawerOpen(false);
    },
    [properties.length]
  );

  const handleUpdateProperty = useCallback((id: string, patch: Partial<REPropertyNode>) => {
    setProperties(prev =>
      prev.map(p => (p._id === id || p.repropertyId === id ? { ...p, ...patch } : p))
    );
    setSelectedPropertyForModal(prev =>
      prev && (prev._id === id || prev.repropertyId === id) ? { ...prev, ...patch } : prev
    );
    setIsEditDrawerOpen(false);
    setEditingProperty(null);
  }, []);

  const handleAdvanceStatus = useCallback((id: string, newStatus: REPropertyStatus) => {
    setProperties(prev =>
      prev.map(p => (p._id === id || p.repropertyId === id ? { ...p, status: newStatus } : p))
    );
    setSelectedPropertyForModal(prev =>
      prev && (prev._id === id || prev.repropertyId === id) ? { ...prev, status: newStatus } : prev
    );
  }, []);

  const handleDeleteProperty = useCallback((id: string) => {
    // Under Bhakti preservation, shift to OFF_MARKET rather than permanent deletion
    setProperties(prev =>
      prev.map(p => (p._id === id || p.repropertyId === id ? { ...p, status: 'OFF_MARKET' } : p))
    );
    setSelectedPropertyForModal(prev =>
      prev && (prev._id === id || prev.repropertyId === id)
        ? { ...prev, status: 'OFF_MARKET' }
        : prev
    );
  }, []);

  const handleOpenDetailModal = useCallback((property: REPropertyNode) => {
    setSelectedPropertyForModal(property);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedPropertyForModal(null);
  }, []);

  const handleOpenCreateDrawer = useCallback(() => {
    setEditingProperty(null);
    setIsEditDrawerOpen(true);
  }, []);

  const handleOpenEditDrawer = useCallback((property: REPropertyNode) => {
    setEditingProperty(property);
    setIsEditDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsEditDrawerOpen(false);
    setEditingProperty(null);
  }, []);

  return {
    properties,
    filteredProperties,
    filters,
    metrics,
    selectedPropertyForModal,
    isEditDrawerOpen,
    editingProperty,
    handleSetSearch,
    handleSetPurpose,
    handleSetType,
    handleSetLocation,
    handleSetStatus,
    handleCreateProperty,
    handleUpdateProperty,
    handleAdvanceStatus,
    handleDeleteProperty,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenCreateDrawer,
    handleOpenEditDrawer,
    handleCloseDrawer,
  };
}
