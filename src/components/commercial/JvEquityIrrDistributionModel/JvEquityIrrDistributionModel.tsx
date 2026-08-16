/**
 * JvEquityIrrDistributionModel — Wave 54 GOAL-089
 * Joint Venture (JV) equity split & institutional IRR hurdle waterfall distribution model
 * White Caves Real Estate LLC — Commercial & Advisory Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const WaterfallBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const WCard = styled.div<{ $gp?: boolean }>`
  padding: 14px;
  border-radius: 12px;
  background: ${p => p.$gp ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)'};
  border: 1.5px solid ${p => p.$gp ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const WTitle = styled.div`
  font-size: 0.82rem;
  font-weight: 800;
  color: #FFF;
`;

const WVal = styled.div<{ $gp?: boolean }>`
  font-size: 1.3rem;
  font-weight: 900;
  color: ${p => p.$gp ? '#EF4444' : '#10B981'};
`;

export const JvEquityIrrDistributionModel: FC = () => {
  const [totalEquityAed, setTotalEquityAed] = useState('100000000');
  const [projectExitValueAed, setProjectExitValueAed] = useState('165000000');
  const [lpEquityPct, setLpEquityPct] = useState('80');
  const [gpEquityPct, setGpEquityPct] = useState('20');
  const [prefHurdlePct, setPrefHurdlePct] = useState('10');
  const [gpPromotePct, setGpPromotePct] = useState('20');

  const totalEquity = Number(totalEquityAed) || 1;
  const exitValue = Number(projectExitValueAed) || 0;
  const netProfit = Math.max(0, exitValue - totalEquity);

  const lpShare = Number(lpEquityPct) / 100;
  const gpShare = Number(gpEquityPct) / 100;
  const promote = Number(gpPromotePct) / 100;

  // Waterfall distribution:
  // 1. Return of Capital: LP receives LP share, GP receives GP share
  // 2. Profit Split with Promote: GP gets promote off net profit, remainder pro-rata
  const gpPromoteGain = netProfit * promote;
  const remainingProfit = netProfit - gpPromoteGain;
  const lpProfit = remainingProfit * lpShare;
  const gpProfit = remainingProfit * gpShare + gpPromoteGain;

  const lpTotalReturn = (totalEquity * lpShare) + lpProfit;
  const gpTotalReturn = (totalEquity * gpShare) + gpProfit;

  const lpMoic = (totalEquity * lpShare) > 0 ? (lpTotalReturn / (totalEquity * lpShare)) : 0;
  const gpMoic = (totalEquity * gpShare) > 0 ? (gpTotalReturn / (totalEquity * gpShare)) : 0;

  return (
    <Wrap data-testid="jv-equity-irr-distribution-model">
      <Head>
        <Title>💼 Institutional JV Equity Waterfall & Promote Hurdle Model</Title>
        <Tag>WATERFALL IRR</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Total JV Capital Invested (AED)</FLabel>
            <Input type="number" value={totalEquityAed} onChange={e => setTotalEquityAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Gross Project Exit Realization (AED)</FLabel>
            <Input type="number" value={projectExitValueAed} onChange={e => setProjectExitValueAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>LP Equity Contribution (%)</FLabel>
            <Input type="number" value={lpEquityPct} onChange={e => setLpEquityPct(e.target.value)} />
          </Field>
          <Field>
            <FLabel>GP / Sponsor Contribution (%)</FLabel>
            <Input type="number" value={gpEquityPct} onChange={e => setGpEquityPct(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Preferred Hurdle Rate (% p.a.)</FLabel>
            <Input type="number" value={prefHurdlePct} onChange={e => setPrefHurdlePct(e.target.value)} />
          </Field>
          <Field>
            <FLabel>GP Carried Interest / Promote (%)</FLabel>
            <Input type="number" value={gpPromotePct} onChange={e => setGpPromotePct(e.target.value)} />
          </Field>
        </FormGrid>

        <WaterfallBox>
          <WCard>
            <WTitle>Limited Partner (LP / Capital Investor)</WTitle>
            <WVal>AED {(lpTotalReturn / 1000000).toFixed(2)}M</WVal>
            <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
              MOIC: <strong>{lpMoic.toFixed(2)}x</strong> | Net Profit: AED {(lpProfit / 1000000).toFixed(2)}M
            </div>
          </WCard>

          <WCard $gp>
            <WTitle>General Partner (GP Sponsor / Developer)</WTitle>
            <WVal $gp>AED {(gpTotalReturn / 1000000).toFixed(2)}M</WVal>
            <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
              MOIC: <strong>{gpMoic.toFixed(2)}x</strong> (incl. {gpPromotePct}% Promote: AED {(gpPromoteGain / 1000000).toFixed(2)}M)
            </div>
          </WCard>
        </WaterfallBox>
      </Body>
    </Wrap>
  );
};

export default JvEquityIrrDistributionModel;
