// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/SidebarAiAssistantsList.tsx
/**
 * SidebarAiAssistantsList.tsx
 * White Caves Real Estate LLC - AI Assistants (AIAMS) Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, useEffect } from 'react';
import { Bot, Plus, ArrowRight, Crown, Shield, GitFork } from 'lucide-react';
import {
  loadAiAgentsFromStorage,
  AIAMS_SYNC_EVENT,
} from '../../crm/AiAssistantManager/AiAssistantManager.data';
import type { AiAgentRecord } from '../../crm/AiAssistantManager/AiAssistantManager.types';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarAiAssistantsListProps {
  filterQuery?: string;
  selectedAgentId?: string | null;
  onSelectAgent?: (id: string, name: string) => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarAiAssistantsList: FC<SidebarAiAssistantsListProps> = ({
  filterQuery = '',
  selectedAgentId,
  onSelectAgent,
  onNavigateToView,
}) => {
  const [agents, setAgents] = useState<AiAgentRecord[]>(() => loadAiAgentsFromStorage());

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<AiAgentRecord[]>;
      if (Array.isArray(customEvent.detail)) {
        setAgents(customEvent.detail);
      } else {
        setAgents(loadAiAgentsFromStorage());
      }
    };
    window.addEventListener(AIAMS_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(AIAMS_SYNC_EVENT, handleSync);
  }, []);

  const query = filterQuery.trim().toLowerCase();

  const visibleAgents = agents.filter(agent => {
    if (!query) return true;
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.agentId.toLowerCase().includes(query) ||
      agent.code.toLowerCase().includes(query) ||
      agent.role.toLowerCase().includes(query) ||
      agent.department.toLowerCase().includes(query) ||
      agent.tier.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-ai-assistants-list">
      {/* ── Level 1 Category Portals ─────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <div
          onClick={() => onNavigateToView?.('/dashboard/aiams')}
          style={{
            fontSize: '0.68rem',
            color: '#F87171',
            padding: '5px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-aiams-crud-hub"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Bot size={12} /> AI Assistants CRUD Hub (AIAMS)
          </span>
          <ArrowRight size={11} />
        </div>

        <div
          onClick={() => onNavigateToView?.('/dashboard/aiams/managers')}
          style={{
            fontSize: '0.68rem',
            color: '#FBBF24',
            padding: '5px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-aiams-managers"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Crown size={12} /> Executive & 12 Dept AI Directors
          </span>
          <ArrowRight size={11} />
        </div>

        <div
          onClick={() => onNavigateToView?.('/dashboard/aiams/supervisors')}
          style={{
            fontSize: '0.68rem',
            color: '#38BDF8',
            padding: '5px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-aiams-supervisors"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Shield size={12} /> 108 Squad Supervisor AIs
          </span>
          <ArrowRight size={11} />
        </div>

        <div
          onClick={() => onNavigateToView?.('/dashboard/aiams/organogram')}
          style={{
            fontSize: '0.68rem',
            color: '#34D399',
            padding: '5px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
          data-testid="link-aiams-organogram"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <GitFork size={12} /> 1-12-108 AI Organogram Tree
          </span>
          <ArrowRight size={11} />
        </div>
      </div>

      {/* Header bar with Count and Register action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 10px 8px',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#EF4444',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          AI Workforce ({visibleAgents.length})
        </span>
        <button
          type="button"
          onClick={() => onNavigateToView?.('/dashboard/aiams/create')}
          data-testid="sidebar-aiams-register-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#F87171',
            fontSize: '0.68rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={12} />
          <span>Register AI</span>
        </button>
      </div>

      {/* ── Level 2 Sub-Items: All Registered AI Agents ──────────────── */}
      {visibleAgents.map(agent => {
        const isSelected = selectedAgentId === agent.agentId;
        return (
          <div
            key={agent.agentId}
            onClick={() => {
              onSelectAgent?.(agent.agentId, agent.name);
              onNavigateToView?.(`/dashboard/aiams/${agent.agentId}`);
            }}
            data-testid={`sidebar-ai-agent-${agent.agentId}`}
            style={{
              padding: '9px 11px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(239, 68, 68, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              marginBottom: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.63rem',
                    fontFamily: 'monospace',
                    color: '#F87171',
                    background: 'rgba(239, 68, 68, 0.12)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  {agent.code}
                </span>
                <span
                  style={{
                    fontSize: '0.63rem',
                    fontWeight: 800,
                    color: '#94A3B8',
                  }}
                >
                  {agent.tier}
                </span>
              </div>
              <span style={{ fontSize: '0.63rem', color: '#10B981', fontWeight: 700 }}>
                {agent.status}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F8FAFC' }}>
              {agent.name}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.66rem',
                color: '#64748B',
                gap: '6px',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {agent.role}
              </span>
              <span style={{ color: '#38BDF8', flexShrink: 0 }}>{agent.model}</span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarAiAssistantsList;
