import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const shimmer = keyframes`0% { background-position: -200% 0; } 100% { background-position: 200% 0; }`;

const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0A0614 0%, #0F172A 100%); border: 2px solid rgba(139,92,246,0.35); border-radius: 20px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.5s ease;`;
const Header = styled.div`padding: 16px 20px; background: rgba(139,92,246,0.08); border-bottom: 1px solid rgba(139,92,246,0.18); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;

const AuthGate = styled.div`padding: 32px 24px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center;`;
const VaultIcon = styled.div`font-size: 4rem; filter: drop-shadow(0 0 20px rgba(139,92,246,0.5));`;
const AuthTitle = styled.div`font-size: 1rem; font-weight: 800; color: #E2E8F0;`;
const AuthSubtitle = styled.div`font-size: 0.78rem; color: #64748B; max-width: 320px;`;

const BiometricRing = styled.div<{ $scanning: boolean }>`
  width: 80px; height: 80px;
  border-radius: 50%;
  border: 3px solid ${p => p.$scanning ? '#8B5CF6' : 'rgba(139,92,246,0.3)'};
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  background: ${p => p.$scanning ? 'rgba(139,92,246,0.15)' : 'transparent'};
  animation: ${p => p.$scanning ? 'none' : 'none'};
  &:hover { border-color: #8B5CF6; background: rgba(139,92,246,0.1); }
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid ${p => p.$scanning ? 'rgba(139,92,246,0.4)' : 'transparent'};
    animation: ${p => p.$scanning ? shimmer : 'none'} 1.5s linear infinite;
  }
`;

const LevelBadge = styled.div<{ $level: number }>`
  display: flex; align-items: center; gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(139,92,246,0.12);
  border: 1px solid rgba(139,92,246,0.3);
  color: #A78BFA;
  font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em;
`;

const AuthBtn = styled.button<{ $variant?: 'primary' }>`
  padding: 12px 32px;
  border-radius: 12px;
  border: ${p => p.$variant ? 'none' : '1px solid rgba(139,92,246,0.3)'};
  background: ${p => p.$variant ? 'linear-gradient(90deg, #7C3AED, #8B5CF6)' : 'transparent'};
  color: ${p => p.$variant ? '#FFF' : '#A78BFA'};
  font-size: 0.85rem; font-weight: 800; cursor: pointer;
  transition: all 0.2s ease;
  &:hover { transform: translateY(-1px); filter: brightness(1.1); }
`;

const VaultContent = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;
const PropertyCard = styled.div`
  padding: 16px;
  border-radius: 14px;
  background: rgba(139,92,246,0.07);
  border: 1px solid rgba(139,92,246,0.2);
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: rgba(139,92,246,0.12); }
`;
const PropInfo = styled.div``;
const PropName = styled.div`font-size: 0.85rem; font-weight: 700; color: #E2E8F0;`;
const PropMeta = styled.div`font-size: 0.72rem; color: #64748B; margin-top: 2px;`;
const PropPrice = styled.div`text-align: right;`;
const PropPriceVal = styled.div`font-size: 0.95rem; font-weight: 900; color: #A78BFA;`;
const PropBadge = styled.div`font-size: 0.62rem; color: #64748B; text-align: right;`;

const VAULT_PROPERTIES = [
  { name: 'Sky Penthouse, Burj Khalifa', meta: '5 BR · 10,500 sqft · 96th Floor', price: 85_000_000, tag: 'OFF-MARKET' },
  { name: 'Private Island Villa, World Islands', meta: '7 BR · 22,000 sqft · Beachfront', price: 120_000_000, tag: 'EXCLUSIVE' },
  { name: 'Royal Suite, Palm Crown', meta: '8 BR · 18,500 sqft · Full Palm View', price: 150_000_000, tag: 'ULTRA-RARE' },
];

export const UhnwPrivateVault: FC = () => {
  const [step, setStep] = useState<'gate' | 'biometric' | 'unlocked'>('gate');

  return (
    <Wrapper data-testid="uhnw-private-vault">
      <Header>
        <Title>🔐 UHNW Private Listing Vault</Title>
        <LevelBadge $level={5}>LEVEL 5 ACCESS</LevelBadge>
      </Header>

      {step === 'gate' && (
        <AuthGate>
          <VaultIcon>🏛️</VaultIcon>
          <AuthTitle>Ultra-High-Net-Worth Private Vault</AuthTitle>
          <AuthSubtitle>Access restricted to verified UHNW clients. Net Worth AED 50M+ required. Biometric authentication mandatory.</AuthSubtitle>
          <div style={{ display: 'flex', gap: '12px' }}>
            <AuthBtn onClick={() => setStep('biometric')} $variant="primary">🔐 Authenticate Access</AuthBtn>
            <AuthBtn>📋 Request Clearance</AuthBtn>
          </div>
        </AuthGate>
      )}

      {step === 'biometric' && (
        <AuthGate>
          <BiometricRing $scanning={true} onClick={() => setStep('unlocked')}>👁️</BiometricRing>
          <AuthTitle>Biometric Authentication</AuthTitle>
          <AuthSubtitle>Place your finger on the sensor or look at the camera. Click the iris icon to simulate authentication.</AuthSubtitle>
          <div style={{ display: 'flex', gap: '8px' }}>
            <AuthBtn $variant="primary" onClick={() => setStep('unlocked')}>✅ Verify Identity</AuthBtn>
            <AuthBtn onClick={() => setStep('gate')}>← Back</AuthBtn>
          </div>
        </AuthGate>
      )}

      {step === 'unlocked' && (
        <VaultContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--accent-green, #10B981)', fontSize: '0.8rem', fontWeight: 700 }}>✅ Vault Unlocked — {VAULT_PROPERTIES.length} Exclusive Listings</div>
            <AuthBtn onClick={() => setStep('gate')} style={{ padding: '6px 14px', fontSize: '0.72rem' }}>🔒 Lock Vault</AuthBtn>
          </div>
          {VAULT_PROPERTIES.map((p, i) => (
            <PropertyCard key={i}>
              <PropInfo>
                <PropName>{p.name}</PropName>
                <PropMeta>{p.meta}</PropMeta>
              </PropInfo>
              <PropPrice>
                <PropPriceVal>AED {(p.price / 1_000_000).toFixed(0)}M</PropPriceVal>
                <PropBadge style={{ color: 'var(--color-a78bfa, #A78BFA)', fontWeight: 700 }}>{p.tag}</PropBadge>
              </PropPrice>
            </PropertyCard>
          ))}
        </VaultContent>
      )}
    </Wrapper>
  );
};
export default UhnwPrivateVault;
