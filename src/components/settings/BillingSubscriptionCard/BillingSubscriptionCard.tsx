import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(145deg,rgba(15,23,42,0.9),rgba(30,41,59,0.8));border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;

const Header = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;border-bottom:1px solid rgba(100,116,139,0.15);padding-bottom:20px`;
const Title = styled.h2`margin:0 0 6px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;
const Sub = styled.p`margin:0;font-size:.75rem;color:#94A3B8`;
const Badge = styled.div`background:linear-gradient(90deg,#8B5CF6,#6366F1);color:#FFF;padding:6px 12px;border-radius:20px;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px`;

const ProgressTrack = styled.div`width:100%;height:8px;background:rgba(100,116,139,0.2);border-radius:4px;margin-top:12px;overflow:hidden`;
const ProgressFill = styled.div<{w:number}>`height:100%;width:${p=>p.w}%;background:${p=>p.w>90?'#EF4444':'#3B82F6'};border-radius:4px`;

const UsageRow = styled.div`margin-bottom:20px`;
const UHead = styled.div`display:flex;justify-content:space-between;font-size:.8rem;color:#E2E8F0;font-weight:600`;
const UVal = styled.span`color:#94A3B8;font-size:.75rem;font-weight:400`;

const UpgradeBox = styled.div`background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:16px;display:flex;justify-content:space-between;align-items:center;margin-top:24px`;
const UTitle = styled.div`font-size:.85rem;color:#C4B5FD;font-weight:700`;
const Btn = styled.button`padding:8px 16px;background:#8B5CF6;color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:.75rem;cursor:pointer`;

export const BillingSubscriptionCard: FC = () => {
  return (
    <Wrap data-testid="billing-subscription-card">
      <Header>
        <div>
          <Title>Current Plan</Title>
          <Sub>Next billing date: 01 Oct 2026</Sub>
        </div>
        <Badge>Pro Broker</Badge>
      </Header>

      <UsageRow>
        <UHead>Active Listings <UVal>145 / 200</UVal></UHead>
        <ProgressTrack><ProgressFill w={72.5} /></ProgressTrack>
      </UsageRow>
      
      <UsageRow>
        <UHead>AI Description Generations <UVal>950 / 1000</UVal></UHead>
        <ProgressTrack><ProgressFill w={95} /></ProgressTrack>
      </UsageRow>
      
      <UsageRow>
        <UHead>WhatsApp Broadcasts <UVal>2,400 / 5,000</UVal></UHead>
        <ProgressTrack><ProgressFill w={48} /></ProgressTrack>
      </UsageRow>

      <UpgradeBox>
        <div>
          <UTitle>Upgrade to Enterprise</UTitle>
          <Sub style={{marginTop:4,color:'#A78BFA'}}>Unlimited listings, AI & WhatsApp.</Sub>
        </div>
        <Btn>Upgrade Plan</Btn>
      </UpgradeBox>
    </Wrap>
  );
};
export default BillingSubscriptionCard;
