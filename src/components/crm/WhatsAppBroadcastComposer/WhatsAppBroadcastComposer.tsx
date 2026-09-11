import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:20px`;

const Title = styled.h2`margin:0 0 16px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;
const Badge = styled.span`background:rgba(37,211,102,0.15);color:#25D366;padding:2px 8px;border-radius:10px;font-size:.65rem`;

const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px`;

const Section = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.15);border-radius:12px;padding:16px`;
const SecTitle = styled.div`font-size:.75rem;font-weight:700;color:#94A3B8;margin-bottom:12px;text-transform:uppercase`;

const Select = styled.select`width:100%;padding:10px 12px;border-radius:8px;background:rgba(15,23,42,0.8);border:1px solid rgba(100,116,139,0.2);color:#E2E8F0;font-size:.8rem;outline:none;margin-bottom:12px;font-family:'Inter',sans-serif`;

const StatsRow = styled.div`display:flex;justify-content:space-between;background:rgba(15,23,42,0.6);padding:10px 14px;border-radius:8px;margin-bottom:12px`;
const Stat = styled.div`display:flex;flex-direction:column;gap:2px`;
const SVal = styled.div`font-size:.9rem;font-weight:800;color:#3B82F6`;
const SLabel = styled.div`font-size:.6rem;color:#64748B;font-weight:600`;

const TextArea = styled.textarea`width:100%;height:100px;padding:10px 12px;border-radius:8px;background:rgba(15,23,42,0.8);border:1px solid rgba(100,116,139,0.2);color:#E2E8F0;font-size:.78rem;outline:none;resize:none;font-family:'Inter',sans-serif;margin-bottom:12px`;

const PhonePreview = styled.div`width:220px;height:380px;border:6px solid #1e293b;border-radius:24px;background:#0b141a;margin:0 auto;position:relative;overflow:hidden;display:flex;flex-direction:column`;
const PHead = styled.div`background:#202c33;padding:12px 10px;color:#FFF;font-size:.7rem;font-weight:600;display:flex;align-items:center;gap:6px`;
const PBubble = styled.div`background:#005c4b;color:#e9edef;font-size:.75rem;padding:8px 10px;border-radius:8px 8px 8px 0;margin:12px;position:relative;line-height:1.4`;

const SendBtn = styled.button`width:100%;padding:12px;border-radius:10px;background:#25D366;color:#FFF;font-weight:800;font-size:.85rem;border:none;cursor:pointer;transition:all .15s;&:hover{background:#20b958}`;

export const WhatsAppBroadcastComposer: FC = () => {
  return (
    <Wrap data-testid="whatsapp-broadcast-composer">
      <Title>📢 WhatsApp Broadcast <Badge>Marketing</Badge></Title>
      <Grid>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Section>
            <SecTitle>1. Select Audience</SecTitle>
            <Select>
              <option>VIP Investors (Saved Search: Downtown)</option>
              <option>Recent Leads (Last 30 Days)</option>
              <option>Past Clients (Off-plan Buyers)</option>
            </Select>
            <StatsRow>
              <Stat><SVal>1,248</SVal><SLabel>Recipients</SLabel></Stat>
              <Stat><SVal style={{color:'#10B981'}}>98%</SVal><SLabel>Opt-in Rate</SLabel></Stat>
              <Stat><SVal style={{color:'#F59E0B'}}>AED 45</SVal><SLabel>Est. Cost</SLabel></Stat>
            </StatsRow>
          </Section>

          <Section>
            <SecTitle>2. Message Template</SecTitle>
            <Select>
              <option>New Project Launch (Image + Text + Buttons)</option>
              <option>Market Update (Text Only)</option>
              <option>Event Invitation (Text + Location)</option>
            </Select>
            <TextArea value="Hi {{Name}}, we're launching an exclusive new sea-view project in Emaar Beachfront tomorrow. Prices start at AED 2.8M with a 60/40 payment plan." readOnly />
            <SendBtn>🚀 Schedule Broadcast</SendBtn>
          </Section>
        </div>

        <Section>
          <SecTitle>Preview</SecTitle>
          <PhonePreview>
            <PHead>
              <div style={{width:24,height:24,borderRadius:'50%',background:'#FFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px'}}>WC</div>
              White Caves RE
            </PHead>
            <PBubble>
              Hi James, we're launching an exclusive new sea-view project in Emaar Beachfront tomorrow. Prices start at AED 2.8M with a 60/40 payment plan.
            </PBubble>
          </PhonePreview>
        </Section>
      </Grid>
    </Wrap>
  );
};
export default WhatsAppBroadcastComposer;
