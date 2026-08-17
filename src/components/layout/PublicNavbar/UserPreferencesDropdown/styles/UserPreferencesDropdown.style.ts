/**
 * UserPreferencesDropdown.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Red / Crisp White / Slate color palette.
 */

import styled from 'styled-components';

export const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 290px;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 16px 40px -4px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 14px;
  z-index: 1200;
  animation: dropdownSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Inter', sans-serif;

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
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color, #f1f5f9);

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ef4444;
  }
`;

export const UserDetails = styled.div`
  overflow: hidden;
  h4 {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 800;
    color: var(--text-primary, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    margin: 2px 0 0;
    font-size: 0.76rem;
    color: var(--text-muted, #64748b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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

export const LinksGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color, #f1f5f9);
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
