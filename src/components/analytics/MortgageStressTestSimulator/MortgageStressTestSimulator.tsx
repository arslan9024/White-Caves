import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;
const Grid2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px;`;
const SliderRow = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const SliderMeta = styled.div`display: flex; justify-content: space-between;`;
const SliderKey = styled.span`font-size: 0.78rem; color: #94A3B8; font-weight: 600;`;
const SliderVal = styled.span`font-size: 0.8rem; font-weight: 800; color: #EF4444;`;
const Range = styled.input`width: 100%; accent-color: #EF4444; cursor: pointer;`;

const StressChart = styled.div`display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 12px; background: rgba(15,23,42,0.7); border: 1px solid rgba(100,116,139,0.15);`;
const ChartTitle = styled.div`font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em;`;
const ScenarioRow = styled.div<{ $type: 'base' | 'stress' | 'severe' }>`display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 7px; background: ${p => ({ base: 'rgba(16,185,129,0.07)', stress: 'rgba(245,158,11,0.07)', severe: 'rgba(239,68,68,0.07)' }[p.$type])};`;
const ScLabel = styled.div`font-size: 0.72rem; font-weight: 700; color: #94A3B8;`;
const ScValue = styled.div<{ $type: 'base' | 'stress' | 'severe' }>`font-size: 0.82rem; font-weight: 900; color: ${p => ({ base: '#10B981', stress: '#F59E0B', severe: '#EF4444' }[p.$type])};`;

const AffordCard = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 14px;
  border-radius: 12px; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.18);
`;
const AffordItem = styled.div`text-align: center;`;
const AffordVal = styled.div`font-size: 0.95rem; font-weight: 900; color: #EF4444;`;
const AffordLab = styled.div`font-size: 0.62rem; color: #64748B; margin-top: 2px;`;

export const MortgageStressTestSimulator: FC = () => {
  const [propertyVal, setPropertyVal] = useState(2_000_000);
  const [ltv, setLtv] = useState(75);
  const [baseRate, setBaseRate] = useState(4.5);
  const [income, setIncome] = useState(25_000);

  const loanAmount = propertyVal * (ltv / 100);
  const monthlyBase = (loanAmount * (baseRate / 100 / 12)) / (1 - Math.pow(1 + baseRate / 100 / 12, -300));
  const monthlyStress = (loanAmount * ((baseRate + 3) / 100 / 12)) / (1 - Math.pow(1 + (baseRate + 3) / 100 / 12, -300));
  const monthlySevere = (loanAmount * ((baseRate + 7) / 100 / 12)) / (1 - Math.pow(1 + (baseRate + 7) / 100 / 12, -300));

  const dtiBase = ((monthlyBase / income) * 100).toFixed(1);
  const dtiStress = ((monthlyStress / income) * 100).toFixed(1);
  const dtiSevere = ((monthlySevere / income) * 100).toFixed(1);

  return (
    <Wrapper data-testid="mortgage-stress-test-simulator">
      <Header>
        <Title>📊 Mortgage Stress Test Simulator</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)' }}>CBUAE Stress Model</div>
      </Header>
      <Body>
        <SliderRow>
          <SliderMeta><SliderKey>Property Value (AED)</SliderKey><SliderVal>AED {propertyVal.toLocaleString()}</SliderVal></SliderMeta>
          <Range type="range" min={500_000} max={10_000_000} step={100_000} value={propertyVal} onChange={e => setPropertyVal(+e.target.value)} />
        </SliderRow>
        <Grid2>
          <SliderRow>
            <SliderMeta><SliderKey>LTV %</SliderKey><SliderVal>{ltv}%</SliderVal></SliderMeta>
            <Range type="range" min={30} max={80} step={5} value={ltv} onChange={e => setLtv(+e.target.value)} />
          </SliderRow>
          <SliderRow>
            <SliderMeta><SliderKey>Base Rate %</SliderKey><SliderVal>{baseRate}%</SliderVal></SliderMeta>
            <Range type="range" min={2} max={10} step={0.25} value={baseRate} onChange={e => setBaseRate(+e.target.value)} />
          </SliderRow>
        </Grid2>
        <SliderRow>
          <SliderMeta><SliderKey>Monthly Household Income (AED)</SliderKey><SliderVal>AED {income.toLocaleString()}</SliderVal></SliderMeta>
          <Range type="range" min={5_000} max={100_000} step={1_000} value={income} onChange={e => setIncome(+e.target.value)} />
        </SliderRow>

        <AffordCard>
          <AffordItem><AffordVal>AED {Math.round(loanAmount / 1000)}k</AffordVal><AffordLab>Loan Amount</AffordLab></AffordItem>
          <AffordItem><AffordVal>AED {Math.round(monthlyBase).toLocaleString()}</AffordVal><AffordLab>Monthly Base</AffordLab></AffordItem>
          <AffordItem><AffordVal>{dtiBase}%</AffordVal><AffordLab>DTI Ratio</AffordLab></AffordItem>
        </AffordCard>

        <StressChart>
          <ChartTitle>Stress Scenarios</ChartTitle>
          <ScenarioRow $type="base">
            <ScLabel>🟢 Base Rate ({baseRate}%)</ScLabel>
            <ScValue $type="base">AED {Math.round(monthlyBase).toLocaleString()}/mo — DTI {dtiBase}%</ScValue>
          </ScenarioRow>
          <ScenarioRow $type="stress">
            <ScLabel>🟡 +3% Stress ({(baseRate + 3).toFixed(2)}%)</ScLabel>
            <ScValue $type="stress">AED {Math.round(monthlyStress).toLocaleString()}/mo — DTI {dtiStress}%</ScValue>
          </ScenarioRow>
          <ScenarioRow $type="severe">
            <ScLabel>🔴 +7% Severe ({(baseRate + 7).toFixed(2)}%)</ScLabel>
            <ScValue $type="severe">AED {Math.round(monthlySevere).toLocaleString()}/mo — DTI {dtiSevere}%</ScValue>
          </ScenarioRow>
        </StressChart>
      </Body>
    </Wrapper>
  );
};
export default MortgageStressTestSimulator;
