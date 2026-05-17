import React from 'react';
import styled from 'styled-components';

type TableRow = Record<string, React.ReactNode>;

interface TableProps {
  columns: string[];
  data: TableRow[];
  onRowClick?: (row: TableRow, index: number) => void;
}

const Wrapper = styled.div`
  overflow-x: auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const HeadCell = styled.th`
  text-align: left;
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const BodyCell = styled.td`
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
  font-size: 0.875rem;
`;

const BodyRow = styled.tr<{ $clickable: boolean }>`
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${props => (props.$clickable ? '#f9fafb' : 'transparent')};
  }
`;

const EmptyState = styled.td`
  padding: 1rem;
  color: #6b7280;
  text-align: center;
`;

const Table: React.FC<TableProps> = ({ columns, data, onRowClick }) => {
  return (
    <Wrapper>
      <StyledTable>
        <thead>
          <tr>
            {columns.map(column => (
              <HeadCell key={column}>{column}</HeadCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <EmptyState colSpan={columns.length}>No data available</EmptyState>
            </tr>
          ) : (
            data.map((row, index) => (
              <BodyRow
                key={index}
                $clickable={Boolean(onRowClick)}
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map(column => (
                  <BodyCell key={`${index}-${column}`}>{row[column] ?? '—'}</BodyCell>
                ))}
              </BodyRow>
            ))
          )}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
};

export default Table;
