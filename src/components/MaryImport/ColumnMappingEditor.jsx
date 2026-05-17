import React, { useState, useEffect } from 'react';
import './ColumnMappingEditor.css';

/**
 * ColumnMappingEditor Component
 * Allows users to map imported Excel columns to database fields
 * Supports auto-detection, custom mapping, and field validation
 */
const ColumnMappingEditor = ({
  columns = [],
  existingMapping = {},
  onMappingChange,
  onAutoDetect,
  availableFields = [],
  sampleData = []
}) => {
  const [mapping, setMapping] = useState(existingMapping);
  const [showSuggestions, setShowSuggestions] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedTab, setSelectedTab] = useState('properties'); // properties, owners, both

  // Default available fields
  const defaultPropertyFields = [
    'referenceNo', 'projectName', 'area', 'plotNo', 'building', 'unit',
    'bedrooms', 'bathrooms', 'area', 'type', 'status', 'price',
    'rentPriceAnnual', 'furnishing', 'amenities', 'description',
    'legalStatus', 'occupancyStatus', 'marketStatus'
  ];

  const defaultOwnerFields = [
    'name', 'email', 'phone', 'nationality', 'emiratesID',
    'passportNo', 'address', 'city', 'country', 'companyName',
    'companyRegistration', 'companyTRN', 'contactPerson'
  ];

  const propertyFields = availableFields.length > 0 
    ? availableFields.filter(f => f.category === 'property') 
    : defaultPropertyFields.map(f => ({ name: f, category: 'property' }));

  const ownerFields = availableFields.length > 0 
    ? availableFields.filter(f => f.category === 'owner') 
    : defaultOwnerFields.map(f => ({ name: f, category: 'owner' }));

  // Auto-detect column mappings
  const handleAutoDetect = async () => {
    if (onAutoDetect) {
      const detected = await onAutoDetect(columns, sampleData);
      setMapping(detected);
      onMappingChange?.(detected);
    } else {
      // Fallback auto-detection logic
      const detected = autoDetectMapping(columns);
      setMapping(detected);
      onMappingChange?.(detected);
    }
  };

  // Simple auto-detection logic
  const autoDetectMapping = (cols) => {
    const detected = {};
    const commonPatterns = {
      ref: ['reference', 'ref', 'id', 'referenceno'],
      project: ['project', 'projectname', 'project name'],
      area: ['area', 'area name', 'location'],
      plotNo: ['plot', 'plott no', 'plot number'],
      building: ['building', 'bldg', 'building name'],
      unit: ['unit', 'unit no', 'apartment'],
      bedrooms: ['bedroom', 'bed', 'br', 'bedrooms', 'bed rooms'],
      bathrooms: ['bathroom', 'bath', 'bathrooms', 'bath rooms'],
      type: ['type', 'property type', 'propertytype'],
      price: ['price', 'salePrice', 'sale price'],
      rent: ['rent', 'rental', 'annual rent'],
      furnishing: ['furnish', 'furnished', 'furnishing'],
      name: ['name', 'owner name', 'ownername', 'client name'],
      email: ['email', 'email address'],
      phone: ['phone', 'mobile', 'contact', 'phone number'],
      emiratesID: ['emirates id', 'eid', 'id number', 'emiratesid'],
      passportNo: ['passport', 'passport no', 'passportno']
    };

    cols.forEach(col => {
      const lowerCol = col.toLowerCase().trim();
      for (const [fieldKey, patterns] of Object.entries(commonPatterns)) {
        if (patterns.some(p => lowerCol.includes(p))) {
          detected[col] = fieldKey;
          break;
        }
      }
    });

    return detected;
  };

  // Handle manual mapping change
  const handleMappingChange = (column, field) => {
    const updated = { ...mapping, [column]: field };
    setMapping(updated);
    onMappingChange?.(updated);
    validateMapping(updated);
  };

  // Validate mapping
  const validateMapping = (currentMapping) => {
    const errors = {};
    const requiredFields = ['name', 'referenceNo']; // Minimum required fields

    requiredFields.forEach(field => {
      const isMapped = Object.values(currentMapping).includes(field);
      if (!isMapped) {
        errors[field] = `${field} is required`;
      }
    });

    setValidationErrors(errors);
  };

  // Get suggestions for a column
  const getSuggestions = (column) => {
    const lowerCol = column.toLowerCase();
    const allFields = selectedTab === 'properties' ? propertyFields : 
                      selectedTab === 'owners' ? ownerFields :
                      [...propertyFields, ...ownerFields];

    return allFields.filter(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      return fieldName.toLowerCase().includes(lowerCol) ||
             lowerCol.includes(fieldName.toLowerCase());
    });
  };

  // Get column category
  const getColumnCategory = (column) => {
    const field = mapping[column];
    if (!field) return 'unmapped';
    
    const isProperty = propertyFields.some(f => 
      (typeof f === 'string' ? f : f.name) === field
    );
    const isOwner = ownerFields.some(f => 
      (typeof f === 'string' ? f : f.name) === field
    );

    if (isProperty) return 'property';
    if (isOwner) return 'owner';
    return 'unmapped';
  };

  const renderMappingEditor = () => {
    const fieldOptions = selectedTab === 'properties' ? propertyFields :
                         selectedTab === 'owners' ? ownerFields :
                         [...propertyFields, ...ownerFields];

    return (
      <div className="mapping-table">
        <table>
          <thead>
            <tr>
              <th>Excel Column</th>
              <th>Sample Data</th>
              <th>Map To Field</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((column, idx) => {
              const field = mapping[column];
              const category = getColumnCategory(column);
              const suggestions = getSuggestions(column);
              const sample = sampleData[0]?.[column] || '-';

              return (
                <tr key={column} className={`mapping-row ${category}`}>
                  <td className="column-name">
                    <strong>{column}</strong>
                  </td>
                  <td className="sample-data">
                    <span title={sample}>{String(sample).substring(0, 20)}</span>
                  </td>
                  <td className="field-selector">
                    <select
                      value={field || ''}
                      onChange={(e) => handleMappingChange(column, e.target.value)}
                      className={field ? 'mapped' : 'unmapped'}
                    >
                      <option value="">- Unmapped -</option>
                      <optgroup label="Suggested">
                        {suggestions.slice(0, 3).map(f => {
                          const name = typeof f === 'string' ? f : f.name;
                          return <option key={name} value={name}>{name}</option>;
                        })}
                      </optgroup>
                      <optgroup label="All Fields">
                        {fieldOptions.map(f => {
                          const name = typeof f === 'string' ? f : f.name;
                          return <option key={name} value={name}>{name}</option>;
                        })}
                      </optgroup>
                    </select>
                  </td>
                  <td className="category-badge">
                    <span className={`badge ${category}`}>
                      {category}
                    </span>
                  </td>
                  <td className="status-icon">
                    {field ? (
                      <span className="icon icon-check" title="Mapped">✓</span>
                    ) : (
                      <span className="icon icon-warning" title="Unmapped">⚠</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const mappingStats = {
    total: columns.length,
    mapped: Object.keys(mapping).filter(k => mapping[k]).length,
    properties: Object.values(mapping).filter(v => 
      propertyFields.some(f => (typeof f === 'string' ? f : f.name) === v)
    ).length,
    owners: Object.values(mapping).filter(v => 
      ownerFields.some(f => (typeof f === 'string' ? f : f.name) === v)
    ).length
  };

  return (
    <div className="column-mapping-editor">
      <div className="editor-header">
        <h3>Map Excel Columns to Database Fields</h3>
        <p>Tell us which Excel columns correspond to which database fields</p>
      </div>

      <div className="editor-controls">
        <div className="control-group">
          <button 
            className="btn btn-primary"
            onClick={handleAutoDetect}
          >
            🔍 Auto-Detect Mapping
          </button>
          <p className="hint">Auto-detection will analyze your columns and suggest mappings</p>
        </div>

        <div className="tab-selector">
          <button 
            className={`tab ${selectedTab === 'properties' ? 'active' : ''}`}
            onClick={() => setSelectedTab('properties')}
          >
            Properties ({mappingStats.properties})
          </button>
          <button 
            className={`tab ${selectedTab === 'owners' ? 'active' : ''}`}
            onClick={() => setSelectedTab('owners')}
          >
            Owners ({mappingStats.owners})
          </button>
          <button 
            className={`tab ${selectedTab === 'both' ? 'active' : ''}`}
            onClick={() => setSelectedTab('both')}
          >
            All ({mappingStats.total})
          </button>
        </div>
      </div>

      <div className="mapping-stats">
        <div className="stat">
          <strong>Total Columns:</strong> {mappingStats.total}
        </div>
        <div className="stat">
          <strong>Mapped:</strong> {mappingStats.mapped}
        </div>
        <div className="stat">
          <strong>Progress:</strong> 
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(mappingStats.mapped / mappingStats.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <div className="validation-errors">
          <h4>Required Fields Missing</h4>
          <ul>
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {renderMappingEditor()}

      <div className="editor-footer">
        <div className="legend">
          <span className="legend-item property">
            <span className="dot" />Property Field
          </span>
          <span className="legend-item owner">
            <span className="dot" />Owner Field
          </span>
          <span className="legend-item unmapped">
            <span className="dot" />Unmapped
          </span>
        </div>
        <p className="info">
          💡 Tip: Data will be intelligently separated into Property and Owner records in the database
        </p>
      </div>
    </div>
  );
};

export default ColumnMappingEditor;
