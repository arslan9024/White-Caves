import React, { memo } from 'react';
import * as S from './TrendLine.styles';

interface TrendData {
  label: string;
  value: number;
  change?: number;
}

interface TrendLineProps {
  data: TrendData[];
  height?: number;
}

/**
 * TrendLine - Inline Trend Indicator Component
 * 
 * Displays trend data as a horizontal bar visualization with values and change indicators.
 * Minimal and suitable for embedded metrics displays.
 * 
 * @example
 * <TrendLine
 *   data={[
 *     { label: 'Revenue', value: 85, change: 12.5 },
 *     { label: 'Orders', value: 70, change: -5.2 },
 *     { label: 'Customers', value: 90, change: 8.1 }
 *   ]}
 * />
 */
const TrendLine = memo(({ data, height = 40 }: TrendLineProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <S.TrendListContainer>
      {data.map((item, idx) => (
        <S.TrendLineContainer key={idx}>
          <S.TrendLabel>{item.label}</S.TrendLabel>

          <S.TrendVisualization style={{ height }}>
            {data.map((d, i) => (
              <S.TrendBar
                key={i}
                value={d.value}
                total={maxValue}
                isActive={i === idx}
              />
            ))}
          </S.TrendVisualization>

          <S.TrendContent>
            <S.TrendValue>{item.value}%</S.TrendValue>
            {item.change !== undefined && (
              <S.TrendIndicator positive={item.change > 0}>
                {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
              </S.TrendIndicator>
            )}
          </S.TrendContent>
        </S.TrendLineContainer>
      ))}
    </S.TrendListContainer>
  );
});

TrendLine.displayName = 'TrendLine';

export default TrendLine;
