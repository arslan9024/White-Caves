/**
 * White Caves Real Estate LLC - Task Card Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Card View Primitive)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Play } from 'lucide-react';
import { taskStyles as s } from './TaskManager.styles';
import type { TaskNode, TaskPriority, TaskStatus } from './TaskManager.types';

interface TaskCardProps {
  task: TaskNode;
  onOpenEdit: (task: TaskNode) => void;
  onAdvanceStatus: (id: string, newStatus: TaskStatus) => void;
  onExecuteTask: (task: TaskNode) => void;
}

export const TaskCard: FC<TaskCardProps> = ({
  task,
  onOpenEdit,
  onAdvanceStatus,
  onExecuteTask,
}) => {
  const getPriorityBadge = (p: TaskPriority) =>
    p === 'CRITICAL'
      ? s.priorityCritical
      : p === 'HIGH'
        ? s.priorityHigh
        : p === 'MEDIUM'
          ? s.priorityMedium
          : s.priorityStandard;

  const getStatusPill = (st: TaskStatus) =>
    st === 'PENDING'
      ? s.statusPending
      : st === 'IN_PROGRESS'
        ? s.statusProgress
        : st === 'REVIEW'
          ? s.statusReview
          : st === 'COMPLETED'
            ? s.statusCompleted
            : s.statusBlocked;

  const getNextStatus = (curr: TaskStatus): TaskStatus =>
    curr === 'PENDING'
      ? 'IN_PROGRESS'
      : curr === 'IN_PROGRESS'
        ? 'REVIEW'
        : curr === 'REVIEW'
          ? 'COMPLETED'
          : 'PENDING';

  const xpPoints =
    task.priority === 'CRITICAL'
      ? 135
      : task.priority === 'HIGH'
        ? 68
        : task.priority === 'MEDIUM'
          ? 34
          : 14;

  return (
    <div
      key={task._id}
      draggable={true}
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', task._id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className={s.taskCard}
      data-testid={`task-card-${task.taskCode}`}
    >
      <div>
        <div className={s.taskTop}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={s.codePill}>{task.taskCode}</span>
            {task.statutoryAuthority && (
              <span className={s.authorityPill}>{task.statutoryAuthority}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`${s.priorityBadge} ${getPriorityBadge(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`${s.statusPill} ${getStatusPill(task.status)}`}>{task.status}</span>
          </div>
        </div>

        <h3 className={s.taskTitle}>{task.title}</h3>
        <p className={s.taskDesc}>{task.description}</p>

        {/* Execution Triad: Actor • Action • Results */}
        <div
          className="my-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-1"
          data-testid={`task-triad-${task.taskCode}`}
        >
          <div>
            <span className="text-sky-400 font-bold">Actor: </span>
            <span className="text-slate-200 font-medium">{task.actor}</span>
          </div>
          <div>
            <span className="text-amber-400 font-bold">Action: </span>
            <span className="text-slate-300">{task.action}</span>
          </div>
          <div>
            <span className="text-emerald-400 font-bold">Results: </span>
            <span className="text-slate-400">{task.results}</span>
          </div>
        </div>

        {/* Bhakti 5-Tier Lineage Tag */}
        {task.lineage && (
          <div className="my-1.5 px-2 py-1 rounded bg-slate-950/70 border border-slate-800/60 flex items-center gap-1.5 text-[10px] font-mono text-amber-400/90 flex-wrap">
            <span className="text-slate-500 font-sans font-bold uppercase text-[9px]">
              Lineage:
            </span>
            <span className="px-1.5 py-0.2 rounded bg-red-950/40 text-red-400 border border-red-900/40 font-bold">
              {task.lineage.deptId}
            </span>
            <span className="text-slate-600">›</span>
            <span className="px-1.5 py-0.2 rounded bg-blue-950/40 text-blue-400 border border-blue-900/40 font-bold">
              {task.lineage.subDeptId}
            </span>
            <span className="text-slate-600">›</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-400 border border-amber-900/40 font-bold">
              {task.lineage.squadId}
            </span>
            <span className="text-slate-600">›</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 font-bold">
              {task.lineage.supervisorId}
            </span>
          </div>
        )}

        {/* Reporting Escalation Chain */}
        <div className={s.escalationCard}>
          <div className={s.escalationTitle}>
            <span>Reporting Chain</span>
            <span>L3 → L0</span>
          </div>
          <div className={s.escalationStep}>
            <span className={`${s.escalationBadge} ${s.l3Badge}`}>L3 Sup:</span>
            <span className="font-semibold text-slate-200">
              {task.reportingChain.supervisorName}
            </span>
          </div>
          <div className={s.escalationStep}>
            <span className={`${s.escalationBadge} ${s.l2Badge}`}>L2 Mgr:</span>
            <span className="text-slate-300">{task.reportingChain.managerName}</span>
          </div>
          <div className={s.escalationStep}>
            <span className={`${s.escalationBadge} ${s.l1Badge}`}>L1 Dir:</span>
            <span className="text-slate-300">{task.reportingChain.directorName}</span>
          </div>
          <div className={s.escalationStep}>
            <span className={`${s.escalationBadge} ${s.l0Badge}`}>L0 MD:</span>
            <span className="text-slate-400 font-mono text-[10px]">
              {task.reportingChain.executiveReviewer}
            </span>
          </div>
        </div>

        {/* SLA Telemetry & Merit XP Row */}
        <div className={s.slaRow}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>
              SLA: <strong className={s.slaPill}>{task.defaultSla}</strong>
            </span>
            {task.defaultSla.includes('2') || task.defaultSla.includes('4') ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                ⚡ &lt;4h Critical
              </span>
            ) : task.status === 'BLOCKED' ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                🚨 Escalate L2
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                🟢 On Schedule
              </span>
            )}
          </div>
          <span className="text-amber-400 font-mono font-bold text-[10px]">+{xpPoints} XP</span>
        </div>
      </div>

      <div className={s.cardFooter}>
        <button
          onClick={() => onExecuteTask(task)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
          title="Run Atomic Task Functional Execution (I-P-O-V)"
          data-testid={`run-task-${task.taskCode}`}
        >
          <Play size={11} fill="white" />
          <span>Run (δ)</span>
        </button>
        <button
          onClick={() => onOpenEdit(task)}
          className={s.actionBtn}
          data-testid={`edit-task-${task.taskCode}`}
        >
          <span>✏️</span>
          <span>Edit</span>
        </button>
        <button
          onClick={() => onAdvanceStatus(task._id, getNextStatus(task.status))}
          className={s.advanceBtn}
          data-testid={`advance-task-${task.taskCode}`}
        >
          <span>→ {getNextStatus(task.status)}</span>
        </button>
      </div>
    </div>
  );
};
