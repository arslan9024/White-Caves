/** LeadScoreBadge.style.ts — Styles Layer */
import styled from 'styled-components';
export const BadgeRoot = styled.div<{ $color: string }>`
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.25rem 0.65rem; border-radius: 999px;
  background: ${({ $color }) => $color + '18'}; border: 1.5px solid ${({ $color }) => $color};
`;
export const ScoreTier = styled.span<{ $color: string }>`
  font-size: 0.8125rem; font-weight: 800; color: ${({ $color }) => $color};
`;
export const ScoreNum = styled.span`font-size: 0.75rem; color: #475569; font-weight: 600;`;
export const ScoreLabel = styled.span`font-size: 0.6875rem; color: #64748b;`;
