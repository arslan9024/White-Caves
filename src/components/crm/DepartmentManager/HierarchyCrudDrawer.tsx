/**
 * HierarchyCrudDrawer.tsx
 * 7-Category Architecture: Pure View Layer (Drawer Sub-component)
 * Modal/Drawer for editing and configuring 3-Tier Hierarchy Entities
 */

import React, { useState, useEffect } from 'react';
import type { HierarchyTier } from './DepartmentHierarchy.types';

interface HierarchyCrudDrawerProps {
  isOpen: boolean;
  tier: HierarchyTier | null;
  node: any | null;
  onClose: () => void;
  onSave: (updated: any) => void;
}

export const HierarchyCrudDrawer: React.FC<HierarchyCrudDrawerProps> = ({
  isOpen,
  tier,
  node,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (node) {
      setFormData({ ...node });
    } else {
      setFormData({});
    }
  }, [node]);

  if (!isOpen || !tier || !node) return null;

  const titleField = tier === 'DIRECTOR' ? 'title' : tier === 'MANAGER' ? 'title' : 'teamName';
  const nameField =
    tier === 'DIRECTOR' ? 'directorName' : tier === 'MANAGER' ? 'managerName' : 'supervisorName';
  const roleField =
    tier === 'DIRECTOR' ? 'directorRole' : tier === 'MANAGER' ? 'managerRole' : 'supervisorRole';

  const handleChange = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Tier: {tier}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                Configure {tier.toLowerCase()} node
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all text-xs"
            >
              ✕
            </button>
          </div>

          <form id="hierarchy-crud-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {tier === 'SUPERVISOR' ? 'Team Name' : 'Title / Mandate'}
              </label>
              <input
                type="text"
                value={formData[titleField] || ''}
                onChange={e => handleChange(titleField, e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {tier === 'DIRECTOR'
                  ? 'Director Name'
                  : tier === 'MANAGER'
                    ? 'Manager Name'
                    : 'Supervisor Name'}
              </label>
              <input
                type="text"
                value={formData[nameField] || ''}
                onChange={e => handleChange(nameField, e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role / Designation
              </label>
              <input
                type="text"
                value={formData[roleField] || ''}
                onChange={e => handleChange(roleField, e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description / Specialty
              </label>
              <textarea
                rows={3}
                value={formData.description || formData.specialty || ''}
                onChange={e => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {tier !== 'DIRECTOR' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  SLA Response Benchmark
                </label>
                <input
                  type="text"
                  value={formData.slaResponseTime || '< 15 mins'}
                  onChange={e => handleChange('slaResponseTime', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.status || 'optimal'}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="optimal">Optimal</option>
                <option value="active">Active</option>
                <option value="standby">Standby</option>
              </select>
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
            form="hierarchy-crud-form"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
