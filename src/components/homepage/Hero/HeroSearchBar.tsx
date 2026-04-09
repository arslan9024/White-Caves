/**
 * HeroSearchBar — Inline property search integrated into the Hero section.
 * Location dropdown, property type, bedrooms, price range, and "Find Now" CTA.
 * Navigates to /properties with query params on submit.
 */
import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, BedDouble, DollarSign, ChevronDown } from 'lucide-react';
import { setFilters, clearFilters } from '../../../store/propertySlice';
import type { AppDispatch } from '../../../store/store';
import './HeroSearchBar.css';

/* ─── Dubai Communities ─────────────────────────────────────────────── */
const DUBAI_LOCATIONS = [
  'All Locations',
  'Palm Jumeirah',
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'JBR',
  'DIFC',
  'Emirates Hills',
  'Jumeirah Village Circle',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'Jumeirah Lake Towers',
  'Al Barsha',
  'Damac Hills',
  'Dubai Creek Harbour',
  'MBR City',
] as const;

/* ─── Property Types ────────────────────────────────────────────────── */
const PROPERTY_TYPES = [
  'All Types',
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Studio',
  'Office',
  'Land',
] as const;

/* ─── Bedrooms ──────────────────────────────────────────────────────── */
const BED_OPTIONS = [
  { label: 'Any Beds', value: 0 },
  { label: 'Studio', value: 0.5 },
  { label: '1 Bed', value: 1 },
  { label: '2 Beds', value: 2 },
  { label: '3 Beds', value: 3 },
  { label: '4 Beds', value: 4 },
  { label: '5+ Beds', value: 5 },
] as const;

/* ─── Price Ranges (AED) ────────────────────────────────────────────── */
const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 100_000_000 },
  { label: 'Under 1M', min: 0, max: 1_000_000 },
  { label: '1M – 3M', min: 1_000_000, max: 3_000_000 },
  { label: '3M – 5M', min: 3_000_000, max: 5_000_000 },
  { label: '5M – 10M', min: 5_000_000, max: 10_000_000 },
  { label: '10M – 25M', min: 10_000_000, max: 25_000_000 },
  { label: '25M – 50M', min: 25_000_000, max: 50_000_000 },
  { label: '50M+', min: 50_000_000, max: 100_000_000 },
] as const;

interface SelectFieldProps {
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  options: readonly { label: string; value: string }[];
  ariaLabel: string;
}

const SelectField: React.FC<SelectFieldProps> = memo(function SelectField({
  icon,
  value,
  onChange,
  options,
  ariaLabel,
}) {
  return (
    <div className="hero-search-field">
      <span className="hero-search-field-icon">{icon}</span>
      <select
        className="hero-search-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="hero-search-chevron" />
    </div>
  );
});

const HeroSearchBar: React.FC = memo(function HeroSearchBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [location, setLocation] = useState('All Locations');
  const [propertyType, setPropertyType] = useState('All Types');
  const [beds, setBeds] = useState('0');
  const [priceRange, setPriceRange] = useState('0');

  const handleSearch = useCallback(() => {
    // Clear existing filters first
    dispatch(clearFilters());

    // Build filter payload
    const filters: Record<string, unknown> = {};

    if (location !== 'All Locations') {
      filters.locations = [location];
    }
    if (propertyType !== 'All Types') {
      filters.propertyTypes = [propertyType];
    }
    const bedNum = parseFloat(beds);
    if (bedNum > 0) {
      filters.beds = Math.ceil(bedNum);
    }
    const priceIdx = parseInt(priceRange, 10);
    if (priceIdx > 0 && priceIdx < PRICE_RANGES.length) {
      filters.minPrice = PRICE_RANGES[priceIdx].min;
      filters.maxPrice = PRICE_RANGES[priceIdx].max;
    }

    // Dispatch filters to Redux
    if (Object.keys(filters).length > 0) {
      dispatch(setFilters(filters));
    }

    // Build query params for URL
    const params = new URLSearchParams();
    if (location !== 'All Locations') params.set('location', location);
    if (propertyType !== 'All Types') params.set('type', propertyType);
    if (bedNum > 0) params.set('beds', String(Math.ceil(bedNum)));
    if (priceIdx > 0) {
      params.set('minPrice', String(PRICE_RANGES[priceIdx].min));
      params.set('maxPrice', String(PRICE_RANGES[priceIdx].max));
    }

    const queryString = params.toString();
    navigate(queryString ? `/properties?${queryString}` : '/properties');
  }, [dispatch, navigate, location, propertyType, beds, priceRange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
    },
    [handleSearch]
  );

  const locationOptions = DUBAI_LOCATIONS.map((loc) => ({ label: loc, value: loc }));
  const typeOptions = PROPERTY_TYPES.map((t) => ({ label: t, value: t }));
  const bedOptions = BED_OPTIONS.map((b) => ({ label: b.label, value: String(b.value) }));
  const priceOptions = PRICE_RANGES.map((p, i) => ({ label: p.label, value: String(i) }));

  return (
    <motion.div
      className="hero-search-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
      role="search"
      aria-label="Property search"
      onKeyDown={handleKeyDown}
    >
      <div className="hero-search-bar">
        <SelectField
          icon={<MapPin size={18} />}
          value={location}
          onChange={setLocation}
          options={locationOptions}
          ariaLabel="Select location"
        />

        <div className="hero-search-divider" />

        <SelectField
          icon={<Home size={18} />}
          value={propertyType}
          onChange={setPropertyType}
          options={typeOptions}
          ariaLabel="Select property type"
        />

        <div className="hero-search-divider" />

        <SelectField
          icon={<BedDouble size={18} />}
          value={beds}
          onChange={setBeds}
          options={bedOptions}
          ariaLabel="Select bedrooms"
        />

        <div className="hero-search-divider" />

        <SelectField
          icon={<DollarSign size={18} />}
          value={priceRange}
          onChange={setPriceRange}
          options={priceOptions}
          ariaLabel="Select price range"
        />

        <motion.button
          className="hero-search-btn"
          onClick={handleSearch}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Search properties"
        >
          <Search size={20} />
          <span>Find Now</span>
        </motion.button>
      </div>

      <div className="hero-search-tags">
        <span className="hero-search-tag-label">Popular:</span>
        {['Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Penthouse'].map((tag) => (
          <button
            key={tag}
            className="hero-search-tag"
            onClick={() => {
              // Check if it's a location or type
              if (PROPERTY_TYPES.includes(tag as (typeof PROPERTY_TYPES)[number])) {
                setPropertyType(tag);
              } else {
                setLocation(tag);
              }
            }}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
});

export default HeroSearchBar;
export { DUBAI_LOCATIONS, PROPERTY_TYPES, BED_OPTIONS, PRICE_RANGES };
