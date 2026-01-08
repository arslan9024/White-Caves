import React, { useMemo, useState, useCallback } from 'react';
import Button from '../ui/Button';
import Flex from '../layout/Flex';
import './DataTable.css';

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
      <div className={`${classes} ${baseClass}--loading`}>
        <div className={`${baseClass}__skeleton`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${baseClass}__skeleton-row`}>
              {columns.map((col, j) => (
                <div key={j} className={`${baseClass}__skeleton-cell`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${baseClass}__empty`}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className={`${baseClass}__wrapper`}>
        <table className={`${baseClass}__table`}>
          <thead className={`${baseClass}__head`}>
            <tr>
              {selectable && (
                <th className={`${baseClass}__th ${baseClass}__th--checkbox`}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${baseClass}__th ${sortable ? `${baseClass}__th--sortable` : ''}`}
                  onClick={() => handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <Flex align="center" gap="small">
                    <span>{column.header}</span>
                    {sortable && sortConfig.key === column.key && (
                      <span className={`${baseClass}__sort-icon`}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Flex>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${baseClass}__body`}>
            {paginatedData.map((row) => (
              <tr
                key={row[rowKey]}
                className={`${baseClass}__tr ${onRowClick ? `${baseClass}__tr--clickable` : ''} ${selectedRows.includes(row[rowKey]) ? `${baseClass}__tr--selected` : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className={`${baseClass}__td ${baseClass}__td--checkbox`}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row[rowKey])}
                      onChange={() => handleSelectRow(row[rowKey])}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select row ${row[rowKey]}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={`${baseClass}__td`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div className={`${baseClass}__pagination`}>
          <span className={`${baseClass}__pagination-info`}>
            Page {currentPage} of {totalPages}
          </span>
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
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
