import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:350px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#0F172A,#1E293B);border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:32px;color:#FFF;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.5)`;
const Icon = styled.div`font-size:3rem;margin-bottom:16px`;
const Title = styled.h2`margin:0 0 8px;font-size:1.2rem;font-weight:900`;
const Sub = styled.p`font-size:.85rem;color:#94A3B8;margin:0 0 24px;line-height:1.5`;

const AuthBtn = styled.button`width:100%;padding:14px;background:#FFF;color:#0F172A;border:none;border-radius:12px;font-weight:900;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;transition:all .2s;&:hover{background:#E2E8F0}`;

export const GoogleCalendarSync: FC = () => {
  return (
    <Wrap data-testid="google-calendar-sync">
      <Icon>📅</Icon>
      <Title>Google Calendar Sync</Title>
      <Sub>Connect your Google Workspace account to automatically push CRM viewing appointments to your phone's calendar.</Sub>
      
      <AuthBtn>
        <span style={{fontSize:'1.2rem'}}>G</span> Sign in with Google
      </AuthBtn>
      <div style={{fontSize:'.7rem',color:'#64748B',marginTop:16}}>Uses OAuth 2.0. We only request calendar write access.</div>
    </Wrap>
  );
};
export default GoogleCalendarSync;
