import React, { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Upload,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Copy,
} from 'lucide-react';
import { verifyDocument } from '../store/slices/kycAmlSlice';
import './DocumentVerificationProcessor.css';

const DOCUMENT_TYPES = {
  emirates_id: { label: 'Emirates ID', accept: 'image/*' },
  passport: { label: 'Passport', accept: 'image/*' },
  visa: { label: 'UAE Visa', accept: 'image/*' },
};

const DocumentVerificationProcessor = ({
  documentType,
  onSuccess,
  onError,
  required: _required = true,
  userId,
  token,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Local state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showRawData, setShowRawData] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Handle file selection from input
   */
  const handleFileSelect = useCallback(event => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = e => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  /**
   * Handle drag and drop
   */
  const handleDragOver = e => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-active');
  };

  const handleDragLeave = e => {
    e.currentTarget.classList.remove('drag-active');
  };

  const handleDrop = e => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-active');

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileSelect({ target: { files: [droppedFile] } });
    }
  };

  /**
   * Upload and process document
   */
  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('userId', userId);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Call Redux thunk
      const response = await dispatch(verifyDocument({ formData, token })).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Process successful response
      setResult({
        success: true,
        documentType,
        rawText: response.rawText,
        confidence: response.confidence,
        parsedData: response.parsedData,
        validation: response.validation,
        verification: response.verification,
        timestamp: new Date(response.timestamp),
      });

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to process document. Please try again.');
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [file, documentType, userId, token, dispatch, onSuccess, onError]);

  /**
   * Reset form
   */
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setShowRawData(false);
    setUploadProgress(0);
    setStatusMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Copy text to clipboard
   */
  const handleCopyText = async text => {
    try {
      await navigator.clipboard.writeText(text);
      setStatusMessage({ type: 'success', text: 'Copied to clipboard!' });
    } catch (err) {
      console.error('Failed to copy:', err);
      setStatusMessage({ type: 'error', text: 'Failed to copy text.' });
    }
  };

  /**
   * Download result as JSON
   */
  const handleDownloadResult = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentType}-verification-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="document-verification-processor">
      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button className="close-btn" onClick={() => setError(null)} aria-label="Close error">
            <X size={18} />
          </button>
        </div>
      )}

      {statusMessage && (
        <div
          role={statusMessage.type === 'error' ? 'alert' : 'status'}
          data-testid="document-verification-status-banner"
          className={statusMessage.type === 'error' ? 'error-banner' : 'success-banner'}
          style={
            statusMessage.type === 'error'
              ? undefined
              : {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ECFDF3',
                  color: '#027A48',
                  border: '1px solid #12B76A',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                }
          }
        >
          <span>{statusMessage.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{statusMessage.text}</span>
          <button
            className="close-btn"
            onClick={() => setStatusMessage(null)}
            aria-label="Close status"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="verification-container">
        {/* Step 1: Upload */}
        {!result && (
          <div className="verification-step">
            <div className="step-header">
              <Upload size={32} className={loading ? 'icon spinning' : 'icon'} />
              <div>
                {/* eslint-disable-next-line security/detect-object-injection */}
                <h3>Upload {DOCUMENT_TYPES[documentType]?.label || 'Document'}</h3>
                <p className="step-description">
                  Ensure document is clear and all details are visible
                </p>
              </div>
            </div>

            {/* File Input Area */}
            <div
              className="upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                // eslint-disable-next-line security/detect-object-injection
                accept={DOCUMENT_TYPES[documentType]?.accept || 'image/*'}
                onChange={handleFileSelect}
                disabled={loading}
                aria-label="Upload document"
                className="file-input"
              />

              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Document preview" className="preview-image" />
                  <div className="preview-info">
                    <p className="file-name">{file?.name}</p>
                    <p className="file-size">{(file?.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={48} />
                  <p className="upload-text">
                    Drag and drop your document here, or click to select
                  </p>
                  <p className="upload-hint">Supported formats: JPG, PNG, GIF (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {loading && uploadProgress > 0 && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="button-group">
              {file && !loading && (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    aria-label="Clear selection"
                  >
                    <X size={18} />
                    Clear
                  </button>
                  <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileCheck size={18} />
                        Verify Document
                      </>
                    )}
                  </button>
                </>
              )}
              {!file && (
                <button
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload size={18} />
                  Select Document
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Results */}
        {result && (
          <div className="verification-step">
            <div className="step-header">
              <CheckCircle
                size={32}
                className={`icon ${result.validation?.isValid ? 'success' : 'warning'}`}
              />
              <div>
                <h3>
                  {result.validation?.isValid ? 'Verification Complete' : 'Verification Issues'}
                </h3>
                <p className="step-description">
                  Processed with {Math.round(result.confidence)}% confidence
                </p>
              </div>
            </div>

            {/* Validation Status */}
            {result.validation && (
              <div
                className={`validation-box ${result.validation.isValid ? 'success' : 'warning'}`}
              >
                <h4>Validation Status</h4>
                {result.validation.errors.length > 0 && (
                  <div className="errors">
                    <p className="error-label">Errors:</p>
                    <ul>
                      {result.validation.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.validation.warnings.length > 0 && (
                  <div className="warnings">
                    <p className="warning-label">Warnings:</p>
                    <ul>
                      {result.validation.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Data */}
            {result.parsedData?.extractedFields && (
              <div className="extracted-data-box">
                <div className="box-header">
                  <h4>Extracted Information</h4>
                  <button
                    className="toggle-btn"
                    onClick={() => setShowRawData(!showRawData)}
                    title={showRawData ? 'Hide raw text' : 'Show raw text'}
                  >
                    {showRawData ? (
                      <>
                        <EyeOff size={16} />
                        Hide Raw
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Show Raw
                      </>
                    )}
                  </button>
                </div>

                {showRawData && result.rawText && (
                  <div className="raw-text-section">
                    <div className="raw-text-header">
                      <p>Raw OCR Text:</p>
                      <button
                        className="copy-btn"
                        onClick={() => handleCopyText(result.rawText)}
                        title="Copy raw text"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <pre className="raw-text">{result.rawText}</pre>
                  </div>
                )}

                <div className="fields-grid">
                  {Object.entries(result.parsedData.extractedFields).map(
                    ([key, value]) =>
                      value && (
                        <div key={key} className="field-item">
                          <label>{this.formatFieldLabel(key)}</label>
                          <p>{String(value)}</p>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {/* Document Status */}
            {result.verification && (
              <div className="document-status-box">
                <h4>Document Status</h4>
                <div className="status-info">
                  <p>
                    Status:{' '}
                    <span className={result.verification.isExpired ? 'expired' : 'valid'}>
                      {result.verification.isExpired ? 'Expired' : 'Valid'}
                    </span>
                  </p>
                  {result.verification.daysUntilExpiry !== null && (
                    <p>
                      Days Until Expiry: <strong>{result.verification.daysUntilExpiry}</strong>
                    </p>
                  )}
                  {result.verification.messages.length > 0 && (
                    <div className="status-messages">
                      {result.verification.messages.map((msg, idx) => (
                        <p key={idx} className="status-message">
                          • {msg}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="button-group">
              <button className="btn btn-secondary" onClick={handleReset}>
                <RefreshCw size={18} />
                Upload Another
              </button>
              <button className="btn btn-secondary" onClick={handleDownloadResult}>
                <Download size={18} />
                Download Result
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper method for formatting field labels
DocumentVerificationProcessor.prototype.formatFieldLabel = function (fieldName) {
  return fieldName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default DocumentVerificationProcessor;
