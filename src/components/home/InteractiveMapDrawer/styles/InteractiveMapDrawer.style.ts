/**
 * InteractiveMapDrawer.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Red / Crisp White / Slate color palette.
 */

import styled from 'styled-components';

export const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 460px;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 18px;
  overflow: hidden;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
`;

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const MapPinMarker = styled.button<{ $top: string; $left: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  padding: 8px 14px;
  border-radius: 999px;
  background: #EF4444;
  border: 2px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.9);
  transform: translate(-50%, -50%);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    transform: translate(-50%, -50%) scale(1.15);
    background: #DC2626;
  }
`;

export const SlideDrawer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 340px;
  height: 100%;
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(16px);
  border-left: 2px solid #EF4444;
  padding: 1.5rem;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const DrawerCtaBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
  color: #FFFFFF;
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);

  &:hover {
    transform: scale(1.02);
  }
`;
