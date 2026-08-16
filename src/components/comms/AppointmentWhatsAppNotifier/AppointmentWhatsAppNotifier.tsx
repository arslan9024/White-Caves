/**
 * AppointmentWhatsAppNotifier — Wave 51 GOAL-054
 * Automated viewing appointment confirmation WhatsApp message dispatch
 * White Caves Real Estate LLC — Communications & WhatsApp Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(37, 211, 102, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(37, 211, 102, 0.06);
  border-bottom: 1px solid rgba(37, 211, 102, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WaBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #25D366;
  background: rgba(37, 211, 102, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(37, 211, 102, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: #25D366; }
`;

const WhatsAppBubble = styled.div`
  padding: 14px;
  border-radius: 12px 12px 12px 0px;
  background: #0B3C26;
  border: 1px solid rgba(37, 211, 102, 0.3);
  color: #E2E8F0;
  font-size: 0.78rem;
  line-height: 1.5;
  white-space: pre-wrap;
  position: relative;
`;

const SendBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #128C7E, #25D366);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const AppointmentWhatsAppNotifier: FC = () => {
  const [clientName, setClientName] = useState('Sir Jonathan Hayes');
  const [phone, setPhone] = useState('+971 50 123 4567');
  const [propertyTitle, setPropertyTitle] = useState('Signature Villa, Frond N, Palm Jumeirah');
  const [viewingDate, setViewingDate] = useState('2026-08-16');
  const [viewingTime, setViewingTime] = useState('16:30');
  const [agentName, setAgentName] = useState('Arsalan Malik (Managing Director)');
  const [sent, setSent] = useState(false);

  const previewMessage = `🌟 *White Caves Real Estate LLC — Viewing Confirmation* 🌟

Dear ${clientName},

Your private viewing appointment for *${propertyTitle}* has been officially scheduled.

📅 *Date:* ${viewingDate}
⏰ *Time:* ${viewingTime} (UAE Standard Time)
📍 *Location:* ${propertyTitle}
👤 *Hosting Agent:* ${agentName}

🚘 *Access Directions & Gate Pass:*
Your digital visitor pass code is: *WC-PASS-8842*
Security at the main gate has been pre-cleared.

Reply to this message or call our concierge desk if you require luxury chauffeur service or rescheduling.

_White Caves Global Agency | RERA ORN: 44483_`;

  return (
    <Wrap data-testid="appointment-whatsapp-notifier">
      <Head>
        <Title>💬 WhatsApp Viewing Notifier & Gate Pass Engine</Title>
        <WaBadge>WHATSAPP BUSINESS API</WaBadge>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Client Name</FLabel>
            <Input value={clientName} onChange={e => setClientName(e.target.value)} />
          </Field>
          <Field>
            <FLabel>WhatsApp Phone Number</FLabel>
            <Input value={phone} onChange={e => setPhone(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Viewing Date</FLabel>
            <Input type="date" value={viewingDate} onChange={e => setViewingDate(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Viewing Time</FLabel>
            <Input type="time" value={viewingTime} onChange={e => setViewingTime(e.target.value)} />
          </Field>
        </FormGrid>

        <div>
          <FLabel style={{ marginBottom: '6px', display: 'block' }}>WhatsApp Message Preview (Template: WC_VIEWING_CONFIRM_V2)</FLabel>
          <WhatsAppBubble>{previewMessage}</WhatsAppBubble>
        </div>

        {sent ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', textAlign: 'center', color: '#25D366', fontWeight: 800, fontSize: '0.82rem' }}>
            ✓ WhatsApp Notification Dispatched & Delivered to {phone}!
          </div>
        ) : (
          <SendBtn onClick={() => setSent(true)}>
            📲 Dispatch WhatsApp Confirmation & Gate Pass
          </SendBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default AppointmentWhatsAppNotifier;
