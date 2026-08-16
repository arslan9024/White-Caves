/**
 * CareerMilestoneTimeline — Wave 58 FE-GOAL-024
 * Interactive corporate growth milestone timeline tracing achievements from 2024 to 2026 Sovereign OS
 * White Caves Real Estate LLC — Sovereign Profile Suite
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

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: 14px;
    width: 2px;
    background: rgba(239, 68, 68, 0.3);
  }
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
`;

const Dot = styled.div<{ $current?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${p => p.$current ? '#EF4444' : '#1E293B'};
  border: 2px solid #EF4444;
  margin-top: 4px;
  z-index: 1;
  box-shadow: ${p => p.$current ? '0 0 10px #EF4444' : 'none'};
`;

const Content = styled.div`
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
`;

const MDate = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  text-transform: uppercase;
`;

const MTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
  margin-top: 2px;
`;

const MDesc = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
  margin-top: 4px;
`;

export const CareerMilestoneTimeline: FC = () => {
  const milestones = [
    { date: 'August 2026', title: 'AEGIS Sovereign OS V3.0 Complete', desc: '100 enterprise domain goals deployed across 10 strategic waves with zero-trust security.', current: true },
    { date: 'Q1 2026', title: 'AED 500M+ Transaction Volume Milestone', desc: 'Closed major off-market private beachfront villa transactions on Palm Jumeirah & Emirates Hills.' },
    { date: 'Q3 2025', title: 'AI Valuation & Nina Conversational Suite', desc: 'Deployed multi-model Nina NLP chatbot & DLD regression valuation models.' },
    { date: 'Q1 2025', title: 'Commercial Freehold Advisory Expansion', desc: 'Established Institutional Capital & JV development advisory practice in Business Bay.' },
    { date: 'August 2024', title: 'White Caves Real Estate LLC Inception', desc: 'Registered with Dubai Economic Department (License 1388443) and RERA (ORN 44483).' },
  ];

  return (
    <Wrap data-testid="career-milestone-timeline">
      <Head>
        <Title>📈 Corporate Growth & Strategic Milestones (2024–2026)</Title>
        <Tag>SOVEREIGN TRACK RECORD</Tag>
      </Head>
      <Body>
        <TimelineList>
          {milestones.map((m, idx) => (
            <TimelineItem key={idx}>
              <Dot $current={m.current} />
              <Content>
                <MDate>{m.date}</MDate>
                <MTitle>{m.title}</MTitle>
                <MDesc>{m.desc}</MDesc>
              </Content>
            </TimelineItem>
          ))}
        </TimelineList>
      </Body>
    </Wrap>
  );
};

export default CareerMilestoneTimeline;
