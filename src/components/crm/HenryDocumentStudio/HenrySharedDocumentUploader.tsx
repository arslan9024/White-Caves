/**
 * HenrySharedDocumentUploader.tsx
 *
 * Reusable, High-Fidelity Document Upload & OCR Ingestion Component
 * for White Caves Henry AI Document Studio.
 */

import React, { FC, useRef, useState, DragEvent } from 'react';
import styled from 'styled-components';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Sparkles, Trash2, Save, Eye } from 'lucide-react';

export type SupportedDocType = 'auto' | 'emirates_id' | 'passport' | 'title_deed' | 'contract';

export interface HenrySharedDocumentUploaderProps {
  docType?: SupportedDocType;
  title: string;
  subtitle?: string;
  acceptedFormats?: string;
  isProcessing?: boolean;
  onFileUpload: (file: File) => Promise<void> | void;
  onSampleLoad?: () => void;
  onSave?: () => void;
  onDiscard?: () => void;
  extractedSummary?: {
    title: string;
    fields: { label: string; value: string | number | undefined; isHighlight?: boolean }[];
  } | null;
  accentColor?: string;
}

const UploaderContainer = styled.div<{ $accentColor: string }>`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;

  .title-group {
    h4 {
      margin: 0 0 2px 0;
      font-size: 0.95rem;
      font-weight: 800;
      color: #0F172A;
    }
    p {
      margin: 0;
      font-size: 0.78rem;
      color: #64748B;
    }
  }
`;

const DropzoneBox = styled.div<{ $isDragOver: boolean; $accentColor: string }>`
  border: 2px dashed ${props => (props.$isDragOver ? props.$accentColor : '#CBD5E1')};
  background: ${props => (props.$isDragOver ? 'rgba(239, 68, 68, 0.05)' : '#F8FAFC')};
  border-radius: 10px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$accentColor};
    background: #F1F5F9;
  }

  .dropzone-icon {
    margin-bottom: 0.5rem;
  }
  .dropzone-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 2px;
  }
  .dropzone-sub {
    font-size: 0.75rem;
    color: #94A3B8;
  }
`;

const ExtractedSummaryBox = styled.div<{ $accentColor: string }>`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 1rem;

  .summary-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 800;
    color: ${props => props.$accentColor};
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .fields-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .field-item {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    padding: 6px 10px;

    .field-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
    }
    .field-value {
      font-size: 0.85rem;
      font-weight: 800;
      color: #0F172A;
      margin-top: 1px;
      word-break: break-word;
    }
  }
`;

const ActionToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #F1F5F9;
`;

const ActionBtn = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger'; $accentColor?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.$accentColor || '#EF4444'};
        color: #FFFFFF;
        border: none;
        box-shadow: 0 2px 6px rgba(239, 68, 68, 0.25);
        &:hover { opacity: 0.9; }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: #FEE2E2;
        color: #DC2626;
        border: 1px solid #FCA5A5;
        &:hover { background: #FECACA; }
      `;
    }
    return `
      background: #FFFFFF;
      color: #475569;
      border: 1px solid #CBD5E1;
      &:hover { background: #F8FAFC; border-color: #94A3B8; }
    `;
  }}
`;

export const HenrySharedDocumentUploader: FC<HenrySharedDocumentUploaderProps> = ({
  docType = 'auto',
  title,
  subtitle,
  acceptedFormats = '.pdf,image/*,.docx',
  isProcessing = false,
  onFileUpload,
  onSampleLoad,
  onSave,
  onDiscard,
  extractedSummary,
  accentColor = '#EF4444',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  return (
    <UploaderContainer $accentColor={accentColor}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFormats}
        style={{ display: 'none' }}
      />

      <HeaderSection>
        <div className="title-group">
          <h4>{title}</h4>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {onSampleLoad && (
          <ActionBtn type="button" onClick={onSampleLoad} $variant="secondary" disabled={isProcessing}>
            <Sparkles size={13} color={accentColor} /> Load Demo Benchmark
          </ActionBtn>
        )}
      </HeaderSection>

      <DropzoneBox
        $isDragOver={isDragOver}
        $accentColor={accentColor}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="dropzone-icon">
          <UploadCloud size={32} color={accentColor} style={{ margin: '0 auto' }} />
        </div>
        <div className="dropzone-text">
          {isProcessing ? '⚡ Analyzing & Extracting Data...' : 'Drop file here or click to browse'}
        </div>
        <div className="dropzone-sub">
          Supports official PDF, scanned PNG/JPG images, and DOCX documents
        </div>
      </DropzoneBox>

      {/* Extracted Details Box */}
      {extractedSummary && extractedSummary.fields.length > 0 && (
        <ExtractedSummaryBox $accentColor={accentColor}>
          <div className="summary-header">
            <CheckCircle2 size={15} /> {extractedSummary.title}
          </div>
          <div className="fields-grid">
            {extractedSummary.fields.map((field, idx) => (
              <div key={idx} className="field-item">
                <div className="field-label">{field.label}</div>
                <div className="field-value" style={{ color: field.isHighlight ? accentColor : '#0F172A' }}>
                  {field.value !== undefined && field.value !== '' ? field.value : '—'}
                </div>
              </div>
            ))}
          </div>
        </ExtractedSummaryBox>
      )}

      {/* Save & Discard Buttons */}
      {(onSave || onDiscard) && (
        <ActionToolbar>
          {onDiscard && (
            <ActionBtn type="button" onClick={onDiscard} $variant="danger">
              <Trash2 size={13} /> Discard
            </ActionBtn>
          )}
          {onSave && (
            <ActionBtn type="button" onClick={onSave} $variant="primary" $accentColor={accentColor}>
              <Save size={13} /> Save to Vault
            </ActionBtn>
          )}
        </ActionToolbar>
      )}
    </UploaderContainer>
  );
};

export default HenrySharedDocumentUploader;
