/**
 * VipResponseSlaTracker — Wave 49 GOAL-037
 * Dedicated UHNW relationship manager SLA tracker (5-minute VIP response law)
 * White Caves Real Estate LLC — VIP Concierge Suite
 */
import React, { FC, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const tick = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.06)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 8px rgba(239,68,68,0.2)}50%{box-shadow:0 0 20px rgba(239,68,68,0.5)}`;
const breathe = keyframes`0%,100%{opacity:1}50%{opacity:0.5}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(139,92,246,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.07);border-bottom:1px solid rgba(139,92,246,0.15);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;display:flex;align-items:center;gap:8px;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;

const TimerRing = styled.div<{$pct:number;$breached:boolean}>`
  width:100px;height:100px;border-radius:50%;
  background:conic-gradient(
    ${p=>p.$breached?'#EF4444':'#8B5CF6'} ${p=>p.$pct}%,
    rgba(15,23,42,0.6) ${p=>p.$pct}%
  );
  display:flex;align-items:center;justify-content:center;margin:0 auto;
  animation: ${p => p.$breached ? glow : tick} 1s ease-in-out infinite;
  position:relative;
  &::before{content:'';position:absolute;inset:10px;border-radius:50%;background:#0A0614;}
`;
const TimerInner = styled.div`position:relative;z-index:1;text-align:center;`;
const TimerNum = styled.div<{$breached:boolean}>`font-size:1.4rem;font-weight:900;color:${p=>p.$breached?'#EF4444':'#A78BFA'};`;
const TimerLabel = styled.div`font-size:0.6rem;color:#64748B;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;`;

const SlaRow = styled.div`display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;background:rgba(15,23,42,0.6);border:1px solid rgba(100,116,139,0.15);`;
const SlaLeft = styled.div`display:flex;align-items:center;gap:10px;`;
const SlaAvatar = styled.div`width:32px;height:32px;border-radius:50%;background:rgba(139,92,246,0.2);border:1.5px solid rgba(139,92,246,0.4);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;`;
const SlaName = styled.div`font-size:0.8rem;font-weight:700;color:#E2E8F0;`;
const SlaMeta = styled.div`font-size:0.68rem;color:#64748B;`;
const SlaStatus = styled.div<{$ok:boolean}>`font-size:0.72rem;font-weight:800;color:${p=>p.$ok?'#10B981':'#EF4444'};display:flex;align-items:center;gap:4px;`;
const LiveDot = styled.div<{$color:string}>`width:6px;height:6px;border-radius:50%;background:${p=>p.$color};animation:${breathe} 1.2s ease infinite;`;

const PolicyCard = styled.div`padding:12px 16px;border-radius:10px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.18);`;
const PolicyTitle = styled.div`font-size:0.72rem;font-weight:700;color:#A78BFA;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;`;
const PolicyGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px;`;
const PolicyItem = styled.div`text-align:center;`;
const PolicyVal = styled.div<{$red?:boolean}>`font-size:1rem;font-weight:900;color:${p=>p.$red?'#EF4444':'#A78BFA'};`;
const PolicyLab = styled.div`font-size:0.62rem;color:#64748B;margin-top:2px;`;

const SimBtn = styled.button<{$variant?:'danger'|'ok'}>`padding:8px 18px;border-radius:8px;border:none;background:${p=>p.$variant==='danger'?'rgba(239,68,68,0.15)':p.$variant==='ok'?'rgba(16,185,129,0.15)':'rgba(139,92,246,0.12)'};color:${p=>p.$variant==='danger'?'#EF4444':p.$variant==='ok'?'#10B981':'#A78BFA'};font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 0.2s;&:hover{filter:brightness(1.2);}`;
const BtnRow = styled.div`display:flex;gap:8px;`;

type Enquiry = { client: string; avatar: string; enquiry: string; startTime: number; responded: boolean; respondedAt?: number };

export const VipResponseSlaTracker: FC = () => {
  const SLA_MS = 5 * 60 * 1000; // 5 minutes
  const [now, setNow] = useState(Date.now());
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    { client:'Sheikh Rashid Al Maktoum', avatar:'👑', enquiry:'Palm Crown penthouse — urgent offer', startTime:Date.now()-120000, responded:false },
    { client:'Mr. Ivan Petrov', avatar:'🇷🇺', enquiry:'Downtown skyline villa walkthrough', startTime:Date.now()-245000, responded:true, respondedAt:Date.now()-200000 },
  ]);
  const [stats, setStats] = useState({ responded:1, breached:0, avgSec:127 });
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const addEnquiry = () => {
    const names = ['HH Princess Hessa','Mr. Andrei Volkov','Lady Margaret Pemberton','H.E. Khalid Al Qasimi'];
    const avatars = ['👸','🇷🇺','🇬🇧','🏆'];
    const enquiries2 = ['Burj Khalifa penthouse viewing','World Islands private villa','Palm Crown 8BR acquisition','Off-market golf estate'];
    const i = Math.floor(Math.random()*4);
    setEnquiries(prev=>[...prev, { client:names[i], avatar:avatars[i], enquiry:enquiries2[i], startTime:Date.now(), responded:false }]);
  };

  const respond = (idx: number) => {
    setEnquiries(prev=>prev.map((e,i)=>i===idx?{...e,responded:true,respondedAt:Date.now()}:e));
    setStats(s=>({...s,responded:s.responded+1,avgSec:Math.round((s.avgSec*s.responded+Math.floor((Date.now()-enquiries[idx].startTime)/1000))/(s.responded+1))}));
  };

  const pending = enquiries.filter(e=>!e.responded);
  const oldest = pending.length > 0 ? pending.reduce((a,b)=>a.startTime<b.startTime?a:b) : null;
  const elapsedMs = oldest ? now - oldest.startTime : 0;
  const pct = oldest ? Math.min(100,(elapsedMs/SLA_MS)*100) : 0;
  const breached = elapsedMs > SLA_MS;
  const remaining = oldest ? Math.max(0,Math.ceil((SLA_MS-elapsedMs)/1000)) : 0;
  const remMin = Math.floor(remaining/60);
  const remSec = remaining%60;

  return (
    <Wrap data-testid="vip-response-sla-tracker">
      <Head>
        <Title>⚡ VIP SLA Response Tracker</Title>
        <div style={{fontSize:'0.68rem',color:'#A78BFA',fontWeight:700}}>5-MIN RESPONSE LAW</div>
      </Head>
      <Body>
        <PolicyCard>
          <PolicyTitle>📊 Today's SLA Performance</PolicyTitle>
          <PolicyGrid>
            <PolicyItem><PolicyVal>{stats.responded}</PolicyVal><PolicyLab>Responded</PolicyLab></PolicyItem>
            <PolicyItem><PolicyVal $red={stats.breached>0}>{stats.breached}</PolicyVal><PolicyLab>Breaches</PolicyLab></PolicyItem>
            <PolicyItem><PolicyVal>{stats.avgSec}s</PolicyVal><PolicyLab>Avg Response</PolicyLab></PolicyItem>
          </PolicyGrid>
        </PolicyCard>

        {oldest ? (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'0.7rem',color:'#94A3B8',marginBottom:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>
              {breached ? '🚨 SLA BREACHED' : '⏱ Time Remaining for Oldest Enquiry'}
            </div>
            <TimerRing $pct={pct} $breached={breached}>
              <TimerInner>
                <TimerNum $breached={breached}>{breached?'BREACH':`${remMin}:${String(remSec).padStart(2,'0')}`}</TimerNum>
                <TimerLabel>{breached?'OVERDUE':'remaining'}</TimerLabel>
              </TimerInner>
            </TimerRing>
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'16px',borderRadius:'12px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',fontSize:'0.82rem',fontWeight:700,color:'#10B981'}}>
            ✅ All enquiries responded to — SLA Met!
          </div>
        )}

        <div>
          <div style={{fontSize:'0.7rem',fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>Live Enquiry Queue</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {enquiries.map((e,i)=>{
              const ems = now - e.startTime;
              const br = !e.responded && ems > SLA_MS;
              const ok = e.responded;
              return (
                <SlaRow key={i}>
                  <SlaLeft>
                    <SlaAvatar>{e.avatar}</SlaAvatar>
                    <div>
                      <SlaName>{e.client}</SlaName>
                      <SlaMeta>{e.enquiry}</SlaMeta>
                    </div>
                  </SlaLeft>
                  {ok ? (
                    <SlaStatus $ok={true}><LiveDot $color="#10B981"/>✅ {Math.floor((e.respondedAt!-e.startTime)/1000)}s</SlaStatus>
                  ) : br ? (
                    <SimBtn $variant="danger" onClick={()=>respond(i)}>BREACH – Respond Now</SimBtn>
                  ) : (
                    <SimBtn $variant="ok" onClick={()=>respond(i)}>Reply ✓</SimBtn>
                  )}
                </SlaRow>
              );
            })}
          </div>
        </div>

        <BtnRow>
          <SimBtn onClick={addEnquiry}>+ Simulate VIP Enquiry</SimBtn>
        </BtnRow>
      </Body>
    </Wrap>
  );
};

export default VipResponseSlaTracker;
