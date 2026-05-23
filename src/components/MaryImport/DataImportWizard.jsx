import React, { useState, useCallback } from 'react';
import { authFetch } from '../../utils/authFetch';
import './DataImportWizard.css';
import ColumnMappingEditor from './ColumnMappingEditor';
import PreviewGridWithFilters from './PreviewGridWithFilters';

/**
 * DataImportWizard Component
 * Multi-step wizard for intelligent data import
 * Steps: Upload → Preview → Mapping → Validation → Deduplication → Status → Review → Execute
 */
const DataImportWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [uploadTime, setUploadTime] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [preview, setPreview] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [columnMapping, setColumnMapping] = useState({});
  const [validationResult, setValidationResult] = useState(null);
  const [importStrategy, setImportStrategy] = useState('balanced');
  const [deduplicationStrategy] = useState('keep');
  const [duplicates, setDuplicates] = useState([]);
  const [statusMapping] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importProgress] = useState(0);

  const steps = [
    { number: 1, label: 'Upload', icon: '📤' },
    { number: 2, label: 'Preview', icon: '👀' },
    { number: 3, label: 'Mapping', icon: '🔗' },
    { number: 4, label: 'Validation', icon: '✅' },
    { number: 5, label: 'Duplicates', icon: '⚠️' },
    { number: 6, label: 'Status', icon: '📊' },
    { number: 7, label: 'Review', icon: '📋' },
    { number: 8, label: 'Execute', icon: '▶️' },
  ];

  // Step 1: File Upload Handler
  const handleFileUpload = useCallback(async file => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    setFileSize(file.size);
    setUploadTime(new Date());

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await authFetch('/api/inventory/import/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSessionId(data.data.sessionId);
      setSheetNames(data.data.sheetNames);
      setSelectedSheet(data.data.sheetNames[0]);
      setPreview(data.data.preview);
      setColumns(data.data.columns || Object.keys(data.data.preview[0] || {}));
      setTotalRows(data.data.totalRows);
      setColumnMapping(data.data.columnMapping || {});

      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Drag and drop handler
  const handleDragOver = e => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = e => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = e => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  // Step 1: Upload UI
  const renderUploadStep = () => (
    <div className="wizard-step">
      <h2>📤 Upload Your Excel File</h2>
      <p className="step-description">Select an Excel, CSV file for import</p>

      <div
        className="upload-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="upload-icon">📁</div>
        <p>Drag and drop your file here or click to browse</p>
        <p className="file-types">Supported: .xlsx, .xls, .csv</p>
      </div>

      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls,.csv"
        hidden
        onChange={e => handleFileUpload(e.target.files[0])}
      />
    </div>
  );

  // Step 2: Preview UI
  const renderPreviewStep = () => (
    <div className="wizard-step">
      <h2>👀 Preview Your Data</h2>

      <div className="info-section">
        <div className="file-info">
          <p>
            <strong>File:</strong> {fileName} ({(fileSize / 1024 / 1024).toFixed(2)} MB)
          </p>
          <p>
            <strong>Total Rows:</strong> {totalRows}
          </p>
          <p>
            <strong>Uploaded:</strong> {uploadTime?.toLocaleString()}
          </p>
        </div>

        {sheetNames.length > 1 && (
          <div className="sheet-selection">
            <label>Select Sheet:</label>
            <select value={selectedSheet} onChange={e => setSelectedSheet(e.target.value)}>
              {sheetNames.map(sheet => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="preview-table-container">
        <table className="preview-table">
          <thead>
            <tr>
              <th>#</th>
              {Object.keys(preview[0] || {})
                .slice(0, 8)
                .map(header => (
                  <th key={header}>{header}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {preview.slice(0, 10).map((row, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                {Object.values(row)
                  .slice(0, 8)
                  .map((val, i) => (
                    <td key={i}>{String(val).substring(0, 30)}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="preview-note">Showing first 10 rows of {totalRows} total rows</p>
    </div>
  );

  // Step 3: Mapping UI
  const renderMappingStep = () => (
    <div className="wizard-step">
      <ColumnMappingEditor
        columns={columns}
        existingMapping={columnMapping}
        onMappingChange={setColumnMapping}
        onAutoDetect={async (cols, data) => {
          try {
            const response = await authFetch('/api/inventory/import/detect-mapping', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ columns: cols, sampleData: data }),
            });
            const result = await response.json();
            return result.data.mapping;
          } catch (err) {
            console.error('Auto-detect failed:', err);
            return columnMapping;
          }
        }}
      />
    </div>
  );

  // Step 4: Validation UI
  const renderValidationStep = () => (
    <div className="wizard-step">
      <div className="validation-header">
        <h2>✅ Validate Data Quality</h2>
        <p className="step-description">Review validation results and fix errors</p>

        <div className="strategy-selector">
          <label>Import Strategy:</label>
          <select value={importStrategy} onChange={e => setImportStrategy(e.target.value)}>
            <option value="strict">Strict (Reject on any error)</option>
            <option value="balanced">Balanced (Default - Smart judgment)</option>
            <option value="lenient">Lenient (Import valid data, flag warnings)</option>
          </select>
          <p className="hint">
            {importStrategy === 'strict' && 'Strict mode requires all data to be perfectly valid.'}
            {importStrategy === 'balanced' &&
              'Balanced mode uses intelligent judgment to handle minor issues.'}
            {importStrategy === 'lenient' &&
              'Lenient mode imports valid data and flags warnings for review.'}
          </p>
        </div>
      </div>

      {validationResult && (
        <PreviewGridWithFilters
          data={preview}
          columns={columns}
          mapping={columnMapping}
          validationResult={validationResult}
          onApplyChanges={() => setCurrentStep(5)}
        />
      )}

      {!validationResult && (
        <div className="validation-placeholder">
          <button
            className="btn btn-primary"
            onClick={async () => {
              setIsLoading(true);
              try {
                const response = await authFetch('/api/inventory/import/validate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sessionId,
                    strategy: importStrategy,
                    mapping: columnMapping,
                  }),
                });
                const result = await response.json();
                setValidationResult(result.data.validationResult);
                setDuplicates(result.data.duplicates || []);
              } catch (err) {
                setError(err.message);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Validating...' : 'Run Validation'}
          </button>
        </div>
      )}
    </div>
  );

  // Step 5: Review UI
  const renderReviewStep = () => (
    <div className="wizard-step">
      <h2>📋 Review Import Settings</h2>

      <div className="review-grid">
        <div className="review-card">
          <h3>File Information</h3>
          <ul>
            <li>
              <strong>File:</strong> {fileName}
            </li>
            <li>
              <strong>Size:</strong> {(fileSize / 1024 / 1024).toFixed(2)} MB
            </li>
            <li>
              <strong>Total Rows:</strong> {totalRows}
            </li>
            <li>
              <strong>Columns:</strong> {columns.length}
            </li>
          </ul>
        </div>

        <div className="review-card">
          <h3>Import Settings</h3>
          <ul>
            <li>
              <strong>Import Strategy:</strong> {importStrategy}
            </li>
            <li>
              <strong>Deduplication:</strong> {deduplicationStrategy}
            </li>
            <li>
              <strong>Validation:</strong>{' '}
              {validationResult?.isValid ? '✓ Passed' : '⚠ Review needed'}
            </li>
            <li>
              <strong>Duplicates:</strong> {duplicates.length} found
            </li>
          </ul>
        </div>

        <div className="review-card">
          <h3>Data Mapping</h3>
          <ul>
            <li>
              <strong>Mapped Columns:</strong> {Object.values(columnMapping).filter(v => v).length}{' '}
              of {columns.length}
            </li>
            <li>
              <strong>Property Fields:</strong> Configured
            </li>
            <li>
              <strong>Owner Fields:</strong> Configured
            </li>
            <li>
              <strong>Status Mapping:</strong>{' '}
              {Object.keys(statusMapping).length > 0 ? '✓ Done' : '⚠ Pending'}
            </li>
          </ul>
        </div>
      </div>

      <div className="info-box">
        <h4>📊 Estimated Import Results</h4>
        <p>Your data will be processed as follows:</p>
        <ul>
          <li>Properties will be created/updated based on mapping</li>
          <li>Owner information will be separated and linked</li>
          <li>Duplicates will be handled per your deduplication strategy</li>
          <li>Status values will be mapped to multi-dimensional fields</li>
        </ul>
      </div>
    </div>
  );

  // Step 6: Execute UI
  const renderExecuteStep = () => (
    <div className="wizard-step">
      <h2>▶️ Execute Import</h2>

      {importProgress > 0 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${importProgress}%` }}></div>
          </div>
          <p className="progress-text">{importProgress}% Complete</p>
        </div>
      )}

      <button
        className="btn btn-success"
        onClick={() => setCurrentStep(1)}
        disabled={isLoading || importProgress > 0}
      >
        {importProgress > 0 ? 'Importing...' : 'Start Import'}
      </button>
    </div>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderUploadStep();
      case 2:
        return renderPreviewStep();
      case 3:
        return renderMappingStep();
      case 4:
        return renderValidationStep();
      case 5:
        return renderReviewStep();
      case 6:
        return renderExecuteStep();
      default:
        return renderUploadStep();
    }
  };

  return (
    <div className="data-import-wizard">
      {/* Progress Indicator */}
      <div className="wizard-progress">
        {steps.map(step => (
          <div
            key={step.number}
            className={`progress-step ${
              currentStep === step.number ? 'active' : ''
            } ${currentStep > step.number ? 'completed' : ''}`}
            onClick={() => currentStep > step.number && setCurrentStep(step.number)}
          >
            <span className="step-icon">{step.icon}</span>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Step Content */}
      <div className="wizard-content">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="wizard-navigation">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || isLoading}
        >
          ← Back
        </button>

        <button
          className="btn btn-primary"
          onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
          disabled={currentStep === 6 || isLoading}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default DataImportWizard;
