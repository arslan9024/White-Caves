import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:16px`;

const TypeRow = styled.div`display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap`;
const TypeBtn = styled.button<{$active:boolean;$color:string}>`
  padding:5px 12px;border-radius:999px;border:1px solid ${p=>p.$active?p.$color+'60':'rgba(100,116,139,0.2)'};
  background:${p=>p.$active?p.$color+'15':'transparent'};color:${p=>p.$active?p.$color:'#64748B'};
  font-size:.65rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;
`;

const TextArea = styled.textarea`
  width:100%;padding:12px 14px;border-radius:10px;border:1px solid rgba(100,116,139,0.2);
  background:rgba(30,41,59,0.6);color:#E2E8F0;font-size:.78rem;resize:none;height:90px;
  outline:none;font-family:'Inter',sans-serif;box-sizing:border-box;
  &:focus{border-color:rgba(59,130,246,0.4)}
`;

const OptionsGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:3px`;
const Label = styled.label`font-size:.65rem;color:#64748B;font-weight:600`;
const Select = styled.select`padding:7px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.2);background:rgba(30,41,59,0.6);color:#E2E8F0;font-size:.72rem;font-weight:600;outline:none;&:focus{border-color:rgba(59,130,246,0.4)}`;
const Input = styled.input`padding:7px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.2);background:rgba(30,41,59,0.6);color:#E2E8F0;font-size:.72rem;font-weight:600;outline:none;width:100%;box-sizing:border-box;&:focus{border-color:rgba(59,130,246,0.4)}`;

const FooterRow = styled.div`display:flex;gap:8px;margin-top:12px;align-items:center`;
const FollowUp = styled.div`display:flex;align-items:center;gap:6px;font-size:.65rem;color:#64748B;flex:1`;
const LogBtn = styled.button<{$color:string}>`padding:9px 18px;border-radius:9px;border:none;background:${p=>p.$color};color:#FFF;font-size:.75rem;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;&:hover{filter:brightness(1.1)}`;
const AIBtn = styled.button`padding:9px 14px;border-radius:9px;border:1px solid rgba(139,92,246,0.3);background:rgba(139,92,246,0.08);color:#A78BFA;font-size:.72rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;`;

const TYPES = [
  {label:'📞 Call',color:'#3B82F6'},
  {label:'📧 Email',color:'#F59E0B'},
  {label:'💬 WhatsApp',color:'#25D366'},
  {label:'📝 Note',color:'#8B5CF6'},
  {label:'🏠 Viewing',color:'#10B981'},
];

export const CRMActivityComposer: FC = () => {
  const [type, setType] = useState(0);
  const [text, setText] = useState('');
  const [outcome, setOutcome] = useState('positive');
  const [duration, setDuration] = useState('15');

  return (
    <Wrap data-testid="crm-activity-composer">
      <Head>
        <HeadTitle>✏️ Log Activity</HeadTitle>
        <div style={{fontSize:'.65rem',color:'#64748B'}}>Sheikh Khalid Al Nahyan</div>
      </Head>
      <Body>
        <TypeRow>
          {TYPES.map((t,i)=>(
            <TypeBtn key={i} $active={type===i} $color={t.color} onClick={()=>setType(i)}>{t.label}</TypeBtn>
          ))}
        </TypeRow>

        <TextArea
          placeholder={`Add notes for this ${TYPES[type].label.replace(/[^\w\s]/g,'').trim().toLowerCase()}...`}
          value={text}
          onChange={e=>setText(e.target.value)}
        />

        <OptionsGrid>
          <Field>
            <Label>Outcome</Label>
            <Select value={outcome} onChange={e=>setOutcome(e.target.value)}>
              <option value="positive">✅ Positive — Interested</option>
              <option value="neutral">⬜ Neutral — Follow Up</option>
              <option value="negative">❌ Not Interested</option>
              <option value="voicemail">📵 Voicemail Left</option>
            </Select>
          </Field>
          <Field>
            <Label>Duration (minutes)</Label>
            <Input type="number" value={duration} onChange={e=>setDuration(e.target.value)} min="1" max="120"/>
          </Field>
          <Field style={{gridColumn:'1/-1'}}>
            <Label>Follow-up Reminder</Label>
            <Input type="datetime-local" />
          </Field>
        </OptionsGrid>

        <FooterRow>
          <FollowUp>
            <input type="checkbox" id="fu" style={{accentColor:'#3B82F6'}}/><label htmlFor="fu">Set follow-up reminder</label>
          </FollowUp>
          <AIBtn>🤖 AI Summary</AIBtn>
          <LogBtn $color={TYPES[type].color.replace('25D366','059669')}>
            Log {TYPES[type].label.replace(/[^\w\s]/g,'').trim()}
          </LogBtn>
        </FooterRow>
      </Body>
    </Wrap>
  );
};
export default CRMActivityComposer;
