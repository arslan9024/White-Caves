import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px`;
const TitleBox = styled.div``;
const Title = styled.h2`margin:0 0 4px;font-size:1.4rem;font-weight:900;color:#E2E8F0`;
const DevName = styled.div`font-size:.85rem;color:#38BDF8;font-weight:700`;

const LaunchBadge = styled.div`background:linear-gradient(90deg,#F43F5E,#EC4899);color:#FFF;padding:8px 16px;border-radius:8px;font-weight:800;font-size:.8rem;text-align:center`;

const KPIGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:16px`;
const Card = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);padding:16px;border-radius:12px`;
const CVal = styled.div`font-size:1.4rem;font-weight:900;color:#E2E8F0`;
const CLab = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px;text-transform:uppercase;letter-spacing:1px`;

export const OffPlanProjectDashboard: FC = () => {
  return (
    <Wrap data-testid="offplan-project-dashboard">
      <Header>
        <TitleBox>
          <Title>Oasis Towers (Phase 1)</Title>
          <DevName>by Emaar Properties</DevName>
        </TitleBox>
        <LaunchBadge>
          <div style={{fontSize:'.6rem',textTransform:'uppercase',opacity:0.9}}>Launch In</div>
          <div style={{fontSize:'1.1rem'}}>14d : 08h : 42m</div>
        </LaunchBadge>
      </Header>
      
      <KPIGrid>
        <Card><CVal>340</CVal><CLab>Total Units</CLab></Card>
        <Card><CVal style={{color:'#10B981'}}>AED 1.2M</CVal><CLab>Starting Price</CLab></Card>
        <Card><CVal>Q4 2027</CVal><CLab>Expected Handover</CLab></Card>
        <Card><CVal style={{color:'#F59E0B'}}>8.5%</CVal><CLab>Expected Est. ROI</CLab></Card>
      </KPIGrid>
    </Wrap>
  );
};
export default OffPlanProjectDashboard;
