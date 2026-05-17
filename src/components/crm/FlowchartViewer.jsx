import React, { useState } from 'react';
import { Check, Clock, ArrowRight } from 'lucide-react';
import './FlowchartViewer.css';

const FlowchartViewer = ({
  stages = [],
  currentStage = null,
  onStageClick,
  orientation = 'horizontal',
  interactive = true,
  showActions = true
}) => {
  const [expandedStage, setExpandedStage] = useState(null);

  const getStageStatus = (index) => {
    if (!currentStage) return 'pending';
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const handleStageClick = (stage, index) => {
    if (!interactive) return;
    setExpandedStage(expandedStage === stage.id ? null : stage.id);
    onStageClick?.(stage, index);
  };

  return (
    <div className={`flowchart-viewer flowchart-viewer--${orientation}`}>
      {stages.map((stage, index) => {
        const status = getStageStatus(index);
        const isLast = index === stages.length - 1;
        const isExpanded = expandedStage === stage.id;

        return (
          <div key={stage.id} className="flowchart-stage-wrapper">
            <div
              className={`flowchart-stage flowchart-stage--${status} ${interactive ? 'interactive' : ''} ${isExpanded ? 'expanded' : ''}`}
              onClick={() => handleStageClick(stage, index)}
            >
              <div className="stage-indicator">
                {status === 'completed' ? (
                  <Check size={16} />
                ) : status === 'current' ? (
                  <Clock size={16} />
                ) : (
                  <span className="stage-number">{index + 1}</span>
                )}
              </div>
              <div className="stage-content">
                <div className="stage-header">
                  <span className="stage-icon">{stage.icon}</span>
                  <span className="stage-name">{stage.name}</span>
                </div>
                {stage.duration && (
                  <span className="stage-duration">{stage.duration}</span>
                )}
              </div>
            </div>

            {isExpanded && showActions && stage.actions && (
              <div className="stage-actions">
                {stage.actions.map((action, idx) => (
                  <div key={idx} className="action-item">
                    <span className="action-bullet">•</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            )}

            {!isLast && (
              <div className="flowchart-connector">
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FlowchartViewer;
