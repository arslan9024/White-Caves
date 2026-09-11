import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Matrix = styled.div`display:grid;grid-template-columns:200px 1fr 1fr 1fr;gap:2px;background:rgba(100,116,139,0.2);border:1px solid rgba(100,116,139,0.2);border-radius:12px;overflow:hidden`;

const Cell = styled.div`background:rgba(15,23,42,0.9);padding:16px;display:flex;flex-direction:column;justify-content:center`;
const HeadCell = styled(Cell)`background:rgba(30,41,59,0.8);font-size:.75rem;font-weight:800;color:#94A3B8;text-transform:uppercase`;

const UnitName = styled.div`font-size:.85rem;font-weight:700;color:#E2E8F0`;
const StatusBadge = styled.div<{$status:string}>`
  display:inline-flex;padding:4px 8px;border-radius:6px;font-size:.65rem;font-weight:700;
  background:${p=>p.$status==='Connected'?'rgba(16,185,129,0.15)':p.$status==='Pending'?'rgba(245,158,11,0.15)':'rgba(239,68,68,0.15)'};
  color:${p=>p.$status==='Connected'?'#10B981':p.$status==='Pending'?'#F59E0B':'#EF4444'};
`;
const AccNum = styled.div`font-size:.6rem;color:#64748B;margin-top:4px`;

export const UtilityConnectionManager: FC = () => {
  return (
    <Wrap data-testid="utility-connection-manager">
      <Title>🔌 Utility Connections Tracker</Title>
      
      <Matrix>
        <HeadCell>Unit</HeadCell>
        <HeadCell>DEWA (Electricity/Water)</HeadCell>
        <HeadCell>Empower (Chiller)</HeadCell>
        <HeadCell>Gas / Internet</HeadCell>

        <Cell><UnitName>Marina Heights 1402</UnitName></Cell>
        <Cell>
          <div>
            <StatusBadge $status="Connected">Connected</StatusBadge>
            <AccNum>Acc: 938472910</AccNum>
          </div>
        </Cell>
        <Cell>
          <div>
            <StatusBadge $status="Connected">Connected</StatusBadge>
            <AccNum>Acc: 110948</AccNum>
          </div>
        </Cell>
        <Cell>
          <div><StatusBadge $status="Pending">Pending Setup</StatusBadge></div>
        </Cell>

        <Cell><UnitName>Downtown Views 804</UnitName></Cell>
        <Cell>
          <div><StatusBadge $status="Disconnected">Disconnected</StatusBadge></div>
        </Cell>
        <Cell>
          <div><StatusBadge $status="Disconnected">Disconnected</StatusBadge></div>
        </Cell>
        <Cell>
          <div><StatusBadge $status="Disconnected">Disconnected</StatusBadge></div>
        </Cell>
      </Matrix>
    </Wrap>
  );
};
export default UtilityConnectionManager;
