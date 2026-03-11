import React, { memo } from 'react';
import * as S from './BarChart.styles';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  title?: string;
  data: BarChartData[];
  maxValue?: number;
  showValues?: boolean;
  horizontal?: boolean;
}

/**
 * BarChart - Horizontal Bar Chart Component
 * 
 * Displays data as a horizontal bar chart with animated bars,
 * customizable colors, and responsive design.
 * 
 * @example
 * <BarChart
 *   title="Q1 Performance"
 *   data={[
 *     { label: 'Sales', value: 85, color: '#3b82f6' },
 *     { label: 'Revenue', value: 72, color: '#10b981' },
 *     { label: 'Growth', value: 91, color: '#f59e0b' }
 *   ]}
 *   maxValue={100}
 *   showValues={true}
 * />
 */
const BarChart = memo(({
  title,
  data,
  maxValue = 100,
  showValues = true
}: BarChartProps) => {
  return (
    <S.BarChartContainer>
      {title && (
        <S.BarChartHeader>
          <S.BarChartTitle>{title}</S.BarChartTitle>
        </S.BarChartHeader>
      )}

      <S.BarChartGrid>
        {data.map((item, idx) => {
          const percentage = (item.value / maxValue) * 100;
          const color = item.color || '#3b82f6';

          return (
            <S.BarRow key={idx}>
              <S.BarLabel title={item.label}>{item.label}</S.BarLabel>

              <S.BarTrack role="progressbar" aria-valuenow={item.value} aria-valuemax={maxValue}>
                <S.Bar
                  percentage={percentage}
                  color={color}
                  style={{
                    width: `${percentage}%`
                  }}
                >
                  {showValues && percentage > 20 && (
                    <S.BarValue>{item.value}</S.BarValue>
                  )}
                </S.Bar>
              </S.BarTrack>

              <S.BarRightValue>{item.value}</S.BarRightValue>
            </S.BarRow>
          );
        })}
      </S.BarChartGrid>
    </S.BarChartContainer>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;
