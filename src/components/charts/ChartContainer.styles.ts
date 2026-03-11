import styled from 'styled-components';

export const ChartWrapperContainer = styled.div<{ fullHeight?: boolean }>`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  min-height: ${props => props.fullHeight ? '100%' : '320px'};
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.9) 100%);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  letter-spacing: -0.3px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const ChartLegend = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
  }

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background-color: ${props => props.color || '#3b82f6'};
  }
`;

export const ChartContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 280px;
`;

export const ChartCanvas = styled.canvas`
  max-width: 100%;
  height: auto;
`;

export const ChartPlaceholder = styled.div`
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  letter-spacing: 0.5px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const ChartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  @media (prefers-color-scheme: dark) {
    border-top-color: rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

export const ChartStats = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.6);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }
`;

export const ChartActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  button {
    padding: 8px 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
    color: rgba(0, 0, 0, 0.7);

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.7);
    }

    &:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-2px);
    }
  }
`;
