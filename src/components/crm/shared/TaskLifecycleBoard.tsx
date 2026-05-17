import React, { memo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  Clock,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  selectTasksByAssistant,
  selectNotificationsByAssistant,
  advanceTaskLifecycle,
  markAllNotificationsRead,
} from '../../../store/slices/aiAssistantDashboardSlice';
import type { Task, TaskLifecycleStage } from '../../../store/slices/aiAssistant/types';
import type { RootState } from '../../../store/store';
import TaskLifecyclePanel from './TaskLifecyclePanel';
import LifecycleNotificationFeed from './LifecycleNotificationFeed';
import NotificationBadge from './NotificationBadge';
import './TaskLifecycleBoard.css';

// ── Column config ─────────────────────────────────────────────────────────

interface ColumnDef {
  stages: TaskLifecycleStage[];
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  nextStage?: TaskLifecycleStage;
  nextLabel?: string;
}

const COLUMNS: ColumnDef[] = [
  {
    stages: ['created', 'queued'],
    label: 'Pending',
    icon: <Clock size={14} />,
    colorClass: 'col-pending',
    nextStage: 'in_progress',
    nextLabel: 'Start',
  },
  {
    stages: ['in_progress'],
    label: 'In Progress',
    icon: <Loader2 size={14} className="spin-slow" />,
    colorClass: 'col-inprogress',
    nextStage: 'pending_review',
    nextLabel: 'Submit for Review',
  },
  {
    stages: ['pending_review'],
    label: 'Pending Review',
    icon: <AlertTriangle size={14} />,
    colorClass: 'col-review',
    nextStage: 'completed',
    nextLabel: 'Approve',
  },
  {
    stages: ['completed'],
    label: 'Completed',
    icon: <CheckCircle size={14} />,
    colorClass: 'col-completed',
  },
  {
    stages: ['failed', 'cancelled'],
    label: 'Failed / Cancelled',
    icon: <XCircle size={14} />,
    colorClass: 'col-failed',
  },
];

// ── Task card ─────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  assistantId: string;
  color?: string;
  nextStage?: TaskLifecycleStage;
  nextLabel?: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const PRIORITY_COLOR: Record<string, string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

const TaskCard = memo(
  ({ task, assistantId, color, nextStage, nextLabel, isExpanded, onToggle }: TaskCardProps) => {
    const dispatch = useDispatch();

    const handleAdvance = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!nextStage) return;
        dispatch(advanceTaskLifecycle({ assistantId, taskId: task.id, stage: nextStage }));
      },
      [dispatch, assistantId, task.id, nextStage]
    );

    const priorityColor = PRIORITY_COLOR[task.priority] ?? '#94A3B8';

    return (
      <div className={`tlb-card ${isExpanded ? 'expanded' : ''}`}>
        {/* Card header — click to toggle lifecycle panel */}
        <button
          className="tlb-card-header"
          onClick={() => onToggle(task.id)}
          aria-expanded={isExpanded}
        >
          <div className="tlb-card-title-row">
            <span
              className="tlb-priority-dot"
              style={{ background: priorityColor }}
              title={`${task.priority} priority`}
            />
            <span className="tlb-card-title">{task.title}</span>
            {isExpanded ? (
              <ChevronDown size={13} className="tlb-chevron" />
            ) : (
              <ChevronRight size={13} className="tlb-chevron" />
            )}
          </div>
          <div className="tlb-card-meta">
            <span className="tlb-priority-badge" style={{ color: priorityColor }}>
              {task.priority}
            </span>
            {(task.actions?.length ?? 0) > 0 && (
              <span className="tlb-actions-count">
                {task.actions!.length} action{task.actions!.length !== 1 ? 's' : ''}
              </span>
            )}
            {task.assignedTo && <span className="tlb-assignee">→ {task.assignedTo}</span>}
          </div>
        </button>

        {/* Lifecycle panel (expanded) */}
        {isExpanded && (
          <div className="tlb-card-body">
            <TaskLifecyclePanel task={task} color={color} defaultExpanded />
          </div>
        )}

        {/* Advance button */}
        {nextStage && nextLabel && (
          <div className="tlb-card-footer">
            <button
              className="tlb-advance-btn"
              onClick={handleAdvance}
              style={{ '--btn-color': color } as React.CSSProperties}
            >
              <ArrowRight size={12} />
              {nextLabel}
            </button>
          </div>
        )}
      </div>
    );
  }
);
TaskCard.displayName = 'TaskCard';

// ── Board column ──────────────────────────────────────────────────────────

interface BoardColumnProps {
  column: ColumnDef;
  tasks: Task[];
  assistantId: string;
  color?: string;
  expandedTaskId: string | null;
  onToggleTask: (id: string) => void;
}

const BoardColumn = memo(
  ({ column, tasks, assistantId, color, expandedTaskId, onToggleTask }: BoardColumnProps) => (
    <div className={`tlb-column ${column.colorClass}`}>
      <div className="tlb-col-header">
        <span className="tlb-col-icon">{column.icon}</span>
        <span className="tlb-col-label">{column.label}</span>
        <span className="tlb-col-count">{tasks.length}</span>
      </div>
      <div className="tlb-col-body">
        {tasks.length === 0 ? (
          <div className="tlb-col-empty">
            <p>No tasks</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              assistantId={assistantId}
              color={color}
              nextStage={column.nextStage}
              nextLabel={column.nextLabel}
              isExpanded={expandedTaskId === task.id}
              onToggle={onToggleTask}
            />
          ))
        )}
      </div>
    </div>
  )
);
BoardColumn.displayName = 'BoardColumn';

// ── Main board ────────────────────────────────────────────────────────────

interface TaskLifecycleBoardProps {
  assistantId: string;
  /** Assistant accent color */
  color?: string;
  /** Show the notification feed panel alongside the board */
  showNotificationFeed?: boolean;
}

const TaskLifecycleBoard = memo(
  ({ assistantId, color = '#0EA5E9', showNotificationFeed = true }: TaskLifecycleBoardProps) => {
    const dispatch = useDispatch();
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [feedOpen, setFeedOpen] = useState(showNotificationFeed);

    const tasks = useSelector((state: RootState) => selectTasksByAssistant(assistantId)(state));
    const pendingCount = tasks.filter(t => {
      const stage = t.lifecycleStage ?? (t.status === 'in_progress' ? 'in_progress' : 'queued');
      return stage === 'created' || stage === 'queued';
    }).length;
    const inProgressCount = tasks.filter(t => {
      const stage = t.lifecycleStage ?? (t.status === 'in_progress' ? 'in_progress' : 'queued');
      return stage === 'in_progress';
    }).length;
    const completedCount = tasks.filter(t => {
      const stage = t.lifecycleStage ?? (t.status === 'in_progress' ? 'in_progress' : 'queued');
      return stage === 'completed';
    }).length;
    const notifications = useSelector((state: RootState) =>
      selectNotificationsByAssistant(assistantId)(state)
    );
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleToggleTask = useCallback((id: string) => {
      setExpandedTaskId(prev => (prev === id ? null : id));
    }, []);

    const handleMarkAllRead = useCallback(() => {
      dispatch(markAllNotificationsRead(assistantId));
    }, [dispatch, assistantId]);

    // Sort tasks into columns
    const columnTasks = COLUMNS.map(col =>
      tasks.filter(t => {
        const stage = t.lifecycleStage ?? (t.status === 'in_progress' ? 'in_progress' : 'queued');
        return col.stages.includes(stage as TaskLifecycleStage);
      })
    );

    return (
      <div
        className="task-lifecycle-board"
        style={{ '--tlb-accent': color } as React.CSSProperties}
      >
        {/* Board header */}
        <div className="tlb-header">
          <div className="tlb-header-title">
            <h3>Task Lifecycle Board</h3>
            <div className="tlb-summary-pills">
              <span className="tlb-pill pending">
                <Clock size={11} /> {pendingCount} pending
              </span>
              <span className="tlb-pill in-progress">
                <RefreshCw size={11} /> {inProgressCount} in progress
              </span>
              <span className="tlb-pill completed">
                <CheckCircle size={11} /> {completedCount} completed
              </span>
            </div>
          </div>
          <div className="tlb-header-actions">
            <button
              className={`tlb-notif-toggle ${feedOpen ? 'active' : ''}`}
              onClick={() => setFeedOpen(v => !v)}
              aria-label="Toggle notification feed"
              style={{ '--btn-color': color } as React.CSSProperties}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <NotificationBadge count={unreadCount} severity="critical" size="small" pulse />
              )}
            </button>
            {unreadCount > 0 && (
              <button
                className="tlb-mark-read-btn"
                onClick={handleMarkAllRead}
                aria-label="Mark all notifications as read"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="tlb-body">
          {/* Kanban columns */}
          <div className="tlb-columns">
            {COLUMNS.map((col, idx) => (
              <BoardColumn
                key={col.label}
                column={col}
                // eslint-disable-next-line security/detect-object-injection
                tasks={columnTasks[idx]}
                assistantId={assistantId}
                color={color}
                expandedTaskId={expandedTaskId}
                onToggleTask={handleToggleTask}
              />
            ))}
          </div>

          {/* Notification feed sidebar */}
          {feedOpen && (
            <div className="tlb-feed-panel">
              <LifecycleNotificationFeed assistantId={assistantId} color={color} />
            </div>
          )}
        </div>
      </div>
    );
  }
);

TaskLifecycleBoard.displayName = 'TaskLifecycleBoard';
export default TaskLifecycleBoard;
