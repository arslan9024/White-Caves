// @ts-nocheck
import styled, { keyframes } from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, shadows, transitions, radius, spacing, mediaQueries } = theme;

/* ═══════════════════════════════════════════════════════════════
   ICON-RAIL SIDEBAR + FLYOUT PANEL STYLES
   64px rail + 240px flyout — replaces old 280px wide sidebar
   ═══════════════════════════════════════════════════════════════ */

/* Reduce all transforms/animations for users who prefer reduced motion */
const reducedMotion = `@media (prefers-reduced-motion: reduce)`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

/* ── Rail container (outermost) ────────────────────────────── */

export const RailContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 56px;
  height: calc(100vh - 56px);
  display: flex;
  z-index: var(--z-sticky, 200);

  ${mediaQueries.tablet} {
    display: none;
  }

  @media print {
    display: none;
  }
`;

/* ── Rail wrapper (64px strip) ─────────────────────────────── */

export const RailWrapper = styled.nav`
  width: 64px;
  height: 100%;
  background: ${colors.background.secondary};
  border-right: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.md} 0;
  gap: ${spacing.xs};
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  box-shadow: ${shadows.sidebar};

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    width: 0;
  }
  scrollbar-width: none;

  @media (prefers-color-scheme: dark) {
    background: ${colors.background.dark};
    border-right-color: #2d2d44;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
  }
`;

/* ── Single icon slot ──────────────────────────────────────── */

export const RailIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover > span {
    opacity: 1;
    transform: translateX(0);
  }
`;

/* ── Icon button ───────────────────────────────────────────── */

export const RailIconButton = styled.button<{
  $active?: boolean;
  $isFlyoutTarget?: boolean;
  $color?: string;
}>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p =>
    p.$active
      ? 'rgba(227, 30, 36, 0.10)'
      : p.$isFlyoutTarget
        ? '${colors.background.tertiary}'
        : 'transparent'};
  border: none;
  border-radius: ${radius.xl};
  cursor: pointer;
  color: ${p =>
    p.$active
      ? '${colors.primary}'
      : p.$color && p.$isFlyoutTarget
        ? p.$color
        : '${colors.text.tertiary}'};
  position: relative;
  transition: ${transitions.active};

  ${reducedMotion} {
    transition: none;
  }

  /* Active indicator — gold left bar */
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${p => (p.$active ? '24px' : '0')};
    border-radius: 0 ${radius.xs} ${radius.xs} 0;
    background: ${colors.primary};
    transition: height ${transitions.durations.shorter} ${transitions.easing.easeInOut};
  }

  &:hover {
    background: ${p => (p.$active ? 'rgba(227, 30, 36, 0.12)' : '${colors.background.tertiary}')};
    color: ${p => (p.$active ? '${colors.primary}' : p.$color || '${colors.text.primary}')};

    &::before {
      height: ${p => (p.$active ? '24px' : '16px')};
    }
  }

  @media (prefers-color-scheme: dark) {
    background: ${p =>
      p.$active
        ? 'rgba(227, 30, 36, 0.15)'
        : p.$isFlyoutTarget
          ? 'rgba(255, 255, 255, 0.05)'
          : 'transparent'};
    color: ${p =>
      p.$active ? '${colors.primaryLight}' : p.$color && p.$isFlyoutTarget ? p.$color : '#94A3B8'};

    &:hover {
      background: ${p => (p.$active ? 'rgba(227, 30, 36, 0.18)' : 'rgba(255, 255, 255, 0.08)')};
      color: ${p => (p.$active ? '${colors.primaryLight}' : p.$color || '#E2E8F0')};
    }
  }
`;

/* ── Tooltip (shows on hover) ──────────────────────────────── */

export const RailTooltip = styled.span`
  position: absolute;
  left: 56px;
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  background: ${colors.text.primary};
  color: ${colors.text.inverse};
  padding: 6px 10px;
  border-radius: ${radius.md};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: 600;
  transition:
    opacity ${transitions.durations.shortest} ${transitions.easing.easeOut},
    transform ${transitions.durations.shortest} ${transitions.easing.easeOut};
  box-shadow: ${shadows.dropdown};

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: ${colors.text.primary};
  }
`;

/* ── Divider ───────────────────────────────────────────────── */

export const RailDivider = styled.div`
  width: 32px;
  height: 1px;
  background: ${colors.border};
  margin: ${spacing.xs} 0;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    background: #2d2d44;
  }
`;

/* ── Spacer (pushes items to bottom) ───────────────────────── */

export const RailSpacer = styled.div`
  flex: 1;
`;

/* ═══════════════════════════════════════════════════════════════
   FLYOUT PANEL (240px, slides from left of rail)
   ═══════════════════════════════════════════════════════════════ */

export const FlyoutBackdrop = styled.div`
  position: fixed;
  inset: 0;
  top: 56px;
  z-index: 199;
  background: transparent;
`;

export const FlyoutPanel = styled.div<{ $open?: boolean; $color?: string }>`
  width: ${p => (p.$open ? '240px' : '0')};
  height: 100%;
  background: ${colors.background.secondary};
  border-right: ${p => (p.$open ? `1px solid ${colors.border}` : 'none')};
  overflow: hidden;
  transition: width ${transitions.durations.short} ${transitions.easing.easeInOut};
  display: flex;
  flex-direction: column;
  box-shadow: ${p => (p.$open ? shadows.luxuryCard : 'none')};

  ${reducedMotion} {
    transition: none;
  }

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-right-color: #334155;
    box-shadow: ${p => (p.$open ? '4px 0 24px rgba(0, 0, 0, 0.3)' : 'none')};
  }
`;

export const FlyoutHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md} ${spacing.md} ${spacing.md};
  border-bottom: 1px solid ${colors.border};
  animation: ${slideIn} ${transitions.durations.shorter} ${transitions.easing.easeOut};

  ${reducedMotion} {
    animation: none;
  }

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

export const FlyoutTitle = styled.h3<{ $color?: string }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.$color || colors.text.primary};
  white-space: nowrap;
`;

export const FlyoutClose = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${colors.text.tertiary};
  transition: ${transitions.active};

  &:hover {
    background: ${colors.background.tertiary};
    color: ${colors.text.primary};
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: #334155;
      color: #e2e8f0;
    }
  }
`;

export const FlyoutNav = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.sm};
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: ${slideIn} ${transitions.durations.short} ${transitions.easing.easeOut};

  ${reducedMotion} {
    animation: none;
  }
`;

export const FlyoutItem = styled.button<{ $active?: boolean; $color?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${p => (p.$active ? `${p.$color}12` : 'transparent')};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${p => (p.$active ? '600' : '400')};
  color: ${p => (p.$active ? p.$color || colors.primary : colors.text.primary)};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: ${transitions.active};

  &:hover {
    background: ${p => (p.$active ? `${p.$color}18` : colors.background.tertiary)};
    color: ${p => p.$color || colors.primary};
  }

  @media (prefers-color-scheme: dark) {
    color: ${p => (p.$active ? p.$color || colors.primaryLight : '#E2E8F0')};
    background: ${p => (p.$active ? `${p.$color}18` : 'transparent')};
    &:hover {
      background: ${p => (p.$active ? `${p.$color}22` : '#334155')};
    }
  }
`;

export const FlyoutDot = styled.span<{ $color?: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${radius.full};
  background: ${p => p.$color || colors.primary};
  flex-shrink: 0;
`;

/* ═══════════════════════════════════════════════════════════════
   AI COMMAND CENTER FLYOUT STYLES
   Shown inside FlyoutPanel when AI icon is clicked
   ═══════════════════════════════════════════════════════════════ */

export const AISearchBar = styled.div`
  padding: ${spacing.md} ${spacing.md};
  border-bottom: 1px solid ${colors.background.tertiary};

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #2d2d44;
  }
`;

export const AISearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: 7px 10px;
  background: ${colors.background.tertiary};
  border-radius: ${radius.lg};
  border: 1px solid transparent;
  transition: ${transitions.active};

  &:focus-within {
    border-color: ${colors.primary};
    background: ${colors.background.secondary};
    box-shadow: ${shadows.luxuryFocus};
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 12px;
    color: ${colors.text.primary};
    font-family: inherit;

    &::placeholder {
      color: ${colors.text.tertiary};
    }
  }

  @media (prefers-color-scheme: dark) {
    background: #334155;
    &:focus-within {
      background: #1e293b;
    }
    input {
      color: #e2e8f0;
      &::placeholder {
        color: #64748b;
      }
    }
  }
`;

export const AIGroupHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.sm} ${spacing.md};
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  color: ${colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: ${transitions.active};

  &:hover {
    color: ${colors.text.secondary};
  }

  @media (prefers-color-scheme: dark) {
    color: #64748b;
    &:hover {
      color: #94a3b8;
    }
  }
`;

export const AIAssistantBtn = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: ${p => (p.$selected ? 'rgba(227, 30, 36, 0.10)' : 'transparent')};
  border: none;
  cursor: pointer;
  transition: ${transitions.active};
  text-align: left;

  &:hover {
    background: ${p => (p.$selected ? 'rgba(227, 30, 36, 0.14)' : colors.background.primary)};
  }

  @media (prefers-color-scheme: dark) {
    background: ${p => (p.$selected ? 'rgba(227, 30, 36, 0.12)' : 'transparent')};
    &:hover {
      background: ${p => (p.$selected ? 'rgba(227, 30, 36, 0.16)' : 'rgba(255,255,255,0.04)')};
    }
  }
`;

export const AIAvatar = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: ${p => p.$color || colors.luxury.goldDark};
  color: ${colors.text.inverse};
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AIAssistantName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const AIAssistantDesc = styled.div`
  font-size: 11px;
  color: ${colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const AIAssistantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AIFooter = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  border-top: 1px solid ${colors.border};
  font-size: 11px;
  color: ${colors.text.tertiary};
  text-align: center;

  @media (prefers-color-scheme: dark) {
    border-top-color: #334155;
    color: #64748b;
  }

  kbd {
    padding: 1px ${spacing.xs};
    border-radius: ${radius.sm};
    background: ${colors.background.tertiary};
    border: 1px solid ${colors.border};
    font-size: 10px;
    font-family: inherit;

    @media (prefers-color-scheme: dark) {
      background: #334155;
      border-color: #475569;
    }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   COLLAPSIBLE GROUP + BADGE STYLES
   Groups: "Company Features" and "AI Command Center" in icon rail
   Badge: pill showing unread/pending counts on department icons
   ═══════════════════════════════════════════════════════════════ */

/* ── Collapsible Group ─────────────────────────────────────── */

export const RailGroupHeader = styled.button<{ $collapsed?: boolean }>`
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xs} 0;
  margin: 0 ${spacing.xs};
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${colors.text.tertiary};
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: ${transitions.active};
  gap: 2px;

  svg {
    flex-shrink: 0;
    transition: transform ${transitions.durations.shorter} ${transitions.easing.easeInOut};
    transform: ${p => (p.$collapsed ? 'rotate(-90deg)' : 'rotate(0deg)')};
  }

  &:hover {
    color: ${colors.primary};
  }

  @media (prefers-color-scheme: dark) {
    color: #64748b;
    &:hover {
      color: ${colors.primaryLight};
    }
  }
`;

export const RailGroupContent = styled.div<{ $collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.xs};
  overflow: hidden;
  max-height: ${p => (p.$collapsed ? '0' : '600px')};
  opacity: ${p => (p.$collapsed ? '0' : '1')};
  transition:
    max-height ${transitions.durations.standard} ${transitions.easing.easeInOut},
    opacity ${transitions.durations.shorter} ${transitions.easing.easeOut};

  ${reducedMotion} {
    transition: none;
  }
`;

/* ── Badge (pill on icon) ──────────────────────────────────── */

export const RailBadge = styled.span<{ $color?: string }>`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 ${spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$color || colors.primary};
  color: ${colors.text.inverse};
  font-size: 9px;
  font-weight: 700;
  border-radius: ${radius.lg};
  line-height: 1;
  pointer-events: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  }
`;

