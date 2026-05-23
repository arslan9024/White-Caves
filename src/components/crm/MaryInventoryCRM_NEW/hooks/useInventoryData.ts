import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { useAppDispatch } from '../../../../store/store';
import type { InventoryFilters } from '../../../../store/slices/inventorySlice';
import {
  loadInventoryData,
  selectFilteredProperties,
  selectInventoryStats,
  selectFilters,
  selectOwners,
  selectFilterOptions,
  selectActiveFiltersCount,
  setFilter,
  clearFilters,
  toggleMultiOwnerFilter,
  toggleMultiPhoneFilter,
  toggleMultiPropertyFilter
} from '../../../../store/slices/inventorySlice';

/**
 * Custom hook to manage inventory data and filters
 * Consolidates Redux selectors, dispatchers, and derived data
 */
export function useInventoryData() {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const properties = useSelector(selectFilteredProperties);
  const stats = useSelector(selectInventoryStats);
  const filters = useSelector(selectFilters);
  const owners = useSelector(selectOwners);
  const filterOptions = useSelector(selectFilterOptions);
  const activeFiltersCount = useSelector(selectActiveFiltersCount);
  const loading = useSelector((state: RootState) => state.inventory?.loading);

  // Load data on mount
  useEffect(() => {
    dispatch(loadInventoryData());
  }, [dispatch]);

  // Helper functions
  const handleFilterChange = (key: keyof InventoryFilters, value: string | boolean | null) => {
    dispatch(setFilter({ key, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleFilterToggle = (filterKey: string) => {
    switch (filterKey) {
      case 'showMultiOwner':
        dispatch(toggleMultiOwnerFilter());
        break;
      case 'showMultiPhone':
        dispatch(toggleMultiPhoneFilter());
        break;
      case 'showMultiProperty':
        dispatch(toggleMultiPropertyFilter());
        break;
      default:
        break;
    }
  };

  const getOwnerProperties = (ownerId: string) => {
    const propertyIds = owners.byId?.[ownerId]?.properties || [];
    return propertyIds.map(id => {
      const prop = properties.find(p => p.pNumber === id);
      return prop || { pNumber: id, project: 'Unknown', area: 'Unknown', status: 'Unknown' };
    });
  };

  const getPropertyOwners = (property: { owners?: string[] }) => {
    if (!property?.owners) return [];
    return property.owners.map(ownerId => owners.byId?.[ownerId]).filter(Boolean);
  };

  // Enhanced utilities for other tabs
  /**
   * Get properties by cluster
   */
  const getPropertiesByCluster = (cluster: string) => {
    if (!cluster || cluster === 'all') return properties;
    return properties.filter(p => p.cluster === cluster);
  };

  /**
   * Get unique clusters from properties
   */
  const getClusters = () => {
    const clusters = new Set(properties.map(p => p.cluster).filter(Boolean));
    return Array.from(clusters).sort();
  };

  /**
   * Get unique projects (master projects)
   */
  const getProjects = () => {
    const projects = new Set(properties.map(p => p.masterProject || p.project).filter(Boolean));
    return Array.from(projects).sort();
  };

  /**
   * Get property statistics by cluster
   */
  const getClusterStats = (cluster: string) => {
    const clusterProps = getPropertiesByCluster(cluster);
    return {
      totalProperties: clusterProps.length,
      totalOwners: new Set(clusterProps.flatMap(p => p.owners || [])).size,
      multiOwnerCount: clusterProps.filter(p => (p.owners?.length ?? 0) > 1).length,
      averageOwnersPerProperty: clusterProps.length > 0 
        ? (clusterProps.reduce((sum, p) => sum + (p.owners?.length || 0), 0) / clusterProps.length).toFixed(1)
        : 0
    };
  };

  /**
   * Export properties to CSV (for DataToolsTab)
   */
  const exportToCSV = async (selectedProperties = properties) => {
    try {
      const csvContent = [
        ['Property Number', 'Project', 'Cluster', 'Area', 'Building', 'Unit', 'Floor', 'Owners Count', 'Status'].join(','),
        ...selectedProperties.map(p => [
          p.pNumber,
          p.project,
          p.cluster,
          p.area,
          p.building,
          p.unitNumber,
          p.floor,
          p.owners?.length || 0,
          p.status
        ].map(v => `"${v || ''}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      return { success: true, message: `Exported ${selectedProperties.length} properties` };
    } catch (error: unknown) {
      return { success: false, message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  };

  /**
   * Validate property data (for DataToolsTab)
   */
  const validateData = () => {
    const issues = {
      missingPNumber: properties.filter(p => !p.pNumber),
      missingCluster: properties.filter(p => !p.cluster),
      missingProject: properties.filter(p => !p.project),
      missingOwners: properties.filter(p => !p.owners || p.owners.length === 0),
      invalidOwnerRefs: [] as Array<{ property: string; ownerId: string }>
    };

    // Check for invalid owner references
    properties.forEach(prop => {
      prop.owners?.forEach(ownerId => {
        if (!owners.byId?.[ownerId]) {
          issues.invalidOwnerRefs.push({ property: prop.pNumber, ownerId });
        }
      });
    });

    return {
      totalIssues: Object.values(issues).reduce((sum, arr) => sum + arr.length, 0),
      details: issues,
      isValid: Object.values(issues).every(arr => arr.length === 0)
    };
  };

  /**
   * Get property by ID
   */
  const getPropertyById = (pNumber: string) => {
    return properties.find(p => p.pNumber === pNumber);
  };

  /**
   * Get owner by ID
   */
  const getOwnerById = (ownerId: string) => {
    return owners.byId?.[ownerId] || null;
  };

  /**
   * Search properties by term (project, cluster, area, building, unit)
   */
  const searchProperties = (searchTerm: string) => {
    if (!searchTerm) return properties;
    const term = searchTerm.toLowerCase();
    return properties.filter(p => 
      (p.pNumber?.toLowerCase().includes(term)) ||
      (p.project?.toLowerCase().includes(term)) ||
      (p.cluster?.toLowerCase().includes(term)) ||
      (p.area?.toLowerCase().includes(term)) ||
      (String(p.building || '').toLowerCase().includes(term)) ||
      (String(p.unitNumber || '').toLowerCase().includes(term))
    );
  };

  return {
    // Data
    properties,
    stats,
    filters,
    owners,
    filterOptions,
    activeFiltersCount,
    loading,

    // Core Handlers
    handleFilterChange,
    handleClearFilters,
    handleFilterToggle,
    getOwnerProperties,
    getPropertyOwners,

    // Enhanced Utilities
    getPropertiesByCluster,
    getClusters,
    getProjects,
    getClusterStats,
    exportToCSV,
    validateData,
    getPropertyById,
    getOwnerById,
    searchProperties
  };
}
