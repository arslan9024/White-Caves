import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

export const SubNavBarWrapper = styled.div`
  background: var(--bg-secondary, #f8f9fa);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  padding: 0;
  position: sticky;
  top: 64px;
  z-index: var(--z-sticky, 200);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  [data-theme='dark'] & {
    background: rgba(30, 30, 40, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const SubNavBarContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  gap: 1rem;

  @media (max-width: 992px) {
    padding: 0 1rem;
  }
`;

export const SubNavBarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 200px;

  @media (max-width: 992px) {
    min-width: auto;
  }
`;

export const ModuleIcon = styled.span`
  font-size: 1.25rem;
`;

export const ModuleTitle = styled.span`
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  font-size: 0.95rem;

  [data-theme='dark'] & {
    color: #fff;
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

export const SubNavBarNav = styled.nav`
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  justify-content: center;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SubNavItem = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  color: ${(props) => (props.$isActive ? 'white' : 'var(--text-secondary, #6b7280)')};
  font-weight: 500;
  font-size: 0.875rem;
  font-family: inherit;

  ${(props) =>
    props.$isActive
      ? `
    background: var(--primary-color, #D4AF37);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);

    &:hover {
      background: var(--primary-dark, #B8960C);
      transform: translateY(-1px);
    }
  `
      : `
    &:hover {
      background: var(--hover-bg, rgba(0, 0, 0, 0.05));
      color: var(--text-primary, #1f2937);
      transform: translateY(-1px);
    }

    [data-theme="dark"] & {
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    }
  `}

  [data-theme='dark'] & {
    color: ${(props) => (props.$isActive ? 'white' : 'var(--text-secondary, #9ca3af)')};
  }

  @media (max-width: 992px) {
    padding: 0.5rem 0.75rem;
  }
`;

export const SubNavIcon = styled.span`
  font-size: 1rem;
  transition: transform 0.2s ease;

  ${SubNavItem}:hover & {
    transform: scale(1.1);
  }
`;

export const SubNavLabel = styled.span`
  font-weight: 500;
`;

export const SubNavBadge = styled.span<{ $isActive?: boolean }>`
  background: ${(props) => (props.$isActive ? 'rgba(255, 255, 255, 0.3)' : 'var(--accent-color, #f59e0b)')};
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  min-width: 1.25rem;
  text-align: center;
  font-weight: 600;
`;

export const SubNavIndicator = styled.span`
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--accent-color, #f59e0b);
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

export const SubNavBarActions = styled.div`
  display: flex;
  gap: 0.5rem;
  min-width: 150px;
  justify-content: flex-end;
`;

export const SubNavActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-color, #D4AF37), var(--accent-color, #f59e0b));
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(212, 175, 55, 0.3);
  }
`;

export const ActionIcon = styled.span`
  font-size: 1rem;
  animation: ${bounce} 2s infinite;
`;

export const ActionLabel = styled.span``;
