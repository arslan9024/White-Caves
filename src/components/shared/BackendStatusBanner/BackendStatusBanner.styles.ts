/**
 * BackendStatusBanner.styles — AEGIS 2.0 palette only:
 * White Caves Red #EF4444 accents, Brilliant White background,
 * Deep Slate #1E293B text (all via theme tokens — no raw hex here).
 */
import styled, { keyframes } from 'styled-components';
import { colors } from '../../../styles/theme/colors';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const BannerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.375rem 1rem;
  background: ${colors.background.primary};
  color: ${colors.text.primary};
  border-bottom: 1px solid ${colors.borderLight};
  border-left: 3px solid ${colors.red[500]};
  font-size: 0.8125rem;
  line-height: 1.4;
`;

export const StatusDot = styled.span`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.red[500]};
  animation: ${pulse} 1.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const BannerMessage = styled.p`
  flex: 1;
  margin: 0;
  color: ${colors.slate[800]};
  font-weight: 500;
`;

export const DismissButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${colors.slate[500]};
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${colors.red[500]};
    background: ${colors.red[50]};
  }

  &:focus-visible {
    outline: 2px solid ${colors.red[500]};
    outline-offset: 1px;
  }
`;
