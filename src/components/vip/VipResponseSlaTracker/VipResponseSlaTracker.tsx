import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(239,68,68,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.06);border-bottom:1px solid rgba(239,68,68,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const TimerRing = styled.div<{$overdue:boolean}>`
  width:120px;height:120px;border-radius:50%;margin:0 auto;
  border:4px solid ${p=>p.$overdue?'#EF4444':'rgba(100,116,139,0.2)'};
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:${p=>p.$overdue?'rgba(239,68,68,0.08)':'rgba(15,23,42,0.5)'};
  animation:${p=>p.$overdue?pulse:''} 1.5s ease-in-out infinite;
  box-shadow:${p=>p.$overdue?'0 0 20px rgba(239,68,68,0.3)':'none'};
`;
const TimerNum = styled.div<{$overdue:boolean}>`font-size:1.8rem;font-weight:900;color:${p=>p.$overdue?'#EF4444':'#CBD5E1'}`;
const TimerLabel = styled.div`font-size:.65rem;color:#64748B;text-align:center`;

const LeadList = styled.div`display:flex;flex-direction:column;gap:7px`;
const LeadRow = styled.div<{$mins:number}>`
  display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;
  background:${p=>p.$mins>5?'rgba(239,68,68,0.08)':p.$mins>2?'rgba(245,158,11,0.07)':'rgba(16,185,129,0.06)'};
  border:1px solid ${p=>p.$mins>5?'rgba(239,68,68,0.25)':p.$mins>2?'rgba(245,158,11,0.2)':'rgba(16,185,129,0.2)'};
`;
const LeadAvatar = styled.div`width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,rgba(139,92,246,0.3),rgba(59,130,246,0.3));display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0`;
const LeadInfo = styled.div`flex:1`;
const LeadName = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1`;
const LeadSub = styled.div`font-size:.65rem;color:#64748B;margin-top:1px`;
const LeadTimer = styled.div<{$mins:number}>`font-size:.75rem;font-weight:900;color:${p=>p.$mins>5?'#EF4444':p.$mins>2?'#F59E0B':'#10B981'};flex-shrink:0`;

const EscalateBtn = styled.button`padding:5px 12px;border-radius:6px;border:none;background:rgba(239,68,68,0.15);color:#EF4444;font-size:.65rem;font-weight:700;cursor:pointer`;

const VIPS = [
  {name:'Sheikh Abdullah Al Nahyan',src:'HNWI Referral',mins:8,budget:'AED 45M'},
  {name:'Mr. James Rothschild',src:'JLL Referral',mins:3,budget:'AED 28M'},
  {name:'Ms. Li Wei (Singapore Family Office)',src:'Inbound Inquiry',mins:1,budget:'AED 18M'},
  {name:'Prince Rashed Al Qasimi',src:'Existing Client',mins:12,budget:'AED 90M'},
];

export const VipResponseSlaTracker: FC = () => {
  const [slas, setSlas] = useState(VIPS.map(v=>({...v,assigned:false})));

  const escalate = (i:number) => setSlas(prev=>prev.map((s,j)=>j===i?{...s,assigned:true}:s));

  return (
    <Wrap data-testid="vip-response-sla-tracker">
      <Head>
        <Title>⚡ VIP SLA Response Tracker</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700,animation:`${pulse} 2s ease-in-out infinite`}}>
          🔴 LIVE
        </div>
      </Head>
      <Body>
        <TimerRing $overdue={slas.some(s=>s.mins>5&&!s.assigned)}>
          <TimerNum $overdue={slas.some(s=>s.mins>5&&!s.assigned)}>5:00</TimerNum>
          <TimerLabel>VIP Response<br/>SLA Window</TimerLabel>
        </TimerRing>

        <div style={{fontSize:'.72rem',color:'#64748B',textAlign:'center',padding:'8px',background:'rgba(239,68,68,0.05)',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.12)'}}>
          ⚠️ UHNW clients must receive a response within 5 minutes. Breaches trigger auto-escalation to Director.
        </div>

        <LeadList>
          {slas.map((vip,i)=>(
            <LeadRow key={i} $mins={vip.assigned?0:vip.mins}>
              <LeadAvatar>👑</LeadAvatar>
              <LeadInfo>
                <LeadName>{vip.name}</LeadName>
                <LeadSub>{vip.src} · {vip.budget}</LeadSub>
              </LeadInfo>
              <LeadTimer $mins={vip.assigned?0:vip.mins}>
                {vip.assigned?'✅':vip.mins>5?`${vip.mins}m ⚠️`:`${vip.mins}m`}
              </LeadTimer>
              {!vip.assigned && vip.mins>5 && (
                <EscalateBtn onClick={()=>escalate(i)}>↑ Escalate</EscalateBtn>
              )}
            </LeadRow>
          ))}
        </LeadList>
      </Body>
    </Wrap>
  );
};
export default VipResponseSlaTracker;
