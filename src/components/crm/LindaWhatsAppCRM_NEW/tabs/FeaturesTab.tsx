import React from 'react';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';

export const FeaturesTab = ({ data }) => {
  const { features } = data;

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="features-tab">
      <div className="tab-header">
        <h3>Features & Capabilities</h3>
        <p className="subtitle">Linda's WhatsApp CRM capabilities</p>
      </div>

      <div className="features-sections">
        {categories.map(category => (
          <div key={category} className="feature-category">
            <h4>{category}</h4>
            <div className="features-list">
              {features.filter(f => f.category === category).map(feature => (
                <div key={feature.id} className="feature-item">
                  <div className="feature-icon">
                    {feature.status === 'active' ? (
                      <CheckCircle size={20} className="active" />
                    ) : (
                      <AlertCircle size={20} className="inactive" />
                    )}
                  </div>
                  <div className="feature-content">
                    <h5>{feature.name}</h5>
                    <p>{feature.description}</p>
                  </div>
                  <span className={`feature-status ${feature.status}`}>
                    {feature.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="features-summary">
        <div className="summary-card">
          <Zap size={24} />
          <div>
            <p className="summary-label">Total Features</p>
            <p className="summary-value">{features.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <CheckCircle size={24} />
          <div>
            <p className="summary-label">Active Features</p>
            <p className="summary-value">{features.filter(f => f.status === 'active').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
