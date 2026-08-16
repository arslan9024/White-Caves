/**
 * BouncedChequeWorkflow — Wave 50 GOAL-043
 * Bounced cheque legal workflow trigger (Central Bank Notice Form 4)
 * White Caves Real Estate LLC — PDC Finance Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.5}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;display:flex;align-items:center;gap:8px;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;

const AlertBanner = styled.div`padding:12px 16px;border-radius:10px;background:rgba(239,68,68,0.08);border:1.5px solid rgba(239,68,68,0.3);display:flex;align-items:center;gap:10px;`;
const AlertDot = styled.div`width:8px;height:8px;border-radius:50%;background:#EF4444;flex-shrink:0;animation:${pulse} 1.2s ease infinite;`;
const AlertText = styled.div`font-size:0.78rem;color:#FCA5A5;font-weight:600;`;

const ChequeCard = styled.div`padding:16px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid rgba(100,116,139,0.2);`;
const ChequeGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px;`;
const CField = styled.div`display:flex;flex-direction:column;gap:3px;`;
const CLabel = styled.div`font-size:0.65rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;`;
const CValue = styled.div`font-size:0.82rem;font-weight:700;color:#E2E8F0;`;
const CValueRed = styled(CValue)`color:#EF4444;`;

const StepFlow = styled.div`display:flex;flex-direction:column;gap:0;`;
const Step = styled.div<{$status:'done'|'active'|'pending'}>`
  display:flex;align-items:flex-start;gap:12px;padding:10px 0;
  border-left:2px solid ${p=>p.$status==='done'?'#10B981':p.$status==='active'?'#EF4444':'rgba(100,116,139,0.2)'};
  margin-left:10px;padding-left:16px;position:relative;
`;
const StepDot = styled.div<{$status:'done'|'active'|'pending'}>`
  position:absolute;left:-7px;top:12px;width:12px;height:12px;border-radius:50%;flex-shrink:0;
  background:${p=>p.$status==='done'?'#10B981':p.$status==='active'?'#EF4444':'rgba(100,116,139,0.3)'};
  animation: ${p=>p.$status==='active'? pulse : 'none'} 1s ease infinite;
  border:2px solid ${p=>p.$status==='done'?'#10B981':p.$status==='active'?'#EF4444':'rgba(100,116,139,0.2)'};
`;
const StepContent = styled.div`flex:1;`;
const StepTitle = styled.div<{$status:'done'|'active'|'pending'}>`font-size:0.8rem;font-weight:700;color:${p=>p.$status==='done'?'#10B981':p.$status==='active'?'#FCA5A5':'#64748B'};`;
const StepSub = styled.div`font-size:0.68rem;color:#475569;margin-top:3px;line-height:1.4;`;
const StepTag = styled.div<{$status:'done'|'active'|'pending'}>`display:inline-block;font-size:0.62rem;font-weight:800;padding:2px 8px;border-radius:4px;background:${p=>p.$status==='done'?'rgba(16,185,129,0.1)':p.$status==='active'?'rgba(239,68,68,0.1)':'rgba(100,116,139,0.1)'};color:${p=>p.$status==='done'?'#10B981':p.$status==='active'?'#EF4444':'#64748B'};margin-top:5px;`;

const TriggerBtn = styled.button<{$step:number}>`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#DC2626,#EF4444);color:#FFF;font-size:0.85rem;font-weight:800;cursor:pointer;transition:all 0.2s ease;&:hover{filter:brightness(1.1);transform:translateY(-1px);}&:disabled{opacity:0.4;cursor:default;transform:none;}`;

type StepStatus = 'done'|'active'|'pending';

const WORKFLOW_STEPS = [
  { title:'Cheque Returned — Bank Notification', sub:'First Presentation Bounce recorded by Emirates NBD. RERA notification auto-sent.', action:'Initiate Legal Workflow', law:'UAE Penal Code Art. 401' },
  { title:'Central Bank Notice Form 4 Filed', sub:'Mandatory filing with UAE Central Bank within 3 business days of bounce.', action:'File Form 4 →', law:'CBUAE Reg. 29/2011' },
  { title:'2nd Presentation Warning Letter Dispatched', sub:'14-day cure period. Registered legal notice sent to tenant via TrustedMail™.', action:'Send Legal Notice →', law:'Dubai Law 26/2007 Art. 25' },
  { title:'Police Case Filed — Public Prosecution', sub:'Criminal complaint lodged at Dubai Police station against bounced cheque issuer.', action:'File Police Case →', law:'UAE Federal Law 18/1993' },
  { title:'Court Order & Asset Freeze Applied', sub:'Emergency injunction obtained. Tenant bank accounts and assets frozen pending hearing.', action:'Obtain Court Order →', law:'Dubai Courts Civil Procedure' },
];

export const BouncedChequeWorkflow: FC = () => {
  const [step, setStep] = useState(0); // 0=not started, 1-5=steps completed
  const [advancing, setAdvancing] = useState(false);

  const advance = () => {
    if (step >= WORKFLOW_STEPS.length || advancing) return;
    setAdvancing(true);
    setTimeout(() => { setStep(s=>s+1); setAdvancing(false); }, 900);
  };

  const getStatus = (i: number): StepStatus => {
    if (i < step) return 'done';
    if (i === step && step < WORKFLOW_STEPS.length) return 'active';
    return 'pending';
  };

  const chequeAmt = 30_000;

  return (
    <Wrap data-testid="bounced-cheque-workflow">
      <Head>
        <Title>⚠️ Bounced Cheque Legal Workflow</Title>
        <div style={{fontSize:'0.68rem',color:'#EF4444',fontWeight:700}}>Form 4 Engine</div>
      </Head>
      <Body>
        <AlertBanner>
          <AlertDot/>
          <AlertText>ALERT: PDC Cheque AED {chequeAmt.toLocaleString()} returned by Emirates NBD — Insufficient Funds</AlertText>
        </AlertBanner>

        <ChequeCard>
          <ChequeGrid>
            <CField><CLabel>Cheque Amount</CLabel><CValueRed>AED {chequeAmt.toLocaleString()}</CValueRed></CField>
            <CField><CLabel>Bank</CLabel><CValue>Emirates NBD</CValue></CField>
            <CField><CLabel>Issuer</CLabel><CValue>Mohammed Al Rashid</CValue></CField>
            <CField><CLabel>Cheque No.</CLabel><CValue>000847291</CValue></CField>
            <CField><CLabel>Bounce Date</CLabel><CValue>{new Date().toLocaleDateString('en-AE')}</CValue></CField>
            <CField><CLabel>Reason</CLabel><CValueRed>Insufficient Funds</CValueRed></CField>
          </ChequeGrid>
        </ChequeCard>

        <div>
          <div style={{fontSize:'0.7rem',fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>Legal Escalation Workflow</div>
          <StepFlow>
            {WORKFLOW_STEPS.map((s,i)=>(
              <Step key={i} $status={getStatus(i)}>
                <StepDot $status={getStatus(i)}/>
                <StepContent>
                  <StepTitle $status={getStatus(i)}>{i+1}. {s.title}</StepTitle>
                  <StepSub>{s.sub}</StepSub>
                  <StepTag $status={getStatus(i)}>{getStatus(i)==='done'?'✅ COMPLETED':getStatus(i)==='active'?'🔴 ACTION REQUIRED':'⏳ PENDING'} · {s.law}</StepTag>
                </StepContent>
              </Step>
            ))}
          </StepFlow>
        </div>

        {step < WORKFLOW_STEPS.length ? (
          <TriggerBtn $step={step} onClick={advance} disabled={advancing}>
            {advancing ? '⏳ Processing…' : step === 0 ? '⚠️ Initiate Legal Workflow' : `→ ${WORKFLOW_STEPS[step].action}`}
          </TriggerBtn>
        ) : (
          <div style={{padding:'14px',borderRadius:'12px',background:'rgba(16,185,129,0.07)',border:'1px solid rgba(16,185,129,0.25)',textAlign:'center',fontSize:'0.82rem',fontWeight:700,color:'#10B981'}}>
            ✅ All legal steps executed — Case ref: WC-BC-{new Date().getFullYear()}-{Math.floor(Math.random()*90000+10000)}
          </div>
        )}
      </Body>
    </Wrap>
  );
};

export default BouncedChequeWorkflow;
