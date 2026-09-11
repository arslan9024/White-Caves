import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;display:flex;align-items:center;gap:8px`;

const Table = styled.table`width:100%;border-collapse:collapse`;
const TH = styled.th`text-align:left;padding:12px;font-size:.7rem;color:#94A3B8;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.1)`;
const TD = styled.td`padding:16px 12px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:.85rem;color:#E2E8F0`;

const Status = styled.span<{$state:'approved'|'pending'|'rejected'}>`
  padding:4px 8px;border-radius:4px;font-size:.7rem;font-weight:800;text-transform:uppercase;
  background:${p=>p.$state==='approved'?'rgba(16,185,129,0.1)':p.$state==='pending'?'rgba(245,158,11,0.1)':'rgba(239,68,68,0.1)'};
  color:${p=>p.$state==='approved'?'#10B981':p.$state==='pending'?'#F59E0B':'#EF4444'};
`;

export const WhatsAppTemplateApprovals: FC = () => {
  return (
    <Wrap data-testid="whatsapp-template-approvals">
      <Title><span style={{color:'#10B981'}}>WhatsApp</span> Meta API Approvals</Title>
      
      <Table>
        <thead>
          <tr>
            <TH>Template Name</TH>
            <TH>Category</TH>
            <TH>Language</TH>
            <TH>Meta Status</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD style={{fontWeight:700}}>Viewing_Confirmation_v2</TD>
            <TD>Utility</TD>
            <TD>EN</TD>
            <TD><Status $state="approved">Approved</Status></TD>
          </tr>
          <tr>
            <TD style={{fontWeight:700}}>New_Project_Launch_Promo</TD>
            <TD>Marketing</TD>
            <TD>EN / AR</TD>
            <TD><Status $state="pending">In Review</Status></TD>
          </tr>
          <tr>
            <TD style={{fontWeight:700}}>Overdue_Rent_Notice</TD>
            <TD>Utility</TD>
            <TD>EN</TD>
            <TD><Status $state="rejected">Rejected (Violates Policy)</Status></TD>
          </tr>
        </tbody>
      </Table>
    </Wrap>
  );
};
export default WhatsAppTemplateApprovals;
