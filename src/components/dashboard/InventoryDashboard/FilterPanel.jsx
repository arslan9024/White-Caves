import React, { useState, useCallback } from 'react';
import StatusFilter from './filters/StatusFilter';
import TypeFilter from './filters/TypeFilter';
import AreaFilter from './filters/AreaFilter';
import PriceRangeFilter from './filters/PriceRangeFilter';
import FurnishingFilter from './filters/FurnishingFilter';
import './FilterPanel.css';

const FilterPanel = ({
  filters = {
    status: [],
    type: [],
    areas: [],
    priceMin: null,
    priceMax: null,
    furnishing: [],
  },
  onFilterChange = () => {},
  onApplyFilters = () => {},
  onResetFilters = () => {},
  areas = [],
  isLoading = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Calculate number of active filters
  const activeFilterCount = [
    filters.status.length,
    filters.type.length,
    filters.areas.length,
    (filters.priceMin !== null || filters.priceMax !== null) ? 1 : 0,
    filters.furnishing.length,
  ].reduce((a, b) => a + b, 0);

  const handleStatusChange = useCallback((selectedStatuses) => {
    onFilterChange('status', selectedStatuses);
  }, [onFilterChange]);

  const handleTypeChange = useCallback((selectedTypes) => {
    onFilterChange('type', selectedTypes);
  }, [onFilterChange]);

  const handleAreaChange = useCallback((selectedAreas) => {
    onFilterChange('areas', selectedAreas);
  }, [onFilterChange]);

  const handlePriceChange = useCallback((priceMin, priceMax) => {
    onFilterChange('priceMin', priceMin);
    onFilterChange('priceMax', priceMax);
  }, [onFilterChange]);

  const handleFurnishingChange = useCallback((selectedFurnishing) => {
    onFilterChange('furnishing', selectedFurnishing);
  }, [onFilterChange]);

  return (
    <div className="filter-panel-wrapper">
      {/* Mobile Toggle */}
      <div className="filter-panel-toggle-mobile">
        <button
          className="toggle-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="toggle-icon">☰</span>
          <span className="toggle-text">Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`filter-panel ${showFilters ? 'open' : 'closed'}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount} Active</span>
          )}
        </div>

        <div className="filter-content">
          {/* Status Filter */}
          <StatusFilter
            selected={filters.status}
            onChange={handleStatusChange}
          />

          {/* Type Filter */}
          <TypeFilter
            selected={filters.type}
            onChange={handleTypeChange}
          />

          {/* Area Filter */}
          <AreaFilter
            selected={filters.areas}
            availableAreas={areas}
            onChange={handleAreaChange}
          />

          {/* Price Range Filter */}
          <PriceRangeFilter
            minPrice={filters.priceMin}
            maxPrice={filters.priceMax}
            onChange={handlePriceChange}
          />

          {/* Furnishing Filter */}
          <FurnishingFilter
            selected={filters.furnishing}
            onChange={handleFurnishingChange}
          />
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              onApplyFilters();
              setShowFilters(false); // Close on mobile after apply
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Applying...' : 'Apply Filters'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              onResetFilters();
              setShowFilters(false); // Close on mobile after reset
            }}
            disabled={isLoading || activeFilterCount === 0}
          >
            Clear All
          </button>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="filter-tags">
              {filters.status.map((status) => (
                <span key={`status-${status}`} className="filter-tag">
                  Status: {status}
                  <button
                    className="remove-tag"
                    onClick={() =>
                      handleStatusChange(filters.status.filter((s) => s !== status))
                    }
                  >
                    ×
                  </button>
                </span>
              ))}

              {filters.type.map((type) => (
                <span key={`type-${type}`} className="filter-tag">
                  Type: {type}
                  <button
                    className="remove-tag"
                    onClick={() =>
                      handleTypeChange(filters.type.filter((t) => t !== type))
                    }
                  >
                    ×
                  </button>
                </span>
              ))}

              {filters.areas.map((area) => (
                <span key={`area-${area}`} className="filter-tag">
                  Area: {area}
                  <button
                    className="remove-tag"
                    onClick={() =>
                      handleAreaChange(filters.areas.filter((a) => a !== area))
                    }
                  >
                    ×
                  </button>
                </span>
              ))}

              {(filters.priceMin !== null || filters.priceMax !== null) && (
                <span className="filter-tag">
                  Price: {filters.priceMin || '0'} - {filters.priceMax || '∞'}
                  <button
                    className="remove-tag"
                    onClick={() => handlePriceChange(null, null)}
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.furnishing.map((furnishing) => (
                <span key={`furnishing-${furnishing}`} className="filter-tag">
                  Furnishing: {furnishing}
                  <button
                    className="remove-tag"
                    onClick={() =>
                      handleFurnishingChange(
                        filters.furnishing.filter((f) => f !== furnishing)
                      )
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
