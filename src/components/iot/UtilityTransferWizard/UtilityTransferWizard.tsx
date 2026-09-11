import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const StepWrap = styled.div`display:flex;flex-direction:column;gap:6px`;
const StepRow = styled.div<{$status:'done'|'active'|'pending'}>`
  display:flex;gap:12px;padding:12px 14px;border-radius:10px;
  background:${p=>({done:'rgba(16,185,129,0.07)',active:'rgba(59,130,246,0.08)',pending:'rgba(15,23,42,0.5)'}[p.$status])};
  border:1px solid ${p=>({done:'rgba(16,185,129,0.2)',active:'rgba(59,130,246,0.25)',pending:'rgba(100,116,139,0.1)'}[p.$status])};
`;
const StepNum = styled.div<{$status:'done'|'active'|'pending'}>`
  width:24px;height:24px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;
  background:${p=>({done:'rgba(16,185,129,0.2)',active:'rgba(59,130,246,0.2)',pending:'rgba(100,116,139,0.15)'}[p.$status])};
  color:${p=>({done:'#10B981',active:'#60A5FA',pending:'#64748B'}[p.$status])};
`;
const StepContent = styled.div`flex:1`;
const StepName = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1`;
const StepSub = styled.div`font-size:.67rem;color:#64748B;margin-top:2px;line-height:1.4`;
const StepAction = styled.button<{$done:boolean}>`
  margin-top:6px;padding:5px 12px;border-radius:6px;border:none;
  background:${p=>p.$done?'rgba(16,185,129,0.1)':'rgba(59,130,246,0.12)'};
  color:${p=>p.$done?'#10B981':'#60A5FA'};font-size:.68rem;font-weight:700;cursor:pointer;
  font-family:'Inter',sans-serif;transition:all .15s;
`;

const STEPS = [
  {name:'DEWA Account Transfer',sub:'Visit DEWA service center or use DEWA App · Bring NOC + Emirates ID · Fee: AED 110',link:'DEWA Online'},
  {name:'Empower (District Cooling) Transfer',sub:'Required for Business Bay, Downtown, DIFC areas · Phone: 800-36729',link:'Transfer Form'},
  {name:'Gas Account (Emirates Gas)',sub:'Schedule gas meter reading · Provide new tenant EID + Ejari copy',link:'Gas Portal'},
  {name:'du / Etisalat Telecom Transfer',sub:'Retain existing number or port · Ejari + passport required',link:'ISP Portal'},
  {name:'Building Management System Notification',sub:'Notify building admin of new tenancy · Register for access card',link:'BMS Form'},
];

export const UtilityTransferWizard: FC = () => {
  const [completed, setCompleted] = useState(new Set<number>([0]));
  const active = [...Array(STEPS.length).keys()].find(i=>!completed.has(i))??STEPS.length;

  const complete = (i:number) => setCompleted(prev=>{const n=new Set(prev);n.add(i);return n});

  return (
    <Wrap data-testid="utility-transfer-wizard">
      <Head>
        <Title>⚡ Utility Transfer Wizard</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>DEWA · Empower</div>
      </Head>
      <Body>
        <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)',fontSize:'.72rem',color:'#94A3B8'}}>
          📋 {completed.size}/{STEPS.length} utilities transferred · Ref: WC-UTL-{Date.now().toString().slice(-8)}
        </div>
        <StepWrap>
          {STEPS.map((s,i)=>{
            const status = completed.has(i)?'done':i===active?'active':'pending';
            return (
              <StepRow key={i} $status={status}>
                <StepNum $status={status}>{completed.has(i)?'✓':i+1}</StepNum>
                <StepContent>
                  <StepName>{s.name}</StepName>
                  <StepSub>{s.sub}</StepSub>
                  {status!=='pending' && (
                    <StepAction $done={completed.has(i)} onClick={()=>!completed.has(i)&&complete(i)}>
                      {completed.has(i)?`✅ Transferred`:`→ Open ${s.link}`}
                    </StepAction>
                  )}
                </StepContent>
              </StepRow>
            );
          })}
        </StepWrap>
      </Body>
    </Wrap>
  );
};
export default UtilityTransferWizard;
