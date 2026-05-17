import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './DataTable.css';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  sortable = true,
  paginated = true,
  pageSize = 10,
  emptyMessage = 'No data available',
  onRowClick,
  rowKey = 'id',
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

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
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(data.length / pageSize);

  if (loading) {
    return (
      <div className={`data-table loading ${className}`}>
        <table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((_, colIdx) => (
                  <td key={colIdx}>
                    <div className="skeleton-cell" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`data-table empty ${className}`}>
        <div className="empty-state">
          <span>{emptyMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`${sortable && col.sortable !== false ? 'sortable' : ''} ${col.align || ''}`}
                  style={{ width: col.width }}
                >
                  <div className="th-content">
                    <span>{col.header}</span>
                    {sortable && col.sortable !== false && sortConfig.key === col.key && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIdx) => (
              <tr 
                key={row[rowKey] || rowIdx}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.align || ''}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div className="table-pagination">
          <span className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </span>
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-indicator">{currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
