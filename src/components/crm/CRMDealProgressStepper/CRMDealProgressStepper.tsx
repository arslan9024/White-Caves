import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;

const Stepper = styled.div`padding:20px`;
const StepItem = styled.div<{$status:'done'|'active'|'pending'}>`
  display:flex;gap:14px;padding-bottom:${p=>p.$status!=='pending'?'0':'0'}px;
`;

const StepLeft = styled.div`display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:32px`;
const StepDot = styled.div<{$status:'done'|'active'|'pending'}>`
  width:32px;height:32px;border-radius:50%;border:2px solid ${p=>({done:'#10B981',active:'#3B82F6',pending:'rgba(100,116,139,0.3)'}[p.$status])};
  background:${p=>({done:'rgba(16,185,129,0.15)',active:'rgba(59,130,246,0.15)',pending:'transparent'}[p.$status])};
  display:flex;align-items:center;justify-content:center;font-size:.75rem;color:${p=>({done:'#10B981',active:'#3B82F6',pending:'#475569'}[p.$status])};
  flex-shrink:0;
`;
const StepLine = styled.div<{$done:boolean}>`flex:1;width:2px;background:${p=>p.$done?'rgba(16,185,129,0.4)':'rgba(100,116,139,0.1)'};margin:4px 0;min-height:24px`;

const StepContent = styled.div`flex:1;padding-bottom:20px`;
const StepTitle = styled.div<{$status:'done'|'active'|'pending'}>`font-size:.78rem;font-weight:700;color:${p=>({done:'#10B981',active:'#E2E8F0',pending:'#475569'}[p.$status])}`;
const StepMeta = styled.div`font-size:.65rem;color:#64748B;margin-top:3px`;
const StepDate = styled.div<{$status:'done'|'active'|'pending'}>`font-size:.62rem;font-weight:700;margin-top:4px;color:${p=>({done:'#10B981',active:'#60A5FA',pending:'#475569'}[p.$status])}`;
const StepBadge = styled.div<{$status:'done'|'active'|'pending'}>`display:inline-block;padding:2px 8px;border-radius:4px;font-size:.58rem;font-weight:800;margin-top:4px;background:${p=>({done:'rgba(16,185,129,0.12)',active:'rgba(59,130,246,0.12)',pending:'rgba(100,116,139,0.1)'}[p.$status])};color:${p=>({done:'#10B981',active:'#60A5FA',pending:'#64748B'}[p.$status])}`;

const STEPS = [
  {icon:'✓',title:'Initial Inquiry',meta:'Lead registered · Source: Property Finder',date:'Completed: 01 Sep 2026',status:'done' as const},
  {icon:'✓',title:'Property Viewing',meta:'2 viewings at Marina Heights 14B',date:'Completed: 03 Sep 2026',status:'done' as const},
  {icon:'✓',title:'Offer Submitted',meta:'AED 2.38M initial offer · Counter at 2.45M',date:'Completed: 05 Sep 2026',status:'done' as const},
  {icon:'●',title:'MOU Signing',meta:'Sales & Purchase Agreement drafting · Trustee booked',date:'In Progress · Due: 09 Sep 2026',status:'active' as const},
  {icon:'○',title:'NOC & DLD Approval',meta:'Developer NOC + DLD transfer approval',date:'Pending',status:'pending' as const},
  {icon:'○',title:'Mortgage & Finance',meta:'Bank valuation + mortgage offer letter',date:'Pending',status:'pending' as const},
  {icon:'○',title:'Title Deed Transfer',meta:'Trustee office · Full payment & handover',date:'Pending',status:'pending' as const},
];

export const CRMDealProgressStepper: FC = () => (
  <Wrap data-testid="crm-deal-progress-stepper">
    <Head>
      <HeadTitle>📋 Deal Progress — Marina Heights 14B</HeadTitle>
      <div style={{fontSize:'.68rem',color:'#3B82F6',fontWeight:700}}>Step 4 of 7</div>
    </Head>
    <Stepper>
      {STEPS.map((s,i)=>(
        <StepItem key={i} $status={s.status}>
          <StepLeft>
            <StepDot $status={s.status}>{s.icon}</StepDot>
            {i<STEPS.length-1&&<StepLine $done={s.status==='done'}/>}
          </StepLeft>
          <StepContent>
            <StepTitle $status={s.status}>{s.title}</StepTitle>
            <StepMeta>{s.meta}</StepMeta>
            <StepDate $status={s.status}>{s.date}</StepDate>
            <StepBadge $status={s.status}>{s.status==='done'?'✓ Complete':s.status==='active'?'● In Progress':'○ Pending'}</StepBadge>
          </StepContent>
        </StepItem>
      ))}
    </Stepper>
  </Wrap>
);
export default CRMDealProgressStepper;
