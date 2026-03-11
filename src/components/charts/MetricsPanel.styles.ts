import styled from 'styled-components';

export const MetricsPanelContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.9) 100%);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    }
  }
`;

export const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

export const PanelTitle = styled.h2`
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

export const PanelControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  select,
  button {
    padding: 8px 12px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    color: rgba(0, 0, 0, 0.7);

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.7);
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const MetricsGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: 16px;
  padding: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.08);

    &:hover {
      background-color: rgba(255, 255, 255, 0.04);
    }
  }
`;

export const MetricName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const MetricValue = styled.span<{ highlight?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.highlight ? '#3b82f6' : 'rgba(0, 0, 0, 0.9)'};
  letter-spacing: -0.3px;

  @media (prefers-color-scheme: dark) {
    color: ${props => props.highlight ? '#60a5fa' : 'rgba(255, 255, 255, 0.95)'};
  }
`;

export const MetricCard = styled.div`
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.08);
    transform: translateY(-2px);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);

    &:hover {
      background: rgba(59, 130, 246, 0.2);
    }
  }
`;

export const MetricCardLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const MetricCardValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1.2;
  letter-spacing: -0.5px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

export const PanelFooter = styled.div`
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);

  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.2);
    border-top-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.6);
  }
`;
