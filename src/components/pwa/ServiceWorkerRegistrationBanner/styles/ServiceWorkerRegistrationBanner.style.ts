/**
 * ServiceWorkerRegistrationBanner.style.ts — Style Layer
 */

import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const BannerWrapper = styled.div<{ $online: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: ${({ $online }) => ($online ? '#f0fdf4' : '#fef2f2')};
  border-bottom: 1px solid ${({ $online }) => ($online ? '#bbf7d0' : '#fecaca')};
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  transition: background 0.3s ease;
`;

export const StatusDot = styled.span<{ $online: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $online }) => ($online ? '#22c55e' : '#ef4444')};
  animation: ${pulse} 2s ease-in-out infinite;
  flex-shrink: 0;
`;

export const StatusText = styled.span`
  color: #1e293b;
  font-weight: 500;
`;

export const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Badge = styled.span<{ $variant: 'warning' | 'error' | 'success' }>`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $variant }) =>
    $variant === 'warning' ? '#fef9c3' : $variant === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${({ $variant }) =>
    $variant === 'warning' ? '#92400e' : $variant === 'error' ? '#991b1b' : '#15803d'};
`;

export const ActionButton = styled.button`
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #dc2626;
  }
`;
