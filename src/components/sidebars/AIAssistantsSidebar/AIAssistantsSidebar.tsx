// src/components/sidebars/AIAssistantsSidebar/AIAssistantsSidebar.tsx
/**
 * Right Sidebar: AI Assistants
 * Displays all available AI assistants with their status and capabilities
 * Provides quick access to AI tools and WhatsApp integrations
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';
import { useSidebarState } from '../../../hooks/useSidebarState';
import {
  AI_ASSISTANTS,
  getAssistantsByDepartment,
  getAssistantsByRole,
} from '../../../config/aiAssistantsRegistry';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.sidebarBg};
  border-left: 1px solid ${props => props.theme.colors.border};
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' | 'training' }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#10b981';
      case 'training':
        return '#f59e0b';
      case 'inactive':
      default:
        return '#6b7280';
    }
  }};
`;

const AISection = styled.div`
  padding: 0;
`;

const AILabel = styled.div`
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 16px;
  margin-bottom: 8px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const AIItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export interface AIAssistantsSidebarProps {
  onAssistantSelect?: (assistantId: string, context?: { role?: string; department?: string }) => void;
  activeAssistant?: string;
  className?: string;
}

export const AIAssistantsSidebar: React.FC<AIAssistantsSidebarProps> = ({
  onAssistantSelect,
  activeAssistant,
  className,
}) => {
  const { setActiveFeature, expandedSections, toggleSection } = useSidebarState();

  // Get assistants grouped by role
  const whatsappAgents = useMemo(() => getAssistantsByRole('WhatsApp Agent'), []);
  const crmAgents = useMemo(() => getAssistantsByRole('CRM Agent'), []);
  const dataAgents = useMemo(() => getAssistantsByRole('Data Management'), []);
  const analyticAgents = useMemo(() => getAssistantsByRole('Analytics & Reporting'), []);

  const handleAssistantClick = (assistantId: string, assistant: any) => {
    setActiveFeature(`ai-${assistantId}`);
    if (onAssistantSelect) {
      onAssistantSelect(assistantId, {
        role: assistant.role,
        department: assistant.assignedTo?.[0],
      });
    }
  };

  const renderAssistantItem = (assistant: any) => (
    <SidebarItem
      key={assistant.id}
      itemId={`ai-${assistant.id}`}
      label={assistant.name}
      icon={assistant.icon}
      isActive={activeAssistant === assistant.id}
      onClick={() => handleAssistantClick(assistant.id, assistant)}
      description={
        <AIItemContainer>
          <StatusBadge status={assistant.status || 'active'} />
          <span style={{ fontSize: '12px', color: 'inherit' }}>{assistant.role}</span>
        </AIItemContainer>
      }
    />
  );

  return (
    <SidebarContainer className={className}>
      <BaseSidebar title="AI Assistants" icon="🤖" subtitle="Smart Helpers">
        {/* WHATSAPP AGENTS - PRIMARY */}
        {whatsappAgents.length > 0 && (
          <AISection>
            <AILabel>📱 WhatsApp Agents</AILabel>
            <SidebarSection
              sectionId="whatsapp-agents"
              title="WhatsApp Integration"
              isExpanded={expandedSections.has('whatsapp-agents')}
              onToggleExpand={() => toggleSection('whatsapp-agents')}
              iconColor="#25D366"
            >
              {whatsappAgents.map(assistant => renderAssistantItem(assistant))}

              {/* WhatsApp Management Options */}
              <SidebarItem
                itemId="whatsapp-accounts"
                label="Manage Accounts"
                icon="⚙️"
                isActive={activeAssistant === 'whatsapp-accounts'}
                onClick={() => {
                  setActiveFeature('whatsapp-accounts');
                  onAssistantSelect?.('whatsapp-accounts', { role: 'Administration' });
                }}
              />

              <SidebarItem
                itemId="whatsapp-analytics"
                label="WhatsApp Analytics"
                icon="📊"
                isActive={activeAssistant === 'whatsapp-analytics'}
                onClick={() => {
                  setActiveFeature('whatsapp-analytics');
                  onAssistantSelect?.('whatsapp-analytics', { role: 'Analytics' });
                }}
              />

              <SidebarItem
                itemId="conversation-history"
                label="Conversation History"
                icon="💬"
                isActive={activeAssistant === 'conversation-history'}
                onClick={() => {
                  setActiveFeature('conversation-history');
                  onAssistantSelect?.('conversation-history', { role: 'Tracking' });
                }}
              />
            </SidebarSection>
          </AISection>
        )}

        {/* CRM AGENTS */}
        {crmAgents.length > 0 && (
          <AISection>
            <AILabel>📊 CRM Agents</AILabel>
            {crmAgents.map(assistant => renderAssistantItem(assistant))}
          </AISection>
        )}

        {/* DATA MANAGEMENT AGENTS */}
        {dataAgents.length > 0 && (
          <AISection>
            <AILabel>📁 Data Management</AILabel>
            <SidebarSection
              sectionId="data-agents"
              title="Data Tools"
              isExpanded={expandedSections.has('data-agents')}
              onToggleExpand={() => toggleSection('data-agents')}
              iconColor="#3b82f6"
            >
              {dataAgents.map(assistant => renderAssistantItem(assistant))}

              <SidebarItem
                itemId="import-wizard"
                label="Data Import"
                icon="📥"
                isActive={activeAssistant === 'import-wizard'}
                onClick={() => {
                  setActiveFeature('import-wizard');
                  onAssistantSelect?.('import-wizard', { role: 'Data Management' });
                }}
              />

              <SidebarItem
                itemId="data-quality"
                label="Quality Check"
                icon="✓"
                isActive={activeAssistant === 'data-quality'}
                onClick={() => {
                  setActiveFeature('data-quality');
                  onAssistantSelect?.('data-quality', { role: 'Data Management' });
                }}
              />
            </SidebarSection>
          </AISection>
        )}

        {/* ANALYTICS AGENTS */}
        {analyticAgents.length > 0 && (
          <AISection>
            <AILabel>📈 Analytics</AILabel>
            {analyticAgents.map(assistant => renderAssistantItem(assistant))}
          </AISection>
        )}

        {/* QUICK ACTIONS */}
        <AISection>
          <AILabel>🔧 Quick Actions</AILabel>

          <SidebarItem
            itemId="ai-settings"
            label="AI Settings"
            icon="⚙️"
            isActive={activeAssistant === 'ai-settings'}
            onClick={() => {
              setActiveFeature('ai-settings');
              onAssistantSelect?.('ai-settings', { role: 'Administration' });
            }}
          />

          <SidebarItem
            itemId="ai-performance"
            label="Performance"
            icon="📊"
            isActive={activeAssistant === 'ai-performance'}
            onClick={() => {
              setActiveFeature('ai-performance');
              onAssistantSelect?.('ai-performance', { role: 'Analytics' });
            }}
          />

          <SidebarItem
            itemId="ai-training"
            label="Training Mode"
            icon="🎓"
            isActive={activeAssistant === 'ai-training'}
            onClick={() => {
              setActiveFeature('ai-training');
              onAssistantSelect?.('ai-training', { role: 'Administration' });
            }}
          />
        </AISection>
      </BaseSidebar>
    </SidebarContainer>
  );
};

export default AIAssistantsSidebar;
