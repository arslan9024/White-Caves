import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:32px;color:#FFF`;
const Title = styled.h2`margin:0 0 8px;font-size:1.2rem;font-weight:900`;
const Sub = styled.div`font-size:.85rem;color:#94A3B8;margin-bottom:24px`;

const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px`;
const Card = styled.div`background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);padding:20px;border-radius:12px`;
const CName = styled.div`font-size:1rem;font-weight:800;color:#E2E8F0;margin-bottom:8px`;
const CDesc = styled.div`font-size:.75rem;color:#94A3B8;margin-bottom:16px`;

const BtnGroup = styled.div`display:flex;gap:8px`;
const EBtn = styled.button<{$type:'csv'|'xls'}>`
  padding:8px 16px;border-radius:6px;border:none;font-weight:800;font-size:.75rem;cursor:pointer;
  background:${p=>p.$type==='csv'?'#38BDF8':'#10B981'};
  color:#0F172A;
`;

export const DataExportHub: FC = () => {
  return (
    <Wrap data-testid="data-export-hub">
      <Title>📥 Bulk Data Export</Title>
      <Sub>Download core CRM data for external accounting or analysis.</Sub>

      <Grid>
        <Card>
          <CName>Deals & Revenue (YTD)</CName>
          <CDesc>All closed deals, gross commission, and agent splits.</CDesc>
          <BtnGroup>
            <EBtn $type="csv">CSV</EBtn>
            <EBtn $type="xls">Excel</EBtn>
          </BtnGroup>
        </Card>
        
        <Card>
          <CName>Client Master List</CName>
          <CDesc>Full CRM database of leads, contacts, and KYC status.</CDesc>
          <BtnGroup>
            <EBtn $type="csv">CSV</EBtn>
          </BtnGroup>
        </Card>
      </Grid>
    </Wrap>
  );
};
export default DataExportHub;
