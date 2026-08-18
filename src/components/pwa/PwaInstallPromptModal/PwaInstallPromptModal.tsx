/**
 * PwaInstallPromptModal.tsx — View Layer (4-Way Component Architecture)
 * Install-to-Home-Screen bottom-sheet modal for White Caves CRM PWA.
 */

import React, { FC } from 'react';
import { CheckCircle, Wifi, Bell, Zap } from 'lucide-react';
import { usePwaInstallPromptLogic } from './logic/PwaInstallPromptModal.logic';
import {
  ModalOverlay,
  ModalCard,
  Handle,
  AppIcon,
  Title,
  Subtitle,
  FeatureList,
  FeatureItem,
  InstallBtn,
  DismissBtn,
} from './styles/PwaInstallPromptModal.style';

const FEATURES = [
  {
    icon: <Wifi size={16} color="#ef4444" />,
    text: 'Works offline — access leads without internet',
  },
  {
    icon: <Bell size={16} color="#ef4444" />,
    text: 'Push notifications for new leads & SLA alerts',
  },
  {
    icon: <Zap size={16} color="#ef4444" />,
    text: 'Instant launch — no App Store download needed',
  },
  {
    icon: <CheckCircle size={16} color="#ef4444" />,
    text: 'Sync when back online — zero data loss',
  },
];

export const PwaInstallPromptModal: FC = () => {
  const { canInstall, handleInstall, handleDismiss } = usePwaInstallPromptLogic();

  if (!canInstall) return null;

  return (
    <ModalOverlay data-testid="pwa-install-modal">
      <ModalCard>
        <Handle />
        <AppIcon>🏠</AppIcon>
        <Title>Install White Caves CRM</Title>
        <Subtitle>
          Add to your home screen for instant access to your Dubai real estate command centre.
        </Subtitle>
        <FeatureList>
          {FEATURES.map((f, i) => (
            <FeatureItem key={i}>
              {f.icon}
              {f.text}
            </FeatureItem>
          ))}
        </FeatureList>
        <InstallBtn onClick={handleInstall}>Install App</InstallBtn>
        <DismissBtn onClick={handleDismiss}>Not now</DismissBtn>
      </ModalCard>
    </ModalOverlay>
  );
};

export default PwaInstallPromptModal;
