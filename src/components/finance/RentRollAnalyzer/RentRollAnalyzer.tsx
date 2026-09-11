import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const TableScroll = styled.div`overflow-x:auto;&::-webkit-scrollbar{height:4px}&::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:2px}`;
const Table = styled.table`width:100%;border-collapse:collapse;min-width:700px;text-align:left`;
const TH = styled.th`padding:12px;font-size:.65rem;color:#94A3B8;border-bottom:1px solid rgba(100,116,139,0.2);text-transform:uppercase`;
const TD = styled.td`padding:14px 12px;font-size:.8rem;color:#E2E8F0;border-bottom:1px solid rgba(100,116,139,0.1)`;

const StatusBadge = styled.span<{$status:string}>`
  padding:4px 8px;border-radius:6px;font-size:.65rem;font-weight:700;
  background:${p=>p.$status==='Leased'?'rgba(16,185,129,0.15)':p.$status==='Vacant'?'rgba(239,68,68,0.15)':'rgba(245,158,11,0.15)'};
  color:${p=>p.$status==='Leased'?'#10B981':p.$status==='Vacant'?'#EF4444':'#F59E0B'};
`;

const KPIBox = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px`;
const Card = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.2);padding:16px;border-radius:12px`;
const CVal = styled.div`font-size:1.2rem;font-weight:800;color:#3B82F6`;
const CLab = styled.div`font-size:.65rem;color:#94A3B8;margin-top:4px`;

const ROLLS = [
  { unit: 'Marina Heights 14B', tenant: 'J. Smith', rent: '145,000', end: '12-Nov-26', status: 'Leased' },
  { unit: 'Cayan Tower 8C', tenant: 'A. Petrova', rent: '160,000', end: '05-Jan-27', status: 'Leased' },
  { unit: 'Princess Tower 44A', tenant: '--', rent: '135,000 (Est)', end: '--', status: 'Vacant' },
  { unit: 'Downtown Views 1204', tenant: 'S. Khalid', rent: '190,000', end: '28-Feb-27', status: 'Notice Given' },
];

export const RentRollAnalyzer: FC = () => {
  return (
    <Wrap data-testid="rent-roll-analyzer">
      <Title>📊 Portfolio Rent Roll</Title>
      
      <KPIBox>
        <Card><CVal>AED 495,000</CVal><CLab>Contracted Rent</CLab></Card>
        <Card><CVal>75%</CVal><CLab>Occupancy Rate</CLab></Card>
        <Card><CVal style={{color:'#EF4444'}}>AED 135,000</CVal><CLab>Vacancy Loss (Est)</CLab></Card>
        <Card><CVal>100%</CVal><CLab>YTD Collection</CLab></Card>
      </KPIBox>

      <TableScroll>
        <Table>
          <thead>
            <tr>
              <TH>Unit</TH>
              <TH>Status</TH>
              <TH>Tenant</TH>
              <TH>Annual Rent (AED)</TH>
              <TH>Lease End</TH>
            </tr>
          </thead>
          <tbody>
            {ROLLS.map((r, i) => (
              <tr key={i}>
                <TD style={{fontWeight:700}}>{r.unit}</TD>
                <TD><StatusBadge $status={r.status}>{r.status}</StatusBadge></TD>
                <TD>{r.tenant}</TD>
                <TD>{r.rent}</TD>
                <TD>{r.end}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>
    </Wrap>
  );
};
export default RentRollAnalyzer;
