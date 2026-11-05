import styled from 'styled-components';
import { motion } from 'framer-motion';

export const NavbarContainer = styled(motion.nav)<{ $sticky?: boolean }>`
  position: ${({ $sticky }) => ($sticky ? 'sticky' : 'fixed')};
  top: 0;
  left: 0;
  width: 100%;
  height: 68px;
  background: var(--bg-card, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 2px solid #ef4444;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  box-sizing: border-box;

  [data-theme='light'] & {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  [data-theme='dark'] & {
    background: rgba(11, 15, 23, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
`;

export const NavWing = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 1;
  justify-content: ${({ $align }) => ($align === 'right' ? 'flex-end' : 'flex-start')};
  /* Padding so wings do not collide with center overhanging 64px logo */
  ${({ $align }) => ($align === 'left' ? 'padding-right: 48px;' : 'padding-left: 48px;')};

  @media (max-width: 1200px) {
    gap: 0.4rem;
    ${({ $align }) => ($align === 'left' ? 'padding-right: 36px;' : 'padding-left: 36px;')};
  }
`;

export const OverhangingLogoWrapper = styled(motion.div)`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ef4444;
  z-index: 1001;
  cursor: pointer;
  flex-shrink: 0;

  img {
    width: 85%;
    height: 85%;
    object-fit: contain;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid #ffffff;
    box-shadow: 0 0 8px #22c55e;
  }
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 900px) {
    gap: 0.4rem;
  }
`;

export const NavLink = styled(motion.button)<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(239, 68, 68, 0.12)' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(239, 68, 68, 0.35)' : 'transparent')};
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#EF4444' : 'var(--text-primary, #1E293B)')};
  cursor: pointer;
  padding: 6px 11px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
  }
`;

export const RoleBadge = styled.span<{ $level: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $level }) =>
    $level === 5 ? '#EF4444' : $level >= 3 ? '#1E293B' : 'rgba(239, 68, 68, 0.12)'};
  color: ${({ $level }) => ($level >= 3 ? '#FFFFFF' : '#EF4444')};
  border: 1px solid ${({ $level }) => ($level === 5 ? '#EF4444' : 'rgba(239, 68, 68, 0.3)')};
  box-shadow: ${({ $level }) => ($level === 5 ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none')};
  cursor: default;
  white-space: nowrap;

  @media (max-width: 1280px) {
    display: none;
  }
`;

export const ThemeToggleBtn = styled.button`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ef4444;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #ef4444;
    color: #ffffff;
    transform: rotate(15deg) scale(1.05);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

export const CenterTeleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 1200px) {
    display: none;
  }
`;

export const TelemetryPill = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  background: var(--bg-secondary, rgba(15, 23, 42, 0.85));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 9999px;
  font-size: 0.7rem;
  white-space: nowrap;

  [data-theme='light'] & {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
  }

  .label {
    color: var(--text-muted, #64748b);
    font-weight: 700;
    text-transform: uppercase;
  }

  .val {
    color: var(--text-primary, #f8fafc);
    font-weight: 800;
    font-family: monospace;

    [data-theme='light'] & {
      color: #0f172a;
    }
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }
`;

export const QuickActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #ef4444;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .alert-pip {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px #ef4444;
  }
`;

export const ProfileMenuWrapper = styled.div`
  position: relative;
`;

export const ProfileTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 5px;
  border-radius: 9999px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: #ef4444;
    transform: translateY(-1px);
  }

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ef4444;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    text-align: left;

    .name {
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--text-primary, #1e293b);
      line-height: 1.1;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .role {
      font-size: 0.65rem;
      font-weight: 700;
      color: #ef4444;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
  }

  @media (max-width: 900px) {
    .user-meta {
      display: none;
    }
  }
`;
