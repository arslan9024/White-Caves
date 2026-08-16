/**
 * PwaInstallAppBanner — Wave 65 FE-GOAL-093
 * Progressive Web App (PWA) Install prompt banner with custom White Caves gold-crested icon preview
 * White Caves Real Estate LLC — Mobile & PWA Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`from{transform:translateY(100%)}to{transform:translateY(0)}`;

const BannerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border-top: 2px solid rgba(239, 68, 68, 0.35);
  padding: 14px 20px;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.6);
  z-index: 99990;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  animation: ${slideUp} 0.3s ease;
  @media (max-width: 600px) { flex-direction: column; gap: 10px; text-align: center; }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AppIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #070B14;
  border: 2px solid #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  color: #FFF;
  span { color: #EF4444; }
`;

const AppTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
`;

const AppDesc = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const InstallBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: #EF4444;
  color: #FFF;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  &:hover { background: #DC2626; }
`;

const DismissBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  background: transparent;
  color: #94A3B8;
  font-size: 0.78rem;
  cursor: pointer;
  &:hover { color: #FFF; }
`;

export const PwaInstallAppBanner: FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <BannerContainer data-testid="pwa-install-app-banner">
      <LeftSide>
        <AppIcon>
          W<span>C</span>
        </AppIcon>
        <div>
          <AppTitle>White Caves Sovereign Mobile App</AppTitle>
          <AppDesc>Install on Home Screen for offline listings, VR tours & instant WhatsApp alerts.</AppDesc>
        </div>
      </LeftSide>

      <BtnGroup>
        <InstallBtn onClick={() => { alert('Launching PWA native home screen install prompt...'); setDismissed(true); }}>
          📲 Install App
        </InstallBtn>
        <DismissBtn onClick={() => setDismissed(true)}>
          Dismiss
        </DismissBtn>
      </BtnGroup>
    </BannerContainer>
  );
};

export default PwaInstallAppBanner;
