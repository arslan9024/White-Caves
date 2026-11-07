/**
 * DepartmentOverviewView.tsx
 * White Caves Real Estate LLC - DMS Executive Overview & 12-Department Quick Finalizer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Bhakti Protocol Anchors
 */

import React, { FC, useState } from 'react';
import {
  Building2,
  Layers,
  ArrowRight,
  Grid,
  Edit2,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { SUPERVISORS_108 } from '../../../data/assistants108Registry.data';
import { useCorporateDepartments } from '../../../context/CorporateDepartmentsContext';

export interface DepartmentOverviewViewProps {
  onNavigate: (route: string) => void;
}

export const DepartmentOverviewView: FC<DepartmentOverviewViewProps> = ({ onNavigate }) => {
  const { slots, departments, handleInlineRename, handleResetDefaults } =
    useCorporateDepartments();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string>('');

  const startInlineEdit = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setDraftName(currentTitle);
  };

  const saveInlineEdit = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (draftName.trim()) {
      handleInlineRename(id, draftName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="department-overview-view">
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/30 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 size={15} /> System #1 · Department Management System (DMS)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Corporate Hierarchy & 12-Department Finalizer
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
            Configure, rename, and finalize the 12 corporate department slots, 108 operational
            squads (9 per department), and strategic governance pillars.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset 12 Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/departments/slots')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg cursor-pointer"
          >
            <span>Open Full 12-Department CRUD Matrix</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-red-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Corporate Slots</div>
          <div className="text-2xl font-black text-red-400 mt-1">
            {departments.length} / 12 <span className="text-xs text-slate-500">Fixed</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">12 C-Suite Director Seats</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Sub-Departments</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {SUPERVISORS_108.length} <span className="text-xs text-slate-500">Squads</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">9 Squads per Corporate Slot</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Governance Pillars</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            7 <span className="text-xs text-slate-500">Pillars</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">AEGIS Architecture Standard</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Active Directors</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {departments.length} <span className="text-xs text-slate-500">Leaders</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">C-Level Autopilot Agents</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase mb-2">
              <Grid size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">12 Corporate Slots & Hierarchy (CRUD)</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Manage the 12 corporate department slots, finalize all 12 department names in the
              Finalizer Table or Grid Matrix, edit director assignments, and inspect sub-department
              squads.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/departments/slots</code> &{' '}
              <code>/dashboard/departments/:deptId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/departments/slots')}
            data-testid="navigate-to-dept-slots-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Open Slots & Hierarchy Workspace</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase mb-2">
              <Layers size={16} /> Double-Layer Route 2
            </div>
            <h3 className="text-lg font-bold text-white">7 Corporate Governance Pillars</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Explore the strategic alignment across Luxury Sales, Leasing, Compliance & Legal,
              Finance, Technology, Operations, and Marketing pillars.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/departments/pillars</code> &{' '}
              <code>/dashboard/departments/pillars/:pillarId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/departments/pillars')}
            data-testid="navigate-to-dept-pillars-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Inspect Governance Pillars</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4. Interactive 12-Department Quick Rename & Deep Navigation Grid ── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
            12 Corporate Department Slots — Quick Rename & Direct Navigation ({slots.length} Slots)
          </h4>
          <span className="text-[11px] text-slate-400">
            Click <Edit2 size={11} className="inline text-red-400" /> on any slot to rename inline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map(slot => {
            const dept = slot.dept;
            const isEditing = dept && editingId === dept._id;

            return (
              <div
                key={slot.fixedCode}
                onClick={() => {
                  if (!isEditing) {
                    onNavigate(
                      dept
                        ? `/dashboard/departments/${dept.code || dept.slug}`
                        : '/dashboard/departments/slots'
                    );
                  }
                }}
                className="flex flex-col justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
                data-testid={`overview-slot-card-${slot.slotNumber}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-red-400 font-bold">
                    SLOT #{String(slot.slotNumber).padStart(2, '0')} · {dept?.code || slot.fixedCode}
                  </span>
                  {dept && !isEditing && (
                    <button
                      type="button"
                      onClick={e => startInlineEdit(e, dept._id, dept.title)}
                      title="Quick Rename Department"
                      data-testid={`overview-rename-btn-${slot.slotNumber}`}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>

                {isEditing && dept ? (
                  <div
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 my-1"
                  >
                    <input
                      type="text"
                      value={draftName}
                      onChange={e => setDraftName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveInlineEdit(e, dept._id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      data-testid={`overview-rename-input-${slot.slotNumber}`}
                      className="flex-1 bg-slate-900 border border-red-500 rounded px-2 py-1 text-xs text-white font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={e => saveInlineEdit(e, dept._id)}
                      className="p-1 rounded bg-emerald-600 text-white"
                      title="Save"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="p-1 rounded bg-slate-800 text-slate-300"
                      title="Cancel"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate block">
                      {dept ? dept.title : `Empty Slot #${slot.slotNumber}`}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-slate-600 group-hover:text-red-400 shrink-0 transition-colors"
                    />
                  </div>
                )}

                {dept?.directorOrManagerId?.fullName && (
                  <span className="text-[10px] text-slate-500 mt-1 truncate block">
                    Lead: {dept.directorOrManagerId.fullName}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepartmentOverviewView;
