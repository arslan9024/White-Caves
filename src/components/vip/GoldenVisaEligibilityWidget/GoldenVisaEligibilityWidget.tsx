import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(245,158,11,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(245,158,11,0.06); border-bottom: 1px solid rgba(245,158,11,0.15); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 16px;`;

const EligCard = styled.div<{ $eligible: boolean }>`
  padding: 20px;
  border-radius: 14px;
  background: ${p => p.$eligible ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'};
  border: 2px solid ${p => p.$eligible ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
  text-align: center;
`;
const EligIcon = styled.div`font-size: 3rem;`;
const EligStatus = styled.div<{ $eligible: boolean }>`font-size: 1rem; font-weight: 900; color: ${p => p.$eligible ? '#10B981' : '#EF4444'}; margin-top: 8px;`;
const EligSub = styled.div`font-size: 0.78rem; color: #64748B; margin-top: 4px;`;

const Slider = styled.input`width: 100%; accent-color: #F59E0B; cursor: pointer;`;
const SliderRow = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const SliderMeta = styled.div`display: flex; justify-content: space-between;`;
const K = styled.span`font-size: 0.78rem; color: #94A3B8; font-weight: 600;`;
const V = styled.span`font-size: 0.8rem; font-weight: 800; color: #F59E0B;`;

const ThresholdBar = styled.div`position: relative; height: 10px; border-radius: 5px; background: rgba(30,41,59,0.8); overflow: visible; margin: 4px 0;`;
const ThresholdFill = styled.div<{ $pct: number }>`position: absolute; left: 0; top: 0; height: 100%; width: ${p => Math.min(p.$pct, 100)}%; border-radius: 5px; background: linear-gradient(90deg, #10B981, #34D399); transition: width 0.5s ease;`;
const ThresholdLine = styled.div<{ $pct: number }>`position: absolute; left: ${p => p.$pct}%; top: -4px; bottom: -4px; width: 2px; background: #F59E0B; border-radius: 1px;`;
const ThresholdLabel = styled.div`position: absolute; right: 0; top: -20px; font-size: 0.62rem; color: #F59E0B; font-weight: 700; transform: translateX(50%); white-space: nowrap;`;

const RequirementsGrid = styled.div`display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;`;
const ReqCard = styled.div<{ $met: boolean }>`
  padding: 12px;
  border-radius: 10px;
  background: ${p => p.$met ? 'rgba(16,185,129,0.07)' : 'rgba(100,116,139,0.07)'};
  border: 1px solid ${p => p.$met ? 'rgba(16,185,129,0.25)' : 'rgba(100,116,139,0.15)'};
`;
const ReqLabel = styled.div`font-size: 0.7rem; color: #64748B;`;
const ReqValue = styled.div<{ $met: boolean }>`font-size: 0.82rem; font-weight: 800; color: ${p => p.$met ? '#10B981' : '#EF4444'}; margin-top: 3px; display: flex; align-items: center; gap: 4px;`;

export const GoldenVisaEligibilityWidget: FC = () => {
  const [propertyValue, setPropertyValue] = useState(1_500_000);
  const THRESHOLD = 2_000_000;
  const eligible = propertyValue >= THRESHOLD;
  const pct = (propertyValue / THRESHOLD) * 100;

  return (
    <Wrapper data-testid="golden-visa-eligibility-widget">
      <Header>
        <Title>🇦🇪 UAE Golden Visa Eligibility</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold, #F59E0B)', fontWeight: 700 }}>AED 2M Threshold</div>
      </Header>
      <Body>
        <EligCard $eligible={eligible}>
          <EligIcon>{eligible ? '🏆' : '⚠️'}</EligIcon>
          <EligStatus $eligible={eligible}>{eligible ? '✅ ELIGIBLE FOR GOLDEN VISA' : '❌ BELOW THRESHOLD'}</EligStatus>
          <EligSub>{eligible ? 'Property value meets the AED 2,000,000 requirement' : `AED ${(THRESHOLD - propertyValue).toLocaleString()} more required to qualify`}</EligSub>
        </EligCard>

        <SliderRow>
          <SliderMeta><K>Property Value (AED)</K><V>AED {propertyValue.toLocaleString()}</V></SliderMeta>
          <ThresholdBar>
            <ThresholdFill $pct={pct} />
            <ThresholdLine $pct={100}><ThresholdLabel>AED 2M</ThresholdLabel></ThresholdLine>
          </ThresholdBar>
          <Slider type="range" min={500_000} max={5_000_000} step={50_000} value={propertyValue} onChange={e => setPropertyValue(+e.target.value)} />
        </SliderRow>

        <RequirementsGrid>
          <ReqCard $met={propertyValue >= THRESHOLD}><ReqLabel>Min. Property Value</ReqLabel><ReqValue $met={propertyValue >= THRESHOLD}>{propertyValue >= THRESHOLD ? '✓' : '✗'} AED 2,000,000</ReqValue></ReqCard>
          <ReqCard $met={true}><ReqLabel>Freehold Title Deed</ReqLabel><ReqValue $met={true}>✓ Required</ReqValue></ReqCard>
          <ReqCard $met={true}><ReqLabel>Valid Passport</ReqLabel><ReqValue $met={true}>✓ Required</ReqValue></ReqCard>
          <ReqCard $met={true}><ReqLabel>Health Insurance</ReqLabel><ReqValue $met={true}>✓ Required</ReqValue></ReqCard>
          <ReqCard $met={propertyValue >= THRESHOLD}><ReqLabel>DLD NOC</ReqLabel><ReqValue $met={propertyValue >= THRESHOLD}>{propertyValue >= THRESHOLD ? '✓' : '✗'} Upon Eligibility</ReqValue></ReqCard>
          <ReqCard $met={true}><ReqLabel>Visa Duration</ReqLabel><ReqValue $met={true}>✓ 10 Years</ReqValue></ReqCard>
        </RequirementsGrid>
      </Body>
    </Wrapper>
  );
};
export default GoldenVisaEligibilityWidget;
