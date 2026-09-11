import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;

const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const NavRow = styled.div`display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid rgba(100,116,139,0.2);padding-bottom:10px`;
const NavBtn = styled.button<{$active?:boolean}>`padding:6px 12px;background:transparent;border:none;color:${p=>p.$active?'#3B82F6':'#64748B'};font-size:.8rem;font-weight:700;cursor:pointer;position:relative;font-family:'Inter',sans-serif;`;

const Content = styled.div`color:#94A3B8;font-size:.8rem;line-height:1.6`;

const Section = styled.div`margin-bottom:20px`;
const SLabel = styled.div`font-size:.65rem;font-weight:700;color:#E2E8F0;text-transform:uppercase;margin-bottom:8px;letter-spacing:1px`;
const Row = styled.div`display:flex;justify-content:space-between;padding:12px;background:rgba(30,41,59,0.5);border-radius:8px;margin-bottom:8px;align-items:center`;
const RIcon = styled.div`width:32px;height:32px;border-radius:8px;background:rgba(59,130,246,0.1);color:#3B82F6;display:flex;align-items:center;justify-content:center;font-size:1rem`;
const RText = styled.div`flex:1;margin-left:12px`;
const RTitle = styled.div`font-size:.85rem;font-weight:600;color:#E2E8F0`;
const RDesc = styled.div`font-size:.65rem;color:#64748B`;

export const UserSettingsShell: FC = () => {
  return (
    <Wrap data-testid="user-settings-shell">
      <Title>⚙️ Account Settings</Title>
      
      <NavRow>
        <NavBtn $active>Profile</NavBtn>
        <NavBtn>Notifications</NavBtn>
        <NavBtn>Security</NavBtn>
        <NavBtn>Integrations</NavBtn>
      </NavRow>

      <Content>
        <Section>
          <SLabel>Personal Details</SLabel>
          <Row>
            <RIcon>👤</RIcon>
            <RText>
              <RTitle>Victoria Chen</RTitle>
              <RDesc>victoria@whitecaves.ae</RDesc>
            </RText>
            <button style={{padding:'6px 12px',borderRadius:6,border:'1px solid #3B82F6',background:'transparent',color:'#3B82F6',fontSize:'.7rem',cursor:'pointer'}}>Edit</button>
          </Row>
        </Section>
        
        <Section>
          <SLabel>Regional Preferences</SLabel>
          <Row>
            <RIcon>🌍</RIcon>
            <RText>
              <RTitle>Language & Region</RTitle>
              <RDesc>English (UK) · Gulf Standard Time (UTC+4)</RDesc>
            </RText>
            <button style={{padding:'6px 12px',borderRadius:6,border:'1px solid #3B82F6',background:'transparent',color:'#3B82F6',fontSize:'.7rem',cursor:'pointer'}}>Edit</button>
          </Row>
        </Section>
      </Content>
    </Wrap>
  );
};
export default UserSettingsShell;
