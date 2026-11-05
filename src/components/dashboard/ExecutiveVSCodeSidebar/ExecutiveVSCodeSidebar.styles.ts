import styled from 'styled-components';

export const SidebarLayoutContainer = styled.aside<{ $isCollapsed: boolean; $width: number }>`
  display: flex;
  height: calc(100vh - 68px);
  width: ${({ $isCollapsed, $width }) => ($isCollapsed ? '48px' : `${$width}px`)};
  background: #0b1120;
  border-right: 1.5px solid rgba(239, 68, 68, 0.25);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
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
    border-right: 1.5px solid #e2e8f0;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.05);
  }
`;

export const ActivityBar = styled.div`
  width: 48px;
  background: #070d18;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  flex-shrink: 0;
  transition: background-color 0.25s ease;

  [data-theme='light'] & {
    background: #f8fafc;
    border-right: 1px solid #e2e8f0;
  }
`;

export const ActivityGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
`;

export const ActivityIconBtn = styled.button<{ $isActive?: boolean }>`
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
    &::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 6px;
      bottom: 6px;
      width: 3px;
      border-radius: 2px;
      background: #EF4444;
      box-shadow: 0 0 8px #EF4444;
    }
  `}
`;

export const ExplorerDrawer = styled.div<{ $isCollapsed: boolean }>`
  flex: 1;
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  background: #0b1120;
  overflow: hidden;
  transition: background-color 0.25s ease;

  [data-theme='light'] & {
    background: #ffffff;
  }
`;

export const ExplorerHeader = styled.div`
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

export const FilterBarWrapper = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  [data-theme='light'] & {
    border-bottom: 1px solid #e2e8f0;
  }

  .search-box {
    position: relative;
    input {
      width: 100%;
      background: #070d18;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 6px 10px 6px 30px;
      font-size: 0.75rem;
      color: #ffffff;
      outline: none;
      box-sizing: border-box;

      [data-theme='light'] & {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #0f172a;
      }

      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
      }
    }

    svg {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
    }
  }
`;

export const TreeScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 6px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.2);
    border-radius: 4px;
  }
`;

export const FolderNode = styled.div`
  margin-bottom: 4px;
`;

export const FolderHeaderBtn = styled.button<{ $isExpanded?: boolean; $isSpecial?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: ${({ $isSpecial }) => ($isSpecial ? 'rgba(239, 68, 68, 0.08)' : 'transparent')};
  border: ${({ $isSpecial }) => ($isSpecial ? '1px solid rgba(239, 68, 68, 0.2)' : 'none')};
  color: ${({ $isSpecial }) => ($isSpecial ? '#EF4444' : '#E2E8F0')};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  [data-theme='light'] & {
    color: ${({ $isSpecial }) => ($isSpecial ? '#EF4444' : '#1E293B')};
  }

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
  }

  .caret {
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
    transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
    color: #64748b;
  }

  .label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .badge {
    font-size: 0.65rem;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
`;

export const FolderChildrenList = styled.div`
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 2px;
`;

export const TreeLeafItem = styled.button<{ $isActive?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 6px;
  background: ${({ $isActive }) => ($isActive ? 'rgba(239, 68, 68, 0.18)' : 'transparent')};
  border: ${({ $isActive }) =>
    $isActive ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid transparent'};
  color: ${({ $isActive }) => ($isActive ? '#FFFFFF' : '#94A3B8')};
  font-size: 0.72rem;
  font-weight: ${({ $isActive }) => ($isActive ? '700' : '500')};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  [data-theme='light'] & {
    color: ${({ $isActive }) => ($isActive ? '#EF4444' : '#475569')};
    background: ${({ $isActive }) => ($isActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent')};
  }

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }

  .sla-pill {
    margin-left: auto;
    font-size: 0.6rem;
    color: #64748b;
    font-family: monospace;
  }
`;

export const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.15s ease;

  &:hover {
    background: #ef4444;
  }
`;
