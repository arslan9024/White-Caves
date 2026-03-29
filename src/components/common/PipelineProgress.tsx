import React, { ReactNode } from 'react';
import {
  PipelineProgressContainer,
  PipelineStageContainer,
  StageIndicator,
  StageDot,
  StageLine,
  StageContent,
  StageName,
  StageCount,
  StageValue,
  PipelineBoardContainer,
  PipelineColumn,
  ColumnHeader,
  ColumnName,
  ColumnCount,
  ColumnValue,
  ColumnItems,
  PipelineItemContainer,
  ItemName,
  ItemValue,
  DealProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFill,
  ProgressStage,
} from './PipelineProgress/PipelineProgress.styles';

type StageType = string | { name: string; value?: string; count?: number };

interface PipelineProgressProps {
  stages: StageType[];
  currentStage: string;
  showValues?: boolean;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export default function PipelineProgress({
  stages,
  currentStage,
  showValues = false,
  variant = 'horizontal',
  className = '',
}: PipelineProgressProps) {
  const currentIndex = stages.findIndex(
    (s) => (typeof s === 'string' ? s : s.name) === currentStage
  );

  return (
    <PipelineProgressContainer $variant={variant as 'horizontal' | 'vertical'} className={className}>
      {stages.map((stage, index) => {
        const stageName = typeof stage === 'string' ? stage : stage.name;
        const stageValue = typeof stage === 'object' ? stage.value : null;
        const stageCount = typeof stage === 'object' ? stage.count : null;

        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <PipelineStageContainer
            key={stageName}
            $completed={isCompleted}
            $current={isCurrent}
            $variant={variant as 'horizontal' | 'vertical'}
          >
            <StageIndicator $variant={variant as 'horizontal' | 'vertical'}>
              <StageDot $completed={isCompleted} $current={isCurrent}>
                {isCompleted ? '✓' : index + 1}
              </StageDot>
              {index < stages.length - 1 && (
                <StageLine $completed={isCompleted} $variant={variant as 'horizontal' | 'vertical'} />
              )}
            </StageIndicator>
            <StageContent $variant={variant as 'horizontal' | 'vertical'}>
              <StageName $current={isCurrent}>{stageName}</StageName>
              {showValues && stageCount !== null && <StageCount>{stageCount}</StageCount>}
              {showValues && stageValue && <StageValue>{stageValue}</StageValue>}
            </StageContent>
          </PipelineStageContainer>
        );
      })}
    </PipelineProgressContainer>
  );
}

interface PipelineBoardStage {
  name: string;
  count?: number;
  value?: string;
  items?: Array<{ id?: string; name?: string; title?: string; value?: string }>;
}

interface PipelineBoardProps {
  stages: PipelineBoardStage[];
  className?: string;
}

export function PipelineBoard({ stages, className = '' }: PipelineBoardProps) {
  return (
    <PipelineBoardContainer className={className}>
      {stages.map((stage) => (
        <PipelineColumn key={stage.name}>
          <ColumnHeader>
            <ColumnName>{stage.name}</ColumnName>
            {stage.count !== undefined && <ColumnCount>{stage.count}</ColumnCount>}
          </ColumnHeader>
          {stage.value && <ColumnValue>{stage.value}</ColumnValue>}
          {stage.items && stage.items.length > 0 && (
            <ColumnItems>
              {stage.items.map((item) => (
                <PipelineItemContainer key={item.id || item.name || item.title}>
                  <ItemName>{item.name || item.title}</ItemName>
                  {item.value && <ItemValue>{item.value}</ItemValue>}
                </PipelineItemContainer>
              ))}
            </ColumnItems>
          )}
        </PipelineColumn>
      ))}
    </PipelineBoardContainer>
  );
}

interface DealProgressBarProps {
  progress: number;
  stage?: string;
  className?: string;
}

export function DealProgressBar({ progress, stage, className = '' }: DealProgressBarProps) {
  return (
    <DealProgressBarContainer className={className}>
      <ProgressBarWrapper>
        <ProgressBarFill style={{ width: `${progress}%` }} />
      </ProgressBarWrapper>
      {stage && <ProgressStage>{stage}</ProgressStage>}
    </DealProgressBarContainer>
  );
}
