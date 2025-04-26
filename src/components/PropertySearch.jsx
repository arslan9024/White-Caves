
import React, { useState } from 'react';

export default function PropertySearch({ onSearch }) {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    beds: 'any',
    location: '',
    amenities: [],
    minSqft: '',
    maxSqft: ''
  });

  const amenitiesList = ["Pool", "Parking", "Security", "Gym", "Garden", "Concierge"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    onSearch({ ...filters, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    setFilters(prev => ({
      ...prev,
      amenities: newAmenities
    }));
    onSearch({ ...filters, amenities: newAmenities });
  };

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      beds: 'any',
      location: '',
      amenities: [],
      minSqft: '',
      maxSqft: ''
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="property-search">
      <input
        type="text"
        name="search"
        placeholder="Search by title or location..."
        value={filters.search}
        onChange={handleChange}
        className="search-input"
      />
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price (AED)"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price (AED)"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group">
          <input
            type="number"
            name="minSqft"
            placeholder="Min Sqft"
            value={filters.minSqft}
            onChange={handleChange}
          />
          <input
            type="number"
            name="maxSqft"
            placeholder="Max Sqft"
            value={filters.maxSqft}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group">
          <select name="beds" value={filters.beds} onChange={handleChange}>
            <option value="any">Any Beds</option>
            <option value="1">1+ Bed</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
            <option value="5">5+ Beds</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
          />
        </div>
        <div className="amenities-filter">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="amenity-checkbox">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
        <button className="clear-filters" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}
