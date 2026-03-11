import React, { memo } from 'react';
import * as S from './SparkLine.styles';

interface SparkLineProps {
  data: number[];
  label: string;
  value?: string | number;
  color?: string;
  change?: number;
  width?: number;
  height?: number;
}

/**
 * SparkLine - Inline Sparkline Chart Component
 * 
 * A compact inline sparkline chart for showing trends without taking up much space.
 * Perfect for dashboard summaries and status displays.
 * 
 * @example
 * <SparkLine
 *   label="Revenue"
 *   value="$45.2K"
 *   data={[20, 25, 15, 30, 28, 35, 40]}
 *   color="#3b82f6"
 *   change={12.5}
 * />
 */
const SparkLine = memo(({
  data,
  label,
  value,
  color = '#3b82f6',
  change,
  width = 80,
  height = 20
}: SparkLineProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Normalize data for SVG path
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 2;
  const svgWidth = width;
  const svgHeight = height;
  const pointWidth = (svgWidth - padding * 2) / (data.length - 1);

  // Create path points
  const points = data.map((value, idx) => {
    const x = padding + idx * pointWidth;
    const normalized = (value - min) / range;
    const y = svgHeight - padding - normalized * (svgHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Create fill polygon
  const fillPoints = `${padding},${svgHeight} ${points} ${svgWidth - padding},${svgHeight}`;

  const isPositive = change && change > 0;

  return (
    <S.SparkLineContainer>
      <S.SparkSvg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        aria-label={`${label} sparkline`}
      >
        <S.SparkFill points={fillPoints} color={color} />
        <S.SparkPath points={points} color={color} />
      </S.SparkSvg>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <S.SparkLabel>{label}</S.SparkLabel>
        {value && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <S.SparkValue>{value}</S.SparkValue>
            {change !== undefined && (
              <S.SparkTrend positive={isPositive}>
                {isPositive ? '↑' : '↓'} {Math.abs(change)}%
              </S.SparkTrend>
            )}
          </div>
        )}
      </div>
    </S.SparkLineContainer>
  );
});

SparkLine.displayName = 'SparkLine';

export default SparkLine;
