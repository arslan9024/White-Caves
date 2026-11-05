/**
 * White Caves Real Estate LLC - Task Manager View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Pure View Layer)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { taskStyles as s } from './TaskManager.styles';
import { useTaskManager } from './TaskManager.logic';
import { TaskCard } from './TaskCard';
import { TaskEditDrawer } from './TaskEditDrawer';
import { TaskExecutionWorkbench } from './TaskExecutionWorkbench';
import type { TaskNode } from './TaskManager.types';

export interface TaskManagerViewProps {
  selectedTaskId?: string | null;
  onSelectTask?: (id: string) => void;
}

export const TaskManagerView: FC<TaskManagerViewProps> = ({ selectedTaskId, onSelectTask }) => {
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

  const [executingTask, setExecutingTask] = useState<TaskNode | null>(null);

  const SUPERVISOR_TARGETS = [
    { code: 'SUP-001', name: 'Tariq Mansoor' },
    { code: 'SUP-002', name: 'Fatima Zahra' },
    { code: 'SUP-003', name: 'Karim Bennani' },
    { code: 'SUP-008', name: 'Aisha Al-Falasi' },
  ];

  // Resolve active workbench task from prop or state
  const activeWorkbenchTask =
    executingTask ||
    (selectedTaskId
      ? filteredTasks.find(t => t.taskCode === selectedTaskId || t._id === selectedTaskId) || null
      : null);

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
          <span className={s.metricNumber}>{metrics.critical}</span>
          <span className={s.metricLabel}>Critical P0</span>
        </div>
        <div className={s.metricCard}>
          <span className={s.metricNumber}>{metrics.inProgress}</span>
          <span className={s.metricLabel}>In Progress</span>
        </div>
        <div className={s.metricCard}>
          <span className={s.metricNumber}>{metrics.review}</span>
          <span className={s.metricLabel}>Review</span>
        </div>
        <div className={s.metricCard}>
          <span className={s.metricNumber}>{metrics.completed}</span>
          <span className={s.metricLabel}>Completed</span>
        </div>
      </div>

      {/* ── 2. Filter & Controls Bar ────────────────────────────────────── */}
      <div className={s.controlsBar}>
        <div className={s.searchBox}>
          <span className={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search 200 tasks by code, title, authority, supervisor..."
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
            data-testid="pillar-filter-select"
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
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="STANDARD">Standard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className={s.filterSelect}
          >
            <option value="ALL">All Statuses</option>
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
            <TaskCard
              key={task._id}
              task={task}
              onOpenEdit={handleOpenEdit}
              onAdvanceStatus={handleAdvanceStatus}
              onExecuteTask={t => {
                setExecutingTask(t);
                onSelectTask?.(t.taskCode);
              }}
            />
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

      {/* ── 5. Atomic Task Execution Workbench ──────────────────────────── */}
      <TaskExecutionWorkbench
        task={activeWorkbenchTask}
        onClose={() => setExecutingTask(null)}
        onComplete={(taskId, xp) => handleAdvanceStatus(taskId, 'COMPLETED')}
      />
    </div>
  );
};
