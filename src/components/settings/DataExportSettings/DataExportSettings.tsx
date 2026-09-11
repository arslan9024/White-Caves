import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const ExportBox = styled.div`background:rgba(30,41,59,0.5);border:1px dashed rgba(100,116,139,0.4);border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:16px`;

const Field = styled.div`display:flex;flex-direction:column;gap:6px`;
const Label = styled.label`font-size:.75rem;color:#94A3B8;font-weight:600`;
const Select = styled.select`padding:10px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.85rem;outline:none`;

const BtnPrimary = styled.button`padding:12px;background:#10B981;color:#FFF;border:none;border-radius:8px;font-weight:700;font-size:.85rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px`;

export const DataExportSettings: FC = () => {
  return (
    <Wrap data-testid="data-export-settings">
      <Title>📥 Data Export</Title>
      
      <ExportBox>
        <Field>
          <Label>Select Data Module</Label>
          <Select defaultValue="leads">
            <option value="leads">Leads & Contacts</option>
            <option value="properties">Property Portfolio</option>
            <option value="leases">Tenancy & Leases</option>
            <option value="finance">Financial Transactions</option>
          </Select>
        </Field>

        <Field>
          <Label>Date Range</Label>
          <Select defaultValue="mtd">
            <option value="mtd">Month to Date</option>
            <option value="ytd">Year to Date</option>
            <option value="all">All Time</option>
          </Select>
        </Field>

        <Field>
          <Label>Export Format</Label>
          <Select defaultValue="csv">
            <option value="csv">CSV (Spreadsheet)</option>
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF Report</option>
          </Select>
        </Field>

        <BtnPrimary>
          <span>Generate Export</span>
          <span style={{fontSize:'1.1rem'}}>↓</span>
        </BtnPrimary>
      </ExportBox>
    </Wrap>
  );
};
export default DataExportSettings;
