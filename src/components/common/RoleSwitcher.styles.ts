import styled from 'styled-components';

export const RoleSwitcherContainer = styled.div`
  position: relative;
`;

export const RoleSwitcherToggle = styled.button<{ $compact?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${(props) => (props.$compact ? '0.5rem' : '0.5rem 1rem')};
  background: var(--bg-secondary, #f8f9fa);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary, #1f2937);
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: var(--hover-bg, rgba(0, 0, 0, 0.05));
    border-color: var(--primary-color, #dc2626);
  }

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

export const CurrentRoleIcon = styled.span`
  font-size: 1.1rem;
`;

export const CurrentRoleLabel = styled.span<{ $compact?: boolean }>`
  font-weight: 500;
  display: ${(props) => (props.$compact ? 'none' : 'inline')};
`;

export const DropdownArrow = styled.span<{ $isOpen: boolean }>`
  font-size: 0.65rem;
  transition: transform 0.2s ease;
  opacity: 0.6;
  transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export const RoleSwitcherDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: var(--bg-secondary, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownSlide 0.2s ease;

  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  [data-theme='dark'] & {
    background: #1f2937;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 70px;
    left: 1rem;
    right: 1rem;
    min-width: auto;
  }
`;

export const DropdownHeader = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
  border-bottom: 1px solid var(--border-color, #e5e7eb);

  [data-theme='dark'] & {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const RoleOption = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(props) => 
    props.$isActive ? 'rgba(220, 38, 38, 0.1)' : 'transparent'};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  }

  [data-theme='dark'] & {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    ${(props) => props.$isActive && `background: rgba(220, 38, 38, 0.2);`}
  }
`;

export const RoleIcon = styled.span<{ $isActive?: boolean }>`
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$isActive 
      ? 'var(--primary-color, #dc2626)' 
      : 'var(--bg-tertiary, #f3f4f6)'};
  border-radius: 10px;

  [data-theme='dark'] & {
    background: ${(props) =>
      props.$isActive 
        ? 'var(--primary-color, #dc2626)' 
        : 'rgba(255, 255, 255, 0.1)'};
  }
`;

export const RoleInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const RoleLabel = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary, #1f2937);

  [data-theme='dark'] & {
    color: #fff;
  }
`;

export const RoleDescription = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary, #6b7280);
`;

export const RoleCheck = styled.span`
  color: var(--primary-color, #dc2626);
  font-weight: bold;
  font-size: 1rem;
`;
