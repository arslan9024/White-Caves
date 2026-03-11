import React, { useMemo, useState, useCallback } from 'react';
import Button from '../ui/Button';
import Flex from '../layout/Flex';
import * as S from './DataTable.styles';

const DataTable = React.memo(({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  sortable = true,
  paginated = false,
  pageSize = 10,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  rowKey = 'id',
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = useCallback((columnKey) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, [sortable]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, paginated, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      onSelectionChange?.(data.map(row => row[rowKey]));
    } else {
      onSelectionChange?.([]);
    }
  }, [data, rowKey, onSelectionChange]);

  const handleSelectRow = useCallback((rowId) => {
    const isSelected = selectedRows.includes(rowId);
    if (isSelected) {
      onSelectionChange?.(selectedRows.filter(id => id !== rowId));
    } else {
      onSelectionChange?.([...selectedRows, rowId]);
    }
  }, [selectedRows, onSelectionChange]);

  const baseClass = 'wc-data-table';
  const classes = [baseClass, className].filter(Boolean).join(' ');

  if (loading) {
    return (
      <S.DataTableWrapper>
        <S.SkeletonWrapper>
          {Array.from({ length: 5 }).map((_, i) => (
            <S.SkeletonRow key={i}>
              {columns.map((col, j) => (
                <S.SkeletonCell key={j} />
              ))}
            </S.SkeletonRow>
          ))}
        </S.SkeletonWrapper>
      </S.DataTableWrapper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <S.EmptyState>
        <p>{emptyMessage}</p>
      </S.EmptyState>
    );
  }

  return (
    <S.DataTableWrapper>
      <S.DataTableContainer>
        <S.StyledTable>
          <S.TableHead>
            <tr>
              {selectable && (
                <S.TableHeader $width="40px">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </S.TableHeader>
              )}
              {columns.map((column) => (
                <S.TableHeader
                  key={column.key}
                  $sortable={sortable}
                  $width={column.width}
                  onClick={() => handleSort(column.key)}
                >
                  <Flex align="center" gap="small">
                    <span>{column.header}</span>
                    {sortable && sortConfig.key === column.key && (
                      <S.SortIcon>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </S.SortIcon>
                    )}
                  </Flex>
                </S.TableHeader>
              ))}
            </tr>
          </S.TableHead>
          <S.TableBody>
            {paginatedData.map((row) => (
              <S.TableRow
                key={row[rowKey]}
                $clickable={!!onRowClick}
                $selected={selectedRows.includes(row[rowKey])}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <S.TableCell style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row[rowKey])}
                      onChange={() => handleSelectRow(row[rowKey])}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select row ${row[rowKey]}`}
                    />
                  </S.TableCell>
                )}
                {columns.map((column) => (
                  <S.TableCell key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </S.TableCell>
                ))}
              </S.TableRow>
            ))}
          </S.TableBody>
        </S.StyledTable>
      </S.DataTableContainer>

      {paginated && totalPages > 1 && (
        <S.PaginationContainer>
          <S.PaginationInfo>
            Page {currentPage} of {totalPages}
          </S.PaginationInfo>
          <Flex gap="small">
            <Button
              variant="ghost"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </Flex>
        </S.PaginationContainer>
      )}
    </S.DataTableWrapper>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
