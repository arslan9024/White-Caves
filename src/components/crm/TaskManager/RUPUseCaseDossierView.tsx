/**
 * RUPUseCaseDossierView.tsx
 * White Caves Real Estate LLC - RUP Use Case Dossier Sub-View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer/Modal Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Bhakti 5-Tier Lineage & Rational Unified Process (RUP)
 */

import React, { FC, useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Layers,
  GitBranch,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import type { TaskNode, TaskHierarchyLineage } from './TaskManager.types';

interface RUPUseCaseDossierViewProps {
  task: TaskNode;
  onUpdateLineage?: (taskId: string, newLineage: Partial<TaskHierarchyLineage>) => void;
}

export const RUPUseCaseDossierView: FC<RUPUseCaseDossierViewProps> = ({
  task,
  onUpdateLineage,
}) => {
  const [isEditingLineage, setIsEditingLineage] = useState(false);
  const lineage = task.lineage || {
    deptId: 'DEPT-01',
    deptName: 'Executive & Architecture',
    directorId: 'DIR-01',
    subDeptId: 'SUB-01',
    subDeptName: 'Executive Strategy',
    managerId: 'MGR-01',
    squadId: 'SQD-01',
    squadName: 'Core Operations',
    supervisorId: 'SUP-01',
    teamId: 'TEAM-01',
    isUnassignedPool: false,
  };

  const useCase = task.useCase || {
    useCaseId: `UC-${task.taskCode}`,
    primaryActor: 'Managing Director Arslan Malik Bashir Ahmad (EMP-001)',
    secondaryActors: [task.statutoryAuthority || 'Dubai Land Department (DLD)'],
    preconditions: [
      'Actor authenticated with L0 / Managing Director sovereign clearance',
      `Entity data verified under ${task.statutoryAuthority || 'White Caves Quality Standards'}`,
    ],
    trigger: `Operational execution dispatched for task ${task.taskCode}: ${task.title}`,
    mainSuccessScenario: {
      input: `Input parameters collected and verified for ${task.taskCode}`,
      processing: `Algorithmic rule execution and compliance checks against Dubai RERA Law`,
      output: `Statutory compliance certificate and authenticated ledger artifact generated`,
      persistence: `Transaction committed to sovereign ledger with Merit XP increment`,
    },
    postconditions: [
      'Task status transitioned to COMPLETED with cryptographic hash',
      'Telemetry emitted to real-time Right Sidebar stream',
    ],
    statutoryMandate: task.statutoryAuthority
      ? `${task.statutoryAuthority} Mandatory Compliance Regulation`
      : 'White Caves Standard Operating Procedure',
  };

  return (
    <div
      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4"
      data-testid="rup-usecase-dossier"
    >
      {/* Top Bar: Use Case Code & Primary Actor */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {useCase.useCaseId}
          </span>
          <span className="text-xs font-bold text-white">
            Rational Unified Process (RUP) Specification
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <UserCheck size={13} className="text-emerald-400" />
          <span className="font-semibold text-slate-200">Actor:</span>
          <span className="text-emerald-400 font-mono text-[11px]">{useCase.primaryActor}</span>
        </div>
      </div>

      {/* Bhakti 5-Tier Lineage Breadcrumb */}
      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Layers size={11} className="text-amber-400" /> Bhakti 5-Tier Lineage Tags
          </span>
          <button
            type="button"
            onClick={() => setIsEditingLineage(!isEditingLineage)}
            className="text-[10px] text-sky-400 hover:text-sky-300 font-medium"
          >
            {isEditingLineage ? 'Done' : '⚡ Reassign Lineage'}
          </button>
        </div>

        {/* Visual Lineage Flow */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-bold">
            {lineage.deptId}
          </span>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/40 font-bold">
            {lineage.subDeptId}
          </span>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40 font-bold">
            {lineage.squadId}
          </span>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
            {lineage.supervisorId}
          </span>
          {lineage.teamId && (
            <>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/40">
                {lineage.teamId}
              </span>
            </>
          )}
        </div>

        {/* Fast Reassignment Selector Dropdown */}
        {isEditingLineage && (
          <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Department</label>
              <select
                value={lineage.deptId}
                onChange={e => onUpdateLineage?.(task._id, { deptId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
              >
                {Array.from({ length: 12 }, (_, i) => `DEPT-${String(i + 1).padStart(2, '0')}`).map(
                  id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Sub-Department</label>
              <select
                value={lineage.subDeptId}
                onChange={e => onUpdateLineage?.(task._id, { subDeptId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
              >
                {Array.from({ length: 9 }, (_, i) => `SUB-${String(i + 1).padStart(2, '0')}`).map(
                  id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Squad</label>
              <select
                value={lineage.squadId}
                onChange={e => onUpdateLineage?.(task._id, { squadId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
              >
                {Array.from({ length: 12 }, (_, i) => `SQD-${String(i + 1).padStart(2, '0')}`).map(
                  id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Supervisor</label>
              <select
                value={lineage.supervisorId}
                onChange={e => onUpdateLineage?.(task._id, { supervisorId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
              >
                {Array.from({ length: 12 }, (_, i) => `SUP-${String(i + 1).padStart(2, '0')}`).map(
                  id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* RUP Journey: Input -> Processing -> Output -> Persistence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
            <CheckCircle2 size={11} /> 1. Input Phase
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {useCase.mainSuccessScenario.input}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
            <GitBranch size={11} /> 2. Processing Phase
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {useCase.mainSuccessScenario.processing}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck size={11} /> 3. Output Phase
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {useCase.mainSuccessScenario.output}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
            <Layers size={11} /> 4. Persistence Phase
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {useCase.mainSuccessScenario.persistence}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RUPUseCaseDossierView;
