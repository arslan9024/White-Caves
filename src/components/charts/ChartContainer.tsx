import React, { memo } from 'react';
import * as S from './ChartContainer.styles';

interface LegendItemConfig {
  label: string;
  color: string;
}

interface ChartContainerProps {
  title: string;
  children?: React.ReactNode;
  legend?: LegendItemConfig[];
  stats?: Array<{ label: string; value: string | number }>;
  actions?: Array<{ label: string; onClick: () => void }>;
  fullHeight?: boolean;
  onExport?: () => void;
  onRefresh?: () => void;
}

/**
 * ChartContainer - Advanced Chart Wrapper Component
 * 
 * A flexible container component for displaying charts with dynamic legends,
 * statistics, and action buttons. Supports dark theme and responsive layout.
 * 
 * @example
 * <ChartContainer
 *   title="Monthly Revenue"
 *   legend={[{ label: 'Revenue', color: '#3b82f6' }]}
 *   stats={[{ label: 'Total', value: '$45,200' }]}
 *   actions={[{ label: 'Export', onClick: handleExport }]}
 * >
 *   <YourChartComponent />
 * </ChartContainer>
 */
const ChartContainer = memo(({
  title,
  children,
  legend = [],
  stats = [],
  actions = [],
  fullHeight = false,
  onExport,
  onRefresh
}: ChartContainerProps) => {
  return (
    <S.ChartWrapperContainer fullHeight={fullHeight}>
      <S.ChartHeader>
        <S.ChartTitle>{title}</S.ChartTitle>
        {legend.length > 0 && (
          <S.ChartLegend>
            {legend.map((item, idx) => (
              <S.LegendItem key={idx} color={item.color}>
                {item.label}
              </S.LegendItem>
            ))}
          </S.ChartLegend>
        )}
      </S.ChartHeader>

      <S.ChartContent>
        {children || (
          <S.ChartPlaceholder>
            Loading chart content...
          </S.ChartPlaceholder>
        )}
      </S.ChartContent>

      {(stats.length > 0 || actions.length > 0 || onExport || onRefresh) && (
        <S.ChartFooter>
          {stats.length > 0 && (
            <S.ChartStats>
              {stats.map((stat, idx) => (
                <S.StatItem key={idx}>
                  <S.StatLabel>{stat.label}</S.StatLabel>
                  <S.StatValue>{stat.value}</S.StatValue>
                </S.StatItem>
              ))}
            </S.ChartStats>
          )}

          {(actions.length > 0 || onExport || onRefresh) && (
            <S.ChartActions>
              {onRefresh && (
                <button onClick={onRefresh} title="Refresh chart">
                  🔄 Refresh
                </button>
              )}
              {onExport && (
                <button onClick={onExport} title="Export chart">
                  ⬇️ Export
                </button>
              )}
              {actions.map((action, idx) => (
                <button key={idx} onClick={action.onClick}>
                  {action.label}
                </button>
              ))}
            </S.ChartActions>
          )}
        </S.ChartFooter>
      )}
    </S.ChartWrapperContainer>
  );
});

ChartContainer.displayName = 'ChartContainer';

export default ChartContainer;
