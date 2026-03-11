import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, applyFilters } from '../store/propertySlice';
import {
  SearchContainer,
  SearchBarContainer,
  SearchInputWrapper,
  SearchIcon,
  SearchInput,
  SearchQuickActions,
  SortSelect,
  FilterToggleBtn,
  FilterCount,
  FiltersPanel,
  FiltersTabs,
  FilterTab,
  FiltersContent,
  FilterSection,
  FilterTitle,
  SearchButton,
  ClearButton
} from './AdvancedSearch.styles';

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
    <SearchContainer>
      <SearchBarContainer className="glass-card">
        <SearchInputWrapper>
          <SearchIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by location, property type, or keyword..."
            value={localFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </SearchInputWrapper>
        
        <SearchQuickActions>
          <SortSelect
            value={localFilters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SortSelect>
          
          <FilterToggleBtn 
            active={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            Filters
            {getActiveFiltersCount() > 0 && (
              <FilterCount>{getActiveFiltersCount()}</FilterCount>
            )}
          </FilterToggleBtn>
          
          <SearchButton onClick={handleSearch}>
            Search
          </SearchButton>
        </SearchQuickActions>
      </SearchBarContainer>

      {showFilters && (
        <FiltersPanel className="glass-card animate-fadeInDown">
          <FiltersTabs>
            <FilterTab 
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            >
              All Filters
            </FilterTab>
            <FilterTab 
              active={activeTab === 'price'}
              onClick={() => setActiveTab('price')}
            >
              Price
            </FilterTab>
            <FilterTab 
              active={activeTab === 'rooms'}
              onClick={() => setActiveTab('rooms')}
            >
              Rooms
            </FilterTab>
            <FilterTab 
              active={activeTab === 'type'}
              onClick={() => setActiveTab('type')}
            >
              Property Type
            </FilterTab>
            <FilterTab 
              active={activeTab === 'amenities'}
              onClick={() => setActiveTab('amenities')}
            >
              Amenities
            </FilterTab>
          </FiltersTabs>

          <FiltersContent>
            {(activeTab === 'all' || activeTab === 'price') && (
              <FilterSection>
                <FilterTitle>Price Range (AED)</FilterTitle>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Min</label>
                    <input
                      type="text"
                      value={formatPrice(localFilters.minPrice)}
                      readOnly
                      style={{ width: '100%', padding: '0.625rem 0.75rem', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <span style={{ alignSelf: 'flex-end', marginBottom: '0.625rem' }}>—</span>
                  <div style={{ flex: 1 }}>
                    <label>Max</label>
                    <input
                      type="text"
                      value={formatPrice(localFilters.maxPrice)}
                      readOnly
                      style={{ width: '100%', padding: '0.625rem 0.75rem', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
                <div style={{ position: 'relative', height: '40px', padding: '10px 0' }}>
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
                    style={{ position: 'absolute', width: '100%', height: '6px', appearance: 'none', background: 'transparent', pointerEvents: 'none' }}
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
                    style={{ position: 'absolute', width: '100%', height: '6px', appearance: 'none', background: 'transparent', pointerEvents: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => { updateFilter('minPrice', 0); updateFilter('maxPrice', 5000000); }} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer' }}>Under 5M</button>
                  <button onClick={() => { updateFilter('minPrice', 5000000); updateFilter('maxPrice', 15000000); }} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer' }}>5M - 15M</button>
                  <button onClick={() => { updateFilter('minPrice', 15000000); updateFilter('maxPrice', 30000000); }} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer' }}>15M - 30M</button>
                  <button onClick={() => { updateFilter('minPrice', 30000000); updateFilter('maxPrice', 100000000); }} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer' }}>30M+</button>
                </div>
              </FilterSection>
            )}

            {(activeTab === 'all' || activeTab === 'rooms') && (
              <FilterSection>
                <FilterTitle>Bedrooms & Bathrooms</FilterTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bedrooms</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => updateFilter('beds', Math.max(0, localFilters.beds - 1))}
                        disabled={localFilters.beds === 0}
                        style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', cursor: 'pointer' }}
                      >
                        −
                      </button>
                      <span style={{ flex: 1, textAlign: 'center' }}>{localFilters.beds === 0 ? 'Any' : `${localFilters.beds}+`}</span>
                      <button 
                        onClick={() => updateFilter('beds', localFilters.beds + 1)}
                        style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bathrooms</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => updateFilter('baths', Math.max(0, localFilters.baths - 1))}
                        disabled={localFilters.baths === 0}
                        style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', cursor: 'pointer' }}
                      >
                        −
                      </button>
                      <span style={{ flex: 1, textAlign: 'center' }}>{localFilters.baths === 0 ? 'Any' : `${localFilters.baths}+`}</span>
                      <button 
                        onClick={() => updateFilter('baths', localFilters.baths + 1)}
                        style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => updateFilter('beds', num)}
                      style={{ flex: 1, minWidth: '80px', padding: '0.5rem', border: localFilters.beds === num ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: localFilters.beds === num ? 'rgba(196, 24, 53, 0.1)' : 'var(--bg-primary)', color: localFilters.beds === num ? 'var(--primary-color)' : 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      {num}+ beds
                    </button>
                  ))}
                </div>
              </FilterSection>
            )}

            {(activeTab === 'all' || activeTab === 'type') && (
              <FilterSection>
                <FilterTitle>Property Type</FilterTitle>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleArrayFilter('propertyTypes', type)}
                      style={{ padding: '0.75rem 1rem', border: localFilters.propertyTypes.includes(type) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: localFilters.propertyTypes.includes(type) ? 'rgba(196, 24, 53, 0.1)' : 'var(--bg-primary)', color: localFilters.propertyTypes.includes(type) ? 'var(--primary-color)' : 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      {type === 'Villa' && '🏡 '}
                      {type === 'Apartment' && '🏢 '}
                      {type === 'Penthouse' && '✨ '}
                      {type === 'Townhouse' && '🏘️ '}
                      {type === 'Land' && '🌍 '}
                      {type}
                    </button>
                  ))}
                </div>
              </FilterSection>
            )}

            {(activeTab === 'all' || activeTab === 'location') && (
              <FilterSection>
                <FilterTitle>Location</FilterTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {LOCATIONS.map(loc => (
                    <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={localFilters.locations.includes(loc)}
                        onChange={() => toggleArrayFilter('locations', loc)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{loc}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {(activeTab === 'all' || activeTab === 'amenities') && (
              <FilterSection>
                <FilterTitle>Amenities</FilterTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleArrayFilter('amenities', amenity)}
                      style={{ padding: '0.75rem', border: localFilters.amenities.includes(amenity) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: localFilters.amenities.includes(amenity) ? 'rgba(196, 24, 53, 0.1)' : 'var(--bg-primary)', color: localFilters.amenities.includes(amenity) ? 'var(--primary-color)' : 'var(--text-primary)', cursor: 'pointer', textAlign: 'left' }}
                    >
                      {amenity === 'Pool' && '🏊 '}
                      {amenity === 'Beach Access' && '🏖️ '}
                      {amenity === 'Garden' && '🌳 '}
                      {amenity === 'Gym' && '💪 '}
                      {amenity === 'Cinema' && '🎬 '}
                      {amenity === 'Concierge' && '👔 '}
                      {amenity === 'Security' && '🔒 '}
                      {amenity === 'Parking' && '🚗 '}
                      {amenity}
                    </button>
                  ))}
                </div>
              </FilterSection>
            )}
          </FiltersContent>

          {getActiveFiltersCount() > 0 && (
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
              <span style={{ marginRight: '1rem', fontWeight: 500 }}>Active filters:</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {localFilters.beds > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', background: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
                    {localFilters.beds}+ beds
                    <button onClick={() => updateFilter('beds', 0)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginLeft: '0.25rem' }}>&times;</button>
                  </span>
                )}
                {localFilters.baths > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', background: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
                    {localFilters.baths}+ baths
                    <button onClick={() => updateFilter('baths', 0)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginLeft: '0.25rem' }}>&times;</button>
                  </span>
                )}
                {localFilters.propertyTypes.map(type => (
                  <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', background: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
                    {type}
                    <button onClick={() => toggleArrayFilter('propertyTypes', type)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginLeft: '0.25rem' }}>&times;</button>
                  </span>
                ))}
                {localFilters.locations.map(loc => (
                  <span key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', background: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
                    {loc}
                    <button onClick={() => toggleArrayFilter('locations', loc)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginLeft: '0.25rem' }}>&times;</button>
                  </span>
                ))}
                {localFilters.amenities.map(amenity => (
                  <span key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', background: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
                    {amenity}
                    <button onClick={() => toggleArrayFilter('amenities', amenity)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginLeft: '0.25rem' }}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <ClearButton onClick={handleClear}>
              Clear All
            </ClearButton>
            <SearchButton onClick={handleSearch} style={{ flex: 1 }}>
              Apply Filters
            </SearchButton>
          </div>
        </FiltersPanel>
      )}
    </SearchContainer>
  );
}
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
