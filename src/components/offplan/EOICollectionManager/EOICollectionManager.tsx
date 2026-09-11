import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between`;
const Stat = styled.div`font-size:.8rem;color:#F59E0B;background:rgba(245,158,11,0.15);padding:4px 8px;border-radius:4px`;

const Table = styled.table`width:100%;border-collapse:collapse;text-align:left`;
const TH = styled.th`padding:12px;font-size:.65rem;color:#94A3B8;border-bottom:1px solid rgba(100,116,139,0.2);text-transform:uppercase`;
const TD = styled.td`padding:16px 12px;border-bottom:1px solid rgba(100,116,139,0.1);font-size:.8rem;color:#E2E8F0;font-weight:600`;

const Badge = styled.span<{$type:string}>`
  padding:4px 8px;border-radius:4px;font-size:.65rem;font-weight:800;
  background:${p=>p.$type==='chq'?'rgba(56,189,248,0.15)':'rgba(16,185,129,0.15)'};
  color:${p=>p.$type==='chq'?'#38BDF8':'#10B981'};
`;

export const EOICollectionManager: FC = () => {
  return (
    <Wrap data-testid="eoi-collection-manager">
      <Title>
        <span>🎟️ Pre-Launch EOI Collection</span>
        <Stat>12 EOIs (AED 600,000)</Stat>
      </Title>
      
      <Table>
        <thead>
          <tr>
            <TH>Client Name</TH>
            <TH>Pref. Unit Type</TH>
            <TH>EOI Amount</TH>
            <TH>Payment Type</TH>
            <TH>Agent</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>Ahmed Al Maktoum</TD>
            <TD>3 BR (High Floor)</TD>
            <TD>AED 100,000</TD>
            <TD><Badge $type="chq">Cheque (PDC)</Badge></TD>
            <TD>Ivan Petrov</TD>
          </tr>
          <tr>
            <TD>Sarah Jenkins</TD>
            <TD>1 BR</TD>
            <TD>AED 50,000</TD>
            <TD><Badge $type="cc">Credit Card Link</Badge></TD>
            <TD>Laila O.</TD>
          </tr>
        </tbody>
      </Table>
    </Wrap>
  );
};
export default EOICollectionManager;
