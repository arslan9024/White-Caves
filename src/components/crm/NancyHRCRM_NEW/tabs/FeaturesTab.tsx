import React from 'react';
import AssistantFeatureMatrix from '../../shared/AssistantFeatureMatrix';
import { NANCY_FEATURES } from '../data/features';

export default function FeaturesTab() {
  return (
    <div className="features-view">
      <div className="view-header">
        <h3>Nancy Features & Capabilities</h3>
        <p className="view-subtitle">Explore all available HR management features and planned enhancements</p>
      </div>

      <AssistantFeatureMatrix features={NANCY_FEATURES as any} />
    </div>
  );
}
