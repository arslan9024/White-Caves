import React, { useState } from 'react';
import { CLARA_FEATURES, getFeatureCategories, searchFeatures } from '../data/features';

export default function FeaturesTab() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFeature, setExpandedFeature] = useState(null);

  // Filter features
  let filteredFeatures = CLARA_FEATURES;

  if (selectedCategory !== 'all') {
    filteredFeatures = filteredFeatures.filter(f => f.category === selectedCategory);
  }

  if (searchQuery) {
    filteredFeatures = searchFeatures(searchQuery);
  }

  const categories = ['all', ...getFeatureCategories()];
  const categoryLabels = {
    all: 'All Features',
    intelligence: '🧠 Intelligence',
    analytics: '📊 Analytics',
    automation: '⚙️ Automation',
    prediction: '🔮 Prediction',
    research: '🔍 Research',
    communication: '✉️ Communication',
    engagement: '👥 Engagement',
    workflow: '📋 Workflow',
    retention: '💎 Retention',
    templates: '📖 Templates',
    organization: '🗂️ Organization'
  };

  return (
    <div className="insights-section">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Clara's Capabilities
        </h3>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          margin: 0
        }}>
          {CLARA_FEATURES.length} powerful features to accelerate your sales
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
          style={{ width: '100%' }}
        />
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSearchQuery('');
            }}
            style={{
              padding: '8px 12px',
              background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-background-secondary)',
              color: selectedCategory === cat ? 'white' : 'var(--color-text-primary)',
              border: selectedCategory === cat ? 'none' : '1px solid var(--color-border-default)',
              borderRadius: 'var(--border-radius-sm)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              transition: 'all 200ms ease'
            }}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {filteredFeatures.length > 0 ? (
          filteredFeatures.map(feature => (
            <div
              key={feature.id}
              onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
              style={{
                padding: '16px',
                background: 'var(--color-background-secondary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                borderLeft: '4px solid var(--color-primary)'
              }}
            >
              {/* Feature Header */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '24px',
                  marginBottom: '8px'
                }}>
                  {feature.icon}
                </div>
                <h4 style={{
                  margin: '0 0 4px 0',
                  color: 'var(--color-text-primary)',
                  fontSize: '15px'
                }}>
                  {feature.name}
                </h4>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {feature.category}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {feature.description}
              </p>

              {/* Expanded Content */}
              {expandedFeature === feature.id && (
                <div style={{
                  borderTop: '1px solid var(--color-border-light)',
                  paddingTop: '12px',
                  marginTop: '12px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px'
                  }}>
                    Key Benefits
                  </div>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '16px',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx}>✓ {benefit}</li>
                    ))}
                  </ul>

                  {/* Demo Data */}
                  {feature.demoData && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--color-border-light)'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        marginBottom: '8px'
                      }}>
                        Demo Metrics
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.6'
                      }}>
                        {Object.entries(feature.demoData).map(([key, value]) => {
                          if (typeof value === 'object' && !Array.isArray(value)) {
                            return (
                              <div key={key} style={{ marginBottom: '6px' }}>
                                <strong>{key}:</strong><br />
                                {Object.entries(value).map(([k, v]) => (
                                  <div key={k} style={{ marginLeft: '12px' }}>
                                    {k}: {v}
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <div key={key} style={{ marginBottom: '4px' }}>
                              <strong>{key}:</strong> {value}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Usage Indicator */}
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border-light)',
                fontSize: '11px',
                color: 'var(--color-text-secondary)'
              }}>
                {feature.usage}
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border-default)'
          }}>
            <p style={{ fontSize: '14px', margin: 0 }}>
              No features found. Try a different search or category.
            </p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div style={{
        padding: '16px',
        background: 'var(--color-info-light)',
        color: 'var(--color-info)',
        borderRadius: 'var(--border-radius-md)',
        marginTop: '20px',
        fontSize: '13px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
          💡 Click on any feature to see more details and demo metrics
        </p>
        <p style={{ margin: 0 }}>
          All features are available to help you close deals faster, manage your pipeline effectively, and grow your business.
        </p>
      </div>
    </div>
  );
}
