/**
 * UserPreferencesDropdown.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Red / Crisp White / Slate color palette.
 */

import styled from 'styled-components';

export const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 16px 40px -4px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 14px;
  z-index: 1200;
  animation: dropdownSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Inter', sans-serif;

  @media (max-width: 480px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    max-height: 80vh;
    border-radius: 20px 20px 0 0;
    border-bottom: none;
    padding: 18px 16px;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.35);
  }

  @keyframes dropdownSlideIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color, #f1f5f9);
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ef4444;
    display: block;
  }
`;

export const AvatarEditBadge = styled.button`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  color: #ffffff;
  border: 1.5px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: all 0.15s ease;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

export const UserDetails = styled.div`
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;

  p {
    margin: 2px 0 0;
    font-size: 0.76rem;
    color: var(--text-muted, #64748b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const EditProfileInlineLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  margin-top: 2px;
  color: var(--accent-red, #ef4444);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s ease;

  &:hover {
    color: #dc2626;
    text-decoration: underline;
  }
`;

export const RoleBadge = styled.span<{ $level: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  width: fit-content;
  background: ${p => (p.$level === 5 ? '#ef4444' : p.$level >= 3 ? '#1e293b' : 'rgba(239, 68, 68, 0.12)')};
  color: ${p => (p.$level >= 3 ? '#ffffff' : '#ef4444')};
`;

export const SectionTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted, #94a3b8);
  margin: 12px 0 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols || 3}, 1fr);
  gap: 4px;
`;

export const SelectBtn = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 4px;
  border-radius: 8px;
  border: 1px solid ${p => (p.$selected ? '#EF4444' : 'transparent')};
  background: ${p => (p.$selected ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-secondary, #f8fafc)')};
  color: ${p => (p.$selected ? '#EF4444' : 'var(--text-primary, #1e293b)')};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${p => (p.$selected ? 'rgba(239, 68, 68, 0.18)' : 'var(--border-color, #e2e8f0)')};
    color: #ef4444;
  }
`;

export const RoleSelectBox = styled.select`
  width: 100%;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color, #e2e8f0);
  background: var(--bg-secondary, #f8fafc);
  color: var(--text-primary, #1e293b);
  font-size: 0.78rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #ef4444;
  }
`;

export const LinksGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color, #f1f5f9);
`;

export const TelemetryPillsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 10px;
  padding: 6px 8px;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e2e8f0);
`;

export const DropdownTelemetryPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-secondary, #64748b);

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }

  .val {
    color: var(--text-primary, #0f172a);
    font-weight: 800;
  }
`;

export const MenuLinkBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-primary, #1e293b);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
    transform: translateX(2px);
  }

  &.logout-btn {
    color: #ef4444;
    &:hover {
      background: rgba(239, 68, 68, 0.15);
    }
  }
`;
