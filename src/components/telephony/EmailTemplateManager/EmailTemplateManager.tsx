import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:24px`;
const Title = styled.h2`margin:0;font-size:1.2rem;font-weight:800`;
const NewBtn = styled.button`padding:8px 16px;background:#38BDF8;color:#0F172A;border:none;border-radius:8px;font-weight:800;cursor:pointer`;

const List = styled.div`display:flex;flex-direction:column;gap:12px`;
const TCard = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(255,255,255,0.05);padding:16px;border-radius:12px;display:flex;justify-content:space-between;align-items:center`;
const TName = styled.div`font-size:.95rem;font-weight:800;color:#E2E8F0`;
const TSub = styled.div`font-size:.75rem;color:#94A3B8;margin-top:4px`;
const TTags = styled.div`display:flex;gap:8px`;
const Tag = styled.div`background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;font-size:.65rem;color:#CBD5E1;font-weight:700`;

export const EmailTemplateManager: FC = () => {
  return (
    <Wrap data-testid="email-template-manager">
      <Header>
        <Title>📧 Email Templates</Title>
        <NewBtn>+ Create New</NewBtn>
      </Header>
      
      <List>
        <TCard>
          <div>
            <TName>Initial Lead Follow-Up (Cold)</TName>
            <TSub>Subject: Thanks for your interest in Dubai Real Estate</TSub>
          </div>
          <TTags>
            <Tag>Sales</Tag>
            <Tag>Automated</Tag>
          </TTags>
        </TCard>
        
        <TCard>
          <div>
            <TName>Post-Viewing Feedback Request</TName>
            <TSub>Subject: How was your viewing at {'{{property_name}}'}?</TSub>
          </div>
          <TTags>
            <Tag>Operations</Tag>
          </TTags>
        </TCard>
      </List>
    </Wrap>
  );
};
export default EmailTemplateManager;
