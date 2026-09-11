import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:500px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;

const Field = styled.div`display:flex;flex-direction:column;gap:8px;margin-bottom:20px`;
const Label = styled.label`font-size:.75rem;color:#94A3B8;font-weight:600;display:flex;justify-content:space-between`;
const Select = styled.select`padding:12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.85rem;outline:none`;
const TextArea = styled.textarea`padding:12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.9rem;outline:none;resize:vertical;min-height:100px;font-family:inherit;line-height:1.5`;

const PhonePreview = styled.div`background:linear-gradient(180deg,#F1F5F9,#E2E8F0);border-radius:16px;padding:16px;margin-bottom:24px;border:4px solid #0F172A`;
const Bubble = styled.div`background:#10B981;color:#FFF;padding:12px 16px;border-radius:16px 16px 4px 16px;font-size:.85rem;line-height:1.4;max-width:80%;margin-left:auto;box-shadow:0 2px 4px rgba(0,0,0,0.1)`;

const SendBtn = styled.button`width:100%;padding:14px;background:#10B981;color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px`;

export const SMSBroadcastComposer: FC = () => {
  const [text, setText] = useState('Hi [Name], the new phase of Palm Jebel Ali is launching tomorrow. Reply YES to register your interest.');
  
  return (
    <Wrap data-testid="sms-broadcast-composer">
      <Title>📱 SMS Broadcast</Title>
      
      <Field>
        <Label>Recipient List <span>1,240 Contacts</span></Label>
        <Select defaultValue="palm">
          <option value="palm">Palm Jebel Ali Waitlist</option>
          <option value="all">All Active Buyers</option>
        </Select>
      </Field>

      <Field>
        <Label>Message Body <span>{text.length}/160 chars</span></Label>
        <TextArea value={text} onChange={e=>setText(e.target.value)} />
      </Field>

      <PhonePreview>
        <Bubble>{text.replace('[Name]', 'Sarah')}</Bubble>
      </PhonePreview>

      <SendBtn>Send SMS Broadcast</SendBtn>
    </Wrap>
  );
};
export default SMSBroadcastComposer;
