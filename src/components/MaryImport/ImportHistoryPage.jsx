import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/authFetch';
import './ImportHistoryPage.css';

/**
 * ImportHistoryPage Component
 * Displays import history, progress tracking, and detailed reports
 */
const ImportHistoryPage = () => {
  const [imports, setImports] = useState([]);
  const [selectedImport, setSelectedImport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch imports on mount
  useEffect(() => {
    fetchImports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, sortBy]);

  const fetchImports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status: filterStatus === 'all' ? '' : filterStatus,
        sortBy,
        limit: 100,
      });

      const response = await authFetch(`/api/inventory/import/history?${params}`);
      const result = await response.json();

      if (result.success) {
        setImports(result.data.imports || []);
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search
  const filteredImports = imports.filter(imp => {
    const matchesSearch = imp.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedImports = filteredImports.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredImports.length / itemsPerPage);

  // Get status badge color
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'partial':
        return 'warning';
      case 'processing':
        return 'info';
      case 'cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Get status icon
  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'partial':
        return '⚠️';
      case 'processing':
        return '⏳';
      case 'cancelled':
        return '⛔';
      default:
        return '❓';
    }
  };

  // Format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format duration
  const formatDuration = (startDate, endDate) => {
    if (!endDate) return 'In progress...';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="import-history-page">
      <div className="page-header">
        <h1>📋 Import History & Tracking</h1>
        <p>View all data imports, track progress, and access detailed reports</p>
      </div>

      {/* Controls */}
      <div className="history-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="completed">✅ Completed</option>
            <option value="processing">⏳ Processing</option>
            <option value="partial">⚠️ Partial</option>
            <option value="failed">❌ Failed</option>
            <option value="cancelled">⛔ Cancelled</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="size">File Size (Large First)</option>
            <option value="rows">Row Count (Most First)</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => (window.location.href = '/import')}>
          + New Import
        </button>
      </div>

      {/* Statistics Summary */}
      <div className="statistics-grid">
        <div className="stat-card">
          <h4>Total Imports</h4>
          <p className="stat-value">{imports.length}</p>
        </div>
        <div className="stat-card success">
          <h4>Successful</h4>
          <p className="stat-value">{imports.filter(i => i.status === 'completed').length}</p>
        </div>
        <div className="stat-card warning">
          <h4>Partial</h4>
          <p className="stat-value">{imports.filter(i => i.status === 'partial').length}</p>
        </div>
        <div className="stat-card error">
          <h4>Failed</h4>
          <p className="stat-value">{imports.filter(i => i.status === 'failed').length}</p>
        </div>
        <div className="stat-card">
          <h4>Total Rows Imported</h4>
          <p className="stat-value">
            {imports.reduce((sum, imp) => sum + (imp.totalRows || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="stat-card">
          <h4>Total Records Created</h4>
          <p className="stat-value">
            {imports.reduce((sum, imp) => sum + (imp.propertiesCreated || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Imports Table */}
      <div className="imports-container">
        <h3>Import Sessions</h3>

        {isLoading ? (
          <div className="loading">Loading imports...</div>
        ) : displayedImports.length === 0 ? (
          <div className="empty-state">
            <p>No imports found</p>
            <button className="btn btn-primary" onClick={() => (window.location.href = '/import')}>
              Start Your First Import
            </button>
          </div>
        ) : (
          <>
            <table className="imports-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Rows</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Success Rate</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedImports.map(imp => (
                  <tr key={imp.sessionId} className={`import-row ${imp.status}`}>
                    <td className="file-name">
                      <span className="icon">📄</span>
                      {imp.fileName}
                    </td>
                    <td className="date">{formatDate(imp.createdAt)}</td>
                    <td className="status">
                      <span className={`badge ${getStatusColor(imp.status)}`}>
                        {getStatusIcon(imp.status)} {imp.status}
                      </span>
                    </td>
                    <td className="rows">{imp.totalRows || 0}</td>
                    <td className="created">{imp.propertiesCreated || 0}</td>
                    <td className="updated">{imp.propertiesUpdated || 0}</td>
                    <td className="success-rate">
                      <div className="rate-bar">
                        <div
                          className="rate-fill"
                          style={{ width: `${parseFloat(imp.successRate) || 0}%` }}
                        />
                      </div>
                      <span>{imp.successRate || 'N/A'}</span>
                    </td>
                    <td className="duration">{formatDuration(imp.createdAt, imp.completedAt)}</td>
                    <td className="actions">
                      <button
                        className="btn-icon"
                        title="View Details"
                        onClick={() => setSelectedImport(imp)}
                      >
                        👁️
                      </button>
                      <button
                        className="btn-icon"
                        title="Download Report"
                        onClick={() => downloadReport(imp.sessionId)}
                      >
                        📥
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedImport && (
        <ImportDetailModal import={selectedImport} onClose={() => setSelectedImport(null)} />
      )}
    </div>
  );
};

/**
 * ImportDetailModal Component
 * Displays detailed information about a specific import
 */
const ImportDetailModal = ({ import: importData, onClose }) => {
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');

  const fetchImportErrors = async () => {
    try {
      const response = await authFetch(
        `/api/inventory/import/session/${importData.sessionId}/errors`
      );
      const result = await response.json();
      if (result.success) {
        setErrors(result.data.errors || []);
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    if (importData.sessionId && activeTab === 'errors') {
      fetchImportErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, importData.sessionId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Import Details: {importData.fileName}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          {importData.status !== 'completed' && (
            <button
              className={`tab ${activeTab === 'errors' ? 'active' : ''}`}
              onClick={() => setActiveTab('errors')}
            >
              Errors ({importData.totalErrors || 0})
            </button>
          )}
        </div>

        <div className="modal-body">
          {activeTab === 'summary' && (
            <div className="summary-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Session ID</label>
                  <code>{importData.sessionId}</code>
                </div>
                <div className="info-item">
                  <label>File Name</label>
                  <p>{importData.fileName}</p>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <span className="badge success">{importData.status}</span>
                </div>
                <div className="info-item">
                  <label>Imported By</label>
                  <p>{importData.importedBy}</p>
                </div>
                <div className="info-item">
                  <label>Date</label>
                  <p>{new Date(importData.createdAt).toLocaleString()}</p>
                </div>
                <div className="info-item">
                  <label>Duration</label>
                  <p>
                    {importData.completedAt
                      ? formatDuration(importData.createdAt, importData.completedAt)
                      : 'In progress...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <h4>Total Rows</h4>
                  <p className="value">{importData.totalRows || 0}</p>
                </div>
                <div className="stat-item success">
                  <h4>Properties Created</h4>
                  <p className="value">{importData.propertiesCreated || 0}</p>
                </div>
                <div className="stat-item info">
                  <h4>Properties Updated</h4>
                  <p className="value">{importData.propertiesUpdated || 0}</p>
                </div>
                <div className="stat-item success">
                  <h4>Owners Created</h4>
                  <p className="value">{importData.ownersCreated || 0}</p>
                </div>
                <div className="stat-item info">
                  <h4>Owners Updated</h4>
                  <p className="value">{importData.ownersUpdated || 0}</p>
                </div>
                <div className="stat-item">
                  <h4>Success Rate</h4>
                  <p className="value">{importData.successRate || 'N/A'}</p>
                </div>
                <div className="stat-item warning">
                  <h4>Duplicates Found</h4>
                  <p className="value">{importData.duplicatesFound || 0}</p>
                </div>
                <div className="stat-item error">
                  <h4>Errors</h4>
                  <p className="value">{importData.totalErrors || 0}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="errors-content">
              {errors.length === 0 ? (
                <p className="no-errors">No errors to display</p>
              ) : (
                <table className="errors-table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Field</th>
                      <th>Message</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.slice(0, 20).map((error, idx) => (
                      <tr key={idx}>
                        <td>{error.rowIndex}</td>
                        <td>{error.field}</td>
                        <td>{error.message}</td>
                        <td>
                          <code>{String(error.value).substring(0, 30)}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => downloadReport(importData.sessionId)}>
            📥 Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function formatDuration(startDate, endDate) {
  if (!endDate) return 'In progress...';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const seconds = Math.floor((end - start) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function downloadReport(sessionId) {
  // Trigger download of import report
  const link = document.createElement('a');
  link.href = `/api/inventory/import/session/${sessionId}/report?format=pdf`;
  link.download = `import-report-${sessionId}.pdf`;
  link.click();
}

export default ImportHistoryPage;
