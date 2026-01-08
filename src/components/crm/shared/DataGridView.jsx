import React, { memo, useState, useMemo, useCallback } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import './SharedComponents.css';

const DataGridView = memo(({ 
  data = [], 
  columns = [], 
  searchable = true,
  filterable = true,
  sortable = true,
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No data available',
  color = 'var(--assistant-color, #0EA5E9)'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSort = useCallback((key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, [sortable]);
  
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];
    
    if (searchQuery && searchable) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row => 
        columns.some(col => {
          const value = row[col.key];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }
    
    if (sortConfig.key && sortable) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [data, searchQuery, sortConfig, columns, searchable, sortable]);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);
  
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  
  return (
    <div className="data-grid-view" style={{ '--grid-accent': color }}>
      {(searchable || filterable) && (
        <div className="grid-toolbar">
          {searchable && (
            <div className="grid-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          {filterable && (
            <button className="grid-filter-btn">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          )}
        </div>
      )}
      
      <div className="grid-table-wrapper">
        <table className="grid-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={col.sortable !== false && sortable ? 'sortable' : ''}
                  style={{ width: col.width }}
                >
                  <span>{col.label}</span>
                  {sortable && col.sortable !== false && sortConfig.key === col.key && (
                    sortConfig.direction === 'asc' 
                      ? <ChevronUp size={14} /> 
                      : <ChevronDown size={14} />
                  )}
                </th>
              ))}
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={columns.length + 1}>{emptyMessage}</td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr 
                  key={row.id || idx}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'clickable' : ''}
                >
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="actions-col">
                    <button className="row-actions-btn">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="grid-pagination">
          <span className="pagination-info">
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length}
          </span>
          <div className="pagination-controls">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            <span className="page-number">{currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

DataGridView.displayName = 'DataGridView';
export default DataGridView;
