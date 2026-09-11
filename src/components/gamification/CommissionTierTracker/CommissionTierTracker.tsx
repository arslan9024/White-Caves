import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 8px;font-size:1.1rem;font-weight:900`;
const Sub = styled.div`font-size:.85rem;color:#94A3B8;margin-bottom:24px`;

const TrackerBox = styled.div`background:rgba(255,255,255,0.03);padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,0.05)`;

const TierInfo = styled.div`display:flex;justify-content:space-between;margin-bottom:16px`;
const Current = styled.div`font-size:1.5rem;font-weight:900;color:#38BDF8`;
const Next = styled.div`text-align:right;font-size:1.2rem;font-weight:800;color:#94A3B8`;

const BarWrap = styled.div`width:100%;height:12px;background:rgba(255,255,255,0.1);border-radius:6px;overflow:hidden;margin-bottom:12px;position:relative`;
const BarFill = styled.div<{w:number}>`width:${p=>p.w}%;height:100%;background:linear-gradient(90deg,#38BDF8,#818CF8)`;

const Status = styled.div`font-size:.85rem;font-weight:700;color:#E2E8F0;text-align:center`;

export const CommissionTierTracker: FC = () => {
  return (
    <Wrap data-testid="commission-tier-tracker">
      <Title>📈 Commission Target Tracker</Title>
      <Sub>Hit your revenue goals to unlock higher commission splits.</Sub>

      <TrackerBox>
        <TierInfo>
          <div>
            <div style={{fontSize:'.75rem',color:'#94A3B8',textTransform:'uppercase'}}>Current Tier (50%)</div>
            <Current>AED 450,000</Current>
          </div>
          <div>
            <div style={{fontSize:'.75rem',color:'#94A3B8',textTransform:'uppercase'}}>Next Tier (60%)</div>
            <Next>AED 1,000,000</Next>
          </div>
        </TierInfo>

        <BarWrap><BarFill w={45} /></BarWrap>
        
        <Status>🔥 You are AED 550k away from a 60% split!</Status>
      </TrackerBox>
    </Wrap>
  );
};
export default CommissionTierTracker;
