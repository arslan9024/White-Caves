/**
 * MobilePropertyQuickActions.style.ts — Style Layer
 */

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  animation: ${fadeIn} 0.2s ease;
`;

export const Sheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 20px 16px 40px;
  z-index: 2001;
  animation: ${slideUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 0 auto 18px;
`;

export const SheetTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
`;

export const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

export const ActionTile = styled.button<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 14px;
  border: none;
  background: ${({ $color }) => $color}14;
  cursor: pointer;
  transition: transform 0.15s;
  &:active {
    transform: scale(0.93);
  }
`;

export const ActionIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActionLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', sans-serif;
`;

export const TriggerBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #dc2626;
  }
`;
