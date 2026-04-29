import React from 'react';
import { Target, ArrowUp, ArrowDown } from 'lucide-react';

interface PipelineStage {
  id: string;
  label: string;
  count: number;
  value: string | number;
}

interface PipelineData {
  pipelineStages: PipelineStage[];
}

interface PipelineTabProps {
  data: PipelineData;
  selectedStage: string;
  onSelectStage: (stageId: string) => void;
}

const PipelineTab: React.FC<PipelineTabProps> = ({ data, selectedStage, onSelectStage }) => {
  return (
    <div className="pipeline-view">
      <div className="pipeline-stages">
        {data.pipelineStages.map((stage: PipelineStage, index: number) => (
          <div 
            key={stage.id} 
            className={`pipeline-stage ${selectedStage === stage.id ? 'selected' : ''}`}
            onClick={() => onSelectStage(stage.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedStage === stage.id}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(stage.id); } }}
          >
            <div className="stage-header">
              <span className="stage-name">{stage.label}</span>
              <span className="stage-count">{stage.count}</span>
            </div>
            <div className="stage-value">{stage.value}</div>
            <div className="stage-bar">
              <div 
                className="stage-fill" 
                style={{ width: `${(() => { const maxCount = Math.max(...data.pipelineStages.map((s: PipelineStage) => s.count || 0), 1); return maxCount > 0 ? Math.min(((stage.count || 0) / maxCount) * 100, 100) : 0; })()}%` }}
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
