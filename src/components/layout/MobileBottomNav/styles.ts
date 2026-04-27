import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, shadows, radius, transitions, spacing, mediaQueries } = theme;

/* ═══════════════════════════════════════════════════════════════
   MOBILE BOTTOM NAVIGATION BAR
   56px fixed at bottom — visible only ≤ 768px
   5 tabs: 🏠 Home   📊 Analytics   💬 Messages   🤖 AI   ☰ Menu
   ═══════════════════════════════════════════════════════════════ */

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

export const BottomNavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: none; /* Hidden on desktop */
  background: ${colors.background.secondary};
  border-top: 1px solid ${colors.border};
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  z-index: var(--z-navbar, 500);
  padding-bottom: env(safe-area-inset-bottom, 0px); /* iPhone notch */
  animation: ${slideUp} 0.25s ease;

  ${mediaQueries.tablet} {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media print {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    background: #1E293B;
    border-top-color: #334155;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
  }
`;

export const BottomNavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  height: 56px;
  min-width: 44px; /* Touch target minimum */
  min-height: 44px; /* Touch target minimum */
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${p => p.$active ? colors.primary : colors.text.tertiary};
  transition: color ${transitions.durations.shorter} ${transitions.easing.easeInOut};
  position: relative;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  /* Active gold indicator dot */
  &::before {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: ${p => p.$active ? '4px' : '0'};
    height: 4px;
    border-radius: ${radius.full};
    background: ${colors.primary};
    transition: width ${transitions.durations.shorter} ${transitions.easing.easeInOut};
  }

  &:active {
    transform: scale(0.92);
    transition: transform 0.1s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &:active { transform: none; }
    &::before { transition: none; }
  }

  @media (prefers-color-scheme: dark) {
    color: ${p => p.$active ? colors.primaryLight : '#64748B'};
  }
`;

export const BottomNavLabel = styled.span<{ $active?: boolean }>`
  font-size: 10px;
  font-weight: ${p => p.$active ? 600 : 400};
  line-height: 1;
  white-space: nowrap;
`;

export const BottomNavBadge = styled.span`
  position: absolute;
  top: 6px;
  right: calc(50% - 18px);
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EF4444;
  color: #FFFFFF;
  font-size: 8px;
  font-weight: 700;
  border-radius: ${radius.full};
  line-height: 1;
  pointer-events: none;
`;

/* ═══════════════════════════════════════════════════════════════
   SAFE AREA SPACER
   Prevents content from being hidden behind the bottom nav.
   Applied at the bottom of AppMain on mobile.
   ═══════════════════════════════════════════════════════════════ */

export const BottomNavSpacer = styled.div`
  display: none;

  ${mediaQueries.tablet} {
    display: block;
    height: calc(56px + env(safe-area-inset-bottom, 0px));
  }
`;
