import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const qrPulse = keyframes`0%,100%{opacity:.7}50%{opacity:1}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#061208,#0A1A10);border:2px solid rgba(37,211,102,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(37,211,102,0.06);border-bottom:1px solid rgba(37,211,102,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const QRDisplay = styled.div<{$linked:boolean}>`
  padding:24px;border-radius:16px;text-align:center;
  background:${p=>p.$linked?'rgba(37,211,102,0.06)':'rgba(15,23,42,0.8)'};
  border:2px solid ${p=>p.$linked?'rgba(37,211,102,0.4)':'rgba(37,211,102,0.2)'};
`;
const QRGrid = styled.div`display:grid;grid-template-columns:repeat(8,1fr);gap:3px;width:120px;margin:0 auto 12px`;
const QRCell = styled.div<{$on:boolean}>`width:11px;height:11px;border-radius:1px;background:${p=>p.$on?'#25D366':'transparent'};animation:${p=>p.$on?qrPulse:''} 3s ease-in-out infinite`;

const QR_PAT = [
  [1,1,1,1,1,1,1,0],[1,0,0,0,0,0,1,0],[1,0,1,1,1,0,1,1],[1,0,1,0,1,0,1,0],[1,0,1,1,1,0,1,1],[1,0,0,0,0,0,1,0],[1,1,1,1,1,1,1,0],[0,1,0,1,0,1,0,1],
];

const CodeDisplay = styled.div`
  display:inline-block;padding:14px 28px;border-radius:12px;
  background:rgba(37,211,102,0.08);border:2px solid rgba(37,211,102,0.3);
  font-family:'Courier New',monospace;font-size:2rem;font-weight:900;
  letter-spacing:.3em;color:#25D366;margin:12px 0 6px;
`;
const CodeLabel = styled.div`font-size:.72rem;color:#64748B`;
const LinkedBanner = styled.div`font-size:.85rem;font-weight:900;color:#25D366`;
const LinkedSub = styled.div`font-size:.7rem;color:#4ADE80;margin-top:4px`;

const MethodTabs = styled.div`display:flex;gap:6px`;
const MethodTab = styled.button<{$active:boolean}>`flex:1;padding:8px;border-radius:8px;border:1px solid ${p=>p.$active?'rgba(37,211,102,0.4)':'rgba(100,116,139,0.2)'};background:${p=>p.$active?'rgba(37,211,102,0.08)':'transparent'};color:${p=>p.$active?'#25D366':'#64748B'};font-size:.72rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif`;

const LinkBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#128C7E,#25D366);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const WhatsAppPairingModal: FC = () => {
  const [method, setMethod] = useState<'qr'|'code'>('qr');
  const [linked, setLinked] = useState(false);
  const [timer, setTimer] = useState(60);
  const CODE = '4829-7136';

  useEffect(()=>{
    if(linked) return;
    const iv = setInterval(()=>setTimer(p=>{if(p<=0){clearInterval(iv);return 60;}return p-1;}),1000);
    return ()=>clearInterval(iv);
  },[linked]);

  return (
    <Wrap data-testid="whatsapp-pairing-modal">
      <Head>
        <Title>💬 WhatsApp Web Pairing</Title>
        <div style={{fontSize:'.7rem',color:'#25D366',fontWeight:700}}>Broker Auth</div>
      </Head>
      <Body>
        <MethodTabs>
          <MethodTab $active={method==='qr'} onClick={()=>setMethod('qr')}>📷 QR Code</MethodTab>
          <MethodTab $active={method==='code'} onClick={()=>setMethod('code')}>🔢 Pairing Code</MethodTab>
        </MethodTabs>

        <QRDisplay $linked={linked}>
          {!linked && method==='qr' && (
            <>
              <QRGrid>{QR_PAT.flat().map((v,i)=><QRCell key={i} $on={!!v}/>)}</QRGrid>
              <CodeLabel>Open WhatsApp → Linked Devices → Scan QR</CodeLabel>
              <div style={{fontSize:'.65rem',color:'#64748B',marginTop:6}}>Expires in {timer}s</div>
            </>
          )}
          {!linked && method==='code' && (
            <>
              <CodeDisplay>{CODE}</CodeDisplay>
              <CodeLabel>Open WhatsApp → Linked Devices → Link with Phone Number → Enter code</CodeLabel>
              <div style={{fontSize:'.65rem',color:'#64748B',marginTop:6}}>Code valid for {timer}s</div>
            </>
          )}
          {linked && (
            <>
              <div style={{fontSize:'2.5rem',marginBottom:8}}>✅</div>
              <LinkedBanner>WhatsApp Linked Successfully</LinkedBanner>
              <LinkedSub>Broker Account: Victoria.Chen@whitecaves.ae<br/>Session ID: WC-WA-{Date.now().toString().slice(-8)}</LinkedSub>
            </>
          )}
        </QRDisplay>

        <LinkBtn onClick={()=>setLinked(true)}>
          {linked?'✅ WhatsApp Linked — Disconnect':'🔗 Simulate Link (Demo)'}
        </LinkBtn>
      </Body>
    </Wrap>
  );
};
export default WhatsAppPairingModal;
