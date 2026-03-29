/**
 * Table Component
 * Data display table with sorting and selection
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { Checkbox } from '../Checkbox';

export type TableRow = Record<string, unknown>;

export type TableColumn = {
  key: string;
  header: string;
  render?: (value: unknown, row: TableRow) => React.ReactNode;
  sortable?: boolean;
  width?: string;
};

export type TableProps = {
  columns: TableColumn[];
  data: TableRow[];
  selectable?: boolean;
  onSelectChange?: (selected: TableRow[]) => void;
  onRowClick?: (row: TableRow) => void;
  striped?: boolean;
  hoverable?: boolean;
};

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${theme.spacing.xs};
  border: 1px solid ${theme.colors.border};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.typography.sizes.sm};
`;

const TableHeader = styled.thead`
  background-color: ${theme.colors.background.tertiary};
  border-bottom: 2px solid ${theme.colors.border};
`;

const TableHeaderCell = styled.th<{ $sortable?: boolean }>`
  padding: ${theme.spacing.md};
  text-align: left;
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.secondary};
  cursor: ${(props) => (props.$sortable ? 'pointer' : 'default')};
  user-select: none;
  transition: ${theme.transitions.all};

  ${(props) =>
    props.$sortable &&
    `
    &:hover {
      background-color: ${theme.colors.background.secondary};
    }
  `}
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ $striped?: boolean; $hoverable?: boolean }>`
  border-bottom: 1px solid ${theme.colors.border};
  background-color: ${(props) => (props.$striped ? theme.colors.background.secondary : 'transparent')};

  ${(props) =>
    props.$hoverable &&
    `
    &:hover {
      background-color: ${theme.colors.background.tertiary};
    }
  `}

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  color: ${theme.colors.text.primary};
`;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      columns,
      data,
      selectable = false,
      onSelectChange,
      onRowClick,
      striped = true,
      hoverable = true,
    },
    ref
  ) => {
    const [selectedIds, setSelectedIds] = useState<Set<unknown>>(new Set());

    // Derive a stable row key (prefer 'id', fall back to '_id', then index)
    const getRowKey = (row: TableRow, index?: number): unknown =>
      row.id ?? row._id ?? index;

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        const allIds = new Set(data.map((row, i) => getRowKey(row, i)));
        setSelectedIds(allIds);
        onSelectChange?.(data);
      } else {
        setSelectedIds(new Set());
        onSelectChange?.([]);
      }
    };

    const handleSelectRow = (row: TableRow, rowIndex: number, checked: boolean) => {
      const key = getRowKey(row, rowIndex);
      const next = new Set(selectedIds);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      setSelectedIds(next);
      onSelectChange?.(data.filter((r, i) => next.has(getRowKey(r, i))));
    };

    const isRowSelected = (row: TableRow, index: number): boolean =>
      selectedIds.has(getRowKey(row, index));

    return (
      <TableWrapper>
        <StyledTable ref={ref}>
          <TableHeader>
            <tr>
              {selectable && (
                <TableHeaderCell>
                  <Checkbox
                    checked={selectedIds.size === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                  />
                </TableHeaderCell>
              )}
              {columns.map((col) => (
                <TableHeaderCell key={col.key} $sortable={col.sortable}>
                  {col.header}
                </TableHeaderCell>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} $striped={striped} $hoverable={hoverable} onClick={() => onRowClick?.(row)}>
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={isRowSelected(row, rowIndex)}
                      onChange={(e) => handleSelectRow(row, rowIndex, e.currentTarget.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} style={{ width: col.width }}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableWrapper>
    );
  }
);

Table.displayName = 'Table';

export default Table;
