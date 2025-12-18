import { useState, useCallback, useMemo, useEffect } from 'react';
import './AdvancedFilters.css';

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment', icon: '🏢' },
  { id: 'villa', label: 'Villa', icon: '🏠' },
  { id: 'penthouse', label: 'Penthouse', icon: '🌆' },
  { id: 'townhouse', label: 'Townhouse', icon: '🏘️' },
  { id: 'duplex', label: 'Duplex', icon: '🏡' },
  { id: 'studio', label: 'Studio', icon: '🛏️' }
];

const AMENITIES = [
  { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { id: 'gym', label: 'Gym', icon: '💪' },
  { id: 'parking', label: 'Parking', icon: '🅿️' },
  { id: 'security', label: '24/7 Security', icon: '🔒' },
  { id: 'balcony', label: 'Balcony', icon: '🌅' },
  { id: 'garden', label: 'Garden', icon: '🌳' },
  { id: 'maid', label: 'Maid Room', icon: '🧹' },
  { id: 'study', label: 'Study Room', icon: '📚' },
  { id: 'beach', label: 'Beach Access', icon: '🏖️' },
  { id: 'golf', label: 'Golf View', icon: '⛳' },
  { id: 'smart', label: 'Smart Home', icon: '🏠' },
  { id: 'furnished', label: 'Furnished', icon: '🛋️' }
];

const DUBAI_AREAS = [
  'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay',
  'JBR', 'DIFC', 'Dubai Hills', 'Arabian Ranches', 'Emirates Hills',
  'Jumeirah', 'Al Barsha', 'Deira', 'Dubai Creek Harbour', 'MBR City'
];

const AdvancedFilters = ({ 
  filters = {}, 
  onFilterChange, 
  onApply, 
  onReset,
  isOpen = true,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState({
    priceRange: filters.priceRange || [0, 50000000],
    propertyTypes: filters.propertyTypes || [],
    bedrooms: filters.bedrooms || null,
    bathrooms: filters.bathrooms || null,
    sizeRange: filters.sizeRange || [0, 20000],
    amenities: filters.amenities || [],
    areas: filters.areas || [],
    listingType: filters.listingType || 'all',
    sortBy: filters.sortBy || 'newest',
    radius: filters.radius || null,
    keywords: filters.keywords || ''
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    type: true,
    rooms: true,
    amenities: false,
    location: false,
    more: false
  });

  useEffect(() => {
    setLocalFilters({
      priceRange: filters.priceRange || [0, 50000000],
      propertyTypes: filters.propertyTypes || [],
      bedrooms: filters.bedrooms || null,
      bathrooms: filters.bathrooms || null,
      sizeRange: filters.sizeRange || [0, 20000],
      amenities: filters.amenities || [],
      areas: filters.areas || [],
      listingType: filters.listingType || 'all',
      sortBy: filters.sortBy || 'newest',
      radius: filters.radius || null,
      keywords: filters.keywords || ''
    });
  }, [filters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = useCallback((key, value) => {
    setLocalFilters(prev => {
      let finalValue = value;
      
      if (key === 'priceRange') {
        const [min, max] = value;
        finalValue = [Math.min(min, max), Math.max(min, max)];
      }
      if (key === 'sizeRange') {
        const [min, max] = value;
        finalValue = [Math.min(min, max), Math.max(min, max)];
      }
      
      const updated = { ...prev, [key]: finalValue };
      if (onFilterChange) onFilterChange(updated);
      return updated;
    });
  }, [onFilterChange]);

  const toggleArrayItem = useCallback((key, item) => {
    setLocalFilters(prev => {
      const arr = prev[key] || [];
      const updated = arr.includes(item) 
        ? arr.filter(i => i !== item)
        : [...arr, item];
      const newFilters = { ...prev, [key]: updated };
      if (onFilterChange) onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  const handleApply = () => {
    if (onApply) onApply(localFilters);
    if (onClose) onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
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
    setLocalFilters(defaultFilters);
    if (onReset) onReset();
    if (onFilterChange) onFilterChange(defaultFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 50000000) count++;
    if (localFilters.propertyTypes.length > 0) count++;
    if (localFilters.bedrooms) count++;
    if (localFilters.bathrooms) count++;
    if (localFilters.sizeRange[0] > 0 || localFilters.sizeRange[1] < 20000) count++;
    if (localFilters.amenities.length > 0) count++;
    if (localFilters.areas.length > 0) count++;
    if (localFilters.listingType !== 'all') count++;
    if (localFilters.keywords) count++;
    return count;
  }, [localFilters]);

  const formatPrice = (value) => {
    if (value >= 1000000) return `AED ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}K`;
    return `AED ${value}`;
  };

  if (!isOpen) return null;

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <h3>
          <span className="filter-icon">⚙️</span>
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
        </h3>
        <div className="filters-actions">
          <button className="reset-btn" onClick={handleReset}>
            Reset All
          </button>
          {onClose && (
            <button className="close-filters-btn" onClick={onClose}>✕</button>
          )}
        </div>
      </div>

      <div className="filters-body">
        <div className="filter-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('price')}
          >
            <span>💰 Price Range</span>
            <span className={`chevron ${expandedSections.price ? 'open' : ''}`}>▼</span>
          </button>
          {expandedSections.price && (
            <div className="section-content">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min Price</label>
                  <input
                    type="number"
                    value={localFilters.priceRange[0]}
                    onChange={(e) => updateFilter('priceRange', [Number(e.target.value), localFilters.priceRange[1]])}
                    placeholder="0"
                  />
                </div>
                <span className="price-separator">to</span>
                <div className="price-input-group">
                  <label>Max Price</label>
                  <input
                    type="number"
                    value={localFilters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [localFilters.priceRange[0], Number(e.target.value)])}
                    placeholder="50,000,000"
                  />
                </div>
              </div>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="100000"
                  value={localFilters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [Number(e.target.value), localFilters.priceRange[1]])}
                  className="price-slider min-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="100000"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [localFilters.priceRange[0], Number(e.target.value)])}
                  className="price-slider max-slider"
                />
                <div className="slider-labels">
                  <span>{formatPrice(localFilters.priceRange[0])}</span>
                  <span>{formatPrice(localFilters.priceRange[1])}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('type')}
          >
            <span>🏠 Property Type</span>
            <span className={`chevron ${expandedSections.type ? 'open' : ''}`}>▼</span>
          </button>
          {expandedSections.type && (
            <div className="section-content">
              <div className="listing-type-toggle">
                {['all', 'buy', 'rent'].map(type => (
                  <button
                    key={type}
                    className={`toggle-btn ${localFilters.listingType === type ? 'active' : ''}`}
                    onClick={() => updateFilter('listingType', type)}
                  >
                    {type === 'all' ? 'All' : type === 'buy' ? 'For Sale' : 'For Rent'}
                  </button>
                ))}
              </div>
              <div className="property-type-grid">
                {PROPERTY_TYPES.map(type => (
                  <button
                    key={type.id}
                    className={`type-btn ${localFilters.propertyTypes.includes(type.id) ? 'active' : ''}`}
                    onClick={() => toggleArrayItem('propertyTypes', type.id)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('rooms')}
          >
            <span>🛏️ Bedrooms & Bathrooms</span>
            <span className={`chevron ${expandedSections.rooms ? 'open' : ''}`}>▼</span>
          </button>
          {expandedSections.rooms && (
            <div className="section-content">
              <div className="room-selector">
                <label>Bedrooms</label>
                <div className="room-buttons">
                  {['Any', '1', '2', '3', '4', '5', '6+'].map(num => (
                    <button
                      key={num}
                      className={`room-btn ${localFilters.bedrooms === (num === 'Any' ? null : num) ? 'active' : ''}`}
                      onClick={() => updateFilter('bedrooms', num === 'Any' ? null : num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="room-selector">
                <label>Bathrooms</label>
                <div className="room-buttons">
                  {['Any', '1', '2', '3', '4', '5+'].map(num => (
                    <button
                      key={num}
                      className={`room-btn ${localFilters.bathrooms === (num === 'Any' ? null : num) ? 'active' : ''}`}
                      onClick={() => updateFilter('bathrooms', num === 'Any' ? null : num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('amenities')}
          >
            <span>✨ Amenities</span>
            {localFilters.amenities.length > 0 && (
              <span className="selected-count">{localFilters.amenities.length} selected</span>
            )}
            <span className={`chevron ${expandedSections.amenities ? 'open' : ''}`}>▼</span>
          </button>
          {expandedSections.amenities && (
            <div className="section-content">
              <div className="amenities-grid">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity.id}
                    className={`amenity-btn ${localFilters.amenities.includes(amenity.id) ? 'active' : ''}`}
                    onClick={() => toggleArrayItem('amenities', amenity.id)}
                  >
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-label">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('location')}
          >
            <span>📍 Location</span>
            {localFilters.areas.length > 0 && (
              <span className="selected-count">{localFilters.areas.length} areas</span>
            )}
            <span className={`chevron ${expandedSections.location ? 'open' : ''}`}>▼</span>
          </button>
          {expandedSections.location && (
            <div className="section-content">
              <div className="areas-grid">
                {DUBAI_AREAS.map(area => (
                  <button
                    key={area}
                    className={`area-btn ${localFilters.areas.includes(area) ? 'active' : ''}`}
                    onClick={() => toggleArrayItem('areas', area)}
                  >
                    {area}
                  </button>
                ))}
              </div>
              <div className="radius-selector">
                <label>Search Radius</label>
                <div className="radius-buttons">
                  {[null, 1, 5, 10, 20].map(km => (
                    <button
                      key={km ?? 'any'}
                      className={`radius-btn ${localFilters.radius === km ? 'active' : ''}`}
                      onClick={() => updateFilter('radius', km)}
                    >
                      {km === null ? 'Any' : `${km} km`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('more')}
          >
            <span>📐 Size & More</span>
            <span className={`chevron ${expandedSections.more ? 'open' : ''}`}>▼</span>
          </button>
          {expandedSections.more && (
            <div className="section-content">
              <div className="size-inputs">
                <div className="size-input-group">
                  <label>Min Size (sq ft)</label>
                  <input
                    type="number"
                    value={localFilters.sizeRange[0]}
                    onChange={(e) => updateFilter('sizeRange', [Number(e.target.value), localFilters.sizeRange[1]])}
                    placeholder="0"
                  />
                </div>
                <span className="size-separator">to</span>
                <div className="size-input-group">
                  <label>Max Size (sq ft)</label>
                  <input
                    type="number"
                    value={localFilters.sizeRange[1]}
                    onChange={(e) => updateFilter('sizeRange', [localFilters.sizeRange[0], Number(e.target.value)])}
                    placeholder="20,000"
                  />
                </div>
              </div>
              <div className="keywords-input">
                <label>Keywords</label>
                <input
                  type="text"
                  value={localFilters.keywords}
                  onChange={(e) => updateFilter('keywords', e.target.value)}
                  placeholder="e.g., sea view, corner unit, renovated..."
                />
              </div>
              <div className="sort-selector">
                <label>Sort By</label>
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="size_large">Size: Largest First</option>
                  <option value="size_small">Size: Smallest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="filters-footer">
        <button className="apply-btn" onClick={handleApply}>
          Apply Filters
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
