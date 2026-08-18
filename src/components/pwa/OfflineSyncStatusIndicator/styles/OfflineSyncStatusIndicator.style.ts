/**
 * OfflineSyncStatusIndicator.style.ts — Style Layer
 */

import styled, { keyframes } from 'styled-components';
import { SyncPhase } from '../logic/OfflineSyncStatusIndicator.logic';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const BG: Record<SyncPhase, string> = {
  synced: '#f0fdf4',
  syncing: '#eff6ff',
  offline: '#fef2f2',
  error: '#fff7ed',
};
const BORDER: Record<SyncPhase, string> = {
  synced: '#bbf7d0',
  syncing: '#bfdbfe',
  offline: '#fecaca',
  error: '#fed7aa',
};
const TEXT: Record<SyncPhase, string> = {
  synced: '#15803d',
  syncing: '#1d4ed8',
  offline: '#dc2626',
  error: '#c2410c',
};

export const Pill = styled.div<{ $phase: SyncPhase }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid ${({ $phase }) => BORDER[$phase]};
  background: ${({ $phase }) => BG[$phase]};
  color: ${({ $phase }) => TEXT[$phase]};
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  user-select: none;
  cursor: default;
  transition: all 0.3s ease;
`;

export const SpinIcon = styled.span`
  display: inline-flex;
  animation: ${spin} 1s linear infinite;
`;
