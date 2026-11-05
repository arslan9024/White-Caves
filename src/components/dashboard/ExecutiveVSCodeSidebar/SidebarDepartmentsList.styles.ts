import styled from 'styled-components';

export const SidebarListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 10px 24px 10px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 4px;
  }
`;

export const SidebarCardItem = styled.div<{
  $isSelected?: boolean;
  $isEmpty?: boolean;
  $isDragging?: boolean;
  $isDragOver?: boolean;
  $accentColor?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 9px 11px;
  background: ${({ $isSelected }) =>
    $isSelected ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.025)'};
  border: 1px solid
    ${({ $isSelected, $isDragOver }) =>
      $isDragOver ? '#3B82F6' : $isSelected ? '#EF4444' : 'rgba(255, 255, 255, 0.06)'};
  border-left: 3px solid
    ${({ $isSelected, $accentColor, $isEmpty }) =>
      $isEmpty ? 'rgba(255, 255, 255, 0.2)' : $isSelected ? '#EF4444' : $accentColor || '#64748B'};
  border-radius: 6px;
  cursor: pointer;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  transition: all 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${({ $isSelected }) => ($isSelected ? '#EF4444' : 'rgba(255, 255, 255, 0.14)')};
  }

  .card-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .slot-meta {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .slot-pill {
    font-size: 0.65rem;
    font-weight: 800;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
    padding: 1px 5px;
    border-radius: 4px;
    font-family: monospace;
  }

  .slot-code {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    font-family: monospace;
  }

  .drag-handle {
    color: #64748b;
    cursor: grab;
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 3px;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }
  }

  .card-title-row {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-box {
      color: ${({ $accentColor }) => $accentColor || '#EF4444'};
      display: flex;
      align-items: center;
    }

    h4 {
      margin: 0;
      font-size: 0.78rem;
      font-weight: 700;
      color: ${({ $isEmpty }) => ($isEmpty ? '#64748B' : '#F1F5F9')};
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .card-bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.66rem;
    color: #64748b;
    margin-top: 2px;

    .squad-count {
      display: flex;
      align-items: center;
      gap: 3px;
      color: #94a3b8;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 4px;

      button {
        background: transparent;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 2px;
        border-radius: 3px;
        display: flex;
        align-items: center;

        &:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      }
    }
  }
`;
