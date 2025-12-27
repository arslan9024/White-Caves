import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import MegaNav from '../components/MegaNav';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import './PropertiesPage.css';

const sampleProperties = [
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
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    amenities: ["Pool", "Beach Access", "Parking", "Security", "Garden", "Gym"],
    featured: true
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
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    amenities: ["Gym", "Parking", "Concierge", "Pool", "Security"],
    featured: true
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
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    amenities: ["Pool", "Garden", "Security", "Parking", "Gym", "Cinema"],
    featured: true
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
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    amenities: ["Pool", "Gym", "Parking", "Concierge", "Security"]
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
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    amenities: ["Pool", "Garden", "Parking", "Security"]
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
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    amenities: ["Pool", "Parking", "Garden", "Security"]
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
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    amenities: ["Pool", "Gym", "Concierge", "Parking", "Security"]
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
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    amenities: ["Pool", "Beach Access", "Gym", "Parking"]
  }
];

export default function PropertiesPage() {
  const user = useSelector(state => state.user.currentUser);
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState(sampleProperties);
  
  const [filters, setFilters] = useState({
    purpose: searchParams.get('type') || 'all',
    propertyType: 'all',
    location: 'all',
    priceMin: '',
    priceMax: '',
    beds: 'all',
    sortBy: 'featured'
  });

  const [searchQuery, setSearchQuery] = useState('');

  const locations = ['Palm Jumeirah', 'Downtown Dubai', 'Emirates Hills', 'Dubai Marina', 'Arabian Ranches', 'Business Bay', 'JBR', 'Jumeirah Village Circle'];
  const propertyTypes = ['Villa', 'Apartment', 'Penthouse', 'Townhouse'];

  useEffect(() => {
    let result = [...properties];

    if (filters.purpose !== 'all') {
      result = result.filter(p => p.purpose === filters.purpose);
    }
    if (filters.propertyType !== 'all') {
      result = result.filter(p => p.type === filters.propertyType);
    }
    if (filters.location !== 'all') {
      result = result.filter(p => p.location === filters.location);
    }
    if (filters.beds !== 'all') {
      result = result.filter(p => p.beds >= parseInt(filters.beds));
    }
    if (filters.priceMin) {
      result = result.filter(p => p.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter(p => p.price <= parseInt(filters.priceMax));
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
      propertyType: 'all',
      location: 'all',
      priceMin: '',
      priceMax: '',
      beds: 'all',
      sortBy: 'featured'
    });
    setSearchQuery('');
  };

  return (
    <div className="properties-page">
      <MegaNav user={user} />
      
      <section className="properties-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Find Your Perfect Property</h1>
          <p>Browse Dubai's finest luxury real estate collection</p>
        </div>
      </section>

      <div className="properties-container">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-btn" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Purpose</label>
            <div className="purpose-toggle">
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
          </div>

          <div className="filter-group">
            <label>Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="all">All Types</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Bedrooms</label>
            <select
              value={filters.beds}
              onChange={(e) => handleFilterChange('beds', e.target.value)}
            >
              <option value="all">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range (AED)</label>
            <div className="price-inputs">
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
        </aside>

        <main className="properties-main">
          <div className="results-header">
            <p className="results-count">{filteredProperties.length} properties found</p>
            <div className="sort-wrapper">
              <label>Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="properties-grid">
            {filteredProperties.map(property => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  <img src={property.image} alt={property.title} loading="lazy" />
                  {property.featured && <span className="featured-badge">Featured</span>}
                  <span className={`purpose-badge ${property.purpose}`}>
                    {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
                <div className="property-content">
                  <h3>{property.title}</h3>
                  <p className="property-location">{property.location}</p>
                  <div className="property-specs">
                    <span>{property.beds} Beds</span>
                    <span>{property.baths} Baths</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                  <div className="property-amenities">
                    {property.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="amenity-tag">{amenity}</span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="amenity-tag">+{property.amenities.length - 3}</span>
                    )}
                  </div>
                  <div className="property-footer">
                    <span className="property-price">
                      {formatPrice(property.price, property.priceType)}
                    </span>
                    <Link to={`/property/${property.id}`} className="view-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="no-results">
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search query</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
