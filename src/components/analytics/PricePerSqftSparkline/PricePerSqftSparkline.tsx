import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const sparkle = keyframes`0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); }`;

const Wrapper = styled.div`width: 100%; background: #0F172A; border: 2px solid rgba(239,68,68,0.2); border-radius: 14px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Title = styled.div`padding: 10px 14px; font-size: 0.78rem; font-weight: 700; color: #CBD5E1; border-bottom: 1px solid rgba(100,116,139,0.15); display: flex; align-items: center; gap: 6px;`;

const SparklineArea = styled.div`padding: 12px 14px;`;
const CommunitySelect = styled.div`display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;`;
const Chip = styled.button<{ $active: boolean }>`padding: 4px 10px; border-radius: 6px; border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.25)'}; background: ${p => p.$active ? 'rgba(239,68,68,0.12)' : 'transparent'}; color: ${p => p.$active ? '#EF4444' : '#64748B'}; font-size: 0.68rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;`;

const Chart = styled.div`display: flex; align-items: flex-end; gap: 3px; height: 50px;`;
const Bar = styled.div<{ $h: number; $active: boolean }>`
  flex: 1;
  height: ${p => p.$h}%;
  min-height: 4px;
  border-radius: 3px 3px 0 0;
  background: ${p => p.$active ? 'linear-gradient(180deg, #EF4444, rgba(239,68,68,0.3))' : 'rgba(100,116,139,0.2)'};
  transition: height 0.5s ease, background 0.2s ease;
  animation: ${p => p.$active ? sparkle : 'none'} 2s ease-in-out infinite;
`;

const PriceInfo = styled.div`display: flex; justify-content: space-between; align-items: center; margin-top: 8px;`;
const CurrentPrice = styled.div`font-size: 1rem; font-weight: 900; color: #EF4444;`;
const TrendInfo = styled.div`font-size: 0.68rem; color: #10B981; font-weight: 700;`;

const DATA: Record<string, { psf: number; trend: number[]; change: string }> = {
  'Downtown': { psf: 2210, trend: [40, 55, 50, 65, 70, 75, 68, 80, 85, 90, 88, 100], change: '+9.1%' },
  'Marina': { psf: 1840, trend: [60, 65, 58, 70, 72, 68, 75, 80, 78, 85, 90, 92], change: '+12.4%' },
  'Palm': { psf: 2650, trend: [50, 55, 60, 65, 72, 70, 78, 82, 80, 88, 94, 100], change: '+15.3%' },
  'JBR': { psf: 1560, trend: [70, 72, 68, 70, 71, 70, 73, 74, 72, 75, 74, 76], change: '+2.1%' },
};

export const PricePerSqftSparkline: FC = () => {
  const [selected, setSelected] = useState('Downtown');
  const d = DATA[selected];
  const activeBar = d.trend.length - 1;

  return (
    <Wrapper data-testid="price-per-sqft-sparkline">
      <Title>📈 Price/Sqft Trend</Title>
      <SparklineArea>
        <CommunitySelect>
          {Object.keys(DATA).map(k => (
            <Chip key={k} $active={k === selected} onClick={() => setSelected(k)}>{k}</Chip>
          ))}
        </CommunitySelect>
        <Chart>
          {d.trend.map((h, i) => (
            <Bar key={i} $h={h} $active={i === activeBar} />
          ))}
        </Chart>
        <PriceInfo>
          <CurrentPrice>AED {d.psf.toLocaleString()}/sqft</CurrentPrice>
          <TrendInfo>▲ {d.change} YTD</TrendInfo>
        </PriceInfo>
      </SparklineArea>
    </Wrapper>
  );
};
export default PricePerSqftSparkline;
