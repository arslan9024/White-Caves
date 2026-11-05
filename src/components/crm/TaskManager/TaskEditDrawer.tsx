/**
 * TaskEditDrawer.tsx
 * 7-Category Architecture: View Layer (Sub-component)
 * Full CRUD Drawer form for creating or configuring statutory & operational tasks
 */

import React, { useState, useEffect } from 'react';
import type { TaskNode, TaskPriority, TaskStatus } from './TaskManager.types';
import { TASK_PILLARS, TASK_CATEGORIES } from './TaskManager.data';

interface TaskEditDrawerProps {
  isOpen: boolean;
  task: TaskNode | null;
  onClose: () => void;
  onSave: (payload: any) => void;
}

export const TaskEditDrawer: React.FC<TaskEditDrawerProps> = ({
  isOpen,
  task,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<TaskNode>>({});

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else {
      setFormData({
        title: '',
        pillarId: 'pillar-1',
        pillarName: 'Pillar I: Legal & Regulatory',
        category: 'REGULATORY',
        statutoryAuthority: 'DLD / RERA',
        description: '',
        priority: 'HIGH' as TaskPriority,
        status: 'PENDING' as TaskStatus,
        defaultSla: '4 Hours',
        reportingChain: {
          supervisorName: 'Supervisor Amira',
          supervisorCode: 'SUP-01',
          managerName: 'Manager Farooq',
          managerCode: 'MGR-01',
          directorName: 'Adv. Tariq Mansoor',
          directorCode: 'DIR-01',
          executiveReviewer: 'Sophia Al-Hashemi (Managing Director)',
        },
      });
    }
  }, [task]);

  if (!isOpen) return null;

  const handleChange = (field: keyof TaskNode, val: any) => {
    if (field === 'pillarId') {
      const p = TASK_PILLARS.find(item => item.id === val);
      setFormData(prev => ({ ...prev, pillarId: val, pillarName: p ? p.name : prev.pillarName }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleChainChange = (chainField: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      reportingChain: {
        ...(prev.reportingChain || {
          supervisorName: '',
          supervisorCode: 'SUP-01',
          managerName: '',
          managerCode: 'MGR-01',
          directorName: '',
          directorCode: 'DIR-01',
          executiveReviewer: 'Sophia Al-Hashemi (MD)',
        }),
        [chainField]: val,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {task ? `Configure: ${task.taskCode}` : 'New Operational Task'}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                {task ? task.title : 'Register New Dubai Statutory Task'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all text-xs"
            >
              ✕
            </button>
          </div>

          <form id="task-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="e.g. Verify RERA Broker Card Active Status"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Operational Pillar
                </label>
                <select
                  value={formData.pillarId || 'pillar-1'}
                  onChange={e => handleChange('pillarId', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {TASK_PILLARS.filter(p => p.id !== 'all').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category || 'REGULATORY'}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {TASK_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Statutory Authority
                </label>
                <input
                  type="text"
                  value={formData.statutoryAuthority || ''}
                  onChange={e => handleChange('statutoryAuthority', e.target.value)}
                  placeholder="e.g. DLD, RERA, FTA, DET"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Target SLA Benchmark
                </label>
                <input
                  type="text"
                  value={formData.defaultSla || '24 Hours'}
                  onChange={e => handleChange('defaultSla', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority || 'HIGH'}
                  onChange={e => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="CRITICAL">Critical (Immediate SLA)</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="STANDARD">Standard Operational</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'PENDING'}
                  onChange={e => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="PENDING">Pending (Backlog)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Under Review</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="BLOCKED">Blocked (Escalated)</option>
                </select>
              </div>
            </div>

            {/* Reporting Chain Escalation Fields */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mt-1 flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Hierarchy Reporting Chain (L3 → L2 → L1 → L0)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400">
                    Supervisor (L3 Execution)
                  </label>
                  <input
                    type="text"
                    value={formData.reportingChain?.supervisorName || ''}
                    onChange={e => handleChainChange('supervisorName', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">
                    Division Manager (L2 Review)
                  </label>
                  <input
                    type="text"
                    value={formData.reportingChain?.managerName || ''}
                    onChange={e => handleChainChange('managerName', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400">
                    Pillar Director (L1 Sign-off)
                  </label>
                  <input
                    type="text"
                    value={formData.reportingChain?.directorName || ''}
                    onChange={e => handleChainChange('directorName', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">
                    Executive Reviewer (L0 Sovereign)
                  </label>
                  <input
                    type="text"
                    value={formData.reportingChain?.executiveReviewer || 'Sophia Al-Hashemi (MD)'}
                    onChange={e => handleChainChange('executiveReviewer', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-edit-form"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
          >
            {task ? 'Save Task' : 'Register Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
