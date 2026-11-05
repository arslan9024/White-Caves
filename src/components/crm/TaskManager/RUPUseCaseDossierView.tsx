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
    operatorRoleId: 'OPERATOR',
    isUnassignedPool: false,
  };

  const useCase = task.useCase || {
    useCaseId: `UC-${task.taskCode}`,
    primaryActor: task.actor || 'L3 Operational Supervisor',
    executingUser:
      'Managing Director Arslan Malik Bashir Ahmad (EMP-001) [Sovereign Execution Clearance]',
    secondaryActors: [
      {
        name: task.statutoryAuthority
          ? `${task.statutoryAuthority} REST API`
          : 'Dubai Land Department (DLD) Gateway',
        role: 'Statutory Registry & Compliance Attestation',
      },
      {
        name: 'UAE Federal Tax Authority (FTA) EmaraTax',
        role: '5% VAT Audit & TRN Verification',
      },
    ],
    preconditions: [
      'Actor authenticated with required RBAC clearance (or Managing Director Sovereign Clearance)',
      `Database entity reference verified (${task.pillarName || 'Real Estate Asset'} / Transaction UID)`,
    ],
    trigger: `Dispatch dispatched for ${task.taskCode}: ${task.title}`,
    mainSuccessScenario: {
      input: `Input parameters collected: Reference UID, Transaction Value AED, Statutory Cert No.`,
      processing: `Algorithmic rule execution and compliance checks against Dubai RERA / FTA Executive Law`,
      output: `Statutory PDF artifact, Ejari certificate, or cryptographically verified receipt generated`,
      persistence: `Transaction committed to ledger with cryptographic hash and Merit XP incremented`,
    },
    postconditions: [
      'Entity state shifted to next pipeline stage; telemetry emitted to Right Sidebar stream',
    ],
    statutoryMandate: task.statutoryAuthority
      ? `${task.statutoryAuthority} Mandatory Compliance Regulation`
      : 'DLD Law No. 7 / RERA Regulation No. 26 / FTA VAT Executive Law',
  };

  const executingUser =
    useCase.executingUser ||
    'Managing Director Arslan Malik Bashir Ahmad (EMP-001) [Sovereign Execution Clearance]';

  const secondaryActorsList = (useCase.secondaryActors || []).map(sec =>
    typeof sec === 'string' ? { name: sec, role: 'Statutory Integration Partner' } : sec
  );

  return (
    <div
      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4"
      data-testid="rup-usecase-dossier"
    >
      {/* Top Bar: Use Case Code, Primary Actor Role & Active Executor */}
      <div className="flex flex-col gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {useCase.useCaseId}
            </span>
            <span className="text-xs font-bold text-white">
              Rational Unified Process (RUP) Specification
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <UserCheck size={13} className="text-amber-400" />
            <span className="text-slate-400 text-[11px]">Primary Actor Role:</span>
            <span className="text-amber-300 font-mono font-bold text-[11px]">
              {useCase.primaryActor}
            </span>
          </div>
        </div>

        {/* Sovereign Active Human Executor */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px]">
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck size={13} /> Active Sovereign Executor:
          </span>
          <span className="text-emerald-300 font-mono font-medium">{executingUser}</span>
        </div>
      </div>

      {/* Bhakti 5-Tier Lineage Breadcrumb (Entity & Role Paired) */}
      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Layers size={11} className="text-amber-400" /> Bhakti 5-Tier Lineage (Entity & Role
            Paired)
          </span>
          <button
            type="button"
            onClick={() => setIsEditingLineage(!isEditingLineage)}
            className="text-[10px] text-sky-400 hover:text-sky-300 font-medium"
          >
            {isEditingLineage ? 'Done' : '⚡ Reassign Lineage'}
          </button>
        </div>

        {/* Visual Lineage Flow: Entity & Role Paired */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
          <span
            className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/50 font-bold"
            title="Department Entity & Appointed Director Role"
          >
            [Entity: {lineage.deptId} | Role: {lineage.directorId || 'DIR-01'}]
          </span>
          <ChevronRight size={12} className="text-slate-600" />
          <span
            className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50 font-bold"
            title="Sub-Department Entity & Appointed Manager Role"
          >
            [Entity: {lineage.subDeptId} | Role: {lineage.managerId || 'MGR-01'}]
          </span>
          <ChevronRight size={12} className="text-slate-600" />
          <span
            className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 font-bold"
            title="Squad Entity & Appointed Supervisor Role"
          >
            [Entity: {lineage.squadId} | Role: {lineage.supervisorId || 'SUP-01'}]
          </span>
          {lineage.teamId && (
            <>
              <ChevronRight size={12} className="text-slate-600" />
              <span
                className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50"
                title="Team Entity & Operator Role"
              >
                [Entity: {lineage.teamId} | Role: {lineage.operatorRoleId || 'OPERATOR'}]
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

      {/* Pre-conditions & Secondary Actors Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/60 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            🔒 Pre-Conditions
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
            {useCase.preconditions.map((pre, idx) => (
              <li key={idx}>{pre}</li>
            ))}
          </ul>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/60 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            🌐 Secondary Actors (Statutory & External)
          </span>
          <div className="space-y-1">
            {secondaryActorsList.map((sec, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-200 font-medium">{sec.name}:</span>
                <span className="text-slate-400 text-[10px] font-mono">{sec.role}</span>
              </div>
            ))}
          </div>
        </div>
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

      {/* Statutory Compliance Footer */}
      {useCase.statutoryMandate && (
        <div className="p-2 rounded bg-slate-900/40 border border-slate-800/40 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Statutory Compliance Mandate:</span>
          <span className="text-amber-400 font-mono font-medium">{useCase.statutoryMandate}</span>
        </div>
      )}
    </div>
  );
};

export default RUPUseCaseDossierView;
