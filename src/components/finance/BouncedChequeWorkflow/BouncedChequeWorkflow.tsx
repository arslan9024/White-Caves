import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const WorkflowCard = styled.div<{$active:boolean}>`
  padding:16px;border-radius:14px;
  background:${p=>p.$active?'rgba(239,68,68,0.1)':'rgba(15,23,42,0.6)'};
  border:2px solid ${p=>p.$active?'rgba(239,68,68,0.4)':'rgba(100,116,139,0.15)'};
`;
const WTitle = styled.div`font-size:.8rem;font-weight:700;color:#E2E8F0;margin-bottom:8px`;
const WStep = styled.div<{$done:boolean}>`
  display:flex;align-items:flex-start;gap:8px;padding:6px 0;
  border-bottom:1px solid rgba(100,116,139,0.08);
  &:last-child{border-bottom:none}
`;
const WStepIcon = styled.div`font-size:.8rem;flex-shrink:0`;
const WStepText = styled.div`font-size:.72rem;color:#94A3B8;line-height:1.4`;

const AlertBanner = styled.div`
  padding:14px;border-radius:12px;
  background:rgba(239,68,68,0.1);border:2px solid rgba(239,68,68,0.35);
  text-align:center;
`;
const AlertTitle = styled.div`font-size:.9rem;font-weight:900;color:#EF4444`;
const AlertSub = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px`;

const ActionGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:8px`;
const ActionBtn = styled.button<{$primary?:boolean}>`
  padding:10px;border-radius:9px;border:${p=>p.$primary?'none':'1px solid rgba(239,68,68,0.3)'};
  background:${p=>p.$primary?'linear-gradient(90deg,#DC2626,#EF4444)':'transparent'};
  color:${p=>p.$primary?'#FFF':'#EF4444'};font-size:.75rem;font-weight:700;cursor:pointer;
  transition:all .2s;&:hover{filter:brightness(1.1)}font-family:'Inter',sans-serif;
`;

const CB_STEPS_LEGAL = [
  'Return cheque issued by drawee bank (Central Bank Notice)',
  'File police complaint within 4 years of cheque date',
  'Serve Notice of Dishonour to drawer within 30 days',
  'File civil claim for AED amount + interest + costs',
  'Obtain Dubai Court judgment for enforcement',
];
const CB_STEPS_ADR = [
  'Issue demand letter (registered mail) — 15-day deadline',
  'Attempt amicable settlement / payment plan',
  'RERA/RDC Mediation (if tenancy-related)',
  'Small Claims Court (amounts < AED 500,000)',
];

export const BouncedChequeWorkflow: FC = () => {
  const [selected, setSelected] = useState<'legal'|'adr'>('legal');
  const [filed, setFiled] = useState(false);

  return (
    <Wrap data-testid="bounced-cheque-workflow">
      <Head>
        <Title>⚠️ Bounced Cheque Legal Workflow</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700}}>CBUAE Form 4</div>
      </Head>
      <Body>
        <AlertBanner>
          <AlertTitle>🔴 CHEQUE BOUNCED — ACCOUNT FUNDS INSUFFICIENT</AlertTitle>
          <AlertSub>Cheque #002841 · AED 30,000 · Emirates NBD · Returned: {new Date().toLocaleDateString('en-AE')}</AlertSub>
        </AlertBanner>

        <div style={{display:'flex',gap:8}}>
          {([['legal','⚖️ Legal Route'],['adr','🤝 ADR / Mediation']] as const).map(([k,l])=>(
            <button key={k} onClick={()=>setSelected(k)} style={{flex:1,padding:'8px',borderRadius:'8px',border:`1px solid ${k===selected?'rgba(239,68,68,0.5)':'rgba(100,116,139,0.25)'}`,background:k===selected?'rgba(239,68,68,0.1)':'transparent',color:k===selected?'#EF4444':'#64748B',fontSize:'.75rem',fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
              {l}
            </button>
          ))}
        </div>

        <WorkflowCard $active={true}>
          <WTitle>{selected==='legal'?'⚖️ Criminal / Civil Legal Proceedings':'🤝 Alternative Dispute Resolution'}</WTitle>
          {(selected==='legal'?CB_STEPS_LEGAL:CB_STEPS_ADR).map((s,i)=>(
            <WStep key={i} $done={i<2}>
              <WStepIcon>{i<2?'✅':'📋'}</WStepIcon>
              <WStepText>{s}</WStepText>
            </WStep>
          ))}
        </WorkflowCard>

        <ActionGrid>
          <ActionBtn $primary onClick={()=>setFiled(true)}>
            {filed?'✅ Case Filed':'📋 File Central Bank Notice (Form 4)'}
          </ActionBtn>
          <ActionBtn>📧 Send Demand Letter</ActionBtn>
          <ActionBtn>👮 File Police Complaint</ActionBtn>
          <ActionBtn>⚖️ Dubai Courts E-Filing</ActionBtn>
        </ActionGrid>
      </Body>
    </Wrap>
  );
};
export default BouncedChequeWorkflow;
