import styled from 'styled-components';

export const TrendLineContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);

    &:hover {
      background: rgba(59, 130, 246, 0.2);
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const TrendVisualization = styled.div`
  flex: 0 0 60px;
  height: 40px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 3px;
`;

export const TrendBar = styled.div<{ value: number; total: number; isActive?: boolean }>`
  flex: 1;
  height: ${props => (props.value / props.total) * 100}%;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 3px;
  transition: all 0.3s ease;
  opacity: ${props => props.isActive ? 1 : 0.6};

  &:hover {
    opacity: 1;
    transform: scaleY(1.05);
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
  }
`;

export const TrendContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const TrendLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

export const TrendValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  letter-spacing: -0.3px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const TrendIndicator = styled.span<{ positive?: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  white-space: nowrap;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @media (prefers-color-scheme: dark) {
    /* Colors work well in dark mode */
  }
`;

export const TrendListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
