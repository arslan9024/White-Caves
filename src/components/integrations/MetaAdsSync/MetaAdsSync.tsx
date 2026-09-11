import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#1877F2`;

const StatGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px`;
const StatBox = styled.div`background:rgba(24,119,242,0.1);border:1px solid rgba(24,119,242,0.3);padding:16px;border-radius:12px`;
const SVal = styled.div`font-size:1.5rem;font-weight:900;color:#38BDF8`;
const SLab = styled.div`font-size:.7rem;color:#94A3B8;text-transform:uppercase;margin-top:4px`;

const FormRow = styled.div`display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05)`;
const FName = styled.div`font-size:.9rem;font-weight:800;color:#E2E8F0`;
const FStatus = styled.div`font-size:.75rem;color:#10B981;font-weight:700;display:flex;align-items:center;gap:4px`;

export const MetaAdsSync: FC = () => {
  return (
    <Wrap data-testid="meta-ads-sync">
      <Title>Meta Lead Ads Integration</Title>
      
      <StatGrid>
        <StatBox><SVal>142</SVal><SLab>Leads Synced (7d)</SLab></StatBox>
        <StatBox><SVal>AED 24.50</SVal><SLab>Cost Per Lead</SLab></StatBox>
        <StatBox><SVal style={{color:'#10B981'}}>Active</SVal><SLab>API Status</SLab></StatBox>
      </StatGrid>

      <div style={{fontSize:'.9rem',fontWeight:800,marginBottom:12}}>Connected Forms</div>
      
      <FormRow>
        <FName>Dubai Creek Harbour - Investor Form</FName>
        <FStatus>🟢 Receiving Data</FStatus>
      </FormRow>
      <FormRow>
        <FName>Off-Plan Summer Campaign 2026</FName>
        <FStatus>🟢 Receiving Data</FStatus>
      </FormRow>
    </Wrap>
  );
};
export default MetaAdsSync;
