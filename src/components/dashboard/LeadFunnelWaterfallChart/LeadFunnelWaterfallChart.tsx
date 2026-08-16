/**
 * LeadFunnelWaterfallChart — Wave 59 FE-GOAL-038
 * Lead conversion funnel waterfall chart analyzing conversion drop-offs from Ingest to Ejari Closing
 * White Caves Real Estate LLC — Dashboard & Analytics Suite
 */
import React, { FC } from 'react';
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
  gap: 12px;
`;

const FunnelStep = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StageLabel = styled.div`
  min-width: 140px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #E2E8F0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 24px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(100, 116, 139, 0.2);
`;

const BarFill = styled.div<{ $pct: number; $color: string }>`
  width: ${p => p.$pct}%;
  height: 100%;
  background: ${p => p.$color};
  display: flex;
  align-items: center;
  padding-left: 8px;
  font-size: 0.7rem;
  font-weight: 900;
  color: #FFF;
  transition: width 0.8s ease;
`;

const ConversionPct = styled.div`
  min-width: 70px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 800;
  color: #94A3B8;
`;

export const LeadFunnelWaterfallChart: FC = () => {
  const funnel = [
    { stage: '1. Inbound Leads', count: 1248, pct: 100, color: '#38BDF8', conv: '100%' },
    { stage: '2. Qualified (Hot/Warm)', count: 680, pct: 54.5, color: '#818CF8', conv: '54.5%' },
    { stage: '3. Physical Viewings', count: 320, pct: 25.6, color: '#F59E0B', conv: '47.0%' },
    { stage: '4. Form B / Offers', count: 114, pct: 9.1, color: '#EF4444', conv: '35.6%' },
    { stage: '5. Signed & Closed', count: 64, pct: 5.1, color: '#10B981', conv: '56.1%' },
  ];

  return (
    <Wrap data-testid="lead-funnel-waterfall-chart">
      <Head>
        <Title>📊 Sales Pipeline Conversion Funnel & Velocity</Title>
        <Tag>CONVERSION WATERFALL</Tag>
      </Head>
      <Body>
        {funnel.map((f, idx) => (
          <FunnelStep key={idx}>
            <StageLabel>{f.stage}</StageLabel>
            <BarTrack>
              <BarFill $pct={f.pct} $color={f.color}>
                {f.count} Leads
              </BarFill>
            </BarTrack>
            <ConversionPct>{f.conv} Step</ConversionPct>
          </FunnelStep>
        ))}
      </Body>
    </Wrap>
  );
};

export default LeadFunnelWaterfallChart;
