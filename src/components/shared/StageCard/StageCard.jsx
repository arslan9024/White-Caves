import React from 'react';
import { Check, Clock, AlertCircle, ChevronRight, User, FileText } from 'lucide-react';
import './StageCard.css';

const StageCard = ({
  stage,
  status = 'pending',
  tasks = [],
  responsibleRole = null,
  documents = [],
  onAction = null,
  expanded = false,
  onToggle = null
}) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Check size={18} />;
      case 'in_progress':
        return <Clock size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div className={`stage-card ${status} ${expanded ? 'expanded' : ''}`}>
      <div className="stage-card-header" onClick={onToggle}>
        <div className={`status-badge ${status}`}>
          {getStatusIcon()}
        </div>
        
        <div className="stage-info">
          <h4 className="stage-title">{stage.name}</h4>
          {stage.description && (
            <p className="stage-desc">{stage.description}</p>
          )}
        </div>

        <div className="stage-meta">
          {tasks.length > 0 && (
            <span className="task-count">
              {completedTasks}/{tasks.length} tasks
            </span>
          )}
          {onToggle && (
            <ChevronRight 
              size={18} 
              className={`toggle-icon ${expanded ? 'rotated' : ''}`}
            />
          )}
        </div>
      </div>

      {expanded && (
        <div className="stage-card-body">
          {tasks.length > 0 && (
            <div className="tasks-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <ul className="task-list">
                {tasks.map((task, index) => (
                  <li 
                    key={task.id || index}
                    className={`task-item ${task.completed ? 'completed' : ''}`}
                  >
                    <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                      {task.completed && <Check size={12} />}
                    </div>
                    <span className="task-name">{task.name}</span>
                    {task.required && <span className="required-badge">Required</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {responsibleRole && (
            <div className="responsibility-section">
              <User size={14} />
              <span>Responsible: <strong>{responsibleRole}</strong></span>
            </div>
          )}

          {documents.length > 0 && (
            <div className="documents-section">
              <h5>Documents</h5>
              <ul className="document-list">
                {documents.map((doc, index) => (
                  <li key={index} className="document-item">
                    <FileText size={14} />
                    <span>{doc.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onAction && (
            <div className="stage-actions">
              <button 
                className="action-btn primary"
                onClick={() => onAction(stage)}
              >
                {status === 'completed' ? 'View Details' : 'Take Action'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StageCard;
