// src/components/sidebars/examples/MaryInventorySidebarExample.tsx
/**
 * Complete Example: Mary Inventory Sidebar in Action
 * Shows all sections, items, and interactions
 * 
 * This is a working example you can view and study
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { MaryInventorySidebar } from '../MaryInventorySidebar/MaryInventorySidebar';
import { InventoryDashboard } from '../../features/InventoryDashboard/InventoryDashboard';

const ExampleContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  font-family: ${props => props.theme.fonts.family};
`;

const SidebarContainer = styled.div`
  width: 280px;
  height: 100%;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.sidebarBg};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 3px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderBar = styled.div`
  padding: 16px 24px;
  background: ${props => props.theme.colors.cardBg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-size: 18px;
    font-weight: 600;
  }

  .breadcrumb {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 13px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${props => props.theme.colors.background};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }
`;

const InfoPanel = styled.div`
  padding: 12px 24px;
  background: ${props => props.theme.colors.infoBackground || 'rgba(59, 130, 246, 0.1)'};
  border-bottom: 1px solid ${props => props.theme.colors.infoBorder || 'rgba(59, 130, 246, 0.2)'};
  color: ${props => props.theme.colors.infoText || '#1e40af'};
  font-size: 13px;
  line-height: 1.5;

  strong {
    font-weight: 600;
  }
`;

interface ExampleState {
  activeFeature: string;
  selectedFeatureName: string;
  featureChanges: number;
}

/**
 * Complete working example showing:
 * 1. Sidebar with all sections
 * 2. Dynamic content based on selection
 * 3. User interaction tracking
 * 4. State management
 */
export const MaryInventorySidebarExample: React.FC = () => {
  const [state, setState] = useState<ExampleState>({
    activeFeature: 'inventory-dashboard',
    selectedFeatureName: 'Dashboard',
    featureChanges: 0,
  });

  const featureNameMap: Record<string, string> = {
    'inventory-dashboard': 'Inventory Dashboard',
    'inventory-search': 'Search Properties',
    'inventory-list': 'Property List',
    'smart-import': 'Smart Import',
    'import-history': 'Import History',
    'data-validation': 'Data Validation',
    'inventory-stats': 'Statistics',
    'inventory-reports': 'Reports',
    'inventory-trends': 'Market Trends',
    'inventory-preferences': 'Preferences',
    'inventory-api-keys': 'API Keys',
  };

  const handleFeatureSelect = (featureId: string) => {
    setState(prev => ({
      ...prev,
      activeFeature: featureId,
      selectedFeatureName: featureNameMap[featureId] || 'Unknown Feature',
      featureChanges: prev.featureChanges + 1,
    }));
  };

  const renderContent = () => {
    // In a real app, this would use DynamicContentRouter
    // For this example, we just show a message
    switch (state.activeFeature) {
      case 'inventory-dashboard':
        return <InventoryDashboard />;
      case 'inventory-search':
        return (
          <div style={{ padding: '24px' }}>
            <h1>🔍 Property Search</h1>
            <p>Search and filter properties by various criteria.</p>
          </div>
        );
      case 'smart-import':
        return (
          <div style={{ padding: '24px' }}>
            <h1>📥 Smart Import</h1>
            <p>Upload and import properties from Excel/CSV files.</p>
          </div>
        );
      default:
        return (
          <div style={{ padding: '24px' }}>
            <h1>{state.selectedFeatureName}</h1>
            <p>This feature is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <ExampleContainer>
      {/* Sidebar */}
      <SidebarContainer>
        <MaryInventorySidebar
          activeFeature={state.activeFeature}
          onFeatureSelect={handleFeatureSelect}
        />
      </SidebarContainer>

      {/* Content */}
      <ContentContainer>
        {/* Header */}
        <HeaderBar>
          <div>
            <h2>{state.selectedFeatureName}</h2>
            <div className="breadcrumb">Mary Inventory / {state.selectedFeatureName}</div>
          </div>
        </HeaderBar>

        {/* Info Panel */}
        <InfoPanel>
          <strong>Example Mode:</strong> You can click sidebar items to see content change.
          Feature changes: <strong>{state.featureChanges}</strong>
        </InfoPanel>

        {/* Main Content */}
        <ContentArea>{renderContent()}</ContentArea>
      </ContentContainer>
    </ExampleContainer>
  );
};

export default MaryInventorySidebarExample;

/**
 * ============================================================================
 * HOW TO USE THIS EXAMPLE
 * ============================================================================
 *
 * 1. In your App.tsx or a route, render this component:
 *
 *    import { MaryInventorySidebarExample } from './components/sidebars/examples/MaryInventorySidebarExample';
 *
 *    function App() {
 *      return <MaryInventorySidebarExample />;
 *    }
 *
 * 2. You'll see:
 *    - Left sidebar with all Mary Inventory features
 *    - Center content area showing current selection
 *    - Header showing breadcrumb
 *    - Info panel tracking feature changes
 *
 * 3. Click sidebar items to:
 *    - See content change dynamically
 *    - Track state updates
 *    - Understand the flow
 *
 * 4. Once you understand how it works, replace this with your actual
 *    integration using DynamicContentRouter and Redux
 *
 * ============================================================================
 */
