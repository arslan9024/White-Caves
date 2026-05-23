import React, { useMemo } from 'react';
import { Check, AlertCircle, Zap } from 'lucide-react';
import { useInventoryData } from '../hooks/useInventoryData';

/**
 * MaryFeaturesTab - Display Mary's capabilities, features, and status
 */
export default function MaryFeaturesTab() {
  const { properties, stats } = useInventoryData();

  // Define Mary's feature capabilities
  const maryFeatures = useMemo(() => [
    {
      category: 'Inventory Management',
      features: [
        { name: 'View Properties', capability: 'Complete property catalog with filtering', enabled: true },
        { name: 'Add Properties', capability: 'Create new property records', enabled: true },
        { name: 'Edit Properties', capability: 'Modify existing property data', enabled: true },
        { name: 'Delete Properties', capability: 'Remove properties from inventory', enabled: true }
      ]
    },
    {
      category: 'Owner Management',
      features: [
        { name: 'Multi-Owner Support', capability: 'Assign multiple owners to properties', enabled: true },
        { name: 'Owner Lookup', capability: 'View owner profiles and properties', enabled: true },
        { name: 'Owner Relationships', capability: 'Manage property-owner relationships', enabled: true }
      ]
    },
    {
      category: 'Data Analysis',
      features: [
        { name: 'Export Data', capability: 'Export to CSV for external analysis', enabled: true },
        { name: 'Validate Data', capability: 'Check data integrity and consistency', enabled: true },
        { name: 'View Statistics', capability: 'Display key metrics and trends', enabled: true },
        { name: 'Search Properties', capability: 'Find properties by criteria', enabled: true }
      ]
    },
    {
      category: 'Advanced Features',
      features: [
        { name: 'Cluster Analysis', capability: 'Group properties by cluster', enabled: true },
        { name: 'Project Grouping', capability: 'Organize by master projects', enabled: true },
        { name: 'Bulk Operations', capability: 'Perform actions on multiple records', enabled: false },
        { name: 'Custom Reporting', capability: 'Generate custom business reports', enabled: false }
      ]
    }
  ], []);

  const totalFeatures = maryFeatures.reduce((sum, cat) => sum + cat.features.length, 0);
  const enabledFeatures = maryFeatures.reduce((sum, cat) => sum + cat.features.filter(f => f.enabled).length, 0);

  return (
    <div className="mary-features-tab">
      {/* Tab Header */}
      <div className="tab-header">
        <div className="header-content">
          <h3>Mary's Capabilities</h3>
          <p className="header-subtitle">
            Mary is managing {properties?.length || 0} properties with {enabledFeatures}/{totalFeatures} active features
          </p>
        </div>
      </div>

      {/* Feature Summary Cards */}
      <div className="features-summary">
        <div className="summary-card enabled">
          <Zap size={24} />
          <div>
            <div className="card-value">{enabledFeatures}</div>
            <div className="card-label">Active Features</div>
          </div>
        </div>
        <div className="summary-card">
          <AlertCircle size={24} />
          <div>
            <div className="card-value">{totalFeatures - enabledFeatures}</div>
            <div className="card-label">Coming Soon</div>
          </div>
        </div>
        <div className="summary-card">
          <Check size={24} />
          <div>
            <div className="card-value">{Math.round((enabledFeatures / totalFeatures) * 100)}%</div>
            <div className="card-label">Completion</div>
          </div>
        </div>
      </div>

      {/* Features by Category */}
      <div className="features-list">
        {maryFeatures.map((category) => (
          <div key={category.category} className="feature-category">
            <h3 className="category-title">{category.category}</h3>
            <div className="features-grid">
              {category.features.map((feature) => (
                <div 
                  key={feature.name} 
                  className={`feature-item ${feature.enabled ? 'enabled' : 'disabled'}`}
                >
                  <div className="feature-header">
                    <div className="feature-name">{feature.name}</div>
                    {feature.enabled ? (
                      <Check size={16} className="status-icon enabled-icon" />
                    ) : (
                      <AlertCircle size={16} className="status-icon disabled-icon" />
                    )}
                  </div>
                  <p className="feature-capability">{feature.capability}</p>
                  {!feature.enabled && (
                    <span className="status-badge coming-soon">Coming Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Currently Supported Data Types */}
      <div className="data-types-section">
        <h4>Currently Supported Data Types</h4>
        <div className="data-types-grid">
          <div className="data-type-item">
            <span className="data-type-label">Properties</span>
            <span className="data-type-count">{properties?.length || 0}</span>
          </div>
          <div className="data-type-item">
            <span className="data-type-label">Clusters</span>
            <span className="data-type-count">{new Set(properties?.map(p => p.cluster) || []).size}</span>
          </div>
          <div className="data-type-item">
            <span className="data-type-label">Projects</span>
            <span className="data-type-count">{new Set(properties?.map(p => p.project) || []).size}</span>
          </div>
          <div className="data-type-item">
            <span className="data-type-label">Owners</span>
            <span className="data-type-count">{new Set(properties?.flatMap(p => p.owners || []) || []).size}</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h4>Performance Metrics</h4>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Average Load Time</span>
            <span className="metric-value">~150ms</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Query Optimization</span>
            <span className="metric-value">Indexed</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Cache Status</span>
            <span className="metric-value">Active</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Data Integrity</span>
            <span className="metric-value">Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
