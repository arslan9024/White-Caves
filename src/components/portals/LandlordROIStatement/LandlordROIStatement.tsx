import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;padding:32px;color:#FFF;box-shadow:0 20px 40px rgba(0,0,0,0.4)`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:32px`;
const Title = styled.h2`margin:0;font-size:1.6rem;font-weight:900`;

const StatGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px`;
const StatCard = styled.div`background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);padding:24px;border-radius:16px`;
const SVal = styled.div`font-size:2rem;font-weight:900;color:#38BDF8;margin-bottom:4px`;
const SLab = styled.div`font-size:.8rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px`;

const BreakdownBox = styled.div`background:rgba(0,0,0,0.3);border-radius:16px;padding:24px`;
const Row = styled.div`display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);&:last-child{border:none;padding-bottom:0}`;
const RLabel = styled.div`color:#E2E8F0;font-size:.9rem`;
const RVal = styled.div<{$type?:'neg'|'pos'}>`font-weight:800;color:${p=>p.$type==='neg'?'#EF4444':p.$type==='pos'?'#10B981':'#FFF'}`;

export const LandlordROIStatement: FC = () => {
  return (
    <Wrap data-testid="landlord-roi-statement">
      <Header>
        <Title>Investment Portfolio (YTD)</Title>
        <div style={{color:'#10B981',background:'rgba(16,185,129,0.1)',padding:'8px 16px',borderRadius:'8px',fontWeight:700}}>
          Portfolio Health: Excellent
        </div>
      </Header>

      <StatGrid>
        <StatCard><SVal>AED 240K</SVal><SLab>Gross Rental Income</SLab></StatCard>
        <StatCard><SVal style={{color:'#10B981'}}>7.2%</SVal><SLab>Net Yield (ROI)</SLab></StatCard>
        <StatCard><SVal style={{color:'#FFF'}}>100%</SVal><SLab>Occupancy Rate</SLab></StatCard>
      </StatGrid>

      <BreakdownBox>
        <div style={{fontSize:'1.1rem',fontWeight:800,marginBottom:16}}>Financial Breakdown (2 Properties)</div>
        <Row><RLabel>Gross Rent Collected</RLabel><RVal>AED 240,000</RVal></Row>
        <Row><RLabel>Property Management Fees (5%)</RLabel><RVal $type="neg">- AED 12,000</RVal></Row>
        <Row><RLabel>Service Charges (DLD)</RLabel><RVal $type="neg">- AED 28,500</RVal></Row>
        <Row><RLabel>Maintenance / Repairs</RLabel><RVal $type="neg">- AED 3,200</RVal></Row>
        <Row style={{marginTop:12,paddingTop:20,borderTop:'1px solid rgba(255,255,255,0.2)'}}>
          <RLabel style={{fontSize:'1.1rem',fontWeight:800}}>Net Income Remitted</RLabel>
          <RVal $type="pos" style={{fontSize:'1.2rem'}}>AED 196,300</RVal>
        </Row>
      </BreakdownBox>
    </Wrap>
  );
};
export default LandlordROIStatement;
