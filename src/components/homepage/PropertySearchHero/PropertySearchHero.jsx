import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Home,
  Building2,
  Castle,
  Hotel,
  Warehouse,
  LandPlot,
  ChevronDown,
  X,
} from 'lucide-react';
import './PropertySearchHero.css';

const DUBAI_COMMUNITIES = [
  { id: 'downtown', name: 'Downtown Dubai', popular: true },
  { id: 'palm-jumeirah', name: 'Palm Jumeirah', popular: true },
  { id: 'dubai-marina', name: 'Dubai Marina', popular: true },
  { id: 'emirates-hills', name: 'Emirates Hills', popular: true },
  { id: 'dubai-hills', name: 'Dubai Hills Estate', popular: true },
  { id: 'jumeirah-bay', name: 'Jumeirah Bay Island', popular: true },
  { id: 'business-bay', name: 'Business Bay', popular: false },
  { id: 'arabian-ranches', name: 'Arabian Ranches', popular: false },
  { id: 'al-barari', name: 'Al Barari', popular: false },
  { id: 'bluewaters', name: 'Bluewaters Island', popular: false },
  { id: 'city-walk', name: 'City Walk', popular: false },
  { id: 'creek-harbour', name: 'Dubai Creek Harbour', popular: false },
  { id: 'jlt', name: 'Jumeirah Lakes Towers', popular: false },
  { id: 'difc', name: 'DIFC', popular: false },
  { id: 'golf-estates', name: 'Jumeirah Golf Estates', popular: false },
  { id: 'mbr-city', name: 'Mohammed Bin Rashid City', popular: false },
];

const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Apartment', icon: Building2 },
  { id: 'villa', name: 'Villa', icon: Castle },
  { id: 'townhouse', name: 'Townhouse', icon: Home },
  { id: 'penthouse', name: 'Penthouse', icon: Hotel },
  { id: 'duplex', name: 'Duplex', icon: Building2 },
  { id: 'office', name: 'Office', icon: Warehouse },
  { id: 'retail', name: 'Retail', icon: Warehouse },
  { id: 'land', name: 'Land', icon: LandPlot },
];

const PRICE_RANGES_SALE = [
  { id: 'any', label: 'Any Price' },
  { id: '0-1m', label: 'Under AED 1M', min: 0, max: 1000000 },
  { id: '1m-5m', label: 'AED 1M - 5M', min: 1000000, max: 5000000 },
  { id: '5m-15m', label: 'AED 5M - 15M', min: 5000000, max: 15000000 },
  { id: '15m-50m', label: 'AED 15M - 50M', min: 15000000, max: 50000000 },
  { id: '50m-150m', label: 'AED 50M - 150M', min: 50000000, max: 150000000 },
  { id: '150m+', label: 'AED 150M+', min: 150000000, max: null },
];

const PRICE_RANGES_RENT = [
  { id: 'any', label: 'Any Price' },
  { id: '0-50k', label: 'Under AED 50K/yr', min: 0, max: 50000 },
  { id: '50k-150k', label: 'AED 50K - 150K/yr', min: 50000, max: 150000 },
  { id: '150k-300k', label: 'AED 150K - 300K/yr', min: 150000, max: 300000 },
  { id: '300k-500k', label: 'AED 300K - 500K/yr', min: 300000, max: 500000 },
  { id: '500k-1m', label: 'AED 500K - 1M/yr', min: 500000, max: 1000000 },
  { id: '1m+', label: 'AED 1M+/yr', min: 1000000, max: null },
];

const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5', '6', '7+'];

export default function PropertySearchHero() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState('buy');
  const [propertyStatus, setPropertyStatus] = useState('all');
  const [location, setLocation] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState('any');

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showBedroomDropdown, setShowBedroomDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const locationRef = useRef(null);
  const propertyTypeRef = useRef(null);
  const bedroomRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (propertyTypeRef.current && !propertyTypeRef.current.contains(event.target)) {
        setShowPropertyTypeDropdown(false);
      }
      if (bedroomRef.current && !bedroomRef.current.contains(event.target)) {
        setShowBedroomDropdown(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setShowPriceDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCommunities = DUBAI_COMMUNITIES.filter(c =>
    c.name.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const priceRanges = listingType === 'buy' ? PRICE_RANGES_SALE : PRICE_RANGES_RENT;
  const selectedPriceLabel = priceRanges.find(p => p.id === priceRange)?.label || 'Price';
  const selectedPropertyType = PROPERTY_TYPES.find(p => p.id === propertyType);
  const selectedLocation = DUBAI_COMMUNITIES.find(c => c.id === location);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('type', listingType);
    if (propertyStatus !== 'all') params.set('status', propertyStatus);
    if (location) params.set('location', location);
    if (propertyType) params.set('propertyType', propertyType);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (priceRange !== 'any') params.set('price', priceRange);
    navigate(`/properties?${params.toString()}`);
  };

  const clearLocation = () => {
    setLocation('');
    setLocationQuery('');
  };

  return (
    <div className="property-search-hero">
      <div className="search-hero-content">
        <h1 className="search-hero-title">
          Find Your Perfect <span className="red-text">Property</span> in Dubai
        </h1>
        <p className="search-hero-subtitle">
          Explore exclusive properties in Dubai&apos;s most prestigious communities
        </p>

        <div className="search-box-container">
          <div className="listing-type-tabs">
            <button
              className={`listing-type-tab ${listingType === 'buy' ? 'active' : ''}`}
              onClick={() => setListingType('buy')}
            >
              Buy
            </button>
            <button
              className={`listing-type-tab ${listingType === 'rent' ? 'active' : ''}`}
              onClick={() => setListingType('rent')}
            >
              Rent
            </button>
            <button
              className={`listing-type-tab ${listingType === 'new-projects' ? 'active' : ''}`}
              onClick={() => {
                setListingType('new-projects');
                setPropertyStatus('off-plan');
              }}
            >
              New Projects
            </button>
          </div>

          <div className="property-status-tabs">
            <button
              className={`status-tab ${propertyStatus === 'all' ? 'active' : ''}`}
              onClick={() => setPropertyStatus('all')}
            >
              All
            </button>
            <button
              className={`status-tab ${propertyStatus === 'ready' ? 'active' : ''}`}
              onClick={() => setPropertyStatus('ready')}
            >
              Ready
            </button>
            <button
              className={`status-tab ${propertyStatus === 'off-plan' ? 'active' : ''}`}
              onClick={() => setPropertyStatus('off-plan')}
            >
              Off-Plan
            </button>
          </div>

          <div className="search-filters-row">
            <div className="search-filter-group location-filter" ref={locationRef}>
              <div className="filter-input-wrapper" onClick={() => setShowLocationDropdown(true)}>
                <MapPin size={20} className="filter-icon" />
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={locationQuery || selectedLocation?.name || ''}
                  onChange={e => {
                    setLocationQuery(e.target.value);
                    setLocation('');
                    setShowLocationDropdown(true);
                  }}
                  className="filter-input"
                />
                {(location || locationQuery) && (
                  <button className="clear-btn" onClick={clearLocation}>
                    <X size={16} />
                  </button>
                )}
              </div>

              {showLocationDropdown && (
                <div className="filter-dropdown location-dropdown">
                  {filteredCommunities.filter(c => c.popular).length > 0 && (
                    <>
                      <div className="dropdown-section-title">Popular Communities</div>
                      {filteredCommunities
                        .filter(c => c.popular)
                        .map(community => (
                          <button
                            key={community.id}
                            className={`dropdown-item ${location === community.id ? 'selected' : ''}`}
                            onClick={() => {
                              setLocation(community.id);
                              setLocationQuery('');
                              setShowLocationDropdown(false);
                            }}
                          >
                            <MapPin size={16} />
                            {community.name}
                          </button>
                        ))}
                    </>
                  )}
                  {filteredCommunities.filter(c => !c.popular).length > 0 && (
                    <>
                      <div className="dropdown-section-title">All Communities</div>
                      {filteredCommunities
                        .filter(c => !c.popular)
                        .map(community => (
                          <button
                            key={community.id}
                            className={`dropdown-item ${location === community.id ? 'selected' : ''}`}
                            onClick={() => {
                              setLocation(community.id);
                              setLocationQuery('');
                              setShowLocationDropdown(false);
                            }}
                          >
                            <MapPin size={16} />
                            {community.name}
                          </button>
                        ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="search-filter-group" ref={propertyTypeRef}>
              <button
                className="filter-select-btn"
                onClick={() => setShowPropertyTypeDropdown(!showPropertyTypeDropdown)}
              >
                {selectedPropertyType ? (
                  <>
                    <selectedPropertyType.icon size={18} />
                    {selectedPropertyType.name}
                  </>
                ) : (
                  <>
                    <Home size={18} />
                    Property Type
                  </>
                )}
                <ChevronDown size={16} className="chevron" />
              </button>

              {showPropertyTypeDropdown && (
                <div className="filter-dropdown">
                  <button
                    className={`dropdown-item ${!propertyType ? 'selected' : ''}`}
                    onClick={() => {
                      setPropertyType('');
                      setShowPropertyTypeDropdown(false);
                    }}
                  >
                    All Types
                  </button>
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type.id}
                      className={`dropdown-item ${propertyType === type.id ? 'selected' : ''}`}
                      onClick={() => {
                        setPropertyType(type.id);
                        setShowPropertyTypeDropdown(false);
                      }}
                    >
                      <type.icon size={16} />
                      {type.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="search-filter-group" ref={bedroomRef}>
              <button
                className="filter-select-btn"
                onClick={() => setShowBedroomDropdown(!showBedroomDropdown)}
              >
                {bedrooms ? `${bedrooms} ${bedrooms === 'Studio' ? '' : 'Beds'}` : 'Bedrooms'}
                <ChevronDown size={16} className="chevron" />
              </button>

              {showBedroomDropdown && (
                <div className="filter-dropdown bedroom-dropdown">
                  <button
                    className={`dropdown-item ${!bedrooms ? 'selected' : ''}`}
                    onClick={() => {
                      setBedrooms('');
                      setShowBedroomDropdown(false);
                    }}
                  >
                    Any
                  </button>
                  {BEDROOM_OPTIONS.map(option => (
                    <button
                      key={option}
                      className={`dropdown-item ${bedrooms === option ? 'selected' : ''}`}
                      onClick={() => {
                        setBedrooms(option);
                        setShowBedroomDropdown(false);
                      }}
                    >
                      {option} {option !== 'Studio' && 'Bedroom'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="search-filter-group" ref={priceRef}>
              <button
                className="filter-select-btn"
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
              >
                {selectedPriceLabel}
                <ChevronDown size={16} className="chevron" />
              </button>

              {showPriceDropdown && (
                <div className="filter-dropdown price-dropdown">
                  {priceRanges.map(range => (
                    <button
                      key={range.id}
                      className={`dropdown-item ${priceRange === range.id ? 'selected' : ''}`}
                      onClick={() => {
                        setPriceRange(range.id);
                        setShowPriceDropdown(false);
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="search-btn" onClick={handleSearch}>
              <Search size={20} />
              <span>Find Properties</span>
            </button>
          </div>
        </div>

        <div className="quick-links">
          <span>Popular:</span>
          {DUBAI_COMMUNITIES.filter(c => c.popular)
            .slice(0, 4)
            .map(community => (
              <button
                key={community.id}
                className="quick-link"
                onClick={() => {
                  setLocation(community.id);
                  handleSearch();
                }}
              >
                {community.name}
              </button>
            ))}
          <button className="quick-link aurora-link" onClick={() => navigate('/dashboard')}>
            Ask Aurora AI
          </button>
        </div>
      </div>
    </div>
  );
}
