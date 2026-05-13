import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, shadows, radius, transitions, spacing, typography } = theme;

/* ═══════════════════════════════════════════════════════════════
   MOBILE MENU DRAWER
   Full-screen slide-in from left — shows all sidebar content
   for mobile and tablet (≤ 768px viewport).
   ═══════════════════════════════════════════════════════════════ */

/* ── Overlay / Backdrop ────────────────────────────────────── */

export const DrawerOverlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  pointer-events: ${p => (p.$open ? 'auto' : 'none')};
  opacity: ${p => (p.$open ? 1 : 0)};
  transition: opacity 0.25s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.6);
  }
`;

/* ── Drawer panel ──────────────────────────────────────────── */

export const DrawerPanel = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(300px, 85vw);
  z-index: var(--z-overlay, 600);
  background: ${colors.background.secondary};
  box-shadow: ${p => (p.$open ? shadows.luxuryCard : 'none')};
  display: flex;
  flex-direction: column;
  transform: ${p => (p.$open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    box-shadow: ${p => (p.$open ? '4px 0 24px rgba(0, 0, 0, 0.4)' : 'none')};
  }
`;

/* ── Drawer header ─────────────────────────────────────────── */

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

export const DrawerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DrawerLogoMark = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #d4af37, #b8960c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: ${typography.weights.extrabold};
  font-size: 14px;
  letter-spacing: 0.5px;
`;

export const DrawerLogoName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text.primary};

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const DrawerCloseBtn = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: ${radius.lg};
  cursor: pointer;
  color: ${colors.text.tertiary};
  -webkit-tap-highlight-color: transparent;
  transition: ${transitions.active};

  &:hover,
  &:active {
    background: ${colors.background.tertiary};
    color: ${colors.text.primary};
  }

  @media (prefers-color-scheme: dark) {
    &:hover,
    &:active {
      background: #334155;
      color: #e2e8f0;
    }
  }
`;

/* ── Scrollable nav body ───────────────────────────────────── */

export const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.sm} 0;
  -webkit-overflow-scrolling: touch;
`;

/* ── Section label ─────────────────────────────────────────── */

export const DrawerSectionLabel = styled.div`
  padding: ${spacing.md} ${spacing.md} ${spacing.sm};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${colors.text.tertiary};

  @media (prefers-color-scheme: dark) {
    color: #64748b;
  }
`;

/* ── Nav item (department / top-level) ─────────────────────── */

export const DrawerNavItem = styled.button<{ $active?: boolean; $color?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px ${spacing.md};
  background: ${p => (p.$active ? 'rgba(227, 30, 36, 0.08)' : 'transparent')};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${p => (p.$active ? 600 : 400)};
  color: ${p => (p.$active ? colors.primary : colors.text.primary)};
  text-align: left;
  min-height: 44px; /* Touch target */
  -webkit-tap-highlight-color: transparent;
  transition: ${transitions.active};
  position: relative;

  /* Active gold bar */
  ${p =>
    p.$active &&
    css`
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        border-radius: 0 ${radius.xs} ${radius.xs} 0;
        background: ${colors.primary};
      }
    `}

  &:active {
    background: ${p => (p.$active ? 'rgba(227, 30, 36, 0.12)' : colors.background.tertiary)};
  }

  @media (prefers-color-scheme: dark) {
    color: ${p => (p.$active ? colors.primaryLight : '#E2E8F0')};
    &:active {
      background: ${p => (p.$active ? 'rgba(227, 30, 36, 0.14)' : '#334155')};
    }
  }
`;

export const DrawerNavIcon = styled.span<{ $color?: string }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.lg};
  background: ${p => (p.$color ? `${p.$color}12` : colors.background.tertiary)};
  color: ${p => p.$color || colors.text.secondary};
  flex-shrink: 0;
  transition: ${transitions.active};

  @media (prefers-color-scheme: dark) {
    background: ${p => (p.$color ? `${p.$color}18` : '#334155')};
  }
`;

export const DrawerNavBadge = styled.span`
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.primary};
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  border-radius: ${radius.full};
  line-height: 1;
`;

/* ── Sub-item (service under department) ───────────────────── */

export const DrawerSubItems = styled.div<{ $expanded: boolean }>`
  overflow: hidden;
  max-height: ${p => (p.$expanded ? '500px' : '0')};
  opacity: ${p => (p.$expanded ? 1 : 0)};
  transition:
    max-height 0.3s ease,
    opacity 0.2s ease;
  padding-left: ${spacing.xl};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const DrawerSubItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: 10px ${spacing.md};
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${p => (p.$active ? 600 : 400)};
  color: ${p => (p.$active ? colors.primary : colors.text.secondary)};
  text-align: left;
  min-height: 44px; /* Touch target */
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s ease;

  &:active {
    color: ${colors.primary};
  }

  @media (prefers-color-scheme: dark) {
    color: ${p => (p.$active ? colors.primaryLight : '#94A3B8')};
  }
`;

export const DrawerSubDot = styled.span<{ $color?: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${radius.full};
  background: ${p => p.$color || colors.primary};
  flex-shrink: 0;
`;

/* ── Footer ────────────────────────────────────────────────── */

export const DrawerFooter = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  border-top: 1px solid ${colors.border};
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    border-top-color: #334155;
  }
`;

export const DrawerFooterText = styled.p`
  font-size: 11px;
  color: ${colors.text.tertiary};
  text-align: center;
  margin: 0;
`;

/* ── Search Bar ────────────────────────────────────────────── */

export const DrawerSearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px ${spacing.md};
  border-bottom: 1px solid ${colors.borderLight};
  flex-shrink: 0;
`;

export const DrawerSearchIcon = styled.span`
  position: absolute;
  left: calc(${spacing.md} + 8px);
  display: flex;
  align-items: center;
  color: ${colors.text.tertiary};
  pointer-events: none;
`;

export const DrawerSearchInput = styled.input`
  width: 100%;
  padding: 7px 28px 7px 28px;
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  background: ${colors.background.primary};
  color: ${colors.text.primary};
  font-size: 13px;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

export const DrawerSearchClear = styled.button`
  position: absolute;
  right: calc(${spacing.md} + 6px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: ${colors.text.tertiary}30;
  border: none;
  border-radius: 50%;
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: 0;

  &:hover {
    background: ${colors.text.secondary}40;
  }
`;
