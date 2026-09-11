import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.05);border-bottom:1px solid rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const RequestForm = styled.div`display:flex;flex-direction:column;gap:10px`;
const FieldGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(139,92,246,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#8B5CF6}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(139,92,246,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#8B5CF6}`;

const RequestList = styled.div`display:flex;flex-direction:column;gap:6px`;
const RequestRow = styled.div<{$status:'pending'|'approved'|'issued'}>`
  display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;
  background:${p=>({pending:'rgba(245,158,11,0.07)',approved:'rgba(59,130,246,0.07)',issued:'rgba(16,185,129,0.07)'}[p.$status])};
  border:1px solid ${p=>({pending:'rgba(245,158,11,0.2)',approved:'rgba(59,130,246,0.2)',issued:'rgba(16,185,129,0.2)'}[p.$status])};
`;
const RName = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1;flex:1`;
const RMeta = styled.div`font-size:.65rem;color:#64748B`;
const RBadge = styled.div<{$status:'pending'|'approved'|'issued'}>`
  padding:2px 8px;border-radius:5px;font-size:.6rem;font-weight:700;
  background:${p=>({pending:'rgba(245,158,11,0.15)',approved:'rgba(59,130,246,0.15)',issued:'rgba(16,185,129,0.15)'}[p.$status])};
  color:${p=>({pending:'#F59E0B',approved:'#60A5FA',issued:'#10B981'}[p.$status])};
`;

const EXISTING = [
  {name:'Ahmed Al Farsi',unit:'Unit 14B',cardNo:'WC-ACC-8821',status:'issued' as const},
  {name:'Sarah Thompson',unit:'Unit 7A',cardNo:'WC-ACC-7764',status:'approved' as const},
  {name:'New Tenant Request',unit:'Unit 3C',cardNo:'Pending',status:'pending' as const},
];

const SubmitBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#7C3AED,#8B5CF6);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const AccessCardApprovalWorkflow: FC = () => {
  const [tenantName, setTenantName] = useState('');
  const [unit, setUnit] = useState('');
  const [cardType, setCardType] = useState('standard');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Wrap data-testid="access-card-approval-workflow">
      <Head>
        <Title>🪪 Access Card Approval Workflow</Title>
        <div style={{fontSize:'.7rem',color:'#8B5CF6',fontWeight:700}}>Building Access</div>
      </Head>
      <Body>
        <RequestForm>
          <FieldGrid>
            <Field><Label>Tenant Name</Label><Input value={tenantName} onChange={e=>setTenantName(e.target.value)} placeholder="Full Name" /></Field>
            <Field><Label>Unit Number</Label><Input value={unit} onChange={e=>setUnit(e.target.value)} placeholder="e.g. 14B" /></Field>
          </FieldGrid>
          <Field><Label>Card Type</Label>
            <Select value={cardType} onChange={e=>setCardType(e.target.value)}>
              <option value="standard">Standard Access (Lobby + Unit + Gym)</option>
              <option value="parking">Parking + Standard</option>
              <option value="rooftop">VIP — Rooftop + All Access</option>
              <option value="visitor">Visitor (24h temporary)</option>
            </Select>
          </Field>
        </RequestForm>

        <SubmitBtn onClick={()=>setSubmitted(true)}>
          {submitted?`✅ Request Submitted — Under Review`:'🪪 Submit Access Card Request'}
        </SubmitBtn>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>Active Access Cards</div>
        <RequestList>
          {EXISTING.map((r,i)=>(
            <RequestRow key={i} $status={r.status}>
              <div style={{fontSize:'.85rem'}}>🪪</div>
              <div style={{flex:1}}>
                <RName>{r.name}</RName>
                <RMeta>{r.unit} · Card: {r.cardNo}</RMeta>
              </div>
              <RBadge $status={r.status}>{({pending:'PENDING',approved:'APPROVED',issued:'ISSUED'})[r.status]}</RBadge>
            </RequestRow>
          ))}
        </RequestList>
      </Body>
    </Wrap>
  );
};
export default AccessCardApprovalWorkflow;
