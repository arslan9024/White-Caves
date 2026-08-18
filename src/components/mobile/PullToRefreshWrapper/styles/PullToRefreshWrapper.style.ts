/**
 * PullToRefreshWrapper.style.ts — Style Layer
 */

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const WrapperContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;

export const PullIndicator = styled.div<{ $distance: number; $active: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(${({ $distance }) => $distance - 48}px);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $distance, $active }) => ($active ? Math.min($distance / 70, 1) : 1)};
  transition: ${({ $active }) => ($active ? 'none' : 'all 0.3s ease')};
  z-index: 10;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
`;

export const SpinningIcon = styled.span<{ $spinning: boolean }>`
  display: inline-flex;
  animation: ${({ $spinning }) => ($spinning ? `${spin} 0.8s linear infinite` : 'none')};
  color: #fff;
`;

export const ContentShift = styled.div<{ $offset: number }>`
  transform: translateY(${({ $offset }) => $offset}px);
  transition: ${({ $offset }) => ($offset === 0 ? 'transform 0.3s ease' : 'none')};
`;
