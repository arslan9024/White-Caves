import React, { memo, useState } from 'react';
import * as S from './PieChart.styles';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  centerLabel?: string;
  centerValue?: string | number;
}

/**
 * PieChart - Pie Chart Component with Interactive Legend
 * 
 * Displays data as an interactive pie chart with color-coded legend.
 * Supports hover interactions and dark theme.
 * 
 * @example
 * <PieChart
 *   data={[
 *     { label: 'Sales', value: 45, color: '#3b82f6' },
 *     { label: 'Marketing', value: 30, color: '#10b981' },
 *     { label: 'Operations', value: 25, color: '#f59e0b' }
 *   ]}
 *   centerLabel="Total"
 *   centerValue="100%"
 * />
 */
const PieChart = memo(({
  data,
  centerLabel,
  centerValue
}: PieChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Generate pie slices
  let currentAngle = 0;
  const slices = data.map((item, idx) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    // Convert angles to SVG coordinates
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const radius = 70;

    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return { path, color: item.color, idx };
  });

  return (
    <S.PieChartContainer>
      <S.PieSvgWrapper>
        <S.PieSvg viewBox="0 0 200 200">
          {slices.map((slice) => (
            <S.PieSlice
              key={slice.idx}
              d={slice.path}
              fill={slice.color}
              isHovered={hoveredIndex === slice.idx}
              onMouseEnter={() => setHoveredIndex(slice.idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => console.log('Clicked:', data[slice.idx])}
              role="button"
              tabIndex={0}
              aria-label={`${data[slice.idx].label}: ${data[slice.idx].value}`}
            />
          ))}
          {centerLabel && centerValue && (
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="rgba(0,0,0,0.8)"
              pointerEvents="none"
            >
              {centerValue}
            </text>
          )}
        </S.PieSvg>
      </S.PieSvgWrapper>

      <S.PieLegend>
        {data.map((item, idx) => (
          <S.LegendEntry
            key={idx}
            isHovered={hoveredIndex === idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <S.LegendColor color={item.color} />
            <S.LegendLabel>{item.label}</S.LegendLabel>
            <S.LegendValue>{item.value}</S.LegendValue>
            <S.LegendPercent>
              {((item.value / total) * 100).toFixed(1)}%
            </S.LegendPercent>
          </S.LegendEntry>
        ))}
      </S.PieLegend>
    </S.PieChartContainer>
  );
});

PieChart.displayName = 'PieChart';

export default PieChart;
