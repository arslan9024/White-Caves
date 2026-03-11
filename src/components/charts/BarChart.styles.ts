import styled from 'styled-components';

export const BarChartContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const BarChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BarChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  letter-spacing: -0.3px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const BarChartGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

export const BarLabel = styled.div`
  min-width: 100px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 768px) {
    min-width: 80px;
    font-size: 12px;
  }

  @media (max-width: 640px) {
    min-width: 60px;
  }
`;

export const BarTrack = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  height: 28px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 640px) {
    height: 24px;
  }
`;

export const Bar = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg,
    ${props => props.color || '#3b82f6'} 0%,
    ${props => props.color || '#3b82f6'}dd 100%);
  border-radius: 6px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.6s ease;

  @keyframes slideIn {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: ${props => props.percentage}%;
      opacity: 1;
    }
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    filter: brightness(1.1);
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const BarValue = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  margin-left: 8px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const BarRightValue = styled.div`
  min-width: 60px;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 768px) {
    min-width: 50px;
    font-size: 12px;
  }

  @media (max-width: 640px) {
    min-width: 40px;
    font-size: 11px;
  }
`;
