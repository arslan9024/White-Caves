import React from 'react';
import styled from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface CavesTableProps<T> {
  columns: CavesTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyText?: string;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  border: 1.5px solid rgba(239, 68, 68, 0.15);
  background: #FFFFFF;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
`;

const Th = styled.th`
  background: #F8FAFC;
  color: ${SLATE};
  font-weight: 800;
  padding: 14px 16px;
  border-bottom: 1.5px solid #E2E8F0;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #F1F5F9;
  color: ${SLATE};
  font-weight: 600;
`;

const Tr = styled.tr<{ $isClickable: boolean }>`
  transition: background 0.15s ease;
  cursor: ${props => (props.$isClickable ? 'pointer' : 'default')};

  &:hover {
    background: rgba(239, 68, 68, 0.03);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export function CavesTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  emptyText = 'No records found',
}: CavesTableProps<T>) {
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {columns.map(col => (
              <Th key={col.key}>{col.header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <Td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-94a3b8, #94A3B8)' }}>
                {emptyText}
              </Td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <Tr
                key={row.id ?? idx}
                $isClickable={Boolean(onRowClick)}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <Td key={col.key}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}

export default CavesTable;
