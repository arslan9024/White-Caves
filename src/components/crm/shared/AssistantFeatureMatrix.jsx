import React, { useState } from 'react';
import { 
  CheckCircle, Clock, AlertCircle, Code, FileCode, 
  ChevronRight, Search, Filter, Zap, Star, Box
} from 'lucide-react';
import './AssistantFeatureMatrix.css';

export default function AssistantFeatureMatrix({ 
  features, 
  title = "Programmed Capabilities",
  accentColor = "#7c3aed",
  categories = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFeature, setExpandedFeature] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={14} className="status-icon active" />;
      case 'beta':
        return <Zap size={14} className="status-icon beta" />;
      case 'planned':
        return <Clock size={14} className="status-icon planned" />;
      case 'development':
        return <AlertCircle size={14} className="status-icon development" />;
      default:
        return <Box size={14} className="status-icon" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'beta': return 'Beta';
      case 'planned': return 'Planned';
      case 'development': return 'In Development';
      default: return status;
    }
  };

  const uniqueCategories = categories.length > 0 
    ? categories 
    : [...new Set(features.map(f => f.category))];

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = 
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: features.length,
    active: features.filter(f => f.status === 'active').length,
    beta: features.filter(f => f.status === 'beta').length,
    planned: features.filter(f => f.status === 'planned').length,
    development: features.filter(f => f.status === 'development').length
  };

  const categoryStats = uniqueCategories.map(cat => ({
    name: cat,
    count: features.filter(f => f.category === cat).length,
    active: features.filter(f => f.category === cat && f.status === 'active').length
  }));

  return (
    <div className="feature-matrix-container">
      <div className="feature-matrix-header" style={{ borderColor: accentColor }}>
        <div className="header-title">
          <Star size={20} style={{ color: accentColor }} />
          <h3>{title}</h3>
        </div>
        <div className="feature-stats">
          <div className="stat-pill total">
            <span className="stat-count">{stats.total}</span>
            <span className="stat-label">Total Features</span>
          </div>
          <div className="stat-pill active">
            <CheckCircle size={14} />
            <span>{stats.active} Active</span>
          </div>
          <div className="stat-pill beta">
            <Zap size={14} />
            <span>{stats.beta} Beta</span>
          </div>
          {stats.development > 0 && (
            <div className="stat-pill development">
              <AlertCircle size={14} />
              <span>{stats.development} In Dev</span>
            </div>
          )}
          {stats.planned > 0 && (
            <div className="stat-pill planned">
              <Clock size={14} />
              <span>{stats.planned} Planned</span>
            </div>
          )}
        </div>
      </div>

      <div className="feature-controls">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <Filter size={16} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories ({features.length})</option>
            {categoryStats.map(cat => (
              <option key={cat.name} value={cat.name}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="category-overview">
        {categoryStats.map(cat => (
          <button
            key={cat.name}
            className={`category-chip ${selectedCategory === cat.name ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
            style={{ 
              borderColor: selectedCategory === cat.name ? accentColor : undefined,
              background: selectedCategory === cat.name ? `${accentColor}15` : undefined
            }}
          >
            <span className="cat-name">{cat.name}</span>
            <span className="cat-count">{cat.active}/{cat.count}</span>
          </button>
        ))}
      </div>

      <div className="features-list">
        {filteredFeatures.map((feature, index) => (
          <div 
            key={index}
            className={`feature-card ${expandedFeature === index ? 'expanded' : ''}`}
            onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
          >
            <div className="feature-main">
              <div className="feature-icon" style={{ background: `${accentColor}20`, color: accentColor }}>
                {feature.icon || <Code size={18} />}
              </div>
              <div className="feature-info">
                <div className="feature-name">{feature.name}</div>
                <div className="feature-category">{feature.category}</div>
              </div>
              <div className={`status-badge ${feature.status}`}>
                {getStatusIcon(feature.status)}
                <span>{getStatusLabel(feature.status)}</span>
              </div>
              <ChevronRight size={16} className={`expand-icon ${expandedFeature === index ? 'rotated' : ''}`} />
            </div>

            {expandedFeature === index && (
              <div className="feature-details">
                <p className="feature-description">{feature.description}</p>
                
                {feature.sourceFiles && feature.sourceFiles.length > 0 && (
                  <div className="source-files">
                    <h5><FileCode size={14} /> Source Files</h5>
                    <div className="files-list">
                      {feature.sourceFiles.map((file, i) => (
                        <code key={i}>{file}</code>
                      ))}
                    </div>
                  </div>
                )}

                {feature.capabilities && feature.capabilities.length > 0 && (
                  <div className="capabilities">
                    <h5>Capabilities</h5>
                    <ul>
                      {feature.capabilities.map((cap, i) => (
                        <li key={i}>
                          <CheckCircle size={12} />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feature.nextMilestone && (
                  <div className="next-milestone">
                    <Clock size={14} />
                    <span>Next: {feature.nextMilestone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredFeatures.length === 0 && (
          <div className="no-features">
            <Box size={48} />
            <p>No features found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
