import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, applyFilters } from '../store/propertySlice';
import './AdvancedSearch.css';

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Penthouse', 'Townhouse', 'Land'];
const LOCATIONS = [
  'Palm Jumeirah',
  'Downtown Dubai',
  'Emirates Hills',
  'Dubai Marina',
  'Arabian Ranches',
  'Jumeirah Village Circle',
  'Business Bay',
  'Jumeirah Beach Residence',
  'Dubai Hills Estate',
  'City Walk',
  'Mohammed Bin Rashid City',
  'The Springs'
];
const AMENITIES = ['Pool', 'Beach Access', 'Garden', 'Gym', 'Cinema', 'Concierge', 'Security', 'Parking'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'sqft_desc', label: 'Largest First' }
];

export default function AdvancedSearch({ isExpanded = false }) {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.properties.filters);
  
  const [localFilters, setLocalFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 100000000,
    beds: 0,
    baths: 0,
    propertyTypes: [],
    locations: [],
    amenities: [],
    minSqft: 0,
    maxSqft: 20000,
    sortBy: 'featured'
  });
  
  const [showFilters, setShowFilters] = useState(isExpanded);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (filters) {
      setLocalFilters(prev => ({ ...prev, ...filters }));
    }
  }, [filters]);

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key, value) => {
    setLocalFilters(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleSearch = () => {
    dispatch(setFilters(localFilters));
    dispatch(applyFilters());
  };

  const handleClear = () => {
    const cleared = {
      search: '',
      minPrice: 0,
      maxPrice: 100000000,
      beds: 0,
      baths: 0,
      propertyTypes: [],
      locations: [],
      amenities: [],
      minSqft: 0,
      maxSqft: 20000,
      sortBy: 'featured'
    };
    setLocalFilters(cleared);
    dispatch(clearFilters());
    dispatch(applyFilters());
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    return `${(price / 1000).toFixed(0)}K`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.minPrice > 0) count++;
    if (localFilters.maxPrice < 100000000) count++;
    if (localFilters.beds > 0) count++;
    if (localFilters.baths > 0) count++;
    if (localFilters.propertyTypes.length > 0) count += localFilters.propertyTypes.length;
    if (localFilters.locations.length > 0) count += localFilters.locations.length;
    if (localFilters.amenities.length > 0) count += localFilters.amenities.length;
    return count;
  };

  return (
    <div className="advanced-search">
      <div className="search-bar-container glass-card">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by location, property type, or keyword..."
            value={localFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="search-quick-actions">
          <select 
            className="sort-select"
            value={localFilters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
          <button 
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="filter-count">{getActiveFiltersCount()}</span>
            )}
          </button>
          
          <button className="btn btn-primary search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel glass-card animate-fadeInDown">
          <div className="filters-tabs">
            <button 
              className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Filters
            </button>
            <button 
              className={`filter-tab ${activeTab === 'price' ? 'active' : ''}`}
              onClick={() => setActiveTab('price')}
            >
              Price
            </button>
            <button 
              className={`filter-tab ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              Rooms
            </button>
            <button 
              className={`filter-tab ${activeTab === 'type' ? 'active' : ''}`}
              onClick={() => setActiveTab('type')}
            >
              Property Type
            </button>
            <button 
              className={`filter-tab ${activeTab === 'amenities' ? 'active' : ''}`}
              onClick={() => setActiveTab('amenities')}
            >
              Amenities
            </button>
          </div>

          <div className="filters-content">
            {(activeTab === 'all' || activeTab === 'price') && (
              <div className="filter-section">
                <h4 className="filter-title">Price Range (AED)</h4>
                <div className="price-range-inputs">
                  <div className="price-input-group">
                    <label>Min</label>
                    <input
                      type="text"
                      value={formatPrice(localFilters.minPrice)}
                      readOnly
                      className="price-display"
                    />
                  </div>
                  <span className="price-separator">—</span>
                  <div className="price-input-group">
                    <label>Max</label>
                    <input
                      type="text"
                      value={formatPrice(localFilters.maxPrice)}
                      readOnly
                      className="price-display"
                    />
                  </div>
                </div>
                <div className="dual-range-slider">
                  <input
                    type="range"
                    min="0"
                    max="100000000"
                    step="500000"
                    value={localFilters.minPrice}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < localFilters.maxPrice) updateFilter('minPrice', val);
                    }}
                    className="range-slider range-min"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000000"
                    step="500000"
                    value={localFilters.maxPrice}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > localFilters.minPrice) updateFilter('maxPrice', val);
                    }}
                    className="range-slider range-max"
                  />
                  <div 
                    className="range-track-fill"
                    style={{
                      left: `${(localFilters.minPrice / 100000000) * 100}%`,
                      width: `${((localFilters.maxPrice - localFilters.minPrice) / 100000000) * 100}%`
                    }}
                  />
                </div>
                <div className="price-presets">
                  <button onClick={() => { updateFilter('minPrice', 0); updateFilter('maxPrice', 5000000); }}>Under 5M</button>
                  <button onClick={() => { updateFilter('minPrice', 5000000); updateFilter('maxPrice', 15000000); }}>5M - 15M</button>
                  <button onClick={() => { updateFilter('minPrice', 15000000); updateFilter('maxPrice', 30000000); }}>15M - 30M</button>
                  <button onClick={() => { updateFilter('minPrice', 30000000); updateFilter('maxPrice', 100000000); }}>30M+</button>
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'rooms') && (
              <div className="filter-section">
                <h4 className="filter-title">Bedrooms & Bathrooms</h4>
                <div className="counter-filters">
                  <div className="counter-group">
                    <label>Bedrooms</label>
                    <div className="counter-controls">
                      <button 
                        className="counter-btn"
                        onClick={() => updateFilter('beds', Math.max(0, localFilters.beds - 1))}
                        disabled={localFilters.beds === 0}
                      >
                        −
                      </button>
                      <span className="counter-value">{localFilters.beds === 0 ? 'Any' : `${localFilters.beds}+`}</span>
                      <button 
                        className="counter-btn"
                        onClick={() => updateFilter('beds', localFilters.beds + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="counter-group">
                    <label>Bathrooms</label>
                    <div className="counter-controls">
                      <button 
                        className="counter-btn"
                        onClick={() => updateFilter('baths', Math.max(0, localFilters.baths - 1))}
                        disabled={localFilters.baths === 0}
                      >
                        −
                      </button>
                      <span className="counter-value">{localFilters.baths === 0 ? 'Any' : `${localFilters.baths}+`}</span>
                      <button 
                        className="counter-btn"
                        onClick={() => updateFilter('baths', localFilters.baths + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="beds-quick-select">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      className={`quick-select-btn ${localFilters.beds === num ? 'active' : ''}`}
                      onClick={() => updateFilter('beds', num)}
                    >
                      {num}+ beds
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'type') && (
              <div className="filter-section">
                <h4 className="filter-title">Property Type</h4>
                <div className="property-type-pills">
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type}
                      className={`type-pill ${localFilters.propertyTypes.includes(type) ? 'active' : ''}`}
                      onClick={() => toggleArrayFilter('propertyTypes', type)}
                    >
                      {type === 'Villa' && '🏡'}
                      {type === 'Apartment' && '🏢'}
                      {type === 'Penthouse' && '✨'}
                      {type === 'Townhouse' && '🏘️'}
                      {type === 'Land' && '🌍'}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'location') && (
              <div className="filter-section">
                <h4 className="filter-title">Location</h4>
                <div className="location-grid">
                  {LOCATIONS.map(loc => (
                    <label key={loc} className="location-checkbox">
                      <input
                        type="checkbox"
                        checked={localFilters.locations.includes(loc)}
                        onChange={() => toggleArrayFilter('locations', loc)}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="location-name">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'amenities') && (
              <div className="filter-section">
                <h4 className="filter-title">Amenities</h4>
                <div className="amenities-grid">
                  {AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      className={`amenity-chip ${localFilters.amenities.includes(amenity) ? 'active' : ''}`}
                      onClick={() => toggleArrayFilter('amenities', amenity)}
                    >
                      {amenity === 'Pool' && '🏊‍♂️'}
                      {amenity === 'Beach Access' && '🏖️'}
                      {amenity === 'Garden' && '🌳'}
                      {amenity === 'Gym' && '💪'}
                      {amenity === 'Cinema' && '🎬'}
                      {amenity === 'Concierge' && '👔'}
                      {amenity === 'Security' && '🔒'}
                      {amenity === 'Parking' && '🚗'}
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {getActiveFiltersCount() > 0 && (
            <div className="active-filters-bar">
              <span className="active-filters-label">Active filters:</span>
              <div className="filter-chips">
                {localFilters.beds > 0 && (
                  <span className="filter-chip">
                    {localFilters.beds}+ beds
                    <button onClick={() => updateFilter('beds', 0)}>&times;</button>
                  </span>
                )}
                {localFilters.baths > 0 && (
                  <span className="filter-chip">
                    {localFilters.baths}+ baths
                    <button onClick={() => updateFilter('baths', 0)}>&times;</button>
                  </span>
                )}
                {localFilters.propertyTypes.map(type => (
                  <span key={type} className="filter-chip">
                    {type}
                    <button onClick={() => toggleArrayFilter('propertyTypes', type)}>&times;</button>
                  </span>
                ))}
                {localFilters.locations.map(loc => (
                  <span key={loc} className="filter-chip">
                    {loc}
                    <button onClick={() => toggleArrayFilter('locations', loc)}>&times;</button>
                  </span>
                ))}
                {localFilters.amenities.map(amenity => (
                  <span key={amenity} className="filter-chip">
                    {amenity}
                    <button onClick={() => toggleArrayFilter('amenities', amenity)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="filters-actions">
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear All
            </button>
            <button className="btn btn-primary" onClick={handleSearch}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
