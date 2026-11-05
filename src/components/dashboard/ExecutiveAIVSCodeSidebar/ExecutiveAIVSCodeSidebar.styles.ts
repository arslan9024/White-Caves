import styled from 'styled-components';

export const AISidebarLayoutContainer = styled.aside<{ $isCollapsed: boolean; $width: number }>`
  display: flex;
  height: calc(100vh - 68px);
  width: ${({ $isCollapsed, $width }) => ($isCollapsed ? '48px' : `${$width}px`)};
  background: #0b1120;
  border-left: 1.5px solid rgba(239, 68, 68, 0.25);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
  position: relative;
  flex-shrink: 0;
  transition:
    width 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.25s ease;
  user-select: none;
  overflow: hidden;
  z-index: 900;

  [data-theme='light'] & {
    background: #ffffff;
    border-left: 1.5px solid #e2e8f0;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.05);
  }
`;

export const AIActivityBar = styled.div`
  width: 48px;
  background: #070d18;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  flex-shrink: 0;
  order: 2;
  transition: background-color 0.25s ease;

  [data-theme='light'] & {
    background: #f8fafc;
    border-left: 1px solid #e2e8f0;
  }
`;

export const AIActivityGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
`;

export const AIActivityIconBtn = styled.button<{ $isActive?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $isActive }) => ($isActive ? 'rgba(239, 68, 68, 0.15)' : 'transparent')};
  border: none;
  color: ${({ $isActive }) => ($isActive ? '#EF4444' : '#64748B')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 6px;
      bottom: 6px;
      width: 3px;
      border-radius: 2px;
      background: #EF4444;
      box-shadow: 0 0 8px #EF4444;
    }
  `}
`;

export const AIDrawer = styled.div<{ $isCollapsed: boolean }>`
  flex: 1;
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  background: #0b1120;
  overflow: hidden;
  order: 1;
  transition: background-color 0.25s ease;

  [data-theme='light'] & {
    background: #ffffff;
  }
`;

export const AIDrawerHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;

  [data-theme='light'] & {
    border-bottom: 1px solid #e2e8f0;
  }

  .title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.8px;

    [data-theme='light'] & {
      color: #64748b;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 4px;

    button {
      background: transparent;
      border: none;
      color: #64748b;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
    }
  }
`;

export const ZoeExecutiveCard = styled.div`
  margin: 10px 12px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.25);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;

  [data-theme='light'] & {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .zoe-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .partner-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .zoe-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #ef4444;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 0.85rem;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
      }

      .name {
        font-size: 0.82rem;
        font-weight: 800;
        color: #ffffff;
        line-height: 1.1;

        [data-theme='light'] & {
          color: #0f172a;
        }
      }

      .role {
        font-size: 0.65rem;
        color: #ef4444;
        font-weight: 700;
      }
    }

    .status-badge {
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #10b981;
      font-weight: 700;
    }
  }

  .summary {
    font-size: 0.72rem;
    color: #94a3b8;
    line-height: 1.35;

    [data-theme='light'] & {
      color: #64748b;
    }
  }
`;

export const AIScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 10px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.2);
    border-radius: 4px;
  }
`;

export const SectionLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.6px;
  padding: 8px 4px 4px 4px;
`;

export const AgentMeshList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export { AgentTile, AIDirectiveForm } from './ExecutiveAIVSCodeSidebar.tile.styles';

export const LeftResizeHandle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.15s ease;
  z-index: 10;

  &:hover {
    background: #ef4444;
  }
`;
