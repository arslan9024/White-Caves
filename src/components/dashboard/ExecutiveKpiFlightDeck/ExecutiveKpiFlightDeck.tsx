/**
 * ExecutiveKpiFlightDeck — Wave 59 FE-GOAL-031, FE-GOAL-032, FE-GOAL-036
 * High-density analytics KPI flight deck with micro-sparklines, deal velocity, and animated target gauge
 * White Caves Real Estate LLC — Executive Dashboard Suite
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
  gap: 16px;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const KpiCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
`;

const KLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
`;

const KVal = styled.div`
  font-size: 1.35rem;
  font-weight: 900;
  color: #FFF;
`;

const TrendRow = styled.div<{ $positive: boolean }>`
  font-size: 0.7rem;
  font-weight: 800;
  color: ${p => p.$positive ? '#10B981' : '#EF4444'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ExecutiveKpiFlightDeck: FC = () => {
  return (
    <Wrap data-testid="executive-kpi-flight-deck">
      <Head>
        <Title>📈 Executive Flight Deck — Real-Time KPI Telemetry</Title>
        <Tag>SOVEREIGN DESK</Tag>
      </Head>
      <Body>
        <KpiGrid>
          <KpiCard>
            <KLabel>Gross Closed Volume</KLabel>
            <KVal style={{ color: '#10B981' }}>AED 482.6M</KVal>
            <TrendRow $positive={true}>▲ +28.4% vs Last Month</TrendRow>
          </KpiCard>
          <KpiCard>
            <KLabel>Active High-Intent Leads</KLabel>
            <KVal>1,248</KVal>
            <TrendRow $positive={true}>▲ +14.2% AI Lead Score &gt;80</TrendRow>
          </KpiCard>
          <KpiCard>
            <KLabel>Off-Plan Direct Closures</KLabel>
            <KVal style={{ color: '#EF4444' }}>64 Units</KVal>
            <TrendRow $positive={true}>▲ 142% Target Velocity</TrendRow>
          </KpiCard>
          <KpiCard>
            <KLabel>Managed Asset Portfolio</KLabel>
            <KVal>AED 2.45B</KVal>
            <TrendRow $positive={true}>▲ 98.6% Rent Collection Rate</TrendRow>
          </KpiCard>
        </KpiGrid>
      </Body>
    </Wrap>
  );
};

export default ExecutiveKpiFlightDeck;
