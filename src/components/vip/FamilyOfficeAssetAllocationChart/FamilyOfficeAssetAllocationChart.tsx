import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 16px;`;

// Pie chart using conic-gradient
const PieWrapper = styled.div`display: flex; align-items: center; gap: 20px;`;
const Pie = styled.div<{ $segments: string }>`
  width: 140px; height: 140px; border-radius: 50%;
  background: conic-gradient(${p => p.$segments});
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
`;
const Legend = styled.div`display: flex; flex-direction: column; gap: 8px; flex: 1;`;
const LegItem = styled.div`display: flex; align-items: center; gap: 8px;`;
const LegDot = styled.div<{ $color: string }>`width: 10px; height: 10px; border-radius: 50%; background: ${p => p.$color}; flex-shrink: 0;`;
const LegLabel = styled.div`font-size: 0.75rem; color: #94A3B8; font-weight: 600;`;
const LegValue = styled.div`font-size: 0.75rem; font-weight: 800; color: #E2E8F0; margin-left: auto;`;

const TotalCard = styled.div`
  padding: 16px; border-radius: 12px;
  background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2);
  display: flex; justify-content: space-between; align-items: center;
`;
const TotalLabel = styled.div`font-size: 0.78rem; color: #94A3B8; font-weight: 600;`;
const TotalValue = styled.div`font-size: 1.4rem; font-weight: 900; color: #EF4444;`;

const Slider = styled.input`width: 100%; accent-color: #EF4444; cursor: pointer;`;
const SliderRow = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const SliderMeta = styled.div`display: flex; justify-content: space-between;`;
const K = styled.span`font-size: 0.75rem; color: #94A3B8; font-weight: 600;`;
const V = styled.span`font-size: 0.75rem; font-weight: 800; color: #EF4444;`;

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#3B82F6', '#EC4899'];
const ASSET_TYPES = ['Residential', 'Commercial', 'Off-Plan', 'REITs', 'International', 'Cash'];

export const FamilyOfficeAssetAllocationChart: FC = () => {
  const [allocations, setAllocations] = useState([35, 20, 15, 10, 12, 8]);

  const total = allocations.reduce((a, b) => a + b, 0);
  const normalized = allocations.map(a => (a / total) * 100);

  let cumulative = 0;
  const segments = normalized.map((pct, i) => {
    const start = cumulative;
    cumulative += pct;
    return `${COLORS[i]} ${start.toFixed(1)}% ${cumulative.toFixed(1)}%`;
  }).join(', ');

  const portfolioValue = 50_000_000;

  return (
    <Wrapper data-testid="family-office-asset-allocation-chart">
      <Header>
        <Title>📊 Family Office Asset Allocation</Title>
        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>AED {(portfolioValue / 1_000_000).toFixed(0)}M Portfolio</div>
      </Header>
      <Body>
        <PieWrapper>
          <Pie $segments={segments} />
          <Legend>
            {ASSET_TYPES.map((label, i) => (
              <LegItem key={label}>
                <LegDot $color={COLORS[i]} />
                <LegLabel>{label}</LegLabel>
                <LegValue>{normalized[i].toFixed(1)}%</LegValue>
              </LegItem>
            ))}
          </Legend>
        </PieWrapper>

        {ASSET_TYPES.map((label, i) => (
          <SliderRow key={label}>
            <SliderMeta>
              <K style={{ color: COLORS[i] }}>■ {label}</K>
              <V style={{ color: COLORS[i] }}>{normalized[i].toFixed(1)}% — AED {Math.round(portfolioValue * normalized[i] / 100 / 1_000_000).toFixed(1)}M</V>
            </SliderMeta>
            <Slider type="range" min={0} max={60} value={allocations[i]} onChange={e => {
              const next = [...allocations];
              next[i] = +e.target.value;
              setAllocations(next);
            }} style={{ accentColor: COLORS[i] }} />
          </SliderRow>
        ))}

        <TotalCard>
          <TotalLabel>Total Portfolio Value</TotalLabel>
          <TotalValue>AED {(portfolioValue / 1_000_000).toFixed(0)}M</TotalValue>
        </TotalCard>
      </Body>
    </Wrapper>
  );
};
export default FamilyOfficeAssetAllocationChart;
