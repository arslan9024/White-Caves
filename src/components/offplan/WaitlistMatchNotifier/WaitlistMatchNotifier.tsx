import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const WaitingGrid = styled.div`display:flex;flex-direction:column;gap:7px`;
const WaitCard = styled.div<{$priority:number}>`
  padding:12px 14px;border-radius:10px;
  background:${p=>p.$priority===1?'rgba(245,158,11,0.08)':'rgba(15,23,42,0.6)'};
  border:2px solid ${p=>p.$priority===1?'rgba(245,158,11,0.3)':'rgba(100,116,139,0.12)'};
  display:flex;align-items:flex-start;gap:10px;
`;
const WaitRank = styled.div<{$priority:number}>`
  width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  font-size:.78rem;font-weight:900;
  background:${p=>p.$priority===1?'rgba(245,158,11,0.2)':'rgba(100,116,139,0.15)'};
  color:${p=>p.$priority===1?'#F59E0B':'#64748B'};
`;
const WaitInfo = styled.div`flex:1`;
const WaitName = styled.div`font-size:.76rem;font-weight:700;color:#CBD5E1`;
const WaitMeta = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const WaitBudget = styled.div`font-size:.74rem;font-weight:700;color:#10B981;flex-shrink:0`;

const MatchBtn = styled.button<{$matched:boolean}>`width:100%;padding:11px;border-radius:9px;border:none;background:${p=>p.$matched?'rgba(16,185,129,0.1)':'rgba(16,185,129,0.12)'};color:#10B981;font-size:.8rem;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;&:hover{background:rgba(16,185,129,0.2)}`;

const WAITLIST = [
  {name:'Sheikh Khalid Al Nahyan',interest:'3BR+ Palm Villa',budget:'AED 45M+',since:'Jun 2026',notify:true},
  {name:'James Rothschild',interest:'Penthouse Downtown',budget:'AED 20M+',since:'Jul 2026',notify:false},
  {name:'Zhang Wei (HK Office)',interest:'2-3BR Marina',budget:'AED 8-12M',since:'Aug 2026',notify:false},
  {name:'Dr. Aisha Mohammed',interest:'4BR JBR beachfront',budget:'AED 18M',since:'Aug 2026',notify:true},
];

export const WaitlistMatchNotifier: FC = () => {
  const [matched, setMatched] = useState(new Set<number>());

  return (
    <Wrap data-testid="waitlist-match-notifier">
      <Head>
        <Title>⏳ Waitlist Match Notifier</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>{WAITLIST.length} on List</div>
      </Head>
      <Body>
        <div style={{padding:'9px 14px',borderRadius:'8px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.18)',fontSize:'.72rem',color:'#94A3B8'}}>
          🔔 New listing match found: <strong style={{color:'#10B981'}}>Palm Jumeirah Villa — AED 42M · 5BR</strong> — 2 waitlist clients match criteria
        </div>

        <WaitingGrid>
          {WAITLIST.map((w,i)=>(
            <WaitCard key={i} $priority={i===0?1:2}>
              <WaitRank $priority={i===0?1:2}>{i+1}</WaitRank>
              <WaitInfo>
                <WaitName>{w.notify?'🔔 ':''}{w.name}</WaitName>
                <WaitMeta>📋 {w.interest} · Registered: {w.since}</WaitMeta>
                {matched.has(i) && (
                  <div style={{fontSize:'.65rem',color:'#10B981',marginTop:4,fontWeight:700}}>✅ Notification sent via WhatsApp</div>
                )}
              </WaitInfo>
              <WaitBudget>{w.budget}</WaitBudget>
            </WaitCard>
          ))}
        </WaitingGrid>

        <MatchBtn $matched={matched.size===WAITLIST.length} onClick={()=>setMatched(new Set([0,1,2,3]))}>
          {matched.size===WAITLIST.length?'✅ All Clients Notified':'🔔 Send Match Notification to All Clients'}
        </MatchBtn>
      </Body>
    </Wrap>
  );
};
export default WaitlistMatchNotifier;
