import styled from 'styled-components';

export const SparkLineContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);

    &:hover {
      background: rgba(59, 130, 246, 0.15);
    }
  }
`;

export const SparkSvg = styled.svg`
  height: 24px;
  width: auto;
  display: block;
`;

export const SparkPath = styled.polyline<{ color?: string }>`
  fill: none;
  stroke: ${props => props.color || '#3b82f6'};
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
`;

export const SparkFill = styled.polygon<{ color?: string }>`
  fill: ${props => props.color || '#3b82f6'}22;
`;

export const SparkLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const SparkValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  letter-spacing: -0.2px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const SparkTrend = styled.span<{ positive?: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  margin-left: 4px;

  @media (prefers-color-scheme: dark) {
    /* Colors work well in dark mode */
  }
`;
