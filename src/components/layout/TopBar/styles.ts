import styled, { css, keyframes } from 'styled-components';
import { typography } from '../../../styles/theme/typography';

/* ═══════════════════════════════════════════════════════════════
   TOP BAR — Single unified navbar (56px)
   Replaces: MainNavBar + UnifiedNavbar
   Layout: [Logo] [Breadcrumbs] ─── [Search] [Notif] [User]
   ═══════════════════════════════════════════════════════════════ */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Container ─────────────────────────────────────────────── */

export const TopBarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  z-index: var(--z-navbar, 500);
  transition: background 0.2s ease, box-shadow 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: #1E293B;
    border-bottom-color: #334155;
  }
`;

/* ── Logo section ──────────────────────────────────────────── */

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
`;

export const LogoMark = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #E31E24, #C62828);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: 800;
  font-size: 14px;
  font-family: ${typography.fontFamily.heading};
  letter-spacing: 0.5px;
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const LogoName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  font-family: ${typography.fontFamily.heading};

  @media (max-width: 768px) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    color: #F8FAFC;
  }
`;

/* ── Divider ───────────────────────────────────────────────── */

export const VerticalDivider = styled.div`
  width: 1px;
  height: 28px;
  background: #E5E7EB;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    background: #334155;
  }
`;

/* ── Breadcrumbs ───────────────────────────────────────────── */

export const BreadcrumbsSection = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6B7280;
  flex: 1;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    color: #94A3B8;
  }
`;

export const BreadcrumbItem = styled.button<{ $isLast?: boolean }>`
  background: none;
  border: none;
  padding: 4px 6px;
  border-radius: 6px;
  cursor: ${p => p.$isLast ? 'default' : 'pointer'};
  font-size: 13px;
  font-weight: ${p => p.$isLast ? '600' : '400'};
  color: ${p => p.$isLast ? '#111827' : '#6B7280'};
  white-space: nowrap;
  transition: all 0.15s ease;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;

  ${p => !p.$isLast && css`
    &:hover {
      background: #F3F4F6;
      color: #E31E24;
    }
  `}

  @media (prefers-color-scheme: dark) {
    color: ${p => p.$isLast ? '#F8FAFC' : '#94A3B8'};

    ${p => !p.$isLast && css`
      &:hover {
        background: #334155;
      }
    `}
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: #D1D5DB;
  font-size: 12px;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    color: #475569;
  }
`;

/* ── Actions (right side) ──────────────────────────────────── */

export const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

/* ── Search trigger ────────────────────────────────────────── */

export const SearchTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  color: #9CA3AF;
  font-size: 13px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #E5E7EB;
    border-color: #D1D5DB;
    color: #6B7280;
  }

  @media (max-width: 640px) {
    padding: 6px 8px;
    span { display: none; }
  }

  @media (prefers-color-scheme: dark) {
    background: #334155;
    border-color: #475569;
    color: #64748B;

    &:hover {
      background: #475569;
      color: #94A3B8;
    }
  }
`;

export const SearchShortcut = styled.kbd`
  font-size: 11px;
  font-family: inherit;
  padding: 2px 5px;
  border-radius: 4px;
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  color: #9CA3AF;
  line-height: 1;

  @media (max-width: 768px) { display: none; }

  @media (prefers-color-scheme: dark) {
    background: #1E293B;
    border-color: #475569;
    color: #64748B;
  }
`;

/* ── Icon button (notifications, user, etc.) ───────────────── */

export const IconButton = styled.button<{ $hasNotif?: boolean }>`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.15s ease;

  &:hover {
    background: #F3F4F6;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    color: #94A3B8;
    &:hover {
      background: #334155;
      color: #F8FAFC;
    }
  }
`;

export const NotifBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #E31E24;
  color: #FFFFFF;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
  line-height: 1;

  @media (prefers-color-scheme: dark) {
    border-color: #1E293B;
  }
`;

/* ── User avatar ───────────────────────────────────────────── */

export const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #F3F4F6;
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: #334155;
    }
  }
`;

export const UserAvatar = styled.div<{ $src?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${p => p.$src ? `url(${p.$src}) center/cover` : 'linear-gradient(135deg, #E31E24, #C62828)'};
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const UserName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    color: #E2E8F0;
  }
`;

/* ── Dropdown ──────────────────────────────────────────────── */

export const DropdownOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 599;
`;

export const DropdownMenu = styled.div<{ $align?: 'left' | 'right' }>`
  position: absolute;
  top: calc(100% + 8px);
  ${p => p.$align === 'left' ? 'left: 0;' : 'right: 0;'}
  min-width: 220px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 600;
  animation: ${fadeIn} 0.15s ease;

  @media (prefers-color-scheme: dark) {
    background: #1E293B;
    border-color: #334155;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  }
`;

export const DropdownItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: ${p => p.$danger ? '#EF4444' : '#374151'};
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${p => p.$danger ? '#FEE2E2' : '#F3F4F6'};
  }

  @media (prefers-color-scheme: dark) {
    color: ${p => p.$danger ? '#FCA5A5' : '#E2E8F0'};
    &:hover {
      background: ${p => p.$danger ? 'rgba(239,68,68,0.15)' : '#334155'};
    }
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: #E5E7EB;
  margin: 4px 0;

  @media (prefers-color-scheme: dark) {
    background: #334155;
  }
`;

export const DropdownHeader = styled.div`
  padding: 10px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const DropdownHeaderName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;

  @media (prefers-color-scheme: dark) {
    color: #F8FAFC;
  }
`;

export const DropdownHeaderEmail = styled.span`
  font-size: 12px;
  color: #6B7280;

  @media (prefers-color-scheme: dark) {
    color: #94A3B8;
  }
`;

export const DropdownHeaderRole = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #E31E24;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
