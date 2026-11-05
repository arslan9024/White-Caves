/**
 * EmployeeOverviewView.tsx
 * White Caves Real Estate LLC - EMS Executive Overview for /dashboard/employees
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Bhakti Protocol Anchors
 */

import React, { FC } from 'react';
import { Users, UserCheck, Shield, Award, ArrowRight, UserPlus, Star } from 'lucide-react';
import { INITIAL_EMPLOYEES_SEED } from './EmployeeManager.data';

export interface EmployeeOverviewViewProps {
  onNavigate: (route: string) => void;
}

export const EmployeeOverviewView: FC<EmployeeOverviewViewProps> = ({ onNavigate }) => {
  const totalEmployees = INITIAL_EMPLOYEES_SEED.length;
  const directorsCount = INITIAL_EMPLOYEES_SEED.filter(
    e => e.roleTier === 'EXECUTIVE' || e.roleTier === 'DIRECTOR'
  ).length;
  const supervisorsCount = INITIAL_EMPLOYEES_SEED.filter(
    e => e.roleTier === 'SUPERVISOR' || e.roleTier === 'MANAGER'
  ).length;
  const totalMeritXp = INITIAL_EMPLOYEES_SEED.reduce(
    (acc, curr) => acc + (curr.merit_xp_count || 0),
    0
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="employee-overview-view">
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/30 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <Users size={15} /> System #2 · Employee Management System (EMS)
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Personnel Directory & Talent Operations Command
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          The unified human and AI autonomous workforce ledger of White Caves Real Estate LLC: 121
          registered personnel, role-based access control (RBAC), merit performance tracking, and
          squad supervisor leadership.
        </p>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Personnel</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {totalEmployees} <span className="text-xs text-slate-500">Staff</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">100% Active RBAC Verification</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Leadership / C-Suite</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {directorsCount} <span className="text-xs text-slate-500">Directors</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tier L0 / L1 Sovereign Roles</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Squad Supervisors</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {supervisorsCount} <span className="text-xs text-slate-500">Supervisors</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tier L2 / L3 Squad Leaders</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Merit XP Pool</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {totalMeritXp.toLocaleString()} <span className="text-xs text-slate-500">XP</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Accumulated Merit Points</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Layer 1: Personnel Roster */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase mb-2">
              <Users size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">
              Full Personnel Roster & Directory (CRUD)
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Inspect employee cards, onboard new talent, adjust department allocations, and update
              system privileges, compensation, and merit levels.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/employees/roster</code> & <code>/dashboard/employees/:empId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/employees/roster')}
            data-testid="navigate-to-emp-roster-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Open Personnel Roster Table</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Layer 2: Squad Supervisors & Leads */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
              <Shield size={16} /> Double-Layer Route 2
            </div>
            <h3 className="text-lg font-bold text-white">108 Squad Supervisors & Leaders</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Examine the front-line supervisors responsible for 9 sub-departments per corporate
              pillar, task SLA compliance, and regulatory filing dispatch.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/employees/supervisors</code> &{' '}
              <code>/dashboard/employees/directors</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/employees/supervisors')}
            data-testid="navigate-to-emp-supervisors-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Inspect Squad Supervisors</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4. Quick Access Employee Chips ──────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
          Key Personnel Direct Navigation (Sample Roster)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {INITIAL_EMPLOYEES_SEED.slice(0, 8).map(emp => (
            <button
              key={emp._id}
              onClick={() => onNavigate(`/dashboard/employees/${emp._id}`)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
            >
              <div className="truncate">
                <span className="text-[10px] font-mono text-blue-400 block font-bold">
                  {emp.employeeCode} · {emp.roleTier}
                </span>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate block">
                  {emp.fullName}
                </span>
              </div>
              <ArrowRight
                size={12}
                className="text-slate-600 group-hover:text-blue-400 shrink-0 ml-1 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeOverviewView;
