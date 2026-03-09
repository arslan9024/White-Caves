import React from 'react';
import { Target, ArrowUp, ArrowDown } from 'lucide-react';

const PipelineTab = ({ data, selectedStage, onSelectStage }) => {
  return (
    <div className="pipeline-view">
      <div className="pipeline-stages">
        {data.pipelineStages.map((stage, index) => (
          <div 
            key={stage.id} 
            className={`pipeline-stage ${selectedStage === stage.id ? 'selected' : ''}`}
            onClick={() => onSelectStage(stage.id)}
          >
            <div className="stage-header">
              <span className="stage-name">{stage.label}</span>
              <span className="stage-count">{stage.count}</span>
            </div>
            <div className="stage-value">{stage.value}</div>
            <div className="stage-bar">
              <div 
                className="stage-fill" 
                style={{ width: `${(stage.count / 24) * 100}%` }}
              />
            </div>
            {index < data.pipelineStages.length - 1 && <div className="stage-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineTab;
