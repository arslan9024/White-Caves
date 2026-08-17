/**
 * CavesFloatingWhatsApp.style.ts — UI Style Layer & Styled-Components
 * Bottom-right fixed floating trigger balancing bottom-left CavesFloatingSearch.
 */

import styled, { keyframes } from 'styled-components';

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(37, 211, 102, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
  }
`;

export const FloatingBtn = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #25D366;
  border: 2px solid #FFFFFF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
  animation: ${pulseGlow} 2.5s infinite;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease;

  &:hover {
    transform: scale(1.12);
    background: #20BA5A;
  }

  @media (max-width: 640px) {
    bottom: 18px;
    right: 18px;
    width: 48px;
    height: 48px;
  }
`;

export const SvgIcon = styled.svg`
  width: 28px;
  height: 28px;
  fill: currentColor;
`;
