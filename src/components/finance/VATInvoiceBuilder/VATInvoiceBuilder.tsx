import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#FFF;border:1px solid #E2E8F0;border-radius:8px;padding:32px;color:#0F172A;box-shadow:0 8px 24px rgba(0,0,0,0.05)`;

const Header = styled.div`display:flex;justify-content:space-between;border-bottom:2px solid #0F172A;padding-bottom:16px;margin-bottom:24px`;
const Brand = styled.div`font-size:1.4rem;font-weight:900;color:#0F172A;letter-spacing:-0.5px`;
const TRN = styled.div`font-size:.7rem;color:#64748B;margin-top:4px`;
const Title = styled.div`text-align:right`;
const InvTitle = styled.div`font-size:1.8rem;font-weight:300;color:#0F172A`;
const InvNo = styled.div`font-size:.8rem;font-weight:700;color:#475569`;

const InfoRow = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;font-size:.8rem`;
const Col = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.div`font-size:.65rem;font-weight:700;color:#94A3B8;text-transform:uppercase`;
const Text = styled.div`color:#1E293B;line-height:1.4`;

const Table = styled.table`width:100%;border-collapse:collapse;margin-bottom:24px`;
const TH = styled.th`text-align:left;padding:10px;background:#F8FAFC;font-size:.7rem;font-weight:700;color:#475569;border-bottom:1px solid #E2E8F0`;
const TD = styled.td`padding:12px 10px;font-size:.8rem;color:#1E293B;border-bottom:1px solid #E2E8F0`;

const SummaryBox = styled.div`width:300px;margin-left:auto;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px`;
const SRow = styled.div<{$bold?:boolean}>`display:flex;justify-content:space-between;margin-bottom:8px;font-size:${p=>p.$bold?'.95rem':'.8rem'};font-weight:${p=>p.$bold?800:500};color:#0F172A`;
const Stamp = styled.div`margin-top:24px;width:120px;height:120px;border:3px solid rgba(16,185,129,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;color:rgba(16,185,129,0.6);font-weight:900;font-size:1.2rem;transform:rotate(-15deg);opacity:0.8`;

export const VATInvoiceBuilder: FC = () => {
  return (
    <Wrap data-testid="vat-invoice-builder">
      <Header>
        <div>
          <Brand>WHITE CAVES REAL ESTATE LLC</Brand>
          <TRN>TRN: 100384729100003</TRN>
          <Text style={{fontSize:'.7rem',marginTop:4}}>Office 402, Boulevard Plaza Tower 1<br/>Downtown Dubai, UAE</Text>
        </div>
        <Title>
          <InvTitle>TAX INVOICE</InvTitle>
          <InvNo>INV-2026-09042</InvNo>
          <Text style={{fontSize:'.75rem',marginTop:4,color:'#64748B'}}>Date: 08 Sep 2026</Text>
        </Title>
      </Header>

      <InfoRow>
        <Col>
          <Label>Billed To</Label>
          <Text style={{fontWeight:700}}>James Robertson</Text>
          <Text>Palm Jumeirah, Frond N</Text>
          <Text>Dubai, UAE</Text>
        </Col>
      </InfoRow>

      <Table>
        <thead>
          <tr>
            <TH>Description</TH>
            <TH style={{textAlign:'right'}}>Amount (AED)</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>Agency Brokerage Commission - Sale of Villa 24, Frond N</TD>
            <TD style={{textAlign:'right'}}>120,000.00</TD>
          </tr>
          <tr>
            <TD>DLD Registration Admin Fee</TD>
            <TD style={{textAlign:'right'}}>4,000.00</TD>
          </tr>
        </tbody>
      </Table>

      <SummaryBox>
        <SRow><span>Subtotal</span><span>124,000.00</span></SRow>
        <SRow><span>VAT (5%)</span><span>6,200.00</span></SRow>
        <div style={{height:1,background:'#E2E8F0',margin:'8px 0'}}/>
        <SRow $bold><span>Total (AED)</span><span>130,200.00</span></SRow>
      </SummaryBox>

      <Stamp>PAID</Stamp>
    </Wrap>
  );
};
export default VATInvoiceBuilder;
