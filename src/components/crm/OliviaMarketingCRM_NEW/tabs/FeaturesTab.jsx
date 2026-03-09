import React from 'react';
import AssistantFeatureMatrix from '../../shared/AssistantFeatureMatrix';
import { OLIVIA_FEATURES } from '../data/features';

export default function FeaturesTab() {
  return (
    <div className="features-view">
      <div className="view-header">
        <h3>Olivia Features & Capabilities</h3>
        <p className="view-subtitle">Explore all available marketing features and planned enhancements</p>
      </div>

      <AssistantFeatureMatrix features={OLIVIA_FEATURES} />
    </div>
  );
}
