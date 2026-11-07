// FILE: src/components/crm/AiAssistantManager/AiAssistantCardsGrid.tsx
/**
 * White Caves Real Estate LLC - AI Assistants Cards Grid Deck
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Edit3, Trash2, Eye } from 'lucide-react';
import { aiamsStyles as s } from './AiAssistantManager.styles';
import type { AiAgentRecord, AiAgentTier, AiAgentStatus } from './AiAssistantManager.types';

export interface AiAssistantCardsGridProps {
  agents: AiAgentRecord[];
  onInspect: (agentId: string) => void;
  onEdit: (agent: AiAgentRecord) => void;
  onDelete: (agentId: string) => void;
  onToggleStatus: (agentId: string) => void;
}

const getTierBadgeClass = (tier: AiAgentTier) => {
  switch (tier) {
    case 'EXECUTIVE':
      return s.tierExecutive;
    case 'MANAGER':
      return s.tierManager;
    case 'SUPERVISOR':
      return s.tierSupervisor;
    default:
      return s.tierSpecialist;
  }
};

const getStatusClass = (status: AiAgentStatus) => {
  switch (status) {
    case 'OPTIMAL':
      return s.statusOptimal;
    case 'ACTIVE':
      return s.statusActive;
    case 'BUSY':
      return s.statusBusy;
    default:
      return s.statusStandby;
  }
};

export const AiAssistantCardsGrid: FC<AiAssistantCardsGridProps> = ({
  agents,
  onInspect,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className={s.cardsGrid} data-testid="aiams-cards-grid">
      {agents.length === 0 ? (
        <div className="col-span-full p-8 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          No AI Assistants match your current filter criteria.
        </div>
      ) : (
        agents.map(agent => (
          <div key={agent.agentId} className={s.card} data-testid={`aiams-card-${agent.agentId}`}>
            <div>
              <div className={s.cardTop}>
                <div className={s.cardIdentity}>
                  <div className={s.avatar}>🤖</div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={s.codePill}>{agent.code}</span>
                      <span className={`${s.tierBadge} ${getTierBadgeClass(agent.tier)}`}>
                        {agent.tier}
                      </span>
                    </div>
                    <h3 className={s.name}>{agent.name}</h3>
                    <div className={s.roleText}>{agent.role}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleStatus(agent.agentId)}
                  title="Click to toggle status"
                  className={`${s.statusPill} ${getStatusClass(agent.status)} cursor-pointer`}
                >
                  ● {agent.status}
                </button>
              </div>

              <div className={s.metaSection}>
                <div className={s.metaRow}>
                  <span className={s.metaLabel}>Dept</span>
                  <span className="text-slate-200 font-semibold text-[11px] truncate max-w-[175px]">
                    {agent.department}
                  </span>
                </div>
                <div className={s.metaRow}>
                  <span className={s.metaLabel}>Model</span>
                  <span className="text-red-400 font-mono font-bold text-[11px]">{agent.model}</span>
                </div>
                <div className={s.metaRow}>
                  <span className={s.metaLabel}>SLA & Accuracy</span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {agent.slaResponseTime} · {agent.accuracyRate}%
                  </span>
                </div>
              </div>

              <div className={s.tagsRow}>
                {agent.capabilities.slice(0, 3).map((cap, i) => (
                  <span key={i} className={s.capTag}>
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className={s.cardFooter}>
              <button
                type="button"
                onClick={() => onInspect(agent.agentId)}
                className={s.inspectBtn}
                data-testid={`aiams-inspect-${agent.agentId}`}
              >
                <Eye size={12} className="inline mr-1" />
                Inspect
              </button>
              <button
                type="button"
                onClick={() => onEdit(agent)}
                className={s.editBtn}
                data-testid={`aiams-edit-${agent.agentId}`}
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(agent.agentId)}
                className={s.deleteBtn}
                title="Delete AI Agent"
                data-testid={`aiams-delete-${agent.agentId}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
