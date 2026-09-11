import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;display:flex;align-items:center;gap:8px`;

const Flow = styled.div`display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.03);padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,0.05)`;

const AppIcon = styled.div<{$bg:string}>`width:60px;height:60px;border-radius:16px;background:${p=>p.$bg};display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;color:#FFF`;
const Arrow = styled.div`font-size:1.5rem;color:#64748B`;

const ConfigPanel = styled.div`margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1)`;
const Select = styled.select`padding:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#FFF;width:100%;font-size:.9rem;outline:none`;

export const ZapierIntegrationConfig: FC = () => {
  return (
    <Wrap data-testid="zapier-integration-config">
      <Title><span style={{color:'#FF4A00'}}>Zapier</span> Webhook Config</Title>
      
      <Flow>
        <AppIcon $bg="#0F172A" style={{border:'2px solid #FFF'}}>WC</AppIcon>
        <Arrow>→</Arrow>
        <AppIcon $bg="#FF4A00">Z</AppIcon>
        <Arrow>→</Arrow>
        <AppIcon $bg="#10B981">G</AppIcon>
        <div style={{marginLeft:16}}>
          <div style={{fontWeight:800}}>Push to Google Sheets</div>
          <div style={{fontSize:'.8rem',color:'#94A3B8'}}>Triggered on new lead creation</div>
        </div>
      </Flow>

      <ConfigPanel>
        <div style={{fontSize:'.85rem',fontWeight:700,marginBottom:8,color:'#94A3B8'}}>Trigger Event</div>
        <Select defaultValue="new_lead">
          <option value="new_lead">New Lead Created</option>
          <option value="deal_won">Deal Closed Won</option>
          <option value="viewing_booked">Viewing Booked</option>
        </Select>
      </ConfigPanel>
    </Wrap>
  );
};
export default ZapierIntegrationConfig;
