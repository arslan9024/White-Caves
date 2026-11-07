// FILE: src/components/crm/AiAssistantManager/AiAssistantDetailDossier.tsx
/**
 * White Caves Real Estate LLC - AI Assistant Single Dossier View
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ArrowLeft, Edit3, Trash2, Cpu, Zap, CheckCircle2 } from 'lucide-react';
import type { AiAgentRecord } from './AiAssistantManager.types';

export interface AiAssistantDetailDossierProps {
  agent: AiAgentRecord;
  onBack: () => void;
  onEdit: (agent: AiAgentRecord) => void;
  onDelete: (agentId: string) => void;
  onToggleStatus: (agentId: string) => void;
}

export const AiAssistantDetailDossier: FC<AiAssistantDetailDossierProps> = ({
  agent,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div data-testid="aiams-agent-dossier-view" className="space-y-5">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <button
          type="button"
          onClick={onBack}
          data-testid="aiams-dossier-back-btn"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
        >
          <ArrowLeft size={15} />
          <span>← Back to All AI Assistants (AIAMS)</span>
        </button>
        <span className="font-mono text-xs text-slate-400 font-bold">
          Agent Code · {agent.code} ({agent.agentId})
        </span>
      </div>

      {/* Main Dossier Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-slate-800 border border-red-500/30 flex items-center justify-center text-2xl font-black text-red-400">
              <Cpu size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-white">{agent.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  {agent.tier}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleStatus(agent.agentId)}
                  title="Click to cycle agent status"
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-700/50 cursor-pointer"
                >
                  ● {agent.status}
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-semibold">{agent.role}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Department: {agent.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(agent)}
              data-testid="aiams-dossier-edit-btn"
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit AI Agent</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(agent.agentId);
                onBack();
              }}
              data-testid="aiams-dossier-delete-btn"
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-700/50 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* 4-Box Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">Foundation Model</span>
            <span className="text-sm font-bold text-red-400">{agent.model}</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">SLA Response Time</span>
            <span className="text-sm font-bold text-emerald-400">{agent.slaResponseTime}</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">Accuracy Rate</span>
            <span className="text-sm font-bold text-sky-400">{agent.accuracyRate}%</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">Tasks Executed Today</span>
            <span className="text-sm font-bold text-amber-400">{agent.activeWorkload} Tasks</span>
          </div>
        </div>

        {/* Specialty & System Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase font-mono">
              <Zap size={13} /> Domain Specialty & Mandate
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{agent.specialty}</p>
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                Capabilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {agent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-200 font-medium"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase font-mono">
              <CheckCircle2 size={13} /> System Prompt & Assigned Tasks
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              {agent.systemPrompt}
            </p>
            {agent.assignedTasks && agent.assignedTasks.length > 0 && (
              <ul className="space-y-1 pt-1">
                {agent.assignedTasks.map((task, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
