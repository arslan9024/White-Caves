// src/components/sidebars/AIAssistantsSidebar/AIAssistantsSidebar.tsx
/**
 * Right Sidebar: AI Assistants
 * Displays all available AI assistants with their status and capabilities
 * Provides quick access to AI tools and WhatsApp integrations
 *
 * @deprecated Canonical CRM sidebar is `src/components/layout/UnifiedSidebar/UnifiedSidebar.tsx`.
 * Keep this file for compatibility until all legacy imports are retired.
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';
import { useSidebarState } from '../../../hooks/useSidebarState';
import {
  AI_ASSISTANTS,
  getAssistantsByRole,
  type AIAssistant,
} from '../../../config/aiAssistantsRegistry';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => String((theme as any)?.colors?.sidebarBg ?? '#1a1a1a')};
  border-left: 1px solid ${({ theme }) => String((theme as any)?.colors?.border ?? '#333')};
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
  color: ${({ theme }) => String((theme as any)?.colors?.textSecondary ?? '#999')};
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
  onAssistantSelect?: (
    assistantId: string,
    context?: { role?: string; department?: string }
  ) => void;
  activeAssistant?: string;
  className?: string;
}

export const AIAssistantsSidebar: React.FC<AIAssistantsSidebarProps> = ({
  onAssistantSelect,
  activeAssistant,
  className,
}) => {
  const { setActive, isExpanded, toggleExpanded } = useSidebarState('ai-assistants');

  // Get assistants grouped by role
  const whatsappAgents = useMemo(() => getAssistantsByRole('WhatsApp Agent'), []);
  const crmAgents = useMemo(() => getAssistantsByRole('CRM Agent'), []);
  const dataAgents = useMemo(() => getAssistantsByRole('Data Management'), []);
  const analyticAgents = useMemo(() => getAssistantsByRole('Analytics & Reporting'), []);
  const allAssistants = useMemo(() => Object.values(AI_ASSISTANTS), []);
  const groupedAssistantIds = useMemo(() => {
    return new Set([
      ...whatsappAgents.map(a => a.id),
      ...crmAgents.map(a => a.id),
      ...dataAgents.map(a => a.id),
      ...analyticAgents.map(a => a.id),
    ]);
  }, [analyticAgents, crmAgents, dataAgents, whatsappAgents]);
  const ungroupedAssistants = useMemo(
    () => allAssistants.filter(assistant => !groupedAssistantIds.has(assistant.id)),
    [allAssistants, groupedAssistantIds]
  );

  const handleAssistantClick = (assistantId: string, assistant: AIAssistant) => {
    setActive(`ai-${assistantId}`);
    if (onAssistantSelect) {
      onAssistantSelect(assistantId, {
        role: assistant.role,
        department: assistant.assignedTo?.[0],
      });
    }
  };

  const renderAssistantItem = (assistant: AIAssistant) => (
    <SidebarItem
      key={assistant.id}
      id={`ai-${assistant.id}`}
      label={assistant.name}
      icon={assistant.avatar || assistant.icon}
      isSelected={activeAssistant === assistant.id}
      onClick={() => handleAssistantClick(assistant.id, assistant)}
      sidebarName="ai-assistants"
      badge={
        assistant.role ? { text: assistant.role, variant: 'secondary', size: 'sm' } : undefined
      }
    />
  );

  return (
    <SidebarContainer className={className}>
      <BaseSidebar name="ai-assistants" title="AI Assistants" icon="🤖" hasSearch={false}>
        {/* WHATSAPP AGENTS - PRIMARY */}
        {whatsappAgents.length > 0 && (
          <AISection>
            <AILabel>📱 WhatsApp Agents</AILabel>
            <SidebarSection
              id="whatsapp-agents"
              title="WhatsApp Integration"
              sidebarName="ai-assistants"
              defaultExpanded={isExpanded('whatsapp-agents')}
              onToggle={() => toggleExpanded('whatsapp-agents')}
            >
              {whatsappAgents.map(assistant => renderAssistantItem(assistant))}

              {/* WhatsApp Management Options */}
              <SidebarItem
                id="whatsapp-accounts"
                label="Manage Accounts"
                icon="⚙️"
                isSelected={activeAssistant === 'whatsapp-accounts'}
                sidebarName="ai-assistants"
                onClick={() => {
                  setActive('whatsapp-accounts');
                  onAssistantSelect?.('whatsapp-accounts', { role: 'Administration' });
                }}
              />

              <SidebarItem
                id="whatsapp-analytics"
                label="WhatsApp Analytics"
                icon="📊"
                isSelected={activeAssistant === 'whatsapp-analytics'}
                sidebarName="ai-assistants"
                onClick={() => {
                  setActive('whatsapp-analytics');
                  onAssistantSelect?.('whatsapp-analytics', { role: 'Analytics' });
                }}
              />

              <SidebarItem
                id="conversation-history"
                label="Conversation History"
                icon="💬"
                isSelected={activeAssistant === 'conversation-history'}
                sidebarName="ai-assistants"
                onClick={() => {
                  setActive('conversation-history');
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
              id="data-agents"
              title="Data Tools"
              sidebarName="ai-assistants"
              defaultExpanded={isExpanded('data-agents')}
              onToggle={() => toggleExpanded('data-agents')}
            >
              {dataAgents.map(assistant => renderAssistantItem(assistant))}

              <SidebarItem
                id="import-wizard"
                label="Data Import"
                icon="📥"
                isSelected={activeAssistant === 'import-wizard'}
                sidebarName="ai-assistants"
                onClick={() => {
                  setActive('import-wizard');
                  onAssistantSelect?.('import-wizard', { role: 'Data Management' });
                }}
              />

              <SidebarItem
                id="data-quality"
                label="Quality Check"
                icon="✓"
                isSelected={activeAssistant === 'data-quality'}
                sidebarName="ai-assistants"
                onClick={() => {
                  setActive('data-quality');
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

        {/* OTHER ASSISTANTS */}
        {ungroupedAssistants.length > 0 && (
          <AISection>
            <AILabel>🧠 Other Assistants</AILabel>
            {ungroupedAssistants.map(assistant => renderAssistantItem(assistant))}
          </AISection>
        )}

        {/* QUICK ACTIONS */}
        <AISection>
          <AILabel>🔧 Quick Actions</AILabel>

          <SidebarItem
            id="ai-settings"
            label="AI Settings"
            icon="⚙️"
            isSelected={activeAssistant === 'ai-settings'}
            sidebarName="ai-assistants"
            onClick={() => {
              setActive('ai-settings');
              onAssistantSelect?.('ai-settings', { role: 'Administration' });
            }}
          />

          <SidebarItem
            id="ai-performance"
            label="Performance"
            icon="📊"
            isSelected={activeAssistant === 'ai-performance'}
            sidebarName="ai-assistants"
            onClick={() => {
              setActive('ai-performance');
              onAssistantSelect?.('ai-performance', { role: 'Analytics' });
            }}
          />

          <SidebarItem
            id="ai-training"
            label="Training Mode"
            icon="🎓"
            isSelected={activeAssistant === 'ai-training'}
            sidebarName="ai-assistants"
            onClick={() => {
              setActive('ai-training');
              onAssistantSelect?.('ai-training', { role: 'Administration' });
            }}
          />
        </AISection>
      </BaseSidebar>
    </SidebarContainer>
  );
};

export default AIAssistantsSidebar;
