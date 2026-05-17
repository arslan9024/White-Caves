import React, { useState, useMemo } from 'react';
import './StatusMappingPreview.css';

/**
 * StatusMappingPreview Component
 * Shows how legacy status values are mapped to multi-dimensional status fields
 */
const StatusMappingPreview = ({
  data = [],
  statusMapping = {},
  legacyStatusField = 'status',
  onMappingApproval,
  onMappingAdjustment,
  mappingStrategy = 'auto'
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showDetails, setShowDetails] = useState(null);
  const [adjustments, setAdjustments] = useState({});

  // Extract unique legacy statuses
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set();
    data.forEach(row => {
      const status = row[legacyStatusField];
      if (status) {
        statuses.add(String(status).trim());
      }
    });
    return Array.from(statuses).sort();
  }, [data, legacyStatusField]);

  // Get mapping for a status
  const getStatusMapping = (legacyStatus) => {
    return statusMapping[legacyStatus] || {
      occupancy: 'unknown',
      market: 'unknown',
      construction: 'unknown',
      furnishing: 'unknown',
      legal: 'unknown'
    };
  };

  // Count occurrences of each status
  const getStatusCount = (legacyStatus) => {
    return data.filter(row => String(row[legacyStatusField]).trim() === legacyStatus).length;
  };

  // Status dimensions
  const statusDimensions = {
    occupancy: ['empty', 'occupied', 'tenanted', 'unknown'],
    market: ['ready', 'pipeline', 'unavailable', 'under-negotiation', 'unknown'],
    construction: ['ready', 'under-construction', 'planning', 'unknown'],
    furnishing: ['furnished', 'semi-furnished', 'unfurnished', 'unknown'],
    legal: ['registered', 'processing', 'pending', 'unregistered', 'unknown']
  };

  // Status descriptions
  const dimensionDescriptions = {
    occupancy: 'Is the property empty or occupied?',
    market: 'What is the current market status?',
    construction: 'What is the construction status?',
    furnishing: 'How is the property furnished?',
    legal: 'What is the legal/registration status?'
  };

  // Handle row toggle
  const handleRowToggle = (idx) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedRows(newSelected);
  };

  // Handle adjustment
  const handleAdjustment = (status, dimension, value) => {
    const key = `${status}:${dimension}`;
    const updated = { ...adjustments, [key]: value };
    setAdjustments(updated);
    onMappingAdjustment?.(status, dimension, value);
  };

  // Get stats
  const stats = {
    total: uniqueStatuses.length,
    rows: data.length,
    reviewed: Object.keys(adjustments).length > 0 ? 'adjusted' : 'auto-mapped'
  };

  // Render status dimension select
  const renderDimensionSelect = (status, dimension) => {
    const currentValue = adjustments[`${status}:${dimension}`] || getStatusMapping(status)[dimension];

    return (
      <select
        value={currentValue}
        onChange={(e) => handleAdjustment(status, dimension, e.target.value)}
        className="dimension-select"
      >
        {statusDimensions[dimension].map(val => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="status-mapping-preview">
      <div className="preview-header">
        <h3>Status Mapping Review</h3>
        <p>Legacy status values are automatically mapped to multi-dimensional fields. Adjust as needed.</p>
      </div>

      {/* Strategy Badge */}
      <div className="strategy-info">
        <span className="badge strategy">
          {mappingStrategy === 'auto' ? '🤖' : '✋'} {mappingStrategy === 'auto' ? 'Auto-Mapped' : 'Manual'}
        </span>
        <p>
          {mappingStrategy === 'auto' 
            ? 'Status values were intelligently mapped using pattern recognition' 
            : 'Status values were manually configured'}
        </p>
      </div>

      {/* Statistics */}
      <div className="mapping-stats">
        <div className="stat">
          <span className="label">Unique Status Values:</span>
          <span className="value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="label">Affected Rows:</span>
          <span className="value">{stats.rows}</span>
        </div>
        <div className="stat">
          <span className="label">Status:</span>
          <span className="value">{stats.reviewed}</span>
        </div>
      </div>

      {/* Mapping Table */}
      <div className="mapping-container">
        {uniqueStatuses.map((status) => {
          const mapping = getStatusMapping(status);
          const count = getStatusCount(status);
          const isExpanded = showDetails === status;

          return (
            <div key={status} className="status-mapping-card">
              <div
                className="card-header"
                onClick={() => setShowDetails(isExpanded ? null : status)}
              >
                <div className="header-left">
                  <h4 className="legacy-status">{status}</h4>
                  <span className="count-badge">{count} rows</span>
                </div>
                <div className="header-right">
                  <span className="expand-icon">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="card-content">
                  <div className="dimensions-grid">
                    {Object.entries(statusDimensions).map(([dimension, options]) => {
                      const value = adjustments[`${status}:${dimension}`] || mapping[dimension];

                      return (
                        <div key={dimension} className="dimension-card">
                          <label className="dimension-label">
                            {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                            <span className="dimension-desc">
                              {dimensionDescriptions[dimension]}
                            </span>
                          </label>
                          {renderDimensionSelect(status, dimension)}
                          <span className={`dimension-value ${value}`}>
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show affected rows count */}
                  <div className="card-footer">
                    <small>
                      This mapping affects {count} row{count !== 1 ? 's' : ''} in your import
                    </small>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mapping-legend">
        <h4>Dimension Values</h4>
        <div className="legend-grid">
          {Object.entries(statusDimensions).map(([dimension, values]) => (
            <div key={dimension} className="legend-dimension">
              <strong>{dimension}</strong>
              <div className="legend-values">
                {values.map(val => (
                  <span key={val} className={`legend-value ${val}`}>
                    {val}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Table */}
      <div className="preview-table-section">
        <h4>Sample Data Preview</h4>
        <div className="preview-table-wrapper">
          <table className="preview-table">
            <thead>
              <tr>
                <th>Legacy Status</th>
                <th>Occupancy</th>
                <th>Market</th>
                <th>Construction</th>
                <th>Furnishing</th>
                <th>Legal</th>
              </tr>
            </thead>
            <tbody>
              {uniqueStatuses.map(status => {
                const mapping = getStatusMapping(status);
                const adjusted = adjustments[`${status}:occupancy`]; // Check if adjusted

                return (
                  <tr key={status} className={adjusted ? 'adjusted' : ''}>
                    <td className="legacy-status-cell">
                      <strong>{status}</strong>
                    </td>
                    <td className={`value-cell ${mapping.occupancy}`}>
                      {mapping.occupancy}
                    </td>
                    <td className={`value-cell ${mapping.market}`}>
                      {mapping.market}
                    </td>
                    <td className={`value-cell ${mapping.construction}`}>
                      {mapping.construction}
                    </td>
                    <td className={`value-cell ${mapping.furnishing}`}>
                      {mapping.furnishing}
                    </td>
                    <td className={`value-cell ${mapping.legal}`}>
                      {mapping.legal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <h4>💡 About Status Mapping</h4>
        <ul>
          <li>Each legacy status is mapped to 5 dimensions for better data organization</li>
          <li>You can adjust any mapping value by clicking on a status and changing the dropdown</li>
          <li>Adjustments will affect all rows with that status value</li>
          <li>Choose "unknown" if the mapping is unclear</li>
        </ul>
      </div>

      {/* Footer Actions */}
      <div className="preview-footer">
        <button
          className="btn btn-primary"
          onClick={() => onMappingApproval?.(statusMapping, adjustments)}
        >
          Approve Mapping & Continue
        </button>
      </div>
    </div>
  );
};

export default StatusMappingPreview;
