import styled from 'styled-components';

// Metrics Chart Container
export const MetricsChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 30, 0.9);
    color: rgba(255, 255, 255, 0.9);
  }
`;

export const MetricsChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 16px;
  text-transform: capitalize;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const MetricsChartTooltip = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
`;

export const TooltipLabel = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #ffffff;
`;

export const TooltipValue = styled.div`
  color: #E0E0E0;
  font-size: 12px;
`;

// Trend Chart
export const TrendChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 30, 0.9);
    color: rgba(255, 255, 255, 0.9);
  }
`;

export const TrendChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 16px;
  text-transform: capitalize;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const TrendChartTooltip = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
`;

// Distribution Chart
export const DistributionChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 30, 0.9);
    color: rgba(255, 255, 255, 0.9);
  }
`;

export const DistributionChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 16px;
  text-transform: capitalize;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const DistributionChartTooltip = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
`;

// Analytics Grid
export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

export const AnalyticsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Recharts Common Styles
export const RechartsContainer = styled.div`
  .recharts-surface {
    border-radius: 8px;
  }

  .recharts-legend-wrapper {
    padding-top: 20px;
  }

  .recharts-legend-item {
    font-size: 13px;
  }
`;
