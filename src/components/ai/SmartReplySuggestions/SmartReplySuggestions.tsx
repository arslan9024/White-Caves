import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#1E293B;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;padding:16px;color:#FFF`;
const Header = styled.div`display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:.85rem;color:#A78BFA;font-weight:800;text-transform:uppercase;letter-spacing:1px`;

const SugList = styled.div`display:flex;flex-direction:column;gap:8px`;
const SugBtn = styled.button`width:100%;text-align:left;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#E2E8F0;font-size:.85rem;cursor:pointer;transition:all .2s;&:hover{background:rgba(167,139,250,0.2);border-color:#A78BFA;color:#FFF}`;

export const SmartReplySuggestions: FC = () => {
  return (
    <Wrap data-testid="smart-reply-suggestions">
      <Header>✨ AI Suggested Replies</Header>
      
      <SugList>
        <SugBtn>Hi James, yes, Apt 1402 is still available. Would you like to view it tomorrow?</SugBtn>
        <SugBtn>I can confirm the developer is accepting 20% down payment for this unit.</SugBtn>
        <SugBtn>No problem, let's reschedule for next week. What day works best for you?</SugBtn>
      </SugList>
    </Wrap>
  );
};
export default SmartReplySuggestions;
