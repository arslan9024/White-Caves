/**
 * DepartmentOverviewView.tsx
 * White Caves Real Estate LLC - DMS Executive Overview for /dashboard/departments
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Bhakti Protocol Anchors
 */

import React, { FC } from 'react';
import { Building2, Layers, ShieldCheck, Users, ArrowRight, Grid, Award } from 'lucide-react';
import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
} from '../../../data/assistants108Registry.data';

export interface DepartmentOverviewViewProps {
  onNavigate: (route: string) => void;
}

export const DepartmentOverviewView: FC<DepartmentOverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="department-overview-view">
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/30 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <Building2 size={15} /> System #1 · Department Management System (DMS)
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Corporate Hierarchy & Departmental Matrix
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          The sovereign structural foundation of White Caves Real Estate LLC: 12 corporate director
          slots, 108 operational squads (9 per department), 7 strategic governance pillars, and
          continuous drag-and-drop slot reallocation.
        </p>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-red-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Corporate Slots</div>
          <div className="text-2xl font-black text-red-400 mt-1">
            {CORPORATE_DEPARTMENTS_12.length} <span className="text-xs text-slate-500">Fixed</span>
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
            12 <span className="text-xs text-slate-500">Leaders</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">C-Level Autopilot Agents</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Layer 1: Corporate Slots & Hierarchy */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase mb-2">
              <Grid size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">12 Corporate Slots & Hierarchy (CRUD)</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Manage the 12 corporate department slots, execute drag-and-drop slot reallocations,
              edit director assignments, and inspect sub-department squads with full CRUD
              permissions.
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

        {/* Layer 2: 7 Governance Pillars */}
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

      {/* ── 4. Quick Access Department Chips ────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
          Direct Department Deep Navigation ({CORPORATE_DEPARTMENTS_12.length} Corporate Slots)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {CORPORATE_DEPARTMENTS_12.map((dept, idx) => (
            <button
              key={dept.id}
              onClick={() => onNavigate(`/dashboard/departments/${dept.id}`)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
            >
              <div className="truncate">
                <span className="text-[10px] font-mono text-red-400 block font-bold">
                  SLOT #{idx + 1} · {dept.id.toUpperCase()}
                </span>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate block">
                  {dept.name}
                </span>
              </div>
              <ArrowRight
                size={12}
                className="text-slate-600 group-hover:text-red-400 shrink-0 ml-1 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentOverviewView;
