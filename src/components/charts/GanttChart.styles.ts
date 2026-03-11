import styled from 'styled-components';

export const GanttChartContainer = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  overflow-x: auto;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const GanttHeader = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }
`;

export const GanttTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.6);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const GanttTimeline = styled.div`
  display: flex;
  gap: 20px;
`;

export const TimelineMonth = styled.div`
  min-width: 60px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const GanttRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  margin-bottom: 16px;
  align-items: center;
  padding: 12px 0;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(59, 130, 246, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: rgba(59, 130, 246, 0.15);
    }
  }
`;

export const GanttLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const GanttBarContainer = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  height: 40px;
`;

export const GanttBar = styled.div<{ startPercent: number; widthPercent: number; color?: string }>`
  position: absolute;
  left: ${props => props.startPercent}%;
  width: ${props => props.widthPercent}%;
  height: 28px;
  background: linear-gradient(135deg, 
    ${props => props.color || '#3b82f6'} 0%, 
    ${props => props.color || '#3b82f6'}dd 100%);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  cursor: grab;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }
  }

  @media (max-width: 768px) {
    height: 24px;
    font-size: 10px;
  }
`;

export const GanttTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  margin-bottom: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 20;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

export const GanttMilestone = styled.div`
  position: absolute;
  width: 2px;
  height: 100%;
  background: #ef4444;
  margin-left: 8px;
`;
