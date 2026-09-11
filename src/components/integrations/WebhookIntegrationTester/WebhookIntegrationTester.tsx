import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between`;
const Badge = styled.div`font-size:.7rem;padding:4px 8px;background:rgba(16,185,129,0.15);color:#10B981;border-radius:4px`;

const URLBox = styled.div`background:rgba(0,0,0,0.3);border:1px solid rgba(100,116,139,0.3);border-radius:8px;padding:12px;font-family:monospace;color:#38BDF8;font-size:.85rem;margin-bottom:20px`;

const LogViewer = styled.div`background:#0F172A;border-radius:8px;padding:16px;font-family:monospace;font-size:.8rem;color:#E2E8F0;height:200px;overflow-y:auto`;
const LogLine = styled.div`margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:8px`;
const Method = styled.span`color:#F59E0B;font-weight:700;margin-right:8px`;
const TS = styled.span`color:#64748B;margin-right:8px`;

export const WebhookIntegrationTester: FC = () => {
  return (
    <Wrap data-testid="webhook-integration-tester">
      <Title><span>🔗 Webhook Listener</span> <Badge>Listening</Badge></Title>
      
      <div style={{fontSize:'.75rem',color:'#94A3B8',marginBottom:8}}>Your Unique Webhook URL:</div>
      <URLBox>https://api.whitecaves.ae/webhooks/pf-leads/8f7a9d2</URLBox>

      <div style={{fontSize:'.75rem',color:'#94A3B8',marginBottom:8}}>Recent Payloads (Live):</div>
      <LogViewer>
        <LogLine>
          <TS>[10:45:01]</TS> <Method>POST</Method> /webhooks/pf-leads
          <div style={{color:'#10B981',marginTop:4}}>200 OK - Lead "John Doe" created.</div>
        </LogLine>
        <LogLine>
          <TS>[10:32:15]</TS> <Method>POST</Method> /webhooks/pf-leads
          <div style={{color:'#10B981',marginTop:4}}>200 OK - Lead "Sarah Khan" created.</div>
        </LogLine>
      </LogViewer>
    </Wrap>
  );
};
export default WebhookIntegrationTester;
