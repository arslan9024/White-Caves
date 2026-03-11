import styled from 'styled-components';

export const PipelineProgressContainer = styled.div<{ $variant?: 'horizontal' | 'vertical' }>`
  display: flex;
  gap: 0;
  flex-direction: ${(props) => (props.$variant === 'vertical' ? 'column' : 'row')};
`;

export const PipelineStageContainer = styled.div<{ $completed?: boolean; $current?: boolean; $variant?: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${(props) => (props.$variant === 'vertical' ? 'row' : 'column')};
  align-items: ${(props) => (props.$variant === 'vertical' ? 'flex-start' : 'center')};
  flex: 1;
  position: relative;
`;

export const StageIndicator = styled.div<{ $variant?: 'horizontal' | 'vertical' }>`
  display: flex;
  align-items: center;
  position: relative;
  width: ${(props) => (props.$variant === 'vertical' ? 'auto' : '100%')};
  height: ${(props) => (props.$variant === 'vertical' ? '100%' : 'auto')};
`;

export const StageDot = styled.div<{ $completed?: boolean; $current?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  z-index: 1;
  flex-shrink: 0;
  transition: all 0.2s ease;

  ${(props) =>
    props.$completed
      ? `
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  `
      : props.$current
        ? `
    border-color: var(--color-primary);
    color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2);
  `
        : ''}
`;

export const StageLine = styled.div<{ $completed?: boolean; $variant?: 'horizontal' | 'vertical' }>`
  ${(props) =>
    props.$variant === 'vertical'
      ? `
    width: 2px;
    height: 100%;
    min-height: 30px;
  `
      : `
    flex: 1;
    height: 2px;
  `}
  background: ${(props) => (props.$completed ? 'var(--color-primary)' : 'var(--border-color)')};
`;

export const StageContent = styled.div<{ $variant?: 'horizontal' | 'vertical' }>`
  text-align: ${(props) => (props.$variant === 'vertical' ? 'left' : 'center')};
  margin-top: ${(props) => (props.$variant === 'vertical' ? '0' : '0.5rem')};
  margin-left: ${(props) => (props.$variant === 'vertical' ? '1rem' : '0')};
`;

export const StageName = styled.span<{ $current?: boolean }>`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${(props) => (props.$current ? 'var(--color-primary)' : 'var(--text-muted)')};
  ${(props) => props.$current ? 'font-weight: 600;' : ''}
`;

export const StageCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 10px;
  margin-left: 0.5rem;
`;

export const StageValue = styled.span`
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
`;

export const PipelineBoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

export const PipelineColumn = styled.div`
  background: var(--bg-hover);
  border-radius: 12px;
  padding: 1rem;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ColumnName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
`;

export const ColumnCount = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  background: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 50%;
`;

export const ColumnValue = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
`;

export const ColumnItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PipelineItemContainer = styled.div`
  padding: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

export const ItemName = styled.span`
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
`;

export const ItemValue = styled.span`
  font-size: 0.8rem;
  color: var(--color-primary);
  font-weight: 600;
  display: block;
`;

export const DealProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), #f59e0b);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const ProgressStage = styled.span`
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
`;
