import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const StatusBanner = styled.div<{$valid:boolean|null}>`
  padding:16px;border-radius:12px;text-align:center;
  background:${p=>p.$valid===null?'rgba(15,23,42,0.7)':p.$valid?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)'};
  border:2px solid ${p=>p.$valid===null?'rgba(100,116,139,0.2)':p.$valid?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'};
`;
const SIcon = styled.div`font-size:2.5rem;margin-bottom:6px`;
const SLabel = styled.div<{$valid:boolean|null}>`font-size:.9rem;font-weight:800;color:${p=>p.$valid===null?'#64748B':p.$valid?'#10B981':'#EF4444'}`;
const SRef = styled.div`font-size:.7rem;color:#64748B;margin-top:4px`;

const FormGrid = styled.div`display:flex;flex-direction:column;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#3B82F6}`;

const CheckList = styled.div`display:flex;flex-direction:column;gap:6px`;
const CheckRow = styled.div<{$ok:boolean}>`display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;background:${p=>p.$ok?'rgba(16,185,129,0.06)':'rgba(239,68,68,0.06)'};border:1px solid ${p=>p.$ok?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'}`;
const CheckLabel = styled.div`font-size:.74rem;color:#94A3B8;flex:1`;

const ValidateBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#1D4ED8,#3B82F6);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const CHECKS = ['POA Notarized by UAE Notary Public','Emirates ID of Principal Verified','Passport Copy Attached','Property Title Deed Reference Cited','Scope of Authority Clearly Defined','Expiry Date Present (max 2 years)'];

export const PoaValidationPortal: FC = () => {
  const [poaRef, setPoaRef] = useState('');
  const [grantorName, setGrantorName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [valid, setValid] = useState<boolean|null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set([0,1,2,4]));

  const toggle = (i:number) => setCheckedItems(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n});

  const validate = () => {
    setValid(checkedItems.size >= 5 && !!poaRef && !!grantorName);
  };

  return (
    <Wrap data-testid="poa-validation-portal">
      <Head>
        <Title>⚖️ Power of Attorney Validation Portal</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>Notary Doc</div>
      </Head>
      <Body>
        <StatusBanner $valid={valid}>
          <SIcon>{valid===null?'📄':valid?'✅':'❌'}</SIcon>
          <SLabel $valid={valid}>{valid===null?'Enter POA details to validate':valid?'POA VALIDATED — Authorization Active':'POA INVALID — Missing Requirements'}</SLabel>
          {valid && <SRef>Ref: POA-{Date.now().toString().slice(-8)} · {new Date().toLocaleDateString('en-AE')}</SRef>}
        </StatusBanner>

        <FormGrid>
          <Field><Label>POA Reference Number</Label><Input value={poaRef} onChange={e=>setPoaRef(e.target.value)} placeholder="UAE-NOC-POA-2025-XXXXX" /></Field>
          <Field><Label>Grantor (Principal) Full Name</Label><Input value={grantorName} onChange={e=>setGrantorName(e.target.value)} placeholder="Mohammed Al Rashid" /></Field>
          <Field><Label>Attorney (Agent) Full Name</Label><Input value={agentName} onChange={e=>setAgentName(e.target.value)} placeholder="Victoria Chen" /></Field>
        </FormGrid>

        <CheckList>
          {CHECKS.map((c,i)=>(
            <CheckRow key={i} $ok={checkedItems.has(i)} onClick={()=>toggle(i)} style={{cursor:'pointer'}}>
              <div style={{fontSize:'.8rem'}}>{checkedItems.has(i)?'✅':'⬜'}</div>
              <CheckLabel>{c}</CheckLabel>
            </CheckRow>
          ))}
        </CheckList>

        <ValidateBtn onClick={validate}>⚖️ Validate Power of Attorney</ValidateBtn>
      </Body>
    </Wrap>
  );
};
export default PoaValidationPortal;
