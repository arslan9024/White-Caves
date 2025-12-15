import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import './PropertyComparison.css';

const formatPrice = (price) => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const PropertyComparison = () => {
  const properties = useSelector((state) => state.properties.properties) || [];
  const [selectedIds, setSelectedIds] = useState([]);
  const [showSelector, setShowSelector] = useState(false);

  const selectedProperties = useMemo(() => {
    return properties.filter((p) => selectedIds.includes(p.id));
  }, [properties, selectedIds]);

  const availableProperties = useMemo(() => {
    return properties.filter((p) => !selectedIds.includes(p.id));
  }, [properties, selectedIds]);

  const handleAddProperty = (propertyId) => {
    if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, propertyId]);
    }
    setShowSelector(false);
  };

  const handleRemoveProperty = (propertyId) => {
    setSelectedIds(selectedIds.filter((id) => id !== propertyId));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const comparisonFields = [
    { key: 'price', label: 'Price', format: (v) => formatPrice(v) },
    { key: 'type', label: 'Property Type', format: (v) => v },
    { key: 'location', label: 'Location', format: (v) => v },
    { key: 'beds', label: 'Bedrooms', format: (v) => v },
    { key: 'baths', label: 'Bathrooms', format: (v) => v },
    { key: 'sqft', label: 'Size (sqft)', format: (v) => v?.toLocaleString() },
    { key: 'pricePerSqft', label: 'Price per sqft', format: (v, p) => formatPrice(Math.round(p.price / p.sqft)) }
  ];

  const getHighlight = (field, value, allValues) => {
    if (allValues.length < 2) return '';
    const numericFields = ['price', 'beds', 'baths', 'sqft'];
    if (!numericFields.includes(field)) return '';
    
    const numValue = parseFloat(value) || 0;
    const numValues = allValues.map((v) => parseFloat(v) || 0).filter((v) => !isNaN(v) && v > 0);
    
    if (numValues.length < 2 || isNaN(numValue) || numValue === 0) return '';
    
    if (field === 'price') {
      return numValue === Math.min(...numValues) ? 'highlight-best' : numValue === Math.max(...numValues) ? 'highlight-worst' : '';
    }
    return numValue === Math.max(...numValues) ? 'highlight-best' : numValue === Math.min(...numValues) ? 'highlight-worst' : '';
  };

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <div className="header-text">
          <h2>Compare Properties</h2>
          <p>Select up to 4 properties to compare side by side</p>
        </div>
        {selectedIds.length > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>

      <div className="comparison-slots">
        {[0, 1, 2, 3].map((slot) => {
          const property = selectedProperties[slot];
          
          if (property) {
            return (
              <div key={slot} className="comparison-card filled">
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveProperty(property.id)}
                >
                  &times;
                </button>
                <div 
                  className="card-image"
                  style={{ backgroundImage: `url(${property.images?.[0] || ''})` }}
                >
                  <span className="property-badge">{property.type}</span>
                </div>
                <div className="card-details">
                  <h4>{property.title?.substring(0, 40)}...</h4>
                  <p className="location">{property.location}</p>
                  <p className="price">{formatPrice(property.price)}</p>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={slot} 
              className="comparison-card empty"
              onClick={() => setShowSelector(true)}
            >
              <div className="add-icon">+</div>
              <p>Add Property</p>
            </div>
          );
        })}
      </div>

      {selectedProperties.length >= 2 && (
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-col">Feature</th>
                {selectedProperties.map((property) => (
                  <th key={property.id} className="property-col">
                    {property.title?.substring(0, 25)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field) => {
                const values = selectedProperties.map((p) => 
                  field.key === 'pricePerSqft' ? p.price / p.sqft : p[field.key]
                );
                
                return (
                  <tr key={field.key}>
                    <td className="feature-cell">{field.label}</td>
                    {selectedProperties.map((property, idx) => (
                      <td 
                        key={property.id}
                        className={`value-cell ${getHighlight(field.key, values[idx], values)}`}
                      >
                        {field.format(values[idx], property)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <td className="feature-cell">Amenities</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="value-cell amenities-cell">
                    <div className="amenity-tags">
                      {property.amenities?.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))}
                      {property.amenities?.length > 4 && (
                        <span className="amenity-more">+{property.amenities.length - 4}</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selectedProperties.length < 2 && (
        <div className="comparison-help">
          <div className="help-icon">&#8644;</div>
          <h3>Select at least 2 properties to compare</h3>
          <p>Click on the empty slots above to add properties for comparison</p>
        </div>
      )}

      {showSelector && (
        <div className="property-selector-overlay" onClick={() => setShowSelector(false)}>
          <div className="property-selector" onClick={(e) => e.stopPropagation()}>
            <div className="selector-header">
              <h3>Select a Property</h3>
              <button className="close-btn" onClick={() => setShowSelector(false)}>
                &times;
              </button>
            </div>
            <div className="selector-list">
              {availableProperties.length === 0 ? (
                <div className="selector-empty">
                  <p>All properties have been added to comparison</p>
                </div>
              ) : (
                availableProperties.map((property) => (
                  <div 
                    key={property.id}
                    className="selector-item"
                    onClick={() => handleAddProperty(property.id)}
                  >
                    <div 
                      className="selector-image"
                      style={{ backgroundImage: `url(${property.images?.[0] || ''})` }}
                    />
                    <div className="selector-info">
                      <h5>{property.title?.substring(0, 35)}...</h5>
                      <p>{property.location}</p>
                      <span className="selector-price">{formatPrice(property.price)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyComparison;
