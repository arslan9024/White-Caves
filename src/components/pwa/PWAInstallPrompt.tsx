/**
 * PWAInstallPrompt — Phase 10
 * ────────────────────────────
 * Listens for the browser's `beforeinstallprompt` event and renders a
 * glassmorphism banner inviting the user to install the White Caves PWA.
 * Silently dismissed if the app is already installed or running as standalone.
 *
 * Usage (add once to App.tsx or Layout):
 *   import { PWAInstallPrompt } from '../components/pwa/PWAInstallPrompt';
 *   <PWAInstallPrompt />
 */

import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

// ─── Animations ───────────────────────────────────────────────────────────────
const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(100%); opacity: 0; }
`;

// ─── Styled components ────────────────────────────────────────────────────────
const Banner = styled.div<{ $hiding: boolean }>`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: min(480px, calc(100vw - 2rem));
  background: rgba(10, 10, 10, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(196, 30, 58, 0.4);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(196, 30, 58, 0.12) inset;
  animation: ${({ $hiding }) => ($hiding ? slideDown : slideUp)} 0.35s ease both;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
`;

const Icon = styled.div`
  font-size: 2.2rem;
  flex-shrink: 0;
`;

const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fafafa;
  margin: 0 0 0.2rem;
`;

const Sub = styled.p`
  font-size: 0.8rem;
  color: rgba(250, 250, 250, 0.58);
  margin: 0;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const InstallBtn = styled.button`
  background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%);
  color: #fafafa;
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition:
    opacity 0.2s,
    transform 0.15s;
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const DismissBtn = styled.button`
  background: transparent;
  color: rgba(250, 250, 250, 0.5);
  border: 1px solid rgba(250, 250, 250, 0.15);
  border-radius: 8px;
  padding: 0.55rem 0.85rem;
  font-size: 0.82rem;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.2s,
    border-color 0.2s;
  &:hover {
    color: #fafafa;
    border-color: rgba(250, 250, 250, 0.35);
  }
`;

// ─── Local storage key ────────────────────────────────────────────────────────
const DISMISSED_KEY = 'wc_pwa_install_dismissed';

// ─── Component ────────────────────────────────────────────────────────────────
export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    // Don't show if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Brief delay so it doesn't pop immediately on page load
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = useCallback(() => {
    setHiding(true);
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setTimeout(() => setVisible(false), 350);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setHiding(true);
      setTimeout(() => setVisible(false), 350);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  if (!visible) return null;

  return (
    <Banner role="dialog" aria-live="polite" aria-label="Install White Caves app" $hiding={hiding}>
      <Icon aria-hidden="true">🏙️</Icon>
      <TextBlock>
        <Title>Install White Caves</Title>
        <Sub>
          Add to your home screen for instant access to Dubai&apos;s premier real estate platform.
        </Sub>
      </TextBlock>
      <Actions>
        <InstallBtn onClick={() => void handleInstall()} aria-label="Install app">
          Install
        </InstallBtn>
        <DismissBtn onClick={handleDismiss} aria-label="Dismiss install prompt">
          Not now
        </DismissBtn>
      </Actions>
    </Banner>
  );
};
