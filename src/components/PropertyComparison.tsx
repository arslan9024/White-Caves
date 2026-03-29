import { useState, useMemo, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import './PropertyComparison.css';

interface Property {
  id: string | number;
  title: string;
  location: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  pricePerSqft?: number;
  images?: string[];
  /** Index signature for dynamic field access in comparison table */
  [key: string]: string | number | string[] | undefined;
}

interface ComparisonField {
  key: string;
  label: string;
  format: (value: unknown, property?: Property) => string | number;
}

interface PropertiesState {
  properties: Property[];
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const PropertyComparison: React.FC = () => {
  const properties = useSelector((state: { properties: PropertiesState }) => state.properties.properties) || [];
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [showSelector, setShowSelector] = useState<boolean>(false);

  const selectedProperties = useMemo<Property[]>(() => {
    return properties.filter((p: Property) => selectedIds.includes(p.id));
  }, [properties, selectedIds]);

  const availableProperties = useMemo<Property[]>(() => {
    return properties.filter((p: Property) => !selectedIds.includes(p.id));
  }, [properties, selectedIds]);

  const handleAddProperty = (propertyId: string | number): void => {
    if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, propertyId]);
    }
    setShowSelector(false);
  };

  const handleRemoveProperty = (propertyId: string | number): void => {
    setSelectedIds(selectedIds.filter((id) => id !== propertyId));
  };

  const handleClearAll = (): void => {
    setSelectedIds([]);
  };

  const comparisonFields: ComparisonField[] = [
    { key: 'price', label: 'Price', format: (v) => formatPrice(v as number) },
    { key: 'type', label: 'Property Type', format: (v) => v as string },
    { key: 'location', label: 'Location', format: (v) => v as string },
    { key: 'beds', label: 'Bedrooms', format: (v) => v as number },
    { key: 'baths', label: 'Bathrooms', format: (v) => v as number },
    { key: 'sqft', label: 'Size (sqft)', format: (v) => (v as number)?.toLocaleString() },
    { key: 'pricePerSqft', label: 'Price per sqft', format: (v, p) => p && p.sqft > 0 ? formatPrice(Math.round(p.price / p.sqft)) : 'N/A' }
  ];

  const getHighlight = (field: string, value: unknown, allValues: unknown[]): string => {
    if (allValues.length < 2) return '';
    const numericFields = ['price', 'beds', 'baths', 'sqft'];
    if (!numericFields.includes(field)) return '';
    
    const numValue = parseFloat(String(value)) || 0;
    const numValues = allValues.map((v) => parseFloat(String(v)) || 0).filter((v) => !isNaN(v) && v > 0);
    
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
          <table className="comparison-table" aria-label="Property comparison">
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
                  field.key === 'pricePerSqft' ? (p.sqft > 0 ? p.price / p.sqft : 0) : p[field.key]
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyComparison;
