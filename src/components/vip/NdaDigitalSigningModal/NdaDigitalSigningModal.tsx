import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(139,92,246,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.06);border-bottom:1px solid rgba(139,92,246,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const NdaBlock = styled.div`
  padding:18px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid rgba(139,92,246,0.15);
  font-size:.72rem;color:#94A3B8;line-height:1.6;max-height:180px;overflow-y:auto;
  &::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:2px}
`;
const NdaPara = styled.p`margin:0 0 8px 0`;
const SigZone = styled.div<{$signed:boolean}>`
  padding:20px;border-radius:12px;text-align:center;cursor:pointer;
  background:${p=>p.$signed?'rgba(139,92,246,0.08)':'rgba(15,23,42,0.7)'};
  border:2px dashed ${p=>p.$signed?'rgba(139,92,246,0.5)':'rgba(100,116,139,0.3)'};
  transition:all .2s;
`;
const SigLabel = styled.div`font-size:.78rem;color:#64748B;margin-top:6px`;
const SigName = styled.div`font-size:1.4rem;font-family:'Georgia',serif;color:#A78BFA;margin-bottom:4px`;

const ConfirmCard = styled.div`padding:16px;border-radius:12px;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.25);text-align:center`;

const ExecBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(139,92,246,0.1)':'linear-gradient(90deg,#7C3AED,#8B5CF6)'};color:${p=>p.$done?'#A78BFA':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const NdaDigitalSigningModal: FC = () => {
  const [disclosingParty, setDisclosingParty] = useState('White Caves Real Estate LLC');
  const [receivingParty, setReceivingParty] = useState('');
  const [signed, setSigned] = useState(false);
  const [executed, setExecuted] = useState(false);

  return (
    <Wrap data-testid="nda-digital-signing-modal">
      <Head>
        <Title>🔐 NDA — Digital Signing Modal</Title>
        <div style={{fontSize:'.7rem',color:'#8B5CF6',fontWeight:700}}>Confidential</div>
      </Head>
      <Body>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label style={{fontSize:'.7rem',color:'#94A3B8',fontWeight:600}}>Disclosing Party</label>
            <input value={disclosingParty} onChange={e=>setDisclosingParty(e.target.value)} style={{padding:'7px 10px',borderRadius:'7px',border:'1px solid rgba(100,116,139,0.3)',background:'rgba(15,23,42,0.8)',color:'#E2E8F0',fontSize:'.75rem',outline:'none'}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label style={{fontSize:'.7rem',color:'#94A3B8',fontWeight:600}}>Receiving Party</label>
            <input value={receivingParty} onChange={e=>setReceivingParty(e.target.value)} placeholder="Client / Investor Name" style={{padding:'7px 10px',borderRadius:'7px',border:'1px solid rgba(100,116,139,0.3)',background:'rgba(15,23,42,0.8)',color:'#E2E8F0',fontSize:'.75rem',outline:'none'}} />
          </div>
        </div>

        <NdaBlock>
          <NdaPara><strong style={{color:'#CBD5E1'}}>NON-DISCLOSURE AGREEMENT</strong></NdaPara>
          <NdaPara>This Non-Disclosure Agreement ("Agreement") is entered into between <strong style={{color:'#A78BFA'}}>{disclosingParty}</strong> ("Disclosing Party") and <strong style={{color:'#A78BFA'}}>{receivingParty||'[Receiving Party]'}</strong> ("Receiving Party").</NdaPara>
          <NdaPara>The Receiving Party agrees to maintain strict confidentiality regarding all off-market property listings, UHNW client identities, transaction valuations, investment strategies, and proprietary market intelligence disclosed by White Caves Real Estate LLC.</NdaPara>
          <NdaPara>Confidential information shall not be disclosed to any third party, used for any commercial purpose, or replicated in any form without prior written consent. This Agreement shall remain binding for a period of 5 (five) years from the date of execution.</NdaPara>
          <NdaPara>Any breach of this Agreement may result in immediate legal action under UAE Law 5/1985 (Civil Code) and criminal liability under UAE Cybercrime Law 5/2012.</NdaPara>
          <NdaPara>Governing Law: Emirate of Dubai, United Arab Emirates.</NdaPara>
        </NdaBlock>

        <SigZone $signed={signed} onClick={()=>setSigned(true)}>
          {signed ? <SigName>{receivingParty||'Authorized Signatory'}</SigName> : <div style={{fontSize:'2rem'}}>✍️</div>}
          <SigLabel>{signed?`Signed electronically — ${new Date().toLocaleDateString('en-AE')}`:'Click to apply digital signature'}</SigLabel>
        </SigZone>

        {executed && (
          <ConfirmCard>
            <div style={{fontSize:'1rem',fontWeight:900,color:'#A78BFA'}}>🔐 NDA Executed Successfully</div>
            <div style={{fontSize:'.7rem',color:'#64748B',marginTop:4}}>Ref: WC-NDA-{Date.now().toString().slice(-8)} · Encrypted & Timestamped</div>
          </ConfirmCard>
        )}

        <ExecBtn $done={executed} onClick={()=>signed&&setExecuted(true)} style={{opacity:signed?1:0.5}}>
          {executed?'✅ NDA Executed & Stored':signed?'🔒 Execute & Store NDA':'Sign Above to Continue'}
        </ExecBtn>
      </Body>
    </Wrap>
  );
};
export default NdaDigitalSigningModal;
