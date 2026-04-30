// @ts-nocheck
/**
 * DynamicContentRouter Component
 * 
 * Routes feature IDs to appropriate components
 * Based on sidebar selection (departments or AI assistants)
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';

// Import all feature components
import DepartmentDashboard from '../../features/DepartmentDashboard/DepartmentDashboard';
import AIAssistantDashboard from '../../features/AIAssistantDashboard/AIAssistantDashboard';
import SearchProperties from '../../features/SearchProperties/SearchProperties';
import SalesDashboard from '../../features/Departments/Sales/SalesDashboard';

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme?.colors?.background || '#f9fafb'};
  overflow-y: auto;
  overflow-x: hidden;

  /* Smooth scrolling */
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.border || '#e5e7eb'};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
    }
  }
`;

const PlaceholderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const PlaceholderTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textPrimary || '#1f2937'};
  margin-bottom: 12px;
`;

const PlaceholderText = styled.p`
  font-size: 14px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
`;

/**
 * Feature Component Map
 * Maps feature IDs to React components
 * Add new features here
 */
const featureComponentMap = {
  // Department features - Real Dashboards
  'dept-sales': () => <SalesDashboard featureId="dept-sales" />,
  'dept-leasing': () => <DepartmentDashboard departmentId="LEASING" />,
  'dept-inventory': () => <DepartmentDashboard departmentId="INVENTORY" />,
  'dept-finance': () => <DepartmentDashboard departmentId="FINANCE" />,
  'dept-legal': () => <DepartmentDashboard departmentId="LEGAL" />,
  'dept-tech': () => <DepartmentDashboard departmentId="TECH" />,
  'dept-hr': () => <DepartmentDashboard departmentId="HR" />,
  'dept-exec': () => <DepartmentDashboard departmentId="EXEC" />,
  'dept-pm': () => <DepartmentDashboard departmentId="PM" />,
  'dept-ops': () => <DepartmentDashboard departmentId="OPS" />,

  // AI Assistant features
  'ai-nina': () => <AIAssistantDashboard assistantId="nina" />,
  'ai-linda': () => <AIAssistantDashboard assistantId="linda" />,
  'ai-mary': () => <AIAssistantDashboard assistantId="mary" />,
  'ai-clara': () => <AIAssistantDashboard assistantId="clara" />,
  'ai-diana': () => <AIAssistantDashboard assistantId="diana" />,
  'ai-eva': () => <AIAssistantDashboard assistantId="eva" />,
  'ai-zoe': () => <AIAssistantDashboard assistantId="zoe" />,
  'ai-aurora': () => <AIAssistantDashboard assistantId="aurora" />,

  // Service features
  'service-search-properties': () => <SearchProperties />,
  'service-import-data': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>📥 Data Import Wizard</PlaceholderTitle>
        <PlaceholderText>Smart import system for properties, owners, and deals</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),
  'service-analytics': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>📊 Analytics Dashboard</PlaceholderTitle>
        <PlaceholderText>Real-time metrics and performance insights</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),
  'service-whatsapp': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>💬 WhatsApp Manager</PlaceholderTitle>
        <PlaceholderText>Manage conversations and automations</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),

  // WhatsApp specific features
  'whatsapp-accounts': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>📱 WhatsApp Accounts</PlaceholderTitle>
        <PlaceholderText>Manage multiple WhatsApp business accounts</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),
  'whatsapp-analytics': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>📈 WhatsApp Analytics</PlaceholderTitle>
        <PlaceholderText>Conversation metrics and insights</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),
  'conversation-history': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>💭 Conversation History</PlaceholderTitle>
        <PlaceholderText>View and search past conversations</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),

  // Settings & Configuration
  'ai-settings': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>⚙️ AI Settings</PlaceholderTitle>
        <PlaceholderText>Configure AI assistants and preferences</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),
  'ai-performance': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>⚡ Performance Metrics</PlaceholderTitle>
        <PlaceholderText>AI performance and usage statistics</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),
  'ai-training': () => (
    <PlaceholderContent>
      <div>
        <PlaceholderTitle>🎓 Training Mode</PlaceholderTitle>
        <PlaceholderText>Train and optimize AI assistants</PlaceholderText>
      </div>
    </PlaceholderContent>
  ),
};

/**
 * DynamicContentRouter Component
 * Routes to the appropriate feature based on featureId
 * 
 * @component
 * @param {string} featureId - ID of the feature to display
 * @param {Object} context - Additional context data for the feature
 * @returns {React.ReactElement}
 */
const DynamicContentRouter = ({ featureId = 'dashboard', context = {} }) => {
  // Get the component for this feature
  const Component = useMemo(() => {
    if (!featureId) {
      return () => (
        <PlaceholderContent>
          <div>
            <PlaceholderTitle>🏢 Welcome to White Caves</PlaceholderTitle>
            <PlaceholderText>Select a department or AI assistant from the sidebars to get started</PlaceholderText>
          </div>
        </PlaceholderContent>
      );
    }

    const componentFactory = featureComponentMap[featureId];
    
    if (!componentFactory) {
      return () => (
        <PlaceholderContent>
          <div>
            <PlaceholderTitle>🔍 Feature Not Found</PlaceholderTitle>
            <PlaceholderText>The feature "{featureId}" hasn't been implemented yet.</PlaceholderText>
          </div>
        </PlaceholderContent>
      );
    }

    return componentFactory;
  }, [featureId]);

  return (
    <ContentContainer>
      <Component context={context} featureId={featureId} />
    </ContentContainer>
  );
};

export default DynamicContentRouter;

