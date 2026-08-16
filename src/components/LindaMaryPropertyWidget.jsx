/**
 * LindaMaryPropertyWidget
 * React component for Linda's WhatsApp CRM dashboard
 * Real-time property search and matching for agent conversations
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropertyQueryService from '../services/PropertyQueryService';

const LindaMaryPropertyWidget = ({ conversation, onPropertySelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    area: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    maxRooms: '',
    furnishingLevel: 'all',
    marketAvailability: 'available_for_both'
  });

  const propertyService = new PropertyQueryService();

  /**
   * Search properties based on natural language query
   */
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setProperties([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await propertyService.searchPropertiesNaturalLanguage(query, 8);

      if (result.success) {
        setProperties(result.properties);
      } else {
        setError('No properties found matching your criteria.');
        setProperties([]);
      }
    } catch (err) {
      setError('Error searching properties. Please try again.');
      
    } finally {
      setLoading(false);
    }
  }, [propertyService]);

  /**
   * Search with advanced filters
   */
  const handleAdvancedSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryFilters = {
        area: filters.area || undefined,
        propertyType: filters.propertyType || undefined,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        minRooms: filters.minRooms ? parseInt(filters.minRooms) : undefined,
        maxRooms: filters.maxRooms ? parseInt(filters.maxRooms) : undefined,
        furnishingLevel: filters.furnishingLevel !== 'all' ? filters.furnishingLevel : undefined,
        marketAvailability: filters.marketAvailability,
        limit: 8
      };

      // Remove undefined values
      Object.keys(queryFilters).forEach(
        key => queryFilters[key] === undefined && delete queryFilters[key]
      );

      const result = await propertyService.queryProperties(queryFilters);

      if (result.success) {
        setProperties(result.data.map(p => ({
          id: p._id,
          pNumber: p.pNumber,
          area: p.area,
          type: p.propertyType,
          rooms: p.rooms,
          price: p.askingPrice,
          currency: p.currency,
          size: p.actualArea,
          furnishing: p.furnishingLevel,
          availability: p.marketAvailability,
          images: p.images,
          features: p.tags,
          description: propertyService.generatePropertyDescription(p)
        })));
      } else {
        setError('No properties match these filters.');
        setProperties([]);
      }
    } catch (err) {
      setError('Error performing advanced search. Please try again.');
      
    } finally {
      setLoading(false);
    }
  }, [filters, propertyService]);

  /**
   * Extract client requirements from conversation
   */
  useEffect(() => {
    if (conversation?.messages?.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage.direction === 'incoming') {
        // Auto-search based on last client message
        handleSearch(lastMessage.content);
      }
    }
  }, [conversation, handleSearch]);

  const handlePropertyClick = (property) => {
    onPropertySelected(property);
  };

  return (
    <div className="linda-property-widget bg-white rounded-lg shadow-lg p-4 mb-4 border-l-4 border-green-500">
      {/* Search Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-2xl mr-2">🏠</span>
          Property Finder
        </h3>

        {/* Main Search Bar */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Search: 2BR villa with pool under 2.5M in Arabian Ranches"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
          >
            {loading ? '🔄' : '🔍'}
          </button>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            ⚙️
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg mb-3">
            <input
              type="text"
              placeholder="Area"
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Property Type</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="penthouse">Penthouse</option>
              <option value="studio">Studio</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Min Rooms"
              value={filters.minRooms}
              onChange={(e) => setFilters({ ...filters, minRooms: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Max Rooms"
              value={filters.maxRooms}
              onChange={(e) => setFilters({ ...filters, maxRooms: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <select
              value={filters.furnishingLevel}
              onChange={(e) => setFilters({ ...filters, furnishingLevel: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="all">Any Furnishing</option>
              <option value="furnished">Furnished</option>
              <option value="semi_furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
            <button
              onClick={handleAdvancedSearch}
              disabled={loading}
              className="col-span-2 md:col-span-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Properties List */}
      {properties.length > 0 ? (
        <div className="grid gap-3">
          <p className="text-sm text-gray-600 mb-2">
            Found {properties.length} matching propert{properties.length === 1 ? 'y' : 'ies'}
          </p>

          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => handlePropertyClick(property)}
              className="p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition"
            >
              <div className="flex gap-3">
                {property.images?.[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.description}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {property.rooms}BR {property.type}
                  </p>
                  <p className="text-sm text-gray-600">{property.area}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-green-600">
                      AED {(property.price / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {property.availability.replace('_', ' ')}
                    </span>
                  </div>
                  {property.features?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {property.features.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Send Properties to Client */}
          <button className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            📤 Send Selected to Client
          </button>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {loading ? (
            <p>🔄 Searching properties...</p>
          ) : searchQuery || Object.values(filters).some(v => v && v !== 'all' && v !== 'available_for_both') ? (
            <p>No properties found. Try adjusting your search criteria.</p>
          ) : (
            <p>Search for properties above to get started! 🔍</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LindaMaryPropertyWidget;
