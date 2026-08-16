import React, { useState, useEffect, useCallback, useRef } from 'react';
import AreaSummaryCard from './AreaSummaryCard';
import PropertyCard from './PropertyCard';
import PropertyListItem from './PropertyListItem';
import FilterPanel from './FilterPanel';
import BulkActionToolbar from '../../BulkOperations/BulkActionToolbar';
import BulkStatusModal from '../../BulkOperations/BulkStatusModal';
import BulkPriceModal from '../../BulkOperations/BulkPriceModal';
import BulkFurnishingModal from '../../BulkOperations/BulkFurnishingModal';
import BulkTagModal from '../../BulkOperations/BulkTagModal';
import BulkNotificationModal from '../../BulkOperations/BulkNotificationModal';
import BulkDeleteModal from '../../BulkOperations/BulkDeleteModal';
import cacheUtils from '../../../utils/cacheUtils';
import { authFetch } from '../../../utils/authFetch';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
  // State
  const [areaSummaries, setAreaSummaries] = useState([]);
  const [expandedAreas, setExpandedAreas] = useState([]);
  const [areaProperties, setAreaProperties] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [areaLoadingState, setAreaLoadingState] = useState({});
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // Bulk Operations State
  const [selectedProperties, setSelectedProperties] = useState(new Set());
  const [bulkActionType, setBulkActionType] = useState(null);
  const [, setBulkActionData] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState(null);
  const [bulkSuccess, setBulkSuccess] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    areas: [],
    priceMin: null,
    priceMax: null,
    furnishing: [],
  });

  // Refs for polling control and abort
  const abortControllerRef = useRef(null);
  const statsPollingRef = useRef(null);
  const areaPollingRef = useRef(null);
  const lastFetchTimeRef = useRef({});
  const isTabActiveRef = useRef(true);

  // Track tab visibility for smart polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
      if (isTabActiveRef.current) {
        // Resume normal polling when tab becomes active
        loadAreaSummaries();
        loadDashboardStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch area summaries on mount
  useEffect(() => {
    loadAreaSummaries();
    loadDashboardStats();

    // Smart polling: 30 seconds for dashboard stats
    statsPollingRef.current = setInterval(() => {
      if (isTabActiveRef.current) {
        loadDashboardStats();
      }
    }, 30000);

    return () => {
      if (statsPollingRef.current) clearInterval(statsPollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll expanded areas every 10 seconds (reduced from 5s)
  useEffect(() => {
    if (expandedAreas.length === 0) {
      if (areaPollingRef.current) clearInterval(areaPollingRef.current);
      return;
    }

    areaPollingRef.current = setInterval(() => {
      if (isTabActiveRef.current) {
        expandedAreas.forEach(area => {
          loadAreaProperties(area, 1);
        });
      }
    }, 10000);

    return () => {
      if (areaPollingRef.current) clearInterval(areaPollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedAreas]);

  const loadAreaSummaries = useCallback(async () => {
    try {
      // Check cache freshness
      const cacheKey = 'areas-summary';
      const cachedResponse = cacheUtils.getCacheResponse(cacheKey);

      // eslint-disable-next-line security/detect-object-injection
      if (cacheUtils.isCacheFresh(lastFetchTimeRef.current[cacheKey])) {
        return; // Use cached data
      }

      setLoading(true);

      // Create abort controller for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await authFetch('/api/property-inventory/dashboard/areas-summary', {
        signal: abortControllerRef.current.signal,
      });
      const data = await response.json();

      if (data.success) {
        // Check if data changed
        if (cacheUtils.hasDataChanged(data.data, cachedResponse)) {
          setAreaSummaries(data.data);
          cacheUtils.setCacheResponse(cacheKey, data.data);
        }
        // eslint-disable-next-line security/detect-object-injection
        lastFetchTimeRef.current[cacheKey] = Date.now();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDashboardStats = useCallback(async () => {
    try {
      // Check cache freshness
      const cacheKey = 'dashboard-stats';
      const cachedResponse = cacheUtils.getCacheResponse(cacheKey);

      // eslint-disable-next-line security/detect-object-injection
      if (cacheUtils.isCacheFresh(lastFetchTimeRef.current[cacheKey])) {
        return; // Use cached data
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await authFetch('/api/property-inventory/dashboard/stats', {
        signal: abortControllerRef.current.signal,
      });
      const data = await response.json();

      if (data.success) {
        // Check if data changed
        if (cacheUtils.hasDataChanged(data.data, cachedResponse)) {
          setDashboardStats(data.data);
          cacheUtils.setCacheResponse(cacheKey, data.data);
          setLastRefreshTime(new Date());
        }
        // eslint-disable-next-line security/detect-object-injection
        lastFetchTimeRef.current[cacheKey] = Date.now();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        
      }
    }
  }, []);

  const loadAreaProperties = useCallback(async (area, page = 1) => {
    try {
      const cacheKey = `area-properties-${area}`;
      const cachedResponse = cacheUtils.getCacheResponse(cacheKey);

      // Skip fetch if cache is fresh
      // eslint-disable-next-line security/detect-object-injection
      if (cacheUtils.isCacheFresh(lastFetchTimeRef.current[cacheKey])) {
        return;
      }

      setAreaLoadingState(prev => ({ ...prev, [area]: true }));

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await authFetch(
        `/api/property-inventory/dashboard/properties-by-area/${encodeURIComponent(area)}?page=${page}&limit=10`,
        { signal: abortControllerRef.current.signal }
      );
      const data = await response.json();

      if (data.success) {
        // Check if data changed
        if (cacheUtils.hasDataChanged(data.data, cachedResponse)) {
          setAreaProperties(prev => ({
            ...prev,
            [area]: data.data,
          }));
          cacheUtils.setCacheResponse(cacheKey, data.data);
        }
        // eslint-disable-next-line security/detect-object-injection
        lastFetchTimeRef.current[cacheKey] = Date.now();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        
      }
    } finally {
      setAreaLoadingState(prev => ({ ...prev, [area]: false }));
    }
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  }, []);

  const handleApplyFilters = useCallback(async () => {
    // Clear related caches when filters change
    cacheUtils.clearCacheKey('areas-summary');
    cacheUtils.clearCacheKey('dashboard-stats');
    expandedAreas.forEach(area => {
      cacheUtils.clearCacheKey(`area-properties-${area}`);
    });

    // Reload with new filters
    await loadAreaSummaries();
    await loadDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedAreas]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      status: [],
      type: [],
      areas: [],
      priceMin: null,
      priceMax: null,
      furnishing: [],
    });
  }, []);

  // Handle area expansion
  const toggleAreaExpand = area => {
    if (expandedAreas.includes(area)) {
      setExpandedAreas(expandedAreas.filter(a => a !== area));
    } else {
      setExpandedAreas([...expandedAreas, area]);
      loadAreaProperties(area, 1);
    }
  };

  // Bulk Operations Handlers
  const handlePropertySelect = (propertyId, checked) => {
    const newSet = new Set(selectedProperties);
    if (checked) {
      newSet.add(propertyId);
    } else {
      newSet.delete(propertyId);
    }
    setSelectedProperties(newSet);
  };

  const handleClearSelection = () => {
    setSelectedProperties(new Set());
    setBulkActionType(null);
    setBulkActionData(null);
  };

  const handleBulkActionOpen = type => {
    setBulkActionType(type);
  };

  const handleBulkActionConfirm = async data => {
    if (selectedProperties.size === 0) return;

    setIsBulkLoading(true);
    setBulkError(null);
    setBulkSuccess(null);

    try {
      const propertyIds = Array.from(selectedProperties);
      let endpoint = '';
      let payload = {};

      switch (bulkActionType) {
        case 'status':
          endpoint = '/api/bulk/status-update';
          payload = { propertyIds, newStatus: data };
          break;
        case 'price':
          endpoint = '/api/bulk/price-update';
          payload = { propertyIds, priceUpdate: data };
          break;
        case 'furnishing':
          endpoint = '/api/bulk/furnishing-update';
          payload = { propertyIds, furnishing: data };
          break;
        case 'tags':
          endpoint = '/api/bulk/tags-update';
          payload = { propertyIds, tags: data };
          break;
        case 'notification':
          endpoint = '/api/bulk/notify';
          payload = { propertyIds, message: data.message, type: data.type };
          break;
        case 'delete':
          endpoint = '/api/bulk/delete';
          payload = { propertyIds };
          break;
        default:
          return;
      }

      const response = await authFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setBulkSuccess(
          `${bulkActionType} updated successfully for ${propertyIds.length} properties`
        );
        handleClearSelection();
        // Reload data
        loadAreaSummaries();
        loadDashboardStats();
        expandedAreas.forEach(area => loadAreaProperties(area, 1));
        // Clear message after 3 seconds
        setTimeout(() => setBulkSuccess(null), 3000);
      } else {
        setBulkError(result.message || `Failed to perform bulk ${bulkActionType}`);
      }
    } catch (error) {
      
      setBulkError(`Error performing bulk ${bulkActionType}: ${error.message}`);
    } finally {
      setIsBulkLoading(false);
      setBulkActionType(null);
      setBulkActionData(null);
    }
  };

  // Render area properties
  const renderAreaProperties = area => {
    // eslint-disable-next-line security/detect-object-injection
    const properties = areaProperties[area];
    if (!properties) return null;

    return (
      <div className="area-properties">
        <div className={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
          {properties && properties.length > 0 ? (
            properties.map(property =>
              viewMode === 'grid' ? (
                <PropertyCard key={property._id} property={property} />
              ) : (
                <PropertyListItem
                  key={property._id}
                  property={property}
                  inventory={property.inventory}
                  isSelected={selectedProperties.has(property._id)}
                  onSelect={handlePropertySelect}
                  onViewDetails={() => undefined}
                  onCreateOffer={() => undefined}
                  onAssignAgent={() => undefined}
                />
              )
            )
          ) : (
            <p>No properties found in this area.</p>
          )}
        </div>
      </div>
    );
  };

  // Render
  return (
    <div className="inventory-dashboard">
      <div className="dashboard-header">
        <h1>Inventory Dashboard</h1>
        {lastRefreshTime && (
          <p className="last-refresh">Last updated: {lastRefreshTime.toLocaleTimeString()}</p>
        )}
      </div>

      {/* Advanced Filters */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        areas={areaSummaries.map(area => area.name)}
        isLoading={loading}
      />

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Properties</h3>
            <p className="stat-value">{dashboardStats.totalProperties || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Areas</h3>
            <p className="stat-value">{dashboardStats.totalAreas || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Vacant Properties</h3>
            <p className="stat-value">{dashboardStats.vacantProperties || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Occupied Properties</h3>
            <p className="stat-value">{dashboardStats.occupiedProperties || 0}</p>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
          Grid View
        </button>
        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
          List View
        </button>
      </div>

      {/* Area Summaries */}
      {loading && areaSummaries.length === 0 ? (
        <p>Loading areas...</p>
      ) : (
        <div className="areas-summary">
          {areaSummaries && areaSummaries.length > 0 ? (
            areaSummaries.map(area => (
              <div key={area._id} className="area-section">
                <AreaSummaryCard
                  area={area}
                  expanded={expandedAreas.includes(area.name)}
                  onToggleExpand={() => toggleAreaExpand(area.name)}
                  isLoading={areaLoadingState[area.name] || false}
                />
                {expandedAreas.includes(area.name) && renderAreaProperties(area.name)}
              </div>
            ))
          ) : (
            <p>No areas found.</p>
          )}
        </div>
      )}

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedProperties.size}
        onStatusUpdate={() => handleBulkActionOpen('status')}
        onPriceUpdate={() => handleBulkActionOpen('price')}
        onFurnishingUpdate={() => handleBulkActionOpen('furnishing')}
        onTagsUpdate={() => handleBulkActionOpen('tags')}
        onNotification={() => handleBulkActionOpen('notification')}
        onDelete={() => handleBulkActionOpen('delete')}
        onClear={handleClearSelection}
        isLoading={isBulkLoading}
      />

      {/* Bulk Status Modal */}
      <BulkStatusModal
        isOpen={bulkActionType === 'status'}
        propertyCount={selectedProperties.size}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setBulkActionType(null)}
      />

      {/* Bulk Price Modal */}
      <BulkPriceModal
        isOpen={bulkActionType === 'price'}
        propertyCount={selectedProperties.size}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setBulkActionType(null)}
      />

      {/* Bulk Furnishing Modal */}
      <BulkFurnishingModal
        isOpen={bulkActionType === 'furnishing'}
        propertyCount={selectedProperties.size}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setBulkActionType(null)}
      />

      {/* Bulk Tag Modal */}
      <BulkTagModal
        isOpen={bulkActionType === 'tags'}
        propertyCount={selectedProperties.size}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setBulkActionType(null)}
      />

      {/* Bulk Notification Modal */}
      <BulkNotificationModal
        isOpen={bulkActionType === 'notification'}
        propertyCount={selectedProperties.size}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setBulkActionType(null)}
      />

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={bulkActionType === 'delete'}
        propertyCount={selectedProperties.size}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setBulkActionType(null)}
      />

      {/* Bulk Success/Error Messages */}
      {bulkSuccess && <div className="bulk-notification bulk-success">✓ {bulkSuccess}</div>}
      {bulkError && <div className="bulk-notification bulk-error">✕ {bulkError}</div>}
    </div>
  );
};

export default InventoryDashboard;
