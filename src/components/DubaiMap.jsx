import React, { useState, useCallback, useEffect } from 'react';
import './DubaiMap.css';

const DubaiMap = ({ properties = [], onPropertySelect }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapLoaded, setMapLoaded] = useState(false);

  const dubaiAreas = [
    { id: 'palm', name: 'Palm Jumeirah', lat: 25.1124, lng: 55.1390, type: 'luxury' },
    { id: 'downtown', name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744, type: 'luxury' },
    { id: 'marina', name: 'Dubai Marina', lat: 25.0805, lng: 55.1403, type: 'residential' },
    { id: 'business-bay', name: 'Business Bay', lat: 25.1850, lng: 55.2642, type: 'commercial' },
    { id: 'jvc', name: 'Jumeirah Village Circle', lat: 25.0552, lng: 55.2100, type: 'residential' },
    { id: 'hills', name: 'Dubai Hills', lat: 25.1200, lng: 55.2200, type: 'residential' },
    { id: 'creek', name: 'Dubai Creek Harbour', lat: 25.2000, lng: 55.3300, type: 'luxury' },
    { id: 'emirates', name: 'Emirates Hills', lat: 25.0657, lng: 55.1489, type: 'luxury' },
    { id: 'jbr', name: 'JBR', lat: 25.0784, lng: 55.1337, type: 'residential' },
    { id: 'mbr', name: 'MBR City', lat: 25.1700, lng: 55.3100, type: 'luxury' },
  ];

  const sampleProperties = properties.length > 0 ? properties : [
    { id: 1, title: 'Luxury Villa', area: 'palm', price: 15000000, beds: 5, type: 'luxury', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
    { id: 2, title: 'Penthouse Suite', area: 'downtown', price: 12000000, beds: 4, type: 'luxury', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' },
    { id: 3, title: 'Marina Apartment', area: 'marina', price: 2500000, beds: 2, type: 'residential', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400' },
    { id: 4, title: 'Office Tower', area: 'business-bay', price: 8000000, beds: 0, type: 'commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' },
    { id: 5, title: 'Family Villa', area: 'hills', price: 5500000, beds: 4, type: 'residential', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
    { id: 6, title: 'Beachfront Villa', area: 'palm', price: 45000000, beds: 6, type: 'luxury', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400' },
  ];

  const getPropertiesForArea = (areaId) => {
    return sampleProperties.filter(p => p.area === areaId);
  };

  const filteredAreas = activeFilter === 'all' 
    ? dubaiAreas 
    : dubaiAreas.filter(a => a.type === activeFilter);

  const getMarkerColor = (type) => {
    switch(type) {
      case 'luxury': return '#c53030';
      case 'commercial': return '#1a365d';
      case 'residential': return '#38a169';
      default: return '#718096';
    }
  };

  const handleMarkerClick = (area) => {
    setSelectedMarker(area);
  };

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  useEffect(() => {
    setTimeout(() => setMapLoaded(true), 500);
  }, []);

  return (
    <div className="dubai-map-container">
      <div className="map-header">
        <h2>Explore Dubai Properties</h2>
        <p>Interactive map with all our listed properties across Dubai</p>
      </div>

      <div className="map-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Properties
        </button>
        <button 
          className={`filter-btn residential ${activeFilter === 'residential' ? 'active' : ''}`}
          onClick={() => setActiveFilter('residential')}
        >
          Residential
        </button>
        <button 
          className={`filter-btn commercial ${activeFilter === 'commercial' ? 'active' : ''}`}
          onClick={() => setActiveFilter('commercial')}
        >
          Commercial
        </button>
        <button 
          className={`filter-btn luxury ${activeFilter === 'luxury' ? 'active' : ''}`}
          onClick={() => setActiveFilter('luxury')}
        >
          Luxury
        </button>
      </div>

      <div className="map-wrapper">
        <div className="map-background">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Dubai_location.svg/1200px-Dubai_location.svg.png"
            alt="Dubai Map"
            className="dubai-base-map"
            style={{ opacity: 0.15 }}
          />
          
          <div className="interactive-map-overlay">
            <svg viewBox="0 0 800 600" className="map-svg">
              <g className="map-markers">
                {filteredAreas.map((area) => {
                  const x = ((area.lng - 54.9) / (55.5 - 54.9)) * 800;
                  const y = 600 - ((area.lat - 24.8) / (25.5 - 24.8)) * 600;
                  const properties = getPropertiesForArea(area.id);
                  
                  return (
                    <g 
                      key={area.id}
                      className={`marker-group ${selectedMarker?.id === area.id ? 'active' : ''}`}
                      onClick={() => handleMarkerClick(area)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={properties.length > 0 ? 12 + properties.length * 3 : 8}
                        fill={getMarkerColor(area.type)}
                        opacity={0.2}
                        className="marker-pulse"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={properties.length > 0 ? 8 + properties.length * 2 : 6}
                        fill={getMarkerColor(area.type)}
                        className="marker-dot"
                      />
                      {properties.length > 0 && (
                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {properties.length}
                        </text>
                      )}
                      <text
                        x={x}
                        y={y + (properties.length > 0 ? 25 + properties.length * 2 : 20)}
                        textAnchor="middle"
                        fill="#1a365d"
                        fontSize="11"
                        fontWeight="600"
                        className="marker-label"
                      >
                        {area.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {selectedMarker && (
          <div className="map-info-window">
            <button className="close-info" onClick={closeInfoWindow}>x</button>
            <div className="info-header">
              <h4>{selectedMarker.name}</h4>
              <span className={`area-type ${selectedMarker.type}`}>{selectedMarker.type}</span>
            </div>
            <div className="info-properties">
              {getPropertiesForArea(selectedMarker.id).length > 0 ? (
                getPropertiesForArea(selectedMarker.id).map(property => (
                  <div 
                    key={property.id} 
                    className="property-preview"
                    onClick={() => onPropertySelect && onPropertySelect(property)}
                  >
                    <img src={property.image} alt={property.title} />
                    <div className="preview-info">
                      <h5>{property.title}</h5>
                      <p className="preview-price">AED {property.price.toLocaleString()}</p>
                      {property.beds > 0 && <span>{property.beds} Beds</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-properties">No properties currently listed in this area.</p>
              )}
            </div>
            <button className="view-all-btn">
              View All in {selectedMarker.name}
            </button>
          </div>
        )}
      </div>

      <div className="map-legend">
        <h4>Map Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot residential"></span>
            <span>Residential</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot commercial"></span>
            <span>Commercial</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot luxury"></span>
            <span>Luxury</span>
          </div>
        </div>
      </div>

      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-number">{sampleProperties.length}</span>
          <span className="stat-label">Total Properties</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{dubaiAreas.length}</span>
          <span className="stat-label">Areas Covered</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{sampleProperties.filter(p => p.type === 'luxury').length}</span>
          <span className="stat-label">Luxury Listings</span>
        </div>
      </div>
    </div>
  );
};

export default DubaiMap;
