/**
 * PropertyFilterPanel — Advanced filter bar for PropertiesPage.
 * Location, type, beds, baths, price range, sort, plus collapsible advanced panel.
 * Reads/writes URL query params for deep-linkable filter state.
 */
import React, { useState, useCallback, useEffect, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Home,
  BedDouble,
  DollarSign,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { setFilters, clearFilters, applyFilters } from '../../store/propertySlice';
import type { RootState, AppDispatch } from '../../store/store';
import {
  DUBAI_LOCATIONS,
  PROPERTY_TYPES,
  BED_OPTIONS,
  PRICE_RANGES,
} from '../../components/homepage/Hero/HeroSearchBar';
import './PropertyFilterPanel.css';

/* ─── Sort Options ──────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Size: Largest', value: 'sqft_desc' },
  { label: 'Newest First', value: 'newest' },
] as const;

/* ─── Bath Options ──────────────────────────────────────────────────── */
const BATH_OPTIONS = [
  { label: 'Any Baths', value: 0 },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
  { label: '5+', value: 5 },
] as const;

/* ─── Purpose Options ───────────────────────────────────────────────── */
const PURPOSE_OPTIONS = ['All', 'Buy', 'Rent'] as const;

interface PropertyFilterPanelProps {
  resultCount: number;
  totalCount: number;
}

const PropertyFilterPanel: React.FC<PropertyFilterPanelProps> = memo(function PropertyFilterPanel({
  resultCount,
  totalCount,
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useSelector((state: RootState) => state.properties.filters);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [purpose, setPurpose] = useState<'All' | 'Buy' | 'Rent'>('All');

  // ─── Sync URL params → Redux on mount ──────────────────────
  useEffect(() => {
    const urlFilters: Record<string, unknown> = {};
    const loc = searchParams.get('location');
    const type = searchParams.get('type');
    const beds = searchParams.get('beds');
    const minP = searchParams.get('minPrice');
    const maxP = searchParams.get('maxPrice');
    const baths = searchParams.get('baths');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    // Phase 34: ?mode=rent|buy from hero leasing CTA
    const mode = searchParams.get('mode')?.toLowerCase();
    if (mode === 'rent') setPurpose('Rent');
    else if (mode === 'buy') setPurpose('Buy');

    if (loc) urlFilters.locations = [loc];
    if (type) urlFilters.propertyTypes = [type];
    if (beds) urlFilters.beds = parseInt(beds, 10);
    if (baths) urlFilters.baths = parseInt(baths, 10);
    if (minP) urlFilters.minPrice = parseInt(minP, 10);
    if (maxP) urlFilters.maxPrice = parseInt(maxP, 10);
    if (sort) urlFilters.sortBy = sort;
    if (q) {
      urlFilters.search = q;
      setSearchText(q);
    }

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
      dispatch(applyFilters());
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Helpers ────────────────────────────────────────────────
  const activeFilterCount = (() => {
    let count = 0;
    if (filters.locations.length > 0) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.beds > 0) count++;
    if (filters.baths > 0) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 100_000_000) count++;
    if (filters.minSqft > 0 || filters.maxSqft < 20_000) count++;
    if (filters.search) count++;
    if (purpose !== 'All') count++;
    return count;
  })();

  const updateFilter = useCallback(
    (key: string, value: unknown) => {
      dispatch(setFilters({ [key]: value }));
      dispatch(applyFilters());
    },
    [dispatch]
  );

  const syncUrl = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // ─── Event handlers ────────────────────────────────────────
  const handleLocationChange = useCallback(
    (val: string) => {
      const locs = val === 'All Locations' ? [] : [val];
      updateFilter('locations', locs);
      syncUrl({
        ...Object.fromEntries(searchParams),
        location: val === 'All Locations' ? '' : val,
      });
    },
    [updateFilter, syncUrl, searchParams]
  );

  const handleTypeChange = useCallback(
    (val: string) => {
      const types = val === 'All Types' ? [] : [val];
      updateFilter('propertyTypes', types);
      syncUrl({
        ...Object.fromEntries(searchParams),
        type: val === 'All Types' ? '' : val,
      });
    },
    [updateFilter, syncUrl, searchParams]
  );

  const handleBedsChange = useCallback(
    (val: string) => {
      const beds = Math.ceil(parseFloat(val));
      updateFilter('beds', beds);
      syncUrl({
        ...Object.fromEntries(searchParams),
        beds: beds > 0 ? String(beds) : '',
      });
    },
    [updateFilter, syncUrl, searchParams]
  );

  const handleBathsChange = useCallback(
    (val: string) => {
      const baths = parseInt(val, 10);
      updateFilter('baths', baths);
      syncUrl({
        ...Object.fromEntries(searchParams),
        baths: baths > 0 ? String(baths) : '',
      });
    },
    [updateFilter, syncUrl, searchParams]
  );

  const handlePriceChange = useCallback(
    (val: string) => {
      const idx = parseInt(val, 10);
      // eslint-disable-next-line security/detect-object-injection
      const range = PRICE_RANGES[idx] ?? PRICE_RANGES[0];
      dispatch(setFilters({ minPrice: range.min, maxPrice: range.max }));
      dispatch(applyFilters());
      syncUrl({
        ...Object.fromEntries(searchParams),
        minPrice: range.min > 0 ? String(range.min) : '',
        maxPrice: range.max < 100_000_000 ? String(range.max) : '',
      });
    },
    [dispatch, syncUrl, searchParams]
  );

  const handleSortChange = useCallback(
    (val: string) => {
      updateFilter('sortBy', val);
      syncUrl({
        ...Object.fromEntries(searchParams),
        sort: val === 'featured' ? '' : val,
      });
    },
    [updateFilter, syncUrl, searchParams]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateFilter('search', searchText);
      syncUrl({
        ...Object.fromEntries(searchParams),
        q: searchText || '',
      });
    },
    [updateFilter, searchText, syncUrl, searchParams]
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        updateFilter('search', searchText);
        syncUrl({
          ...Object.fromEntries(searchParams),
          q: searchText || '',
        });
      }
    },
    [updateFilter, searchText, syncUrl, searchParams]
  );

  const handleClearSearch = useCallback(() => {
    setSearchText('');
    updateFilter('search', '');
    syncUrl({
      ...Object.fromEntries(searchParams),
      q: '',
    });
  }, [updateFilter, syncUrl, searchParams]);

  const handleResetAll = useCallback(() => {
    dispatch(clearFilters());
    setSearchText('');
    setPurpose('All');
    setSearchParams({}, { replace: true });
  }, [dispatch, setSearchParams]);

  // Phase 34: Purpose tab click → update URL ?mode param so ?mode=rent is preserved
  const handlePurposeChange = useCallback(
    (opt: 'All' | 'Buy' | 'Rent') => {
      setPurpose(opt);
      syncUrl({
        ...Object.fromEntries(searchParams),
        mode: opt === 'All' ? '' : opt.toLowerCase(),
      });
    },
    [syncUrl, searchParams]
  );

  // ─── Derive current select values from Redux ──────────────
  const currentLocation = filters.locations[0] || 'All Locations';
  const currentType = filters.propertyTypes[0] || 'All Types';
  const currentBeds = String(filters.beds || 0);
  const currentBaths = String(filters.baths || 0);
  const currentSortBy = filters.sortBy || 'featured';

  // Find the matching price range index
  const currentPriceIdx = PRICE_RANGES.findIndex(
    r => r.min === filters.minPrice && r.max === filters.maxPrice
  );

  return (
    <div className="property-filter-panel" role="search" aria-label="Property filters">
      {/* ─── Quick Filter Bar ────────────────────────────────── */}
      <div className="filter-bar-main">
        {/* Search */}
        <form className="filter-search-wrapper" onSubmit={handleSearchSubmit}>
          <Search size={18} className="filter-search-icon" />
          <input
            className="filter-search-input"
            type="text"
            placeholder="Search by name, location..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search properties"
          />
          {searchText && (
            <button
              type="button"
              className="filter-clear-search"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Purpose tabs */}
        <div className="filter-purpose-tabs" role="tablist" aria-label="Purpose filter">
          {PURPOSE_OPTIONS.map(opt => (
            <button
              key={opt}
              role="tab"
              aria-selected={purpose === opt}
              className={`filter-purpose-tab ${purpose === opt ? 'active' : ''}`}
              onClick={() => handlePurposeChange(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Quick dropdowns */}
        <div className="filter-quick-selects">
          <div className="filter-select-group">
            <MapPin size={14} className="filter-select-icon" />
            <select
              value={currentLocation}
              onChange={e => handleLocationChange(e.target.value)}
              aria-label="Location filter"
            >
              {DUBAI_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <Home size={14} className="filter-select-icon" />
            <select
              value={currentType}
              onChange={e => handleTypeChange(e.target.value)}
              aria-label="Property type filter"
            >
              {PROPERTY_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <BedDouble size={14} className="filter-select-icon" />
            <select
              value={currentBeds}
              onChange={e => handleBedsChange(e.target.value)}
              aria-label="Bedrooms filter"
            >
              {BED_OPTIONS.map(b => (
                <option key={b.value} value={String(b.value)}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <DollarSign size={14} className="filter-select-icon" />
            <select
              value={String(currentPriceIdx >= 0 ? currentPriceIdx : 0)}
              onChange={e => handlePriceChange(e.target.value)}
              aria-label="Price range filter"
            >
              {PRICE_RANGES.map((p, i) => (
                <option key={i} value={String(i)}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          className={`filter-advanced-toggle ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(v => !v)}
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {activeFilterCount > 0 && <span className="filter-badge-count">{activeFilterCount}</span>}
        </button>
      </div>

      {/* ─── Advanced Panel ──────────────────────────────────── */}
      {showAdvanced && (
        <div className="filter-advanced-panel" id="advanced-filters">
          <div className="filter-advanced-grid">
            <div className="filter-advanced-group">
              <label htmlFor="filter-baths">Bathrooms</label>
              <select
                id="filter-baths"
                value={currentBaths}
                onChange={e => handleBathsChange(e.target.value)}
              >
                {BATH_OPTIONS.map(b => (
                  <option key={b.value} value={String(b.value)}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-advanced-group">
              <label htmlFor="filter-min-sqft">Min Area (sqft)</label>
              <input
                id="filter-min-sqft"
                type="number"
                min="0"
                step="100"
                placeholder="0"
                value={filters.minSqft || ''}
                onChange={e => updateFilter('minSqft', parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="filter-advanced-group">
              <label htmlFor="filter-max-sqft">Max Area (sqft)</label>
              <input
                id="filter-max-sqft"
                type="number"
                min="0"
                step="100"
                placeholder="20,000"
                value={filters.maxSqft === 20000 ? '' : filters.maxSqft}
                onChange={e => updateFilter('maxSqft', parseInt(e.target.value, 10) || 20000)}
              />
            </div>

            <div className="filter-advanced-group">
              <label htmlFor="filter-sort">Sort By</label>
              <div className="filter-sort-wrapper">
                <ArrowUpDown size={14} className="filter-select-icon" />
                <select
                  id="filter-sort"
                  value={currentSortBy}
                  onChange={e => handleSortChange(e.target.value)}
                >
                  {SORT_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="filter-advanced-actions">
            {activeFilterCount > 0 && (
              <button className="filter-reset-btn" onClick={handleResetAll}>
                <RotateCcw size={14} />
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Results Summary ─────────────────────────────────── */}
      <div className="filter-results-bar">
        <p className="filter-results-count">
          Showing <strong>{resultCount}</strong> of <strong>{totalCount}</strong> properties
        </p>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="filter-active-pills">
            {filters.locations.map(loc => (
              <span key={loc} className="filter-pill">
                {loc}
                <button
                  onClick={() => handleLocationChange('All Locations')}
                  aria-label={`Remove ${loc} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {filters.propertyTypes.map(t => (
              <span key={t} className="filter-pill">
                {t}
                <button
                  onClick={() => handleTypeChange('All Types')}
                  aria-label={`Remove ${t} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {filters.beds > 0 && (
              <span className="filter-pill">
                {filters.beds}+ Beds
                <button onClick={() => handleBedsChange('0')} aria-label="Remove beds filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.baths > 0 && (
              <span className="filter-pill">
                {filters.baths}+ Baths
                <button onClick={() => handleBathsChange('0')} aria-label="Remove baths filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 100_000_000) && (
              <span className="filter-pill">
                {filters.minPrice > 0 ? `${(filters.minPrice / 1_000_000).toFixed(0)}M` : '0'} –{' '}
                {filters.maxPrice < 100_000_000
                  ? `${(filters.maxPrice / 1_000_000).toFixed(0)}M`
                  : '∞'}
                <button onClick={() => handlePriceChange('0')} aria-label="Remove price filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="filter-pill">
                &ldquo;{filters.search}&rdquo;
                <button onClick={handleClearSearch} aria-label="Remove search filter">
                  <X size={12} />
                </button>
              </span>
            )}
            <button className="filter-clear-all-btn" onClick={handleResetAll}>
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default PropertyFilterPanel;
export { SORT_OPTIONS, BATH_OPTIONS, PURPOSE_OPTIONS };
