import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between`;

const AgentInfo = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:24px`;
const Avatar = styled.div`width:50px;height:50px;border-radius:25px;background:#8B5CF6;color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.2rem`;

const KPIGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:16px`;
const Card = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);padding:16px;border-radius:12px`;
const CTitle = styled.div`font-size:.7rem;color:#94A3B8;text-transform:uppercase;margin-bottom:8px`;

const ProgWrap = styled.div`display:flex;align-items:center;gap:12px`;
const ProgBar = styled.div`flex:1;height:8px;background:rgba(100,116,139,0.2);border-radius:4px;overflow:hidden`;
const ProgFill = styled.div<{w:number, $good:boolean}>`width:${p=>p.w}%;height:100%;background:${p=>p.$good?'#10B981':'#F59E0B'};border-radius:4px`;
const Pct = styled.div`font-size:.8rem;font-weight:800;color:#E2E8F0;width:35px;text-align:right`;

export const PerformanceReviewDashboard: FC = () => {
  return (
    <Wrap data-testid="performance-review-dashboard">
      <Title><span>📊 Q3 Performance Review</span> <span style={{fontSize:'.75rem',color:'#64748B'}}>Manager View</span></Title>
      
      <AgentInfo>
        <Avatar>IP</Avatar>
        <div>
          <div style={{fontSize:'1.1rem',fontWeight:800,color:'#E2E8F0'}}>Ivan Petrov</div>
          <div style={{fontSize:'.75rem',color:'#94A3B8'}}>Senior Off-Plan Consultant</div>
        </div>
      </AgentInfo>

      <KPIGrid>
        <Card>
          <CTitle>Target: Calls Made (1,500)</CTitle>
          <ProgWrap>
            <ProgBar><ProgFill w={100} $good={true} /></ProgBar>
            <Pct>110%</Pct>
          </ProgWrap>
        </Card>
        <Card>
          <CTitle>Target: Viewings/Meetings (45)</CTitle>
          <ProgWrap>
            <ProgBar><ProgFill w={80} $good={false} /></ProgBar>
            <Pct>80%</Pct>
          </ProgWrap>
        </Card>
        <Card>
          <CTitle>Target: Rev. Generated (AED 3M)</CTitle>
          <ProgWrap>
            <ProgBar><ProgFill w={100} $good={true} /></ProgBar>
            <Pct>140%</Pct>
          </ProgWrap>
        </Card>
      </KPIGrid>
    </Wrap>
  );
};
export default PerformanceReviewDashboard;
