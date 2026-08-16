import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.4; }`;

const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const Timeline = styled.div`display: flex; flex-direction: column; gap: 0;`;
const TimelineItem = styled.div<{ $status: 'done' | 'current' | 'pending' }>`
  display: flex; gap: 14px; padding-bottom: 20px; position: relative;
  &:last-child { padding-bottom: 0; }
`;
const TimelineDot = styled.div<{ $status: 'done' | 'current' | 'pending' }>`
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem;
  background: ${p => p.$status === 'done' ? 'rgba(16,185,129,0.2)' : p.$status === 'current' ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.8)'};
  border: 2px solid ${p => p.$status === 'done' ? '#10B981' : p.$status === 'current' ? '#EF4444' : 'rgba(100,116,139,0.3)'};
  animation: ${p => p.$status === 'current' ? pulse : 'none'} 2s ease-in-out infinite;
  position: relative; z-index: 1;
`;
const TimelineLine = styled.div<{ $status: 'done' | 'current' | 'pending' }>`
  position: absolute; left: 15px; top: 32px; bottom: 0; width: 2px;
  background: ${p => p.$status === 'done' ? '#10B981' : 'rgba(100,116,139,0.2)'};
`;
const TimelineContent = styled.div`flex: 1; padding-top: 4px;`;
const TimelineLabel = styled.div<{ $status: 'done' | 'current' | 'pending' }>`
  font-size: 0.82rem; font-weight: 700;
  color: ${p => p.$status === 'done' ? '#10B981' : p.$status === 'current' ? '#EF4444' : '#64748B'};
`;
const TimelineSub = styled.div`font-size: 0.7rem; color: #475569; margin-top: 2px; line-height: 1.4;`;
const TimelineDate = styled.div`font-size: 0.65rem; color: #334155; margin-top: 4px;`;

const SummaryGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;`;
const SCard = styled.div`padding: 12px; border-radius: 10px; background: rgba(15,23,42,0.6); border: 1px solid rgba(100,116,139,0.15); text-align: center;`;
const SVal = styled.div`font-size: 0.95rem; font-weight: 900; color: #EF4444;`;
const SLab = styled.div`font-size: 0.62rem; color: #64748B; margin-top: 2px;`;

const STAGES: Array<{ label: string; sub: string; date: string; status: 'done' | 'current' | 'pending' }> = [
  { label: 'MOU Signed (Memorandum of Understanding)', sub: 'Buyer & Seller sign Form F via RERA DubaiRE app', date: 'Jan 12, 2026', status: 'done' },
  { label: 'Security Deposit Paid (10% or as agreed)', sub: 'Held by agency / trustee during due diligence', date: 'Jan 14, 2026', status: 'done' },
  { label: 'Mortgage Approval / Bank NOC', sub: "Buyer's bank confirms financing — typically 3–4 weeks", date: 'Feb 02, 2026', status: 'done' },
  { label: 'DLD NOC from Developer / OA', sub: "Seller's outstanding service charges cleared", date: 'Feb 15, 2026', status: 'current' },
  { label: 'DLD Transfer Appointment', sub: 'All parties attend DLD / Trustee Office — title deed transferred', date: 'Mar 05, 2026 (est.)', status: 'pending' },
  { label: 'DEWA Ownership Transfer', sub: 'Utility connection transferred in buyer name', date: 'Mar 06, 2026 (est.)', status: 'pending' },
  { label: 'Keys & Handover', sub: 'Buyer receives keys, access cards, and welcome pack', date: 'Mar 07, 2026 (est.)', status: 'pending' },
];

export const ContractTimeline: FC = () => (
  <Wrapper data-testid="contract-timeline">
    <Header>
      <Title>📅 Sale Contract Journey Timeline</Title>
      <div style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700 }}>● Stage 4 of 7</div>
    </Header>
    <Body>
      <SummaryGrid>
        <SCard><SVal>4/7</SVal><SLab>Stages Done</SLab></SCard>
        <SCard><SVal>18d</SVal><SLab>Days Elapsed</SLab></SCard>
        <SCard><SVal>~19d</SVal><SLab>Est. Remaining</SLab></SCard>
      </SummaryGrid>
      <Timeline>
        {STAGES.map((s, i) => (
          <TimelineItem key={i} $status={s.status}>
            {i < STAGES.length - 1 && <TimelineLine $status={s.status} />}
            <TimelineDot $status={s.status}>{s.status === 'done' ? '✓' : s.status === 'current' ? '●' : '○'}</TimelineDot>
            <TimelineContent>
              <TimelineLabel $status={s.status}>{s.label}</TimelineLabel>
              <TimelineSub>{s.sub}</TimelineSub>
              <TimelineDate>📅 {s.date}</TimelineDate>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Body>
  </Wrapper>
);
export default ContractTimeline;
