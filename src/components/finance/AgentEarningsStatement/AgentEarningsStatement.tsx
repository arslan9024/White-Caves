import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 4px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;
const Sub = styled.div`font-size:.75rem;color:#94A3B8;margin-bottom:24px`;

const MainCard = styled.div`background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(59,130,246,0.1));border:1px solid rgba(16,185,129,0.3);border-radius:14px;padding:20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:24px`;
const NetPay = styled.div`font-size:2.2rem;font-weight:900;color:#10B981`;
const NetLab = styled.div`font-size:.7rem;color:#64748B;text-transform:uppercase;font-weight:700;letter-spacing:1px`;
const CTA = styled.button`padding:10px 16px;background:#3B82F6;color:#FFF;border:none;border-radius:8px;font-weight:700;font-size:.8rem;cursor:pointer`;

const Row = styled.div`display:flex;justify-content:space-between;padding:12px 16px;background:rgba(30,41,59,0.5);border-radius:8px;margin-bottom:8px;align-items:center`;
const RLabel = styled.div`font-size:.8rem;color:#CBD5E1;font-weight:600`;
const RVal = styled.div<{$color?:string}>`font-size:.85rem;font-weight:800;color:${p=>p.$color||'#E2E8F0'}`;

export const AgentEarningsStatement: FC = () => {
  return (
    <Wrap data-testid="agent-earnings-statement">
      <Title>📄 Agent Earnings Statement</Title>
      <Sub>Period: September 2026 | Agent: Victoria Chen</Sub>

      <MainCard>
        <div>
          <NetLab>Net Pay (AED)</NetLab>
          <NetPay>42,500.00</NetPay>
        </div>
        <CTA>Download PDF</CTA>
      </MainCard>

      <Row>
        <RLabel>Gross Commission (4 Deals)</RLabel>
        <RVal>120,000.00</RVal>
      </Row>
      <Row>
        <RLabel>Company Split (40%)</RLabel>
        <RVal $color="#EF4444">- 48,000.00</RVal>
      </Row>
      <Row>
        <RLabel>Referral Payouts</RLabel>
        <RVal $color="#EF4444">- 15,000.00</RVal>
      </Row>
      <Row>
        <RLabel>Marketing Deduction</RLabel>
        <RVal $color="#EF4444">- 2,500.00</RVal>
      </Row>
      <Row>
        <RLabel>Bonus (Top Performer)</RLabel>
        <RVal $color="#10B981">+ 5,000.00</RVal>
      </Row>
      
      <div style={{height:1,background:'rgba(100,116,139,0.2)',margin:'16px 0'}}/>

      <Row style={{background:'transparent'}}>
        <RLabel style={{fontSize:'.9rem',color:'#94A3B8'}}>YTD Earnings</RLabel>
        <RVal style={{fontSize:'1.1rem',color:'#3B82F6'}}>385,400.00</RVal>
      </Row>
    </Wrap>
  );
};
export default AgentEarningsStatement;
