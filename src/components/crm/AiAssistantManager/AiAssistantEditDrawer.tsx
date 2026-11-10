// FILE: src/components/crm/AiAssistantManager/AiAssistantEditDrawer.tsx
/**
 * White Caves Real Estate LLC - AI Assistant Create / Edit Drawer
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AI_DEPARTMENTS_OPTIONS, AI_MODELS_LIST } from './AiAssistantManager.data';
import type {
  AiAgentRecord,
  AiAgentFormPayload,
  AiAgentTier,
  AiAgentStatus,
} from './AiAssistantManager.types';
import { useDirtyStateGuard } from '../../../hooks/useDirtyStateGuard';
import { UnsavedChangesModal, TaskActionBar } from '../../common/UnsavedChangesModal';

export interface AiAssistantEditDrawerProps {
  isOpen: boolean;
  agent: AiAgentRecord | null;
  onClose: () => void;
  onSave: (payload: AiAgentFormPayload) => void;
}

export const AiAssistantEditDrawer: React.FC<AiAssistantEditDrawerProps> = ({
  isOpen,
  agent,
  onClose,
  onSave,
}) => {
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');
  const [formData, setFormData] = useState<AiAgentFormPayload>({
    agentId: '',
    code: '',
    name: '',
    role: '',
    departmentId: 'luxury_sales',
    department: 'Luxury Sales & Brokerage',
    tier: 'SUPERVISOR',
    status: 'ACTIVE',
    model: 'gemini-1.5-flash',
    specialty: '',
    systemPrompt: '',
    capabilities: ['Autonomous Execution', '15-Min SLA'],
    activeWorkload: 0,
  });
  const [capabilitiesInput, setCapabilitiesInput] = useState('Autonomous Execution, 15-Min SLA');

  useEffect(() => {
    if (agent) {
      const snapData = {
        agentId: agent.agentId,
        code: agent.code,
        name: agent.name,
        role: agent.role,
        departmentId: agent.departmentId,
        department: agent.department,
        tier: agent.tier,
        status: agent.status,
        model: agent.model,
        specialty: agent.specialty,
        systemPrompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        activeWorkload: agent.activeWorkload,
      };
      setFormData(snapData);
      const caps = (agent.capabilities || []).join(', ');
      setCapabilitiesInput(caps);
      setInitialSnapshot(JSON.stringify({ ...snapData, caps }));
    } else {
      const defaultData: AiAgentFormPayload = {
        agentId: '',
        code: '',
        name: '',
        role: '',
        departmentId: 'luxury_sales',
        department: 'Luxury Sales & Brokerage',
        tier: 'SUPERVISOR',
        status: 'ACTIVE',
        model: 'gemini-1.5-flash',
        specialty: '',
        systemPrompt: '',
        capabilities: ['Autonomous Execution', '15-Min SLA'],
        activeWorkload: 0,
      };
      setFormData(defaultData);
      setCapabilitiesInput('Autonomous Execution, 15-Min SLA');
      setInitialSnapshot(JSON.stringify({ ...defaultData, caps: 'Autonomous Execution, 15-Min SLA' }));
    }
  }, [agent, isOpen]);

  const isDirty = useMemo(() => {
    if (!isOpen) return false;
    return Boolean(
      initialSnapshot &&
        JSON.stringify({ ...formData, caps: capabilitiesInput }) !== initialSnapshot
    );
  }, [isOpen, formData, capabilitiesInput, initialSnapshot]);

  const { showPrompt, proceed, cancel, confirmExit } = useDirtyStateGuard({
    isDirty,
    onConfirmDiscard: onClose,
  });

  if (!isOpen) return null;

  const handleDeptChange = (deptId: string) => {
    const match = AI_DEPARTMENTS_OPTIONS.find(d => d.id === deptId);
    setFormData(prev => ({
      ...prev,
      departmentId: deptId,
      department: match ? match.name.replace(/^DEPT-\d+\s*·\s*/, '') : prev.department,
    }));
  };

  const handleSaveData = (shouldClose: boolean) => {
    if (!formData.name.trim() || !formData.role.trim()) return;
    const caps = capabilitiesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    onSave({
      ...formData,
      capabilities: caps.length > 0 ? caps : ['Autonomous Execution'],
    });
    if (shouldClose) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveData(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm"
      data-testid="aiams-edit-drawer"
    >
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
                {agent ? `Edit Agent: ${agent.code}` : 'New AI Agent Registration'}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                {agent ? `Update ${agent.name}` : 'Register Autonomous AI Agent'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-testid="aiams-drawer-close-btn"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form id="aiams-agent-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agent Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Aria"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="aiams-input-name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agent ID / Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. sup_luxury_sales_10"
                  value={formData.agentId || ''}
                  onChange={e => setFormData(prev => ({ ...prev, agentId: e.target.value }))}
                  disabled={Boolean(agent)}
                  data-testid="aiams-input-id"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-red-500 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Role & Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Escrow & DLD Title Supervisor"
                  value={formData.role}
                  onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  data-testid="aiams-input-role"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agent Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI-SUP-109"
                  value={formData.code || ''}
                  onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  data-testid="aiams-input-code"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Corporate Department
                </label>
                <select
                  value={formData.departmentId || 'luxury_sales'}
                  onChange={e => handleDeptChange(e.target.value)}
                  data-testid="aiams-select-department"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  {AI_DEPARTMENTS_OPTIONS.filter(d => d.id !== 'all').map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Hierarchy Tier
                </label>
                <select
                  value={formData.tier}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, tier: e.target.value as AiAgentTier }))
                  }
                  data-testid="aiams-select-tier"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="EXECUTIVE">Executive Command (L0)</option>
                  <option value="MANAGER">Department Director AI (L1)</option>
                  <option value="SUPERVISOR">Operational Supervisor AI (L2)</option>
                  <option value="SPECIALIST">Autonomous Specialist AI</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Foundation LLM Model
                </label>
                <select
                  value={formData.model}
                  onChange={e => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  data-testid="aiams-select-model"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-red-500"
                >
                  {AI_MODELS_LIST.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Operational Status
                </label>
                <select
                  value={formData.status}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, status: e.target.value as AiAgentStatus }))
                  }
                  data-testid="aiams-select-status"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="OPTIMAL">OPTIMAL (99.8% SLA)</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="BUSY">BUSY (High Load)</option>
                  <option value="STANDBY">STANDBY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Specialty & Domain Mandate
              </label>
              <input
                type="text"
                placeholder="e.g. Automated Ejari Contract Verification & DLD Escrow Audit"
                value={formData.specialty || ''}
                onChange={e => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                data-testid="aiams-input-specialty"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                System Prompt / Autonomous Instructions
              </label>
              <textarea
                rows={3}
                placeholder="System instructions and statutory guardrails for this AI agent..."
                value={formData.systemPrompt || ''}
                onChange={e => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                data-testid="aiams-input-prompt"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Capabilities (Comma-Separated)
              </label>
              <input
                type="text"
                value={capabilitiesInput}
                onChange={e => setCapabilitiesInput(e.target.value)}
                data-testid="aiams-input-capabilities"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <TaskActionBar
            isDirty={isDirty}
            onSave={() => handleSaveData(false)}
            onSaveAndClose={() => handleSaveData(true)}
            onCancel={() => confirmExit(onClose)}
            saveLabel={agent ? 'Save Agent Changes' : 'Register AI Agent'}
            saveAndCloseLabel="Save & Close"
            saveTestId="aiams-submit-btn"
          />
        </div>
      </div>

      <UnsavedChangesModal
        isOpen={showPrompt}
        onProceed={proceed}
        onCancel={cancel}
      />
    </div>
  );
};
