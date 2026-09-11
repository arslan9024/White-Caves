import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const PlanSelect = styled.div`display:flex;gap:6px;flex-wrap:wrap`;
const PlanBtn = styled.button<{$active:boolean}>`padding:5px 12px;border-radius:999px;border:1px solid ${p=>p.$active?'rgba(59,130,246,0.5)':'rgba(100,116,139,0.25)'};background:${p=>p.$active?'rgba(59,130,246,0.12)':'transparent'};color:${p=>p.$active?'#60A5FA':'#64748B'};font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s`;

const Timeline = styled.div`position:relative;padding:12px 0;`;
const TLine = styled.div`position:absolute;top:0;bottom:0;left:18px;width:2px;background:linear-gradient(180deg,rgba(59,130,246,0.5),rgba(59,130,246,0.1))`;
const TItem = styled.div<{$done:boolean;$current:boolean}>`display:flex;align-items:flex-start;gap:14px;padding:8px 0`;
const TDot = styled.div<{$done:boolean;$current:boolean}>`width:18px;height:18px;border-radius:50%;flex-shrink:0;z-index:1;background:${p=>p.$done?'#3B82F6':p.$current?'rgba(59,130,246,0.3)':'rgba(30,41,59,0.8)'};border:2px solid ${p=>p.$done?'#3B82F6':p.$current?'#60A5FA':'rgba(100,116,139,0.3)'};display:flex;align-items:center;justify-content:center;font-size:.5rem`;
const TContent = styled.div`flex:1`;
const TLabel = styled.div<{$done:boolean;$current:boolean}>`font-size:.75rem;font-weight:700;color:${p=>p.$done?'#60A5FA':p.$current?'#E2E8F0':'#64748B'}`;
const TAmount = styled.div`font-size:.7rem;font-weight:900;color:#10B981;margin-top:2px`;
const TDate = styled.div`font-size:.65rem;color:#475569;margin-top:1px`;
const TNote = styled.div`font-size:.65rem;color:#64748B;margin-top:2px;font-style:italic`;

const PLANS: Record<string,{label:string,milestones:{pct:number,amount:number,label:string,date:string,note:string}[]}> = {
  '10/90':{label:'10% Now / 90% on Handover',milestones:[
    {pct:10,amount:280000,label:'Booking Deposit',date:'Sep 2026',note:'Payable now — secures unit'},
    {pct:90,amount:2520000,label:'On Handover',date:'Dec 2029',note:'Balance due upon key handover'},
  ]},
  '50/50':{label:'50% Construction / 50% Handover',milestones:[
    {pct:10,amount:280000,label:'EOI Deposit',date:'Sep 2026',note:''},
    {pct:20,amount:560000,label:'Foundation Complete',date:'Mar 2027',note:''},
    {pct:20,amount:560000,label:'Mid-Construction',date:'Sep 2027',note:''},
    {pct:50,amount:1400000,label:'On Handover',date:'Jun 2028',note:''},
  ]},
  'Post-Handover':{label:'40/60 Post-Handover (3yr)',milestones:[
    {pct:10,amount:280000,label:'EOI Deposit',date:'Sep 2026',note:''},
    {pct:15,amount:420000,label:'SPA Signing',date:'Oct 2026',note:''},
    {pct:15,amount:420000,label:'Construction',date:'Jun 2027',note:''},
    {pct:60,amount:1680000,label:'Post-Handover (36 installments)',date:'2028–2031',note:'No interest — developer financed'},
  ]},
};

const totalPrice = 2800000;

export const PaymentPlanTimelineVisualizer: FC = () => {
  const [plan, setPlan] = useState('Post-Handover');
  const current = PLANS[plan];

  return (
    <Wrap data-testid="payment-plan-timeline-visualizer">
      <Head>
        <Title>📊 Payment Plan Timeline</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>AED {totalPrice.toLocaleString()}</div>
      </Head>
      <Body>
        <PlanSelect>
          {Object.keys(PLANS).map(p=>(
            <PlanBtn key={p} $active={plan===p} onClick={()=>setPlan(p)}>{p}</PlanBtn>
          ))}
        </PlanSelect>

        <div style={{padding:'8px 12px',borderRadius:'8px',background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.15)',fontSize:'.72rem',color:'#60A5FA',fontWeight:700}}>
          📋 {current.label}
        </div>

        <Timeline>
          <TLine/>
          {current.milestones.map((m,i)=>(
            <TItem key={i} $done={i===0} $current={i===1}>
              <TDot $done={i===0} $current={i===1}>{i===0?'✓':i+1}</TDot>
              <TContent>
                <TLabel $done={i===0} $current={i===1}>{m.label} — {m.pct}%</TLabel>
                <TAmount>AED {m.amount.toLocaleString()}</TAmount>
                <TDate>📅 {m.date}</TDate>
                {m.note && <TNote>{m.note}</TNote>}
              </TContent>
            </TItem>
          ))}
        </Timeline>
      </Body>
    </Wrap>
  );
};
export default PaymentPlanTimelineVisualizer;
