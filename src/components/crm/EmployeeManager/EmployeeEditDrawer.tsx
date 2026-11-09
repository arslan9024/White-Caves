/**
 * EmployeeEditDrawer.tsx
 * 7-Category Architecture: View Layer (Sub-component)
 * Full CRUD Drawer form for hiring or updating employee profiles
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { EmployeeNode, RoleTier, EmployeeStatus } from './EmployeeManager.types';
import { PILLARS_7 } from './EmployeeManager.data';
import { useDirtyStateGuard } from '../../../hooks/useDirtyStateGuard';
import { UnsavedChangesModal, TaskActionBar } from '../../common/UnsavedChangesModal';

interface EmployeeEditDrawerProps {
  isOpen: boolean;
  employee: EmployeeNode | null;
  onClose: () => void;
  onSave: (payload: any) => void;
}

export const EmployeeEditDrawer: React.FC<EmployeeEditDrawerProps> = ({
  isOpen,
  employee,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<EmployeeNode>>({});
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  useEffect(() => {
    if (employee) {
      const snap = { ...employee };
      setFormData(snap);
      setInitialSnapshot(JSON.stringify(snap));
    } else {
      const defaultState: Partial<EmployeeNode> = {
        fullName: '',
        email: '',
        phone: '+971 ',
        designation: '',
        roleTier: 'SPECIALIST' as RoleTier,
        pillarId: 'pillar-4',
        pillarName: 'Pillar IV: Sales Operations & Brokerage',
        departmentName: 'Residential Sales & Leasing',
        supervisorName: 'Elena Rostova',
        reportingManager: 'Elena Rostova',
        status: 'active' as EmployeeStatus,
        baseSalaryAED: 15000,
        commissionRatePct: 20,
        skills: ['Dubai Real Estate'],
      };
      setFormData(defaultState);
      setInitialSnapshot(JSON.stringify(defaultState));
    }
  }, [employee, isOpen]);

  const isDirty = useMemo(() => {
    if (!isOpen) return false;
    return Boolean(initialSnapshot && JSON.stringify(formData) !== initialSnapshot);
  }, [isOpen, formData, initialSnapshot]);

  const { showPrompt, proceed, cancel, confirmExit } = useDirtyStateGuard({
    isDirty,
    onConfirmDiscard: onClose,
  });

  if (!isOpen) return null;

  const handleSaveData = (shouldClose: boolean) => {
    onSave(formData);
    if (shouldClose) {
      onClose();
    }
  };

  const handleChange = (field: keyof EmployeeNode, val: any) => {
    if (field === 'pillarId') {
      const p = PILLARS_7.find(item => item.id === val);
      setFormData(prev => ({
        ...prev,
        pillarId: val,
        pillarName: p ? p.name : prev.pillarName,
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveData(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {employee ? `Edit: ${employee.employeeCode}` : 'New Hire Registration'}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                {employee ? `Update ${employee.fullName}` : 'Onboard New Employee'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all text-xs"
            >
              ✕
            </button>
          </div>

          <form id="employee-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={e => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Designation Title
                </label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={e => handleChange('designation', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Operational Pillar
                </label>
                <select
                  value={formData.pillarId || 'pillar-4'}
                  onChange={e => handleChange('pillarId', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {PILLARS_7.filter(p => p.id !== 'all').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Role Hierarchy Tier
                </label>
                <select
                  value={formData.roleTier || 'SPECIALIST'}
                  onChange={e => handleChange('roleTier', e.target.value as RoleTier)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="EXECUTIVE">Executive / C-Suite (L0)</option>
                  <option value="DIRECTOR">Department Director (L1)</option>
                  <option value="MANAGER">Division Manager (L2)</option>
                  <option value="SUPERVISOR">Operational Supervisor (L3)</option>
                  <option value="SPECIALIST">Operations Specialist</option>
                  <option value="BROKER">Licensed Real Estate Broker</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  RERA Card / BRN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BRN-44120"
                  value={formData.reraCardNumber || ''}
                  onChange={e => handleChange('reraCardNumber', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'active'}
                  onChange={e => handleChange('status', e.target.value as EmployeeStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="active">Active (Full Access)</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="probation">Probation (3 Months)</option>
                  <option value="standby">Standby / Reserve Pool</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Base Salary (AED / Month)
                </label>
                <input
                  type="number"
                  value={formData.baseSalaryAED || 0}
                  onChange={e => handleChange('baseSalaryAED', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Commission Split (%)
                </label>
                <input
                  type="number"
                  value={formData.commissionRatePct || 0}
                  onChange={e => handleChange('commissionRatePct', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <TaskActionBar
            isDirty={isDirty}
            onSave={() => handleSaveData(false)}
            onSaveAndClose={() => handleSaveData(true)}
            onCancel={() => confirmExit(onClose)}
            saveLabel={employee ? 'Save Profile' : 'Complete Onboarding'}
            saveAndCloseLabel="Save & Close"
            saveTestId="save-employee-btn"
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
