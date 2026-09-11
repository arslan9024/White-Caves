import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.95);border:1px solid rgba(100,116,139,0.2);border-radius:24px;overflow:hidden;padding:32px;color:#FFF`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:32px`;
const Title = styled.h2`margin:0;font-size:1.4rem;font-weight:900;color:#F8FAFC`;
const DateBadge = styled.div`padding:8px 16px;background:rgba(255,255,255,0.05);border-radius:20px;font-size:.85rem;color:#94A3B8;font-weight:700`;

const KPIGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:16px`;
const Card = styled.div`background:linear-gradient(180deg,rgba(30,41,59,0.6),rgba(15,23,42,0.8));border:1px solid rgba(255,255,255,0.05);padding:24px;border-radius:16px;position:relative;overflow:hidden`;

const CVal = styled.div`font-size:2rem;font-weight:900;margin-bottom:8px;color:#38BDF8`;
const CLabel = styled.div`font-size:.75rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;font-weight:800`;
const CTrend = styled.div<{$up:boolean}>`font-size:.8rem;font-weight:800;color:${p=>p.$up?'#10B981':'#EF4444'};margin-top:12px;display:flex;align-items:center;gap:4px`;

export const ExecutiveSummaryDashboard: FC = () => {
  return (
    <Wrap data-testid="executive-summary-dashboard">
      <Header>
        <Title>📈 Executive Command Center</Title>
        <DateBadge>Q3 2026 (YTD)</DateBadge>
      </Header>

      <KPIGrid>
        <Card>
          <CVal>AED 14.2M</CVal>
          <CLabel>Gross Commission (GCI)</CLabel>
          <CTrend $up={true}>↑ 24% vs last quarter</CTrend>
        </Card>
        
        <Card>
          <CVal style={{color:'#10B981'}}>312</CVal>
          <CLabel>Total Deals Closed</CLabel>
          <CTrend $up={true}>↑ 12% vs last quarter</CTrend>
        </Card>

        <Card>
          <CVal style={{color:'#F59E0B'}}>AED 240M</CVal>
          <CLabel>Active Pipeline Value</CLabel>
          <CTrend $up={false}>↓ 2% vs last quarter</CTrend>
        </Card>

        <Card>
          <CVal style={{color:'#A855F7'}}>84</CVal>
          <CLabel>Active Agents</CLabel>
          <CTrend $up={true}>↑ 5 New Hires</CTrend>
        </Card>
      </KPIGrid>
    </Wrap>
  );
};
export default ExecutiveSummaryDashboard;
