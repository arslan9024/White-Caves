import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(239,68,68,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:900;color:#EF4444;display:flex;align-items:center;gap:8px`;

const Field = styled.div`margin-bottom:16px`;
const Label = styled.div`font-size:.8rem;color:#94A3B8;font-weight:700;margin-bottom:8px`;
const Input = styled.input`width:100%;padding:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#FFF;font-size:.9rem;outline:none`;
const Textarea = styled.textarea`width:100%;padding:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#FFF;font-size:.9rem;outline:none;min-height:80px;resize:none`;

const BtnWrap = styled.div`display:flex;justify-content:flex-end;gap:12px;margin-top:24px`;
const Btn = styled.button<{$primary?:boolean}>`padding:12px 24px;border-radius:8px;font-weight:900;cursor:pointer;border:none;
  background:${p=>p.$primary?'#EF4444':'rgba(255,255,255,0.1)'};
  color:${p=>p.$primary?'#FFF':'#E2E8F0'};
`;

export const MassNotificationCenter: FC = () => {
  return (
    <Wrap data-testid="mass-notification-center">
      <Title>🚨 Mass System Broadcast</Title>
      <p style={{fontSize:'.85rem',color:'#94A3B8',marginBottom:24,marginTop:0}}>Push an urgent notification directly to the screens of all active agents.</p>
      
      <Field>
        <Label>Broadcast Title</Label>
        <Input defaultValue="Emaar Developer Launch: Sold Out" />
      </Field>

      <Field>
        <Label>Message Body</Label>
        <Textarea defaultValue="Attention all off-plan agents: The Emaar Beachfront launch has officially sold out. Please do not accept any more Expressions of Interest (EOIs) today." />
      </Field>

      <BtnWrap>
        <Btn>Cancel</Btn>
        <Btn $primary={true}>Push to 84 Agents</Btn>
      </BtnWrap>
    </Wrap>
  );
};
export default MassNotificationCenter;
