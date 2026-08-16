/**
 * DepartmentPerformanceRadar — Wave 59 FE-GOAL-035
 * Department manager performance comparison matrix & efficiency radar scoreboard
 * White Caves Real Estate LLC — Dashboard Suite
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
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const DeptCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DName = styled.div`
  font-size: 0.82rem;
  font-weight: 800;
  color: #FFF;
`;

const ScoreBar = styled.div`
  height: 6px;
  background: rgba(100, 116, 139, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ScoreFill = styled.div<{ $pct: number }>`
  width: ${p => p.$pct}%;
  height: 100%;
  background: #10B981;
`;

export const DepartmentPerformanceRadar: FC = () => {
  const depts = [
    { name: 'Secondary Luxury Sales', lead: '@Jaime', score: 94, volume: 'AED 184M' },
    { name: 'Off-Plan & Developer Sales', lead: '@Victoria', score: 98, volume: 'AED 240M' },
    { name: 'VIP & Family Office Desk', lead: '@Ada', score: 99, volume: 'AED 480M' },
    { name: 'Commercial & Logistics', lead: '@Cassie', score: 91, volume: 'AED 95M' },
    { name: 'Leasing & Tenancy (Ejari)', lead: '@Sofia', score: 96, volume: 'AED 42M' },
    { name: 'Facilities & Asset Mgmt', lead: '@Rania', score: 93, volume: 'AED 28M' },
  ];

  return (
    <Wrap data-testid="department-performance-radar">
      <Head>
        <Title>📊 Department Performance & SLA Execution Radar</Title>
        <Tag>MONTHLY SPRINT AUDIT</Tag>
      </Head>
      <Body>
        {depts.map((d, idx) => (
          <DeptCard key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <DName>{d.name}</DName>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10B981' }}>{d.score}%</span>
            </div>
            <ScoreBar>
              <ScoreFill $pct={d.score} />
            </ScoreBar>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94A3B8' }}>
              <span>Lead: {d.lead}</span>
              <span style={{ color: '#FFF', fontWeight: 700 }}>{d.volume}</span>
            </div>
          </DeptCard>
        ))}
      </Body>
    </Wrap>
  );
};

export default DepartmentPerformanceRadar;
