/**
 * FileUploadDropzone — Wave 63 FE-GOAL-074
 * Drag-and-drop file upload dropzone supporting Title Deeds, Passports, and 4K Property Photos
 * White Caves Real Estate LLC — Forms & Compliance Suite
 */
import React, { FC, useState, useRef } from 'react';
import styled from 'styled-components';

const DropzoneContainer = styled.div<{ $isDragging: boolean }>`
  width: 100%;
  border: 2px dashed ${p => p.$isDragging ? '#EF4444' : 'rgba(100, 116, 139, 0.35)'};
  background: ${p => p.$isDragging ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.6)'};
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: #EF4444;
    background: rgba(239, 68, 68, 0.05);
  }
`;

const Icon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 6px;
`;

const PromptText = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
`;

const SubText = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
  margin-top: 4px;
`;

const FileList = styled.div`
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FileItem = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(7, 11, 20, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #E2E8F0;
`;

export const FileUploadDropzone: FC<{
  acceptTypes?: string;
  maxFiles?: number;
  label?: string;
  onFilesSelected?: (files: File[]) => void;
}> = ({
  acceptTypes = '.pdf,.png,.jpg,.jpeg',
  label = 'Upload Title Deed, Passport or Property Photos',
  onFilesSelected,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setFileNames(files.map(f => f.name));
      onFilesSelected?.(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFileNames(files.map(f => f.name));
      onFilesSelected?.(files);
    }
  };

  return (
    <div style={{ width: '100%' }} data-testid="file-upload-dropzone">
      <DropzoneContainer
        $isDragging={isDragging}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon>📁</Icon>
        <PromptText>{label}</PromptText>
        <SubText>Drag and drop documents here or click to browse ({acceptTypes})</SubText>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptTypes}
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </DropzoneContainer>

      {fileNames.length > 0 && (
        <FileList>
          {fileNames.map((name, idx) => (
            <FileItem key={idx}>
              <span>📄 {name}</span>
              <span style={{ color: '#10B981', fontWeight: 800 }}>✓ Attached</span>
            </FileItem>
          ))}
        </FileList>
      )}
    </div>
  );
};

export default FileUploadDropzone;
