import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const rotateCW = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
`;

export const RoleSelectorContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

export const RoleSelectorTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color, #dc2626);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] & {
    background: var(--bg-card-dark, #1e293b);
    border-color: var(--border-color-dark, #374151);

    &:hover {
      border-color: var(--primary-color, #dc2626);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
`;

export const RoleSelectorCurrent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RoleIconWrapper = styled.div<{ $backgroundColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
  background: ${props => props.$backgroundColor || 'var(--bg-tertiary, #f3f4f6)'};
`;

export const RoleInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

export const RoleName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const RoleDescription = styled.span`
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  [data-theme="dark"] & {
    color: var(--text-secondary-dark, #cbd5e1);
  }
`;

export const ChevronIcon = styled.svg<{ $isOpen?: boolean }>`
  color: var(--text-secondary, #6b7280);
  transition: all 0.2s ease;
  flex-shrink: 0;
  ${props => props.$isOpen && `transform: rotate(180deg);`}

  [data-theme="dark"] & {
    color: var(--text-secondary-dark, #cbd5e1);
  }
`;

export const RoleSelectorBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

export const RoleSelectorDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 480px;
  overflow: hidden;
  animation: ${slideDown} 0.2s ease;
  display: flex;
  flex-direction: column;

  [data-theme="dark"] & {
    background: var(--bg-card-dark, #1e293b);
    border-color: var(--border-color-dark, #374151);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

export const RoleSelectorSearch = styled.input`
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  font-size: 14px;
  background: var(--bg-card, #ffffff);
  color: var(--text-primary, #1f2937);

  &::placeholder {
    color: var(--text-muted, #9ca3af);
  }

  [data-theme="dark"] & {
    background: var(--bg-card-dark, #1e293b);
    border-color: var(--border-color-dark, #374151);
    color: var(--text-primary-dark, #f9fafb);

    &::placeholder {
      color: var(--text-muted-dark, #64748b);
    }
  }
`;

export const RoleSelectorList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const RoleSelectorOption = styled.button<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.$isSelected ? 'rgba(220, 38, 38, 0.1)' : 'transparent'};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-hover, #f9fafb);
  }

  [data-theme="dark"] & {
    &:hover {
      background: var(--bg-hover-dark, #334155);
    }
  }
`;

export const RoleOptionIcon = styled.div<{ $backgroundColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  background: ${props => props.$backgroundColor || 'var(--bg-tertiary, #f3f4f6)'};
`;

export const RoleOptionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RoleOptionName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const RoleOptionDescription = styled.div`
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  [data-theme="dark"] & {
    color: var(--text-secondary-dark, #cbd5e1);
  }
`;

export const CheckmarkIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: var(--primary-color, #dc2626);
  flex-shrink: 0;
`;
