import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, MoreVertical } from 'lucide-react';
import './DataTable.css';

const DataTable = ({
  data = [],
  columns = [],
  searchable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onAction,
  emptyMessage = 'No data available',
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);

  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (searchTerm) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, sortConfig, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAction = (action, row, e) => {
    e.stopPropagation();
    setActiveMenu(null);
    onAction?.(action, row);
  };

  if (loading) {
    return (
      <div className="data-table-loading">
        <div className="loading-spinner" />
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="data-table-toolbar">
          <div className="search-input">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filterable && (
            <button className="filter-btn">
              <Filter size={16} />
              Filters
            </button>
          )}
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={col.sortable !== false ? 'sortable' : ''}
                  style={{ width: col.width }}
                >
                  <div className="th-content">
                    <span>{col.label}</span>
                    {sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {onAction && <th className="actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onAction ? 1 : 0)} className="empty-row">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'clickable' : ''}
                >
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {onAction && (
                    <td className="actions-cell">
                      <button
                        className="action-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === row.id ? null : row.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenu === row.id && (
                        <div className="action-menu">
                          <button onClick={(e) => handleAction('view', row, e)}>View</button>
                          <button onClick={(e) => handleAction('edit', row, e)}>Edit</button>
                          <button onClick={(e) => handleAction('delete', row, e)} className="danger">Delete</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="data-table-pagination">
          <span className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
          </span>
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  className={currentPage === page ? 'active' : ''}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
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
};

export default DataTable;
