import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#061208,#0A1A10);border:2px solid rgba(37,211,102,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(37,211,102,0.06);border-bottom:1px solid rgba(37,211,102,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const SegmentGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:8px`;
const SegCard = styled.div<{$sel:boolean}>`padding:12px;border-radius:10px;cursor:pointer;background:${p=>p.$sel?'rgba(37,211,102,0.1)':'rgba(15,23,42,0.6)'};border:2px solid ${p=>p.$sel?'rgba(37,211,102,0.4)':'rgba(100,116,139,0.15)'};transition:all .15s`;
const SegIcon = styled.div`font-size:1.2rem;margin-bottom:4px`;
const SegName = styled.div`font-size:.74rem;font-weight:700;color:#E2E8F0`;
const SegCount = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;

const ComposeBox = styled.textarea`width:100%;padding:10px 12px;border-radius:9px;border:1px solid rgba(37,211,102,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.75rem;line-height:1.5;resize:none;height:80px;font-family:'Inter',sans-serif;outline:none;box-sizing:border-box;&:focus{border-color:#25D366}`;

const StatsRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const StatCard = styled.div`padding:10px;border-radius:8px;background:rgba(15,23,42,0.6);border:1px solid rgba(37,211,102,0.1);text-align:center`;
const StatVal = styled.div`font-size:.9rem;font-weight:900;color:#25D366`;
const StatLab = styled.div`font-size:.6rem;color:#64748B;margin-top:2px`;

const LaunchBtn = styled.button<{$launched:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$launched?'rgba(37,211,102,0.1)':'linear-gradient(90deg,#128C7E,#25D366)'};color:${p=>p.$launched?'#25D366':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const SEGMENTS = [
  {icon:'👑',name:'UHNW Buyers',sub:'Budget > AED 10M',count:142},
  {icon:'🏢',name:'Investors',sub:'ROI-focused',count:387},
  {icon:'🏠',name:'End Users',sub:'Primary Residence',count:891},
  {icon:'🌍',name:'International',sub:'Non-UAE Residents',count:264},
  {icon:'🔄',name:'Past Clients',sub:'Repeat buyers',count:203},
  {icon:'🔥',name:'Hot Leads',sub:'< 48h inactivity',count:76},
];

export const BroadcastCampaignSegmenter: FC = () => {
  const [selected, setSelected] = useState(new Set([0,1]));
  const [message, setMessage] = useState("Exclusive opportunity: White Caves has just listed a stunning Palm Jumeirah villa at an unprecedented price. Limited viewings available. Reply NOW to book your private tour. 🏡");
  const [launched, setLaunched] = useState(false);

  const toggle = (i:number) => setSelected(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n});
  const totalReach = SEGMENTS.filter((_,i)=>selected.has(i)).reduce((a,s)=>a+s.count,0);

  return (
    <Wrap data-testid="broadcast-campaign-segmenter">
      <Head>
        <Title>📡 Broadcast Campaign Segmenter</Title>
        <div style={{fontSize:'.7rem',color:'#25D366',fontWeight:700}}>WhatsApp Blast</div>
      </Head>
      <Body>
        <SegmentGrid>
          {SEGMENTS.map((s,i)=>(
            <SegCard key={i} $sel={selected.has(i)} onClick={()=>toggle(i)}>
              <SegIcon>{s.icon}</SegIcon>
              <SegName>{s.name}</SegName>
              <SegCount>{s.sub} · {s.count.toLocaleString()} leads</SegCount>
            </SegCard>
          ))}
        </SegmentGrid>

        <div>
          <div style={{fontSize:'.7rem',color:'#94A3B8',fontWeight:600,marginBottom:6}}>Campaign Message</div>
          <ComposeBox value={message} onChange={e=>setMessage(e.target.value)} />
          <div style={{fontSize:'.65rem',color:'#64748B',textAlign:'right',marginTop:4}}>{message.length}/1024 chars</div>
        </div>

        <StatsRow>
          <StatCard><StatVal>{totalReach.toLocaleString()}</StatVal><StatLab>Total Reach</StatLab></StatCard>
          <StatCard><StatVal>{selected.size}</StatVal><StatLab>Segments</StatLab></StatCard>
          <StatCard><StatVal>~87%</StatVal><StatLab>Open Rate Est.</StatLab></StatCard>
        </StatsRow>

        <LaunchBtn $launched={launched} onClick={()=>setLaunched(true)}>
          {launched?`✅ Campaign Sent to ${totalReach.toLocaleString()} leads`:`📡 Launch Broadcast to ${totalReach.toLocaleString()} Leads`}
        </LaunchBtn>
      </Body>
    </Wrap>
  );
};
export default BroadcastCampaignSegmenter;
