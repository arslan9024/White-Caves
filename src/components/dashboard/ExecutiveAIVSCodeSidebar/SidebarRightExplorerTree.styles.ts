/**
 * SidebarRightExplorerTree.styles.ts
 * White Caves Real Estate LLC - Sovereign Right Explorer Tree Styles
 * Single Purpose File Law: < 350 lines
 * Protocol: PROMETHEUS AEG-001 (Right-Sidebar Only) & AEG-003/041 (Context Triad)
 */

import styled from 'styled-components';

export const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 8px 12px 24px 12px;
  gap: 8px;
  background: #070d18;
  color: #e2e8f0;
  font-family:
    'Plus Jakarta Sans',
    -apple-system,
    sans-serif;

  [data-theme='light'] & {
    background: #f8fafc;
    color: #1e293b;
  }
`;

export const SearchBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  margin-bottom: 4px;

  [data-theme='light'] & {
    background: #ffffff;
    border-color: #e2e8f0;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.72rem;
    color: #f1f5f9;
    width: 100%;

    [data-theme='light'] & {
      color: #0f172a;
    }

    &::placeholder {
      color: #64748b;
    }
  }
`;

export const SectionCard = styled.div<{ $isCardSelected?: boolean }>`
  border: 1px solid ${props => (props.$isCardSelected ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.08)')};
  border-radius: 8px;
  background: ${props => (props.$isCardSelected ? 'rgba(239, 68, 68, 0.04)' : 'rgba(15, 23, 42, 0.6)')};
  overflow: hidden;
  transition: all 0.15s ease;

  [data-theme='light'] & {
    background: ${props => (props.$isCardSelected ? 'rgba(239, 68, 68, 0.03)' : '#ffffff')};
    border-color: ${props => (props.$isCardSelected ? '#EF4444' : '#e2e8f0')};
  }
`;

export const SectionHeader = styled.button<{ $isExpanded: boolean; $isCurrentRoute?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${props =>
    props.$isCurrentRoute
      ? 'rgba(239, 68, 68, 0.14)'
      : props.$isExpanded
        ? 'rgba(239, 68, 68, 0.08)'
        : 'transparent'};
  border: none;
  cursor: pointer;
  color: ${props => (props.$isCurrentRoute ? '#EF4444' : '#f1f5f9')};
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s ease;

  [data-theme='light'] & {
    color: ${props => (props.$isCurrentRoute ? '#EF4444' : '#0f172a')};
    background: ${props =>
      props.$isCurrentRoute
        ? 'rgba(239, 68, 68, 0.08)'
        : props.$isExpanded
          ? 'rgba(239, 68, 68, 0.05)'
          : 'transparent'};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    [data-theme='light'] & {
      background: #f1f5f9;
    }
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    font-size: 0.62rem;
    padding: 2px 6px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    color: #94a3b8;

    [data-theme='light'] & {
      background: #e2e8f0;
      color: #475569;
    }
  }
`;

export const SectionBody = styled.div`
  padding: 4px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);

  [data-theme='light'] & {
    border-color: #f1f5f9;
  }
`;

export const SubgroupHeader = styled.div<{ $isSubActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 600;
  color: ${props => (props.$isSubActive ? '#EF4444' : '#cbd5e1')};
  background: ${props => (props.$isSubActive ? 'rgba(239, 68, 68, 0.08)' : 'transparent')};
  transition: all 0.12s ease;

  [data-theme='light'] & {
    color: ${props => (props.$isSubActive ? '#EF4444' : '#334155')};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    color: #ffffff;
    [data-theme='light'] & {
      background: #f1f5f9;
      color: #0f172a;
    }
  }
`;

export const TreeItemRow = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px 5px 22px;
  border-radius: 4px;
  font-size: 0.7rem;
  color: ${props => (props.$isActive ? '#ef4444' : '#94a3b8')};
  background: ${props => (props.$isActive ? 'rgba(239, 68, 68, 0.12)' : 'transparent')};
  font-weight: ${props => (props.$isActive ? 700 : 500)};
  border-left: 2px solid ${props => (props.$isActive ? '#ef4444' : 'transparent')};
  cursor: pointer;
  transition: background 0.12s ease;

  [data-theme='light'] & {
    color: ${props => (props.$isActive ? '#ef4444' : '#64748b')};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f1f5f9;
    [data-theme='light'] & {
      background: #f1f5f9;
      color: #0f172a;
    }
  }

  .item-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 170px;
  }

  .item-pill {
    font-size: 0.6rem;
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    color: ${props => (props.$isActive ? '#ef4444' : '#64748b')};

    [data-theme='light'] & {
      background: #e2e8f0;
      color: #475569;
    }
  }
`;
