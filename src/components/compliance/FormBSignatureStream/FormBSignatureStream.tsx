import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const SignatureZone = styled.div<{$signed:boolean}>`
  padding:24px;border-radius:14px;
  background:${p=>p.$signed?'rgba(16,185,129,0.06)':'rgba(15,23,42,0.7)'};
  border:2px dashed ${p=>p.$signed?'rgba(16,185,129,0.4)':'rgba(100,116,139,0.3)'};
  text-align:center;cursor:pointer;transition:all .2s ease;
  &:hover{border-color:${p=>p.$signed?'rgba(16,185,129,0.6)':'rgba(16,185,129,0.3)'}}
`;
const SigCanvas = styled.div`font-size:2.5rem;margin-bottom:8px`;
const SigLabel = styled.div`font-size:.78rem;color:#64748B`;

const VerifyGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const VCard = styled.div<{$ok:boolean}>`
  padding:12px;border-radius:9px;
  background:${p=>p.$ok?'rgba(16,185,129,0.07)':'rgba(239,68,68,0.06)'};
  border:1px solid ${p=>p.$ok?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'};
`;
const VLabel = styled.div`font-size:.67rem;color:#64748B;margin-bottom:3px`;
const VVal = styled.div<{$ok:boolean}>`font-size:.78rem;font-weight:700;color:${p=>p.$ok?'#10B981':'#EF4444'}`;

const Btn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#059669,#10B981);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const FormBSignatureStream: FC = () => {
  const [buyerSigned, setBuyerSigned] = useState(false);
  const [agentSigned, setAgentSigned] = useState(false);
  const [verified, setVerified] = useState(false);

  const allSigned = buyerSigned && agentSigned;

  return (
    <Wrap data-testid="form-b-signature-stream">
      <Head>
        <Title>✍️ Form B — Buyer Representation Signature</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>Digital Verification</div>
      </Head>
      <Body>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <SignatureZone $signed={buyerSigned} onClick={()=>setBuyerSigned(true)}>
            <SigCanvas>{buyerSigned?'✅':'🖊️'}</SigCanvas>
            <SigLabel>{buyerSigned?'Buyer signed — John Smith':'Click to sign (Buyer)'}</SigLabel>
          </SignatureZone>
          <SignatureZone $signed={agentSigned} onClick={()=>setAgentSigned(true)}>
            <SigCanvas>{agentSigned?'✅':'🖊️'}</SigCanvas>
            <SigLabel>{agentSigned?'Agent signed — Victoria Chen':'Click to sign (Agent)'}</SigLabel>
          </SignatureZone>
        </div>

        {allSigned && !verified && (
          <Btn onClick={()=>setVerified(true)}>🔒 Verify & Submit to RERA System</Btn>
        )}

        {verified && (
          <VerifyGrid>
            <VCard $ok={true}><VLabel>Form B Ref.</VLabel><VVal $ok={true}>RERA-FB-2025-{Math.floor(Math.random()*90000+10000)}</VVal></VCard>
            <VCard $ok={true}><VLabel>Signed At</VLabel><VVal $ok={true}>{new Date().toLocaleDateString('en-AE')}</VVal></VCard>
            <VCard $ok={true}><VLabel>Buyer</VLabel><VVal $ok={true}>John Smith ✓</VVal></VCard>
            <VCard $ok={true}><VLabel>Broker</VLabel><VVal $ok={true}>Victoria Chen ✓</VVal></VCard>
            <VCard $ok={true} style={{gridColumn:'1/-1'}}><VLabel>Status</VLabel><VVal $ok={true}>✅ FORM B VERIFIED — Exclusive Buyer Representation Active</VVal></VCard>
          </VerifyGrid>
        )}

        {!allSigned && (
          <div style={{fontSize:'.72rem',color:'#64748B',padding:'10px 14px',background:'rgba(15,23,42,0.5)',borderRadius:'8px',border:'1px solid rgba(100,116,139,0.15)'}}>
            Both buyer and agent must sign Form B (RERA Regulation 85/2006) before the broker may represent the buyer exclusively.
          </div>
        )}
      </Body>
    </Wrap>
  );
};
export default FormBSignatureStream;
