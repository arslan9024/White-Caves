import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, FileImage, Loader2, CheckCircle, Edit3, 
  Download, Trash2, Copy, Eye, X, AlertCircle
} from 'lucide-react';
import * as S from './ImageDataExtractor.styles';

const ImageDataExtractor = ({ onDataExtracted }: { onDataExtracted?: (data: any[]) => void }) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingCell, setEditingCell] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patterns = {
    phone: /(?:\+971|00971|971)?[\s-]?(?:50|52|54|55|56|58)[\s-]?\d{3}[\s-]?\d{4}/g,
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    unitNumber: /(?:Villa|Apt|Unit|Apartment|Plot|Shop)\s*(?:#|No\.?|Number)?\s*\d+[A-Za-z]?/gi,
    sdNumber: /SD\d{3,5}/gi,
    name: /(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}/g
  };

  const parseTextData = (text: string) => {
    const results = {
      phones: [...new Set(text.match(patterns.phone) || [])],
      emails: [...new Set(text.match(patterns.email) || [])],
      unitNumbers: [...new Set(text.match(patterns.unitNumber) || [])],
      sdNumbers: [...new Set(text.match(patterns.sdNumber) || [])],
      names: [...new Set(text.match(patterns.name) || [])]
    };
    return results;
  };

  const processImage = async (file: File) => {
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

  const handleFiles = useCallback(async (files: FileList) => {
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
    
    const processedData: Record<string, any>[] = [];
    for (const upload of newUploads) {
      const result: any = await processImage(upload.file);
      processedData.push(result);
      setUploadedFiles(prev => 
        prev.map(u => u.id === upload.id ? { ...u, status: 'complete' } : u)
      );
    }
    
    setExtractedData(prev => [...prev, ...(processedData as any[])]);
    setProcessing(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleEdit = (dataId: number, field: string, index: number, newValue: string) => {
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

  const removeData = (dataId: number) => {
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

  const copyToClipboard = (data: any) => {
    const text = Object.entries(data.parsed)
      .map(([key, values]: [string, any]) => `${key}: ${values.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <S.ImageExtractorContainer>
      <S.ExtractorHeader>
        <S.HeaderInfo>
          <FileImage size={24} />
          <div>
            <S.HeaderTitle>Image Data Extractor</S.HeaderTitle>
            <S.HeaderSubtext>
              Upload images to extract owner info, phone numbers, and unit details
            </S.HeaderSubtext>
          </div>
        </S.HeaderInfo>
        {extractedData.length > 0 && (
          <S.HeaderActions>
            <S.ActionBtn onClick={exportToCSV}>
              <Download size={16} /> Export CSV
            </S.ActionBtn>
            <S.ActionBtn 
              $danger 
              onClick={() => { setExtractedData([]); setUploadedFiles([]); }}
            >
              <Trash2 size={16} /> Clear All
            </S.ActionBtn>
          </S.HeaderActions>
        )}
      </S.ExtractorHeader>

      <S.DropZone 
        $active={dragOver}
        $processing={processing}
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
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        
        {processing ? (
          <S.ProcessingState>
            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Processing images...</span>
          </S.ProcessingState>
        ) : (
          <>
            <Upload size={40} />
            <h4>Drop images here or click to upload</h4>
            <p>Supports JPG, PNG, PDF</p>
          </>
        )}
      </S.DropZone>

      {uploadedFiles.length > 0 && (
        <S.UploadedFiles>
          {uploadedFiles.map((file: any) => (
            <S.FileChip key={file.id}>
              {file.status === 'processing' ? (
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <CheckCircle size={14} />
              )}
              <span>{file.name}</span>
            </S.FileChip>
          ))}
        </S.UploadedFiles>
      )}

      {extractedData.length > 0 && (
        <S.ExtractedResults>
          <h4>Extracted Data ({extractedData.length} sources)</h4>
          
          {extractedData.map((data: any) => (
            <S.ResultCard key={data.id}>
              <S.ResultHeader>
                <S.ResultSource>
                  <S.PreviewBtn 
                    onClick={() => setPreviewImage(data.imageUrl)}
                  >
                    <Eye size={14} />
                  </S.PreviewBtn>
                  <span>{data.fileName}</span>
                </S.ResultSource>
                <S.ResultActions>
                  <button onClick={() => copyToClipboard(data)} title="Copy">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => removeData(data.id)} title="Remove">
                    <X size={14} />
                  </button>
                </S.ResultActions>
              </S.ResultHeader>
              
              <S.ResultData>
                {Object.entries(data.parsed).map(([field, values]: [string, any]) => (
                  values.length > 0 && (
                    <S.DataField key={field}>
                      <label>{field}</label>
                      <S.FieldValues>
                        {values.map((value: string, idx: number) => (
                          <S.ValueChip key={idx}>
                            {editingCell?.id === data.id && editingCell?.field === field && editingCell?.idx === idx ? (
                              <input
                                autoFocus
                                defaultValue={value}
                                onBlur={(e) => handleEdit(data.id, field, idx, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEdit(data.id, field, idx, (e.target as any).value);
                                  }
                                }}
                              />
                            ) : (
                              <>
                                <span>{value}</span>
                                <S.EditBtn 
                                  onClick={() => setEditingCell({ id: data.id, field, idx })}
                                >
                                  <Edit3 size={10} />
                                </S.EditBtn>
                              </>
                            )}
                          </S.ValueChip>
                        ))}
                      </S.FieldValues>
                    </S.DataField>
                  )
                ))}
              </S.ResultData>
            </S.ResultCard>
          ))}
        </S.ExtractedResults>
      )}

      {extractedData.length > 0 && (
        <S.ImportSection>
          <AlertCircle size={16} />
          <span>Review the extracted data above, then import to inventory</span>
          <S.ImportBtn 
            onClick={() => onDataExtracted?.(extractedData)}
          >
            Import to CRM
          </S.ImportBtn>
        </S.ImportSection>
      )}

      {previewImage && (
        <S.ImagePreviewModal onClick={() => setPreviewImage(null)}>
          <S.PreviewContent onClick={e => e.stopPropagation()}>
            <S.ClosePreviewBtn onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </S.ClosePreviewBtn>
            <img src={previewImage} alt="Preview" />
          </S.PreviewContent>
        </S.ImagePreviewModal>
      )}
    </S.ImageExtractorContainer>
  );
};

export default ImageDataExtractor;
