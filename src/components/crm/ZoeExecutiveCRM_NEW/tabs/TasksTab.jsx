import React from 'react';
import { CheckCircle, AlertCircle, Clock, Plus, Filter } from 'lucide-react';

const TasksTab = ({ tasks, filterStatus, onFilterChange }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="status-completed" />;
      case 'in_progress': return <Clock size={16} className="status-in-progress" />;
      case 'pending': return <AlertCircle size={16} className="status-pending" />;
      default: return <Clock size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);

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
        <button className="add-btn"><Plus size={16} /> New Task</button>
      </div>
      <div className="tasks-list">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-card ${task.priority}`}>
            <div className="task-checkbox">
              {getStatusIcon(task.status)}
            </div>
            <div className="task-content">
              <h4>{task.title}</h4>
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
