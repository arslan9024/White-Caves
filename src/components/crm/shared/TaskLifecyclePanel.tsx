/* eslint-disable security/detect-object-injection */
import React, { memo, useState } from 'react';
import {
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronRight,
  User,
  Calendar,
  Zap,
  Flag,
} from 'lucide-react';
import type { Task, TaskLifecycleStage, TaskAction, TaskResult } from '../../../store/slices/aiAssistant/types';
import './TaskLifecyclePanel.css';

// ── Lifecycle stage configuration ──────────────────────────────────────────

interface StageConfig {
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  description: string;
}

const STAGE_CONFIG: Record<TaskLifecycleStage, StageConfig> = {
  created: {
    label: 'Created',
    icon: <Circle size={14} />,
    colorClass: 'stage-created',
    description: 'Task has been created and is waiting to be queued',
  },
  queued: {
    label: 'Queued',
    icon: <Clock size={14} />,
    colorClass: 'stage-queued',
    description: 'Task is in the queue, ready to be picked up',
  },
  in_progress: {
    label: 'In Progress',
    icon: <Loader2 size={14} className="spin" />,
    colorClass: 'stage-in-progress',
    description: 'Task is actively being worked on',
  },
  pending_review: {
    label: 'Pending Review',
    icon: <AlertTriangle size={14} />,
    colorClass: 'stage-pending-review',
    description: 'Task is awaiting review or approval',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle size={14} />,
    colorClass: 'stage-completed',
    description: 'Task has been successfully completed',
  },
  failed: {
    label: 'Failed',
    icon: <XCircle size={14} />,
    colorClass: 'stage-failed',
    description: 'Task could not be completed',
  },
  cancelled: {
    label: 'Cancelled',
    icon: <XCircle size={14} />,
    colorClass: 'stage-cancelled',
    description: 'Task has been cancelled',
  },
};

const ORDERED_STAGES: TaskLifecycleStage[] = [
  'created',
  'queued',
  'in_progress',
  'pending_review',
  'completed',
];

const TERMINAL_STAGES: TaskLifecycleStage[] = ['completed', 'failed', 'cancelled'];

function getStageIndex(stage?: TaskLifecycleStage): number {
  if (!stage) return -1;
  if (stage === 'failed' || stage === 'cancelled') return ORDERED_STAGES.length;
  return ORDERED_STAGES.indexOf(stage);
}

// ── Helper: format ISO timestamp ───────────────────────────────────────────
function formatTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-AE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── ActionRow ─────────────────────────────────────────────────────────────
interface ActionRowProps {
  action: TaskAction;
  isLast: boolean;
}

const ActionRow = memo(({ action, isLast }: ActionRowProps) => {
  const statusIcon =
    action.status === 'success' ? (
      <CheckCircle size={13} className="action-icon success" />
    ) : action.status === 'failed' ? (
      <XCircle size={13} className="action-icon failed" />
    ) : (
      <Clock size={13} className="action-icon pending" />
    );

  return (
    <div className={`action-row ${isLast ? 'last' : ''}`}>
      <div className="action-connector">
        <div className="action-dot">{statusIcon}</div>
        {!isLast && <div className="action-line" />}
      </div>
      <div className="action-body">
        <div className="action-header-row">
          <span className="action-type">{action.type}</span>
          <span className={`action-status-badge ${action.status}`}>{action.status}</span>
          <span className="action-time">{formatTime(action.timestamp)}</span>
        </div>
        <p className="action-description">{action.description}</p>
        <div className="action-meta">
          <User size={11} />
          <span>{action.actor}</span>
          {action.result && (
            <>
              <span className="meta-sep">·</span>
              <Zap size={11} />
              <span>{action.result}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
ActionRow.displayName = 'ActionRow';

// ── ResultCard ────────────────────────────────────────────────────────────
const ResultCard = memo(({ result }: { result: TaskResult }) => {
  const outcomeClass =
    result.outcome === 'success'
      ? 'outcome-success'
      : result.outcome === 'partial'
        ? 'outcome-partial'
        : 'outcome-failed';

  const outcomeLabel =
    result.outcome === 'success' ? '✓ Completed' :
    result.outcome === 'partial' ? '⚠ Partially completed' : '✗ Failed';

  return (
    <div className={`result-card ${outcomeClass}`}>
      <div className="result-header">
        <span className="result-outcome-label">{outcomeLabel}</span>
        <span className="result-time">
          <Calendar size={11} />
          {formatTime(result.completedAt)}
        </span>
      </div>
      <p className="result-summary">{result.summary}</p>
      {result.errorMessage && (
        <p className="result-error">
          <XCircle size={12} /> {result.errorMessage}
        </p>
      )}
      {result.metrics && Object.keys(result.metrics).length > 0 && (
        <div className="result-metrics">
          {Object.entries(result.metrics).map(([k, v]) => (
            <span key={k} className="result-metric-pill">
              {k}: <strong>{String(v)}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
ResultCard.displayName = 'ResultCard';

// ── TaskLifecyclePanel ────────────────────────────────────────────────────

interface TaskLifecyclePanelProps {
  task: Task;
  /** Assistant accent color */
  color?: string;
  /** Whether to start with the actions section expanded */
  defaultExpanded?: boolean;
}

const TaskLifecyclePanel = memo(({ task, color = '#0EA5E9', defaultExpanded = false }: TaskLifecyclePanelProps) => {
  const [actionsExpanded, setActionsExpanded] = useState(defaultExpanded);

  const currentStage = task.lifecycleStage ?? 'queued';
  const currentStageIdx = getStageIndex(currentStage);
  const isFailed = currentStage === 'failed';
  const isCancelled = currentStage === 'cancelled';
  const isTerminal = TERMINAL_STAGES.includes(currentStage);
  const actions = task.actions ?? [];

  const stagesToRender = ORDERED_STAGES;

  return (
    <div
      className="task-lifecycle-panel"
      style={{ '--lc-accent': color } as React.CSSProperties}
    >
      {/* ── Stage progress track ── */}
      <div className="lc-stage-track" role="list" aria-label="Task lifecycle stages">
        {stagesToRender.map((stage, idx) => {
          const cfg = STAGE_CONFIG[stage];
          const isDone = idx < currentStageIdx && !isFailed && !isCancelled;
          const isActive = stage === currentStage && !isFailed && !isCancelled;
          const isPast = idx < currentStageIdx;

          let stateClass = 'stage-future';
          if (isFailed && isPast) stateClass = 'stage-failed-path';
          else if (isDone) stateClass = 'stage-done';
          else if (isActive) stateClass = 'stage-active';

          return (
            <React.Fragment key={stage}>
              <div
                className={`lc-stage-node ${cfg.colorClass} ${stateClass}`}
                role="listitem"
                aria-current={isActive ? 'step' : undefined}
                title={cfg.description}
              >
                <div className="stage-icon">
                  {isDone ? <CheckCircle size={14} /> : cfg.icon}
                </div>
                <span className="stage-label">{cfg.label}</span>
              </div>
              {idx < stagesToRender.length - 1 && (
                <div className={`lc-stage-connector ${isPast && !isFailed ? 'filled' : ''}`} />
              )}
            </React.Fragment>
          );
        })}

        {/* Terminal badge for failed / cancelled */}
        {(isFailed || isCancelled) && (
          <>
            <div className="lc-stage-connector" />
            <div className={`lc-stage-node ${isFailed ? 'stage-failed' : 'stage-cancelled'} stage-active`}>
              <div className="stage-icon">
                <XCircle size={14} />
              </div>
              <span className="stage-label">{isFailed ? 'Failed' : 'Cancelled'}</span>
            </div>
          </>
        )}
      </div>

      {/* ── Stage meta ── */}
      <div className="lc-meta-row">
        <Flag size={12} />
        <span className="lc-meta-label">
          Current stage: <strong>{STAGE_CONFIG[currentStage]?.label ?? currentStage}</strong>
        </span>
        {task.startedAt && (
          <>
            <span className="meta-sep">·</span>
            <Clock size={12} />
            <span className="lc-meta-label">
              Started: <strong>{formatTime(task.startedAt)}</strong>
            </span>
          </>
        )}
        {isTerminal && task.completedAt && (
          <>
            <span className="meta-sep">·</span>
            <Calendar size={12} />
            <span className="lc-meta-label">
              {isFailed ? 'Failed' : 'Completed'}: <strong>{formatTime(task.completedAt)}</strong>
            </span>
          </>
        )}
      </div>

      {/* ── Actions audit log ── */}
      <div className="lc-section">
        <button
          className="lc-section-toggle"
          onClick={() => setActionsExpanded((v) => !v)}
          aria-expanded={actionsExpanded}
        >
          {actionsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span>Actions Log</span>
          <span className="lc-count-badge">{actions.length}</span>
        </button>

        {actionsExpanded && (
          <div className="lc-actions-list">
            {actions.length === 0 ? (
              <p className="lc-empty">No actions recorded yet.</p>
            ) : (
              actions.map((action, idx) => (
                <ActionRow key={action.id} action={action} isLast={idx === actions.length - 1} />
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Terminal result ── */}
      {task.result && (
        <div className="lc-section">
          <div className="lc-section-heading">Result</div>
          <ResultCard result={task.result} />
        </div>
      )}
    </div>
  );
});

TaskLifecyclePanel.displayName = 'TaskLifecyclePanel';
export default TaskLifecyclePanel;
