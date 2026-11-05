import styled from 'styled-components';

export const DepartmentCard = styled.div<{
  $color?: string;
  $isEditing?: boolean;
  $isDragging?: boolean;
  $isDragOver?: boolean;
}>`
  background: var(--bg-card, #070d18);
  border: 1px solid
    ${({ $isEditing, $color }) =>
      $isEditing ? '#EF4444' : $color ? `${$color}44` : 'rgba(255, 255, 255, 0.08)'};
  border-left: 4px solid ${({ $color }) => $color || '#EF4444'};
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: all 0.2s ease;
  user-select: none;

  ${({ $isDragging }) =>
    $isDragging &&
    `
    opacity: 0.4;
    transform: scale(0.98);
    border-style: dashed;
  `}

  ${({ $isDragOver, $color }) =>
    $isDragOver &&
    `
    border: 2px dashed ${$color || '#EF4444'};
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.25);
  `}

  [data-theme='light'] & {
    background: #ffffff;
    border-color: ${({ $isEditing }) => ($isEditing ? '#EF4444' : '#E2E8F0')};
    border-left-color: ${({ $color }) => $color || '#EF4444'};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;

    .title-group {
      display: flex;
      align-items: center;
      gap: 8px;

      .drag-handle {
        color: var(--text-muted, #64748b);
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        transition: color 0.15s ease;

        &:hover {
          color: #ef4444;
        }

        &:active {
          cursor: grabbing;
        }
      }

      .icon-box {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: ${({ $color }) => ($color ? `${$color}20` : 'rgba(239, 68, 68, 0.15)')};
        color: ${({ $color }) => $color || '#EF4444'};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .info {
        display: flex;
        flex-direction: column;

        .code-row {
          display: flex;
          align-items: center;
          gap: 6px;

          .code {
            font-size: 0.65rem;
            font-family: monospace;
            font-weight: 800;
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
            padding: 1px 6px;
            border-radius: 4px;
          }

          .order-pill {
            font-size: 0.65rem;
            color: var(--text-muted, #64748b);
          }
        }

        h3 {
          margin: 3px 0 0 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary, #ffffff);

          [data-theme='light'] & {
            color: #0f172a;
          }
        }
      }
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 4px;

      button {
        background: transparent;
        border: none;
        padding: 5px;
        border-radius: 6px;
        color: var(--text-muted, #64748b);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;

        &:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      }
    }
  }

  .description {
    font-size: 0.78rem;
    color: var(--text-muted, #94a3b8);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    [data-theme='light'] & {
      color: #64748b;
    }
  }

  .card-footer {
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.72rem;

    [data-theme='light'] & {
      border-top: 1px solid #f1f5f9;
    }

    .metrics-pills {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-muted, #94a3b8);

      [data-theme='light'] & {
        color: #64748b;
      }

      span {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
      }
    }

    .view-squads-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: ${({ $color }) => ($color ? `${$color}15` : 'rgba(239, 68, 68, 0.12)')};
      color: ${({ $color }) => $color || '#EF4444'};
      border: 1px solid ${({ $color }) => ($color ? `${$color}44` : 'rgba(239, 68, 68, 0.3)')};
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 0.7rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: ${({ $color }) => $color || '#EF4444'};
        color: #ffffff;
      }
    }

    .lead-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-muted, #94a3b8);
      font-size: 0.7rem;

      [data-theme='light'] & {
        color: #475569;
      }

      strong {
        color: #ef4444;
      }
    }
  }
`;
