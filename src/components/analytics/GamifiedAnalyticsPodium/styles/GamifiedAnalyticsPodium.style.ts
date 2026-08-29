/**
 * GamifiedAnalyticsPodium.style.ts — Podium Physics, Sparklines & Red SLA Tickers
 */

import styled, { keyframes } from 'styled-components';

const pulseRed = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
`;

export const AnalyticsCockpitCard = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#0F172A' : '#FFFFFF')};
  border: 1px solid ${({ $isDark }) => ($isDark ? '#1E293B' : '#E2E8F0')};
  border-radius: 16px;
  padding: 20px;
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 10px 30px rgba(0, 0, 0, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.04)'};
`;

export const VictoryPodiumStage = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 8px;
`;

export const PodiumPillar = styled.div<{ $rank: 1 | 2 | 3; $isDark: boolean }>`
  flex: 1;
  max-width: 140px;
  height: ${({ $rank }) => ($rank === 1 ? '160px' : $rank === 2 ? '125px' : '95px')};
  border-radius: 16px 16px 8px 8px;
  background: ${({ $rank, $isDark }) =>
    $rank === 1
      ? 'linear-gradient(180deg, #EF4444 0%, #991B1B 100%)'
      : $rank === 2
      ? $isDark
        ? 'linear-gradient(180deg, #475569 0%, #1E293B 100%)'
        : 'linear-gradient(180deg, #94A3B8 0%, #64748B 100%)'
      : $isDark
      ? 'linear-gradient(180deg, #78350F 0%, #451A03 100%)'
      : 'linear-gradient(180deg, #D97706 0%, #B45309 100%)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  color: #FFFFFF;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const SlaPulseBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid #EF4444;
  color: #EF4444;
  font-size: 0.75rem;
  font-weight: 800;
  animation: ${pulseRed} 2s infinite;
`;
