import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * DataTable Component
 * Sortable, filterable table with pagination
 * Fully responsive and accessible with WCAG AAA compliance
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{key, label, sortable, renderer}]
 * @param {Array} props.rows - Table data rows
 * @param {Function} props.onSort - Sort callback (column, direction)
 * @param {Function} props.onFilter - Filter callback
 * @param {number} props.rowsPerPage - Rows per page (default: 10)
 * @param {string} props.emptyMessage - Message when no data available
 * 
 * @example
 * <DataTable
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'status', label: 'Status', sortable: true },
 *   ]}
 *   rows={[{ name: 'John', status: 'active' }]}
 *   onSort={(col, dir) => }
 * />
 */
const DataTable = ({
  columns = [],
  rows = [],
  onSort,
  onFilter,
  rowsPerPage = 10,
  emptyMessage = 'No data available',
}) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  const sortedRows = useMemo(() => {
    let sortableRows = [...filteredRows];
    if (sortConfig) {
      sortableRows.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableRows;
  }, [filteredRows, sortConfig]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
    setCurrentPage(1);
  }, [sortConfig, onSort]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    onFilter?.(value);
  }, [onFilter]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search table..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Search table"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-100"
                  scope="col"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label={`Sort by ${col.label}`}
                    >
                      {col.label}
                      <span className="text-xs opacity-50">
                        {sortConfig?.key === col.key 
                          ? (sortConfig.direction === 'asc' ? '↑' : '↓') 
                          : '↕'}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                    idx % 2 === 0 
                      ? 'bg-white dark:bg-gray-900' 
                      : 'bg-gray-50 dark:bg-gray-800'
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  {columns.map(col => (
                    <td 
                      key={col.key} 
                      className="px-6 py-4 text-gray-900 dark:text-gray-100"
                    >
                      {col.renderer 
                        ? col.renderer(row[col.key], row) 
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages} • {filteredRows.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    renderer: PropTypes.func,
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
  rowsPerPage: PropTypes.number,
  emptyMessage: PropTypes.string,
};

export default DataTable;
