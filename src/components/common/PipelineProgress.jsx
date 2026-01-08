import React from 'react';
import './PipelineProgress.css';

export default function PipelineProgress({ 
  stages, 
  currentStage,
  showValues = false,
  variant = 'horizontal',
  className = ''
}) {
  const currentIndex = stages.findIndex(s => 
    (typeof s === 'string' ? s : s.name) === currentStage
  );

  return (
    <div className={`pipeline-progress ${variant} ${className}`}>
      {stages.map((stage, index) => {
        const stageName = typeof stage === 'string' ? stage : stage.name;
        const stageValue = typeof stage === 'object' ? stage.value : null;
        const stageCount = typeof stage === 'object' ? stage.count : null;
        
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div 
            key={stageName}
            className={`pipeline-stage ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
          >
            <div className="stage-indicator">
              <span className="stage-dot">
                {isCompleted ? '✓' : index + 1}
              </span>
              {index < stages.length - 1 && <div className="stage-line" />}
            </div>
            <div className="stage-content">
              <span className="stage-name">{stageName}</span>
              {showValues && stageCount !== null && (
                <span className="stage-count">{stageCount}</span>
              )}
              {showValues && stageValue && (
                <span className="stage-value">{stageValue}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PipelineBoard({ stages, className = '' }) {
  return (
    <div className={`pipeline-board ${className}`}>
      {stages.map((stage, index) => (
        <div key={stage.name || index} className="pipeline-column">
          <div className="column-header">
            <span className="column-name">{stage.name}</span>
            {stage.count !== undefined && (
              <span className="column-count">{stage.count}</span>
            )}
          </div>
          {stage.value && (
            <div className="column-value">{stage.value}</div>
          )}
          {stage.items && stage.items.length > 0 && (
            <div className="column-items">
              {stage.items.map((item, itemIndex) => (
                <div key={item.id || itemIndex} className="pipeline-item">
                  <span className="item-name">{item.name || item.title}</span>
                  {item.value && <span className="item-value">{item.value}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function DealProgressBar({ progress, stage, className = '' }) {
  return (
    <div className={`deal-progress ${className}`}>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      {stage && <span className="progress-stage">{stage}</span>}
    </div>
  );
}
