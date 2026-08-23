import React, { FC, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;

const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 16px;`;

const SliderGroup = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const SliderLabel = styled.div`display: flex; justify-content: space-between; align-items: center;`;
const SliderKey = styled.span`font-size: 0.78rem; color: #94A3B8; font-weight: 600;`;
const SliderVal = styled.span`font-size: 0.8rem; color: #EF4444; font-weight: 800;`;

const Range = styled.input`width: 100%; accent-color: #EF4444; height: 4px; cursor: pointer;`;

const RiskMeter = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15,23,42,0.8);
  border: 1px solid rgba(239,68,68,0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RiskLabel = styled.div`font-size: 0.75rem; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;`;

const RiskTrack = styled.div`height: 10px; background: rgba(30,41,59,0.8); border-radius: 5px; overflow: hidden;`;
const RiskFill = styled.div<{ $pct: number; $level: 'low' | 'medium' | 'high' }>`
  height: 100%;
  width: ${p => p.$pct}%;
  border-radius: 5px;
  background: ${p => p.$level === 'low' ? 'linear-gradient(90deg,#10B981,#34D399)' : p.$level === 'medium' ? 'linear-gradient(90deg,#F59E0B,#FBBF24)' : 'linear-gradient(90deg,#EF4444,#F97316)'};
  transition: width 0.5s ease;
`;

const RiskValue = styled.div<{ $level: 'low' | 'medium' | 'high' }>`
  font-size: 1.4rem;
  font-weight: 900;
  color: ${p => p.$level === 'low' ? '#10B981' : p.$level === 'medium' ? '#F59E0B' : '#EF4444'};
`;

const RiskLabel2 = styled.div<{ $level: 'low' | 'medium' | 'high' }>`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${p => p.$level === 'low' ? '#10B981' : p.$level === 'medium' ? '#F59E0B' : '#EF4444'};
`;

const Grid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const Card = styled.div`padding: 12px; border-radius: 10px; background: rgba(15,23,42,0.6); border: 1px solid rgba(100,116,139,0.15);`;
const CardLabel = styled.div`font-size: 0.68rem; color: #64748B; margin-bottom: 4px;`;
const CardValue = styled.div`font-size: 0.88rem; font-weight: 800; color: #CBD5E1;`;

export const OffPlanRiskCalculator: FC = () => {
  const [developerReputation, setDeveloperReputation] = useState(75);
  const [constructionProgress, setConstructionProgress] = useState(40);
  const [marketConditions, setMarketConditions] = useState(60);
  const [handoverDelay, setHandoverDelay] = useState(6);

  const riskScore = Math.round(
    100 - ((developerReputation * 0.35) + (constructionProgress * 0.3) + (marketConditions * 0.2) + ((24 - handoverDelay) / 24 * 100 * 0.15))
  );
  const level = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';

  return (
    <Wrapper data-testid="offplan-risk-calculator">
      <Header>
        <Title>⚠️ Off-Plan Completion Risk Calculator</Title>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)' }}>AEGIS Risk Engine v2</div>
      </Header>
      <Body>
        <SliderGroup>
          <SliderLabel><SliderKey>Developer Reputation Score</SliderKey><SliderVal>{developerReputation}%</SliderVal></SliderLabel>
          <Range type="range" min={0} max={100} value={developerReputation} onChange={e => setDeveloperReputation(+e.target.value)} />
        </SliderGroup>
        <SliderGroup>
          <SliderLabel><SliderKey>Construction Progress</SliderKey><SliderVal>{constructionProgress}%</SliderVal></SliderLabel>
          <Range type="range" min={0} max={100} value={constructionProgress} onChange={e => setConstructionProgress(+e.target.value)} />
        </SliderGroup>
        <SliderGroup>
          <SliderLabel><SliderKey>Market Conditions Index</SliderKey><SliderVal>{marketConditions}%</SliderVal></SliderLabel>
          <Range type="range" min={0} max={100} value={marketConditions} onChange={e => setMarketConditions(+e.target.value)} />
        </SliderGroup>
        <SliderGroup>
          <SliderLabel><SliderKey>Expected Delay (months)</SliderKey><SliderVal>{handoverDelay}m</SliderVal></SliderLabel>
          <Range type="range" min={0} max={24} value={handoverDelay} onChange={e => setHandoverDelay(+e.target.value)} />
        </SliderGroup>

        <RiskMeter>
          <RiskLabel>Composite Risk Score</RiskLabel>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <RiskValue $level={level}>{riskScore}</RiskValue>
            <RiskLabel2 $level={level}>{level === 'low' ? '✅ LOW RISK' : level === 'medium' ? '⚠️ MEDIUM RISK' : '🔴 HIGH RISK'}</RiskLabel2>
          </div>
          <RiskTrack><RiskFill $pct={riskScore} $level={level} /></RiskTrack>
        </RiskMeter>

        <Grid>
          <Card><CardLabel>Developer Delay Variance</CardLabel><CardValue>+{handoverDelay} months</CardValue></Card>
          <Card><CardLabel>Recommended Action</CardLabel><CardValue style={{ fontSize: '0.75rem' }}>{level === 'low' ? 'Proceed ✅' : level === 'medium' ? 'Review ⚠️' : 'Avoid 🛑'}</CardValue></Card>
        </Grid>
      </Body>
    </Wrapper>
  );
};
export default OffPlanRiskCalculator;
