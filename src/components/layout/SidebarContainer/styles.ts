import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════
   ICON-RAIL SIDEBAR + FLYOUT PANEL STYLES
   64px rail + 240px flyout — replaces old 280px wide sidebar
   ═══════════════════════════════════════════════════════════════ */

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

  @media (max-width: 768px) {
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
  background: #FFFFFF;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;

  /* Hide scrollbar */
  &::-webkit-scrollbar { width: 0; }
  scrollbar-width: none;

  @media (prefers-color-scheme: dark) {
    background: #1A1A2E;
    border-right-color: #2D2D44;
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
    p.$active ? '#FFEBEE' :
    p.$isFlyoutTarget ? '#F3F4F6' :
    'transparent'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: ${p =>
    p.$active ? '#D4AF37' :
    p.$color && p.$isFlyoutTarget ? p.$color :
    '#6B7280'};
  position: relative;
  transition: all 0.15s ease;

  /* Active indicator — red left bar */
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${p => p.$active ? '24px' : '0'};
    border-radius: 0 2px 2px 0;
    background: #D4AF37;
    transition: height 0.2s ease;
  }

  &:hover {
    background: ${p => p.$active ? '#FFEBEE' : '#F3F4F6'};
    color: ${p => p.$active ? '#D4AF37' : p.$color || '#374151'};

    &::before {
      height: ${p => p.$active ? '24px' : '16px'};
    }
  }

  @media (prefers-color-scheme: dark) {
    background: ${p =>
      p.$active ? 'rgba(227, 30, 36, 0.15)' :
      p.$isFlyoutTarget ? 'rgba(255, 255, 255, 0.05)' :
      'transparent'};
    color: ${p =>
      p.$active ? '#EF5350' :
      p.$color && p.$isFlyoutTarget ? p.$color :
      '#94A3B8'};

    &:hover {
      background: ${p => p.$active ? 'rgba(227, 30, 36, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
      color: ${p => p.$active ? '#EF5350' : p.$color || '#E2E8F0'};
    }
  }
`;

/* ── Tooltip (shows on hover) ──────────────────────────────── */

export const RailTooltip = styled.span`
  position: absolute;
  left: 56px;
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  background: #1F2937;
  color: #FFFFFF;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: 600;
  transition: opacity 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: #1F2937;
  }
`;

/* ── Divider ───────────────────────────────────────────────── */

export const RailDivider = styled.div`
  width: 32px;
  height: 1px;
  background: #E5E7EB;
  margin: 4px 0;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    background: #2D2D44;
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
  width: ${p => p.$open ? '240px' : '0'};
  height: 100%;
  background: #FFFFFF;
  border-right: ${p => p.$open ? '1px solid #E5E7EB' : 'none'};
  overflow: hidden;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  @media (prefers-color-scheme: dark) {
    background: #1E293B;
    border-right-color: #334155;
  }
`;

export const FlyoutHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #E5E7EB;
  animation: ${slideIn} 0.2s ease;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

export const FlyoutTitle = styled.h3<{ $color?: string }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.$color || '#111827'};
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
  color: #9CA3AF;
  transition: all 0.15s ease;

  &:hover {
    background: #F3F4F6;
    color: #374151;
  }

  @media (prefers-color-scheme: dark) {
    &:hover { background: #334155; color: #E2E8F0; }
  }
`;

export const FlyoutNav = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: ${slideIn} 0.25s ease;
`;

export const FlyoutItem = styled.button<{ $active?: boolean; $color?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${p => p.$active ? `${p.$color}12` : 'transparent'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${p => p.$active ? '600' : '400'};
  color: ${p => p.$active ? (p.$color || '#D4AF37') : '#374151'};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.15s ease;

  &:hover {
    background: ${p => p.$active ? `${p.$color}18` : '#F3F4F6'};
    color: ${p => p.$color || '#D4AF37'};
  }

  @media (prefers-color-scheme: dark) {
    color: ${p => p.$active ? (p.$color || '#EF5350') : '#E2E8F0'};
    background: ${p => p.$active ? `${p.$color}18` : 'transparent'};
    &:hover { background: ${p => p.$active ? `${p.$color}22` : '#334155'}; }
  }
`;

export const FlyoutDot = styled.span<{ $color?: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => p.$color || '#D4AF37'};
  flex-shrink: 0;
`;

/* ═══════════════════════════════════════════════════════════════
   AI COMMAND CENTER FLYOUT STYLES
   Shown inside FlyoutPanel when AI icon is clicked
   ═══════════════════════════════════════════════════════════════ */

export const AISearchBar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #F3F4F6;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #2D2D44;
  }
`;

export const AISearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: #F3F4F6;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.15s ease;

  &:focus-within {
    border-color: #D4AF37;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.1);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 12px;
    color: #374151;
    font-family: inherit;

    &::placeholder { color: #9CA3AF; }
  }

  @media (prefers-color-scheme: dark) {
    background: #334155;
    &:focus-within { background: #1E293B; }
    input { color: #E2E8F0; &::placeholder { color: #64748B; } }
  }
`;

export const AIGroupHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s ease;

  &:hover { color: #6B7280; }

  @media (prefers-color-scheme: dark) {
    color: #64748B;
    &:hover { color: #94A3B8; }
  }
`;

export const AIAssistantBtn = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: ${p => p.$selected ? '#FFEBEE' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${p => p.$selected ? '#FFEBEE' : '#F9FAFB'};
  }

  @media (prefers-color-scheme: dark) {
    background: ${p => p.$selected ? 'rgba(227, 30, 36, 0.12)' : 'transparent'};
    &:hover { background: ${p => p.$selected ? 'rgba(227, 30, 36, 0.12)' : 'rgba(255,255,255,0.04)'}; }
  }
`;

export const AIAvatar = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${p => p.$color || 'linear-gradient(135deg, #D4AF37, #B8960C)'};
  color: #FFFFFF;
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
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: #F8FAFC;
  }
`;

export const AIAssistantDesc = styled.div`
  font-size: 11px;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: #94A3B8;
  }
`;

export const AIAssistantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AIFooter = styled.div`
  padding: 8px 16px;
  border-top: 1px solid #E5E7EB;
  font-size: 11px;
  color: #9CA3AF;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    border-top-color: #334155;
    color: #64748B;
  }

  kbd {
    padding: 1px 4px;
    border-radius: 3px;
    background: #F3F4F6;
    border: 1px solid #E5E7EB;
    font-size: 10px;
    font-family: inherit;

    @media (prefers-color-scheme: dark) {
      background: #334155;
      border-color: #475569;
    }
  }
`;
