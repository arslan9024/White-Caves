import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#3B0764,#1E1B4B);border:1px solid #C084FC;border-radius:24px;overflow:hidden;padding:32px;color:#FFF;text-align:center`;
const Badge = styled.div`display:inline-block;padding:6px 16px;background:rgba(192,132,252,0.2);color:#E879F9;border-radius:20px;font-size:.75rem;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;animation:${pulse} 2s infinite`;

const Price = styled.div`font-size:3.5rem;font-weight:900;margin-bottom:8px;text-shadow:0 0 20px rgba(192,132,252,0.5)`;
const PropName = styled.div`font-size:1.2rem;color:#E9D5FF;margin-bottom:24px;font-weight:700`;

const AgentBox = styled.div`display:inline-flex;align-items:center;gap:12px;background:rgba(0,0,0,0.3);padding:12px 24px;border-radius:50px;border:1px solid rgba(255,255,255,0.1)`;
const Ava = styled.div`width:40px;height:40px;border-radius:20px;background:#C084FC;color:#3B0764;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.1rem`;
const AName = styled.div`font-size:1.1rem;font-weight:800;color:#FFF`;

export const DealOfTheMonthHighlight: FC = () => {
  return (
    <Wrap data-testid="deal-of-the-month-highlight">
      <Badge>Deal of the Month</Badge>
      
      <Price>AED 85,000,000</Price>
      <PropName>Six Senses Residences, Palm Jumeirah</PropName>

      <AgentBox>
        <Ava>SJ</Ava>
        <div>
          <div style={{fontSize:'.75rem',color:'#C084FC',textTransform:'uppercase',letterSpacing:1,textAlign:'left'}}>Closed By</div>
          <AName>Sarah Jenkins</AName>
        </div>
      </AgentBox>
    </Wrap>
  );
};
export default DealOfTheMonthHighlight;
