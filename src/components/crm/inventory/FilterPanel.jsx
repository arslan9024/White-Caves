import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import './FilterPanel.css';

const FilterPanel = ({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onClearFilters,
  activeFiltersCount = 0 
}) => {
  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <div className="filter-title">
          <Filter size={18} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="active-count">{activeFiltersCount}</span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button className="clear-filters-btn" onClick={onClearFilters}>
            <RotateCcw size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="filter-grid">
        <FilterDropdown
          label="Layout"
          value={filters.layout}
          options={filterOptions.layouts || []}
          onChange={(val) => handleChange('layout', val)}
          placeholder="All Layouts"
        />

        <FilterDropdown
          label="Status"
          value={filters.status}
          options={filterOptions.statuses || []}
          onChange={(val) => handleChange('status', val)}
          placeholder="All Statuses"
        />

        <FilterDropdown
          label="View"
          value={filters.view}
          options={filterOptions.views || []}
          onChange={(val) => handleChange('view', val)}
          placeholder="All Views"
        />

        <FilterDropdown
          label="Cluster"
          value={filters.cluster}
          options={filterOptions.clusters || []}
          onChange={(val) => handleChange('cluster', val)}
          placeholder="All Clusters"
        />

        <FilterDropdown
          label="Floor"
          value={filters.floor}
          options={filterOptions.floors || []}
          onChange={(val) => handleChange('floor', val)}
          placeholder="All Floors"
        />

        <FilterDropdown
          label="Rooms"
          value={filters.rooms}
          options={filterOptions.rooms || []}
          onChange={(val) => handleChange('rooms', val)}
          placeholder="All Rooms"
        />

        <FilterDropdown
          label="Area"
          value={filters.area}
          options={filterOptions.areas || []}
          onChange={(val) => handleChange('area', val)}
          placeholder="All Areas"
        />

        <FilterDropdown
          label="Master Project"
          value={filters.masterProject}
          options={filterOptions.masterProjects || []}
          onChange={(val) => handleChange('masterProject', val)}
          placeholder="All Projects"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
