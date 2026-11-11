import React from 'react';
import { CheckCircle, AlertCircle, Clock, Plus } from 'lucide-react';

import React from 'react';
import { CheckCircle, AlertCircle, Clock, Plus, Bot, ShieldAlert } from 'lucide-react';

interface Task {
  id: string | number;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: string;
  dispatchedByZoe?: boolean;
  departmentCode?: string;
}

interface TasksTabProps {
  tasks: Task[];
  filterStatus: string;
  onFilterChange: (status: string) => void;
  onAddTask?: () => void;
}

const TasksTab = ({ tasks, filterStatus, onFilterChange, onAddTask }: TasksTabProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="status-completed" />;
      case 'in_progress': return <Clock size={16} className="status-in-progress" />;
      case 'pending': return <AlertCircle size={16} className="status-pending" />;
      default: return <Clock size={16} />;
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const filteredTasks =
    filterStatus === 'all'
      ? tasks
      : filterStatus === 'zoe_dispatched'
        ? tasks.filter(t => t.dispatchedByZoe)
        : tasks.filter(t => t.status === filterStatus);

  const zoeCount = tasks.filter(t => t.dispatchedByZoe).length;

  return (
    <div className="tasks-view">
      <div className="view-header">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All Tasks ({tasks.length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'zoe_dispatched' ? 'active' : ''}`}
            onClick={() => onFilterChange('zoe_dispatched')}
            data-testid="filter-zoe-dispatched-btn"
            style={{
              borderColor: filterStatus === 'zoe_dispatched' ? '#EF4444' : undefined,
              color: filterStatus === 'zoe_dispatched' ? '#EF4444' : undefined,
            }}
          >
            <Bot size={14} color="#EF4444" /> Zoe Dispatched ({zoeCount})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => onFilterChange('pending')}
          >
            <AlertCircle size={14} /> Pending
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'in_progress' ? 'active' : ''}`}
            onClick={() => onFilterChange('in_progress')}
          >
            <Clock size={14} /> In Progress
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            <CheckCircle size={14} /> Completed
          </button>
        </div>
        <button className="add-btn" onClick={onAddTask}><Plus size={16} /> New Task</button>
      </div>
      <div className="tasks-list">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-card ${task.priority}`}>
            <div className="task-checkbox">
              {getStatusIcon(task.status)}
            </div>
            <div className="task-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4>{task.title}</h4>
                {task.dispatchedByZoe && (
                  <span
                    data-testid="badge-zoe-dispatched"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#EF4444',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                    }}
                  >
                    <Bot size={10} /> AI Zoe SLA
                  </span>
                )}
              </div>
              <span className="due-date">Due: {task.dueDate}</span>
            </div>
            <div className="task-meta">
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
              <span className="assignee">{task.assignee}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksTab;
