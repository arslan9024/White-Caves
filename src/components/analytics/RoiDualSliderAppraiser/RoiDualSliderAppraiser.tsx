import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`;

const Wrapper = styled.div`
  width: 100%;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02);
  border-radius: 20px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const Header = styled.div`
  padding: 18px 24px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.03), rgba(250, 250, 250, 1));
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #0f0f0f;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Body = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const SliderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SliderMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const SliderKey = styled.span`
  font-size: 0.85rem;
  color: #64748B;
  font-weight: 600;
`;

const SliderVal = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
  color: #C5A059;
`;

const Range = styled.input`
  width: 100%;
  accent-color: #D4AF37;
  cursor: pointer;
  height: 6px;
  border-radius: 3px;
  background: #E2E8F0;
  outline: none;
  transition: all 0.2s ease;
  &:hover {
    accent-color: #C5A059;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const CompCard = styled.div<{ $type: 'rental' | 'capital' }>`
  padding: 20px;
  border-radius: 16px;
  background: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
    border-color: ${p => p.$type === 'rental' ? 'rgba(16,185,129,0.15)' : 'rgba(212,175,55,0.15)'};
  }
`;

const CompType = styled.div<{ $type: 'rental' | 'capital' }>`
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${p => p.$type === 'rental' ? '#10B981' : '#C5A059'};
`;

const CompValue = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  color: #0f0f0f;
  letter-spacing: -0.03em;
`;

const CompLabel = styled.div`
  font-size: 0.75rem;
  color: #94A3B8;
  font-weight: 500;
`;

const CompBar = styled.div`
  height: 6px;
  background: #F1F5F9;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

const CompBarFill = styled.div<{ $pct: number; $type: 'rental' | 'capital' }>`
  height: 100%;
  width: ${p => p.$pct}%;
  border-radius: 3px;
  background: ${p => p.$type === 'rental' ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #D4AF37, #C5A059)'};
  transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const ROICard = styled.div`
  padding: 20px 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0f0f0f, #1e293b);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 32px rgba(15, 15, 15, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

const ROILabel = styled.div`
  font-size: 0.9rem;
  color: #CBD5E1;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const ROIValue = styled.div`
  font-size: 1.7rem;
  font-weight: 900;
  color: #D4AF37;
  letter-spacing: -0.02em;
`;

export const RoiDualSliderAppraiser: FC = () => {
  const [propertyValue, setPropertyValue] = useState(2_000_000);
  const [annualRent, setAnnualRent] = useState(120_000);
  const [annualAppreciation, setAnnualAppreciation] = useState(8);
  const [holdPeriod, setHoldPeriod] = useState(5);

  const rentalYield = ((annualRent / propertyValue) * 100).toFixed(2);
  const capitalGain = (propertyValue * Math.pow(1 + annualAppreciation / 100, holdPeriod) - propertyValue).toLocaleString('en-AE', { maximumFractionDigits: 0 });
  const totalROI = (parseFloat(rentalYield) * holdPeriod + annualAppreciation * holdPeriod).toFixed(1);

  return (
    <Wrapper data-testid="roi-dual-slider-appraiser">
      <Header>
        <Title>
          <span role="img" aria-label="chart">💹</span>
          Rental Yield vs Capital Appreciation
        </Title>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>ROI Appraiser</div>
      </Header>
      <Body>
        <SliderRow>
          <SliderMeta><SliderKey>Property Value (AED)</SliderKey><SliderVal>AED {propertyValue.toLocaleString()}</SliderVal></SliderMeta>
          <Range type="range" min={500_000} max={10_000_000} step={100_000} value={propertyValue} onChange={e => setPropertyValue(+e.target.value)} />
        </SliderRow>
        <SliderRow>
          <SliderMeta><SliderKey>Annual Rent Income (AED)</SliderKey><SliderVal>AED {annualRent.toLocaleString()}</SliderVal></SliderMeta>
          <Range type="range" min={30_000} max={500_000} step={5_000} value={annualRent} onChange={e => setAnnualRent(+e.target.value)} />
        </SliderRow>
        <SliderRow>
          <SliderMeta><SliderKey>Annual Capital Appreciation (%)</SliderKey><SliderVal>{annualAppreciation}%</SliderVal></SliderMeta>
          <Range type="range" min={0} max={25} step={0.5} value={annualAppreciation} onChange={e => setAnnualAppreciation(+e.target.value)} />
        </SliderRow>
        <SliderRow>
          <SliderMeta><SliderKey>Hold Period (years)</SliderKey><SliderVal>{holdPeriod} yrs</SliderVal></SliderMeta>
          <Range type="range" min={1} max={15} value={holdPeriod} onChange={e => setHoldPeriod(+e.target.value)} />
        </SliderRow>

        <ComparisonGrid>
          <CompCard $type="rental">
            <CompType $type="rental">Rental Yield</CompType>
            <CompValue>{rentalYield}%</CompValue>
            <CompLabel>Annual gross yield</CompLabel>
            <CompBar><CompBarFill $pct={Math.min(parseFloat(rentalYield) * 10, 100)} $type="rental" /></CompBar>
          </CompCard>
          <CompCard $type="capital">
            <CompType $type="capital">Capital Gain ({holdPeriod}yr)</CompType>
            <CompValue style={{ fontSize: '1.2rem' }}>AED {capitalGain}</CompValue>
            <CompLabel>{annualAppreciation}% p.a. appreciation</CompLabel>
            <CompBar><CompBarFill $pct={Math.min(annualAppreciation * 4, 100)} $type="capital" /></CompBar>
          </CompCard>
        </ComparisonGrid>

        <ROICard>
          <ROILabel>Total {holdPeriod}-Year ROI</ROILabel>
          <ROIValue>{totalROI}%</ROIValue>
        </ROICard>
      </Body>
    </Wrapper>
  );
};
export default RoiDualSliderAppraiser;
