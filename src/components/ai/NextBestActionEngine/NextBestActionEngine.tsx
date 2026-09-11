import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#0F172A,#312E81);border:1px solid rgba(99,102,241,0.5);border-radius:16px;padding:24px;color:#FFF`;
const Header = styled.div`display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:.85rem;color:#818CF8;font-weight:900;text-transform:uppercase;letter-spacing:1px`;

const ActionText = styled.div`font-size:1.3rem;font-weight:800;color:#FFF;line-height:1.4;margin-bottom:16px`;

const BtnWrap = styled.div`display:flex;gap:12px`;
const Btn = styled.button<{$primary?:boolean}>`
  padding:12px 24px;border-radius:8px;font-weight:800;cursor:pointer;border:none;
  background:${p=>p.$primary?'#6366F1':'rgba(255,255,255,0.1)'};
  color:#FFF;
`;

export const NextBestActionEngine: FC = () => {
  return (
    <Wrap data-testid="next-best-action-engine">
      <Header>⚡ AI Next Best Action</Header>
      
      <ActionText>Send the Marina Heights floorplans to Sarah. She opened your last email 3 times today.</ActionText>
      
      <BtnWrap>
        <Btn $primary={true}>Generate Email</Btn>
        <Btn>Dismiss</Btn>
      </BtnWrap>
    </Wrap>
  );
};
export default NextBestActionEngine;
