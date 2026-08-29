/**
 * CavesFloatingSearch.style.ts — Symmetrical Floating Search & Glassmorphic Overlay
 */

import styled from 'styled-components';

export const FloatingSearchPill = styled.button<{ $isDark: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 9999px;
  background: ${({ $isDark }) =>
    $isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid #EF4444;
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(239, 68, 68, 0.25)'
      : '0 12px 30px rgba(0, 0, 0, 0.12), 0 0 15px rgba(239, 68, 68, 0.15)'};
  color: ${({ $isDark }) => ($isDark ? '#FFFFFF' : '#0F172A')};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 16px 36px rgba(239, 68, 68, 0.35);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 640px) {
    bottom: 20px;
    left: 16px;
    padding: 8px 14px;
  }
`;

export const SearchOverlayModal = styled.div<{ $isDark: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 70;
  background: ${({ $isDark }) =>
    $isDark ? 'rgba(11, 17, 32, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const SearchModalCard = styled.div<{ $isDark: boolean }>`
  width: 100%;
  max-width: 680px;
  background: ${({ $isDark }) => ($isDark ? '#0F172A' : '#FFFFFF')};
  border: 1.5px solid #EF4444;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  animation: slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideDown {
    from {
      transform: translateY(-20px) scale(0.98);
    }
    to {
      transform: translateY(0) scale(1);
    }
  }
`;
