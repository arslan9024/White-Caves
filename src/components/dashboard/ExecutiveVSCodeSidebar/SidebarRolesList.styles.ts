// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/SidebarRolesList.styles.ts
/**
 * White Caves Real Estate LLC - Sidebar Roles List Styled Components
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 8px 12px;
  gap: 12px;
`;

export const ActiveSimulatorCard = styled.div`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SimulatorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #ef4444;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .badge {
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

export const SimulatorInfo = styled.div`
  font-size: 12px;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 6px;

  strong {
    color: #fff;
  }
`;

export const QuickSwitcherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-top: 4px;
`;

export const SwitchButton = styled.button<{ $isActive: boolean }>`
  background: ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.06)')};
  color: ${props => (props.$isActive ? '#ffffff' : '#cbd5e1')};
  border: 1px solid ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.12)')};
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$isActive ? '#dc2626' : 'rgba(255, 255, 255, 0.12)')};
    color: #ffffff;
  }
`;

export const TierSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TierTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.04em;
  padding: 4px 6px 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RoleCard = styled.div<{ $isActive: boolean }>`
  background: ${props =>
    props.$isActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.08)')};
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.4);
    transform: translateX(2px);
  }

  .role-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-box {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => (props.$isActive ? '#ef4444' : '#94a3b8')};
    }

    .role-name {
      font-size: 12px;
      font-weight: 600;
      color: ${props => (props.$isActive ? '#ffffff' : '#e2e8f0')};
    }
  }

  .level-badge {
    font-size: 10px;
    font-weight: 700;
    color: ${props => (props.$isActive ? '#ef4444' : '#94a3b8')};
    background: rgba(255, 255, 255, 0.06);
    padding: 2px 6px;
    border-radius: 4px;
  }
`;
