import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:.3}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#061208,#0A1A10);border:2px solid rgba(37,211,102,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(37,211,102,0.06);border-bottom:1px solid rgba(37,211,102,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const LiveDot = styled.div`width:8px;height:8px;border-radius:50%;background:#25D366;animation:${blink} 1.5s ease-in-out infinite`;

const MsgFeed = styled.div`display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(37,211,102,0.3);border-radius:2px}`;
const MsgRow = styled.div`display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center;padding:8px 12px;border-radius:8px;background:rgba(15,23,42,0.7);border:1px solid rgba(37,211,102,0.08)`;
const MsgContact = styled.div`font-size:.68rem;font-weight:700;color:#4ADE80;white-space:nowrap`;
const MsgText = styled.div`font-size:.72rem;color:#94A3B8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`;
const MsgTime = styled.div`font-size:.6rem;color:#475569;font-family:'Courier New',monospace;white-space:nowrap`;
const StatusIcon = styled.div<{$status:'sent'|'delivered'|'read'}>`font-size:.7rem;color:${p=>({sent:'#64748B',delivered:'#94A3B8',read:'#25D366'}[p.$status])}`;

const StatGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:8px`;
const StatCard = styled.div<{$color:string}>`padding:10px 8px;border-radius:9px;background:rgba(15,23,42,0.6);border:1px solid ${p=>p.$color}20;text-align:center`;
const StatVal = styled.div<{$color:string}>`font-size:.9rem;font-weight:900;color:${p=>p.$color}`;
const StatLab = styled.div`font-size:.58rem;color:#64748B;margin-top:2px`;

const INITIAL_MSGS = [
  {contact:'Sheikh Abdullah',text:'Thank you! I will call you tomorrow to arrange the viewing.',time:'09:41',status:'read' as const},
  {contact:'Sarah Thompson',text:'Can you send me more photos of the kitchen?',time:'09:38',status:'delivered' as const},
  {contact:'Rania Al Farsi',text:'Yes I am interested. When is the next available slot?',time:'09:35',status:'read' as const},
  {contact:'James Rothschild',text:'The price is negotiable I hope?',time:'09:29',status:'sent' as const},
  {contact:'Zhang Wei',text:'Received. Very interested. Please send contract.',time:'09:21',status:'read' as const},
];

export const WhatsAppTelemetrySocket: FC = () => {
  const [msgs, setMsgs] = useState(INITIAL_MSGS);
  const [totalSent, setTotalSent] = useState(2847);
  const [totalRead, setTotalRead] = useState(2418);

  useEffect(()=>{
    const iv = setInterval(()=>{
      setTotalSent(p=>p+Math.floor(Math.random()*3));
      setTotalRead(p=>p+Math.floor(Math.random()*2));
    },3000);
    return ()=>clearInterval(iv);
  },[]);

  const readRate = ((totalRead/totalSent)*100).toFixed(1);

  return (
    <Wrap data-testid="whatsapp-telemetry-socket">
      <Head>
        <Title>📡 WhatsApp Telemetry Socket</Title>
        <div style={{display:'flex',alignItems:'center',gap:6}}><LiveDot/><div style={{fontSize:'.7rem',color:'#25D366',fontWeight:700}}>LIVE</div></div>
      </Head>
      <Body>
        <StatGrid>
          <StatCard $color="#25D366"><StatVal $color="#25D366">{totalSent.toLocaleString()}</StatVal><StatLab>Sent</StatLab></StatCard>
          <StatCard $color="#4ADE80"><StatVal $color="#4ADE80">{totalRead.toLocaleString()}</StatVal><StatLab>Read</StatLab></StatCard>
          <StatCard $color="#F59E0B"><StatVal $color="#F59E0B">{readRate}%</StatVal><StatLab>Read Rate</StatLab></StatCard>
          <StatCard $color="#3B82F6"><StatVal $color="#3B82F6">47</StatVal><StatLab>Active Chats</StatLab></StatCard>
        </StatGrid>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>📱 Live Message Feed</div>
        <MsgFeed>
          {msgs.map((m,i)=>(
            <MsgRow key={i}>
              <MsgContact>{m.contact}</MsgContact>
              <MsgText>{m.text}</MsgText>
              <MsgTime>{m.time}</MsgTime>
              <StatusIcon $status={m.status}>
                {m.status==='read'?'✓✓':m.status==='delivered'?'✓✓':'✓'}
              </StatusIcon>
            </MsgRow>
          ))}
        </MsgFeed>
      </Body>
    </Wrap>
  );
};
export default WhatsAppTelemetrySocket;
