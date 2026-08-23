/**
 * AgentContactFloatingCard — Wave 62 FE-GOAL-066
 * Senior broker listing agent contact card with direct WhatsApp chat button (#25D366) and phone trigger
 * White Caves Real Estate LLC — Property Detail Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  background: rgba(15, 23, 42, 0.85);
  border: 1.5px solid rgba(100, 116, 139, 0.25);
  border-radius: 16px;
  padding: 18px;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1E293B;
  border: 2px solid #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
`;

const AName = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #FFF;
`;

const ARole = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
`;

const BtnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const WhatsAppBtn = styled.button`
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #25D366;
  color: #FFF;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover { filter: brightness(1.1); }
`;

const CallBtn = styled.button`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover { background: #EF4444; color: #FFF; }
`;

export const AgentContactFloatingCard: FC<{
  name?: string;
  role?: string;
  reraNumber?: string;
  phone?: string;
}> = ({
  name = 'Arsalan Malik',
  role = 'Managing Director & Principal Broker',
  reraNumber = 'BRN #58921',
  phone = '+971 50 882 1940',
}) => {
  return (
    <Card data-testid="agent-contact-floating-card">
      <AgentHeader>
        <Avatar>👔</Avatar>
        <div>
          <AName>{name}</AName>
          <ARole>{role}</ARole>
          <div style={{ fontSize: '0.65rem', color: 'var(--accent-green, #10B981)', fontWeight: 700, marginTop: '2px' }}>
            RERA {reraNumber} · Verified
          </div>
        </div>
      </AgentHeader>

      <BtnRow>
        <WhatsAppBtn onClick={() => window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`)}>
          <span>💬</span>
          <span>WhatsApp</span>
        </WhatsAppBtn>
        <CallBtn onClick={() => window.open(`tel:${phone}`)}>
          <span>📞</span>
          <span>Call Desk</span>
        </CallBtn>
      </BtnRow>
    </Card>
  );
};

export default AgentContactFloatingCard;
