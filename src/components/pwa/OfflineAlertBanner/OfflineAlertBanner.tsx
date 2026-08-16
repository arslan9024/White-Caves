/**
 * OfflineAlertBanner — Wave 65 FE-GOAL-094
 * Real-time network status listener banner notifying users when device loses connectivity
 * White Caves Real Estate LLC — PWA & Resilience Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`from{transform:translateY(-100%)}to{transform:translateY(0)}`;

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  background: #DC2626;
  color: #FFF;
  padding: 10px 20px;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4);
  animation: ${slideDown} 0.3s ease;
`;

export const OfflineAlertBanner: FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Banner data-testid="offline-alert-banner" role="alert">
      <span>📡</span>
      <span>You are currently offline. White Caves PWA is serving cached property listings and offline forms.</span>
    </Banner>
  );
};

export default OfflineAlertBanner;
