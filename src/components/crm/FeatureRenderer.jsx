import React, { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentAssistant } from '../../store/slices/aiAssistantDashboardSlice';
import { selectActiveFeatureTab } from '../../store/slices/dashboardViewSlice';
import { getFeatureById } from '../../config/assistantFeatures';
import { getCRMModule } from '../../config/crmModuleRegistry';
import GenericFeatureView from './ui/GenericFeatureView';
import './FeatureRenderer.css';

const LoadingFallback = () => (
  <div className="feature-loading">
    <div className="loading-spinner" />
    <span>Loading feature...</span>
  </div>
);

const FeatureRenderer = ({ assistantId: propAssistantId, featureId: propFeatureId }) => {
  const currentAssistant = useSelector(selectCurrentAssistant);
  const activeFeatureTab = useSelector(selectActiveFeatureTab);

  const assistantId = propAssistantId || currentAssistant?.id;
  const featureId = propFeatureId || activeFeatureTab || 'dashboard';

  const feature = useMemo(() => {
    if (!assistantId) return null;
    return getFeatureById(assistantId, featureId);
  }, [assistantId, featureId]);

  const content = useMemo(() => {
    if (!assistantId) {
      return (
        <div className="no-selection">
          <div className="no-selection-content">
            <h2>Select an AI Assistant</h2>
            <p>Choose an assistant from the sidebar to view their features and data.</p>
          </div>
        </div>
      );
    }

    const moduleDef = getCRMModule(assistantId);

    if (moduleDef?.Component) {
      const CRMComponent = moduleDef.Component;
      return (
        <Suspense fallback={<LoadingFallback />}>
          <CRMComponent activeFeature={featureId} />
        </Suspense>
      );
    }

    return (
      <GenericFeatureView
        assistant={currentAssistant}
        feature={feature || { id: featureId, label: featureId }}
        color={currentAssistant?.colorScheme || '#0EA5E9'}
      />
    );
  }, [assistantId, featureId, currentAssistant, feature]);

  return (
    <div className="feature-renderer" data-assistant={assistantId} data-feature={featureId}>
      {content}
    </div>
  );
};

export default FeatureRenderer;
