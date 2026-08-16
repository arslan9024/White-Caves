/**
 * MfaPolicyToggle — Wave 55 GOAL-098
 * Multi-factor authentication (MFA / TOTP) enterprise enforcement policy toggle
 * White Caves Real Estate LLC — Security Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(139, 92, 246, 0.08);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
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

const MfaBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #A78BFA;
  background: rgba(139, 92, 246, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PolicyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PolicyCard = styled.div<{ $enabled: boolean }>`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${p => p.$enabled ? 'rgba(139, 92, 246, 0.08)' : 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${p => p.$enabled ? 'rgba(139, 92, 246, 0.3)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
`;

const PInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const PName = styled.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: #E2E8F0;
`;

const PDesc = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const ToggleSwitch = styled.button<{ $on: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: ${p => p.$on ? '#8B5CF6' : 'rgba(100, 116, 139, 0.3)'};
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${p => p.$on ? '23px' : '3px'};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #FFF;
    transition: all 0.2s ease;
  }
`;

export const MfaPolicyToggle: FC = () => {
  const [policies, setPolicies] = useState([
    { id: '1', name: 'Level 5 Managing Director & Superuser (Strict TOTP / Hardware Key)', desc: 'Mandatory FIDO2 / Google Authenticator for all executive accounts', enabled: true },
    { id: '2', name: 'Escrow & Financial Ledger Mutation MFA Gate', desc: 'Step-up authentication required for wire transfers, payouts, and deposit releases', enabled: true },
    { id: '3', name: 'Broker & Agent Daily Session MFA', desc: 'SMS OTP or WhatsApp OTP required every 24 hours upon CRM login', enabled: true },
    { id: '4', name: 'Client & Tenant Self-Service Portal 2FA', desc: 'Optional 2FA for lease document access and maintenance submission', enabled: false },
  ]);

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <Wrap data-testid="mfa-policy-toggle">
      <Head>
        <Title>🔐 Enterprise MFA & TOTP Authentication Policy</Title>
        <MfaBadge>ZERO-TRUST ACCESS</MfaBadge>
      </Head>
      <Body>
        <PolicyList>
          {policies.map(p => (
            <PolicyCard key={p.id} $enabled={p.enabled}>
              <PInfo>
                <PName>{p.name}</PName>
                <PDesc>{p.desc}</PDesc>
              </PInfo>
              <ToggleSwitch $on={p.enabled} onClick={() => togglePolicy(p.id)} />
            </PolicyCard>
          ))}
        </PolicyList>
      </Body>
    </Wrap>
  );
};

export default MfaPolicyToggle;
