import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Section = styled.div`margin-bottom:24px;border-bottom:1px solid rgba(100,116,139,0.15);padding-bottom:24px;&:last-child{border:none;margin:0;padding:0}`;
const SHead = styled.h3`font-size:.9rem;color:#E2E8F0;margin:0 0 12px`;
const SDesc = styled.p`font-size:.75rem;color:#94A3B8;margin:0 0 16px;line-height:1.4`;

const Input = styled.input`width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.85rem;outline:none;margin-bottom:12px;box-sizing:border-box`;
const BtnPrimary = styled.button`padding:8px 16px;background:#3B82F6;color:#FFF;border:none;border-radius:6px;font-weight:600;font-size:.8rem;cursor:pointer`;
const BtnOutline = styled.button`padding:8px 16px;background:transparent;color:#E2E8F0;border:1px solid rgba(100,116,139,0.4);border-radius:6px;font-weight:600;font-size:.8rem;cursor:pointer`;

const Row = styled.div`display:flex;justify-content:space-between;align-items:center;background:rgba(30,41,59,0.4);padding:12px 16px;border-radius:8px;margin-bottom:8px`;
const RTitle = styled.div`font-size:.8rem;color:#E2E8F0;font-weight:700`;
const RSub = styled.div`font-size:.65rem;color:#64748B;margin-top:4px`;

export const SecuritySettingsPanel: FC = () => {
  return (
    <Wrap data-testid="security-settings-panel">
      <Title>🔒 Security & Access</Title>
      
      <Section>
        <SHead>Change Password</SHead>
        <Input type="password" placeholder="Current Password" />
        <Input type="password" placeholder="New Password" />
        <Input type="password" placeholder="Confirm New Password" />
        <BtnPrimary>Update Password</BtnPrimary>
      </Section>

      <Section>
        <SHead>Two-Factor Authentication (2FA)</SHead>
        <SDesc>Add an extra layer of security to your account using an authenticator app (Google Authenticator, Authy).</SDesc>
        <BtnPrimary style={{background:'#10B981'}}>Enable 2FA</BtnPrimary>
      </Section>

      <Section>
        <SHead>Active Sessions</SHead>
        <SDesc>These devices are currently logged into your account. Revoke any sessions you do not recognize.</SDesc>
        
        <Row>
          <div>
            <RTitle>MacBook Pro (Chrome)</RTitle>
            <RSub>Dubai, UAE — Active Now</RSub>
          </div>
          <BtnOutline style={{color:'#10B981',borderColor:'#10B981'}}>Current</BtnOutline>
        </Row>
        <Row>
          <div>
            <RTitle>iPhone 14 Pro (Safari)</RTitle>
            <RSub>Abu Dhabi, UAE — Last active 2 hours ago</RSub>
          </div>
          <BtnOutline style={{color:'#EF4444',borderColor:'#EF4444'}}>Revoke</BtnOutline>
        </Row>
      </Section>
    </Wrap>
  );
};
export default SecuritySettingsPanel;
