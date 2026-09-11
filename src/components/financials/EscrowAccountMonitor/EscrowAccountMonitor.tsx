import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;display:flex;align-items:center;gap:8px`;

const EscrowCard = styled.div`background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.9));border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:20px;margin-bottom:16px`;
const EHeader = styled.div`display:flex;justify-content:space-between;margin-bottom:12px`;
const ETitle = styled.div`font-weight:900;font-size:1rem;color:#E2E8F0`;
const EBank = styled.div`font-size:.8rem;color:#94A3B8`;

const BalWrap = styled.div`display:flex;align-items:flex-end;gap:12px`;
const BalAmount = styled.div`font-size:2rem;font-weight:900;color:#10B981`;
const BalLabel = styled.div`font-size:.8rem;color:#94A3B8;padding-bottom:6px`;

const ProgBar = styled.div`width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin-top:20px;overflow:hidden`;
const ProgFill = styled.div<{w:number}>`width:${p=>p.w}%;height:100%;background:#10B981`;

export const EscrowAccountMonitor: FC = () => {
  return (
    <Wrap data-testid="escrow-account-monitor">
      <Title>🏦 RERA Escrow Account Monitor</Title>
      
      <EscrowCard>
        <EHeader>
          <ETitle>Oasis Towers (Phase 1)</ETitle>
          <EBank>Emirates NBD • Acc: **** 4921</EBank>
        </EHeader>
        
        <BalWrap>
          <BalAmount>AED 45,200,000</BalAmount>
          <BalLabel>Current Balance</BalLabel>
        </BalWrap>
        
        <ProgBar><ProgFill w={45} /></ProgBar>
        <div style={{fontSize:'.75rem',color:'#94A3B8',marginTop:8}}>45% of target capital collected (Construction at 20%)</div>
      </EscrowCard>
    </Wrap>
  );
};
export default EscrowAccountMonitor;
