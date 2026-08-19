/**
 * PwaInstallPromptModal.style.ts — Style Layer
 */

import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 3000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const ModalCard = styled.div`
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 28px 24px 36px;
  width: 100%;
  max-width: 480px;
  animation: ${slideUp} 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.18);
`;

export const Handle = styled.div`
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 0 auto 20px;
`;

export const AppIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #ef4444;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 16px;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
  font-family: 'Inter', sans-serif;
`;

export const Subtitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px;
  line-height: 1.5;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #374151;
`;

export const InstallBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
  &:hover {
    background: #dc2626;
  }
`;

export const DismissBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #94a3b8;
  border: none;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #64748b;
  }
`;
