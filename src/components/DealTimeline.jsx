import React, { useEffect, useState } from 'react';
import './DealTimeline.css';

const StageCard = ({ stage, isActive, isCompleted, onClick, duration }) => {
  return (
    <div
      className={`stage-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="stage-icon">
        {isCompleted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <span className="stage-number">{stage.order}</span>
        )}
      </div>
      <div className="stage-info">
        <h4 className="stage-title">{stage.title}</h4>
        <p className="stage-description">{stage.description}</p>
        {duration && <p className="stage-duration">{duration}</p>}
      </div>
    </div>
  );
};

const DealTimeline = ({
  stages,
  currentStage,
  onStageClick,
  dealData = {},
  estimatedCompletion,
}) => {
  const [completedStages, setCompletedStages] = useState([]);

  useEffect(() => {
    // Update completed stages based on current stage
    if (currentStage) {
      const completed = stages
        .filter((stage) => stage.order < currentStage.order)
        .map((stage) => stage.id);
      setCompletedStages(completed);
    }
  }, [currentStage, stages]);

  const getStageDuration = (stage) => {
    if (dealData[`${stage.id}_startDate`] && dealData[`${stage.id}_endDate`]) {
      const start = new Date(dealData[`${stage.id}_startDate`]);
      const end = new Date(dealData[`${stage.id}_endDate`]);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return null;
  };

  const progressPercentage =
    currentStage && stages.length > 0
      ? ((currentStage.order - 1) / stages.length) * 100
      : 0;

  return (
    <div className="deal-timeline">
      <div className="timeline-header">
        <h2>Deal Progress Timeline</h2>
        {estimatedCompletion && (
          <p className="estimated-completion">
            Est. Completion: {new Date(estimatedCompletion).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="stages-container">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <StageCard
              stage={stage}
              isActive={currentStage?.id === stage.id}
              isCompleted={completedStages.includes(stage.id)}
              onClick={() => onStageClick(stage)}
              duration={getStageDuration(stage)}
            />
            {index < stages.length - 1 && (
              <div className={`stage-connector ${completedStages.includes(stage.id) ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {currentStage && (
        <div className="timeline-current-info">
          <h3>Current Stage: {currentStage.title}</h3>
          <p>{currentStage.description}</p>
          {dealData[`${currentStage.id}_assignedTo`] && (
            <p className="assigned-to">
              Assigned to: {dealData[`${currentStage.id}_assignedTo`]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export { DealTimeline, StageCard };
export default DealTimeline;
