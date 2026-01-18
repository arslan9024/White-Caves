import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AreaSummaryCard from './AreaSummaryCard';
import PropertyCard from './PropertyCard';
import PropertyListItem from './PropertyListItem';
import FilterPanel from './FilterPanel';
import cacheUtils from '../../../utils/cacheUtils';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  
  // State
  const [areaSummaries, setAreaSummaries] = useState([]);
  const [expandedAreas, setExpandedAreas] = useState([]);
  const [areaProperties, setAreaProperties] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [areaLoadingState, setAreaLoadingState] = useState({});
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

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
  }, []);

  // Poll expanded areas every 10 seconds (reduced from 5s)
  useEffect(() => {
    if (expandedAreas.length === 0) {
      if (areaPollingRef.current) clearInterval(areaPollingRef.current);
      return;
    }

    areaPollingRef.current = setInterval(() => {
      if (isTabActiveRef.current) {
        expandedAreas.forEach((area) => {
          loadAreaProperties(area, 1);
        });
      }
    }, 10000);

    return () => {
      if (areaPollingRef.current) clearInterval(areaPollingRef.current);
    };
  }, [expandedAreas]);

  const loadAreaSummaries = useCallback(async () => {
    try {
      // Check cache freshness
      const cacheKey = 'areas-summary';
      const cachedResponse = cacheUtils.getCacheResponse(cacheKey);
      
      if (cacheUtils.isCacheFresh(lastFetchTimeRef.current[cacheKey])) {
        return; // Use cached data
      }

      setLoading(true);
      
      // Create abort controller for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/property-inventory/dashboard/areas-summary', {
        signal: abortControllerRef.current.signal,
      });
      const data = await response.json();
      
      if (data.success) {
        // Check if data changed
        if (cacheUtils.hasDataChanged(data.data, cachedResponse)) {
          setAreaSummaries(data.data);
          cacheUtils.setCacheResponse(cacheKey, data.data);
        }
        lastFetchTimeRef.current[cacheKey] = Date.now();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading area summaries:', error);
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
      
      if (cacheUtils.isCacheFresh(lastFetchTimeRef.current[cacheKey])) {
        return; // Use cached data
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/property-inventory/dashboard/stats', {
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
        lastFetchTimeRef.current[cacheKey] = Date.now();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading dashboard stats:', error);
      }
    }
  }, []);

  const loadAreaProperties = useCallback(async (area, page = 1) => {
    try {
      const cacheKey = `area-properties-${area}`;
      const cachedResponse = cacheUtils.getCacheResponse(cacheKey);
      
      // Skip fetch if cache is fresh
      if (cacheUtils.isCacheFresh(lastFetchTimeRef.current[cacheKey])) {
        return;
      }

      setAreaLoadingState((prev) => ({ ...prev, [area]: true }));
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await fetch(
        `/api/property-inventory/dashboard/properties-by-area/${encodeURIComponent(area)}?page=${page}&limit=10`,
        { signal: abortControllerRef.current.signal }
      );
      const data = await response.json();
      
      if (data.success) {
        // Check if data changed
        if (cacheUtils.hasDataChanged(data.data, cachedResponse)) {
          setAreaProperties((prev) => ({
            ...prev,
            [area]: data.data,
          }));
          cacheUtils.setCacheResponse(cacheKey, data.data);
        }
        lastFetchTimeRef.current[cacheKey] = Date.now();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Error loading properties for ${area}:`, error);
      }
    } finally {
      setAreaLoadingState((prev) => ({ ...prev, [area]: false }));
    }
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  }, []);

  const handleApplyFilters = useCallback(async () => {
    // Clear related caches when filters change
    cacheUtils.clearCacheKey('areas-summary');
    cacheUtils.clearCacheKey('dashboard-stats');
    expandedAreas.forEach((area) => {
      cacheUtils.clearCacheKey(`area-properties-${area}`);
    });

    // Reload with new filters
    await loadAreaSummaries();
    await loadDashboardStats();
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
  const toggleAreaExpand = (area) => {
    if (expandedAreas.includes(area)) {
      setExpandedAreas(expandedAreas.filter((a) => a !== area));
    } else {
      setExpandedAreas([...expandedAreas, area]);
      loadAreaProperties(area, 1);
    }
  };

  // Render area properties
  const renderAreaProperties = (area) => {
    const properties = areaProperties[area];
    if (!properties) return null;

    return (
      <div className="area-properties">
        <div className={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
          {properties && properties.length > 0 ? (
            properties.map((property) =>
              viewMode === 'grid' ? (
                <PropertyCard key={property._id} property={property} />
              ) : (
                <PropertyListItem key={property._id} property={property} />
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
        areas={areaSummaries.map((area) => area.name)}
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
        <button
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </button>
        <button
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
      </div>

      {/* Area Summaries */}
      {loading && areaSummaries.length === 0 ? (
        <p>Loading areas...</p>
      ) : (
        <div className="areas-summary">
          {areaSummaries && areaSummaries.length > 0 ? (
            areaSummaries.map((area) => (
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
    </div>
  );
};

export default InventoryDashboard;
