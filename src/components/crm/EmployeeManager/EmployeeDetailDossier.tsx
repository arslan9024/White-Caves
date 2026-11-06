/**
 * EmployeeDetailDossier.tsx
 * 7-Category Architecture: Pure View Layer (Inline Employee Dossier)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ArrowLeft, Edit3, Award, Shield, User, DollarSign } from 'lucide-react';
import type { EmployeeNode } from './EmployeeManager.types';
import { employeeStyles as s } from './EmployeeManager.styles';

export interface EmployeeDetailDossierProps {
  employee: EmployeeNode;
  onBack?: () => void;
  onEdit: (emp: EmployeeNode) => void;
}

export const EmployeeDetailDossier: FC<EmployeeDetailDossierProps> = ({
  employee,
  onBack,
  onEdit,
}) => {
  return (
    <div data-testid="employee-detail-main-view" className="space-y-5">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          type="button"
          onClick={onBack}
          data-testid="employee-back-btn"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
        >
          <ArrowLeft size={15} />
          <span>← Back to Employee Directory</span>
        </button>
        <span className="font-mono text-xs text-slate-400 font-bold">
          Personnel Code · {employee.employeeCode}
        </span>
      </div>

      {/* Main Dossier Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-sky-500/30 flex items-center justify-center text-2xl font-black text-white">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{employee.fullName}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {employee.roleTier}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                  {employee.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">{employee.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEdit(employee)}
            data-testid="edit-emp-dossier-btn"
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Edit3 size={14} />
            <span>Edit Full Profile</span>
          </button>
        </div>

        {/* 4-Box Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">Merit Score</span>
            <span className="text-base font-bold text-emerald-400">
              {employee.merit_xp_count ?? 100} XP
            </span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">Base Salary & Comm.</span>
            <span className="text-base font-bold text-white">
              AED {employee.baseSalaryAED.toLocaleString()} ({employee.commissionRatePct}%)
            </span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">RERA Card</span>
            <span className="text-base font-bold text-amber-400">
              {employee.reraCardNumber || 'N/A'}
            </span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">Reporting Supervisor</span>
            <span className="text-base font-bold text-purple-400 truncate block">
              {employee.supervisorName}
            </span>
          </div>
        </div>

        {/* Pillar & Skills */}
        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Operational Pillar: <strong className="text-white">{employee.pillarName}</strong>
          </div>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
