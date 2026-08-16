import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const scan = keyframes`0% { transform: translateY(-100%); } 100% { transform: translateY(400%); }`;

const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 16px;`;

const ScoreCard = styled.div<{ $score: number }>`
  padding: 24px;
  border-radius: 16px;
  background: ${p => p.$score >= 80 ? 'rgba(16,185,129,0.08)' : p.$score >= 60 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'};
  border: 2px solid ${p => p.$score >= 80 ? 'rgba(16,185,129,0.3)' : p.$score >= 60 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'};
  display: flex; align-items: center; gap: 20px;
`;
const ScoreCircle = styled.div<{ $score: number }>`
  width: 80px; height: 80px; border-radius: 50%;
  border: 4px solid ${p => p.$score >= 80 ? '#10B981' : p.$score >= 60 ? '#F59E0B' : '#EF4444'};
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex-shrink: 0;
`;
const ScoreNum = styled.div<{ $score: number }>`font-size: 1.6rem; font-weight: 900; color: ${p => p.$score >= 80 ? '#10B981' : p.$score >= 60 ? '#F59E0B' : '#EF4444'};`;
const ScoreLabel = styled.div`font-size: 0.55rem; color: #64748B; text-align: center;`;
const ScoreInfo = styled.div`flex: 1;`;
const ScoreName = styled.div`font-size: 0.9rem; font-weight: 800; color: #E2E8F0; margin-bottom: 4px;`;
const ScoreTier = styled.div<{ $score: number }>`font-size: 0.75rem; font-weight: 700; color: ${p => p.$score >= 80 ? '#10B981' : p.$score >= 60 ? '#F59E0B' : '#EF4444'}; margin-bottom: 8px;`;
const ScoreDesc = styled.div`font-size: 0.72rem; color: #64748B; line-height: 1.4;`;

const FactorList = styled.div`display: flex; flex-direction: column; gap: 7px;`;
const FactorRow = styled.div`display: flex; align-items: center; gap: 10px;`;
const FactorLabel = styled.div`font-size: 0.72rem; color: #94A3B8; width: 140px; flex-shrink: 0;`;
const FactorTrack = styled.div`flex: 1; height: 6px; background: rgba(30,41,59,0.8); border-radius: 3px; overflow: hidden;`;
const FactorFill = styled.div<{ $pct: number; $color: string }>`height: 100%; width: ${p => p.$pct}%; border-radius: 3px; background: ${p => p.$color}; transition: width 0.5s ease;`;
const FactorVal = styled.div`font-size: 0.7rem; font-weight: 700; color: #CBD5E1; width: 35px; text-align: right;`;

const LEADS = [
  { name: 'Sarah Mitchell', score: 87, tier: 'HOT LEAD', budget: 'AED 3.5M', intent: 88, budget_s: 85, engagement: 92, timeline: 78 },
  { name: 'James Al-Farsi', score: 64, tier: 'WARM LEAD', budget: 'AED 1.8M', intent: 68, budget_s: 60, engagement: 70, timeline: 55 },
  { name: 'Priya Sharma', score: 41, tier: 'COLD LEAD', budget: 'AED 0.9M', intent: 45, budget_s: 38, engagement: 35, timeline: 48 },
];

export const LeadScoringEngine: FC = () => {
  const [selected, setSelected] = useState(0);
  const lead = LEADS[selected];

  return (
    <Wrapper data-testid="lead-scoring-engine">
      <Header>
        <Title>🎯 AI Lead Scoring Engine</Title>
        <div style={{ display: 'flex', gap: '6px' }}>
          {LEADS.map((l, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{ padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(100,116,139,0.3)', background: i === selected ? '#EF4444' : 'transparent', color: i === selected ? '#FFF' : '#64748B', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>
              {l.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </Header>
      <Body>
        <ScoreCard $score={lead.score}>
          <ScoreCircle $score={lead.score}>
            <ScoreNum $score={lead.score}>{lead.score}</ScoreNum>
            <ScoreLabel>/100</ScoreLabel>
          </ScoreCircle>
          <ScoreInfo>
            <ScoreName>{lead.name}</ScoreName>
            <ScoreTier $score={lead.score}>🔴 {lead.tier}</ScoreTier>
            <ScoreDesc>Budget: {lead.budget} · AI-predicted conversion probability based on behavior signals, engagement, and financial capacity.</ScoreDesc>
          </ScoreInfo>
        </ScoreCard>

        <FactorList>
          {[
            { label: 'Purchase Intent', val: lead.intent, color: '#EF4444' },
            { label: 'Budget Capacity', val: lead.budget_s, color: '#F59E0B' },
            { label: 'Engagement Score', val: lead.engagement, color: '#8B5CF6' },
            { label: 'Timeline Urgency', val: lead.timeline, color: '#10B981' },
          ].map(f => (
            <FactorRow key={f.label}>
              <FactorLabel>{f.label}</FactorLabel>
              <FactorTrack><FactorFill $pct={f.val} $color={f.color} /></FactorTrack>
              <FactorVal>{f.val}%</FactorVal>
            </FactorRow>
          ))}
        </FactorList>
      </Body>
    </Wrapper>
  );
};
export default LeadScoringEngine;
