import React, { useState, useMemo } from 'react';
import { FileText, Grid3x3, BookOpen, AlertCircle } from 'lucide-react';
import { useInventoryData } from '../hooks/useInventoryData';

/**
 * MaryDetailsTab - Property details view and documentation
 * Shows selected property details, property matrix, and guides
 */
export default function MaryDetailsTab() {
  const { properties } = useInventoryData();
  const [activeDetailsView, setActiveDetailsView] = useState('guide');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Get property matrix data
  const propertyMatrix = useMemo(() => {
    const matrix = {};
    properties?.forEach(prop => {
      if (!matrix[prop.cluster]) {
        matrix[prop.cluster] = [];
      }
      matrix[prop.cluster].push(prop);
    });
    return matrix;
  }, [properties]);

  const detailsViews = [
    { id: 'guide', label: 'Getting Started', icon: BookOpen },
    { id: 'selected', label: 'Selected Property', icon: FileText },
    { id: 'matrix', label: 'Property Matrix', icon: Grid3x3 }
  ];

  return (
    <div className="mary-details-tab">
      {/* Tab Header */}
      <div className="tab-header">
        <div className="header-content">
          <h3>Property Details</h3>
          <p className="header-subtitle">View detailed information about properties in your inventory</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="details-view-tabs">
        {detailsViews.map(view => (
          <button
            key={view.id}
            className={`view-tab ${activeDetailsView === view.id ? 'active' : ''}`}
            onClick={() => setActiveDetailsView(view.id)}
          >
            <view.icon size={16} />
            {view.label}
          </button>
        ))}
      </div>

      {/* View Content */}
      <div className="details-view-content">
        {/* Getting Started Guide */}
        {activeDetailsView === 'guide' && (
          <div className="guide-section">
            <div className="info-card">
              <AlertInfo size={20} />
              <div>
                <h4>How to View Property Details</h4>
                <p>Property details are typically shown in a modal when you click on a property in the Inventory tab. You can also select properties here to preview their information.</p>
              </div>
            </div>

            <div className="guide-content">
              <h4>Available Information:</h4>
              <ul className="guide-list">
                <li><strong>Property Number (P-Number)</strong> - Unique property identifier</li>
                <li><strong>Project & Cluster</strong> - Location grouping and classification</li>
                <li><strong>Area & Building</strong> - Specific location details</li>
                <li><strong>Unit & Floor</strong> - Unit number and floor level</li>
                <li><strong>Status</strong> - Current property status (Active, Inactive, Sold, etc.)</li>
                <li><strong>Owners</strong> - Names and contact information of property owners</li>
                <li><strong>Multi-Owner Details</strong> - Ownership percentage and relations for shared properties</li>
              </ul>

              <h4 className="mt-6">Tips:</h4>
              <ul className="guide-list">
                <li>Use filters in the Inventory tab to narrow down properties</li>
                <li>Search by property number, project, or cluster name</li>
                <li>Click on property cards to open detailed modal view</li>
                <li>Use Data Tools tab to export or validate property information</li>
              </ul>
            </div>
          </div>
        )}

        {/* Selected Property Details */}
        {activeDetailsView === 'selected' && (
          <div className="selected-property-section">
            {selectedProperty ? (
              <div className="property-details">
                <div className="detail-group">
                  <label>Property Number</label>
                  <value>{selectedProperty.pNumber}</value>
                </div>
                <div className="detail-group">
                  <label>Project</label>
                  <value>{selectedProperty.project}</value>
                </div>
                <div className="detail-group">
                  <label>Cluster</label>
                  <value>{selectedProperty.cluster}</value>
                </div>
                <div className="detail-group">
                  <label>Area</label>
                  <value>{selectedProperty.area}</value>
                </div>
                <div className="detail-group">
                  <label>Building</label>
                  <value>{selectedProperty.building || 'N/A'}</value>
                </div>
                <div className="detail-group">
                  <label>Unit & Floor</label>
                  <value>{selectedProperty.unitNumber ? `${selectedProperty.unitNumber} - Floor ${selectedProperty.floor || 'N/A'}` : 'N/A'}</value>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <value className="status-badge">{selectedProperty.status}</value>
                </div>
                <div className="detail-group">
                  <label>Owners ({selectedProperty.owners?.length || 0})</label>
                  <ul className="owners-list">
                    {selectedProperty.owners?.map((ownerId, idx) => (
                      <li key={idx}>{ownerId}</li>
                    )) || <li>No owners assigned</li>}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={40} />
                <h4>No Property Selected</h4>
                <p>Switch to the "Property Matrix" tab to select a property, or click on properties in the Inventory tab.</p>
              </div>
            )}
          </div>
        )}

        {/* Property Matrix */}
        {activeDetailsView === 'matrix' && (
          <div className="matrix-section">
            <div className="matrix-info">
              <p>Click on any property card below to view its details:</p>
            </div>

            <div className="clusters-container">
              {Object.entries(propertyMatrix).map(([cluster, clusterProps]) => (
                <div key={cluster} className="cluster-block">
                  <h4 className="cluster-title">{cluster || 'Unassigned'} ({clusterProps.length})</h4>
                  <div className="properties-grid">
                    {clusterProps.map(prop => (
                      <div 
                        key={prop.pNumber} 
                        className={`property-card ${selectedProperty?.pNumber === prop.pNumber ? 'selected' : ''}`}
                        onClick={() => setSelectedProperty(prop)}
                      >
                        <div className="card-header">
                          <span className="p-number">{prop.pNumber}</span>
                          <span className="status-badge">{prop.status}</span>
                        </div>
                        <div className="card-body">
                          <p className="card-project">{prop.project}</p>
                          <p className="card-area">{prop.area}</p>
                          {prop.unitNumber && (
                            <p className="card-unit">Unit {prop.unitNumber}</p>
                          )}
                        </div>
                        <div className="card-footer">
                          <span className="owner-count">{prop.owners?.length || 0} owner(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(propertyMatrix).length === 0 && (
                <div className="empty-matrix">
                  <p>No properties to display</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
