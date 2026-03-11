import styled from 'styled-components';

export const PieChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
  }
`;

export const PieSvgWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PieSvg = styled.svg`
  width: 180px;
  height: 180px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));

  @media (prefers-color-scheme: dark) {
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 640px) {
    width: 140px;
    height: 140px;
  }
`;

export const PieSlice = styled.path<{ isHovered?: boolean }>`
  transition: filter 0.3s ease;
  cursor: pointer;
  stroke: white;
  stroke-width: 2;

  &:hover {
    filter: brightness(1.15);
  }

  @media (prefers-color-scheme: dark) {
    stroke: #1f2937;
  }
`;

export const PieLegend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
`;

export const LegendEntry = styled.div<{ isHovered?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isHovered ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};

  &:hover {
    background-color: rgba(59, 130, 246, 0.1);
    transform: translateX(4px);
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.isHovered ? 'rgba(59, 130, 246, 0.15)' : 'transparent'};
  }
`;

export const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${props => props.color};
  flex-shrink: 0;
`;

export const LegendLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  flex: 1;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const LegendValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }
`;

export const LegendPercent = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-left: auto;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;
