import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}70%{box-shadow:0 0 0 10px rgba(239,68,68,0)}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const TimerCard = styled.div<{$days:number}>`
  padding:24px;border-radius:16px;
  background:${p=>p.$days<=7?'rgba(239,68,68,0.08)':p.$days<=30?'rgba(245,158,11,0.06)':'rgba(16,185,129,0.06)'};
  border:2px solid ${p=>p.$days<=7?'rgba(239,68,68,0.35)':p.$days<=30?'rgba(245,158,11,0.3)':'rgba(16,185,129,0.25)'};
  text-align:center;
`;
const DaysBig = styled.div<{$days:number}>`
  font-size:3rem;font-weight:900;
  color:${p=>p.$days<=7?'#EF4444':p.$days<=30?'#F59E0B':'#10B981'};
  animation:${p=>p.$days<=7?pulse:''} 2s ease-in-out infinite;
  display:inline-block;
`;
const DaysLabel = styled.div`font-size:.8rem;color:#64748B;margin-top:4px`;
const LegalRef = styled.div`font-size:.72rem;color:#94A3B8;margin-top:6px;font-weight:600`;

const StepList = styled.div`display:flex;flex-direction:column;gap:7px`;
const Step = styled.div<{$done:boolean;$active:boolean}>`
  display:flex;align-items:flex-start;gap:10px;padding:9px 12px;border-radius:9px;
  background:${p=>p.$done?'rgba(16,185,129,0.06)':p.$active?'rgba(239,68,68,0.07)':'rgba(15,23,42,0.5)'};
  border:1px solid ${p=>p.$done?'rgba(16,185,129,0.2)':p.$active?'rgba(239,68,68,0.2)':'rgba(100,116,139,0.12)'};
`;
const StepIcon = styled.div`font-size:.85rem;flex-shrink:0;margin-top:1px`;
const StepText = styled.div`flex:1`;
const StepLabel = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1`;
const StepSub = styled.div`font-size:.67rem;color:#64748B;margin-top:2px`;

const NoticeBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#DC2626,#EF4444);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const STEPS = [
  { label: 'Issue Notice to Vacate — Form 12', sub: 'Certified mail via Notary Public / Dubai Courts', done: true, active: false },
  { label: '12-Month Statutory Notice Period Begins', sub: 'Tenant has full 12 months to vacate (Art. 25/2007)', done: true, active: false },
  { label: 'Confirm Landlord Intent (Sale/Personal Use)', sub: 'Must prove genuine reason per Law 33/2008', done: false, active: true },
  { label: 'RERA Dispute Resolution (if contested)', sub: "Tenant may file RDC within 30 days of receiving notice", done: false, active: false },
  { label: 'Enforcement via Dubai Courts (if required)', sub: 'Court Order for eviction issued after 12-month lapse', done: false, active: false },
];

export const Form12MailTracker: FC = () => {
  const [daysLeft, setDaysLeft] = useState(187);

  return (
    <Wrap data-testid="form12-mail-tracker">
      <Head>
        <Title>📬 Form 12 — Eviction Notice Tracker</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700}}>Law 33/2008</div>
      </Head>
      <Body>
        <TimerCard $days={daysLeft}>
          <DaysBig $days={daysLeft}>{daysLeft}</DaysBig>
          <DaysLabel>days remaining in 12-month notice period</DaysLabel>
          <LegalRef>📋 Issued: Jan 01, 2026 — Expires: Dec 31, 2026</LegalRef>
        </TimerCard>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{fontSize:'.7rem',color:'#64748B'}}>Simulate days:</div>
          {[187,90,30,7,0].map(d=>(
            <button key={d} onClick={()=>setDaysLeft(d)} style={{padding:'3px 10px',borderRadius:'6px',border:'1px solid rgba(100,116,139,0.3)',background:d===daysLeft?'#EF4444':'transparent',color:d===daysLeft?'#FFF':'#64748B',fontSize:'.65rem',fontWeight:700,cursor:'pointer'}}>
              {d}d
            </button>
          ))}
        </div>

        <StepList>
          {STEPS.map((s,i)=>(
            <Step key={i} $done={s.done} $active={s.active}>
              <StepIcon>{s.done?'✅':s.active?'🔴':'⏳'}</StepIcon>
              <StepText><StepLabel>{s.label}</StepLabel><StepSub>{s.sub}</StepSub></StepText>
            </Step>
          ))}
        </StepList>

        <NoticeBtn>📬 Send Certified Form 12 via Notary Mail</NoticeBtn>
      </Body>
    </Wrap>
  );
};
export default Form12MailTracker;
