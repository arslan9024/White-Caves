import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800`;

const StatGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px`;
const Stat = styled.div`background:rgba(255,255,255,0.05);padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1)`;
const SLabel = styled.div`font-size:.75rem;color:#94A3B8;text-transform:uppercase;margin-bottom:4px`;
const SVal = styled.div`font-size:1.5rem;font-weight:900;color:#38BDF8`;

const LedgerTable = styled.table`width:100%;border-collapse:collapse`;
const TH = styled.th`text-align:left;padding:12px;font-size:.7rem;color:#94A3B8;border-bottom:1px solid rgba(255,255,255,0.1)`;
const TD = styled.td`padding:16px 12px;font-size:.85rem;color:#E2E8F0;border-bottom:1px solid rgba(255,255,255,0.05)`;

export const AgentCommissionLedger: FC = () => {
  return (
    <Wrap data-testid="agent-commission-ledger">
      <Title>💰 My Commission Ledger</Title>
      
      <StatGrid>
        <Stat>
          <SLabel>Pending Payout (Next 30 Days)</SLabel>
          <SVal>AED 142,500</SVal>
        </Stat>
        <Stat>
          <SLabel>YTD Cleared Earnings</SLabel>
          <SVal style={{color:'#10B981'}}>AED 480,000</SVal>
        </Stat>
      </StatGrid>

      <LedgerTable>
        <thead>
          <tr>
            <TH>Deal Ref</TH>
            <TH>Split</TH>
            <TH>Gross Comm.</TH>
            <TH>Deductions</TH>
            <TH>Net Payout</TH>
            <TH>Status</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>#DL-8842 (Marina)</TD>
            <TD>60/40</TD>
            <TD>AED 100,000</TD>
            <TD style={{color:'#EF4444'}}>- AED 5,000 (Mktg)</TD>
            <TD style={{fontWeight:800}}>AED 55,000</TD>
            <TD><span style={{color:'#F59E0B'}}>Pending Clearance</span></TD>
          </tr>
        </tbody>
      </LedgerTable>
    </Wrap>
  );
};
export default AgentCommissionLedger;
