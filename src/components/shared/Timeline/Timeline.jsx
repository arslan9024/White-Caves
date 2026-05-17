import React from 'react';
import { Check, Circle, Clock, AlertCircle } from 'lucide-react';
import './Timeline.css';

const Timeline = ({ 
  stages = [], 
  currentStage = null, 
  orientation = 'horizontal',
  showProgress = true,
  onStageClick = null,
  compact = false
}) => {
  const currentIndex = stages.findIndex(s => s.id === currentStage);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / stages.length) * 100 : 0;

  const getStageStatus = (stage, index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check size={compact ? 14 : 18} />;
      case 'current':
        return <Clock size={compact ? 14 : 18} />;
      case 'error':
        return <AlertCircle size={compact ? 14 : 18} />;
      default:
        return <Circle size={compact ? 14 : 18} />;
    }
  };

  return (
    <div className={`timeline-component ${orientation} ${compact ? 'compact' : ''}`}>
      {showProgress && orientation === 'horizontal' && (
        <div className="timeline-progress-bar">
          <div 
            className="timeline-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <div className="timeline-stages">
        {stages.map((stage, index) => {
          const status = stage.status || getStageStatus(stage, index);
          const isClickable = onStageClick && status !== 'pending';
          
          return (
            <div 
              key={stage.id}
              className={`timeline-stage ${status} ${isClickable ? 'clickable' : ''}`}
              onClick={() => isClickable && onStageClick(stage)}
            >
              <div className={`stage-indicator ${status}`}>
                {getStatusIcon(status)}
                {index < stages.length - 1 && orientation === 'horizontal' && (
                  <div className={`stage-connector ${status === 'completed' ? 'completed' : ''}`} />
                )}
              </div>
              
              <div className="stage-content">
                <span className="stage-name">{stage.name}</span>
                {!compact && stage.description && (
                  <span className="stage-description">{stage.description}</span>
                )}
                {!compact && stage.estimatedDuration && (
                  <span className="stage-duration">{stage.estimatedDuration}</span>
                )}
              </div>

              {orientation === 'vertical' && index < stages.length - 1 && (
                <div className={`vertical-connector ${status === 'completed' ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {showProgress && (
        <div className="timeline-summary">
          <span className="progress-text">
            {currentIndex + 1} of {stages.length} stages
          </span>
          <span className="progress-percentage">{Math.round(progress)}% complete</span>
        </div>
      )}
    </div>
  );
};

export default Timeline;
