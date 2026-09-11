import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const scanH = keyframes`0%{transform:scaleX(0);opacity:0}50%{transform:scaleX(1);opacity:1}100%{transform:scaleX(0);opacity:0}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const QRBox = styled.div`
  position:relative;width:160px;height:160px;margin:0 auto;border-radius:12px;
  background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(99,102,241,0.05));
  border:2px solid rgba(59,130,246,0.3);display:flex;align-items:center;justify-content:center;
  flex-direction:column;cursor:pointer;overflow:hidden;
`;
const QRScan = styled.div<{$active:boolean}>`
  display:${p=>p.$active?'block':'none'};
  position:absolute;bottom:10px;left:0;right:0;height:3px;
  background:linear-gradient(90deg,transparent,#3B82F6,transparent);
  animation:${scanH} 1.5s ease-in-out infinite;
`;
const QRGrid = styled.div`display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:10px`;
const QRCell = styled.div<{$filled:boolean}>`width:10px;height:10px;border-radius:1px;background:${p=>p.$filled?'#3B82F6':'transparent'}`;

// 7×7 simplified QR pattern
const QR_PATTERN = [
  [1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1],
];

const DetailGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const DetailCard = styled.div<{$ok:boolean}>`padding:10px 12px;border-radius:9px;background:${p=>p.$ok?'rgba(16,185,129,0.07)':'rgba(239,68,68,0.07)'};border:1px solid ${p=>p.$ok?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`;
const DLabel = styled.div`font-size:.67rem;color:#64748B;margin-bottom:3px`;
const DVal = styled.div<{$ok:boolean}>`font-size:.78rem;font-weight:700;color:${p=>p.$ok?'#10B981':'#EF4444'}`;

const ScanBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#2563EB,#3B82F6);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const TrakheesiQrScanner: FC = () => {
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  const scan = () => {
    setScanning(true); setVerified(false);
    setTimeout(() => { setScanning(false); setVerified(true); }, 2000);
  };

  return (
    <Wrap data-testid="trakheesi-qr-scanner">
      <Head>
        <Title>🔍 Trakheesi Permit QR Scanner</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>RERA Marketing Permit</div>
      </Head>
      <Body>
        <QRBox onClick={!scanning?scan:undefined}>
          <QRGrid>
            {QR_PATTERN.flat().map((v,i)=><QRCell key={i} $filled={!!v} />)}
          </QRGrid>
          <QRScan $active={scanning} />
          {!verified && <div style={{fontSize:'.65rem',color:'#60A5FA',marginTop:4}}>Click to scan</div>}
          {verified && <div style={{fontSize:'.72rem',color:'#10B981',fontWeight:700,position:'absolute',bottom:8}}>✅ VALID</div>}
        </QRBox>

        {verified && (
          <DetailGrid>
            <DetailCard $ok={true}><DLabel>Permit No.</DLabel><DVal $ok={true}>TRK-2025-88421</DVal></DetailCard>
            <DetailCard $ok={true}><DLabel>Status</DLabel><DVal $ok={true}>✓ Active</DVal></DetailCard>
            <DetailCard $ok={true}><DLabel>Property</DLabel><DVal $ok={true}>Marina Heights 14B</DVal></DetailCard>
            <DetailCard $ok={true}><DLabel>Expiry</DLabel><DVal $ok={true}>Dec 31, 2026</DVal></DetailCard>
            <DetailCard $ok={true}><DLabel>Broker</DLabel><DVal $ok={true}>BRN-2024-44120</DVal></DetailCard>
            <DetailCard $ok={true}><DLabel>Developer</DLabel><DVal $ok={true}>Approved ✓</DVal></DetailCard>
          </DetailGrid>
        )}

        <ScanBtn onClick={scan}>{scanning?'🔍 Scanning...' : verified?'🔄 Scan Another':'📷 Scan Trakheesi QR Code'}</ScanBtn>
      </Body>
    </Wrap>
  );
};
export default TrakheesiQrScanner;
