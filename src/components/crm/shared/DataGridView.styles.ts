import styled from 'styled-components';
import { transitions } from '../../../styles/theme/transitions';
import { typography } from '../../../styles/theme/typography';
import { radius } from '../../../styles/theme/radius';

export const DataGridViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: ${radius.xl};
  padding: 20px;

  [data-theme='dark'] & {
    background: var(--bg-card, rgba(255, 255, 255, 0.02));
    border-color: var(--border-color, rgba(255, 255, 255, 0.08));
  }
`;

export const GridToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  [data-theme='dark'] & {
  }
`;

export const GridSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.lg};
  flex: 1;
  max-width: 300px;

  svg {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  input {
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: ${typography.sizes.base};
    width: 100%;
    outline: none;

    &::placeholder {
      color: var(--text-muted);
    }
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
    border-color: var(--border-color, rgba(255, 255, 255, 0.1));

    input {
      color: #e2e8f0;

      &::placeholder {
        color: #64748b;
      }
    }

    svg {
      color: #64748b;
    }
  }
`;

export const GridFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.lg};
  color: var(--text-secondary);
  font-size: ${typography.sizes.base};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #94a3b8;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
    }
  }
`;

export const GridTableWrapper = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;

    &:hover {
      background: var(--text-muted);
    }
  }

  [data-theme='dark'] & {
  }
`;

export const GridTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const GridTableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;

  &.sortable {
    cursor: pointer;
    user-select: none;

    &:hover {
      color: var(--text-secondary);
    }
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  [data-theme='dark'] & {
    color: #64748b;
    border-bottom-color: rgba(255, 255, 255, 0.1);

    &.sortable:hover {
      color: #94a3b8;
    }
  }
`;

export const GridTableCell = styled.td`
  padding: 14px 16px;
  font-size: ${typography.sizes.base};
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);

  [data-theme='dark'] & {
    color: #e2e8f0;
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }
`;

export const GridTableRow = styled.tr<{ $clickable?: boolean }>`
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
  }

  ${props =>
    props.$clickable &&
    `
    cursor: pointer;

    &:hover {
      background: rgba(var(--primary-rgb, 196, 30, 58), 0.08);
    }
  `}

  &.empty-row td {
    text-align: center;
    color: var(--text-muted);
    padding: 40px;
  }

  [data-theme='dark'] & {
    &:hover {
      background: rgba(255, 255, 255, 0.03);
    }
  }
`;

export const ActionsColumn = styled.td`
  width: 40px;
  text-align: right;
`;

export const RowActionsButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: ${radius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.hover};
  opacity: 0;

  ${GridTableRow}:hover & {
    opacity: 1;
  }

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  [data-theme='dark'] & {
    color: #64748b;

    ${GridTableRow}:hover & {
      opacity: 1;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
    }
  }
`;

export const GridPagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);

  [data-theme='dark'] & {
    border-top-color: rgba(255, 255, 255, 0.08);
  }
`;

export const PaginationInfo = styled.span`
  font-size: ${typography.sizes.xs};
  color: var(--text-muted);

  [data-theme='dark'] & {
    color: #64748b;
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  [data-theme='dark'] & {
  }
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.md};
  color: var(--text-secondary);
  font-size: ${typography.sizes.sm};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #94a3b8;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
    }
  }
`;

export const PageNumber = styled.span`
  font-size: ${typography.sizes.sm};
  color: var(--text-secondary);
  padding: 0 8px;

  [data-theme='dark'] & {
    color: #94a3b8;
  }
`;