import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const ProgBarContainer = styled.div`width:100%;height:12px;background:rgba(100,116,139,0.2);border-radius:6px;margin-bottom:24px;overflow:hidden`;
const ProgFill = styled.div<{w:number}>`width:${p=>p.w}%;height:100%;background:linear-gradient(90deg,#38BDF8,#8B5CF6);border-radius:6px`;

const PhaseGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px`;
const PhaseCard = styled.div<{$done:boolean}>`background:rgba(30,41,59,0.5);border:1px solid ${p=>p.$done?'rgba(16,185,129,0.4)':'rgba(100,116,139,0.3)'};border-radius:12px;padding:16px`;
const PTitle = styled.div<{$done:boolean}>`font-size:.85rem;font-weight:800;color:${p=>p.$done?'#10B981':'#E2E8F0'};margin-bottom:4px`;
const PDesc = styled.div`font-size:.7rem;color:#94A3B8`;

export const ConstructionProgressTracker: FC = () => {
  return (
    <Wrap data-testid="construction-progress-tracker">
      <Title>🏗️ Construction Progress Tracker (45%)</Title>
      
      <ProgBarContainer><ProgFill w={45} /></ProgBarContainer>

      <PhaseGrid>
        <PhaseCard $done={true}>
          <PTitle $done={true}>✅ Foundation & Enabling</PTitle>
          <PDesc>Completed: Excavation, shoring, piling.</PDesc>
        </PhaseCard>
        <PhaseCard $done={true}>
          <PTitle $done={true}>✅ Substructure</PTitle>
          <PDesc>Completed: Basement levels, podium parking.</PDesc>
        </PhaseCard>
        <PhaseCard $done={false}>
          <PTitle $done={false}>🚧 Superstructure</PTitle>
          <PDesc>In Progress: Reached Floor 12 of 34.</PDesc>
        </PhaseCard>
        <PhaseCard $done={false} style={{opacity:0.5}}>
          <PTitle $done={false}>MEP & Finishes</PTitle>
          <PDesc>Pending: Mechanical, electrical, interior.</PDesc>
        </PhaseCard>
      </PhaseGrid>
    </Wrap>
  );
};
export default ConstructionProgressTracker;
