import { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import './InteractiveMap.css';

const dubaiCoordinates = {
  'Palm Jumeirah': { lat: 25.1124, lng: 55.1390 },
  'Downtown Dubai': { lat: 25.1972, lng: 55.2744 },
  'Emirates Hills': { lat: 25.0657, lng: 55.1568 },
  'Dubai Marina': { lat: 25.0805, lng: 55.1403 },
  'Arabian Ranches': { lat: 25.0560, lng: 55.2689 },
  'Jumeirah Village Circle': { lat: 25.0587, lng: 55.2106 },
  'Business Bay': { lat: 25.1851, lng: 55.2664 },
  'Jumeirah Beach Residence': { lat: 25.0772, lng: 55.1337 },
  'Dubai Hills Estate': { lat: 25.1048, lng: 55.2336 },
  'City Walk': { lat: 25.2048, lng: 55.2624 },
  'Mohammed Bin Rashid City': { lat: 25.1500, lng: 55.3000 },
  'The Springs': { lat: 25.0411, lng: 55.1947 }
};

const defaultCoords = { lat: 25.15, lng: 55.20 };

const formatPrice = (price) => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const InteractiveMap = ({ onPropertySelect }) => {
  const { filteredProperties } = useSelector((state) => state.properties);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const propertiesByLocation = useMemo(() => {
    const grouped = {};
    filteredProperties.forEach((property) => {
      const loc = property.location;
      if (!grouped[loc]) {
        grouped[loc] = [];
      }
      grouped[loc].push(property);
    });
    return grouped;
  }, [filteredProperties]);

  const locations = Object.keys(propertiesByLocation);

  const handleLocationClick = (location) => {
    setSelectedLocation(location === selectedLocation ? null : location);
    setSelectedProperty(null);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  return (
    <div className="interactive-map-container">
      <div className="map-header">
        <h2>Explore Properties by Location</h2>
        <p>{filteredProperties.length} properties across {locations.length} areas in Dubai</p>
      </div>

      <div className="map-visual-container">
        <div className="dubai-map-visual">
          <div className="map-background">
            <svg viewBox="0 0 800 500" className="dubai-outline">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#a8d4e6', stopOpacity:0.6}} />
                  <stop offset="100%" style={{stopColor:'#7fb8d4', stopOpacity:0.4}} />
                </linearGradient>
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#f5f0e6', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#ebe4d4', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="800" height="500" fill="url(#waterGradient)" />
              <path d="M0,200 Q100,180 200,190 Q350,150 400,160 Q500,140 600,150 Q700,130 800,140 L800,500 L0,500 Z" fill="url(#landGradient)" />
              <path d="M150,200 L180,180 L200,190 L220,175 L200,200 L180,210 Z" fill="#f0e8d8" stroke="#d4c4a8" strokeWidth="1" />
              <ellipse cx="200" cy="210" rx="40" ry="25" fill="#c8e0f0" opacity="0.5" />
              <path d="M350,180 L380,165 L400,175 L380,195 Z" fill="#f0e8d8" stroke="#d4c4a8" strokeWidth="1" />
            </svg>
            
            <div className="location-markers">
              {locations.map((location) => {
                const coords = dubaiCoordinates[location] || defaultCoords;
                
                const x = ((coords.lng - 55.0) / 0.4) * 100;
                const y = 100 - ((coords.lat - 25.0) / 0.25) * 100;
                const propertyCount = propertiesByLocation[location].length;
                
                return (
                  <button
                    key={location}
                    className={`location-marker ${selectedLocation === location ? 'active' : ''}`}
                    style={{ left: `${Math.min(Math.max(x, 5), 95)}%`, top: `${Math.min(Math.max(y, 10), 85)}%` }}
                    onClick={() => handleLocationClick(location)}
                  >
                    <span className="marker-count">{propertyCount}</span>
                    <span className="marker-label">{location}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="location-list-panel">
          <h3>Dubai Areas</h3>
          <div className="location-list">
            {locations.map((location) => {
              const properties = propertiesByLocation[location];
              const avgPrice = properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
              
              return (
                <button
                  key={location}
                  className={`location-list-item ${selectedLocation === location ? 'active' : ''}`}
                  onClick={() => handleLocationClick(location)}
                >
                  <div className="location-info">
                    <h4>{location}</h4>
                    <p>{properties.length} {properties.length === 1 ? 'property' : 'properties'}</p>
                  </div>
                  <div className="location-avg-price">
                    <span>Avg. {formatPrice(avgPrice)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedLocation && (
        <div className="selected-location-properties">
          <div className="section-header">
            <h3>Properties in {selectedLocation}</h3>
            <span>{propertiesByLocation[selectedLocation].length} listings</span>
          </div>
          <div className="property-cards-grid">
            {propertiesByLocation[selectedLocation].map((property) => (
              <div 
                key={property.id}
                className={`map-property-card-full ${selectedProperty?.id === property.id ? 'selected' : ''}`}
                onClick={() => handlePropertyClick(property)}
              >
                <div 
                  className="card-image"
                  style={{ backgroundImage: `url(${property.images?.[0] || ''})` }}
                >
                  <span className="property-type-badge">{property.type}</span>
                </div>
                <div className="card-content">
                  <h4>{property.title}</h4>
                  <div className="property-specs">
                    <span>{property.beds} Beds</span>
                    <span>{property.baths} Baths</span>
                    <span>{property.sqft?.toLocaleString()} sqft</span>
                  </div>
                  <div className="property-price">{formatPrice(property.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedLocation && filteredProperties.length > 0 && (
        <div className="featured-properties-section">
          <h3>Featured Properties</h3>
          <div className="map-property-list">
            {filteredProperties.slice(0, 6).map((property) => (
              <div 
                key={property.id}
                className="map-property-card"
                onClick={() => handlePropertyClick(property)}
              >
                <div 
                  className="map-property-image"
                  style={{ backgroundImage: `url(${property.images?.[0] || ''})` }}
                />
                <div className="map-property-info">
                  <h5>{property.title?.substring(0, 35)}...</h5>
                  <p>{property.location}</p>
                  <span className="map-property-price">{formatPrice(property.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
