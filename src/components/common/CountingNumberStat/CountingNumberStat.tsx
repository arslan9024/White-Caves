/**
 * CountingNumberStat — Wave 64 FE-GOAL-083
 * Smooth counting number animation component for high-impact KPI statistic displays
 * White Caves Real Estate LLC — Animation & Analytics Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

const StatWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: 'Inter', sans-serif;
`;

const Val = styled.div<{ $color?: string }>`
  font-size: 1.6rem;
  font-weight: 900;
  color: ${p => p.$color || '#FFF'};
  font-variant-numeric: tabular-nums;
`;

const Lbl = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
`;

export const CountingNumberStat: FC<{
  targetValue: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  color?: string;
}> = ({
  targetValue,
  durationMs = 1500,
  prefix = '',
  suffix = '',
  label = 'Metric',
  color = '#FFF',
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * targetValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [targetValue, durationMs]);

  return (
    <StatWrap data-testid="counting-number-stat">
      <Val $color={color}>
        {prefix}{current.toLocaleString()}{suffix}
      </Val>
      <Lbl>{label}</Lbl>
    </StatWrap>
  );
};

export default CountingNumberStat;
