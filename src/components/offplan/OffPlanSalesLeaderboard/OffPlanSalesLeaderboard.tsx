/**
 * OffPlanSalesLeaderboard — Wave 53 GOAL-078
 * Off-plan sales agent leaderboard with real-time target gauges & commission velocity
 * White Caves Real Estate LLC — Off-Plan & Commercial Sales Suite
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

const AgentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AgentRow = styled.div<{ $rank: number }>`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${p => p.$rank === 1 ? 'rgba(239, 68, 68, 0.1)' : p.$rank === 2 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$rank === 1 ? 'rgba(239, 68, 68, 0.4)' : p.$rank === 2 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${p => p.$rank === 1 ? '#EF4444' : p.$rank === 2 ? '#F59E0B' : '#334155'};
  color: #FFF;
  font-size: 0.8rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AName = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
`;

const AMeta = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const RightSection = styled.div`
  text-align: right;
`;

const VolVal = styled.div`
  font-size: 0.95rem;
  font-weight: 900;
  color: #10B981;
`;

const TargetPct = styled.div<{ $over: boolean }>`
  font-size: 0.7rem;
  font-weight: 800;
  color: ${p => p.$over ? '#10B981' : '#EF4444'};
`;

export const OffPlanSalesLeaderboard: FC = () => {
  const [agents, setAgents] = useState([
    { rank: 1, name: 'Arsalan Malik', volumeAed: 142000000, units: 14, targetPct: 189, tier: 'Diamond Pinnacle' },
    { rank: 2, name: 'Sarah Connor', volumeAed: 78500000, units: 8, targetPct: 131, tier: 'Platinum Tier' },
    { rank: 3, name: 'Tariq Mansour', volumeAed: 52000000, units: 6, targetPct: 104, tier: 'Gold Tier' },
    { rank: 4, name: 'Elena Rostova', volumeAed: 44000000, units: 4, targetPct: 88, tier: 'Silver Tier' },
  ]);

  return (
    <Wrap data-testid="off-plan-sales-leaderboard">
      <Head>
        <Title>🏆 Off-Plan Sales Leaderboard & Target Gauge Cockpit</Title>
        <Tag>MONTHLY SALES SPRINT</Tag>
      </Head>
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Total Sprint Volume</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-green, #10B981)' }}>AED 316.5M</div>
          </div>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Units Closed</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--white, #FFF)' }}>32 Units</div>
          </div>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Target Attainment</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-red, #EF4444)' }}>142% Over</div>
          </div>
        </div>

        <AgentList>
          {agents.map(a => (
            <AgentRow key={a.rank} $rank={a.rank}>
              <LeftSection>
                <RankBadge $rank={a.rank}>#{a.rank}</RankBadge>
                <div>
                  <AName>{a.name}</AName>
                  <AMeta>{a.units} Units Closed | {a.tier}</AMeta>
                </div>
              </LeftSection>
              <RightSection>
                <VolVal>AED {(a.volumeAed / 1000000).toFixed(1)}M</VolVal>
                <TargetPct $over={a.targetPct >= 100}>{a.targetPct}% of Monthly Target</TargetPct>
              </RightSection>
            </AgentRow>
          ))}
        </AgentList>
      </Body>
    </Wrap>
  );
};

export default OffPlanSalesLeaderboard;
