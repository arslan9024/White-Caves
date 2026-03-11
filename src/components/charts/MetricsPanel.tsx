import React, { memo, useState } from 'react';
import * as S from './MetricsPanel.styles';

interface Metric {
  name: string;
  value: string | number;
  highlight?: boolean;
}

interface MetricsPanelProps {
  title: string;
  metrics: Metric[];
  layout?: 'list' | 'grid';
  columns?: number;
  period?: string;
  onPeriodChange?: (period: string) => void;
  footer?: string;
}

/**
 * MetricsPanel - Comprehensive Metrics Overview Component
 * 
 * Displays multiple metrics in a list or grid layout with period selection
 * and customizable filtering. Supports dark theme and responsive design.
 * 
 * @example
 * <MetricsPanel
 *   title="Sales Metrics"
 *   metrics={[
 *     { name: 'Total Sales', value: '$125,450', highlight: true },
 *     { name: 'Orders', value: '2,340' }
 *   ]}
 *   layout="grid"
 *   columns={3}
 * />
 */
const MetricsPanel = memo(({
  title,
  metrics,
  layout = 'list',
  columns = 3,
  period = 'This Month',
  onPeriodChange,
  footer
}: MetricsPanelProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
    onPeriodChange?.(e.target.value);
  };

  return (
    <S.MetricsPanelContainer>
      <S.PanelHeader>
        <S.PanelTitle>{title}</S.PanelTitle>
        <S.PanelControls>
          <select value={selectedPeriod} onChange={handlePeriodChange}>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last Year">Last Year</option>
            <option value="All Time">All Time</option>
          </select>
        </S.PanelControls>
      </S.PanelHeader>

      {layout === 'grid' ? (
        <S.MetricsGrid columns={columns}>
          {metrics.map((metric, idx) => (
            <S.MetricCard key={idx}>
              <S.MetricCardLabel>{metric.name}</S.MetricCardLabel>
              <S.MetricCardValue>{metric.value}</S.MetricCardValue>
            </S.MetricCard>
          ))}
        </S.MetricsGrid>
      ) : (
        <div style={{ padding: '20px' }}>
          {metrics.map((metric, idx) => (
            <S.MetricRow key={idx}>
              <S.MetricName>{metric.name}</S.MetricName>
              <S.MetricValue highlight={metric.highlight}>
                {metric.value}
              </S.MetricValue>
            </S.MetricRow>
          ))}
        </div>
      )}

      {footer && <S.PanelFooter>{footer}</S.PanelFooter>}
    </S.MetricsPanelContainer>
  );
});

MetricsPanel.displayName = 'MetricsPanel';

export default MetricsPanel;
