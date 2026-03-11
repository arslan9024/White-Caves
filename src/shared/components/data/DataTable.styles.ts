import styled, { keyframes } from 'styled-components';

const tableSkeletonLoading = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const DataTableWrapper = styled.div`
  width: 100%;
  background: var(--card-bg, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  overflow: hidden;

  [data-theme="dark"] & {
    background: var(--card-bg-dark, #1f2937);
    border-color: var(--border-color-dark, #374151);
  }
`;

export const DataTableContainer = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: var(--bg-secondary, #f9fafb);

  [data-theme="dark"] & {
    background: var(--bg-secondary-dark, #111827);
  }
`;

export const TableHeader = styled.th<{ $sortable?: boolean; $width?: string }>`
  padding: 0.875rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, #6b7280);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  ${props => props.$width && `width: ${props.$width};`}

  ${props => props.$sortable && `
    cursor: pointer;
    user-select: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-red, #dc2626);
    }
  `}

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ $clickable?: boolean; $selected?: boolean }>`
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--border-color, #e5e7eb);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(220, 38, 38, 0.02);
  }

  ${props => props.$clickable && `
    cursor: pointer;
  `}

  ${props => props.$selected && `
    background: rgba(220, 38, 38, 0.05);
  `}

  [data-theme="dark"] & {
    border-bottom-color: var(--border-color-dark, #374151);

    &:hover {
      background: rgba(220, 38, 38, 0.05);
    }

    ${props => props.$selected && `
      background: rgba(220, 38, 38, 0.1);
    `}
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--text-primary, #1f2937);

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--text-muted, #6b7280);

  p {
    margin: 0;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid var(--border-color, #e5e7eb);

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const PaginationInfo = styled.span`
  font-size: 0.875rem;
  color: var(--text-muted, #6b7280);
`;

export const SkeletonWrapper = styled.div`
  padding: 1rem;
`;

export const SkeletonRow = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color, #e5e7eb);

  &:last-child {
    border-bottom: none;
  }

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const SkeletonCell = styled.div`
  flex: 1;
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${tableSkeletonLoading} 1.5s infinite;
  border-radius: 4px;

  [data-theme="dark"] & {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
`;

export const SortIcon = styled.span`
  font-size: 0.625rem;
  margin-left: 4px;
`;
