import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 16px;`;
const SliderRow = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const SliderMeta = styled.div`display: flex; justify-content: space-between;`;
const SliderKey = styled.span`font-size: 0.78rem; color: #94A3B8; font-weight: 600;`;
const SliderVal = styled.span`font-size: 0.8rem; font-weight: 800; color: #EF4444;`;
const Range = styled.input`width: 100%; accent-color: #EF4444; cursor: pointer;`;

const CompGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 14px;`;
const CompCard = styled.div<{ $type: 'short' | 'long' }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$type === 'short' ? 'rgba(139,92,246,0.08)' : 'rgba(16,185,129,0.08)'};
  border: 1px solid ${p => p.$type === 'short' ? 'rgba(139,92,246,0.25)' : 'rgba(16,185,129,0.25)'};
`;
const CompType = styled.div<{ $type: 'short' | 'long' }>`font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${p => p.$type === 'short' ? '#A78BFA' : '#10B981'}; margin-bottom: 8px;`;
const CompYield = styled.div`font-size: 1.6rem; font-weight: 900; color: #E2E8F0;`;
const CompDesc = styled.div`font-size: 0.7rem; color: #64748B; margin-top: 4px;`;

const WinnerBadge = styled.div<{ $type: 'short' | 'long' | null }>`
  padding: 10px 16px; border-radius: 10px;
  background: ${p => p.$type ? (p.$type === 'short' ? 'rgba(139,92,246,0.12)' : 'rgba(16,185,129,0.12)') : 'rgba(100,116,139,0.1)'};
  border: 1px solid ${p => p.$type ? (p.$type === 'short' ? 'rgba(139,92,246,0.3)' : 'rgba(16,185,129,0.3)') : 'rgba(100,116,139,0.2)'};
  font-size: 0.8rem; font-weight: 700;
  color: ${p => p.$type ? (p.$type === 'short' ? '#A78BFA' : '#10B981') : '#64748B'};
  text-align: center;
`;

export const ShortVsLongTermYieldComparator: FC = () => {
  const [propertyValue, setPropertyValue] = useState(2_000_000);
  const [furnishingCost, setFurnishingCost] = useState(80_000);
  const [occupancyRate, setOccupancyRate] = useState(75);
  const [nightlyRate, setNightlyRate] = useState(600);
  const [annualRent, setAnnualRent] = useState(120_000);

  const shortTermAnnual = nightlyRate * 365 * (occupancyRate / 100);
  const shortTermNetAnnual = shortTermAnnual - furnishingCost * 0.2 - shortTermAnnual * 0.25;
  const shortYield = ((shortTermNetAnnual / propertyValue) * 100).toFixed(2);

  const longTermNet = annualRent * 0.92;
  const longYield = ((longTermNet / propertyValue) * 100).toFixed(2);

  const winner = parseFloat(shortYield) > parseFloat(longYield) ? 'short' : 'long';

  return (
    <Wrapper data-testid="short-vs-long-yield-comparator">
      <Header>
        <Title>🏨 Short-term vs Long-term Yield</Title>
        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Ejari vs Airbnb</div>
      </Header>
      <Body>
        <SliderRow>
          <SliderMeta><SliderKey>Property Value (AED)</SliderKey><SliderVal>AED {propertyValue.toLocaleString()}</SliderVal></SliderMeta>
          <Range type="range" min={500_000} max={8_000_000} step={100_000} value={propertyValue} onChange={e => setPropertyValue(+e.target.value)} />
        </SliderRow>
        <SliderRow>
          <SliderMeta><SliderKey>Airbnb Nightly Rate (AED)</SliderKey><SliderVal>AED {nightlyRate}</SliderVal></SliderMeta>
          <Range type="range" min={200} max={2000} step={50} value={nightlyRate} onChange={e => setNightlyRate(+e.target.value)} />
        </SliderRow>
        <SliderRow>
          <SliderMeta><SliderKey>Airbnb Occupancy Rate</SliderKey><SliderVal>{occupancyRate}%</SliderVal></SliderMeta>
          <Range type="range" min={30} max={95} value={occupancyRate} onChange={e => setOccupancyRate(+e.target.value)} />
        </SliderRow>
        <SliderRow>
          <SliderMeta><SliderKey>Ejari Annual Rent (AED)</SliderKey><SliderVal>AED {annualRent.toLocaleString()}</SliderVal></SliderMeta>
          <Range type="range" min={30_000} max={400_000} step={5_000} value={annualRent} onChange={e => setAnnualRent(+e.target.value)} />
        </SliderRow>

        <CompGrid>
          <CompCard $type="short">
            <CompType $type="short">🏨 Short-Term (Airbnb)</CompType>
            <CompYield>{shortYield}%</CompYield>
            <CompDesc>Net yield after platform fees & ops</CompDesc>
            <CompDesc style={{ marginTop: '6px', color: '#94A3B8' }}>AED {Math.round(shortTermNetAnnual).toLocaleString()}/yr net</CompDesc>
          </CompCard>
          <CompCard $type="long">
            <CompType $type="long">📋 Long-Term (Ejari)</CompType>
            <CompYield>{longYield}%</CompYield>
            <CompDesc>Net yield after 8% mgmt fee</CompDesc>
            <CompDesc style={{ marginTop: '6px', color: '#94A3B8' }}>AED {Math.round(longTermNet).toLocaleString()}/yr net</CompDesc>
          </CompCard>
        </CompGrid>

        <WinnerBadge $type={winner}>
          {winner === 'short' ? '🏆 Short-Term Wins by +' : '🏆 Long-Term Wins by +'}{Math.abs(parseFloat(shortYield) - parseFloat(longYield)).toFixed(2)}% yield
        </WinnerBadge>
      </Body>
    </Wrapper>
  );
};
export default ShortVsLongTermYieldComparator;
