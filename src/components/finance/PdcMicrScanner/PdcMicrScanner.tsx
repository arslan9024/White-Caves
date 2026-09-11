import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const scan = keyframes`0%{top:-10%}100%{top:110%}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const ChequeVisual = styled.div`
  position:relative;height:160px;border-radius:14px;overflow:hidden;
  background:linear-gradient(135deg,#f8f5f0,#fff);border:2px solid rgba(59,130,246,0.4);cursor:pointer;
`;
const ChequeMICR = styled.div`
  position:absolute;bottom:0;left:0;right:0;height:40px;
  background:rgba(0,0,0,0.05);border-top:1px solid rgba(0,0,0,0.1);
  display:flex;align-items:center;padding:0 14px;
  font-family:'Courier New',monospace;font-size:.72rem;color:#1a1a2e;letter-spacing:.1em;
`;
const ScanBeam = styled.div<{$active:boolean}>`
  display:${p=>p.$active?'block':'none'};
  position:absolute;left:0;right:0;height:2px;
  background:rgba(59,130,246,0.7);
  box-shadow:0 0 12px rgba(59,130,246,0.8);
  animation:${scan} 1.8s linear infinite;
`;
const ChequeBody = styled.div`position:absolute;top:0;left:0;right:0;bottom:40px;padding:14px;`;
const ChequeLine = styled.div`display:flex;justify-content:space-between;margin-bottom:6px;`;
const ChequeLabel = styled.div`font-size:.65rem;color:#888;font-weight:600`;
const ChequeValue = styled.div`font-size:.75rem;color:#1a1a2e;font-weight:700`;

const ResultGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const ResultCard = styled.div<{$ok:boolean}>`padding:10px 12px;border-radius:9px;background:${p=>p.$ok?'rgba(16,185,129,0.07)':'rgba(239,68,68,0.07)'};border:1px solid ${p=>p.$ok?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`;
const RLabel = styled.div`font-size:.67rem;color:#64748B;margin-bottom:3px`;
const RVal = styled.div<{$ok:boolean}>`font-size:.78rem;font-weight:700;color:${p=>p.$ok?'#10B981':'#EF4444'}`;

const ScanBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#1D4ED8,#3B82F6);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const PdcMicrScanner: FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const doScan = () => { setScanning(true); setScanned(false); setTimeout(()=>{setScanning(false);setScanned(true);},2200); };

  return (
    <Wrap data-testid="pdc-micr-scanner">
      <Head>
        <Title>🔍 PDC MICR Scanner</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>OCR + MICR</div>
      </Head>
      <Body>
        <ChequeVisual onClick={doScan}>
          <ScanBeam $active={scanning} />
          <ChequeBody>
            <ChequeLine><ChequeLabel>Emirates NBD</ChequeLabel><ChequeValue>Cheque #002841</ChequeValue></ChequeLine>
            <ChequeLine><ChequeLabel>Pay to</ChequeLabel><ChequeValue>White Caves Real Estate LLC</ChequeValue></ChequeLine>
            <ChequeLine><ChequeLabel>Amount</ChequeLabel><ChequeValue style={{fontSize:'.9rem',color:'#1e3a8a',fontWeight:900}}>AED 30,000/=</ChequeValue></ChequeLine>
            <ChequeLine><ChequeLabel>Date</ChequeLabel><ChequeValue>15 / 03 / 2026</ChequeValue></ChequeLine>
          </ChequeBody>
          <ChequeMICR>
            {scanned ? '⑆ 0211040 ⑆ 1038844128 ⑆ 002841 ⑆ 0030000000' : '[ Click cheque to scan MICR line ]'}
          </ChequeMICR>
        </ChequeVisual>

        {scanned && (
          <ResultGrid>
            <ResultCard $ok={true}><RLabel>Bank Code</RLabel><RVal $ok={true}>021-1040 (ENBD)</RVal></ResultCard>
            <ResultCard $ok={true}><RLabel>Account No.</RLabel><RVal $ok={true}>1038844128</RVal></ResultCard>
            <ResultCard $ok={true}><RLabel>Cheque No.</RLabel><RVal $ok={true}>002841</RVal></ResultCard>
            <ResultCard $ok={true}><RLabel>Amount</RLabel><RVal $ok={true}>AED 30,000</RVal></ResultCard>
            <ResultCard $ok={true}><RLabel>Date</RLabel><RVal $ok={true}>15/03/2026</RVal></ResultCard>
            <ResultCard $ok={true}><RLabel>MICR Status</RLabel><RVal $ok={true}>✓ Valid MICR</RVal></ResultCard>
          </ResultGrid>
        )}

        <ScanBtn onClick={doScan}>{scanning?'🔍 Scanning...':scanned?'🔄 Scan Another Cheque':'📷 Scan Cheque (OCR + MICR)'}</ScanBtn>
      </Body>
    </Wrap>
  );
};
export default PdcMicrScanner;
