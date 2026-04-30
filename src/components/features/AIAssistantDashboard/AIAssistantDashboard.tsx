// @ts-nocheck
/**
 * AIAssistantDashboard Component
 * 
 * Displays AI assistant-specific information and controls
 * Shows capabilities, status, department assignments, and recent activity
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getAssistant } from '../../../config/aiAssistantsRegistry';

const DashboardContainer = styled.div`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
`;

const AIIcon = styled.div`
  font-size: 48px;
  line-height: 1;
`;

const HeaderText = styled.div`
  flex: 1;
`;

const AIName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textPrimary || '#1f2937'};
  margin-bottom: 4px;
`;

const AITitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' | 'training' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'active':
        return '#d1fae5';
      case 'training':
        return '#fef3c7';
      case 'error':
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active':
        return '#065f46';
      case 'training':
        return '#92400e';
      case 'error':
        return '#7f1d1d';
      default:
        return '#374151';
    }
  }};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: ${props => props.status === 'active' ? 'pulse 2s infinite' : 'none'};
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const InfoCard = styled.div`
  background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
  border-radius: 8px;
  padding: 16px;
`;

const InfoLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  display: block;
  margin-bottom: 8px;
`;

const InfoValue = styled.p`
  font-size: 14px;
  color: ${props => props.theme?.colors?.textPrimary || '#1f2937'};
  margin: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textPrimary || '#1f2937'};
  margin: 0;
`;

const CapabilityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CapabilityTag = styled.li`
  background: ${props => props.theme?.colors?.active || '#eef2ff'};
  color: ${props => props.theme?.colors?.info || '#3b82f6'};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  color: ${props => props.theme?.colors?.info || '#3b82f6'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.active || '#eef2ff'};
    border-color: ${props => props.theme?.colors?.info || '#3b82f6'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CommingSoon = styled.div`
  background: ${props => props.theme?.colors?.active || '#eef2ff'};
  border: 1px dashed ${props => props.theme?.colors?.info || '#3b82f6'};
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  color: ${props => props.theme?.colors?.info || '#3b82f6'};
`;

interface AIAssistantDashboardProps {
  assistantId: string;
  context?: Record<string, any>;
  featureId?: string;
}

/**
 * AI Assistant Dashboard Component
 * Displays all information for a specific AI assistant
 * 
 * @component
 * @param {string} assistantId - ID of the AI assistant to display
 * @returns {React.ReactElement}
 */
const AIAssistantDashboard: React.FC<AIAssistantDashboardProps> = ({ assistantId }) => {
  const assistant = useMemo(() => {
    return getAssistant(assistantId);
  }, [assistantId]);

  if (!assistant) {
    return (
      <DashboardContainer>
        <CommingSoon>
          <h2>AI Assistant Not Found</h2>
          <p>The AI assistant "{assistantId}" could not be found.</p>
        </CommingSoon>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* AI Assistant Header */}
      <Header>
        <AIIcon>{assistant.avatar}</AIIcon>
        <HeaderText>
          <AIName>{assistant.name}</AIName>
          <AITitle>{assistant.title}</AITitle>
        </HeaderText>
        <StatusBadge status={assistant.status || 'active'}>
          {assistant.status === 'active'
            ? 'Active'
            : assistant.status === 'training'
            ? 'Training'
            : assistant.status === 'error'
            ? 'Error'
            : 'Inactive'}
        </StatusBadge>
      </Header>

      {/* AI Info Grid */}
      <InfoGrid>
        <InfoCard>
          <InfoLabel>Functional Role</InfoLabel>
          <InfoValue>{assistant.role || 'Not Set'}</InfoValue>
          <InfoLabel style={{ marginTop: '8px' }}>Category</InfoLabel>
          <InfoValue>{assistant.category}</InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>Access Level</InfoLabel>
          <InfoValue>{assistant.accessLevel}</InfoValue>
          <InfoLabel style={{ marginTop: '8px' }}>Features</InfoLabel>
          <InfoValue>{assistant.features} total</InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>Reports To</InfoLabel>
          <InfoValue>{assistant.reportsTo}</InfoValue>
          <InfoLabel style={{ marginTop: '8px' }}>Dashboard</InfoLabel>
          <InfoValue style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            {assistant.dashboardPath}
          </InfoValue>
        </InfoCard>
      </InfoGrid>

      {/* AI Description */}
      <Section>
        <SectionTitle>📝 About This Assistant</SectionTitle>
        <InfoCard>
          <InfoValue>{assistant.description}</InfoValue>
        </InfoCard>
      </Section>

      {/* Capabilities */}
      {assistant.capabilities && assistant.capabilities.length > 0 && (
        <Section>
          <SectionTitle>✨ Capabilities</SectionTitle>
          <CapabilityList>
            {assistant.capabilities.map(capability => (
              <CapabilityTag key={capability}>{capability}</CapabilityTag>
            ))}
          </CapabilityList>
        </Section>
      )}

      {/* Department Assignments */}
      {assistant.assignedTo && assistant.assignedTo.length > 0 && (
        <Section>
          <SectionTitle>🏢 Assigned To Departments</SectionTitle>
          <CapabilityList>
            {assistant.assignedTo.map(dept => (
              <CapabilityTag key={dept}>{dept}</CapabilityTag>
            ))}
          </CapabilityList>
        </Section>
      )}

      {/* Data Flows */}
      {assistant.dataFlows && (
        <Section>
          <SectionTitle>🔄 Data Flows</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoLabel>Data Inputs</InfoLabel>
              <CapabilityList>
                {assistant.dataFlows.inputs.map(input => (
                  <CapabilityTag key={input}>{input}</CapabilityTag>
                ))}
              </CapabilityList>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Data Outputs</InfoLabel>
              <CapabilityList>
                {assistant.dataFlows.outputs.map(output => (
                  <CapabilityTag key={output}>{output}</CapabilityTag>
                ))}
              </CapabilityList>
            </InfoCard>
          </InfoGrid>
        </Section>
      )}

      {/* Action Buttons */}
      <Section>
        <SectionTitle>🎮 Quick Actions</SectionTitle>
        <ActionButtons>
          <ActionButton>📊 View Dashboard</ActionButton>
          <ActionButton>⚙️ Configure Settings</ActionButton>
          <ActionButton>📈 View Analytics</ActionButton>
          <ActionButton>🔧 Advanced Options</ActionButton>
        </ActionButtons>
      </Section>

      {/* More Features Coming */}
      <CommingSoon>
        <h3>🚀 More Features</h3>
        <p>Performance metrics, conversation history, and advanced controls coming soon!</p>
      </CommingSoon>
    </DashboardContainer>
  );
};

export default AIAssistantDashboard;

