
import React, { useState } from 'react';

export default function PropertySearch({ onSearch }) {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    beds: 'any'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    onSearch({ ...filters, [name]: value });
  };

  return (
    <div className="property-search">
      <input
        type="text"
        name="search"
        placeholder="Search properties..."
        value={filters.search}
        onChange={handleChange}
      />
      <div className="filter-group">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
        />
        <select name="beds" value={filters.beds} onChange={handleChange}>
          <option value="any">Any Beds</option>
          <option value="1">1+ Bed</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
          <option value="5">5+ Beds</option>
        </select>
      </div>
    </div>
  );
}
