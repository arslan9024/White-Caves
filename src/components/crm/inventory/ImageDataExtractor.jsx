import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, FileImage, Loader2, CheckCircle, Edit3, 
  Download, Trash2, Copy, Eye, X, AlertCircle
} from 'lucide-react';
import './ImageDataExtractor.css';

const ImageDataExtractor = ({ onDataExtracted }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const patterns = {
    phone: /(?:\+971|00971|971)?[\s-]?(?:50|52|54|55|56|58)[\s-]?\d{3}[\s-]?\d{4}/g,
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    unitNumber: /(?:Villa|Apt|Unit|Apartment|Plot|Shop)\s*(?:#|No\.?|Number)?\s*\d+[A-Za-z]?/gi,
    sdNumber: /SD\d{3,5}/gi,
    name: /(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}/g
  };

  const parseTextData = (text) => {
    const results = {
      phones: [...new Set(text.match(patterns.phone) || [])],
      emails: [...new Set(text.match(patterns.email) || [])],
      unitNumbers: [...new Set(text.match(patterns.unitNumber) || [])],
      sdNumbers: [...new Set(text.match(patterns.sdNumber) || [])],
      names: [...new Set(text.match(patterns.name) || [])]
    };
    return results;
  };

  const processImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          const mockData = {
            id: Date.now(),
            fileName: file.name,
            imageUrl: reader.result,
            rawText: `Sample extracted text from ${file.name}\nMr. Ali Hassan\n+971 50 123 4567\nali.hassan@email.com\nVilla #45\nSD348`,
            parsed: parseTextData(`Mr. Ali Hassan +971 50 123 4567 ali.hassan@email.com Villa #45 SD348`)
          };
          resolve(mockData);
        }, 1500);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files) => {
    const validFiles = Array.from(files).filter(f => 
      f.type.startsWith('image/') || f.type === 'application/pdf'
    );
    
    if (validFiles.length === 0) return;
    
    setProcessing(true);
    const newUploads = validFiles.map(f => ({
      id: Date.now() + Math.random(),
      file: f,
      name: f.name,
      status: 'processing'
    }));
    
    setUploadedFiles(prev => [...prev, ...newUploads]);
    
    const processedData = [];
    for (const upload of newUploads) {
      const result = await processImage(upload.file);
      processedData.push(result);
      setUploadedFiles(prev => 
        prev.map(u => u.id === upload.id ? { ...u, status: 'complete' } : u)
      );
    }
    
    setExtractedData(prev => [...prev, ...processedData]);
    setProcessing(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleEdit = (dataId, field, index, newValue) => {
    setExtractedData(prev => prev.map(item => {
      if (item.id === dataId) {
        const updated = { ...item };
        updated.parsed[field][index] = newValue;
        return updated;
      }
      return item;
    }));
    setEditingCell(null);
  };

  const removeData = (dataId) => {
    setExtractedData(prev => prev.filter(d => d.id !== dataId));
    setUploadedFiles(prev => prev.filter(u => u.id !== dataId));
  };

  const exportToCSV = () => {
    const rows = [];
    rows.push(['Source', 'Names', 'Phones', 'Emails', 'Units', 'SD Numbers']);
    
    extractedData.forEach(data => {
      rows.push([
        data.fileName,
        data.parsed.names.join('; '),
        data.parsed.phones.join('; '),
        data.parsed.emails.join('; '),
        data.parsed.unitNumbers.join('; '),
        data.parsed.sdNumbers.join('; ')
      ]);
    });
    
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (data) => {
    const text = Object.entries(data.parsed)
      .map(([key, values]) => `${key}: ${values.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="image-extractor">
      <div className="extractor-header">
        <div className="header-info">
          <FileImage size={24} />
          <div>
            <h3>Image Data Extractor</h3>
            <span>Upload images to extract owner info, phone numbers, and unit details</span>
          </div>
        </div>
        {extractedData.length > 0 && (
          <div className="header-actions">
            <button className="action-btn" onClick={exportToCSV}>
              <Download size={16} /> Export CSV
            </button>
            <button className="action-btn danger" onClick={() => { setExtractedData([]); setUploadedFiles([]); }}>
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        )}
      </div>

      <div 
        className={`drop-zone ${dragOver ? 'active' : ''} ${processing ? 'processing' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        
        {processing ? (
          <div className="processing-state">
            <Loader2 size={40} className="spinning" />
            <span>Processing images...</span>
          </div>
        ) : (
          <>
            <Upload size={40} />
            <h4>Drop images here or click to upload</h4>
            <p>Supports JPG, PNG, PDF</p>
          </>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          {uploadedFiles.map(file => (
            <div key={file.id} className="file-chip">
              {file.status === 'processing' ? (
                <Loader2 size={14} className="spinning" />
              ) : (
                <CheckCircle size={14} />
              )}
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}

      {extractedData.length > 0 && (
        <div className="extracted-results">
          <h4>Extracted Data ({extractedData.length} sources)</h4>
          
          {extractedData.map(data => (
            <div key={data.id} className="result-card">
              <div className="result-header">
                <div className="result-source">
                  <button 
                    className="preview-btn"
                    onClick={() => setPreviewImage(data.imageUrl)}
                  >
                    <Eye size={14} />
                  </button>
                  <span>{data.fileName}</span>
                </div>
                <div className="result-actions">
                  <button onClick={() => copyToClipboard(data)} title="Copy">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => removeData(data.id)} title="Remove">
                    <X size={14} />
                  </button>
                </div>
              </div>
              
              <div className="result-data">
                {Object.entries(data.parsed).map(([field, values]) => (
                  values.length > 0 && (
                    <div key={field} className="data-field">
                      <label>{field}</label>
                      <div className="field-values">
                        {values.map((value, idx) => (
                          <div key={idx} className="value-chip">
                            {editingCell?.id === data.id && editingCell?.field === field && editingCell?.idx === idx ? (
                              <input
                                autoFocus
                                defaultValue={value}
                                onBlur={(e) => handleEdit(data.id, field, idx, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEdit(data.id, field, idx, e.target.value);
                                  }
                                }}
                              />
                            ) : (
                              <>
                                <span>{value}</span>
                                <button 
                                  className="edit-btn"
                                  onClick={() => setEditingCell({ id: data.id, field, idx })}
                                >
                                  <Edit3 size={10} />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {extractedData.length > 0 && (
        <div className="import-section">
          <AlertCircle size={16} />
          <span>Review the extracted data above, then import to inventory</span>
          <button 
            className="import-btn"
            onClick={() => onDataExtracted?.(extractedData)}
          >
            Import to CRM
          </button>
        </div>
      )}

      {previewImage && (
        <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
          <div className="preview-content" onClick={e => e.stopPropagation()}>
            <button className="close-preview" onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </button>
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDataExtractor;
