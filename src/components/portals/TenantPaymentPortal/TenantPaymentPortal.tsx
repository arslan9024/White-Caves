import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;padding:32px;color:#FFF;box-shadow:0 20px 40px rgba(0,0,0,0.4)`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:32px`;
const Title = styled.h2`margin:0;font-size:1.6rem;font-weight:900;background:linear-gradient(90deg,#FFF,#94A3B8);-webkit-background-clip:text;-webkit-text-fill-color:transparent`;
const UserTag = styled.div`font-size:.85rem;color:#94A3B8;background:rgba(255,255,255,0.05);padding:8px 16px;border-radius:20px`;

const NextPayCard = styled.div`background:linear-gradient(135deg,rgba(56,189,248,0.1),rgba(139,92,246,0.1));border:1px solid rgba(56,189,248,0.3);border-radius:16px;padding:24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:24px`;
const Label = styled.div`font-size:.8rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px`;
const Amount = styled.div`font-size:2.5rem;font-weight:900;color:#FFF`;
const DueDate = styled.div`font-size:.9rem;color:#F43F5E;font-weight:700;margin-top:4px`;

const PayBtn = styled.button`padding:16px 32px;background:linear-gradient(90deg,#38BDF8,#8B5CF6);color:#FFF;border:none;border-radius:12px;font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 10px 20px rgba(56,189,248,0.3);transition:all .2s;&:hover{transform:translateY(-2px)}`;

const HistoryTable = styled.table`width:100%;border-collapse:collapse;margin-top:32px`;
const TH = styled.th`text-align:left;padding:12px 0;font-size:.7rem;color:#64748B;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.1)`;
const TD = styled.td`padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:.9rem`;
const Status = styled.span<{$ok:boolean}>`color:${p=>p.$ok?'#10B981':'#F59E0B'};background:${p=>p.$ok?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)'};padding:4px 8px;border-radius:4px;font-size:.7rem;font-weight:800`;

export const TenantPaymentPortal: FC = () => {
  return (
    <Wrap data-testid="tenant-payment-portal">
      <Header>
        <Title>Tenant Portal</Title>
        <UserTag>Apt 1402, Marina Heights</UserTag>
      </Header>

      <NextPayCard>
        <div>
          <Label>Next Rent Installment</Label>
          <Amount>AED 35,000</Amount>
          <DueDate>Due in 14 Days (Nov 1, 2026)</DueDate>
        </div>
        <PayBtn>Pay Now Securely</PayBtn>
      </NextPayCard>

      <div style={{fontSize:'1.1rem',fontWeight:800,marginBottom:8}}>Payment History</div>
      <HistoryTable>
        <thead>
          <tr>
            <TH>Date</TH>
            <TH>Description</TH>
            <TH>Amount</TH>
            <TH>Status</TH>
            <TH style={{textAlign:'right'}}>Receipt</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>May 1, 2026</TD>
            <TD>Rent Installment (Q2)</TD>
            <TD>AED 35,000</TD>
            <TD><Status $ok={true}>Paid</Status></TD>
            <TD style={{textAlign:'right',color:'#38BDF8',cursor:'pointer'}}>Download PDF</TD>
          </tr>
          <tr>
            <TD>Feb 1, 2026</TD>
            <TD>Rent Installment (Q1) + Security Dep.</TD>
            <TD>AED 42,000</TD>
            <TD><Status $ok={true}>Paid</Status></TD>
            <TD style={{textAlign:'right',color:'#38BDF8',cursor:'pointer'}}>Download PDF</TD>
          </tr>
        </tbody>
      </HistoryTable>
    </Wrap>
  );
};
export default TenantPaymentPortal;
