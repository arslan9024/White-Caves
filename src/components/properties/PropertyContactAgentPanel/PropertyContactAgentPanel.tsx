import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:16px;display:flex;flex-direction:column;gap:12px`;

const AgentRow = styled.div`display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2)`;
const AgentAvatar = styled.div`width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#1D4ED8,#8B5CF6);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;position:relative`;
const OnlineBadge = styled.div`position:absolute;bottom:1px;right:1px;width:12px;height:12px;border-radius:50%;background:#10B981;border:2px solid rgba(15,23,42,0.9)`;
const AgentInfo = styled.div`flex:1`;
const AgentName = styled.div`font-size:.82rem;font-weight:800;color:#E2E8F0;margin-bottom:2px`;
const AgentMeta = styled.div`font-size:.65rem;color:#64748B`;
const VerifiedBadge = styled.div`font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.12);color:#10B981;margin-top:4px;display:inline-block`;
const RatingRow = styled.div`font-size:.68rem;font-weight:700;color:#F59E0B;margin-top:2px`;
const ResponseTime = styled.div`font-size:.65rem;font-weight:700;color:#10B981;text-align:right;flex-shrink:0`;

const CTAGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:8px`;
const CTABtn = styled.a<{$primary?:boolean;$color:string}>`
  display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;border-radius:10px;
  border:none;cursor:pointer;text-decoration:none;font-size:.78rem;font-weight:800;
  font-family:'Inter',sans-serif;transition:all .15s;
  background:${p=>p.$primary?`linear-gradient(90deg,${p.$color}cc,${p.$color})`:`rgba(${p.$color==='#25D366'?'37,211,102':'59,130,246'},.1)`};
  color:${p=>p.$primary?'#FFF':p.$color};
  border:${p=>!p.$primary?`1px solid ${p.$color}30`:''};
  &:hover{filter:brightness(1.12);transform:translateY(-1px)}
`;

const AvailSlots = styled.div``;
const AvailTitle = styled.div`font-size:.68rem;font-weight:700;color:#64748B;margin-bottom:8px`;
const SlotGrid = styled.div`display:flex;gap:5px;flex-wrap:wrap`;
const Slot = styled.button<{$selected:boolean}>`
  padding:5px 11px;border-radius:6px;border:1px solid ${p=>p.$selected?'rgba(59,130,246,0.6)':'rgba(100,116,139,0.2)'};
  background:${p=>p.$selected?'rgba(59,130,246,0.12)':'transparent'};
  color:${p=>p.$selected?'#60A5FA':'#64748B'};font-size:.65rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;
`;

const SLOTS = ['10:00 AM','11:30 AM','2:00 PM','3:30 PM','5:00 PM'];

export const PropertyContactAgentPanel: FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string|null>(null);

  return (
    <Wrap data-testid="property-contact-agent-panel">
      <Head>
        <HeadTitle>👤 Contact Agent</HeadTitle>
        <ResponseTime>⚡ Avg reply: 8 min</ResponseTime>
      </Head>
      <Body>
        <AgentRow>
          <AgentAvatar>👩<OnlineBadge/></AgentAvatar>
          <AgentInfo>
            <AgentName>Victoria Chen</AgentName>
            <AgentMeta>Luxury Sales Director · Dubai Marina Specialist</AgentMeta>
            <VerifiedBadge>✓ RERA Certified · BRN 28841</VerifiedBadge>
            <RatingRow>⭐⭐⭐⭐⭐ 4.9 · 52 deals closed</RatingRow>
          </AgentInfo>
        </AgentRow>

        <CTAGrid>
          <CTABtn $primary $color="#25D366" href="https://wa.me/971508824441">
            💬 WhatsApp
          </CTABtn>
          <CTABtn $primary $color="#3B82F6" href="tel:+971508824441">
            📞 Call Now
          </CTABtn>
          <CTABtn $color="#3B82F6" href="mailto:victoria@whitecaves.ae">
            📧 Email
          </CTABtn>
          <CTABtn $color="#8B5CF6" href="#">
            📅 Schedule Tour
          </CTABtn>
        </CTAGrid>

        <AvailSlots>
          <AvailTitle>🗓️ Available Today — Sep 8</AvailTitle>
          <SlotGrid>
            {SLOTS.map(s=>(
              <Slot key={s} $selected={selectedSlot===s} onClick={()=>setSelectedSlot(s)}>{s}</Slot>
            ))}
          </SlotGrid>
        </AvailSlots>
      </Body>
    </Wrap>
  );
};
export default PropertyContactAgentPanel;
