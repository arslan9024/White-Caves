import React, { useState, useMemo } from 'react';
import './DuplicateResolutionPanel.css';

/**
 * DuplicateResolutionPanel Component
 * Handles duplicate detection and resolution with intelligent suggestions
 */
const DuplicateResolutionPanel = ({
  duplicates = [],
  onResolutionChange,
  onResolveAll,
  deduplicationStrategy = 'keep'
}) => {
  const [selectedDuplicate, setSelectedDuplicate] = useState(null);
  const [resolutions, setResolutions] = useState({});
  const [viewMode, setViewMode] = useState('pending'); // pending, resolved, all

  // Filter duplicates by view mode
  const filteredDuplicates = useMemo(() => {
    let result = [...duplicates];

    if (viewMode === 'pending') {
      result = result.filter(d => !resolutions[d.rowIndex] || resolutions[d.rowIndex].resolution === 'pending');
    } else if (viewMode === 'resolved') {
      result = result.filter(d => resolutions[d.rowIndex] && resolutions[d.rowIndex].resolution !== 'pending');
    }

    return result;
  }, [duplicates, resolutions, viewMode]);

  // Statistics
  const stats = {
    total: duplicates.length,
    pending: duplicates.filter(d => !resolutions[d.rowIndex] || resolutions[d.rowIndex].resolution === 'pending').length,
    resolved: duplicates.filter(d => resolutions[d.rowIndex] && resolutions[d.rowIndex].resolution !== 'pending').length
  };

  // Handle resolution selection
  const handleResolution = (rowIndex, resolution) => {
    const updated = {
      ...resolutions,
      [rowIndex]: {
        ...(resolutions[rowIndex] || {}),
        resolution,
        timestamp: new Date().toISOString()
      }
    };
    setResolutions(updated);
    onResolutionChange?.(rowIndex, resolution, duplicates.find(d => d.rowIndex === rowIndex));
  };

  // Handle resolve all with strategy
  const handleResolveAll = async () => {
    const newResolutions = {};
    duplicates.forEach(dup => {
      newResolutions[dup.rowIndex] = {
        resolution: deduplicationStrategy,
        timestamp: new Date().toISOString()
      };
    });
    setResolutions(newResolutions);
    onResolveAll?.(newResolutions, deduplicationStrategy);
  };

  // Get comparison data
  const getDuplicateDetails = (duplicate) => {
    return {
      new: duplicate.newData,
      existing: duplicate.existingData,
      matched: duplicate.matchedFields || [],
      confidence: duplicate.confidence || 0
    };
  };

  // Render field comparison
  const renderFieldComparison = (duplicate) => {
    const details = getDuplicateDetails(duplicate);
    const allKeys = new Set([
      ...Object.keys(details.new || {}),
      ...Object.keys(details.existing || {})
    ]);

    return (
      <div className="field-comparison">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Field</th>
              <th className="matched">Matched</th>
              <th>Existing Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(allKeys).sort().map(field => {
              const isMatched = details.matched.includes(field);
              const existingValue = details.existing[field];
              const newValue = details.new[field];

              return (
                <tr key={field} className={isMatched ? 'matched-field' : ''}>
                  <td className="field-name">
                    <strong>{field}</strong>
                  </td>
                  <td className="matched-badge">
                    {isMatched ? (
                      <span className="badge-matched">✓ Match</span>
                    ) : (
                      <span className="badge-different">─ Different</span>
                    )}
                  </td>
                  <td className="field-value existing">
                    <code>{existingValue ? String(existingValue).substring(0, 40) : '-'}</code>
                  </td>
                  <td className="field-value new">
                    <code>{newValue ? String(newValue).substring(0, 40) : '-'}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (duplicates.length === 0) {
    return (
      <div className="duplicate-resolution-panel">
        <div className="panel-header">
          <h3>Duplicate Detection</h3>
          <p>No duplicates found. All data appears to be unique!</p>
        </div>
        <div className="empty-state">
          <span className="icon">✓</span>
          <p>Great! No duplicate records detected.</p>
        </div>
      </div>
    );
  }

  const currentDuplicate = selectedDuplicate !== null 
    ? duplicates[selectedDuplicate] 
    : duplicates[0];
  const currentRowIndex = currentDuplicate?.rowIndex;
  const currentResolution = resolutions[currentRowIndex]?.resolution || 'pending';

  return (
    <div className="duplicate-resolution-panel">
      <div className="panel-header">
        <h3>Review Duplicates ({stats.total})</h3>
        <p>Resolve duplicate records. Choose to keep existing, overwrite, or merge data.</p>
      </div>

      {/* View Mode Tabs */}
      <div className="view-tabs">
        <button
          className={`tab ${viewMode === 'pending' ? 'active' : ''}`}
          onClick={() => setViewMode('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button
          className={`tab ${viewMode === 'resolved' ? 'active' : ''}`}
          onClick={() => setViewMode('resolved')}
        >
          Resolved ({stats.resolved})
        </button>
        <button
          className={`tab ${viewMode === 'all' ? 'active' : ''}`}
          onClick={() => setViewMode('all')}
        >
          All ({stats.total})
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span>Resolution Progress</span>
          <span className="progress-text">{stats.resolved} of {stats.total} resolved</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
          />
        </div>
      </div>

      <div className="panel-content">
        {/* Duplicates List */}
        <div className="duplicates-list">
          <h4>Duplicates</h4>
          <div className="list-items">
            {filteredDuplicates.map((dup, idx) => {
              const isSelected = selectedDuplicate === idx;
              const resolution = resolutions[dup.rowIndex]?.resolution || 'pending';

              return (
                <div
                  key={`${dup.rowIndex}`}
                  className={`list-item ${isSelected ? 'selected' : ''} ${resolution}`}
                  onClick={() => setSelectedDuplicate(idx)}
                >
                  <div className="item-header">
                    <span className="item-number">Row {dup.rowIndex + 1}</span>
                    <span className={`resolution-badge ${resolution}`}>
                      {resolution === 'pending' && '⏳ Pending'}
                      {resolution === 'keep' && '✓ Keep'}
                      {resolution === 'overwrite' && '↻ Overwrite'}
                      {resolution === 'version' && '⑂ Version'}
                      {resolution === 'manual' && '✋ Manual'}
                    </span>
                  </div>
                  <div className="item-details">
                    <small>
                      Confidence: <strong>{Math.round((dup.confidence || 0) * 100)}%</strong>
                    </small>
                    <small>
                      Matched Fields: <strong>{(dup.matchedFields || []).length}</strong>
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail View */}
        {currentDuplicate && (
          <div className="detail-view">
            <div className="detail-header">
              <h4>Row {currentRowIndex + 1} - Duplicate Review</h4>
              <div className="confidence-indicator">
                <span className="label">Confidence Score:</span>
                <span className="value">{Math.round((currentDuplicate.confidence || 0) * 100)}%</span>
              </div>
            </div>

            {renderFieldComparison(currentDuplicate)}

            {/* Resolution Options */}
            <div className="resolution-options">
              <h5>Choose Action</h5>
              
              <label className="option">
                <input
                  type="radio"
                  name={`resolution-${currentRowIndex}`}
                  value="keep"
                  checked={currentResolution === 'keep'}
                  onChange={() => handleResolution(currentRowIndex, 'keep')}
                />
                <div className="option-content">
                  <span className="option-title">Keep Existing</span>
                  <span className="option-desc">Keep the existing record and skip the new one</span>
                </div>
              </label>

              <label className="option">
                <input
                  type="radio"
                  name={`resolution-${currentRowIndex}`}
                  value="overwrite"
                  checked={currentResolution === 'overwrite'}
                  onChange={() => handleResolution(currentRowIndex, 'overwrite')}
                />
                <div className="option-content">
                  <span className="option-title">Overwrite Existing</span>
                  <span className="option-desc">Replace existing record with new data</span>
                </div>
              </label>

              <label className="option">
                <input
                  type="radio"
                  name={`resolution-${currentRowIndex}`}
                  value="version"
                  checked={currentResolution === 'version'}
                  onChange={() => handleResolution(currentRowIndex, 'version')}
                />
                <div className="option-content">
                  <span className="option-title">Keep Both Versions</span>
                  <span className="option-desc">Create a new version record with updated data</span>
                </div>
              </label>

              <label className="option">
                <input
                  type="radio"
                  name={`resolution-${currentRowIndex}`}
                  value="manual"
                  checked={currentResolution === 'manual'}
                  onChange={() => handleResolution(currentRowIndex, 'manual')}
                />
                <div className="option-content">
                  <span className="option-title">Manual Review</span>
                  <span className="option-desc">Flag for manual review - requires admin intervention</span>
                </div>
              </label>
            </div>

            {/* Quick Navigation */}
            <div className="navigation-controls">
              <button
                className="btn btn-secondary"
                disabled={selectedDuplicate === 0}
                onClick={() => setSelectedDuplicate(Math.max(0, selectedDuplicate - 1))}
              >
                ← Previous
              </button>
              <span className="nav-text">
                {filteredDuplicates.findIndex(d => d.rowIndex === currentRowIndex) + 1} of {filteredDuplicates.length}
              </span>
              <button
                className="btn btn-secondary"
                disabled={selectedDuplicate === filteredDuplicates.length - 1}
                onClick={() => setSelectedDuplicate(Math.min(filteredDuplicates.length - 1, selectedDuplicate + 1))}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="panel-footer">
        <button
          className="btn btn-outline"
          onClick={handleResolveAll}
        >
          Apply "{deduplicationStrategy}" to All ({stats.pending} Pending)
        </button>
      </div>
    </div>
  );
};

export default DuplicateResolutionPanel;
