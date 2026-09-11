import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800`;

const HookRow = styled.div`display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid rgba(255,255,255,0.05)`;
const HName = styled.div`font-size:.95rem;font-weight:800;color:#E2E8F0`;
const HURL = styled.div`font-family:monospace;font-size:.75rem;color:#94A3B8;margin-top:4px;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px`;

const Status = styled.div<{$ok:boolean}>`
  display:flex;align-items:center;gap:6px;font-size:.75rem;font-weight:800;
  color:${p=>p.$ok?'#10B981':'#EF4444'};
`;
const Dot = styled.div<{$ok:boolean}>`width:8px;height:8px;border-radius:4px;background:${p=>p.$ok?'#10B981':'#EF4444'}`;

export const APIWebhookConfigurator: FC = () => {
  return (
    <Wrap data-testid="api-webhook-configurator">
      <Title>🔗 Portal Webhooks (Lead Ingestion)</Title>
      
      <HookRow>
        <div>
          <HName>PropertyFinder XML Sync</HName>
          <HURL>https://api.whitecaves.ae/v1/webhooks/pf-leads</HURL>
        </div>
        <Status $ok={true}><Dot $ok={true} /> Listening</Status>
      </HookRow>

      <HookRow>
        <div>
          <HName>Bayut Lead Engine</HName>
          <HURL>https://api.whitecaves.ae/v1/webhooks/bayut-leads</HURL>
        </div>
        <Status $ok={false}><Dot $ok={false} /> Failing (401 Auth Error)</Status>
      </HookRow>
    </Wrap>
  );
};
export default APIWebhookConfigurator;
