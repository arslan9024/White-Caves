import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%{opacity:0.8}50%{opacity:1}100%{opacity:0.8}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#020617,#1E293B);border:1px solid rgba(56,189,248,0.3);border-radius:18px;overflow:hidden;padding:32px;color:#FFF;text-align:center`;

const Super = styled.div`font-size:.8rem;letter-spacing:4px;color:#38BDF8;text-transform:uppercase;margin-bottom:8px;font-weight:800`;
const Title = styled.h2`margin:0 0 32px;font-size:1.4rem;font-weight:900`;

const TimerBox = styled.div`display:flex;justify-content:center;gap:16px`;
const Block = styled.div`background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;width:80px;animation:${pulse} 2s infinite`;
const Num = styled.div`font-size:2.5rem;font-weight:900;color:#FFF;font-family:monospace;margin-bottom:4px`;
const Lbl = styled.div`font-size:.7rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px`;

export const HandoverCountdown: FC = () => {
  return (
    <Wrap data-testid="handover-countdown">
      <Super>Completion Nearing</Super>
      <Title>Oasis Towers (Phase 1)</Title>
      
      <TimerBox>
        <Block><Num>84</Num><Lbl>Days</Lbl></Block>
        <Block><Num>12</Num><Lbl>Hours</Lbl></Block>
        <Block><Num>45</Num><Lbl>Mins</Lbl></Block>
      </TimerBox>
      
      <div style={{marginTop:24,fontSize:'.85rem',color:'#64748B'}}>Expected Handover: Q4 2026</div>
    </Wrap>
  );
};
export default HandoverCountdown;
