import styled from 'styled-components';
import { typography } from '../../../styles/theme/typography';

export const PropertyMatrixContainer = styled.div`
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

export const MatrixHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  gap: 16px;
  flex-wrap: wrap;
`;

export const MatrixInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-weight: 500;
`;

export const MatrixSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  flex: 1;
  max-width: 400px;

  input {
    border: none;
    background: transparent;
    flex: 1;
    color: var(--text-primary);
    font-size: 14px;

    &:focus {
      outline: none;
    }
  }
`;

export const MatrixTableWrapper = styled.div`
  overflow-x: auto;
`;

export const MatrixTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: var(--bg-secondary);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;

    &:hover {
      color: var(--text-primary);
    }

    svg {
      vertical-align: middle;
      margin-left: 4px;
    }
  }

  td {
    padding: 12px 16px;
    border-top: 1px solid var(--border-color);
    font-size: 14px;
    color: var(--text-primary);
  }

  tbody tr:hover {
    background: var(--bg-secondary);
  }

  tbody tr.multi-owner-row {
    background: rgba(245, 158, 11, 0.05);

    &:hover {
      background: rgba(245, 158, 11, 0.1);
    }
  }
`;

export const PNumberCell = styled.td`
  font-weight: 600;
  font-family: ${typography.fontFamily.mono};
  color: var(--primary);
`;

export const ClusterBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const AreaCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
`;

export const OwnersCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

export const OwnerBadge = styled.button<{ $multiPhone?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-secondary);
  border: 1px solid
    ${(props) =>
      props.$multiPhone
        ? '#3b82f6'
        : 'var(--border-color)'};
  border-radius: 6px;
  font-size: 11px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    background: rgba(220, 38, 38, 0.05);
  }
`;

export const MultiPhoneIcon = styled.span`
  color: #3b82f6;
`;

export const MultiOwnerIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
`;

export const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$status) {
      case 'rented':
        return 'rgba(59, 130, 246, 0.1)';
      case 'available':
        return 'rgba(34, 197, 94, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'rented':
        return '#3b82f6';
      case 'available':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  }};
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid var(--border-color);
`;

export const PaginationBtn = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  background: ${(props) =>
    props.$active ? 'var(--primary)' : 'transparent'};
  color: ${(props) =>
    props.$active ? 'white' : 'var(--text-secondary)'};
  border-radius: 6px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--primary);
  }
`;
