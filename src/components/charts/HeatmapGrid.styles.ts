import styled from 'styled-components';

export const HeatmapGridContainer = styled.div`
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  overflow-x: auto;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const HeatmapGrid = styled.div<{ rows: number; cols: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  gap: 4px;
  min-width: 100%;
`;

export const HeatmapCell = styled.div<{ value: number; maxValue: number }>`
  aspect-ratio: 1;
  border-radius: 4px;
  background: ${props => {
    const intensity = props.value / props.maxValue;
    if (intensity < 0.25) return 'rgba(59, 130, 246, 0.2)';
    if (intensity < 0.5) return 'rgba(59, 130, 246, 0.4)';
    if (intensity < 0.75) return 'rgba(59, 130, 246, 0.6)';
    return 'rgba(59, 130, 246, 0.9)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: ${props => {
    const intensity = props.value / props.maxValue;
    return intensity > 0.6 ? 'white' : 'rgba(0, 0, 0, 0.6)';
  }};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    z-index: 10;
  }

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.12);
    color: ${props => {
      const intensity = props.value / props.maxValue;
      return intensity > 0.6 ? 'white' : 'rgba(255, 255, 255, 0.7)';
    }};
  }

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const HeatmapTooltip = styled.div`
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
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 20;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

export const HeatmapLegend = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 12px;
  flex-wrap: wrap;
  font-size: 12px;
`;

export const LegendGradient = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

export const LegendBar = styled.div<{ intensity: number }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: rgba(59, 130, 246, ${props => 0.2 + props.intensity * 0.7});
  border: 1px solid rgba(0, 0, 0, 0.08);

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

export const LegendLabel = styled.span`
  color: rgba(0, 0, 0, 0.7);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
  }
`;
