import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../store/dashboardSlice';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { PropertyImageSlider, PropertyDetailModal } from '../shared/components/property';
import { Search, SlidersHorizontal, Grid, List, MapPin, Bed, Bath, Maximize, X, ChevronDown } from 'lucide-react';
import './PropertiesPage.css';

const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: "Beachfront Villa with Private Pool",
    location: "Palm Jumeirah",
    type: "Villa",
    purpose: "buy",
    beds: 6,
    baths: 7,
    sqft: 12000,
    price: 45000000,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    amenities: ["Pool", "Beach Access", "Parking", "Security", "Garden", "Gym"],
    featured: true,
    yearBuilt: 2022
  },
  {
    id: 2,
    title: "Burj Khalifa View Penthouse",
    location: "Downtown Dubai",
    type: "Penthouse",
    purpose: "buy",
    beds: 4,
    baths: 5,
    sqft: 6500,
    price: 35000000,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    amenities: ["Gym", "Parking", "Concierge", "Pool", "Security"],
    featured: true,
    yearBuilt: 2021
  },
  {
    id: 3,
    title: "Mediterranean Style Mansion",
    location: "Emirates Hills",
    type: "Villa",
    purpose: "buy",
    beds: 7,
    baths: 9,
    sqft: 15000,
    price: 65000000,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    amenities: ["Pool", "Garden", "Security", "Parking", "Gym", "Cinema"],
    featured: true,
    yearBuilt: 2020
  },
  {
    id: 4,
    title: "Waterfront Apartment",
    location: "Dubai Marina",
    type: "Apartment",
    purpose: "rent",
    beds: 3,
    baths: 4,
    sqft: 3200,
    price: 250000,
    priceType: "yearly",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800"
    ],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    amenities: ["Pool", "Gym", "Parking", "Concierge", "Security"],
    yearBuilt: 2019
  },
  {
    id: 5,
    title: "Modern Villa with Golf Course Views",
    location: "Arabian Ranches",
    type: "Villa",
    purpose: "buy",
    beds: 5,
    baths: 6,
    sqft: 8500,
    price: 18000000,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800"
    ],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    amenities: ["Pool", "Garden", "Parking", "Security"],
    yearBuilt: 2021
  },
  {
    id: 6,
    title: "Luxury Townhouse",
    location: "Jumeirah Village Circle",
    type: "Townhouse",
    purpose: "rent",
    beds: 4,
    baths: 5,
    sqft: 4500,
    price: 180000,
    priceType: "yearly",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566752734-2a0cd44d0c36?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    amenities: ["Pool", "Parking", "Garden", "Security"],
    yearBuilt: 2020
  },
  {
    id: 7,
    title: "Exclusive Sky Villa",
    location: "Business Bay",
    type: "Penthouse",
    purpose: "buy",
    beds: 5,
    baths: 6,
    sqft: 8000,
    price: 28000000,
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    amenities: ["Pool", "Gym", "Concierge", "Parking", "Security"],
    yearBuilt: 2023
  },
  {
    id: 8,
    title: "Garden Apartment",
    location: "JBR",
    type: "Apartment",
    purpose: "rent",
    beds: 2,
    baths: 2,
    sqft: 1800,
    price: 150000,
    priceType: "yearly",
    images: [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    amenities: ["Pool", "Beach Access", "Gym", "Parking"],
    yearBuilt: 2018
  },
  {
    id: 9,
    title: "Contemporary Duplex",
    location: "DIFC",
    type: "Apartment",
    purpose: "buy",
    beds: 3,
    baths: 4,
    sqft: 4200,
    price: 12000000,
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
    amenities: ["Gym", "Parking", "Concierge", "Security"],
    yearBuilt: 2022
  },
  {
    id: 10,
    title: "Signature Villa",
    location: "Palm Jumeirah",
    type: "Villa",
    purpose: "rent",
    beds: 6,
    baths: 7,
    sqft: 10000,
    price: 850000,
    priceType: "yearly",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
    amenities: ["Pool", "Beach Access", "Garden", "Parking", "Security", "Gym"],
    featured: true,
    yearBuilt: 2021
  },
  {
    id: 11,
    title: "Studio with Sea View",
    location: "Dubai Marina",
    type: "Apartment",
    purpose: "rent",
    beds: 0,
    baths: 1,
    sqft: 650,
    price: 65000,
    priceType: "yearly",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    amenities: ["Pool", "Gym", "Parking"],
    yearBuilt: 2019
  },
  {
    id: 12,
    title: "Family Home in Green Community",
    location: "Dubai Hills",
    type: "Villa",
    purpose: "buy",
    beds: 5,
    baths: 6,
    sqft: 7500,
    price: 9500000,
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600566752734-2a0cd44d0c36?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    amenities: ["Pool", "Garden", "Parking", "Security", "Gym"],
    yearBuilt: 2022
  }
];

const LOCATIONS = ['All Locations', 'Palm Jumeirah', 'Downtown Dubai', 'Emirates Hills', 'Dubai Marina', 'Arabian Ranches', 'Business Bay', 'JBR', 'Jumeirah Village Circle', 'DIFC', 'Dubai Hills'];
const PROPERTY_TYPES = ['All Types', 'Villa', 'Apartment', 'Penthouse', 'Townhouse'];

export default function PropertiesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties] = useState(SAMPLE_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState(SAMPLE_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    purpose: searchParams.get('type') || 'all',
    propertyType: 'All Types',
    location: 'All Locations',
    priceMin: '',
    priceMax: '',
    beds: 'any',
    baths: 'any',
    sqftMin: '',
    sqftMax: '',
    sortBy: 'featured'
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let result = [...properties];

    if (filters.purpose !== 'all') {
      result = result.filter(p => p.purpose === filters.purpose);
    }
    if (filters.propertyType !== 'All Types') {
      result = result.filter(p => p.type === filters.propertyType);
    }
    if (filters.location !== 'All Locations') {
      result = result.filter(p => p.location === filters.location);
    }
    if (filters.beds !== 'any') {
      result = result.filter(p => p.beds >= parseInt(filters.beds));
    }
    if (filters.baths !== 'any') {
      result = result.filter(p => p.baths >= parseInt(filters.baths));
    }
    if (filters.priceMin) {
      result = result.filter(p => p.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter(p => p.price <= parseInt(filters.priceMax));
    }
    if (filters.sqftMin) {
      result = result.filter(p => p.sqft >= parseInt(filters.sqftMin));
    }
    if (filters.sqftMax) {
      result = result.filter(p => p.sqft <= parseInt(filters.sqftMax));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      );
    }

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'sqft':
        result.sort((a, b) => b.sqft - a.sqft);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProperties(result);
  }, [filters, searchQuery, properties]);

  const formatPrice = (price, priceType) => {
    if (priceType === 'yearly') {
      return `AED ${(price).toLocaleString()}/year`;
    }
    return `AED ${price.toLocaleString()}`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      purpose: 'all',
      propertyType: 'All Types',
      location: 'All Locations',
      priceMin: '',
      priceMax: '',
      beds: 'any',
      baths: 'any',
      sqftMin: '',
      sqftMax: '',
      sortBy: 'featured'
    });
    setSearchQuery('');
  };

  const toggleFavorite = (property) => {
    const isFav = favorites.some(f => f.id === property.id);
    if (isFav) {
      dispatch(removeFromFavorites(property.id));
    } else {
      dispatch(addToFavorites({ 
        id: property.id, 
        title: property.title, 
        location: property.location, 
        price: formatPrice(property.price, property.priceType), 
        image: property.image 
      }));
    }
  };

  const isFavorite = (propertyId) => favorites.some(f => f.id === propertyId);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'purpose' && value !== 'all') return true;
    if (key === 'propertyType' && value !== 'All Types') return true;
    if (key === 'location' && value !== 'All Locations') return true;
    if (key === 'beds' && value !== 'any') return true;
    if (key === 'baths' && value !== 'any') return true;
    if ((key === 'priceMin' || key === 'priceMax' || key === 'sqftMin' || key === 'sqftMax') && value) return true;
    return false;
  }).length;

  return (
    <AppLayout>
      <div className="properties-page">
        <section className="properties-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Find Your Perfect Property</h1>
            <p>Browse Dubai's finest luxury real estate collection</p>
          </div>
        </section>

        <div className="search-filter-bar">
          <div className="search-wrapper">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by location, property name, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="quick-filters">
            <div className="purpose-tabs">
              <button
                className={filters.purpose === 'all' ? 'active' : ''}
                onClick={() => handleFilterChange('purpose', 'all')}
              >All</button>
              <button
                className={filters.purpose === 'buy' ? 'active' : ''}
                onClick={() => handleFilterChange('purpose', 'buy')}
              >Buy</button>
              <button
                className={filters.purpose === 'rent' ? 'active' : ''}
                onClick={() => handleFilterChange('purpose', 'rent')}
              >Rent</button>
            </div>

            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-select"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="filter-select"
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filters.beds}
              onChange={(e) => handleFilterChange('beds', e.target.value)}
              className="filter-select beds"
            >
              <option value="any">Beds</option>
              <option value="0">Studio</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>

            <button 
              className={`advanced-filter-btn ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
            </button>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="advanced-filters-panel">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Price Range (AED)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Area (sq.ft)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.sqftMin}
                    onChange={(e) => handleFilterChange('sqftMin', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.sqftMax}
                    onChange={(e) => handleFilterChange('sqftMax', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Bathrooms</label>
                <select
                  value={filters.baths}
                  onChange={(e) => handleFilterChange('baths', e.target.value)}
                >
                  <option value="any">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
            
            <div className="filter-actions">
              <button className="clear-filters-btn" onClick={clearFilters}>Clear All Filters</button>
            </div>
          </div>
        )}

        <div className="properties-container">
          <div className="results-header">
            <p className="results-count">
              <strong>{filteredProperties.length}</strong> properties found
            </p>
            <div className="results-controls">
              <div className="view-toggle">
                <button 
                  className={viewMode === 'grid' ? 'active' : ''} 
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={viewMode === 'list' ? 'active' : ''} 
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <List size={18} />
                </button>
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="sqft">Largest</option>
              </select>
            </div>
          </div>

          <div className={`properties-grid ${viewMode}`}>
            {filteredProperties.map(property => (
              <div key={property.id} className="property-card-enhanced">
                <div className="card-image-wrapper" onClick={() => setSelectedProperty(property)}>
                  <PropertyImageSlider 
                    images={property.images}
                    title={property.title}
                    onFavorite={() => toggleFavorite(property)}
                    isFavorite={isFavorite(property.id)}
                    aspectRatio="4/3"
                  />
                  <div className="card-badges">
                    {property.featured && <span className="badge featured">Featured</span>}
                    <span className={`badge purpose ${property.purpose}`}>
                      {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                </div>
                
                <div className="card-content" onClick={() => setSelectedProperty(property)}>
                  <div className="card-type">{property.type}</div>
                  <h3 className="card-title">{property.title}</h3>
                  <p className="card-location">
                    <MapPin size={14} />
                    {property.location}
                  </p>
                  
                  <div className="card-specs">
                    <span><Bed size={16} /> {property.beds === 0 ? 'Studio' : `${property.beds} Beds`}</span>
                    <span><Bath size={16} /> {property.baths} Baths</span>
                    <span><Maximize size={16} /> {property.sqft.toLocaleString()} sqft</span>
                  </div>
                  
                  <div className="card-amenities">
                    {property.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="amenity-chip">{amenity}</span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="amenity-chip more">+{property.amenities.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="card-footer">
                    <span className="card-price">
                      {formatPrice(property.price, property.priceType)}
                    </span>
                    <button className="view-details-btn">
                      View Details
                      <ChevronDown size={16} className="rotated" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="no-results">
              <div className="no-results-content">
                <h3>No properties found</h3>
                <p>Try adjusting your filters or search query</p>
                <button onClick={clearFilters}>Clear Filters</button>
              </div>
            </div>
          )}
        </div>

        <Footer />
        <WhatsAppButton />
      </div>

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onFavorite={() => toggleFavorite(selectedProperty)}
          isFavorite={isFavorite(selectedProperty.id)}
        />
      )}
    </AppLayout>
  );
}
