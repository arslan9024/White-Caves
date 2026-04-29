import React, { useState, useMemo } from 'react';
import './PreviewGridWithFilters.css';

/**
 * PreviewGridWithFilters Component
 * Displays imported data with filtering, sorting, and validation status
 */
const PreviewGridWithFilters = ({
  data = [],
  columns = [],
  mapping = {},
  validationResult = null,
  onRowSelect,
  onApplyChanges
}) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [viewMode, setViewMode] = useState('all'); // all, valid, errors, warnings

  // Filter data based on view mode and filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter by view mode
    if (validationResult) {
      const rowsWithErrors = new Set(validationResult.rowsWithErrors || []);
      const rowsWithWarnings = new Set(validationResult.rowsWithWarnings || []);

      if (viewMode === 'errors') {
        result = result.filter((_, idx) => rowsWithErrors.has(idx));
      } else if (viewMode === 'warnings') {
        result = result.filter((_, idx) => rowsWithWarnings.has(idx));
      } else if (viewMode === 'valid') {
        result = result.filter((_, idx) => 
          !rowsWithErrors.has(idx) && !rowsWithWarnings.has(idx)
        );
      }
    }

    // Apply column filters
    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const cellValue = String(row[column] || '').toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;
        if (typeof aVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else {
          comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, sortConfig, validationResult, viewMode]);

  // Get row status
  const getRowStatus = (rowIndex) => {
    if (!validationResult) return 'valid';
    if (validationResult.rowsWithErrors?.includes(rowIndex)) return 'error';
    if (validationResult.rowsWithWarnings?.includes(rowIndex)) return 'warning';
    return 'valid';
  };

  // Handle column filter change
  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  // Handle sort
  const handleSort = (column) => {
    setSortConfig(prev => ({
      key: column,
      direction: prev.key === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Toggle row selection
  const handleRowToggle = (rowIndex) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowIndex)) {
      newSelected.delete(rowIndex);
    } else {
      newSelected.add(rowIndex);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  // Select all visible rows
  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      const allIndices = new Set(filteredData.map((_, idx) => idx));
      setSelectedRows(allIndices);
    }
  };

  // Get visible columns
  const visibleColumns = columns.filter(col => mapping[col]);

  // Statistics
  const stats = {
    total: data.length,
    showing: filteredData.length,
    selected: selectedRows.size,
    errors: validationResult?.totalErrors || 0,
    warnings: validationResult?.totalWarnings || 0
  };

  return (
    <div className="preview-grid-container">
      <div className="grid-header">
        <h3>Data Preview</h3>
        <p>Review your data before importing. Fix any errors shown below.</p>
      </div>

      {/* View Mode Tabs */}
      <div className="view-mode-tabs">
        <button
          className={`tab ${viewMode === 'all' ? 'active' : ''}`}
          onClick={() => setViewMode('all')}
        >
          All ({stats.total})
        </button>
        {stats.errors > 0 && (
          <button
            className={`tab ${viewMode === 'errors' ? 'active' : ''}`}
            onClick={() => setViewMode('errors')}
          >
            ⚠️ Errors ({stats.errors})
          </button>
        )}
        {stats.warnings > 0 && (
          <button
            className={`tab ${viewMode === 'warnings' ? 'active' : ''}`}
            onClick={() => setViewMode('warnings')}
          >
            ⚠ Warnings ({stats.warnings})
          </button>
        )}
        <button
          className={`tab ${viewMode === 'valid' ? 'active' : ''}`}
          onClick={() => setViewMode('valid')}
        >
          ✓ Valid
        </button>
      </div>

      {/* Statistics Bar */}
      <div className="grid-stats">
        <div className="stat">
          <span className="label">Total Rows:</span>
          <span className="value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="label">Showing:</span>
          <span className="value">{stats.showing}</span>
        </div>
        <div className="stat">
          <span className="label">Selected:</span>
          <span className="value">{stats.selected}</span>
        </div>
        {stats.errors > 0 && (
          <div className="stat error">
            <span className="label">Errors:</span>
            <span className="value">{stats.errors}</span>
          </div>
        )}
        {stats.warnings > 0 && (
          <div className="stat warning">
            <span className="label">Warnings:</span>
            <span className="value">{stats.warnings}</span>
          </div>
        )}
      </div>

      {/* Grid Actions */}
      <div className="grid-actions">
        <button
          className="btn btn-outline"
          onClick={handleSelectAll}
        >
          {selectedRows.size === filteredData.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Data Grid */}
      <div className="grid-wrapper">
        <table className="data-grid">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="row-index">#</th>
              {visibleColumns.map(col => (
                <th
                  key={col}
                  className="sortable"
                  onClick={() => handleSort(col)}
                  title="Click to sort"
                >
                  <div className="header-content">
                    <span>{mapping[col] || col}</span>
                    {sortConfig.key === col && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                  <input
                    className="filter-input"
                    type="text"
                    placeholder="Filter..."
                    value={filters[col] || ''}
                    onChange={(e) => handleFilterChange(col, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
              ))}
              <th className="status-column">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => {
                const rowStatus = getRowStatus(idx);
                const isSelected = selectedRows.has(idx);

                return (
                  <tr key={idx} className={`data-row ${rowStatus} ${isSelected ? 'selected' : ''}`}>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowToggle(idx)}
                      />
                    </td>
                    <td className="row-index">{idx + 1}</td>
                    {visibleColumns.map(col => (
                      <td key={`${idx}-${col}`} className="data-cell">
                        <span className="cell-value" title={row[col]}>
                          {row[col] ? String(row[col]).substring(0, 50) : '-'}
                        </span>
                      </td>
                    ))}
                    <td className="status-cell">
                      <span className={`badge ${rowStatus}`}>
                        {rowStatus === 'error' && '✗ Error'}
                        {rowStatus === 'warning' && '⚠ Warning'}
                        {rowStatus === 'valid' && '✓ Valid'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={visibleColumns.length + 3} className="empty-state">
                  <p>No data to display</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions Footer */}
      <div className="grid-footer">
        <div className="info">
          {stats.errors > 0 && (
            <p className="error-info">
              ⚠️ Please fix {stats.errors} error(s) before proceeding
            </p>
          )}
          {stats.warnings > 0 && (
            <p className="warning-info">
              ⚠ {stats.warnings} warning(s) detected. Please review before importing.
            </p>
          )}
        </div>
        <div className="actions">
          <button
            className="btn btn-primary"
            disabled={stats.errors > 0}
            onClick={() => onApplyChanges?.(Array.from(selectedRows))}
          >
            Apply & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewGridWithFilters;
