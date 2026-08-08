import React, { useState } from 'react';
import { useLeadsData } from '../hooks/useLeadsData';
import { getBatchSummaryLabel, prepareWorkBatches } from '../utils/taskBatching';

export default function TasksTab() {
  const { leads } = useLeadsData();
  const [showCompleted, setShowCompleted] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all'); // all, high, medium, low

  // Generate mock tasks from leads
  const tasks = leads.flatMap(lead => [
    {
      id: `task_${lead.id}_1`,
      leadId: lead.id,
      leadName: lead.name,
      title: lead.nextAction || 'Follow up with lead',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: `task_${lead.id}_2`,
      leadId: lead.id,
      leadName: lead.name,
      title: `Review ${lead.name} proposal`,
      priority: lead.status === 'qualified' ? 'high' : 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: `task_${lead.id}_3`,
      leadId: lead.id,
      leadName: lead.name,
      title: `Send contract to ${lead.name}`,
      priority: lead.stage === 'contract_review' ? 'high' : 'low',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: lead.stage === 'closed_won'
    }
  ]);

  // Filter and sort tasks
  let filteredTasks = tasks;

  if (!showCompleted) {
    filteredTasks = filteredTasks.filter(t => !t.completed);
  }

  if (taskFilter !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.priority === taskFilter);
  }

  filteredTasks.sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  const visibleTaskItems = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    priority: task.priority as 'critical' | 'high' | 'medium' | 'low',
    deadline: Math.ceil((task.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
    leadName: task.leadName,
    completed: task.completed,
    dueDate: task.dueDate
  }));

  const workBatches = prepareWorkBatches(visibleTaskItems, { maxBatchSize: 3 });

  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const formatDueDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="tasks-section">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
              Tasks & Actions
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              margin: '4px 0 0 0'
            }}>
              {tasks.length - completedCount} pending • {completionRate}% complete
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            padding: '12px',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--color-border-default)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              HIGH PRIORITY
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-danger)' }}>
              {tasks.filter(t => !t.completed && t.priority === 'high').length}
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--color-border-default)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              MEDIUM PRIORITY
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-warning)' }}>
              {tasks.filter(t => !t.completed && t.priority === 'medium').length}
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--color-border-default)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              LOW PRIORITY
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-success)' }}>
              {tasks.filter(t => !t.completed && t.priority === 'low').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select
          value={taskFilter}
          onChange={(e) => setTaskFilter(e.target.value)}
          className="filter-select"
          aria-label="Filter tasks by priority"
          title="Filter tasks by priority"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority Only</option>
          <option value="medium">Medium Priority Only</option>
          <option value="low">Low Priority Only</option>
        </select>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          style={{
            padding: '8px 12px',
            background: showCompleted ? 'var(--color-primary)' : 'var(--color-background-secondary)',
            color: showCompleted ? 'white' : 'var(--color-text-primary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          {showCompleted ? '👁️ Showing Completed' : '👁️ Hide Completed'}
        </button>
      </div>

      {/* Tasks List */}
      <div className="tasks-list">
        {visibleTaskItems.length > 0 ? (
          workBatches.map((batch, index) => (
            <div key={`${batch.priority}-${index}`} className="task-batch-card">
              <div className="task-batch-header">
                <span>{getBatchSummaryLabel(batch, index)}</span>
                <span className={`task-priority-badge ${batch.priority}`}>{batch.priority.toUpperCase()}</span>
              </div>
              <div className="task-batch-items">
                {batch.items.map(item => (
                  <div key={item.id} className={`task-item ${item.completed ? 'completed' : ''}`}>
                    <input type="checkbox" className="task-checkbox" defaultChecked={item.completed} aria-label={`Mark task "${item.title}" as complete`} />
                    <div className="task-content">
                      <div className="task-title">{item.title}</div>
                      <div className="task-description">→ {item.leadName}</div>
                      <div className="task-meta">
                        <span className={`task-priority ${item.priority}`}>
                          {item.priority.toUpperCase()}
                        </span>
                        <span className="task-due-date">
                          Due: {formatDueDate(item.dueDate as Date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border-default)'
          }}>
            <p style={{ fontSize: '14px', margin: 0 }}>
              {showCompleted ? 'All caught up!' : 'No pending tasks'}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--color-info-light)',
        color: 'var(--color-info)',
        borderRadius: 'var(--border-radius-md)',
        fontSize: '13px',
        marginTop: '16px'
      }}>
        ℹ️ {completedCount} task{completedCount !== 1 ? 's' : ''} completed out of {tasks.length}
      </div>

      <div style={{
        marginTop: '12px',
        padding: '12px 16px',
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--color-border-default)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
          WORK BATCHES
        </div>
        {workBatches.map((batch, index) => (
          <div key={`${batch.priority}-${index}`} style={{ marginBottom: index === workBatches.length - 1 ? 0 : '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {getBatchSummaryLabel(batch, index)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>
              {batch.items.map(item => item.title).join(' • ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
