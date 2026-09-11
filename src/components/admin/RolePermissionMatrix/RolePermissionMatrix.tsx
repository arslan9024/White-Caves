import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:32px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.2rem;font-weight:900;display:flex;align-items:center;gap:8px`;

const Table = styled.table`width:100%;border-collapse:collapse`;
const TH = styled.th`text-align:left;padding:12px;font-size:.7rem;color:#94A3B8;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.1)`;
const TD = styled.td`padding:16px 12px;font-size:.85rem;color:#E2E8F0;border-bottom:1px solid rgba(255,255,255,0.05)`;

const Check = styled.input.attrs({type:'checkbox'})`
  appearance:none;width:18px;height:18px;border:2px solid #64748B;border-radius:4px;cursor:pointer;
  &:checked { background:#38BDF8; border-color:#38BDF8; }
`;

export const RolePermissionMatrix: FC = () => {
  return (
    <Wrap data-testid="role-permission-matrix">
      <Title>🔐 Access Control Matrix</Title>
      
      <Table>
        <thead>
          <tr>
            <TH>Module / Feature</TH>
            <TH style={{textAlign:'center'}}>Admin</TH>
            <TH style={{textAlign:'center'}}>Sales Manager</TH>
            <TH style={{textAlign:'center'}}>Agent</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>View All Company Leads</TD>
            <TD style={{textAlign:'center'}}><Check defaultChecked /></TD>
            <TD style={{textAlign:'center'}}><Check defaultChecked /></TD>
            <TD style={{textAlign:'center'}}><Check /></TD>
          </tr>
          <tr>
            <TD>Export Data (CSV)</TD>
            <TD style={{textAlign:'center'}}><Check defaultChecked /></TD>
            <TD style={{textAlign:'center'}}><Check defaultChecked /></TD>
            <TD style={{textAlign:'center'}}><Check /></TD>
          </tr>
          <tr>
            <TD>Modify Agent Commission Split</TD>
            <TD style={{textAlign:'center'}}><Check defaultChecked /></TD>
            <TD style={{textAlign:'center'}}><Check /></TD>
            <TD style={{textAlign:'center'}}><Check disabled /></TD>
          </tr>
          <tr>
            <TD>Delete Client Record</TD>
            <TD style={{textAlign:'center'}}><Check defaultChecked /></TD>
            <TD style={{textAlign:'center'}}><Check /></TD>
            <TD style={{textAlign:'center'}}><Check disabled /></TD>
          </tr>
        </tbody>
      </Table>
    </Wrap>
  );
};
export default RolePermissionMatrix;
