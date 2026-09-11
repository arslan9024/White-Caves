import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)}70%{box-shadow:0 0 0 10px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}`;

const Wrap = styled.div`width:320px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.95);border:1px solid rgba(100,116,139,0.3);border-radius:24px;overflow:hidden;padding:24px;color:#FFF;box-shadow:0 20px 40px rgba(0,0,0,0.5)`;

const CallStatus = styled.div`text-align:center;margin-bottom:24px`;
const Name = styled.div`font-size:1.2rem;font-weight:900;color:#E2E8F0`;
const Time = styled.div`font-size:.9rem;color:#10B981;font-weight:800;margin-top:4px`;

const AvatarWrap = styled.div`width:80px;height:80px;border-radius:40px;background:#38BDF8;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:#0F172A;animation:${pulse} 2s infinite`;

const Numpad = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px`;
const Key = styled.button`background:rgba(30,41,59,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:40px;height:60px;font-size:1.4rem;font-weight:800;color:#FFF;cursor:pointer;transition:all .1s;&:active{transform:scale(0.95);background:rgba(30,41,59,0.9)}`;

const ActionRow = styled.div`display:flex;justify-content:center;gap:16px`;
const ActionBtn = styled.button<{$act:'mute'|'end'}>`
  width:60px;height:60px;border-radius:30px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.2rem;
  background:${p=>p.$act==='end'?'#EF4444':'rgba(100,116,139,0.3)'};
  color:${p=>p.$act==='end'?'#FFF':'#E2E8F0'};
`;

export const VoIPDialerPanel: FC = () => {
  return (
    <Wrap data-testid="voip-dialer-panel">
      <AvatarWrap>AM</AvatarWrap>
      
      <CallStatus>
        <Name>Ahmed Al Maktoum</Name>
        <Time>02:45</Time>
      </CallStatus>

      <Numpad>
        <Key>1</Key><Key>2</Key><Key>3</Key>
        <Key>4</Key><Key>5</Key><Key>6</Key>
        <Key>7</Key><Key>8</Key><Key>9</Key>
        <Key>*</Key><Key>0</Key><Key>#</Key>
      </Numpad>

      <ActionRow>
        <ActionBtn $act="mute">🎙️</ActionBtn>
        <ActionBtn $act="end">📞</ActionBtn>
        <ActionBtn $act="mute">⏺️</ActionBtn>
      </ActionRow>
    </Wrap>
  );
};
export default VoIPDialerPanel;
