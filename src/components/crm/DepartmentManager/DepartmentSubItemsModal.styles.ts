import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContainer = styled.div<{ $color?: string }>`
  width: 100%;
  max-width: 1060px;
  max-height: 88vh;
  background: var(--bg-card, #0b1120);
  border: 1.5px solid ${({ $color }) => ($color ? `${$color}66` : 'rgba(239, 68, 68, 0.3)')};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
  animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  [data-theme='light'] & {
    background: #ffffff;
    border-color: ${({ $color }) => $color || '#EF4444'};
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.97) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

export const ModalHeader = styled.div<{ $color?: string }>`
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ $color }) => ($color ? `${$color}0D` : 'transparent')};

  [data-theme='light'] & {
    border-bottom: 1px solid #e2e8f0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: ${({ $color }) => ($color ? `${$color}22` : 'rgba(239, 68, 68, 0.15)')};
      color: ${({ $color }) => $color || '#EF4444'};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .title-group {
      display: flex;
      flex-direction: column;

      .badge-row {
        display: flex;
        align-items: center;
        gap: 6px;

        .dept-code {
          font-size: 0.65rem;
          font-family: monospace;
          font-weight: 800;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.12);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .count-tag {
          font-size: 0.65rem;
          color: var(--text-muted, #94a3b8);
          font-weight: 700;
        }
      }

      h2 {
        margin: 2px 0 0 0;
        font-size: 1.1rem;
        font-weight: 900;
        color: var(--text-primary, #ffffff);
        [data-theme='light'] & {
          color: #0f172a;
        }
      }
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--text-muted, #64748b);
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.15s ease;
    &:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
  }
`;

export const ModalScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.25);
    border-radius: 4px;
  }
`;

export const SubItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 10px;
`;

export const SubItemCard = styled.div<{
  $color?: string;
  $isDragging?: boolean;
  $isDragOver?: boolean;
  $isPool?: boolean;
}>`
  background: var(--bg-card, #070d18);
  border: 1px solid
    ${({ $isPool, $color }) =>
      $isPool ? 'rgba(255, 255, 255, 0.08)' : $color ? `${$color}44` : 'rgba(255, 255, 255, 0.08)'};
  border-left: 3px solid ${({ $isPool, $color }) => ($isPool ? '#64748B' : $color || '#EF4444')};
  border-radius: 8px;
  padding: 11px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.15s ease;
  user-select: none;
  cursor: grab;

  ${({ $isDragging }) =>
    $isDragging && `opacity: 0.35; border-style: dashed; transform: scale(0.98);`}
  ${({ $isDragOver, $color }) =>
    $isDragOver &&
    `border: 2px dashed ${$color || '#EF4444'}; transform: scale(1.02); box-shadow: 0 4px 16px rgba(239, 68, 68, 0.2);`}

  [data-theme='light'] & {
    background: ${({ $isPool }) => ($isPool ? '#F1F5F9' : '#F8FAFC')};
    border-color: #e2e8f0;
    border-left-color: ${({ $isPool, $color }) => ($isPool ? '#94A3B8' : $color || '#EF4444')};
  }

  &:hover {
    border-color: ${({ $color }) => $color || '#EF4444'};
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  }

  .sub-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top-left {
      display: flex;
      align-items: center;
      gap: 6px;

      .drag-handle {
        color: var(--text-muted, #64748b);
        display: flex;
        align-items: center;
        cursor: grab;
        &:hover {
          color: #ef4444;
        }
      }

      .index-pill {
        font-size: 0.65rem;
        font-weight: 800;
        color: ${({ $isPool }) => ($isPool ? '#94A3B8' : '#EF4444')};
        background: ${({ $isPool }) =>
          $isPool ? 'rgba(148, 163, 184, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        padding: 1px 6px;
        border-radius: 4px;
      }
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 6px;

      .status-pill {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.62rem;
        font-weight: 700;
        color: ${({ $isPool }) => ($isPool ? '#F59E0B' : '#10B981')};
        background: ${({ $isPool }) =>
          $isPool ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
        padding: 2px 6px;
        border-radius: 9999px;

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${({ $isPool }) => ($isPool ? '#F59E0B' : '#10B981')};
        }
      }

      .pool-btn {
        background: transparent;
        border: none;
        color: var(--text-muted, #64748b);
        cursor: pointer;
        padding: 2px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        &:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      }
    }
  }

  .sub-info {
    display: flex;
    flex-direction: column;

    .name {
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--text-primary, #ffffff);
      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .title {
      font-size: 0.72rem;
      font-weight: 600;
      color: ${({ $isPool, $color }) => ($isPool ? '#94A3B8' : $color || '#EF4444')};
      margin-top: 1px;
    }

    .specialty {
      font-size: 0.68rem;
      color: var(--text-muted, #94a3b8);
      margin-top: 2px;
      [data-theme='light'] & {
        color: #64748b;
      }
    }
  }

  .tasks-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .task-tag {
      font-size: 0.62rem;
      color: var(--text-muted, #94a3b8);
      background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      padding: 1px 5px;
      border-radius: 4px;
      [data-theme='light'] & {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        color: #475569;
      }
    }
  }

  .sub-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 6px;
    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
    font-size: 0.65rem;
    color: var(--text-muted, #64748b);
    [data-theme='light'] & {
      border-top: 1px solid #e2e8f0;
    }

    .sla {
      font-family: monospace;
    }
    .accuracy {
      font-weight: 700;
      color: #10b981;
    }
  }
`;

export const UnassignedPoolSection = styled.div`
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1.5px dashed var(--border-color, rgba(255, 255, 255, 0.12));
  display: flex;
  flex-direction: column;
  gap: 10px;

  [data-theme='light'] & {
    border-top: 1.5px dashed #cbd5e1;
  }

  .pool-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;

    .pool-heading {
      display: flex;
      align-items: center;
      gap: 8px;

      h3 {
        margin: 0;
        font-size: 0.92rem;
        font-weight: 800;
        color: var(--text-primary, #ffffff);
        [data-theme='light'] & {
          color: #0f172a;
        }
      }

      .pool-count-tag {
        font-size: 0.65rem;
        font-weight: 800;
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
        padding: 2px 7px;
        border-radius: 9999px;
      }
    }

    .pool-hint {
      font-size: 0.72rem;
      color: var(--text-muted, #94a3b8);
    }
  }
`;
