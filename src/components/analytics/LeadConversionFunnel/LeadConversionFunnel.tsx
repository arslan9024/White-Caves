import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:600px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:32px;color:#FFF;display:flex;flex-direction:column;align-items:center`;
const Title = styled.h2`margin:0 0 32px;font-size:1.2rem;font-weight:900`;

const Stage = styled.div<{w:number, $bg:string}>`
  width:${p=>p.w}%;height:50px;background:${p=>p.$bg};margin-bottom:8px;
  display:flex;align-items:center;justify-content:space-between;padding:0 24px;
  border-radius:25px;clip-path:polygon(0 0, 100% 0, 95% 100%, 5% 100%);
`;

const SName = styled.div`font-weight:800;font-size:.85rem;color:#FFF;text-transform:uppercase;letter-spacing:1px`;
const SVal = styled.div`font-weight:900;font-size:1rem;color:#FFF`;

export const LeadConversionFunnel: FC = () => {
  return (
    <Wrap data-testid="lead-conversion-funnel">
      <Title>Funnel Analysis (Q3 Pipeline)</Title>
      
      <Stage w={100} $bg="rgba(56,189,248,0.8)">
        <SName>New Leads</SName>
        <SVal>1,250</SVal>
      </Stage>
      
      <Stage w={80} $bg="rgba(139,92,246,0.8)">
        <SName>Contacted</SName>
        <SVal>840 (67%)</SVal>
      </Stage>
      
      <Stage w={50} $bg="rgba(245,158,11,0.8)">
        <SName>Viewings / Meetings</SName>
        <SVal>315 (25%)</SVal>
      </Stage>
      
      <Stage w={30} $bg="rgba(16,185,129,0.8)">
        <SName>Offers Submitted</SName>
        <SVal>142 (11%)</SVal>
      </Stage>
      
      <Stage w={15} $bg="rgba(239,68,68,0.8)">
        <SName>Closed Won</SName>
        <SVal>88 (7%)</SVal>
      </Stage>
    </Wrap>
  );
};
export default LeadConversionFunnel;
