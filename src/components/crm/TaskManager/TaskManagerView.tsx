/**
 * TaskManagerView.tsx
 * 7-Category Architecture: Pure View Layer
 * Master 200+ Tasks Execution View with Hierarchical Escalation Chains
 */

import React from 'react';
import { taskStyles as s } from './TaskManager.styles';
import { useTaskManager } from './TaskManager.logic';
import { TaskEditDrawer } from './TaskEditDrawer';
import type { TaskPriority, TaskStatus } from './TaskManager.types';

export const TaskManagerView: React.FC = () => {
  const {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    selectedPillar,
    setSelectedPillar,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    statusToast,
    isDrawerOpen,
    editingTask,
    metrics,
    pillars,
    categories,
    handleCreateTask,
    handleUpdateTask,
    handleAdvanceStatus,
    handleReassignChain,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
  } = useTaskManager();

  const SUPERVISOR_TARGETS = [
    { code: 'SUP-001', name: 'Tariq Mansoor' },
    { code: 'SUP-002', name: 'Fatima Zahra' },
    { code: 'SUP-003', name: 'Karim Bennani' },
    { code: 'SUP-008', name: 'Aisha Al-Falasi' },
  ];

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

  return (
    <div className={s.container} data-testid="task-manager-view">
      {/* ── 1. Header & Metrics ─────────────────────────────────────────── */}
      <div className={s.headerWrapper}>
        <div className={s.headerLeft}>
          <div className={s.headerIcon}>📋</div>
          <div>
            <h1 className={s.headerTitle}>
              200+ Core Operational & Statutory Tasks Catalog
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                L3 → L2 → L1 → L0 Chain
              </span>
            </h1>
            <p className={s.headerSubtitle}>
              Statutory, compliance, financial, and brokerage execution tasks for White Caves Real
              Estate LLC
            </p>
          </div>
        </div>

        <button onClick={handleOpenCreate} className={s.addBtn} data-testid="add-task-btn">
          <span>+</span>
          <span>Register New Task</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className={s.metricsRow} data-testid="task-metrics-row">
        <div className={s.metricCard}>
          <span className={s.metricNumber}>{metrics.total}</span>
          <span className={s.metricLabel}>Total Tasks</span>
        </div>
        <div className={s.metricCard}>
          <span className={`${s.metricNumber} text-amber-400`}>{metrics.pending}</span>
          <span className={s.metricLabel}>Pending Backlog</span>
        </div>
        <div className={s.metricCard}>
          <span className={`${s.metricNumber} text-blue-400`}>{metrics.inProgress}</span>
          <span className={s.metricLabel}>In Execution</span>
        </div>
        <div className={s.metricCard}>
          <span className={`${s.metricNumber} text-purple-400`}>{metrics.review}</span>
          <span className={s.metricLabel}>Director Review</span>
        </div>
        <div className={s.metricCard}>
          <span className={`${s.metricNumber} text-emerald-400`}>{metrics.completed}</span>
          <span className={s.metricLabel}>Verified Complete</span>
        </div>
      </div>

      {/* ── 2. Filter & Controls Bar ────────────────────────────────────── */}
      <div className={s.controlsBar}>
        <div className={s.searchBox}>
          <span className={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by code (TSK-001), task title, authority (DLD, RERA), supervisor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={s.searchInput}
            data-testid="task-search-input"
          />
        </div>

        <div className={s.filterGroup}>
          <select
            value={selectedPillar}
            onChange={e => setSelectedPillar(e.target.value)}
            className={s.filterSelect}
            data-testid="filter-task-pillar"
          >
            {pillars.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className={s.filterSelect}
            data-testid="filter-task-category"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className={s.filterSelect}
            data-testid="filter-task-priority"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="STANDARD">Standard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className={s.filterSelect}
            data-testid="filter-task-status"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Under Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* ── 2.5 Supervisor Drag-and-Drop Reassignment Zone ── */}
      <div
        className="flex items-center gap-2 overflow-x-auto p-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
        data-testid="supervisor-drop-bar"
      >
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          🎯 Reassign L3:
        </span>
        {SUPERVISOR_TARGETS.map(sup => (
          <div
            key={sup.code}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const taskId = e.dataTransfer.getData('text/plain');
              const targetTask = filteredTasks.find(t => t._id === taskId);
              if (targetTask) {
                handleReassignChain(taskId, {
                  ...targetTask.reportingChain,
                  supervisorName: sup.name,
                  supervisorCode: sup.code,
                });
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
            title={`Drag any task card here to reassign to ${sup.name}`}
          >
            <span className="font-mono text-emerald-400 font-bold text-[10px]">{sup.code}</span>
            <span>{sup.name}</span>
          </div>
        ))}
      </div>

      {statusToast && (
        <div className={s.statusToast} data-testid="task-status-toast">
          <span>⚡</span>
          <span>{statusToast}</span>
        </div>
      )}

      {/* ── 3. Tasks Cards Grid (Showing Catalog of 200 Tasks) ──────────── */}
      <div className={s.tasksGrid} data-testid="tasks-cards-grid">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No statutory tasks found matching your filter criteria.
          </div>
        ) : (
          filteredTasks.slice(0, 60).map(task => (
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
                    <span className={`${s.statusPill} ${getStatusPill(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                <h3 className={s.taskTitle}>{task.title}</h3>
                <p className={s.taskDesc}>{task.description}</p>

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
                  <span className="text-amber-400 font-mono font-bold text-[10px]">
                    +
                    {task.priority === 'CRITICAL'
                      ? 135
                      : task.priority === 'HIGH'
                        ? 68
                        : task.priority === 'MEDIUM'
                          ? 34
                          : 14}{' '}
                    XP
                  </span>
                </div>
              </div>

              <div className={s.cardFooter}>
                <button
                  onClick={() => handleOpenEdit(task)}
                  className={s.actionBtn}
                  data-testid={`edit-task-${task.taskCode}`}
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleAdvanceStatus(task._id, getNextStatus(task.status))}
                  className={s.advanceBtn}
                  data-testid={`advance-task-${task.taskCode}`}
                >
                  <span>Advance Status → {getNextStatus(task.status)}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredTasks.length > 60 && (
        <div className="p-3 text-center text-xs text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
          Showing 60 of {filteredTasks.length} tasks in catalog. Use search or pillar filters to
          locate specific statutory tasks.
        </div>
      )}

      {/* ── 4. Task Edit / Create Drawer ────────────────────────────────── */}
      <TaskEditDrawer
        isOpen={isDrawerOpen}
        task={editingTask}
        onClose={handleCloseDrawer}
        onSave={payload => {
          if (editingTask) {
            handleUpdateTask(editingTask._id, payload);
          } else {
            handleCreateTask(payload);
          }
        }}
      />
    </div>
  );
};
