import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.06);border-bottom:1px solid rgba(239,68,68,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const LeadList = styled.div`display:flex;flex-direction:column;gap:7px`;
const LeadCard = styled.div<{$mins:number;$assigned:boolean}>`
  padding:12px 14px;border-radius:10px;
  background:${p=>p.$assigned?'rgba(16,185,129,0.06)':p.$mins>=15?'rgba(239,68,68,0.1)':p.$mins>=8?'rgba(245,158,11,0.07)':'rgba(15,23,42,0.7)'};
  border:2px solid ${p=>p.$assigned?'rgba(16,185,129,0.25)':p.$mins>=15?'rgba(239,68,68,0.4)':p.$mins>=8?'rgba(245,158,11,0.25)':'rgba(100,116,139,0.15)'};
`;
const LeadTop = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:6px`;
const LeadName = styled.div`font-size:.78rem;font-weight:700;color:#E2E8F0`;
const CountDown = styled.div<{$mins:number;$assigned:boolean}>`
  font-size:.82rem;font-weight:900;font-family:'Courier New',monospace;
  color:${p=>p.$assigned?'#10B981':p.$mins>=15?'#EF4444':p.$mins>=8?'#F59E0B':'#10B981'};
  animation:${p=>!p.$assigned&&p.$mins>=15?blink:''} .8s ease-in-out infinite;
`;
const LeadMeta = styled.div`display:flex;gap:12px;flex-wrap:wrap`;
const MetaChip = styled.div`font-size:.65rem;color:#64748B`;
const AssignBtn = styled.button<{$assigned:boolean}>`
  margin-top:8px;width:100%;padding:7px;border-radius:7px;border:none;
  background:${p=>p.$assigned?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.12)'};
  color:${p=>p.$assigned?'#10B981':'#EF4444'};font-size:.72rem;font-weight:700;cursor:pointer;
  font-family:'Inter',sans-serif;transition:all .15s;&:hover{filter:brightness(1.15)}
`;

const LEADS = [
  {name:'Sheikh Abdullah Al Nahyan',src:'WhatsApp',budget:'AED 45M',intent:'Buy',initMins:18},
  {name:'Sarah Thompson (UK Investor)',src:'Website Form',budget:'AED 12M',intent:'Invest',initMins:7},
  {name:'Mr. Zhang Wei',src:'Instagram DM',budget:'AED 8M',intent:'Buy',initMins:3},
  {name:'Rania Al Farsi',src:'WhatsApp',budget:'AED 3.5M',intent:'Rent',initMins:11},
];

export const LeadSlaEscalationTimer: FC = () => {
  const [mins, setMins] = useState(LEADS.map(l=>l.initMins));
  const [assigned, setAssigned] = useState<boolean[]>(LEADS.map(()=>false));

  useEffect(()=>{
    const iv = setInterval(()=>setMins(prev=>prev.map((m,i)=>assigned[i]?m:m+0.016)),1000);
    return ()=>clearInterval(iv);
  },[assigned]);

  const escalate = (i:number) => setAssigned(prev=>prev.map((a,j)=>j===i?true:a));

  return (
    <Wrap data-testid="lead-sla-escalation-timer">
      <Head>
        <Title>⏱️ 15-Min Lead SLA Escalation</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700,animation:`${blink} 2s infinite`}}>
          🔴 LIVE
        </div>
      </Head>
      <Body>
        <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.2)',fontSize:'.72rem',color:'#94A3B8'}}>
          ⚠️ Dubai RERA Best Practice: All inbound leads must receive a first response within <strong style={{color:'#EF4444'}}>15 minutes</strong>. Breach triggers auto-reassignment.
        </div>

        <LeadList>
          {LEADS.map((l,i)=>(
            <LeadCard key={i} $mins={mins[i]} $assigned={assigned[i]}>
              <LeadTop>
                <LeadName>{assigned[i]?'✅ ':mins[i]>=15?'🔴 ':'⏱ '}{l.name}</LeadName>
                <CountDown $mins={mins[i]} $assigned={assigned[i]}>
                  {assigned[i]?'HANDLED':`${Math.floor(mins[i])}m ${Math.floor((mins[i]%1)*60).toString().padStart(2,'0')}s`}
                </CountDown>
              </LeadTop>
              <LeadMeta>
                <MetaChip>📱 {l.src}</MetaChip>
                <MetaChip>💰 {l.budget}</MetaChip>
                <MetaChip>🎯 {l.intent}</MetaChip>
              </LeadMeta>
              {!assigned[i] && mins[i]>=15 && (
                <AssignBtn $assigned={false} onClick={()=>escalate(i)}>
                  🔴 SLA BREACHED — Auto-Escalate to Supervisor
                </AssignBtn>
              )}
              {!assigned[i] && mins[i]<15 && (
                <AssignBtn $assigned={false} onClick={()=>escalate(i)} style={{background:'rgba(16,185,129,0.08)',color:'#10B981'}}>
                  ✅ Mark as Contacted
                </AssignBtn>
              )}
              {assigned[i] && <AssignBtn $assigned={true}>✅ Lead Handled</AssignBtn>}
            </LeadCard>
          ))}
        </LeadList>
      </Body>
    </Wrap>
  );
};
export default LeadSlaEscalationTimer;
