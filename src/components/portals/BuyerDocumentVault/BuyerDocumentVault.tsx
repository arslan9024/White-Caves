import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;padding:32px;color:#FFF`;
const Title = styled.h2`margin:0 0 8px;font-size:1.6rem;font-weight:900;display:flex;align-items:center;gap:12px`;
const Sub = styled.p`margin:0 0 32px;color:#94A3B8;font-size:.9rem`;

const Grid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:20px`;
const DocCard = styled.div`background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:16px;padding:24px;transition:all .2s;cursor:pointer;&:hover{background:rgba(255,255,255,0.05);transform:translateY(-2px)}`;

const IconBox = styled.div`font-size:2.5rem;margin-bottom:16px`;
const DName = styled.div`font-size:1rem;font-weight:800;color:#E2E8F0;margin-bottom:4px`;
const DMeta = styled.div`font-size:.75rem;color:#64748B`;

const DLBtn = styled.button`width:100%;margin-top:20px;padding:10px;background:rgba(56,189,248,0.1);color:#38BDF8;border:1px solid rgba(56,189,248,0.3);border-radius:8px;font-weight:800;cursor:pointer;transition:all .2s;&:hover{background:rgba(56,189,248,0.2)}`;

export const BuyerDocumentVault: FC = () => {
  return (
    <Wrap data-testid="buyer-document-vault">
      <Title>🔒 Secure Document Vault</Title>
      <Sub>All official DLD documents, SPAs, and receipts for your recent purchase at Palm Jebel Ali.</Sub>
      
      <Grid>
        <DocCard>
          <IconBox>📄</IconBox>
          <DName>Sales & Purchase Agreement</DName>
          <DMeta>Signed by both parties • 14.2 MB PDF</DMeta>
          <DLBtn>Download SPA</DLBtn>
        </DocCard>
        
        <DocCard>
          <IconBox>📜</IconBox>
          <DName>Oqood (Pre-Registration)</DName>
          <DMeta>Official DLD Certificate • 2.1 MB PDF</DMeta>
          <DLBtn>Download Oqood</DLBtn>
        </DocCard>
        
        <DocCard>
          <IconBox>🧾</IconBox>
          <DName>Payment Receipts (4)</DName>
          <DMeta>Downpayment & Installments • ZIP File</DMeta>
          <DLBtn>Download Receipts</DLBtn>
        </DocCard>
      </Grid>
    </Wrap>
  );
};
export default BuyerDocumentVault;
