import React, { FC, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const scanLine = keyframes`0%{top:-10%}100%{top:110%}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.06);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const ScanBox = styled.div`
  position:relative;height:180px;border-radius:14px;
  background:rgba(15,23,42,0.9);border:2px solid rgba(239,68,68,0.3);
  display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;
`;
const ScanBeam = styled.div<{$scanning:boolean}>`
  display:${p=>p.$scanning?'block':'none'};
  position:absolute;left:0;right:0;height:3px;
  background:rgba(239,68,68,0.6);
  box-shadow:0 0 12px rgba(239,68,68,0.8);
  animation:${scanLine} 2s linear infinite;
`;
const ScanText = styled.div`font-size:.8rem;color:#64748B;text-align:center;line-height:1.6`;
const ScanIcon = styled.div`font-size:3rem;margin-bottom:6px`;

const InfoGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const InfoCard = styled.div<{$valid:boolean}>`
  padding:12px 14px;border-radius:10px;
  background:${p=>p.$valid?'rgba(16,185,129,0.07)':'rgba(239,68,68,0.07)'};
  border:1px solid ${p=>p.$valid?'rgba(16,185,129,0.25)':'rgba(239,68,68,0.25)'};
`;
const InfoLabel = styled.div`font-size:.67rem;color:#64748B;margin-bottom:3px`;
const InfoVal = styled.div<{$valid:boolean}>`font-size:.8rem;font-weight:700;color:${p=>p.$valid?'#10B981':'#EF4444'}`;

const Btn = styled.button<{$active?:boolean}>`
  width:100%;padding:12px;border-radius:10px;border:none;
  background:${p=>p.$active?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#DC2626,#EF4444)'};
  color:${p=>p.$active?'#10B981':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;
  transition:all .2s ease;&:hover{filter:brightness(1.1)}
`;

const VALID_FORM_A = {
  permit: 'RERA-BRN-2025-884210',
  seller: 'Khalid Al Mansouri',
  property: 'Apt 14B, Marina Heights, JBR',
  expiry: '2026-12-31',
  status: 'ACTIVE — Exclusive Listing',
};

export const FormABarcodeValidator: FC = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | 'valid' | 'invalid'>(null);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => { setScanning(false); setResult('valid'); }, 2800);
  };

  return (
    <Wrap data-testid="form-a-barcode-validator">
      <Head>
        <Title>📋 Form A — Barcode Validator</Title>
        <div style={{fontSize:'.7rem',color:'#64748B'}}>RERA Listing Auth</div>
      </Head>
      <Body>
        <ScanBox onClick={!scanning && !result ? handleScan : undefined}>
          <ScanBeam $scanning={scanning} />
          {!scanning && !result && (
            <div style={{textAlign:'center'}}>
              <ScanIcon>🔲</ScanIcon>
              <ScanText>Click to scan Form A barcode<br/>or QR code</ScanText>
            </div>
          )}
          {scanning && (
            <ScanText style={{color:'#EF4444',fontWeight:700}}>
              ⬛ Scanning barcode...<br/>Hold still
            </ScanText>
          )}
          {result === 'valid' && (
            <ScanText style={{color:'#10B981',fontWeight:700}}>
              ✅ VALID RERA FORM A<br/>Permit verified
            </ScanText>
          )}
        </ScanBox>

        {result === 'valid' && (
          <InfoGrid>
            <InfoCard $valid={true}><InfoLabel>Permit No.</InfoLabel><InfoVal $valid={true}>{VALID_FORM_A.permit}</InfoVal></InfoCard>
            <InfoCard $valid={true}><InfoLabel>Status</InfoLabel><InfoVal $valid={true}>✓ ACTIVE</InfoVal></InfoCard>
            <InfoCard $valid={true}><InfoLabel>Seller</InfoLabel><InfoVal $valid={true}>{VALID_FORM_A.seller}</InfoVal></InfoCard>
            <InfoCard $valid={true}><InfoLabel>Expiry</InfoLabel><InfoVal $valid={true}>{VALID_FORM_A.expiry}</InfoVal></InfoCard>
            <InfoCard $valid={true} style={{gridColumn:'1/-1'}}><InfoLabel>Property</InfoLabel><InfoVal $valid={true}>{VALID_FORM_A.property}</InfoVal></InfoCard>
          </InfoGrid>
        )}

        <Btn $active={result === 'valid'} onClick={handleScan}>
          {scanning ? '⬛ Scanning...' : result === 'valid' ? '✅ Verified — Scan Another' : '🔲 Scan Form A Barcode'}
        </Btn>
      </Body>
    </Wrap>
  );
};
export default FormABarcodeValidator;
