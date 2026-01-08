import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectFeature, 
  selectCategory, 
  setSearchQuery, 
  clearSelection,
  selectFilteredFeatures,
  selectSelectedFeature 
} from '../../store/featuresSlice';
import { CATEGORY_INFO, FEATURE_STATUS } from '../../config/platformFeatures';
import './FeatureExplorer.css';

const FeatureCard = ({ feature, isSelected, onClick }) => {
  const categoryInfo = CATEGORY_INFO[feature.category];
  
  return (
    <div 
      className={`feature-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ '--category-color': categoryInfo?.color || '#666' }}
    >
      <div className="feature-card-header">
        <span className="feature-icon">{feature.icon}</span>
        <span className={`feature-status ${feature.status}`}>
          {feature.status === 'active' ? '●' : '○'} {feature.status}
        </span>
      </div>
      <h4 className="feature-name">{feature.name}</h4>
      <p className="feature-description">{feature.description}</p>
      <div className="feature-category-badge" style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}>
        {categoryInfo?.icon} {categoryInfo?.name}
      </div>
    </div>
  );
};

const FeatureDetail = ({ feature, onClose }) => {
  const categoryInfo = CATEGORY_INFO[feature.category];
  
  return (
    <div className="feature-detail-panel">
      <button className="detail-close-btn" onClick={onClose}>×</button>
      
      <div className="detail-header">
        <span className="detail-icon">{feature.icon}</span>
        <div className="detail-title-section">
          <h2>{feature.name}</h2>
          <div className="detail-meta">
            <span className={`status-badge ${feature.status}`}>
              {feature.status === 'active' ? '✓ Active' : feature.status}
            </span>
            <span className="category-tag" style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}>
              {categoryInfo?.name}
            </span>
          </div>
        </div>
      </div>
      
      <p className="detail-description">{feature.description}</p>
      
      <div className="detail-section">
        <h3>Features & Capabilities</h3>
        <ul className="detail-list">
          {feature.details.map((detail, index) => (
            <li key={index}>
              <span className="list-icon">✓</span>
              {detail}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="detail-section">
        <h3>Implementation Info</h3>
        <div className="detail-info-grid">
          <div className="info-item">
            <span className="info-label">Implemented</span>
            <span className="info-value">{new Date(feature.implementedDate).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status</span>
            <span className="info-value status-indicator">
              <span className={`status-dot ${feature.status}`}></span>
              {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="detail-section files-section">
        <h3>Source Files</h3>
        <div className="file-list">
          {feature.files.map((file, index) => (
            <code key={index} className="file-path">{file}</code>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureExplorer = () => {
  const dispatch = useDispatch();
  const filteredFeatures = useSelector(selectFilteredFeatures);
  const selectedFeature = useSelector(selectSelectedFeature);
  const selectedCategory = useSelector(state => state.features.selectedCategory);
  const searchQuery = useSelector(state => state.features.searchQuery);
  const stats = useSelector(state => state.features.stats);
  
  const categories = Object.entries(CATEGORY_INFO);

  const handleCategorySelect = (categoryId) => {
    if (selectedCategory === categoryId) {
      dispatch(selectCategory(null));
    } else {
      dispatch(selectCategory(categoryId));
    }
  };

  return (
    <div className="feature-explorer">
      <div className="explorer-header">
        <div className="explorer-title">
          <h2>Platform Features</h2>
          <p className="explorer-subtitle">
            {stats.total} features implemented across {Object.keys(stats.byCategory).length} categories
          </p>
        </div>
        
        <div className="explorer-stats">
          <div className="stat-pill active">
            <span className="stat-value">{stats.byStatus?.active || 0}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-pill beta">
            <span className="stat-value">{stats.byStatus?.beta || 0}</span>
            <span className="stat-label">Beta</span>
          </div>
        </div>
      </div>

      <div className="explorer-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => dispatch(setSearchQuery(''))}>×</button>
          )}
        </div>
        
        <select 
          className="category-select"
          value={selectedCategory || ''}
          onChange={(e) => dispatch(selectCategory(e.target.value || null))}
        >
          <option value="">All Categories</option>
          {categories.map(([id, info]) => (
            <option key={id} value={id}>
              {info.icon} {info.name}
            </option>
          ))}
        </select>

        {(selectedCategory || searchQuery) && (
          <button className="clear-filters-btn" onClick={() => dispatch(clearSelection())}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="category-pills">
        {categories.map(([id, info]) => (
          <button
            key={id}
            className={`category-pill ${selectedCategory === id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(id)}
            style={{ 
              '--pill-color': info.color,
              backgroundColor: selectedCategory === id ? info.color : 'transparent',
              borderColor: info.color,
              color: selectedCategory === id ? 'white' : info.color
            }}
          >
            {info.icon} {info.name}
            <span className="pill-count">{stats.byCategory[id] || 0}</span>
          </button>
        ))}
      </div>

      <div className="explorer-content">
        <div className={`features-grid ${selectedFeature ? 'with-detail' : ''}`}>
          {filteredFeatures.map(feature => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              isSelected={selectedFeature?.id === feature.id}
              onClick={() => dispatch(selectFeature(feature.id))}
            />
          ))}
          
          {filteredFeatures.length === 0 && (
            <div className="no-features-found">
              <span className="empty-icon">🔍</span>
              <h3>No features found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {selectedFeature && (
          <FeatureDetail 
            feature={selectedFeature} 
            onClose={() => dispatch(selectFeature(null))}
          />
        )}
      </div>
    </div>
  );
};

export default FeatureExplorer;
