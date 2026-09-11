import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Table = styled.table`width:100%;border-collapse:collapse;text-align:left`;
const TH = styled.th`padding:12px;font-size:.65rem;color:#94A3B8;border-bottom:1px solid rgba(100,116,139,0.2);text-transform:uppercase`;
const TD = styled.td`padding:16px 12px;border-bottom:1px solid rgba(100,116,139,0.1)`;

const CName = styled.div`font-size:.85rem;font-weight:700;color:#E2E8F0`;
const CType = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px`;

const JobBox = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);padding:10px;border-radius:8px`;
const JTitle = styled.div`font-size:.75rem;font-weight:700;color:#E2E8F0`;
const JSub = styled.div`font-size:.65rem;color:#94A3B8;margin-top:2px`;

const DispatchBtn = styled.button`padding:8px 16px;background:#10B981;color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:.75rem;cursor:pointer`;

export const ContractorDispatchPanel: FC = () => {
  return (
    <Wrap data-testid="contractor-dispatch-panel">
      <Title>🚚 Contractor Dispatch</Title>
      
      <Table>
        <thead>
          <tr>
            <TH>Contractor</TH>
            <TH>Active Job</TH>
            <TH>SLA Status</TH>
            <TH style={{textAlign:'right'}}>Action</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>
              <CName>CoolTech HVAC Services</CName>
              <CType>Primary AC Vendor</CType>
            </TD>
            <TD>
              <JobBox>
                <JTitle>#TK-8042: AC Not Cooling</JTitle>
                <JSub>Marina Heights 1402</JSub>
              </JobBox>
            </TD>
            <TD>
              <span style={{color:'#10B981',fontSize:'.75rem',fontWeight:700}}>On Track (ETA 1h)</span>
            </TD>
            <TD style={{textAlign:'right'}}>
              <DispatchBtn style={{background:'rgba(100,116,139,0.3)',color:'#E2E8F0'}}>Update ETA</DispatchBtn>
            </TD>
          </tr>
          <tr>
            <TD>
              <CName>Rapid Plumbers LLC</CName>
              <CType>Plumbing / Pipes</CType>
            </TD>
            <TD>
              <JobBox style={{opacity:0.5}}>
                <JTitle>No Active Jobs</JTitle>
                <JSub>Available for dispatch</JSub>
              </JobBox>
            </TD>
            <TD>-</TD>
            <TD style={{textAlign:'right'}}>
              <DispatchBtn>Assign Job</DispatchBtn>
            </TD>
          </tr>
        </tbody>
      </Table>
    </Wrap>
  );
};
export default ContractorDispatchPanel;
